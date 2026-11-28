import type { NhanVat } from './nhan-vat-sprite';

// Con của Super Bư (tạm gọi "con Bư"): người ra đòn (hopThe.chu) bấm X lúc hợp thể thì Super Bư đẻ CON_BU_SO con, tối đa CON_BU_LAN lần mỗi lần hợp thể (tối đa CON_BU_SO × CON_BU_LAN = 3 con).
// Con Bư không chết nếu không bị đánh chết; biết đấm / đá / bắn chưởng (quả cầu vàng, bóng ma) như Super Bư với máu và sát thương = CON_BU_GAP × Super Bư,
// luôn đi theo Super Bư và đánh quái (gà, Cell, Frieza, bóng ma Goku bản sao). Hết giờ hợp thể (hoặc Super Bư bị hạ, tách ra) thì mọi con Bư chết theo.

/** Mỗi lần đẻ ra bao nhiêu con */
export const CON_BU_SO = 1;
/** Tối đa bao nhiêu lần đẻ trong một lần biến hình (hợp thể) */
export const CON_BU_LAN = 3;
/** Máu và sát thương của mỗi con = CON_BU_GAP × Super Bư (máu tối đa lúc hợp thể / sát thương mỗi đòn) */
export const CON_BU_GAP = 0.3;
/** Máu tối đa của mỗi con không dưới mức này (đầu ván máu Super Bư thấp: 30% chỉ ~270, một chùm chưởng Frieza / Cell là chết luôn, trông như vừa hiện đã mất) */
export const CON_BU_MAU_SAN = 3000;
/** Bị hạ: ngã rồi mờ dần trong bấy nhiêu giây mới biến mất khỏi màn hình */
export const CON_BU_CHET_T = 1.2;
/** Giữa 2 lần đẻ phải chờ ít nhất bấy nhiêu giây (chống bấm liên tục) */
export const CON_BU_HOI_DE = 1;
/** Độ to so với Super Bư */
export const CON_BU_TO = 0.62;
/** Tốc độ đi (px/s) và tốc độ lúc chạy theo Super Bư khi bị bỏ xa */
export const CON_BU_TOC = 430;
/** Đi theo Super Bư: đi loanh quanh cách Super Bư khoảng bán kính này (ngẫu nhiên CON_BU_BAM_MIN..CON_BU_BAM_MAX lần); xa hơn CON_BU_XA thì bỏ việc đánh quái chạy về; xa hơn CON_BU_DICH thì dịch chuyển về cạnh Super Bư */
export const CON_BU_BAM = 780;
export const CON_BU_BAM_MIN = 0.55;
export const CON_BU_BAM_MAX = 1.15;
export const CON_BU_XA = 1700;
export const CON_BU_DICH = 2800;
/** Đi loanh quanh: cứ ngẫu nhiên bấy nhiêu giây (min..max) chọn chỗ mới quanh Super Bư; tốc độ đi dạo = CON_BU_DAO × CON_BU_TOC */
export const CON_BU_DOI = [1.5, 4] as const;
export const CON_BU_DAO = 0.45;
/** Tìm quái trong bán kính này quanh con Bư */
export const CON_BU_TAM = 900;
/** Tầm đấm / đá (tính từ thân con Bư tới tâm quái, đã cộng nửa thân quái ở chỗ dùng) */
export const CON_BU_TAM_DAM = 190;
/** Xa hơn mức này thì bắn chưởng thay vì chạy tới đấm */
export const CON_BU_TAM_CHUONG = 380;
/** Hồi giữa 2 đòn (giây): đấm / đá, chưởng */
export const CON_BU_HOI_DON = 0.7;
export const CON_BU_HOI_CHUONG = 1.6;
/** Trong các lần bắn chưởng, tỉ lệ bắn con ma Bư (còn lại là quả cầu vàng) */
export const CON_BU_TI_LE_MA = 0.3;

export interface ConBu {
  id: number;
  x: number;
  y: number;
  hp: number;
  hpMax: number;
  /** Hình + animation (sprite Super Bư) */
  nv: NhanVat;
  /** Chờ tới thời điểm này (this.t) mới đấm / đá được nữa */
  cho: number;
  /** Chờ tới thời điểm này (this.t) mới bắn chưởng được nữa */
  choChuong: number;
  /** Chỗ đang đi tới quanh Super Bư (góc, khoảng cách tính bằng lần CON_BU_BAM), đổi ngẫu nhiên lúc đi loanh quanh */
  goc: number;
  r: number;
  /** Tới thời điểm này (this.t) thì chọn chỗ đi loanh quanh mới */
  doi: number;
  /** Nháy sáng khi vừa trúng đòn (giây) */
  nhay: number;
  /** Đã bị hạ: số giây từ lúc ngã (ngã rồi mờ dần CON_BU_CHET_T giây mới xoá); không còn bị đánh / không đánh */
  chet?: number;
}
