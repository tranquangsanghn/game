// Cell: quái canh các đảo cát. 5 cấp (0 yếu nhất → 4 mạnh nhất), mỗi đảo một cấp; đảo lớn nhất (đảo 0) là cấp 4.
// File này chỉ có dữ liệu + hàm thuần (không đụng canvas / trạng thái game); logic chạy trong Game (`capNhatCell()`), vẽ trong ve-canvas.ts (`veCell()`).
// Sprite: web/public/assets/game/cell_atlas.png, 10 cột × 5 hàng (hàng = cấp), khung 80×64, neo ở đáy giữa chân.
// Ảnh gốc: Cell từ Dragon Ball Z: Legendary Super Warriors (GBC); cấp 0 Cell Junior, 1 Imperfect 1, 2 Imperfect 2, 3 Perfect, 4 Perfect nhuộm đỏ + hào quang.
import type { KhungSprite } from './sprite';
import { DAO, daoCua, diemTrenDao, doSau, SO_DAO } from './ban-do';

export const SP_CELL: KhungSprite = { atlas: 'assets/game/cell_atlas.png', atlasW: 800, atlasH: 320, w: 80, h: 64, cot: 10, neoX: 40, neoY: 60 };
/** Khung trong hàng của mỗi cấp */
export const CELL_KHUNG = { dung: [0, 1], chay: [2, 3, 4, 5], danh: [6, 7], thuong: 8, chet: 9 } as const;

export const SO_CAP = 5;
/** Số Cell cố định của từng đảo (chỉ số đảo 0..4; đảo 0 to nhất) */
export const CELL_SO_DAO = [1, 3, 5, 8, 10];

/**
 * Sức chiến đấu (thiết kế cân bằng). Sức = máu hiệu dụng × sát thương / giây (đánh nhau gần như luật bình phương Lanchester:
 * 2 con cùng đánh 1 người thì mạnh gấp 4 một con). Tham chiếu 1 nhân vật (Mabu / Zinbu) lúc vào ván:
 * máu hiệu dụng `NV_MAU_HD` = 150 máu / (giảm 50% × không né 75%) = 400, sát thương `NV_DPS` = Đấm 50 mỗi 0,4s = 125.
 * - Cell cấp 3 (đảo 4, 10 con): máu / sát thương bằng 1/2 Zinbu (75 máu, đấm đá 25, chưởng 95) ⇒ yếu từng con, mạnh nhờ đông.
 * - Cell cấp 2 (đảo 3, 8 con): máu / sát thương bằng 2/3 Zinbu (100 máu, đấm đá 33, chưởng 127), né 35%, 2 con tách đàn.
 * - Cell cấp 1 (đảo 2, 5 con): máu / sát thương bằng Zinbu (150 máu, đấm đá 50, chưởng 190), không né, 1 con tách đàn.
 * - Cell cấp 0 (đảo 1, 3 con): máu / sát thương bằng 1,5 lần Zinbu (225 máu, đấm đá 75, chưởng 285), né 60%, 1 con tách đàn.
 * - (cũ) Cell cấp 0: sức `CELL_LUC` = 0,75 nhân vật → đánh 1 chọi 1 nhân vật thắng sát nút, 1 người chọi 2 Cell là thua
 *   (2² × 0,75 = 3 > 1) ⇒ phải dồn cả hai đánh con tách đàn trước.
 * - Cell cấp 4 (bạo nộ): có giáp `CELL_GIAP`; đánh thường sức ≈ 8,5 nhân vật (> 4 = Mabu + Zinbu cộng lại) nên đánh chưởng / đấm đá thường là thua;
 *   phá giáp bằng combo (`CELL_PHA_GIAP`, socola + mây) thì sức còn ≈ 2,5 < 4 ⇒ hai người dùng combo mới thắng.
 */
export const NV_MAU_HD = 400;
export const NV_DPS = 125;
export const CELL_LUC = [0.75, 0.75, 0.75, 0.125, 2.5];

