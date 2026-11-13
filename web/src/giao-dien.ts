import { Game } from './game/game';
import { MABU, ZINBU } from './game/nhan-vat-du-lieu';
import { BanLuu, DiemCao, bangDiem, guiDiem, layLuu, luuGame, nhoTen, tenDaNho, xoaLuu } from './may-chu';

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const phut = (g: number) => `${Math.floor(g / 60)}:${String(Math.floor(g % 60)).padStart(2, '0')}`;
const luc = (iso: string) => {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? '' : d.toLocaleString('vi-VN');
};

/**
 * Phần HTML bao quanh game: canvas, nút Đóng / Tạm dừng và các màn phủ (bắt đầu, tạm dừng, kết thúc).
 * Toàn bộ logic game nằm trong Game; ở đây chỉ dựng giao diện và nói chuyện với máy chủ lưu game.
 */
export class GiaoDien {
  onDong: () => void = () => {};

  private game: Game;
  private khung = document.createElement('div');
  private canvas = document.createElement('canvas');
  private nutDung = document.createElement('button');
  private phu = document.createElement('div');
  private oTen = document.createElement('input');
  private veLanCuoi = '';

  // Trạng thái nói chuyện với máy chủ
  private ten = tenDaNho();
  private luu: BanLuu | null = null;
  private mayChuOk: boolean | null = null;
  private thongBao = { text: '', loi: false };
  private bang: DiemCao[] | null = null;
  private dangLuu = false;

  constructor(goc: HTMLElement) {
    this.khung.className = 'khung';
    this.khung.tabIndex = -1;
    this.canvas.setAttribute('aria-label', 'Màn chơi');

    const nutDong = document.createElement('button');
    nutDong.type = 'button';
    nutDong.tabIndex = -1;
    nutDong.className = 'nut-dong';
    nutDong.title = 'Đóng';
    nutDong.textContent = '✕';
    nutDong.addEventListener('click', () => this.onDong());

    this.nutDung.type = 'button';
    this.nutDung.tabIndex = -1;
    this.nutDung.className = 'nut-dung';
    this.nutDung.title = 'Tạm dừng';
    this.nutDung.textContent = '❚❚';
    this.nutDung.addEventListener('click', () => this.game.tamDung());

    this.oTen.type = 'text';
    this.oTen.maxLength = 32;
    this.oTen.value = this.ten;
    this.oTen.addEventListener('input', () => {
      this.ten = this.oTen.value.trim() || 'Người chơi';
      nhoTen(this.ten);
    });
    this.oTen.addEventListener('change', () => void this.taiLuu());
    // Gõ tên thì không để game bắt phím (Tab đổi nhân vật...)
    this.oTen.addEventListener('keydown', (e) => e.stopPropagation());

    this.phu.addEventListener('click', (e) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>('[data-act]');
      if (el && !(el as HTMLButtonElement).disabled) void this.lam(el.dataset['act']!);
    });

    this.khung.append(this.canvas, nutDong, this.nutDung, this.phu);
    goc.append(this.khung);

