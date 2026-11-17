// Frieza: quái của thần điện (map `THAN` trong ban-do.ts). Không có ai thì đi loanh quanh điện thờ; nhân vật lên thần điện mà nhìn thấy Frieza thì Frieza đuổi đánh (đấm, chưởng; logic trong Game `capNhatFz()`)
// và cứ ~10s biến thành Golden Frieza 15s (mọi chỉ số ×2). Chỉ Super Bư (hợp thể) đánh Frieza mất máu.
// Đường đi: chuỗi điểm hình chữ U ôm điện thờ (hông trái → sân trước → hông phải), đều nằm ngoài vật cản thần điện (THAN_VAT) nên đi thẳng giữa hai điểm liền nhau.
// Mỗi lượt: đứng thở FZ_NGHI giây rồi chọn ngẫu nhiên một điểm khác trên chuỗi, đi lần lượt qua các điểm ở giữa tới đó.
// File này chỉ có dữ liệu + hàm thuần; Game gọi `capNhatFrieza()` mỗi khung, vẽ ở ve-canvas.ts (`veFrieza()`). Không lưu ván (tải lại thì đứng ở sân trước).
// Sprite: web/public/assets/game/frieza_atlas.png (dựng bằng tools/tao-atlas-frieza.py từ sheet người dùng gửi), 6 khung 80×84, neo đáy giữa, quay mặt PHẢI.
import type { KhungSprite } from './sprite';
import { THAN, THAN_TL } from './ban-do';

export const SP_FRIEZA: KhungSprite = { atlas: 'assets/game/frieza_atlas.png', atlasW: 480, atlasH: 84, w: 80, h: 84, cot: 6, neoX: 40, neoY: 82 };
export const FZ_KHUNG = { dung: [0, 1], di: [2, 3, 4, 5] } as const;
export const FZ_TEN = 'Frieza';
export const FZ_TEN_VANG = 'Golden Frieza';

/**
 * Chiêu đặc biệt: biến thành Golden Frieza. Sprite web/public/assets/game/golden_frieza.png (tools/tao-atlas-golden-frieza.py từ sheet người dùng gửi),
 * 7 khung 512×768 ngang, chân ở y = 750, ảnh vẽ tay (vẽ có làm mịn), quay mặt TRÁI (ngược pixel Frieza).
 * Khung: 0 đứng thủ thế · 1 khoanh tay tập trung · 2 bùng hào quang · 3 tụ lực trong tay · 4 nâng cầu năng lượng · 5 cầu cực đại · 6 phóng chưởng.
 * Nhân vật nhìn thấy Frieza (`thay`) mà chiêu đã hồi thì đứng yên biến hình (chạy lần lượt khung 0 → 6 theo FZ_VANG_NHIP),
 * xong thì ở dạng vàng FZ_VANG_T giây (đứng / đi dùng khung 0, đi nhanh hơn ×FZ_VANG_TOC), rồi trở lại dạng thường và hồi FZ_VANG_HOI giây.
 */
export const SP_FRIEZA_VANG: KhungSprite = { atlas: 'assets/game/golden_frieza.png', atlasW: 3584, atlasH: 768, w: 512, h: 768, cot: 7, neoX: 256, neoY: 750 };
/** Độ to dạng vàng (thân cao ~520 điểm ảnh nguồn → ~310, to hơn dạng thường ~245) */
export const FZ_VANG_TO = 0.6;
/** Thời gian từng khung biến hình (giây, theo animation.json của sheet) */
export const FZ_VANG_NHIP = [0.4, 0.35, 0.3, 0.3, 0.3, 0.45, 0.6];
export const FZ_VANG_BIEN_T = FZ_VANG_NHIP.reduce((a, b) => a + b, 0);
/** Khung bùng hào quang / phóng chưởng (Game nổ, rung màn ở các khung này) */
export const FZ_VANG_AURA = 2;
export const FZ_VANG_PHONG = 6;
/** Ở dạng vàng bao lâu (giây), hồi chiêu sau khi trở lại dạng thường (~10s một lần, tồn tại 15s) */
export const FZ_VANG_T = 15;
export const FZ_VANG_HOI = 10;
/** Dạng vàng: MỌI chỉ số gấp FZ_VANG_GAP: máu (tối đa và hiện có theo tỉ lệ), sát thương, tốc độ đi / chạy, tốc độ đánh / hồi chưởng, phòng thủ (nhận ÷2), tự hồi máu */
export const FZ_VANG_GAP = 2;
/** Độ to (nhân khung 80 điểm ảnh; thân cao ~70 → ~245, nhỉnh hơn Mabu / Zinbu) */
export const FZ_TO = 3.5;
/** Tốc độ đi bộ thật (px/s; nhân vật đi bộ 460) */
export const FZ_TOC = 170;
/** Đứng thở giữa hai lượt đi (giây, ngẫu nhiên trong khoảng) */
export const FZ_NGHI: [number, number] = [1.5, 4];
/** Nhịp animation (khung / giây) */
export const FZ_FPS_DI = 7;
export const FZ_FPS_DUNG = 1.5;

