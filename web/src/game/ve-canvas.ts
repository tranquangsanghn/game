import type { Game, Ga, TrangTri, Cuu, CauTron } from './game';
import type { KhungSprite } from './sprite';
import type { NhanVatSprite } from './nhan-vat-sprite';

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
const CO_LAP = 16; // pattern 16×16 ô ngẫu nhiên rồi lặp: một fillRect, không lộ đường nối

export class VeCanvas {
  private mauCo: CanvasPattern | null = null;
  private mauTuong: { mat: CanvasPattern; gach: CanvasPattern; vienNgang: CanvasPattern; vienDoc: CanvasPattern } | null = null;
  private anh = new Map<string, HTMLImageElement>();
  // Atlas đã nhuộm sẵn theo bộ lọc màu (nháy sáng, đen, vàng, đỏ…): nhuộm cả atlas MỘT lần rồi dùng lại.
  // Không dùng ctx.filter lúc vẽ từng sprite vì rất chậm (mỗi sprite vài ms).
  private nhuom = new Map<string, HTMLCanvasElement>();

  /** Nạp trước các atlas để khung hình đầu tiên đã có ảnh */
  napTruoc(...atlas: string[]): void {
    atlas.forEach((a) => this.lay(a));
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
  ve(ctx: CanvasRenderingContext2D, c: Game, dpr: number): void {
    const { W, H, BAR, SIDE } = c;
    const { s, ox, oy } = c.phepChieu();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.setTransform(dpr * s, 0, 0, dpr * s, dpr * ox, dpr * oy);
    ctx.globalAlpha = 1;
    ctx.filter = 'none';
    ctx.lineJoin = 'miter';
    ctx.lineCap = 'butt';
    ctx.fillStyle = '#000';
    ctx.fillRect(-SIDE, -BAR, W + 2 * SIDE, H + BAR);

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

    if (c.doHoangHon > 0) {
      ctx.globalAlpha = c.doHoangHon * 0.6;
      ctx.fillStyle = c.mauHoangHon;
      ctx.fillRect(0, 0, W, H);
      ctx.globalAlpha = 1;
    }

    for (const p of [0, 1]) if (!c.nguoi[p].vang) this.veThanhBen(ctx, c, p);
    this.veThanhTuong(ctx, c);
    if (c.man === 'play' || c.man === 'pause') this.veHud(ctx, c);
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

  private veTrangTri(ctx: CanvasRenderingContext2D, t: TrangTri, now: number): void {
    const img = this.lay(MAP_CO);
    if (!img) return;
    const sp = TRANG_TRI_SPRITE[t.loai];
    const to = t.to ? 1.8 : 1;
    const w = sp.w * sp.k * to;
    const h = sp.h * sp.k * to;
    ctx.save();
    ctx.translate(t.x, t.y);
    // Cây bị đánh thì đổ quanh gốc (nhanh dần rồi nằm luôn)
    if (t.doLuc !== undefined) {
      const k = dongHe((now - t.doLuc) / 0.45);
      ctx.rotate((t.huongDo ?? 1) * (Math.PI / 2) * k * k);
    }
    if (t.lat) ctx.scale(-1, 1);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, sp.sx, sp.sy, sp.w, sp.h, -w / 2, -h, w, h);
    ctx.restore();
  }

  private veTheGioi(ctx: CanvasRenderingContext2D, c: Game): void {
    this.veNen(ctx, c);
    this.veTuong(ctx, c);

    for (const v of c.vetView) {
      const k = v.t / (v.loai === 'chay' ? 0.7 : 0.45);
      ctx.save();
      ctx.translate(v.x, v.y);
      ctx.globalAlpha = dongHe(1 - k);
      if (v.loai === 'chay') {
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

    // Điểm đến của nhân vật đang chạy
    const nhay = c.dichNhay();
    for (const nv of c.nguoi) {
      if (!nv.dich) continue;
      ctx.save();
      ctx.translate(nv.dich.x, nv.dich.y);
      ctx.strokeStyle = nv.mau;
      ctx.lineWidth = 4;
      ctx.globalAlpha = dongHe(1 - nhay * 0.6);
      duongElip(ctx, 10 + 22 * nhay, 5 + 11 * nhay);
      ctx.stroke();
      ctx.globalAlpha = 1;
      duongElip(ctx, 6, 3);
      ctx.fillStyle = nv.mau;
      ctx.fill();
      ctx.stroke();
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

    // Dấu X đỏ nhấp nháy + số giây đếm ngược của trứng đỏ (cuối mũi tên chỉ hướng); 3 giây cuối nháy nhanh hơn
    for (const x of c.xTrungView) {
      // Dấu X và số nháy: hiện 0,5s rồi ẩn 0,5s
      if (Math.floor(c.t / 0.5) % 2 !== 0) continue;
      ctx.save();
      ctx.translate(x.x, x.y - 40);
      ctx.lineCap = 'round';
      ctx.lineWidth = 14;
      ctx.strokeStyle = '#fff';
      ctx.beginPath();
      ctx.moveTo(-26, -26); ctx.lineTo(26, 26); ctx.moveTo(26, -26); ctx.lineTo(-26, 26);
      ctx.stroke();
      ctx.lineWidth = 8;
      ctx.strokeStyle = '#ff2a1f';
      ctx.stroke();
      ctx.font = `900 56px ${FONT}`;
      ctx.textAlign = 'center';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 8;
      ctx.strokeStyle = '#fff';
      ctx.strokeText(`${x.con}`, 0, -50);
      ctx.fillStyle = '#ff2a1f';
      ctx.fillText(`${x.con}`, 0, -50);
      ctx.restore();
    }
    ctx.lineCap = 'butt';

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
      if (v.loai === 'socola') this.veSocola(ctx, v);
      else this.veVatPham(ctx, v);
    }

    // Gà dưới đất + nhân vật, xếp theo y
    for (const o of c.xep) {
      if (o.loai === 'ga') this.veGa(ctx, c, o.ga);
      else if (o.loai === 'td') this.veTrangTri(ctx, o.td, c.t);
      else if (o.loai === 'cuu') this.veCuu(ctx, c, o.cu);
      else if (o.loai === 'cau') this.veCau(ctx, c, o.cau);
      else this.veNhanVat(ctx, c, o.p);
    }
    for (const g of c.gaBayView) this.veGa(ctx, c, g);

    for (let p = 0; p < c.nguoi.length; p++) this.veThanhTrenDau(ctx, c, p);
    for (const g of c.tuongView) this.veMauTuong(ctx, c, g);

    // Đạn / chưởng
    for (const d of c.danView) {
      if (!d.to) continue;
      const vt = c.danHienTai(d);
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

  // Quả táo: đỏ hồi máu, xanh hồi mana; nảy nhẹ trên đất, có vầng sáng cùng màu
  private veVatPham(ctx: CanvasRenderingContext2D, v: { x: number; y: number; t: number; loai?: 'do' | 'xanh' | 'socola' }): void {
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
      const sp = c.nguoi[0].nv.sp;
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
    ctx.translate(0, 170);
    ctx.scale(0.85, 0.85);
    this.sprite(ctx, c.SP_CAU, q.cua * 6 + 5, false, false);
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

  private veGa(ctx: CanvasRenderingContext2D, c: Game, g: Ga): void {
    const h = c.gaHinh(g);
    const bong = c.bongGa(g);
    ctx.save();
    ctx.globalAlpha = dongHe(g.chet ? 1 - g.tChet / (g.loai === 'boss' ? 2 : 1) : 1);
    // Vòng đốt cháy của gà tướng màu đỏ: vẽ trong không gian thế giới (bán kính DOT_BAN_KINH, dẹt theo EP_GA)
    if (g.loai === 'boss' && g.mau === 'do' && !g.chet) {
      ctx.save();
      ctx.translate(h.x, h.y);
      duongElip(ctx, c.R_DOT_THE_GIOI, c.R_DOT_THE_GIOI * c.EP_GA);
      ctx.fillStyle = 'rgba(255,74,28,0.24)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,122,60,0.7)';
      ctx.lineWidth = 3 / c.camZ;
      ctx.stroke();
      ctx.restore();
    }
    ctx.translate(h.x, h.y);
    ctx.scale(h.kx, h.ky);
    // Thế phòng thủ của gà mẹ: khiên xanh nhấp nháy bao quanh thân (đang né mọi đòn)
    if (!g.chet && (g.the ?? 0) > 0) {
      ctx.save();
      ctx.translate(0, h.dy);
      duongElip(ctx, 78, 88);
      ctx.fillStyle = `rgba(90,200,255,${0.14 + 0.1 * Math.abs(Math.sin(c.t * 8))})`;
      ctx.fill();
      ctx.strokeStyle = 'rgba(170,230,255,0.9)';
      ctx.lineWidth = 5;
      ctx.stroke();
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
    }
  }

  // Thanh máu trên đầu nhân vật; dạng mây thì không có
  private veThanhTrenDau(ctx: CanvasRenderingContext2D, c: Game, p: number): void {
    const n = c.nguoi[p];
    if (n.vang || n.nv.laMay || c.dangCuu(p) || c.trongCau(p)) return;
    const t = c.thanhTrenDau(p);
    ctx.save();
    ctx.translate(t.x, t.y);
    ctx.scale(1.3, 1.3);
    tronCD(ctx, -34, -6, 68, 12, 6);
    ctx.fillStyle = 'rgba(13,27,18,0.75)';
    ctx.fill();
    tronCD(ctx, -31, -3, 62 * c.mauNv(p), 6, 3);
    ctx.fillStyle = '#35d96a';
    ctx.fill();
    ctx.restore();
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
    const k = Math.min(90 / 72, 90 / 76);
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

  // ─── Thanh đen phía trên: chiêu của gà mẹ ───

  private veThanhTuong(ctx: CanvasRenderingContext2D, c: Game): void {
    const P = duong();
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
    ctx.translate(0, 35);
    ctx.scale(70 / 110, 70 / 110);
    ctx.translate(0, 45);
    this.sprite(ctx, c.SP_TUONG, tg ? c.gaKhung(tg) : 8, tg ? tg.lat : false, true, tg ? c.locGa(tg) : null);
    ctx.restore();

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
    // Số mạng còn lại: các trái tim ngay dưới avatar gà mẹ (mạng đã mất thì mờ)
    const tong = c.TUONG_HOI_SINH + 1;
    const con = c.mangTuong();
    ctx.save();
    ctx.font = `700 22px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'rgba(0,0,0,0.75)';
    for (let i = 0; i < tong; i++) {
      const x = c.GIUA + (i - (tong - 1) / 2) * 28;
      ctx.globalAlpha = i < con ? 1 : 0.3;
      ctx.strokeText('❤', x, c.R_TUONG + 20);
      ctx.fillStyle = i < con ? '#ff3b3b' : '#888';
      ctx.fillText('❤', x, c.R_TUONG + 20);
    }
    ctx.restore();

    for (const b of c.bangTuong()) {
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.scale(0.5333, 0.5333);
      ctx.globalAlpha = b.op;
      if (b.dung) this.sang(ctx, '#ffb347');
      duongTron(ctx, c.R_NUT);
      ctx.fillStyle = b.k === 3 ? '#15151c' : b.k === 4 ? '#7a5d00' : b.k === 5 ? '#7a1d10' : '#0d1b12';
      ctx.fill();
      ctx.strokeStyle = b.dung ? '#ffb347' : '#555';
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      if (b.k >= 1 && b.tien > 0) {
        ctx.beginPath();
        ctx.arc(0, 0, c.R_NUT + 6, -Math.PI / 2, -Math.PI / 2 + TAU * b.tien);
        ctx.strokeStyle = '#ffb347';
        ctx.lineWidth = 3;
        ctx.stroke();
      }
      ctx.scale(1.35, 1.35);
      ctx.fillStyle = '#fff';
      ctx.strokeStyle = '#0d1b12';
      ctx.lineWidth = 1.2;
      ctx.lineJoin = 'round';
      switch (b.k) {
        case 0:
          ctx.fillStyle = '#ffb347';
          ctx.fill(P.tuMo);
          ctx.stroke(P.tuMo);
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 2;
          ctx.lineCap = 'round';
          ctx.stroke(P.tuMoVach);
          break;
        case 1:
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 3.5;
          ctx.lineCap = 'round';
          ctx.stroke(P.tuLao);
          break;
        case 2:
          ctx.fill(P.tuBay);
          ctx.stroke(P.tuBay);
          break;
        case 3:
          duongTron(ctx, 8);
          ctx.fillStyle = '#1a1a22';
          ctx.fill();
          ctx.strokeStyle = '#c77dff';
          ctx.lineWidth = 2;
          ctx.stroke();
          break;
        case 4:
          duongTron(ctx, 8);
          ctx.fillStyle = '#ffd23f';
          ctx.fill();
          ctx.stroke();
          break;
        case 6:
          // Gọi gà con: gà con vàng có mỏ cam
          duongTron(ctx, 7, 0, 3);
          ctx.fillStyle = '#ffd23f';
          ctx.fill();
          ctx.stroke();
          duongTron(ctx, 4.5, 0, -6);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = '#ff7a2f';
          ctx.beginPath();
          ctx.moveTo(-2, -5); ctx.lineTo(2, -5); ctx.lineTo(0, -2);
          ctx.fill();
          break;
        default:
          ctx.fillStyle = '#ff6a3c';
          ctx.fill(P.tuDo);
          ctx.stroke(P.tuDo);
      }
      ctx.restore();
    }
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
    ctx.lineJoin = 'round';
    ctx.textAlign = 'center';
    if (tet > 0.9) {
      ctx.font = `800 30px ${FONT}`;
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#fff';
      ctx.strokeText('⚠ Đừng bỏ xa đồng đội!', c.GIUA, c.H - 40);
      ctx.fillStyle = '#ff4d4d';
      ctx.fillText('⚠ Đừng bỏ xa đồng đội!', c.GIUA, c.H - 40);
    }
    ctx.textAlign = 'start';
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
    ctx.strokeText(`${c.fps} FPS`, 14, 34);
    ctx.fillStyle = '#fff';
    ctx.fillText(`${c.fps} FPS`, 14, 34);
    ctx.lineJoin = 'miter';
  }

  // ─── Công cụ ───

  /** Phát sáng như bộ lọc cũ (làm mờ 5 đơn vị rồi chồng hình gốc lên): dùng bóng đổ cùng màu, độ mờ tính theo tỉ lệ hiện tại */
  private sang(ctx: CanvasRenderingContext2D, mau: string): void {
    ctx.shadowColor = mau;
    ctx.shadowBlur = 10 * ctx.getTransform().a;
  }

  /** Vẽ một khung atlas, gốc toạ độ = điểm neo dưới chân; lật ngang quanh điểm neo. boLoc: bộ lọc màu CSS (đã nhuộm sẵn cả atlas). Chưa nạp xong ảnh thì bỏ qua. */
  private sprite(ctx: CanvasRenderingContext2D, sp: KhungSprite, khung: number, lat: boolean, muot: boolean, boLoc: string | null = null): void {
    const img = this.nguon(sp.atlas, boLoc);
    if (!img) return;
    const rongAnh = img instanceof HTMLImageElement ? img.naturalWidth : (img as HTMLCanvasElement).width;
    // File PNG có thể lớn hơn kích thước logic (2×, 4×): đổi toạ độ khung sang điểm ảnh thật
    const f = rongAnh / sp.atlasW;
    const sx = (khung % sp.cot) * sp.w * f;
    const sy = Math.floor(khung / sp.cot) * sp.h * f;
    ctx.save();
    if (lat) ctx.scale(-1, 1);
    ctx.imageSmoothingEnabled = muot;
    if (muot) ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, sx, sy, sp.w * f, sp.h * f, -sp.neoX, -sp.neoY, sp.w, sp.h);
    ctx.restore();
  }
}
