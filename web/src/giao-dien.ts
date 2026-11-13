import { Game } from './game/game';
import { MABU, ZINBU } from './game/nhan-vat-du-lieu';
import { GA_TUONG, KHUNG_DUNG } from './game/ga-du-lieu';
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
  /** Đang ở màn hướng dẫn (sau khi chọn nhân vật, trước khi vào game) */
  private huongDan: 'mabu' | 'zinbu' | 'ca2' | null = null;
  /** Bước cuối sau màn hướng dẫn: màn mục tiêu (diệt vua gà), bấm Vào chơi mới bắt đầu */
  private buocMucTieu = false;
  /** Màn chọn chế độ (tay cầm): thẻ đã bấm A, chờ bấm B để xác nhận; -1 = chưa bấm */
  private daBamX = -1;

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
    // Chỉ khi chạy dev (vite): để kiểm thử / chụp ảnh demo từ console
    if (import.meta.env.DEV) (window as unknown as { __game: Game }).__game = this.game;
    this.game.onDong = () => this.onDong();
    this.game.onManPhu = () => this.veManPhu();
    // Tay cầm bấm A / Menu ở màn bắt đầu: mở hướng dẫn, bấm lần nữa mới vào chơi
    this.game.onNutBatDau = () => {
      if (this.huongDan) void this.lam(this.buocMucTieu ? 'vao' : 'muc');
      // Màn chọn chế độ: bấm A rồi B mới xác nhận
      else this.daBamX = this.game.menuChon;
    };
    this.game.onNutQuay = () => {
      if (this.huongDan) void this.lam('quay');
      else if (this.daBamX === this.game.menuChon) void this.lam((['mabu', 'zinbu', 'ca2'] as const)[this.game.menuChon]!);
    };
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
      case 'mabu':
      case 'zinbu':
      case 'ca2':
        this.daBamX = -1;
        // Chọn nhân vật xong thì sang màn hướng dẫn, bấm Vào chơi mới bắt đầu
        this.thongBao = { text: '', loi: false };
        this.huongDan = act;
        this.buocMucTieu = false;
        break;
      case 'muc': this.buocMucTieu = true; break;
      case 'vao':
        if (this.huongDan) g.batDau(this.huongDan);
        this.huongDan = null;
        this.buocMucTieu = false;
        break;
      case 'quay':
        if (this.buocMucTieu) this.buocMucTieu = false;
        else this.huongDan = null;
        break;
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

    const html = g.man === 'start' ? (this.huongDan ? (this.buocMucTieu ? this.htmlMucTieu() : this.htmlHuongDan()) : this.htmlBatDau()) : g.man === 'pause' ? this.htmlTamDung() : g.man === 'over' ? this.htmlKetThuc() : '';
    if (!ep && html === this.veLanCuoi) return;
    this.veLanCuoi = html;
    this.phu.innerHTML = html;
    const cho = this.phu.querySelector('#cho-ten');
    if (cho) cho.replaceWith(this.oTen);
  }

  /** Ảnh nhân vật (khung đứng yên đầu tiên của animation idle, cắt sát hình) để hiện trên thẻ chọn */
  private anhNv(i: number, tiLe: number): string {
    const sp = i === 0 ? MABU : ZINBU;
    const [x0, y0, x1, y1] = i === 0 ? [54, 22, 89, 83] : [29, 24, 66, 70];
    const k = sp.anim['idle'].f[0];
    const gx = (k % sp.cot) * sp.w + x0;
    const gy = Math.floor(k / sp.cot) * sp.h + y0;
    // Khung cố định (không chạy animation) để HTML màn phủ không bị dựng lại mỗi khung hình, nếu không nút bấm sẽ mất giữa lúc nhấn và nhả
    return `<span class="anh-nv" style="width:${(x1 - x0) * tiLe}px;height:${(y1 - y0) * tiLe}px;background-image:url(${sp.atlas});background-size:${sp.atlasW * tiLe}px ${sp.atlasH * tiLe}px;background-position:-${gx * tiLe}px -${gy * tiLe}px"></span>`;
  }

  /** Ảnh vua gà (gà tướng, khung đứng đầu tiên, không chạy animation, đội vương miện 👑 như trong game) cho màn mục tiêu */
  private anhVuaGa(tiLe: number): string {
    const sp = GA_TUONG;
    const k = KHUNG_DUNG[0]!;
    const gx = (k % sp.cot) * sp.w;
    const gy = Math.floor(k / sp.cot) * sp.h;
    return `<span class="anh-nv" style="image-rendering:auto;width:${sp.w * tiLe}px;height:${sp.h * tiLe}px;background-image:url(${sp.atlas});background-size:${sp.atlasW * tiLe}px ${sp.atlasH * tiLe}px;background-position:-${gx * tiLe}px -${gy * tiLe}px;position:relative;margin-top:${24 * tiLe}px"><span style="position:absolute;left:64%;top:14%;transform:translate(-50%,-85%);font-size:${27 * tiLe}px;line-height:1">👑</span></span>`;
  }

  private htmlBatDau(): string {
    const the = (act: string, mau: string, anh: string, chu: string) =>
      `<button type="button" tabindex="-1" class="the-chon${this.game.cheDo === 'tayCam' && ['mabu', 'zinbu', 'ca2'][this.game.menuChon] === act ? ' dang-chon' : ''}" data-act="${act}" style="--mau:${mau}"><span class="the-anh">${anh}</span><span class="the-chu">${chu}</span></button>`;
    return `<div class="man-phu man-chon"><div class="hang-the${this.game.cheDo === 'tayCam' ? ' co-chon' : ''}">
      ${the('mabu', '#ec4899', this.anhNv(0, 3.4), '1 người chơi')}
      ${the('zinbu', '#facc15', this.anhNv(1, 3.4), '1 người chơi')}
      ${the('ca2', '#38bdf8', this.anhNv(0, 2.4) + this.anhNv(1, 2.4), '2 người chơi')}
    </div>${this.game.cheDo === 'tayCam' ? `<p class="phu">Người chơi 1: ◀ ▶ chọn · ${this.daBamX === this.game.menuChon ? 'bấm B để vào' : 'bấm A rồi B để xác nhận'}</p>` : ''}${this.luu ? '<button type="button" tabindex="-1" class="nut-phu" data-act="tiep" style="margin-top:20px">▶ Chơi tiếp ván đã lưu</button>' : ''}${this.htmlThongBao()}</div>`;
  }

  /** Màn hướng dẫn sau khi chọn nhân vật: chọn chuột / tay cầm, xem ảnh hướng dẫn rồi vào chơi */
  private htmlHuongDan(): string {
    const tay = this.game.cheDo === 'tayCam';
    const noiDung = tay
      ? '<img class="anh-hd" src="assets/game/huong-dan-tay-cam.svg" alt="Hướng dẫn chơi bằng tay cầm">'
      : `<div class="hd-chuot">
          <p><b>Chuột phải</b>: chạy tới điểm bấm (xa thì bay)</p>
          <p><b>Chuột trái</b>: ra đòn tại điểm chuột (đấm / đá / chiêu đặc biệt tuỳ chiêu đang chọn)</p>
          <p><b>Bấm nút chiêu</b> trên thanh đen hai bên hoặc phím <b>1 · 2 · 3 · 4</b>: đổi chiêu</p>
          <p><b>Tab</b>: chuyển chuột sang nhân vật kia</p></div>`;
    return `<div class="man-phu man-chon man-hd">
      ${noiDung}
      <div class="nhom-nut">
        <button type="button" tabindex="-1" class="nut-phu" data-act="quay">◀ Chọn lại</button>
        <button type="button" tabindex="-1" class="nut-chinh" data-act="muc">${tay ? 'Tiếp (A)' : 'Tiếp'}</button>
      </div></div>`;
  }

  /** Màn mục tiêu, sau màn hướng dẫn: nói rõ điều kiện thắng rồi bấm Vào chơi */
  private htmlMucTieu(): string {
    const tay = this.game.cheDo === 'tayCam';
    return `<div class="man-phu man-chon man-hd">
      ${this.anhVuaGa(2.6)}
      <p class="muc-tieu">Bạn phải tiêu diệt vua gà để thắng game</p>
      <div class="nhom-nut">
        <button type="button" tabindex="-1" class="nut-phu" data-act="quay">◀ Quay lại</button>
        <button type="button" tabindex="-1" class="nut-chinh" data-act="vao">${tay ? 'Vào chơi (A)' : 'Vào chơi'}</button>
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
    const diemHai = [0, 1].filter((i) => !g.nguoi[i].vang).map((i) => {
      const n = g.nguoi[i];
      return `<div class="the ${i === 0 ? 'teo' : 'ty'} ${g.nguoiThang === i ? 'thang' : ''}">
        <h3>${g.nguoiThang === i ? '👑 ' : ''}${esc(n.ten)}</h3><div class="so-lon">${n.diem}</div>
        <p class="phu">Trúng ${n.banTrung} · Trượt ${n.banTruot} · Chính xác ${g.doChinhXac(i)}%</p></div>`;
    }).join('');
    const mvp = g.soNguoi < 2
      ? ''
      : g.nguoiThang === -1
      ? 'Hai nhân vật bằng điểm nhau 🤝'
      : `👑 ${esc(g.nguoi[g.nguoiThang].ten)} ghi nhiều điểm nhất`;
    const kl = g.nguoiThangTran
      ? `🏆 <b>${g.soNguoi < 2 ? esc(g.nguoi.find((n) => !n.vang)!.ten) : 'Mabu và Zinbu'} thắng!</b> Vua gà, tướng gà và toàn bộ gà con đã bị hạ.${mvp ? '<br>' + mvp : ''}`
      : `🐔 <b>Quái vật thắng!</b> ${g.soNguoi < 2 ? 'Nhân vật đã gục.' : 'Cả hai nhân vật đã gục.'}${mvp ? '<br>' + mvp : ''}`;
    const top = this.bang && this.bang.length
      ? `<table class="xep-hang"><caption class="phu">Bảng điểm cao nhất</caption>${this.bang.map((d, i) => `<tr><td>${i + 1}.</td><td>${esc(d.nguoiChoi)}</td><td><b>${d.diem}</b></td><td class="phu">${phut(d.thoiGian)}</td></tr>`).join('')}</table>`
      : '';
    return `<div class="man-phu"><div class="hop">
      <h1>${g.nguoiThangTran ? 'Chiến thắng! 🏆' : 'Quái vật thắng! 💥'}</h1>
      <div class="hai-cot">${diemHai}</div>
      <p class="ket-luan">${kl}</p>
      <p>Điểm đội: <b>${g.tongDiem}</b> · Kỷ lục: <b>${g.kyLuc}</b>${g.kyLucMoi ? '<span class="ky-luc-moi">Kỷ lục mới!</span>' : ''}</p>
      ${top}
      <div class="nhom-nut">
        <button type="button" tabindex="-1" class="nut-chinh" data-act="moi">${g.cheDo === 'tayCam' ? (g.choiLaiChoB ? 'Chơi lại: bấm B' : 'Chơi lại: bấm A rồi B') : 'Chơi lại'}</button>
        <button type="button" tabindex="-1" class="nut-phu" data-act="dong">Đóng</button>
      </div>
    </div></div>`;
  }
}