/**
 * Chỉ số chiến đấu của Frieza (dạng thường; dạng vàng nhân FZ_VANG_GAP qua `fzGap()`).
 * Mabu / Zinbu chưa hợp thể đánh Frieza không mất máu (Game `trungFz()`), chỉ Super Bư (hợp thể, chỉ làm được trên thần điện) mới gây sát thương,
 * còn giáp FZ_GIAP. Cân bằng theo Super Bư lúc vào ván (5 × (150 + 150) = 1500 máu, Đấm 600 mỗi 0,4s ≈ 1500 sát thương / giây):
 * dạng thường mất ~375 / s (trừ hồi 30 / s) ⇒ ~8s đánh liên tục; dạng vàng chỉ ~190 / s trên 6000 máu, hồi 60 / s ⇒ gần như không hạ được, nên né chờ hết vàng.
 * Frieza đánh Mabu / Zinbu thường: Đấm 150 (nhận 75) ⇒ 2 đòn gục người mới vào ván, chưởng 400 (nhận 200) một phát gục ⇒ bắt buộc hợp thể.
 */
export const FZ_HP = 3000;
export const FZ_SAT = 150;
export const FZ_CHUONG_SAT = 400;
/** Tốc độ chạy khi đánh (px/s; nhân vật chạy 460, dạng vàng ×2 = 520 nhanh hơn chạy bộ, phải bay để né) */
export const FZ_TOC_DANH = 260;
/** Giây giữa 2 đòn đấm / đá, hồi chưởng */
export const FZ_HOI = 0.9;
export const FZ_CHUONG_HOI = 2;
export const FZ_HOI_MAU = 30;
/** Giáp: Super Bư đánh chỉ lọt (1 − FZ_GIAP) */
export const FZ_GIAP = 0.75;
/** Tầm đấm (chạm thân), chưởng: xa hơn FZ_CHUONG_XA mới bắn, tầm FZ_CHUONG_TAM, vận FZ_CHUONG_NAP giây (đứng yên, báo hiệu) */
export const FZ_CHAM = 150;
export const FZ_CHUONG_XA = 350;
export const FZ_CHUONG_TAM = 500;
export const FZ_CHUONG_NAP = 0.8;
/** Bán kính thân (trúng đòn), tâm thân cao (dạng thường / vàng) */
export const FZ_BK = 110;
export const FZ_TAM_CAO = 120;
export const FZ_TAM_CAO_VANG = 190;
/** Điểm khi hạ Frieza, thời gian xác mờ dần */
export const FZ_DIEM = 1000;
export const FZ_CHET_T = 2;
/** Thời gian ra một đòn (lao người tới) */
export const FZ_DANH_T = 0.3;

/** Chuỗi điểm quanh điện thờ (điểm ảnh của than_dien.png) */
const DUONG_ANH: [number, number][] = [
  [135, 90], [135, 170], [150, 250], [262, 256], [360, 262], [458, 256], [570, 250], [585, 170], [585, 90],
];
export const FZ_DUONG = DUONG_ANH.map(([x, y]) => ({ x: THAN.x0 + x * THAN_TL, y: THAN.y0 + y * THAN_TL }));

