// Frieza: quái của thần điện (map `THAN` trong ban-do.ts). Hiện chỉ đi loanh quanh điện thờ (chưa đánh nhau, không bị đánh).
// Đường đi: chuỗi điểm hình chữ U ôm điện thờ (hông trái → sân trước → hông phải), đều nằm ngoài vật cản THAN_CHAN nên đi thẳng giữa hai điểm liền nhau.
// Mỗi lượt: đứng thở FZ_NGHI giây rồi chọn ngẫu nhiên một điểm khác trên chuỗi, đi lần lượt qua các điểm ở giữa tới đó.
// File này chỉ có dữ liệu + hàm thuần; Game gọi `capNhatFrieza()` mỗi khung, vẽ ở ve-canvas.ts (`veFrieza()`). Không lưu ván (tải lại thì đứng ở sân trước).
// Sprite: web/public/assets/game/frieza_atlas.png (dựng bằng tools/tao-atlas-frieza.py từ sheet người dùng gửi), 6 khung 80×84, neo đáy giữa, quay mặt PHẢI.
import type { KhungSprite } from './sprite';
import { THAN, THAN_TL } from './ban-do';

export const SP_FRIEZA: KhungSprite = { atlas: 'assets/game/frieza_atlas.png', atlasW: 480, atlasH: 84, w: 80, h: 84, cot: 6, neoX: 40, neoY: 82 };
export const FZ_KHUNG = { dung: [0, 1], di: [2, 3, 4, 5] } as const;
export const FZ_TEN = 'Frieza';
/** Độ to (nhân khung 80 điểm ảnh; thân cao ~70 → ~245, nhỉnh hơn Mabu / Zinbu) */
export const FZ_TO = 3.5;
/** Tốc độ đi bộ thật (px/s; nhân vật đi bộ 460) */
export const FZ_TOC = 170;
/** Đứng thở giữa hai lượt đi (giây, ngẫu nhiên trong khoảng) */
export const FZ_NGHI: [number, number] = [1.5, 4];
/** Nhịp animation (khung / giây) */
export const FZ_FPS_DI = 7;
export const FZ_FPS_DUNG = 1.5;

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
}

export function taoFrieza(): Frieza {
  const i = 4;
  const p = FZ_DUONG[i]!;
  return { x: p.x, y: p.y, lat: false, i, dich: i, nghi: 2, t: 0 };
}

/** Đi loanh quanh điện thờ */
export function capNhatFrieza(f: Frieza, dt: number): void {
  f.t += dt;
  if (f.nghi > 0) {
    f.nghi -= dt;
    if (f.nghi <= 0) {
      // Chọn đích khác chỗ đang đứng, cách ít nhất 2 điểm cho đi được một quãng
      let d = f.i;
      while (Math.abs(d - f.i) < 2) d = Math.floor(Math.random() * FZ_DUONG.length);
      f.dich = d;
    }
    return;
  }
  let con = FZ_TOC * dt;
  while (con > 0) {
    if (f.i === f.dich) {
      f.nghi = FZ_NGHI[0] + Math.random() * (FZ_NGHI[1] - FZ_NGHI[0]);
      return;
    }
    const tiep = f.i + Math.sign(f.dich - f.i);
    const p = FZ_DUONG[tiep]!;
    const dx = p.x - f.x, dy = p.y - f.y, d = Math.hypot(dx, dy);
    if (Math.abs(dx) > 1) f.lat = dx < 0;
    if (d <= con) { f.x = p.x; f.y = p.y; f.i = tiep; con -= d; }
    else { f.x += (dx / d) * con; f.y += (dy / d) * con; con = 0; }
  }
}

/** Khung sprite hiện tại */
export function fzKhung(f: Frieza): number {
  if (f.nghi > 0) return FZ_KHUNG.dung[Math.floor(f.t * FZ_FPS_DUNG) % FZ_KHUNG.dung.length]!;
  return FZ_KHUNG.di[Math.floor(f.t * FZ_FPS_DI) % FZ_KHUNG.di.length]!;
}