/** Chỉ số theo cấp 0..4 (máu × (đấm đá + chưởng) / giây ≈ CELL_LUC × NV_MAU_HD × NV_DPS) */
// Cấp 3 (đảo 4, đàn đông nhất 10 con): máu và sát thương bằng 1/2 Zinbu lúc vào ván (150 máu → 75; Đấm 50 → 25; chưởng 190 → 95)
// Cấp 2 (đảo 3, 8 con): máu và sát thương bằng 2/3 Zinbu (150 máu → 100; Đấm 50 → 33; chưởng 190 → 127)
// Cấp 1 (đảo 2, 5 con): máu và sát thương bằng Zinbu (150 máu; Đấm 50; chưởng 190)
// Cấp 0 (đảo 1, 3 con): máu và sát thương bằng 1,5 lần Zinbu (225 máu; Đấm 75; chưởng 285)
export const CELL_HP = [225, 150, 100, 75, 1500];
/** Sát thương gốc một đòn đấm / đá (nhân vật nhận sau giảm 50%, vẫn né 25%) */
// Cấp 4 (đảo 0, Cell bạo nộ): sát thương gấp 10 lần Zinbu (Đấm 50 → 500; chưởng 190 → 1900), máu giữ 1500
export const CELL_SAT = [75, 50, 33, 25, 500];
/** Tỉ lệ né đòn của nhân vật (cấp 4, đảo 0: 70%; cấp 0, đảo 1: 60%; cấp 2, đảo 3: 35%; cấp 3, đảo 4: 25% như Mabu / Zinbu) */
export const CELL_NE = [0.6, 0, 0.35, 0.25, 0.7];
/** Số con tách đàn khi xuất trận (cấp 2 và 3, đảo 3 và 4: 2 con tách đàn cùng đuổi một người, cả đàn còn lại đuổi người kia) */
export const CELL_TACH_SO = [1, 1, 2, 2, 1];
/** Tốc độ thật (px/s) */
/** Tốc độ chạy theo cấp: Cell thường nhanh gấp 1,5 so với gốc (70, 85, 100, 120), Cell đỏ gấp 2 (150) */
export const CELL_TOC = [105, 127.5, 150, 180, 300];
/**
 * Con đi ăn đậu (Cell cấp 0–3, `vai: 'an'`): đội xuất trận thì ngoài con tách đàn, cả đàn cử 1 con trốn đi bắn cây trên đảo cho rơi đậu thần rồi ăn
 * (mỗi hạt +DAU_MAU máu như Mabu / Zinbu và sát thương +`CELL_DAU_SAT` mỗi đòn và sức mạnh +`CELL_DAU_SUC`); chỉ khi trên đảo không còn Cell nào khác nó mới đi đánh.
 * `CELL_AN_TAM`: đứng cách cây trong tầm này thì bắn; `CELL_AN_TRON`: nhân vật gần hơn tầm này thì nó chạy ra xa.
 */
/** Mọi Cell ăn một hạt đậu thần: +CELL_DAU_SAT sát thương cộng thẳng vào mỗi đòn đấm / đá / chưởng (Cell không có mana nên hơn Mabu / Zinbu 2) */
export const CELL_DAU_SAT = 12;
/** Mỗi hạt đậu thần còn cộng sức mạnh `suc` +CELL_DAU_SUC theo cấp (nhân sát thương gốc đấm / đá / chưởng, cộng dồn, không giới hạn): Cell đỏ (cấp 4) 0,15, còn lại 0,1 */
export const CELL_DAU_SUC = [0.1, 0.1, 0.1, 0.1, 0.15];
export const CELL_AN_TAM = 700;
export const CELL_AN_TRON = 1500;
/** Con đi ăn đậu gặp nhân vật (gần hơn `CELL_AN_GAP`, nhân vật nhìn thấy nó) thì dịch chuyển tức thời tới chỗ trên đảo xa mọi nhân vật nhất để trốn; hồi `CELL_AN_DICH_HOI` giây */
export const CELL_AN_GAP = 900;
export const CELL_AN_DICH_HOI = 3;
/**
 * Cell đỏ (cấp 4) hồi máu một lần mỗi ván (`Cell.hoi`): máu dưới `CELL_HOI_DUOI` (20%) máu tối đa thì bỏ đánh, dịch chuyển tức thời tới cây khô
 * xa nhân vật nhất (trên đảo của nó; đang truy sát thì cây trên mọi đảo) để bắn đổ ăn đậu thần; gặp nhân vật lại dịch chuyển tới cây khác.
 * Máu trên `CELL_HOI_TREN` (60%) thì tiếp tục đánh Mabu / Zinbu; không bao giờ dùng lại. Dịch chuyển hồi `CELL_HOI_DICH` giây.
 */
