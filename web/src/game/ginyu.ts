// Bóng ma Goku (tên biến / ván lưu vẫn là `ginyu`): quái canh núi đá (đảo hình elip phía nam đảo 0). Một con duy nhất, lơ lửng giữa núi.
// Vòng lặp: dạng BÓNG MA (không đánh ai, không ai đánh được) gặp Mabu / Zinbu thì đứng khiêu khích `GY_KHIEU_T` giây → lao (bám theo, tốc độ `GY_LAO_TOC`,
// quãng tối đa `GY_LAO_QUANG` = 3 × quãng bay của nhân vật) vào người nhiều máu × sức mạnh nhất → trúng thì thành BẢN SAO y hệt người đó `GY_SAO_T` giây
// (sprite / animation / thanh máu như nhân vật thật, máu = `GY_SAO_TI_LE_DAU` = 120% lần nhập đầu, `GY_SAO_TI_LE` = 80% từ lần sau, sát thương = `GY_SAO_SAT` = 100% người đó, nhận sát thương như nhân vật), cứ 0,5–1s ngẫu nhiên đánh Mabu hoặc Zinbu
// → hết giờ trở lại bóng ma, lại khiêu khích rồi lao. Chỉ chết khi đang là bản sao và bị đánh hết máu.
// File này chỉ có dữ liệu + hàm thuần; logic chạy trong Game (`capNhatGinyu()`), vẽ trong ve-canvas.ts (`veGinyu()`).
// Sprite: web/public/assets/game/goku_ma_atlas.png (dựng bằng tools/tao-atlas-goku-ma.py), 10 cột × 3 hàng khung 200×200, neo đáy giữa, quay mặt TRÁI.
import type { KhungSprite } from './sprite';
import type { ChuoiCombo } from './toan';
import { NUI } from './ban-do';

export const SP_GINYU: KhungSprite = { atlas: 'assets/game/goku_ma_atlas.png', atlasW: 2000, atlasH: 600, w: 200, h: 200, cot: 10, neoX: 100, neoY: 196 };
/** Khung trong atlas: đứng, gồng (nín thở), bay lượn, lao tới, ngã (bay chính diện, mờ dần), quay người 0° → 330° */
export const GY_KHUNG = {
  dung: [1, 0], gong: 3, bay: [7, 8], lao: 9, nga: 6,
  quay: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
} as const;

/** Độ to (nhân kích thước khung 200; thân cao ~184 → ~210 px, cỡ Mabu / Zinbu) */
export const GY_TO = 1.15;
/** Lơ lửng cao hơn chân (bóng ma không chạm đất) */
export const GY_LO_LUNG = 22;
/** Bán kính thân (trúng đòn), tâm thân cao hơn chân GY_TAM_CAO */
export const GY_BK = 90;
export const GY_TAM_CAO = 110;
/** Thanh máu cao trên chân */
export const GY_THANH_CAO = 270;
/** Tốc độ lượn thật (px/s; nhân vật đi bộ 460) */
export const GY_TOC = 380;
/** Người đứng trong núi đá (cộng lề) mới là mục tiêu; bóng ma không rời núi (trừ lúc đang lao) */
export const GY_NUI_LE = 250;
/** Lao: bay bám theo mục tiêu tốc độ GY_LAO_TOC, chạm (GY_LAO_CHAM) là trúng (thành bản sao), không né được */
export const GY_LAO_TOC = 1500;
export const GY_LAO_CHAM = 110;
/** Khiêu khích (đứng yên, dùng các animation của bóng ma) trước mỗi lần lao */
export const GY_KHIEU_T = 3;
/** Quãng lao tối đa = 3 × quãng bay của Mabu / Zinbu (BAY_CAN = 600) */
export const GY_LAO_QUANG = 1800;
/** Lao hụt (hết quãng / mục tiêu mất) thì nghỉ giây rồi khiêu khích lại */
export const GY_NGHI_T = 1.2;
/** Bản sao: tồn tại GY_SAO_T giây, máu = GY_SAO_TI_LE, sát thương = GY_SAO_SAT người bị sao chép; đánh mỗi GY_SAO_DANH[0]..[1] giây (ngẫu nhiên) */
export const GY_SAO_T = 15;
export const GY_SAO_TI_LE = 0.8;
/** Lần nhập đầu tiên (chưa từng biến bản sao): máu bản sao = GY_SAO_TI_LE_DAU máu người bị nhập */
export const GY_SAO_TI_LE_DAU = 1.2;
/** Sát thương bản sao = 60% đòn của người bị sao chép (combo trên người bị đánh như đòn người chơi, `COMBO_HE`) */
export const GY_SAO_SAT = 0.6;
export const GY_SAO_DANH: [number, number] = [0.5, 1];
/** Tỉ lệ chọn đòn của bản sao: Đấm · Đá (phần còn lại là chưởng) */
export const GY_TI_LE_DAM = 0.25;
export const GY_TI_LE_DA = 0.25;
/** Tâm thân bản sao cao hơn chân (trúng đòn) */
export const GY_SAO_TAM = 80;
/** Xác bản sao mờ dần (giây) */
export const GY_CHET_T = 2.5;
/** Hoá socola (trúng Biến socola mà chưa chết): đứng yên giây */
export const GY_SOCOLA_T = 4;
/** Bóng ma chết thì biến thành viên ngọc rồng mấy sao */
export const GY_NGOC_SAO = 3;
/** Số lần hồi sinh (không tính mạng đầu; 0 = không hồi sinh): mỗi lần hồi sinh né thêm GY_HOI_NE và máu bản sao thêm GY_HOI_MAU (cộng trên chỉ số người bị sao chép) */
export const GY_HOI_SINH = 0;
export const GY_HOI_NE = 0.1;
export const GY_HOI_MAU = 0.1;
/** Điểm khi hạ */
export const GY_DIEM = 500;
/** Máu mặc định trước khi sao chép (chưa gặp ai) */
export const GY_HP_GOC = 150;
/** Tên hiển thị */
export const GY_TEN = 'Bóng ma Goku';

