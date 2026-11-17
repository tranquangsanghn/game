import type { ChuongTiec, Tiec } from './tiec';
import { HN } from './do-hieu-nang';
import type { Game, Ga, TrangTri, Cuu, CauTron, MbHinh } from './game';
import type { KhungSprite } from './sprite';
import { CELL_HP, CELL_SO_DAO, CELL_TEN, capCuaDao, cellK, CELL_CHET_T, CELL_KHUNG, CELL_NGOI_NANG, SO_CAP, SP_CELL, type Cell } from './cell';
import { BANH_FPS, BANH_KHUNG, SP_BANH, SP_CELL_TIEC, CHUONG_LOAI, TIEC_KHUNG, TIEC_CHUONG_T } from './tiec';
import type { NhanVatSprite } from './nhan-vat-sprite';
import { MABU } from './nhan-vat-du-lieu';
import { SP_GINYU, GY_TEN, GY_TO, GY_THANH_CAO, GY_CHET_T, GY_KHUNG, GY_LO_LUNG } from './ginyu';
import { DAO, doSau, duongBo, NUI, TG } from './ban-do';

// Bộ vẽ Canvas 2D của game: chỉ vẽ, không đổi trạng thái game. Dữ liệu lấy từ component (các mảng *View / xep đã lọc theo camera, xem CLAUDE.md).
// Toạ độ vẽ giữ nguyên như bản SVG cũ: viewBox (-SIDE, -BAR, W + 2·SIDE, H + BAR), căn giữa, giữ tỉ lệ.
// Thêm loại vật / màn / nhân vật mới: thêm hàm vẽ ở đây và gọi trong ve(); sprite cứ truyền KhungSprite vào sprite(), ảnh tự nạp và nhớ lại.

const TAU = Math.PI * 2;
const FONT = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

// Path2D tạo lười để không lỗi khi chạy ở máy chủ (không có Path2D)
interface DuongVe {
  tim: Path2D; timSang: Path2D; huong: Path2D; long: Path2D; ngam: Path2D; muiTen: Path2D;
  nutDa: Path2D; nutDaVach: Path2D; nutChuong: Path2D; nutChuongKhoi: Path2D;
  chuot: Path2D; tuMo: Path2D; tuLao: Path2D; tuBay: Path2D; tuMoVach: Path2D; tuDo: Path2D;
}
let duongCache: DuongVe | null = null;
const duong = (): DuongVe =>
  (duongCache ??= {
    tim: new Path2D('M0,16 C-30,-6 -22,-26 -10,-26 C-4,-26 0,-20 0,-16 C0,-20 4,-26 10,-26 C22,-26 30,-6 0,16 Z'),
    timSang: new Path2D('M-12,-17 q4,-5 9,-3'),
    huong: new Path2D('M-12,-11 L4,0 L-12,11'),
    long: new Path2D('M0,-9 Q6,0 0,9 Q-6,0 0,-9 Z'),
    ngam: new Path2D('M-62,0 h24 M38,0 h24 M0,-62 v24 M0,38 v24'),
    muiTen: new Path2D('M-22,-18 L26,0 L-22,18 L-12,0 Z'),
    // Biểu tượng nút chiêu của Mabu / Zinbu
    nutDa: new Path2D('M-7,-11 h8 v9 l9,4 a2,2 0 0 1 1,2.5 v3.5 h-18 z'),
    nutDaVach: new Path2D('M-7,6 h18'),
    nutChuong: new Path2D('M-1,-6 L-12,0 L-1,6 Z'),
    nutChuongKhoi: new Path2D('M-12,-8 h7 M-14,0 h5 M-12,8 h7'),
    chuot: new Path2D('M-28,0 h14 M14,0 h14 M0,-28 v14 M0,14 v14'),
    // Biểu tượng nút chiêu của gà mẹ
    tuMo: new Path2D('M-9,-6 L9,0 L-9,6 Z'),
    tuMoVach: new Path2D('M-9,8 h18'),
    tuLao: new Path2D('M-12,-8 L-2,0 L-12,8 M-2,-8 L8,0 L-2,8'),
    tuBay: new Path2D('M-10,4 Q-6,-10 8,-8 Q2,-2 6,6 Q-2,2 -10,4 Z'),
    tuDo: new Path2D('M0,-10 Q9,-2 6,5 Q4,10 0,10 Q-6,10 -6,3 Q-6,-2 -2,-4 Q-2,-8 0,-10 Z'),
  });

const tronCD = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  const rr = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
};
const duongTron = (ctx: CanvasRenderingContext2D, r: number, cx = 0, cy = 0) => {
  ctx.beginPath();
  ctx.arc(cx, cy, Math.max(0, r), 0, TAU);
};
const duongElip = (ctx: CanvasRenderingContext2D, rx: number, ry: number, cx = 0, cy = 0) => {
  ctx.beginPath();
  ctx.ellipse(cx, cy, Math.max(0, rx), Math.max(0, ry), 0, 0, TAU);
};
const dongHe = (a: number) => Math.max(0, Math.min(1, a));
const rad = (deg: number) => (deg * Math.PI) / 180;

/** Sprite trang trí cắt từ gói "EPIC RPG World Pack – Grass Land" (map_co.png). Neo ở giữa đáy; k = tỉ lệ phóng */
const MAP_CO = 'assets/game/map_co.png';
const TRANG_TRI_SPRITE = [
  { sx: 268, sy: 343, w: 98, h: 175, k: 1.7 }, // cây
  { sx: 200, sy: 497, w: 44, h: 29, k: 1.8 }, // bụi có hoa
  { sx: 209, sy: 562, w: 66, h: 36, k: 1.8 }, // bụi
  { sx: 612, sy: 478, w: 110, h: 66, k: 1.5 }, // đá
];
/** 6 ô cỏ chính (gốc 32px) trong tileset; phóng gấp TL lần */
const O_CO = [[448, 32], [480, 32], [512, 32], [448, 64], [480, 64], [512, 64]];
const TL = 2;
/** Tường gạch bao quanh map (tuong_gach.png, 160×256): mặt tường có viền sáng trên, gạch không viền, viền gạch sáng; phóng gấp TL_TUONG */
const TUONG_GACH = 'assets/game/tuong_gach.png';
const TG_MAT = { sx: 16, sy: 138, w: 48, h: 38 };
const TG_GACH = { sx: 16, sy: 141, w: 48, h: 35 };
const TG_VIEN = { sx: 16, sy: 10, w: 48, h: 6 };
const TL_TUONG = 3;
/** Đảo sa mạc (gói "Free Desert Top-Down Tileset" của LudicArts, dựng bằng tools/tao-atlas-sa-mac.py): một atlas trang trí
 *  neo giữa đáy, thứ tự khớp loai (0 = cây đổ được); k = số đơn vị thế giới mỗi điểm ảnh atlas */
const SA = 'assets/game/sa_mac/';
const SA_TRANG_TRI = SA + 'trang_tri.png';
const TRANG_TRI_SA = [
  { sx: 0, sy: 0, w: 318, h: 258, k: 1.25 }, // cây khô
  { sx: 320, sy: 0, w: 103, h: 90, k: 1.8 }, // tảng đá to
  { sx: 425, sy: 0, w: 61, h: 90, k: 1.8 }, // xương rồng nhỏ
  { sx: 0, sy: 260, w: 83, h: 74, k: 1.8 }, // xương rồng tròn hoa đỏ
  { sx: 85, sy: 260, w: 100, h: 91, k: 1.6 }, // cỏ vàng
  { sx: 187, sy: 260, w: 50, h: 61, k: 1.8 }, // sọ bò
  { sx: 239, sy: 260, w: 83, h: 74, k: 1.8 }, // xương rồng tròn hoa cam
  { sx: 324, sy: 260, w: 81, h: 72, k: 1.8 }, // đá
  { sx: 407, sy: 260, w: 92, h: 140, k: 1.8 }, // xương rồng to
  { sx: 0, sy: 402, w: 100, h: 91, k: 1.6 }, // cỏ xanh
  { sx: 102, sy: 402, w: 75, h: 68, k: 1.8 }, // sỏi
  { sx: 179, sy: 402, w: 44, h: 37, k: 1.8 }, // cành khô
];
/** Đảo là khối nổi giữa vực đen, cùng địa hình với núi đá (mặt đá dat.png, vách vach.png của núi): vách cao SA_VACH_CAO lộ ra ở bờ phía nam,
 *  dưới nữa tới SA_VACH_SAU sẫm màu chìm vào vực; viền sáng SA_VIEN quanh mép */
const SA_VACH_CAO = 120;
const SA_VACH_SAU = 190;
const SA_VIEN = 22;
const SA_O_DOAN = 1600;
/** Ô ảnh nền đảo dựng sẵn (veDaoO): cạnh O_NEN_PX điểm ảnh, giữ tối đa O_NEN_MAX ô, mỗi khung dựng tối đa O_NEN_TAO ô mới */
const O_NEN_PX = 512;
const O_NEN_MAX = 48;
const O_NEN_TAO = 2;
/** Núi đá (cắt từ ảnh người dùng gửi bằng tools/tao-atlas-nui-da.py): mặt đá lặp, vách lặp, atlas tảng đá (neo giữa đáy, loai 1..8).
 *  Cả khối là một elip (NUI trong ban-do.ts) vẽ bằng vài lệnh ellipse: vách dời xuống NUI_VACH_CAO (mesa cao hơn đảo), dưới nữa sẫm tới NUI_VACH_SAU */
/** Thanh máu Cell đỏ: cao hơn chân bấy nhiêu đơn vị khung sprite (× độ to), ngay trên đầu */
const CELL_THANH_CAO = 56;
const NUI_A = 'assets/game/nui/';
const NUI_DAT = NUI_A + 'dat.png';
const NUI_VACH = NUI_A + 'vach.png';
const NUI_DA = NUI_A + 'da.png';
const NUI_O_DAT = 900;
const NUI_O_VACH = 520;
const NUI_VACH_CAO = 300;
const NUI_VACH_SAU = 430;
/** Tảng đá vỡ liền lại sau chừng này giây (khớp DA_VO_LAI trong game.ts): giây cuối mảnh mờ đi, tảng đá hiện lại */
const DA_VO_LAI_VE = 15;
const DA_NUI = [
  { sx: 0, sy: 0, w: 120, h: 109, k: 3.4 },
  { sx: 122, sy: 0, w: 123, h: 120, k: 3.4 },
  { sx: 247, sy: 0, w: 68, h: 57, k: 3 },
  { sx: 317, sy: 0, w: 50, h: 46, k: 3 },
  { sx: 369, sy: 0, w: 46, h: 45, k: 3 },
  { sx: 417, sy: 0, w: 48, h: 38, k: 3 },
  { sx: 467, sy: 0, w: 45, h: 42, k: 3 },
  { sx: 0, sy: 122, w: 44, h: 25, k: 3 },
];
/** Bản đồ nhỏ khi ngồi máy bay: rộng BDN_W (đơn vị khung nhìn), cách mép BDN_LE */
const BDN_W = 220;
const BDN_LE = 14;
const CO_LAP = 16; // pattern 16×16 ô ngẫu nhiên rồi lặp: một fillRect, không lộ đường nối

export class VeCanvas {
  private mauCo: CanvasPattern | null = null;
  /** Đảo sa mạc: đường bờ (Path2D dựng một lần từ duongBo()) và các mẫu lặp cát / vách đá / biển */
  private bo: Path2D | null = null;
  /** Ảnh bản đồ nhỏ dựng một lần */
  private anhBdn: HTMLCanvasElement | null = null;
  /** Đường bờ cắt thành từng đoạn theo ô SA_O_DOAN (kèm khung bao): stroke chỉ ghép các đoạn trong khung nhìn (stroke cả đường bờ mỗi khung rất tốn) */
  private doanBo: { p: Path2D; x0: number; y0: number; x1: number; y1: number }[] = [];
  private mauNui: { dat: CanvasPattern; vach: CanvasPattern } | null = null;
  /** Ô ảnh nền đảo theo khoá i·100003 + j (cv null = ô trống), bậc tỉ lệ hiện tại (2·log2) và số khung để bỏ ô cũ */
  private oNen = new Map<number, { cv: HTMLCanvasElement | null; dung: number }>();
  private oNenBac: number | null = null;
  private oNenKhung = 0;
  /** Bộ ô của bậc tỉ lệ trước, dán tạm khi bộ ô mới chưa đủ */
  private oNenCu: { o: Map<number, { cv: HTMLCanvasElement | null; dung: number }>; T: number } | null = null;
  /** Canvas ô nền rảnh để dùng lại */
  private oNenKho: HTMLCanvasElement[] = [];
  private mauTuong: { mat: CanvasPattern; gach: CanvasPattern; vienNgang: CanvasPattern; vienDoc: CanvasPattern } | null = null;
  private anh = new Map<string, HTMLImageElement>();
  // Atlas đã nhuộm sẵn theo bộ lọc màu (nháy sáng, đen, vàng, đỏ…): nhuộm cả atlas MỘT lần rồi dùng lại.
  // Không dùng ctx.filter lúc vẽ từng sprite vì rất chậm (mỗi sprite vài ms).
  private nhuom = new Map<string, HTMLCanvasElement>();
  /** Bản thu nhỏ sẵn (mip) của atlas / atlas nhuộm: khoá `url|boLoc|L`, L = 2, 4, 8 lần nhỏ hơn */
  private mip = new Map<string, HTMLCanvasElement>();
  /** Elip (nền + viền) vẽ sẵn đúng cỡ điểm ảnh trên màn hình: khoá `rx|ry|dày|nền|viền` (điểm ảnh thật, làm tròn 4px) */
  private elip = new Map<string, HTMLCanvasElement>();

  /** Nạp trước các atlas để khung hình đầu tiên đã có ảnh */
  napTruoc(...atlas: string[]): void {
    atlas.forEach((a) => this.lay(a));
    // Ảnh của đảo sa mạc (nhỏ) nạp luôn để chọn map nào cũng có ngay
    [SA_TRANG_TRI, NUI_DAT, NUI_VACH, NUI_DA].forEach((a) => this.lay(a));
  }

  /** Nhuộm sẵn atlas theo các bộ lọc ngay khi ảnh nạp xong, để lần đầu cần dùng không bị khựng */
  nhuomTruoc(atlas: string, boLoc: string[]): void {
    this.lay(atlas);
    const img = this.anh.get(atlas)!;
    const lam = () => boLoc.forEach((f) => this.nguon(atlas, f));
    if (img.complete) lam();
    else img.addEventListener('load', lam, { once: true });
  }

