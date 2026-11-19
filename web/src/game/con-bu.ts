import type { NhanVat } from './nhan-vat-sprite';

// Con của Super Bư (tạm gọi "con Bư"): người ra đòn (hopThe.chu) bấm LB / RB lúc hợp thể thì Super Bư đẻ CON_BU_SO con, tối đa CON_BU_LAN lần mỗi lần hợp thể.
// Con Bư không chết nếu không bị đánh chết; biết đấm / đá / bắn chưởng (quả cầu vàng, bóng ma) như Super Bư với máu và sát thương = CON_BU_GAP × Super Bư,
// luôn đi theo Super Bư và đánh quái (gà, Cell, Frieza, bóng ma Goku bản sao). Hết giờ hợp thể (hoặc Super Bư bị hạ, tách ra) thì mọi con Bư chết theo.

/** Mỗi lần đẻ ra bao nhiêu con */
export const CON_BU_SO = 3;
/** Tối đa bao nhiêu lần đẻ trong một lần biến hình (hợp thể) */
export const CON_BU_LAN = 3;
/** Máu và sát thương của mỗi con = CON_BU_GAP × Super Bư (máu tối đa lúc hợp thể / sát thương mỗi đòn) */
export const CON_BU_GAP = 0.3;
/** Giữa 2 lần đẻ phải chờ ít nhất bấy nhiêu giây (chống bấm liên tục) */
export const CON_BU_HOI_DE = 1;
/** Độ to so với Super Bư */
export const CON_BU_TO = 0.62;
/** Tốc độ đi (px/s) và tốc độ lúc chạy theo Super Bư khi bị bỏ xa */
export const CON_BU_TOC = 430;
/** Đi theo Super Bư: đứng cách trong bán kính này; xa hơn CON_BU_XA thì bỏ việc đánh quái chạy về; xa hơn CON_BU_DICH thì dịch chuyển về cạnh Super Bư */
export const CON_BU_BAM = 260;
export const CON_BU_XA = 900;
export const CON_BU_DICH = 1700;
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
  /** Chỗ đứng quanh Super Bư (góc, mỗi con một góc) */
  goc: number;
  /** Nháy sáng khi vừa trúng đòn (giây) */
  nhay: number;
}
