// Vẽ map đua rồng (Canvas 2D): màn hình chia đôi dọc, mỗi nửa một camera bám rồng của một người chơi (P1 trái, P2 phải),
// giữa là thanh tiến trình hình con rồng. Chỉ đọc dữ liệu của DuaRong, không đổi trạng thái. Chỉ vẽ những gì nằm trong khung nhìn
// của từng nửa (lọc theo s). Gọi từ VeCanvas.ve() thay cho thế giới khi đang đua (xem mục "Nguyên tắc đua rồng" trong CLAUDE.md).
import {
  CHANG, DUONG_DAI, LW, SO_LUONG, TIM_MAX, TOC_CHET, VP_ICON, VAY_MOI, DEM_NGUOC, BEN_BAO, BEN_DANH, LUA_BAO, LUA_PHUN,
  changCua, nhipBen, nhipLua, tamDuong, xLuong, type ChuongNgai, type DuaRong, type Rong, type LoaiVp,
} from './dua-rong';

const TAU = Math.PI * 2;
/** Bề rộng dải đen giữa hai nửa (thanh tiến trình) */
const GIUA_W = 56;
const FONT = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
/** Màu người chơi: P1 xanh, P2 đỏ */
export const MAU_NGUOI = ['#4da3ff', '#ff5a5a'];
/** Màu thân rồng theo chặng (Đuôi · Bụng · Lưng Vảy · Cổ · Đầu) và màu vảy */
const MAU_THAN = ['#2f6b4f', '#b89656', '#2f5a44', '#4b4262', '#6e3030'];
const MAU_VAY = ['#285c43', '#d8bb7a', '#244a37', '#3c3450', '#5a2626'];
/** Màu trời theo chặng (trên, dưới) */
const MAU_TROI: [string, string][] = [['#8fc8ff', '#e6f3ff'], ['#30406e', '#7d8fc4'], ['#5d86c4', '#b8d3f2'], ['#1d2236', '#4c5570'], ['#ff8f5a', '#ffd7a8']];
const MAU_VP: Record<LoaiVp, string> = { khien: '#6fd3ff', longKhi: '#7dffb0', hoaCau: '#ff7a2f', tim: '#ff4d6d', thienLoi: '#c38bff' };

/** Hash số nguyên → 0..1 (vị trí mây cố định theo ô) */
const bam = (n: number): number => {
  let x = Math.imul(n ^ 0x5bd1e995, 0x27d4eb2d);
  x ^= x >>> 15;
  return ((x >>> 0) % 10000) / 10000;
};

export class VeDuaRong {
  // Khung nhìn của nửa đang vẽ (đặt trong veNua)
  private camS = 0;
  private camX = 0;
  private k = 1;
  private sMin = 0;
  private sMax = 0;
  /** Đang vẽ hai nửa (HUD phải chừa chỗ cho nửa vòng tròn avatar giữa mép trên) */
  private giuaCo = false;