  /** Ảnh nguồn để vẽ: atlas gốc, hoặc bản đã nhuộm theo boLoc (chuỗi CSS filter) */
  private nguon(url: string, boLoc: string | null): CanvasImageSource | null {
    const img = this.lay(url);
    if (!img || !boLoc) return img;
    const khoa = `${url}|${boLoc}`;
    let cv = this.nhuom.get(khoa);
    if (!cv) {
      cv = document.createElement('canvas');
      cv.width = img.naturalWidth;
      cv.height = img.naturalHeight;
      const x = cv.getContext('2d')!;
      if (boLoc.startsWith('tint:')) {
        x.drawImage(img, 0, 0);
        this.nhuomMau(x, cv.width, cv.height, boLoc.slice(5));
      } else {
        x.filter = boLoc;
        x.drawImage(img, 0, 0);
      }
      this.nhuom.set(khoa, cv);
    }
    return cv;
  }

  /** Nhuộm cả thân sang màu hex, giữ độ sáng tối của nét vẽ; chỉ giữ nguyên phần trắng (đầu) và phần vàng (mỏ, chân) */
  private nhuomMau(x: CanvasRenderingContext2D, w: number, h: number, hex: string): void {
    const m = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
    const d = x.getImageData(0, 0, w, h);
    const p = d.data;
    for (let i = 0; i < p.length; i += 4) {
      if (p[i + 3] === 0) continue;
      const r = p[i], g = p[i + 1], b = p[i + 2];
      const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
      const s = mx ? (mx - mn) / mx : 0;
      if (s < 0.28 && mx > 158) continue;
      if (r > 150 && g > 110 && b < 110 && s > 0.45) continue;
      const k = 0.35 + 0.95 * Math.pow((0.3 * r + 0.59 * g + 0.11 * b) / 255, 0.8);
      p[i] = Math.min(255, m[0] * k);
      p[i + 1] = Math.min(255, m[1] * k);
      p[i + 2] = Math.min(255, m[2] * k);
    }
    x.putImageData(d, 0, 0);
  }

  private lay(url: string): HTMLImageElement | null {
    let i = this.anh.get(url);
    if (!i) {
      i = new Image();
      i.src = url;
      this.anh.set(url, i);
    }
    return i.complete && i.naturalWidth > 0 ? i : null;
  }

  // ─── Khung hình ───

  /** Vẽ 1 khung hình. Kích thước (px) lấy từ chính canvas; dpr là hệ số điểm ảnh. Phép chiếu khung nhìn → màn hình lấy từ c.phepChieu() (dùng chung với đọc chuột). */
  ve(ctx: CanvasRenderingContext2D, c: Game, dpr: number, ctxNen: CanvasRenderingContext2D | null = null, dprNen = 1): void {
    const { W, H, BAR, SIDE } = c;
    const { s, ox, oy } = c.phepChieu();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.setTransform(dpr * s, 0, 0, dpr * s, dpr * ox, dpr * oy);
    ctx.globalAlpha = 1;
    ctx.filter = 'none';
    ctx.lineJoin = 'miter';
    ctx.lineCap = 'butt';
    HN.moc('ve.xoa');
    if (ctxNen) this.veNenRieng(ctxNen, c, dprNen);
    HN.moc('ve.nenDao');
    // Canvas chính trong suốt trong map (nền cát / biển ở canvas riêng bên dưới); chỉ tô đen thanh trên và hai thanh bên
    ctx.fillStyle = '#000';
    if (ctxNen) {
      ctx.fillRect(-SIDE, -BAR, W + 2 * SIDE, BAR);
      ctx.fillRect(-SIDE, 0, SIDE, H);
      ctx.fillRect(W, 0, SIDE, H);
    } else ctx.fillRect(-SIDE, -BAR, W + 2 * SIDE, H + BAR);

    // Một camera chung; chỉ vẽ trong map (thanh đen phía trên chứa chiêu gà mẹ)
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, W, H);
    ctx.clip();
    const cam = c.gocCamera();
    ctx.translate(cam.x, cam.y);
    ctx.scale(cam.k, cam.k);
    this.veTheGioi(ctx, c);
    ctx.restore();
    HN.moc('ve.theGioi');
    if (c.banDoNho) this.veBanDoNho(ctx, c, c.banDoNho);
    HN.moc('ve.banDoNho');

    if (c.doHoangHon > 0) {
      ctx.globalAlpha = c.doHoangHon * 0.6;
      ctx.fillStyle = c.mauHoangHon;
      ctx.fillRect(0, 0, W, H);
      ctx.globalAlpha = 1;
    }

