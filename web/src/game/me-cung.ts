// Mê cung bom (phía tây đảo 1, đi qua đường hầm): dữ liệu và hằng số. Địa hình / lưới ô nằm trong ban-do.ts (MC, mcO…),
// logic trong game.ts (capNhatMeCung() và các hàm mc*), vẽ trong ve-canvas.ts (veMeCung(), veVatMc()…).
// Trong mê cung Mabu / Zinbu / Vegeta không dùng chiêu thường: chỉ có 3 loại bom.

import { MC_BO, MC_COT, MC_HANG } from './ban-do';
import type { KhungSprite } from './sprite';

/** lua = bom lửa · nuoc = bom nước (nổ chữ thập, bấm lại nút để kích nổ) · no = bom nổ (nổ vùng vuông sau BOM_NO_T giây) */
export type LoaiBom = 'lua' | 'nuoc' | 'no';
export const LOAI_BOM: LoaiBom[] = ['lua', 'nuoc', 'no'];
export const TEN_BOM: Record<LoaiBom, string> = { lua: 'Bom lửa', nuoc: 'Bom nước', no: 'Bom nổ' };
export const MC_TEN = 'Mê cung bom';
export const QUAI_TEN = 'Quái vật';

/** Sprite bom (tools/tao-atlas-bom.py): hàng 0 = quả bom lửa · nước · nổ (tâm quả ở giữa khung, cao ~120);
 *  hàng 1..3 = vụ nổ lửa (5 khung) · nước (4) · nổ (4), vật ở giữa khung 200 */
export const SP_BOM: KhungSprite = { atlas: 'assets/game/bom.png', atlasW: 1000, atlasH: 800, w: 200, h: 200, cot: 5, neoX: 100, neoY: 100 };
/** Thứ tự khung vụ nổ của từng loại bom (chỉ số trong atlas): bùng to dần rồi tan thành khói */
export const NO_KHUNG: Record<LoaiBom, number[]> = { lua: [6, 7, 8, 9, 5], nuoc: [10, 11, 12, 13], no: [16, 17, 18, 15] };

/** Bà phù thuỷ: quái chính của mê cung bom, ngồi trên viên ngọc rồng 4 sao ở ô cuối (ô D), ném bom vào người chơi.
 *  Sprite (tools/tao-atlas-ba-phu-thuy.py): 4 khung 360×520 ngang: 0 ngồi chắp tay · 1 giơ bom qua đầu · 2 nâng bom một tay · 3 ném;
 *  neo = tâm viên ngọc bà ngồi lên (bán kính BA_NGOC_R điểm ảnh sprite), quay mặt phải */
export const BA_TEN = 'Bà phù thuỷ';
export const SP_BA: KhungSprite = { atlas: 'assets/game/ba_phu_thuy.png', atlasW: 1440, atlasH: 520, w: 360, h: 520, cot: 4, neoX: 170, neoY: 420 };
export const BA_NGOC_R = 80;
/** Vẽ to gấp BA_TO (viên ngọc bán kính BA_NGOC_R × BA_TO đơn vị thế giới) */
export const BA_TO = 1.5;
/** Quả bom trên tay ở khung 1 / 2 và chỗ bom rời tay ở khung 3 (điểm ảnh sprite, tính từ neo) */
export const BA_TAY: ([number, number] | null)[] = [null, [26, -287], [-51, -271], [130, -60]];
/** Máu: bom lửa / nước trúng trừ 1, bom nổ trừ 2 (ngọn lửa trên ô của bà) */
export const BA_HP = 8;
/** Chu trình ném: giơ bom BA_PHA[0] giây → nâng bom tới BA_PHA[1] → ném tới BA_PHA[2]; nghỉ BA_NEM_CACH giây giữa 2 lần */
export const BA_PHA = [0.5, 0.85, 1.15];
export const BA_NEM_CACH = 2.2;
/** Chỉ ném người trong BA_TAM ô (tính theo đường đi ngang + dọc) */
export const BA_TAM = 8;
/** Bom bà ném bay BA_BOM_BAY giây; bom lửa / nước của bà tự nổ BA_BOM_CHO giây sau khi chạm đất, tia dài BA_BOM_TAM ô */
export const BA_BOM_BAY = 0.8;
export const BA_BOM_CHO = 1.3;
export const BA_BOM_TAM = 2;
/** Viên ngọc bà ngồi phát sáng: nhân vật thấy bà xa hơn tầm nhìn thường thêm BA_SANG (ngoại lệ sương mù, như Golden Frieza) */
export const BA_SANG = 1100;
/** Người chơi không đứng sát bà quá BA_DAY (bị đẩy ra) */
export const BA_DAY = 230;
export const BA_DIEM = 400;
/** Bị hạ: mờ dần trong BA_CHET_T giây */
export const BA_CHET_T = 1.2;
export interface BaMc {
  hp: number;
  /** đếm ngược tới lần ném kế tiếp */ nem: number;
  /** giây trong chu trình ném (< 0: đang ngồi) */ pha: number;
  /** loại bom đang cầm */ loai: LoaiBom;
  /** quay trái (người chơi ở phía tây) */ lat: boolean;
  /** nháy khi trúng bom */ trung: number;
  chet: boolean; tChet: number;
}
/** Số sao của viên ngọc ở cuối mê cung */
export const MC_NGOC_SAO = 4;