export const CELL_HOI_DUOI = 0.2;
export const CELL_HOI_TREN = 0.6;
export const CELL_HOI_DICH = 3;
/** Cell đỏ tung chưởng (hào quang → phóng, chùm bay) nhanh hơn 30% */
export const CELL_DO_NHANH = 1.3;
/** Số giây giữa 2 đòn đấm / đá */
export const CELL_HOI = [0.9, 0.9, 0.9, 0.9, 0.9];
/** Chưởng chiến đấu (3 loại như tiệc): sát thương gốc, hồi chiêu (giây), tầm xa nhất, bề rộng chùm (× độ to sprite) */
export const CELL_CHUONG_SAT = [285, 190, 127, 95, 1900];
// Cấp 0–3 (đảo 1 / 2 / 3 / 4: 3 / 5 / 8 / 10 con): hồi chưởng 2s
export const CELL_CHUONG_HOI = [2, 2, 2, 2, 1];
/** Combo chưởng (cấp 0–3): chưởng thứ 2 trở đi trúng cùng một người trong `CELL_COMBO_CUA` giây kể từ phát trúng trước thì sát thương × hệ số */
export const CELL_COMBO_CHUONG = [3, 3, 3, 3, 3];
// Cấp 4 (Cell bạo nộ, chỉ 1 con): cửa 4s nên phát kế tiếp của chính nó trúng liền cũng tính combo
export const CELL_COMBO_CUA = [0.5, 0.5, 0.5, 0.5, 4];
export const CELL_CHUONG_TAM = 1100;
/** Máy bay có người ngồi bay vào vòng tròn đảo cộng lề này thì Cell của đảo bắn máy bay (`mbChoCell()`) */
export const CELL_MB_TAM = 1500;
/** Tầm chùm chưởng khi bắn máy bay (dài hơn chưởng thường) */
export const CELL_MB_CHUONG_TAM = 2200;
/** Tầm nhìn riêng của Cell khi nhìn máy bay (máy bay ở trên cao, to): máy bay trong tầm này thì Cell vận chưởng bắn (`cellThayMb()`) */
export const CELL_MB_NHIN = 1500;
/** `Cell.muc` = MUC_MB: Cell đang bắn máy bay */
export const MUC_MB = -2;
/** Cell ngoài màn hình (thêm lề CELL_THUA_LE × độ to) và cách mọi nhân vật quá CELL_THUA_XA chỉ cập nhật mỗi CELL_THUA_NHIP khung (như gà, `cellThua()`) */
export const CELL_THUA_NHIP = 4;
export const CELL_THUA_LE = 60;
export const CELL_THUA_XA = 1900;
/** Nhân vật ở ngoài vòng tròn đảo quá lề này thì Cell thôi đuổi (Cell thì không bao giờ ra khỏi vòng) */
export const CELL_VONG_LE = 250;
export const CELL_CHUONG_RONG = 14;
/** Dịch chuyển tức thời tới sát nhân vật khi nhân vật xa hơn tầm đấm + `CELL_DICH_XA`; hồi chiêu riêng từng con theo cấp */
export const CELL_DICH_XA = 450;
export const CELL_DICH_HOI = [9, 8, 7, 6, 4];
/** Đàn (các con không tách đàn) chỉ một con được dịch chuyển mỗi `CELL_DICH_DAN` giây: đàn tới chậm là cơ hội đánh con tách đàn */
export const CELL_DICH_DAN = 3;
/** Cell bạo nộ (cấp 4): giáp giảm 70% sát thương; người đánh đang combo từ `CELL_PHA_GIAP` đòn trở lên thì phá giáp (nhận đủ) */
export const CELL_GIAP = 0.7;
export const CELL_PHA_GIAP = 10;
/** Cell bạo nộ dính Biến socola thì hoá socola `CELL_SOCOLA_T` giây (đứng yên, không giáp); dính mây lúc đó thì mất `CELL_SOCOLA_MAY` máu tối đa (một lần mỗi lần hoá) */
export const CELL_SOCOLA_T = 4;
export const CELL_SOCOLA_MAY = 0.3;
/** Độ to (nhân kích thước sprite) */
// Cỡ gốc nhân: cấp 0–2 gấp 2, cấp 3 (đảo 4, 10 con) gấp 1, cấp 4 (đảo 0) gấp 2 (nhỏ lại một mức cho nhẹ máy)
export const CELL_TO = [6.8, 7.4, 8.0, 4.3, 10.4];
/** Tỉ lệ phóng thật của sprite (độ to × 0,9) */
export const cellK = (cap: number) => CELL_TO[cap]! * 0.9;
/** Điểm khi hạ */
export const CELL_DIEM = [40, 60, 90, 130, 300];
export const CELL_TEN = ['Cell Junior', 'Cell dạng 1', 'Cell dạng 2', 'Cell hoàn hảo', 'Cell bạo nộ'];
/** Tầm ngửi thấy nhân vật (đội Cell xuất trận); chạm nhân vật trong CELL_CHAM × độ to */
export const CELL_NGUI = 800;
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
  /** hệ số nhân sát thương (ăn socola được cộng thêm, không giới hạn; thiếu = 1) */
  suc?: number;
  /** sát thương cộng thêm mỗi đòn đấm / đá / chưởng do ăn đậu thần (CELL_DAU_SAT mỗi hạt, không giới hạn; thiếu = 0) */
  satDau?: number;
  /** đang chạy (để chọn khung hình) */
  chay: boolean;
  /** điểm lang thang hiện tại và đếm ngược chọn điểm mới */
  dx: number; dy: number; doi: number;
  choDanh: number; danh: number; nhay: number; chamMay?: number;
  chet: boolean; tChet: number;
  /** đang ngồi dự tiệc sinh nhật (xem tiec.ts) và đếm ngược tới lần bắn chưởng vào bánh kế tiếp */
  tiec?: boolean;
  /** đảo của tiệc đang dự và góc hiện tại trên vòng quanh bánh */
  dao?: number; goc?: number;
  /** giây đã trôi trong chu trình biến hình → hào quang → phóng chưởng vào bánh (chưa vào chu trình thì không có) */
  nap?: number;
  /** loại chưởng sắp phóng trong chu trình hiện tại (0 xanh · 1 vàng · 2 tím) */
  loaiChuong?: number;
  /** Chiến đấu theo đội: 'tach' = con tách đàn (đuổi một người), 'dan' = cả đàn (đuổi người còn lại), 'an' = con đi bắn cây ăn đậu thần (trốn, không đánh); không có = dự tiệc / về tiệc */
  vai?: 'tach' | 'dan' | 'an';
  /** con 'an': chỉ số cây (trong `trangTri`) đang nhắm bắn */
  cay?: number;
  /** nhân vật đang đuổi (chỉ số người chơi); MUC_MB = bắn máy bay có Mabu / Zinbu ngồi */
  muc?: number;
  /** đang vận chưởng chiến đấu (c.nap chạy như tiệc nhưng bắn vào nhân vật) */
  chien?: boolean;
  /** giờ game được dịch chuyển / chưởng lần tới */
  choDich?: number; choChuong?: number;
  /** Thời gian dồn lại khi Cell ở ngoài màn hình và xa mọi nhân vật (cập nhật thưa, `cellThua()` trong game.ts) */
  dtThua?: number;
  /** Cell giữ ngọc (đảo CELL_NGOI_DAO): không dự tiệc, ngồi im giữa đảo trên viên ngọc rồng 2 sao (chỗ ngồi = hx, hy), có người tới thì đánh, xong về ngồi lại */
  ngoi?: boolean;
  /** Cell bạo nộ đang hoá socola (giây còn lại) và đã ăn combo mây trong lần hoá này chưa */
  socola?: number; comboSoc?: boolean;
  /** Cell đỏ hồi máu một lần (`CELL_HOI_DUOI` → `CELL_HOI_TREN`): 'dang' = đang đi phá cây ăn đậu thần, 'xong' = đã dùng; thiếu = chưa dùng */
  hoi?: 'dang' | 'xong';
}

