// Tiệc sinh nhật của Cell: lúc bắt đầu ván, Cell của MỌI đảo (1 con hay nhiều con) đi vòng tròn quanh một cái bánh, bắn chưởng vào bánh (mỗi Cell 2s một phát); nhạc "Happy Birthday" là nhạc nền của khu đảo (am-thanh.ts).
// Tiệc tan khi có nhân vật lại gần (Cell ngửi thấy) hoặc có Cell bị đánh; bánh vẫn ở lại cháy.
// File này chỉ có dữ liệu + hàm thuần; logic chạy trong Game (`capNhatTiec()`), vẽ trong ve-canvas.ts (`veBanh()`).
import type { KhungSprite } from './sprite';
import type { Cell } from './cell';
import { cellK } from './cell';
import { daoCua, doSau, DAO, SO_DAO } from './ban-do';

/** Bánh: 8 khung ngọn lửa (4 cột × 2 hàng, khung 256×512), neo ở đáy đĩa bánh */
export const SP_BANH: KhungSprite = { atlas: 'assets/game/banh_sinh_nhat.png', atlasW: 1024, atlasH: 1024, w: 256, h: 512, cot: 4, neoX: 128, neoY: 500 };
export const BANH_KHUNG = 8;
/** Độ to của bánh (nhân kích thước khung) và số khung lửa mỗi giây */
export const BANH_TO = 0.3; // bánh nhỏ: cho Cell có k ≈ 3,9 (đảo 4); đảo khác nhân theo k
export const BANH_FPS = 9;
/** Bán kính vòng tròn Cell quanh bánh */
export const TIEC_BK = 280;
/** Cell đang tiệc chỉ ngửi thấy nhân vật trong tầm này (nhỏ hơn bình thường: đang mải hát) */
export const TIEC_NGUI = 450;
/** Chưởng (kamehameha) bay tới bánh trong `TIEC_CHUONG_T` giây */
export const TIEC_CHUONG_T = 0.7;
/** Chu trình của Cell dự tiệc (giây), lặp liên tục: biến hình (người méo + gió xanh) → vận nội công (hào quang bùng lên) → phóng một trong 3 loại chưởng (ngẫu nhiên) → biến hình… */
export const TIEC_BIEN = 0.5;
export const TIEC_AURA = 0.8;
export const TIEC_PHONG = 0.7;
/** Mỗi Cell bắn đúng 1 chưởng mỗi `TIEC_CHU_KY` = 2 giây */
export const TIEC_CHU_KY = TIEC_BIEN + TIEC_AURA + TIEC_PHONG;
/** Atlas của từng cấp (hàng = cấp): cột 0–2 hào quang · 3 gồng (không dùng) · 4 / 5 / 6 phóng chưởng xanh / vàng / tím · 7 biến hình · 8 / 9 gió ngang / dọc; tách bằng tools/tao-atlas-cell-tiec.py */
export const SP_CELL_TIEC: KhungSprite = { atlas: 'assets/game/cell_tiec.png', atlasW: 800, atlasH: 320, w: 80, h: 64, cot: 10, neoX: 40, neoY: 60 };
export const TIEC_KHUNG = { hao: [0, 1, 2], bien: 7, gioNgang: 8, gioDoc: 9, phong: [4, 5, 6] } as const;
/**
 * 3 loại chưởng (xanh kamehameha, vàng, tím): ảnh gồm quả gốc [0, bw), thân ống (dải [nk0, nk1) kéo dài), đầu [hx, w).
 * ti: tỉ lệ vẽ so với độ to Cell (chưởng vàng / tím mảnh nên vẽ to hơn). tayX / tayY: tay Cell cách giữa thân và cao hơn chân bao nhiêu (nhân độ to) lúc phóng.
 */
