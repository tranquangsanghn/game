import type { Game, Ga, TrangTri } from './game';
import type { KhungSprite } from './sprite';

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
const CO_LAP = 16; // pattern 16×16 ô ngẫu nhiên rồi lặp: một fillRect, không lộ đường nối

export class VeCanvas {
  private mauCo: CanvasPattern | null = null;
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
      x.filter = boLoc;
      x.drawImage(img, 0, 0);
      this.nhuom.set(khoa, cv);
    }
    return cv;
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

    for (const p of [0, 1]) this.veThanhBen(ctx, c, p);
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

  private veTrangTri(ctx: CanvasRenderingContext2D, t: TrangTri, now: number): void {
    const img = this.lay(MAP_CO);
    if (!img) return;
    const sp = TRANG_TRI_SPRITE[t.loai];
    const w = sp.w * sp.k;
    const h = sp.h * sp.k;
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

    for (const v of c.vetView) {
      const k = v.t / 0.45;
      ctx.save();
      ctx.translate(v.x, v.y);
      ctx.globalAlpha = dongHe(1 - k);
      if (v.loai === 'no') {
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

    // Trứng
    for (const e of c.trungView) {
      ctx.save();
      ctx.translate(e.x, e.y);
      duongElip(ctx, 22, 7);
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.fill();
      ctx.translate(0, -20);
      ctx.rotate(rad(c.rungTrung(e)));
      duongElip(ctx, 17, 22);
      ctx.fillStyle = e.loai === 'hen' ? '#fff6d5' : e.loai === 'rooster' ? '#e9a79d' : '#9a9aa8';
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.25)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    }

    // Vệt đỏ báo hiệu Lao / Bay
    ctx.lineCap = 'round';
    ctx.lineWidth = 90;
    for (const v of c.vachView) {
      ctx.strokeStyle = `rgba(255,59,48,${dongHe(v.a)})`;
      ctx.beginPath();
      ctx.moveTo(v.x1, v.y1);
      ctx.lineTo(v.x2, v.y2);
      ctx.stroke();
    }
    ctx.lineCap = 'butt';

    for (const v of c.vatPhamView) this.veVatPham(ctx, v);

    // Gà dưới đất + nhân vật, xếp theo y
    for (const o of c.xep) {
      if (o.loai === 'ga') this.veGa(ctx, c, o.ga);
      else if (o.loai === 'td') this.veTrangTri(ctx, o.td, c.t);
      else this.veNhanVat(ctx, c, o.p);
    }
    for (const g of c.gaBayView) this.veGa(ctx, c, g);

    for (let p = 0; p < c.nguoi.length; p++) this.veThanhTrenDau(ctx, c, p);
    if (c.tuong) this.veMauTuong(ctx, c, c.tuong);

    // Đạn / chưởng
    for (const d of c.danView) {
      if (!d.to) continue;
      const vt = c.danHienTai(d);
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineWidth = 26;
      ctx.strokeStyle = 'rgba(255,194,226,0.6)';
      ctx.beginPath();
      ctx.moveTo(vt.xs, vt.ys);
      ctx.lineTo(vt.x, vt.y);
      ctx.stroke();
      this.sang(ctx, '#ff9fd0');
      duongTron(ctx, 30, vt.x, vt.y);
      ctx.fillStyle = '#ff9fd0';
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

  private veVatPham(ctx: CanvasRenderingContext2D, v: { x: number; y: number; t: number }): void {
    const P = duong();
    ctx.save();
    ctx.translate(v.x, v.y);
    ctx.globalAlpha = v.t > 37 && (v.t * 6) % 1 < 0.5 ? 0.35 : 1;
    duongElip(ctx, 26, 8);
    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    ctx.fill();
    duongTron(ctx, 44, 0, -34);
    ctx.fillStyle = `rgba(53,217,106,${0.12 + 0.08 * ((v.t * 4) % 1)})`;
    ctx.fill();
    const tri = (v.t * 4) % 2 < 1 ? (v.t * 4) % 1 : 1 - ((v.t * 4) % 1);
    ctx.translate(0, -34 - 6 * tri);
    ctx.lineJoin = 'round';
    ctx.fillStyle = '#ff3b5c';
    ctx.fill(P.tim);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.stroke(P.tim);
    ctx.strokeStyle = 'rgba(255,255,255,0.8)';
    ctx.lineCap = 'round';
    ctx.stroke(P.timSang);
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
    duongElip(ctx, 44 * bong, 12 * bong);
    ctx.fillStyle = `rgba(0,0,0,${0.22 * bong})`;
    ctx.fill();
    ctx.translate(0, h.dy);
    ctx.rotate(rad(h.xoay));
    ctx.translate(0, 40);
    this.sprite(ctx, c.gaSprite(g), c.gaKhung(g), g.lat, true, c.locGa(g));
    ctx.restore();
  }

  // Thanh máu (số tròn) và quả cầu mana nhỏ trên đầu nhân vật; dạng mây thì không có
  private veThanhTrenDau(ctx: CanvasRenderingContext2D, c: Game, p: number): void {
    const n = c.nguoi[p];
    if (n.nv.laMay) return;
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
    // Thể lực bay: thanh mảnh dưới thanh máu (xám khi đang khoá sau lần bay trước)
    tronCD(ctx, -34, 9, 68, 6, 3);
    ctx.fillStyle = 'rgba(13,27,18,0.75)';
    ctx.fill();
    tronCD(ctx, -32, 10.5, Math.max(0, 64 * c.nlBay(p)), 3, 1.5);
    ctx.fillStyle = n.bayKhoa > 0 ? '#8a9a94' : '#4fd8ff';
    ctx.fill();
    ctx.translate(48, 0);
    duongTron(ctx, 13.3);
    ctx.fillStyle = 'rgba(13,27,18,0.75)';
    ctx.fill();
    const nl = dongHe(c.nangLuong(p));
    ctx.save();
    ctx.beginPath();
    ctx.rect(-10.7, 10.7 - 21.4 * nl, 21.4, 21.4);
    ctx.clip();
    duongTron(ctx, 10.7);
    ctx.fillStyle = c.mauMana(p);
    ctx.fill();
    ctx.restore();
    duongTron(ctx, 10.7);
    ctx.strokeStyle = 'rgba(255,255,255,0.6)';
    ctx.lineWidth = 1.7;
    ctx.stroke();
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
    tronCD(ctx, -31, -3, Math.max(0, (62 * g.hp) / c.HP_GA), 6, 3);
    ctx.fillStyle = '#ff4d4d';
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

    // Máu: số và thanh
    const ym = c.yMauNv(p);
    ctx.font = `700 12px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fff';
    ctx.fillText(`❤ ${c.hpNv(p)}/${c.HP_NV}`, xt, ym);
    ctx.textAlign = 'start';
    tronCD(ctx, xt - 30, ym + 10, 60, 10, 5);
    ctx.fillStyle = '#16241b';
    ctx.fill();
    tronCD(ctx, xt - 28, ym + 12, 56 * c.mauNv(p), 6, 3);
    ctx.fillStyle = '#35d96a';
    ctx.fill();

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

  private bieuTuongNv(ctx: CanvasRenderingContext2D, k: number, sp: KhungSprite): void {
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
    ctx.fillText('Gà mẹ', c.GIUA + 150, -42);
    ctx.fillText(`hồi sinh ${c.lanTuong}/${c.TUONG_HOI_SINH}`, c.GIUA + 150, -20);

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