/** Đảo có Cell giữ ngọc (1 con, Cell bạo nộ): ngồi im giữa đảo trên viên ngọc rồng 2 sao */
export const CELL_NGOI_DAO = 0;
/** Cell giữ ngọc ngồi trên ngọc: thân nâng lên CELL_NGOI_NANG (đơn vị thế giới) cho thấy ngồi trên viên ngọc to CELL_NGOI_NGOC_TO */
export const CELL_NGOI_NANG = 150;
export const CELL_NGOI_NGOC_TO = 0.86;
/** Chỗ ngồi của Cell giữ ngọc: giữa đảo (tâm không phải cát thì một chỗ trên cát cách bờ xa) */
export function choNgoiCell(): { x: number; y: number } {
  const d = DAO[CELL_NGOI_DAO]!;
  return doSau(d.x, d.y) > 300 ? { x: d.x, y: d.y } : diemTrenDao(CELL_NGOI_DAO, 600);
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
    // Đảo giữ ngọc: một con ngồi im giữa đảo
    if (i === CELL_NGOI_DAO) {
      const p = choNgoiCell();
      kq.push({
        id: layId(), cap, dao: i, x: p.x, y: p.y, hx: p.x, hy: p.y, hp: CELL_HP[cap]!, lat: Math.random() < 0.5, phase: Math.random() * 10,
        chay: false, dx: p.x, dy: p.y, doi: 0, choDanh: 0, danh: 0, nhay: 0, chet: false, tChet: 0, ngoi: true,
      });
      continue;
    }
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
        id: layId(), cap, dao: i, x: p.x, y: p.y, hx: p.x, hy: p.y, hp: CELL_HP[cap]!, lat: Math.random() < 0.5, phase: Math.random() * 10,
        chay: false, dx: p.x, dy: p.y, doi: Math.random() * 3, choDanh: 0, danh: 0, nhay: 0, chet: false, tChet: 0,
      });
    }
  }
  return kq;
}
