// Mê cung bom (phía tây đảo 1, đi qua đường hầm): dữ liệu và hằng số. Địa hình / lưới ô nằm trong ban-do.ts (MC, mcO…),
// logic trong game.ts (capNhatMeCung() và các hàm mc*), vẽ trong ve-canvas.ts (veMeCung(), veVatMc()…).
// Trong mê cung Mabu / Zinbu / Vegeta không dùng chiêu thường: chỉ có 3 loại bom.

import { MC_BO, MC_COT, MC_HANG } from './ban-do';

/** lua = bom lửa · nuoc = bom nước (nổ chữ thập, bấm lại nút để kích nổ) · no = bom nổ (nổ vùng vuông sau BOM_NO_T giây) */
export type LoaiBom = 'lua' | 'nuoc' | 'no';
export const LOAI_BOM: LoaiBom[] = ['lua', 'nuoc', 'no'];
export const TEN_BOM: Record<LoaiBom, string> = { lua: 'Bom lửa', nuoc: 'Bom nước', no: 'Bom nổ' };
export const MC_TEN = 'Mê cung bom';
export const QUAI_TEN = 'Quái ăn thịt';
/** Số sao của viên ngọc ở cuối mê cung */
export const MC_NGOC_SAO = 4;

/** Trong / quanh mê cung và đường hầm: nhân vật vẽ to gấp MC_TO_NV, camera lùi xa (zoom × MC_ZOOM_HE) để thấy rộng hơn */
export const MC_TO_NV = 1.5;
export const MC_ZOOM_HE = 0.75;

/** Giữ nút ném: mỗi BOM_NAP_BUOC giây thêm một mức (1..BOM_MUC), mức = số ô bom bay xa */
export const BOM_MUC = 4;
export const BOM_NAP_BUOC = 0.35;
/** Bom bay trên không (giây) trước khi chạm đất */
export const BOM_BAY_T = 0.35;
/** Bom lửa / nước: chạm đất rồi chờ bao lâu thì tia nổ dài bấy nhiêu ô (1..BOM_TAM_MAX); đủ BOM_TAM_MAX giây thì tự nổ */
export const BOM_TAM_MAX = 4;
/** Bom nổ: tự nổ sau BOM_NO_T giây kể từ lúc chạm đất, vùng vuông bán kính BOM_NO_BK ô; gạch che được */
export const BOM_NO_T = 2;
export const BOM_NO_BK = 2;
/** Sát thương bom nổ lên nhân vật (trước khi giảm 50%, không né được) */
export const BOM_NO_SAT = 160;
/** Lửa / nước của vụ nổ còn trên ô bao lâu (ai đi vào vẫn dính) */
export const LUA_T = 0.5;

/** Dính bom lửa: bốc cháy, cần đồng đội cầm xô nước dập trong TRANG_CHAY giây; dính bom nước: sặc trong bong bóng, cần kiếm chém trong TRANG_BONG giây */
export const TRANG_CHAY = 4;
export const TRANG_BONG = 5;
/** Lưới (bẫy trong ô bí ẩn) trói TRANG_LUOI giây */
export const TRANG_LUOI = 3;
/** Đồng đội cầm đúng đồ đứng trong CUU_MC_BK thì cứu được */
export const CUU_MC_BK = 190;
/** Nhặt vật phẩm / đồ cứu người trong VP_MC_BK; kiếm / xô nước dùng xong mọc lại sau DO_MC_HOI giây */
export const VP_MC_BK = 130;
export const DO_MC_HOI = 15;
/** Giày: mỗi đôi +GIAY_TOC tốc độ chạy trong mê cung, tối đa GIAY_TOI_DA đôi */
export const GIAY_TOC = 0.25;
export const GIAY_TOI_DA = 3;

/** Quái ăn thịt: chui ra từ hang, lần đầu sau QUAI_DAU giây (có người trong mê cung), sau đó mỗi QUAI_CACH giây, mỗi hang tối đa QUAI_TOI_DA con */
export const QUAI_DAU = 6;
export const QUAI_CACH = 12;
export const QUAI_TOI_DA = 2;
/** Tốc độ (đơn vị thế giới / giây), tầm đánh hơi người (ô), xác suất đi về phía người khi đánh hơi được */
export const QUAI_TOC = 200;
export const QUAI_NGUI = 5;
export const QUAI_DUOI = 0.4;
/** Cắn: chạm trong QUAI_CHAM thì cắn QUAI_SAT mỗi QUAI_HOI giây (nhân vật vẫn né 25%, giảm 50%) */
export const QUAI_CHAM = 150;
export const QUAI_SAT = 60;
export const QUAI_HOI = 1;
/** Giây chui ra khỏi hang (chưa đi, chưa cắn, bom chưa giết được) */
export const QUAI_RA = 0.7;
export const QUAI_DIEM = 30;