  /**
   * Vẽ cả màn đua vào khung 0..W × 0..H. veNgoc(ctx, x, y, k) vẽ viên ngọc 6 sao (sprite của bộ vẽ chính) tại toạ độ hiện tại.
   */
  ve(ctx: CanvasRenderingContext2D, d: DuaRong, W: number, H: number, t: number, veNgoc: (ctx: CanvasRenderingContext2D, x: number, y: number, k: number) => void): void {
    const xem = d.rong.filter((r) => r.nguoi >= 0).sort((a, b) => a.nguoi - b.nguoi);
    if (!xem.length) xem.push(d.rong[0]!);
    // Hai người: nửa trái / phải, giữa là dải đen GIUA_W chứa thanh tiến trình; một người: cả khung, thanh tiến trình sát mép phải
    this.giuaCo = xem.length > 1;
    const khung = xem.length > 1 ? [[0, W / 2 - GIUA_W / 2], [W / 2 + GIUA_W / 2, W / 2 - GIUA_W / 2]] : [[0, W - GIUA_W]];
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);
    xem.forEach((r, i) => {
      const [x0, w] = khung[i]!;
      ctx.save();
      ctx.beginPath();
      ctx.rect(x0!, 0, w!, H);
      ctx.clip();
      this.veNua(ctx, d, r, x0!, w!, H, t, veNgoc);
      ctx.restore();
    });
    this.veTienTrinh(ctx, d, xem.length > 1 ? W / 2 : W - GIUA_W / 2, H, t, veNgoc);
  }

  // ─── Một nửa màn hình ───

  private veNua(ctx: CanvasRenderingContext2D, d: DuaRong, r: Rong, x0: number, w: number, H: number, t: number, veNgoc: (ctx: CanvasRenderingContext2D, x: number, y: number, k: number) => void): void {
    const yP = H * 0.78;
    this.k = Math.min(0.62, w / 1250);
    this.camS = r.s;
    this.camX = tamDuong(r.s);
    this.sMin = this.camS - (H - yP) / this.k - 300;
    this.sMax = this.camS + yP / this.k + 300;
    this.veTroi(ctx, x0, w, H, yP);
    ctx.save();
    ctx.translate(x0 + w / 2, yP);
    ctx.scale(this.k, this.k);
    this.veThan(ctx, d, t);
    this.veVatPham(ctx, d, t);
    this.veChuongNgai(ctx, d, t);
    this.veRet(ctx, d, t);
    this.veDau(ctx, t, veNgoc);
    for (const o of d.rong) if (o !== r) this.veRong(ctx, o, t, false);
    this.veRong(ctx, r, t, true);
    this.veDan(ctx, d, t);
    this.veHieuUng(ctx, d, r);
    this.veChu(ctx, d, r);
    ctx.restore();
    this.veHud(ctx, d, r, x0, w, H, t);
  }

  /** Toạ độ trong nhóm camera của điểm (s, u) */
  private px(s: number, u: number): number {
    return xLuong(s, u) - this.camX;
  }
  private py(s: number): number {
    return this.camS - s;
  }

  /** Trời theo chặng + biển mây trôi chậm (thị sai) */
  private veTroi(ctx: CanvasRenderingContext2D, x0: number, w: number, H: number, yP: number): void {
    const [tren, duoi] = MAU_TROI[changCua(this.camS)]!;
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, tren);
    g.addColorStop(1, duoi);
    ctx.fillStyle = g;
    ctx.fillRect(x0, 0, w, H);
    const o = 420, sp = this.camS * 0.55;
    const j0 = Math.floor((sp - (H - yP) / this.k) / o) - 1, j1 = Math.ceil((sp + yP / this.k) / o) + 1;
    ctx.fillStyle = 'rgba(255,255,255,0.33)';
    for (let j = j0; j <= j1; j++) {
      for (let q = 0; q < 2; q++) {
        const h = bam(j * 7 + q * 131);
        const x = x0 + h * w;
        const y = yP - (j * o + q * 200 - sp) * this.k;
        const rx = (90 + bam(j * 13 + q) * 120) * this.k * 1.6;
        ctx.beginPath();
        ctx.ellipse(x, y, rx, rx * 0.45, 0, 0, TAU);
        ctx.fill();
      }
    }
  }

  // ─── Thân Cổ Long, luồng bay ───

  private veThan(ctx: CanvasRenderingContext2D, d: DuaRong, t: number): void {
    const s0 = Math.max(-1600, this.sMin), s1 = Math.min(DUONG_DAI + 200, this.sMax);
    if (s1 <= s0) return;
    const buoc = 100;
    const nua = (s: number) => {
      // Chóp đuôi thon lại phía sau vạch xuất phát
      const full = (SO_LUONG / 2) * LW + 80;
      return s < 0 ? full * Math.max(0.05, (s + 1600) / 1600) : full;
    };
    // Tô thân theo từng chặng
    for (let c = 0; c < CHANG.length; c++) {
      const a = Math.max(s0, c === 0 ? -1600 : CHANG[c]!.s0), b = Math.min(s1, CHANG[c]!.s1);
      if (b <= a) continue;
      ctx.beginPath();
      for (let s = a; ; s = Math.min(b, s + buoc)) {
        const xt = tamDuong(s) - this.camX;
        ctx.lineTo(xt - nua(s), this.py(s));
        if (s >= b) break;
      }
      for (let s = b; ; s = Math.max(a, s - buoc)) {
        const xt = tamDuong(s) - this.camX;
        ctx.lineTo(xt + nua(s), this.py(s));
        if (s <= a) break;
      }
      ctx.closePath();
      ctx.fillStyle = MAU_THAN[c]!;
      ctx.fill();
    }
    // Vảy: hàng cung so le mỗi 150
    ctx.lineWidth = 7;
    for (let s = Math.ceil(Math.max(0, s0) / 150) * 150; s < Math.min(DUONG_DAI, s1); s += 150) {
      ctx.strokeStyle = MAU_VAY[changCua(s)]!;
      const lech = (s / 150) % 2 ? 0.5 : 0;
      ctx.beginPath();
      for (let l = -0.5 + lech; l <= SO_LUONG - 0.5; l += 1) {
        const x = this.px(s, l), y = this.py(s);
        ctx.moveTo(x + 58, y);
        ctx.arc(x, y, 58, 0, Math.PI);
      }
      ctx.stroke();
    }
    // Biên hai bên: vách = sống gai xương, hở = mép vực tối
    for (const b of d.bien) {
      const a = Math.max(b.s0, s0, 0), e = Math.min(b.s1, s1, DUONG_DAI);
      if (e <= a) continue;
      for (const ben of [-1, 1]) {
        const loai = ben < 0 ? b.trai : b.phai;
        const u = ben < 0 ? -0.5 : SO_LUONG - 0.5;
        ctx.beginPath();
        for (let s = a; ; s = Math.min(e, s + buoc)) {
          ctx.lineTo(this.px(s, u) + ben * 50, this.py(s));
          if (s >= e) break;
        }
        if (loai === 'vach') {
          ctx.strokeStyle = '#e8dcc0';
          ctx.lineWidth = 34;
          ctx.stroke();
          ctx.fillStyle = '#d6c7a4';
          for (let s = Math.ceil(a / 130) * 130; s < e; s += 130) {
            const x = this.px(s, u) + ben * 66, y = this.py(s);
            ctx.beginPath();
            ctx.moveTo(x, y + 28);
            ctx.lineTo(x + ben * 62, y - 34);
            ctx.lineTo(x, y - 20);
            ctx.closePath();
            ctx.fill();
          }
        } else {
          ctx.strokeStyle = 'rgba(10,10,25,0.55)';
          ctx.lineWidth = 22;
          ctx.stroke();
          ctx.strokeStyle = '#ff5a5a';
          ctx.lineWidth = 5;
          ctx.setLineDash([30, 26]);
          ctx.beginPath();
          for (let s = a; ; s = Math.min(e, s + buoc)) {
            ctx.lineTo(this.px(s, u) + ben * 38, this.py(s));
            if (s >= e) break;
          }
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }
    }
    // Vạch phân luồng phát sáng
    const la = Math.max(0, s0), lb = Math.min(DUONG_DAI, s1);
    if (lb > la) {
      ctx.lineWidth = 5;
      ctx.strokeStyle = `rgba(140,250,255,${0.32 + 0.08 * Math.sin(t * 3)})`;
      ctx.setLineDash([50, 34]);
      for (let l = 0.5; l < SO_LUONG - 0.5; l++) {
        ctx.beginPath();
        for (let s = la; ; s = Math.min(lb, s + buoc)) {
          ctx.lineTo(this.px(s, l), this.py(s));
          if (s >= lb) break;
        }
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }
    // Vách giữa đoạn tách nhánh + biển chỉ đường
    for (const n of d.nhanh) {
      const a = Math.max(n.s0, s0), e = Math.min(n.s1, s1);
      if (e > a) {
        ctx.beginPath();
        for (let s = a; ; s = Math.min(e, s + buoc)) {
          ctx.lineTo(this.px(s, 2.5), this.py(s));
          if (s >= e) break;
        }
        ctx.strokeStyle = '#5b5044';
        ctx.lineWidth = 40;
        ctx.stroke();
        ctx.strokeStyle = '#8c7d6b';
        ctx.lineWidth = 14;
        ctx.stroke();
      }
      const sb = n.s0 - 350;
      if (sb > s0 && sb < s1) {
        this.chu(ctx, '⬅ AN TOÀN', this.px(sb, 1), this.py(sb), 46, '#bfffbf');
        this.chu(ctx, 'NHANH, NHIỀU QUÁI ➡', this.px(sb, 4), this.py(sb), 46, '#ffd27a');
      }
    }
    // Điểm hồi sinh và vạch xuất phát
    for (const m of d.moc) {
      if (m < s0 || m > s1) continue;
      ctx.strokeStyle = m === 0 ? '#ffffff' : 'rgba(255,215,90,0.55)';
      ctx.lineWidth = m === 0 ? 16 : 8;
      if (m === 0) ctx.setLineDash([40, 40]);
      ctx.beginPath();
      ctx.moveTo(this.px(m, -0.5), this.py(m));
      ctx.lineTo(this.px(m, SO_LUONG - 0.5), this.py(m));
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  /** Đầu Cổ Long ở cuối đường: hai sừng, mắt đỏ, miệng há giữ viên ngọc 6 sao (đích) */
  private veDau(ctx: CanvasRenderingContext2D, t: number, veNgoc: (ctx: CanvasRenderingContext2D, x: number, y: number, k: number) => void): void {
    const L = DUONG_DAI;
    if (this.sMax < L - 600 || this.sMin > L + 2200) return;
    const xc = tamDuong(L) - this.camX, y = this.py(L);
    ctx.save();
    ctx.translate(xc, y);
    // Hàm dưới / trên
    ctx.fillStyle = '#7a3434';
    ctx.beginPath();
    ctx.moveTo(-520, 200);
    ctx.quadraticCurveTo(-620, -500, -260, -1150);
    ctx.lineTo(0, -1500);
    ctx.lineTo(260, -1150);
    ctx.quadraticCurveTo(620, -500, 520, 200);
    ctx.closePath();
    ctx.fill();
    // Sừng
    ctx.fillStyle = '#efe2c4';
    for (const b of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(b * 300, -900);
      ctx.quadraticCurveTo(b * 900, -1200, b * 820, -1900);
      ctx.quadraticCurveTo(b * 700, -1300, b * 200, -1050);
      ctx.closePath();
      ctx.fill();
    }
    // Mắt
    for (const b of [-1, 1]) {
      ctx.fillStyle = '#ffe14d';
      ctx.beginPath();
      ctx.ellipse(b * 330, -720, 90, 60, b * 0.4, 0, TAU);
      ctx.fill();
      ctx.fillStyle = '#c40000';
      ctx.beginPath();
      ctx.ellipse(b * 330, -720, 26, 52, 0, 0, TAU);
      ctx.fill();
    }
    // Miệng há (đích)
    ctx.fillStyle = '#2a0b0b';
    ctx.beginPath();
    ctx.ellipse(0, -60, 380, 230, 0, 0, TAU);
    ctx.fill();
    ctx.fillStyle = '#fff6e0';
    for (let i = -4; i <= 4; i++) {
      ctx.beginPath();
      ctx.moveTo(i * 80 - 28, -270 + Math.abs(i) * 14);
      ctx.lineTo(i * 80 + 28, -270 + Math.abs(i) * 14);
      ctx.lineTo(i * 80, -190 + Math.abs(i) * 14);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
    // Vạch đích + viên ngọc 6 sao phát sáng
    ctx.strokeStyle = '#ffd23f';
    ctx.lineWidth = 18;
    ctx.beginPath();
    ctx.moveTo(this.px(L, -0.5), y);
    ctx.lineTo(this.px(L, SO_LUONG - 0.5), y);
    ctx.stroke();
    ctx.save();
    ctx.translate(xc, y - 40);
    const g = ctx.createRadialGradient(0, 0, 10, 0, 0, 300);
    g.addColorStop(0, `rgba(255,200,80,${0.7 + 0.2 * Math.sin(t * 4)})`);
    g.addColorStop(1, 'rgba(255,160,40,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, 300, 0, TAU);
    ctx.fill();
    veNgoc(ctx, 0, 0, 1.1);
    ctx.restore();
  }

  // ─── Vật phẩm, vảy vàng ───

  private veVatPham(ctx: CanvasRenderingContext2D, d: DuaRong, t: number): void {
    ctx.fillStyle = '#ffd23f';
    for (const v of d.vay) {
      if (v.an || v.s < this.sMin) continue;
      if (v.s > this.sMax) break;
      const x = this.px(v.s, v.l), y = this.py(v.s);
      ctx.beginPath();
      ctx.moveTo(x, y - 22);
      ctx.lineTo(x + 15, y);
      ctx.lineTo(x, y + 22);
      ctx.lineTo(x - 15, y);
      ctx.closePath();
      ctx.fill();
    }
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (const h of d.hang) {
      if (h.s < this.sMin || h.s > this.sMax) continue;
      const y = this.py(h.s);
      for (let l = 0; l < SO_LUONG; l++) {
        const vp = h.o[l];
        const x = this.px(h.s, l);
        if (!vp) {
          ctx.strokeStyle = 'rgba(160,160,160,0.6)';
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.arc(x, y, 38, 0, TAU);
          ctx.moveTo(x - 22, y - 22); ctx.lineTo(x + 22, y + 22);
          ctx.moveTo(x + 22, y - 22); ctx.lineTo(x - 22, y + 22);
          ctx.stroke();
          continue;
        }
        const nhay = 1 + 0.08 * Math.sin(t * 5 + l);
        const g = ctx.createRadialGradient(x, y, 6, x, y, 52 * nhay);
        g.addColorStop(0, '#ffffff');
        g.addColorStop(0.45, MAU_VP[vp]);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, 52 * nhay, 0, TAU);
        ctx.fill();
        ctx.font = `44px ${FONT}`;
        ctx.fillStyle = '#000';
        ctx.fillText(VP_ICON[vp], x, y + 2);
      }
    }
  }

  // ─── Chướng ngại vật & quái ───

  private veChuongNgai(ctx: CanvasRenderingContext2D, d: DuaRong, t: number): void {
    for (const c of d.cn) {
      if (!c.song || c.s + c.dai < this.sMin - 200 || c.s > this.sMax) continue;
      const u = c.l + (c.w - 1) / 2;
      const sm = c.s + c.dai / 2;
      const x = this.px(sm, u), y = this.py(sm);
      switch (c.loai) {
        case 'da': this.veDa(ctx, x, y, 38, '#8d857a', c.id); break;
        case 'thach':
          ctx.save();
          ctx.shadowColor = '#ff7a1f';
          ctx.shadowBlur = 30;
          this.veDa(ctx, x, y, 100, '#5d4b42', c.id);
          ctx.restore();
          break;
        case 'chan': this.veChan(ctx, c, x, y, changCua(c.s) === 1); break;
        case 'vach': {
          const ya = this.py(c.s), yb = this.py(c.s + c.dai);
          const xa = this.px(c.s, c.l), xb = this.px(c.s + c.dai, c.l);
          ctx.strokeStyle = '#6b5a48';
          ctx.lineWidth = LW * 0.95;
          ctx.beginPath();
          for (let s = Math.max(c.s, this.sMin); s <= Math.min(c.s + c.dai, this.sMax); s += 100) ctx.lineTo(this.px(s, c.l), this.py(s));
          ctx.stroke();
          ctx.strokeStyle = '#3e3228';
          ctx.lineWidth = 8;
          ctx.stroke();
          this.veDa(ctx, xa, ya, 56, '#6b5a48', c.id);
          this.veDa(ctx, xb, yb, 56, '#6b5a48', c.id + 1);
          break;
        }
        case 'lua': this.veLua(ctx, c, x, y, t); break;
        case 'ran': case 'gai': this.veBen(ctx, c, t); break;
        case 'xuctu':
          ctx.strokeStyle = '#a35bd6';
          ctx.lineWidth = 16;
          ctx.lineCap = 'round';
          for (let i = 0; i < 4; i++) {
            const a = (i / 4) * TAU + Math.sin(t * 3 + i) * 0.4;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.quadraticCurveTo(x + Math.cos(a) * 60, y + Math.sin(a) * 30, x + Math.cos(a + 0.6) * 70, y + Math.sin(a + 0.6) * 60);
            ctx.stroke();
          }
          ctx.lineCap = 'butt';
          ctx.fillStyle = '#7b3fa8';
          ctx.beginPath();
          ctx.arc(x, y, 30, 0, TAU);
          ctx.fill();
          break;
        case 'doi':
          for (let i = 0; i < 3; i++) this.veDoi(ctx, x + (i - 1) * 34, y + (i % 2) * 30, t + i);
          break;
        case 'ung': this.veUng(ctx, c, x, y, t); break;
        case 'ma': this.veMa(ctx, x, y, t); break;
        case 'trung': {
          const p = 1 + 0.08 * Math.sin(t * 10);
          ctx.fillStyle = '#e8412c';
          ctx.beginPath();
          ctx.ellipse(x, y, 30 * p, 40 * p, 0, 0, TAU);
          ctx.fill();
          ctx.fillStyle = '#ffd23f';
          for (const [dx, dy] of [[-10, -12], [12, 4], [-6, 16]] as const) { ctx.beginPath(); ctx.arc(x + dx, y + dy, 7, 0, TAU); ctx.fill(); }
          break;
        }
        case 'loc':
          ctx.strokeStyle = 'rgba(230,255,250,0.85)';
          ctx.lineWidth = 9;
          for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.ellipse(x + Math.sin(t * 6 + i) * 10, y - i * 22, 60 - i * 10, 18, 0, t * 8 + i, t * 8 + i + 4.5);
            ctx.stroke();
          }
          break;
        case 'tuongBang': {
          ctx.fillStyle = 'rgba(190,240,255,0.9)';
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 6;
          const wv = c.w * LW - 10;
          ctx.fillRect(x - wv / 2, y - 26, wv, 52);
          ctx.strokeRect(x - wv / 2, y - 26, wv, 52);
          break;
        }
      }
    }
  }

  private veDa(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, mau: string, hat: number): void {
    ctx.fillStyle = mau;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * TAU;
      const rr = r * (0.78 + 0.3 * bam(hat * 9 + i));
      ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr * 0.8);
    }
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.beginPath();
    ctx.ellipse(x - r * 0.25, y - r * 0.25, r * 0.35, r * 0.2, -0.5, 0, TAU);
    ctx.fill();
  }

  /** Vật chắn luồng: nhũ đá (Bụng) / gai xương (chỗ khác), mũi nhọn chĩa về phía rồng bay tới */
  private veChan(ctx: CanvasRenderingContext2D, c: ChuongNgai, x: number, y: number, nhu: boolean): void {
    const w = LW * 0.95;
    ctx.fillStyle = nhu ? '#7f94b8' : '#efe4cc';
    ctx.strokeStyle = nhu ? '#4b5a78' : '#a89878';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.rect(x - w / 2, y - c.dai / 2, w, c.dai);
    for (let i = 0; i < 3; i++) {
      const xi = x - w / 2 + (w / 3) * (i + 0.5);
      ctx.moveTo(xi - w / 6, y + c.dai / 2);
      ctx.lineTo(xi, y + c.dai / 2 + 60);
      ctx.lineTo(xi + w / 6, y + c.dai / 2);
    }
    ctx.fill();
    ctx.stroke();
  }

  private veLua(ctx: CanvasRenderingContext2D, c: ChuongNgai, x: number, y: number, t: number): void {
    const k = nhipLua(c, t);
    const bao = k >= LUA_BAO - 0.8 && k < LUA_BAO;
    const phun = k >= LUA_BAO && k < LUA_PHUN;
    ctx.fillStyle = bao ? '#ff6a2a' : '#5a1f14';
    ctx.beginPath();
    ctx.ellipse(x, y, 46, 30, 0, 0, TAU);
    ctx.fill();
    if (bao) {
      ctx.strokeStyle = `rgba(255,80,40,${0.5 + 0.5 * Math.sin(t * 30)})`;
      ctx.lineWidth = 6;
      ctx.strokeRect(x - LW / 2, y - 70, LW, 140);
    }
    if (phun) {
      const f = 1 + 0.15 * Math.sin(t * 40);
      const g = ctx.createRadialGradient(x, y, 5, x, y, 95 * f);
      g.addColorStop(0, '#fff6b0');
      g.addColorStop(0.4, '#ffb02e');
      g.addColorStop(1, 'rgba(255,60,20,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, 95 * f, 0, TAU);
      ctx.fill();
    }
  }

  /** Quái hai bên: rắn vảy / cây gai thò ra từ mép thân rồng, báo hiệu đỏ trên 2 luồng rồi quất ngang */
  private veBen(ctx: CanvasRenderingContext2D, c: ChuongNgai, t: number): void {
    const k = nhipBen(c, t);
    const sm = c.s + c.dai / 2;
    const y = this.py(sm);
    const uMep = c.ben < 0 ? -0.5 : SO_LUONG - 0.5;
    const xMep = this.px(sm, uMep) + c.ben * 60;
    if (k >= BEN_BAO && k < BEN_DANH) {
      ctx.fillStyle = `rgba(255,40,40,${0.18 + 0.15 * Math.sin(t * 25)})`;
      const xa = this.px(sm, c.l - 0.5), xb = this.px(sm, c.l + c.w - 0.5);
      ctx.fillRect(Math.min(xa, xb), y - c.dai / 2, Math.abs(xb - xa), c.dai);
    }
    const vuon = k >= BEN_DANH ? Math.min(1, (k - BEN_DANH) / 0.15) : k >= BEN_BAO ? 0.15 : 0.05;
    const xDau = xMep - c.ben * (60 + vuon * (c.w * LW + 40));
    ctx.lineCap = 'round';
    if (c.loai === 'ran') {
      ctx.strokeStyle = '#3f8f3a';
      ctx.lineWidth = 34;
      ctx.beginPath();
      ctx.moveTo(xMep, y);
      ctx.quadraticCurveTo((xMep + xDau) / 2, y - 40 * Math.sin(t * 8), xDau, y);
      ctx.stroke();
      ctx.fillStyle = '#2f6f2a';
      ctx.beginPath();
      ctx.ellipse(xDau, y, 40, 30, 0, 0, TAU);
      ctx.fill();
      ctx.fillStyle = '#ffe14d';
      ctx.beginPath();
      ctx.arc(xDau - c.ben * 10, y - 12, 7, 0, TAU);
      ctx.arc(xDau - c.ben * 10, y + 12, 7, 0, TAU);
      ctx.fill();
    } else {
      ctx.strokeStyle = '#4e7a2a';
      ctx.lineWidth = 20;
      ctx.beginPath();
      ctx.moveTo(xMep, y);
      ctx.lineTo(xDau, y + 10 * Math.sin(t * 12));
      ctx.stroke();
      ctx.fillStyle = '#c7f07a';
      for (let i = 1; i < 6; i++) {
        const xi = xMep + (xDau - xMep) * (i / 6);
        ctx.beginPath();
        ctx.moveTo(xi, y - 10);
        ctx.lineTo(xi - c.ben * 8, y - 36);
        ctx.lineTo(xi + c.ben * 8, y - 10);
        ctx.fill();
      }
    }
    ctx.lineCap = 'butt';
  }

  private veDoi(ctx: CanvasRenderingContext2D, x: number, y: number, t: number): void {
    const v = Math.sin(t * 18) * 0.6 + 0.4;
    ctx.fillStyle = '#3a0d0d';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 34, y - 14 * v);
    ctx.lineTo(x - 20, y + 6);
    ctx.lineTo(x, y + 12);
    ctx.lineTo(x + 20, y + 6);
    ctx.lineTo(x + 34, y - 14 * v);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ff5a1f';
    ctx.beginPath();
    ctx.arc(x, y + 2, 9, 0, TAU);
    ctx.fill();
  }

  private veUng(ctx: CanvasRenderingContext2D, c: ChuongNgai, x: number, y: number, t: number): void {
    if (c.kich && c.tg > 0) {
      // Báo hiệu: vệt đỏ dọc luồng sắp bị lao xuống
      ctx.fillStyle = `rgba(255,30,30,${0.2 + 0.15 * Math.sin(t * 30)})`;
      ctx.fillRect(x - LW / 2, y, LW, 1600);
    }
    const v = Math.sin(t * 10);
    ctx.fillStyle = '#8f8a86';
    ctx.beginPath();
    ctx.moveTo(x, y + 40);
    ctx.lineTo(x - 80, y - 10 + v * 12);
    ctx.lineTo(x - 20, y - 10);
    ctx.lineTo(x, y - 40);
    ctx.lineTo(x + 20, y - 10);
    ctx.lineTo(x + 80, y - 10 + v * 12);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ffb02e';
    ctx.beginPath();
    ctx.moveTo(x - 8, y + 38);
    ctx.lineTo(x + 8, y + 38);
    ctx.lineTo(x, y + 56);
    ctx.fill();
  }

  private veMa(ctx: CanvasRenderingContext2D, x: number, y: number, t: number): void {
    ctx.save();
    ctx.globalAlpha = 0.75 + 0.2 * Math.sin(t * 5);
    ctx.shadowColor = '#b06bff';
    ctx.shadowBlur = 30;
    ctx.fillStyle = '#5b2a8a';
    ctx.beginPath();
    ctx.ellipse(x, y, 60, 48, 0, 0, TAU);
    ctx.fill();
    ctx.fillStyle = '#e2c6ff';
    ctx.beginPath();
    ctx.arc(x - 22, y + 8, 9, 0, TAU);
    ctx.arc(x + 22, y + 8, 9, 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  /** Rết Đá khổng lồ bò theo sau ở chặng Cổ: thân đốt chắn ngang cả 6 luồng */
  private veRet(ctx: CanvasRenderingContext2D, d: DuaRong, t: number): void {
    const re = d.ret;
    if (!re.chay || re.xong || re.s < this.sMin - 2200 || re.s - 2200 > this.sMax) return;
    for (let i = 14; i >= 0; i--) {
      const s = re.s - i * 140;
      if (s < this.sMin || s > this.sMax) continue;
      const x = tamDuong(s) - this.camX, y = this.py(s);
      const w = (SO_LUONG / 2) * LW + 40;
      ctx.strokeStyle = '#3d2a1a';
      ctx.lineWidth = 12;
      for (const b of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(x + b * w * 0.85, y);
        ctx.lineTo(x + b * (w + 60), y + 30 * Math.sin(t * 14 + i));
        ctx.stroke();
      }
      ctx.fillStyle = i === 0 ? '#5b3a1f' : i % 2 ? '#7a5230' : '#6b4628';
      ctx.beginPath();
      ctx.ellipse(x, y, w, i === 0 ? 110 : 70, 0, 0, TAU);
      ctx.fill();
      if (i === 0) {
        ctx.fillStyle = '#ff3b1f';
        ctx.beginPath();
        ctx.arc(x - 120, y - 40, 22, 0, TAU);
        ctx.arc(x + 120, y - 40, 22, 0, TAU);
        ctx.fill();
        ctx.strokeStyle = '#efe2c4';
        ctx.lineWidth = 18;
        for (const b of [-1, 1]) {
          ctx.beginPath();
          ctx.moveTo(x + b * 60, y - 90);
          ctx.quadraticCurveTo(x + b * 120, y - 200, x + b * (30 + 30 * Math.sin(t * 9)), y - 230);
          ctx.stroke();
        }
      }
    }
  }

  // ─── Rồng ───

  private veRong(ctx: CanvasRenderingContext2D, r: Rong, t: number, chinh: boolean): void {
    if (r.chet > 0 || r.s < this.sMin || r.s > this.sMax) return;
    const x = this.px(r.s, r.u), y = this.py(r.s);
    ctx.save();
    ctx.translate(x, y);
    if (r.roi >= 0) {
      const k = Math.max(0.05, 1 - r.roi / 0.8);
      ctx.globalAlpha = k;
      ctx.scale(k, k);
      ctx.rotate(r.roi * 6);
    }
    // Vòng người chơi dưới chân
    if (r.nguoi >= 0) {
      ctx.strokeStyle = MAU_NGUOI[r.nguoi]!;
      ctx.lineWidth = chinh ? 10 : 7;
      ctx.beginPath();
      ctx.ellipse(0, 0, 78, 60, 0, 0, TAU);
      ctx.stroke();
    }
    // Hiệu ứng sau lưng
    if (r.longKhi > 0) {
      ctx.fillStyle = `rgba(255,170,40,${0.6 + 0.3 * Math.sin(t * 30)})`;
      ctx.beginPath();
      ctx.moveTo(-26, 50);
      ctx.lineTo(0, 170 + 30 * Math.sin(t * 25));
      ctx.lineTo(26, 50);
      ctx.fill();
    }
    if (r.cuoiGio > 0) {
      ctx.strokeStyle = 'rgba(255,255,255,0.8)';
      ctx.lineWidth = 5;
      for (let i = -1; i <= 1; i++) {
        const o = ((t * 600 + i * 50) % 160);
        ctx.beginPath();
        ctx.moveTo(i * 50, 40 + o);
        ctx.lineTo(i * 50, 90 + o);
        ctx.stroke();
      }
    }
    if (r.hoaThan > 0) {
      const g = ctx.createRadialGradient(0, 0, 20, 0, 0, 120);
      g.addColorStop(0, 'rgba(255,200,60,0.7)');
      g.addColorStop(1, 'rgba(255,60,20,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, 0, 120, 0, TAU);
      ctx.fill();
    }
    this.veThanRong(ctx, r, t);
    if (r.trung > 0 && Math.sin(t * 40) > 0) {
      ctx.fillStyle = 'rgba(255,40,40,0.45)';
      ctx.beginPath();
      ctx.arc(0, 0, 60, 0, TAU);
      ctx.fill();
    }
    // Trạng thái
    if (r.khien > 0) this.vong(ctx, 82, 'rgba(110,210,255,0.85)', 'rgba(110,210,255,0.18)');
    if (r.giap > 0) this.vong(ctx, 78, '#c9a36b', 'rgba(150,110,60,0.35)');
    if (r.bong > 0) this.vong(ctx, 88 + 6 * Math.sin(t * 6), 'rgba(160,230,255,0.9)', 'rgba(160,230,255,0.3)');
    if (r.dongBang > 0) {
      ctx.fillStyle = 'rgba(200,240,255,0.65)';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 5;
      ctx.fillRect(-70, -80, 140, 160);
      ctx.strokeRect(-70, -80, 140, 160);
    }
    if (r.quan > 0) {
      ctx.strokeStyle = '#a35bd6';
      ctx.lineWidth = 12;
      ctx.beginPath();
      ctx.ellipse(0, 0, 60, 30, Math.sin(t * 4), 0, TAU);
      ctx.stroke();
    }
    if (r.namCham > 0) {
      ctx.strokeStyle = '#fff27a';
      ctx.lineWidth = 5;
      ctx.setLineDash([16, 14]);
      ctx.lineDashOffset = -t * 120;
      ctx.beginPath();
      ctx.arc(0, 0, 150, 0, TAU);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.lineDashOffset = 0;
    }
    ctx.restore();
    // Tên trên đầu (người chơi)
    if (r.nguoi >= 0 && r.roi < 0) this.chu(ctx, r.ten, x, y - 120, 40, MAU_NGUOI[r.nguoi]!);
  }

  private vong(ctx: CanvasRenderingContext2D, rr: number, vien: string, nen: string): void {
    ctx.fillStyle = nen;
    ctx.strokeStyle = vien;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(0, 0, rr, 0, TAU);
    ctx.fill();
    ctx.stroke();
  }

  /** Rồng nhìn từ trên xuống, đầu hướng lên (về phía trước): thân uốn sóng, cánh vỗ, sừng, mắt */
  private veThanRong(ctx: CanvasRenderingContext2D, r: Rong, t: number): void {
    const pha = t * 9 + r.id;
    const vo = Math.sin(t * 12 + r.id);
    // Cánh
    ctx.fillStyle = r.dl.mau2;
    ctx.globalAlpha *= 0.9;
    for (const b of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(b * 10, -18);
      ctx.lineTo(b * (70 + 18 * vo), -50 - 10 * vo);
      ctx.lineTo(b * (88 + 22 * vo), 0);
      ctx.lineTo(b * 50, 4);
      ctx.lineTo(b * 12, 14);
      ctx.closePath();
      ctx.fill();
    }
    ctx.globalAlpha /= 0.9;
    // Thân: chuỗi đốt uốn sóng, đuôi nhỏ dần
    ctx.fillStyle = r.dl.mau;
    for (let i = 7; i >= 0; i--) {
      const yi = -24 + i * 13;
      const xi = Math.sin(pha - i * 0.7) * (3 + i * 2.2);
      ctx.beginPath();
      ctx.arc(xi, yi, 22 - i * 2.2, 0, TAU);
      ctx.fill();
    }
    // Đầu
    ctx.beginPath();
    ctx.ellipse(0, -44, 20, 26, 0, 0, TAU);
    ctx.fill();
    ctx.fillStyle = r.dl.mau2;
    ctx.beginPath();
    ctx.moveTo(-12, -58); ctx.lineTo(-22, -82); ctx.lineTo(-4, -62);
    ctx.moveTo(12, -58); ctx.lineTo(22, -82); ctx.lineTo(4, -62);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-8, -50, 5, 0, TAU);
    ctx.arc(8, -50, 5, 0, TAU);
    ctx.fill();
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(-8, -52, 2.5, 0, TAU);
    ctx.arc(8, -52, 2.5, 0, TAU);
    ctx.fill();
  }

  // ─── Đạn, hiệu ứng, chữ ───

  private veDan(ctx: CanvasRenderingContext2D, d: DuaRong, t: number): void {
    for (const dn of d.dan) {
      if (dn.s < this.sMin || dn.s > this.sMax) continue;
      const x = this.px(dn.s, dn.u), y = this.py(dn.s);
      ctx.save();
      ctx.translate(x, y);
      switch (dn.loai) {
        case 'bangTien':
          ctx.fillStyle = '#d8f4ff';
          ctx.beginPath();
          ctx.moveTo(0, -46); ctx.lineTo(14, -10); ctx.lineTo(5, -10); ctx.lineTo(5, 40); ctx.lineTo(-5, 40); ctx.lineTo(-5, -10); ctx.lineTo(-14, -10);
          ctx.closePath();
          ctx.fill();
          break;
        default: {
          const mau = dn.loai === 'hoaCau' ? ['#fff3a0', '#ff6a1f'] : dn.loai === 'loiCau' ? ['#fff27a', '#9b5cff'] : dn.loai === 'botNuoc' ? ['#ffffff', '#4fb3ff'] : ['#e2c6ff', '#4a1a7a'];
          const rr = dn.loai === 'loiCau' ? 36 : 28;
          const g = ctx.createRadialGradient(0, 0, 3, 0, 0, rr);
          g.addColorStop(0, mau[0]!);
          g.addColorStop(1, mau[1]!);
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(0, 0, rr * (1 + 0.1 * Math.sin(t * 30)), 0, TAU);
          ctx.fill();
        }
      }
      ctx.restore();
    }
  }

  private veHieuUng(ctx: CanvasRenderingContext2D, d: DuaRong, r: Rong): void {
    for (const h of d.hieu) {
      if (h.s < this.sMin - 400 || h.s > this.sMax + 400) continue;
      const k = h.t / h.dai;
      const x = this.px(h.s, h.u), y = this.py(h.s);
      ctx.save();
      ctx.globalAlpha = 1 - k;
      switch (h.loai) {
        case 'no': case 'khien': case 'hoiSinh':
          ctx.strokeStyle = h.loai === 'khien' ? (h.mau ?? '#9fe8ff') : h.mau ?? '#ffb347';
          ctx.fillStyle = h.loai === 'no' ? h.mau ?? '#ffb347' : 'rgba(0,0,0,0)';
          ctx.lineWidth = 12;
          ctx.beginPath();
          ctx.arc(x, y, 40 + k * 120, 0, TAU);
          if (h.loai === 'no') { ctx.globalAlpha = (1 - k) * 0.6; ctx.fill(); }
          else ctx.stroke();
          break;
        case 'set': {
          ctx.strokeStyle = '#fff27a';
          ctx.lineWidth = 10;
          ctx.beginPath();
          let yy = y - 900;
          ctx.moveTo(x, yy);
          for (let i = 0; i < 8; i++) { yy += 112; ctx.lineTo(x + (i % 2 ? 40 : -40), yy); }
          ctx.lineTo(x, y);
          ctx.stroke();
          break;
        }
        case 'phun': {
          const g = ctx.createLinearGradient(x, y, x, y - 340);
          g.addColorStop(0, 'rgba(255,240,150,0.95)');
          g.addColorStop(1, 'rgba(255,80,20,0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.moveTo(x - 20, y);
          ctx.lineTo(x - LW * 1.5, y - 340);
          ctx.lineTo(x + LW * 1.5, y - 340);
          ctx.lineTo(x + 20, y);
          ctx.fill();
          break;
        }
        case 'bang': case 'chop': case 'luot': {
          const x2 = h.loai === 'luot' ? this.px(h.s, h.u2 ?? h.u) : this.px(h.s2 ?? h.s, h.u2 ?? h.u);
          const y2 = this.py(h.s2 ?? h.s);
          ctx.strokeStyle = h.loai === 'bang' ? '#bfefff' : h.mau ?? '#ffffff';
          ctx.lineWidth = h.loai === 'chop' ? 26 : 14;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x2, y2);
          ctx.stroke();
          break;
        }
        case 'tim':
          this.chu(ctx, '❤️', x, y - 80 - k * 120, 60, '#ff4d6d');
          break;
        case 'vay':
          ctx.strokeStyle = '#ffd23f';
          ctx.lineWidth = 8;
          ctx.beginPath();
          ctx.arc(x, y, 30 + k * 70, 0, TAU);
          ctx.stroke();
          break;
        case 'roi':
          break;
      }
      ctx.restore();
    }
    // Rồng đang chết: dấu chỗ rơi
    if (r.chet > 0) this.chu(ctx, '💀', this.px(r.s, Math.max(-0.5, Math.min(SO_LUONG - 0.5, r.u))), this.py(r.s), 80, '#ffffff');
  }

  /** Chữ bay của người đang xem nửa này */
  private veChu(ctx: CanvasRenderingContext2D, d: DuaRong, r: Rong): void {
    for (const c of d.chu) {
      if (c.p !== r.nguoi) continue;
      ctx.save();
      ctx.globalAlpha = Math.min(1, 2 * (1.4 - c.t));
      this.chu(ctx, c.text, this.px(c.s, c.u), this.py(c.s) - c.t * 120, 44, c.mau);
      ctx.restore();
    }
  }

  /** Chữ có viền đen cho dễ đọc */
  private chu(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, co: number, mau: string, canh: CanvasTextAlign = 'center'): void {
    ctx.font = `bold ${co}px ${FONT}`;
    ctx.textAlign = canh;
    ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = 'rgba(0,0,0,0.85)';
    ctx.lineWidth = Math.max(3, co / 6);
    ctx.strokeText(text, x, y);
    ctx.fillStyle = mau;
    ctx.fillText(text, x, y);
    ctx.lineJoin = 'miter';
  }

  // ─── HUD mỗi nửa ───

  private veHud(ctx: CanvasRenderingContext2D, d: DuaRong, r: Rong, x0Nua: number, wNua: number, H: number, t: number): void {
    const mauP = MAU_NGUOI[r.nguoi] ?? '#ffffff';
    // Chừa chỗ cho nửa vòng tròn avatar ở giữa mép trên (thanh đen trên): nửa trái lùi mép phải, nửa phải lùi mép trái
    const tranh = this.giuaCo ? 64 : 0;
    const x0 = x0Nua + (x0Nua > 0 ? tranh : 0), w = wNua - tranh;
    // Bom Mây: màn hình mờ trắng
    if (r.mu > 0) {
      ctx.fillStyle = `rgba(245,248,255,${0.82 * Math.min(1, r.mu)})`;
      ctx.fillRect(x0Nua, 0, wNua, H);
    }
    // Hạng, tim, vảy
    this.chu(ctx, `${r.hang}/${d.rong.length}`, x0 + 22, 46, 46, r.hang === 1 ? '#ffd23f' : '#ffffff', 'left');
    for (let i = 0; i < TIM_MAX; i++) this.veTim(ctx, x0 + 34 + i * 40, 98, i < r.tim);
    const phan = Math.min(10, Math.floor(r.vay / VAY_MOI));
    this.chu(ctx, `✦ ${r.vay}${phan ? ` (+${phan}%)` : ''}`, x0 + 18, 138, 24, '#ffd23f', 'left');
    // Trạng thái đang có
    const tt: string[] = [];
    if (r.khien > 0) tt.push(`🛡️${Math.ceil(r.khien)}`);
    if (r.longKhi > 0) tt.push(`💨${Math.ceil(r.longKhi)}`);
    if (r.giap > 0) tt.push(`🪨${Math.ceil(r.giap)}`);
    if (r.cuoiGio > 0) tt.push(`🍃${Math.ceil(r.cuoiGio)}`);
    if (r.hoaThan > 0) tt.push(`☄️${Math.ceil(r.hoaThan)}`);
    if (r.namCham > 0) tt.push(`🧲${Math.ceil(r.namCham)}`);
    if (r.dongBang > 0) tt.push(`❄️${Math.ceil(r.dongBang)}`);
    if (r.bong > 0) tt.push(`🫧${Math.ceil(r.bong)}`);
    if (r.cham > 0) tt.push(`🐢${Math.ceil(r.cham)}`);
    if (tt.length) this.chu(ctx, tt.join(' '), x0 + 18, 172, 22, '#ffffff', 'left');
    // Ô vật phẩm (nút A)
    const bx = x0 + w - 108, by = 18;
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.strokeStyle = mauP;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(bx, by, 88, 88, 14);
    ctx.fill();
    ctx.stroke();
    if (r.vp) {
      ctx.font = `52px ${FONT}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(VP_ICON[r.vp], bx + 44, by + 46);
    }
    this.chu(ctx, 'A', bx + 80, by + 80, 22, '#7dff7d');
    // Sơ đồ 6 luồng + hàng vật phẩm sắp tới
    const h = d.hangToi(r.s);
    const ow = Math.min(40, (w - 260) / SO_LUONG);
    const mx = x0 + w / 2 - (ow * SO_LUONG) / 2, my = 18;
    for (let l = 0; l < SO_LUONG; l++) {
      const x = mx + l * ow;
      ctx.fillStyle = Math.round(r.u) === l ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.45)';
      ctx.fillRect(x + 1, my, ow - 2, ow);
      if (Math.round(r.u) === l) { ctx.strokeStyle = mauP; ctx.lineWidth = 3; ctx.strokeRect(x + 1, my, ow - 2, ow); }
      if (h && h.s - r.s < 5000) {
        const vp = h.o[l];
        ctx.font = `${Math.round(ow * 0.62)}px ${FONT}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#fff';
        ctx.fillText(vp ? VP_ICON[vp] : '✖', x + ow / 2, my + ow / 2 + 1);
      }
    }
    if (h && h.s - r.s < 5000) this.chu(ctx, `${Math.round((h.s - r.s) / 10)}m`, x0 + w / 2, my + ow + 16, 18, '#ffffff');
    // Đồng hồ tốc độ dọc (vạch 50%)
    const gx = x0 + w - 34, gy0 = 140, gh = Math.min(300, H * 0.36);
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(gx - 12, gy0, 24, gh);
    const tl = Math.min(1.3, r.toc) / 1.3;
    ctx.fillStyle = r.toc > 1 ? '#ffb02e' : r.toc > TOC_CHET ? '#ff6a5a' : '#6fe08a';
    ctx.fillRect(gx - 9, gy0 + gh * (1 - tl), 18, gh * tl);
    const y50 = gy0 + gh * (1 - TOC_CHET / 1.3), y100 = gy0 + gh * (1 - 1 / 1.3);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(gx - 16, y50 - 2, 32, 4);
    ctx.fillRect(gx - 14, y100 - 1, 28, 2);
    this.chu(ctx, '50%', gx - 20, y50, 16, '#ffffff', 'right');
    // 3 nút skill (X · Y · B)
    const nut = ['X', 'Y', 'B'];
    const mauNut = ['#4da3ff', '#ffd23f', '#ff5a5a'];
    const rr = Math.min(38, w / 12);
    for (let k = 0; k < 3; k++) {
      const cx = x0 + w / 2 + (k - 1) * (rr * 2.6), cy = H - rr - 18;
      const sk = r.dl.skill[k]!;
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.strokeStyle = mauNut[k]!;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(cx, cy, rr, 0, TAU);
      ctx.fill();
      ctx.stroke();
      ctx.font = `${Math.round(rr * 1.05)}px ${FONT}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#fff';
      ctx.fillText(sk.icon, cx, cy + 2);
      const hoi = r.hoi[k]!;
      if (hoi > 0) {
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, rr, -Math.PI / 2, -Math.PI / 2 + TAU * (hoi / sk.hoi));
        ctx.closePath();
        ctx.fill();
        this.chu(ctx, String(Math.ceil(hoi)), cx, cy, Math.round(rr * 0.8), '#ffffff');
      }
      this.chu(ctx, nut[k]!, cx + rr * 0.8, cy - rr * 0.8, 20, mauNut[k]!);
    }
    this.chu(ctx, `${r.dl.ten} · ${r.dl.loai}`, x0 + w / 2, H - rr * 2 - 40, 20, r.dl.mau2);
    // Biển chặng khi vừa vào chặng mới
    const c = changCua(r.s);
    const vao = r.s - CHANG[c]!.s0;
    if (d.dem <= 0 && vao < 2500) {
      ctx.save();
      ctx.globalAlpha = Math.min(1, (2500 - vao) / 800);
      this.chu(ctx, `CHẶNG ${c + 1}: ${CHANG[c]!.ten.toUpperCase()}`, x0 + w / 2, H * 0.26, 40, '#ffffff');
      ctx.restore();
    }
    // Cảnh báo Rết Đá sau lưng, gió
    const re = d.ret;
    if (re.chay && !re.xong && r.s > re.s - 200 && r.s - re.s < 1600 && !re.daDop.has(r.id) && Math.sin(t * 12) > -0.3)
      this.chu(ctx, '⚠ RẾT ĐÁ ĐUỔI SAU LƯNG!', x0 + w / 2, H - rr * 2 - 76, 30, '#ff5a3a');
    if (d.dem <= 0 && d.gio !== 1) this.chu(ctx, d.gio > 1 ? '🌬 GIÓ XUÔI' : '🌬 GIÓ NGƯỢC', x0 + w / 2, H * 0.2, 24, d.gio > 1 ? '#bfffbf' : '#ffbfbf');
    // Chết: đếm ngược hồi sinh
    if (r.chet > 0) {
      ctx.fillStyle = 'rgba(0,0,0,0.45)';
      ctx.fillRect(x0Nua, 0, wNua, H);
      this.chu(ctx, 'HỒI SINH', x0 + w / 2, H * 0.4, 44, '#ffffff');
      this.chu(ctx, String(Math.ceil(r.chet)), x0 + w / 2, H * 0.52, 130, '#ffd23f');
    }
    // Đếm ngược xuất phát
    if (d.dem > 0) this.chu(ctx, String(Math.ceil(d.dem)), x0 + w / 2, H * 0.45, 160, '#ffd23f');
    else if (d.t - DEM_NGUOC < 0.8) this.chu(ctx, 'BAY!', x0 + w / 2, H * 0.45, 130, '#7dff7d');
  }

  private veTim(ctx: CanvasRenderingContext2D, x: number, y: number, day: boolean): void {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.moveTo(0, 12);
    ctx.bezierCurveTo(-24, -4, -14, -22, 0, -10);
    ctx.bezierCurveTo(14, -22, 24, -4, 0, 12);
    ctx.fillStyle = day ? '#ff3b5c' : 'rgba(0,0,0,0.5)';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();
  }

  /** Thanh tiến trình hình con rồng: đuôi dưới, đầu (ngọc 6 sao) trên, chấm màu từng rồng */
  private veTienTrinh(ctx: CanvasRenderingContext2D, d: DuaRong, x: number, H: number, t: number, veNgoc: (ctx: CanvasRenderingContext2D, x: number, y: number, k: number) => void): void {
    const y0 = H - 40, y1 = 175;
    const yS = (s: number) => y0 - (Math.max(0, Math.min(DUONG_DAI, s)) / DUONG_DAI) * (y0 - y1);
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#3b6b52';
    ctx.lineWidth = 18;
    ctx.beginPath();
    for (let y = y0; y >= y1; y -= 10) ctx.lineTo(x + Math.sin(y / 40) * 6, y);
    ctx.stroke();
    ctx.lineCap = 'butt';
    // Vạch chặng
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    for (const c of CHANG) ctx.fillRect(x - 14, yS(c.s0) - 1, 28, 2);
    ctx.save();
    ctx.translate(x, y1 - 26);
    veNgoc(ctx, 0, 0, 0.16);
    ctx.restore();
    for (const r of [...d.rong].sort((a, b) => (a.nguoi >= 0 ? 1 : 0) - (b.nguoi >= 0 ? 1 : 0))) {
      const y = yS(r.s);
      ctx.fillStyle = r.dl.mau;
      ctx.beginPath();
      ctx.arc(x, y, r.nguoi >= 0 ? 11 : 8, 0, TAU);
      ctx.fill();
      if (r.nguoi >= 0) {
        ctx.strokeStyle = MAU_NGUOI[r.nguoi]!;
        ctx.lineWidth = 4;
        ctx.stroke();
      }
    }
    // Rết Đá
    if (d.ret.chay && !d.ret.xong && Math.sin(t * 8) > 0) {
      ctx.fillStyle = '#ff5a3a';
      ctx.fillRect(x - 14, yS(d.ret.s) - 3, 28, 6);
    }
  }
}