export interface Ginyu {
  x: number; y: number;
  /** chuỗi combo đòn người chơi đang tính trên bản sao */
  cb?: ChuoiCombo;
  /** Chỗ lơ lửng giữa núi */
  hx: number; hy: number;
  hp: number; hpMax: number;
  /** Máu còn lại của bóng ma trước khi nhập Super Bư (bản sao Super Bư không làm mốc): lần nhập Mabu / Zinbu kế tiếp so với máu này */
  hpCu?: number;
  /** Hệ số sức mạnh (thiếu = 1): ván lưu cũ (đã bỏ cơ chế mạnh lên khi Mabu / Zinbu gục); nhân sát thương và máu bản sao */
  suc?: number;
  /** Số lần đã hồi sinh (thiếu = 0); choHoi = đang chết nhưng sẽ hồi sinh khi xác mờ hết */
  hoiSinh?: number; choHoi?: boolean;
  /** Sát thương gốc sao chép được: Đấm, Đá, Chiêu đặc biệt (đã nhân `suc` và cộng `satDau` của nhân vật); lao thẳng dùng Chiêu đặc biệt */
  sat: [number, number, number];
  /** Nhân vật bị sao chép (ki: 0 Mabu · 1 Zinbu · 2 Vegeta); undefined = chưa gặp ai */
  ki?: number;
  lat: boolean; chay: boolean; phase: number;
  /** Đang chạm trán (đã sao chép); quen = giây không thấy ai */
  gap: boolean; quen: number;
  /** Ô người chơi đang đuổi */
  muc?: number;
  /** Đồng hồ: lần lao kế tiếp (theo `t` của Game); danh = còn hiện dáng lao sau khi đâm trúng */
  choChuong: number; danh: number;
  /** Đang gồng: số giây đã gồng */
  nap?: number;
  /** Đang lao: số giây đã lao; vx / vy = vận tốc (vệt bóng mờ phía sau) */
  lao?: number; vx?: number; vy?: number;
  /** Bật lùi sau khi đâm trúng (giây còn lại) */
  lui?: number;
  /** Quay người tạo dáng còn lại (giây) */
  dang: number;
  nhay: number; thuongLuc: number;
  chet: boolean; tChet: number;
  socola?: number; chamMay?: number;
  /** Đang khiêu khích: giây còn lại; nghỉ = giây còn nghỉ sau lần lao hụt; quang = quãng đã lao */
  khieu?: number; nghi?: number; quang?: number;
  /** Đang là bản sao của người chơi ô `p` (ki = nhân vật): con = giây còn lại; danh = giây tới đòn kế; muc = người sắp bị đánh; nhom = đòn sắp ra;
   *  dich = chỗ đang đi tới (lảng vảng cạnh đồng đội như người thật); doi = giây tới lúc đổi chỗ đi */
  /** Phiên bản bản sao lần trước (máu tối đa, sát thương, hệ số suc × hồi sinh lúc đó): từ lần biến hình thứ 2, người bị sao chép yếu hơn bản này
   *  thì bóng ma giữ nguyên máu / sức mạnh của bản này (`gyBienSao()`) */
  /** Đã nhập vào người ít nhất một lần (lần sau máu bản sao = GY_SAO_TI_LE thay GY_SAO_TI_LE_DAU) */
  daNhap?: boolean;
  /** Tách đôi lao vào 2 người: thân này đã tới người của mình, đang chờ thân kia tới để cùng biến bản sao */
  toi?: boolean;
  truoc?: { hpMax: number; sat: [number, number, number]; heSo: number };
  /** Máu tối đa "giả" của bản sao (theo người bị sao chép) khi đang giữ chỉ số cũ: thanh máu trên đầu chỉ để lừa, máu thật hiện trên thanh đen */
  hpGia?: number;
  /** `sb`: bản sao Super Bư (gặp Mabu + Zinbu đang hợp thể): thân, chỉ số và thời gian như Super Bư (HOP_THE_T giây) */
  sao?: { p: number; con: number; danh: number; muc?: number; nhom: number; dich?: { x: number; y: number }; doi: number; di: boolean; sb?: boolean };
}

export function taoGinyu(): Ginyu {
  return {
    x: NUI.x, y: NUI.y, hx: NUI.x, hy: NUI.y,
    hp: GY_HP_GOC, hpMax: GY_HP_GOC, sat: [50, 70, 130],
    lat: false, chay: false, phase: 0, gap: false, quen: 0,
    choChuong: 0, danh: 0, dang: 0,
    nhay: 0, thuongLuc: -99, chet: false, tChet: 0,
  };
}