export interface Frieza {
  x: number; y: number;
  /** Quay mặt trái (sprite gốc quay phải) */
  lat: boolean;
  /** Điểm đang đứng / vừa qua trên chuỗi, điểm đích của lượt đi */
  i: number; dich: number;
  /** Còn đứng thở bao lâu (> 0 là đang đứng) */
  nghi: number;
  /** Đồng hồ animation */
  t: number;
  /** Máu (khởi đầu FZ_HP) */
  hp: number;
  /** Đang biến hình: giây đã chạy (< 0 là không biến hình) */
  bien: number;
  /** Giây còn ở dạng Golden Frieza (> 0 là đang vàng) */
  vang: number;
  /** Giây còn hồi chiêu biến hình */
  hoiVang: number;
  /** Chiến đấu (không lưu ván trừ hp / chet): đang ra đòn (giây còn lại), chờ đòn / chưởng kế tiếp (giây), đang vận chưởng (giây đã vận, mục tiêu) */
  danh: number; choDanh: number; choChuong: number;
  nap?: { t: number; x: number; y: number };
  /** Đang đánh nhau (rời đường đi); hết trận thì đi về điểm gần nhất trên chuỗi rồi đi tuần tiếp */
  chien: boolean;
  /** Trúng đòn nháy sáng (giây), lần cuối hiện chữ "không xước" */
  nhay: number; chuMien: number;
  chet: boolean; tChet: number;
  /** Mây của Mabu chạm lần kế tiếp sau thời điểm này */
  chamMay?: number;
}

/** Sự kiện của chiêu biến hình trong khung vừa cập nhật (Game hiện chữ, nổ, rung màn) */
export type SuKienFz = 'batDau' | 'aura' | 'phong' | 'xong' | 'het' | null;

export function taoFrieza(): Frieza {
  const i = 4;
  const p = FZ_DUONG[i]!;
  return { x: p.x, y: p.y, lat: false, i, dich: i, nghi: 2, t: 0, hp: FZ_HP, bien: -1, vang: 0, hoiVang: 0, danh: 0, choDanh: 0, choChuong: 1, chien: false, nhay: 0, chuMien: -99, chet: false, tChet: 0 };
}

/** Khung biến hình ứng với số giây đã chạy */
function khungBien(t: number): number {
  let c = 0;
  for (let k = 0; k < FZ_VANG_NHIP.length; k++) {
    c += FZ_VANG_NHIP[k]!;
    if (t < c) return k;
  }
  return FZ_VANG_NHIP.length - 1;
}

/**
 * Đi loanh quanh điện thờ; `thay` = nhân vật đang nhìn thấy Frieza, `huongX` = x của nhân vật gần nhất (quay mặt về đó lúc biến hình).
 * Trả sự kiện của chiêu biến hình (nếu có) để Game làm hiệu ứng.
 */