    this.game = new Game(this.khung, this.canvas);
    this.game.onDong = () => this.onDong();
    this.game.onManPhu = () => this.veManPhu();
    this.game.onKetThuc = (kq) => void this.ketThuc(kq);
  }

  khoiDong(): void {
    this.game.khoiDong();
    void this.taiLuu();
    this.veManPhu();
  }

  // ─── Hành động ───

  private async lam(act: string): Promise<void> {
    const g = this.game;
    switch (act) {
      case 'chuot': g.datCheDo('chuot'); break;
      case 'tayCam': g.datCheDo('tayCam'); break;
      case 'moi':
        this.thongBao = { text: '', loi: false };
        g.batDau();
        break;
      case 'tiep':
        if (this.luu) {
          try {
            g.khoiPhuc(this.luu.trangThai);
            this.thongBao = { text: 'Đã nạp ván đã lưu. Bấm Tiếp tục để chơi.', loi: false };
          } catch (e) {
            this.thongBao = { text: 'Không nạp được ván đã lưu: ' + (e as Error).message, loi: true };
          }
        }
        break;
      case 'tamDung': g.tamDung(); break;
      case 'luuGame': await this.luuVan(); break;
      case 'xoaLuu':
        await xoaLuu(this.ten);
        this.luu = null;
        this.thongBao = { text: 'Đã xoá ván đã lưu.', loi: false };
        break;
      case 'dong': this.onDong(); break;
    }
    this.veManPhu(true);
  }

  private async taiLuu(): Promise<void> {
    const r = await layLuu(this.ten);
    this.luu = r.luu;
    this.mayChuOk = r.mayChuOk;
    const top = await bangDiem(1);
    if (top && top[0] && top[0].diem > this.game.kyLuc) this.game.kyLuc = top[0].diem;
    this.veManPhu(true);
  }

  private async luuVan(): Promise<void> {
    const tt = this.game.chupTrangThai();
    if (!tt || this.dangLuu) return;
    this.dangLuu = true;
    this.veManPhu(true);
    const noi = await luuGame(this.ten, this.game.tongDiem, Math.round(this.game.tGame), tt);
    this.dangLuu = false;
    this.mayChuOk = noi === 'may-chu';
    this.thongBao = noi === 'may-chu'
      ? { text: '✔ Đã lưu vào cơ sở dữ liệu (MySQL).', loi: false }
      : { text: 'Chưa nối được máy chủ nên chỉ lưu tạm trong trình duyệt này. Bật server Java rồi lưu lại.', loi: true };
    this.luu = { nguoiChoi: this.ten, diem: this.game.tongDiem, thoiGian: Math.round(this.game.tGame), luuLuc: new Date().toISOString(), trangThai: tt, nguon: noi };
    this.veManPhu(true);
  }

  private async ketThuc(kq: Parameters<Game['onKetThuc']>[0]): Promise<void> {
    // Ván xong thì bỏ ván lưu (không còn gì để chơi tiếp), ghi điểm và lấy bảng xếp hạng
    this.bang = null;
    await xoaLuu(this.ten);
    this.luu = null;
    await guiDiem({ nguoiChoi: this.ten, ...kq });
    this.bang = await bangDiem(5);
    this.veManPhu(true);
  }

  // ─── Vẽ màn phủ ───

  /** Chỉ dựng lại HTML khi nội dung thật sự đổi (game gọi mỗi khung hình khi không ở màn chơi) */
  private veManPhu(ep = false): void {
    const g = this.game;
    this.khung.classList.toggle('dang-choi', g.man === 'play');
    this.khung.classList.toggle('tren-bang', g.trenBang && g.cheDo === 'chuot');
    this.nutDung.style.display = g.man === 'play' ? '' : 'none';

    const html = g.man === 'start' ? this.htmlBatDau() : g.man === 'pause' ? this.htmlTamDung() : g.man === 'over' ? this.htmlKetThuc() : '';
    if (!ep && html === this.veLanCuoi) return;
    this.veLanCuoi = html;
    this.phu.innerHTML = html;
    const cho = this.phu.querySelector('#cho-ten');
    if (cho) cho.replaceWith(this.oTen);
  }

  private chanDung(i: number): string {
    const nv = this.game.nguoi[i].nv;
    const sp = nv.sp;
    const s = 0.9;
    // Khung cố định (không chạy animation) để HTML màn phủ không bị dựng lại mỗi khung hình, nếu không nút bấm sẽ mất giữa lúc nhấn và nhả
    const k = sp.anim['idle'].f[0];
    const x = (k % sp.cot) * sp.w * s;
    const y = Math.floor(k / sp.cot) * sp.h * s;
    return `<div class="chan-dung" style="width:${sp.w * s}px;background-image:url(${sp.atlas});background-size:${sp.atlasW * s}px ${sp.atlasH * s}px;background-position:-${x}px -${y}px;height:${sp.h * s}px;margin-top:10px"></div>`;
  }

  private htmlBatDau(): string {
    const g = this.game;
    const chuot = g.cheDo === 'chuot';
    const the = (i: number) => {
      const ten = (i === 0 ? MABU : ZINBU).ten;
      const mo = chuot
        ? i === 0
          ? `<h3>1P ${ten} · chuột</h3><p><b>Chuột phải</b>: chạy tới (xa thì bay)<br><b>Chuột trái</b>: ra đòn<br><b>Bấm vào chiêu</b> ở thanh đen bên trái: đổi nhóm đòn<br><b>Tab</b>: chuyển chuột sang nhân vật kia</p>`
          : `<h3>2P ${ten} · chuột</h3><p>Điều khiển giống Mabu, chiêu thức ở thanh đen bên phải.<br>Chỉ có 1 chuột: bấm <b>Tab</b> để chuyển chuột sang Zinbu</p>`
        : i === 0
          ? `<h3>1P ${ten} · tay cầm 1</h3><p><b>Cần trái</b>: chạy · <b>Cần phải</b>: ngắm (không gạt thì tự ngắm)<br><b>✕ / R2</b>: ra đòn (giữ để đánh liên tục) · <b>○ / L2</b>: bay<br><b>L1 / R1</b>: đổi chiêu · <b>Options</b>: tạm dừng</p>`
          : `<h3>2P ${ten} · tay cầm 2</h3><p>Điều khiển giống Mabu.<br>Chỉ có 1 tay cầm: bấm <b>Share</b> (Select) để chuyển tay cầm sang Zinbu</p>`;
      return `<div class="the ${i === 0 ? 'teo' : 'ty'}">${this.chanDung(i)}${mo}</div>`;
    };
    const tay = chuot ? '' : `<p class="phu">${
      g.tayCamTen.length
        ? `🎮 Đã nối ${g.tayCamTen.length} tay cầm: ${esc(g.tayCamTen.join(' · '))}${g.tayCamNut ? ' · vừa bấm ' + esc(String(g.tayCamNut)) : ''}`
        : '🎮 Chưa thấy tay cầm: nối tay cầm rồi bấm một nút bất kỳ trên nó'}</p>`;
    return `<div class="man-phu"><div class="hop">
      <h1>🐉 Dragon Ball</h1>
      <div class="chon-che-do" role="group" aria-label="Chế độ chơi">
        <button type="button" tabindex="-1" class="che-do ${chuot ? 'chon' : ''}" data-act="chuot">🖱️ Chuột + Tab</button>
        <button type="button" tabindex="-1" class="che-do ${chuot ? '' : 'chon'}" data-act="tayCam">🎮 Tay cầm</button>
      </div>
      <div class="o-ten"><label>Tên người chơi:</label><span id="cho-ten"></span></div>
      ${this.htmlLuu()}
      <div class="hai-cot">${the(0)}${the(1)}</div>
      ${tay}
      <div class="nhom-nut">
        ${this.luu ? '<button type="button" tabindex="-1" class="nut-chinh" data-act="tiep">▶ Chơi tiếp ván đã lưu</button>' : ''}
        <button type="button" tabindex="-1" class="${this.luu ? 'nut-phu' : 'nut-chinh'}" data-act="moi">${this.luu ? 'Ván mới' : chuot ? 'Bắt đầu' : 'Bắt đầu (✕ / Options)'}</button>
      </div>
      ${this.htmlThongBao()}
    </div></div>`;
  }

  private htmlLuu(): string {
    if (this.luu) {
      const tam = this.luu.nguon === 'tam';
      return `<div class="luu-tin ${tam ? 'tam' : ''}">💾 Có ván đã lưu của <b>${esc(this.ten)}</b>: ${this.luu.diem} điểm · ${phut(this.luu.thoiGian)} · ${esc(luc(this.luu.luuLuc))}${tam ? ' (lưu tạm trong trình duyệt)' : ''}
        <button type="button" tabindex="-1" class="nut-phu" data-act="xoaLuu" style="margin:0 0 0 8px;padding:2px 12px;font-size:12px">Xoá</button></div>`;
    }
    if (this.mayChuOk === false) return '<p class="phu">⚠ Chưa nối được máy chủ lưu game (Java + MySQL) — vẫn chơi được, nhưng không lưu được vào cơ sở dữ liệu.</p>';
    return '';
  }

  private htmlThongBao(): string {
    return `<p class="thong-bao ${this.thongBao.loi ? 'loi' : ''}">${esc(this.thongBao.text)}</p>`;
  }

  private htmlTamDung(): string {
    const nho = this.mayChuOk === false ? '<p class="phu">Máy chủ chưa chạy: ván sẽ lưu tạm trong trình duyệt.</p>' : '';
    return `<div class="man-phu"><div class="hop nho">
      <h2>Tạm dừng</h2>
      <p class="phu">${esc(this.ten)} · ${this.game.tongDiem} điểm · ${phut(this.game.tGame)}</p>
      <div class="nhom-nut" style="flex-direction:column;align-items:center">
        <button type="button" tabindex="-1" class="nut-chinh" data-act="tamDung">Tiếp tục</button>
        <button type="button" tabindex="-1" class="nut-phu" data-act="luuGame" ${this.dangLuu ? 'disabled' : ''}>${this.dangLuu ? 'Đang lưu…' : '💾 Lưu game'}</button>
      </div>
      ${nho}${this.htmlThongBao()}
    </div></div>`;
  }

  private htmlKetThuc(): string {
    const g = this.game;
    const diemHai = [0, 1].map((i) => {
      const n = g.nguoi[i];
      return `<div class="the ${i === 0 ? 'teo' : 'ty'} ${g.nguoiThang === i ? 'thang' : ''}">
        <h3>${g.nguoiThang === i ? '👑 ' : ''}${esc(n.ten)}</h3><div class="so-lon">${n.diem}</div>
        <p class="phu">Trúng ${n.banTrung} · Trượt ${n.banTruot} · Chính xác ${g.doChinhXac(i)}%</p></div>`;
    }).join('');
    const kl = g.nguoiThang === -1
      ? 'Hòa nhau! Cả hai cùng là chiến binh mạnh nhất 🤝'
      : `👑 ${esc(g.nguoi[g.nguoiThang].ten)} là <b>Chiến binh Dragon Ball</b>!`;
    const top = this.bang && this.bang.length
      ? `<table class="xep-hang"><caption class="phu">Bảng điểm cao nhất</caption>${this.bang.map((d, i) => `<tr><td>${i + 1}.</td><td>${esc(d.nguoiChoi)}</td><td><b>${d.diem}</b></td><td class="phu">${phut(d.thoiGian)}</td></tr>`).join('')}</table>`
      : '';
    return `<div class="man-phu"><div class="hop">
      <h1>Hết máu rồi! 💥</h1>
      <div class="hai-cot">${diemHai}</div>
      <p class="ket-luan">${kl}</p>
      <p>Điểm đội: <b>${g.tongDiem}</b> · Kỷ lục: <b>${g.kyLuc}</b>${g.kyLucMoi ? '<span class="ky-luc-moi">Kỷ lục mới!</span>' : ''}</p>
      ${top}
      <div class="nhom-nut">
        <button type="button" tabindex="-1" class="nut-chinh" data-act="moi">${g.cheDo === 'tayCam' ? 'Chơi lại (✕)' : 'Chơi lại'}</button>
        <button type="button" tabindex="-1" class="nut-phu" data-act="dong">Đóng</button>
      </div>
    </div></div>`;
  }
}
