// Frieza: quái của thần điện (map `THAN` trong ban-do.ts). Hiện đi loanh quanh điện thờ, thấy nhân vật thì dùng chiêu đặc biệt biến thành Golden Frieza (chưa đánh nhau, không bị đánh).
// Đường đi: chuỗi điểm hình chữ U ôm điện thờ (hông trái → sân trước → hông phải), đều nằm ngoài vật cản thần điện (THAN_VAT) nên đi thẳng giữa hai điểm liền nhau.
// Mỗi lượt: đứng thở FZ_NGHI giây rồi chọn ngẫu nhiên một điểm khác trên chuỗi, đi lần lượt qua các điểm ở giữa tới đó.
// File này chỉ có dữ liệu + hàm thuần; Game gọi `capNhatFrieza()` mỗi khung, vẽ ở ve-canvas.ts (`veFrieza()`). Không lưu ván (tải lại thì đứng ở sân trước).
// Sprite: web/public/assets/game/frieza_atlas.png (dựng bằng tools/tao-atlas-frieza.py từ sheet người dùng gửi), 6 khung 80×84, neo đáy giữa, quay mặt PHẢI.
import type { KhungSprite } from './sprite';
import { THAN, THAN_TL } from './ban-do';
import { CELL_HP, CELL_SAT, CELL_CHUONG_SAT, CELL_TOC, CELL_HOI, CELL_CHUONG_HOI, CELL_NE, CELL_GIAP, SO_CAP } from './cell';

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
/** Ở dạng vàng bao lâu (giây), hồi chiêu sau khi trở lại dạng thường */
export const FZ_VANG_T = 20;
export const FZ_VANG_HOI = 25;
/** Dạng vàng: đi nhanh hơn; sát thương ×FZ_VANG_SAT, nhận sát thương ×FZ_VANG_NHAN (dùng khi code chiến đấu của Frieza) */
export const FZ_VANG_TOC = 1.6;
export const FZ_VANG_SAT = 2;
export const FZ_VANG_NHAN = 0.5;
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
 * Chỉ số chiến đấu của Frieza: gấp `FZ_GAP` = 2 lần Cell đỏ (Cell bạo nộ, cấp cao nhất) hiện tại, tính thẳng từ hằng của Cell nên chỉnh Cell đỏ thì Frieza theo.
 * Máu, sát thương đấm / đá, sát thương chưởng, tốc độ chạy khi đánh, tự hồi máu: ×2. Tốc độ đánh / hồi chưởng nhanh gấp 2 (thời gian chờ ÷2).
 * Né và giáp là tỉ lệ (Cell đỏ 70%) nên không nhân 2 được (sẽ quá 100%): gấp 2 "phần còn trúng" theo nghĩa ngược, tức phần lọt qua chỉ còn một nửa
 * (né 70% → 85%, giáp 70% → 85%). Hiện Frieza chưa đánh nhau (chỉ đi loanh quanh), các số này dùng khi code chiến đấu.
 */
export const FZ_GAP = 2;
const DO = SO_CAP - 1;
export const FZ_HP = CELL_HP[DO]! * FZ_GAP;
export const FZ_SAT = CELL_SAT[DO]! * FZ_GAP;
export const FZ_CHUONG_SAT = CELL_CHUONG_SAT[DO]! * FZ_GAP;
export const FZ_TOC_DANH = CELL_TOC[DO]! * FZ_GAP;
export const FZ_HOI = CELL_HOI[DO]! / FZ_GAP;
export const FZ_CHUONG_HOI = CELL_CHUONG_HOI[DO]! / FZ_GAP;
/** Cell đỏ tự hồi 30 máu/s (`CELL_HOI_MAU_NGOC` trong game.ts) */
export const FZ_HOI_MAU = 30 * FZ_GAP;
export const FZ_NE = 1 - (1 - CELL_NE[DO]!) / FZ_GAP;
export const FZ_GIAP = 1 - (1 - CELL_GIAP) / FZ_GAP;

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
}

/** Sự kiện của chiêu biến hình trong khung vừa cập nhật (Game hiện chữ, nổ, rung màn) */
export type SuKienFz = 'batDau' | 'aura' | 'phong' | 'xong' | 'het' | null;

export function taoFrieza(): Frieza {
  const i = 4;
  const p = FZ_DUONG[i]!;
  return { x: p.x, y: p.y, lat: false, i, dich: i, nghi: 2, t: 0, hp: FZ_HP, bien: -1, vang: 0, hoiVang: 0 };
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
    if (f.bien >= FZ_VANG_BIEN_T) { f.bien = -1; f.vang = FZ_VANG_T; f.nghi = 1; su = 'xong'; }
    return su;
  }
  if (f.vang > 0) {
    f.vang -= dt;
    if (f.vang <= 0) { f.vang = 0; f.hoiVang = FZ_VANG_HOI; su = 'het'; }
  } else if (thay && f.hoiVang <= 0) {
    // Chiêu đặc biệt: thấy nhân vật thì biến thành Golden Frieza
    f.bien = 0;
    if (huongX !== undefined && Math.abs(huongX - f.x) > 1) f.lat = huongX < f.x;
    return 'batDau';
  }
  const toc = f.vang > 0 ? FZ_TOC * FZ_VANG_TOC : FZ_TOC;
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