export function capNhatFrieza(f: Frieza, dt: number, thay = false, huongX?: number): SuKienFz {
  f.t += dt;
  let su: SuKienFz = null;
  if (f.hoiVang > 0) f.hoiVang -= dt;
  // Đang biến hình: đứng yên chạy hết các khung
  if (f.bien >= 0) {
    const k0 = khungBien(f.bien);
    f.bien += dt;
    const k1 = khungBien(f.bien);
    if (k0 < FZ_VANG_AURA && k1 >= FZ_VANG_AURA) su = 'aura';
    if (k0 < FZ_VANG_PHONG && k1 >= FZ_VANG_PHONG) su = 'phong';
    if (f.bien >= FZ_VANG_BIEN_T) { f.bien = -1; f.vang = FZ_VANG_T; f.nghi = 1; f.hp *= FZ_VANG_GAP; su = 'xong'; }
    return su;
  }
  if (f.vang > 0) {
    f.vang -= dt;
    if (f.vang <= 0) { f.vang = 0; f.hoiVang = FZ_VANG_HOI; f.hp = Math.max(1, f.hp / FZ_VANG_GAP); su = 'het'; }
  } else if (thay && f.hoiVang <= 0) {
    // Chiêu đặc biệt: thấy nhân vật thì biến thành Golden Frieza
    f.bien = 0;
    if (huongX !== undefined && Math.abs(huongX - f.x) > 1) f.lat = huongX < f.x;
    return 'batDau';
  }
  // Đang đánh nhau: Game tự lái (fzDiToi), ở đây chỉ chạy chiêu biến hình
  if (f.chien) return su;
  const toc = FZ_TOC * fzGap(f);
  // Vừa hết trận: đi thẳng về điểm f.i trên chuỗi rồi mới đi tuần tiếp
  const ve = FZ_DUONG[f.i]!;
  if (Math.hypot(ve.x - f.x, ve.y - f.y) > 2 && f.nghi <= 0 && f.dich === f.i) {
    fzDiToi(f, ve.x, ve.y, toc, dt);
    return su;
  }
  if (f.nghi > 0) {
    f.nghi -= dt;
    if (f.nghi <= 0) {
      // Chọn đích khác chỗ đang đứng, cách ít nhất 2 điểm cho đi được một quãng
      let d = f.i;
      while (Math.abs(d - f.i) < 2) d = Math.floor(Math.random() * FZ_DUONG.length);
      f.dich = d;
    }
    return su;
  }
  let con = toc * dt;
  while (con > 0) {
    if (f.i === f.dich) {
      f.nghi = FZ_NGHI[0] + Math.random() * (FZ_NGHI[1] - FZ_NGHI[0]);
      return su;
    }
    const tiep = f.i + Math.sign(f.dich - f.i);
    const p = FZ_DUONG[tiep]!;
    const dx = p.x - f.x, dy = p.y - f.y, d = Math.hypot(dx, dy);
    if (Math.abs(dx) > 1) f.lat = dx < 0;
    if (d <= con) { f.x = p.x; f.y = p.y; f.i = tiep; con -= d; }
    else { f.x += (dx / d) * con; f.y += (dy / d) * con; con = 0; }
  }
  return su;
}

/** Hệ số chỉ số: dạng vàng (sau khi biến hình xong) gấp FZ_VANG_GAP */
export function fzGap(f: Frieza): number {
  return f.vang > 0 ? FZ_VANG_GAP : 1;
}

/** Máu tối đa hiện tại (dạng vàng gấp đôi) */
export function fzHpMax(f: Frieza): number {
  return FZ_HP * fzGap(f);
}

/** Đi thẳng tới (x, y) tốc độ `toc` (Game kẹp lại trong thần điện / ra khỏi vật cản sau đó) */
export function fzDiToi(f: Frieza, x: number, y: number, toc: number, dt: number): void {
  const dx = x - f.x, dy = y - f.y, d = Math.hypot(dx, dy);
  if (d < 1) return;
  const b = Math.min(d, toc * dt);
  f.x += (dx / d) * b;
  f.y += (dy / d) * b;
  if (Math.abs(dx) > 1) f.lat = dx < 0;
}

/** Hết trận: về điểm gần nhất trên chuỗi đường đi */
export function fzVeDuong(f: Frieza): void {
  let iMin = 0, dMin = Infinity;
  FZ_DUONG.forEach((p, i) => { const d = Math.hypot(p.x - f.x, p.y - f.y); if (d < dMin) { dMin = d; iMin = i; } });
  f.chien = false;
  f.nap = undefined;
  f.i = f.dich = iMin;
  f.nghi = 0;
}

/** Đang vẽ bằng sprite Golden Frieza (đang biến hình hoặc đang ở dạng vàng) */
export function fzVang(f: Frieza): boolean {
  return f.bien >= 0 || f.vang > 0;
}

/** Khung Golden Frieza hiện tại: đang biến hình thì theo thời gian, dạng vàng thì đứng thủ thế (khung 0) */
export function fzKhungVang(f: Frieza): number {
  return f.bien >= 0 ? khungBien(f.bien) : 0;
}

/** Khung sprite hiện tại */
export function fzKhung(f: Frieza): number {
  if (f.nghi > 0) return FZ_KHUNG.dung[Math.floor(f.t * FZ_FPS_DUNG) % FZ_KHUNG.dung.length]!;
  return FZ_KHUNG.di[Math.floor(f.t * FZ_FPS_DI) % FZ_KHUNG.di.length]!;
}