export const CHUONG_LOAI = [
  { atlas: 'assets/game/cell_chuong.png', w: 107, h: 43, bw: 38, nk0: 44, nk1: 58, hx: 62, tayX: 16, tayY: 22, ti: 0.5 },
  { atlas: 'assets/game/cell_chuong_vang.png', w: 63, h: 42, bw: 11, nk0: 14, nk1: 40, hx: 47, tayX: 17, tayY: 23, ti: 1.1 },
  { atlas: 'assets/game/cell_chuong_tim.png', w: 114, h: 44, bw: 12, nk0: 22, nk1: 100, hx: 104, tayX: 20, tayY: 25, ti: 1 },
] as const;

export interface Tiec {
  dao: number; x: number; y: number; on: boolean; t: number;
  /** độ to bánh (nhân khung) và bán kính vòng quanh bánh */
  to: number; bk: number;
}
/** Chưởng đang bay từ Cell tới bánh (chỉ để đẹp, không lưu ván) */
export interface ChuongTiec { id: number; x0: number; y0: number; x1: number; y1: number; t: number; k: number; loai: number }

/** Vị trí Cell trên vòng quanh bánh (vòng gần tròn, hơi dẹt theo chiều dọc) */
export const viTriVong = (tc: Tiec, goc: number) => ({ x: tc.x + Math.cos(goc) * tc.bk, y: tc.y + Math.sin(goc) * tc.bk * 0.9 });
/** Tốc độ đi quanh bánh (px/s) theo độ to của Cell */
export const TIEC_TOC = 7;

/**
 * Dựng tiệc cho MỌI đảo: Cell của mỗi đảo (1 con cũng vậy) đi vòng tròn quanh một cái bánh đặt trên cát (cả vòng nằm trên cát, tìm không được thì thu nhỏ vòng).
 * Bánh và vòng to theo độ to Cell của đảo.
 */
export function taoTiec(cell: Cell[]): Tiec[] {
  const kq: Tiec[] = [];
  for (let dao = 0; dao < SO_DAO; dao++) {
    const ds = cell.filter((c) => daoCua(c.x, c.y) === dao && !c.chet);
    if (!ds.length) continue;
    const d = DAO[dao]!;
    const k = cellK(ds[0]!.cap);
    const to = (BANH_TO * k) / 3.9;
    const bk0 = Math.max(125 * to + 28 * k, (ds.length * 60 * k) / (Math.PI * 2));
    const hop = (cx: number, cy: number, bk: number) => {
      for (let i = 0; i < 12; i++) {
        const g = (i / 12) * Math.PI * 2;
        const x = cx + Math.cos(g) * bk, y = cy + Math.sin(g) * bk;
        if (doSau(x, y) < 220 || daoCua(x, y) !== dao) return false;
      }
      return doSau(cx, cy) > 220;
    };
    let tam = { x: d.x, y: d.y }, bk = bk0, xong = false;
    for (let thu = 0; thu < 6 && !xong; thu++) {
      bk = bk0 * (1 - thu * 0.1);
      for (let n = 0; n < 400; n++) {
        const g = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random()) * d.r * 0.7;
        const x = d.x + Math.cos(g) * r, y = d.y + Math.sin(g) * r;
        if (hop(x, y, bk)) { tam = { x, y }; xong = true; break; }
      }
    }
    const tc: Tiec = { dao, x: tam.x, y: tam.y, on: true, t: 0, to, bk };
    const g0 = Math.random() * Math.PI * 2;
    ds.forEach((c, i) => {
      c.goc = g0 + (i / ds.length) * Math.PI * 2;
      const p = viTriVong(tc, c.goc);
      c.x = c.hx = c.dx = p.x;
      c.y = c.hy = c.dy = p.y;
      c.tiec = true;
      c.dao = dao;
      c.nap = Math.random() * TIEC_CHU_KY; // lệch pha để không bắn cùng lúc
      c.loaiChuong = Math.floor(Math.random() * CHUONG_LOAI.length);
    });
    kq.push(tc);
  }
  return kq;
}
