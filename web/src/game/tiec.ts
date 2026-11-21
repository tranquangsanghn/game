// Tiệc sinh nhật của Cell: lúc bắt đầu ván, Cell của MỌI đảo (1 con hay nhiều con) đi vòng tròn quanh một cái bánh, bắn chưởng vào bánh (đi vòng 2s rồi dừng bắn); nhạc "Happy Birthday" là nhạc nền của khu đảo (am-thanh.ts).
// Có nhân vật ở bất kỳ đâu trong vòng đảo hoặc Cell bị đánh thì đội Cell xuất trận (xem `doiHinhCell()` trong game.ts): một con tách đàn đuổi một người,
// cả đàn đuổi người còn lại; chỉ có một người thì cả đàn cùng đuổi người đó. Hết người trên đảo thì cả đội về vòng tiệc. Bánh không bao giờ mất.
// File này chỉ có dữ liệu + hàm thuần; logic chạy trong Game (`capNhatTiec()`), vẽ trong ve-canvas.ts (`veBanh()`).
import { hyp } from './toan';
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
/** Chưởng (kamehameha) bay tới bánh trong `TIEC_CHUONG_T` giây */
export const TIEC_CHUONG_T = 0.7;
/** Chu trình của Cell dự tiệc (giây), lặp liên tục: biến hình (người méo + gió xanh) → vận nội công (hào quang bùng lên) → phóng một trong 3 loại chưởng (ngẫu nhiên) → biến hình… */
export const TIEC_BIEN = 0.6;
export const TIEC_AURA = 0.9;
export const TIEC_PHONG = 0.7;
/** Cả đội đi vòng liên tục; cứ `TIEC_BAN_CACH` = 3s chỉ MỘT con (lần lượt từng con) dừng lại bắn 1 chưởng vào bánh (biến hình → hào quang → phóng), bắn xong đi tiếp; chu kỳ tính theo giờ tiệc `tc.t` */
export const TIEC_BAN_CACH = 3;
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

/** Cổng dịch chuyển (chỉ để trang trí, chưa có tác dụng): đặt giữa đảo `CONG_DAO` (đảo Cell 10 con); atlas 4 khung xoáy (khung 480×320, neo giữa đáy),
 *  tách nền trắng từ ảnh người dùng gửi bằng tools/tao-atlas-cong.py. Vẽ `veCong()` trong ve-canvas.ts, xếp theo y loại 'cong'. */
export const SP_CONG: KhungSprite = { atlas: 'assets/game/cong_dich_chuyen.png', atlasW: 1920, atlasH: 320, w: 480, h: 320, cot: 4, neoX: 240, neoY: 310 };
const CONG_DAO = 4;
export const CONG_TO = 1.6;
/** Cổng cắm chân xuống đất: số điểm ảnh sprite (trước khi phóng) bị chìm dưới mặt đất */
export const CONG_CHIM = 40;
export const CONG_FPS = 6;
/** Khoảng trống tối thiểu giữa vòng tiệc và tâm cổng (nửa bề rộng cổng + lề) */
const CONG_CACH = 240 * CONG_TO + 250;
/** Vị trí cổng: tâm đảo CONG_DAO; ván lưu cũ có vòng tiệc đè lên tâm đảo thì dời cổng ra phía đối diện bánh */
export function viTriCong(tiec: Tiec[]): { x: number; y: number } {
  const d = DAO[CONG_DAO]!;
  const tc = tiec.find((t) => t.dao === CONG_DAO);
  if (!tc) return { x: d.x, y: d.y };
  const kc = hyp(d.x - tc.x, d.y - tc.y), can = tc.bk + CONG_CACH;
  if (kc >= can) return { x: d.x, y: d.y };
  const ux = kc > 1 ? (d.x - tc.x) / kc : 0, uy = kc > 1 ? (d.y - tc.y) / kc : 1;
  // thử dời theo hướng ra xa bánh, xoay dần nếu rơi xuống biển
  for (let i = 0; i < 12; i++) {
    const g = Math.atan2(uy, ux) + (i % 2 ? 1 : -1) * Math.ceil(i / 2) * 0.4;
    const x = tc.x + Math.cos(g) * can, y = tc.y + Math.sin(g) * can;
    if (doSau(x, y) > 500 && daoCua(x, y) === CONG_DAO) return { x, y };
  }
  return { x: d.x, y: d.y };
}

export interface Tiec {
  dao: number; x: number; y: number; on: boolean; t: number;
  /** độ to bánh (nhân khung) và bán kính vòng quanh bánh */
  to: number; bk: number;
  /** Bánh đã bị chưởng của nhân vật bắn nổ (không vẽ nữa) */
  vo?: boolean;
  /** Bánh cuối cùng đã hoá ngọc rồng (số sao, NGOC_TIEC_SAO): vẽ viên ngọc thay bánh; nhặt rồi thì bỏ trường này, chỗ đó thành bánh thường */
  ngoc?: number;
}
/** Hạ hết sạch Cell rồi bắn chưởng vào các bánh sinh nhật: mỗi phát làm nổ một bánh, bánh cuối cùng hoá ngọc rồng 2 sao */
export const NGOC_TIEC_SAO = 2;
/** Chưởng đang bay từ Cell tới bánh (chỉ để đẹp) hoặc tới nhân vật (chưởng chiến đấu: có `sat`, `cap`; đầu chùm tới nơi thì ai nằm trên chùm bị trúng). Không lưu ván. */
export interface ChuongTiec { id: number; x0: number; y0: number; x1: number; y1: number; t: number; k: number; loai: number; sat?: number; cap?: number; /** chưởng của Cell đi ăn đậu: chỉ số cây đích, tới nơi thì cây đổ */ cay?: number; /** chưởng của Frieza (Game `chuongFzTrung()`) */ fz?: boolean }

/** Vị trí Cell trên vòng quanh bánh (vòng gần tròn, hơi dẹt theo chiều dọc) */
export const viTriVong = (tc: Tiec, goc: number) => ({ x: tc.x + Math.cos(goc) * tc.bk, y: tc.y + Math.sin(goc) * tc.bk * 0.9 });
/** Tốc độ đi quanh bánh (px/s) theo độ to của Cell */
export const TIEC_TOC = 12;

/**
 * Dựng tiệc cho MỌI đảo: Cell của mỗi đảo (1 con cũng vậy) đi vòng tròn quanh một cái bánh đặt trên cát (cả vòng nằm trên cát, tìm không được thì thu nhỏ vòng).
 * Bánh và vòng to theo độ to Cell của đảo.
 */
export function taoTiec(cell: Cell[]): Tiec[] {
  const kq: Tiec[] = [];
  for (let dao = 0; dao < SO_DAO; dao++) {
    // Cell giữ ngọc (ngồi im giữa đảo) không dự tiệc: đảo đó không có bánh
    const ds = cell.filter((c) => daoCua(c.x, c.y) === dao && !c.chet && !c.ngoi);
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
      // Đảo có cổng dịch chuyển: vòng tiệc không đè lên cổng (giữa đảo)
      if (dao === CONG_DAO && hyp(cx - d.x, cy - d.y) < bk + CONG_CACH) return false;
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
    });
    kq.push(tc);
  }
  return kq;
}