/** Ô bí ẩn vỡ ra: giày, khiên, lưới (bẫy) hoặc quái ăn thịt; tỉ lệ cộng dồn theo thứ tự */
export type LoaiVpMc = 'giay' | 'khien' | 'luoi';
export const TI_LE_O_BI_AN: [LoaiVpMc | 'quai', number][] = [['giay', 0.3], ['khien', 0.25], ['luoi', 0.25], ['quai', 0.2]];

export interface BomMc {
  id: number; p: number; loai: LoaiBom;
  /** ô đáp xuống và chỗ ném lên (toạ độ thế giới) */
  i: number; j: number; x0: number; y0: number;
  /** giây từ lúc ném (bay BOM_BAY_T giây rồi mới chạm đất) */
  t: number;
  /** đã bấm kích nổ khi bom còn đang bay: chạm đất là nổ (tia 1 ô) */
  kich?: boolean;
}
export interface LuaMc { i: number; j: number; loai: LoaiBom; con: number; /** người ném (tính điểm hạ quái) */ p: number; /** nhân vật đã dính (mỗi ngọn lửa trúng một người một lần) */ da: number[]; }
export interface QuaiMc {
  id: number; x: number; y: number;
  /** ô đang đi tới */ ti: number; tj: number; dang: boolean; huong: number;
  /** hang sinh ra (-1 = từ ô bí ẩn) */ hang: number;
  ra: number; choCan: number; ph: number;
}
export interface VpMc { id: number; i: number; j: number; loai: LoaiVpMc; }
export interface DoMc { i: number; j: number; loai: 'kiem' | 'xo'; cho: number; }
/** Trạng thái riêng từng nhân vật trong mê cung (không lưu ván) */
export interface NvMc {
  /** đang giữ nút ném: loại bom và lúc bắt đầu giữ (this.t) */
  nap: { loai: LoaiBom; t0: number } | null;
  /** bom đang chọn (chế độ chuột) */
  chon: LoaiBom;
  giay: number; khien: boolean;
  do: 'kiem' | 'xo' | null;
  trang: { loai: 'chay' | 'bong' | 'luoi'; con: number; max: number } | null;
  /** máu / mana lúc bước vào mê cung (trong mê cung chỉ có 1 mạng); ra khỏi mê cung thì trả lại đúng như cũ */
  luu: { hp: number; mana: number } | null;
}
export interface TrangThaiMc {
  bom: BomMc[]; lua: LuaMc[]; quai: QuaiMc[]; vp: VpMc[]; doCuu: DoMc[];
  /** đếm ngược sinh quái của từng hang (theo thứ tự HANG_MC) */
  hang: number[];
  nv: NvMc[];
}

/** Các ô theo ký hiệu trong bản đồ gốc */
const oTheo = (k: string) => {
  const kq: { i: number; j: number }[] = [];
  for (let j = 0; j < MC_HANG; j++) for (let i = 0; i < MC_COT; i++) if (MC_BO[j]![i] === k) kq.push({ i, j });
  return kq;
};
export const HANG_MC = oTheo('H');
export const O_NGOC_MC = oTheo('D')[0]!;
export const O_VAO_MC = oTheo('S')[0]!;

export const taoNvMc = (): NvMc => ({ nap: null, chon: 'lua', giay: 0, khien: false, do: null, trang: null, luu: null });
export function taoMeCung(): TrangThaiMc {
  return {
    bom: [], lua: [], quai: [], vp: [],
    doCuu: [...oTheo('K').map((o) => ({ ...o, loai: 'kiem' as const, cho: 0 })), ...oTheo('X').map((o) => ({ ...o, loai: 'xo' as const, cho: 0 }))],
    hang: HANG_MC.map((_, k) => QUAI_DAU + k * 2),
    nv: [taoNvMc(), taoNvMc()],
  };
}