/** Trong / quanh mê cung và đường hầm: nhân vật vẽ to gấp MC_TO_NV; trên đường hầm camera lùi xa (zoom × MC_ZOOM_HE),
 *  mọi người đã vào lưới mê cung thì camera đặt ở tâm mê cung, zoom vừa đủ thấy toàn bộ (cộng lề MC_CAM_LE mỗi bên) */
export const MC_TO_NV = 2.5;
export const MC_ZOOM_HE = 0.75;
export const MC_CAM_LE = 160;

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

/** 3 loài quái của mê cung (thay quái ăn thịt cũ): chui ra từ hang (lần đầu sau QUAI_DAU giây có người trong mê cung,
 *  sau đó mỗi QUAI_CACH giây, mỗi hang tối đa QUAI_TOI_DA con, loài ngẫu nhiên) hoặc nhảy ra từ ô bí ẩn.
 *  Đi từng ô; đánh hơi người trong `ngui` ô thì `duoi` phần bước đi về phía đó; đứng thẳng hàng / cột với người trong `tam` ô
 *  (đường không bị ô chắn) thì vận chiêu `nap` giây (vạch báo trên đất) rồi bắn dọc hàng / cột, hồi `hoi` giây:
 *  - so19 (Số 19, Android 19): tia đỏ từ tay, nhanh, 1 máu
 *  - khi (Khỉ đột, Oozaru): to, chậm, 2 máu, tia tím từ miệng bắn xa
 *  - quy (Quỷ canh cổng, Guardian): bay qua thùng gỗ / ô bí ẩn (không qua gạch / hang), phun cầu lửa: ô lửa làm bốc cháy như bom lửa */
export type LoaiQuai = 'so19' | 'khi' | 'quy';
export const LOAI_QUAI: LoaiQuai[] = ['so19', 'khi', 'quy'];
export interface DlQuai {
  ten: string; toc: number; mau: number; ngui: number; duoi: number;
  tam: number; nap: number; hoi: number;
  /** độ to khi vẽ (khung sprite 200), độ cao tia so với chân (đơn vị thế giới), bay lơ lửng */
  to: number; tiaY: number; bay: boolean; diem: number;
}
export const QUAI_DL: Record<LoaiQuai, DlQuai> = {
  so19: { ten: 'Số 19', toc: 220, mau: 1, ngui: 6, duoi: 0.5, tam: 4, nap: 0.7, hoi: 4, to: 2.4, tiaY: 250, bay: false, diem: 40 },
  khi: { ten: 'Khỉ đột', toc: 140, mau: 2, ngui: 6, duoi: 0.45, tam: 6, nap: 1.1, hoi: 6, to: 2.8, tiaY: 340, bay: false, diem: 60 },
  quy: { ten: 'Quỷ canh cổng', toc: 250, mau: 1, ngui: 5, duoi: 0.4, tam: 3, nap: 0.8, hoi: 5, to: 2.3, tiaY: 260, bay: true, diem: 50 },
};
export const QUAI_DAU = 6;
export const QUAI_CACH = 12;
export const QUAI_TOI_DA = 2;
/** Cắn / đấm / húc: chạm trong QUAI_CHAM thì đánh QUAI_SAT mỗi QUAI_HOI giây (nhân vật vẫn né 25%, giảm 50%) */
export const QUAI_CHAM = 150;
export const QUAI_SAT = 60;
export const QUAI_HOI = 1;
/** Tia của Số 19 / Khỉ đột trúng ai thì sát thương QUAI_TIA_SAT (trong mê cung 1 mạng: khiên đỡ, không thì gục); tia hiện QUAI_TIA_T giây */
export const QUAI_TIA_SAT = 300;
export const QUAI_TIA_T = 0.4;
/** Giây chui ra khỏi hang (chưa đi, chưa đánh, bom chưa giết được); giây xác nằm mờ dần; giây nháy khi trúng bom mà chưa chết */
export const QUAI_RA = 0.7;
export const QUAI_CHET_T = 0.8;
export const QUAI_DAU_T = 0.5;
/** Sprite 3 quái (tools/tao-atlas-quai-mc.py): 10 cột × 4 hàng khung 200, chân ở (100, 196), quay mặt phải;
 *  hàng 0 Số 19 · 1 Khỉ đột · 2 Quỷ · 3 hiệu ứng (0–1 cầu lửa của quỷ, đầu quay xuống phải 45° · 2 đầu tia đỏ) */
