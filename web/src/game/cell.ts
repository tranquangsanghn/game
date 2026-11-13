// Cell: quái canh các đảo cát. 5 cấp (0 yếu nhất → 4 mạnh nhất), mỗi đảo một cấp; đảo lớn nhất (đảo 0) là cấp 4.
// File này chỉ có dữ liệu + hàm thuần (không đụng canvas / trạng thái game); logic chạy trong Game (`capNhatCell()`), vẽ trong ve-canvas.ts (`veCell()`).
// Sprite: web/public/assets/game/cell_atlas.png, 10 cột × 5 hàng (hàng = cấp), khung 80×64, neo ở đáy giữa chân.
// Ảnh gốc: Cell từ Dragon Ball Z: Legendary Super Warriors (GBC); cấp 0 Cell Junior, 1 Imperfect 1, 2 Imperfect 2, 3 Perfect, 4 Perfect nhuộm đỏ + hào quang.
import type { KhungSprite } from './sprite';
import { daoCua, diemTrenDao, doSau, SO_DAO } from './ban-do';

export const SP_CELL: KhungSprite = { atlas: 'assets/game/cell_atlas.png', atlasW: 800, atlasH: 320, w: 80, h: 64, cot: 10, neoX: 40, neoY: 60 };
/** Khung trong hàng của mỗi cấp */
export const CELL_KHUNG = { dung: [0, 1], chay: [2, 3, 4, 5], danh: [6, 7], thuong: 8, chet: 9 } as const;

export const SO_CAP = 5;
/** Số Cell cố định của từng đảo (chỉ số đảo 0..4; đảo 0 to nhất) */
export const CELL_SO_DAO = [1, 3, 5, 8, 10];

/** Chỉ số theo cấp 0..4 */
export const CELL_HP = [150, 220, 320, 450, 800];
export const CELL_SAT = [28, 38, 50, 65, 95];
/** Tốc độ thật (px/s) */
export const CELL_TOC = [70, 85, 100, 120, 150];
/** Số giây giữa 2 đòn */
export const CELL_HOI = [1.4, 1.3, 1.2, 1.1, 1.0];
/** Độ to (nhân kích thước sprite) */
// Nhân MỘT lần so với cỡ gốc (3,4 · 3,7 · 4,0 · 4,3 · 5,2): cấp 0–2 gấp 2 (6,8 · 7,4 · 8,0), cấp 3 (đảo 10 con) gấp 2 = 8,6, cấp 4 gấp 3 (15,6)
export const CELL_TO = [6.8, 7.4, 8.0, 8.6, 15.6];
/** Tỉ lệ phóng thật của sprite (độ to × 0,9) */
export const cellK = (cap: number) => CELL_TO[cap]! * 0.9;
/** Điểm khi hạ */
export const CELL_DIEM = [40, 60, 90, 130, 300];
export const CELL_TEN = ['Cell Junior', 'Cell dạng 1', 'Cell dạng 2', 'Cell hoàn hảo', 'Cell bạo nộ'];
/** Tầm ngửi thấy nhân vật; bỏ đuổi khi xa nhà quá CELL_XICH; chạm nhân vật trong CELL_CHAM × độ to */
export const CELL_NGUI = 800;
export const CELL_XICH = 1500;
export const CELL_CHAM = 30;
/** Bán kính trúng đòn quanh tâm thân × độ to */
export const CELL_BK = 14;
/** Giây hoạt ảnh đánh / nháy trúng / xác nằm trước khi biến mất */
export const CELL_DANH_T = 0.35;
export const CELL_NHAY_T = 0.2;
export const CELL_CHET_T = 1.6;

export interface Cell {
  id: number; cap: number; x: number; y: number; hx: number; hy: number;
  hp: number; lat: boolean; phase: number;
  /** đang chạy (để chọn khung hình) */
  chay: boolean;
  /** điểm lang thang hiện tại và đếm ngược chọn điểm mới */
  dx: number; dy: number; doi: number;
  choDanh: number; danh: number; nhay: number; chamMay?: number;
  chet: boolean; tChet: number;
}

/** Cấp Cell của đảo `i`: đảo 0 (lớn nhất) cấp 4, đảo 1..4 cấp 0..3 */
export const capCuaDao = (i: number) => (i === 0 ? SO_CAP - 1 : i - 1);

/** Cell hay tụ tập: khi lang thang, xác suất đi tới chỗ một Cell khác cùng đảo (thay vì đi ngẫu nhiên quanh nhà) */
export const CELL_TU = 0.75;
/** Chỉ tụ với Cell trong tầm này */
export const CELL_TU_TAM = 2200;
/** Lề giữ Cell trong bản đồ theo cấp (sprite to nên lề rộng) */
export const leCell = (cap: number) => ({ x: 20 * cellK(cap) + 60, tren: 45 * cellK(cap), duoi: 40 });

/** Sinh Cell cho mọi đảo: số con cố định `CELL_SO_DAO`, sinh thành một cụm quanh một chỗ trên cát (tụ tập), cách nhau theo độ to. `layId` cấp id duy nhất. */
export function taoCell(layId: () => number): Cell[] {
  const kq: Cell[] = [];
  for (let i = 0; i < SO_DAO; i++) {
    const cap = capCuaDao(i);
    const n = CELL_SO_DAO[i]!;
    const k = cellK(cap);
    const tam = diemTrenDao(i, 500 + 40 * k);
    const bk = 100 + n * 18 * k;
    const cua: { x: number; y: number }[] = [];
    for (let j = 0; j < n; j++) {
      // Quanh tâm cụm, cách các con khác ít nhất ~ 30 × độ to; thử nhiều lần rồi nới dần
      let p = tam;
      for (let t = 0; t < 60; t++) {
        const g = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random()) * bk * (1 + t / 30);
        p = { x: tam.x + Math.cos(g) * r, y: tam.y + Math.sin(g) * r };
        if (doSau(p.x, p.y) > 250 && daoCua(p.x, p.y) === i && !cua.some((q) => Math.hypot(q.x - p.x, q.y - p.y) < 30 * k)) break;
        p = tam;
      }
      cua.push(p);
      kq.push({
        id: layId(), cap, x: p.x, y: p.y, hx: p.x, hy: p.y, hp: CELL_HP[cap]!, lat: Math.random() < 0.5, phase: Math.random() * 10,
        chay: false, dx: p.x, dy: p.y, doi: Math.random() * 3, choDanh: 0, danh: 0, nhay: 0, chet: false, tChet: 0,
      });
    }
  }
  return kq;
}
