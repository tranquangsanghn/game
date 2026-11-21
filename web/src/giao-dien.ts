import { DOI_HINH, Game, THE_CHON, type CheNguoi } from './game/game';
import { NHAN_VAT } from './game/nhan-vat-du-lieu';
import { BanLuu, bangDiem, guiDiem, layLuu, luuGame, nhoTen, tenDaNho, xoaLuu } from './luu-tru';

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const phut = (g: number) => `${Math.floor(g / 60)}:${String(Math.floor(g % 60)).padStart(2, '0')}`;

/**
 * Phần HTML bao quanh game: canvas, nút Đóng / Tạm dừng và các màn phủ (bắt đầu, tạm dừng, kết thúc).
 * Toàn bộ logic game nằm trong Game; ở đây chỉ dựng giao diện và lưu ván / điểm trong trình duyệt (localStorage).
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
  /** Đang ở màn mục tiêu (sau khi chọn nhân vật, trước khi vào game): bấm Vào chơi mới bắt đầu ván */
  private cheDaChon: CheNguoi | null = null;
  /** Màn chọn chế độ (tay cầm): thẻ đã bấm X, chờ bấm B để xác nhận; -1 = chưa bấm */
  private daBamX = -1;

  // Trạng thái nói chuyện với máy chủ
  private ten = tenDaNho();
  private luu: BanLuu | null = null;
  private thongBao = { text: '', loi: false };
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
    // Tay cầm bấm A / Menu ở màn mục tiêu: vào chơi
    this.game.onNutBatDau = () => {
      if (this.cheDaChon) void this.lam('vao');
    };
    // Màn chọn chế độ: bấm X rồi B mới xác nhận
    this.game.onNutX = () => {
      if (!this.cheDaChon) this.daBamX = this.game.menuChon;
    };
    this.game.onNutQuay = () => {
      if (this.cheDaChon) void this.lam('quay');
      else if (this.daBamX === this.game.menuChon) void this.lam(THE_CHON[this.game.menuChon]!);
    };
    this.game.onNutTamDung = () => void this.lam(this.game.menuTamDung === 1 ? 'luuGame' : 'tamDung');
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
      case 'vegeta':
      case 'ca2':
      case 'mabuVegeta':
      case 'vegetaZinbu':
        this.daBamX = -1;
        // Chọn nhân vật xong thì sang màn mục tiêu, bấm Vào chơi mới bắt đầu
        this.thongBao = { text: '', loi: false };
        this.cheDaChon = act;
        break;
      case 'vao':
        if (this.cheDaChon) g.batDau(this.cheDaChon);
        this.cheDaChon = null;
        break;
      case 'quay': this.cheDaChon = null; break;
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
        xoaLuu(this.ten);
        this.luu = null;
        this.thongBao = { text: 'Đã xoá ván đã lưu.', loi: false };
        break;
      case 'dong': this.onDong(); break;
    }
    this.veManPhu(true);
  }

  private async taiLuu(): Promise<void> {
    this.luu = layLuu(this.ten);
    const top = bangDiem(1);
    if (top && top[0] && top[0].diem > this.game.kyLuc) this.game.kyLuc = top[0].diem;
    this.veManPhu(true);
  }

  private async luuVan(): Promise<void> {
    const tt = this.game.chupTrangThai();
    if (!tt || this.dangLuu) return;
    this.dangLuu = true;
    this.veManPhu(true);
    const ban = luuGame(this.ten, this.game.tongDiem, Math.round(this.game.tGame), tt);
    this.dangLuu = false;
    this.thongBao = ban
      ? { text: '✔ Đã lưu ván trong trình duyệt này.', loi: false }
      : { text: 'Không lưu được: trình duyệt chặn hoặc hết bộ nhớ lưu trữ.', loi: true };
    if (ban) this.luu = ban;
    this.veManPhu(true);
  }

  private async ketThuc(kq: Parameters<Game['onKetThuc']>[0]): Promise<void> {
    // Ván xong thì bỏ ván lưu (không còn gì để chơi tiếp), ghi điểm và lấy bảng xếp hạng
    xoaLuu(this.ten);
    this.luu = null;
    guiDiem({ nguoiChoi: this.ten, ...kq });
    this.veManPhu(true);
  }

  // ─── Vẽ màn phủ ───

  /** Chỉ dựng lại HTML khi nội dung thật sự đổi (game gọi mỗi khung hình khi không ở màn chơi) */
  private veManPhu(ep = false): void {
    const g = this.game;
    this.khung.classList.toggle('dang-choi', g.man === 'play');
    this.nutDung.style.display = g.man === 'play' ? '' : 'none';

    const html = g.man === 'start' ? (this.cheDaChon ? this.htmlMucTieu() : this.htmlBatDau()) : g.man === 'pause' ? this.htmlTamDung() : g.man === 'over' ? this.htmlKetThuc() : '';
    if (!ep && html === this.veLanCuoi) return;
    this.veLanCuoi = html;
    this.phu.innerHTML = html;
    const cho = this.phu.querySelector('#cho-ten');
    if (cho) cho.replaceWith(this.oTen);
  }

  /** Ảnh nhân vật (khung đứng yên đầu tiên của animation idle, cắt sát hình) để hiện trên thẻ chọn */
  private anhNv(i: number, tiLe: number): string {
    const sp = NHAN_VAT[i]!;
    const [x0, y0, x1, y1] = i === 0 ? [54, 22, 89, 83] : i === 1 ? [29, 24, 66, 70] : [32, 26, 82, 91];
    tiLe /= sp.to ?? 1; // sprite logic to gấp `to` lần thì thu lại cho thẻ bằng cỡ các nhân vật khác
    const k = sp.anim['idle'].f[0];
    const gx = (k % sp.cot) * sp.w + x0;
    const gy = Math.floor(k / sp.cot) * sp.h + y0;
    // Khung cố định (không chạy animation) để HTML màn phủ không bị dựng lại mỗi khung hình, nếu không nút bấm sẽ mất giữa lúc nhấn và nhả
    // Vegeta: atlas điểm ảnh to, thu nhỏ trên thẻ nên vẽ mịn thay vì vỡ hạt
    return `<span class="anh-nv" style="${i === 2 ? 'image-rendering:auto;' : ''}width:${(x1 - x0) * tiLe}px;height:${(y1 - y0) * tiLe}px;background-image:url(${sp.atlas});background-size:${sp.atlasW * tiLe}px ${sp.atlasH * tiLe}px;background-position:-${gx * tiLe}px -${gy * tiLe}px"></span>`;
  }

  /** Hàng 7 viên ngọc rồng (1 → 7 sao, từ ngoc_rong.png) cho màn mục tiêu */
  private anhNgocRong(): string {
    const sp = this.game.SP_NGOC;
    const tl = 0.3;
    return `<div class="hang-ngoc">${Array.from({ length: 7 }, (_, i) => `<span class="anh-nv" style="image-rendering:auto;width:${sp.w * tl}px;height:${sp.h * tl}px;background-image:url(${sp.atlas});background-size:${sp.atlasW * tl}px ${sp.atlasH * tl}px;background-position:-${i * sp.w * tl}px 0"></span>`).join('')}</div>`;
  }

  private htmlBatDau(): string {
    const the = (act: string, mau: string, anh: string, chu: string) =>
      `<button type="button" tabindex="-1" class="the-chon${THE_CHON[this.game.menuChon] === act ? ' dang-chon' : ''}" data-act="${act}" style="--mau:${mau}"><span class="the-anh">${anh}</span><span class="the-chu">${chu}</span></button>`;
    const mauThe = ['#ec4899', '#facc15', '#3b82f6'];
    const theChon = (c: CheNguoi) => {
      const [a, b] = DOI_HINH[c];
      const ds = [a, b].filter((k): k is number => k !== null);
      const ten = ds.map((k) => NHAN_VAT[k]!.ten).join(' + ');
      return the(c, ds.length > 1 ? '#38bdf8' : mauThe[ds[0]!]!, ds.map((k) => this.anhNv(k, ds.length > 1 ? 2 : 2.8)).join(''), ds.length > 1 ? `2 người · ${ten}` : `1 người · ${ten}`);
    };
    return `<div class="man-phu man-chon"><div class="hang-the luoi-the co-chon">
      ${THE_CHON.map(theChon).join('')}
    </div><p class="phu">Người chơi 1: ◀ ▶ chọn · ${this.daBamX === this.game.menuChon ? 'bấm B để vào' : 'bấm X rồi B để xác nhận'}</p><p class="phu" style="opacity:.6">${this.game.tayCamTen.length ? `Tay cầm: ${this.game.tayCamTen.join(' · ')}` : 'Chưa thấy tay cầm (bấm một nút bất kỳ)'}${this.game.tayCamNut ? ` · vừa bấm ${this.game.tayCamNut}` : ''}</p>${this.luu ? '<button type="button" tabindex="-1" class="nut-phu" data-act="tiep" style="margin-top:20px">▶ Chơi tiếp ván đã lưu</button>' : ''}${this.htmlThongBao()}</div>`;
  }

  /** Màn mục tiêu, sau màn chọn nhân vật: nói rõ điều kiện thắng rồi bấm Vào chơi */
  private htmlMucTieu(): string {
    return `<div class="man-phu man-chon man-hd">
      ${this.anhNgocRong()}
      <p class="muc-tieu">Bạn phải tìm đủ 5 viên ngọc rồng để chiến thắng game</p>
      <div class="nhom-nut">
        <button type="button" tabindex="-1" class="nut-phu" data-act="quay">◀ Quay lại</button>
        <button type="button" tabindex="-1" class="nut-chinh" data-act="vao">Vào chơi (A)</button>
      </div></div>`;
  }

  private htmlThongBao(): string {
    return `<p class="thong-bao ${this.thongBao.loi ? 'loi' : ''}">${esc(this.thongBao.text)}</p>`;
  }

  private htmlTamDung(): string {
    const chon = this.game.menuTamDung;
    return `<div class="man-phu"><div class="hop nho">
      <h2>Tạm dừng</h2>
      <p class="phu">${esc(this.ten)} · ${this.game.tongDiem} điểm · ${phut(this.game.tGame)}</p>
      <div class="nhom-nut" style="flex-direction:column;align-items:center">
        <button type="button" tabindex="-1" class="nut-chinh${chon === 0 ? ' nut-dang-chon' : ''}" data-act="tamDung">Tiếp tục</button>
        <button type="button" tabindex="-1" class="nut-phu${chon === 1 ? ' nut-dang-chon' : ''}" data-act="luuGame" ${this.dangLuu ? 'disabled' : ''}>${this.dangLuu ? 'Đang lưu…' : '💾 Lưu game'}</button>
      </div>
      <p class="phu">▲ ▼ chọn · A bấm · Menu / B tiếp tục chơi</p>
      ${this.htmlThongBao()}
    </div></div>`;
  }

  private htmlKetThuc(): string {
    const g = this.game;
    const diemHai = [0, 1].filter((i) => !g.nguoi[i].vang).map((i) => {
      const n = g.nguoi[i];
      return `<div class="the ${i === 0 ? 'teo' : 'ty'} ${g.nguoiThang === i ? 'thang' : ''}" style="display:flex;justify-content:center;align-items:center;padding:16px">${this.anhNv(n.ki, 3.2)}</div>`;
    }).join('');
    return `<div class="man-phu"><div class="hop">
      <h1>${g.nguoiThangTran ? 'Chiến thắng! 🏆' : 'Quái vật thắng! 💥'}</h1>
      <div class="hai-cot">${diemHai}</div>
      <div class="nhom-nut">
        <button type="button" tabindex="-1" class="nut-chinh" data-act="moi">${g.choiLaiChoB ? 'Chơi lại: bấm B' : 'Chơi lại: bấm X rồi B'}</button>
        <button type="button" tabindex="-1" class="nut-phu" data-act="dong">Thoát game (nhấn Y)</button>
      </div>
    </div></div>`;
  }
}
