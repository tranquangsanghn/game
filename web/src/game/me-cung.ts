// Mê cung bom (phía tây đảo 1, đi qua đường hầm): dữ liệu và hằng số. Địa hình / lưới ô nằm trong ban-do.ts (MC, mcO…),
// logic trong game.ts (capNhatMeCung() và các hàm mc*), vẽ trong ve-canvas.ts (veMeCung(), veVatMc()…).
// Trong mê cung Mabu / Zinbu / Vegeta không dùng chiêu thường: chỉ có 3 loại bom.

import { MC_BO, MC_COT, MC_HANG, tamO } from './ban-do';
import type { KhungSprite } from './sprite';

/** lua = bom lửa · nuoc = bom nước (nổ chữ thập, bấm lại nút để kích nổ) · no = bom nổ (nổ vùng vuông sau BOM_NO_T giây) */
export type LoaiBom = 'lua' | 'nuoc' | 'no';
export const LOAI_BOM: LoaiBom[] = ['lua', 'nuoc', 'no'];
export const TEN_BOM: Record<LoaiBom, string> = { lua: 'Bom lửa', nuoc: 'Bom nước', no: 'Bom nổ' };
export const MC_TEN = 'Mê cung bom';

/** Sprite bom (tools/tao-atlas-bom.py): hàng 0 = quả bom lửa · nước · nổ (tâm quả ở giữa khung, cao ~120);
 *  hàng 1..3 = vụ nổ lửa (5 khung) · nước (4) · nổ (4), vật ở giữa khung 200 */
export const SP_BOM: KhungSprite = { atlas: 'assets/game/bom.png', atlasW: 1000, atlasH: 800, w: 200, h: 200, cot: 5, neoX: 100, neoY: 100 };
/** Thứ tự khung vụ nổ của từng loại bom (chỉ số trong atlas): bùng to dần rồi tan thành khói */
export const NO_KHUNG: Record<LoaiBom, number[]> = { lua: [6, 7, 8, 9, 5], nuoc: [10, 11, 12, 13], no: [16, 17, 18, 15] };

/** Bà phù thuỷ: quái chính của mê cung bom, cưỡi viên ngọc rồng 4 sao bay lơ lửng khắp mê cung (xuất phát ở ô cuối, ô D), ném bom vào người chơi.
 *  Bay xuyên qua thùng gỗ / ô bí ẩn nhưng không xuyên gạch / hang; hồi sinh BA_HOI_SINH lần, mỗi lần bay và ném nhanh thêm BA_HOI_TANG.
 *  Sprite (tools/tao-atlas-ba-phu-thuy.py): 4 khung 360×520 ngang: 0 ngồi chắp tay · 1 giơ bom qua đầu · 2 nâng bom một tay · 3 ném;
 *  neo = tâm viên ngọc bà ngồi lên (bán kính BA_NGOC_R điểm ảnh sprite), quay mặt phải */
export const BA_TEN = 'Bà phù thuỷ';
export const SP_BA: KhungSprite = { atlas: 'assets/game/ba_phu_thuy.png', atlasW: 1440, atlasH: 520, w: 360, h: 520, cot: 4, neoX: 170, neoY: 420 };
export const BA_NGOC_R = 80;
/** Vẽ to gấp BA_TO (viên ngọc bán kính BA_NGOC_R × BA_TO đơn vị thế giới) */
export const BA_TO = 1.5;
/** Quả bom trên tay ở khung 1 / 2 và chỗ bom rời tay ở khung 3 (điểm ảnh sprite, tính từ neo) */
export const BA_TAY: ([number, number] | null)[] = [null, [26, -287], [-51, -271], [130, -60]];
/** Máu mỗi mạng: bom lửa / nước trúng trừ 1, bom nổ trừ 2 (ngọn lửa trên ô của bà) */
export const BA_HP = 2;
/** Hồi sinh BA_HOI_SINH lần (không tính mạng đầu), chờ BA_HOI_T giây tại chỗ; mỗi lần hồi sinh tốc độ bay và tốc độ ném nhân BA_HOI_TANG */
export const BA_HOI_SINH = 2;
export const BA_HOI_T = 5;
export const BA_HOI_TANG = 1.5;
/** Tốc độ bay (đơn vị / giây, mạng đầu); bay theo ô như quái, đuổi tới khi cách người gần nhất ≤ BA_GAN ô */
export const BA_TOC = 180;
export const BA_GAN = 3;
/** Bay cao hơn mặt đất (vẽ), nhấp nhô thêm */
export const BA_BAY_CAO = 110;
/** Chu trình ném: giơ bom BA_PHA[0] giây → nâng bom tới BA_PHA[1] → ném tới BA_PHA[2]; nghỉ BA_NEM_CACH giây giữa 2 lần */
export const BA_PHA = [0.5, 0.85, 1.15];
export const BA_NEM_CACH = 2.2;
/** Chỉ ném người trong BA_TAM ô (tính theo đường đi ngang + dọc) */
export const BA_TAM = 8;
/** Bom bà ném (cùng 3 loại, cùng luật nổ như bom của Mabu / Zinbu) bay BA_BOM_BAY giây; bom lửa / nước của bà
 *  chạm đất rồi tia dài dần như bom người chơi, bà kích nổ khi có người nằm trong tầm tia (sớm nhất BA_BOM_CHO giây), đủ BOM_TAM_MAX giây tự nổ */