    for (const p of [0, 1]) if (!c.nguoi[p].vang) this.veThanhBen(ctx, c, p);
    // Bố cục đen ngoài map là layout chung, luôn hiện; chỉ nội dung đổi theo nhân vật
    this.veThanhTuong(ctx, c);
    this.veNgocTrenBang(ctx, c);
    if (c.man === 'play' || c.man === 'pause') this.veHud(ctx, c);
    HN.moc('ve.hud');
  }

  /** Cỡ các bộ nhớ đệm ảnh (cho bộ đo hiệu năng) */
  thongKe(): Record<string, number> {
    return { dmAnh: this.anh.size, dmNhuom: this.nhuom.size, dmMip: this.mip.size, dmElip: this.elip.size, dmONen: this.oNen.size, dmONenCu: this.oNenCu?.o.size ?? 0, dmONenKho: this.oNenKho.length };
  }

  // ─── Thế giới (trong nhóm camera) ───

  /** Nền cỏ: pattern dựng từ ô cỏ của gói map (hạt giống cố định); chưa nạp xong ảnh thì tạm màu cỏ */
  private veNen(ctx: CanvasRenderingContext2D, c: Game): void {
    if (!this.mauCo) {
      const img = this.lay(MAP_CO);
      if (img) {
        const cv = document.createElement('canvas');
        cv.width = cv.height = CO_LAP * 32 * TL;
        const x = cv.getContext('2d')!;
        x.imageSmoothingEnabled = false;
        let h = 7;
        for (let i = 0; i < CO_LAP; i++) {
          for (let j = 0; j < CO_LAP; j++) {
            h = (Math.imul(h, 1103515245) + 12345) >>> 0;
            const [sx, sy] = O_CO[(h >>> 16) % O_CO.length];
            x.drawImage(img, sx, sy, 32, 32, i * 32 * TL, j * 32 * TL, 32 * TL, 32 * TL);
          }
        }
        this.mauCo = ctx.createPattern(cv, 'repeat');
      }
    }
    ctx.fillStyle = this.mauCo ?? '#52c13a';
    ctx.imageSmoothingEnabled = false;
    ctx.fillRect(0, 0, c.MAP, c.MAP);
    ctx.imageSmoothingEnabled = true;
  }

  /** Mẫu lặp của tường gạch, dựng một lần từ tuong_gach.png (phóng TL_TUONG, giữ nét pixel) */
  private taoMauTuong(ctx: CanvasRenderingContext2D): void {
    const img = this.lay(TUONG_GACH);
    if (!img) return;
    const cat = (o: { sx: number; sy: number; w: number; h: number }, xoay = false) => {
      const cv = document.createElement('canvas');
      const w = o.w * TL_TUONG, h = o.h * TL_TUONG;
      cv.width = xoay ? h : w;
      cv.height = xoay ? w : h;
      const x = cv.getContext('2d')!;
      x.imageSmoothingEnabled = false;
      // Ảnh gạch có điểm trong suốt ở kẽ: lót màu vữa tối để không lộ cỏ
      x.fillStyle = '#2a0b08';
      x.fillRect(0, 0, cv.width, cv.height);
      if (xoay) { x.translate(h, 0); x.rotate(Math.PI / 2); }
      x.drawImage(img, o.sx, o.sy, o.w, o.h, 0, 0, w, h);
      return ctx.createPattern(cv, 'repeat')!;
    };
    this.mauTuong = { mat: cat(TG_MAT), gach: cat(TG_GACH), vienNgang: cat(TG_VIEN), vienDoc: cat(TG_VIEN, true) };
  }

  /** Tường gạch bao quanh map (dải dày c.TUONG trong 0..MAP): mặt trên bằng gạch, tường trên có mặt đứng hướng vào map, mép trong có viền sáng */
  private veTuong(ctx: CanvasRenderingContext2D, c: Game): void {
    if (!this.mauTuong) this.taoMauTuong(ctx);
    const m = this.mauTuong;
    const T = c.TUONG, M = c.MAP;
    const MAT_H = TG_MAT.h * TL_TUONG;
    const VIEN = TG_VIEN.h * TL_TUONG;
    // Mẫu lặp bám gốc toạ độ hiện tại: dời gốc tới góc từng dải để gạch khớp mép
    const to = (p: CanvasPattern | string, x: number, y: number, w: number, h: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = p;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();
    };
    ctx.imageSmoothingEnabled = false;
    if (!m) {
      ctx.fillStyle = '#8a2e22';
      ctx.fillRect(0, 0, M, T); ctx.fillRect(0, M - T, M, T); ctx.fillRect(0, 0, T, M); ctx.fillRect(M - T, 0, T, M);
      ctx.imageSmoothingEnabled = true;
      return;
    }
    // Mặt trên của tường (4 dải)
    to(m.gach, 0, 0, M, T - MAT_H);
    to(m.gach, 0, 0, T, M);
    to(m.gach, M - T, 0, T, M);
    to(m.gach, 0, M - T, M, T);
    // Bóng tối nhẹ cho mặt trên để tách với mặt đứng
    ctx.fillStyle = 'rgba(30,0,0,0.28)';
    ctx.fillRect(0, 0, M, T - MAT_H); ctx.fillRect(0, T - MAT_H, T, M - T + MAT_H); ctx.fillRect(M - T, T - MAT_H, T, M - T + MAT_H); ctx.fillRect(T, M - T, M - 2 * T, T);
    // Mặt đứng của tường trên (nhìn từ trong map)
    to(m.mat, T, T - MAT_H, M - 2 * T, MAT_H);
    // Viền sáng ở mép trong của tường trái / phải / dưới
    to(m.vienDoc, T - VIEN, T - MAT_H, VIEN, M - 2 * T + MAT_H + VIEN);
    to(m.vienDoc, M - T, T - MAT_H, VIEN, M - 2 * T + MAT_H + VIEN);
    to(m.vienNgang, T - VIEN, M - T, M - 2 * T + 2 * VIEN, VIEN);
    // Bóng đổ của tường trên xuống nền cỏ
    const g = ctx.createLinearGradient(0, T, 0, T + 50);
    g.addColorStop(0, 'rgba(0,0,0,0.35)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(T, T, M - 2 * T, 50);
    ctx.imageSmoothingEnabled = true;
  }

  /** Mảnh đá vỡ (đã translate tới chân tảng đá): vài viên đá nhỏ (khung nhỏ của DA_NUI) văng ra theo vòng cung trong 0,5s rồi nằm yên.
   *  Vị trí mỗi mảnh cố định theo toạ độ tảng đá (không lưu gì thêm) */
  private veManhDa(ctx: CanvasRenderingContext2D, t: TrangTri, tv: number, img: HTMLImageElement, alpha: number): void {
    const to = t.loai <= 2;
    const n = to ? 7 : 4;
    const xa = to ? 230 : 120;
    const e = dongHe(tv / 0.5);
    const bay = 1 - (1 - e) * (1 - e);
    let h = (Math.floor(t.x) * 73856093) ^ (Math.floor(t.y) * 19349663);
    const r = () => {
      h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909);
      return ((h ^= h >>> 16) >>> 0) / 4294967296;
    };
    ctx.globalAlpha = alpha;
    for (let i = 0; i < n; i++) {
      const goc = ((i + r() * 0.6) / n) * Math.PI * 2;
      const kc = xa * (0.45 + r() * 0.6);
      const m = DA_NUI[3 + Math.floor(r() * 5)]!;
      const k = m.k * (to ? 0.7 + r() * 0.4 : 0.45 + r() * 0.3);
      const w = m.w * k, hh = m.h * k;
      // Văng ra: nằm trên mặt đất (elip dẹt theo phối cảnh), nảy lên theo vòng cung
      const x = Math.cos(goc) * kc * bay, y = Math.sin(goc) * kc * 0.55 * bay - Math.sin(Math.PI * e) * (to ? 140 : 80);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((1 - e) * (r() - 0.5) * 6);
      if (r() < 0.5) ctx.scale(-1, 1);
      ctx.drawImage(img, m.sx, m.sy, m.w, m.h, -w / 2, -hh, w, hh);
      ctx.restore();
    }
  }

  private veTrangTri(ctx: CanvasRenderingContext2D, t: TrangTri, now: number, sa: boolean): void {
    if (t.nui) {
      // Tảng đá núi: ảnh điểm ảnh. Trúng chưởng (doLuc) thì vỡ thành đá nhỏ văng ra rồi nằm đó; giây cuối đá nhỏ mờ đi, tảng đá hiện lại
      const d = DA_NUI[t.loai - 1], img = this.lay(NUI_DA);
      if (!d || !img) return;
      const a0 = ctx.globalAlpha;
      const tv = t.doLuc === undefined ? -1 : now - t.doLuc;
      const lien = tv < 0 ? 1 : dongHe(tv - (DA_VO_LAI_VE - 1));
      ctx.save();
      ctx.translate(t.x, t.y);
      ctx.imageSmoothingEnabled = false;
      if (tv >= 0 && lien < 1) this.veManhDa(ctx, t, tv, img, a0 * (1 - lien));
      if (lien > 0) {
        const w = d.w * d.k, h = d.h * d.k;
        ctx.globalAlpha = a0 * lien;
        if (t.lat) ctx.scale(-1, 1);
        ctx.drawImage(img, d.sx, d.sy, d.w, d.h, -w / 2, -h, w, h);
      }
      ctx.restore();
      ctx.globalAlpha = a0;
      return;
    }
    const spSa = sa ? TRANG_TRI_SA[t.loai] : undefined;
    const sp = sa ? undefined : TRANG_TRI_SPRITE[t.loai];
    const img = this.lay(spSa ? SA_TRANG_TRI : MAP_CO);
    if (!img || !(spSa ?? sp)) return;
    const to = t.to ? 1.8 : 1;
    const w = (spSa ?? sp)!.w * (spSa ?? sp)!.k * to;
    const h = (spSa ?? sp)!.h * (spSa ?? sp)!.k * to;
    ctx.save();
    ctx.translate(t.x, t.y);
    // Cây bị đánh thì đổ quanh gốc (nhanh dần rồi nằm luôn)
    if (t.doLuc !== undefined) {
      const k = dongHe((now - t.doLuc) / 0.45);
      ctx.rotate((t.huongDo ?? 1) * (Math.PI / 2) * k * k);
    }
    if (t.lat) ctx.scale(-1, 1);
    if (spSa) {
      // Ảnh vẽ tay nên phóng mượt
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(img, spSa.sx, spSa.sy, spSa.w, spSa.h, -w / 2, -h, w, h);
    } else {
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, sp!.sx, sp!.sy, sp!.w, sp!.h, -w / 2, -h, w, h);
    }
    ctx.restore();
  }

  /** Mẫu lặp mặt đá / vách của núi đá (dựng một lần khi ảnh đã nạp), dùng chung cho đảo và núi */
  private taoMauNui(ctx: CanvasRenderingContext2D): void {
    const dat = this.lay(NUI_DAT), vach = this.lay(NUI_VACH);
    if (!dat || !vach) return;
    const mau = (src: HTMLImageElement, o: number) => {
      const p = ctx.createPattern(src, 'repeat')!;
      p.setTransform(new DOMMatrix().scale(o / src.naturalWidth));
      return p;
    };
    this.mauNui = { dat: mau(dat, NUI_O_DAT), vach: mau(vach, NUI_O_VACH) };
  }

  /** Nền đảo sa mạc, vẽ thẳng mỗi khung từ đường bờ dựng sẵn (vài lệnh fill / stroke, không giữ ảnh mảnh nào):
   *  vực đen → vách đá (đường bờ dời xuống) → mặt cát → viền đá. Vùng không thấy (thayDao / thayVuon) chỉ còn vực đen. */
  private veNenSa(ctx: CanvasRenderingContext2D, c: Game): void {
    if (!this.bo) {
      const p = new Path2D();
      for (const v of duongBo()) {
        p.moveTo(v[0]!, v[1]!);
        for (let i = 2; i < v.length; i += 2) p.lineTo(v[i]!, v[i + 1]!);
        p.closePath();
        // Cắt thành đoạn: các điểm liên tiếp cùng ô, nối thêm một điểm mỗi đầu để các đoạn gối lên nhau
        const n = v.length / 2;
        const o = (i: number) => {
          const k = ((i % n) + n) % n;
          return Math.floor(v[2 * k]! / SA_O_DOAN) * 100003 + Math.floor(v[2 * k + 1]! / SA_O_DOAN);
        };
        let dau = 0;
        while (dau < n && o(dau) === o(dau - 1)) dau++;
        if (dau === n) dau = 0;
        for (let i = 0; i < n; ) {
          let j = i + 1;
          while (j < n && o(dau + j) === o(dau + i)) j++;
          const d = new Path2D();
          let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
          for (let q = i - 1; q <= j; q++) {
            const k = (((dau + q) % n) + n) % n;
            const x = v[2 * k]!, y = v[2 * k + 1]!;
            if (q === i - 1) d.moveTo(x, y);
            else d.lineTo(x, y);
            x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
          }
          this.doanBo.push({ p: d, x0, y0, x1, y1 });
          i = j;
        }
      }
      this.bo = p;
    }
    if (!this.mauNui) this.taoMauNui(ctx);
    const m = this.mauNui;
    const cam = c.gocCamera();
    const x0 = -cam.x / cam.k - 40, x1 = (c.W - cam.x) / cam.k + 40;
    const y0 = -cam.y / cam.k - 40, y1 = (c.H - cam.y) / cam.k + 40;
    const M = c.MAP;
    ctx.imageSmoothingEnabled = true;
    // Đảo + đường + núi: dán các ô ảnh dựng sẵn (thiếu ô / chưa nạp ảnh thì vẽ vector như cũ cho khung này)
    if (c.thayDao && !this.veDaoO(ctx, x0, y0, x1, y1, c.zoomGoc / cam.k)) this.veLopDao(ctx, x0, y0, x1, y1);
    // Vườn gà cũng là khối nổi: vách rơi xuống vực ở bờ nam (không chồng lên đảo vì cách xa CACH_VUON)
    if (c.thayVuon) {
      ctx.save();
      ctx.translate(0, SA_VACH_SAU);
      ctx.fillStyle = '#1e0f16';
      ctx.fillRect(0, 0, M, M);
      ctx.translate(0, SA_VACH_CAO - SA_VACH_SAU);
      ctx.fillStyle = m?.vach ?? '#4a2a30';
      ctx.fillRect(0, 0, M, M);
      ctx.restore();
    }
  }

  /** Lớp đảo bằng vector (vực trong suốt): vách đá rơi xuống vực (phần dưới sẫm dần, chỉ lộ ở bờ nam) → mặt đá → viền đá → núi.
   *  Dùng để dựng từng ô ảnh nền (veDaoO), hoặc vẽ thẳng khi ô chưa sẵn */
  private veLopDao(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number): void {
    const m = this.mauNui;
    const bo = this.bo!;
    ctx.imageSmoothingEnabled = true;
    const vach = (dy: number, mau: CanvasPattern | string) => {
      ctx.save();
      ctx.translate(0, dy);
      ctx.fillStyle = mau;
      ctx.fill(bo, 'evenodd');
      ctx.restore();
    };
    vach(SA_VACH_SAU, '#1e0f16');
    vach(SA_VACH_CAO, m?.vach ?? '#4a2a30');
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = m?.dat ?? '#e0903a';
    ctx.fill(bo, 'evenodd');
    ctx.imageSmoothingEnabled = true;
    // Viền đá quanh mép: chỉ stroke các đoạn bờ chạm khung (lấn thêm nửa nét)
    const LE = 60;
    const vien = new Path2D();
    for (const d of this.doanBo) {
      if (d.x1 > x0 - LE && d.x0 < x1 + LE && d.y1 > y0 - LE && d.y0 < y1 + LE) vien.addPath(d.p);
    }
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = SA_VIEN;
    ctx.strokeStyle = '#f2a54a';
    ctx.stroke(vien);
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#2a1410';
    ctx.stroke(vien);
    ctx.lineJoin = 'miter';
    ctx.lineCap = 'butt';
    // Núi đá nối liền với đảo 0 (cùng vòng bờ cát): vẽ đè lên mặt cát / viền của vòng bờ đó
    this.veNui(ctx, x0, y0, x1, y1);
  }

  /** Dán lớp đảo từ các ô ảnh dựng sẵn (O_NEN_PX điểm ảnh mỗi cạnh, cỡ ô theo bậc √2 của tỉ lệ phóng hiện tại):
   *  mỗi khung chỉ vài drawImage thay vì fill / stroke đường bờ cả thế giới (GPU phải dựng lại path mỗi khung, máy yếu tụt FPS dần).
   *  Mỗi khung dựng tối đa O_NEN_TAO ô mới; còn thiếu thì trả false để vẽ vector cho khung đó. */
  private veDaoO(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number, heZoom: number): boolean {
    if (!this.mauNui) return false;
    const mt = ctx.getTransform();
    const A = mt.a;
    if (!(A > 0) || mt.b !== 0 || mt.c !== 0) return false;
    // Bậc tỉ lệ có trễ: chỉ đổi khi lệch hẳn sang bậc khác, tránh dựng lại liên tục khi zoom dao động quanh ranh giới.
    // Đổi bậc: bộ ô cũ giữ lại làm nền tạm (phóng lên dán) cho tới khi bộ ô mới dựng đủ, không vẽ vector cả thế giới
    // Bậc theo zoom gốc lúc đi bộ (heZoom = zoomGoc / zoom hiện tại): máy bay zoom ra chỉ thu nhỏ ô đã dựng, không dựng lại;
    // chỉ đổi bậc khi độ phân giải canvas (dpr) đổi hẳn
    const bac = Math.log2(A * heZoom) * 2;
    if (this.oNenBac === null || Math.abs(bac - this.oNenBac) > 0.75) {
      if (this.oNenBac !== null && this.oNen.size) {
        if (this.oNenCu) this.traO(this.oNenCu.o);
        this.oNenCu = { o: this.oNen, T: O_NEN_PX / 2 ** (this.oNenBac / 2) };
        this.oNen = new Map();
      }
      this.oNenBac = Math.round(bac);
    }
    const q = 2 ** (this.oNenBac / 2);
    const T = O_NEN_PX / q;
    const i0 = Math.floor(x0 / T), i1 = Math.floor(x1 / T), j0 = Math.floor(y0 / T), j1 = Math.floor(y1 / T);
    const khung = ++this.oNenKhung;
    let tao = 0, du = true;
    for (let j = j0; j <= j1; j++) {
      for (let i = i0; i <= i1; i++) {
        const khoa = i * 100003 + j;
        let o = this.oNen.get(khoa);
        if (!o) {
          if (tao >= O_NEN_TAO) { du = false; continue; }
          o = { cv: this.taoONen(i, j, T, q), dung: 0 };
          this.oNen.set(khoa, o);
          if (o.cv) tao++;
        }
        o.dung = khung;
      }
    }
    // Bỏ bớt ô lâu không dùng (canvas trả về kho để dùng lại, không vứt cho GC)
    if (this.oNen.size > O_NEN_MAX) {
      const cu = [...this.oNen.entries()].filter(([, o]) => o.dung !== khung).sort((a, b) => a[1].dung - b[1].dung);
      for (let k = 0; k < cu.length && this.oNen.size > O_NEN_MAX; k++) {
        const cv = cu[k]![1].cv;
        if (cv) this.oNenKho.push(cv);
        this.oNen.delete(cu[k]![0]);
      }
    }
    if (du && this.oNenCu) {
      this.traO(this.oNenCu.o);
      this.oNenCu = null;
    }
    if (!du && !this.oNenCu) return false;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.imageSmoothingEnabled = true;
    if (!du && this.oNenCu) this.danO(ctx, this.oNenCu.o, this.oNenCu.T, A, mt.e, mt.f, x0, y0, x1, y1);
    this.danO(ctx, this.oNen, T, A, mt.e, mt.f, x0, y0, x1, y1);
    ctx.restore();
    return true;
  }

  /** Dán các ô của một bộ ô (cạnh T đơn vị thế giới) phủ khung nhìn, toạ độ điểm ảnh làm tròn để các ô khít nhau */
  private danO(
    ctx: CanvasRenderingContext2D,
    bo: Map<number, { cv: HTMLCanvasElement | null; dung: number }>,
    T: number,
    A: number,
    ex: number,
    ey: number,
    x0: number,
    y0: number,
    x1: number,
    y1: number,
  ): void {
    const i0 = Math.floor(x0 / T), i1 = Math.floor(x1 / T), j0 = Math.floor(y0 / T), j1 = Math.floor(y1 / T);
    for (let j = j0; j <= j1; j++) {
      const py0 = Math.round(A * j * T + ey), py1 = Math.round(A * (j + 1) * T + ey);
      for (let i = i0; i <= i1; i++) {
        const cv = bo.get(i * 100003 + j)?.cv;
        if (!cv) continue;
        const px0 = Math.round(A * i * T + ex), px1 = Math.round(A * (i + 1) * T + ex);
        ctx.drawImage(cv, px0, py0, px1 - px0, py1 - py0);
      }
    }
  }

  /** Trả mọi canvas của một bộ ô về kho (giữ tối đa O_NEN_MAX canvas rảnh) */
  private traO(bo: Map<number, { cv: HTMLCanvasElement | null; dung: number }>): void {
    for (const o of bo.values()) if (o.cv && this.oNenKho.length < O_NEN_MAX) this.oNenKho.push(o.cv);
    bo.clear();
  }

  /** Dựng một ô nền đảo (ô (i, j), cạnh T đơn vị thế giới, q điểm ảnh / đơn vị); ô không có đất / vách nào thì null (không giữ ảnh).
   *  Canvas lấy từ kho dùng lại (tạo canvas mới rồi vứt liên tục làm bộ nhớ GPU dồn lại, FPS tụt dần theo thời gian) */
  private taoONen(i: number, j: number, T: number, q: number): HTMLCanvasElement | null {
    const x0 = i * T, y0 = j * T, x1 = x0 + T, y1 = y0 + T;
    const LE = SA_VIEN;
    let co = false;
    for (const d of this.doanBo) {
      if (d.x1 > x0 - LE && d.x0 < x1 + LE && d.y1 > y0 - SA_VACH_SAU - LE && d.y0 < y1 + LE) { co = true; break; }
    }
    if (!co && NUI.x + NUI.rx > x0 && NUI.x - NUI.rx < x1 && NUI.y + NUI.ry + NUI_VACH_SAU > y0 && NUI.y - NUI.ry < y1) co = true;
    // Không chạm đoạn bờ nào: cả ô cùng là đất hoặc cùng là vực
    if (!co && doSau(x0 + T / 2, y0 + T / 2) <= 0) return null;
    let cv = this.oNenKho.pop();
    if (!cv) {
      cv = document.createElement('canvas');
      cv.width = O_NEN_PX;
      cv.height = O_NEN_PX;
    }
    const x = cv.getContext('2d');
    if (!x) return null;
    x.setTransform(1, 0, 0, 1, 0, 0);
    x.clearRect(0, 0, O_NEN_PX, O_NEN_PX);
    x.setTransform(q, 0, 0, q, -x0 * q, -y0 * q);
    this.veLopDao(x, x0, y0, x1, y1);
    return cv;
  }

  /** Núi đá: khối mesa hình elip, chỉ vẽ khi elip (kể cả vách) chạm khung nhìn; 4 lệnh ellipse (vách sẫm, vách, mặt đá, viền) */
  private veNui(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number): void {
    if (NUI.x + NUI.rx < x0 || NUI.x - NUI.rx > x1 || NUI.y + NUI.ry + NUI_VACH_SAU < y0 || NUI.y - NUI.ry > y1) return;
    if (!this.mauNui) this.taoMauNui(ctx);
    const m = this.mauNui;
    const elip = (dy: number) => {
      ctx.beginPath();
      ctx.ellipse(NUI.x, NUI.y + dy, NUI.rx, NUI.ry, 0, 0, Math.PI * 2);
    };
    ctx.imageSmoothingEnabled = false;
    elip(NUI_VACH_SAU);
    ctx.fillStyle = '#1e0f16';
    ctx.fill();
    elip(NUI_VACH_CAO);
    ctx.fillStyle = m?.vach ?? '#4a2a30';
    ctx.fill();
    elip(0);
    ctx.fillStyle = m?.dat ?? '#e0903a';
    ctx.fill();
    // Mép trên sáng + nét viền tối như ảnh mesa
    ctx.lineWidth = 22;
    ctx.strokeStyle = '#f2a54a';
    ctx.stroke();
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#2a1410';
    ctx.stroke();
    ctx.imageSmoothingEnabled = true;
  }

  /** Bản đồ nhỏ góc trên phải (chỉ khi ngồi máy bay): cả thế giới (đảo + vườn gà) dựng sẵn một lần, máy bay là mũi tên vàng theo hướng bay */
  private veBanDoNho(ctx: CanvasRenderingContext2D, c: Game, b: { x: number; y: number; huong: number }): void {
    const RX = TG.x1 - TG.x0, RY = TG.y1 - TG.y0;
    const W = BDN_W, H = Math.round((BDN_W * RY) / RX);
    if (!this.anhBdn) {
      const TL = 2;
      const cv = document.createElement('canvas');
      cv.width = W * TL;
      cv.height = H * TL;
      const x = cv.getContext('2d')!;
      x.scale((W * TL) / RX, (H * TL) / RY);
      x.translate(-TG.x0, -TG.y0);
      const p = new Path2D();
      for (const v of duongBo()) {
        p.moveTo(v[0]!, v[1]!);
        for (let i = 2; i < v.length; i += 2) p.lineTo(v[i]!, v[i + 1]!);
        p.closePath();
      }
      // Đảo, đường và núi cùng địa hình đá: tô chung một màu đá, viền sẫm
      x.fillStyle = '#c8682a';
      x.fill(p, 'evenodd');
      x.lineWidth = 160;
      x.strokeStyle = '#7a3a1a';
      x.stroke(p);
      x.fillStyle = '#4caf50';
      x.fillRect(0, 0, c.MAP, c.MAP);
      x.lineWidth = 260;
      x.strokeStyle = '#8a2e22';
      x.strokeRect(130, 130, c.MAP - 260, c.MAP - 260);
      this.anhBdn = cv;
    }
    const x0 = c.W - W - BDN_LE, y0 = BDN_LE;
    ctx.save();
    ctx.globalAlpha = 0.92;
    ctx.fillStyle = '#000';
    ctx.strokeStyle = 'rgba(255,255,255,0.75)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x0 - 6, y0 - 6, W + 12, H + 12, 10);
    ctx.fill();
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(this.anhBdn, x0, y0, W, H);
    // Số Cell ban đầu của từng đảo (cố định, không đổi khi Cell chết)
    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    DAO.forEach((d, i) => {
      const tx = x0 + ((d.x - TG.x0) / RX) * W, ty = y0 + ((d.y - TG.y0) / RY) * H;
      const so = String(CELL_SO_DAO[i] ?? 0);
      ctx.strokeStyle = '#000';
      ctx.strokeText(so, tx, ty);
      ctx.fillStyle = '#fff';
      ctx.fillText(so, tx, ty);
    });
    ctx.lineJoin = 'miter';
    // Máy bay: vòng nhấp nháy + mũi máy bay theo hướng bay
    const px = x0 + ((b.x - TG.x0) / RX) * W, py = y0 + ((b.y - TG.y0) / RY) * H;
    const t = performance.now() / 1000;
    ctx.globalAlpha = 0.5 + 0.4 * Math.sin(t * 6);
    duongTron(ctx, 15, px, py);
    ctx.strokeStyle = '#ffe14d';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.translate(px, py);
    ctx.rotate(b.huong);
    ctx.scale(1.5, 1.5);
    ctx.beginPath();
    ctx.moveTo(9, 0); ctx.lineTo(2, -2); ctx.lineTo(-1, -9); ctx.lineTo(-4, -9); ctx.lineTo(-2, -2); ctx.lineTo(-7, -2);
    ctx.lineTo(-9, -5); ctx.lineTo(-10, -5); ctx.lineTo(-9, 0); ctx.lineTo(-10, 5); ctx.lineTo(-9, 5); ctx.lineTo(-7, 2);
    ctx.lineTo(-2, 2); ctx.lineTo(-4, 9); ctx.lineTo(-1, 9); ctx.lineTo(2, 2); ctx.closePath();
    ctx.fillStyle = '#ffd23f';
    ctx.strokeStyle = '#3a2400';
    ctx.lineWidth = 1.5;
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  /** Nền cát / biển vẽ ở canvas riêng nằm dưới canvas chính, độ phân giải thấp (dprNen × điểm ảnh CSS) rồi trình duyệt phóng lên: phủ kín màn hình bằng ảnh phóng rất tốn ở độ phân giải cao, nền vốn mịn nên không mất nét */
  private veNenRieng(ctx: CanvasRenderingContext2D, c: Game, dpr: number): void {
    const { s, ox, oy } = c.phepChieu();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // Khung nhìn nằm trọn trong vườn gà (nền cỏ che hết) thì khỏi vẽ biển / cát bên dưới.
    // Camera trong vườn bị kẹp đúng mép 0..MAP nên chỉ cho sai số làm tròn nhỏ (lề cũ 40 làm đứng sát tường vẫn vẽ thừa cả lớp đảo bên dưới cỏ)
    const cam = c.gocCamera();
    const e = 0.5;
    const trongVuon =
      -cam.x / cam.k >= -e && -cam.y / cam.k >= -e && (c.W - cam.x) / cam.k <= c.MAP + e && (c.H - cam.y) / cam.k <= c.MAP + e;
    if (c.banDoVan !== 'sa' || trongVuon) return;
    // Vực đen là màu nền CSS của canvas (canvas.canvas-nen), không tô.
    // clip() phải nằm trong save / restore: clip không tự mất khi setTransform / clearRect, Chrome giữ cả danh sách clip
    // đã đặt và phát lại mỗi khung ⇒ thiếu restore thì danh sách dài thêm mỗi khung, FPS trên đảo tụt dần theo thời gian
    ctx.save();
    ctx.setTransform(dpr * s, 0, 0, dpr * s, dpr * ox, dpr * oy);
    ctx.beginPath();
    ctx.rect(0, 0, c.W, c.H);
    ctx.clip();
    ctx.translate(cam.x, cam.y);
    ctx.scale(cam.k, cam.k);
    this.veNenSa(ctx, c);
    ctx.restore();
  }

  private veTheGioi(ctx: CanvasRenderingContext2D, c: Game): void {
    // Đảo sa mạc: biển + vòng đảo cát, vườn gà (map cỏ có tường) nằm giữa biển
    // Khung nhìn nằm trọn trong vườn gà (nền cỏ che hết) thì khỏi vẽ biển / cát bên dưới
    // Đứng trên đảo (không lên máy bay) thì không thấy vườn gà bên kia vực
    if (c.thayVuon) {
      this.veNen(ctx, c);
      this.veTuong(ctx, c);
    }

    HN.moc('ve.nenVuon');
    for (const v of c.vetView) {
      const k = v.t / (v.loai === 'chay' ? 0.7 : 0.45);
      ctx.save();
      ctx.translate(v.x, v.y);
      ctx.globalAlpha = dongHe(1 - k);
      if (v.vg) {
        // Vụ nổ chưởng Vegeta: 5 khung nổ lớn dần (3 → 7) trong vegeta_chuong.png (cầu sáng → vòng → vòng mờ)
        ctx.globalAlpha = k < 0.7 ? 1 : dongHe((1 - k) / 0.3);
        const s = 1.9 * (v.co ?? 1);
        ctx.scale(s, s);
        this.sprite(ctx, c.SP_VG_CHUONG, 3 + Math.min(4, Math.floor(k * 6)), false, false);
      } else if (v.loai === 'chay') {
        this.veChay(ctx, v, k);
      } else if (v.loai === 'no') {
        duongTron(ctx, 30 + v.t * 200);
        ctx.fillStyle = '#ff9fd0';
        ctx.globalAlpha = dongHe(1 - k) * 0.35 * dongHe(1 - k);
        ctx.fill();
        ctx.globalAlpha = dongHe(1 - k);
        ctx.strokeStyle = '#ffd6ec';
        ctx.lineWidth = 8;
        ctx.stroke();
      } else {
        duongTron(ctx, 8 + v.t * 50);
        ctx.strokeStyle = '#fff8dc';
        ctx.lineWidth = 4;
        ctx.stroke();
      }
      ctx.restore();
    }

    // Mũi tên chỉ hướng về gà tướng
    const P = duong();
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#fff';
    for (const m of c.huongView) {
      ctx.save();
      ctx.translate(m.x, m.y);
      ctx.rotate(rad(m.goc));
      ctx.globalAlpha = dongHe(m.a);
      ctx.stroke(P.huong);
      ctx.restore();
    }
    ctx.lineCap = 'butt';
    ctx.lineJoin = 'miter';

    // Trứng
    for (const e of c.trungView) {
      ctx.save();
      ctx.translate(e.x, e.y);
      // Trứng đỏ đặc biệt to gấp TRUNG_DB_TO (5) lần, có vầng sáng đỏ và đốm trắng
      const kt = e.db ? c.TRUNG_DB_TO : 1;
      ctx.scale(kt, kt);
      if (e.db) {
        duongTron(ctx, 40, 0, -20);
        ctx.fillStyle = `rgba(255,59,48,${0.15 + 0.1 * Math.abs(Math.sin(e.t * 4))})`;
        ctx.fill();
      }
      duongElip(ctx, 22, 7);
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.fill();
      ctx.translate(0, -20);
      ctx.rotate(rad(c.rungTrung(e)));
      duongElip(ctx, 17, 22);
      ctx.fillStyle = e.db ? '#e5322d' : e.loai === 'hen' ? '#fff6d5' : e.loai === 'rooster' ? '#e9a79d' : '#9a9aa8';
      ctx.fill();
      ctx.strokeStyle = e.db ? '#ffd2cc' : 'rgba(0,0,0,0.25)';
      ctx.lineWidth = e.db ? 1.4 : 2;
      ctx.stroke();
      if (e.db) {
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        for (const [x, y, r] of [[-6, -8, 2.6], [5, -2, 2], [-3, 8, 2.2], [7, 9, 1.6]]) {
          duongTron(ctx, r, x, y);
          ctx.fill();
        }
      }
      ctx.restore();
    }

    // Vệt đỏ báo hiệu Lao / Bay
    ctx.lineCap = 'round';
    for (const v of c.vachView) {
      ctx.lineWidth = v.w ?? 90;
      ctx.strokeStyle = `rgba(255,59,48,${dongHe(v.a)})`;
      ctx.beginPath();
      ctx.moveTo(v.x1, v.y1);
      ctx.lineTo(v.x2, v.y2);
      ctx.stroke();
    }
    ctx.lineCap = 'butt';

    for (const v of c.vatPhamView) {
      if (v.loai === 'ngoc') this.veNgoc(ctx, c.SP_NGOC, v.x, v.y, v.t, v.to ?? 0.55, v.sao ?? 1);
      else if (v.loai === 'socola') this.veSocola(ctx, v);
      else this.veVatPham(ctx, v);
    }

    HN.moc('ve.vetTrungVp');
    // Gà dưới đất + nhân vật, xếp theo y
    for (const o of c.xep) {
      if (o.loai === 'ga') this.veGa(ctx, c, o.ga);
      else if (o.loai === 'td') {
        // Trang trí hiện dần theo sương mù (đảo; vườn gà khi không ai ở trong vườn)
        ctx.globalAlpha = c.doRo(o.td.x, o.td.y);
        this.veTrangTri(ctx, o.td, c.t, !!o.td.sa);
        ctx.globalAlpha = 1;
      }
      else if (o.loai === 'cuu') this.veCuu(ctx, c, o.cu);
      else if (o.loai === 'cau') this.veCau(ctx, c, o.cau);
      else if (o.loai === 'cell') {
        ctx.globalAlpha = c.doRo(o.ce.x, o.ce.y);
        this.veCell(ctx, c, o.ce);
        ctx.globalAlpha = 1;
      } else if (o.loai === 'gy') {
        // Bản sao vẽ rõ như nhân vật thật (nhân vật không bị sương mù làm mờ)
        ctx.globalAlpha = c.gyNv ? 1 : c.doRo(c.ginyu.x, c.ginyu.y);
        this.veGinyu(ctx, c);
        ctx.globalAlpha = 1;
      } else if (o.loai === 'banh') {
        ctx.globalAlpha = c.doRo(o.tc.x, o.tc.y);
        // Tiệc có ngọc rồng (chưa nhặt): giữa vòng là viên ngọc thay cho bánh
        if (o.tc.ngoc) this.veNgoc(ctx, c.SP_NGOC, o.tc.x, o.tc.y, c.t, c.ngocTiecTo(o.tc), o.tc.ngoc);
        else this.veBanh(ctx, c, o.tc);
        ctx.globalAlpha = 1;
      }
      else if (o.loai === 'mb') this.veMayBay(ctx, c, c.mbView, c.SP_MB, true);
      else if (o.loai === 'pt') this.veMayBay(ctx, c, c.ptView, c.SP_PT, false);
      else this.veNhanVat(ctx, c, o.p);
    }
    HN.moc('ve.xep');
    for (const g of c.gaBayView) this.veGa(ctx, c, g);
    this.veMbDem(ctx, c);

    // Kamehameha của Cell bắn vào bánh sinh nhật
    for (const q of c.chuongTiecView) {
      ctx.globalAlpha = c.doRo(q.x0, q.y0);
      this.veChuongTiec(ctx, q);
      ctx.globalAlpha = 1;
    }

    for (let p = 0; p < c.nguoi.length; p++) this.veThanhTrenDau(ctx, c, p);
    for (const g of c.tuongView) this.veMauTuong(ctx, c, g);
    for (const ce of c.cellView) {
      ctx.globalAlpha = c.doRo(ce.x, ce.y);
      this.veMauCell(ctx, c, ce);
      ctx.globalAlpha = 1;
    }
    // Thanh máu bóng ma Goku (lượt riêng sau mọi vật để không bị che)
    if (c.gyView && !c.ginyu.chet) {
      ctx.globalAlpha = c.gySao ? 1 : c.doRo(c.ginyu.x, c.ginyu.y);
      this.veMauGinyu(ctx, c);
      ctx.globalAlpha = 1;
    }

    HN.moc('ve.gaBayTiecThanh');
    // Đạn / chưởng
    for (const d of c.danView) {
      if (!d.to) continue;
      const vt = c.danHienTai(d);
      if (d.vg) {
        // Chưởng Vegeta: cầu lửa vàng (khung 0 / 1 luân phiên, đầu quay sang phải) xoay theo hướng bay, vệt sáng phía sau;
        // vừa bắn thì có chớp nòng (khung 2) ở tay
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineWidth = 20;
        ctx.strokeStyle = 'rgba(255,220,90,0.4)';
        ctx.beginPath();
        ctx.moveTo(vt.xs, vt.ys);
        ctx.lineTo(vt.x, vt.y);
        ctx.stroke();
        const gocBay = Math.atan2(d.y1 - d.y0, d.x1 - d.x0);
        if (d.t < 0.12) {
          ctx.save();
          ctx.translate(d.x0, d.y0);
          ctx.rotate(gocBay);
          ctx.globalAlpha = 1 - d.t / 0.12;
          ctx.scale(0.9, 0.9);
          ctx.translate(70, 0);
          this.sprite(ctx, c.SP_VG_CHUONG, 2, false, false);
          ctx.restore();
        }
        ctx.translate(vt.x, vt.y);
        ctx.rotate(gocBay);
        ctx.scale(1.4, 1.4);
        // Đầu cầu lửa nằm lệch phải trong khung: dời về để đầu trùng vị trí chưởng
        ctx.translate(-42, 0);
        this.sprite(ctx, c.SP_VG_CHUONG, Math.floor(d.t * 14) % 2, false, false);
        ctx.restore();
        continue;
      }
      // Chưởng socola nâu; chưởng tự bắn lên trời là quả cầu lửa có đuôi cháy dài
      const mauDan = d.soc ? '#a8693a' : d.troi ? '#ffb347' : '#ff9fd0';
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineWidth = d.troi ? 34 : 26;
      ctx.strokeStyle = d.soc ? 'rgba(168,105,58,0.6)' : d.troi ? 'rgba(255,140,40,0.55)' : 'rgba(255,194,226,0.6)';
      ctx.beginPath();
      ctx.moveTo(vt.xs, vt.ys);
      ctx.lineTo(vt.x, vt.y);
      ctx.stroke();
      this.sang(ctx, mauDan);
      duongTron(ctx, 30, vt.x, vt.y);
      ctx.fillStyle = mauDan;
      ctx.fill();
      ctx.strokeStyle = c.nguoi[d.p].mau;
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();
    }

    // Lông bay
    for (const l of c.longView) {
      ctx.save();
      ctx.translate(l.x, l.y);
      ctx.rotate(rad(l.xoay));
      ctx.globalAlpha = dongHe(1 - l.t / 1.3);
      ctx.fillStyle = l.mau;
      ctx.fill(P.long);
      ctx.strokeStyle = 'rgba(0,0,0,0.19)';
      ctx.lineWidth = 1;
      ctx.stroke(P.long);
      ctx.restore();
    }

    // Chữ bay
    ctx.font = `800 28px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 4;
    for (const t of c.chuView) {
      ctx.globalAlpha = dongHe(1 - t.t);
      ctx.strokeStyle = '#fff';
      ctx.strokeText(t.text, t.x, t.y);
      ctx.fillStyle = t.mau;
      ctx.fillText(t.text, t.x, t.y);
    }
    ctx.globalAlpha = 1;
    ctx.textAlign = 'start';
    ctx.lineJoin = 'miter';

    // Tâm ngắm
    if (c.man === 'play') {
      for (const m of c.nhamView) {
        ctx.save();
        ctx.translate(m.x, m.y);
        duongTron(ctx, 7);
        ctx.fillStyle = m.mau;
        ctx.fill();
        ctx.strokeStyle = m.mau;
        ctx.lineWidth = 7;
        ctx.stroke(P.ngam);
        ctx.restore();
      }
    }
  }

  // Cháy nổ: quầng lửa (trắng vàng → cam → đỏ sẫm) nở ra, tia lửa bắn toả ra và khói đen mờ dần. Gốc toạ độ đã ở tâm vụ nổ; k = 0..1 tiến độ
  private veChay(ctx: CanvasRenderingContext2D, v: { id: number; t: number; co?: number }, k: number): void {
    const co = v.co ?? 1;
    const a = dongHe(1 - k);
    const R = (40 + k * 190) * co;
    const lua = ctx.createRadialGradient(0, 0, 0, 0, 0, R);
    lua.addColorStop(0, `rgba(255,252,210,${a})`);
    lua.addColorStop(0.3, `rgba(255,190,50,${a * 0.9})`);
    lua.addColorStop(0.65, `rgba(235,80,25,${a * 0.6})`);
    lua.addColorStop(1, 'rgba(90,25,10,0)');
    ctx.globalAlpha = 1;
    duongTron(ctx, R);
    ctx.fillStyle = lua;
    ctx.fill();
    // Khói
    duongTron(ctx, R * 0.7, 0, -R * 0.4 * k);
    ctx.fillStyle = `rgba(40,30,28,${a * 0.25})`;
    ctx.fill();
    // Tia lửa (hướng cố định theo id vụ nổ)
    ctx.lineCap = 'round';
    ctx.lineWidth = 6 * co * a + 1;
    for (let i = 0; i < 10; i++) {
      const g = ((v.id * 37 + i * 36) % 360) * (Math.PI / 180);
      const r0 = R * (0.55 + 0.25 * ((i * 7) % 3) / 2);
      const r1 = r0 + 30 * co * (1 - k * 0.5);
      ctx.strokeStyle = i % 2 ? `rgba(255,220,90,${a})` : `rgba(255,120,40,${a})`;
      ctx.beginPath();
      ctx.moveTo(Math.cos(g) * r0, Math.sin(g) * r0 * 0.8);
      ctx.lineTo(Math.cos(g) * r1, Math.sin(g) * r1 * 0.8);
      ctx.stroke();
    }
    ctx.lineCap = 'butt';
  }

  // Thanh socola: nền nâu, ô vuông, bóng sáng; nảy nhẹ trên đất
  private veSocola(ctx: CanvasRenderingContext2D, v: { x: number; y: number; t: number }): void {
    ctx.save();
    ctx.translate(v.x, v.y);
    ctx.globalAlpha = v.t > 37 && (v.t * 6) % 1 < 0.5 ? 0.35 : 1;
    duongElip(ctx, 28, 8);
    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    ctx.fill();
    duongTron(ctx, 42, 0, -28);
    ctx.fillStyle = `rgba(201,138,75,${0.12 + 0.08 * ((v.t * 4) % 1)})`;
    ctx.fill();
    const tri = (v.t * 4) % 2 < 1 ? (v.t * 4) % 1 : 1 - ((v.t * 4) % 1);
    ctx.translate(0, -30 - 5 * tri);
    ctx.rotate(rad(-8));
    tronCD(ctx, -24, -16, 48, 32, 5);
    ctx.fillStyle = '#6b3a1e';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.stroke();
    // Ô vuông
    ctx.strokeStyle = '#4a2610';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (const x of [-8, 8]) { ctx.moveTo(x, -16); ctx.lineTo(x, 16); }
    ctx.moveTo(-24, 0);
    ctx.lineTo(24, 0);
    ctx.stroke();
    // Bóng sáng
    ctx.fillStyle = 'rgba(255,230,200,0.5)';
    tronCD(ctx, -20, -13, 10, 5, 2);
    ctx.fill();
    ctx.restore();
  }

  // Hạt đậu thần: hạt đậu xanh to bằng nửa viên ngọc rồng (ngọc vẽ ~140px, đậu dài ~70px), nảy nhẹ, có vầng sáng xanh lá
  private veDau(ctx: CanvasRenderingContext2D, v: { x: number; y: number; t: number }): void {
    ctx.save();
    ctx.translate(v.x, v.y);
    ctx.globalAlpha = v.t > 37 && (v.t * 6) % 1 < 0.5 ? 0.35 : 1;
    duongElip(ctx, 34, 9);
    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    ctx.fill();
    duongTron(ctx, 55, 0, -34);
    ctx.fillStyle = `rgba(123,224,74,${0.14 + 0.08 * ((v.t * 4) % 1)})`;
    ctx.fill();
    const tri = (v.t * 3) % 2 < 1 ? (v.t * 3) % 1 : 1 - ((v.t * 3) % 1);
    ctx.translate(0, -34 - 6 * tri);
    ctx.rotate(-0.5);
    duongElip(ctx, 36, 21);
    ctx.fillStyle = '#6fcf3a';
    ctx.fill();
    ctx.strokeStyle = '#2f7d1e';
    ctx.lineWidth = 3;
    ctx.stroke();
    // đường lõm giữa hạt + điểm sáng
    ctx.strokeStyle = 'rgba(40,110,30,0.7)';
    ctx.beginPath();
    ctx.moveTo(-24, 2);
    ctx.quadraticCurveTo(0, 12, 24, 2);
    ctx.stroke();
    duongElip(ctx, 12, 5, -10, -9);
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fill();
    ctx.restore();
  }

  // Quả táo: đỏ hồi máu, xanh hồi mana; nảy nhẹ trên đất, có vầng sáng cùng màu
  private veVatPham(ctx: CanvasRenderingContext2D, v: { x: number; y: number; t: number; loai?: 'do' | 'xanh' | 'socola' | 'ngoc' | 'dau' }): void {
    if (v.loai === 'dau') { this.veDau(ctx, v); return; }
    const xanh = v.loai === 'xanh';
    const mau = xanh ? '#2fa8ff' : '#ff3b3b';
    ctx.save();
    ctx.translate(v.x, v.y);
    ctx.globalAlpha = v.t > 37 && (v.t * 6) % 1 < 0.5 ? 0.35 : 1;
    duongElip(ctx, 24, 7);
    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    ctx.fill();
    duongTron(ctx, 40, 0, -30);
    ctx.fillStyle = `${xanh ? 'rgba(47,168,255,' : 'rgba(255,59,59,'}${0.12 + 0.08 * ((v.t * 4) % 1)})`;
    ctx.fill();
    const tri = (v.t * 4) % 2 < 1 ? (v.t * 4) % 1 : 1 - ((v.t * 4) % 1);
    ctx.translate(0, -26 - 5 * tri);
    // Thân táo
    duongTron(ctx, 20);
    ctx.fillStyle = mau;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.stroke();
    // Cuống và lá
    ctx.strokeStyle = '#6b3f1d';
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, -18);
    ctx.lineTo(3, -28);
    ctx.stroke();
    duongElip(ctx, 9, 5, 11, -26);
    ctx.fillStyle = '#35d96a';
    ctx.fill();
    // Điểm sáng
    duongTron(ctx, 4.5, -8, -7);
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.fill();
    ctx.restore();
  }

  // ─── Nhân vật, gà ───

  private veNhanVat(ctx: CanvasRenderingContext2D, c: Game, p: number): void {
    const n = c.nguoi[p];
    const t = c.nvViTri(p);
    ctx.save();
    ctx.translate(t.x, t.y);
    ctx.scale(t.k, t.k);
    this.sprite(ctx, n.nv.sp, n.nv.khung, n.nv.lat, false);
    ctx.restore();
  }

  // Cứu đồng đội: người ngã được phủ mây (Mabu cứu Zinbu) hoặc một cục socola to (Zinbu cứu Mabu). Nối người còn sống bằng sợi dây, có số giây đếm ngược
  private veCuu(ctx: CanvasRenderingContext2D, c: Game, cu: Cuu): void {
    if (cu.cho > 0) return;
    const con = Math.max(0, Math.ceil(c.CUU_THOI_GIAN - cu.t));
    const s = c.nguoi[1 - cu.p];
    const mau = s.mau;
    // Sợi dây nối người còn sống với mây / socola (cùng kiểu dây buộc khi 2 người đi xa nhau)
    if (!s.het && !s.vang) {
      ctx.save();
      ctx.globalAlpha = 0.9;
      ctx.strokeStyle = '#ff4d4d';
      ctx.lineWidth = 5 / c.camZ;
      ctx.setLineDash([14 / c.camZ, 10 / c.camZ]);
      ctx.beginPath();
      ctx.moveTo(s.x, s.y - 40);
      ctx.lineTo(cu.x, cu.y - 40);
      ctx.stroke();
      ctx.restore();
    }
    ctx.save();
    ctx.translate(cu.x, cu.y);
    const pop = 0.4 + 0.6 * dongHe(cu.tach);
    if (cu.kieu === 'may') {
      // Mây tách ra từ Mabu: dùng đúng khung mây của Mabu, to gấp 2, bồng bềnh
      const sp = MABU;
      ctx.save();
      ctx.translate(0, -34 + 6 * Math.sin(c.t * 4));
      ctx.scale(c.S_NV * 2 * pop, c.S_NV * 2 * pop);
      this.sprite(ctx, sp, sp.anim['may'].f[0], false, false);
      ctx.restore();
    } else {
      // Cục socola to
      ctx.save();
      ctx.scale(2.8 * pop, 2.8 * pop);
      this.veSocola(ctx, { x: 0, y: 0, t: c.t % 10 });
      ctx.restore();
    }
    // Số giây đếm ngược (15 → 0) trên đầu
    ctx.translate(0, -230);
    ctx.font = `800 64px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 9;
    ctx.strokeStyle = 'rgba(0,0,0,0.8)';
    ctx.strokeText(`${con}`, 0, 2);
    ctx.fillStyle = mau;
    ctx.fillText(`${con}`, 0, 2);
    // Lời nhắc người còn sống
    const loi = `Bạn sống được ${c.CUU_THOI_GIAN}s thì đồng đội sẽ sống lại`;
    ctx.font = `800 26px ${FONT}`;
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'rgba(0,0,0,0.8)';
    ctx.strokeText(loi, 0, -58);
    ctx.fillStyle = '#ffd23f';
    ctx.fillText(loi, 0, -58);
    ctx.restore();
  }

  // Quả cầu trốn: nguyên quả (sẵn sàng / có người trốn, lắc nhẹ), 3 giây cuối nứt và rung, rồi vỡ ra khói hồng và nhân vật bước ra (hoạt ảnh trong atlas)
  private veCau(ctx: CanvasRenderingContext2D, c: Game, q: CauTron): void {
    const h = c.cauHinh(q);
    if (h.a <= 0) return;
    ctx.save();
    ctx.translate(q.x + h.rungX, q.y);
    ctx.globalAlpha = h.a;
    if (h.con !== null) {
      // Có người trốn bên trong: vầng sáng hồng dưới chân
      duongElip(ctx, 150, 42);
      ctx.fillStyle = `rgba(255,120,200,${0.18 + 0.12 * Math.abs(Math.sin(c.t * 4))})`;
      ctx.fill();
    }
    ctx.rotate(rad(h.lac));
    ctx.scale(1.4, 1.4);
    this.sprite(ctx, c.SP_CAU, h.khung, false, false);
    ctx.restore();
    // Quả cầu đang trống: avatar của chủ quả cầu (khung cuối: nhân vật giơ tay) trong vòng tròn phía trên, chỉ người đó chui vào được
    if (q.pha === 'san' || q.pha === 'moc') this.veAvatarCau(ctx, c, q, h.a);
    if (h.con === null) return;
    // Số giây còn trốn trên đầu quả cầu
    ctx.save();
    ctx.font = `800 64px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 9;
    ctx.strokeStyle = 'rgba(0,0,0,0.8)';
    ctx.strokeText(`${h.con}`, q.x, q.y - 360);
    ctx.fillStyle = c.nguoi[q.p]?.mau ?? '#ff9fd0';
    ctx.fillText(`${h.con}`, q.x, q.y - 360);
    ctx.restore();
  }

  // Máy bay / phi thuyền: bóng dưới đất (khi đang bay), thân (theo khung atlas), nhãn số người đã lên trên đầu
  private veMayBay(ctx: CanvasRenderingContext2D, c: Game, h: MbHinh | null, sp: KhungSprite, muot: boolean): void {
    if (!h || h.a <= 0) return;
    ctx.save();
    ctx.globalAlpha = h.a;
    if (h.bong > 0) {
      const k = 1 - dongHe((h.nang - 105) / 400);
      duongElip(ctx, 150 * h.to * (0.55 + 0.45 * k), 36 * h.to * (0.55 + 0.45 * k), h.x, h.y);
      ctx.fillStyle = `rgba(0,0,0,${0.28 * h.bong * (0.5 + 0.5 * k)})`;
      ctx.fill();
    }
    ctx.translate(h.x + h.rung, h.y - h.nang);
    ctx.scale(h.to, h.to);
    this.sprite(ctx, sp, h.khung, h.lat, muot);
    ctx.restore();
    if (!h.nhan) return;
    ctx.save();
    ctx.font = `800 44px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 8;
    ctx.strokeStyle = 'rgba(0,0,0,0.8)';
    const ny = h.y - h.nang - (h.nhanCao ?? 190);
    ctx.strokeText(h.nhan, h.x, ny);
    ctx.fillStyle = '#ffd23f';
    ctx.fillText(h.nhan, h.x, ny);
    ctx.restore();
  }

  // Máy bay đã nổ: bóng mờ ở chỗ nó sẽ xuất hiện lại kèm số giây đếm ngược
  private veMbDem(ctx: CanvasRenderingContext2D, c: Game): void {
    const d = c.mbDemView;
    if (!d) return;
    ctx.save();
    ctx.globalAlpha = 0.3 + 0.1 * Math.sin(c.t * 4);
    ctx.translate(d.x, d.y - 105);
    ctx.scale(1.25, 1.25);
    this.sprite(ctx, c.SP_MB, 0, false, true);
    ctx.restore();
    ctx.save();
    ctx.font = `800 56px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 9;
    ctx.strokeStyle = 'rgba(0,0,0,0.8)';
    ctx.strokeText(`✈ ${d.con}`, d.x, d.y - 250);
    ctx.fillStyle = '#ffd23f';
    ctx.fillText(`✈ ${d.con}`, d.x, d.y - 250);
    ctx.restore();
  }

  private veAvatarCau(ctx: CanvasRenderingContext2D, c: Game, q: CauTron, a: number): void {
    const R = 85;
    const mau = c.nguoi[q.cua]?.mau ?? '#ff9fd0';
    ctx.save();
    ctx.globalAlpha = a;
    ctx.translate(q.x, q.y - 370 + 6 * Math.sin(c.t * 3));
    duongTron(ctx, R);
    ctx.fillStyle = 'rgba(0,0,0,0.75)';
    ctx.fill();
    ctx.save();
    ctx.clip();
    // Neo sprite ở dưới vòng tròn để phần đầu + thân nằm giữa vòng
    const ng = c.nguoi[q.cua];
    if (ng?.ki === 2) {
      // Vegeta không có hàng trong atlas quả cầu: vẽ khung đứng của Vegeta
      ctx.translate(0, 70);
      ctx.scale(2.4 / (ng.nv.sp.to ?? 1), 2.4 / (ng.nv.sp.to ?? 1));
      this.sprite(ctx, ng.nv.sp, ng.nv.sp.anim['idle']!.f[0]!, false, false);
    } else {
      ctx.translate(0, 170);
      ctx.scale(0.85, 0.85);
      this.sprite(ctx, c.SP_CAU, c.cauHang(q) * 6 + 5, false, false);
    }
    ctx.restore();
    duongTron(ctx, R);
    ctx.lineWidth = 7;
    ctx.strokeStyle = mau;
    this.sang(ctx, mau);
    ctx.stroke();
    ctx.shadowBlur = 0;
    // Mũi nhọn chỉ xuống quả cầu
    ctx.beginPath();
    ctx.moveTo(-16, R + 2);
    ctx.lineTo(0, R + 24);
    ctx.lineTo(16, R + 2);
    ctx.closePath();
    ctx.fillStyle = mau;
    ctx.fill();
    ctx.restore();
  }

  // Kamehameha xanh bắn từ tay Cell vào bánh: quả gốc ở tay, thân ống kéo dài, đầu bay tới bánh (ảnh cell_chuong.png cắt 3 khúc)
  private veChuongTiec(ctx: CanvasRenderingContext2D, q: ChuongTiec): void {
    const l = CHUONG_LOAI[q.loai] ?? CHUONG_LOAI[0];
    const img = this.nguon(l.atlas, null);
    if (!img) return;
    const f = (img instanceof HTMLImageElement ? img.naturalWidth : (img as HTMLCanvasElement).width) / l.w;
    const { w, h, bw, nk0, nk1, hx } = l;
    const s = q.k * l.ti;
    const dx = q.x1 - q.x0, dy = q.y1 - q.y0;
    const D = Math.hypot(dx, dy) / s;
    const e = Math.min(1, q.t / TIEC_CHUONG_T);
    const hw = w - hx;
    const dau = Math.max(bw * 0.6, bw * 0.6 + (D - hw - bw * 0.6) * e);
    ctx.save();
    ctx.translate(q.x0, q.y0);
    ctx.rotate(Math.atan2(dy, dx));
    ctx.scale(s, s);
    ctx.imageSmoothingEnabled = false;
    // Không dùng shadowBlur: chùm chưởng phóng rất to, làm mờ bóng mỗi khung cực tốn GPU (nhiều Cell cùng bắn là tụt FPS); ảnh chưởng tự có quầng sáng
    const ve = (sx: number, sw: number, dxx: number, dw: number) => ctx.drawImage(img, sx * f, 0, sw * f, h * f, dxx, -h / 2, dw, h);
    ve(nk0, nk1 - nk0, bw * 0.5, Math.max(0, dau - bw * 0.5 + 2));
    ve(0, bw, 0, bw);
    ve(hx, hw, dau, hw);
    ctx.restore();
  }

  // Cell: sprite pixel art (không làm mịn), neo ở chân, quay mặt về phía nhân vật; cấp 4 phát sáng đỏ cam; xác mờ dần
  private veCell(ctx: CanvasRenderingContext2D, c: Game, ce: Cell): void {
    const k = cellK(ce.cap);
    ctx.save();
    ctx.globalAlpha = ce.chet ? Math.max(0, 1 - ce.tChet / CELL_CHET_T) : 1;
    // Cell giữ ngọc ngồi trên viên ngọc 2 sao: thân nâng lên trên viên ngọc
    ctx.translate(ce.x, ce.y - (c.cellNgoiNgoc(ce) ? CELL_NGOI_NANG : 0));
    ctx.scale(k, k);
    // Dự tiệc: ngồi (hơi thấp xuống), bay nốt nhạc ♪ trên đầu
    const tcc = ce.tiec ? c.tiecCua(ce) : undefined;
    const tiec = !!tcc?.on && !ce.chet;
    // Cấp cao nhất: quầng sáng đỏ cam bằng gradient (không dùng shadowBlur: sprite phóng rất to nên làm mờ cực chậm)
    if (ce.cap === SO_CAP - 1 && !ce.chet && !c.cellLoc(ce)) {
      const g = ctx.createRadialGradient(0, -32, 2, 0, -32, 36);
      g.addColorStop(0, `rgba(255,${150 + Math.round(60 * Math.sin(c.t * 6))},40,0.5)`);
      g.addColorStop(1, 'rgba(255,120,30,0)');
      ctx.fillStyle = g;
      ctx.fillRect(-36, -68, 72, 72);
    }
    // Hàng của mỗi cấp trong atlas: đổi khung = cấp * số cột + khung
    // Đang vận nội công / phóng chưởng vào bánh: dùng atlas riêng (gồng, hào quang, phóng); hào quang đập nhẹ, thân rung khi gồng
    const kt = c.cellTiecKhung(ce);
    if (kt !== null) {
      if ((TIEC_KHUNG.hao as readonly number[]).includes(kt)) ctx.scale(1 + 0.04 * Math.sin(c.t * 30), 1 + 0.04 * Math.sin(c.t * 30));
      else if (kt === TIEC_KHUNG.bien) {
        // Biến hình: gió xanh nháy ngang / dọc quanh người, thân rung
        this.sprite(ctx, SP_CELL_TIEC, ce.cap * SP_CELL_TIEC.cot + (Math.floor(c.t * 16) % 2 ? TIEC_KHUNG.gioNgang : TIEC_KHUNG.gioDoc), ce.lat, false);
        ctx.translate(Math.sin(c.t * 80) * 1.2, 0);
      }
      this.sprite(ctx, SP_CELL_TIEC, ce.cap * SP_CELL_TIEC.cot + kt, ce.lat, false);
    } else this.sprite(ctx, SP_CELL, ce.cap * SP_CELL.cot + c.cellKhung(ce), ce.lat, false, c.cellLoc(ce));
    if (tiec) {
      ctx.shadowBlur = 0;
      ctx.font = `bold 9px ${FONT}`;
      ctx.textAlign = 'center';
      ctx.fillStyle = '#fff3b0';
      const ph = c.t * 2 + ce.id * 0.7;
      ctx.globalAlpha = 0.6 + 0.4 * Math.abs(Math.sin(ph * 1.5));
      ctx.fillText(ce.id % 2 ? '♪' : '♫', Math.sin(ph) * 6, -64 - 4 * Math.abs(Math.sin(ph)));
    }
    ctx.restore();
  }

  // Bóng ma Goku: lơ lửng nhấp nhô trên quầng sáng xanh lơ, thân trong mờ chập chờn (atlas đã tô màu bóng ma), quay mặt trái (lat = quay phải);
  // gồng thì hào quang xanh bùng lên + rung; lao thì kéo 3 bóng mờ phía sau; hoá socola nhuộm nâu, trúng đòn nháy sáng; xác mờ dần
  private veGinyu(ctx: CanvasRenderingContext2D, c: Game): void {
    const g = c.ginyu;
    // Bản sao: vẽ y hệt nhân vật bị sao chép (cùng sprite, animation, cỡ); bản sao bị hạ thì ngã rồi mờ dần
    if (c.gyNv) {
      const t = c.gyNvViTri();
      ctx.save();
      if (g.chet) ctx.globalAlpha *= Math.max(0, 1 - g.tChet / GY_CHET_T);
      ctx.translate(t.x, t.y);
      ctx.scale(t.k, t.k);
      this.sprite(ctx, c.gyNv.sp, c.gyNv.khung, c.gyNv.lat, false, c.gyLoc());
      ctx.restore();
      return;
    }
    ctx.save();
    if (g.chet) ctx.globalAlpha *= Math.max(0, 1 - g.tChet / GY_CHET_T);
    ctx.translate(g.x, g.y);
    // Quầng sáng dưới chân (bóng ma không có bóng đổ); gồng thì to và sáng hơn
    const gong = c.gyGong;
    const dang = g.khieu !== undefined && !g.chet;
    ctx.save();
    ctx.scale(1, 0.35);
    const R = 150 + 90 * gong + (dang ? 40 : 0);
    const q = ctx.createRadialGradient(0, 0, 0, 0, 0, R);
    q.addColorStop(0, `rgba(150,230,255,${0.35 + 0.3 * gong + 0.1 * Math.sin(c.t * 6)})`);
    q.addColorStop(1, 'rgba(90,170,255,0)');
    ctx.fillStyle = q;
    ctx.fillRect(-R, -R, R * 2, R * 2);
    ctx.restore();
    const bay = GY_LO_LUNG + 10 * Math.sin(c.t * 2.6);
    const khung = c.gyKhung(), loc = c.gyLoc();
    const anh = g.chet ? 0.55 : 0.72 + 0.12 * Math.sin(c.t * 4.3);
    // Đang lao: 3 bóng mờ phía sau theo hướng bay
    if (g.lao !== undefined && !g.chet) {
      const v = Math.hypot(g.vx ?? 0, g.vy ?? 0) || 1;
      const ux = (g.vx ?? 0) / v, uy = (g.vy ?? 0) / v;
      const a0 = ctx.globalAlpha;
      for (let i = 3; i >= 1; i--) {
        ctx.save();
        ctx.globalAlpha = a0 * anh * (0.4 - i * 0.1);
        ctx.translate(-ux * i * 70, -uy * i * 70 - bay);
        ctx.scale(GY_TO, GY_TO);
        this.sprite(ctx, SP_GINYU, khung, g.lat, true, loc);
        ctx.restore();
      }
    }
    // Hào quang khi gồng (gradient, không shadowBlur)
    if (gong > 0) {
      const r = 110 + 50 * gong + 8 * Math.sin(c.t * 30);
      const h = ctx.createRadialGradient(0, -bay - 100, 10, 0, -bay - 100, r);
      h.addColorStop(0, `rgba(220,250,255,${0.5 * gong})`);
      h.addColorStop(0.6, `rgba(120,210,255,${0.35 * gong})`);
      h.addColorStop(1, 'rgba(80,160,255,0)');
      ctx.fillStyle = h;
      ctx.fillRect(-r, -bay - 100 - r, r * 2, r * 2);
      ctx.translate(Math.sin(c.t * 70) * 3 * gong, 0);
    }
    ctx.globalAlpha *= anh;
    ctx.translate(0, -bay);
    ctx.scale(GY_TO, GY_TO);
    this.sprite(ctx, SP_GINYU, khung, g.lat, true, loc);
    ctx.restore();
  }

  // Thanh máu bóng ma Goku trên đầu (xanh lơ), kèm số máu và tên nhân vật nó đang sao chép
  private veMauGinyu(ctx: CanvasRenderingContext2D, c: Game): void {
    const g = c.ginyu;
    if (c.gySao) {
      // Bản sao: thanh máu giống hệt của nhân vật thật (không tên, không số) để không ai phân biệt được
      const t = c.gyThanh();
      this.veThanhNv(ctx, t.x, t.y, t.mau);
      return;
    }
    // Bóng ma: không đánh được nên không có thanh máu, chỉ có tên
    ctx.save();
    ctx.translate(g.x, g.y - GY_THANH_CAO);
    ctx.scale(2.2, 2.2);
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(0,0,0,0.85)';
    ctx.strokeText(`👻 ${c.gyTen}`, 0, -2);
    ctx.fillStyle = '#bff0ff';
    ctx.fillText(`👻 ${c.gyTen}`, 0, -2);
    ctx.restore();
  }

  // Thanh máu trên đầu Cell: vẽ ở lượt riêng sau mọi vật (như thanh máu gà tướng) để không bị Cell / cây / chưởng phía trước che mất
  private veMauCell(ctx: CanvasRenderingContext2D, c: Game, ce: Cell): void {
    const k = cellK(ce.cap);
    // Thanh máu trên đầu (kiểu như gà tướng) chỉ có ở Cell đỏ (cấp cao nhất) và con đi ăn đậu thần (`vai: 'an'`, thanh xanh lá), kèm số máu
    // (và sức mạnh khi đã ăn thêm); ăn quá máu tối đa thì thanh tính theo máu hiện có
    const an = ce.vai === 'an';
    if ((ce.cap === SO_CAP - 1 || an) && !ce.chet) {
      const toiDa = Math.max(CELL_HP[ce.cap]!, ce.hp);
      ctx.save();
      ctx.translate(ce.x, ce.y - (c.cellNgoiNgoc(ce) ? CELL_NGOI_NANG : 0) - CELL_THANH_CAO * k);
      ctx.scale(3, 3);
      tronCD(ctx, -34, -6, 68, 12, 6);
      ctx.fillStyle = 'rgba(13,27,18,0.75)';
      ctx.fill();
      tronCD(ctx, -31, -3, Math.min(62, Math.max(0, (62 * ce.hp) / toiDa)), 6, 3);
      ctx.fillStyle = an ? '#5fd13a' : '#ff4a2e';
      ctx.fill();
      const suc = ce.suc ?? 1;
      ctx.font = 'bold 15px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'rgba(0,0,0,0.85)';
      const chu = `${an ? '🫘 ' : ''}${Math.round(ce.hp)}${suc > 1.001 ? `  ⚔x${suc.toFixed(2)}` : ''}${ce.satDau ? `  ⚔+${ce.satDau}` : ''}`;
      ctx.strokeText(chu, 0, -9);
      ctx.fillStyle = '#fff';
      ctx.fillText(chu, 0, -9);
      ctx.restore();
    }
  }

  // Bánh sinh nhật giữa vòng Cell: sprite 8 khung lửa lặp, quầng sáng cam
  private veBanh(ctx: CanvasRenderingContext2D, c: Game, tc: Tiec): void {
    const BANH_TO = tc.to;
    ctx.save();
    ctx.translate(tc.x, tc.y);
    // Quầng sáng dưới đáy
    ctx.save();
    ctx.scale(1, 0.35);
    const R = 330 * BANH_TO;
    const q = ctx.createRadialGradient(0, 0, 0, 0, 0, R);
    q.addColorStop(0, `rgba(255,150,40,${0.35 + 0.1 * Math.sin(c.t * 9)})`);
    q.addColorStop(1, 'rgba(255,120,20,0)');
    ctx.fillStyle = q;
    ctx.beginPath();
    ctx.arc(0, 0, R, 0, TAU);
    ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.scale(BANH_TO, BANH_TO);
    this.sprite(ctx, SP_BANH, Math.floor(c.t * BANH_FPS) % BANH_KHUNG, false, true);
    ctx.restore();
    ctx.restore();
  }

  private veGa(ctx: CanvasRenderingContext2D, c: Game, g: Ga): void {
    const h = c.gaHinh(g);
    const bong = c.bongGa(g);
    ctx.save();
    ctx.globalAlpha = dongHe(g.chet ? 1 - g.tChet / (g.loai === 'boss' ? 2 : 1) : 1);
    // Vòng đốt cháy của gà tướng màu đỏ: vẽ trong không gian thế giới (bán kính DOT_BAN_KINH, dẹt theo EP_GA)
    if (g.loai === 'boss' && g.mau === 'do' && !g.chet) {
      ctx.save();
      ctx.translate(h.x, h.y);
      this.elipSan(ctx, c.R_DOT_THE_GIOI, c.R_DOT_THE_GIOI * c.EP_GA, 'rgba(255,74,28,0.24)', 'rgba(255,122,60,0.7)', 3 / c.camZ, 1);
      ctx.restore();
    }
    ctx.translate(h.x, h.y);
    ctx.scale(h.kx, h.ky);
    // Thế phòng thủ của gà mẹ: khiên xanh nhấp nháy bao quanh thân (đang né mọi đòn)
    if (!g.chet && (g.the ?? 0) > 0) {
      ctx.save();
      ctx.translate(0, h.dy);
      this.elipSan(ctx, 78, 88, 'rgba(90,200,255,0.24)', 'rgba(170,230,255,0.9)', 5, 0.6 + 0.4 * Math.abs(Math.sin(c.t * 8)));
      ctx.restore();
    }
    ctx.translate(0, h.dy);
    ctx.rotate(rad(h.xoay));
    ctx.translate(0, 40);
    this.sprite(ctx, c.gaSprite(g), c.gaKhung(g), g.lat, true, c.locGa(g));
    ctx.restore();
    // Gà đỏ khựng lại thở dốc (nhận thêm sát thương) · gà con bị Đá làm choáng
    if (!g.chet && ((g.kiet ?? 0) > 0 || (g.choang ?? 0) > 0)) {
      ctx.save();
      ctx.globalAlpha = 1;
      ctx.font = `800 40px ${FONT}`;
      ctx.textAlign = 'center';
      ctx.fillText((g.choang ?? 0) > 0 ? '💫' : '💦', h.x, h.y - 115 * (g.to ?? 1) - g.h * c.EP_GA);
      ctx.restore();
    }
    // Gà mẹ gốc đánh dấu bằng vương miện vàng trên đầu
    if (g.goc && !g.chet) {
      const t = c.thanhTuong(g);
      ctx.save();
      ctx.globalAlpha = 1;
      ctx.font = `800 64px ${FONT}`;
      ctx.textAlign = 'center';
      ctx.fillText('👑', t.x, t.y - 28);
      ctx.restore();
      // Ngọc rồng 1 sao đính trên vương miện
      this.veNgoc(ctx, c.SP_NGOC, t.x, t.y - 94, c.tGame, 0.24);
    }
  }

  /** Ngọc rồng 1 sao (khung 0 của atlas), phát sáng vàng cam, nhấp nhô nhẹ; (x, y) là tâm viên ngọc, k = tỉ lệ */
  private veNgoc(ctx: CanvasRenderingContext2D, sp: KhungSprite, x: number, y: number, t: number, k: number, sao = 1): void {
    ctx.save();
    ctx.translate(x, y - (k > 0.25 ? (40 * (k - 0.25)) / 0.3 : 0) + 4 * Math.sin(t * 3));
    ctx.scale(k, k);
    this.sang(ctx, '#ffb347');
    this.sprite(ctx, sp, Math.max(0, Math.min(6, sao - 1)), false, true);
    ctx.restore();
  }

  /** Thanh máu xanh trên đầu nhân vật (dùng chung cho bản sao bóng ma Goku) */
  private veThanhNv(ctx: CanvasRenderingContext2D, x: number, y: number, mau: number): void {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(1.3, 1.3);
    tronCD(ctx, -34, -6, 68, 12, 6);
    ctx.fillStyle = 'rgba(13,27,18,0.75)';
    ctx.fill();
    tronCD(ctx, -31, -3, 62 * mau, 6, 3);
    ctx.fillStyle = '#35d96a';
    ctx.fill();
    ctx.restore();
  }

  // Thanh máu trên đầu nhân vật; dạng mây thì không có
  private veThanhTrenDau(ctx: CanvasRenderingContext2D, c: Game, p: number): void {
    const n = c.nguoi[p];
    if (n.vang || n.nv.laMay || c.dangCuu(p) || c.trongCau(p) || c.trongMb(p)) return;
    const t = c.thanhTrenDau(p);
    this.veThanhNv(ctx, t.x, t.y, c.mauNv(p));
    // Combo đang chạy (từ 3 đòn); combo đủ cao thì chưởng hồi nhanh (⚡)
    if (n.het) return;
    const dong: string[] = [];
    if (n.combo >= 3) dong.push(`COMBO ${n.combo}${n.combo >= c.COMBO_GIAM_HOI ? ' ⚡' : ''}`);
    if (!dong.length) return;
    ctx.save();
    ctx.font = `800 26px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 5;
    dong.forEach((d, i) => {
      const y = t.y - 22 - i * 30;
      ctx.strokeStyle = 'rgba(0,0,0,0.75)';
      ctx.strokeText(d, t.x, y);
      ctx.fillStyle = '#ffb347';
      ctx.fillText(d, t.x, y);
    });
    ctx.restore();
  }

  // Thanh máu trên đầu gà tướng
  private veMauTuong(ctx: CanvasRenderingContext2D, c: Game, g: Ga): void {
    const t = c.thanhTuong(g);
    ctx.save();
    ctx.translate(t.x, t.y);
    ctx.scale(3, 3);
    tronCD(ctx, -34, -6, 68, 12, 6);
    ctx.fillStyle = 'rgba(13,27,18,0.75)';
    ctx.fill();
    tronCD(ctx, -31, -3, Math.min(62, Math.max(0, (62 * g.hp) / c.maxHpTuong(g))), 6, 3);
    ctx.fillStyle = c.mauThanh(g);
    ctx.fill();
    ctx.restore();
  }

  // ─── Thanh đen hai bên: máu, chiêu thức, nửa vòng tròn nhân vật ───

  private veThanhBen(ctx: CanvasRenderingContext2D, c: Game, p: number): void {
    const ng = c.nguoi[p];
    const tn = c.tamNv(p);
    const xt = c.xThanh(p);
    duongTron(ctx, c.R_NV, tn.x, tn.y);
    ctx.fillStyle = '#000';
    ctx.fill();

    // Chân dung (cùng animation với trên map)
    ctx.save();
    ctx.translate(tn.x + (p === 0 ? 55 : -55), tn.y - 48);
    ctx.globalAlpha = ng.het ? 0.4 : 1;
    ctx.beginPath();
    ctx.rect(-45, -45, 90, 90);
    ctx.clip();
    const k = Math.min(90 / 72, 90 / 76) / (ng.nv.sp.to ?? 1);
    ctx.scale(k, k);
    ctx.translate(0, 28);
    this.sprite(ctx, ng.nv.sp, ng.nv.khung, ng.nv.lat, false);
    ctx.restore();

    // Hai bình cầu xếp dọc ngay trên nút trên cùng: trên = máu (xanh lá, số máu nằm giữa bình), dưới = mana (xanh lơ, số mana nằm giữa bình, xám khi đang khoá bay sau lần bay)
    const ym = c.yMauNv(p);
    this.veBinh(ctx, xt, ym - 28, dongHe(c.mauNv(p)), '#ff3b3b', ng.het);
    this.veBinh(ctx, xt, ym + 14, dongHe(c.nlBay(p)), ng.bayKhoa > 0 ? '#8a9a94' : '#2fa8ff', ng.het);
    ctx.save();
    ctx.globalAlpha = ng.het ? 0.4 : 1;
    ctx.font = `700 15px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'rgba(0,0,0,0.75)';
    ctx.fillStyle = '#fff';
    for (const [v, y] of [[c.hpNv(p), ym - 28], [c.manaNv(p), ym + 14]] as [number, number][]) {
      ctx.strokeText(`${v}`, xt, y);
      ctx.fillText(`${v}`, xt, y);
    }
    ctx.restore();

    // Các chiêu xếp dọc từ dưới lên: đang dùng sáng + phát sáng, hết mana thì mờ hẳn
    for (const b of c.nutBang(p)) {
      const dung = ng.nv.nhom === b.k;
      const het = c.hetMana(p, b.k);
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.scale(0.8, 0.8);
      ctx.globalAlpha = het ? 0.12 : dung ? 1 : 0.4;
      if (dung && !het) this.sang(ctx, ng.mau);
      duongTron(ctx, c.R_NUT);
      ctx.fillStyle = '#0d1b12';
      ctx.fill();
      ctx.strokeStyle = dung ? ng.mau : '#555';
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.scale(1.35, 1.35);
      this.bieuTuongNv(ctx, b.k, ng.nv.sp);
      ctx.restore();
    }
  }

  // Bình mana hình cầu: nền tối, phần đầy dâng từ đáy lên, viền sáng
  private veBinh(ctx: CanvasRenderingContext2D, x: number, y: number, nl: number, mau: string, mo: boolean, r = 20): void {
    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = mo ? 0.4 : 1;
    duongTron(ctx, r);
    ctx.fillStyle = '#16241b';
    ctx.fill();
    ctx.save();
    ctx.beginPath();
    ctx.rect(-r * 0.8, r * 0.8 - r * 1.6 * nl, r * 1.6, r * 1.6);
    ctx.clip();
    duongTron(ctx, r * 0.8);
    ctx.fillStyle = mau;
    ctx.fill();
    ctx.restore();
    duongTron(ctx, r * 0.8);
    ctx.strokeStyle = 'rgba(255,255,255,0.6)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  private bieuTuongNv(ctx: CanvasRenderingContext2D, k: number, sp: NhanVatSprite): void {
    const P = duong();
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#0d1b12';
    ctx.lineWidth = 1.2;
    ctx.lineJoin = 'round';
    const tronNho = (cx: number, cy: number, r: number) => {
      duongTron(ctx, r, cx, cy);
      ctx.fill();
      ctx.stroke();
    };
    if (k === 0) {
      tronCD(ctx, -8, -5, 16, 13, 4);
      ctx.fill();
      ctx.stroke();
      tronNho(-5.6, -6, 2.6);
      tronNho(-1.9, -7, 2.6);
      tronNho(1.9, -7, 2.6);
      tronNho(5.6, -6, 2.6);
      duongElip(ctx, 2.8, 4, -8.5, 2);
      ctx.fill();
      ctx.stroke();
    } else if (k === 1) {
      ctx.fill(P.nutDa);
      ctx.stroke(P.nutDa);
      ctx.stroke(P.nutDaVach);
    } else if (k === 3 && !sp.nhomDon[3]?.may) {
      // Biến socola (Zinbu): thanh socola nâu có ô vuông
      ctx.save();
      ctx.rotate(rad(-10));
      tronCD(ctx, -10, -7, 20, 14, 2.5);
      ctx.fillStyle = '#8a4a24';
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = '#4a2610';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-3.3, -7);
      ctx.lineTo(-3.3, 7);
      ctx.moveTo(3.3, -7);
      ctx.lineTo(3.3, 7);
      ctx.moveTo(-10, 0);
      ctx.lineTo(10, 0);
      ctx.stroke();
      ctx.restore();
    } else if (k === 3) {
      ctx.save();
      ctx.translate(0, 4);
      ctx.scale(0.2, 0.2);
      this.sprite(ctx, sp, 0, false, true);
      ctx.restore();
    } else {
      tronNho(5, 0, 6);
      ctx.fill(P.nutChuong);
      ctx.stroke(P.nutChuong);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.stroke(P.nutChuongKhoi);
      ctx.lineCap = 'butt';
    }
    ctx.lineJoin = 'miter';
  }

  // ─── Thanh đen phía trên, bên trái: ngọc rồng đã nhặt (viên mới nhặt bay từ chỗ nhặt lên đây) ───

  private veNgocTrenBang(ctx: CanvasRenderingContext2D, c: Game): void {
    const toa = (i: number) => ({ x: 44 + i * 54, y: -c.BAR / 2 });
    const xong = c.ngocNhat.length - c.ngocBay.length;
    for (let i = 0; i < xong; i++) {
      const p = toa(i);
      this.veNgoc(ctx, c.SP_NGOC, p.x, p.y, c.tGame + i, 0.2, c.ngocNhat[i] ?? 1);
    }
    const cam = c.gocCamera();
    for (const b of c.ngocBay) {
      const k = Math.min(1, b.t / c.NGOC_BAY_T);
      const e = k * k * (3 - 2 * k);
      const p = toa(b.slot);
      const x0 = cam.x + b.x * cam.k, y0 = cam.y + b.y * cam.k;
      const x = x0 + (p.x - x0) * e;
      const y = y0 + (p.y - y0) * e - Math.sin(Math.PI * e) * 120;
      this.veNgoc(ctx, c.SP_NGOC, x, y, b.t * 2, 0.55 + (0.2 - 0.55) * e, b.sao);
    }
  }

  // ─── Tên quái trên thanh đen, ngay trên đầu avatar: vườn gà = vua gà, đảo = Cell của đảo, núi đá = bóng ma Goku ───

  private veBangTen(ctx: CanvasRenderingContext2D, c: Game, tg: Ga | null): void {
    let ten: string;
    let mo: boolean;
    let so: number | null = null;
    if (c.trenNui) { ten = GY_TEN; mo = c.ginyu.chet && !c.ginyu.choHoi; }
    else if (c.trenDao) { ten = CELL_TEN[capCuaDao(c.daoHienTai)] ?? 'Cell'; so = c.soCellDao; mo = so <= 0; }
    else { ten = 'Vua gà'; mo = !tg; }
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffd27a';
    ctx.globalAlpha = mo ? 0.45 : 1;
    // Hàng 1: tên to; hàng 2 (chỉ Cell): số Cell còn lại, chữ nhỏ
    ctx.font = `800 ${so === null ? 30 : 26}px ${FONT}`;
    ctx.fillText(ten, c.GIUA, so === null ? -c.BAR / 2 : -c.BAR + 28);
    if (so !== null) {
      ctx.font = `700 16px ${FONT}`;
      ctx.fillText(`${so}`, c.GIUA, -c.BAR + 58);
    }
    ctx.restore();
  }

  // ─── Thanh đen phía trên: chiêu của gà mẹ ───

  private veThanhTuong(ctx: CanvasRenderingContext2D, c: Game): void {
    const tg = c.tuongSong;
    duongTron(ctx, c.R_TUONG, c.GIUA, 0);
    ctx.fillStyle = '#000';
    ctx.fill();

    ctx.save();
    ctx.translate(c.GIUA, 2);
    ctx.globalAlpha = tg ? 1 : 0.25;
    ctx.beginPath();
    ctx.rect(-35, 0, 70, 70);
    ctx.clip();
    if (c.trenDao) {
      // Đang ở đảo: avatar là Cell của đảo đó, đứng nhún nhảy; núi đá: avatar bóng ma Goku xoay người (mờ khi đã bị hạ)
      if (c.trenNui) {
        ctx.globalAlpha = c.ginyu.chet && !c.ginyu.choHoi ? 0.25 : 0.9;
        ctx.translate(0, 98);
        ctx.scale(0.5, 0.5);
        this.sprite(ctx, SP_GINYU, GY_KHUNG.quay[Math.floor(c.t * 4) % GY_KHUNG.quay.length]!, false, true);
      } else {
        ctx.globalAlpha = 1;
        ctx.translate(0, 66);
        ctx.scale(1.3, 1.3);
        this.sprite(ctx, SP_CELL, capCuaDao(c.daoHienTai) * SP_CELL.cot + CELL_KHUNG.dung[Math.floor(c.t * 2.5) % CELL_KHUNG.dung.length], false, false);
      }
    } else {
      ctx.translate(0, 35);
      ctx.scale(70 / 110, 70 / 110);
      ctx.translate(0, 45);
      this.sprite(ctx, c.SP_TUONG, tg ? c.gaKhung(tg) : 8, tg ? tg.lat : false, true, tg ? c.locGa(tg) : null);
    }
    ctx.restore();
    this.veBangTen(ctx, c, tg);

    // Ở đảo / núi: không có số lượng gà
    if (c.trenDao) return;
    ctx.font = `700 18px ${FONT}`;
    ctx.fillStyle = '#ffd27a';
    ctx.fillText('Gà con', c.GIUA + 175, -42);
    ctx.fillText(`${c.soGaCon}`, c.GIUA + 175, -20);
    // Gà mẹ phụ (nở từ trứng đỏ) còn sống, bên trái avatar
    ctx.save();
    ctx.textAlign = 'end';
    ctx.fillText('Tướng gà', c.GIUA - 175, -42);
    ctx.fillText(`${c.soMePhu}`, c.GIUA - 175, -20);
    ctx.restore();
  }

  // ─── HUD: dây buộc, cảnh báo, mũi tên chỉ đồng đội, FPS ───

  private veHud(ctx: CanvasRenderingContext2D, c: Game): void {
    const P = duong();
    const tet = c.tetDo;
    if (tet > 0.7) {
      const v0 = c.viTriManHinh(0);
      const v1 = c.viTriManHinh(1);
      ctx.save();
      ctx.globalAlpha = dongHe(c.kepTet(tet));
      ctx.strokeStyle = '#ff4d4d';
      ctx.lineWidth = 5;
      ctx.setLineDash([14, 10]);
      ctx.beginPath();
      ctx.moveTo(v0.x, v0.y);
      ctx.lineTo(v1.x, v1.y);
      ctx.stroke();
      ctx.restore();
    }
    // Bản sao bóng ma Goku buộc chung dây với cả hai nhân vật (giống hệt người thật)
    const day = c.gyDay();
    for (const d of day) {
      if (d.tet <= 0.7) continue;
      ctx.save();
      ctx.globalAlpha = dongHe(c.kepTet(d.tet));
      ctx.strokeStyle = '#ff4d4d';
      ctx.lineWidth = 5;
      ctx.setLineDash([14, 10]);
      ctx.beginPath();
      ctx.moveTo(d.a.x, d.a.y);
      ctx.lineTo(d.b.x, d.b.y);
      ctx.stroke();
      ctx.restore();
    }
    ctx.lineJoin = 'round';
    ctx.textAlign = 'center';
    if (tet > 0.9 || day.some((d) => d.tet > 0.9)) {
      ctx.font = `800 30px ${FONT}`;
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#fff';
      ctx.strokeText('⚠ Đừng bỏ xa đồng đội!', c.GIUA, c.H - 40);
      ctx.fillStyle = '#ff4d4d';
      ctx.fillText('⚠ Đừng bỏ xa đồng đội!', c.GIUA, c.H - 40);
    }
    ctx.textAlign = 'start';
    const mtGy = c.gyMuiTen();
    if (mtGy) {
      ctx.save();
      ctx.translate(mtGy.x, mtGy.y);
      ctx.rotate(rad(mtGy.goc));
      ctx.fillStyle = mtGy.mau;
      ctx.fill(P.muiTen);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 4;
      ctx.stroke(P.muiTen);
      ctx.restore();
    }
    for (const p of [0, 1]) {
      if (c.nguoi[p].vang) continue;
      const mt = c.muiTen(p);
      if (!mt) continue;
      ctx.save();
      ctx.translate(mt.x, mt.y);
      ctx.rotate(rad(mt.goc));
      ctx.fillStyle = c.nguoi[p].mau;
      ctx.fill(P.muiTen);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 4;
      ctx.stroke(P.muiTen);
      ctx.restore();
    }
    // Chế độ chuột: tâm ngắm theo chuột của nhân vật đang được điều khiển (ẩn khi chuột nằm trên bảng chiêu thức)
    if (c.cheDo === 'chuot' && !c.trenBang) {
      const n = c.nguoi[c.chuot];
      ctx.save();
      ctx.translate(n.tamX, n.tamY);
      duongTron(ctx, 3);
      ctx.fillStyle = n.mau;
      ctx.fill();
      ctx.strokeStyle = n.mau;
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.stroke(P.chuot);
      ctx.restore();
    }
    ctx.font = `600 22px ${FONT}`;
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#1d2b3a';
    const fpsChu = `${c.fps} FPS${c.matMay ? ` · mát máy ${Math.ceil(c.matMayCon)}s` : ''}`;
    ctx.strokeText(fpsChu, 14, 34);
    ctx.fillStyle = '#fff';
    ctx.fillText(fpsChu, 14, 34);
    ctx.lineJoin = 'miter';
  }

  // ─── Công cụ ───

  /** Phát sáng như bộ lọc cũ (làm mờ 5 đơn vị rồi chồng hình gốc lên): dùng bóng đổ cùng màu, độ mờ tính theo tỉ lệ hiện tại */
  private sang(ctx: CanvasRenderingContext2D, mau: string): void {
    ctx.shadowColor = mau;
    ctx.shadowBlur = 10 * ctx.getTransform().a;
  }

  /** Vẽ một khung atlas, gốc toạ độ = điểm neo dưới chân; lật ngang quanh điểm neo. boLoc: bộ lọc màu CSS (đã nhuộm sẵn cả atlas). Chưa nạp xong ảnh thì bỏ qua. */
  /** Elip có nền + viền (khiên thế phòng thủ, vòng lửa gà mẹ đỏ) tâm ở gốc toạ độ hiện tại (rx, ry, day theo toạ độ hiện tại).
   *  Hiệu năng: fill + stroke đường cong to mỗi khung rất tốn khi hàng chục tướng gà cùng trong khung nhìn; vẽ sẵn thành ảnh
   *  đúng cỡ điểm ảnh trên màn hình (làm tròn 4px) một lần rồi dán nguyên, không phóng / thu (dán 1:1 rẻ hơn ~5 lần). a = độ đậm (nhấp nháy). */
  private elipSan(ctx: CanvasRenderingContext2D, rx: number, ry: number, nen: string, vien: string, day: number, a: number): void {
    const m = ctx.getTransform();
    const sx = Math.hypot(m.a, m.b);
    const sy = Math.hypot(m.c, m.d);
    const RX = Math.max(4, Math.round((rx * sx) / 4) * 4);
    const RY = Math.max(4, Math.round((ry * sy) / 4) * 4);
    const D = Math.max(1, Math.round(day * (sx + sy) / 2));
    const khoa = `${RX}|${RY}|${D}|${nen}|${vien}`;
    let cv = this.elip.get(khoa);
    if (!cv) {
      if (this.elip.size > 80) this.elip.clear();
      cv = document.createElement('canvas');
      cv.width = 2 * (RX + D + 2);
      cv.height = 2 * (RY + D + 2);
      const x = cv.getContext('2d')!;
      duongElip(x, RX, RY, cv.width / 2, cv.height / 2);
      x.fillStyle = nen;
      x.fill();
      x.strokeStyle = vien;
      x.lineWidth = D;
      x.stroke();
      this.elip.set(khoa, cv);
    }
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, Math.round(m.e), Math.round(m.f));
    ctx.globalAlpha *= a;
    ctx.drawImage(cv, -cv.width / 2, -cv.height / 2);
    ctx.restore();
  }

  private sprite(ctx: CanvasRenderingContext2D, sp: KhungSprite, khung: number, lat: boolean, muot: boolean, boLoc: string | null = null): void {
    let img = this.nguon(sp.atlas, boLoc);
    if (!img) return;
    const rongAnh = img instanceof HTMLImageElement ? img.naturalWidth : (img as HTMLCanvasElement).width;
    // File PNG có thể lớn hơn kích thước logic (2×, 4×): đổi toạ độ khung sang điểm ảnh thật
    let f = rongAnh / sp.atlasW;
    if (muot) {
      // Hiệu năng: thu nhỏ ảnh to bằng imageSmoothingQuality 'high' mỗi lần vẽ rất tốn (vài trăm gà là tụt FPS).
      // Chọn bản thu nhỏ sẵn (mip) nhỏ nhất mà khung vẫn ≥ cỡ thật trên màn hình rồi vẽ bằng 'low' (tỉ lệ < 2 nên vẫn mịn).
      const m = ctx.getTransform();
      const dich = Math.hypot(m.a, m.b) * sp.w;
      let L = 1;
      while (L < 8 && (sp.w * f) / (L * 2) >= dich) L *= 2;
      if (L > 1) {
        const nho = this.layMip(sp.atlas, boLoc, img, L);
        if (nho) { img = nho; f /= L; }
      }
    }
    const sx = (khung % sp.cot) * sp.w * f;
    const sy = Math.floor(khung / sp.cot) * sp.h * f;
    ctx.save();
    if (lat) ctx.scale(-1, 1);
    ctx.imageSmoothingEnabled = muot;
    if (muot) ctx.imageSmoothingQuality = 'low';
    ctx.drawImage(img, sx, sy, sp.w * f, sp.h * f, -sp.neoX, -sp.neoY, sp.w, sp.h);
    ctx.restore();
  }

  /** Bản thu nhỏ L lần của ảnh nguồn (dựng một lần từ bản L/2, chất lượng cao, rồi giữ lại) */
  private layMip(url: string, boLoc: string | null, goc: CanvasImageSource, L: number): HTMLCanvasElement | null {
    const khoa = `${url}|${boLoc ?? ''}|${L}`;
    let cv = this.mip.get(khoa);
    if (cv) return cv;
    const tren = L === 2 ? goc : this.layMip(url, boLoc, goc, L / 2);
    if (!tren) return null;
    const rw = tren instanceof HTMLImageElement ? tren.naturalWidth : (tren as HTMLCanvasElement).width;
    const rh = tren instanceof HTMLImageElement ? tren.naturalHeight : (tren as HTMLCanvasElement).height;
    cv = document.createElement('canvas');
    cv.width = Math.max(1, Math.round(rw / 2));
    cv.height = Math.max(1, Math.round(rh / 2));
    const x = cv.getContext('2d')!;
    x.imageSmoothingEnabled = true;
    x.imageSmoothingQuality = 'high';
    x.drawImage(tren, 0, 0, cv.width, cv.height);
    this.mip.set(khoa, cv);
    return cv;
  }

}