export const SP_QUAI: KhungSprite = { atlas: 'assets/game/quai_mc.png', atlasW: 2000, atlasH: 800, w: 200, h: 200, cot: 10, neoX: 100, neoY: 196 };
export const SP_QUAI_HU: KhungSprite = { ...SP_QUAI, neoY: 100 };
export const QUAI_HU_LUA = 30;
export const QUAI_HU_TIA = 32;
/** Chỉ số khung trong atlas: đi (đứng yên = khung đầu; quỷ luôn vỗ cánh), đánh khi chạm, vận chiêu, bắn, trúng đòn, gục */
const KHUNG_QUAI: Record<LoaiQuai, { di: number[]; dam: number; nap: number; ban: number; dau: number; chet: number }> = {
  so19: { di: [0, 1, 0, 2], dam: 3, nap: 4, ban: 4, dau: 5, chet: 6 },
  khi: { di: [10, 11], dam: 12, nap: 16, ban: 13, dau: 15, chet: 15 },
  quy: { di: [20, 21, 22, 23, 24, 25], dam: 29, nap: 26, ban: 26, dau: 27, chet: 28 },
};
/** Khung sprite đang vẽ của quái (chỉ đọc trạng thái) */
export function khungQuai(q: QuaiMc): number {
  const k = KHUNG_QUAI[q.loai];
  if (q.chet !== undefined) return k.chet;
  if (q.dau > 0) return k.dau;
  if (q.nap > 0) return k.nap;
  if (q.ban > 0) return k.ban;
  if (q.danh > 0) return k.dam;
  if (q.loai === 'quy') return k.di[Math.floor(q.ph * 1.6) % k.di.length]!;
  return q.dang ? k.di[Math.floor(q.ph * 1.2) % k.di.length]! : k.di[0]!;
}

/** Ô bí ẩn vỡ ra: giày, khiên, lưới (bẫy) hoặc một con quái (loài ngẫu nhiên); tỉ lệ cộng dồn theo thứ tự */
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
  /** bom của bà phù thuỷ (p = -1): thời gian bay, tầm tia cố định */
  bay?: number; tam?: number;
}
export interface LuaMc { i: number; j: number; loai: LoaiBom; con: number; /** người ném (tính điểm hạ quái; -1 = bà phù thuỷ, -2 = lửa quỷ canh cổng phun: không hại quái) */ p: number; /** nhân vật đã dính (mỗi ngọn lửa trúng một người một lần) */ da: number[]; /** đã trúng bà phù thuỷ */ baDa?: boolean; /** quái đã dính (id) */ quaiDa?: number[]; }
export interface QuaiMc {
  id: number; loai: LoaiQuai; x: number; y: number;
  /** ô đang đi tới */ ti: number; tj: number; dang: boolean; huong: number;
  /** hang sinh ra (-1 = từ ô bí ẩn) */ hang: number;
  ra: number; choCan: number; ph: number;
  mau: number; lat: boolean;
  /** đang vận chiêu (giây còn lại), các ô chiêu sẽ bắn qua, đang bắn (giây), hồi chiêu, động tác đánh khi chạm, nháy trúng đòn */
  nap: number; tia: { i: number; j: number }[]; ban: number; hoiChieu: number; danh: number; dau: number;
  /** bị hạ: giây từ lúc chết (xác mờ dần QUAI_CHET_T rồi mất) */
  chet?: number;
}
/** Tia / cầu lửa quái bắn ra (chỉ để vẽ; sát thương tính lúc bắn) */
export interface TiaMc { loai: LoaiQuai; x0: number; y0: number; x1: number; y1: number; t: number; }
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
  /** Đi theo ô: ô đang đi tới (luôn dừng ở tâm ô), hướng đang giữ (tay cầm, chỉ 4 hướng), đường đi theo ô (chuột bấm) */
  toi: { i: number; j: number } | null;
  di: { x: number; y: number } | null;
  duong: { i: number; j: number }[];
}
export interface TrangThaiMc {
  bom: BomMc[]; lua: LuaMc[]; quai: QuaiMc[]; tia: TiaMc[]; vp: VpMc[]; doCuu: DoMc[];
  /** đếm ngược sinh quái của từng hang (theo thứ tự HANG_MC) */
  hang: number[];
  nv: NvMc[];
  ba: BaMc;
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

export const taoNvMc = (): NvMc => ({ nap: null, chon: 'lua', giay: 0, khien: false, do: null, trang: null, luu: null, toi: null, di: null, duong: [] });
export function taoMeCung(): TrangThaiMc {
  return {
    bom: [], lua: [], quai: [], tia: [], vp: [],
    doCuu: [...oTheo('K').map((o) => ({ ...o, loai: 'kiem' as const, cho: 0 })), ...oTheo('X').map((o) => ({ ...o, loai: 'xo' as const, cho: 0 }))],
    hang: HANG_MC.map((_, k) => QUAI_DAU + k * 2),
    nv: [taoNvMc(), taoNvMc()],
    ba: { hp: BA_HP, nem: 3, pha: -1, loai: 'lua', lat: false, trung: 0, chet: false, tChet: 0 },
  };
}

/** Thời gian bom bay trên không trước khi chạm đất */
export const bayBom = (b: BomMc): number => b.bay ?? BOM_BAY_T;
