// Tiệc sinh nhật của Cell: lúc bắt đầu ván, các Cell của đảo đông nhất ngồi quây thành vòng tròn quanh một cái bánh, bắn chưởng vào bánh và hát "Happy Birthday".
// Tiệc tan khi có nhân vật lại gần (Cell ngửi thấy) hoặc có Cell bị đánh; bánh vẫn ở lại cháy.
// File này chỉ có dữ liệu + hàm thuần; logic chạy trong Game (`capNhatTiec()`), vẽ trong ve-canvas.ts (`veBanh()`), tiếng hát trong am-thanh.ts (`hatTiec()`).
import type { KhungSprite } from './sprite';
import type { Cell } from './cell';
import { CELL_SO_DAO } from './cell';
import { daoCua, doSau, DAO } from './ban-do';

/** Bánh: 8 khung ngọn lửa (4 cột × 2 hàng, khung 256×512), neo ở đáy đĩa bánh */
export const SP_BANH: KhungSprite = { atlas: 'assets/game/banh_sinh_nhat.png', atlasW: 1024, atlasH: 1024, w: 256, h: 512, cot: 4, neoX: 128, neoY: 500 };
export const BANH_KHUNG = 8;
/** Độ to của bánh (nhân kích thước khung) và số khung lửa mỗi giây */
export const BANH_TO = 0.6;
export const BANH_FPS = 9;
/** Bán kính vòng tròn Cell quanh bánh */
export const TIEC_BK = 280;
/** Cell đang tiệc chỉ ngửi thấy nhân vật trong tầm này (nhỏ hơn bình thường: đang mải hát) */
export const TIEC_NGUI = 450;
/** Mỗi Cell bắn chưởng vào bánh cách nhau (giây), chưởng bay `TIEC_CHUONG_T` giây */
export const TIEC_BAN_MIN = 1.1;
export const TIEC_BAN_MAX = 2.4;
export const TIEC_CHUONG_T = 0.55;

export interface Tiec {
  x: number; y: number; on: boolean; t: number;
}
/** Chưởng đang bay từ Cell tới bánh (chỉ để đẹp, không lưu ván) */
export interface ChuongTiec { id: number; x0: number; y0: number; x1: number; y1: number; t: number }

// ─── Bài hát ───
export const TEMPO = 0.5; // giây mỗi nhịp
export const LOI = ['Happy birthday to you~', 'Happy birthday to you~', 'Happy birthday dear Cell~', 'Happy birthday to you!'];
// [bán âm so với Đô 4, số nhịp, dòng lời]
const N: [number, number, number][] = [
  [7, 0.75, 0], [7, 0.25, 0], [9, 1, 0], [7, 1, 0], [12, 1, 0], [11, 2, 0],
  [7, 0.75, 1], [7, 0.25, 1], [9, 1, 1], [7, 1, 1], [14, 1, 1], [12, 2, 1],
  [7, 0.75, 2], [7, 0.25, 2], [19, 1, 2], [16, 1, 2], [12, 1, 2], [11, 1, 2], [9, 2, 2],
  [17, 0.75, 3], [17, 0.25, 3], [16, 1, 3], [12, 1, 3], [14, 1, 3], [12, 2, 3],
];
export interface NotHat { ban: number; bat: number; dai: number; dong: number }
export const BAI: NotHat[] = (() => {
  let t = 0;
  return N.map(([ban, nhip, dong]) => { const n = { ban, bat: t, dai: nhip * TEMPO, dong }; t += nhip * TEMPO; return n; });
})();
const HET_BAI = BAI[BAI.length - 1]!.bat + BAI[BAI.length - 1]!.dai;
/** Hát xong nghỉ rồi hát lại */
export const NGHI_BAI = 3.5;
export const CHU_KY_BAI = HET_BAI + NGHI_BAI;
export const tanSo = (ban: number) => 261.63 * Math.pow(2, ban / 12);
/** NotHat đang hát ở giây `t` của tiệc (lặp lại): chỉ số nốt, -1 nếu đang nghỉ */
export function notDangHat(t: number): number {
  const u = t % CHU_KY_BAI;
  if (u >= HET_BAI) return -1;
  for (let i = BAI.length - 1; i >= 0; i--) if (u >= BAI[i]!.bat) return i;
  return -1;
}
/** Dòng lời đang hiện (đang hát hoặc vừa hát xong): -1 chưa hát */
export function loiDangHat(t: number): number {
  const u = t % CHU_KY_BAI;
  if (u >= HET_BAI) return -1;
  const i = notDangHat(t);
  return i < 0 ? -1 : BAI[i]!.dong;
}

/**
 * Dựng tiệc: lấy các Cell của đảo đông nhất, xếp thành vòng tròn quanh một điểm trên cát (cả vòng nằm trên cát), quay mặt vào bánh.
 * Không tìm được chỗ đủ rộng thì thu nhỏ vòng. Trả null nếu không có Cell nào.
 */
export function taoTiec(cell: Cell[]): Tiec | null {
  let dao = 0;
  CELL_SO_DAO.forEach((n, i) => { if (n > CELL_SO_DAO[dao]!) dao = i; });
  const ds = cell.filter((c) => daoCua(c.x, c.y) === dao && !c.chet);
  if (!ds.length) return null;
  const d = DAO[dao]!;
  const hop = (cx: number, cy: number, bk: number) => {
    for (let i = 0; i < ds.length; i++) {
      const g = (i / ds.length) * Math.PI * 2;
      const x = cx + Math.cos(g) * bk, y = cy + Math.sin(g) * bk;
      if (doSau(x, y) < 220 || daoCua(x, y) !== dao) return false;
    }
    return doSau(cx, cy) > 220;
  };
  let tam = { x: d.x, y: d.y }, bk = TIEC_BK, xong = false;
  for (let thu = 0; thu < 6 && !xong; thu++) {
    bk = TIEC_BK * (1 - thu * 0.1);
    for (let k = 0; k < 400; k++) {
      const g = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random()) * d.r * 0.7;
      const x = d.x + Math.cos(g) * r, y = d.y + Math.sin(g) * r;
      if (hop(x, y, bk)) { tam = { x, y }; xong = true; break; }
    }
  }
  const g0 = Math.random() * Math.PI * 2;
  ds.forEach((c, i) => {
    const g = g0 + (i / ds.length) * Math.PI * 2;
    c.x = c.hx = c.dx = tam.x + Math.cos(g) * bk;
    c.y = c.hy = c.dy = tam.y + Math.sin(g) * bk * 0.8;
    c.lat = tam.x < c.x;
    c.tiec = true;
    c.banTiec = Math.random() * TIEC_BAN_MAX;
    c.chay = false;
  });
  return { x: tam.x, y: tam.y, on: true, t: 0 };
}