export const BA_BOM_BAY = 0.8;
export const BA_BOM_CHO = 1;
/** Viên ngọc bà ngồi phát sáng: nhân vật thấy bà xa hơn tầm nhìn thường thêm BA_SANG (ngoại lệ sương mù, như Golden Frieza) */
export const BA_SANG = 1100;
export const BA_DIEM = 400;
/** Bị hạ: mờ dần trong BA_CHET_T giây */
export const BA_CHET_T = 1.2;
export interface BaMc {
  hp: number;
  /** vị trí mặt đất dưới bà (bà vẽ cao hơn BA_BAY_CAO), ô đang bay tới, đang bay giữa 2 ô, hướng vừa bay */
  x: number; y: number; ti: number; tj: number; dang: boolean; huong: number;
  /** số lần đã hồi sinh; giây còn chờ hồi sinh (hp = 0) */
  hoiSinh: number; hoi: number;
  /** đếm ngược tới lần ném kế tiếp */ nem: number;
  /** giây trong chu trình ném (< 0: đang ngồi) */ pha: number;
  /** loại bom đang cầm */ loai: LoaiBom;
  /** quay trái (người chơi ở phía tây) */ lat: boolean;
  /** nháy khi trúng bom */ trung: number;
  /** chet = bị hạ hẳn (hết lượt hồi sinh); tChet = giây từ lúc ngã (mạng nào cũng tính) */
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

/** Dính bom lửa: bốc cháy, cần đồng đội cầm xô nước dập trong TRANG_CHAY giây; dính bom nước: sặc trong bong bóng, cần kiếm / kim châm chọc trong TRANG_BONG giây.
 *  Hết giờ thì gục nhưng KHÔNG hoá mây / socola: nằm tại chỗ (vẫn cháy / trong bong bóng) chờ đồng đội cứu bằng đúng đồ (NvMc.guc) */
export const TRANG_CHAY = 4;
export const TRANG_BONG = 5;
/** Đồng đội cầm đúng đồ đứng ở ô bên cạnh (trong CUU_MC_BK, hơn 1 ô MC_O = 360 một chút) thì cứu được */
export const CUU_MC_BK = 400;
/** Nhặt vật phẩm / đồ cứu người trong VP_MC_BK; kiếm / xô nước dùng xong mọc lại sau DO_MC_HOI giây */
export const VP_MC_BK = 130;
export const DO_MC_HOI = 15;

/** Ô bí ẩn '?' đã vỡ mọc lại sau chừng này giây (thùng gỗ vỡ thì mất hẳn) */
export const O_BI_AN_HOI = 40;
/** Kho đồ lúc mới vào ván (mỗi nhân vật): xô nước, kim châm, và mỗi loại bom. Dùng hết thì phải đi nhặt thêm */
export const MC_XO_DAU = 3;
export const MC_KIM_DAU = 3;
export const MC_BOM_DAU = 5;
/** Nhặt thêm: mỗi lần nhặt xô / kim (ô K / X và ô bí ẩn) được MC_DO_THEM, túi bom (ô bí ẩn) được MC_BOM_THEM mỗi loại */
export const MC_DO_THEM = 2;
export const MC_BOM_THEM = 2;
/** Mạng dự phòng (ô bí ẩn): gục thì dùng một mạng, đứng dậy ngay tại chỗ; giữ tối đa MANG_TOI_DA */
export const MANG_TOI_DA = 3;
/** Bom bẫy nhảy ra từ ô bí ẩn (p = -3): bay BAY_BAY giây, tự nổ BAY_NO giây sau khi chạm đất, tia lửa / nước dài BAY_TAM ô */
export const BAY_BAY = 0.6;
export const BAY_NO = 1.5;
export const BAY_TAM = 2;

/** 3 loài quái của mê cung (thay quái ăn thịt cũ): chui ra từ hang (lần đầu sau QUAI_DAU giây có người trong mê cung,
 *  sau đó mỗi QUAI_CACH giây, mỗi hang tối đa QUAI_TOI_DA con, loài ngẫu nhiên) hoặc nhảy ra từ ô bí ẩn.
 *  Đi từng ô; đánh hơi người trong `ngui` ô thì `duoi` phần bước đi về phía đó; đứng thẳng hàng / cột với người trong `tam` ô
 *  (đường không bị ô chắn) thì vận chiêu `nap` giây (vạch báo trên đất) rồi bắn dọc hàng / cột, hồi `hoi` giây:
 *  - so19 (Số 19, Android 19): tia đỏ từ tay, nhanh, 1 máu
 *  - khi (Khỉ đột, Oozaru): to, chậm, 2 máu, tia tím từ miệng bắn xa
 *  - quy (Quỷ canh cổng, Guardian): bay lơ lửng (vẫn đi theo ô như mọi quái), phun cầu lửa: ô lửa làm bốc cháy như bom lửa */
export type LoaiQuai = 'so19' | 'khi' | 'quy';
export const LOAI_QUAI: LoaiQuai[] = ['so19', 'khi', 'quy'];
export interface DlQuai {
  ten: string; toc: number; mau: number; ngui: number; duoi: number;
  tam: number; nap: number; hoi: number;
  /** độ to khi vẽ (khung sprite 200), độ cao tia so với chân (đơn vị thế giới), bay lơ lửng */
  to: number; tiaY: number; /** vẽ lơ lửng */ bay: boolean; diem: number;
}
export const QUAI_DL: Record<LoaiQuai, DlQuai> = {
  so19: { ten: 'Số 19', toc: 220, mau: 1, ngui: 6, duoi: 0.5, tam: 4, nap: 0.7, hoi: 4, to: 2.4, tiaY: 250, bay: false, diem: 40 },
  khi: { ten: 'Khỉ đột', toc: 140, mau: 2, ngui: 6, duoi: 0.45, tam: 6, nap: 1.1, hoi: 6, to: 2.8, tiaY: 340, bay: false, diem: 60 },
  quy: { ten: 'Quỷ canh cổng', toc: 250, mau: 1, ngui: 5, duoi: 0.4, tam: 3, nap: 0.8, hoi: 5, to: 2.3, tiaY: 260, bay: true, diem: 50 },
};
export const QUAI_DAU = 6;
export const QUAI_CACH = 12;
export const QUAI_TOI_DA = 2;
/** Đấm / cắn / húc người ở ô bên cạnh (mỗi ô chỉ một người hoặc một quái nên không bao giờ đứng chung ô): cách trong QUAI_CHAM (hơn 1 ô MC_O = 360 một chút, ô chéo 509 không tính)
 *  thì đánh QUAI_SAT mỗi QUAI_HOI giây (nhân vật vẫn né 25%, giảm 50%) */
export const QUAI_CHAM = 400;
export const QUAI_SAT = 60;
export const QUAI_HOI = 1;
/** Tia của Số 19 / Khỉ đột trúng ai thì sát thương QUAI_TIA_SAT (trong mê cung 1 mạng: có mạng dự phòng thì dùng, không thì gục); tia hiện QUAI_TIA_T giây */
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

/** Ô bí ẩn vỡ ra ngẫu nhiên: quái (loài ngẫu nhiên nhảy ra), bom (bẫy, tự nổ), xô nước (cứu người cháy), kim châm (chọc bong bóng), mạng, túi bom (+MC_BOM_THEM mỗi loại); tỉ lệ cộng dồn theo thứ tự */
export type LoaiVpMc = 'xo' | 'kim' | 'mang' | 'tui';
export const TI_LE_O_BI_AN: [LoaiVpMc | 'quai' | 'bom', number][] = [['quai', 0.15], ['bom', 0.15], ['xo', 0.15], ['kim', 0.15], ['mang', 0.1], ['tui', 0.3]];
/** Đồ cứu người: kim châm chọc bong bóng, xô nước dập lửa (mỗi lần cứu tốn 1) */
export type DoCuuMc = 'xo' | 'kim';

export interface BomMc {
  id: number; p: number; loai: LoaiBom;
  /** ô đáp xuống và chỗ ném lên (toạ độ thế giới) */
  i: number; j: number; x0: number; y0: number;
  /** giây từ lúc ném (bay BOM_BAY_T giây rồi mới chạm đất) */
  t: number;
  /** đã bấm kích nổ khi bom còn đang bay: chạm đất là nổ (tia 1 ô) */
  kich?: boolean;
  /** bom của bà phù thuỷ (p = -1) / bom bẫy ô bí ẩn (p = -3): thời gian bay, tầm tia cố định (không ghi thì dài dần như bom người chơi) */
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
export interface DoMc { i: number; j: number; loai: DoCuuMc; cho: number; }
/** Trạng thái riêng từng nhân vật trong mê cung (không lưu ván) */
export interface NvMc {
  /** đang giữ nút ném: loại bom và lúc bắt đầu giữ (this.t) */
  nap: { loai: LoaiBom; t0: number } | null;
  /** số bom còn của từng loại (ném loại nào là ngẫu nhiên trong số loại còn bom) */
  bom: Record<LoaiBom, number>;
  /** tay cầm: nút cứu người vừa bấm (B đổ nước = 'xo', Y chọc kim = 'kim') và lúc bấm */
  cuuNut?: { loai: 'xo' | 'kim'; t: number };
  /** mạng dự phòng (ô bí ẩn) */ mang: number;
  /** số xô nước (dập lửa) và kim châm (chọc bong bóng) còn lại; mỗi lần cứu đồng đội tốn 1 */
  xo: number; kim: number;
  trang: { loai: 'chay' | 'bong'; con: number; max: number } | null;
  /** đã gục trong mê cung: nằm cháy / trong bong bóng chờ đồng đội cứu (xô nước / kiếm, kim châm), không hoá mây / socola */
  guc: 'chay' | 'bong' | null;
  /** máu / mana lúc bước vào mê cung (trong mê cung chỉ có 1 mạng); ra khỏi mê cung thì trả lại đúng như cũ */
  luu: { hp: number; mana: number } | null;
  /** Đi theo ô: ô đang đi tới (luôn dừng ở tâm ô), hướng đang giữ (tay cầm, chỉ 4 hướng), đường đi theo ô (chuột bấm) */
  toi: { i: number; j: number } | null;
  di: { x: number; y: number } | null;
  duong: { i: number; j: number }[];
}
export interface TrangThaiMc {
  bom: BomMc[]; lua: LuaMc[]; quai: QuaiMc[]; tia: TiaMc[]; vp: VpMc[]; doCuu: DoMc[]; oHoi: { i: number; j: number; t: number }[];
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
/** Lối ra (góc dưới trái): bước tới tâm ô này thì cả đội dịch chuyển tới núi đá (chỗ bóng ma Goku) */
export const O_RA_MC = oTheo('E')[0]!;

export const taoNvMc = (): NvMc => ({ nap: null, bom: { lua: MC_BOM_DAU, nuoc: MC_BOM_DAU, no: MC_BOM_DAU }, mang: 0, xo: MC_XO_DAU, kim: MC_KIM_DAU, trang: null, guc: null, luu: null, toi: null, di: null, duong: [] });
/** Bà phù thuỷ mới (mạng đầu) ở ô ngọc */
export function taoBa(): BaMc {
  const t = tamO(O_NGOC_MC.i, O_NGOC_MC.j);
  return { hp: BA_HP, x: t.x, y: t.y, ti: O_NGOC_MC.i, tj: O_NGOC_MC.j, dang: false, huong: 1, hoiSinh: 0, hoi: 0, nem: 3, pha: -1, loai: 'lua', lat: false, trung: 0, chet: false, tChet: 0 };
}
export function taoMeCung(): TrangThaiMc {
  return {
    bom: [], lua: [], quai: [], tia: [], vp: [], oHoi: [],
    doCuu: [...oTheo('K').map((o) => ({ ...o, loai: 'kim' as const, cho: 0 })), ...oTheo('X').map((o) => ({ ...o, loai: 'xo' as const, cho: 0 }))],
    hang: HANG_MC.map((_, k) => QUAI_DAU + k * 2),
    nv: [taoNvMc(), taoNvMc()],
    ba: taoBa(),
  };
}

/** Thời gian bom bay trên không trước khi chạm đất */
export const bayBom = (b: BomMc): number => b.bay ?? BOM_BAY_T;
