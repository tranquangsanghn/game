import { hyp } from './toan';
import type { KhungSprite } from './sprite';
import { VeCanvas } from './ve-canvas';
import { AmThanh } from './am-thanh';
import { NhanVat } from './nhan-vat-sprite';
import { NHAN_VAT, SUPER_BU } from './nhan-vat-du-lieu';
import { HN } from './do-hieu-nang';
import { CON_BU_SO, CON_BU_LAN, CON_BU_GAP, CON_BU_HOI_DE, CON_BU_TO, CON_BU_TOC, CON_BU_BAM, CON_BU_XA, CON_BU_DICH, CON_BU_TAM, CON_BU_TAM_DAM, CON_BU_TAM_CHUONG, CON_BU_HOI_DON, CON_BU_HOI_CHUONG, CON_BU_TI_LE_MA, type ConBu } from './con-bu';
import { MC, MC_COT, MC_HANG, MC_HAM, MC_O, datLaiMeCung, oCua, oTrongVao, oCung, oTuongMc, oMc, tamO, trongHam, trongMeCung, mcO } from './ban-do';
import { taoMeCung, O_VAO_MC, O_RA_MC, MC_TO_NV, MC_ZOOM_HE, MC_CAM_LE, LOAI_BOM, HANG_MC, O_NGOC_MC, MC_NGOC_SAO, BOM_MUC, BOM_NAP_BUOC, bayBom, BOM_TAM_MAX, BOM_NO_T, BOM_NO_BK, BOM_NO_SAT, LUA_T, TRANG_CHAY, TRANG_BONG, CUU_MC_BK, VP_MC_BK, DO_MC_HOI, O_BI_AN_HOI, MC_DO_THEM, MC_BOM_THEM, MANG_TOI_DA, BAY_BAY, BAY_NO, BAY_TAM, QUAI_CACH, QUAI_TOI_DA, QUAI_CHAM, QUAI_SAT, QUAI_HOI, QUAI_RA, QUAI_DL, LOAI_QUAI, QUAI_TIA_SAT, QUAI_TIA_T, QUAI_CHET_T, QUAI_DAU_T, SP_QUAI, type LoaiQuai, type TiaMc, TI_LE_O_BI_AN, SP_BOM, SP_BA, BA_PHA, BA_NEM_CACH, BA_TAM, BA_BOM_BAY, BA_BOM_CHO, BA_DIEM, BA_CHET_T, BA_HP, BA_HOI_SINH, BA_HOI_T, BA_HOI_TANG, BA_TOC, BA_GAN, BA_BAY_CAO, BA_TAY, BA_TO, BA_SANG, type BomMc, type LoaiBom, type LuaMc, type QuaiMc, type VpMc, type DoMc, type TrangThaiMc } from './me-cung';
import { chuanBiSaMac, daoCua, diemTrenDao, doSau, raKhoiChanThan, raKhoiMeCung, trongNui, trongThan, trongVuon, trongVongDao, veDat, DAO, NUI, SO_DAO, TG, TG_SA, THAN, THAN_CONG, THAN_VAT_TG, thanVo, XUAT_PHAT, type LoaiBanDo } from './ban-do';
import { SO_CAP, CELL_DO_NHANH, cellK, CELL_TU, CELL_TU_TAM, leCell, CELL_BK, CELL_KHUNG, CELL_CHAM, CELL_CHET_T, CELL_DANH_T, CELL_DIEM, CELL_HOI, CELL_HP, CELL_NHAY_T, CELL_SAT, CELL_TEN, CELL_TO, CELL_TOC, SP_CELL, taoCell, CELL_CHUONG_SAT, CELL_CHUONG_HOI, CELL_CHUONG_TAM, CELL_CHUONG_RONG, CELL_DICH_XA, CELL_DICH_HOI, CELL_DICH_DAN, CELL_GIAP, CELL_PHA_GIAP, CELL_SOCOLA_T, CELL_SOCOLA_MAY, CELL_NE, CELL_TACH_SO, CELL_COMBO_CHUONG, CELL_COMBO_CUA, CELL_DO_COMBO, CELL_MB_TAM, CELL_MB_CHUONG_TAM, CELL_MB_NHIN, MUC_MB, CELL_VONG_LE, CELL_THUA_NHIP, CELL_THUA_LE, CELL_THUA_XA, CELL_NGOI_DAO, CELL_NGOI_NGOC_TO, choNgoiCell, CELL_DAU_SAT, CELL_DAU_SUC, CELL_AN_TAM, CELL_AN_TRON, CELL_AN_GAP, CELL_AN_DICH_HOI, CELL_AN_TOC, CELL_HOI_DUOI, CELL_HOI_TREN, CELL_DO_TANG, CELL_DO_TANG_CHO, cellHpMax, CELL_HOI_DICH, type Cell } from './cell';
import { taoTiec, NGOC_TIEC_SAO, CHUONG_LOAI, TIEC_BIEN, TIEC_AURA, TIEC_PHONG, TIEC_KHUNG, SP_CELL_TIEC, TIEC_TOC, viTriVong, TIEC_BAN_CACH, TIEC_CHUONG_T, SP_CONG, CONG_TO, viTriCong, type ChuongTiec, type Tiec } from './tiec';
import { taoFrieza, capNhatFrieza, fzVeDuong, fzGap, fzMauGap, fzSat, fzToc, fzHpMax, SP_FRIEZA, SP_FRIEZA_VANG, FZ_VANG_TO, FZ_HP, FZ_SAT, FZ_CHUONG_SAT, FZ_COMBO_CUA, FZ_TOC_DANH, FZ_HOI, FZ_CHUONG_HOI, FZ_HOI_MAU, FZ_HOI_DUOI, FZ_HOI_TREN, FZ_AN_DAU, FZ_AN_TAO, FZ_AN_BK, FZ_CAY_TAM, FZ_GIAP, FZ_CHAM, FZ_CHUONG_XA, FZ_CHUONG_TAM, FZ_CHUONG_NAP, FZ_VANG_TAM_GAP, FZ_BK, FZ_TAM_CAO, FZ_TAM_CAO_VANG, FZ_DIEM, FZ_NGOC_SAO, FZ_CHET_T, FZ_DANH_T, type Frieza } from './frieza';
import { taoGinyu, SP_GINYU, GY_KHUNG, GY_BK, GY_TAM_CAO, GY_TOC, GY_NUI_LE, GY_LAO_TOC, GY_LAO_CHAM, GY_CHET_T, GY_SOCOLA_T, GY_DIEM, GY_TEN, GY_KHIEU_T, GY_LAO_QUANG, GY_NGHI_T, GY_SAO_T, GY_SAO_TI_LE, GY_SAO_TI_LE_DAU, GY_SAO_SAT, GY_SAO_DANH, GY_TI_LE_DAM, GY_TI_LE_DA, GY_SAO_TAM, GY_NGOC_SAO, GY_HOI_SINH, GY_HOI_NE, GY_HOI_MAU, GY_HP_GOC, type Ginyu } from './ginyu';
import { GA_DEN, GA_DO, GA_TRANG, GA_TUONG, KHUNG_BAY, KHUNG_CHAY, KHUNG_CHET, KHUNG_DUNG } from './ga-du-lieu';

export type ManChoi = 'start' | 'play' | 'pause' | 'over';
// Chế độ điều khiển chọn ở màn bắt đầu: chuột (+ Tab đổi nhân vật) hoặc tay cầm
// hen = gà trắng (đi bộ) · rooster = gà đỏ (đi nhanh, nhảy) · flyer = gà đen (bay, thả trứng)
// boss = gà tướng (to gấp 5 lần, đủ 3 màu, nhiều máu)
type LoaiGa = 'hen' | 'rooster' | 'flyer' | 'boss';

export interface Ga {
  id: number; loai: LoaiGa; x: number; y: number; h: number; h0: number;
  vx: number; vy: number; phase: number; doiHuong: number;
  chet: boolean; tChet: number;
  lat: boolean; hp: number; nhay: number; chamMay?: number; choDanh?: number;
  // Gà con / gà tướng vừa mổ: đếm ngược hiệu ứng mổ; kieuMo của gà tướng luân phiên 0 mổ · 1 đá
  mo?: number; kieuMo?: number;
  // Riêng gà tướng: đếm ngược tới lượt đẻ trứng kế tiếp
  de?: number;
  // Riêng gà tướng: lần hồi sinh (0 = lần đầu), chiêu lao / bay đang dùng, thời gian hồi từng chiêu, màu đang đổi
  // Thời gian dồn lại khi gà ở xa / ngoài màn hình được cập nhật thưa (gaThua())
  dtThua?: number;
  daDe?: boolean; choChieu?: number; nghiChung?: number; soHo?: number;
  chieu?: ChieuTuong | null; hoiLao?: number; hoiBay?: number;
  mau?: MauTuong | null; conMau?: number; hoiMau?: number; luotMau?: number; dot?: number;
  // Gà mẹ GỐC (đánh dấu khác biệt): chỉ con này đẻ trứng, chỉ sống sót chứ không đi đánh; gà mẹ phụ (nở từ trứng đỏ) mới đi đánh. deDb = đếm ngược tới quả trứng đỏ kế tiếp
  goc?: boolean;
  // Vua gà (gà mẹ gốc) dưới TRON_MAU máu: quãng chạy trốn nhanh còn lại (px thật) và hướng; daTron = số lần đã dùng trốn chạy nhanh (tối đa TRON_LAN)
  tron?: number; tronX?: number; tronY?: number; daTron?: number;
  // Gà mẹ đang bị biến thành socola: số giây còn lại (đứng yên, không né, không đánh)
  socola?: number; comboSoc?: boolean;
  // Gà con nở từ trứng đỏ: sức mạnh (nhân máu và sát thương) và độ to (nhân kích thước)
  suc?: number; to?: number; db?: boolean;
  // Vua gà đã đẻ đủ (hết đẻ): sát thương cộng thêm (tăng VUA_DU_SAT mỗi giây, không giới hạn)
  satThem?: number;
  // Tướng gà lúc đẻ đủ: độ to tối đa được to dần tới (PHU_DU_TO_MAX × độ to lúc bắt đầu)
  toMax?: number;
  // Gà mẹ phụ: kiểu chuyên (0 Lao · 1 Bay · 2 đen · 3 vàng · 4 đỏ), cũng là màu riêng của con đó
  kieuPhu?: number;
  // Gà con bị đòn ăn (quất râu Zinbu / bắn chưởng Mabu) đang bị kéo về nhân vật p; hong = socola hồng (Mabu); an = máu / mana nhận được khi ăn
  keo?: { p: number; an: number }; hong?: boolean;
  // Thế phòng thủ: giây còn lại (đang né mọi đòn) và đếm ngược tới thế kế tiếp
  the?: number; hoiThe?: number;
  // Chiêu Gọi gà con: hồi chiêu còn lại và giây hiệu ứng đang gọi (để sáng nút)
  hoiGoi?: number; dangGoi?: number;
  // Gà mẹ gốc đã vào giai đoạn 2 (máu dưới GD2_MAU): đẻ trứng nhanh hơn
  gd2?: boolean;
  // Gà con bị Đá hất lùi: giây còn choáng (đứng yên, không đánh) và vận tốc đang bị đẩy
  choang?: number; day?: { vx: number; vy: number };
  // Gà đỏ: thời gian đã lao liên tục và giây còn khựng lại (thở dốc, nhận thêm sát thương)
  chayDo?: number; kiet?: number;
  // Gà đen: bay vòng → báo hiệu → nhào xuống → nghỉ
  nhao?: NhaoGa | null;
}
/** Chiêu nhào của gà đen: vong = bay vòng quanh nhân vật · bao = báo hiệu (vệt đỏ) · lao = nhào thẳng · nghi = nghỉ */
interface NhaoGa { pha: 'vong' | 'bao' | 'lao' | 'nghi'; t: number; ux: number; uy: number; quang: number; ang: number; huong: number; vong: number; }
type MauTuong = 'den' | 'vang' | 'do';
// Chiêu lao / bay của gà tướng: báo hiệu → chạy thẳng một đường (không đổi hướng) → nghỉ
interface ChieuTuong {
  loai: 'lao' | 'bay'; pha: 'bao' | 'chay' | 'nghi'; t: number; ux: number; uy: number; quang: number; trung: boolean[];
}
// Trứng do gà tướng đẻ: sau TRUNG_NO giây nở ra gà `loai`
export interface TrungGa {
  id: number; x: number; y: number; t: number; loai: 'hen' | 'rooster' | 'flyer';
  /** Trứng đỏ đặc biệt: to gấp TRUNG_DB_TO lần, gà mẹ gốc canh quanh nó; cứ 2s nở một gà con mạnh dần, tới 10s nở ra một gà mẹ phụ */
  db?: boolean; no?: number; me?: number;
  /** thời gian ấp trứng đỏ (giây), chốt lúc đẻ theo số tướng gà đang sống (apTrungDb) */
  ap?: number;
}
/** soc = chưởng biến socola của Zinbu · troi = chưởng tự bắn lên trời (chỉ để đẹp, không gây sát thương) */
interface Dan { id: number; p: number; /** nhóm đòn đã ra (0 Đấm · 1 Đá · 2 Chiêu đặc biệt) */ nhom?: number; /** chưởng xuyên: id các gà đã trúng trên đường bay */ da?: number[]; x0: number; y0: number; x1: number; y1: number; t: number; T: number; phu: boolean; to: boolean; sat: number; soc?: boolean; troi?: boolean; /** đòn ăn: gà con trúng thì hoá socola (hong = socola hồng của Mabu) và bị kéo về nhân vật ăn */ an?: 'soc' | 'hong'; /** chưởng của Vegeta (vẽ bằng quả chưởng sao chổi) */ vg?: boolean; /** đòn của bản sao bóng ma Goku (p = người bị sao chép, chỉ trúng nhân vật) */ gy?: boolean; /** chưởng của Super Bư (quả cầu vàng to) */ sb?: boolean; /** chiêu Bóng ma của Super Bư (con ma bay tới rồi nổ to) */ ma?: boolean; /** đòn của con Bư (p = người mang thân Super Bư): không hồi mana, không đổi combo của người đó, không đụng máy bay / bánh / đồng đội */ con?: boolean; }
/** Quả táo rơi từ cây đổ: đỏ = hồi máu, xanh = hồi mana */
/** socola = gà con bị biến thành socola: nhân vật ăn +SOCOLA_NV_MAU máu +SOCOLA_NV_MANA mana, gà ăn hồi SOCOLA_GA_TI_LE máu tối đa */
export interface VatPham { id: number; x: number; y: number; t: number; loai?: 'do' | 'xanh' | 'socola' | 'ngoc' | 'dau'; /** ngọc: số sao (thiếu = 1) */ sao?: number; /** ngọc: độ to khi vẽ (thiếu = 0,55) */ to?: number; /** socola: số máu = số mana nhân vật nhận khi ăn (thiếu thì SOCOLA_NV_MAU / SOCOLA_NV_MANA) */ luong?: number; /** socola: máu tối đa của con gà đã chết thành socola; gà ăn hồi SOCOLA_GA_TI_LE × số này */ hpGa?: number; /** socola: sức mạnh (nhân sát thương) người / Cell ăn được cộng thêm (thiếu thì `CELL_AN_SUC`) */ sucAn?: number; }
interface Chu { id: number; x: number; y: number; text: string; mau: string; t: number; }
interface Long { id: number; x: number; y: number; vx: number; vy: number; xoay: number; vxoay: number; t: number; mau: string; }
/** chay = cháy nổ (lửa + tia lửa); co = hệ số kích thước */
/** vg = vụ nổ chưởng của Vegeta (vẽ bằng khung nổ trong vegeta_chuong.png) */
interface Vet { id: number; x: number; y: number; t: number; loai: 'bui' | 'no' | 'chay'; co?: number; vg?: boolean; }
interface ChuyenBay { x0: number; y0: number; x1: number; y1: number; t: number; T: number; }
export interface NguoiChoi {
  ten: string; mau: string; diem: number; combo: number;
  hoiChieu: number; chumDen: number; banTrung: number; banTruot: number;
  x: number; y: number; dich: { x: number; y: number } | null; dangDi: boolean;
  hp: number; het: boolean;
  /** Chế độ 1 người chơi: nhân vật không tham gia (không vẽ, không điều khiển, coi như đã gục) */
  vang?: boolean;
  nv: NhanVat; bay: ChuyenBay | null;
  /** Mana (cộng không giới hạn; dùng cho bay, chưởng, Biến mây / socola); bayKhoa = giây còn khoá sau mỗi lần bay */
  mana: number; bayKhoa: number;
  /** thuongLuc = tGame lúc bị thương gần nhất (để hồi máu tự nhiên) */
  thuongLuc: number;
  /** Giây còn hồi của chiêu Biến socola (riêng Zinbu), tách khỏi hoiChieu để không khoá Đấm / Đá / chưởng */
  hoiSoc: number;
  nhin: { x: number; y: number }; cuaCan: boolean;
  may: { dang: boolean; con: number; hoi: number };
  /** Sức mạnh: hệ số nhân sát thương mọi đòn đánh gà (mặc định 1; ăn gà mẹ socola được cộng thêm) */
  suc: number;
  /** Sát thương cộng thẳng vào mỗi đòn (sau khi nhân `suc`), +DAU_SAT mỗi hạt đậu thần (mặc định 0) */
  satDau: number;
  /** Nhân vật ở ô này: 0 Mabu · 1 Zinbu · 2 Vegeta (NHAN_VAT); ván lưu cũ thiếu thì theo ô (0 Mabu, 1 Zinbu) */
  ki: number;
}
type VatXep =
  | { loai: 'ga'; y: number; ga: Ga }
  | { loai: 'nv'; y: number; p: number }
  | { loai: 'td'; y: number; td: TrangTri }
  | { loai: 'cuu'; y: number; cu: Cuu }
  | { loai: 'cau'; y: number; cau: CauTron }
  | { loai: 'mb'; y: number }
  | { loai: 'pt'; y: number }
  | { loai: 'cell'; y: number; ce: Cell }
  | { loai: 'gy'; y: number }
  | { loai: 'fz'; y: number }
  | { loai: 'banh'; y: number; tc: Tiec }
  | { loai: 'cong'; y: number; than?: boolean; mc?: boolean }
  | { loai: 'quai'; y: number; q: QuaiMc }
  | { loai: 'ba'; y: number }
  | { loai: 'conbu'; y: number; cb: ConBu };

/** Quả cầu trốn: san = sẵn sàng · trong = có nhân vật p đang trốn · vo = đang vỡ ra (hoạt ảnh) · moc = đã vỡ, chờ CAU_MOC giây mọc quả mới. t = số giây của pha hiện tại */
/** cua = chủ quả cầu (0 Mabu · 1 Zinbu): chỉ đúng người đó chui vào được, quả cầu có avatar của người đó */
export interface CauTron { x: number; y: number; pha: 'san' | 'trong' | 'vo' | 'moc'; p: number; t: number; cua: number; }
/** Tự chỉnh độ phân giải: dưới FPS_THAP (so với 60, lúc đang mát máy tính theo FPS_MAT) thì giảm DPR_BUOC mỗi lần, không thấp hơn DPR_SAN;
 *  FPS ổn định ≥ FPS_TANG × FPS mục tiêu liền DPR_TANG_DEM lần đo (0,5s / lần) và đã chờ đủ dprChoTang từ lần hạ trước thì tăng lại một bậc */
const FPS_THAP = 50;
const DPR_BUOC = 0.25;
const DPR_SAN = 0.6;
const DPR_TOI_DA = 2;
const FPS_TANG = 0.95;
const DPR_TANG_DEM = 10;
/** Chờ sau lần hạ trước khi thử tăng lại (ms); tăng lên rồi lại phải hạ ngay (trong DPR_DAO_DONG) thì chờ gấp đôi, tối đa DPR_CHO_TOI_DA */
const DPR_CHO = 10000;
const DPR_DAO_DONG = 15000;
const DPR_CHO_TOI_DA = 120000;
/** Chế độ mát máy (tự động): giới hạn FPS_MAT khung / giây và độ phân giải tối đa DPR_MAT (máy đỡ nóng khi đông gà).
 *  Đang chơi mà FPS đo được dưới MAT_BAT_FPS liền MAT_BAT_DEM lần đo (0,5s / lần) thì tự bật trong MAT_THOI_GIAN giây rồi tự tắt */
const FPS_MAT = 30;
/** Trần FPS lúc chơi bình thường: màn 120 / 144Hz cũng chỉ vẽ tối đa 60 khung / giây (đỡ nóng máy, logic giữ đúng dt) */
const FPS_TOI_DA = 60;
const DPR_MAT = 1;
const MAT_BAT_FPS = 30;
const MAT_BAT_DEM = 2;
const MAT_THOI_GIAN = 40;
/** Độ phân giải canvas nền so với điểm ảnh CSS (thấp để nhẹ, nền vốn mịn) */
const NEN_TL = 0.5;
const taoCauTron = (): CauTron[] => CAU_VI_TRI.map(([dx, dy], cua) => ({ x: MAP / 2 + dx, y: MAP / 2 + dy, pha: 'san', p: -1, t: 0, cua }));

/**
 * Máy bay (một chiếc, đặt trong vườn gà): dau = đậu · cat = đang cất cánh · bay = đang bay · trung = vừa trúng chưởng, lung lay · no = đã nổ, chờ MB_HOI giây hồi phục.
 * ngoi = thứ tự lên máy bay (ngoi[0] là phi công, người lên trước). z = độ cao 0..1. goc = chỗ xuất hiện lại: ban đầu là chỗ đậu đầu tiên,
 * nổ trên đất liền (vườn / sa mạc, kể cả lúc đang đậu) thì hạ cánh luôn ở đó và hồi phục đúng chỗ đó.
 */
export interface MayBay { x: number; y: number; pha: 'dau' | 'cat' | 'bay' | 'trung' | 'no'; t: number; z: number; ngoi: number[]; lat: boolean; chay: boolean; goc: { x: number; y: number }; }
/** Hình máy bay để vẽ (đã lọc theo khung nhìn): khung atlas, độ mờ, độ to, nâng lên (px), nhãn trên đầu */
export interface MbHinh { x: number; y: number; nang: number; khung: number; a: number; to: number; lat: boolean; rung: number; bong: number; nhan: string | null; /** nhãn cao hơn chân bấy nhiêu px (mặc định 190) */ nhanCao?: number; }
const SP_MB: KhungSprite = { atlas: 'assets/game/may_bay.png', atlasW: 1024, atlasH: 1536, w: 512, h: 512, cot: 2, neoX: 256, neoY: 256 };
const MB_TO = 1.25;
/** Tâm thân máy bay cao hơn điểm đậu (chân) bấy nhiêu px; thêm MB_NANG × z khi đã lên không */
const MB_CENTRO = 105;
const MB_NANG = 480;
/** Khi máy bay đã lên không: camera thu nhỏ bấy nhiêu lần (nhân với z) và dịch lên theo độ cao để máy bay ở giữa màn */
const MB_ZOOM = 0.62;
/** Bán kính lên máy bay (đi vào là lên) và bán kính trúng chưởng */
const MB_BK = 170;
const MB_TRUNG_BK = 150;
const MB_CAT = 1.8;
const MB_TOC = 850;
const MB_LUNG = 0.4;
const MB_HOI = 15;
const MB_NO_HINH = 1.3;
const MB_LE = 260;
const taoMayBay = (x: number, y: number): MayBay => ({ x, y, pha: 'dau', t: 0, z: 0, ngoi: [], lat: false, chay: false, goc: { x, y } });

/**
 * Phi thuyền (một chiếc, không điều khiển được; lúc còn dưới đất (đậu / cất cánh) trúng chưởng thì nổ như máy bay, hồi phục sau MB_HOI giây ở bến đó): đậu cạnh máy bay trong vườn gà, chở đủ 2 nhân vật bay thẳng tới núi đá
 * (và ngược lại). dau = đậu (cửa mở khi có người lại gần) · cat = đóng cửa, cất cánh · bay = tự bay tới bến kia · ha = hạ cánh · ra = mở cửa, mọi người bước ra · no = đã nổ, chờ MB_HOI giây.
 * noi = bến đang đậu; vuon / nui = chỗ đậu ở vườn gà / núi đá; mo = độ mở cửa 0..1; cho = người vừa bước ra, phải đi khỏi PT_BK mới lên lại được.
 */
export interface PhiThuyen { x: number; y: number; pha: 'dau' | 'cat' | 'bay' | 'ha' | 'ra' | 'no'; t: number; z: number; mo: number; ngoi: number[]; cho: number[]; lat: boolean; noi: 'vuon' | 'nui'; vuon: { x: number; y: number }; nui: { x: number; y: number }; }
const SP_PT: KhungSprite = { atlas: 'assets/game/phi_thuyen.png', atlasW: 1800, atlasH: 480, w: 300, h: 240, cot: 6, neoX: 150, neoY: 230 };
const PT_TO = 2.6;
const PT_NANG = 480;
/** Bán kính lên phi thuyền và bán kính lại gần thì cửa mở */
const PT_BK = 190;
/** Hộp trúng chưởng quanh thân phi thuyền (nửa rộng, nửa cao) và tâm thân cao hơn chân bấy nhiêu */
const PT_TRUNG_X = 300;
const PT_TRUNG_Y = 200;
const PT_TAM = 260;
/** Cổng dịch chuyển (đảo 4 ↔ thần điện): bước vào trong CONG_BK quanh chân cổng thì dịch chuyển; ra đứng cách chân cổng CONG_RA_Y
 *  về phía trước, phải đi xa hơn CONG_RA mới vào lại được */
const CONG_BK = 200;
const CONG_RA = 450;
const CONG_RA_Y = 320;
const PT_MO_BK = 520;
const PT_TOC = MB_TOC * 5;
const PT_CAT = 2;
const PT_HA = 1.6;
const PT_RA = 0.7;
/** Phi thuyền đậu cách máy bay bấy nhiêu (về phía giữa vườn) */
const PT_CACH_MB = 560;
/** Chỗ đậu ở núi đá: trên đường từ tâm núi về phía vườn gà, cách tâm bấy nhiêu phần bán kính */
const PT_NUI_K = 0.35;
/** Cây trong vùng này quanh máy bay / phi thuyền dưới đất bị ẩn (nửa rộng, phía sau, phía trước tính từ chân xe) để không che xe */
const XE_CHE_X = 340;
const XE_CHE_SAU = 120;
const XE_CHE_TRUOC = 480;
const ptBenNui = () => {
  const a = Math.atan2(MAP / 2 - NUI.y, MAP / 2 - NUI.x);
  return { x: NUI.x + Math.cos(a) * NUI.rx * PT_NUI_K, y: NUI.y + Math.sin(a) * NUI.ry * PT_NUI_K };
};
const taoPhiThuyen = (mb: { x: number; y: number }): PhiThuyen => {
  const vuon = { x: kep(mb.x + (mb.x < MAP / 2 ? 1 : -1) * PT_CACH_MB, TUONG + MB_LE, MAP - TUONG - MB_LE), y: mb.y };
  return { ...vuon, pha: 'dau', t: 0, z: 0, mo: 0, ngoi: [], cho: [], lat: false, noi: 'vuon', vuon, nui: ptBenNui() };
};

/** Cứu đồng đội: nhân vật còn sống phủ mây (Mabu cứu Zinbu) hoặc socola (Zinbu cứu Mabu) lên người ngã; sống sót CUU_THOI_GIAN giây (mây / socola bám theo, nối bằng dây) thì người ngã hồi sinh */
export interface Cuu { p: number; kieu: 'may' | 'socola'; x: number; y: number; cho: number; t: number; tach: number; }

/** Vật trang trí nền cỏ (cây, bụi, đá): chỉ để đẹp, không cản đường. loai là chỉ số trong TRANG_TRI_SPRITE (ve-canvas.ts) */
export interface TrangTri { x: number; y: number; loai: number; lat: boolean; /** thời điểm (`t` của game) bị đánh đổ; chỉ cây (loai 0), chưa đổ thì không có */ doLuc?: number; /** hướng đổ: 1 = sang phải, -1 = sang trái */ huongDo?: number; /** cây đã rơi táo thì biến mất, chỉ còn quả táo */ mat?: boolean; /** cây to: đổ thì chắc chắn rơi CAY_TO_MAU táo đỏ + CAY_TO_MANA táo xanh */ to?: boolean; /** trang trí của đảo cát (ảnh sa mạc) */ sa?: boolean; /** tảng đá của núi đá (atlas DA_NUI) */ nui?: boolean }
/** Bán kính (quanh gốc cây) mà đòn / chưởng quét qua thì cây đổ */
// Cây đổ xong CAY_MOC_LAI giây thì mọc lại. Cây to (to gấp CAY_TO_HE_SO) đổ thì chắc chắn rơi CAY_TO_MAU táo đỏ + CAY_TO_MANA táo xanh
const CAY_MOC_LAI = 10;
const CAY_TO_HE_SO = 1.8;
const CAY_TO_MAU = 2;
const CAY_TO_MANA = 2;
const CAY_DO_KINH = 90;
/** Chiều cao thân cây tính từ gốc: đòn trúng trong khoảng này phía trên gốc là trúng cây */
const CAY_DO_CAO = 220;
/** Tảng đá núi trúng chưởng (Chiêu đặc biệt / socola) thì vỡ thành đá nhỏ (dùng chung `doLuc` với cây đổ nên lưu ván như cây), DA_VO_LAI giây sau liền lại */
const DA_VO_LAI = 15;
/** Hộp trúng của tảng đá (nửa rộng, cao) theo cỡ ảnh DA_NUI: loai 1–2 khối to, còn lại vừa / nhỏ */
const hopDaNui = (loai: number) => (loai <= 2 ? { r: 190, h: 390 } : { r: 90, h: 160 });


export const PHIEN_BAN_LUU = 4;
/** Dữ liệu một ván đã lưu: các trường tuỳ ý của game, máy chủ chỉ lưu nguyên khối JSON */
export interface TrangThaiLuu {
  phienBan: number; tGame: number; t: number; chamDen: number; id: number;
  henTuong: number; soLanTuong: number; lanTuong: number;
  ga: Ga[]; trungDe: TrungGa[]; vatPham: VatPham[]; cuu: Cuu[];
  /** Ngọc rồng đã nhặt (thiếu = chưa có) */
  ngocNhat?: number[];
  /** Quả cầu trốn (thiếu = ván lưu cũ, tạo mới) */
  cauTron?: CauTron[];
  /** Cell canh đảo (thiếu = ván lưu cũ, tạo mới) */
  cell?: Cell[];
  /** Tiệc sinh nhật của Cell (thiếu = ván lưu cũ, không có tiệc) */
  tiec?: Tiec[] | null;
  /** Máy bay (thiếu = ván lưu cũ, tạo mới ở chỗ ban đầu) */
  mayBay?: MayBay;
  /** Phi thuyền (thiếu = ván lưu cũ, tạo mới cạnh máy bay) */
  phiThuyen?: PhiThuyen;
  /** Ginyu canh núi đá (thiếu = ván lưu cũ, tạo mới) */
  ginyu?: Ginyu;
  /** Vườn gà ngủ / tổ trứng chờ vua gà (thiếu = vườn đang hoạt động bình thường) */
  vuon?: { ngu: boolean; to: { x: number; y: number } | null; toDe: number; daNoPhu: number; choVua: boolean };
  /** Bản đồ của ván (thiếu = ván lưu cũ, đồng cỏ) */
  banDo?: LoaiBanDo;
  /** Cây đã đổ: [chỉ số trong trangTri, thời điểm đổ, hướng đổ] */
  cayDo?: [number, number, number, number?][];
  /** Chỉ số cây cối / vật dụng thần điện đã bị chưởng phá (THAN_VAT) */
  thanVo?: number[];
  /** Frieza: máu (dạng thường) và đã bị hạ chưa (thiếu = Frieza mới) */
  frieza?: { hp: number; chet: boolean };
  /** Đã có người ra khỏi vườn gà / ở lì vườn gà 5 phút (on: máy bay thôi hồi máu) / Cell đỏ, Frieza, bóng ma Goku đang truy sát (thiếu = ván lưu cũ: coi như đã ra vườn) */
  truyVuon?: { ra: boolean; on: boolean; cell?: boolean; fz?: boolean; gy?: boolean; th?: boolean; mc?: boolean };
  nguoi: (Omit<NguoiChoi, 'nv' | 'cuaCan' | 'dich' | 'bay'> & { nhom: number; lat: boolean; huong: 'ngang' | 'len' | 'xuong' })[];
}

// Chiều rộng khung nhìn (đơn vị khung) thay đổi theo tỉ lệ cửa sổ để map tràn hai bên; H cố định. Phía trên map có thanh đen cao BAR chứa các chiêu của gà mẹ (toạ độ y âm).
const W_MAC_DINH = 1600;
/** Chơi tới chừng này giây thì Cell đỏ (còn sống) rời đảo đi truy sát mọi nơi (kiemTraCellTruy()); nếu tới lúc này chưa ai ra khỏi vườn gà thì
 *  máy bay / phi thuyền thôi hồi máu / mana (kiemTraOLiVuon()) */
const CELL_TRUY_T = 300;
/** Nhặt đủ ngọc rồng xong chờ chừng này giây rồi mới hiện màn chiến thắng (kiemTraThang()) */
const THANG_CHO = 3;
/** Số viên ngọc rồng (1 sao → n sao) phải nhặt đủ để thắng (kiemTraThang(), duNgoc()) */
const NGOC_THANG = 5;
/** Chơi tới chừng này giây thì Frieza (còn sống) rời thần điện bay đi truy sát mọi nơi (kiemTraFzTruy()) */
const FZ_TRUY_T = 600;
/** Chơi tới chừng này giây (sớm 2 phút so với Frieza truy sát) thì hợp thể Super Bư mở khoá ở mọi nơi (hopTheMo(), kiemTraHopMo()) */
const HOP_THE_MO_T = 480;
/** Chơi tới chừng này giây mà bóng ma Goku chưa bị hạ hẳn thì nó rời núi đá bay đi truy sát (tốc độ lao GY_LAO_TOC, kiemTraGyTruy()) */
const GY_TRUY_T = 900;
/** Chơi tới chừng này giây mà còn người chơi sống: người chơi + Cell đỏ + Frieza + bóng ma Goku (còn sống) bị triệu hồi về thần điện,
 *  không ai thoát ra được nữa (kiemTraTrieuHoi(), giamThan()); báo trước TRIEU_HOI_BAO giây */
const TRIEU_HOI_T = 1200;
const TRIEU_HOI_BAO = 60;
/** Bị triệu hồi rồi mà tới chừng này giây (còn người sống) chưa nhặt ngọc 4 sao của mê cung bom thì cả đội bị dịch chuyển tới cửa hầm
 *  mê cung bom (kiemTraSangMc()) để vào lấy viên ngọc đó; không còn thắng bằng trụ vững */
const SANG_MC_T = 1500;
/** Bóng ma đang truy sát: mục tiêu xa hơn chừng này thì bay thẳng tới (tốc độ GY_LAO_TOC, qua vực / tường vườn), gần thì khiêu khích → lao như trên núi */
const GY_TRUY_GAN = 700;
/** Tốc độ Frieza bay đi truy sát (px/s): 1/2 máy bay; gần mục tiêu trong FZ_BAY_GAN thì chạy đánh như thường */
const FZ_BAY_TOC = MB_TOC / 2;
const FZ_BAY_GAN = 600;
/** Lúc truy sát (fzTruy) Frieza đi tìm Mabu / Zinbu (bay và chạy ngoài thần điện) nhanh gấp chừng này lần */
const FZ_TRUY_GAP = 3;
const W_TOI_THIEU = 1100;
const W_TOI_DA = 2800;
const BAR = 80;
const H = 900;
const MAP = 6400;
// Tường gạch bao quanh bản đồ: dải dày TUONG ở cả 4 mép (nằm trong 0..MAP). Không vật nào đi vào tường (giuTrongMap, kepX / kepY).
const TUONG = 114; // = đúng một lớp mặt tường (38px × TL_TUONG 3)
// Hai bảng chiêu thức khoét vào map ở hai góc dưới (hình bán nguyệt nền đen, tâm nằm trên mép dưới): Mabu bên trái, Zinbu bên phải. Map vẫn chiếm cả màn hình.
const R_BANG = 225;
const TAM_VIEW_Y = 520;
/** Dải mờ dần ở mép tầm nhìn của sương mù trên đảo (đơn vị thế giới) */
const MO_RO = 220;
// Camera chung đặt ở trung điểm 2 nhân vật. ZOOM là mức gần nhất, hai người càng xa thì càng thu nhỏ tới ZOOM_MIN.
const ZOOM = 0.55;
const ZOOM_MIN = 0.36;
// Phần màn hình (pixel) dành cho khoảng cách giữa 2 nhân vật: chiều ngang, chiều dọc
const VUNG_X = 1000;
const VUNG_Y = 660;
// Khoảng cách tối đa giữa 2 nhân vật (đơn vị bản đồ), vượt quá thì bị chặn lại như dây buộc
const MAX_DX = VUNG_X / ZOOM_MIN;
const MAX_DY = VUNG_Y / ZOOM_MIN;
// Sprite pixel art phóng to S_NV lần, không ép dẹt để giữ nét
const S_NV = 2.8;
const S_GA = 0.9;
// Gà cũng bị ép dẹt theo chiều đứng như nhân vật khi nhìn từ trên cao
const EP_GA = 0.72;
const THOI_GIAN_HOANG_HON = 90;
// Máu: nhân vật vào ván HP_KHOI_DAU, quái HP_GA; khác nhau ở sát thương gây ra và tỉ lệ giảm sát thương khi nhận
// HP_NV chỉ là mốc đầy bình máu (bình vẽ theo max(HP_NV, máu hiện có)); ăn máu (táo, socola, hạ gà mẹ) cộng không giới hạn.
// Không bị thương HP_HOI_CHO giây thì tự hồi HP_HOI máu mỗi giây, nhưng chỉ hồi tới HP_HOI_TOI_DA.
const HP_NV = 300;
const HP_KHOI_DAU = 150;
const HP_HOI = 2;
const HP_HOI_CHO = 5;
const HP_HOI_TOI_DA = 150;
const HP_GA = 100;
const GIAM_NV = 0.5;
// Gà mẹ giảm 40% sát thương ngoài thế phòng thủ; mỗi đòn nhận tối đa TUONG_NHAN_TOI_DA (trước khi nhân đôi); lúc sơ hở sát thương nhận ×SO_HO_NHAN
const GIAM_GA: Record<string, number> = { hen: 0, rooster: 0, flyer: 0, boss: 0.4 };
const TUONG_NHAN_TOI_DA = 60;
const SO_HO_NHAN = 2;
// Gà mẹ gốc dưới GD2_MAU máu vào giai đoạn 2: đẻ trứng nhanh hơn (chu kỳ nhân GD2_DE)
const GD2_MAU = 0.5;
const GD2_DE = 0.6;
// Xác suất né đòn ngẫu nhiên: nhân vật 25%, gà con 0%; gà mẹ không né ngẫu nhiên mà né 100% trong thế phòng thủ (neGa)
const NE_NV = 0.25;
const NE_GA: Record<string, number> = { hen: 0, rooster: 0, flyer: 0, boss: 0 };
// Sát thương nhân vật gây ra: [Mabu, Zinbu, Vegeta] (theo NguoiChoi.ki) theo nhóm đòn 0 Đấm · 1 Đá · 2 Chiêu đặc biệt; mây (riêng Mabu)
// Vegeta lấy sức mạnh giữa Mabu và Zinbu
const SAT_THUONG = [[50, 50, 50], [70, 100, 85], [130, 190, 160]];
// Hợp thể Super Bư (chỉ đội Mabu + Zinbu, chế độ tay cầm): hai người đứng gần nhau trong HOP_THE_GAN và cùng bấm một nút đánh (A / B / X / Y)
// trong HOP_THE_CUA giây thì hợp thể. Super Bư mạnh gấp HOP_THE_GAP lần Mabu + Zinbu cộng lại: máu = HOP_THE_GAP × tổng máu hai người lúc hợp thể,
// mỗi đòn = HOP_THE_SAT_GAP × (đòn cùng nhóm của Mabu + của Zinbu). Tồn tại HOP_THE_T giây (đếm ngược trên đầu) rồi tách ra, chờ HOP_THE_HOI giây mới hợp thể lại.
// Người ít máu hơn lúc hợp thể chỉ điều khiển đi lại / bay, người nhiều máu hơn (bằng nhau thì Mabu) chỉ điều khiển ra đòn.
const HOP_THE_GAN = 300;
const HOP_THE_CUA = 1;
/** Máy bay chở dưới 2 người không bay vào trong lề này quanh thần điện */
const MB_THAN_LE = 300;
/** Lề quanh mê cung bom / đường hầm mà máy bay không bay vào được */
const MB_MC_LE = 300;
const HOP_THE_GAP = 3;
/** Sát thương mỗi đòn của Super Bư = HOP_THE_SAT_GAP × (đòn Mabu + đòn Zinbu) (máu vẫn HOP_THE_GAP × tổng máu) */
const HOP_THE_SAT_GAP = 4.5;
const HOP_THE_T = 75;
const HOP_THE_HOI = 15;
/** Super Bư bị hạ: tách ra sớm, mỗi người còn HOP_THE_CON_MAU máu lúc hợp thể (tối thiểu 1) */
const HOP_THE_CON_MAU = 0.1;
/** Chiêu Bóng ma (nhóm 3 của Super Bư): sát thương = HOP_THE_SAT_GAP × (Biến mây Mabu + Biến socola Zinbu), nổ bán kính BAN_KINH_MA, hồi MA_HOI giây */
const BAN_KINH_MA = 300;
const MA_HOI = 0.5;
/** Độ cao thanh máu trên đầu Super Bư (cao hơn Mabu / Zinbu) */
const DAU_SB = 540;
/** Màu riêng mỗi nhân vật (theo ki) */
const MAU_NV = ['#e84393', '#8e44ad', '#2f6fe0'];
/** Độ cao thanh máu trên đầu theo nhân vật (ki) */
const DAU_NV = [195, 150, 210];
/** Lựa chọn ở màn bắt đầu → nhân vật (ki) ở ô trái / phải; null = ô đó vắng */
export type CheNguoi = 'mabu' | 'zinbu' | 'vegeta' | 'ca2' | 'mabuVegeta' | 'vegetaZinbu';
export const DOI_HINH: Record<CheNguoi, [number | null, number | null]> = {
  mabu: [0, null], zinbu: [null, 1], vegeta: [2, null], ca2: [0, 1], mabuVegeta: [0, 2], vegetaZinbu: [2, 1],
};
/** Thứ tự thẻ ở màn chọn (một hàng). Vegeta tạm ẩn vì nhân vật chưa hoàn thiện (vẫn giữ trong DOI_HINH) */
export const THE_CHON: CheNguoi[] = ['mabu', 'zinbu', 'ca2'];
const SAT_MAY = 250;
// Chiêu Biến socola (riêng Zinbu, nhóm đòn 3): chưởng bay tới điểm chuột (tối đa TAM_SOCOLA), nổ bán kính BAN_KINH_SOCOLA. Gà con dính thì chết luôn và thành socola; gà mẹ dính sát thương SAT_SOCOLA rồi hoá socola SOCOLA_THOI_GIAN giây (đứng yên, không né).
// Hồi SOCOLA_HOI giây (đồng hồ riêng hoiSoc, không khoá các đòn khác); tốn MANA_DAC_BIET.
const SAT_SOCOLA = 150;
const TAM_SOCOLA = 700;
const BAN_KINH_SOCOLA = 260;
const SOCOLA_THOI_GIAN = 5;
const SOCOLA_HOI = 3;
// Gà ăn socola: hồi SOCOLA_GA_TI_LE (2%) máu tối đa
// Nhân vật ăn socola: +SOCOLA_NV_MAU máu, +SOCOLA_NV_MANA mana (không giới hạn), rồi tự bắn chưởng lên trời
const SOCOLA_NV_MAU = 100;
const SOCOLA_NV_MANA = 100;
// Socola từ chiêu Biến socola của Zinbu (chưởng nổ): ăn nhận SOCOLA_AN_TI_LE máu của con gà lúc hoá socola, vào cả máu lẫn mana (đòn ăn thường vẫn theo AN_TI_LE)
const SOCOLA_AN_TI_LE = 0.5;
// Ăn Cell (thanh socola do Cell chết hoá ra) hoặc Cell ăn socola: nhận CELL_AN_TI_LE máu của Cell đó (vào cả máu lẫn mana với người) và CELL_AN_TI_LE sức mạnh của nó,
// sức mạnh Cell = CELL_SAT / CELL_SUC_THAM_CHIEU (Zinbu đấm 50 = 1); không giới hạn trần
const CELL_AN_TI_LE = 0.3;
const CELL_SUC_THAM_CHIEU = 50;
const CELL_AN_SUC = 0.3;
// Gà (con, mẹ gốc, mẹ phụ) ăn socola: hồi SOCOLA_GA_TI_LE máu tối đa, sức mạnh (nhân sát thương) +SOCOLA_SUC_GA, độ to +SOCOLA_TO_GA mỗi thanh; có trần để không to vô hạn
const SOCOLA_SUC_GA = 0.5;
const SOCOLA_TO_GA = 0.25;
const SOCOLA_SUC_TOI_DA = 8;
const SOCOLA_TO_TOI_DA = 3.5;
const SOCOLA_TO_TOI_DA_ME = 2;
// Gà mẹ đang là socola mà dính mây của Mabu: luôn mất SOCOLA_MAY_MAT (30%) máu tối đa (không né, không giảm sát thương); máu còn từ 30% trở xuống thì chết luôn
const SOCOLA_MAY_MAT = 0.3;
// Chưởng tự bắn lên trời: bay SOCOLA_TROI_CAO lên trên, mất TROI_THOI_GIAN giây rồi nổ cháy
const TROI_CAO = 700;
const TROI_THOI_GIAN = 0.8;
// Quái chạm nhân vật thì đánh: sát thương gốc, bán kính chạm (chân với chân), thời gian chờ giữa 2 lần đánh (tốc độ đánh)
const SAT_GA: Record<string, number> = { hen: 32, rooster: 48, flyer: 60, boss: 80 };
const CHAM_GA: Record<string, number> = { hen: 70, rooster: 70, flyer: 70, boss: 220 };
const HOI_DANH_GA: Record<string, number> = { hen: 1.2, rooster: 0.8, flyer: 1.5, boss: 2 };
// Vua gà không hồi sinh (TUONG_HOI_SINH = 0, chỉ 1 mạng)
const TUONG_HOI_SINH = 0;
// Vua gà (gà mẹ gốc) có HP_VUA máu, không hồi sinh; vương miện đính ngọc rồng 1 sao, rơi xuống đất khi nó chết
const HP_VUA = 2600;
const NGOC_BAN_KINH = 110;
// Chưởng / vụ nổ của Vegeta (tools/tao-atlas-vegeta.py, lấy từ sheet Frieza): 0 chưởng sao chổi (đầu bên phải) · 1 quả trắng · 3–7 vụ nổ lớn dần
const SP_VG_CHUONG: KhungSprite = { atlas: 'assets/game/vegeta_chuong.png', atlasW: 1536, atlasH: 160, w: 192, h: 160, cot: 8, neoX: 96, neoY: 80 };
const SP_NGOC: KhungSprite = { atlas: 'assets/game/ngoc_rong.png', atlasW: 1792, atlasH: 256, w: 256, h: 256, cot: 7, neoX: 128, neoY: 128 };
// Gà mẹ không còn né ngẫu nhiên: cứ THE_CHU_KY giây vào "thế phòng thủ" THE_KEO_DAI giây trong thế né 100% mọi đòn (hiện chữ "NÉ!", có quầng xanh bao quanh), ngoài thế thì không né đòn nào
const THE_CHU_KY = 6;
const THE_KEO_DAI = 2;
// Chiêu Gọi gà con (mọi gà mẹ): máu dưới GOI_MAU (40%) thì gọi GOI_DAN (cộng thêm 1 con mỗi lần hồi sinh) gà con ra bảo vệ, hồi GOI_HOI giây
const GOI_MAU = 0.4;
// Vua gà (gà mẹ gốc) dưới TRON_MAU máu: bỏ canh trứng đỏ / đi ăn socola, chỉ chạy trốn nhân vật;
// mỗi mạng được đúng 1 lần chạy trốn nhanh: tốc độ gấp TRON_TOC lần tốc độ chạy trốn thường (TOC_TRON), quãng TRON_QUANG = 2 × quãng bay của Zinbu (BAY_CAN)
const TRON_MAU = 0.2;
// Vua gà (gà mẹ gốc) tự hồi HOI_MAU_VUA máu / giây, tới máu tối đa (hpToiDa) (đang hoá socola thì không hồi)
const HOI_MAU_VUA = 2;
// Vua gà đẻ đủ số lượng (đủ GA_CON_TOI_DA gà con và ME_PHU_TOI_DA tướng gà, không đẻ được nữa) thì tự tăng
// VUA_DU_MAU máu / giây và VUA_DU_SAT sát thương / giây, không giới hạn (đang hoá socola thì không tăng)
const VUA_DU_MAU = 5;
const VUA_DU_SAT = 3;
// Đẻ đủ thì mỗi tướng gà (gà mẹ phụ) cũng tự tăng PHU_DU_MAU máu / giây và PHU_DU_SAT sát thương / giây (không giới hạn),
// và to dần PHU_DU_TO mỗi giây tới tối đa PHU_DU_TO_MAX × độ to lúc bắt đầu tăng (Ga.toMax)
const PHU_DU_MAU = 2;
const PHU_DU_SAT = 2;
const PHU_DU_TO = 0.02;
const PHU_DU_TO_MAX = 1.5;
const TRON_TOC = 4;
// Vua gà không hồi sinh nên được trốn chạy nhanh TRON_LAN lần; trong lúc chạy thì bất tử; mỗi lần đều khi máu dưới TRON_MAU và còn bị đuổi
const TRON_LAN = 2;
const GOI_HOI = 30;
const GOI_DAN: ('hen' | 'rooster' | 'flyer')[] = ['hen', 'hen', 'rooster', 'rooster', 'flyer'];
const GOI_HIEN = 1.2;
// Gà mẹ phụ chuyên một kiểu (xoay vòng theo thứ tự sinh), mỗi kiểu một màu riêng (nhuộm cả thân trên atlas, nhuộm sẵn) và màu thanh máu
const KIEU_PHU = 5;
const MAU_PHU = ['#3fa7ff', '#ffd23f', '#b46bff', '#ff6bd6', '#ff3b30'];
// Nhuộm cả thân theo màu của con đó, chỉ giữ đầu trắng, mỏ và chân (tiền tố "tint:" được ve-canvas.ts nhận ra)
const LOC_PHU = MAU_PHU.map((m) => `tint:${m}`);
// Hồi chiêu riêng của kiểu chuyên: kiểu Lao hồi 6s, kiểu Bay hồi 9s, kiểu một màu chu kỳ 12s (gà mẹ khác theo LAO_HOI / BAY_HOI / MAU_CHU_KY)
const LAO_HOI_CHUYEN = 6;
const BAY_HOI_CHUYEN = 9;
const MAU_CHU_KY_CHUYEN = 12;
// Sau mỗi lần Lao / Bay gà mẹ lộ sơ hở SO_HO giây: không né được đòn nào. Giữa 2 chiêu bất kỳ (Lao, Bay, đổi màu) nghỉ ít nhất CHIEU_NGHI_CHUNG giây, và các chiêu không chạy cùng lúc.
const SO_HO = 3;
const CHIEU_NGHI_CHUNG = 4;
// Chiêu Lao: tốc độ thật TOC_LAO_THAT px/s, sát thương gấp LAO_SAT, hồi LAO_HOI giây.
// Chiêu Bay: TOC_BAY_THAT px/s, sát thương gấp BAY_SAT, hồi BAY_HOI giây. Cả hai đi thẳng một đường, trúng mỗi nhân vật một lần, nhân vật vẫn né được.
const TOC_LAO_THAT = 500;
const LAO_SAT = 2;
const LAO_HOI = 12;
const TOC_BAY_THAT = 700;
const BAY_SAT = 3;
const BAY_HOI = 15;
// Báo hiệu trước khi phóng (giây), nghỉ sau khi xong, quãng đường = khoảng cách tới mục tiêu + CHIEU_QUANG_THEM (tối đa CHIEU_QUANG_TOI_DA), độ cao lúc bay
const CHIEU_BAO = 1;
const CHIEU_NGHI = 1;
const CHIEU_QUANG_THEM = 250;
const CHIEU_QUANG_TOI_DA = 1400;
const BAY_DO_CAO = 150;
// Chỉ phóng khi mục tiêu xa hơn CHIEU_TOI_THIEU; mục tiêu xa hơn CHIEU_XA thì ưu tiên Bay
const CHIEU_TOI_THIEU = 300;
const CHIEU_XA = 1000;
// 3 màu xoay vòng (đen phản đòn · vàng miễn đòn · đỏ đốt cháy): cứ MAU_CHU_KY giây kích hoạt một màu, kéo dài MAU_KEO_DAI giây
const MAU_TUONG: MauTuong[] = ['den', 'vang', 'do'];
const MAU_CHU_KY = 20;
const MAU_KEO_DAI = 5;
// Màu đỏ: nhân vật đứng trong DOT_BAN_KINH quanh gà tướng bị đốt, DOT_SAT sát thương gốc mỗi giây (trừ theo nhịp DOT_NHIP), không né được
const DOT_BAN_KINH = 320;
const DOT_SAT = 20;
const DOT_NHIP = 0.5;
// Thời gian hiệu ứng mổ / đá (giây)
const MO_THOI_GIAN = 0.35;
// Hạ được gà tướng thì mỗi nhân vật còn sống hồi chừng này máu
const HOI_MAU_TUONG = 60;
// Quả táo: mỗi lần cây đổ có TAO_ROI = 30% rơi 1 quả (cây to chắc chắn rơi 4 quả), đỏ / xanh ngẫu nhiên (50/50). Táo đỏ +VP_HOI máu, táo xanh +VP_MANA mana và mở khoá bay (không giới hạn).
// Nhân vật (không phải mây, chưa gục) đi vào bán kính VP_BAN_KINH thì nhặt; không ai nhặt sau VP_TON_TAI giây thì biến mất.
const TAO_ROI = 0.3;
const VP_HOI = 100;
// Táo xanh hồi VP_MANA mana
const VP_MANA = 80;
const VP_BAN_KINH = 90;
// Hạt đậu thần (loai 'dau', chỉ rơi từ cây trên đảo cát): ăn +DAU_MAU máu và +DAU_MANA mana (không giới hạn, mở khoá bay), Mabu / Zinbu và Cell đều ăn được, gà không ăn
const DAU_MAU = 300;
// Mabu / Zinbu ăn một hạt đậu thần: +DAU_SAT sát thương cộng thẳng vào mỗi đòn (`NguoiChoi.satDau`, không giới hạn)
const DAU_SAT = 10;
// Cell tự hồi máu mỗi giây: Cell thường / Cell to nhất (đảo giữ ngọc rồng, cấp 4)
const CELL_HOI_MAU = 10;
const DAU_MANA = 240;
/** Số hạt đậu thần mỗi cây đảo cát rơi khi đổ */
const DAU_ROI = 2;
/** Gà mẹ đang hoá socola: nhân vật chạm vào (trong bán kính này × độ to) là ăn, nhận ĂN_TUONG_TI_LE máu hiện có và sức mạnh của nó */
const VP_GA_BAN_KINH = 60;
const VP_TON_TAI = 45;
// Hai thanh đen hai bên map (chứa chiêu thức và máu của Mabu / Zinbu) rộng SIDE; nửa vòng tròn chứa nhân vật nhô vào map, bán kính R_NV = 2/3 bảng cũ
const SIDE = 75;
const R_NV = (R_BANG * 2) / 3;
const TOC_DO_DI = 460;
const TOC_DO_BAY = 900;
const BAY_KHI_XA = 450;
const BAY_TOI_DA = 1200;
// Mana: bắt đầu MANA_BAN_DAU; MANA_TOI_DA chỉ là mốc đầy bình (bình vẽ theo max(mốc, mana hiện có)). Dùng để bay (MANA_BAY mỗi giây bay), bắn Chiêu đặc biệt (MANA_CHUONG mỗi chưởng) và Biến mây / socola (MANA_DAC_BIET).
// Đấm / Đá trúng thì hồi MANA_DAM. Tự hồi MANA_HOI mỗi giây khi không bay (chỉ tới MANA_HOI_TOI_DA; táo xanh / socola / đòn trúng cộng không giới hạn); còn dưới MANA_TOI_THIEU thì không bay. Mỗi lần bay xong khoá BAY_KHOA giây mới bay tiếp.
const MANA_BAN_DAU = 200;
const MANA_TOI_DA = 200;
/** Từ ngoài vườn gà nhảy xuống máy bay / phi thuyền vào trong vườn: máu, mana mỗi người đặt lại đúng bấy nhiêu (bay ngang qua vườn không tính) */
const MANA_HOI_TOI_DA = 100;
const MANA_DAM = 5;
const MANA_CHUONG = 30;
const MANA_DAC_BIET = 40;
const MANA_HOI = 2;
const MANA_BAY = 15;
const MANA_TOI_THIEU = 15;
const BAY_KHOA = 2;
const VUNG_BAY_CAN = 0.6; // cần trái phải gạt mạnh mới bay (tránh bay nhầm)
const BAY_CAN = 600; // mỗi lần gạt cần trái bay một đoạn (xa hơn BAY_KHI_XA)
const TRON_QUANG = 2 * BAY_CAN;
const VUNG_CHET_CAN = 0.25; // cần analog gạt dưới mức này coi như nằm yên
const TOC_DO_DAN = 2400;
// Chiêu Biến mây (riêng Mabu, nhóm đòn 3): mây to gấp 2, quét trúng mọi con gà nó đi qua. Hiệu lực MAY_THOI_GIAN giây, sau đó chờ MAY_HOI giây mới dùng lại.
// Tốn MANA_DAC_BIET; đang chạy / đang hồi thì nút chiêu mờ hẳn (hetMana).
const NHOM_MAY = 3;
// Bảng chiêu thức: bán kính cung và bán kính mỗi nút
const R_CUNG = 185;
const R_NUT = 30;
// Bảng chiêu gà mẹ (giữa phía trên) thu nhỏ còn 1/3 so với kích thước gốc, tâm vẫn ở mép trên giữa màn hình
const HE_BANG_TUONG = 1 / 3;
const MAY_THOI_GIAN = 7;
const MAY_HOI = 25;
const MAY_TOC_DO = 1.35;
// Vùng mây quét trúng trên mặt đất (bán kính ngang / dọc, đơn vị bản đồ), cộng thêm khi trúng gà tướng to
const MAY_RX = 330;
const MAY_RY = 150;
// Thân mây nằm cao hơn toạ độ chân nên tâm vùng quét nâng lên chừng này
const MAY_NANG = 90;
const MAY_NHAN_TUONG = { x: 150, y: 70 };
// Gà tướng: mây chỉ trúng một lần mỗi MAY_NHIP giây
const MAY_NHIP = 0.5;
// Tầm đánh (đơn vị bản đồ). Đấm/Đá chọn ngẫu nhiên đòn gần hoặc đòn xa, đòn xa đánh được xa hơn.
// 
const BAN_KINH_NO = 150;
const TAM_DAM_GAN = 200;
const TAM_DAM_XA = 400;
const TAM_DA_GAN = 250;
const TAM_DA_XA = 500;
const TAM_CHIEU = 1200;
/** Super Bư: chưởng (Chiêu đặc biệt) tầm gấp SB_TAM_GAP, hồi SB_CHUONG_HOI giây */
const SB_TAM_GAP = 2;
/** Cỡ ô lưới tìm đường của Frieza trên thần điện */
const FZ_O = 60;
/** Giá đi qua một ô bị chặn (so với 1 của ô đi được) */
const FZ_O_CHAN = 30;
const SB_CHUONG_HOI = 0.5;
// Tầm nhìn (sương mù kiểu Dota) = 1,5 × tầm xa nhất của đấm xa / đá xa. Gà ngoài tầm nhìn thì ẩn; nhân vật và chưởng đang bay đều mang theo tầm nhìn.
const TAM_DANH_XA = Math.max(TAM_DAM_XA, TAM_DA_XA);
const TAM_NHIN = TAM_DANH_XA * 1.5;
// Gà tướng nhìn xa gấp 3 lần nhân vật: thấy nhân vật trong tầm này thì đuổi đánh, không thì đi loanh quanh
const TAM_NHIN_TUONG = 1500;
// Gà ngoài màn hình (thêm lề GA_THUA_LE) và cách mọi nhân vật quá GA_THUA_XA (hơn tầm nhìn gà mẹ / tầm tránh vây) chỉ cập nhật mỗi GA_THUA_NHIP khung
const GA_THUA_NHIP = 4;
const GA_THUA_LE = 400;
const GA_THUA_XA = 1900;
/** Hiệu năng + lối chơi: chỉ VAY_TOI_DA tướng gà (gà mẹ phụ) gần nhân vật nhất được đuổi / vây đánh cùng lúc (chọn lại mỗi VAY_NHIP giây);
 *  số còn lại lang thang và giữ cách nhân vật ít nhất VAY_TRANH (ngoài khung nhìn), nên không bao giờ cả 40 con cùng chen trên màn hình */
const VAY_TOI_DA = 12;
const VAY_NHIP = 0.5;
const VAY_TRANH = 1500;
/** Tốc độ lùi ra của tướng gà ngoài nhóm vây (× TOC_DO_TUONG, thật ~90 px/s) */
const VAY_LUI_TOC = 6;
// Tầm gà con phát hiện và lao vào nhân vật = tầm đánh xa nhất (không đổi theo tầm nhìn)
const TAM_LAO = TAM_DANH_XA;
// Gà con ngửi thấy nhân vật trong TAM_NGUI_NV thì đi về phía nhân vật (xu hướng đuổi theo); ngửi thấy táo đỏ trong TAM_NGUI_TAO thì đi tới ăn
const TAM_NGUI_NV = 800;
const TAM_NGUI_TAO = 500;
// Giới hạn số gà (hiệu năng): đủ ME_PHU_TOI_DA tướng gà thì trứng đỏ không nở thêm tướng gà; đủ GA_CON_TOI_DA gà con thì không nở / gọi thêm gà con.
// Khi đã đủ, loại gà đó bỏ giới hạn tầm ngửi: đi ăn táo đỏ / socola và tìm Mabu / Zinbu (đang ở trong vườn gà) khắp vườn (dayCon / dayPhu).
const ME_PHU_TOI_DA = 15;
const GA_CON_TOI_DA = 50;
// Tốc độ gà lao vào nhân vật (gà bay giữ nguyên tốc độ bay, chỉ đổi hướng)
// Hệ số nhân tốc độ di chuyển thật của mọi loại gà (kể cả gà tướng): 1/4 tốc độ gốc ghi trong các hằng số
const HE_SO_TOC_GA = 0.25;
const TOC_DO_LAO: Record<string, number> = { hen: 160, rooster: 240 };
const TAM_DON: Record<string, number> = {
  punch_combo: TAM_DAM_GAN,
  punch_long: TAM_DAM_XA, punch_long_2: TAM_DAM_XA, punch_dash: TAM_DAM_XA, punch_charge: TAM_DAM_XA,
  kick_arc: TAM_DA_GAN, kick_sweep: TAM_DA_GAN,
  kick_long: TAM_DA_XA, kick_long_2: TAM_DA_XA, antenna_whip: TAM_DA_XA,
};
// Vai trò từng chiêu: Đá hất lùi gà con (không phải gà mẹ) DA_DAY px/s (giảm dần) và làm choáng DA_CHOANG giây; Chiêu đặc biệt (chưởng) xuyên qua mọi gà trên đường bay rồi nổ bán kính BAN_KINH_NO.
// Combo từ COMBO_GIAM_HOI trở lên thì chưởng hồi nhanh gấp 1 / COMBO_HOI_CHUONG.
const DA_DAY = 900;
const DA_CHOANG = 0.7;
const COMBO_GIAM_HOI = 10;
const COMBO_HOI_CHUONG = 0.5;
const CHUONG_XUYEN = 70;
// Tính cách gà con. Gà đỏ lao DO_CHAY giây rồi khựng DO_KHUNG giây (nhận sát thương ×DO_NHAN lúc khựng).
// Gà đen bay vòng quanh nhân vật bán kính DEN_VONG_BK (tốc độ thật DEN_VONG_TOC) trong DEN_VONG_T giây, báo hiệu DEN_BAO giây (vệt đỏ), nhào thẳng với tốc độ thật DEN_NHAO_TOC rồi nghỉ DEN_NGHI giây.
// Gà trắng đi thành đàn: lao vào nhân vật thì tản ra vây quanh (HEN_VAY).
const DO_CHAY = 1.5;
const DO_KHUNG = 1;
const DO_NHAN = 1.5;
const DEN_VONG_BK = 380;
const DEN_VONG_TOC = 230;
const DEN_VONG_T = 3;
const DEN_BAO = 0.8;
const DEN_NHAO_TOC = 650;
const DEN_NHAO_THEM = 200;
const DEN_NGHI = 1.2;
const HEN_VAY = 55;
const HEN_DAN = 700;
// Cứu đồng đội: người còn sống phủ mây (Mabu) / socola (Zinbu) lên người ngã sau CUU_CHO giây, sống sót CUU_THOI_GIAN giây (mây / socola bám theo, nối bằng dây) thì người ngã hồi sinh với CUU_MAU máu
const CUU_THOI_GIAN = 15;
// Khoảng cách bám: mây / socola trôi theo người cứu tới khi còn cách chừng này (nối bằng sợi dây)
const CUU_BAM = 170;
const CUU_TOC_BAM = 900;
const CUU_CHO = 1.5;
const CUU_TACH = 1;
const CUU_MAU = 100;
// Quả cầu trốn (2 quả giữa map): nhân vật chạm vào là chui vào trốn CAU_TRON giây (gà không thấy, không bị đánh),
// hồi CAU_HOI_MAU máu/s tới đầy bình (HP_NV) và đầy mana (MANA_TOI_DA); hết giờ thì vỡ ra (hoạt ảnh CAU_VO giây) rồi CAU_MOC giây sau mới có quả mới
const CAU_TRON = 10;
const CAU_HOI_MAU = 20;
const CAU_VO = 1.6;
const CAU_MOC = 20;
const CAU_BAN_KINH = 160;
// Vị trí 2 quả cầu so với tâm map (tránh chỗ nhân vật xuất hiện lúc đầu ván)
const CAU_VI_TRI = [[-450, -420], [450, -420]];
const SP_CAU: KhungSprite = { atlas: 'assets/game/cau_buu.png', atlasW: 1440, atlasH: 800, w: 240, h: 400, cot: 6, neoX: 120, neoY: 350 };
// Cảm giác đánh: hit-stop (game chạy chậm còn DUNG_HE_SO trong vài chục mili giây khi đòn mạnh trúng), rung màn hình
const DUNG_HE_SO = 0.08;
const RUNG_BIEN = 6;
const KHOA_KY_LUC = 'chicken-shooting-game.ky-luc';

const DIEM: Record<LoaiGa, number> = { hen: 10, rooster: 20, flyer: 30, boss: 500 };
// Cỡ gà so với gà thường (gà tướng gấp 5 lần)
const TL_GA: Record<LoaiGa, number> = { hen: 1, rooster: 1.1, flyer: 1, boss: 5 };
// Bán kính trúng đòn của gà cỡ 1; nhân với TL_GA
const BAN_KINH_GA = 44;
// Từ chân tới tâm thân gà (đơn vị sprite, trước khi nhân TL_GA)
const CHAN_GA = 40;
const MAU_LONG: Record<LoaiGa, string> = { hen: '#fff6d5', rooster: '#ce3024', flyer: '#40404e', boss: '#ce3024' };
const MAU_LONG_TUONG = ['#fff6d5', '#ce3024', '#40404e'];
const MAU_GA = { hen: GA_TRANG, rooster: GA_DO, flyer: GA_DEN, boss: GA_TUONG } satisfies Record<LoaiGa, KhungSprite>;
const MAU_SANG = 'brightness(1.7) saturate(0.6)';
// Bộ lọc màu của gà tướng: nháy sáng báo hiệu Lao / Bay, rồi 3 màu đen / vàng / đỏ (vẽ bằng atlas nhuộm sẵn, xem ve-canvas.ts)
const LOC_BAO = 'brightness(2.2) saturate(0.5)';
const LOC_DEN = 'brightness(0.22) contrast(1.3)';
const LOC_VANG = 'sepia(1) saturate(5) hue-rotate(-12deg) brightness(1.25)';
const LOC_DO = 'sepia(1) saturate(7) hue-rotate(-52deg) brightness(1.05)';
// Gà tướng: máu, thời gian chờ giữa 2 lần xuất hiện (giây), tốc độ đi
const CHO_TUONG_DAU = 0;
const CHO_TUONG = 10;
/** Số gà mẹ phụ phải nở (sau khi máy bay quay lại vườn) thì vua gà mới xuất hiện lại */
const ME_PHU_HIEN_VUA = 5;
const TOC_DO_TUONG = 60;
// Gà mẹ gốc đẻ trứng: mỗi lượt 4 quả thường (2 gà trắng, 1 gà đỏ, 1 gà đen, DAN_TRUNG; +1 mỗi lần hồi sinh) rồi quả thứ 5 là trứng đỏ đặc biệt; trứng thường nở sau TRUNG_NO giây; khoảng cách giữa 2 lượt theo choDeTrung().
const DAN_TRUNG: ('hen' | 'rooster' | 'flyer')[] = ['hen', 'hen', 'rooster', 'flyer'];
const TRUNG_NO = 2;
const TRUNG_CHO = 15;
// Trứng đỏ đặc biệt (do gà mẹ GỐC đẻ: quả thứ 5 của mỗi lượt trứng, cứ TRUNG_CHO giây): to gấp TRUNG_DB_TO lần quả thường, gà mẹ gốc canh quanh nó (TRUNG_DB_BAO_VE).
// Trong thời gian ấp (apTrungDb) nở đều 4 gà con mạnh dần (GA_DB_SUC: sức mạnh nhân máu / sát thương, GA_DB_TO: độ to): gà con thường, x2 to gấp đôi, x3, x4; hết thời gian ấp thì nở ra một gà mẹ phụ (đi đánh thay gà mẹ gốc, không giới hạn số lượng).
const TRUNG_DB_TO = 5;
const TRUNG_DB_NO = 10;
// Thời gian ấp trứng đỏ (tới lúc nở tướng gà) và thời gian giữa 2 lượt đẻ, theo số tướng gà (gà mẹ phụ) đang sống lúc đẻ:
// ≤ 5 con: ấp 5s · 6–10 con: ấp 10s · từ 11 con: ấp 15s. ≤ 10 con: đẻ 10s một lượt · từ 11 con: 15s một lượt.
// 4 gà con của trứng đỏ nở đều trong lúc ấp (nhịp = thời gian ấp / 5).
const apTrungDb = (soPhu: number): number => (soPhu <= 5 ? 5 : soPhu <= 10 ? 10 : 15);
const choDeTrung = (soPhu: number): number => (soPhu <= 10 ? 10 : TRUNG_CHO);
const TRUNG_DB_BAO_VE = 450;
const GA_DB_SUC = [1, 2, 3, 4];
const GA_DB_TO = [1, 2, 2.5, 3];
// Gà mẹ gốc chạy trốn nhân vật trong tầm TAM_NHIN_TUONG (tốc độ gốc, sẽ nhân HE_SO_TOC_GA)
const TOC_TRON = 480;
// Gà mẹ phụ chết: điểm thưởng (không hồi máu cho đội, không hồi sinh)
const DIEM_PHU = 200;
// Mũi tên chỉ hướng tới gà tướng (kiểu đường chim bay của Google Maps): cứ HUONG_CHU_KY giây hiện một lần, kéo dài HUONG_HIEN giây (mờ dần vào / ra),
// chỉ từ nhân vật gần gà tướng hơn, hướng về gà tướng, từng cụm 3 mũi tên ">" cách nhau HUONG_CACH, nằm trong khoảng HUONG_BAT_DAU..HUONG_TOI_DA tính từ nhân vật.
// Gà tướng đã gần (trong HUONG_GAN) thì không cần chỉ nữa.
const HUONG_CHU_KY = 5;
const HUONG_HIEN = 2.5;
const HUONG_CACH = 340;
// Mỗi cụm gồm HUONG_CUM mũi tên liền nhau, cách nhau HUONG_LIEN
const HUONG_CUM = 3;
const HUONG_LIEN = 26;
const HUONG_BAT_DAU = 180;
const HUONG_TOI_DA = 1100;
const HUONG_GAN = 600;
const DIEM_DANH_TUONG = 15;
// Bộ lọc màu socola của gà mẹ (vẽ bằng atlas nhuộm sẵn)
const LOC_SOCOLA = 'sepia(1) saturate(1.6) brightness(0.5) contrast(1.1)';
/** Socola hồng (gà con trúng chưởng ăn của Mabu) */
const LOC_SOCOLA_HONG = 'brightness(0.6) sepia(1) saturate(8) hue-rotate(-62deg) brightness(1.2)';
/** Đòn ăn: Zinbu quất râu (antenna_whip), Mabu bắn chưởng (energy_ball); gà con trúng thì hoá socola, bị kéo về và nhân vật nhận AN_TI_LE máu (hiện có) của gà thành cả máu lẫn mana */
const DON_AN: Record<string, string> = { Zinbu: 'antenna_whip', Mabu: 'energy_ball' };
const AN_TI_LE = [0.03, 0.05]; // theo chỉ số nhân vật: Mabu 3%, Zinbu 5%
const SOCOLA_GA_TI_LE = 0.02; // gà ăn socola hồi 2% máu tối đa của con gà đã chết thành socola đó (VatPham.hpGa)
const KEO_TOC = 1400;

const TEN_DON: Record<string, string> = {
  roll: 'Cuộn tròn', energy_ball: 'Cầu năng lượng',
};

const ngauNhien = (a: number, b: number) => a + Math.random() * (b - a);
const kep = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const dongHe01 = (v: number) => kep(v, 0, 1);
// Sát tường gạch quanh bản đồ là dừng hẳn
const kepX = (v: number) => (banDoHt === 'sa' ? kep(v, TG.x0, TG.x1) : kep(v, TUONG, MAP - TUONG));
const kepY = (v: number) => (banDoHt === 'sa' ? kep(v, TG.y0, TG.y1) : kep(v, TUONG, MAP - TUONG));

/** Bản đồ đang chơi: 'co' đồng cỏ (cả map là đất) · 'sa' đảo sa mạc (biển chặn đường, xem ban-do.ts) */
let banDoHt: LoaiBanDo = 'co';
/** Số loại trang trí của đảo sa mạc (0 = cây, còn lại bụi / xương rồng / đá / xương…; khớp TRANG_TRI_SA trong ve-canvas.ts) */
const SO_TRANG_TRI_SA = 12;

/** Rải cây / bụi / đá theo lưới có nhiễu, hạt giống cố định nên mỗi ván cùng một map; chừa vùng xuất phát ở giữa */
function taoTrangTri(): TrangTri[] {
  let h = 20240611;
  const r = () => {
    h = (h + 0x6d2b79f5) | 0;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const kq: TrangTri[] = [];
  const O = 230;
  for (let gx = 0; gx < MAP; gx += O) {
    for (let gy = 0; gy < MAP; gy += O) {
      if (r() > 0.6) continue;
      const x = gx + r() * O;
      const y = gy + 60 + r() * (O - 60);
      if (hyp(x - MAP / 2, y - MAP / 2) < 450) continue;
      const k = r();
      const loai = k < 0.35 ? 0 : k < 0.65 ? 1 : k < 0.85 ? 2 : 3;
      const lat = r() < 0.5;
      // Để trống quanh 2 quả cầu trốn (bỏ sau khi đã rút số ngẫu nhiên để phần còn lại của map không đổi)
      // Không mọc sát / trong tường gạch quanh map
      if (Math.min(x, y, MAP - x, MAP - y) < TUONG + 150) continue;
      if (CAU_VI_TRI.some(([dx, dy]) => hyp(x - MAP / 2 - dx, y - MAP / 2 - dy) < 500)) continue;
      // Một phần cây là cây to (chọn theo toạ độ, không dùng r() để map không đổi)
      kq.push({ x, y, loai, lat, to: loai === 0 && Math.floor(x * 7 + y * 13) % 4 === 0 });
    }
  }
  return kq;
}

/** Trang trí trên các đảo cát (đánh dấu `sa`): chỉ mọc trên cát cách bờ đủ xa; mỗi đảo tối đa CAY_SA_CHAN / CAY_SA_LE cây (đảo chẵn / lẻ), cây thừa bỏ */
const CAY_SA_CHAN = 4;
const CAY_SA_LE = 3;
function taoTrangTriSa(): TrangTri[] {
  let h = 777013;
  const r = () => {
    h = (h + 0x6d2b79f5) | 0;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const kq: TrangTri[] = [];
  const soCay = new Array<number>(SO_DAO).fill(0);
  const O = 300;
  // Rải theo khung thế giới cũ (TG_SA, chưa có thần điện) để vị trí cây không đổi
  for (let gx = TG_SA.x0; gx < TG_SA.x1; gx += O) {
    for (let gy = TG_SA.y0; gy < TG_SA.y1; gy += O) {
      if (r() > 0.55) continue;
      const x = gx + r() * O;
      const y = gy + 60 + r() * (O - 60);
      const k = r();
      let loai = k < 0.05 ? 0 : 1 + Math.floor(r() * (SO_TRANG_TRI_SA - 1));
      const lat = r() < 0.5;
      if (trongVuon(x, y) || trongNui(x, y, 300) || doSau(x, y) < (loai === 0 ? 260 : 120)) continue;
      // Để trống quanh chỗ xuất phát
      if (hyp(x - XUAT_PHAT.x, y - XUAT_PHAT.y) < 500) continue;
      if (loai === 0) {
        const d = daoCua(x, y);
        if (soCay[d]! >= (d % 2 ? CAY_SA_LE : CAY_SA_CHAN)) loai = 1;
        else soCay[d]!++;
      }
      // Chỉ giữ cây: đá / xương rồng / cỏ / sọ bò / sỏi / cành khô của sa mạc đã bỏ (vẫn rút số như cũ để vị trí cây không đổi)
      if (loai === 0) kq.push({ x, y, loai, lat, sa: true, to: soCay[daoCua(x, y)] === 1 });
    }
  }
  return kq;
}

/** Cây thêm trên mỗi đảo cát (ngoài CAY_SA_CHAN / CAY_SA_LE): CAY_SA_THEM cây khô đổ được, rơi đậu thần như cây đảo.
 *  Sinh riêng bằng RNG cố định và nối CUỐI `trangTri` (sau tảng đá núi) để chỉ số cây / đá của ván lưu cũ (`cayDo`) không đổi.
 *  Cách bờ ≥ 260, trong vòng đảo, cách tâm đảo ≥ 600 (cổng / chỗ Cell giữ ngọc), cách mọi cây khác ≥ 450, xa chỗ xuất phát. */
const CAY_SA_THEM = 4;
function taoCayThemSa(cu: TrangTri[]): TrangTri[] {
  let h = 515151;
  const r = () => {
    h = (h + 0x6d2b79f5) | 0;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const kq: TrangTri[] = [];
  const cay = cu.filter((t) => t.sa && t.loai === 0);
  for (let d = 0; d < SO_DAO; d++) {
    const dao = DAO[d]!;
    let them = 0;
    for (let k = 0; k < 2000 && them < CAY_SA_THEM; k++) {
      const g = r() * Math.PI * 2;
      const rr = Math.sqrt(r()) * dao.r * 0.85;
      const x = dao.x + Math.cos(g) * rr, y = dao.y + Math.sin(g) * rr;
      const lat = r() < 0.5;
      if (rr < 600 || daoCua(x, y) !== d || doSau(x, y) < 260 || !trongVongDao(x, y, d) || trongVuon(x, y) || trongNui(x, y, 300)) continue;
      if (hyp(x - XUAT_PHAT.x, y - XUAT_PHAT.y) < 500) continue;
      if ([...cay, ...kq].some((t) => hyp(t.x - x, t.y - y) < 450)) continue;
      kq.push({ x, y, loai: 0, lat, sa: true, to: false });
      them++;
    }
  }
  return kq;
}

/** Số loại tảng đá trên núi đá (atlas DA_NUI trong ve-canvas.ts) */
export const SO_DA_NUI = 8;
/** Tảng đá trên núi đá (đánh dấu `nui`, `loai` = 1..SO_DA_NUI, không phải cây nên không đổ): thưa, cách bờ đủ xa.
 *  Ít vật (~30) để nhẹ khung hình; hai loại đầu là khối đá to, hiếm hơn. */
function taoTrangTriNui(): TrangTri[] {
  let h = 424243;
  const r = () => {
    h = (h + 0x6d2b79f5) | 0;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const kq: TrangTri[] = [];
  const O = 700;
  for (let gx = NUI.x - NUI.rx; gx < NUI.x + NUI.rx; gx += O) {
    for (let gy = NUI.y - NUI.ry; gy < NUI.y + NUI.ry; gy += O) {
      if (r() > 0.5) continue;
      const x = gx + r() * O, y = gy + r() * O;
      if (!trongNui(x, y, -250)) continue;
      const loai = r() < 0.2 ? 1 + Math.floor(r() * 2) : 3 + Math.floor(r() * (SO_DA_NUI - 2));
      kq.push({ x, y, loai, lat: r() < 0.5, nui: true });
    }
  }
  return kq;
}

// Lề giữ vật nằm trọn trong bản đồ (đơn vị bản đồ). Sprite vẽ phía trên toạ độ chân nên lề trên lớn hơn lề dưới.
// Thêm loại vật mới thì khai báo lề ở đây và gọi giuTrongMap() cho nó.
interface Le { x: number; tren: number; duoi: number; }
const LE_NV: Le = { x: 80, tren: 230, duoi: 75 };
const LE_GA: Le = { x: 50, tren: 90, duoi: 10 };
const LE_BAY: Le = { x: 70, tren: 150, duoi: 60 };
const LE_VP: Le = { x: 60, tren: 60, duoi: 20 };
// Bóng ma Goku (biến `ginyu`, cao ~230 kể cả lơ lửng, rộng ~170)
const LE_GY: Le = { x: 100, tren: 230, duoi: 20 };
const LE_FZ: Le = { x: 100, tren: 260, duoi: 20 };
// Trứng thường (cao ~45) và trứng đỏ (to gấp TRUNG_DB_TO, có vầng sáng)
const LE_TRUNG: Le = { x: 30, tren: 50, duoi: 10 };
const LE_TRUNG_DB: Le = { x: 200, tren: 300, duoi: 40 };
const LE_TUONG: Le = { x: 220, tren: 330, duoi: 20 };
// Mabu dạng mây to gấp 2 nên lề rộng hơn; k = hệ số phóng to (1 → 2) để lề đổi mượt lúc biến hình
const LE_MAY: Le = { x: 380, tren: 200, duoi: 45 };
const leNhanVat = (k: number): Le => ({
  x: LE_NV.x + (LE_MAY.x - LE_NV.x) * (k - 1),
  tren: LE_NV.tren + (LE_MAY.tren - LE_NV.tren) * (k - 1),
  duoi: LE_NV.duoi + (LE_MAY.duoi - LE_NV.duoi) * (k - 1),
});
// Gà con nở từ trứng đỏ to hơn (g.to) nên lề cũng rộng ra theo
const leCuaGa = (g: { loai: LoaiGa; to?: number }): Le => {
  const le = g.loai === 'boss' ? LE_TUONG : g.loai === 'flyer' ? LE_BAY : LE_GA;
  const k = g.to ?? 1;
  return k === 1 ? le : { x: le.x * k, tren: le.tren * k, duoi: le.duoi * k };
};
// Cỡ thật của gà (gà con nở từ trứng đỏ to hơn)
const tlGa = (g: { loai: LoaiGa; to?: number }) => TL_GA[g.loai] * (g.to ?? 1);
// Gà mẹ phụ = gà tướng không phải gà mẹ gốc
const laMePhu = (g: Ga) => g.loai === 'boss' && !g.goc;
// Máu tối đa: vua gà (gà mẹ gốc) mỗi lần hồi sinh thêm HP_GA (100 → 200 → 300), gà khác HP_GA (gà nở từ trứng đỏ × suc)
const hpToiDa = (g: Ga) => (g.goc ? HP_VUA : HP_GA * (g.db ? g.suc ?? 1 : 1));
// Hệ số sát thương của gà tướng theo lần hồi sinh; sát thương gốc của mọi con gà
const satGa = (g: Ga) => SAT_GA[g.loai] * (g.suc ?? 1) + (g.satThem ?? 0);
// Tỉ lệ né của gà: gà mẹ né 100% khi đang trong thế phòng thủ (trừ lúc sơ hở / hoá socola), ngoài thế 0%; gà con theo NE_GA
const neGa = (g: Ga) => (g.loai === 'boss' ? ((g.the ?? 0) > 0 && (g.soHo ?? 0) <= 0 && (g.socola ?? 0) <= 0 ? 1 : 0) : NE_GA[g.loai]);
// Chiêu nào gà mẹ dùng được: gà mẹ gốc chỉ có ba màu; gà mẹ phụ theo kiểu chuyên (0 Lao · 1 Bay · 2-4 một màu cố định)
const duocLao = (g: Ga) => !g.goc && (g.kieuPhu === undefined || g.kieuPhu === 0);
const duocBay = (g: Ga) => !g.goc && (g.kieuPhu === undefined || g.kieuPhu === 1);
const dsMauCua = (g: Ga): MauTuong[] => (g.goc ? MAU_TUONG : g.kieuPhu === undefined ? MAU_TUONG : g.kieuPhu >= 2 ? [MAU_TUONG[g.kieuPhu - 2]] : []);
const hoiLaoCua = (g: Ga) => (g.kieuPhu === 0 ? LAO_HOI_CHUYEN : LAO_HOI);
const hoiBayCua = (g: Ga) => (g.kieuPhu === 1 ? BAY_HOI_CHUYEN : BAY_HOI);
// Kẹp vật vào trong bản đồ; trả về cờ chạm mép theo từng trục để vật tự bật lại
// Đảo sa mạc: vườn gà (map cỏ, 0..MAP) giữa biển, vòng đảo cát quanh. vung = 'vuon' (gà, trứng, gà mẹ: luôn trong tường vườn)
// hoặc 'dao' (chỉ trên cát, biển bị đẩy lên bờ gần nhất); nhân vật không ghi, theo vị trí (đang trong vườn thì ở lại trong vườn). quaNuoc = đang bay nên được ở trên biển.
function giuTrongMap(o: { x: number; y: number }, le: Le, quaNuoc = false, vung?: 'vuon' | 'dao') {
  if (banDoHt === 'sa' && (vung ? vung === 'dao' : !trongVuon(o.x, o.y))) {
    const x = kep(o.x, TG.x0 + le.x, TG.x1 - le.x);
    const y = kep(o.y, TG.y0 + le.tren, TG.y1 - le.duoi);
    const r = { cx: x !== o.x, cy: y !== o.y };
    o.x = x;
    o.y = y;
    if (!quaNuoc) {
      const d = veDat(o);
      // Thần điện: không đi xuyên điện thờ / vườn cây / hàng cọ / chân cột vòm
      const c = raKhoiChanThan(o);
      // Mê cung bom: không đi xuyên gạch / thùng gỗ / ô bí ẩn / hang
      const m = raKhoiMeCung(o);
      r.cx ||= d.cx || c.cx || m.cx;
      r.cy ||= d.cy || c.cy || m.cy;
    }
    return r;
  }
  const x = kep(o.x, TUONG + le.x, MAP - TUONG - le.x);
  const y = kep(o.y, TUONG + le.tren, MAP - TUONG - le.duoi);
  const r = { cx: x !== o.x, cy: y !== o.y };
  o.x = x;
  o.y = y;
  return r;
}

/** Kéo vật về trong thần điện (đã triệu hồi, không ai thoát được): kẹp theo khung, đang không bay thì đẩy lên nền đá và ra khỏi vật cản */
function giamThan(o: { x: number; y: number }, bay: boolean): void {
  if (trongThan(o.x, o.y, -120) && (bay || doSau(o.x, o.y) > 0)) return;
  o.x = kep(o.x, THAN.x0 + 120, THAN.x1 - 120);
  o.y = kep(o.y, THAN.y0 + 120, THAN.y1 - 120);
  if (bay) return;
  if (doSau(o.x, o.y) <= 0) {
    // Lưới đi lại có thể chỉ ra đảo gần nhất ngoài khung: kéo dần về cổng thần điện cho tới khi đứng trên nền đá
    for (let k = 0; k < 20 && doSau(o.x, o.y) <= 40; k++) { o.x += (THAN_CONG.x - o.x) * 0.2; o.y += (THAN_CONG.y - o.y) * 0.2; }
  }
  raKhoiChanThan(o);
}

// Vùng của nhân vật theo vị trí hiện tại: trong vườn gà hay ngoài đảo (dùng để không cho đi bộ / bay vượt tường vườn)
const vungCua = (o: { x: number; y: number }): 'vuon' | 'dao' | undefined => (banDoHt !== 'sa' ? undefined : trongVuon(o.x, o.y) ? 'vuon' : 'dao');

function tronMau(a: number[], b: number[], k: number) {
  const c = a.map((v, i) => Math.round(v + (b[i] - v) * k));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

/** Kết quả một ván, gửi lên máy chủ */
export interface KetQua { diem: number; diemMabu: number; diemZinbu: number; thoiGian: number; }

export class Game {
  /** Gọi khi bấm Đóng (trang cha tự xử lý) */
  onDong: () => void = () => {};
  /** Gọi khi màn chơi / dữ liệu đổi và cần vẽ lại phần HTML phủ (màn bắt đầu, tạm dừng, kết thúc) */
  onManPhu: () => void = () => {};
  /** Tay cầm bấm nút bắt đầu ở màn bắt đầu (giao diện quyết định mở hướng dẫn hay vào chơi) */
  onNutBatDau: () => void = () => {};
  /** Tay cầm bấm B ở màn bắt đầu / hướng dẫn: quay lại bước trước */
  onNutQuay: () => void = () => {};
  /** Tay cầm bấm X ở màn chọn chế độ: đánh dấu thẻ, chờ bấm B để xác nhận */
  onNutX: () => void = () => {};
  /** Tay cầm 1 bấm trái / phải ở màn bắt đầu (sang = -1 / 1); giao diện trả true nếu đã dùng (chọn bản đồ ở màn mục tiêu) */
  /** Thẻ đang chọn ở màn chọn chế độ (chỉ số trong THE_CHON), chữ thập / cần trái chọn (trái-phải từng thẻ, lên-xuống đổi hàng) */
  menuChon = THE_CHON.indexOf('ca2');
  /** Nút đang chọn ở màn tạm dừng (0 Tiếp tục · 1 Lưu game), chữ thập / cần trái lên-xuống để chọn, A để bấm */
  menuTamDung = 0;
  /** Tay cầm bấm A ở màn tạm dừng: giao diện bấm nút đang chọn (menuTamDung) */
  onNutTamDung: () => void = () => {};
  /** Màn kết thúc: đã bấm X, đang chờ bấm B để chơi lại */
  choiLaiChoB = false;
  private menuCanCu = 0;
  /** Gọi khi ván kết thúc (để lưu điểm lên máy chủ) */
  onKetThuc: (kq: KetQua) => void = () => {};
  private khungEl!: HTMLDivElement;
  private canvasEl!: HTMLCanvasElement;

  W = W_MAC_DINH;
  readonly BAR = BAR;
  readonly R_TUONG = R_BANG * HE_BANG_TUONG;
  readonly SIDE = SIDE;
  readonly R_NV = R_NV;
  readonly HP_NV = HP_NV;
  readonly R_BANG = R_BANG;
  readonly R_NUT = R_NUT;
  readonly H = H;
  get GIUA(): number {
    return this.W / 2;
  }
  readonly MAP = MAP;
  readonly TUONG = TUONG;
  readonly MAU_LONG = MAU_LONG;
  readonly MAU_SANG = MAU_SANG;
  readonly HP_GA = HP_GA;
  readonly S_NV = S_NV;
  readonly SP_TUONG = GA_TUONG;
  readonly TUONG_HOI_SINH = TUONG_HOI_SINH;
  readonly TRUNG_DB_TO = TRUNG_DB_TO;
  readonly HE_BANG_TUONG = HE_BANG_TUONG;
  readonly R_CUNG = R_CUNG;
  // Chu vi vòng tiến độ quanh nút chiêu của gà tướng
  readonly CHU_VI_NUT = 2 * Math.PI * (R_NUT + 6);
  // Bán kính vòng đốt cháy quanh gà tướng (đơn vị bản đồ); vòng dẹt theo EP_GA
  readonly R_DOT_THE_GIOI = DOT_BAN_KINH;
  readonly EP_GA = EP_GA;

  man: ManChoi = 'start';
  /** Chỗ vua gà xuất hiện lần đầu (chốt lúc vào ván để nhân vật xuất phát ở góc xa nhất) */
  private viTriVua: { x: number; y: number } | null = null;
  nguoi: NguoiChoi[] = this.taoNguoiChoi();
  ga: Ga[] = [];
  /** Gà con đã hoá socola đang bị kéo về nhân vật để ăn (không còn trong this.ga, không chạy AI) */
  keoGa: Ga[] = [];
  /** Cell canh đảo (mỗi đảo một cấp, 6–10 con); cellView = phần nằm trong khung nhìn và tầm nhìn */
  cell: Cell[] = [];
  cellView: Cell[] = [];
  /** Đội Cell từng đảo (không lưu ván): đang xuất trận, id con tách đàn, người nó đuổi, giờ đàn được dịch chuyển lần tới */
  /** an = id con đi bắn cây ăn đậu thần (-1 / thiếu = chưa có) */
  cellDoi: { chien: boolean; tach: number[]; muc: number; dichDan: number; an?: number }[] = [];
  /** Lúc (this.t) mỗi nhân vật bị chưởng Cell trúng gần nhất, để tính combo chưởng (không lưu ván) */
  cellChuongLuc: number[] = [];
  /** Thứ tự đòn chưởng của Cell bạo nộ trong chuỗi combo hiện tại trên mỗi nhân vật (không lưu ván) */
  cellComboDem: number[] = [];
  /** Combo đòn Frieza (đấm + chưởng chung chuỗi, như Cell bạo nộ): lúc trúng gần nhất và thứ tự đòn trong chuỗi trên mỗi nhân vật (không lưu ván) */
  fzChuongLuc: number[] = [];
  fzComboDem: number[] = [];
  /** Tiệc sinh nhật Cell: bánh ở giữa vòng Cell; chưởng Cell bắn vào bánh (chỉ để đẹp, không lưu); banhView = bánh nằm trong khung nhìn */
  tiec: Tiec[] = [];
  chuongTiec: ChuongTiec[] = [];
  chuongTiecView: ChuongTiec[] = [];
  /** Bóng ma Goku canh núi đá (một con, biến vẫn tên `ginyu`); gyView = có vẽ không (trong khung nhìn + tầm nhìn) */
  ginyu: Ginyu = taoGinyu();
  gyView = false;
  /** Animation của bản sao (nhân vật bị sao chép); không lưu ván */
  gyNv: NhanVat | null = null;
  /** Frieza đi loanh quanh điện thờ trên thần điện (không lưu ván); fzView = có vẽ không (trong khung nhìn + tầm nhìn) */
  frieza: Frieza = taoFrieza();
  fzView = false;
  banhView: Tiec[] = [];
  /** Cổng dịch chuyển giữa đảo Cell 10 con (trang trí, tính từ vị trí tiệc, không lưu ván); congView = có vẽ không */
  cong = { x: 0, y: 0 };
  congView = false;
  /** Cổng dịch chuyển trên thần điện (cặp với `cong`): có vẽ không */
  congThanView = false;
  /** Người vừa bước ra khỏi cổng dịch chuyển: phải đi xa khỏi cổng rồi mới vào lại được (không lưu ván) */
  private congCho: number[] | null = null;
  /** Mê cung bom (không lưu ván: tải lại là mê cung mới nguyên): bom, lửa / nước, quái ăn thịt, vật phẩm, đồ cứu người, trạng thái từng nhân vật.
   *  Các mảng *View là phần nằm trong khung nhìn (quái và vật phẩm còn bị sương mù) */
  mc: TrangThaiMc = taoMeCung();
  /** Khung trước có người ở map mê cung bom (lúc từ không có thành có thì mê cung làm mới, `lamMoiMeCung()`; không lưu ván) */
  private mcCoNguoi = false;
  mcBomView: BomMc[] = [];
  mcLuaView: LuaMc[] = [];
  mcTiaView: TiaMc[] = [];
  mcVpView: VpMc[] = [];
  mcDoView: DoMc[] = [];
  /** p đã ở trong mê cung ở khung trước (để nhắc cách dùng bom lúc vừa vào; không lưu ván) */
  /** Hệ số to của từng nhân vật (MC_TO_NV khi ở mê cung / đường hầm, đổi dần) */
  toMc = [1, 1];
  /** Hợp thể Super Bư (không lưu ván): chu = người điều khiển ra đòn, mang thân Super Bư (`nv` đổi sang SUPER_BU) · nhap = người bị nhập
   *  (ẩn, đi theo, chỉ điều khiển đi lại / bay của Super Bư) · con = giây còn lại · truoc = máu / mana hai người lúc hợp thể · hpMax / manaMax = của Super Bư */
  hopThe: { chu: number; nhap: number; con: number; nvCu: NhanVat; truoc: { hp: number; mana: number }[]; hpMax: number; manaMax: number } | null = null;
  /** Giây còn chờ mới hợp thể lại được (sau khi tách) */
  hopTheHoi = 0;
  /** Con của Super Bư (chỉ có lúc hợp thể, không lưu ván); conBuView = các con trong khung nhìn; conBuLan = số lần đã đẻ lần hợp thể này; conBuHoi = chờ giữa 2 lần đẻ */
  conBu: ConBu[] = [];
  conBuView: ConBu[] = [];
  conBuLan = 0;
  private conBuHoi = 0;
  /** Nút đánh vừa bấm của từng người (nút, lúc bấm) để nhận ra hai người cùng bấm một nút */
  private hopNut: ({ nut: number; t: number } | null)[] = [null, null];
  /** Hẹn giờ chữ báo cổng không mở (đồng đội gục / đang trốn / đang bay) */
  private congBao = 0;
  /** Dịch chuyển xong: khung sau camera nhảy thẳng tới chỗ mới */
  private camNgay = false;
  trungDe: TrungGa[] = [];
  trungView: TrungGa[] = [];
  huongView: { x: number; y: number; goc: number; a: number; mau: string }[] = [];
  dan: Dan[] = [];
  vet: Vet[] = [];
  chu: Chu[] = [];
  long: Long[] = [];
  xep: VatXep[] = [];
  /** Toàn bộ cây / bụi / đá của map (sinh một lần, cố định); chỉ vật trong khung nhìn mới vào `xep` */
  trangTri: TrangTri[] = taoTrangTri();
  /** Bản đồ chọn ở màn mục tiêu (nhớ để Chơi lại giữ nguyên): 'co' đồng cỏ · 'sa' đảo sa mạc */
  banDo: LoaiBanDo = 'sa';
  /** Bản đồ của ván đang dựng (trangTri, nền, biển): chỉ đổi khi bắt đầu ván, để màn chọn map không vẽ lẫn */
  banDoVan: LoaiBanDo = 'co';
  gaBayView: Ga[] = [];
  /** Mọi gà mẹ (gốc + phụ) còn sống nằm trong khung nhìn và tầm nhìn: để vẽ thanh máu */
  tuongView: Ga[] = [];
  /** Vùng đang thấy (tính trong capNhatView()): không lên máy bay thì chỉ thấy khối đất nhân vật đang đứng, bên kia vực đen */
  thayVuon = true;
  /** Có người đang ở trong vườn gà: vật trong vườn không bị sương mù */
  private vuonRo = true;
  /** Bản đồ nhỏ (chỉ khi ngồi máy bay): vị trí máy bay và hướng bay (radian) */
  banDoNho: { x: number; y: number; huong: number } | null = null;
  private mbCu = { x: 0, y: 0 };
  private mbHuong = 0;
  private ptHuong = 0;
  /** Camera đã vào hẳn trong vườn gà (kẹp cứng theo tường) */
  private camVuon = false;
  thayDao = true;
  /** Đang thấy thần điện (có nhân vật đứng trên đó hoặc có người ngồi máy bay) */
  thayThan = true;
  // Gà mẹ GỐC còn sống (không lọc theo khung nhìn): avatar, số mạng, mũi tên chỉ hướng
  tuongSong: Ga | null = null;
  /** Ngọc rồng đã nhặt (số sao, theo thứ tự nhặt) xếp ở thanh đen trên, bên trái; ngocBay = viên đang bay từ chỗ nhặt lên thanh đen */
  ngocNhat: number[] = [];
  /** Đã báo chữ Cell đỏ truy sát (không lưu ván) */
  private cellTruyBao = false;
  /** Đã có nhân vật ra khỏi vườn gà (lần đầu, kể cả ngồi máy bay / phi thuyền) */
  private daRaVuon = false;
  /** Hết CELL_TRUY_T giây mà chưa ai ra khỏi vườn gà: máy bay / phi thuyền không còn đặt lại máu / mana (cả ván) */
  private cellTruyVuon = false;
  /** Đã chơi tới CELL_TRUY_T: Cell đỏ (còn sống) truy sát mọi nơi cả ván */
  private cellTruyT = false;
  /** Giây đã trôi từ lúc nhặt đủ ngọc rồng (-1 = chưa đủ); đủ THANG_CHO thì thắng (kiemTraThang(), không lưu ván) */
  private tThang = -1;
  /** Frieza bay đi truy sát Mabu / Zinbu khắp thế giới (cả ván); hợp thể Super Bư làm được và giữ được ở mọi nơi */
  fzTruy = false;
  /** Đã qua mốc mở khoá hợp thể ở mọi nơi (chỉ để báo chữ một lần, không lưu ván) */
  private hopMoBao = false;
  /** Bóng ma Goku đã rời núi đá đi truy sát (sau GY_TRUY_T giây mà chưa bị hạ hẳn), cả ván */
  gyTruy = false;
  /** Phút 20: người chơi và các trùm còn sống bị triệu hồi về thần điện, không ai thoát ra được nữa (cả ván) */
  trieuHoi = false;
  /** Phút 25 (SANG_MC_T): người chơi đã bị dịch chuyển từ thần điện tới cửa mê cung bom, thôi bị giam trên thần điện (trùm vẫn bị giam) */
  sangMc = false;
  ngocBay: { x: number; y: number; t: number; slot: number; sao: number }[] = [];
  readonly NGOC_BAY_T = 1.1;
  // Gà mẹ đang đánh (phụ gần nhân vật nhất; chưa có thì gà mẹ gốc): chiêu hiện trên thanh đen phía trên
  tuongBang: Ga | null = null;
  // Vật phẩm máu trên map (vatPhamView: chỉ cái nằm trong khung nhìn)
  vatPham: VatPham[] = [];
  vatPhamView: VatPham[] = [];
  // Cứu đồng đội (cuuView: chỉ cái nằm trong khung nhìn)
  cuu: Cuu[] = [];
  cuuView: Cuu[] = [];
  // Quả cầu trốn giữa map (cauTron) và các quả nằm trong khung nhìn (cauView, cũng được xếp theo y trong xep)
  cauTron: CauTron[] = taoCauTron();
  readonly SP_CAU = SP_CAU;
  readonly SP_NGOC = SP_NGOC;
  readonly SP_VG_CHUONG = SP_VG_CHUONG;
  readonly SP_CELL = SP_CELL;
  readonly SP_CELL_TIEC = SP_CELL_TIEC;
  cauView: CauTron[] = [];
  // Máy bay trong vườn gà (mayBay) và hình / số giây hồi phục để vẽ (chỉ lấy khi nằm trong khung nhìn)
  mayBay: MayBay = taoMayBay(MAP / 2, MAP / 2);
  /** vận tốc máy bay khung trước (Cell bắn đón đầu) */
  private mbVx = 0;
  /** giờ game được báo lại chữ "Cell đang ngồi trên ngọc" */
  private baoGiuNgoc = 0;
  private mbVy = 0;
  readonly SP_MB = SP_MB;
  mbView: MbHinh | null = null;
  phiThuyen: PhiThuyen = taoPhiThuyen(this.mayBay);
  readonly SP_PT = SP_PT;
  ptView: MbHinh | null = null;
  mbDemView: { x: number; y: number; con: number } | null = null;
  ptDemView: { x: number; y: number; con: number } | null = null;
  // Giây hit-stop còn lại và biên độ rung màn hình
  private dungHinh = 0;
  private rungBien = RUNG_BIEN;
  // Vệt đỏ chỉ hướng lúc gà mẹ báo hiệu Lao / Bay (chỉ khi trong khung nhìn)
  vachView: { x1: number; y1: number; x2: number; y2: number; a: number; w?: number }[] = [];
  // Lần hồi sinh của gà tướng gần nhất (để bảng vẫn hiện khi chờ hồi sinh)
  lanTuong = 0;
  private soLanTuong = 0;
  /** Khung nhìn thế giới của lần capNhatView() gần nhất (dùng để biết gà nào đang ngoài màn hình, gaThua()) */
  private khungNhin = { x0: 0, x1: 0, y0: 0, y1: 0 };
  /** Đếm khung logic, để so le các gà cập nhật thưa */
  private khungSo = 0;
  // Vườn gà ngủ khi máy bay bay ra ngoài vườn (không gà, không trứng); khi máy bay về thì tổ trứng ẩn đẻ / ấp đủ ME_PHU_HIEN_VUA gà mẹ phụ rồi vua gà mới xuất hiện
  private vuonNgu = false;
  private toTrung: { x: number; y: number } | null = null;
  private toDe = 0;
  private daNoPhu = 0;
  private choVua = false;
  // Số gà mẹ phụ đã sinh trong ván (quyết định kiểu chuyên và màu của con kế tiếp)
  private demPhu = 0;
  /** Dấu X đỏ đếm ngược của trứng đỏ (cuối mũi tên chỉ hướng); chỉ lấy khi nằm trong khung nhìn */
  private nhinNguon: { x: number; y: number }[] = [];
  // Chỉ những vật trong khung nhìn mới được vẽ (xem CLAUDE.md)
  vetView: Vet[] = [];
  danView: Dan[] = [];
  longView: Long[] = [];
  chuView: Chu[] = [];
  fps = 0;
  private fpsDem = 0;
  private fpsMoc = 0;
  camX = MAP / 2;
  camY = MAP / 2;
  camZ = ZOOM;
  /** Lựa chọn ở màn bắt đầu (nhớ để Chơi lại giữ nguyên) */
  cheNguoi: CheNguoi = 'ca2';
  // Chỉ có 1 tay cầm thì nó điều khiển nhân vật này (nút View để đổi); có 2 tay cầm thì mỗi tay một nhân vật
  tayCam = 0;
  // Thông tin tay cầm đang kết nối (hiện ở màn bắt đầu) và nút vừa bấm gần nhất (để dò tay cầm lạ)
  tayCamTen: string[] = [];
  tayCamNut = '';
  private nutCu = new Map<number, boolean[]>();
  private tayCamGan: number[] = [-1, -1]; // chỉ số tay cầm đang giữ từng nhân vật (rút / cắm lại không làm đổi vai)
  private rungLan = [0, 0];
  private dangGan: number[] = [-1, -1];
  private dsTayCam: Gamepad[] = [];
  tGame = 0;
  t = 0;
  rung = 0;
  chamDen = 0;
  kyLuc = 0;
  kyLucMoi = false;
  mauHoangHon = 'rgb(255,220,140)';
  doHoangHon = 0;

  // Canvas 2D: bộ vẽ (ve-canvas.ts), ngữ cảnh vẽ và kích thước hiển thị
  private ve = new VeCanvas();
  private ctx: CanvasRenderingContext2D | null = null;
  private cssW = 0;
  private cssH = 0;
  private dpr = 1;
  /** Trần độ phân giải canvas (đơn vị: tỉ lệ điểm ảnh): tự hạ dần khi FPS thấp (máy yếu), FPS cao ổn định thì tăng lại dần */
  private dprTran = DPR_TOI_DA;
  private fpsThap = 0;
  private fpsCao = 0;
  /** Lúc hạ / tăng độ phân giải gần nhất (ms, performance.now) và thời gian phải chờ trước khi thử tăng lại */
  private dprLucHa = 0;
  private dprLucTang = -Infinity;
  private dprChoTang = DPR_CHO;
  /** Chế độ mát máy (FPS_MAT khung / giây, độ phân giải ≤ DPR_MAT): tự bật khi FPS dưới MAT_BAT_FPS, tự tắt sau MAT_THOI_GIAN giây chơi */
  matMay = false;
  /** Số giây chơi còn lại của lần mát máy hiện tại */
  matMayCon = 0;
  private matDem = 0;
  private datKhung: () => void = () => {};
  /** Canvas nền (cát / biển) nằm dưới canvas chính, độ phân giải NEN_TL × điểm ảnh CSS */
  private canvasNen: HTMLCanvasElement | null = null;
  private ctxNen: CanvasRenderingContext2D | null = null;
  private manDaVe: ManChoi | null = null;
  private id = 1;
  private rafId = 0;
  private lanCuoi = 0;
  private henTuong = CHO_TUONG_DAU;
  private goLangNghe: (() => void)[] = [];

  constructor(khung: HTMLDivElement, canvas: HTMLCanvasElement) {
    this.khungEl = khung;
    this.canvasEl = canvas;
    this.capNhatView(0, true);
    this.docKyLuc();
  }

  /** Gắn sự kiện và chạy vòng lặp game */
  private am = new AmThanh();

  khoiDong(): void {
    (document.activeElement as HTMLElement | null)?.blur();
    this.khungEl.focus();

    {
      // Khung chiếm cả cửa sổ: chiều rộng khung nhìn theo tỉ lệ cửa sổ nên map tràn sát hai bên, không còn dải đen
      const vua = () => {
        const kt = this.khungEl.getBoundingClientRect();
        if (kt.width > 0 && kt.height > 0) this.W = kep(Math.round(((H + BAR) * kt.width) / kt.height - 2 * SIDE), W_TOI_THIEU, W_TOI_DA);
        // Canvas theo kích thước khung và độ phân giải màn hình (tối đa 2× cho nhẹ)
        this.cssW = kt.width;
        this.cssH = kt.height;
        this.dpr = Math.min(this.dprTranThat(), this.dprTran);
        const cv = this.canvasEl;
        const pw = Math.max(1, Math.round(kt.width * this.dpr));
        const ph = Math.max(1, Math.round(kt.height * this.dpr));
        if (cv.width !== pw || cv.height !== ph) {
          cv.width = pw;
          cv.height = ph;
        }
        const nen = this.canvasNen;
        if (nen) {
          const nw = Math.max(1, Math.round(kt.width * NEN_TL));
          const nh = Math.max(1, Math.round(kt.height * NEN_TL));
          if (nen.width !== nw || nen.height !== nh) {
            nen.width = nw;
            nen.height = nh;
          }
        }
      };
      this.ctx = this.canvasEl.getContext('2d');
      // Canvas nền nằm ngay dưới canvas chính (xem VeCanvas.veNenRieng)
      this.canvasNen = document.createElement('canvas');
      this.canvasNen.className = 'canvas-nen';
      this.canvasNen.setAttribute('aria-hidden', 'true');
      this.canvasEl.before(this.canvasNen);
      this.ctxNen = this.canvasNen.getContext('2d');
      this.ve.napTruoc(...NHAN_VAT.map((v) => v.atlas), SP_VG_CHUONG.atlas, 'assets/game/map_co.png', 'assets/game/tuong_gach.png', SP_CAU.atlas, SP_NGOC.atlas, SP_MB.atlas, SP_PT.atlas, SP_CELL.atlas, SP_CELL_TIEC.atlas, SP_CONG.atlas, SP_GINYU.atlas, SP_FRIEZA.atlas, SP_FRIEZA_VANG.atlas, SP_BOM.atlas, SP_BA.atlas, SP_QUAI.atlas, ...CHUONG_LOAI.map((l) => l.atlas));
      for (const sp of [GA_TRANG, GA_DO, GA_DEN]) this.ve.nhuomTruoc(sp.atlas, [MAU_SANG, LOC_SOCOLA, LOC_SOCOLA_HONG]);
      this.ve.nhuomTruoc(GA_TUONG.atlas, [MAU_SANG, LOC_BAO, LOC_DEN, LOC_VANG, LOC_DO, LOC_SOCOLA, ...LOC_PHU]);
      this.ve.nhuomTruoc(SP_CELL.atlas, [LOC_SOCOLA]);
      this.ve.nhuomTruoc(SP_GINYU.atlas, [MAU_SANG, LOC_SOCOLA]);
      this.datKhung = vua;
      vua();
      const quanSat = new ResizeObserver(vua);
      quanSat.observe(this.khungEl);
      this.goLangNghe.push(() => quanSat.disconnect());

      const cv = this.canvasEl;
      const nghe = <K extends keyof WindowEventMap>(el: Window | HTMLCanvasElement, ten: K, fn: (e: any) => void, capture = false) => {
        el.addEventListener(ten, fn, capture);
        this.goLangNghe.push(() => el.removeEventListener(ten, fn, capture));
      };
      nghe(cv, 'pointerdown', () => this.khungEl.focus({ preventScroll: true }));
      // Luôn chặn menu chuột phải của trình duyệt (kể cả chế độ tay cầm mặc định): hiện menu sẽ cướp focus, mất điều khiển
      nghe(window, 'contextmenu', (e: Event) => e.preventDefault(), true);
      nghe(window, 'keydown', (e: KeyboardEvent) => this.phimXuong(e), true);
      // Trình duyệt ngừng đọc tay cầm khi tab mất focus: tạm dừng ván để không bị đánh trong lúc không điều khiển được
      nghe(window, 'blur', () => { if (this.man === 'play') this.tamDung(); });

      this.lanCuoi = performance.now();
      this.rafId = requestAnimationFrame(this.vongLap);
    }
  }

  huy(): void {
    cancelAnimationFrame(this.rafId);
    this.goLangNghe.forEach((go) => go());
  }

  // ─── Điều khiển màn chơi ───

  /** Số nhân vật đang tham gia (1 hoặc 2) */
  get soNguoi(): number {
    return this.nguoi.filter((n) => !n.vang).length;
  }

  /** Chuột / tay cầm bắt đầu ở nhân vật có mặt đầu tiên */
  private chonNguoiDau(): void {
    const p = this.nguoi.findIndex((n) => !n.vang);
    this.tayCam = p < 0 ? 0 : p;
  }

  /** Bắt đầu ván: lựa chọn ở màn bắt đầu (DOI_HINH: 1 người Mabu / Zinbu / Vegeta, hoặc 2 người) */
  batDau(che: CheNguoi = this.cheNguoi): void {
    this.choiLaiChoB = false;
    this.cheNguoi = che;
    banDoHt = this.banDo;
    this.banDoVan = this.banDo;
    if (this.banDo === 'sa') chuanBiSaMac();
    // Đá núi nối cuối danh sách: chỉ số cây (cayDo của ván lưu) không đổi
    if (this.banDo === 'sa') {
      const tt = [...taoTrangTri(), ...taoTrangTriSa(), ...taoTrangTriNui()];
      this.trangTri = [...tt, ...taoCayThemSa(tt)];
    } else this.trangTri = taoTrangTri();
    // Thần điện: ván mới thì mọi cây cối / vật dụng nguyên vẹn (chỉ ván mới mới đặt lại)
    thanVo.fill(false);
    this.nguoi = this.taoNguoiChoi();
    this.hopThe = null;
    this.hopTheHoi = 0;
    this.conBu = [];
    this.conBuLan = 0;
    this.conBuHoi = 0;
    this.hopNut = [null, null];
    // Nhân vật xuất phát ở góc vườn gà xa vua gà nhất: chốt chỗ vua gà xuất hiện trước, rồi chọn góc xa nó nhất
    this.viTriVua = { x: ngauNhien(600, MAP - 600), y: ngauNhien(600, MAP - 600) };
    const le = TUONG + 320;
    const goc = [[le, le], [MAP - le, le], [le, MAP - le], [MAP - le, MAP - le]] as const;
    const [gx, gy] = goc.reduce((a, b) => (hyp(b[0] - this.viTriVua!.x, b[1] - this.viTriVua!.y) > hyp(a[0] - this.viTriVua!.x, a[1] - this.viTriVua!.y) ? b : a));
    const vao = gx < MAP / 2 ? 1 : -1;
    const xuong = gy < MAP / 2 ? 1 : -1;
    const hai = this.soNguoi > 1;
    this.nguoi.forEach((n, p) => { n.x = gx + (hai ? (p === 0 ? 0 : 170 * vao) : 0); n.y = gy + (hai ? (p === 0 ? 0 : 60 * xuong) : 0); });
    this.chonNguoiDau();
    // Máy bay đậu trong vườn gà, gần chỗ xuất phát (phía trong vườn)
    this.mayBay = taoMayBay(kep(gx + vao * 700, TUONG + MB_LE, MAP - TUONG - MB_LE), kep(gy + xuong * 380, TUONG + MB_LE, MAP - TUONG - MB_LE));
    this.daRaVuon = this.cellTruyVuon = this.cellTruyT = this.fzTruy = this.gyTruy = this.trieuHoi = this.sangMc = this.hopMoBao = false;
    this.cellTruyBao = false;
    this.phiThuyen = taoPhiThuyen(this.mayBay);
    this.ga = [];
    this.keoGa = [];
    this.cell = taoCell(() => this.id++);
    this.tiec = taoTiec(this.cell);
    this.cong = viTriCong(this.tiec);
    this.ginyu = taoGinyu();
    this.frieza = taoFrieza();
    this.gyNv = null;
    this.cellDoi = [];
    this.cellChuongLuc = [];
    this.cellComboDem = [];
    this.fzChuongLuc = [];
    this.fzComboDem = [];
    this.chuongTiec = [];
    this.dan = [];
    this.vet = [];
    this.chu = [];
    this.long = [];
    this.tGame = 0;
    this.chamDen = 0;
    this.rung = 0;
    this.trungDe = [];
    this.vatPham = [];
    this.ngocNhat = [];
    this.datNgocCellNgoi();
    datLaiMeCung();
    this.mc = taoMeCung();
    this.toMc = [1, 1];
    this.datNgocMeCung();
    this.ngocBay = [];
    this.cuu = [];
    // Quả cầu trốn nằm trong vườn gà (giữa thế giới mở)
    this.cauTron = taoCauTron();
    this.dungHinh = 0;
    this.henTuong = CHO_TUONG_DAU;
    this.soLanTuong = 0;
    this.tThang = -1;
    this.vuonNgu = false;
    this.toTrung = null;
    this.toDe = 0;
    this.daNoPhu = 0;
    this.choVua = false;
    this.lanTuong = 0;
    this.demPhu = 0;
    this.kyLucMoi = false;
    this.capNhatView(0, true);
    this.man = 'play';
  }

  tamDung(): void {
    if (this.man === 'play') { this.man = 'pause'; this.menuTamDung = 0; }
    else if (this.man === 'pause') this.man = 'play';
  }


  // ─── Lưu / tải ván (gửi lên máy chủ Java + MySQL, xem server/) ───

  /** Ảnh chụp trạng thái ván đang chơi (JSON thuần) để lưu; null nếu chưa chơi / đã kết thúc */
  chupTrangThai(): TrangThaiLuu | null {
    if (this.man !== 'play' && this.man !== 'pause') return null;
    return JSON.parse(JSON.stringify({
      phienBan: PHIEN_BAN_LUU, banDo: this.banDo,
      tGame: this.tGame, t: this.t, chamDen: this.chamDen, id: this.id,
      henTuong: this.henTuong, soLanTuong: this.soLanTuong, lanTuong: this.lanTuong,
      ga: this.ga, trungDe: this.trungDe, vatPham: this.vatPham, ngocNhat: this.ngocNhat, cuu: this.cuu, cauTron: this.cauTron, cell: this.cell, tiec: this.tiec, mayBay: this.mayBay, phiThuyen: this.phiThuyen, ginyu: this.ginyu,
      vuon: { ngu: this.vuonNgu, to: this.toTrung, toDe: this.toDe, daNoPhu: this.daNoPhu, choVua: this.choVua },
      cayDo: this.trangTri.flatMap((c, i) => (c.doLuc === undefined ? [] : [[i, c.doLuc, c.huongDo ?? 1, c.mat ? 1 : 0]])),
      thanVo: thanVo.flatMap((v, i) => (v ? [i] : [])),
      frieza: { hp: Math.min(FZ_HP, Math.max(1, this.frieza.hp / fzMauGap(this.frieza))), chet: this.frieza.chet },
      truyVuon: { ra: this.daRaVuon, on: this.cellTruyVuon, cell: this.cellTruyT, fz: this.fzTruy, gy: this.gyTruy, th: this.trieuHoi, mc: this.sangMc },
      nguoi: this.nguoi.map((n, p) => {
        const { nv, cuaCan, dich, bay, ...r } = n;
        void cuaCan; void dich;
        // Đang hợp thể: lưu như đã tách ra (máu / mana chia lại theo tỉ lệ còn lại của Super Bư)
        const tach = this.hopThe ? this.chiaHopThe(false)[p]! : null;
        // Đang bay thì coi như đã bay tới nơi
        // Mê cung bom (1 mạng): lưu máu / mana lúc bước vào (tải lại là mê cung mới)
        const luu = !n.het ? this.mc.nv[p]?.luu : null;
        return { ...r, ...(luu ?? {}), ...(tach ?? {}), x: bay ? bay.x1 : n.x, y: bay ? bay.y1 : n.y, nhom: Math.min(nv.nhom, NHOM_MAY), lat: nv.lat, huong: nv.huong };
      }),
    }));
  }

  /** Nạp lại ván đã lưu và dừng ở màn Tạm dừng để người chơi bấm Tiếp tục */
  khoiPhuc(d: TrangThaiLuu): void {
    if (!d || d.phienBan !== PHIEN_BAN_LUU || !Array.isArray(d.nguoi) || d.nguoi.length !== 2) throw new Error('Dữ liệu lưu không hợp lệ');
    this.banDo = d.banDo === 'co' ? 'co' : 'sa';
    this.batDau();
    this.tGame = d.tGame; this.t = d.t; this.chamDen = d.chamDen; this.id = d.id;
    this.henTuong = d.henTuong; this.soLanTuong = d.soLanTuong; this.lanTuong = d.lanTuong;
    this.ga = d.ga; this.trungDe = d.trungDe; this.vatPham = d.vatPham; this.ngocNhat = d.ngocNhat ?? []; this.ngocBay = []; this.cuu = d.cuu ?? [];
    this.cauTron = d.cauTron?.length ? d.cauTron.map((q, i) => ({ ...q, cua: q.cua ?? i })) : taoCauTron();
    if (d.vuon) { this.vuonNgu = d.vuon.ngu; this.toTrung = d.vuon.to; this.toDe = d.vuon.toDe; this.daNoPhu = d.vuon.daNoPhu; this.choVua = d.vuon.choVua; }
    if (d.cell?.length) this.cell = d.cell.map((c) => ({ ...c, hp: c.suc === undefined ? Math.min(c.hp, CELL_HP[c.cap]!) : c.hp }));
    this.tiec = Array.isArray(d.tiec) ? d.tiec : [];
    this.chuongTiec = [];
    // Tiệc không còn tan hẳn (ván lưu cũ có thể có on = false): Cell về vòng tiệc, đội hình dựng lại từ đầu
    for (const tc of this.tiec) tc.on = true;
    // Ngọc 2 sao chỉ hiện khi đã hạ hết Cell (ván lưu bản trước có thể đặt sẵn ngọc giữa tiệc khi Cell còn sống)
    // Ngọc 2 sao giờ nằm dưới Cell giữ ngọc giữa đảo 0 (ván lưu cũ: bánh hoá ngọc / tiệc đảo 0 thì bỏ, Cell đảo 0 thành Cell giữ ngọc)
    for (const tc of this.tiec) delete tc.ngoc;
    this.tiec = this.tiec.filter((tc) => tc.dao !== CELL_NGOI_DAO);
    this.cong = viTriCong(this.tiec);
    this.datNgocCellNgoi();
    this.datNgocMeCung();
    this.cellDoi = [];
    this.cellChuongLuc = [];
    this.cellComboDem = [];
    this.fzChuongLuc = [];
    this.fzComboDem = [];
    for (const c of this.cell) { c.vai = undefined; c.muc = undefined; c.cay = undefined; c.nap = undefined; c.chien = false; if (!this.tiecCua(c)) c.tiec = false; }
    if (d.mayBay) this.mayBay = { ...taoMayBay(d.mayBay.x, d.mayBay.y), ...d.mayBay };
    this.phiThuyen = d.phiThuyen ? { ...taoPhiThuyen(this.mayBay), ...d.phiThuyen } : taoPhiThuyen(this.mayBay);
    // Bóng ma Goku: thôi chạm trán / gồng / lao dở (lần gặp sau sao chép lại, giữ tỉ lệ máu)
    if (d.ginyu) this.ginyu = { ...taoGinyu(), ...d.ginyu, gap: false, quen: 0, muc: undefined, nap: undefined, lao: undefined, lui: undefined, dang: 0, khieu: undefined, nghi: undefined, quang: undefined, sao: undefined, socola: undefined };
    this.gyNv = null;
    // Bản sao dở / xác bản sao không khôi phục: về dạng bóng ma
    if (this.ginyu.chet) this.ginyu.tChet = GY_CHET_T;
    // Ván lưu cũ đang chờ hồi sinh mà nay hết lượt (GY_HOI_SINH giảm): chết hẳn, rơi ngọc 3 sao
    if (this.ginyu.chet && this.ginyu.choHoi && (this.ginyu.hoiSinh ?? 0) >= GY_HOI_SINH) {
      this.ginyu.choHoi = undefined;
      this.gyRoiNgoc();
    }
    this.daRaVuon = d.truyVuon?.ra ?? true;
    this.cellTruyVuon = d.truyVuon?.on ?? false;
    this.cellTruyT = d.truyVuon?.cell ?? this.cellTruyVuon;
    this.fzTruy = d.truyVuon?.fz ?? false;
    this.gyTruy = d.truyVuon?.gy ?? false;
    this.trieuHoi = d.truyVuon?.th ?? false;
    this.sangMc = this.trieuHoi && (d.truyVuon?.mc ?? false);
    if (this.trieuHoi) thanVo.fill(true);
    for (const c of this.trangTri) { delete c.doLuc; delete c.huongDo; delete c.mat; }
    for (const i of d.thanVo ?? []) if (i >= 0 && i < thanVo.length) thanVo[i] = true;
    this.frieza = taoFrieza();
    if (d.frieza) { this.frieza.hp = d.frieza.hp; this.frieza.chet = d.frieza.chet; if (d.frieza.chet) this.frieza.tChet = FZ_CHET_T; }
    for (const [i, t, h, m] of d.cayDo ?? []) if (this.trangTri[i]) { this.trangTri[i].doLuc = t; this.trangTri[i].huongDo = h; this.trangTri[i].mat = !!m; }
    // Đội hình theo nhân vật đã lưu (ván lưu cũ thiếu ki: ô trái Mabu, ô phải Zinbu)
    const kiLuu = d.nguoi.map((o, p) => (o.vang ? null : o.ki ?? p));
    this.cheNguoi = THE_CHON.find((c) => DOI_HINH[c][0] === kiLuu[0] && DOI_HINH[c][1] === kiLuu[1]) ?? 'ca2';
    this.nguoi = d.nguoi.map((o, p) => {
      const { nhom, lat, huong, ...r } = o;
      const n: NguoiChoi = { ...this.taoNguoiChoi()[p], ...r };
      n.nv.lat = lat;
      n.nv.huong = huong;
      n.nv.datNhom(nhom, this.t);
      if (n.het) n.nv.nga();
      else if (n.may.dang) n.nv.vaoMay();
      return n;
    });
    // Phi thuyền đang đi dở: coi như đã tới nơi (cất cánh dở thì vẫn ở bến cũ), mọi người bước ra
    const pt = this.phiThuyen;
    if (pt.pha !== 'dau' && pt.pha !== 'no') {
      if (pt.pha !== 'cat') { pt.noi = pt.noi === 'vuon' ? 'nui' : 'vuon'; Object.assign(pt, pt[pt.noi]); }
      else Object.assign(pt, pt[pt.noi]);
      this.ptXuong();
    }
    this.chonNguoiDau();
    this.capNhatView(0, true);
    this.man = 'pause';
  }

  dongGame(): void {
    this.onDong();
  }

  get chang(): number {
    return this.tGame < 30 ? 0 : this.tGame < 60 ? 1 : 2;
  }

  get tenChang(): string {
    return ['Buổi sáng', 'Buổi chiều', 'Hoàng hôn'][this.chang];
  }

  get tongDiem(): number {
    return this.nguoi[0].diem + this.nguoi[1].diem;
  }

  /** Kết quả ván: true = Mabu và Zinbu thắng (diệt hết gà), false = quái vật thắng (cả hai cùng gục). Chỉ có nghĩa ở màn kết thúc. */
  nguoiThangTran = false;

  /** Tổng số gà con còn sống (trắng, đỏ, đen; không tính gà mẹ) */
  get soGaCon(): number {
    return this.ga.filter((g) => g.loai !== 'boss' && !g.chet).length;
  }

  /** Số gà mẹ phụ còn sống (nở từ trứng đỏ) */
  get soMePhu(): number {
    return this.ga.filter((g) => laMePhu(g) && !g.chet).length;
  }

  /** Đã đủ GA_CON_TOI_DA gà con / ME_PHU_TOI_DA tướng gà (tính lại đầu mỗi khung trong capNhat) */
  private dayCon = false;
  private dayPhu = false;
  /** id các tướng gà đang được phép vây đánh (chonVay()), không lưu ván */
  private vay = new Set<number>();
  private henVay = 0;

  get nguoiThang(): number {
    const [a, b] = this.nguoi;
    if (a.vang || b.vang) return -1;
    return a.diem === b.diem ? -1 : a.diem > b.diem ? 0 : 1;
  }

  get dangCham(): boolean {
    return this.chamDen > this.tGame;
  }

  dangChum(p: number): boolean {
    return this.nguoi[p].chumDen > this.tGame;
  }

  heSo(p: number): number {
    return Math.min(3, 1 + Math.floor(this.nguoi[p].combo / 5));
  }

  doChinhXac(p: number): number {
    const n = this.nguoi[p];
    const tong = n.banTrung + n.banTruot;
    return tong ? Math.round((n.banTrung / tong) * 100) : 0;
  }

  // ─── Vòng lặp ───

  /** Trần độ phân giải theo màn hình và chế độ mát máy */
  private dprTranThat(): number {
    return Math.min(window.devicePixelRatio || 1, DPR_TOI_DA, this.matMay ? DPR_MAT : DPR_TOI_DA);
  }

  /** Tự chỉnh độ phân giải theo FPS đo được (mỗi 0,5s): thấp liền 1,5s thì hạ một bậc, cao ổn định thì tăng lại một bậc */
  private chinhDoPhanGiai(now: number): void {
    this.tuMatMay();
    const mucTieu = this.matMay ? FPS_MAT : 60;
    if (this.man !== 'play' || document.hidden) { this.fpsThap = this.fpsCao = 0; return; }
    if (this.fps < (FPS_THAP * mucTieu) / 60 && this.dpr > DPR_SAN) {
      this.fpsCao = 0;
      if (++this.fpsThap >= 3) {
        this.fpsThap = 0;
        // Vừa tăng lên mà phải hạ ngay: máy không gánh nổi mức đó, lần sau chờ lâu hơn mới thử tăng lại
        this.dprChoTang = now - this.dprLucTang < DPR_DAO_DONG ? Math.min(DPR_CHO_TOI_DA, this.dprChoTang * 2) : DPR_CHO;
        this.dprLucHa = now;
        this.dprTran = Math.max(DPR_SAN, this.dpr - DPR_BUOC);
        this.datKhung();
      }
      return;
    }
    this.fpsThap = 0;
    if (this.fps >= mucTieu * FPS_TANG && this.dpr < this.dprTranThat()) {
      if (++this.fpsCao >= DPR_TANG_DEM && now - this.dprLucHa >= this.dprChoTang) {
        this.fpsCao = 0;
        this.dprLucTang = now;
        this.dprTran = Math.min(this.dprTranThat(), this.dpr + DPR_BUOC);
        this.datKhung();
      }
    } else this.fpsCao = 0;
  }

  /** Tự bật / tắt mát máy (gọi mỗi 0,5s): chỉ đo khi đang chơi; đang bật thì không xét FPS (FPS bị giới hạn 30), hết giờ thì tắt */
  private tuMatMay(): void {
    if (this.man !== 'play' || document.hidden) { this.matDem = 0; return; }
    if (this.matMay) {
      this.matMayCon -= 0.5;
      if (this.matMayCon > 0) return;
      this.matMay = false;
      this.matMayCon = 0;
    } else {
      if (this.fps >= MAT_BAT_FPS) { this.matDem = 0; return; }
      if (++this.matDem < MAT_BAT_DEM) return;
      this.matMay = true;
      this.matMayCon = MAT_THOI_GIAN;
      this.dprTran = Math.max(DPR_SAN, Math.min(this.dpr, this.dprTranThat()));
    }
    // Đổi chế độ: độ phân giải tự dò lại từ mức hiện tại (tắt mát máy thì tăng dần lại)
    this.matDem = this.fpsThap = this.fpsCao = 0;
    this.dprChoTang = DPR_CHO;
    this.dprLucHa = performance.now() - DPR_CHO;
    this.datKhung();
  }

  /** Mốc thời gian (ms) sớm nhất được vẽ khung kế tiếp (giới hạn FPS) */
  private khungTiep = 0;

  private vongLap = (now: number) => {
    // Giới hạn FPS (tối đa FPS_TOI_DA, mát máy thì FPS_MAT): bỏ qua khung hình tới hạn tiếp theo (cộng dồn theo lịch để màn 120 / 144Hz vẫn đều 60, trừ hao 1ms cho lệch nhịp)
    const cach = 1000 / (this.matMay ? FPS_MAT : FPS_TOI_DA);
    if (now < this.khungTiep - 1) {
      this.rafId = requestAnimationFrame(this.vongLap);
      return;
    }
    this.khungTiep = Math.max(this.khungTiep + cach, now);
    HN.batDauKhung(now);
    const dt = Math.min(0.05, (now - this.lanCuoi) / 1000);
    // Đếm FPS thật (số khung hình vẽ ra mỗi giây), cập nhật mỗi 0.5 giây
    this.fpsDem++;
    if (now - this.fpsMoc >= 500) {
      this.fps = Math.round((this.fpsDem * 1000) / (now - this.fpsMoc));
      this.fpsDem = 0;
      this.fpsMoc = now;
      this.chinhDoPhanGiai(now);
    }
    this.lanCuoi = now;
    this.docTayCam();
    HN.moc('tayCam');
    if (this.man !== 'pause') {
      this.t += dt;
      if (this.man === 'play') {
        // Hit-stop: đòn mạnh trúng thì game chậm lại một chút
        const dtGame = this.dungHinh > 0 ? dt * DUNG_HE_SO : dt;
        this.dungHinh = Math.max(0, this.dungHinh - dt);
        this.capNhat(dtGame);
      }
      else this.nguoi.forEach((n) => this.capNhatNhanVat(n, dt));
      this.capNhatView(dt, this.camNgay);
      this.camNgay = false;
      HN.moc('view');
    }
    this.am.nhacNen(this.man === 'play', this.trenNui || this.trenThan || this.trenMeCung ? 'ma' : this.trenDao ? 'dao' : 'thuong');
    if (this.ctx) this.ve.ve(this.ctx, this, this.dpr, this.ctxNen, NEN_TL);
    // Màn chơi chỉ vẽ canvas; phần HTML (màn bắt đầu / tạm dừng / kết thúc, nút) chỉ cập nhật khi cần
    if (this.man !== 'play' || this.manDaVe !== this.man) this.onManPhu();
    this.manDaVe = this.man;
    HN.moc('manPhu');
    HN.ketKhung(now, () => this.thongKeHieuNang());
    this.rafId = requestAnimationFrame(this.vongLap);
  };

  /** Số liệu cho bộ đo hiệu năng (HN, chỉ gọi mỗi giây khi bật ?doHieuNang): cỡ mọi mảng của game (tự bắt mảng mới), bộ nhớ đệm ảnh, vùng */
  private thongKeHieuNang(): Record<string, number | string | boolean> {
    const kq: Record<string, number | string | boolean> = {};
    for (const [k, v] of Object.entries(this)) if (Array.isArray(v)) kq[k] = v.length;
    Object.assign(kq, this.ve.thongKe());
    kq['dpr'] = this.dpr;
    kq['matMay'] = this.matMay;
    kq['fpsMucTieu'] = this.matMay ? FPS_MAT : FPS_TOI_DA;
    kq['man'] = this.man;
    kq['vung'] = this.phiThuyen.ngoi.length && this.phiThuyen.pha !== 'dau' ? 'phiThuyen' : this.mayBay.ngoi.length && this.mayBay.pha !== 'dau' ? 'mayBay' : this.trenNui ? 'nui' : this.trenThan ? 'than' : this.trenDao ? `dao${this.daoHienTai}` : 'vuon';
    const n = this.nguoi.find((x) => !x.vang);
    if (n) { kq['x'] = Math.round(n.x); kq['y'] = Math.round(n.y); }
    kq['canvas'] = `${this.canvasEl.width}x${this.canvasEl.height}`;
    return kq;
  }

  /**
   * Mê cung bom dừng cả thế giới: có nhân vật (có mặt, chưa gục, không ngồi xe) đang ở map mê cung bom (`vungMc()`) thì đồng hồ ván (`tGame`)
   * không đếm, mọi map khác (gà, trứng, vườn, Cell, tiệc, bóng ma, Frieza, máy bay, phi thuyền, quả cầu, mốc truy sát / triệu hồi…) đứng yên,
   * nhân vật ở ngoài mê cung cũng đứng yên; chỉ mê cung, người trong mê cung, chưởng / hiệu ứng / cứu người còn chạy. Ra khỏi mê cung thì chạy tiếp.
   */
  get dungTheGioi(): boolean {
    for (let p = 0; p < this.nguoi.length; p++) {
      const n = this.nguoi[p]!;
      if (!n.vang && !n.het && !this.trongMb(p) && this.vungMc(n)) return true;
    }
    return false;
  }

  /** Nhân vật p đứng yên vì mê cung bom đang dừng thế giới (p ở ngoài map mê cung). Người đang ở bất kỳ đoạn nào của đường hầm
   *  (kể cả đoạn còn trong đảo 1, cửa hầm) vẫn đi được, để người vào sau theo kịp người vào trước, không bị kẹt ở cửa hầm */
  private biDung(p: number): boolean {
    const n = this.nguoi[p]!;
    return this.man === 'play' && (this.trongMb(p) || (!this.vungMc(n) && !trongHam(n.x, n.y, 200))) && this.dungTheGioi;
  }

  /** Đồng hồ ván mm:ss (góc trên trái, phần đen ngoài map) */
  dongHo(): string {
    const g = Math.max(0, Math.floor(this.tGame));
    return `${String(Math.floor(g / 60)).padStart(2, '0')}:${String(g % 60).padStart(2, '0')}`;
  }

  private capNhat(dt: number): void {
    HN.moc('cn.khac');
    const dung = this.dungTheGioi;
    if (!dung) this.tGame += dt;
    const k = kep(this.tGame / THOI_GIAN_HOANG_HON, 0, 1);
    this.mauHoangHon = tronMau([255, 220, 140], [255, 110, 60], k);
    this.doHoangHon = k * 0.3;

    const dtE = dt * (this.dangCham ? 0.45 : 1);
    this.rung = Math.max(0, this.rung - dt);
    if (this.rung === 0) this.rungBien = RUNG_BIEN;

    this.dayCon = this.soGaCon >= GA_CON_TOI_DA;
    this.dayPhu = this.soMePhu >= ME_PHU_TOI_DA;
    if (!dung) {
      this.capNhatVuon(dtE);
      this.kiemTraOLiVuon();
      this.kiemTraCellTruy();
      this.kiemTraFzTruy();
      this.kiemTraHopMo();
      this.kiemTraGyTruy();
      this.kiemTraTrieuHoi();
      this.kiemTraSangMc();
      this.kiemTraThang(dt);
      HN.moc('cn.vuon');
      this.capNhatTrungGa(dt);
      HN.moc('cn.trung');
      this.henTuong -= dtE;
      if (this.vuonNgu || this.choVua) this.henTuong = Math.max(this.henTuong, 0.1);
      else if (this.henTuong <= 0) {
        if (this.ga.some((g) => g.goc && !g.chet)) this.henTuong = 10;
        else if (this.soLanTuong <= TUONG_HOI_SINH) {
          this.sinhTuong();
          this.henTuong = CHO_TUONG;
        } else this.henTuong = 10;
      }
    }
    const truoc = this.nguoi.map((n) => ({ x: n.x, y: n.y }));
    this.dieuKhien(dt, dung);
    HN.moc('cn.dieuKhien');
    this.rangBuoc(truoc);
    if (!dung) this.capNhatHopThe(dt);
    HN.moc('cn.hopThe');
    // Nhân vật đi bộ / bay không đổi vùng: đang trong vườn gà thì ở lại trong vườn, đang ở đảo thì ở lại đảo (chỉ máy bay mới ra / vào vườn)
    this.nguoi.forEach((n, p) => { if (!this.trongMb(p)) giuTrongMap(n, leNhanVat(n.nv.heSoTo * this.toNv(p)), !!n.bay, vungCua(truoc[p])); });
    this.chanNuiMotNguoi(truoc);
    this.chanMeCung(truoc);
    if (this.trieuHoi && !this.sangMc) this.nguoi.forEach((n, p) => { if (!n.vang && !this.trongMb(p)) giamThan(n, !!n.bay); });
    HN.moc('cn.nhanVat');
    if (!dung) {
      this.capNhatMb(dt);
      this.capNhatPt(dt);
      HN.moc('cn.mayBay');
      this.capNhatCong(dt);
      this.nguoi.forEach((n, p) => this.mayQuet(n, p));
      HN.moc('cn.may');
      this.chonVay(dtE);
      HN.moc('cn.chonVay');
      this.capNhatGa(dtE);
      HN.moc('cn.ga');
      this.gaDanhNguoi();
      HN.moc('cn.gaDanh');
      this.capNhatCell(dtE);
      HN.moc('cn.cell');
      this.capNhatGinyu(dtE);
      this.capNhatFz(dtE);
      this.giamTrumThan();
      this.capNhatConBu(dtE);
    }
    this.capNhatMeCung(dtE);
    HN.moc('cn.meCung');
    HN.moc('cn.ginyu');
    if (!dung) this.capNhatTiec(dtE);
    HN.moc('cn.tiec');
    this.capNhatDan(dt);
    HN.moc('cn.dan');
    if (!dung) this.capNhatKeo(dt);
    HN.moc('cn.keo');
    this.capNhatCuu(dt);
    HN.moc('cn.cuu');
    if (!dung) this.capNhatCau(dt);
    HN.moc('cn.cau');
    if (!dung) this.capNhatCay();
    HN.moc('cn.cay');
    this.capNhatVatPham(dt, dung);
    HN.moc('cn.vatPham');
    if (!dung) this.capNhatNgocTiec();
    HN.moc('cn.ngocTiec');
    this.capNhatHieuUng(dt);
    HN.moc('cn.hieuUng');
  }

  private dungKhung(giay: number): void {
    this.dungHinh = Math.max(this.dungHinh, giay);
  }

  private rungMan(giay: number, bien = RUNG_BIEN): void {
    if (this.rung <= 0) this.rungBien = bien;
    else this.rungBien = Math.max(this.rungBien, bien);
    this.rung = Math.max(this.rung, giay);
  }

  // Quả táo: hết hạn thì biến mất, nhân vật chạm vào thì nhặt (chạm là nhặt, kể cả khi đã đầy máu / mana)
  // Cây đã đổ được CAY_MOC_LAI giây thì mọc lại (đứng thẳng, hết "mat")
  private capNhatCay(): void {
    for (const c of this.trangTri) {
      if (c.doLuc !== undefined && this.t - c.doLuc >= (c.nui ? DA_VO_LAI : CAY_MOC_LAI)) { delete c.doLuc; delete c.huongDo; delete c.mat; }
    }
  }

  /** Nhân vật m nhặt viên ngọc rồng `sao` sao ở (x, y): chữ bay, nổ sáng, chưởng lên trời, viên ngọc bay lên hàng ngọc trên thanh đen */
  private nhatNgoc(m: NguoiChoi, x: number, y: number, sao: number): void {
    this.am.phat('anTao');
    this.chu.push({ id: this.id++, x: m.x, y: m.y - 220, text: `⭐ NGỌC RỒNG ${sao} SAO! (${this.ngocNhat.length + 1}/${NGOC_THANG})`, mau: '#ffb347', t: 0 });
    this.vet.push({ id: this.id++, x, y, t: 0, loai: 'chay', co: 1.2 });
    this.chuongLenTroi(this.nguoi.indexOf(m));
    this.ngocBay.push({ x, y: y - 40, t: 0, slot: this.ngocNhat.length, sao });
    this.ngocNhat.push(sao);
  }

  /**
   * Cell giữ ngọc (đảo CELL_NGOI_DAO) ngồi giữa đảo trên viên ngọc rồng 2 sao. Gọi lúc tạo ván / tải ván: Cell đảo đó thành Cell giữ ngọc (không tiệc),
   * ngọc 2 sao chưa nhặt mà chưa nằm đâu thì đặt ở chỗ ngồi.
   */
  private datNgocCellNgoi(): void {
    let cho = choNgoiCell();
    for (const c of this.cell) {
      if (this.daoCell(c) !== CELL_NGOI_DAO) continue;
      if (!c.ngoi) { c.ngoi = true; c.hx = cho.x; c.hy = cho.y; }
      c.tiec = false;
      cho = { x: c.hx, y: c.hy };
    }
    if (this.ngocNhat.includes(NGOC_TIEC_SAO) || this.vatPham.some((v) => v.loai === 'ngoc' && v.sao === NGOC_TIEC_SAO)) return;
    this.vatPham.push({ id: this.id++, x: cho.x, y: cho.y, t: 0, loai: 'ngoc', sao: NGOC_TIEC_SAO, to: CELL_NGOI_NGOC_TO });
  }

  /** Cell giữ ngọc đang ngồi trên viên ngọc (còn sống, ở đúng chỗ ngồi, không chạy, ngọc chưa ai nhặt) */
  cellNgoiNgoc(c: Cell): boolean {
    return !!c.ngoi && !c.chet && !c.chay && c.danh <= 0 && c.nap === undefined && hyp(c.x - c.hx, c.y - c.hy) < 5 && !this.ngocNhat.includes(NGOC_TIEC_SAO);
  }

  /** Ngọc rồng giữa vòng tiệc của Cell: nhân vật (không ẩn / gục / mây, không đang bay) chạm vào thì nhặt; chỗ đó thành bánh sinh nhật thường */
  private capNhatNgocTiec(): void {
    for (const tc of this.tiec) {
      if (!tc.ngoc) continue;
      const m = this.nguoi.find((q) => !q.vang && !this.khuat(q) && !q.bay && hyp(q.x - tc.x, q.y - tc.y) < NGOC_BAN_KINH + 60 * this.ngocTiecTo(tc));
      if (!m) continue;
      this.nhatNgoc(m, tc.x, tc.y - 60, tc.ngoc);
      delete tc.ngoc;
    }
  }

  /** Độ to viên ngọc rồng nằm giữa vòng tiệc (theo độ to bánh của đảo, không nhỏ hơn ngọc rơi trên đất) */
  ngocTiecTo(tc: Tiec): number {
    return Math.max(0.55, tc.to * 1.2);
  }

  /** dung: mê cung bom đang dừng thế giới (vật phẩm ngoài mê cung không đếm giờ hết hạn, vẫn nhặt được ngọc trong mê cung) */
  private capNhatVatPham(dt: number, dung = false): void {
    const conLai: VatPham[] = [];
    for (const b of this.ngocBay) b.t += dt;
    this.ngocBay = this.ngocBay.filter((b) => b.t < this.NGOC_BAY_T);
    for (const v of this.vatPham) {
      if (!dung) v.t += dt;
      const ngoc = v.loai === 'ngoc';
      if (!ngoc && v.t >= VP_TON_TAI) continue;
      if (ngoc) {
        const m = this.nguoi.find((q) => !this.khuat(q) && !q.bay && hyp(q.x - v.x, q.y - v.y) < NGOC_BAN_KINH * (v.to ? v.to / 0.55 : 1));
        // Cell giữ ngọc đang ngồi trên viên ngọc thì không lấy được: phải dụ / đánh nó rời chỗ (hoặc hạ nó)
        const giu = m && this.cell.find((c) => this.cellNgoiNgoc(c) && hyp(c.x - v.x, c.y - v.y) < 40);
        // Bà phù thuỷ ngồi trên ngọc 4 sao cuối mê cung: phải hạ bà bằng bom
        const ba = m && v.sao === MC_NGOC_SAO && this.baSong;
        if (giu || ba) {
          if (this.t >= this.baoGiuNgoc) {
            this.baoGiuNgoc = this.t + 2;
            this.chu.push({ id: this.id++, x: v.x, y: v.y - 120, text: ba ? '🧙 BÀ PHÙ THUỶ ĐANG NGỒI TRÊN NGỌC! DÙNG BOM HẠ BÀ' : '🛡 CELL ĐANG NGỒI TRÊN NGỌC!', mau: '#ff6b6b', t: 0 });
          }
          conLai.push(v);
        } else if (m) this.nhatNgoc(m, v.x, v.y, v.sao ?? 1);
        else conLai.push(v);
        continue;
      }
      const xanh = v.loai === 'xanh';
      const dau = v.loai === 'dau';
      const n = this.nguoi.find((m) => !this.khuat(m) && hyp(m.x - v.x, m.y - v.y) < VP_BAN_KINH);
      if (n) {
        this.am.phat('anTao');
        if (v.loai === 'socola') {
          this.anSocola(n, v.luong, v.sucAn);
        } else if (dau) {
          this.hoiMau(n, DAU_MAU);
          this.hoiDayMana(n, DAU_MANA);
          n.satDau = (n.satDau ?? 0) + DAU_SAT;
          this.chu.push({ id: this.id++, x: n.x, y: n.y - 220, text: `🫘 ĐẬU THẦN +${DAU_MAU} ❤ +${DAU_MANA} mana +${DAU_SAT} ⚔`, mau: '#7be04a', t: 0 });
        } else if (xanh) {
          this.hoiDayMana(n);
          this.chu.push({ id: this.id++, x: n.x, y: n.y - 220, text: `+${VP_MANA} mana`, mau: '#2fa8ff', t: 0 });
        } else {
          this.hoiMau(n, VP_HOI);
          this.chu.push({ id: this.id++, x: n.x, y: n.y - 220, text: `+${VP_HOI} ❤`, mau: '#ff3b3b', t: 0 });
        }
        this.vet.push({ id: this.id++, x: v.x, y: v.y, t: 0, loai: 'bui' });
        continue;
      }
      // Cell đi qua cũng ăn socola: +CELL_AN_TI_LE máu của con đã hoá socola và +sức mạnh (không giới hạn)
      if (v.loai === 'socola') {
        const ce = this.cell.find((c) => !c.chet && !((c.socola ?? 0) > 0) && hyp(c.x - v.x, c.y - v.y) < CELL_BK * cellK(c.cap));
        if (ce) {
          const hoi = Math.max(1, Math.round((v.hpGa ?? HP_GA) * CELL_AN_TI_LE));
          const them = v.sucAn ?? CELL_AN_SUC;
          ce.hp += hoi;
          ce.suc = (ce.suc ?? 1) + them;
          const t = this.tamCell(ce);
          this.chu.push({ id: this.id++, x: t.x, y: t.y - 90, text: `🍫 CELL ĂN +${hoi} ❤ SỨC MẠNH +${Math.round(them * 100)}%`, mau: '#c98a4b', t: 0 });
          this.vet.push({ id: this.id++, x: v.x, y: v.y, t: 0, loai: 'bui' });
          continue;
        }
      }
      // Cell đi qua cũng ăn đậu thần: +DAU_MAU máu (không giới hạn); chỉ ăn đậu nằm trong vòng đảo của chính nó
      if (dau) {
        const ce = this.cell.find((c) => !c.chet && !((c.socola ?? 0) > 0) && hyp(c.x - v.x, c.y - v.y) < CELL_BK * cellK(c.cap)
          && this.cellDuocAnDau(c, v));
        if (ce) {
          // Như Mabu / Zinbu: +DAU_MAU máu; Cell không có mana nên sát thương cộng thêm nhiều hơn (CELL_DAU_SAT mỗi đòn, không giới hạn)
          ce.hp += DAU_MAU;
          ce.satDau = (ce.satDau ?? 0) + CELL_DAU_SAT[ce.cap]!;
          ce.suc = (ce.suc ?? 1) + CELL_DAU_SUC[ce.cap]!;
          const t = this.tamCell(ce);
          this.chu.push({ id: this.id++, x: t.x, y: t.y - 90, text: `🫘 CELL ĂN ĐẬU THẦN +${DAU_MAU} ❤ +${CELL_DAU_SAT[ce.cap]} ⚔` + (CELL_DAU_SUC[ce.cap]! > 0 ? ` SỨC MẠNH x${ce.suc.toFixed(2)}` : ''), mau: '#7be04a', t: 0 });
          this.vet.push({ id: this.id++, x: v.x, y: v.y, t: 0, loai: 'bui' });
          continue;
        }
      }
      // Frieza (đang đi ăn hồi máu ngoài thần điện) ăn táo / đậu thần: hồi một phần máu tối đa, không giới hạn
      if (this.frieza.hoi && !this.frieza.chet && v.loai !== 'socola' && hyp(this.frieza.x - v.x, this.frieza.y - v.y) < FZ_AN_BK) {
        const f = this.frieza;
        const hoi = Math.round(fzHpMax(f) * (dau ? FZ_AN_DAU : FZ_AN_TAO));
        f.hp += hoi;
        this.chuGa({ id: this.id++, x: f.x, y: f.y - 340, text: `${dau ? '🫘' : '🍎'} FRIEZA ĂN +${hoi} ❤`, mau: dau ? '#7be04a' : '#ff6b6b', t: 0 });
        this.vetGa({ id: this.id++, x: v.x, y: v.y, t: 0, loai: 'bui' });
        continue;
      }
      // Gà đi qua chỉ mổ ăn táo đỏ (táo xanh gà không ăn): hồi VP_HOI máu, không có trần. Socola thì mọi gà (con, mẹ gốc, mẹ phụ) đều ăn
      const socola = v.loai === 'socola';
      const ga = xanh || dau ? undefined : this.ga.find((g) => !g.chet && hyp(g.x - v.x, g.y - v.y) < (g.loai === 'boss' ? VP_GA_BAN_KINH * 2.5 : VP_GA_BAN_KINH));
      if (ga) {
        ga.mo = MO_THOI_GIAN;
        ga.lat = v.x < ga.x;
        if (socola) {
          // Ăn socola: hồi 2% máu tối đa, sức mạnh và độ to tăng theo
          const hoiGa = Math.max(1, Math.round((v.hpGa ?? HP_GA) * SOCOLA_GA_TI_LE));
          ga.hp += hoiGa;
          ga.suc = Math.min(SOCOLA_SUC_TOI_DA, (ga.suc ?? 1) + SOCOLA_SUC_GA);
          ga.to = Math.min(ga.loai === 'boss' ? SOCOLA_TO_TOI_DA_ME : SOCOLA_TO_TOI_DA, (ga.to ?? 1) + SOCOLA_TO_GA);
          this.chuGa({ id: this.id++, x: ga.x, y: this.tamGa(ga).y - 60, text: `🍫 +${hoiGa} ❤ SỨC MẠNH x${ga.suc}`, mau: '#c98a4b', t: 0 });
        } else {
          ga.hp += VP_HOI;
          this.chuGa({ id: this.id++, x: ga.x, y: this.tamGa(ga).y - 60, text: `+${VP_HOI} ❤`, mau: '#ff6b6b', t: 0 });
        }
        this.vetGa({ id: this.id++, x: v.x, y: v.y, t: 0, loai: 'bui' });
        continue;
      }
      conLai.push(v);
    }
    this.vatPham = conLai;
  }

  // Socola: cộng máu và mana (không giới hạn), mở khoá bay, rồi tự bắn chưởng lên trời
  private anSocola(n: NguoiChoi, luong?: number, sucAn?: number): void {
    const mau = luong ?? SOCOLA_NV_MAU;
    const mana = luong ?? SOCOLA_NV_MANA;
    this.hoiMau(n, mau);
    this.hoiMana(n, mana);
    if (sucAn) {
      n.suc += sucAn;
      this.chu.push({ id: this.id++, x: n.x, y: n.y - 310, text: `💪 SỨC MẠNH +${Math.round(sucAn * 100)}%`, mau: '#ff9f1a', t: 0 });
    }
    n.bayKhoa = 0;
    this.chu.push({ id: this.id++, x: n.x, y: n.y - 250, text: `🍫 +${mau} ❤ +${mana} mana`, mau: '#c98a4b', t: 0 });
    this.chuongLenTroi(this.nguoi.indexOf(n));
  }

  private themVatPham(x: number, y: number, loai: 'do' | 'xanh' | 'dau' = Math.random() < 0.5 ? 'do' : 'xanh'): void {
    const v = { x, y };
    giuTrongMap(v, LE_VP);
    this.vatPham.push({ id: this.id++, x: v.x, y: v.y, t: 0, loai });
  }

  // Táo xanh: cộng VP_MANA mana và mở khoá bay
  private hoiDayMana(n: NguoiChoi, luong = VP_MANA): void {
    this.hoiMana(n, luong);
    n.bayKhoa = 0;
  }

  private hoiMana(n: NguoiChoi, luong: number): void {
    n.mana += luong;
  }

  // Hồi máu không giới hạn (ăn táo / socola / hạ gà mẹ cộng thẳng vào máu, không còn trần hay khiên)
  private hoiMau(n: NguoiChoi, luong: number): void {
    n.hp += luong;
  }

  /** dung: mê cung bom đang dừng thế giới, nhân vật ở ngoài map mê cung đứng yên hẳn (không điều khiển, không hồi, không animation) */
  private dieuKhien(dt: number, dung = false): void {
    this.nguoi.forEach((n, p) => {
      if (n.vang) return;
      if (dung && this.biDung(p)) { n.dangDi = false; return; }
      n.hoiChieu = Math.max(0, n.hoiChieu - dt);
      this.capNhatMay(n, dt);
      n.bayKhoa = Math.max(0, n.bayKhoa - dt);
      n.hoiSoc = Math.max(0, n.hoiSoc - dt);
      // Không bị thương một lúc thì tự hồi máu chậm (chỉ tới HP_HOI_TOI_DA)
      if (!n.het && n.hp < HP_HOI_TOI_DA && this.tGame - n.thuongLuc >= HP_HOI_CHO) n.hp = Math.min(HP_HOI_TOI_DA, n.hp + HP_HOI * dt);
      if (n.bay) n.mana = Math.max(0, n.mana - MANA_BAY * dt);
      else if (n.mana < MANA_HOI_TOI_DA) n.mana = Math.min(MANA_HOI_TOI_DA, n.mana + MANA_HOI * dt);

      // Mê cung bom: đang bốc cháy / sặc trong bong bóng thì đứng yên chờ cứu
      if (n.nv.khoa || this.trongCau(p) || this.mc.nv[p]?.trang) {
        n.dich = null;
        n.dangDi = false;
        if (this.mc.nv[p]?.trang) n.bay = null;
        this.capNhatNhanVat(n, dt);
        return;
      }
      // Đang ngồi trên máy bay: máy bay mang đi (phi công đặt điểm đến qua n.dich, xem capNhatMb)
      if (this.trongMb(p)) {
        n.dangDi = false;
        this.capNhatNhanVat(n, dt);
        return;
      }
      if (n.bay) {
        this.capNhatBay(n, dt);
        this.capNhatNhanVat(n, dt);
        return;
      }
      // Mê cung bom: đi theo ô, chỉ lên / xuống / trái / phải, luôn dừng ở giữa ô
      if (this.mcDi(p, dt)) return;

      let dx = 0;
      let dy = 0;
      if (n.dich) {
        dx = n.dich.x - n.x;
        dy = n.dich.y - n.y;
        if (hyp(dx, dy) < 6) {
          n.dich = null;
          dx = dy = 0;
          n.nv.tiepDat();
        }
      }
      const d = hyp(dx, dy);
      n.dangDi = d > 0;
      if (n.dangDi) {
        const buoc = Math.min(TOC_DO_DI * (n.may.dang ? MAY_TOC_DO : 1) * dt, n.dich ? d : Infinity);
        n.x = kepX(n.x + (dx / d) * buoc);
        n.y = kepY(n.y + (dy / d) * buoc);
        // Đi chủ yếu theo chiều dọc thì quay lên / xuống, còn lại quay trái / phải
        if (Math.abs(dy) > Math.abs(dx) * 1.2) n.nv.huong = dy < 0 ? 'len' : 'xuong';
        else {
          n.nv.huong = 'ngang';
          if (Math.abs(dx) > d * 0.2) n.nv.lat = dx < 0;
        }
      }
      this.capNhatNhanVat(n, dt);
    });
  }

  private capNhatNhanVat(n: NguoiChoi, dt: number): void {
    const truot = n.nv.capNhat(dt, n.dangDi);
    // Mê cung bom: nhân vật chỉ đứng ở tâm ô, động tác ném bom không được trượt người ra khỏi ô (lọt vào thùng / gạch)
    if (truot && !this.oMeCung(this.nguoi.indexOf(n))) n.x = kepX(n.x + truot * S_NV);
  }

  private capNhatBay(n: NguoiChoi, dt: number): void {
    const b = n.bay!;
    b.t += dt;
    const k = Math.min(1, b.t / b.T);
    n.x = b.x0 + (b.x1 - b.x0) * k;
    n.y = b.y0 + (b.y1 - b.y0) * k;
    n.dangDi = true;
    if (k < 1) {
      n.nv.bay(k);
      return;
    }
    n.bay = null;
    n.bayKhoa = BAY_KHOA;
    n.dangDi = false;
    n.nv.tiepDat();
  }

  private capNhatGa(dtKhung: number): void {
    const conLai: Ga[] = [];
    this.khungSo++;
    for (const g of this.ga) {
      // Gà ngoài màn hình và xa mọi nhân vật chỉ là "một chấm": cập nhật thưa (mỗi GA_THUA_NHIP khung, so le theo id) với dt dồn lại
      let dt = dtKhung;
      if (this.gaThua(g)) {
        g.dtThua = (g.dtThua ?? 0) + dtKhung;
        if ((this.khungSo + g.id) % GA_THUA_NHIP !== 0) { conLai.push(g); continue; }
      }
      if (g.dtThua) { dt += g.dtThua; g.dtThua = 0; }
      if (g.chet) {
        g.tChet += dt;
        g.h = Math.max(0, g.h0 + 180 * g.tChet - 600 * g.tChet * g.tChet);
        if (g.tChet < (g.loai === 'boss' ? 2 : 1)) conLai.push(g);
        continue;
      }
      // Gà con đang hoá socola: đứng yên, hết giờ thì tự hoá giải
      if (g.loai !== 'boss' && (g.socola ?? 0) > 0) {
        g.socola = (g.socola ?? 0) - dt;
        g.vx = g.vy = 0;
        g.nhay = Math.max(0, g.nhay - dt);
        if (g.socola <= 0) {
          g.socola = 0;
          this.chuGa({ id: this.id++, x: g.x, y: this.tamGa(g).y - 60, text: 'HOÁ GIẢI!', mau: '#9be7ff', t: 0 });
        }
        conLai.push(g);
        continue;
      }
      // Gà con bị Đá hất lùi: choáng, trượt theo lực đẩy rồi đứng yên, không đánh
      if (g.loai !== 'boss' && (g.choang ?? 0) > 0) {
        g.choang = (g.choang ?? 0) - dt;
        g.nhay = Math.max(0, g.nhay - dt);
        g.vx = g.vy = 0;
        if (g.day) {
          g.x += g.day.vx * dt;
          g.y += g.day.vy * dt;
          const k = Math.exp(-6 * dt);
          g.day.vx *= k;
          g.day.vy *= k;
        }
        giuTrongMap(g, leCuaGa(g), false, 'vuon');
        conLai.push(g);
        continue;
      }
      g.phase += dt;
      const bay = g.loai === 'flyer';
      g.nhay = Math.max(0, g.nhay - dt);
      g.mo = Math.max(0, (g.mo ?? 0) - dt);
      if (g.loai === 'boss' && (g.socola ?? 0) > 0) {
        // Đang là socola: đứng yên, mọi đồng hồ của gà mẹ tạm dừng; hết giờ thì nghỉ một chút rồi hoạt động lại
        g.socola = (g.socola ?? 0) - dt;
        g.vx = g.vy = 0;
        if (g.socola <= 0) {
          g.socola = 0;
          g.nghiChung = Math.max(g.nghiChung ?? 0, 1);
        }
      } else if (g.loai === 'boss') {
        this.capNhatChieuTuong(g, dt);
        // Chỉ gà mẹ gốc đẻ trứng (đang lao / bay thì không đẻ; gà mẹ gốc không có Lao / Bay)
        if (g.goc) {
          if (g.hp > 0 && g.hp < hpToiDa(g)) g.hp = Math.min(hpToiDa(g), g.hp + HOI_MAU_VUA * dt);
          // Đẻ đủ số lượng, không đẻ nữa: tự tăng máu và sát thương, không giới hạn
          if (g.hp > 0 && this.dayCon && this.dayPhu) {
            if (!g.satThem) this.chuGa({ id: this.id++, x: g.x, y: g.y - 400, text: '👑 VUA GÀ ĐẺ ĐỦ: TĂNG SỨC!', mau: '#ffd23f', t: 0 });
            g.hp += VUA_DU_MAU * dt;
            g.satThem = (g.satThem ?? 0) + VUA_DU_SAT * dt;
          }
          if (!g.chieu) g.de = (g.de ?? 0) - dt;
          // Giai đoạn 2: máu dưới GD2_MAU thì đẻ trứng nhanh hơn
          if (!g.gd2 && g.hp < hpToiDa(g) * GD2_MAU) {
            g.gd2 = true;
            g.de = Math.min(g.de ?? 0, 1.5);
            this.chuGa({ id: this.id++, x: g.x, y: g.y - 400, text: '🔥 GIAI ĐOẠN 2!', mau: '#ff6a3c', t: 0 });
          }
          if ((g.de ?? 0) <= 0) {
            g.de = choDeTrung(this.soMePhu) * (g.gd2 ? GD2_DE : 1);
            this.deTrung(g);
            // Mỗi lần xuất hiện / hồi sinh: đẻ lượt đầu rồi chờ trứng nở xong mới được dùng chiêu màu
            if (!g.daDe) {
              g.daDe = true;
              g.choChieu = TRUNG_NO;
            }
          }
        } else if (g.hp > 0 && this.dayCon && this.dayPhu) {
          // Tướng gà khi đã đẻ đủ: tăng máu, sát thương (không giới hạn) và to dần tới PHU_DU_TO_MAX lần
          g.hp += PHU_DU_MAU * dt;
          g.satThem = (g.satThem ?? 0) + PHU_DU_SAT * dt;
          if (g.toMax === undefined) g.toMax = (g.to ?? 1) * PHU_DU_TO_MAX;
          if ((g.to ?? 1) < g.toMax) g.to = Math.min(g.toMax, (g.to ?? 1) + PHU_DU_TO * dt);
        }
        g.choChieu = Math.max(0, (g.choChieu ?? 0) - dt);
        // Gọi gà con bảo vệ khi máu dưới GOI_MAU
        g.hoiGoi = Math.max(0, (g.hoiGoi ?? 0) - dt);
        g.dangGoi = Math.max(0, (g.dangGoi ?? 0) - dt);
        if (g.hp < hpToiDa(g) * GOI_MAU && g.hoiGoi <= 0 && !g.chieu && !this.dayCon && this.gaTrenCam(g)) this.goiGaCon(g);
        if (g.goc) this.dieuTuongGoc(g, dt);
        else this.dieuTuong(g, dt);
      }
      else if (this.gaLao(g, dt)) {
        // đang lao vào nhân vật trong tầm
      } else if (!bay) {
        g.doiHuong -= dt;
        if (g.doiHuong <= 0) {
          g.doiHuong = ngauNhien(1.5, 3.5);
          let goc = ngauNhien(0, Math.PI * 2);
          // Gà trắng đi thành đàn: hay hướng về gà trắng gần nhất
          if (g.loai === 'hen' && Math.random() < 0.6) {
            let ban: Ga | null = null;
            let dm = HEN_DAN;
            for (const o of this.ga) {
              if (o === g || o.chet || o.loai !== 'hen') continue;
              const dd = hyp(o.x - g.x, o.y - g.y);
              if (dd > 80 && dd < dm) { dm = dd; ban = o; }
            }
            if (ban) goc = Math.atan2(ban.y - g.y, ban.x - g.x);
          }
          const v = Math.random() < 0.25 ? 0 : g.loai === 'rooster' ? ngauNhien(70, 130) : ngauNhien(35, 75);
          g.vx = Math.cos(goc) * v;
          g.vy = Math.sin(goc) * v;
        }
      }
      if (g.vx) g.lat = g.vx < 0;
      g.x += g.vx * dt * HE_SO_TOC_GA;
      g.y += g.vy * dt * HE_SO_TOC_GA;
      const cham = giuTrongMap(g, leCuaGa(g), false, 'vuon');
      if (g.tron) {
        // Vua gà đang chạy trốn nhanh: trừ quãng đã chạy, chạm mép map thì thôi
        g.tron = Math.max(0, g.tron - hyp(g.vx, g.vy) * dt * HE_SO_TOC_GA);
        if (cham.cx || cham.cy) g.tron = 0;
      }
      if (g.chieu) {
        // Đang lao / bay mà chạm mép map thì dừng lại nghỉ, không bật lại
        if (g.chieu.pha === 'chay' && (cham.cx || cham.cy)) this.nghiChieu(g, g.chieu);
      } else {
        if (cham.cx) g.vx = -g.vx;
        if (cham.cy) g.vy = -g.vy;
      }
      switch (g.loai) {
        case 'boss': g.h = this.doCaoTuong(g); break;
        case 'rooster': g.h = Math.abs(Math.sin(g.phase * 5)) * 28; break;
        case 'flyer': g.h = g.h0 + Math.sin(g.phase * 3) * 30; break;
        default: g.h = 0;
      }
      conLai.push(g);
    }
    this.ga = conLai;
  }

  private capNhatDan(dt: number): void {
    const conLai: Dan[] = [];
    for (const d of this.dan) {
      const t0 = d.t;
      d.t += dt;
      if (d.gy) {
        // Đòn của bản sao bóng ma: chỉ trúng nhân vật (chưởng xuyên dọc đường bay), vẫn làm đổ cây / vỡ đá như đòn thật
        this.danDoCay(d, t0);
        if (d.t < d.T) {
          if (d.to) this.danGy(d, false);
          conLai.push(d);
        } else this.danGy(d, true);
        continue;
      }
      if (!d.troi) this.danDoCay(d, t0);
      if (d.to && !d.troi && !d.con) { this.danTrungMb(d, t0); this.danTrungPt(d, t0); }
      if (d.to && !d.soc && !d.troi && d.t < d.T) this.chuongXuyen(d);
      if (d.to && !d.troi && !d.con) this.danTrungBanh(d, t0);
      if (d.t < d.T) conLai.push(d);
      else if (d.troi) this.noTroi(d);
      else this.chamDich(d);
    }
    this.dan = conLai;
  }

  // Chưởng xuyên: mọi con gà trên đường bay đều dính một lần (rồi chưởng vẫn bay tiếp tới điểm nổ)
  private chuongXuyen(d: Dan): void {
    const vt = this.danHienTai(d);
    for (const g of this.ga) {
      if (g.chet || d.da?.includes(g.id)) continue;
      const tam = this.tamGa(g);
      if (hyp(tam.x - vt.x, tam.y - vt.y) >= CHUONG_XUYEN + BAN_KINH_GA * tlGa(g) * S_GA * 0.8) continue;
      (d.da ??= []).push(g.id);
      if (this.danAn(d, g)) continue;
      if (this.trungGa(g, d.p, d.sat, 2)) this.dungKhung(0.03);
    }
    for (const c of this.cell) {
      if (c.chet || d.da?.includes(c.id)) continue;
      const tam = this.tamCell(c);
      if (hyp(tam.x - vt.x, tam.y - vt.y) >= CHUONG_XUYEN + CELL_BK * cellK(c.cap) * 3) continue;
      (d.da ??= []).push(c.id);
      if (this.trungCell(c, d.p, d.sat)) this.dungKhung(0.03);
    }
    // Ginyu (đánh dấu trong `da` bằng id -1)
    if (!this.ginyu.chet && !d.da?.includes(-1) && this.gyGan(vt.x, vt.y, CHUONG_XUYEN + GY_BK)) {
      (d.da ??= []).push(-1);
      if (this.trungGy(d.p, d.sat)) this.dungKhung(0.03);
    }
    // Frieza (đánh dấu bằng id -2)
    if (!this.frieza.chet && !d.da?.includes(-2) && this.fzGan(vt.x, vt.y, CHUONG_XUYEN + FZ_BK)) {
      (d.da ??= []).push(-2);
      if (this.trungFz(d.p, d.sat)) this.dungKhung(0.03);
    }
    // Trên núi đá Mabu / Zinbu đánh được nhau (đánh dấu trong `da` bằng -10 - ô)
    if (!d.con && this.danTrungDongDoi(d, vt.x, vt.y, CHUONG_XUYEN + 70)) this.dungKhung(0.03);
  }

  // Đòn / chưởng bay tới đâu thì cây dọc đường bay đổ tới đó (quét đoạn từ lần cập nhật trước tới giờ)
  private danDoCay(d: Dan, t0: number): void {
    const k0 = Math.min(1, t0 / d.T), k1 = Math.min(1, d.t / d.T);
    const ax = d.x0 + (d.x1 - d.x0) * k0, ay = d.y0 + (d.y1 - d.y0) * k0;
    const bx = d.x0 + (d.x1 - d.x0) * k1, by = d.y0 + (d.y1 - d.y0) * k1;
    const ex = bx - ax, ey = by - ay, e2 = ex * ex + ey * ey;
    // Thân cây cao (vẽ phía trên gốc) nên đánh vào thân / tán cũng đổ: hộp quanh thân, rộng CAY_DO_KINH, từ CAY_DO_CAO phía trên gốc xuống dưới gốc một chút. Lấy mẫu dọc đường bay để không bỏ sót.
    const rg = CAY_DO_KINH * (d.to ? 1.4 : 1);
    const buoc = Math.max(1, Math.ceil(Math.sqrt(e2) / 30));
    if (d.to) this.danPhaThan(ax, ay, ex, ey, buoc);
    const xe = this.xeDuoiDat();
    for (const c of this.trangTri) {
      if (this.cayCheXe(c, xe)) continue;
      if (c.nui) {
        // Tảng đá núi: chỉ chưởng mới làm vỡ
        if (!d.to || c.doLuc !== undefined) continue;
        const h = hopDaNui(c.loai);
        if (Math.abs(c.x - (ax + bx) / 2) > h.r + Math.abs(ex) / 2 + 40) continue;
        for (let i = 0; i <= buoc; i++) {
          const px = ax + (ex * i) / buoc, py = ay + (ey * i) / buoc;
          if (Math.abs(px - c.x) > h.r || py < c.y - h.h || py > c.y + 40) continue;
          c.doLuc = this.t;
          this.vetGa({ id: this.id++, x: c.x, y: c.y - h.h * 0.35, t: 0, loai: 'chay', co: c.loai <= 2 ? 1.3 : 0.8 });
          this.vetGa({ id: this.id++, x: c.x, y: c.y, t: 0, loai: 'bui' });
          if (c.loai <= 2) this.rungMan(0.15, 7);
          break;
        }
        continue;
      }
      if (c.loai !== 0 || c.doLuc !== undefined) continue;
      const hs = c.to ? CAY_TO_HE_SO : 1;
      const r = rg * hs;
      for (let i = 0; i <= buoc; i++) {
        const px = ax + (ex * i) / buoc, py = ay + (ey * i) / buoc;
        if (Math.abs(px - c.x) > r || py < c.y - CAY_DO_CAO * hs || py > c.y + 40) continue;
        this.doCay(c, d.x1 - d.x0);
        break;
      }
    }
  }

  /** Thần điện: chưởng (Chiêu đặc biệt / socola) quét qua khung một cây / chòi / điện thờ thì vật đó biến mất, chỉ còn nền gạch
   *  (không mọc lại, chỉ ván mới mới đặt lại). Lấy mẫu dọc đoạn bay như cây đổ */
  private danPhaThan(ax: number, ay: number, ex: number, ey: number, buoc: number): void {
    if (!trongThan(ax, ay, 2000) && !trongThan(ax + ex, ay + ey, 2000)) return;
    for (let k = 0; k < THAN_VAT_TG.length; k++) {
      if (thanVo[k]) continue;
      const v = THAN_VAT_TG[k]!;
      for (let i = 0; i <= buoc; i++) {
        const px = ax + (ex * i) / buoc, py = ay + (ey * i) / buoc;
        if (px < v.x0 || px > v.x1 || py < v.y0 || py > v.y1) continue;
        thanVo[k] = true;
        const cx = (v.x0 + v.x1) / 2, cy = (v.y0 + v.y1) / 2;
        if (v.loai === 'dien') {
          // Điện thờ to: nhiều vụ nổ rải khắp thân, rung mạnh
          for (let n = 0; n < 6; n++) this.vetGa({ id: this.id++, x: ngauNhien(v.x0 + 200, v.x1 - 200), y: ngauNhien(v.y0 + 200, v.y1 - 200), t: 0, loai: 'chay', co: 2.2 });
          this.rungMan(0.4, 14);
        } else {
          this.vetGa({ id: this.id++, x: cx, y: cy, t: 0, loai: 'chay', co: v.loai === 'choi' ? 1.6 : 1.2 });
          this.rungMan(0.15, v.loai === 'choi' ? 9 : 6);
        }
        this.vetGa({ id: this.id++, x: cx, y: v.y1 - 60, t: 0, loai: 'bui' });
        break;
      }
    }
  }

  /** Cây `c` đổ (hướng theo dx của đòn / chưởng) và rơi đồ: cây đảo cát rơi đậu thần, cây to rơi táo chắc chắn, cây thường TAO_ROI cơ hội rơi táo */
  private doCay(c: TrangTri, dx: number): void {
    c.doLuc = this.t;
    c.huongDo = Math.abs(dx) > 20 ? Math.sign(dx) : c.lat ? -1 : 1;
    // Cây đổ có TAO_ROI cơ hội rơi 1 quả táo; rơi táo thì cây biến mất, chỉ còn quả táo ở gốc
    if (c.sa) {
      // Cây trên đảo cát: đổ thì chắc chắn rơi DAU_ROI hạt đậu thần (thay táo)
      c.mat = true;
      for (let k = 0; k < DAU_ROI; k++) this.themVatPham(c.x + ngauNhien(-50, 50), c.y + ngauNhien(0, 40), 'dau');
    } else if (c.to) {
      // Cây to: chắc chắn rơi 2 táo đỏ (máu) + 2 táo xanh (mana)
      c.mat = true;
      for (let k = 0; k < CAY_TO_MAU + CAY_TO_MANA; k++) this.themVatPham(c.x + ngauNhien(-70, 70), c.y + ngauNhien(0, 50), k < CAY_TO_MAU ? 'do' : 'xanh');
    } else if (Math.random() < TAO_ROI) {
      c.mat = true;
      this.themVatPham(c.x + ngauNhien(-30, 30), c.y + ngauNhien(0, 30));
    }
  }

  private chamDich(d: Dan): void {
    const { x1: x, y1: y, p } = d;
    if (d.soc) {
      this.noSocola(d);
      return;
    }
    if (d.to) {
      this.no(d);
      return;
    }
    const trungDon = this.ga.filter((v) => {
      if (v.chet) return false;
      const tam = this.tamGa(v);
      return hyp(tam.x - x, tam.y - y) < BAN_KINH_GA * tlGa(v) * S_GA * 1.25;
    });
    // Gà nhỏ đứng trước mặt gà tướng thì ưu tiên gà nhỏ
    const g = trungDon.find((v) => v.loai !== 'boss') ?? trungDon[0];
    if (!g) {
      const ce = this.cell.find((c) => !c.chet && hyp(this.tamCell(c).x - x, this.tamCell(c).y - y) < CELL_BK * cellK(c.cap) * 3.5);
      if (ce) {
        if (this.trungCell(ce, p, d.sat) && (d.nhom === 0 || d.nhom === 1)) {
          if (!d.con) this.hoiMana(this.nguoi[p], MANA_DAM);
          if (d.nhom === 1) this.dungKhung(0.04);
        }
        return;
      }
      if (!this.ginyu.chet && this.gyGan(x, y, GY_BK * 1.3)) {
        if (this.trungGy(p, d.sat) && (d.nhom === 0 || d.nhom === 1)) {
          if (!d.con) this.hoiMana(this.nguoi[p], MANA_DAM);
          if (d.nhom === 1) this.dungKhung(0.04);
        }
        return;
      }
      if (!this.frieza.chet && this.fzGan(x, y, FZ_BK * 1.3)) {
        if (this.trungFz(p, d.sat) && (d.nhom === 0 || d.nhom === 1)) {
          if (!d.con) this.hoiMana(this.nguoi[p], MANA_DAM);
          if (d.nhom === 1) this.dungKhung(0.04);
        }
        return;
      }
      // Trên núi đá: đòn trúng đồng đội (Mabu đánh được Zinbu và ngược lại)
      if (!d.con && this.danTrungDongDoi(d, x, y, 110)) {
        if (d.nhom === 1) this.dungKhung(0.04);
        return;
      }
    }
    if (g) {
      if (this.danAn(d, g)) return;
      if (this.trungGa(g, p, d.sat, d.nhom)) {
        // Đấm / Đá trúng thì hồi mana; Đá và đòn trúng gà mẹ làm game khựng một nhịp
        if (d.nhom === 0 || d.nhom === 1) if (!d.con) this.hoiMana(this.nguoi[p], MANA_DAM);
        if (d.nhom === 1 || g.loai === 'boss') this.dungKhung(0.04);
      }
      return;
    }
    this.vet.push({ id: this.id++, x, y, t: 0, loai: 'bui' });
    if (!d.phu && !d.con) {
      this.nguoi[p].combo = 0;
      this.nguoi[p].banTruot++;
    }
  }

  // Đòn ăn trúng gà con: gà hoá socola ngay (bất kể máu), bị kéo về nhân vật rồi bị ăn. Gà mẹ thì tính như đòn thường
  private danAn(d: Dan, g: Ga): boolean {
    if (!d.an || g.loai === 'boss' || g.chet) return false;
    const n = this.nguoi[d.p];
    if (!n || n.het || n.vang) return false;
    const tam = this.tamGa(g);
    const an = Math.max(1, Math.round(Math.max(0, g.hp) * (AN_TI_LE[n.ki] ?? 0.02)));
    // Bản sao đang bị kéo (đứng yên, nhuộm socola); con gốc biến mất ngay (đã chết, không còn hình)
    this.keoGa.push({ ...g, id: this.id++, socola: 1, hong: d.an === 'hong', keo: { p: d.p, an }, vx: 0, vy: 0, mo: 0, nhay: 0, choang: 0, day: undefined });
    g.hp = 0;
    g.chet = true;
    g.tChet = 1;
    this.chu.push({ id: this.id++, x: tam.x, y: tam.y - 60, text: d.an === 'hong' ? '🍬 SOCOLA HỒNG!' : '🍫 HOÁ SOCOLA!', mau: d.an === 'hong' ? '#ff7eb6' : '#c98a4b', t: 0 });
    this.dungKhung(0.03);
    return true;
  }

  // Kéo gà socola về nhân vật; chạm thân thì ăn: +AN_TI_LE máu của gà vào máu và mana, tính điểm / combo như hạ gà
  private capNhatKeo(dt: number): void {
    this.keoGa = this.keoGa.filter((g) => {
      const k = g.keo!;
      const n = this.nguoi[k.p];
      if (!n || n.het) return false;
      const ty = n.y - 10;
      const dx = n.x - g.x;
      const dy = ty - g.y;
      const d = hyp(dx, dy);
      const buoc = KEO_TOC * dt;
      g.h = Math.max(0, g.h - 600 * dt);
      if (d > buoc + 50) {
        g.x += (dx / d) * buoc;
        g.y += (dy / d) * buoc;
        g.lat = dx < 0;
        return true;
      }
      this.hoiMau(n, k.an);
      this.hoiMana(n, k.an);
      n.bayKhoa = 0;
      n.combo++;
      n.banTrung++;
      this.am.phat('anTao');
      const hs = this.heSo(k.p);
      const diem = DIEM[g.loai] * (g.suc ?? 1) * hs;
      this.congDiem(k.p, diem, n.x, n.y - 200, `+${diem}${hs > 1 ? ` x${hs}` : ''}`);
      this.chu.push({ id: this.id++, x: n.x, y: n.y - 260, text: `${g.hong ? '🍬' : '🍫'} +${k.an} ❤ +${k.an} mana`, mau: g.hong ? '#ff7eb6' : '#c98a4b', t: 0 });
      return false;
    });
  }

  // Chiêu đặc biệt: nổ trúng mọi con gà trong bán kính
  private no(d: Dan): void {
    // Bóng ma của Super Bư nổ rộng hơn chưởng thường
    const bk = d.ma ? BAN_KINH_MA : BAN_KINH_NO;
    const trung = this.ga.filter((g) => {
      if (g.chet || d.da?.includes(g.id)) return false;
      const tam = this.tamGa(g);
      return hyp(tam.x - d.x1, tam.y - d.y1) < bk;
    });
    trung.forEach((g) => { if (!this.danAn(d, g)) this.trungGa(g, d.p, d.sat, 2); });
    const ceTrung = this.cell.filter((c) => !c.chet && !d.da?.includes(c.id) && hyp(this.tamCell(c).x - d.x1, this.tamCell(c).y - d.y1) < bk + CELL_BK * cellK(c.cap) * 2);
    ceTrung.forEach((c) => this.trungCell(c, d.p, d.sat));
    const gyTrung = !this.ginyu.chet && !d.da?.includes(-1) && this.gyGan(d.x1, d.y1, bk + GY_BK);
    if (gyTrung) this.trungGy(d.p, d.sat);
    const fzTrung = !this.frieza.chet && !d.da?.includes(-2) && this.fzGan(d.x1, d.y1, bk + FZ_BK);
    if (fzTrung) this.trungFz(d.p, d.sat);
    const dongDoi = !d.con && this.danTrungDongDoi(d, d.x1, d.y1, bk + 60);
    if (d.vg) this.vet.push({ id: this.id++, x: d.x1, y: d.y1, t: 0, loai: 'chay', co: 1, vg: true });
    else if (d.ma || d.sb) {
      // Super Bư: vụ nổ to hơn (bóng ma nổ to nhất)
      this.vet.push({ id: this.id++, x: d.x1, y: d.y1, t: 0, loai: 'no', co: d.ma ? 2 : 1.4 });
      this.vet.push({ id: this.id++, x: d.x1, y: d.y1, t: 0, loai: 'chay', co: d.ma ? 2.2 : 1.4 });
    } else {
      this.vet.push({ id: this.id++, x: d.x1, y: d.y1, t: 0, loai: 'no' });
      this.vet.push({ id: this.id++, x: d.x1, y: d.y1, t: 0, loai: 'chay', co: 0.9 });
    }
    this.rungMan(0.15, 9);
    this.dungKhung(0.05);
    if (!d.con && !trung.length && !ceTrung.length && !gyTrung && !fzTrung && !dongDoi && !d.da?.length) {
      this.nguoi[d.p].combo = 0;
      this.nguoi[d.p].banTruot++;
    }
  }

  // Chiêu Biến socola: gà con trong vùng nổ chết luôn và thành socola; gà mẹ dính sát thương rồi hoá socola
  private noSocola(d: Dan): void {
    const trung = this.ga.filter((g) => {
      if (g.chet) return false;
      const tam = this.tamGa(g);
      return hyp(tam.x - d.x1, tam.y - d.y1) < BAN_KINH_SOCOLA + (g.loai === 'boss' ? 150 : 0);
    });
    this.vet.push({ id: this.id++, x: d.x1, y: d.y1, t: 0, loai: 'chay', co: 1.3 });
    this.rung = Math.max(this.rung, 0.15);
    // Gà con trước, gà mẹ sau (gà mẹ có thể chết và đẻ thêm hiệu ứng)
    for (const g of trung.filter((v) => v.loai !== 'boss')) this.bienSocolaGa(g, d.p);
    for (const g of trung.filter((v) => v.loai === 'boss')) this.socolaTuong(g, d.p, d.sat);
    // Cell nhận sát thương; riêng Cell bạo nộ trúng thì hoá socola (chờ mây của Mabu để combo)
    const ceTrung = this.cell.filter((c) => !c.chet && hyp(this.tamCell(c).x - d.x1, this.tamCell(c).y - d.y1) < BAN_KINH_SOCOLA + CELL_BK * cellK(c.cap));
    ceTrung.forEach((c) => { if (this.trungCell(c, d.p, SAT_SOCOLA, false, true)) this.socolaCell(c); });
    // Ginyu: đủ giết thì thành thanh socola, không thì hoá socola GY_SOCOLA_T giây (đứng yên)
    const gyTrung = !this.ginyu.chet && this.gyGan(d.x1, d.y1, BAN_KINH_SOCOLA + GY_BK * 0.5);
    if (gyTrung) this.trungGy(d.p, SAT_SOCOLA, false, true);
    const fzTrung = !this.frieza.chet && this.fzGan(d.x1, d.y1, BAN_KINH_SOCOLA + FZ_BK * 0.5);
    if (fzTrung) this.trungFz(d.p, SAT_SOCOLA);
    const dongDoi = this.danTrungDongDoi(d, d.x1, d.y1, BAN_KINH_SOCOLA, SAT_SOCOLA);
    if (!trung.length && !ceTrung.length && !gyTrung && !fzTrung && !dongDoi) {
      this.nguoi[d.p].combo = 0;
      this.nguoi[d.p].banTruot++;
    }
  }

  // Gà con dính Biến socola: đòn đủ giết thì thành thanh socola (ăn được, không còn hình gà, tính điểm / combo như hạ gà);
  // không đủ giết thì chỉ mất máu rồi hoá socola SOCOLA_THOI_GIAN giây (giữ hình gà, không ăn được), hết giờ tự hoá giải
  private bienSocolaGa(g: Ga, p: number): void {
    const trung = this.trungGa(g, p, SAT_SOCOLA, undefined, true);
    if (!trung || g.chet || (g.socola ?? 0) > 0) return;
    g.socola = SOCOLA_THOI_GIAN;
    g.vx = g.vy = 0;
    this.chu.push({ id: this.id++, x: g.x, y: this.tamGa(g).y - 60, text: '🍫 HOÁ SOCOLA!', mau: '#c98a4b', t: 0 });
  }

  // Gà mẹ dính chiêu socola: nhận sát thương như đòn thường (có thể né / phản / miss theo màu); chỉ khi đòn trúng và gà mẹ còn sống mới hoá socola
  private socolaTuong(g: Ga, p: number, sat: number): void {
    const truoc = g.hp;
    this.trungGa(g, p, sat);
    // Đòn đủ giết gà mẹ: gà mẹ chết (rơi ngọc / thưởng như thường) nhưng xác hoá thành thanh socola ăn được, không giữ hình gà
    if (g.chet && truoc > 0) {
      const v = { x: g.x, y: g.y };
      giuTrongMap(v, LE_VP);
      const luong = Math.max(1, Math.round(truoc * SOCOLA_AN_TI_LE));
      this.vatPham.push({ id: this.id++, x: v.x, y: v.y, t: 0, loai: 'socola', luong, hpGa: hpToiDa(g) });
      g.tChet = 2;
      return;
    }
    if (g.chet || g.hp >= truoc || (g.socola ?? 0) > 0) return;
    g.socola = SOCOLA_THOI_GIAN;
    g.comboSoc = false;
    g.the = 0;
    g.chieu = null;
    g.mau = null;
    g.conMau = 0;
    g.vx = g.vy = 0;
    const t = this.tamGa(g);
    this.chu.push({ id: this.id++, x: t.x, y: t.y - 150, text: '🍫 HOÁ SOCOLA!', mau: '#c98a4b', t: 0 });
  }

  // Tự bắn chưởng lên trời (tự động): mỗi tia bay lên cao rồi nổ cháy trên trời
  private chuongLenTroi(p: number): void {
    const n = this.nguoi[p];
    if (!n || n.vang || this.khuat(n)) return;
    const tay = this.viTriTay(p);
    for (const dx of [-170, 0, 170]) {
      this.dan.push({
        id: this.id++, p, x0: tay.x, y0: tay.y, x1: tay.x + dx, y1: tay.y - TROI_CAO + Math.abs(dx) * 0.25, t: 0, T: TROI_THOI_GIAN + Math.abs(dx) * 0.0005,
        phu: true, to: true, sat: 0, troi: true,
      });
    }
  }

  private noTroi(d: Dan): void {
    this.vet.push({ id: this.id++, x: d.x1, y: d.y1, t: 0, loai: 'chay', co: 1.5 });
    this.rung = Math.max(this.rung, 0.1);
  }

  private capNhatHieuUng(dt: number): void {
    for (const c of this.chu) {
      c.t += dt;
      c.y -= 55 * dt;
    }
    this.chu = this.chu.filter((c) => c.t < 1);

    for (const l of this.long) {
      l.t += dt;
      l.vy += 160 * dt;
      l.vx *= 0.97;
      l.x += l.vx * dt;
      l.y += l.vy * dt;
      l.xoay += l.vxoay * dt;
    }
    this.long = this.long.filter((l) => l.t < 1.3);

    for (const v of this.vet) v.t += dt;
    this.vet = this.vet.filter((v) => v.t < (v.loai === 'chay' ? 0.7 : 0.45));
  }

  // Góc rung của quả trứng sắp nở
  /** Đảo gần nhân vật còn sống nhất (trung điểm); avatar trên thanh đen là Cell của đảo này khi `trenDao` */
  get daoHienTai(): number {
    const song = this.nguoi.filter((n) => !n.vang && !n.het);
    if (!song.length) return 0;
    return daoCua(song.reduce((t, n) => t + n.x, 0) / song.length, song.reduce((t, n) => t + n.y, 0) / song.length);
  }

  /** Số Cell còn sống trên đảo hiện tại (`daoHienTai`) */
  get soCellDao(): number {
    const d = this.daoHienTai;
    return this.cell.filter((c) => !c.chet && this.daoCell(c) === d).length;
  }

  /** Nhân vật còn sống nào cũng đang ngoài vườn gà (ở đảo / trên biển): hiệu ứng của vườn gà tắt, avatar trên thanh đen là Cell đỏ */
  get trenDao(): boolean {
    return this.moiNguoiSong((n) => !trongVuon(n.x, n.y));
  }

  /** Có ít nhất một nhân vật đang chơi còn sống và mọi người như vậy đều thoả `dk` (không tạo mảng, gọi mỗi khung) */
  private moiNguoiSong(dk: (n: NguoiChoi) => boolean): boolean {
    if (banDoHt !== 'sa') return false;
    let co = false;
    for (const n of this.nguoi) {
      if (n.vang || n.het) continue;
      if (!dk(n)) return false;
      co = true;
    }
    return co;
  }

  /** Nhân vật còn sống nào cũng đang trên núi đá (không Cell, không tiệc): avatar trên thanh đen để trống, nhạc nền thường */
  get trenNui(): boolean {
    return this.moiNguoiSong((n) => trongNui(n.x, n.y, 300));
  }

  /** Nhân vật còn sống nào cũng đang trên thần điện: avatar / tên trên thanh đen là quái của thần điện, nhạc nền thường */
  get trenThan(): boolean {
    return this.moiNguoiSong((n) => trongThan(n.x, n.y));
  }

  rungTrung(e: TrungGa): number {
    // Trứng đỏ rung mạnh dần theo thời gian
    if (e.db) return Math.sin(e.t * 30) * (2 + e.t * 1.2);
    return e.t > 1 ? Math.sin(e.t * 40) * 12 : 0;
  }

  // Các mũi tên ">" chỉ từ nhân vật gần gà mẹ gốc hơn về phía nó (hiện từng đợt); chỉ lấy mũi tên nằm trong khung nhìn.
  private huongToiTuong(trong: (x: number, y: number, le: number) => boolean) {
    const kq: { x: number; y: number; goc: number; a: number; mau: string }[] = [];
    const song = this.nguoi.filter((n, p) => !n.het && !this.trongCau(p) && !this.biNhap(p));
    if (this.man !== 'play' || !song.length) return kq;
    // Mọi nhân vật đã rời vườn gà (đang ở đảo): không còn mũi tên của vườn gà
    if (this.trenDao) return kq;
    const dich = this.ga.find((g) => g.goc && !g.chet);
    if (!dich) return kq;
    const pha = this.tGame % HUONG_CHU_KY;
    if (pha > HUONG_HIEN) return kq;
    const a = Math.sin((Math.PI * pha) / HUONG_HIEN) * 0.5;
    // Chỉ nhân vật còn sống và gần đích hơn mới có mũi tên
    const n = [...song].sort((p, q) => hyp(p.x - dich.x, p.y - dich.y) - hyp(q.x - dich.x, q.y - dich.y))[0];
    const dx = dich.x - n.x;
    const dy = dich.y - n.y;
    const d = hyp(dx, dy);
    const ux = d ? dx / d : 0;
    const uy = d ? dy / d : 0;
    if (d >= HUONG_GAN) {
      const cuoi = Math.min(d - HUONG_GAN * 0.4, HUONG_TOI_DA);
      for (let k0 = HUONG_BAT_DAU; k0 <= cuoi; k0 += HUONG_CACH) {
        for (let i = 0; i < HUONG_CUM; i++) {
          const k = k0 + i * HUONG_LIEN;
          const x = n.x + ux * k;
          const y = n.y + uy * k;
          if (trong(x, y, 60)) kq.push({ x, y, goc: (Math.atan2(uy, ux) * 180) / Math.PI, a, mau: n.mau });
        }
      }
    }
    return kq;
  }

  // Camera chung: bám trung điểm 2 nhân vật, zoom ra khi họ xa nhau; rồi lọc vật trong khung nhìn
  private capNhatView(dt: number, ngay = false): void {
    const [a0, b0] = this.nguoi;
    // Chơi 1 người: camera chỉ bám nhân vật có mặt (coi như hai điểm trùng nhau)
    const a = a0.vang ? b0 : a0;
    const b = b0.vang ? a0 : b0;
    // Mê cung bom: mọi người đã vào lưới thì camera đứng giữa mê cung, lùi cao lên thấy toàn bộ (không sương mù)
    const toanMc = this.camMcToan();
    const zMc = Math.min(this.W / (MC.w + 2 * MC_CAM_LE), H / (MC.h + 2 * MC_CAM_LE + 120));
    const tx = toanMc ? (MC.x0 + MC.x1) / 2 : (a.x + b.x) / 2;
    // Máy bay bay cao: camera lùi ra (thấy xa hơn, vật dưới đất nhỏ đi) và nâng lên theo độ cao
    const zb = Math.max(this.mayBay.pha === 'bay' || this.mayBay.pha === 'trung' || this.mayBay.pha === 'cat' ? this.mayBay.z : 0, this.phiThuyen.ngoi.length ? this.phiThuyen.z : 0);
    // Tâm khung nhìn nằm trên TAM_VIEW_Y (không phải giữa màn hình): dời camera để tâm mê cung nằm đúng giữa màn hình (bù 60 cho tường trên)
    const ty = toanMc ? (MC.y0 + MC.y1) / 2 - 60 + (TAM_VIEW_Y - H / 2) / zMc : (a.y + b.y) / 2 - MB_NANG * zb * 0.5;
    const dx = Math.abs(a.x - b.x);
    const dy = Math.abs(a.y - b.y);
    // Hai người xa nhau thì thu nhỏ (cả vườn gà lẫn đảo), máy bay lùi ra; ô nền đảo dựng theo zoom gốc nên đổi zoom không phải dựng lại
    const tz = toanMc ? zMc : kep(Math.min(ZOOM, dx > 1 ? VUNG_X / dx : ZOOM, dy > 1 ? VUNG_Y / dy : ZOOM), ZOOM_MIN, ZOOM) * (1 - (1 - MB_ZOOM) * zb) * (this.camMc() ? MC_ZOOM_HE : 1);
    const kv = ngay ? 1 : 1 - Math.exp(-dt * 6);
    const kz = ngay ? 1 : 1 - Math.exp(-dt * 3);
    this.camZ += (tz - this.camZ) * kz;
    const zc = this.camZ;
    // Đi bộ trong vườn gà (không ai ngồi máy bay): camera bị giữ trong vườn, tường luôn là mép màn hình, không bao giờ thấy vực.
    // Chỉ khi có người ngồi máy bay camera mới ra được ngoài vườn (thấy vực, đảo). Vừa xuống máy bay thì camera trượt dần về
    // trong vườn (đích kẹp trong vườn), vào hẳn rồi mới kẹp cứng (camVuon).
    const dung = this.nguoi.filter((n) => !n.vang);
    const giuVuon = banDoHt === 'sa' && !this.nguoi.some((_, i) => this.trongMb(i)) && dung.length > 0 && dung.every((n) => trongVuon(n.x, n.y));
    const vx0 = this.W / 2 / zc, vx1 = MAP - this.W / 2 / zc, vy0 = TAM_VIEW_Y / zc, vy1 = MAP - (H - TAM_VIEW_Y) / zc;
    if (!giuVuon) this.camVuon = false;
    else if (!this.camVuon && this.camX >= vx0 - 1 && this.camX <= vx1 + 1 && this.camY >= vy0 - 1 && this.camY <= vy1 + 1) this.camVuon = true;
    const dx2 = giuVuon ? kep(tx, vx0, vx1) : tx, dy2 = giuVuon ? kep(ty, vy0, vy1) : ty;
    this.camX += (dx2 - this.camX) * kv;
    this.camY += (dy2 - this.camY) * kv;
    // Camera không ra khỏi bản đồ: chạm mép map thì mép đó nằm đúng mép màn hình, không lộ vùng đen
    const bien = banDoHt !== 'sa' || (giuVuon && (this.camVuon || ngay)) ? { x0: 0, y0: 0, x1: MAP, y1: MAP } : TG;
    if (!toanMc) {
      this.camX = kep(this.camX, bien.x0 + this.W / 2 / zc, bien.x1 - this.W / 2 / zc);
      this.camY = kep(this.camY, bien.y0 + TAM_VIEW_Y / zc, bien.y1 - (H - TAM_VIEW_Y) / zc);
    }

    const z = this.camZ;
    // Không lên máy bay thì không nhìn ra ngoài: chỉ thấy khối đất (vườn gà / vòng đảo) có nhân vật đang đứng; ai trên máy bay thì thấy hết
    const ngoai = banDoHt !== 'sa' || this.nguoi.some((_, i) => this.trongMb(i));
    this.thayVuon = ngoai || !dung.length || dung.some((n) => trongVuon(n.x, n.y));
    this.vuonRo = banDoHt !== 'sa' || dung.some((n) => trongVuon(n.x, n.y));
    this.thayDao = ngoai || !dung.length || dung.some((n) => !trongVuon(n.x, n.y) && !trongThan(n.x, n.y));
    this.thayThan = ngoai || !dung.length || dung.some((n) => trongThan(n.x, n.y));
    // Bản đồ nhỏ góc trên phải khi có người ngồi máy bay: vị trí + hướng bay (theo quãng vừa đi)
    const mbv = this.mayBay;
    const ddx = mbv.x - this.mbCu.x, ddy = mbv.y - this.mbCu.y;
    if (hyp(ddx, ddy) > 2) this.mbHuong = Math.atan2(ddy, ddx);
    this.mbCu = { x: mbv.x, y: mbv.y };
    const ptv = this.phiThuyen;
    if (ptv.pha === 'bay') this.ptHuong = Math.atan2(ptv[ptv.noi === 'vuon' ? 'nui' : 'vuon'].y - ptv.y, ptv[ptv.noi === 'vuon' ? 'nui' : 'vuon'].x - ptv.x);
    this.banDoNho = banDoHt !== 'sa' ? null
      : ptv.ngoi.length ? { x: ptv.x, y: ptv.y, huong: this.ptHuong }
      : this.nguoi.some((_, i) => this.trongMb(i)) ? { x: mbv.x, y: mbv.y, huong: this.mbHuong } : null;
    // Kiểm tra khung nhìn (so sánh số, rẻ nhất) trước; vật nằm ngoài màn hình bị loại ngay, không tính tiếp sương mù (thay / doRo lặp theo mọi nguồn nhìn)
    const nuaW = this.W / 2 / z, tren = -TAM_VIEW_Y / z, duoi = (H - TAM_VIEW_Y) / z;
    this.khungNhin = { x0: this.camX - nuaW, x1: this.camX + nuaW, y0: this.camY + tren, y1: this.camY + duoi };
    const trong = (x: number, y: number, le: number) =>
      Math.abs(x - this.camX) < nuaW + le && y - this.camY > tren - le && y - this.camY < duoi + le &&
      this.thayKhoi(x, y);
    // Ngọc 4 sao dưới bà phù thuỷ: bà tự vẽ viên ngọc mình ngồi (to hơn) khi còn sống
    this.vatPhamView = this.vatPham.filter((v) => trong(v.x, v.y, 100) && this.doRo(v.x, v.y) > 0 && !(v.loai === 'ngoc' && v.sao === MC_NGOC_SAO && this.baSong));
    // Mê cung bom: bom / lửa / nước của người chơi luôn hiện (chỉ lọc khung nhìn); vật phẩm, đồ cứu người, quái bị sương mù
    const mc = this.mc;
    const trongO = (i: number, j: number, le: number) => { const t = tamO(i, j); return trong(t.x, t.y, le); };
    this.mcBomView = mc.bom.filter((b) => trongO(b.i, b.j, 500));
    this.mcLuaView = mc.lua.filter((f) => trongO(f.i, f.j, 300));
    this.mcVpView = mc.vp.filter((v) => trongO(v.i, v.j, 200) && this.doRo(tamO(v.i, v.j).x, tamO(v.i, v.j).y) > 0);
    this.mcDoView = mc.doCuu.filter((d) => trongO(d.i, d.j, 200) && this.doRo(tamO(d.i, d.j).x, tamO(d.i, d.j).y) > 0);
    this.trungView = this.trungDe.filter((e) => trong(e.x, e.y, e.db ? 300 : 100) && this.thay(e.x, e.y));
    this.huongView = this.huongToiTuong(trong);
    this.nhinNguon = [
      ...this.nguoi.filter((n) => !n.het).map((n) => ({ x: n.x, y: n.y })),
      ...this.dan.filter((d) => !d.troi).map((d) => { const vt = this.danHienTai(d); return { x: vt.x, y: vt.y }; }),
    ];
    const xep: VatXep[] = [];
    for (const g of this.ga) {
      if (g.loai === 'flyer' || !trong(g.x, g.y, g.loai === 'boss' ? 450 : 80) || !this.thay(g.x, g.y)) continue;
      xep.push({ loai: 'ga', y: g.y, ga: g });
    }
    for (const g of this.keoGa) if (trong(g.x, g.y, 120)) xep.push({ loai: 'ga', y: g.y, ga: g });
    // Cell, bánh sinh nhật, chưởng tiệc: bị sương mù (chỉ vẽ trong tầm nhìn, mờ dần ở dải MO_RO cuối, doRo()) và lọc theo khung nhìn. Lề theo kích thước sprite thật.
    this.cellView = this.cell.filter((c) => trong(c.x, c.y - 32 * cellK(c.cap), (c.cap === SO_CAP - 1 ? 58 : 40) * cellK(c.cap) + 60) && this.doRo(c.x, c.y) > 0);
    for (const c of this.cellView) xep.push({ loai: 'cell', y: c.y, ce: c });
    for (const q of mc.quai) if (trong(q.x, q.y - 150, 400) && this.doRo(q.x, q.y) > 0) xep.push({ loai: 'quai', y: q.y, q });
    this.mcTiaView = mc.tia.filter((t) => trong((t.x0 + t.x1) / 2, (t.y0 + t.y1) / 2, 300 + Math.abs(t.x1 - t.x0) / 2 + Math.abs(t.y1 - t.y0) / 2));
    // Bà phù thuỷ (cao ~600 trên viên ngọc): khung nhìn trước, sương mù sau (ngọc phát sáng nên thấy xa hơn, baThay()); bị hạ thì mờ dần BA_CHET_T giây
    if (banDoHt === 'sa' && (!mc.ba.chet || mc.ba.tChet < BA_CHET_T)) {
      const v = this.viTriBa();
      if (trong(v.x, v.y - 300, 500) && this.baThay()) xep.push({ loai: 'ba', y: v.y + 120 });
    }
    // Bóng ma Goku: lọc khung nhìn trước, sương mù sau (như Cell); đang lao thì lề rộng thêm cho vệt bóng mờ phía sau
    const gy = this.ginyu;
    this.gyView = (!gy.chet || gy.tChet < GY_CHET_T) && trong(gy.x, gy.y - GY_TAM_CAO, gy.lao !== undefined ? 520 : 260) && this.doRo(gy.x, gy.y) > 0;
    if (this.gyView) xep.push({ loai: 'gy', y: gy.y });
    // Con của Super Bư: như nhân vật (không bị sương mù làm mờ), chỉ lọc khung nhìn
    this.conBuView = this.conBu.filter((cb) => trong(cb.x, cb.y - 160, 220));
    for (const cb of this.conBuView) xep.push({ loai: 'conbu', y: cb.y, cb });
    // Frieza: khung nhìn trước, sương mù sau
    const fz = this.frieza;
    this.fzView = (!fz.chet || fz.tChet < FZ_CHET_T) && (fz.bien >= 0 || fz.vang > 0 ? trong(fz.x, fz.y - 230, 330) : trong(fz.x, fz.y - 120, 220)) && (this.doRo(fz.x, fz.y) > 0 || this.fzVangThay());
    if (this.fzView) xep.push({ loai: 'fz', y: fz.y });
    this.banhView = this.tiec.filter((tc) => !tc.vo && trong(tc.x, tc.y - 250 * tc.to, 400 * tc.to) && this.doRo(tc.x, tc.y) > 0);
    for (const tc of this.banhView) xep.push({ loai: 'banh', y: tc.y, tc });
    // Cổng luôn hiện (không bị sương mù), chỉ lọc theo khung nhìn / khối đất
    this.congView = trong(this.cong.x, this.cong.y - 150 * CONG_TO, 260 * CONG_TO);
    if (this.congView) xep.push({ loai: 'cong', y: this.cong.y });
    this.congThanView = !this.trieuHoi && trong(THAN_CONG.x, THAN_CONG.y - 150 * CONG_TO, 260 * CONG_TO);
    if (this.congThanView) xep.push({ loai: 'cong', y: THAN_CONG.y, than: true });
    const raMc = tamO(O_RA_MC.i, O_RA_MC.j);
    if (banDoHt === 'sa' && trong(raMc.x, raMc.y, 300)) xep.push({ loai: 'cong', y: raMc.y + MC_O * 0.3, mc: true });
    this.chuongTiecView = this.chuongTiec.filter((q) => {
      const dai = hyp(q.x1 - q.x0, q.y1 - q.y0);
      // Chưởng hiện theo con Cell bắn ra nó (đầu x0, y0)
      return trong((q.x0 + q.x1) / 2, (q.y0 + q.y1) / 2, dai / 2 + 60 * q.k) && this.doRo(q.x0, q.y0) > 0;
    });
    // Người đang được mây / socola phủ lên thì thân được thay bằng mây / socola (cuuView)
    this.cuuView = this.cuu.filter((c) => trong(c.x, c.y, 500));
    for (const c of this.cuuView) xep.push({ loai: 'cuu', y: c.y, cu: c });
    this.cauView = this.cauTron.filter((q) => (q.pha !== 'moc' || q.t > CAU_MOC - 1) && trong(q.x, q.y, 400) && this.doRo(q.x, q.y) > 0);
    for (const q of this.cauView) xep.push({ loai: 'cau', y: q.y, cau: q });
    // Máy bay: đang bay thì luôn nằm trên mọi vật
    const mb = this.mbHinh();
    this.mbView = mb && trong(mb.x, mb.y - mb.nang, 700) ? mb : null;
    if (this.mbView) xep.push({ loai: 'mb', y: this.mayBay.y + this.mayBay.z * 20000 });
    const pth = this.ptHinh();
    this.ptView = pth && trong(pth.x, pth.y - pth.nang, 700) ? pth : null;
    if (this.ptView) xep.push({ loai: 'pt', y: this.phiThuyen.y + this.phiThuyen.z * 20000 });
    const dem = this.mbDem();
    this.mbDemView = dem && trong(dem.x, dem.y, 300) ? dem : null;
    const ptDem = this.phiThuyen.pha === 'no' ? { x: this.phiThuyen.x, y: this.phiThuyen.y, con: Math.max(1, Math.ceil(MB_HOI - this.phiThuyen.t)) } : null;
    this.ptDemView = ptDem && trong(ptDem.x, ptDem.y, 400) ? ptDem : null;
    this.nguoi.forEach((n, i) => { if (!n.vang && !this.dangCuu(i) && !this.trongCau(i) && !this.trongMb(i) && !this.biNhap(i) && trong(n.x, n.y, n.nv.laMay ? 600 : 200)) xep.push({ loai: 'nv', y: n.y, p: i }); });
    const xe = this.xeDuoiDat();
    for (const t of this.trangTri) if (!t.mat && trong(t.x, t.y, t.to ? 700 : 400) && !this.cayCheXe(t, xe) && this.doRo(t.x, t.y) > 0) xep.push({ loai: 'td', y: t.y, td: t });
    xep.sort((a, b) => a.y - b.y);
    this.xep = xep;
    this.gaBayView = this.ga.filter((g) => g.loai === 'flyer' && trong(g.x, g.y, 400) && this.thay(g.x, g.y));
    this.vetView = this.vet.filter((v) => trong(v.x, v.y, 200));
    this.danView = this.dan.filter((d) => {
      const vt = this.danHienTai(d);
      return trong(vt.x, vt.y, 200);
    });
    this.longView = this.long.filter((l) => trong(l.x, l.y, 100));
    // Mê cung bom: không có chữ bay trên đầu nhân vật / quái (nhân vật, quái nhỏ so với cả mê cung nên chữ không đọc được)
    this.chuView = this.chu.filter((c) => trong(c.x, c.y, 300) && !this.vungMc(c));
    // Chỉ nhân vật và gà mẹ (gốc + phụ) có thanh máu trên đầu; chỉ lấy khi nằm trong khung nhìn
    const cacTuong = this.ga.filter((g) => g.loai === 'boss' && !g.chet);
    this.tuongSong = cacTuong.find((g) => g.goc) ?? null;
    const song = this.nguoi.filter((n) => !n.het);
    // Tướng gà gần nhân vật nhất: một lượt tìm min, không sort (sort gọi hàm khoảng cách nhiều lần mỗi khung)
    let tuongGan: Ga | null = null;
    let dGan = Infinity;
    for (const g of cacTuong) {
      if (!laMePhu(g)) continue;
      for (const n of song) {
        const d = hyp(n.x - g.x, n.y - g.y);
        if (d < dGan || !tuongGan) { dGan = d; tuongGan = g; }
      }
      if (!song.length && !tuongGan) tuongGan = g;
    }
    this.tuongBang = tuongGan ?? this.tuongSong;
    this.vachView = [];
    for (const t of cacTuong) {
      if (t.chieu?.pha !== 'bao' || !this.thay(t.x, t.y)) continue;
      const c = t.chieu;
      const x2 = t.x + c.ux * c.quang;
      const y2 = t.y + c.uy * c.quang;
      if ([0, 0.25, 0.5, 0.75, 1].some((k) => trong(t.x + (x2 - t.x) * k, t.y + (y2 - t.y) * k, 450))) {
        this.vachView.push({ x1: t.x, y1: t.y, x2, y2, a: 0.25 + 0.2 * Math.abs(Math.sin(c.t * 10)) });
      }
    }
    // Gà đen báo hiệu nhào xuống: vệt đỏ mảnh hơn của gà mẹ
    for (const g of this.ga) {
      if (g.chet || g.nhao?.pha !== 'bao' || !this.thay(g.x, g.y)) continue;
      const nh = g.nhao;
      const x2 = g.x + nh.ux * nh.quang;
      const y2 = g.y + nh.uy * nh.quang;
      if ([0, 0.5, 1].some((k) => trong(g.x + (x2 - g.x) * k, g.y + (y2 - g.y) * k, 200))) {
        this.vachView.push({ x1: g.x, y1: g.y, x2, y2, a: 0.25 + 0.2 * Math.abs(Math.sin(nh.t * 12)), w: 40 });
      }
    }
    this.tuongView = cacTuong.filter((t) => trong(t.x, t.y, 450) && this.thay(t.x, t.y));
  }

  /** Sương mù trên đảo: độ rõ 0..1 của một điểm, rõ hẳn trong TAM_NHIN − MO_RO, mờ dần tới TAM_NHIN (Cell, bánh, trang trí đảo hiện dần khi đi tới) */
  doRo(x: number, y: number): number {
    // Trong vườn gà mà có người đang ở trong vườn (đi bộ hay bay ngang) thì vật của vườn luôn rõ; ra khỏi vườn thì vườn cũng bị sương mù, chỉ còn nền cỏ + tường
    if (this.vuonRo && trongVuon(x, y)) return 1;
    // Mê cung bom không có sương mù
    if (banDoHt === 'sa' && trongMeCung(x, y, 300)) return 1;
    // Nguồn nhìn gần nhất quyết định độ rõ: tìm bình phương khoảng cách nhỏ nhất (không sqrt), chỉ một sqrt ở cuối
    let d2 = Infinity;
    for (const o of this.nhinNguon) {
      const dx = o.x - x, dy = o.y - y;
      const k = dx * dx + dy * dy;
      if (k < d2) d2 = k;
    }
    if (d2 >= TAM_NHIN * TAM_NHIN) return 0;
    return Math.min(1, (TAM_NHIN - Math.sqrt(d2)) / MO_RO);
  }

  // Điểm có nằm trong tầm nhìn của nhân vật hoặc chưởng nào không
  /** Gà ngủ đông nhẹ: không có trên màn hình (ngoài khung nhìn + GA_THUA_LE), xa mọi nhân vật hơn GA_THUA_XA và không đang làm gì gấp (chết, lao / bay, gà đen đang báo hiệu / nhào, trốn chạy, choáng, socola) */
  private gaThua(g: Ga): boolean {
    if (g.chet || g.chieu || (g.nhao && g.nhao.pha !== 'vong') || g.tron || (g.choang ?? 0) > 0 || (g.socola ?? 0) > 0) return false;
    if (this.trenCam(g.x, g.y, GA_THUA_LE)) return false;
    for (const n of this.nguoi) if (!n.vang && Math.abs(n.x - g.x) < GA_THUA_XA && Math.abs(n.y - g.y) < GA_THUA_XA && hyp(n.x - g.x, n.y - g.y) < GA_THUA_XA) return false;
    return true;
  }

  /** Điểm (x, y) có nằm trên camera (khung nhìn của lần capNhatView() gần nhất, cộng lề) không */
  private trenCam(x: number, y: number, le = 300): boolean {
    const k = this.khungNhin;
    return x > k.x0 - le && x < k.x1 + le && y > k.y0 - le && y < k.y1 + le;
  }

  /** Khối đất chứa (x, y) (vườn gà / vòng đảo + núi đá nối liền) đang thấy: không lên máy bay thì chỉ thấy khối mình đứng */
  thayKhoi(x: number, y: number): boolean {
    return trongVuon(x, y) ? this.thayVuon : trongThan(x, y) ? this.thayThan : this.thayDao;
  }

  /**
   * Điểm (x, y) được nhân vật nhìn thấy: trên camera (so sánh số, rẻ, kiểm tra trước), khối đất đó đang thấy (thayVuon / thayDao)
   * và nằm trong tầm nhìn TAM_NHIN (+ lề) của một nhân vật đang chơi chưa gục (sương mù; chưởng bay không tính)
   */
  private nvThay(x: number, y: number, leCam: number, le = 0): boolean {
    if (!this.trenCam(x, y, leCam) || !this.thayKhoi(x, y)) return false;
    // Mê cung bom không có sương mù: trên camera là thấy (còn người chơi chưa gục)
    if (banDoHt === 'sa' && trongMeCung(x, y, 300)) return this.nguoi.some((n) => !n.vang && !n.het);
    const r = TAM_NHIN + le;
    for (const n of this.nguoi) {
      if (n.vang || n.het) continue;
      const dx = n.x - x, dy = n.y - y;
      if (dx * dx + dy * dy < r * r) return true;
    }
    return false;
  }

  /** Gà (gà con, tướng gà, vua gà) đang được nhân vật nhìn thấy: chỉ khi đó mới dùng chiêu / hiệu ứng (đổi màu, thế phòng thủ, Lao / Bay, gọi gà con, trốn chạy nhanh, gà đen nhào, gà đỏ khựng, chữ bay, nổ, âm thanh) */
  private gaTrenCam(g: { x: number; y: number; loai?: LoaiGa }): boolean {
    return this.nvThay(g.x, g.y, g.loai === 'boss' ? 450 : 150);
  }

  /** Hiệu ứng (vụ nổ, bụi) và chữ bay sinh ra từ gà: nhân vật không nhìn thấy thì bỏ, không tạo vật thừa */
  private vetGa(v: Vet): void {
    if (this.nvThay(v.x, v.y, 300, 150)) this.vet.push(v);
  }

  private chuGa(c: Chu): void {
    if (this.nvThay(c.x, c.y + 300, 300, 150)) this.chu.push(c);
  }

  /** Cell đang được nhân vật nhìn thấy (như gà: trên camera, khối đất đang thấy, trong TAM_NHIN + nửa thân của một nhân vật chưa gục, kể cả người trên máy bay) */
  private cellTrenCam(c: Cell): boolean {
    const k = cellK(c.cap);
    return this.nvThay(c.x, c.y - 32 * k, 60 * k + 150, 20 * k);
  }

  /** Mục tiêu (x, y) nằm trong tầm nhìn của Cell (đối xứng với tầm nhìn nhân vật: TAM_NHIN + nửa thân) và Cell đang được nhìn thấy: chỉ khi đó Cell mới bắn chưởng / dịch chuyển */
  private cellThayMuc(c: Cell, x: number, y: number): boolean {
    const r = TAM_NHIN + 20 * cellK(c.cap);
    const dx = x - c.x, dy = y - c.y;
    return dx * dx + dy * dy < r * r && this.cellTrenCam(c);
  }

  /** Máy bay nằm trong tầm nhìn riêng của Cell khi nhìn máy bay (CELL_MB_NHIN, tính tới thân máy bay trên cao); không cần người trên máy bay nhìn thấy Cell */
  private cellThayMb(c: Cell): boolean {
    const t = this.tamMb();
    const dx = t.x - c.x, dy = t.y - (c.y - 32 * cellK(c.cap));
    return dx * dx + dy * dy < CELL_MB_NHIN * CELL_MB_NHIN;
  }

  /** Cell "một chấm": ngoài màn hình (lề theo độ to) và xa mọi nhân vật hơn CELL_THUA_XA, không đang vận chưởng / hoá socola / chết */
  private cellThua(c: Cell): boolean {
    if (c.chet || (c.nap !== undefined && c.chien) || (c.socola ?? 0) > 0) return false;
    if (this.trenCam(c.x, c.y - 32 * cellK(c.cap), CELL_THUA_LE * cellK(c.cap) + 300)) return false;
    for (const n of this.nguoi) if (!n.vang && Math.abs(n.x - c.x) < CELL_THUA_XA && Math.abs(n.y - c.y) < CELL_THUA_XA && hyp(n.x - c.x, n.y - c.y) < CELL_THUA_XA) return false;
    return true;
  }

  private thay(x: number, y: number): boolean {
    if (banDoHt === 'sa' && trongMeCung(x, y, 300)) return true;
    const r2 = TAM_NHIN * TAM_NHIN;
    for (const o of this.nhinNguon) {
      const dx = o.x - x, dy = o.y - y;
      if (dx * dx + dy * dy < r2) return true;
    }
    return false;
  }

  /** Núi đá (bóng ma Goku) chỉ vào được khi chơi 2 người: chơi 1 người thì bước vào núi bị chặn lại (đang ở trong sẵn, ví dụ rơi máy bay, thì được đi ra) */
  private chanNuiMotNguoi(truoc: { x: number; y: number }[]): void {
    if (!this.nguoi.some((n) => n.vang)) return;
    this.nguoi.forEach((n, p) => {
      if (n.vang || this.trongMb(p) || !trongNui(n.x, n.y) || trongNui(truoc[p]!.x, truoc[p]!.y)) return;
      n.x = truoc[p]!.x;
      n.y = truoc[p]!.y;
      n.dich = null;
      if (n.bay) { n.bay = null; n.nv.tiepDat(); }
      if (this.t - this.nuiBaoLuc > 3) {
        this.nuiBaoLuc = this.t;
        this.chu.push({ id: this.id++, x: n.x, y: n.y - 300, text: '⛰ NÚI ĐÁ CHỈ VÀO ĐƯỢC KHI CHƠI 2 NGƯỜI!', mau: '#ffd27a', t: 0 });
      }
    });
  }

  /**
   * Cửa mê cung bom (`vungMc()`): chơi 2 người thì chỉ bước vào được khi người kia cũng đang ở đường hầm / mê cung (cùng vào; người kia đã gục
   * trong mê cung thì vẫn vào cứu được), không thì bị chặn lại. Chơi 1 người mà bước vào thì chết ngay: thua cuộc.
   */
  private chanMeCung(truoc: { x: number; y: number }[]): void {
    const mot = this.nguoi.some((n) => n.vang);
    this.nguoi.forEach((n, p) => {
      // Chơi 2 người: không được đi ra khỏi map mê cung (ra đoạn hầm gần đảo 1) khi đồng đội còn nằm trong lưới mê cung (kể cả đã gục):
      // phải cùng ra bằng cổng thoát (mcRaNui đưa cả đội đi) hoặc quay lại cứu
      if (!mot && !n.vang && !this.trongMb(p) && this.vungMc(truoc[p]!) && !this.vungMc(n)) {
        const q = this.nguoi[1 - p]!;
        if (!q.vang && !this.trongMb(1 - p) && trongMeCung(q.x, q.y, 300)) {
          n.x = truoc[p]!.x;
          n.y = truoc[p]!.y;
          n.dich = null;
          if (this.t - this.mcBaoLuc > 3) {
            this.mcBaoLuc = this.t;
            this.chu.push({ id: this.id++, x: n.x, y: n.y - 300, text: '🧨 KHÔNG BỎ ĐỒNG ĐỘI LẠI MÊ CUNG! CÙNG RA BẰNG LỐI THOÁT', mau: '#ffd27a', t: 0 });
          }
          return;
        }
      }
      if (n.vang || n.het || this.trongMb(p) || !this.vungMc(n) || this.vungMc(truoc[p]!)) return;
      if (mot) {
        this.chetNv(n);
        this.chu.push({ id: this.id++, x: n.x, y: n.y - 300, text: '💀 MÊ CUNG BOM CHỈ VÀO ĐƯỢC KHI CHƠI 2 NGƯỜI!', mau: '#ff4d4d', t: 0 });
        this.ketThuc(false);
        return;
      }
      const q = this.nguoi[1 - p]!;
      if (!this.trongMb(1 - p) && (this.vungMc(q) || (!q.het && trongHam(q.x, q.y, 200)))) return;
      n.x = truoc[p]!.x;
      n.y = truoc[p]!.y;
      n.dich = null;
      if (n.bay) { n.bay = null; n.nv.tiepDat(); }
      if (this.t - this.mcBaoLuc > 3) {
        this.mcBaoLuc = this.t;
        this.chu.push({ id: this.id++, x: n.x, y: n.y - 300, text: '🧨 CẢ 2 NGƯỜI CÙNG VÀO MÊ CUNG BOM!', mau: '#ffd27a', t: 0 });
      }
    });
  }

  /** Lần cuối báo "mê cung bom phải cả 2 người cùng vào" (giây `t`) */
  private mcBaoLuc = -99;
  /** Lần cuối báo "núi đá chỉ cho 2 người" (giây `t`) */
  private nuiBaoLuc = -99;
  /** Lần cuối báo "thần điện chỉ cho 2 người" khi máy bay chở 1 người bay tới (giây `t`) */
  private thanBaoLuc = -99;

  // Dây buộc: 2 nhân vật không xa nhau quá mức camera chứa nổi. Người vừa di chuyển nhiều hơn là người bị chặn lại.
  // Bóng ma Goku đang là bản sao cũng bị buộc chung dây với cả hai nhân vật (tam giác 3 người): ai đi xa thì kéo / bị kéo như nhau.
  private rangBuoc(truoc: { x: number; y: number }[]): void {
    const [a, b] = this.nguoi;
    const g = this.ginyu;
    const coSao = this.gySao;
    const gTruoc = this.gyTruocDay ?? { x: g.x, y: g.y };
    // Người tham gia dây: 2 nhân vật (không vắng) + bản sao; người trên máy bay không bị bản sao kéo
    const moi = (o: { x: number; y: number }, t: { x: number; y: number }) => ({ o, m: hyp(o.x - t.x, o.y - t.y) });
    const va = moi(a, truoc[0]!), vb = moi(b, truoc[1]!);
    const vg = moi(g, gTruoc);
    const cap: [typeof va, typeof va][] = [];
    // Cả hai ở trong mê cung bom (camera thấy cả mê cung, đi theo ô): không buộc dây
    if (!a.vang && !b.vang && !(this.oMeCung(0) && this.oMeCung(1))) cap.push([va, vb]);
    if (coSao) this.nguoi.forEach((n, q) => { if (!n.vang && !this.trongMb(q)) cap.push([vg, q === 0 ? va : vb]); });
    // Lặp vài lần để cả tam giác cùng thoả
    for (let lan = 0; lan < (cap.length > 1 ? 3 : 1); lan++) {
      for (const [u, v] of cap) {
        const sa = u.m + v.m > 0.01 ? u.m / (u.m + v.m) : 0.5;
        for (const [k, max] of [['x', MAX_DX], ['y', MAX_DY]] as const) {
          const d = u.o[k] - v.o[k];
          const thua = Math.abs(d) - max;
          if (thua <= 0) continue;
          const dau = Math.sign(d);
          u.o[k] -= dau * thua * sa;
          v.o[k] += dau * thua * (1 - sa);
        }
      }
    }
    if (coSao) this.gyGiu(LE_NV);
    this.gyTruocDay = coSao ? { x: g.x, y: g.y } : null;
  }

  /** Vị trí bản sao ở lần buộc dây trước (để biết bản sao vừa di chuyển bao nhiêu) */
  private gyTruocDay: { x: number; y: number } | null = null;

  /** Zoom gốc khi đi bộ (ve-canvas dựng ô nền đảo theo mức này, máy bay zoom ra chỉ thu nhỏ ô đã dựng) */
  readonly zoomGoc = ZOOM;

  kepTet(v: number): number {
    return kep((v - 0.7) / 0.3, 0, 1) * 0.8;
  }

  // Mức căng của dây buộc: 0 là sát nhau, 1 là chạm giới hạn
  get tetDo(): number {
    const [a, b] = this.nguoi;
    if (a.vang || b.vang) return 0;
    return Math.max(Math.abs(a.x - b.x) / MAX_DX, Math.abs(a.y - b.y) / MAX_DY);
  }

  // Vị trí nhân vật trên màn hình (toạ độ khung W×H)
  viTriManHinh(p: number) {
    const n = this.nguoi[p];
    return { x: this.W / 2 + (n.x - this.camX) * this.camZ, y: TAM_VIEW_Y + (n.y - this.camY) * this.camZ };
  }

  // Mũi tên ở mép màn hình chỉ hướng nhân vật khi họ ra ngoài khung nhìn
  muiTen(p: number) {
    // Map mê cung bom: camera nhìn toàn mê cung, không cần mũi tên mép màn hình
    if (this.nguoi.some((n) => !n.vang && this.vungMc(n))) return null;
    const v = this.viTriManHinh(p);
    const x = kep(v.x, 70, this.W - 70);
    const y = kep(v.y, 130, H - 70);
    if (x === v.x && y === v.y) return null;
    return { x, y, goc: (Math.atan2(v.y - y, v.x - x) * 180) / Math.PI };
  }

  // ─── Sinh đối tượng ───

  // Máy bay ra khỏi vườn gà → vườn ngủ (gà, trứng biến mất, không hoạt động). Máy bay về → tổ trứng ẩn đẻ / ấp đủ ME_PHU_HIEN_VUA gà mẹ phụ thì vua gà mới xuất hiện lại (nếu vua gà chưa bị hạ)
  private capNhatVuon(dtE: number): void {
    // Máy bay hoặc phi thuyền bay ra khỏi vườn (qua tường) thì vườn ngủ; xe nào còn đậu trong vườn mà không ai ở trong vườn cũng vậy
    // (đi phi thuyền sang núi đá, máy bay vẫn đậu trong vườn). Người ngồi xe đi theo xe nên chỉ cần xét vị trí nhân vật.
    // Người ngồi xe tính theo vị trí xe (lúc bay, toạ độ nhân vật bị nâng lên theo độ cao)
    const ngoai = !this.nguoi.some((n, p) => {
      if (n.vang) return false;
      const o = this.trongPt(p) ? this.phiThuyen : this.mayBay.ngoi.includes(p) ? this.mayBay : n;
      return trongVuon(o.x, o.y);
    });
    if (ngoai && !this.vuonNgu) {
      this.vuonNgu = true;
      // Vua gà còn sống (hoặc chưa xuất hiện) thì sẽ xuất hiện lại như mới; đã bị hạ thì không bao giờ có lại
      if (this.ga.some((g) => g.goc && !g.chet) || this.soLanTuong <= TUONG_HOI_SINH) this.soLanTuong = 0;
      this.viTriVua = null;
      this.ga = [];
      this.keoGa = [];
      this.trungDe = [];
      this.toTrung = null;
      this.choVua = false;
      this.daNoPhu = 0;
      return;
    }
    if (!ngoai && this.vuonNgu) {
      this.vuonNgu = false;
      if (this.soLanTuong <= TUONG_HOI_SINH) {
        const co = this.nguoi.filter((n) => !n.vang);
        let x = MAP / 2, y = MAP / 2;
        for (let i = 0; i < 30; i++) {
          x = ngauNhien(900, MAP - 900);
          y = ngauNhien(900, MAP - 900);
          if (co.every((n) => hyp(n.x - x, n.y - y) >= 1500)) break;
        }
        this.toTrung = { x, y };
        this.toDe = 0;
        this.daNoPhu = 0;
        this.choVua = true;
      }
    }
    if (this.vuonNgu || !this.toTrung) return;
    this.toDe -= dtE;
    if (this.toDe <= 0) {
      this.toDe = choDeTrung(this.soMePhu);
      this.deTrung({ id: -1, x: this.toTrung.x, y: this.toTrung.y });
    }
    if (this.daNoPhu >= ME_PHU_HIEN_VUA) {
      this.toTrung = null;
      this.choVua = false;
      this.henTuong = 0;
    }
  }

  // Gà tướng đẻ một lượt trứng quanh mình
  private deTrung(boss: { id: number; x: number; y: number }): void {
    if (this.nvThay(boss.x, boss.y, 450, 150)) this.am.phat('deTrung');
    // Đủ GA_CON_TOI_DA gà con (tính cả trứng thường đang ấp) thì không đẻ trứng thường
    const choCon = GA_CON_TOI_DA - this.soGaCon - this.trungDe.filter((e) => !e.db).length;
    for (const loai of DAN_TRUNG.slice(0, Math.max(0, choCon))) {
      const v = { x: boss.x + ngauNhien(-110, 110), y: boss.y + ngauNhien(-60, 90) };
      giuTrongMap(v, LE_TRUNG, false, 'vuon');
      this.trungDe.push({ id: this.id++, loai, t: 0, x: v.x, y: v.y });
    }
    // Quả thứ 5 của mỗi lượt là trứng đỏ đặc biệt
    this.deTrungDb(boss);
  }

  // Trứng nở thành gà sau TRUNG_NO giây
  private capNhatTrungGa(dt: number): void {
    const conLai: TrungGa[] = [];
    for (const e of this.trungDe) {
      e.t += dt;
      if (e.db) {
        // Trứng đỏ: nở 4 gà con mạnh dần đều trong thời gian ấp (e.ap), hết thời gian ấp thì nở ra gà mẹ phụ
        const ap = e.ap ?? TRUNG_DB_NO;
        const nhip = Math.min(GA_DB_SUC.length, Math.floor(e.t / (ap / (GA_DB_SUC.length + 1))));
        for (let k = e.no ?? 0; k < nhip; k++) this.nuaGaDb(e, k);
        e.no = Math.max(e.no ?? 0, nhip);
        if (e.t < ap) conLai.push(e);
        else this.sinhMePhu(e);
        continue;
      }
      if (e.t < TRUNG_NO) {
        conLai.push(e);
        continue;
      }
      const bay = e.loai === 'flyer';
      const huong = ngauNhien(0, Math.PI * 2);
      const v = bay ? ngauNhien(110, 130) : 0;
      const g: Ga = {
        id: this.id++, loai: e.loai, x: e.x, y: e.y, h: 0, h0: bay ? ngauNhien(200, 300) : 0,
        vx: Math.cos(huong) * v, vy: Math.sin(huong) * v, phase: Math.random() * 6, doiHuong: 0,
        chet: false, tChet: 0, lat: Math.cos(huong) < 0, hp: HP_GA, nhay: 0,
      };
      giuTrongMap(g, leCuaGa(g), false, 'vuon');
      this.ga.push(g);
      this.vetGa({ id: this.id++, x: g.x, y: g.y, t: 0, loai: 'bui' });
    }
    this.trungDe = conLai;
  }

  private sinhTuong(): void {
    const lan = this.soLanTuong++;
    this.lanTuong = lan;
    const co = this.nguoi.filter((n) => !n.vang);
    const mx = co.reduce((t, n) => t + n.x, 0) / co.length;
    const my = co.reduce((t, n) => t + n.y, 0) / co.length;
    let x = MAP / 2;
    let y = MAP / 2;
    if (lan === 0 && this.viTriVua) {
      // Lần đầu: ở chỗ đã chốt lúc vào ván (xa góc nhân vật xuất phát nhất)
      x = this.viTriVua.x;
      y = this.viTriVua.y;
    } else if (lan === 0) {
      // Lần đầu: xuất hiện ở chỗ ngẫu nhiên trên map, cách cả hai nhân vật ít nhất 2000
      for (let i = 0; i < 30; i++) {
        x = ngauNhien(600, MAP - 600);
        y = ngauNhien(600, MAP - 600);
        if (co.every((n) => hyp(n.x - x, n.y - y) >= 2000)) break;
      }
    } else {
      // Hồi sinh: ở điểm xa nhất so với Mabu / Zinbu lúc hồi sinh (lớn nhất khoảng cách tới nhân vật gần nhất), dò lưới trên map
      const LE = 400 + TUONG;
      const BUOC = 24;
      let tot = -1;
      for (let i = 0; i <= BUOC; i++) {
        for (let j = 0; j <= BUOC; j++) {
          const cx = LE + ((MAP - 2 * LE) * i) / BUOC;
          const cy = LE + ((MAP - 2 * LE) * j) / BUOC;
          const d = Math.min(...co.map((n) => hyp(n.x - cx, n.y - cy)));
          if (d > tot) { tot = d; x = cx; y = cy; }
        }
      }
    }
    this.ga.push(this.taoTuong(x, y, x > mx, true));
    const chuTuong = lan === 0 ? '🐔 GÀ TƯỚNG XUẤT HIỆN!' : `🐔 GÀ TƯỚNG HỒI SINH LẦN ${lan}!`;
    // Chữ báo hiện ngay trên đầu nhân vật (luôn trên camera), không phải hiệu ứng tại chỗ gà
    this.chu.push({ id: this.id++, x: mx, y: my - 330, text: chuTuong, mau: '#ff9f1a', t: 0 });
    this.rung = Math.max(this.rung, 0.4);
  }

  // Tạo một gà mẹ: goc = gà mẹ gốc (đẻ trứng, chỉ sống sót) hay gà mẹ phụ (nở từ trứng đỏ, đi đánh)
  private taoTuong(x: number, y: number, lat: boolean, goc: boolean, kieuPhu?: number): Ga {
    return {
      id: this.id++, loai: 'boss', x, y, h: 0, h0: 0, vx: 0, vy: 0, phase: 0, doiHuong: 0,
      chet: false, tChet: 0, lat, hp: goc ? HP_VUA : HP_GA, nhay: 0, de: 0,
      chieu: null, hoiLao: LAO_HOI, hoiBay: BAY_HOI, mau: null, conMau: 0, hoiMau: MAU_CHU_KY, luotMau: 0, dot: 0,
      goc, socola: 0,
      ...(goc ? {} : { daDe: true, choChieu: 1, kieuPhu, hoiLao: 3, hoiBay: 3 }),
    };
  }

  // Gọi gà con ra bảo vệ gà mẹ
  private goiGaCon(g: Ga): void {
    g.hoiGoi = GOI_HOI;
    g.dangGoi = GOI_HIEN;
    const dan = GOI_DAN;
    dan.forEach((loai, i) => {
      const goc = (i / dan.length) * Math.PI * 2 + ngauNhien(0, 0.5);
      const bay = loai === 'flyer';
      const huong = ngauNhien(0, Math.PI * 2);
      const v = bay ? ngauNhien(110, 130) : 0;
      const c: Ga = {
        id: this.id++, loai, x: g.x + Math.cos(goc) * 170, y: g.y + Math.sin(goc) * 100, h: 0, h0: bay ? ngauNhien(200, 300) : 0,
        vx: Math.cos(huong) * v, vy: Math.sin(huong) * v, phase: Math.random() * 6, doiHuong: 0,
        chet: false, tChet: 0, lat: Math.cos(goc) < 0, hp: HP_GA, nhay: 0,
      };
      giuTrongMap(c, leCuaGa(c));
      this.ga.push(c);
      this.vetGa({ id: this.id++, x: c.x, y: c.y, t: 0, loai: 'chay', co: 0.6 });
    });
    this.chuGa({ id: this.id++, x: g.x, y: g.y - 360, text: '📣 GỌI GÀ CON!', mau: '#ffd23f', t: 0 });
    this.rung = Math.max(this.rung, 0.2);
  }

  // Gà mẹ gốc đẻ một quả trứng đỏ đặc biệt; mỗi lần chỉ có một quả đang ấp của gà mẹ này
  private deTrungDb(boss: { id: number; x: number; y: number }): void {
    if (this.trungDe.some((e) => e.db && e.me === boss.id)) return;
    // Đủ ME_PHU_TOI_DA tướng gà (tính cả trứng đỏ đang ấp) thì không đẻ trứng đỏ
    if (this.soMePhu + this.trungDe.filter((e) => e.db).length >= ME_PHU_TOI_DA) return;
    const v = { x: boss.x + ngauNhien(-140, 140), y: boss.y + ngauNhien(40, 150) };
    giuTrongMap(v, LE_TRUNG_DB, false, 'vuon');
    const { x, y } = v;
    this.trungDe.push({ id: this.id++, loai: 'hen', t: 0, x, y, db: true, no: 0, me: boss.id, ap: apTrungDb(this.soMePhu) });
    this.chuGa({ id: this.id++, x: boss.x, y: boss.y - 360, text: '🥚 TRỨNG ĐỎ!', mau: '#ff4d4d', t: 0 });
  }

  // Trứng đỏ nở gà con ở nhịp k (0 → gà con thường, 1 → x2 to gấp đôi, 2 → x3, 3 → x4)
  private nuaGaDb(e: TrungGa, k: number): void {
    if (this.soGaCon >= GA_CON_TOI_DA) return;
    const loai = (['hen', 'rooster', 'flyer'] as const)[Math.floor(Math.random() * 3)];
    const bay = loai === 'flyer';
    const huong = ngauNhien(0, Math.PI * 2);
    const v = bay ? ngauNhien(110, 130) : 0;
    const suc = GA_DB_SUC[k];
    const g: Ga = {
      id: this.id++, loai, x: e.x + Math.cos(huong) * 120, y: e.y + Math.sin(huong) * 60, h: 0, h0: bay ? ngauNhien(200, 300) : 0,
      vx: Math.cos(huong) * v, vy: Math.sin(huong) * v, phase: Math.random() * 6, doiHuong: 0,
      chet: false, tChet: 0, lat: Math.cos(huong) < 0, hp: HP_GA * suc, nhay: 0, suc, to: GA_DB_TO[k], db: true,
    };
    giuTrongMap(g, leCuaGa(g), false, 'vuon');
    this.ga.push(g);
    this.vetGa({ id: this.id++, x: g.x, y: g.y, t: 0, loai: 'chay', co: 0.6 + 0.2 * k });
    if (k > 0) this.chuGa({ id: this.id++, x: g.x, y: g.y - 160, text: `GÀ CON x${suc}!`, mau: '#ff6a3c', t: 0 });
  }

  // Trứng đỏ nở ra gà mẹ phụ: đi đánh nhân vật thay gà mẹ gốc
  private sinhMePhu(e: TrungGa): void {
    if (this.soMePhu >= ME_PHU_TOI_DA) return;
    const g = this.taoTuong(e.x, e.y, Math.random() < 0.5, false, this.demPhu++ % KIEU_PHU);
    giuTrongMap(g, LE_TUONG, false, 'vuon');
    this.ga.push(g);
    this.daNoPhu++;
    this.vetGa({ id: this.id++, x: g.x, y: g.y, t: 0, loai: 'chay', co: 2 });
    this.chuGa({ id: this.id++, x: g.x, y: g.y - 360, text: '🐔 GÀ MẸ MỚI RA ĐỜI!', mau: '#ff9f1a', t: 0 });
    this.rung = Math.max(this.rung, 0.3);
  }

  // Thanh socola gần nhất trong tầm ngửi TAM_NGUI_TAO của gà g; khongGioiHan: tìm khắp vườn, kể cả táo đỏ (tướng gà khi đã đủ ME_PHU_TOI_DA)
  private socolaGan(g: Ga, khongGioiHan = false): VatPham | null {
    let kq: VatPham | null = null;
    let xa = khongGioiHan ? Infinity : TAM_NGUI_TAO;
    for (const v of this.vatPham) {
      if (v.loai !== 'socola' && !(khongGioiHan && (v.loai ?? 'do') === 'do')) continue;
      if (khongGioiHan && !trongVuon(v.x, v.y)) continue;
      const d = hyp(v.x - g.x, v.y - g.y);
      if (d < xa) { xa = d; kq = v; }
    }
    return kq;
  }

  // Vua gà dưới TRON_MAU máu: chỉ chạy trốn nhân vật gần nhất (trong TAM_NHIN_TUONG), mỗi mạng 1 lần chạy trốn nhanh. Trả về true nếu đã điều khiển.
  private tronNhanh(g: Ga): boolean {
    if (g.hp >= hpToiDa(g) * TRON_MAU) {
      g.tron = 0;
      return false;
    }
    if (g.tron) {
      g.vx = (g.tronX ?? 0) * TOC_TRON * TRON_TOC;
      g.vy = (g.tronY ?? 0) * TOC_TRON * TRON_TOC;
      g.lat = g.vx < 0;
      return true;
    }
    let muc: NguoiChoi | null = null;
    let gan = TAM_NHIN_TUONG;
    for (const n of this.nguoi) {
      if (this.khuat(n)) continue;
      const d = hyp(n.x - g.x, n.y - g.y);
      if (d < gan) { gan = d; muc = n; }
    }
    if (!muc) return false;
    const d = hyp(g.x - muc.x, g.y - muc.y) || 1;
    const ux = (g.x - muc.x) / d;
    const uy = (g.y - muc.y) / d;
    let toc = TOC_TRON;
    if ((g.daTron ?? 0) < TRON_LAN && this.gaTrenCam(g)) {
      // Trốn chạy nhanh (tối đa TRON_LAN lần): khoá hướng ra xa nhân vật gần nhất, bất tử trong lúc chạy
      g.daTron = (g.daTron ?? 0) + 1;
      g.tron = TRON_QUANG;
      g.tronX = ux;
      g.tronY = uy;
      toc *= TRON_TOC;
      this.chuGa({ id: this.id++, x: g.x, y: g.y - 380, text: '🏃 VUA GÀ TRỐN CHẠY!', mau: '#ffd23c', t: 0 });
    }
    g.vx = ux * toc;
    g.vy = uy * toc;
    g.lat = g.vx < 0;
    g.doiHuong = 0;
    return true;
  }

  // Gà mẹ gốc không đi đánh: có trứng đỏ đang ấp thì canh quanh quả trứng, không thì chạy trốn nhân vật gần nhất, không ai tới gần thì đi loanh quanh
  private dieuTuongGoc(g: Ga, dt: number): void {
    if (this.tronNhanh(g)) return;
    const e = this.trungDe.find((t) => t.db && t.me === g.id);
    if (e) {
      const d = hyp(e.x - g.x, e.y - g.y);
      if (d > TRUNG_DB_BAO_VE) {
        g.vx = ((e.x - g.x) / d) * TOC_DO_TUONG * 4;
        g.vy = ((e.y - g.y) / d) * TOC_DO_TUONG * 4;
        g.doiHuong = 0;
      } else {
        // Đi vòng quanh quả trứng, cách xa một chút (trong TRUNG_DB_BAO_VE)
        g.doiHuong -= dt;
        if (g.doiHuong <= 0) {
          g.doiHuong = ngauNhien(1, 2.5);
          const goc = ngauNhien(0, Math.PI * 2);
          const v = Math.random() < 0.1 ? 0 : TOC_DO_TUONG * 3;
          g.vx = Math.cos(goc) * v;
          g.vy = Math.sin(goc) * v;
        }
      }
      if (g.vx) g.lat = g.vx < 0;
      return;
    }
    let muc: NguoiChoi | null = null;
    let gan = TAM_NHIN_TUONG;
    for (const n of this.nguoi) {
      if (this.khuat(n)) continue;
      const d = hyp(n.x - g.x, n.y - g.y);
      if (d < gan) { gan = d; muc = n; }
    }
    // Không có nhân vật nào gần mà có socola trong tầm ngửi thì đi ăn
    const soc = this.socolaGan(g);
    if (soc && (!muc || gan > 800)) {
      const d = hyp(soc.x - g.x, soc.y - g.y) || 1;
      g.vx = ((soc.x - g.x) / d) * TOC_DO_TUONG * 3;
      g.vy = ((soc.y - g.y) / d) * TOC_DO_TUONG * 3;
      g.lat = g.vx < 0;
      return;
    }
    if (muc) {
      const d = hyp(muc.x - g.x, muc.y - g.y) || 1;
      g.vx = ((g.x - muc.x) / d) * TOC_TRON;
      g.vy = ((g.y - muc.y) / d) * TOC_TRON;
      g.lat = g.vx < 0;
      g.doiHuong = 0;
      return;
    }
    g.doiHuong -= dt;
    if (g.doiHuong <= 0) {
      g.doiHuong = ngauNhien(2, 5);
      const goc = ngauNhien(0, Math.PI * 2);
      const v = Math.random() < 0.25 ? 0 : TOC_DO_TUONG * 0.6;
      g.vx = Math.cos(goc) * v;
      g.vy = Math.sin(goc) * v;
    }
  }

  // Gà con: có nhân vật trong tầm ngửi (TAM_NGUI_NV) thì đuổi theo nhân vật gần nhất; táo đỏ trong tầm ngửi thì đi ăn. Trả về true nếu đang lao.
  private gaLao(g: Ga, dt: number): boolean {
    let muc: { x: number; y: number } | null = null;
    let gan = TAM_NGUI_NV;
    // Đã đủ GA_CON_TOI_DA gà con: tìm Mabu / Zinbu (đang ở trong vườn) và táo đỏ / socola khắp vườn
    const day = this.dayCon;
    for (const n of this.nguoi) {
      if (this.khuat(n)) continue;
      const d = hyp(n.x - g.x, n.y - g.y);
      if (d < gan || (day && trongVuon(n.x, n.y) && (!muc || d < gan))) { gan = d; muc = n; }
    }
    // Nhân vật chưa vào tầm đánh (TAM_LAO) mà có táo đỏ trong tầm ngửi TAM_NGUI_TAO thì đi tới táo trước
    if (!muc || gan > TAM_LAO) {
      let xa = day ? Infinity : TAM_NGUI_TAO;
      for (const v of this.vatPham) {
        if (v.loai === 'xanh' || v.loai === 'ngoc') continue;
        if (day && !trongVuon(v.x, v.y)) continue;
        const d = hyp(v.x - g.x, v.y - g.y);
        if (d < xa) { xa = d; muc = v; }
      }
    }
    const laNguoi = !!muc && 'mana' in muc;
    // Gà đen không còn nhào vào nhân vật: thoát chế độ nhào thì trở lại tốc độ bay thường
    if (g.nhao && !laNguoi) {
      g.nhao = null;
      const a = ngauNhien(0, Math.PI * 2);
      const v = ngauNhien(110, 130);
      g.vx = Math.cos(a) * v;
      g.vy = Math.sin(a) * v;
    }
    if (!muc) return false;
    if (g.loai === 'flyer' && laNguoi) {
      // Nhào chỉ dùng trên camera (đang báo hiệu / nhào / nghỉ thì làm nốt); ngoài camera chỉ bay thẳng tới nhân vật với tốc độ bay thường
      if (this.gaTrenCam(g) || (g.nhao && g.nhao.pha !== 'vong')) {
        this.denNhao(g, muc as NguoiChoi, dt);
        return true;
      }
      if (g.nhao) {
        g.nhao = null;
        const v = ngauNhien(110, 130);
        g.vx = v;
        g.vy = 0;
      }
    }
    let tx = muc.x;
    let ty = muc.y;
    if (laNguoi && g.loai === 'hen') {
      // Gà trắng đi thành đàn: lao vào thì tản ra vây quanh nhân vật, mỗi con một hướng
      const goc = g.id * 2.399;
      tx += Math.cos(goc) * HEN_VAY;
      ty += Math.sin(goc) * HEN_VAY * EP_GA;
    }
    const dx = tx - g.x;
    const dy = ty - g.y;
    const d = hyp(dx, dy) || 1;
    // Gà đỏ lao DO_CHAY giây rồi khựng DO_KHUNG giây (thở dốc, nhận thêm sát thương)
    if (g.loai === 'rooster' && laNguoi && ((g.kiet ?? 0) > 0 || this.gaTrenCam(g))) {
      g.kiet = Math.max(0, (g.kiet ?? 0) - dt);
      if (g.kiet > 0) {
        g.vx = g.vy = 0;
        g.doiHuong = 0;
        return true;
      }
      g.chayDo = (g.chayDo ?? ngauNhien(0, DO_CHAY)) + dt;
      if (g.chayDo >= DO_CHAY && d > 120) {
        g.chayDo = 0;
        g.kiet = DO_KHUNG;
        g.vx = g.vy = 0;
        return true;
      }
    }
    const v = g.loai === 'flyer' ? hyp(g.vx, g.vy) || 150 : d > 40 ? TOC_DO_LAO[g.loai] : 0;
    g.vx = (dx / d) * v;
    g.vy = (dy / d) * v;
    g.doiHuong = 0;
    return true;
  }

  // Gà đen: bay vòng quanh nhân vật DEN_VONG_T giây → báo hiệu DEN_BAO giây (vệt đỏ) → nhào thẳng (không đổi hướng) → nghỉ DEN_NGHI giây
  private denNhao(g: Ga, n: NguoiChoi, dt: number): void {
    const nh = (g.nhao ??= { pha: 'vong', t: ngauNhien(0, 1.5), ux: 0, uy: 0, quang: 0, ang: Math.atan2(g.y - n.y, g.x - n.x), huong: Math.random() < 0.5 ? 1 : -1, vong: ngauNhien(DEN_VONG_T * 0.8, DEN_VONG_T * 1.4) });
    nh.t += dt;
    g.doiHuong = 0;
    const dx = n.x - g.x;
    const dy = n.y - g.y;
    const d = hyp(dx, dy) || 1;
    if (nh.pha === 'vong') {
      let tx = n.x;
      let ty = n.y;
      if (d <= DEN_VONG_BK * 1.6) {
        nh.ang += (nh.huong * DEN_VONG_TOC / DEN_VONG_BK) * dt;
        tx += Math.cos(nh.ang) * DEN_VONG_BK;
        ty += Math.sin(nh.ang) * DEN_VONG_BK * EP_GA;
      }
      const ex = tx - g.x;
      const ey = ty - g.y;
      const e = hyp(ex, ey) || 1;
      const v = Math.min(DEN_VONG_TOC * (d > DEN_VONG_BK * 1.6 ? 2 : 1), e * 4) / HE_SO_TOC_GA;
      g.vx = (ex / e) * v;
      g.vy = (ey / e) * v;
      if (nh.t >= nh.vong && d <= DEN_VONG_BK * 1.6) { nh.pha = 'bao'; nh.t = 0; }
    } else if (nh.pha === 'bao') {
      g.vx = g.vy = 0;
      nh.ux = dx / d;
      nh.uy = dy / d;
      nh.quang = d + DEN_NHAO_THEM;
      g.lat = nh.ux < 0;
      if (nh.t >= DEN_BAO) { nh.pha = 'lao'; nh.t = 0; }
    } else if (nh.pha === 'lao') {
      g.vx = (nh.ux * DEN_NHAO_TOC) / HE_SO_TOC_GA;
      g.vy = (nh.uy * DEN_NHAO_TOC) / HE_SO_TOC_GA;
      nh.quang -= DEN_NHAO_TOC * dt;
      if (nh.quang <= 0) { nh.pha = 'nghi'; nh.t = 0; }
    } else {
      g.vx = g.vy = 0;
      if (nh.t >= DEN_NGHI) {
        nh.pha = 'vong';
        nh.t = 0;
        nh.vong = ngauNhien(DEN_VONG_T * 0.8, DEN_VONG_T * 1.4);
        nh.ang = Math.atan2(g.y - n.y, g.x - n.x);
      }
    }
  }

  // Đồng hồ hồi chiêu Lao / Bay, màu đang đổi và đốt cháy của gà tướng
  private capNhatChieuTuong(g: Ga, dt: number): void {
    g.hoiLao = Math.max(0, (g.hoiLao ?? 0) - dt);
    g.hoiBay = Math.max(0, (g.hoiBay ?? 0) - dt);
    g.nghiChung = Math.max(0, (g.nghiChung ?? 0) - dt);
    g.soHo = Math.max(0, (g.soHo ?? 0) - dt);
    // Ngoài camera: không dùng chiêu / hiệu ứng nào (màu, thế phòng thủ, đốt cháy); đang bật thì tắt luôn. Đồng hồ hồi vẫn chạy để vào camera là dùng được
    if (!this.gaTrenCam(g)) {
      g.hoiThe = Math.max(0, (g.hoiThe ?? THE_CHU_KY) - dt);
      g.hoiMau = Math.max(0, (g.hoiMau ?? MAU_CHU_KY) - dt);
      if (g.mau) { g.mau = null; g.conMau = 0; }
      g.the = 0;
      return;
    }
    if (g.mau) {
      g.conMau = (g.conMau ?? 0) - dt;
      if (g.conMau <= 0) {
        g.mau = null;
        g.nghiChung = CHIEU_NGHI_CHUNG;
      }
    }
    // Thế phòng thủ: cứ THE_CHU_KY giây vào thế THE_KEO_DAI giây (không vào khi đang sơ hở, đang Lao / Bay hoặc đổi màu)
    g.the = Math.max(0, (g.the ?? 0) - dt);
    g.hoiThe = (g.hoiThe ?? THE_CHU_KY) - dt;
    if ((g.soHo ?? 0) > 0) g.the = 0;
    else if (g.hoiThe <= 0 && !g.chieu && !g.mau) {
      g.hoiThe = THE_CHU_KY;
      g.the = THE_KEO_DAI;
      this.chuGa({ id: this.id++, x: g.x, y: g.y - 360, text: '🛡 THẾ PHÒNG THỦ!', mau: '#7fd4ff', t: 0 });
    }
    g.hoiMau = Math.max(0, (g.hoiMau ?? MAU_CHU_KY) - dt);
    // Màu chỉ bật khi đến lượt, không đang Lao / Bay, không đang đổi màu khác và đã nghỉ đủ; chưa bật được thì chờ. Gà mẹ phụ chuyên Lao / Bay không có màu.
    const dsMau = dsMauCua(g);
    if (dsMau.length && g.hoiMau <= 0 && !g.mau && !g.chieu && g.daDe && (g.choChieu ?? 0) <= 0 && (g.nghiChung ?? 0) <= 0) {
      g.hoiMau = dsMau.length === 1 ? MAU_CHU_KY_CHUYEN : MAU_CHU_KY;
      g.mau = dsMau[(g.luotMau ?? 0) % dsMau.length];
      g.luotMau = (g.luotMau ?? 0) + 1;
      g.conMau = MAU_KEO_DAI;
      g.dot = 0;
      this.chuGa({
        id: this.id++, x: g.x, y: g.y - 360, t: 0,
        text: g.mau === 'den' ? '⚫ PHẢN ĐÒN!' : g.mau === 'vang' ? '🟡 MIỄN ĐÒN!' : '🔥 ĐỐT CHÁY!',
        mau: g.mau === 'den' ? '#c77dff' : g.mau === 'vang' ? '#ffd23f' : '#ff6a3c',
      });
    }
    if (g.mau !== 'do') return;
    g.dot = (g.dot ?? 0) - dt;
    if (g.dot > 0) return;
    g.dot = DOT_NHIP;
    for (const n of this.nguoi) {
      if (this.khuat(n) || n.nv.khoa) continue;
      const dx = (n.x - g.x) / DOT_BAN_KINH;
      const dy = (n.y - g.y) / (DOT_BAN_KINH * EP_GA);
      if (dx * dx + dy * dy < 1) this.nhanSatThuong(n, (DOT_SAT + (g.satThem ?? 0)) * DOT_NHIP, true, '#ff8a3c');
    }
  }

  // Độ cao của gà tướng: chiêu Bay nâng lên lúc báo hiệu, giữ độ cao khi bay, hạ xuống khi nghỉ
  private doCaoTuong(g: Ga): number {
    const c = g.chieu;
    if (!c || c.loai !== 'bay') return 0;
    const k = c.pha === 'bao' ? c.t / CHIEU_BAO : c.pha === 'chay' ? 1 : 1 - c.t / CHIEU_NGHI;
    return BAY_DO_CAO * kep(k, 0, 1) + (c.pha === 'chay' ? Math.sin(g.phase * 10) * 12 : 0);
  }

  private nghiChieu(g: Ga, c: ChieuTuong): void {
    c.pha = 'nghi';
    c.t = 0;
    g.vx = g.vy = 0;
    // Mệt sau khi lao / bay: lộ sơ hở, không né được đòn nào trong SO_HO giây
    g.soHo = SO_HO;
    this.chuGa({ id: this.id++, x: g.x, y: g.y - 360, t: 0, text: '😵 SƠ HỞ!', mau: '#7ee787' });
  }

  // Chọn chiêu lao / bay khi thấy mục tiêu đủ xa; bắt đầu từ pha báo hiệu. Trả về true nếu đã bắt đầu.
  private batDauChieu(g: Ga, muc: NguoiChoi, d: number): boolean {
    if (!this.gaTrenCam(g) || !g.daDe || (g.choChieu ?? 0) > 0 || (g.nghiChung ?? 0) > 0 || g.mau || (dsMauCua(g).length && (g.hoiMau ?? 1) <= 0)) return false;
    const sanLao = duocLao(g) && (g.hoiLao ?? 0) <= 0;
    const sanBay = duocBay(g) && (g.hoiBay ?? 0) <= 0;
    let loai: 'lao' | 'bay' | null = null;
    if (sanBay && d > CHIEU_XA) loai = 'bay';
    else if (sanLao && d > CHIEU_TOI_THIEU) loai = 'lao';
    else if (sanBay && d > CHIEU_TOI_THIEU) loai = 'bay';
    if (!loai) return false;
    g.chieu = { loai, pha: 'bao', t: 0, ux: 0, uy: 0, quang: 0, trung: [false, false] };
    if (loai === 'lao') g.hoiLao = hoiLaoCua(g);
    else g.hoiBay = hoiBayCua(g);
    g.vx = g.vy = 0;
    g.lat = muc.x < g.x;
    g.doiHuong = 0;
    return true;
  }

  // Lao / bay: báo hiệu → khoá mục tiêu rồi chạy thẳng (không đổi hướng) → nghỉ
  private chayChieu(g: Ga, c: ChieuTuong, dt: number): void {
    c.t += dt;
    if (c.pha === 'bao') {
      g.vx = g.vy = 0;
      let muc: NguoiChoi | null = null;
      let gan = Infinity;
      for (const n of this.nguoi) {
        if (this.khuat(n)) continue;
        const d = hyp(n.x - g.x, n.y - g.y);
        if (d < gan) { gan = d; muc = n; }
      }
      if (!muc) {
        g.chieu = null;
        return;
      }
      // Trong lúc báo hiệu vệt đỏ bám theo mục tiêu; hết báo hiệu thì khoá hướng và phóng
      c.ux = (muc.x - g.x) / (gan || 1);
      c.uy = (muc.y - g.y) / (gan || 1);
      c.quang = Math.min(gan + CHIEU_QUANG_THEM, CHIEU_QUANG_TOI_DA);
      g.lat = c.ux < 0;
      if (c.t < CHIEU_BAO) return;
      c.pha = 'chay';
      c.t = 0;
      return;
    }
    if (c.pha === 'chay') {
      // Tốc độ thật (px/s); vx, vy tính theo tốc độ gốc nên chia HE_SO_TOC_GA để áp lại ở capNhatGa()
      const thuc = c.loai === 'lao' ? TOC_LAO_THAT : TOC_BAY_THAT;
      g.vx = (c.ux * thuc) / HE_SO_TOC_GA;
      g.vy = (c.uy * thuc) / HE_SO_TOC_GA;
      c.quang -= thuc * dt;
      this.chamChieu(g, c);
      if (c.quang <= 0) this.nghiChieu(g, c);
      return;
    }
    g.vx = g.vy = 0;
    if (c.t >= CHIEU_NGHI) {
      g.chieu = null;
      g.nghiChung = CHIEU_NGHI_CHUNG;
    }
  }

  // Đang lao / bay mà chạm nhân vật thì gây sát thương gấp LAO_SAT / BAY_SAT (mỗi nhân vật một lần mỗi đợt), nhân vật vẫn né được
  private chamChieu(g: Ga, c: ChieuTuong): void {
    this.nguoi.forEach((n, p) => {
      if (c.trung[p] || this.khuat(n) || n.nv.khoa) return;
      if (hyp(n.x - g.x, n.y - g.y) >= CHAM_GA.boss) return;
      c.trung[p] = true;
      this.nhanSatThuong(n, satGa(g) * (c.loai === 'lao' ? LAO_SAT : BAY_SAT));
    });
  }

  /** Chọn VAY_TOI_DA tướng gà gần nhân vật (còn thấy được) nhất được phép đuổi / vây đánh; con đang Lao / Bay giữ nguyên chỗ */
  private chonVay(dt: number): void {
    this.henVay -= dt;
    if (this.henVay > 0) return;
    this.henVay = VAY_NHIP;
    const ds: { id: number; d: number }[] = [];
    for (const g of this.ga) {
      if (g.chet || g.loai !== 'boss' || g.goc) continue;
      let d = Infinity;
      for (const n of this.nguoi) if (!this.khuat(n)) d = Math.min(d, hyp(n.x - g.x, n.y - g.y));
      ds.push({ id: g.id, d: g.chieu ? -1 : d });
    }
    ds.sort((a, b) => a.d - b.d);
    this.vay = new Set(ds.slice(0, VAY_TOI_DA).map((x) => x.id));
  }

  private dieuTuong(g: Ga, dt: number): void {
    if (g.chieu) {
      this.chayChieu(g, g.chieu, dt);
      return;
    }
    // Ngoài nhóm vây: không đuổi, nhân vật lại gần (trong VAY_TRANH) thì lùi ra xa, không thì lang thang
    if (!this.vay.has(g.id)) {
      let gan = VAY_TRANH;
      let muc: NguoiChoi | null = null;
      for (const n of this.nguoi) {
        if (this.khuat(n)) continue;
        const d = hyp(n.x - g.x, n.y - g.y);
        if (d < gan) { gan = d; muc = n; }
      }
      if (muc) {
        const d = gan || 1;
        g.vx = ((g.x - muc.x) / d) * TOC_DO_TUONG * VAY_LUI_TOC;
        g.vy = ((g.y - muc.y) / d) * TOC_DO_TUONG * VAY_LUI_TOC;
        g.lat = g.vx < 0;
        g.doiHuong = 0;
        return;
      }
      g.doiHuong -= dt;
      if (g.doiHuong <= 0) {
        g.doiHuong = ngauNhien(2, 5);
        const goc = ngauNhien(0, Math.PI * 2);
        const v = Math.random() < 0.25 ? 0 : TOC_DO_TUONG * 0.6;
        g.vx = Math.cos(goc) * v;
        g.vy = Math.sin(goc) * v;
      }
      return;
    }
    // Thấy nhân vật trong tầm nhìn gấp 3 thì đuổi người gần nhất, không thì đi loanh quanh
    // Đã đủ ME_PHU_TOI_DA tướng gà: tìm Mabu / Zinbu khắp vườn và đi ăn táo đỏ / socola khắp vườn
    let muc: NguoiChoi | null = null;
    let gan = TAM_NHIN_TUONG;
    for (const n of this.nguoi) {
      if (this.khuat(n)) continue;
      const d = hyp(n.x - g.x, n.y - g.y);
      if (d < gan || (this.dayPhu && trongVuon(n.x, n.y) && (!muc || d < gan))) { gan = d; muc = n; }
    }
    // Nhân vật chưa vào tầm đánh mà có socola trong tầm ngửi thì đi ăn socola trước
    const soc = this.socolaGan(g, this.dayPhu);
    if (soc && (!muc || gan > TAM_LAO)) {
      const d = hyp(soc.x - g.x, soc.y - g.y) || 1;
      g.vx = ((soc.x - g.x) / d) * TOC_DO_TUONG * 2;
      g.vy = ((soc.y - g.y) / d) * TOC_DO_TUONG * 2;
      g.lat = g.vx < 0;
      g.doiHuong = 0;
      return;
    }
    if (muc) {
      if (this.batDauChieu(g, muc, gan)) return;
      const dx = muc.x - g.x;
      const dy = muc.y - g.y;
      const d = hyp(dx, dy) || 1;
      const v = d > 260 ? TOC_DO_TUONG * (1 + this.chang * 0.25) : 0;
      g.vx = (dx / d) * v;
      g.vy = (dy / d) * v;
      g.lat = dx < 0;
      g.doiHuong = 0;
      return;
    }
    g.doiHuong -= dt;
    if (g.doiHuong <= 0) {
      g.doiHuong = ngauNhien(2, 5);
      const goc = ngauNhien(0, Math.PI * 2);
      const v = Math.random() < 0.25 ? 0 : TOC_DO_TUONG * 0.6;
      g.vx = Math.cos(goc) * v;
      g.vy = Math.sin(goc) * v;
    }
  }

  // ─── Bắn & tính điểm ───

  // Biến mây: đếm giờ hiệu lực, hết thì biến lại và bắt đầu chờ hồi
  private capNhatMay(n: NguoiChoi, dt: number): void {
    const m = n.may;
    if (m.dang) {
      m.con -= dt;
      if (m.con <= 0) {
        m.dang = false;
        m.con = 0;
        m.hoi = MAY_HOI;
        n.nv.raMay();
      }
    } else if (m.hoi > 0) m.hoi = Math.max(0, m.hoi - dt);
  }

  private thieuMana(n: NguoiChoi): void {
    n.hoiChieu = 0.4;
    this.chu.push({ id: this.id++, x: n.x, y: n.y - 220, text: 'HẾT MANA!', mau: '#2fa8ff', t: 0 });
  }

  private vaoMay(n: NguoiChoi): boolean {
    if (n.may.dang || n.may.hoi > 0 || n.bay || n.nv.khoa || n.nv.laMay) return false;
    n.may.dang = true;
    n.may.con = MAY_THOI_GIAN;
    n.nv.vaoMay();
    return true;
  }

  // Mây quét qua: mọi con gà (kể cả gà bay) chạm vùng mây đều dính đòn
  private mayQuet(n: NguoiChoi, p: number): void {
    if (!n.may.dang) return;
    for (const g of this.ga) {
      if (g.chet) continue;
      const boss = g.loai === 'boss';
      const rx = MAY_RX + (boss ? MAY_NHAN_TUONG.x : 0);
      const ry = MAY_RY + (boss ? MAY_NHAN_TUONG.y : 0);
      if (((g.x - n.x) / rx) ** 2 + ((g.y - (n.y - MAY_NANG)) / ry) ** 2 >= 1) continue;
      if (boss) {
        if ((g.chamMay ?? 0) > this.t) continue;
        g.chamMay = this.t + MAY_NHIP;
      }
      this.vet.push({ id: this.id++, x: g.x, y: this.tamGa(g).y, t: 0, loai: 'no' });
      // Gà mẹ đang là socola (Zinbu) mà dính mây (Mabu): chỉ combo được MỘT lần mỗi lần hoá socola, mất luôn 30% máu tối đa, từ 30% trở xuống thì chết luôn; các nhịp mây sau đó tính như thường
      if (boss && (g.socola ?? 0) > 0 && !g.comboSoc) {
        g.comboSoc = true;
        this.comboSocolaMay(g, p);
        continue;
      }
      this.trungGa(g, p, SAT_MAY);
    }
    for (const c of this.cell) {
      if (c.chet || (c.chamMay ?? 0) > this.t) continue;
      const tam = this.tamCell(c);
      if (((tam.x - n.x) / (MAY_RX + 40)) ** 2 + ((tam.y - (n.y - MAY_NANG)) / (MAY_RY + 40)) ** 2 >= 1) continue;
      c.chamMay = this.t + MAY_NHIP;
      this.vet.push({ id: this.id++, x: c.x, y: tam.y, t: 0, loai: 'no' });
      // Cell bạo nộ đang là socola (Zinbu) mà dính mây (Mabu): combo MỘT lần mỗi lần hoá socola, mất luôn 30% máu tối đa, xuyên giáp
      if ((c.socola ?? 0) > 0 && !c.comboSoc) {
        c.comboSoc = true;
        this.chu.push({ id: this.id++, x: tam.x, y: tam.y - 160, text: '💥 COMBO SOCOLA + MÂY!', mau: '#ff9f1a', t: 0 });
        this.rungMan(0.3, 12);
        this.dungKhung(0.12);
        this.trungCell(c, p, Math.round(cellHpMax(c) * CELL_SOCOLA_MAY), true);
        continue;
      }
      this.trungCell(c, p, SAT_MAY);
    }
    const gy = this.ginyu;
    if (!gy.chet && (gy.chamMay ?? 0) <= this.t) {
      const tam = this.tamGy();
      if (((tam.x - n.x) / (MAY_RX + 60)) ** 2 + ((tam.y - (n.y - MAY_NANG)) / (MAY_RY + 60)) ** 2 < 1) {
        gy.chamMay = this.t + MAY_NHIP;
        this.vet.push({ id: this.id++, x: gy.x, y: tam.y, t: 0, loai: 'no' });
        this.trungGy(p, SAT_MAY);
      }
    }
    const fz = this.frieza;
    if (!fz.chet && (fz.chamMay ?? 0) <= this.t) {
      const tam = this.tamFz();
      if (((tam.x - n.x) / (MAY_RX + 60)) ** 2 + ((tam.y - (n.y - MAY_NANG)) / (MAY_RY + 60)) ** 2 < 1) {
        fz.chamMay = this.t + MAY_NHIP;
        this.trungFz(p, SAT_MAY);
      }
    }
  }

  private comboSocolaMay(g: Ga, p: number): void {
    const t = this.tamGa(g);
    const nguong = hpToiDa(g) * SOCOLA_MAY_MAT;
    g.hp = g.hp <= nguong ? 0 : g.hp - nguong;
    this.vet.push({ id: this.id++, x: g.x, y: t.y, t: 0, loai: 'chay', co: 1.1 });
    this.chu.push({ id: this.id++, x: t.x + ngauNhien(-40, 40), y: t.y - 90, text: g.hp > 0 ? '🍫☁ -30%!' : '🍫☁ NGHIỀN NÁT!', mau: '#c98a4b', t: 0 });
    this.trungTuong(g, p);
  }

  // Nhóm Đấm: 1 viên · Đá: 2 viên tản (cả hai miễn phí, trúng thì hồi mana) · Chiêu đặc biệt: 1 chưởng xuyên rồi nổ (MANA_CHUONG) · nhóm 3: Biến mây / socola (MANA_DAC_BIET).
  private ban(p: number, x: number, y: number): void {
    const n = this.nguoi[p];
    // Trong mê cung bom chỉ có bom (mcNem / mcKichNo), không có đòn thường
    if (this.oMeCung(p) || this.biDung(p)) return;
    if (n.hoiChieu > 0 || n.nv.khoa || n.het || this.trongCau(p) || this.trongPt(p) || this.biNhap(p)) return;
    // Trên máy bay: đấm / đá bình thường; bắn chưởng (Chiêu đặc biệt / socola) thì máy bay nổ; không biến mây
    const tren = this.trongMb(p);
    const nhom = n.nv.nhom;
    // Nhóm 3: Mabu biến mây, Zinbu biến socola
    const nhomMay = !!n.nv.sp.nhomDon[nhom]?.may;
    // Super Bư: nhóm 3 là chiêu Bóng ma (bắn con ma nổ to, hồi bằng hoiSoc như socola)
    const ma = nhom === NHOM_MAY && !!n.nv.sp.nhomDon[nhom]?.ma;
    const soc = nhom === NHOM_MAY && !nhomMay && !ma;
    if (tren && nhomMay) return;
    const chieu = nhom === 2 || soc || ma;
    // Chiêu đặc biệt (chưởng) tốn MANA_CHUONG, Biến mây / socola tốn MANA_DAC_BIET; Đấm / Đá miễn phí (còn hồi mana khi trúng)
    const phi = nhom === 2 ? MANA_CHUONG : nhom === NHOM_MAY ? MANA_DAC_BIET : 0;
    if (nhomMay) {
      if (!n.may.dang && n.may.hoi <= 0 && !n.bay && n.mana < phi) return this.thieuMana(n);
      if (this.vaoMay(n)) n.mana -= phi;
      return;
    }
    if (n.may.dang) return;
    // Biến socola đang hồi: không ra chiêu (các đòn khác vẫn dùng bình thường)
    if ((soc || ma) && n.hoiSoc > 0) return;
    if (n.mana < phi) return this.thieuMana(n);
    n.mana -= phi;
    if (soc) n.hoiSoc = SOCOLA_HOI;
    if (ma) n.hoiSoc = MA_HOI;
    // Thời gian hồi giữa 2 đòn theo nhóm (không phụ thuộc độ dài animation); combo cao thì chưởng hồi nhanh hơn.
    // Socola chỉ chặn đòn kế tiếp 0,5s (đủ cho animation); hồi chiêu socola nằm ở hoiSoc
    const giamHoi = nhom === 2 && n.combo >= COMBO_GIAM_HOI ? COMBO_HOI_CHUONG : 1;
    n.hoiChieu = soc || ma ? 0.5 : (chieu ? 0.5 * giamHoi : n.nv.nhom === 1 ? 0.32 : n.dangDi ? 0.3 : 0.2) * 2;
    const sbChuong = nhom === 2 && this.hopThe?.chu === p;
    if (sbChuong) n.hoiChieu = SB_CHUONG_HOI;
    if (!n.dangDi) {
      n.nv.lat = x < n.x;
      n.nv.huong = 'ngang';
    }
    if (!n.bay) n.nv.raDon(this.t);
    this.am.phat(chieu ? 'chuong' : nhom === 1 ? 'da' : 'dam');

    // Giới hạn tầm theo đòn vừa ra: chuột trỏ xa hơn tầm thì đòn dừng ở mép tầm đánh
    const tam = soc || ma ? TAM_SOCOLA : chieu ? TAM_CHIEU * (sbChuong ? SB_TAM_GAP : 1) : TAM_DON[n.nv.donVuaRa ?? ''] ?? (n.nv.nhom === 1 ? TAM_DA_GAN : TAM_DAM_GAN);
    const ddx = x - n.x;
    const ddy = y - n.y;
    const dd = hyp(ddx, ddy);
    if (dd > tam) {
      x = n.x + (ddx / dd) * tam;
      y = n.y + (ddy / dd) * tam;
    }

    const tay = this.viTriTay(p);
    // Đòn ăn: Zinbu quất râu → socola, Mabu bắn chưởng → socola hồng
    const an: Dan['an'] = !soc && n.nv.donVuaRa === DON_AN[n.nv.sp.ten] ? (n.nv.sp.ten === 'Mabu' ? 'hong' : 'soc') : undefined;
    const tanX = n.dangDi ? ngauNhien(-18, 18) : 0;
    const tanY = n.dangDi ? ngauNhien(-14, 14) : 0;
    const sb = this.hopThe?.chu === p;
    const lech = [...(n.nv.nhom === 1 ? [-28, 28] : [0]), ...(this.dangChum(p) && !ma ? [-70, 70] : [])];
    lech.forEach((dx, i) => {
      const x1 = x + tanX + dx;
      const y1 = y + tanY + Math.abs(dx) * 0.3;
      const T = hyp(x1 - tay.x, y1 - tay.y) / (chieu ? TOC_DO_DAN * 0.55 : TOC_DO_DAN);
      this.dan.push({ id: this.id++, p, x0: tay.x, y0: tay.y, x1, y1, t: 0, T, phu: i > 0, to: chieu && i === 0, sat: soc ? SAT_SOCOLA : this.satNv(p, nhom), soc: soc && i === 0, nhom, an, vg: n.ki === 2 && !soc && !sb, sb: sb && !ma, ma: ma && i === 0 });
    });
    if (tren && chieu) this.trungMb();
  }

  // Thanh đen bên trái (Mabu) / bên phải (Zinbu) map: x giữa thanh, và tâm nửa vòng tròn chứa nhân vật (nằm đúng ở góc dưới map như cũ)
  xThanh(p: number): number {
    return p === 0 ? -SIDE / 2 : this.W + SIDE / 2;
  }

  tamNv(p: number) {
    return { x: p === 0 ? 0 : this.W, y: H };
  }

  // Các nút chiêu xếp dọc trong thanh đen, từ dưới lên trên (Đấm sát đáy); máu nằm ngay phía trên nút trên cùng
  nutBang(p: number): { k: number; x: number; y: number }[] {
    return this.dsBieuTuong(p).map((k, i) => ({ k, x: this.xThanh(p), y: H - 50 - i * 70 }));
  }

  // Dòng số máu nằm trên nút chiêu trên cùng; thanh máu nằm ngay dưới dòng này
  yMauNv(p: number): number {
    return H - 50 - (this.dsBieuTuong(p).length - 1) * 70 - 62;
  }

  // Đấm, Đá luôn dùng được; Chiêu đặc biệt cần MANA_CHUONG, Biến mây / socola cần MANA_DAC_BIET (Mây còn mờ khi đang chạy / đang hồi, socola mờ khi đang hồi)
  hetMana(p: number, k: number): boolean {
    // Mê cung bom: 3 nút bom luôn dùng được
    if (this.oMeCung(p)) return false;
    const n = this.nguoi[p];
    if (k === 2) return n.mana < MANA_CHUONG;
    // Nhân vật không có nhóm này (Vegeta không có chiêu riêng thứ 4)
    if (k >= n.nv.sp.nhomDon.length) return true;
    if (k === NHOM_MAY) return n.mana < MANA_DAC_BIET || (n.nv.sp.nhomDon[k]?.may ? n.may.dang || n.may.hoi > 0 : n.hoiSoc > 0);
    return false;
  }

  tenNhom(p: number): string {
    const nv = this.nguoi[p].nv;
    return nv.nhom === 2 ? TEN_DON[nv.donVong(this.t)] ?? nv.tenNhom : nv.tenNhom;
  }

  // kieu = nhóm đòn (0 Đấm · 1 Đá · 2 Chiêu đặc biệt; bỏ trống cho mây / socola). Trả về true nếu đòn thật sự trúng (không né / miss / phản)
  private trungGa(g: Ga, p: number, sat: number, kieu?: number, soc = false): boolean {
    // Sức mạnh nhân vật (ăn gà mẹ socola) nhân sát thương mọi đòn
    sat = sat * (this.nguoi[p]?.suc ?? 1) + (this.nguoi[p]?.satDau ?? 0);
    // Vua gà đang chạy trốn nhanh thì bất tử: mọi đòn đều vô hiệu
    if (g.loai === 'boss' && g.goc && (g.tron ?? 0) > 0) {
      const t = this.tamGa(g);
      this.chu.push({ id: this.id++, x: t.x + ngauNhien(-40, 40), y: t.y - 80, text: 'BẤT TỬ!', mau: '#ffd23f', t: 0 });
      return false;
    }
    if (g.loai === 'boss' && g.mau) {
      const n = this.nguoi[p];
      const t = this.tamGa(g);
      if (g.mau === 'vang') {
        // Màu vàng: mọi đòn đều trượt
        this.chu.push({ id: this.id++, x: t.x + ngauNhien(-40, 40), y: t.y - 80, text: 'MISS', mau: '#ffd23f', t: 0 });
        n.combo = 0;
        n.banTruot++;
        return false;
      }
      if (g.mau === 'den') {
        // Màu đen: không bị thương, phản lại 100% sát thương cho người đánh (mây không nhận sát thương nên không bị phản)
        this.chu.push({ id: this.id++, x: t.x + ngauNhien(-40, 40), y: t.y - 80, text: 'PHẢN!', mau: '#c77dff', t: 0 });
        if (!n.het && !n.nv.laMay) this.nhanSatThuong(n, sat + (g.satThem ?? 0), true);
        return false;
      }
    }
    if (Math.random() < neGa(g)) {
      const t = this.tamGa(g);
      this.chu.push({ id: this.id++, x: t.x + ngauNhien(-40, 40), y: t.y - 80, text: 'NÉ!', mau: '#9be7ff', t: 0 });
      return false;
    }
    let mat = Math.round(sat * (1 - GIAM_GA[g.loai]));
    if (g.loai === 'rooster' && (g.kiet ?? 0) > 0) mat = Math.round(mat * DO_NHAN);
    if (g.loai === 'boss') {
      // Mỗi đòn chỉ trừ tối đa TUONG_NHAN_TOI_DA; lúc sơ hở (vừa Lao / Bay xong) thì nhận ×SO_HO_NHAN
      mat = Math.min(mat, TUONG_NHAN_TOI_DA);
      if ((g.soHo ?? 0) > 0) {
        mat *= SO_HO_NHAN;
        const t = this.tamGa(g);
        this.chu.push({ id: this.id++, x: t.x + ngauNhien(-40, 40), y: t.y - 120, text: `CƠ HỘI x${SO_HO_NHAN}!`, mau: '#7ee787', t: 0 });
      }
    }
    const hp0 = g.hp;
    g.hp -= mat;
    if (g.loai === 'boss') {
      const t = this.tamGa(g);
      this.chu.push({ id: this.id++, x: t.x + ngauNhien(-60, 60), y: t.y - 50, text: `-${mat}`, mau: '#ffffff', t: 0 });
      this.trungTuong(g, p);
      return true;
    }
    const n = this.nguoi[p];
    const tam = this.tamGa(g);
    if (g.hp > 0) {
      g.nhay = 0.15;
      n.banTrung++;
      this.chu.push({ id: this.id++, x: tam.x, y: tam.y - 30, text: `-${mat}`, mau: '#ffffff', t: 0 });
      // Đá hất gà con lùi ra xa và làm choáng ngắn
      if (kieu === 1) {
        const nv = this.nguoi[p];
        const dx = g.x - nv.x;
        const dy = g.y - nv.y;
        const dd = hyp(dx, dy) || 1;
        g.choang = DA_CHOANG;
        g.day = { vx: (dx / dd) * DA_DAY, vy: (dy / dd) * DA_DAY };
        g.vx = g.vy = 0;
      }
      return true;
    }
    g.hp = 0;
    g.chet = true;
    g.h0 = g.h;
    // Zinbu yếu hơn: mọi đòn thường (Đấm, Đá, chưởng) hạ gà con thì gà thành thanh socola, ăn nhận AN_TI_LE[1] (5%) máu tối đa của gà
    // Chiêu Biến socola mà đủ giết: gà biến hẳn thành thanh socola (không giữ hình gà), ăn nhận SOCOLA_AN_TI_LE máu lúc đó
    if (soc || (this.nguoi[p]?.ki === 1 && kieu !== undefined)) {
      const v = { x: g.x, y: g.y };
      giuTrongMap(v, LE_VP);
      const luong = soc ? Math.max(1, Math.round(Math.max(0, hp0) * SOCOLA_AN_TI_LE)) : Math.max(1, Math.round(HP_GA * (g.suc ?? 1) * AN_TI_LE[1]!));
      if (soc) g.tChet = 1;
      this.vatPham.push({ id: this.id++, x: v.x, y: v.y, t: 0, loai: 'socola', luong, hpGa: hpToiDa(g) });
      this.vet.push({ id: this.id++, x: g.x, y: tam.y, t: 0, loai: 'chay', co: 0.7 });
      this.chu.push({ id: this.id++, x: tam.x, y: tam.y - 60, text: '🍫 HOÁ SOCOLA!', mau: '#c98a4b', t: 0 });
    } else {
      for (let i = 0; i < 9; i++) {
        this.long.push({
          id: this.id++, x: tam.x, y: tam.y, vx: ngauNhien(-220, 220), vy: ngauNhien(-260, 40),
          xoay: ngauNhien(0, 360), vxoay: ngauNhien(-400, 400), t: 0, mau: MAU_LONG[g.loai],
        });
      }
    }
    n.combo++;
    n.banTrung++;
    const hs = this.heSo(p);
    const nhan = hs > 1 ? ` x${hs}` : '';
    const diem = DIEM[g.loai] * (g.suc ?? 1) * hs;
    this.congDiem(p, diem, tam.x, tam.y - 30, `+${diem}${nhan}`);
    if (n.combo > 0 && n.combo % 5 === 0 && hs > 1) {
      this.chu.push({ id: this.id++, x: tam.x, y: tam.y - 70, text: `${n.ten} COMBO x${hs}!`, mau: '#ff9f1a', t: 0 });
    }
    return true;
  }

  // Gà tướng: máu đã bị trừ ở trungGa (sau khi giảm sát thương), hết máu mới ngã
  private trungTuong(g: Ga, p: number): void {
    const n = this.nguoi[p];
    const tam = this.tamGa(g);
    const hs = this.heSo(p);
    g.nhay = 0.15;
    n.combo++;
    n.banTrung++;
    const rai = (soLuong: number) => {
      for (let i = 0; i < soLuong; i++) {
        this.long.push({
          id: this.id++, x: tam.x + ngauNhien(-60, 60), y: tam.y + ngauNhien(-60, 40),
          vx: ngauNhien(-320, 320), vy: ngauNhien(-340, 60), xoay: ngauNhien(0, 360), vxoay: ngauNhien(-400, 400),
          t: 0, mau: MAU_LONG_TUONG[i % 3],
        });
      }
    };
    if (g.hp > 0) {
      rai(5);
      this.congDiem(p, DIEM_DANH_TUONG * hs, tam.x + ngauNhien(-40, 40), tam.y - 80, `+${DIEM_DANH_TUONG * hs}`);
      return;
    }
    g.hp = 0;
    g.chet = true;
    g.h0 = 0;
    g.socola = 0;
    rai(40);
    this.am.phat('meChet');
    this.rungMan(0.6, 14);
    this.dungKhung(0.18);
    // Cháy nổ khi gà mẹ chết
    this.vet.push({ id: this.id++, x: g.x, y: tam.y, t: 0, loai: 'chay', co: 2.4 });
    this.vet.push({ id: this.id++, x: g.x - 90, y: tam.y + 40, t: 0, loai: 'chay', co: 1.4 });
    this.vet.push({ id: this.id++, x: g.x + 90, y: tam.y - 40, t: 0, loai: 'chay', co: 1.4 });
    if (g.goc) {
      // Ngọc rồng 1 sao trên vương miện rơi xuống đất
      this.vatPham.push({ id: this.id++, x: g.x, y: g.y, t: 0, loai: 'ngoc' });
      this.chu.push({ id: this.id++, x: g.x, y: tam.y - 160, text: '⭐ NGỌC RỒNG RƠI!', mau: '#ffb347', t: 0 });
      // Gà mẹ gốc: chỉ hồi sinh sau khi chết, chờ đủ CHO_TUONG giây kể từ lúc chết
      this.henTuong = CHO_TUONG;
      this.congDiem(p, DIEM.boss * hs, tam.x, tam.y - 110, `+${DIEM.boss * hs} HẠ GÀ TƯỚNG!`);
      // Hạ được gà mẹ gốc thì nhân vật còn sống được hồi máu
      this.nguoi.forEach((m) => {
        if (!m.het) this.hoiMau(m, HOI_MAU_TUONG);
      });
    } else {
      // Gà mẹ phụ: chết hẳn, chỉ thưởng điểm
      this.congDiem(p, DIEM_PHU * hs, tam.x, tam.y - 110, `+${DIEM_PHU * hs} HẠ GÀ MẸ PHỤ!`);
    }
    // Mừng chiến thắng: hai nhân vật tự bắn chưởng lên trời
    this.nguoi.forEach((_, q) => this.chuongLenTroi(q));
  }

  // ─── Bóng ma Goku canh núi đá (biến `ginyu`) ───
  // Vòng lặp: bóng ma (bất khả xâm phạm, không đánh ai) gặp Mabu / Zinbu → khiêu khích GY_KHIEU_T giây → lao vào người nhiều máu × sức mạnh nhất
  // (bám theo, quãng tối đa GY_LAO_QUANG) → trúng thì thành bản sao y hệt người đó GY_SAO_T giây (80% chỉ số, đánh Mabu / Zinbu mỗi 1–4s)
  // → trở lại bóng ma, lặp lại. Chỉ chết khi đang là bản sao và bị đánh hết máu.

  /** Đang là bản sao của một nhân vật (còn sống) */
  get gySao(): boolean {
    return !!this.ginyu.sao && !this.ginyu.chet;
  }

  /** Tâm thân (trúng đòn, chữ bay): bản sao đứng dưới đất như nhân vật, bóng ma lơ lửng cao hơn */
  tamGy() {
    const g = this.ginyu;
    return { x: g.x, y: g.y - (g.sao ? GY_SAO_TAM : GY_TAM_CAO) };
  }

  /** Điểm (x, y) cách tâm thân dưới r (so hộp trước cho rẻ). Dạng bóng ma thì mọi đòn xuyên qua (không ai đánh được) */
  private gyGan(x: number, y: number, r: number): boolean {
    if (!this.ginyu.sao) return false;
    const t = this.tamGy();
    const dx = x - t.x, dy = y - t.y;
    return Math.abs(dx) < r && Math.abs(dy) < r && dx * dx + dy * dy < r * r;
  }

  /** Nhân vật p là mục tiêu hợp lệ: đang chơi, không gục / mây / trong cầu / trên máy bay, đứng trong núi đá (cộng lề GY_NUI_LE) */
  private gyHopLe(p: number): boolean {
    const n = this.nguoi[p];
    return !!n && !n.vang && !this.khuat(n) && (this.gyTruy || trongNui(n.x, n.y, GY_NUI_LE));
  }

  /** Bản sao / bóng ma được đứng ở (x, y): trên núi đá; đang truy sát thì mọi chỗ trên đất (đảo, vườn gà, thần điện) */
  private gyDuocDi(x: number, y: number): boolean {
    return this.gyTruy ? trongVuon(x, y) || doSau(x, y) > 0 : trongNui(x, y);
  }

  /** Kẹp bóng ma / bản sao trong map: trên núi theo đảo; đang truy sát thì theo vùng đang đứng (vào được vườn gà), bay thì qua được vực */
  private gyGiu(le: Le, bay = false): void {
    giuTrongMap(this.ginyu, le, bay, this.gyTruy ? vungCua(this.ginyu) : 'dao');
  }

  /** Bóng ma nhận ra nhân vật p ở bất kỳ đâu trên núi đá (chống câu giờ): chỉ cần hợp lệ */
  private gyThay(p: number): boolean {
    return this.gyHopLe(p);
  }

  // ─── Frieza (thần điện) ───
  // Không ai thì đi tuần quanh điện thờ; nhân vật trên thần điện nhìn thấy Frieza thì Frieza đuổi đánh người gần nhất (đấm khi chạm, xa thì vận chưởng),
  // cứ ~10s biến thành Golden Frieza 15s (mọi chỉ số ×2). Mabu / Zinbu chưa hợp thể đánh không mất máu: phải hợp thể Super Bư (chỉ làm được trên thần điện).

  /** Tâm thân (trúng đòn, chữ bay) */
  tamFz() {
    const f = this.frieza;
    return { x: f.x, y: f.y - (f.bien >= 0 || f.vang > 0 ? FZ_TAM_CAO_VANG : FZ_TAM_CAO) };
  }

  private fzGan(x: number, y: number, r: number): boolean {
    const t = this.tamFz();
    const dx = x - t.x, dy = y - t.y;
    return Math.abs(dx) < r && Math.abs(dy) < r && dx * dx + dy * dy < r * r;
  }

  /** Mục tiêu của Frieza: nhân vật gần nhất đang đứng trên thần điện (đang truy sát fzTruy: ở bất kỳ đâu) (không ẩn / gục / mây / trong máy bay / bị nhập) */
  private fzMuc(): NguoiChoi | null {
    const f = this.frieza;
    let kq: NguoiChoi | null = null, dMin = Infinity;
    for (const n of this.nguoi) {
      if (n.vang || this.khuat(n) || (!this.fzTruy && !trongThan(n.x, n.y))) continue;
      const d = hyp(n.x - f.x, n.y - f.y);
      if (d < dMin) { dMin = d; kq = n; }
    }
    return kq;
  }

  /**
   * Đòn của p trúng Frieza: Mabu / Zinbu (kể cả chưa hợp thể) và Super Bư đều làm mất máu,
   * qua giáp FZ_GIAP, dạng vàng phòng thủ gấp FZ_VANG_GAP (`fzGap()`). Trả true nếu mất máu.
   */
  private trungFz(p: number, sat: number): boolean {
    const f = this.frieza;
    if (f.chet) return false;
    const n = this.nguoi[p];
    const t = this.tamFz();
    const mat = Math.max(1, Math.round(((sat * (n?.suc ?? 1) + (n?.satDau ?? 0)) * (1 - FZ_GIAP)) / fzGap(f)));
    f.hp -= mat;
    f.nhay = 0.15;
    this.chu.push({ id: this.id++, x: t.x + ngauNhien(-30, 30), y: t.y - 100, text: `-${mat}`, mau: '#ffd23f', t: 0 });
    if (n) { n.combo++; n.banTrung++; }
    if (f.hp <= 0) this.fzChet(p);
    return true;
  }

  /** Frieza bị hạ: ngã mờ dần, 3 vụ nổ, rung màn, điểm, cả đội bắn chưởng lên trời. Không hồi sinh */
  private fzChet(p: number): void {
    const f = this.frieza;
    f.chet = true;
    f.hp = 0;
    f.tChet = 0;
    f.bien = -1;
    f.vang = 0;
    f.nap = undefined;
    f.danh = 0;
    const t = this.tamFz();
    for (let k = 0; k < 3; k++) this.vet.push({ id: this.id++, x: t.x + ngauNhien(-90, 90), y: t.y + ngauNhien(-80, 80), t: -k * 0.15, loai: 'chay', co: 1.6 });
    this.rungMan(0.5, 14);
    this.dungKhung(0.18);
    this.am.phat('meChet');
    this.chu.push({ id: this.id++, x: t.x, y: t.y - 220, text: '💥 FRIEZA ĐÃ BỊ HẠ!', mau: '#ffd23f', t: 0 });
    this.congDiem(p, FZ_DIEM, t.x, t.y - 160, `+${FZ_DIEM}`);
    this.nguoi.forEach((_, q) => this.chuongLenTroi(q));
    // Rơi viên ngọc rồng FZ_NGOC_SAO sao tại chỗ Frieza ngã
    if (!this.ngocNhat.includes(FZ_NGOC_SAO) && !this.vatPham.some((v) => v.loai === 'ngoc' && v.sao === FZ_NGOC_SAO)) {
      this.vatPham.push({ id: this.id++, x: f.x, y: f.y, t: 0, loai: 'ngoc', sao: FZ_NGOC_SAO });
      this.chu.push({ id: this.id++, x: t.x, y: t.y - 300, text: `⭐ FRIEZA RƠI NGỌC RỒNG ${FZ_NGOC_SAO} SAO!`, mau: '#ffb347', t: 0 });
    }
  }

  /** Frieza đánh nhau với mục tiêu `muc` (null = hết mục tiêu, chỉ làm nốt chưởng đang vận) */
  private fzChien(muc: NguoiChoi | null, thay: boolean, dt: number): void {
    const f = this.frieza;
    const gs = fzSat(f), gt = fzToc(f);
    f.nghi = 0.1;
    if (f.nap) {
      f.nap.t += dt;
      f.lat = f.nap.x < f.x;
      if (f.nap.t < FZ_CHUONG_NAP) return;
      // Phóng chưởng: chùm thẳng về chỗ mục tiêu lúc bắt đầu vận (chạy ngang để né), dạng vàng chùm vàng, thường chùm tím
      const vang = f.vang > 0;
      const x0 = f.x + (f.lat ? -1 : 1) * (vang ? 90 : 60), y0 = f.y - (vang ? 200 : 110);
      const dx = f.nap.x - x0, dy = f.nap.y - y0, d = hyp(dx, dy) || 1;
      const L = Math.min(FZ_CHUONG_TAM * (vang ? FZ_VANG_TAM_GAP : 1), d + 250);
      this.chuongTiec.push({ id: this.id++, k: vang ? 5 : 4, loai: vang ? 1 : 2, x0, y0, x1: x0 + (dx / d) * L, y1: y0 + (dy / d) * L, t: 0, sat: FZ_CHUONG_SAT * gs, fz: true });
      this.vetGa({ id: this.id++, x: x0, y: y0, t: 0, loai: 'chay', co: 0.6 });
      f.nap = undefined;
      f.choChuong = FZ_CHUONG_HOI / gt;
      return;
    }
    if (!muc) return;
    const dx = muc.x - f.x, dy = muc.y - f.y, d = hyp(dx, dy);
    if (Math.abs(dx) > 5) f.lat = dx < 0;
    if (f.danh > 0) return;
    // Dạng thường: chỉ bắn khi xa hơn FZ_CHUONG_XA; Golden Frieza bắn liên tục khi có thể (gần cũng bắn), tầm gấp FZ_VANG_TAM_GAP
    const vangF = f.vang > 0;
    if (thay && (vangF || d > FZ_CHUONG_XA) && d < FZ_CHUONG_TAM * (vangF ? FZ_VANG_TAM_GAP : 1) && f.choChuong <= 0) {
      f.nap = { t: 0, x: muc.x, y: muc.y - 70 };
      this.chuGa({ id: this.id++, x: f.x, y: f.y - 300, text: f.vang > 0 ? '✨ GOLDEN FRIEZA VẬN CHƯỞNG!' : '💜 FRIEZA VẬN CHƯỞNG!', mau: f.vang > 0 ? '#ffd23f' : '#d9b3ff', t: 0 });
      return;
    }
    // Con Bư chắn đường thì Frieza đấm con Bư (người chơi chưa tới tầm đấm)
    if (d > FZ_CHAM && f.choDanh <= 0 && this.conBu.length) {
      const cb = this.conBuGan(f.x, f.y, FZ_CHAM);
      if (cb) {
        f.choDanh = FZ_HOI / gt;
        f.danh = FZ_DANH_T;
        this.vetGa({ id: this.id++, x: cb.x, y: cb.y - 80, t: 0, loai: 'no' });
        this.conBuNhan(cb, FZ_SAT * gs);
        return;
      }
    }
    if (d <= FZ_CHAM) {
      if (f.choDanh <= 0) {
        f.choDanh = FZ_HOI / gt;
        f.danh = FZ_DANH_T;
        this.vetGa({ id: this.id++, x: muc.x, y: muc.y - 80, t: 0, loai: 'no' });
        this.fzDanhTrung(muc, FZ_SAT * gs, 'ĐẤM');
      }
      return;
    }
    f.nghi = 0;
    // Truy sát ngoài thần điện: bay thẳng (qua vực, qua tường vườn) tốc độ FZ_BAY_TOC × FZ_TRUY_GAP, gần thì chạy tới như thường
    if (this.fzTruy && (!trongThan(muc.x, muc.y) || !trongThan(f.x, f.y))) {
      const toc = (d > FZ_BAY_GAN ? Math.max(FZ_BAY_TOC, FZ_TOC_DANH * gt) : FZ_TOC_DANH * gt) * FZ_TRUY_GAP;
      const b = Math.min(d, toc * dt);
      f.x += (dx / d) * b;
      f.y += (dy / d) * b;
      return;
    }
    const w = this.fzDuongToi(muc.x, muc.y);
    this.fzDuoi(f, w.x, w.y, FZ_TOC_DANH * gt, dt);
    if (Math.abs(dx) > 5) f.lat = dx < 0;
  }

  // Tìm đường cho Frieza trên lưới thần điện (ô FZ_O): ô đi được = trên nền đá và cách vật cản còn nguyên; giá đường (Dijkstra) tới ô của mục tiêu,
  // ô bị chặn vẫn tính nhưng đắt FZ_O_CHAN lần (mục tiêu đứng trong góc kín thì Frieza vẫn tới sát chỗ gần nhất). Tính lại khi mục tiêu sang ô khác
  // (tối đa 2 lần / giây) hoặc khi có vật bị phá. Đuổi khắp thần điện nên phải vòng qua điện thờ / hàng cọ.
  private fzLuoi: Uint8Array | null = null;
  private fzLuoiKhoa = '';
  private fzKc: Int32Array | null = null;
  private fzKcO = -1;
  private fzKcT = -1;

  private fzO(x: number, y: number): number {
    const cot = Math.ceil(THAN.w / FZ_O), hang = Math.ceil(THAN.h / FZ_O);
    const c = Math.floor((x - THAN.x0) / FZ_O), r = Math.floor((y - THAN.y0) / FZ_O);
    return c < 0 || r < 0 || c >= cot || r >= hang ? -1 : r * cot + c;
  }

  /** Điểm kế tiếp Frieza nên đi tới để tới (tx, ty): tâm ô lân cận có giá đường thấp nhất; đã sát mục tiêu thì đi thẳng */
  private fzDuongToi(tx: number, ty: number): { x: number; y: number } {
    const f = this.frieza;
    const cot = Math.ceil(THAN.w / FZ_O), hang = Math.ceil(THAN.h / FZ_O), so = cot * hang;
    const khoa = thanVo.map((v) => (v ? 1 : 0)).join('');
    if (!this.fzLuoi || khoa !== this.fzLuoiKhoa) {
      const l = new Uint8Array(so);
      for (let i = 0; i < so; i++) {
        const v = { x: THAN.x0 + (i % cot + 0.5) * FZ_O, y: THAN.y0 + (Math.floor(i / cot) + 0.5) * FZ_O };
        if (doSau(v.x, v.y) < 40) continue;
        const c = raKhoiChanThan(v, 40);
        l[i] = c.cx || c.cy ? 0 : 1;
      }
      this.fzLuoi = l;
      this.fzLuoiKhoa = khoa;
      this.fzKcO = -1;
    }
    const l = this.fzLuoi;
    const oM = this.fzO(tx, ty), oF = this.fzO(f.x, f.y);
    if (oM < 0 || oF < 0) return { x: tx, y: ty };
    if (!this.fzKc || (oM !== this.fzKcO && this.t - this.fzKcT >= 0.5)) {
      const kc = (this.fzKc ??= new Int32Array(so));
      kc.fill(0x3fffffff);
      kc[oM] = 0;
      // Hàng đợi ưu tiên (đống nhị phân) theo giá
      const dong: number[] = [oM];
      const nho = (i: number, j: number) => kc[dong[i]!]! < kc[dong[j]!]!;
      while (dong.length) {
        const o = dong[0]!, cuoi = dong.pop()!;
        if (dong.length) {
          dong[0] = cuoi;
          for (let i = 0; ;) {
            const a = 2 * i + 1, b = a + 1;
            let m = i;
            if (a < dong.length && nho(a, m)) m = a;
            if (b < dong.length && nho(b, m)) m = b;
            if (m === i) break;
            [dong[i], dong[m]] = [dong[m]!, dong[i]!];
            i = m;
          }
        }
        const c = o % cot, r = (o - c) / cot;
        for (const [dc, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
          const nc = c + dc, nr = r + dr;
          if (nc < 0 || nr < 0 || nc >= cot || nr >= hang) continue;
          const n = nr * cot + nc, g = kc[o]! + (l[n] ? 1 : FZ_O_CHAN);
          if (g >= kc[n]!) continue;
          kc[n] = g;
          dong.push(n);
          for (let i = dong.length - 1; i > 0;) {
            const cha = (i - 1) >> 1;
            if (!nho(i, cha)) break;
            [dong[i], dong[cha]] = [dong[cha]!, dong[i]!];
            i = cha;
          }
        }
      }
      this.fzKcO = oM;
      this.fzKcT = this.t;
    }
    const kc = this.fzKc!;
    if (kc[oF]! <= 1) return { x: tx, y: ty };
    const c = oF % cot, r = (oF - c) / cot;
    let tot = -1, kcTot = kc[oF]!;
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
      if (!dc && !dr) continue;
      const nc = c + dc, nr = r + dr;
      if (nc < 0 || nr < 0 || nc >= cot || nr >= hang) continue;
      // Đi chéo chỉ khi hai ô cạnh đều đi được (không cắt góc vật cản)
      if (dc && dr && (!l[r * cot + nc] || !l[nr * cot + c])) continue;
      const n = nr * cot + nc;
      if (kc[n]! < kcTot) { kcTot = kc[n]!; tot = n; }
    }
    return tot < 0 ? { x: tx, y: ty } : { x: THAN.x0 + (tot % cot + 0.5) * FZ_O, y: THAN.y0 + (Math.floor(tot / cot) + 0.5) * FZ_O };
  }

  /** Bên đang đi vòng vật cản (1 / −1) và thời gian còn giữ bên đó (đuổi khắp thần điện thì hay gặp điện thờ / hàng cọ chắn đường) */
  private fzNe = 1;
  private fzNeT = 0;

  /** Frieza đuổi tới (tx, ty) có đi vòng vật cản: thử hướng thẳng, bị chắn thì xoay lệch dần sang một bên (giữ bên đó một lúc cho qua hẳn góc) */
  private fzDuoi(f: Frieza, tx: number, ty: number, toc: number, dt: number): void {
    const dx = tx - f.x, dy = ty - f.y, d = hyp(dx, dy);
    if (d < 1) return;
    const b = Math.min(d, toc * dt), g0 = Math.atan2(dy, dx), s = this.fzNe;
    this.fzNeT -= dt;
    const thu = this.fzNeT > 0 ? [s * 0.8, s * 1.2, s * 1.6, 0, -s * 0.8, -s * 1.6] : [0, s * 0.5, -s * 0.5, s, -s, s * 1.5, -s * 1.5];
    for (const a of thu) {
      const v = { x: f.x + Math.cos(g0 + a) * b, y: f.y + Math.sin(g0 + a) * b };
      const nx = v.x, ny = v.y;
      raKhoiChanThan(v);
      if (!trongThan(v.x, v.y) || hyp(v.x - nx, v.y - ny) > b * 0.5) continue;
      f.x = v.x;
      f.y = v.y;
      if (a !== 0) { this.fzNe = Math.sign(a); this.fzNeT = 0.6; }
      break;
    }
    if (Math.abs(dx) > 1) f.lat = dx < 0;
  }

  /** Golden Frieza phát sáng: trên camera, cùng khối đất và có nhân vật trong tầm chưởng vàng thì nhìn thấy (vẽ, vận chưởng) dù ngoài TAM_NHIN */
  private fzVangThay(): boolean {
    const f = this.frieza;
    if (!(f.vang > 0) || !this.trenCam(f.x, f.y - 230, 330) || !this.thayKhoi(f.x, f.y)) return false;
    const r = FZ_CHUONG_TAM * FZ_VANG_TAM_GAP + 100;
    for (const n of this.nguoi) {
      if (n.vang || n.het) continue;
      const dx = n.x - f.x, dy = n.y - f.y;
      if (dx * dx + dy * dy < r * r) return true;
    }
    return false;
  }

  /**
   * Đòn của Frieza (đấm hoặc chưởng) trúng nhân vật, combo tăng dần như Cell bạo nộ: đòn trúng cùng người trong FZ_COMBO_CUA giây kể từ đòn trúng trước
   * thì nối chuỗi (đòn 2 ×1,5 · đòn 3 ×2 · từ đòn 4 ×3, `CELL_DO_COMBO`); đấm và chưởng chung một chuỗi; đòn bị né không tính, không làm đứt chuỗi.
   */
  private fzDanhTrung(n: NguoiChoi, sat: number, kieu: string): void {
    const p = this.nguoi.indexOf(n);
    const thu = this.t - (this.fzChuongLuc[p] ?? -99) <= FZ_COMBO_CUA ? (this.fzComboDem[p] ?? 1) + 1 : 1;
    const he = CELL_DO_COMBO[Math.min(thu, CELL_DO_COMBO.length) - 1];
    if (he > 1) this.chu.push({ id: this.id++, x: n.x, y: n.y - 300, text: `💥 COMBO ${kieu} FRIEZA x${String(he).replace('.', ',')}!`, mau: '#c77dff', t: 0 });
    if (this.nhanSatThuong(n, sat * he)) {
      this.fzChuongLuc[p] = this.t;
      this.fzComboDem[p] = thu;
    }
  }

  /** Chưởng của Frieza tới nơi: ai (không ẩn / gục / mây) nằm trên chùm thì trúng (vẫn né / giảm 50%, combo tăng dần như Cell bạo nộ); không bắn máy bay */
  private chuongFzTrung(q: ChuongTiec): void {
    const rong = CELL_CHUONG_RONG * q.k;
    const vx = q.x1 - q.x0, vy = q.y1 - q.y0, L2 = vx * vx + vy * vy || 1;
    for (const n of this.nguoi) {
      if (n.vang || this.khuat(n)) continue;
      const px = n.x, py = n.y - 70;
      const u = Math.max(0, Math.min(1, ((px - q.x0) * vx + (py - q.y0) * vy) / L2));
      if (hyp(px - (q.x0 + vx * u), py - (q.y0 + vy * u)) > rong) continue;
      this.fzDanhTrung(n, q.sat!, 'CHƯỞNG');
    }
    this.conBuTrungChum(q.x0, q.y0, vx, vy, L2, rong, q.sat!);
  }

  /**
   * Frieza ra khỏi thần điện (truy sát) mà máu dưới FZ_HOI_DUOI thì làm như Cell đỏ / con Cell đi ăn đậu: bỏ đánh, thấy táo / đậu thần thì bay tới ăn
   * (`capNhatVatPham()`), không thì bay tới cây khô, vận chưởng bắn đổ cây cho rơi đậu / táo rồi ăn. Nhân vật lại gần (CELL_AN_GAP) thì dịch chuyển sang
   * cây khác xa nhân vật nhất. Máu đạt FZ_HOI_TREN × máu tối đa thì quay lại tìm Mabu / Zinbu. Trả về true khi đang đi ăn (bỏ qua phần đánh).
   */
  private fzHoiPhuc(dt: number): boolean {
    const f = this.frieza;
    if (f.chet || this.trieuHoi || f.bien >= 0 || (f.nap && f.cayI === undefined)) { f.hoi = false; f.cayI = undefined; return false; }
    const max = fzHpMax(f);
    if (!f.hoi) {
      if (f.hp >= max * FZ_HOI_DUOI || trongThan(f.x, f.y)) return false;
      f.hoi = true;
      f.choDich = 0;
      this.chuGa({ id: this.id++, x: f.x, y: f.y - 360, text: '🫘 FRIEZA ĐI ĂN ĐẬU THẦN HỒI MÁU!', mau: '#7be04a', t: 0 });
    } else if (f.hp >= max * FZ_HOI_TREN) {
      f.hoi = false; f.cayI = undefined; f.nap = undefined;
      this.chuGa({ id: this.id++, x: f.x, y: f.y - 360, text: '💜 FRIEZA HỒI SỨC, QUAY LẠI ĐÁNH!', mau: '#d9b3ff', t: 0 });
      return false;
    }
    f.chien = true;
    f.nghi = 0;
    const gt = fzToc(f);
    const ke = this.nguoi.filter((m) => !m.vang && !this.khuat(m));
    const xaNhat = (x: number, y: number) => ke.reduce((d, m) => Math.min(d, hyp(m.x - x, m.y - y)), Infinity);
    const cayDung = (t: TrangTri) => t.loai === 0 && t.doLuc === undefined && !t.mat;
    const baySang = (x: number, y: number, toc: number) => {
      const dx = x - f.x, dy = y - f.y, d = hyp(dx, dy);
      if (Math.abs(dx) > 5) f.lat = dx < 0;
      if (d < 1) return;
      const b = Math.min(d, toc * dt);
      f.x += (dx / d) * b;
      f.y += (dy / d) * b;
    };
    // Đang vận chưởng vào cây: xong thì bắn (chùm tới cây là cây đổ; không ai nhìn thấy thì cây đổ luôn)
    if (f.nap && f.cayI !== undefined) {
      const cay = this.trangTri[f.cayI];
      f.nap.t += dt;
      f.lat = f.nap.x < f.x;
      if (!cay || !cayDung(cay)) { f.nap = undefined; f.cayI = undefined; return true; }
      if (f.nap.t < FZ_CHUONG_NAP) return true;
      f.nap = undefined;
      f.choChuong = FZ_CHUONG_HOI / gt;
      if (this.nvThay(f.x, f.y - 120, 300, 60)) {
        const x0 = f.x + (f.lat ? -1 : 1) * 60, y0 = f.y - 110;
        this.chuongTiec.push({ id: this.id++, k: 4, loai: 2, x0, y0, x1: cay.x, y1: cay.y - 110, t: 0, cay: f.cayI, fz: true });
        this.vetGa({ id: this.id++, x: x0, y: y0, t: 0, loai: 'chay', co: 0.6 });
      } else this.doCay(cay, cay.x - f.x);
      f.cayI = undefined;
      return true;
    }
    // Dịch chuyển tức thời tới cây xa nhân vật nhất: lúc mới bắt đầu, hoặc nhân vật lại gần trong CELL_AN_GAP
    const cay0 = f.cayI !== undefined ? this.trangTri[f.cayI] : undefined;
    if ((f.choDich ?? 0) <= this.t && (!cay0 || xaNhat(f.x, f.y) < CELL_AN_GAP)) {
      let tot = -1, iCho = -1;
      this.trangTri.forEach((t, i) => {
        if (!cayDung(t)) return;
        const d = xaNhat(t.x, t.y);
        if (d > tot) { tot = d; iCho = i; }
      });
      f.choDich = this.t + CELL_HOI_DICH;
      const t = iCho >= 0 ? this.trangTri[iCho] : undefined;
      if (t && (!cay0 || tot > xaNhat(f.x, f.y))) {
        this.vetGa({ id: this.id++, x: f.x, y: f.y - 100, t: 0, loai: 'no' });
        f.x = t.x + (Math.random() - 0.5) * FZ_CAY_TAM; f.y = t.y + 160 + Math.random() * 80;
        giuTrongMap(f, LE_FZ, true);
        this.vetGa({ id: this.id++, x: f.x, y: f.y - 100, t: 0, loai: 'no' });
        this.chuGa({ id: this.id++, x: f.x, y: f.y - 360, text: '💨 FRIEZA DỊCH CHUYỂN!', mau: '#d9b3ff', t: 0 });
        f.cayI = iCho;
        return true;
      }
    }
    // Có táo / đậu thần gần thì bay tới ăn (nhanh hơn CELL_AN_TOC lần)
    let gan = Infinity, mx = 0, my = 0;
    for (const v of this.vatPham) {
      if (v.loai !== 'dau' && v.loai !== 'do' && v.loai !== 'xanh') continue;
      const d = hyp(v.x - f.x, v.y - f.y);
      if (d < gan) { gan = d; mx = v.x; my = v.y; }
    }
    if (gan < CELL_AN_TRON) { baySang(mx, my, Math.max(FZ_BAY_TOC, FZ_TOC_DANH * gt) * CELL_AN_TOC); return true; }
    // Bắn cây đang nhắm (đổ rồi thì chọn cây đứng gần nhất)
    let cay = cay0 && cayDung(cay0) ? cay0 : undefined;
    if (!cay) {
      f.cayI = undefined;
      gan = Infinity;
      this.trangTri.forEach((t, i) => {
        if (!cayDung(t)) return;
        const d = hyp(t.x - f.x, t.y - f.y);
        if (d < gan) { gan = d; f.cayI = i; cay = t; }
      });
    }
    if (!cay) return true;
    if (hyp(cay.x - f.x, cay.y - f.y) < FZ_CAY_TAM) {
      f.lat = cay.x < f.x;
      if (f.choChuong <= 0) {
        f.nap = { t: 0, x: cay.x, y: cay.y - 110 };
        this.chuGa({ id: this.id++, x: f.x, y: f.y - 300, text: '💜 FRIEZA VẬN CHƯỞNG VÀO CÂY!', mau: '#d9b3ff', t: 0 });
      }
      return true;
    }
    baySang(cay.x, cay.y, Math.max(FZ_BAY_TOC, FZ_TOC_DANH * gt));
    return true;
  }

  /** Frieza: tự hồi máu, đi tuần / đánh nhau, chiêu đặc biệt biến thành Golden Frieza (chỉ bắt đầu khi nhân vật nhìn thấy; chữ / nổ qua chuGa() / vetGa()) */
  private capNhatFz(dt: number): void {
    const f = this.frieza;
    if (f.chet) { f.tChet += dt; return; }
    f.nhay = Math.max(0, f.nhay - dt);
    f.danh = Math.max(0, f.danh - dt);
    f.choDanh -= dt;
    f.choChuong -= dt;
    const max = fzHpMax(f);
    if (f.hp < max && f.bien < 0) f.hp = Math.min(max, f.hp + FZ_HOI_MAU * fzGap(f) * dt);
    const cao = f.bien >= 0 || f.vang > 0 ? 768 * FZ_VANG_TO * 0.4 : 120;
    const an = this.fzHoiPhuc(dt);
    const thay = !an && (this.nvThay(f.x, f.y - cao, 300, 60) || this.fzVangThay());
    // Nhận ra nhân vật ở bất kỳ đâu trên thần điện và đuổi đánh (chống câu giờ); chưởng / biến hình chỉ khi nhân vật nhìn thấy Frieza
    const muc = an ? null : this.fzMuc();
    if (muc && !f.chien) {
      f.chien = true;
      this.chuGa({ id: this.id++, x: f.x, y: f.y - 360, text: '⚔ FRIEZA XUẤT TRẬN!', mau: '#d9b3ff', t: 0 });
    } else if (!an && !muc && f.chien && f.bien < 0 && !f.nap && (!this.fzTruy || trongThan(f.x, f.y))) fzVeDuong(f);
    let gan: NguoiChoi | null = muc;
    if (!gan) {
      let dMin = Infinity;
      for (const n of this.nguoi) {
        if (n.vang || n.het) continue;
        const d = hyp(n.x - f.x, n.y - f.y);
        if (d < dMin) { dMin = d; gan = n; }
      }
    }
    const su = capNhatFrieza(f, dt, thay && !f.nap && f.danh <= 0, gan?.x);
    if (f.chien && f.bien < 0 && !an) this.fzChien(muc, thay, dt);
    // Truy sát: ra khỏi thần điện thì bay lơ lửng (qua vực), vào vườn gà thì kẹp trong tường như mọi vật
    f.bay = this.fzTruy && !trongThan(f.x, f.y);
    if (this.fzTruy) giuTrongMap(f, LE_FZ, f.bay);
    else giuTrongMap(f, LE_FZ, false, 'dao');
    if (!su) return;
    const tamY = f.y - 768 * FZ_VANG_TO * 0.4;
    if (su === 'batDau') {
      this.chuGa({ id: this.id++, x: f.x, y: f.y - 420, text: '✨ FRIEZA BIẾN HÌNH: GOLDEN FRIEZA!', mau: '#ffd23f', t: 0 });
    } else if (su === 'aura') {
      this.vetGa({ id: this.id++, x: f.x, y: tamY, t: 0, loai: 'chay', co: 1.8 });
      if (this.nvThay(f.x, tamY, 300, 60)) this.rungMan(0.3, 9);
    } else if (su === 'phong') {
      const huong = f.lat ? -1 : 1;
      this.vetGa({ id: this.id++, x: f.x + huong * 160, y: tamY - 40, t: 0, loai: 'chay', co: 2.6 });
      this.vetGa({ id: this.id++, x: f.x, y: f.y, t: 0, loai: 'bui' });
      if (this.nvThay(f.x, tamY, 300, 60)) this.rungMan(0.45, 14);
    } else if (su === 'xong') {
      this.chuGa({ id: this.id++, x: f.x, y: f.y - 420, text: '👑 GOLDEN FRIEZA! MỌI CHỈ SỐ x2', mau: '#ffd23f', t: 0 });
    } else if (su === 'het') {
      this.vetGa({ id: this.id++, x: f.x, y: tamY, t: 0, loai: 'chay', co: 1.2 });
      this.chuGa({ id: this.id++, x: f.x, y: f.y - 360, text: 'Frieza trở lại dạng thường', mau: '#d9b3ff', t: 0 });
    }
  }

  private gyTrenCam(): boolean {
    return this.nvThay(this.ginyu.x, this.ginyu.y - GY_TAM_CAO, 300, 60);
  }

  /** "Sức" để chọn người lao vào: máu × sức mạnh (đậu thần tính thêm theo tỉ lệ với đòn Đấm) */
  private gySuc(p: number): number {
    const n = this.nguoi[p];
    return Math.max(0, n.hp) * ((n.suc ?? 1) + (n.satDau ?? 0) / 50);
  }

  /** Đồng đội của người bị sao chép (bản sao bám theo người này như người thật, có dây buộc khi xa) */
  private gyDongDoi(): NguoiChoi | undefined {
    const s = this.ginyu.sao;
    const b = s ? this.nguoi[1 - s.p] : undefined;
    return b && !b.vang && !b.het ? b : undefined;
  }



  /** Trúng người p: thành bản sao y hệt người đó (animation, thanh máu), máu = GY_SAO_TI_LE_DAU (lần đầu) / GY_SAO_TI_LE người đó */
  private gyBienSao(p: number): void {
    const g = this.ginyu, n = this.nguoi[p];
    const suc = n.suc ?? 1;
    // Không thấy Mabu / Zinbu mà gặp Super Bư (đang hợp thể, người mang thân): biến thành bản sao Super Bư, sống lâu như Super Bư (HOP_THE_T)
    const sb = this.hopThe?.chu === p;
    g.ki = n.ki;
    const heSo = (g.suc ?? 1) * (1 + GY_HOI_MAU * (g.hoiSinh ?? 0));
    // Lần nhập đầu tiên máu bản sao = GY_SAO_TI_LE_DAU (120%), từ lần sau GY_SAO_TI_LE (80%) máu người bị nhập
    const tiLe = g.daNhap || g.truoc ? GY_SAO_TI_LE : GY_SAO_TI_LE_DAU;
    g.daNhap = true;
    const hpMax = Math.max(1, Math.round(Math.max(1, n.hp) * tiLe * heSo));
    const sat = [0, 1, 2].map((i) => Math.round(((sb ? this.satNv(p, i) : SAT_THUONG[i]![n.ki]!) * suc + (n.satDau ?? 0)) * GY_SAO_SAT)) as [number, number, number];
    // Từ lần biến hình thứ 2: máu bản sao = GY_SAO_TI_LE máu người bị sao chép CHỈ khi mức đó cao hơn máu tối đa của bản trước
    // (bản trước nhân theo suc / hồi sinh hiện tại); người bị sao chép ít máu hơn thì giữ nguyên máu bản trước, không cộng dồn.
    // Sát thương cũng vậy: người bị sao chép đánh yếu hơn (tổng 3 đòn) thì giữ sát thương bản trước.
    // Thanh máu trên đầu vẫn theo người bị sao chép (`hpGia`) để lừa, máu thật hiện trên thanh đen.
    // Bản sao Super Bư luôn theo đúng Super Bư và không làm mốc cho lần sau (để bản sao Mabu / Zinbu sau đó không mang sức Super Bư)
    const tr = g.truoc;
    const trMax = tr ? Math.max(1, Math.round(tr.hpMax * heSo / Math.max(0.01, tr.heSo))) : 0;
    const tong = (a: number[]) => a[0]! + a[1]! + a[2]!;
    const giuMau = !sb && !!tr && hpMax <= trMax;
    g.hpMax = giuMau ? trMax : hpMax;
    // Lần nhập đầu (120%): thanh máu trên đầu vẫn theo máu thật của người bị nhập để không lộ
    const hpNguoi = Math.max(1, Math.round(Math.max(1, n.hp) * heSo));
    g.hpGia = giuMau ? hpMax : !sb && tiLe !== GY_SAO_TI_LE ? hpNguoi : undefined;
    g.sat = !sb && tr && tong(sat) < tong(tr.sat) ? [...tr.sat] : sat;
    g.hp = g.hpMax;
    // Mốc "giữ chỉ số cũ" cho lần sau tính theo GY_SAO_TI_LE (80%), không theo 120% của lần nhập đầu
    if (!sb) g.truoc = { hpMax: tiLe === GY_SAO_TI_LE ? g.hpMax : Math.max(1, Math.round(Math.max(1, n.hp) * GY_SAO_TI_LE * heSo)), sat: [...g.sat], heSo };
    g.lao = undefined;
    g.quang = undefined;
    g.khieu = undefined;
    g.socola = undefined;
    // Đứng chồng lên người thật (lệch rất ít) để không ai biết ai là ai
    g.x = n.x + ngauNhien(-30, 30);
    g.y = n.y + ngauNhien(-10, 10);
    this.gyGiu(LE_NV);
    g.sao = { p, con: sb ? HOP_THE_T : GY_SAO_T, danh: ngauNhien(GY_SAO_DANH[0], GY_SAO_DANH[1]), nhom: 0, doi: 0, di: false, sb };
    const nv = new NhanVat(sb ? SUPER_BU : NHAN_VAT[n.ki]!);
    nv.lat = n.nv.lat;
    this.gyNv = nv;
    this.vetGa({ id: this.id++, x: n.x, y: n.y - 80, t: 0, loai: 'no' });
    this.vetGa({ id: this.id++, x: n.x, y: n.y, t: 0, loai: 'bui' });
    this.chuGa({ id: this.id++, x: n.x, y: n.y - 330, text: sb ? 'Super Bư thật? Super Bư giả?' : n.ki === 2 ? 'Vegeta thật? Vegeta giả?' : 'Bư thật? bư giả?', mau: '#c39bff', t: 0 });
    this.rungMan(0.25, 9);
  }

  /** Hết GY_SAO_T giây: bản sao tan ra, trở lại hình bóng ma (bất khả xâm phạm) rồi lại khiêu khích */
  private gyHetSao(): void {
    const g = this.ginyu;
    g.sao = undefined;
    g.socola = undefined;
    g.nhay = 0;
    this.gyNv = null;
    g.nghi = GY_NGHI_T;
    const tam = this.tamGy();
    this.vetGa({ id: this.id++, x: g.x, y: g.y - 80, t: 0, loai: 'no' });
    this.chuGa({ id: this.id++, x: tam.x, y: tam.y - 200, text: '👻 BÓNG MA GOKU HIỆN HÌNH!', mau: '#9fe8ff', t: 0 });
  }

  /** Bóng ma chết hẳn: hoá viên ngọc rồng GY_NGOC_SAO sao ở chỗ nó chết (chưa nhặt, chưa nằm trên đất); trả true nếu vừa rơi ngọc */
  private gyRoiNgoc(): boolean {
    const g = this.ginyu;
    if (this.ngocNhat.includes(GY_NGOC_SAO) || this.vatPham.some((v) => v.loai === 'ngoc' && v.sao === GY_NGOC_SAO)) return false;
    const v = { x: g.x, y: g.y };
    giuTrongMap(v, LE_VP, false, 'dao');
    this.vatPham.push({ id: this.id++, x: v.x, y: v.y, t: 0, loai: 'ngoc', sao: GY_NGOC_SAO });
    return true;
  }

  /** Xác bản sao mờ hết mà còn lượt hồi sinh: sống lại thành bóng ma tại chỗ, né +GY_HOI_NE, máu bản sao +GY_HOI_MAU */
  private gyHoiSinh(): void {
    const g = this.ginyu;
    const k = (g.hoiSinh ?? 0) + 1;
    g.hoiSinh = k;
    g.choHoi = undefined;
    g.chet = false;
    g.tChet = 0;
    g.sao = undefined;
    g.socola = undefined;
    g.lao = undefined;
    g.khieu = undefined;
    g.muc = undefined;
    g.nhay = 0;
    g.hp = g.hpMax = GY_HP_GOC;
    this.gyNv = null;
    g.nghi = GY_NGHI_T;
    const tam = this.tamGy();
    this.vetGa({ id: this.id++, x: g.x, y: g.y - 80, t: 0, loai: 'no' });
    this.vetGa({ id: this.id++, x: g.x, y: g.y, t: 0, loai: 'bui' });
    this.chuGa({ id: this.id++, x: tam.x, y: tam.y - 300, text: `👻 BÓNG MA GOKU HỒI SINH! (${k}/${GY_HOI_SINH})`, mau: '#c39bff', t: 0 });
    this.chuGa({ id: this.id++, x: tam.x, y: tam.y - 250, text: `NÉ +${Math.round(GY_HOI_NE * k * 100)}% · MÁU +${Math.round(GY_HOI_MAU * k * 100)}%`, mau: '#9fe8ff', t: 0 });
    this.rungMan(0.3, 10);
  }

  private capNhatGinyu(dt: number): void {
    const g = this.ginyu;
    if (g.chet) {
      g.tChet += dt;
      if (this.gyNv) this.gyNv.capNhat(dt, false);
      if (g.choHoi && g.tChet >= GY_CHET_T) this.gyHoiSinh();
      return;
    }
    g.nhay = Math.max(0, g.nhay - dt);
    g.danh = Math.max(0, g.danh - dt);
    if (g.sao) { this.gyCapNhatSao(dt); return; }
    // ── Dạng bóng ma ──
    if (g.lao !== undefined) { this.gyLao(dt); return; }
    // "Một chấm": ở nhà và không ai ở gần thì không tính gì thêm
    if (!this.gyTruy && g.khieu === undefined && Math.abs(g.x - g.hx) + Math.abs(g.y - g.hy) < 30 && !this.nguoi.some((n) => !n.vang && trongNui(n.x, n.y, GY_NUI_LE))) {
      g.chay = false;
      return;
    }
    g.phase += dt;
    const thay = this.nguoi.map((_, p) => p).filter((p) => this.gyThay(p));
    if (g.nghi !== undefined) {
      g.chay = false;
      if ((g.nghi -= dt) <= 0) g.nghi = undefined;
      return;
    }
    // Truy sát: người gần nhất còn xa (hoặc chạy xa khi đang khiêu khích) thì bay thẳng tới với tốc độ lao, qua vực / tường vườn
    if (this.gyTruy && thay.length) {
      const gan = this.nguoi[thay.reduce((a, b) => (hyp(this.nguoi[a]!.x - g.x, this.nguoi[a]!.y - g.y) <= hyp(this.nguoi[b]!.x - g.x, this.nguoi[b]!.y - g.y) ? a : b))]!;
      const d = hyp(gan.x - g.x, gan.y - g.y);
      if (d > (g.khieu !== undefined ? GY_LAO_QUANG : GY_TRUY_GAN)) {
        g.khieu = undefined;
        const b = Math.min(d, GY_LAO_TOC * dt);
        g.x += ((gan.x - g.x) / d) * b;
        g.y += ((gan.y - g.y) / d) * b;
        this.gyGiu(LE_GY, true);
        g.chay = true;
        if (Math.abs(gan.x - g.x) > 5) g.lat = gan.x > g.x;
        return;
      }
    }
    if (g.khieu !== undefined) {
      // Khiêu khích: đứng yên quay mặt về người gần nhất; ai cũng mất dạng thì thôi
      g.chay = false;
      if (!thay.length) { g.khieu = undefined; return; }
      const gan = this.nguoi[thay.reduce((a, b) => (hyp(this.nguoi[a]!.x - g.x, this.nguoi[a]!.y - g.y) <= hyp(this.nguoi[b]!.x - g.x, this.nguoi[b]!.y - g.y) ? a : b))]!;
      g.lat = gan.x > g.x;
      if ((g.khieu -= dt) > 0) return;
      g.khieu = undefined;
      // Lao vào người nhiều máu và sức mạnh hơn
      g.muc = thay.reduce((a, b) => (this.gySuc(b) > this.gySuc(a) ? b : a));
      g.lao = 0;
      g.quang = 0;
      this.chuGa({ id: this.id++, x: g.x, y: g.y - GY_TAM_CAO - 160, text: 'Chạy đâu cho thoát', mau: '#9fe8ff', t: 0 });
      return;
    }
    if (thay.length && this.gyTrenCam()) {
      g.khieu = GY_KHIEU_T;
      g.gap = true;
      g.chay = false;
      this.chuGa({ id: this.id++, x: g.x, y: g.y - GY_TAM_CAO - 160, text: '👻 lêu lêu lêu nhé', mau: '#c39bff', t: 0 });
      this.am.phat('gokuMa'); // tiếng hét kéo dài suốt khiêu khích → lao → biến hình
      return;
    }
    // Có người trên núi mà chưa ai nhìn thấy bóng ma: lượn tới người gần nhất (đuổi khắp núi, không cho câu giờ)
    if (thay.length) {
      const gan = this.nguoi[thay.reduce((a, b) => (hyp(this.nguoi[a]!.x - g.x, this.nguoi[a]!.y - g.y) <= hyp(this.nguoi[b]!.x - g.x, this.nguoi[b]!.y - g.y) ? a : b))]!;
      if (hyp(gan.x - g.x, gan.y - g.y) > 300) this.gyDiToi(gan.x, gan.y, dt);
      else g.chay = false;
      return;
    }
    // Truy sát mà không còn ai để đuổi: lơ lửng chờ tại chỗ (đang ở trên núi thì về giữa núi)
    if (this.gyTruy && !trongNui(g.x, g.y)) { g.chay = false; return; }
    // Không có ai trên núi: lượn về giữa núi
    if (hyp(g.hx - g.x, g.hy - g.y) > 20) this.gyDiToi(g.hx, g.hy, dt);
    else g.chay = false;
  }

  /** Đang lao (bóng ma, không bị thương): bám theo mục tiêu tốc độ GY_LAO_TOC, quãng tối đa GY_LAO_QUANG; chạm là thành bản sao người đó */
  private gyLao(dt: number): void {
    const g = this.ginyu;
    g.lao! += dt;
    g.chay = false;
    const p = g.muc;
    const ke = p !== undefined ? this.nguoi[p] : undefined;
    if (p === undefined || !ke || !this.gyHopLe(p) || (g.quang ?? 0) >= GY_LAO_QUANG) {
      g.lao = undefined;
      g.quang = undefined;
      g.nghi = GY_NGHI_T;
      return;
    }
    const dx = ke.x - g.x, dy = ke.y - g.y, d = hyp(dx, dy) || 1;
    g.vx = (dx / d) * GY_LAO_TOC;
    g.vy = (dy / d) * GY_LAO_TOC;
    g.lat = dx > 0;
    const b = Math.min(d, GY_LAO_TOC * dt, GY_LAO_QUANG - (g.quang ?? 0));
    g.x += (dx / d) * b;
    g.y += (dy / d) * b;
    g.quang = (g.quang ?? 0) + b;
    this.gyGiu(LE_GY, this.gyTruy);
    if (hyp(ke.x - g.x, ke.y - g.y) > GY_LAO_CHAM) return;
    this.gyBienSao(p);
  }

  /** Bản sao: lảng vảng cạnh đồng đội như người thật, cứ 1–2s (ngẫu nhiên) đánh Mabu hoặc Zinbu bằng đòn của người bị sao chép; hết GY_SAO_T giây thì trở lại bóng ma */
  private gyCapNhatSao(dt: number): void {
    const g = this.ginyu, s = g.sao!, nv = this.gyNv!;
    if ((s.con -= dt) <= 0) { this.gyHetSao(); return; }
    let dangDi = false;
    if ((g.socola ?? 0) > 0) {
      g.socola = Math.max(0, g.socola! - dt);
    } else if (!nv.khoa) {
      s.danh -= dt;
      const hopLe = [0, 1].filter((q) => this.gyHopLe(q));
      // Tới lượt đánh: chọn ngẫu nhiên Mabu hoặc Zinbu (người còn đánh được) và đòn; đến đủ gần thì ra đòn
      if (s.danh <= 0 && s.muc === undefined && hopLe.length) {
        s.muc = hopLe[Math.floor(Math.random() * hopLe.length)]!;
        const r = Math.random();
        s.nhom = r < GY_TI_LE_DAM ? 0 : r < GY_TI_LE_DAM + GY_TI_LE_DA ? 1 : 2;
      }
      if (s.muc !== undefined && !this.gyHopLe(s.muc)) s.muc = undefined;
      let tx: number | undefined, ty: number | undefined;
      if (s.muc !== undefined) {
        const ke = this.nguoi[s.muc]!;
        // Chưởng bắn từ xa (gần hết tầm chưởng), Đấm / Đá phải lại gần
        const tam = s.nhom === 2 ? TAM_CHIEU : s.nhom === 1 ? TAM_DA_GAN : TAM_DAM_GAN;
        const d = hyp(ke.x - g.x, ke.y - g.y);
        if (d <= tam * 0.85 || s.danh < -3) this.gyRaDon(ke);
        else { tx = ke.x; ty = ke.y; }
      } else {
        // Lảng vảng cạnh đồng đội của người bị sao chép (đi theo như người thật), thỉnh thoảng đứng yên
        s.doi -= dt;
        const b = this.gyDongDoi() ?? this.nguoi[s.p];
        if (s.doi <= 0 && b) {
          s.doi = ngauNhien(1.2, 3);
          if (Math.random() < 0.3) s.dich = undefined;
          else {
            const goc = ngauNhien(0, Math.PI * 2), r = ngauNhien(180, 480);
            const v = { x: b.x + Math.cos(goc) * r, y: b.y + Math.sin(goc) * r };
            s.dich = this.gyDuocDi(v.x, v.y) ? v : { x: b.x, y: b.y };
          }
        }
        if (s.dich) { tx = s.dich.x; ty = s.dich.y; }
      }
      if (tx !== undefined && ty !== undefined) {
        const dx = tx - g.x, dy = ty - g.y, d = hyp(dx, dy);
        if (d > 8) {
          dangDi = true;
          const b = Math.min(d, TOC_DO_DI * dt);
          const nx = g.x + (dx / d) * b, ny = g.y + (dy / d) * b;
          const ok = (x: number, y: number) => this.gyDuocDi(x, y);
          if (ok(nx, ny) || !ok(g.x, g.y)) { g.x = nx; g.y = ny; }
          else if (ok(nx, g.y)) g.x = nx;
          else if (ok(g.x, ny)) g.y = ny;
          else dangDi = false;
          // Đi như nhân vật thật: chủ yếu theo chiều dọc thì quay lên / xuống
          if (Math.abs(dy) > Math.abs(dx) * 1.2) nv.huong = dy < 0 ? 'len' : 'xuong';
          else {
            nv.huong = 'ngang';
            if (Math.abs(dx) > d * 0.2) nv.lat = dx < 0;
          }
        } else if (s.dich) s.dich = undefined;
      }
    }
    s.di = dangDi;
    const truot = nv.capNhat(dt, dangDi);
    if (truot) g.x += truot * S_NV;
    // Dây buộc như người thật (chung dây với cả hai nhân vật, kéo qua lại trong `rangBuoc()`)
    this.gyGiu(LE_NV);
    g.lat = !nv.lat;
  }

  /** Bản sao ra đòn vào nhân vật `ke`: animation đòn của người bị sao chép, đạn bay như đòn thật (đánh dấu `gy`, chỉ trúng nhân vật) */
  private gyRaDon(ke: NguoiChoi): void {
    const g = this.ginyu, s = g.sao!, nv = this.gyNv!;
    const nhom = s.nhom;
    nv.lat = ke.x < g.x;
    nv.huong = 'ngang';
    nv.datNhom(nhom, this.t);
    nv.raDon(this.t);
    if (this.gyTrenCam()) this.am.phat(nhom === 2 ? 'chuong' : nhom === 1 ? 'da' : 'dam');
    const { dx, dy } = nv.diemBan;
    const k = this.gyNvViTri().k;
    const tay = { x: g.x + (nv.lat ? -dx : dx) * k, y: g.y + dy * k - nv.cao * S_NV };
    const x1 = ke.x, y1 = ke.y - 80;
    const chieu = nhom === 2;
    const T = hyp(x1 - tay.x, y1 - tay.y) / (chieu ? TOC_DO_DAN * 0.55 : TOC_DO_DAN);
    this.dan.push({ id: this.id++, p: s.p, x0: tay.x, y0: tay.y, x1, y1, t: 0, T, phu: false, to: chieu, sat: Math.round(g.sat[nhom]! * (g.suc ?? 1)), nhom, vg: g.ki === 2 && chieu && !s.sb, sb: chieu && s.sb, gy: true });
    s.muc = undefined;
    s.danh = ngauNhien(GY_SAO_DANH[0], GY_SAO_DANH[1]);
  }

  /** Đạn của bản sao: chưởng xuyên qua mọi nhân vật trên đường bay, chạm đích thì nổ / đánh trúng nhân vật (né / giảm như đòn quái) */
  private danGy(d: Dan, cuoi: boolean): void {
    const vt = cuoi ? { x: d.x1, y: d.y1 } : this.danHienTai(d);
    const r = cuoi ? (d.to ? BAN_KINH_NO + 60 : 110) : CHUONG_XUYEN + 70;
    this.nguoi.forEach((n, q) => {
      if (!this.gyHopLe(q) || d.da?.includes(-10 - q)) return;
      if (hyp(n.x - vt.x, n.y - 80 - vt.y) >= r) return;
      (d.da ??= []).push(-10 - q);
      if (this.nhanSatThuong(n, d.sat, false, '#ff4d4d') && d.to) n.combo = 0;
    });
    if (!cuoi) return;
    if (d.to) {
      if (d.vg) this.vetGa({ id: this.id++, x: d.x1, y: d.y1, t: 0, loai: 'chay', co: 1, vg: true });
      else {
        this.vetGa({ id: this.id++, x: d.x1, y: d.y1, t: 0, loai: 'no' });
        this.vetGa({ id: this.id++, x: d.x1, y: d.y1, t: 0, loai: 'chay', co: 0.9 });
      }
    }
  }

  /** Đối kháng 3 bên trên núi đá (Mabu, Zinbu, bóng ma): đòn của p trúng người còn lại (cả hai đứng trên núi) trong bán kính r quanh thân. Trả về true nếu trúng */
  private danTrungDongDoi(d: Dan, x: number, y: number, r: number, sat = d.sat): boolean {
    const a = this.nguoi[d.p];
    if (!a || !trongNui(a.x, a.y, GY_NUI_LE)) return false;
    let trung = false;
    this.nguoi.forEach((n, q) => {
      if (q === d.p || !this.gyHopLe(q) || d.da?.includes(-10 - q)) return;
      if (hyp(n.x - x, n.y - 80 - y) >= r) return;
      (d.da ??= []).push(-10 - q);
      const songTruoc = !n.het;
      this.nhanSatThuong(n, sat * (a.suc ?? 1) + (a.satDau ?? 0), false, '#ff9f43');
      // Đối kháng: mất máu và gục như bị quái đánh (đồng đội còn sống thì cứu như thường, cả hai gục là thua)
      if (songTruoc && n.het) this.chu.push({ id: this.id++, x: n.x, y: n.y - 320, text: `💀 ${a.ten.toUpperCase()} HẠ GỤC ${n.ten.toUpperCase()}!`, mau: '#ff4d4d', t: 0 });
      trung = true;
    });
    return trung;
  }

  private gyDiToi(x: number, y: number, dt: number): void {
    const g = this.ginyu;
    const dx = x - g.x, dy = y - g.y, d = hyp(dx, dy);
    if (d < 1) { g.chay = false; return; }
    const b = Math.min(d, GY_TOC * dt);
    const nx = g.x + (dx / d) * b, ny = g.y + (dy / d) * b;
    if (this.gyTruy || !trongNui(g.x, g.y) || trongNui(nx, ny)) { g.x = nx; g.y = ny; }
    else if (trongNui(nx, g.y)) g.x = nx;
    else if (trongNui(g.x, ny)) g.y = ny;
    this.gyGiu(LE_GY, this.gyTruy);
    g.chay = true;
    if (Math.abs(dx) > 5) g.lat = dx > 0;
  }

  /**
   * Bản sao nhận đòn của nhân vật p như Mabu / Zinbu: né 25%, giảm 50% (sát thương nhân `suc` người đánh, cộng đậu thần). Dạng bóng ma thì không ai đánh được.
   * `soc`: Biến socola đủ giết thì thành thanh socola, không thì hoá socola. Trả về true nếu đòn trúng.
   */
  private trungGy(p: number, sat: number, khongNe = false, soc = false): boolean {
    const g = this.ginyu;
    if (g.chet || !g.sao) return false;
    const n = this.nguoi[p];
    const tam = this.tamGy();
    if (!khongNe && Math.random() < NE_NV + GY_HOI_NE * (g.hoiSinh ?? 0)) {
      this.chu.push({ id: this.id++, x: g.x, y: g.y - 220, text: 'NÉ!', mau: '#9be7ff', t: 0 });
      return false;
    }
    const mat = Math.max(1, Math.round((sat * (n?.suc ?? 1) + (n?.satDau ?? 0)) * (1 - GIAM_NV)));
    g.hp -= mat;
    g.thuongLuc = this.t;
    // Chữ sát thương giống hệt khi nhân vật thật bị đánh (không lộ là bản sao)
    this.chu.push({ id: this.id++, x: g.x, y: g.y - 220, text: `-${mat}`, mau: '#ff9f43', t: 0 });
    if (n) n.banTrung++;
    if (g.hp > 0) {
      if (soc) g.socola = GY_SOCOLA_T;
      return true;
    }
    g.hp = 0;
    g.chet = true;
    g.tChet = 0;
    g.lao = undefined;
    g.socola = undefined;
    this.gyNv?.nga();
    // Còn lượt hồi sinh thì xác mờ hết rồi sống lại (gyHoiSinh); hết lượt mới chết hẳn và hoá viên ngọc rồng GY_NGOC_SAO sao (kể cả chết vì Biến socola)
    const conMang = GY_HOI_SINH - (g.hoiSinh ?? 0);
    if (conMang > 0) g.choHoi = true;
    else if (this.gyRoiNgoc()) this.chu.push({ id: this.id++, x: tam.x, y: tam.y - 300, text: `⭐ BÓNG MA HOÁ NGỌC RỒNG ${GY_NGOC_SAO} SAO!`, mau: '#ffb347', t: 0 });
    for (let i = 0; i < 3; i++) this.vet.push({ id: this.id++, x: g.x + ngauNhien(-80, 80), y: tam.y + ngauNhien(-80, 60), t: 0, loai: 'chay', co: 0.8 + i * 0.2 });
    this.rungMan(0.3, 12);
    this.dungKhung(0.15);
    this.chu.push({ id: this.id++, x: tam.x, y: tam.y - 220, text: conMang > 0 ? `💥 BẢN SAO LÀ BÓNG MA GOKU! CÒN ${conMang} LẦN HỒI SINH` : '💥 BẢN SAO LÀ BÓNG MA GOKU! ĐÃ BỊ HẠ!', mau: '#ffd27a', t: 0 });
    if (n) {
      n.combo++;
      const hs = this.heSo(p);
      const diem = GY_DIEM * hs;
      this.congDiem(p, diem, tam.x, tam.y - 120, `+${diem}${hs > 1 ? ` x${hs}` : ''} Bóng ma`);
    }
    this.nguoi.forEach((_, q) => this.chuongLenTroi(q));
    return true;
  }

  /** Khung hình bóng ma: ngã · lao · khiêu khích (quay người → gồng → bay lượn) · bay lượn · đứng / xoay chậm ở nhà */
  gyKhung(): number {
    const g = this.ginyu;
    if (g.chet) return GY_KHUNG.nga;
    if (g.lao !== undefined || g.danh > 0) return GY_KHUNG.lao;
    if (g.khieu !== undefined) {
      const k = 1 - g.khieu / GY_KHIEU_T;
      if (k < 0.4) return GY_KHUNG.quay[Math.floor(k * 2.5 * GY_KHUNG.quay.length * 2) % GY_KHUNG.quay.length]!;
      if (k < 0.7) return GY_KHUNG.gong;
      return GY_KHUNG.bay[Math.floor(this.t * 6) % GY_KHUNG.bay.length]!;
    }
    if (g.nghi !== undefined) return GY_KHUNG.dung[Math.floor(this.t * 1.5) % GY_KHUNG.dung.length]!;
    if (g.chay) return GY_KHUNG.bay[Math.floor(g.phase * 3) % GY_KHUNG.bay.length]!;
    return GY_KHUNG.quay[Math.floor(this.t * 2) % GY_KHUNG.quay.length]!;
  }

  /** Tiến độ gồng khi khiêu khích (0..1, hào quang) */
  get gyGong(): number {
    const g = this.ginyu;
    if (g.khieu === undefined || g.chet) return 0;
    const k = 1 - g.khieu / GY_KHIEU_T;
    return k < 0.4 ? 0 : k < 0.7 ? (k - 0.4) / 0.3 : 1 - (k - 0.7) / 0.3;
  }

  /** Bộ lọc màu: socola nâu (bản sao không nháy sáng, như nhân vật thật) */
  gyLoc(): string | null {
    const g = this.ginyu;
    return (g.socola ?? 0) > 0 ? LOC_SOCOLA : !g.sao && g.nhay > 0 ? MAU_SANG : null;
  }

  /** Vị trí chân + hệ số phóng của bản sao (vẽ như nhân vật, `nvViTri()`) */
  gyNvViTri(): { x: number; y: number; k: number } {
    const g = this.ginyu, nv = this.gyNv;
    return { x: g.x, y: g.y - ((nv?.cao ?? 0) - (nv?.nhun ?? 0)) * S_NV, k: S_NV * (nv?.heSoTo ?? 1) * (nv?.sp.toBanDo ?? 1) };
  }

  /** Thanh máu bản sao: vị trí và tỉ lệ đầy như của nhân vật thật */
  gyThanh(): { x: number; y: number; mau: number } {
    const g = this.ginyu, nv = this.gyNv;
    return { x: g.x, y: g.y - ((nv?.cao ?? 0) - (nv?.nhun ?? 0)) * S_NV - (g.sao?.sb ? DAU_SB : DAU_NV[g.ki ?? 0] ?? 170), mau: this.gyMauGia() };
  }

  /** Tỉ lệ đầy thanh máu trên đầu bản sao: theo máu "giả" của người bị sao chép khi đang giữ chỉ số cũ (`hpGia`), chỉ để lừa người chơi */
  private gyMauGia(): number {
    const g = this.ginyu;
    const hp = g.hpGia ? Math.max(0, g.hp) * g.hpGia / Math.max(1, g.hpMax) : Math.max(0, g.hp);
    // Bản sao Super Bư: đầy thanh theo máu Super Bư thật lúc hợp thể (như thanh máu Super Bư)
    const day = g.sao?.sb ? this.hopThe?.hpMax ?? g.hpMax / GY_SAO_TI_LE : HP_NV;
    return Math.min(1, hp / Math.max(day, hp));
  }

  /** Dây buộc của bản sao với cả hai nhân vật (giống hệt dây buộc 2 nhân vật thật): mức căng và 2 đầu trên màn hình của từng dây */
  gyDay(): { tet: number; a: { x: number; y: number }; b: { x: number; y: number } }[] {
    if (!this.gySao) return [];
    const g = this.ginyu;
    const man = (x: number, y: number) => ({ x: this.W / 2 + (x - this.camX) * this.camZ, y: TAM_VIEW_Y + (y - this.camY) * this.camZ });
    return this.nguoi.filter((n, q) => !n.vang && !n.het && !this.trongMb(q)).map((n) => ({
      tet: Math.max(Math.abs(g.x - n.x) / MAX_DX, Math.abs(g.y - n.y) / MAX_DY),
      a: man(g.x, g.y), b: man(n.x, n.y),
    }));
  }

  /** Mũi tên ở mép màn hình chỉ bản sao khi nó ra ngoài khung nhìn (như nhân vật thật), màu của người bị sao chép */
  gyMuiTen(): { x: number; y: number; goc: number; mau: string } | null {
    if (!this.gySao) return null;
    const g = this.ginyu;
    const v = { x: this.W / 2 + (g.x - this.camX) * this.camZ, y: TAM_VIEW_Y + (g.y - this.camY) * this.camZ };
    const x = kep(v.x, 70, this.W - 70);
    const y = kep(v.y, 130, H - 70);
    if (x === v.x && y === v.y) return null;
    return { x, y, goc: (Math.atan2(v.y - y, v.x - x) * 180) / Math.PI, mau: this.nguoi[g.sao!.p]!.mau };
  }

  /** Tên hiển thị (bóng ma; bản sao không có tên để khỏi lộ) */
  get gyTen(): string {
    return GY_TEN;
  }

  // ─── Cell canh đảo ───

  /** Tâm thân Cell (để tính trúng đòn / vẽ số sát thương) */
  tamCell(c: Cell) {
    return { x: c.x, y: c.y - 20 * cellK(c.cap) };
  }

  // Cell nhận đòn: trừ máu, nháy sáng, hết máu thì ngã (tính điểm / combo). Trả về true nếu đòn trúng.
  // Cell bạo nộ (cấp 4) có giáp giảm CELL_GIAP sát thương, trừ khi người đánh đang combo từ CELL_PHA_GIAP đòn hoặc nó đang hoá socola.
  // `xuyenGiap`: bỏ qua giáp (combo socola + mây).
  private trungCell(c: Cell, p: number, sat: number, xuyenGiap = false, soc = false): boolean {
    if (c.chet) return false;
    this.cellBiDanh(c, p);
    const n = this.nguoi[p];
    const tam = this.tamCell(c);
    // Né đòn (CELL_NE theo cấp): không mất máu, không tính trúng / trượt, không ngắt combo
    if (!xuyenGiap && Math.random() < CELL_NE[c.cap]!) {
      this.chu.push({ id: this.id++, x: tam.x + ngauNhien(-40, 40), y: tam.y - 40, text: 'NÉ!', mau: '#9be7ff', t: 0 });
      return false;
    }
    // Sức mạnh nhân vật nhân sát thương, đậu thần cộng thẳng mỗi đòn (giáp Cell bạo nộ vẫn giảm cả phần cộng thêm)
    sat = sat * (n?.suc ?? 1) + (n?.satDau ?? 0);
    let he = 1;
    if (c.cap === SO_CAP - 1 && !xuyenGiap && !((c.socola ?? 0) > 0)) {
      if ((n?.combo ?? 0) >= CELL_PHA_GIAP) {
        if (Math.random() < 0.3) this.chu.push({ id: this.id++, x: tam.x + ngauNhien(-60, 60), y: tam.y - 110, text: 'PHÁ GIÁP!', mau: '#ff9f1a', t: 0 });
      } else {
        he *= 1 - CELL_GIAP;
        if (Math.random() < 0.3) this.chu.push({ id: this.id++, x: tam.x + ngauNhien(-60, 60), y: tam.y - 110, text: '🛡 GIÁP! CẦN COMBO', mau: '#b8c4d6', t: 0 });
      }
    }
    const mat = Math.max(1, Math.round(sat * he));
    c.hp -= mat;
    c.yen = 0; c.tang = 0;
    c.nhay = CELL_NHAY_T;
    this.chu.push({ id: this.id++, x: tam.x + ngauNhien(-40, 40), y: tam.y - 40, text: `-${mat}`, mau: '#ffffff', t: 0 });
    n.banTrung++;
    if (c.hp > 0) return true;
    c.hp = 0;
    c.chet = true;
    c.tChet = 0;
    c.nap = undefined;
    // Biến socola đủ giết: Cell biến hẳn thành thanh socola (không còn hình Cell), ăn được
    if (soc) {
      const v = { x: c.x, y: c.y };
      giuTrongMap(v, LE_VP);
      // Ăn Cell: nhận 30% máu (tối đa) và 30% sức mạnh của con Cell này
      const luong = Math.max(1, Math.round(CELL_HP[c.cap]! * (c.suc ?? 1) * CELL_AN_TI_LE));
      const sucAn = (CELL_SAT[c.cap]! / CELL_SUC_THAM_CHIEU) * (c.suc ?? 1) * CELL_AN_TI_LE;
      this.vatPham.push({ id: this.id++, x: v.x, y: v.y, t: 0, loai: 'socola', luong, hpGa: CELL_HP[c.cap]!, sucAn });
      c.tChet = CELL_CHET_T;
    }
    this.vet.push({ id: this.id++, x: c.x, y: tam.y, t: 0, loai: 'chay', co: 0.5 + c.cap * 0.15 });
    n.combo++;
    const hs = this.heSo(p);
    const diem = CELL_DIEM[c.cap]! * hs;
    this.congDiem(p, diem, tam.x, tam.y - 70, `+${diem}${hs > 1 ? ` x${hs}` : ''} ${CELL_TEN[c.cap]}`);
    return true;
  }

  /** Đảo của Cell (ván lưu cũ thiếu `dao` thì lấy theo chỗ sinh) */
  private daoCell(c: Cell): number {
    return c.dao ?? (c.dao = daoCua(c.hx, c.hy));
  }

  /** Cell còn sống cuối cùng của đảo nó (để vẽ thanh máu, `veMauCell()`) */
  cellCuoi(c: Cell): boolean {
    if (c.chet) return false;
    const dao = this.daoCell(c);
    return !this.cell.some((k) => k !== c && !k.chet && this.daoCell(k) === dao);
  }

  /** Nhân vật p là mục tiêu hợp lệ của đội Cell đảo `dao`: đang chơi, không ẩn / gục / mây, đứng trên đảo đó (không ở vườn gà) */
  private cellThay(p: number, dao: number): boolean {
    const n = this.nguoi[p];
    return !!n && !n.vang && !this.khuat(n) && !trongVuon(n.x, n.y) && daoCua(n.x, n.y) === dao && trongVongDao(n.x, n.y, dao, CELL_VONG_LE);
  }

  /** Máy bay có Mabu / Zinbu ngồi (đậu, cất cánh hay đang bay) ở trong / gần vòng tròn đảo `dao`: Cell của đảo bắn rơi nó */
  private mbChoCell(dao: number): boolean {
    const m = this.mayBay;
    // Pha 'trung' (sắp nổ) vẫn tính để đội không giải tán: nổ xong người rơi xuống là đuổi luôn
    if (m.pha === 'no' || !m.ngoi.some((p) => !this.nguoi[p]?.het)) return false;
    return !trongVuon(m.x, m.y) && trongVongDao(m.x, m.y, dao, CELL_MB_TAM);
  }

  /** Cell bị đánh: cả đội của đảo xuất trận; nếu đang chỉ có 1 người để đánh mà con bị đánh không phải con tách đàn thì nó thành con tách đàn (con cũ về tiệc) */
  private cellBiDanh(c: Cell, p: number): void {
    const dao = this.daoCell(c);
    const doi = (this.cellDoi[dao] ??= { chien: false, tach: [], muc: -1, dichDan: 0 });
    if (!doi.chien) this.cellXuatTran(dao);
    doi.chien = true;
    if (!c.vai && this.cellThay(p, dao)) { doi.tach = [c.id, ...doi.tach].slice(0, CELL_TACH_SO[c.cap] ?? 1); doi.muc = p; }
  }

  /** Đội Cell của đảo xuất trận (chữ báo một lần) */
  private cellXuatTran(dao: number): void {
    const tc = this.tiec.find((t) => t.dao === dao);
    const c0 = this.cell.find((c) => !c.chet && this.daoCell(c) === dao);
    const x = tc?.x ?? c0?.x, y = tc?.y ?? c0?.y;
    if (x !== undefined && y !== undefined) this.chuGa({ id: this.id++, x, y: y - 300, text: '⚔ CELL XUẤT TRẬN!', mau: '#ff6b6b', t: 0 });
  }

  /**
   * Đội hình Cell mỗi khung (mỗi đảo một đội, chiến đấu theo đồng đội):
   * - Chưa có ai: dự tiệc. Có nhân vật ở bất kỳ đâu trong vòng đảo (chống câu giờ) hoặc Cell bị đánh thì xuất trận.
   * - Luôn có đúng CELL_TACH_SO con tách đàn ('tach', con gần nhân vật nhất; đảo 4 là 2 con) đuổi một người; cả đàn còn lại ('dan') đuổi người kia — con tách đàn là điểm yếu.
   * - Chỉ có 1 người trên đảo (chơi 1 người, người kia gục / trốn / ở nơi khác): cả đàn cùng đuổi người đó.
   * - Con tách đàn chết thì con gần nhất trong đàn tách ra thay. Hết người trên đảo thì cả đội về vòng tiệc.
   */
  private doiHinhCell(): void {
    for (let dao = 0; dao < SO_DAO; dao++) {
      const doi = (this.cellDoi[dao] ??= { chien: false, tach: [], muc: -1, dichDan: 0 });
      const ds = this.cell.filter((c) => !c.chet && this.daoCell(c) === dao);
      const ke = [0, 1].filter((p) => this.cellThay(p, dao));
      const mb = ds.length > 0 && this.mbChoCell(dao);
      if (doi.chien && (!ds.length || (!ke.length && !mb))) doi.chien = false;
      if (!doi.chien && mb) {
        doi.chien = true;
        this.cellXuatTran(dao);
        this.chu.push({ id: this.id++, x: this.mayBay.x, y: this.mayBay.y - 420, text: '🎯 CELL NHẮM BẮN MÁY BAY!', mau: '#ff6b6b', t: 0 });
      }
      // Có nhân vật ở bất kỳ đâu trong vòng đảo là xuất trận (chống câu giờ)
      if (!doi.chien && ds.length && ke.length) {
        doi.chien = true;
        this.cellXuatTran(dao);
      }
      if (!doi.chien) {
        doi.tach = [];
        for (const c of ds) { c.vai = undefined; c.muc = undefined; c.cay = undefined; }
        continue;
      }
      // Con đi ăn đậu (Cell cấp 0–3): còn Cell khác trên đảo thì cả đàn cử 1 con (giữ con cũ; chọn mới thì con xa nhân vật nhất, không phải con tách đàn)
      // trốn đi bắn cây ăn đậu thần; chỉ còn mình nó trên đảo thì nó mới đi đánh (thành con tách đàn)
      let an = ds.length >= 2 && ds[0]!.cap < SO_CAP - 1 ? ds.find((c) => c.id === doi.an) : undefined;
      if (!an && ds.length >= 2 && ds[0]!.cap < SO_CAP - 1) {
        let xa = -1;
        for (const c of ds) {
          if (doi.tach.includes(c.id)) continue;
          let d = Infinity;
          for (const p of ke) d = Math.min(d, hyp(this.nguoi[p].x - c.x, this.nguoi[p].y - c.y));
          if (!ke.length) d = hyp(this.mayBay.x - c.x, this.mayBay.y - c.y);
          if (d > xa) { xa = d; an = c; }
        }
        if (an) this.chuGa({ id: this.id++, x: an.x, y: an.y - 60 * cellK(an.cap), text: '🫘 ĐI ĂN ĐẬU THẦN!', mau: '#7be04a', t: 0 });
      }
      doi.an = an?.id ?? -1;
      if (an) this.cellRaTran(an, 'an', undefined);
      const chien = an ? ds.filter((c) => c !== an) : ds;
      // Chỉ có máy bay (mọi người đều ngồi trên máy bay): cả đội bắn máy bay
      if (!ke.length) {
        doi.tach = [];
        for (const c of chien) this.cellRaTran(c, 'dan', MUC_MB);
        continue;
      }
      const tach = chien.filter((c) => doi.tach.includes(c.id));
      const soTach = Math.min(chien.length, CELL_TACH_SO[ds[0]!.cap] ?? 1);
      if (tach.length && !ke.includes(doi.muc)) doi.muc = ke[0]!;
      while (tach.length < soTach) {
        // Con gần nhân vật nhất (đã có con tách đàn thì gần người con đó đang đuổi) tách đàn đuổi người đó
        let gan = Infinity, chon: Cell | undefined;
        for (const c of chien) {
          if (tach.includes(c)) continue;
          for (const p of tach.length ? [doi.muc] : ke) {
            const d = hyp(this.nguoi[p].x - c.x, this.nguoi[p].y - c.y);
            if (d < gan) { gan = d; chon = c; if (!tach.length) doi.muc = p; }
          }
        }
        if (!chon) break;
        tach.push(chon);
        if (ds.length > 1) this.chuGa({ id: this.id++, x: chon.x, y: chon.y - 60 * cellK(chon.cap), text: '❗ TÁCH ĐÀN', mau: '#ffd166', t: 0 });
        if (chon.cay !== undefined) { chon.cay = undefined; if (!chon.chien) chon.nap = undefined; }
      }
      doi.tach = tach.map((c) => c.id);
      if (!ke.includes(doi.muc)) doi.muc = ke[0]!;
      const khac = ke.find((p) => p !== doi.muc);
      // Người kia ngồi máy bay (đậu chờ): cả đàn bắn máy bay; chỉ 1 người trên đảo thì cả đàn cùng đuổi người đó
      const muc2 = khac ?? (mb ? MUC_MB : doi.muc);
      for (const c of chien) {
        const vai = tach.includes(c) ? 'tach' : muc2 !== undefined ? 'dan' : undefined;
        this.cellRaTran(c, vai, vai === 'tach' ? doi.muc : vai === 'dan' ? muc2 : undefined);
      }
    }
  }

  /** Giao vai cho Cell (rời vòng tiệc nếu có vai) */
  private cellRaTran(c: Cell, vai: 'tach' | 'dan' | 'an' | undefined, muc: number | undefined): void {
    // Con đi ăn đậu đổi vai (thành con tách đàn) giữa lúc vận chưởng bắn cây thì bỏ chưởng đó
    if (c.vai === 'an' && vai !== 'an') { c.cay = undefined; if (c.nap !== undefined && c.chien) { c.nap = undefined; c.chien = false; } }
    if (vai && c.tiec) { c.tiec = false; c.nap = undefined; c.choDich ??= 0; c.choChuong ??= this.t + 0.5 + Math.random() * 2; }
    if (c.muc !== muc && c.nap !== undefined && c.chien && (c.muc === MUC_MB || muc === MUC_MB)) { c.nap = undefined; c.chien = false; }
    c.vai = vai;
    if (vai === 'an') c.tungAn = true;
    c.muc = muc;
  }

  // Cell: đội hình theo `doiHinhCell()`; có mục tiêu thì đánh (đấm đá, chưởng, dịch chuyển tức thời); không có thì về vòng tiệc (hoặc lang thang nếu đảo không có tiệc)
  private capNhatCell(dt: number): void {
    this.doiHinhCell();
    const dtKhung = dt;
    for (const c of this.cell) {
      if (c.chet) { c.tChet += dtKhung; continue; }
      // Tự hồi máu (tới máu tối đa; máu ăn thêm vượt mức thì giữ nguyên)
      const hpMax = cellHpMax(c);
      if (c.hp < hpMax) c.hp = Math.min(hpMax, c.hp + CELL_HOI_MAU * dtKhung);
      // Cell đỏ đầy máu và không bị đánh CELL_DO_TANG_CHO giây: cứ mỗi giây máu tối đa (và máu hiện có) +CELL_DO_TANG, không giới hạn
      if (c.cap === SO_CAP - 1) {
        c.yen = (c.yen ?? CELL_DO_TANG_CHO) + dtKhung;
        if (c.hp >= hpMax && c.yen >= CELL_DO_TANG_CHO) {
          c.tang = (c.tang ?? 0) + dtKhung;
          while (c.tang >= 1) { c.tang -= 1; c.hpThem = (c.hpThem ?? 0) + CELL_DO_TANG; c.hp += CELL_DO_TANG; }
        } else c.tang = 0;
      }
      // Cell ngoài màn hình và xa mọi nhân vật chỉ là "một chấm": cập nhật thưa (mỗi CELL_THUA_NHIP khung, so le theo id) với dt dồn lại
      if (this.cellThua(c)) {
        c.dtThua = (c.dtThua ?? 0) + dtKhung;
        if ((this.khungSo + c.id) % CELL_THUA_NHIP !== 0) continue;
        dt = c.dtThua;
      } else dt = dtKhung + (c.dtThua ?? 0);
      c.dtThua = 0;
      c.phase += dt;
      c.nhay = Math.max(0, c.nhay - dt);
      c.danh = Math.max(0, c.danh - dt);
      // Cell bạo nộ đang hoá socola: đứng yên, không đánh
      if ((c.socola ?? 0) > 0) {
        c.socola = Math.max(0, c.socola! - dt);
        c.chay = false;
        c.nap = undefined;
        continue;
      }
      // Cell đỏ dưới 20% máu (một lần mỗi ván): dịch chuyển đi phá cây ăn đậu thần tới khi trên 60% máu
      if (this.cellHoiPhuc(c, dt)) continue;
      // Cell đỏ truy sát: đã mất ngọc 2 sao thì bám theo Mabu / Zinbu khắp nơi tới khi nó chết
      if (this.cellTruy(c)) {
        this.cellTruyChon(c);
        if (c.muc === undefined) { c.chay = false; c.nap = undefined; c.chien = false; continue; }
      }
      // Cell giữ ngọc không có ai để đánh: đi về chỗ ngồi giữa đảo rồi ngồi im trên viên ngọc
      if (c.ngoi && c.muc === undefined) {
        c.nap = undefined;
        c.chien = false;
        if (this.cellDiToi(c, c.hx, c.hy, dt, 0.8) < 20) { c.x = c.hx; c.y = c.hy; c.chay = false; }
        continue;
      }
      const tcc = this.tiecCua(c);
      if (c.tiec && tcc?.on) { this.cellTiec(c, tcc, dt); continue; }
      // Mọi Cell đang đánh nhau / đi ăn đậu mà thấy đậu thần rơi (trong tầm nhìn, chỗ nó được ăn) thì bỏ đánh, chạy tới ăn trước
      if ((c.muc !== undefined || c.vai === 'an') && this.cellChayAnDau(c, dt)) continue;
      if (c.vai === 'an') { this.cellAnDau(c, dt); continue; }
      if (c.muc === MUC_MB) { this.cellBanMb(c, dt); continue; }
      const ke = c.muc !== undefined ? this.nguoi[c.muc] : undefined;
      if (ke) { this.cellChien(c, ke, dt); continue; }
      c.nap = undefined;
      c.chien = false;
      // Hết việc: đi về chỗ của mình trên vòng tiệc rồi ngồi tiệc tiếp
      if (tcc?.on) {
        const p = viTriVong(tcc, c.goc ?? 0);
        if (this.cellDiToi(c, p.x, p.y, dt, 0.8) < 20 * cellK(c.cap)) { c.tiec = true; c.x = p.x; c.y = p.y; }
        continue;
      }
      // Đảo không có tiệc (ván lưu cũ): lang thang, hay tụ tập
      c.doi -= dt;
      if (c.doi <= 0 || hyp(c.dx - c.x, c.dy - c.y) < 30) {
        const k = cellK(c.cap);
        const ban = this.cell.filter((o) => o !== c && !o.chet && hyp(o.x - c.x, o.y - c.y) < CELL_TU_TAM);
        const g = Math.random() * Math.PI * 2;
        if (ban.length && Math.random() < CELL_TU) {
          const o = ban[Math.floor(Math.random() * ban.length)]!;
          const r = (22 + Math.random() * 30) * k;
          c.dx = o.x + Math.cos(g) * r; c.dy = o.y + Math.sin(g) * r;
        } else {
          const r = 100 + Math.random() * 500;
          c.dx = c.hx + Math.cos(g) * r; c.dy = c.hy + Math.sin(g) * r;
        }
        c.doi = 3 + Math.random() * 4;
      }
      const cu = { x: c.x, y: c.y };
      const b = Math.min(hyp(c.dx - c.x, c.dy - c.y), CELL_TOC[c.cap]! * 0.5 * dt);
      this.cellDiToi(c, c.dx, c.dy, dt, 0.5);
      // Bị bờ biển chặn mà không nhích được thì chọn điểm khác
      if (hyp(c.x - cu.x, c.y - cu.y) < b * 0.3) c.doi = 0;
    }
    // Xác nằm đủ lâu thì biến mất
    this.cell = this.cell.filter((c) => !c.chet || c.tChet < CELL_CHET_T);
  }

  /** Đậu thần Cell được ăn: trong vòng đảo của nó (Cell đỏ đang hồi máu / truy sát thì ở đâu cũng được), khớp với điều kiện ăn trong `capNhatVatPham()` */
  private cellDuocAnDau(c: Cell, v: VatPham): boolean {
    if (c.hoi === 'dang' || this.cellTruy(c)) return true;
    const dao = this.daoCell(c);
    return daoCua(v.x, v.y) === dao && trongVongDao(v.x, v.y, dao);
  }

  /** Thấy đậu thần (trong TAM_NHIN của Cell, chỗ nó được ăn) thì bỏ chưởng đang vận, chạy tới ăn; trả về true khi đang đi ăn */
  private cellChayAnDau(c: Cell, dt: number): boolean {
    let gan = TAM_NHIN + CELL_BK * cellK(c.cap), dau: VatPham | undefined;
    for (const v of this.vatPham) {
      if (v.loai !== 'dau') continue;
      const d = hyp(v.x - c.x, v.y - c.y);
      if (d < gan && this.cellDuocAnDau(c, v)) { gan = d; dau = v; }
    }
    if (!dau) return false;
    if (c.nap !== undefined && c.chien) { c.nap = undefined; c.chien = false; }
    this.cellDiToi(c, dau.x, dau.y, dt, c.vai === 'an' ? CELL_AN_TOC : 1);
    return true;
  }

  /**
   * Con đi ăn đậu (`vai: 'an'`): có đậu thần trên đảo thì chạy tới ăn (`capNhatVatPham()`); không thì tới gần cây chưa đổ gần nhất trên đảo
   * và bắn chưởng cho cây đổ rơi đậu (không ai nhìn thấy nó thì cây đổ luôn, không tạo chùm / hiệu ứng); hết cây thì trốn ra xa nhân vật.
   */
  private cellAnDau(c: Cell, dt: number): void {
    const dao = this.daoCell(c);
    // Gặp Mabu / Zinbu (lại gần trong CELL_AN_GAP, nhân vật nhìn thấy nó): dịch chuyển tức thời tới chỗ trên đảo xa mọi nhân vật nhất để trốn
    if ((c.choDich ?? 0) <= this.t && this.cellTrenCam(c)) {
      const ke = this.nguoi.filter((m) => !m.vang && !this.khuat(m));
      const xaNhat = (x: number, y: number) => ke.reduce((d, m) => Math.min(d, hyp(m.x - x, m.y - y)), Infinity);
      if (ke.length && xaNhat(c.x, c.y) < CELL_AN_GAP) {
        let tot = -1, cho: { x: number; y: number } | undefined;
        for (let i = 0; i < 16; i++) {
          const p = diemTrenDao(dao, 250);
          if (!trongVongDao(p.x, p.y, dao) || trongVuon(p.x, p.y)) continue;
          const d = xaNhat(p.x, p.y);
          if (d > tot) { tot = d; cho = p; }
        }
        c.choDich = this.t + CELL_AN_DICH_HOI;
        if (cho && tot > CELL_AN_GAP) {
          const k = cellK(c.cap);
          c.nap = undefined; c.chien = false; c.chay = false;
          this.vetGa({ id: this.id++, x: c.x, y: c.y - 25 * k, t: 0, loai: 'no' });
          this.chuGa({ id: this.id++, x: c.x, y: c.y - 55 * k, text: '💨 CELL TRỐN!', mau: '#7be04a', t: 0 });
          c.x = cho.x; c.y = cho.y;
          giuTrongMap(c, leCell(c.cap), false, 'dao');
          this.vetGa({ id: this.id++, x: c.x, y: c.y - 25 * k, t: 0, loai: 'no' });
          return;
        }
      }
    }
    if (c.nap !== undefined && c.chien) { this.cellBanChien(c, dt); return; }
    const trenDao = (x: number, y: number) => daoCua(x, y) === dao && trongVongDao(x, y, dao);
    let gan = Infinity, dau: VatPham | undefined;
    for (const v of this.vatPham) {
      if (v.loai !== 'dau' || !trenDao(v.x, v.y)) continue;
      const d = hyp(v.x - c.x, v.y - c.y);
      if (d < gan) { gan = d; dau = v; }
    }
    if (dau) { this.cellDiToi(c, dau.x, dau.y, dt, CELL_AN_TOC); return; }
    gan = Infinity;
    let iCay = -1;
    this.trangTri.forEach((t, i) => {
      if (!t.sa || t.loai !== 0 || t.doLuc !== undefined || !trenDao(t.x, t.y)) return;
      const d = hyp(t.x - c.x, t.y - c.y);
      if (d < gan) { gan = d; iCay = i; }
    });
    if (iCay >= 0) {
      const cay = this.trangTri[iCay]!;
      c.cay = iCay;
      if (gan < CELL_AN_TAM) {
        c.chay = false;
        c.lat = cay.x < c.x;
        if ((c.choChuong ?? 0) > this.t) return;
        if (this.cellTrenCam(c)) this.cellVanChuong(c);
        else {
          this.doCay(cay, cay.x - c.x);
          c.choChuong = this.t + CELL_CHUONG_HOI[c.cap]!;
        }
        return;
      }
      this.cellDiToi(c, cay.x, cay.y, dt, CELL_AN_TOC);
      return;
    }
    c.cay = undefined;
    // Hết cây (đang mọc lại): trốn ra xa nhân vật gần nhất
    let gn = Infinity, n: NguoiChoi | undefined;
    for (const m of this.nguoi) {
      if (m.vang || this.khuat(m)) continue;
      const d = hyp(m.x - c.x, m.y - c.y);
      if (d < gn) { gn = d; n = m; }
    }
    if (!n || gn > CELL_AN_TRON) { c.chay = false; return; }
    const ux = (c.x - n.x) / (gn || 1), uy = (c.y - n.y) / (gn || 1);
    this.cellDiToi(c, c.x + ux * 400, c.y + uy * 400, dt, CELL_AN_TOC);
  }

  /**
   * Cell đỏ hồi máu một lần (`Cell.hoi`): máu dưới CELL_HOI_DUOI thì bỏ đánh, dịch chuyển tức thời tới cây khô xa nhân vật nhất (đảo của nó; đang truy sát
   * thì mọi đảo), bắn đổ cây rồi ăn đậu thần (`capNhatVatPham()`); nhân vật lại gần (CELL_AN_GAP) thì dịch chuyển đi chỗ khác. Trên CELL_HOI_TREN thì đánh tiếp.
   * Trả về true khi đang hồi (capNhatCell() bỏ qua phần đánh).
   */
  private cellHoiPhuc(c: Cell, dt: number): boolean {
    if (c.cap !== SO_CAP - 1 || c.hoi === 'xong' || this.trieuHoi) return false;
    const max = cellHpMax(c);
    const k = cellK(c.cap);
    if (c.hoi === undefined) {
      if (c.hp >= max * CELL_HOI_DUOI) return false;
      c.hoi = 'dang';
      c.choDich = 0;
      this.chuGa({ id: this.id++, x: c.x, y: c.y - 70 * k, text: '🫘 CELL ĐỎ ĐI ĂN ĐẬU THẦN HỒI MÁU!', mau: '#7be04a', t: 0 });
    }
    if (c.hp > max * CELL_HOI_TREN) {
      c.hoi = 'xong';
      c.cay = undefined;
      if (c.nap !== undefined && c.chien) { c.nap = undefined; c.chien = false; }
      this.chuGa({ id: this.id++, x: c.x, y: c.y - 70 * k, text: '🔥 CELL ĐỎ HỒI SỨC, QUAY LẠI ĐÁNH!', mau: '#ff3b30', t: 0 });
      return false;
    }
    const truy = this.cellTruy(c);
    const dao = this.daoCell(c);
    const duocO = (x: number, y: number) => doSau(x, y) > 60 && !trongVuon(x, y) && (truy || (daoCua(x, y) === dao && trongVongDao(x, y, dao)));
    const ke = this.nguoi.filter((m) => !m.vang && !this.khuat(m));
    const xaNhat = (x: number, y: number) => ke.reduce((d, m) => Math.min(d, hyp(m.x - x, m.y - y)), Infinity);
    const cayDung = (t: TrangTri) => !!t.sa && t.loai === 0 && t.doLuc === undefined && duocO(t.x, t.y);
    // Dịch chuyển tức thời: lúc mới bắt đầu, hoặc nhân vật lại gần trong CELL_AN_GAP
    if ((c.choDich ?? 0) <= this.t && (c.hoi === 'dang' && (c.cay === undefined || xaNhat(c.x, c.y) < CELL_AN_GAP))) {
      let tot = -1, cho: { x: number; y: number } | undefined, iCho = -1;
      this.trangTri.forEach((t, i) => {
        if (!cayDung(t)) return;
        const g = Math.random() * Math.PI * 2;
        const x = t.x + Math.cos(g) * CELL_AN_TAM * 0.5, y = t.y + Math.sin(g) * CELL_AN_TAM * 0.3;
        if (!duocO(x, y)) return;
        const d = xaNhat(x, y);
        if (d > tot) { tot = d; cho = { x, y }; iCho = i; }
      });
      // Hết cây: dịch chuyển tới chỗ xa nhân vật nhất trên đảo để đứng tự hồi máu
      if (!cho && ke.length) {
        for (let i = 0; i < 16; i++) {
          const p = diemTrenDao(dao, 250);
          if (!duocO(p.x, p.y)) continue;
          const d = xaNhat(p.x, p.y);
          if (d > tot) { tot = d; cho = p; }
        }
      }
      c.choDich = this.t + CELL_HOI_DICH;
      if (cho && (c.cay === undefined || tot > xaNhat(c.x, c.y))) {
        c.nap = undefined; c.chien = false; c.chay = false;
        this.vetGa({ id: this.id++, x: c.x, y: c.y - 25 * k, t: 0, loai: 'no' });
        c.x = cho.x; c.y = cho.y;
        giuTrongMap(c, leCell(c.cap), truy, 'dao');
        this.vetGa({ id: this.id++, x: c.x, y: c.y - 25 * k, t: 0, loai: 'no' });
        this.chuGa({ id: this.id++, x: c.x, y: c.y - 55 * k, text: '💨 CELL ĐỎ DỊCH CHUYỂN!', mau: '#7be04a', t: 0 });
        if (iCho >= 0) c.cay = iCho;
        return true;
      }
    }
    if (c.nap !== undefined && c.chien) {
      if (c.cay !== undefined) { this.cellBanChien(c, dt); return true; }
      c.nap = undefined; c.chien = false;
    }
    // Có đậu thần gần (trong vùng được đi) thì chạy tới ăn
    let gan = Infinity, dau: VatPham | undefined;
    for (const v of this.vatPham) {
      if (v.loai !== 'dau' || !duocO(v.x, v.y)) continue;
      const d = hyp(v.x - c.x, v.y - c.y);
      if (d < gan) { gan = d; dau = v; }
    }
    if (dau && gan < CELL_AN_TRON) { this.cellDiToi(c, dau.x, dau.y, dt, 1); return true; }
    // Bắn cây đang nhắm (đổ rồi thì chọn cây đứng gần nhất)
    let cay = c.cay !== undefined ? this.trangTri[c.cay] : undefined;
    if (!cay || !cayDung(cay)) {
      gan = Infinity; c.cay = undefined; cay = undefined;
      this.trangTri.forEach((t, i) => {
        if (!cayDung(t)) return;
        const d = hyp(t.x - c.x, t.y - c.y);
        if (d < gan) { gan = d; c.cay = i; cay = t; }
      });
    }
    if (!cay) { c.chay = false; return true; }
    if (hyp(cay.x - c.x, cay.y - c.y) < CELL_AN_TAM) {
      c.chay = false;
      c.lat = cay.x < c.x;
      if ((c.choChuong ?? 0) > this.t) return true;
      if (this.cellTrenCam(c)) this.cellVanChuong(c);
      else { this.doCay(cay, cay.x - c.x); c.choChuong = this.t + CELL_CHUONG_HOI[c.cap]!; }
      return true;
    }
    this.cellDiToi(c, cay.x, cay.y, dt, 1);
    return true;
  }

  /** Cell đỏ (cấp cao nhất) còn sống mà ngọc 2 sao của nó đã bị lấy, hoặc đã chơi tới CELL_TRUY_T: truy sát tới bất kỳ đâu, bỏ qua vòng đảo */
  private cellTruy(c: Cell): boolean {
    return c.cap === SO_CAP - 1 && !c.chet && (this.cellTruyT || this.ngocNhat.includes(NGOC_TIEC_SAO));
  }

  /** Chơi tới CELL_TRUY_T: Cell đỏ (còn sống) rời đảo đi truy sát Mabu / Zinbu mọi nơi cả ván (như bóng ma Goku) */
  private kiemTraCellTruy(): void {
    if (this.cellTruyT || this.tGame < CELL_TRUY_T || banDoHt !== 'sa') return;
    this.cellTruyT = true;
    if (!this.cell.some((c) => c.cap === SO_CAP - 1 && !c.chet)) return;
    const n = this.nguoi.find((m) => !m.vang && !m.het) ?? this.nguoi.find((m) => !m.vang);
    if (n) this.chu.push({ id: this.id++, x: n.x, y: n.y - 420, text: '🔥 5 PHÚT: CELL ĐỎ ĐI TRUY SÁT!', mau: '#ff3b30', t: 0 });
    this.rungMan(0.5, 8);
  }

  /** Ghi nhớ đã có người ra khỏi vườn gà chưa (`daRaVuon`, `cellTruyVuon`, lưu trong ván lưu) */
  private kiemTraOLiVuon(): void {
    if (this.daRaVuon || banDoHt !== 'sa') return;
    if (this.nguoi.some((n) => !n.vang && !trongVuon(n.x, n.y))) { this.daRaVuon = true; return; }
    if (this.tGame < CELL_TRUY_T) return;
    this.daRaVuon = true;
    this.cellTruyVuon = true;
  }

  /** Chơi tới GY_TRUY_T mà bóng ma Goku chưa bị hạ hẳn (còn sống hoặc đang chờ hồi sinh): nó rời núi đá bay đi truy sát Mabu / Zinbu cả ván */
  private kiemTraGyTruy(): void {
    const g = this.ginyu;
    if (this.gyTruy || this.tGame < GY_TRUY_T || (g.chet && !g.choHoi) || banDoHt !== 'sa') return;
    this.gyTruy = true;
    const n = this.nguoi.find((m) => !m.vang && !m.het) ?? this.nguoi.find((m) => !m.vang);
    if (n) this.chu.push({ id: this.id++, x: n.x, y: n.y - 360, text: '👻 15 PHÚT: BÓNG MA GOKU BAY ĐI TRUY SÁT!', mau: '#c39bff', t: 0 });
    this.rungMan(0.5, 8);
  }

  /** Phút 20 (TRIEU_HOI_T) mà còn người chơi sống: người chơi (cả người đang gục), Cell đỏ, Frieza, bóng ma Goku (chưa bị hạ hẳn) bị triệu hồi về thần điện.
   *  Từ đó không ai ra khỏi thần điện được (giamThan(), cổng / máy bay / phi thuyền khoá), đánh tới khi một bên thua; phút 25 chưa có ngọc 4 sao thì sang mê cung bom (kiemTraSangMc()) */
  private kiemTraTrieuHoi(): void {
    if (this.trieuHoi || this.tGame < TRIEU_HOI_T || banDoHt !== 'sa' || this.tThang >= 0) return;
    if (!this.nguoi.some((m) => !m.vang && !m.het)) return;
    this.trieuHoi = true;
    this.cellTruyT = true;
    if (!this.frieza.chet) this.fzTruy = true;
    if (!this.ginyu.chet) this.gyTruy = true;
    // Ra khỏi máy bay / phi thuyền / quả cầu trốn
    const m = this.mayBay;
    if (m.ngoi.length) { m.ngoi = []; m.pha = 'dau'; m.t = 0; m.z = 0; m.x = m.goc.x; m.y = m.goc.y; }
    const pt = this.phiThuyen;
    if (pt.ngoi.length) { pt.ngoi = []; pt.pha = 'dau'; pt.t = 0; pt.z = 0; pt.mo = 0; pt.noi = 'vuon'; pt.x = pt.vuon.x; pt.y = pt.vuon.y; pt.cho = []; }
    for (const q of this.cauTron) if (q.pha === 'trong' || q.pha === 'vo') { q.pha = 'moc'; q.t = 0; }
    // Thần điện trơ trọi: mọi cây cối / vật dụng (điện thờ, chòi, cọ…) nổ tung, chỉ còn nền gạch (mất luôn vật cản); cổng cũng biến mất
    THAN_VAT_TG.forEach((v, k) => {
      if (thanVo[k]) return;
      thanVo[k] = true;
      this.vet.push({ id: this.id++, x: (v.x0 + v.x1) / 2, y: (v.y0 + v.y1) / 2, t: 0, loai: 'chay', co: 1.8 });
    });
    const ds = this.veThanDien();
    // Chỉ triệu hồi trùm còn sống (đã chết, kể cả đang chờ hồi sinh, thì thôi): Cell đỏ giữa sân trên, Frieza trước điện thờ, bóng ma Goku bên cạnh
    const dat = (o: { x: number; y: number }, kx: number, ky: number) => {
      o.x = THAN.x0 + THAN.w * kx;
      o.y = THAN.y0 + THAN.h * ky;
      giamThan(o, false);
      this.vet.push({ id: this.id++, x: o.x, y: o.y - 150, t: 0, loai: 'chay', co: 2 });
    };
    for (const c of this.cell) if (c.cap === SO_CAP - 1 && !c.chet) { dat(c, 0.25, 0.55); c.hoi = 'xong'; c.cay = undefined; }
    if (!this.frieza.chet) dat(this.frieza, 0.5, 0.5);
    if (!this.ginyu.chet) dat(this.ginyu, 0.75, 0.55);
    this.am.phat('chuong');
    this.rungMan(0.8, 14);
    const n = ds.find(({ n }) => !n.het)?.n ?? ds[0]?.n;
    if (n) {
      this.chu.push({ id: this.id++, x: n.x, y: n.y - 420, text: '🏯 PHÚT 20: TẤT CẢ BỊ TRIỆU HỒI VỀ THẦN ĐIỆN!', mau: '#d9b3ff', t: 0 });
      this.chu.push({ id: this.id++, x: n.x, y: n.y - 350, text: '⚔ KHÔNG AI THOÁT ĐƯỢC: HẠ TRÙM LẤY NGỌC RỒNG!', mau: '#ffd23f', t: 0 });
    }
  }

  /** Đưa mọi người chơi (cả người đang gục) tới trước cổng thần điện; trả danh sách người được đưa đi */
  private veThanDien(): { n: NguoiChoi; p: number }[] {
    const ds = this.nguoi.map((n, p) => ({ n, p })).filter(({ n }) => !n.vang);
    ds.forEach(({ n }, i) => {
      n.x = THAN_CONG.x + (ds.length > 1 ? (i === 0 ? -170 : 170) : 0);
      n.y = THAN_CONG.y + CONG_RA_Y;
      n.dich = null;
      n.dangDi = false;
      n.bay = null;
      giamThan(n, false);
      this.vet.push({ id: this.id++, x: n.x, y: n.y - 120, t: 0, loai: 'chay', co: 1.4 });
    });
    this.congCho = ds.map(({ p }) => p);
    this.camNgay = true;
    return ds;
  }

  /** Phút 25 (SANG_MC_T, đã triệu hồi): còn người sống mà chưa nhặt ngọc 4 sao thì cả đội (cả người gục) bị dịch chuyển tới cửa hầm mê cung bom
   *  (đầu hầm phía đảo 1, chưa vào map mê cung) để vào lấy ngọc; trùm vẫn bị giam trên thần điện. Nhặt được ngọc 4 sao, ra khỏi mê cung mà còn
   *  thiếu ngọc (trùm trên thần điện chưa bị hạ) thì bị triệu hồi lại về thần điện */
  private kiemTraSangMc(): void {
    if (!this.trieuHoi || banDoHt !== 'sa' || this.tThang >= 0) return;
    const coNgoc = this.ngocNhat.includes(MC_NGOC_SAO);
    if (this.sangMc) {
      if (!coNgoc || this.duNgoc() || this.nguoi.some((m) => !m.vang && this.vungMc(m))) return;
      this.sangMc = false;
      const ds = this.veThanDien();
      const n = ds.find(({ n }) => !n.het)?.n ?? ds[0]?.n;
      if (n) this.chu.push({ id: this.id++, x: n.x, y: n.y - 420, text: '🏯 CÒN THIẾU NGỌC: TRIỆU HỒI LẠI VỀ THẦN ĐIỆN!', mau: '#d9b3ff', t: 0 });
      this.rungMan(0.6, 10);
      return;
    }
    if (coNgoc || this.tGame < SANG_MC_T || !this.nguoi.some((m) => !m.vang && !m.het)) return;
    this.sangMc = true;
    const ds = this.nguoi.map((n, p) => ({ n, p })).filter(({ n }) => !n.vang);
    ds.forEach(({ n }, i) => {
      n.x = MC_HAM.x1 - 200;
      n.y = MC_HAM.y + (ds.length > 1 ? (i === 0 ? -110 : 110) : 0);
      n.dich = null;
      n.dangDi = false;
      n.bay = null;
      this.vet.push({ id: this.id++, x: n.x, y: n.y - 120, t: 0, loai: 'chay', co: 1.4 });
    });
    this.congCho = ds.map(({ p }) => p);
    this.camNgay = true;
    this.am.phat('chuong');
    this.rungMan(0.8, 14);
    const n = ds.find(({ n }) => !n.het)?.n ?? ds[0]?.n;
    if (n) {
      this.chu.push({ id: this.id++, x: n.x, y: n.y - 420, text: '🧨 PHÚT 25: DỊCH CHUYỂN TỚI MÊ CUNG BOM!', mau: '#ffb347', t: 0 });
      this.chu.push({ id: this.id++, x: n.x, y: n.y - 350, text: '⭐ VÀO MÊ CUNG LẤY NGỌC RỒNG 4 SAO!', mau: '#ffd23f', t: 0 });
    }
  }

  /** Đã triệu hồi: Cell đỏ, Frieza, bóng ma Goku không ra khỏi thần điện (dịch chuyển / bay ra thì bị kéo lại) */
  private giamTrumThan(): void {
    if (!this.trieuHoi) return;
    for (const c of this.cell) if (c.cap === SO_CAP - 1 && !c.chet) giamThan(c, false);
    if (!this.frieza.chet) giamThan(this.frieza, false);
    if (!this.ginyu.chet) giamThan(this.ginyu, true);
  }

  /** Đếm ngược trên thanh đen: phút cuối trước khi triệu hồi, và thời gian còn phải trụ trên thần điện */
  demNguoc(): { chu: string; mau: string } | null {
    if (banDoHt !== 'sa' || this.tThang >= 0) return null;
    const mmss = (s: number) => { const g = Math.max(0, Math.ceil(s)); return `${Math.floor(g / 60)}:${String(g % 60).padStart(2, '0')}`; };
    if (this.trieuHoi) {
      if (this.sangMc || this.ngocNhat.includes(MC_NGOC_SAO)) return null;
      return { chu: `🧨 Sang mê cung bom: ${mmss(SANG_MC_T - this.tGame)}`, mau: '#ffb347' };
    }
    if (this.tGame >= TRIEU_HOI_T - TRIEU_HOI_BAO) return { chu: `⚠ Triệu hồi về thần điện: ${mmss(TRIEU_HOI_T - this.tGame)}`, mau: '#d9b3ff' };
    return null;
  }

  /** Đã nhặt đủ NGOC_THANG viên ngọc rồng (1 sao vua gà · 2 sao Cell đỏ · 3 sao bóng ma Goku · 4 sao mê cung bom · 5 sao Frieza) chưa */
  private duNgoc(): boolean {
    for (let s = 1; s <= NGOC_THANG; s++) if (!this.ngocNhat.includes(s)) return false;
    return true;
  }

  /** Nhặt đủ 5 viên ngọc rồng (phải hạ 4 trùm và thắng mê cung bom) thì thắng sau THANG_CHO giây (cho hoạt ảnh chạy xong) */
  private kiemTraThang(dt: number): void {
    if (banDoHt !== 'sa') return;
    if (this.tThang < 0) {
      if (!this.duNgoc()) return;
      this.tThang = 0;
      const n = this.nguoi.find((m) => !m.vang && !m.het) ?? this.nguoi.find((m) => !m.vang);
      if (n) this.chu.push({ id: this.id++, x: n.x, y: n.y - 360, text: `🏆 ĐỦ ${NGOC_THANG} VIÊN NGỌC RỒNG: CHIẾN THẮNG!`, mau: '#ffd23f', t: 0 });
      this.nguoi.forEach((_, q) => this.chuongLenTroi(q));
      return;
    }
    this.tThang += dt;
    if (this.tThang >= THANG_CHO) this.ketThuc(true);
  }

  /** Chơi tới HOP_THE_MO_T: hợp thể Super Bư mở khoá ở mọi nơi; báo một lần ngay lúc qua mốc (tải ván đã quá mốc thì không báo) */
  private kiemTraHopMo(): void {
    if (this.hopMoBao || this.tGame < HOP_THE_MO_T) return;
    this.hopMoBao = true;
    if (this.tGame > HOP_THE_MO_T + 2 || banDoHt !== 'sa') return;
    const doi = this.nguoi.length === 2 && this.nguoi[0]!.ki + this.nguoi[1]!.ki === 1;
    const n = this.nguoi.find((m) => !m.vang && !m.het) ?? this.nguoi.find((m) => !m.vang);
    if (doi && n) this.chu.push({ id: this.id++, x: n.x, y: n.y - 300, text: '✨ 8 PHÚT: MỞ KHOÁ HỢP THỂ SUPER BƯ Ở MỌI NƠI!', mau: '#ffd23f', t: 0 });
  }

  /** Hợp thể Super Bư được ở mọi nơi: từ phút 8 (HOP_THE_MO_T) hoặc khi Frieza đã bay đi truy sát */
  private hopTheMo(): boolean {
    return this.fzTruy || this.tGame >= HOP_THE_MO_T;
  }

  /** Chơi tới FZ_TRUY_T: Frieza (còn sống) rời thần điện bay đi truy sát mọi nơi cả ván (như bóng ma Goku) */
  private kiemTraFzTruy(): void {
    if (this.fzTruy || this.tGame < FZ_TRUY_T || this.frieza.chet || banDoHt !== 'sa') return;
    this.fzTruy = true;
    const n = this.nguoi.find((m) => !m.vang && !m.het) ?? this.nguoi.find((m) => !m.vang);
    if (n) {
      this.chu.push({ id: this.id++, x: n.x, y: n.y - 360, text: '💜 10 PHÚT: FRIEZA BAY ĐI TRUY SÁT!', mau: '#d9b3ff', t: 0 });
    }
    this.rungMan(0.5, 8);
  }

  /** Chọn mục tiêu cho Cell đang truy sát: người đi bộ gần nhất (không ẩn / gục / mây / trong cầu), không thì máy bay có người ngồi, không thì đứng chờ */
  private cellTruyChon(c: Cell): void {
    if (!this.cellTruyBao) {
      this.cellTruyBao = true;
      this.chuGa({ id: this.id++, x: c.x, y: c.y - 300, text: '🔥 CELL ĐỎ TRUY SÁT!', mau: '#ff3b30', t: 0 });
    }
    let gan = Infinity, chon = -1;
    this.nguoi.forEach((n, p) => {
      if (n.vang || this.khuat(n)) return;
      const d = hyp(n.x - c.x, n.y - c.y);
      if (d < gan) { gan = d; chon = p; }
    });
    const m = this.mayBay;
    const mb = m.pha !== 'no' && m.ngoi.some((p) => !this.nguoi[p]?.het);
    this.cellRaTran(c, chon >= 0 || mb ? 'tach' : undefined, chon >= 0 ? chon : mb ? MUC_MB : undefined);
  }

  /** Cell đi về (x, y) với tốc độ CELL_TOC × he, quay mặt theo hướng đi; trả về khoảng cách còn lại */
  private cellDiToi(c: Cell, x: number, y: number, dt: number, he: number): number {
    const dx = x - c.x, dy = y - c.y, dd = hyp(dx, dy);
    c.chay = dd > 20 && c.danh <= 0;
    if (!c.chay) return dd;
    const cx = c.x, cy = c.y;
    const b = Math.min(dd, CELL_TOC[c.cap]! * he * dt);
    c.x += (dx / dd) * b;
    c.y += (dy / dd) * b;
    c.lat = dx < 0;
    if (this.cellTruy(c)) {
      // Truy sát: đi khắp thế giới (qua biển, vào vườn gà), không bị giữ trong vòng đảo
      giuTrongMap(c, leCell(c.cap), true, 'dao');
      return dd - b;
    }
    giuTrongMap(c, leCell(c.cap), false, 'dao');
    this.cellTrongVong(c, cx, cy);
    return dd - b;
  }

  /** Cell không bao giờ ra khỏi vòng tròn đảo của mình (kéo về mép vòng; vẫn lọt ra / sang đảo khác / xuống biển thì đứng lại chỗ cũ (cx, cy)) */
  private cellTrongVong(c: Cell, cx: number, cy: number): void {
    const dao = this.daoCell(c);
    const d = DAO[dao];
    if (!d) return;
    if (trongVongDao(cx, cy, dao) && !trongVongDao(c.x, c.y, dao)) {
      const kc = hyp(c.x - d.x, c.y - d.y) || 1;
      const r = d.r * 0.999;
      c.x = d.x + ((c.x - d.x) / kc) * r;
      c.y = d.y + ((c.y - d.y) / kc) * r;
    }
    // Đang ở ngoài vòng sẵn (ván lưu cũ): chỉ cho đi vào trong
    const ngoai = !trongVongDao(cx, cy, dao);
    const xa = (x: number, y: number) => hyp(x - d.x, y - d.y);
    if (doSau(c.x, c.y) <= 0 || daoCua(c.x, c.y) !== dao || (!ngoai && !trongVongDao(c.x, c.y, dao)) || (ngoai && xa(c.x, c.y) > xa(cx, cy))) { c.x = cx; c.y = cy; }
  }

  /**
   * Cell bắn máy bay có Mabu / Zinbu ngồi: đứng trong vòng đảo, quay về máy bay, máy bay xa thì đi tới (không ra khỏi vòng),
   * trong tầm thì vận chưởng (chùm dài CELL_MB_CHUONG_TAM, nhắm đón đầu); chùm chạm máy bay là máy bay nổ, người rơi xuống thì cả đội đuổi đánh.
   */
  private cellBanMb(c: Cell, dt: number): void {
    if (c.nap !== undefined && c.chien) { this.cellBanChien(c, dt); return; }
    const t = this.tamMb();
    const d = hyp(t.x - c.x, t.y - c.y);
    c.lat = t.x < c.x;
    if ((c.choChuong ?? 0) <= this.t && d < CELL_MB_CHUONG_TAM && this.cellThayMb(c) && Math.random() < dt * 3) { this.cellVanChuong(c); return; }
    if (d > CELL_MB_CHUONG_TAM * 0.6) this.cellDiToi(c, this.mayBay.x, this.mayBay.y, dt, 1);
    else c.chay = false;
    c.lat = t.x < c.x;
  }

  /**
   * Cell đánh nhân vật `ke`: đang vận chưởng thì đứng yên tới lúc phóng; xa quá thì dịch chuyển tức thời tới sát bên (con tách đàn theo hồi chiêu riêng,
   * cả đàn chỉ một con mỗi CELL_DICH_DAN giây); trong tầm thì thỉnh thoảng vận chưởng; chạm thì đấm / đá; không thì chạy tới (cả đàn đứng vây quanh, mỗi con một góc).
   */
  private cellChien(c: Cell, ke: NguoiChoi, dt: number): void {
    const to = CELL_TO[c.cap]!;
    const cham = CELL_CHAM * to;
    if (c.nap !== undefined && c.chien) { this.cellBanChien(c, dt); return; }
    const d = hyp(ke.x - c.x, ke.y - c.y);
    c.lat = ke.x < c.x;
    const doi = this.cellDoi[this.daoCell(c)];
    // Dịch chuyển tức thời tới sát mục tiêu
    const thay = this.cellThayMuc(c, ke.x, ke.y);
    if (thay && d > cham + CELL_DICH_XA && (c.choDich ?? 0) <= this.t && (c.vai === 'tach' || (doi?.dichDan ?? 0) <= this.t)) {
      if (c.vai === 'dan' && doi) doi.dichDan = this.t + CELL_DICH_DAN;
      this.cellDichChuyen(c, ke);
      return;
    }
    // Vận chưởng khi mục tiêu trong tầm (không quá sát)
    if (thay && (c.choChuong ?? 0) <= this.t && d > cham * 0.5 && d < CELL_CHUONG_TAM && Math.random() < dt * 1.5) {
      this.cellVanChuong(c);
      return;
    }
    // Đấm / đá khi chạm
    if (d < cham && c.choDanh <= this.t && !ke.nv.khoa) {
      c.choDanh = this.t + CELL_HOI[c.cap]!;
      c.danh = CELL_DANH_T;
      this.nhanSatThuong(ke, Math.round(CELL_SAT[c.cap]! * (c.suc ?? 1) + (c.satDau ?? 0)));
    }
    // Con Bư đứng sát thì Cell cũng đấm (không phải đứng chờ)
    if (this.conBu.length && c.choDanh <= this.t) {
      const cb = this.conBuGan(c.x, c.y, cham);
      if (cb) { c.choDanh = this.t + CELL_HOI[c.cap]!; c.danh = CELL_DANH_T; this.conBuNhan(cb, Math.round(CELL_SAT[c.cap]! * (c.suc ?? 1) + (c.satDau ?? 0))); }
    }
    // Chạy tới: con tách đàn lao thẳng, cả đàn đứng vây quanh mỗi con một góc
    const vay = c.vai === 'dan' || (doi?.tach.length ?? 0) > 1;
    const g = vay ? c.id * 2.399 : 0;
    const r = vay ? cham * 0.6 : 0;
    const tx = ke.x + Math.cos(g) * r, ty = ke.y + Math.sin(g) * r * 0.6;
    if (hyp(tx - c.x, ty - c.y) > cham * 0.5) this.cellDiToi(c, tx, ty, dt, 1);
    else c.chay = false;
    c.lat = ke.x < c.x;
  }

  /** Bắt đầu vận chưởng chiến đấu: biến hình → hào quang → phóng (cùng hoạt ảnh với tiệc), một trong 3 loại ngẫu nhiên */
  private cellVanChuong(c: Cell): void {
    c.chien = true;
    c.nap = 0;
    c.chay = false;
    c.loaiChuong = Math.floor(Math.random() * CHUONG_LOAI.length);
  }

  /** Đang vận chưởng chiến đấu: quay theo mục tiêu tới lúc phóng; phóng thì chùm bay thẳng về chỗ mục tiêu đang đứng (chạy ngang để né) */
  private cellBanChien(c: Cell, dt: number): void {
    const truoc = c.nap!;
    const nhanh = c.cap === 4 ? CELL_DO_NHANH : 1; // Cell đỏ: tung chưởng nhanh hơn ~30%
    c.nap = truoc + dt * nhanh;
    c.chay = false;
    const banMb = c.muc === MUC_MB;
    // Bắn máy bay: nhắm đón đầu chỗ máy bay sẽ tới khi chùm bay tới (TIEC_CHUONG_T)
    const tMb = banMb ? this.tamMb() : null;
    // Con đi ăn đậu: bắn vào thân cây đang nhắm
    const cay = (c.vai === 'an' || c.hoi === 'dang') && c.cay !== undefined ? this.trangTri[c.cay] : undefined;
    const ke = cay ? { x: cay.x, y: cay.y - 40 } : tMb ? { x: tMb.x + this.mbVx * TIEC_CHUONG_T / nhanh, y: tMb.y + this.mbVy * TIEC_CHUONG_T / nhanh + 70 } : c.muc !== undefined ? this.nguoi[c.muc] : undefined;
    const luc = TIEC_BIEN + TIEC_AURA;
    if (ke && truoc < luc) c.lat = ke.x < c.x;
    if (ke && truoc < luc && c.nap >= luc) {
      const k = cellK(c.cap);
      const l = CHUONG_LOAI[c.loaiChuong ?? 0]!;
      const hx = c.x + (c.lat ? -1 : 1) * l.tayX * k, hy = c.y - l.tayY * k;
      const tx = ke.x, ty = ke.y - 70;
      const dd = hyp(tx - hx, ty - hy) || 1;
      const dai = cay ? dd : Math.min(banMb ? CELL_MB_CHUONG_TAM : CELL_CHUONG_TAM, Math.max(dd + 250, 500));
      this.chuongTiec.push({
        id: this.id++, k, loai: c.loaiChuong ?? 0, x0: hx, y0: hy,
        x1: hx + ((tx - hx) / dd) * dai, y1: hy + ((ty - hy) / dd) * dai, t: 0,
        ...(cay ? { cay: c.cay, cap: c.cap } : { sat: Math.round(CELL_CHUONG_SAT[c.cap]! * (c.suc ?? 1) + (c.satDau ?? 0)), cap: c.cap }),
      });
      this.vetGa({ id: this.id++, x: hx, y: hy, t: 0, loai: 'chay', co: 0.25 + 0.05 * k });
    }
    if (c.nap >= luc + TIEC_PHONG) {
      c.nap = undefined;
      c.chien = false;
      c.choChuong = this.t + CELL_CHUONG_HOI[c.cap]!;
    }
  }

  /** Dịch chuyển tức thời tới sát nhân vật (một góc trên cát cùng đảo), rồi ngay lập tức đấm đá hoặc vận chưởng sát mặt */
  private cellDichChuyen(c: Cell, ke: NguoiChoi): void {
    const to = CELL_TO[c.cap]!;
    const k = cellK(c.cap);
    const dao = this.daoCell(c);
    const r = CELL_CHAM * to * 0.7;
    const g0 = Math.random() * Math.PI * 2;
    let x = c.x, y = c.y, duoc = false;
    for (let i = 0; i < 10 && !duoc; i++) {
      const g = g0 + (i / 10) * Math.PI * 2;
      x = ke.x + Math.cos(g) * r; y = ke.y + Math.sin(g) * r * 0.6;
      duoc = this.cellTruy(c) || (doSau(x, y) > 60 && !trongVuon(x, y) && daoCua(x, y) === dao && trongVongDao(x, y, dao));
    }
    c.choDich = this.t + CELL_DICH_HOI[c.cap]!;
    if (!duoc) return;
    this.vetGa({ id: this.id++, x: c.x, y: c.y - 25 * k, t: 0, loai: 'no' });
    c.x = x; c.y = y;
    giuTrongMap(c, leCell(c.cap), this.cellTruy(c), 'dao');
    c.lat = ke.x < c.x;
    c.chay = false;
    this.vetGa({ id: this.id++, x: c.x, y: c.y - 25 * k, t: 0, loai: 'no' });
    this.chuGa({ id: this.id++, x: c.x, y: c.y - 55 * k, text: '⚡ DỊCH CHUYỂN!', mau: '#7fe0ff', t: 0 });
    if ((c.choChuong ?? 0) <= this.t && Math.random() < 0.5) this.cellVanChuong(c);
    else c.choDanh = this.t + 0.3;
  }

  /** Cell (mọi cấp) dính Biến socola mà chưa chết: hoá socola CELL_SOCOLA_T giây (đứng yên, không giáp) */
  private socolaCell(c: Cell): void {
    if (c.chet) return;
    c.socola = CELL_SOCOLA_T;
    c.comboSoc = false;
    c.nap = undefined;
    c.chien = false;
    const t = this.tamCell(c);
    this.chu.push({ id: this.id++, x: t.x, y: t.y - 150, text: c.cap === SO_CAP - 1 ? '🍫 CELL HOÁ SOCOLA! MABU DÙNG MÂY!' : '🍫 CELL HOÁ SOCOLA!', mau: '#c68642', t: 0 });
  }

  // ─── Tiệc sinh nhật của Cell ───

  /** Tiệc của đảo Cell `c` */
  tiecCua(c: Cell): Tiec | undefined {
    return this.tiec.find((t) => t.dao === c.dao);
  }

  /** Một Cell dự tiệc: cả đội đi vòng quanh bánh liên tục (animation chạy); cứ `TIEC_BAN_CACH` = 3s chỉ một con (lần lượt từng con) dừng chạy: biến hình → vận nội công (hào quang) → phóng một loại chưởng ngẫu nhiên vào bánh, rồi lại chạy tiếp */
  private cellTiec(c: Cell, tc: Tiec, dt: number): void {
    const k = cellK(c.cap);
    c.lat = tc.x < c.x;
    c.goc = (c.goc ?? 0) + ((TIEC_TOC * k) / tc.bk) * dt;
    const p = viTriVong(tc, c.goc);
    c.x = p.x; c.y = p.y;
    // Con nào tới lượt bắn: lần lượt theo thứ tự trong đội tiệc của đảo
    const doi = this.cell.filter((q) => q.dao === c.dao && q.tiec && !q.chet);
    const idx = doi.indexOf(c);
    const u = tc.t % TIEC_BAN_CACH;
    const luot = Math.floor(tc.t / TIEC_BAN_CACH) % Math.max(1, doi.length);
    if (idx !== luot || u >= TIEC_BIEN + TIEC_AURA + TIEC_PHONG) {
      c.nap = undefined;
      c.chay = true;
      c.lat = Math.sin(c.goc) > 0;
      return;
    }
    c.chay = false;
    const truoc = c.nap;
    c.nap = u;
    if (truoc === undefined) c.loaiChuong = Math.floor(Math.random() * CHUONG_LOAI.length);
    const luc = TIEC_BIEN + TIEC_AURA;
    // Chưởng vào bánh chỉ để đẹp: không ai nhìn thấy Cell thì không tạo chùm / vụ nổ
    if ((truoc ?? 0) < luc && c.nap >= luc && this.cellTrenCam(c)) {
      const l = CHUONG_LOAI[c.loaiChuong ?? 0]!;
      const hx = c.x + (c.lat ? -1 : 1) * l.tayX * k, hy = c.y - l.tayY * k;
      this.chuongTiec.push({
        id: this.id++, k, loai: c.loaiChuong ?? 0,
        x0: hx, y0: hy,
        x1: tc.x + ngauNhien(-50, 50) * tc.to / 0.6, y1: tc.y - 150 * tc.to + ngauNhien(-60, 60) * tc.to / 0.6, t: 0,
      });
      this.vetGa({ id: this.id++, x: hx, y: hy, t: 0, loai: 'chay', co: 0.25 + 0.05 * k });
    }
  }

  /** Khung trong hàng của cấp Cell ở atlas `SP_CELL_TIEC`: biến hình · hào quang (xoay 3 khung) · phóng theo loại chưởng; null nếu không trong chu trình */
  cellTiecKhung(c: Cell): number | null {
    if (c.nap === undefined || c.chet) return null;
    if (c.nap < TIEC_BIEN) return TIEC_KHUNG.bien;
    if (c.nap < TIEC_BIEN + TIEC_AURA) return TIEC_KHUNG.hao[Math.floor(c.nap * 14) % 3]!;
    return TIEC_KHUNG.phong[c.loaiChuong ?? 0]!;
  }

  /** Chưởng của tiệc bay tới bánh thì nổ; đếm giờ tiệc */
  private capNhatTiec(dt: number): void {
    for (const q of this.chuongTiec) {
      q.t += dt * (q.cap === 4 ? CELL_DO_NHANH : 1);
      if (q.t < TIEC_CHUONG_T) continue;
      this.vetGa({ id: this.id++, x: q.x1, y: q.y1, t: 0, loai: 'chay', co: q.sat ? 0.6 : 0.35 });
      if (q.sat) { if (q.fz) this.chuongFzTrung(q); else this.chuongCellTrung(q); }
      // Chưởng của con đi ăn đậu tới cây: cây đổ, rơi đậu thần
      const cay = q.cay !== undefined ? this.trangTri[q.cay] : undefined;
      if (cay && cay.doLuc === undefined) this.doCay(cay, q.x1 - q.x0);
    }
    this.chuongTiec = this.chuongTiec.filter((q) => q.t < TIEC_CHUONG_T);
    for (const tc of this.tiec) if (tc.on) tc.t += dt;
  }

  /**
   * Chưởng chiến đấu của Cell tới nơi: ai (không ẩn / gục / mây) nằm trên chùm thì trúng (vẫn né / giảm 50%); chưởng Cell bạo nộ còn phá combo người trúng.
   * Combo chưởng: chưởng trúng cùng một người trong CELL_COMBO_CUA giây kể từ phát trúng trước thì nối chuỗi; Cell cấp 0–3 từ đòn 2 × CELL_COMBO_CHUONG, Cell bạo nộ × CELL_DO_COMBO theo thứ tự đòn.
   */
  private chuongCellTrung(q: ChuongTiec): void {
    const rong = CELL_CHUONG_RONG * q.k;
    const vx = q.x1 - q.x0, vy = q.y1 - q.y0, L2 = vx * vx + vy * vy || 1;
    // Chùm chạm máy bay (có người ngồi hay không) thì máy bay trúng rồi nổ: người trên máy bay rơi xuống (trên cát đứng dậy, xuống biển thì chết)
    const m = this.mayBay;
    if (m.pha !== 'trung' && m.pha !== 'no') {
      const t = this.tamMb();
      const u = Math.max(0, Math.min(1, ((t.x - q.x0) * vx + (t.y - q.y0) * vy) / L2));
      if (hyp(t.x - (q.x0 + vx * u), t.y - (q.y0 + vy * u)) < rong + MB_TRUNG_BK * 0.7) {
        if (m.ngoi.length) this.chu.push({ id: this.id++, x: t.x, y: t.y - 260, text: '🎯 CELL BẮN RƠI MÁY BAY!', mau: '#ff6b6b', t: 0 });
        this.trungMb();
      }
    }
    for (const n of this.nguoi) {
      if (n.vang || this.khuat(n)) continue;
      const px = n.x, py = n.y - 70;
      const u = Math.max(0, Math.min(1, ((px - q.x0) * vx + (py - q.y0) * vy) / L2));
      if (hyp(px - (q.x0 + vx * u), py - (q.y0 + vy * u)) > rong) continue;
      const p = this.nguoi.indexOf(n);
      const cap = q.cap ?? 0;
      const combo = this.t - (this.cellChuongLuc[p] ?? -99) <= (CELL_COMBO_CUA[cap] ?? 0.5);
      // Cell bạo nộ: hệ số theo thứ tự đòn trong chuỗi (đòn 2 ×1,5 · đòn 3 ×2 · từ đòn 4 ×3); Cell khác: từ đòn 2 ×CELL_COMBO_CHUONG
      const thu = combo ? (cap === SO_CAP - 1 ? (this.cellComboDem[p] ?? 1) + 1 : 2) : 1;
      const he = cap === SO_CAP - 1
        ? CELL_DO_COMBO[Math.min(thu, CELL_DO_COMBO.length) - 1]
        : (thu > 1 ? CELL_COMBO_CHUONG[cap] ?? 1 : 1);
      if (he > 1) this.chu.push({ id: this.id++, x: n.x, y: n.y - 300, text: `💥 COMBO CHƯỞNG CELL x${String(he).replace('.', ',')}!`, mau: '#ff9f1a', t: 0 });
      if (this.nhanSatThuong(n, q.sat! * he)) {
        this.cellChuongLuc[p] = this.t;
        if (cap === SO_CAP - 1) this.cellComboDem[p] = thu;
      }
      if (q.cap === SO_CAP - 1 && n.combo > 0) {
        n.combo = 0;
        this.chu.push({ id: this.id++, x: n.x, y: n.y - 270, text: 'MẤT COMBO!', mau: '#ff6b6b', t: 0 });
      }
    }
    this.conBuTrungChum(q.x0, q.y0, vx, vy, L2, rong, q.sat!);
  }

  /** Bộ lọc màu của Cell: Cell bạo nộ đang hoá socola thì nhuộm nâu */
  cellLoc(c: Cell): string | null {
    return (c.socola ?? 0) > 0 ? LOC_SOCOLA : null;
  }

  // Khung hình Cell: ngã · trúng đòn · đánh · chạy · đứng
  cellKhung(c: Cell): number {
    if (c.chet) return CELL_KHUNG.chet;
    if (c.nhay > 0) return CELL_KHUNG.thuong;
    if (c.danh > 0) return CELL_KHUNG.danh[c.danh > CELL_DANH_T / 2 ? 0 : 1];
    if (c.chay) return CELL_KHUNG.chay[Math.floor(c.phase * 9) % CELL_KHUNG.chay.length];
    return CELL_KHUNG.dung[Math.floor(c.phase * 2.5) % CELL_KHUNG.dung.length];
  }

  // Quái chạm nhân vật thì đánh (mỗi con có thời gian chờ riêng). Nhân vật dạng mây, đang ngã hoặc đã hết máu thì bỏ qua.
  private gaDanhNguoi(): void {
    // Nhân vật đánh được tính một lần cho cả khung (không gọi khuat() cho từng con gà)
    const muc = this.nguoi.filter((n) => !this.khuat(n) && !n.nv.khoa);
    if (!muc.length) return;
    for (const g of this.ga) {
      // Gà mẹ gốc không đi đánh; gà mẹ đang là socola thì đứng yên không đánh; gà đang cập nhật thưa (dtThua) ở xa mọi nhân vật nên bỏ qua
      if (g.chet || g.chieu || g.goc || g.dtThua || (g.socola ?? 0) > 0 || (g.choang ?? 0) > 0 || (g.choDanh ?? 0) > this.t) continue;
      let danh = false;
      for (const n of muc) {
        if (n.het) continue;
        if (hyp(n.x - g.x, n.y - g.y) >= CHAM_GA[g.loai] * (g.to ?? 1)) continue;
        g.choDanh = this.t + HOI_DANH_GA[g.loai];
        g.mo = MO_THOI_GIAN;
        if (g.loai === 'boss') g.kieuMo = ((g.kieuMo ?? 0) + 1) % 2;
        g.lat = n.x < g.x;
        this.nhanSatThuong(n, satGa(g));
        danh = true;
        break;
      }
      // Không có nhân vật nào trong tầm mà có con Bư đứng sát thì mổ con Bư
      if (!danh && this.conBu.length) this.conBuBiGaDanh(g);
    }
  }

  // khongNe: đòn phản / đốt cháy không né được; mauChu: màu chữ bay
  // Trả về true nếu thật sự trúng (không né, không trong cầu / máy bay)
  // mcKieu: trong mê cung bom gục vì lửa (chờ xô nước) hay vì nước / quái (bong bóng, chờ kiếm / kim châm)
  private nhanSatThuong(n: NguoiChoi, sat: number, khongNe = false, mauChu = '#ff4d4d', mcKieu: 'chay' | 'bong' = 'bong'): boolean {
    if (this.trongCau(this.nguoi.indexOf(n)) || this.trongMb(this.nguoi.indexOf(n)) || this.biNhap(this.nguoi.indexOf(n))) return false;
    if (!khongNe && Math.random() < NE_NV) {
      this.chu.push({ id: this.id++, x: n.x, y: n.y - 220, text: 'NÉ!', mau: '#9be7ff', t: 0 });
      return false;
    }
    // Mê cung bom: chỉ 1 mạng, dính đòn là gục (máu trả lại khi ra khỏi mê cung)
    const motMang = this.motMang(this.nguoi.indexOf(n)) && this.hopThe?.chu !== this.nguoi.indexOf(n);
    // Mê cung bom: gục không hoá mây / socola, nằm tại chỗ chờ đồng đội cứu bằng đúng đồ (mạng dự phòng thì đứng dậy ngay)
    if (motMang) { this.mcChet(this.nguoi.indexOf(n), mcKieu); return true; }
    const nhan = motMang ? Math.max(1, Math.ceil(n.hp)) : Math.round(sat * (1 - GIAM_NV));
    n.thuongLuc = this.tGame;
    this.chu.push({ id: this.id++, x: n.x, y: n.y - 220, text: motMang ? '💀 MẤT MẠNG!' : `-${nhan}`, mau: mauChu, t: 0 });
    n.hp = Math.max(0, n.hp - nhan);
    this.rung = Math.max(this.rung, 0.15);
    this.rungTayCam(this.nguoi.indexOf(n), n.hp <= 0 ? 600 : 180, n.hp <= 0 ? 1 : 0.6);
    if (n.hp > 0) return true;
    // Super Bư bị hạ: không gục, tách ra sớm (mỗi người còn ít máu)
    if (this.hopThe?.chu === this.nguoi.indexOf(n)) {
      this.tachHopThe(true);
      return true;
    }
    n.het = true;
    this.am.phat('nvChet');
    n.dich = null;
    n.dangDi = false;
    n.bay = null;
    n.nv.tuKhi(false);
    n.nv.nga();
    if (this.nguoi.every((m) => m.het)) this.ketThuc(false);
    else this.batDauCuu(n);
    return true;
  }

  // Một nhân vật ngã mà người kia còn sống: bắt đầu cứu (Mabu phủ mây lên Zinbu, Zinbu phủ socola lên Mabu)
  private batDauCuu(n: NguoiChoi): void {
    const p = this.nguoi.indexOf(n);
    const b = this.nguoi[1 - p];
    if (b.vang || b.het || this.cuu.some((c) => c.p === p)) return;
    // Người cứu là Mabu thì phủ mây, Zinbu / Vegeta thì phủ socola
    this.cuu.push({ p, kieu: b.ki === 0 ? 'may' : 'socola', x: n.x, y: n.y, cho: CUU_CHO, t: 0, tach: 0 });
  }

  // Đếm giờ cứu: sau CUU_CHO giây thì mây / socola xuất hiện (tách ra từ người cứu), mây / socola bám theo người cứu (nối bằng dây), đếm ngược CUU_THOI_GIAN giây khi người cứu còn sống, hết giờ thì hồi sinh
  private capNhatCuu(dt: number): void {
    const conLai: Cuu[] = [];
    for (const c of this.cuu) {
      const n = this.nguoi[c.p];
      const s = this.nguoi[1 - c.p];
      if (!n.het) continue;
      if (c.cho > 0) {
        c.cho = Math.max(0, c.cho - dt);
        if (c.cho === 0 && !s.het) {
          this.vet.push({ id: this.id++, x: s.x, y: s.y - 40, t: 0, loai: 'no' });
          this.vet.push({ id: this.id++, x: c.x, y: c.y - 40, t: 0, loai: 'no' });
          this.chu.push({ id: this.id++, x: c.x, y: c.y - 230, text: `Bạn sống được ${CUU_THOI_GIAN}s thì đồng đội sẽ sống lại`, mau: '#9be7ff', t: 0 });
        }
        conLai.push(c);
        continue;
      }
      c.tach = Math.min(1, c.tach + dt / CUU_TACH);
      if (!s.het && !s.vang) {
        c.t += dt;
        // Bám theo người còn sống: trôi tới điểm cách CUU_BAM, đứng cùng phía với lúc đầu
        const dx = c.x - s.x;
        const dy = c.y - s.y;
        const d = hyp(dx, dy) || 1;
        if (d > CUU_BAM) {
          const b = Math.min(d - CUU_BAM, Math.max(CUU_TOC_BAM * dt, (d - CUU_BAM) * Math.min(1, dt * 6)));
          c.x -= (dx / d) * b;
          c.y -= (dy / d) * b;
          giuTrongMap(c, leNhanVat(n.nv.heSoTo), false, vungCua(s));
        }
        n.x = c.x;
        n.y = c.y;
      }
      if (c.t < CUU_THOI_GIAN) {
        conLai.push(c);
        continue;
      }
      // Hồi sinh tại chỗ
      n.het = false;
      n.hp = CUU_MAU;
      n.thuongLuc = this.tGame;
      n.x = c.x;
      n.y = c.y;
      n.dich = null;
      n.hoiChieu = 0.5;
      n.nv.hoiSinh();
      this.vet.push({ id: this.id++, x: c.x, y: c.y - 60, t: 0, loai: 'chay', co: 1.2 });
      this.chu.push({ id: this.id++, x: c.x, y: c.y - 230, text: `${n.ten} HỒI SINH! +${CUU_MAU} ❤`, mau: '#7ee787', t: 0 });
    }
    this.cuu = conLai;
  }

  /** Nhân vật p đang được mây / socola phủ lên (đã hiện ra): thân và thanh máu của người ngã được thay bằng mây / socola */
  // ─── Máy bay ───

  /** Nhân vật p đang ngồi trên máy bay (ẩn, gà không thấy, không bị đánh; chỉ bắn được chưởng) */
  trongMb(p: number): boolean {
    return p >= 0 && (this.mayBay.ngoi.includes(p) || this.phiThuyen.ngoi.includes(p));
  }

  /** Nhân vật p đang ngồi trong phi thuyền (cũng tính là trongMb: ẩn, không bị đánh; nhưng không ra đòn được) */
  trongPt(p: number): boolean {
    return p >= 0 && this.phiThuyen.ngoi.includes(p);
  }

  /** Tâm thân máy bay (toạ độ thế giới, chỗ để tính trúng chưởng) */
  private tamMb(): { x: number; y: number } {
    const m = this.mayBay;
    return { x: m.x, y: m.y - MB_CENTRO - MB_NANG * m.z };
  }

  // Đậu: nhân vật đi vào là lên (người lên trước là phi công); đủ người chơi thì cất cánh. Bay: phi công lái bằng điều khiển di chuyển bình thường.
  // Máy bay chỉ nổ khi trúng chưởng (danTrungMb); nổ thì mọi người rơi xuống đúng chỗ đó: trên đất liền (vườn / đảo) thì đứng dậy, rơi xuống biển thì chết.
  private capNhatMb(dt: number): void {
    const m = this.mayBay;
    m.t += dt;
    const co = this.nguoi.filter((n) => !n.vang).length;
    if (m.pha === 'dau') {
      this.nguoi.forEach((n, p) => {
        if (this.trieuHoi || n.vang || this.hopThe || m.ngoi.includes(p) || this.trongPt(p) || n.het || n.nv.laMay || n.bay || n.nv.khoa || this.trongCau(p) || this.dangCuu(p)) return;
        if (hyp(n.x - m.x, (n.y - m.y) / EP_GA) >= MB_BK) return;
        m.ngoi.push(p);
        n.dich = null;
        n.dangDi = false;
        n.combo = 0;
        this.am.phat('anTao');
        this.chu.push({ id: this.id++, x: m.x, y: m.y - 330, text: m.ngoi.length === 1 ? `✈ ${n.ten} LÀ PHI CÔNG!` : `✈ ${n.ten} LÊN MÁY BAY!`, mau: n.mau, t: 0 });
      });
      if (m.ngoi.length >= co && m.ngoi.length > 0) {
        m.pha = 'cat';
        m.t = 0;
        this.am.phat('chuong');
        this.rungMan(0.4, 5);
        this.chu.push({ id: this.id++, x: m.x, y: m.y - 330, text: '✈ CẤT CÁNH!', mau: '#ffd23f', t: 0 });
      }
    }
    if (m.pha === 'cat') {
      const k = Math.min(1, m.t / MB_CAT);
      m.z = k * k * (3 - 2 * k);
      if (m.t >= MB_CAT) { m.pha = 'bay'; m.t = 0; m.z = 1; }
    } else if (m.pha === 'bay') {
      const pl = this.nguoi[m.ngoi[0]];
      m.chay = false;
      const x0 = m.x, y0 = m.y;
      if (pl?.dich) {
        const dx = pl.dich.x - m.x;
        const dy = pl.dich.y - m.y;
        const d = hyp(dx, dy);
        if (d < 10) pl.dich = null;
        else {
          const b = Math.min(MB_TOC * dt, d);
          m.x += (dx / d) * b;
          m.y += (dy / d) * b;
          m.chay = true;
          if (Math.abs(dx) > d * 0.2) m.lat = dx < 0;
        }
      }
      // Máy bay bay được khắp thế giới (qua biển, qua tường vườn), chỉ không ra khỏi bản đồ
      m.x = kep(m.x, TG.x0 + MB_LE, TG.x1 - MB_LE);
      m.y = kep(m.y, TG.y0 + MB_LE, TG.y1 - MB_LE);
      // Thần điện (khu vực của Frieza) chỉ bay vào được khi đủ 2 người (chưa gục) cùng ngồi trên máy bay
      if (m.ngoi.filter((p) => !this.nguoi[p]?.het).length < 2 && trongThan(m.x, m.y, MB_THAN_LE) && !trongThan(x0, y0, MB_THAN_LE)) {
        m.x = x0;
        m.y = y0;
        if (pl) pl.dich = null;
        if (this.t - this.thanBaoLuc > 3) {
          this.thanBaoLuc = this.t;
          this.chu.push({ id: this.id++, x: m.x, y: m.y - 420, text: '✈ THẦN ĐIỆN CHỈ VÀO ĐƯỢC KHI ĐỦ 2 NGƯỜI!', mau: '#c9a2ff', t: 0 });
        }
      }
      // Mê cung bom (lưới mê cung + đường hầm ngoài đảo 1) không bay vào được: bị chặn lại ở mép (đang ở trong sẵn thì bay ra được)
      if (this.mcCamMb(m.x, m.y) && !this.mcCamMb(x0, y0)) {
        m.x = x0;
        m.y = y0;
        if (pl) pl.dich = null;
        if (this.t - this.thanBaoLuc > 3) {
          this.thanBaoLuc = this.t;
          this.chu.push({ id: this.id++, x: m.x, y: m.y - 420, text: '✈ MÁY BAY KHÔNG BAY VÀO ĐƯỢC MÊ CUNG BOM!', mau: '#ff9f43', t: 0 });
        }
      }
      if (dt > 0) { this.mbVx = (m.x - x0) / dt; this.mbVy = (m.y - y0) / dt; }
    } else if (m.pha === 'trung') {
      if (m.t >= MB_LUNG) this.noMb();
    } else if (m.pha === 'no' && m.t >= MB_HOI) {
      m.pha = 'dau';
      m.t = 0;
      m.z = 0;
      m.x = m.goc.x;
      m.y = m.goc.y;
      m.ngoi = [];
      m.chay = false;
      this.vet.push({ id: this.id++, x: m.x, y: m.y - MB_CENTRO, t: 0, loai: 'no' });
      this.chu.push({ id: this.id++, x: m.x, y: m.y - 330, text: '✈ MÁY BAY ĐÃ HỒI PHỤC!', mau: '#ffd23f', t: 0 });
    }
    // Người ngồi trên máy bay đi theo máy bay (chưởng bắn ra từ thân máy bay)
    for (const p of m.ngoi) {
      const n = this.nguoi[p];
      n.x = m.x;
      n.y = m.y - MB_NANG * m.z;
      n.dangDi = false;
      n.nv.lat = m.lat;
      if (p !== m.ngoi[0] || m.pha !== 'bay') n.dich = null;
    }
  }

  /** Vùng máy bay không được bay vào: mê cung bom (cộng lề) và đoạn đường hầm đã ra khỏi đảo 1 */
  private mcCamMb(x: number, y: number): boolean {
    if (banDoHt !== 'sa') return false;
    if (trongMeCung(x, y, MB_MC_LE)) return true;
    const d = DAO[1]!;
    return trongHam(x, y, MB_MC_LE) && hyp(x - d.x, y - d.y) > d.r;
  }

  // Chưởng (Chiêu đặc biệt / socola, không tính chưởng tự bắn lên trời) bay qua thân máy bay thì máy bay trúng (người ngồi trên máy bay bắn chưởng thì máy bay nổ ngay, xem ban())
  /**
   * Chưởng (Chiêu đặc biệt / socola) của nhân vật quét qua bánh sinh nhật. Còn Cell sống thì bánh không hề hấn (chữ "CÒN n CELL!").
   * Hạ hết sạch Cell rồi: mỗi phát làm nổ một bánh (ngọc 2 sao không còn từ bánh mà nằm dưới Cell giữ ngọc ở đảo 0).
   */
  private danTrungBanh(d: Dan, t0: number): void {
    const k0 = Math.min(1, t0 / d.T), k1 = Math.min(1, d.t / d.T);
    const dx = d.x1 - d.x0, dy = d.y1 - d.y0;
    const buoc = Math.max(1, Math.ceil((hyp(dx, dy) * (k1 - k0)) / 40));
    for (const tc of this.tiec) {
      if (tc.vo || tc.ngoc || d.da?.includes(-1000 - tc.dao)) continue;
      const rx = 90 * tc.to + 50, tren = 480 * tc.to + 40;
      let trung = false;
      for (let i = 0; i <= buoc && !trung; i++) {
        const k = k0 + ((k1 - k0) * i) / buoc;
        const px = d.x0 + dx * k, py = d.y0 + dy * k;
        trung = Math.abs(px - tc.x) < rx && py > tc.y - tren && py < tc.y + 60;
      }
      if (!trung) continue;
      (d.da ??= []).push(-1000 - tc.dao);
      const yTam = tc.y - 200 * tc.to;
      const conCell = this.cell.filter((c) => !c.chet).length;
      if (conCell > 0) {
        this.chu.push({ id: this.id++, x: tc.x, y: yTam - 120, text: `🎂 CÒN ${conCell} CELL! HẠ HẾT CELL ĐÃ`, mau: '#ffd166', t: 0 });
        continue;
      }
      const conBanh = this.tiec.filter((t) => !t.vo && !t.ngoc).length;
      this.vet.push({ id: this.id++, x: tc.x, y: yTam, t: 0, loai: 'chay', co: 1.4 });
      this.rungMan(0.2, 10);
      // Ngọc 2 sao giờ do Cell giữ ngọc ngồi lên (đảo 0): bánh nào (kể cả bánh cuối) cũng chỉ nổ
      tc.vo = true;
      this.chu.push({ id: this.id++, x: tc.x, y: yTam - 120, text: conBanh > 1 ? `🎂 BÙM! CÒN ${conBanh - 1} BÁNH` : '🎂 BÙM!', mau: '#ffd166', t: 0 });
    }
  }

  private danTrungMb(d: Dan, t0: number): void {
    const m = this.mayBay;
    if (m.pha === 'trung' || m.pha === 'no') return;
    const c = this.tamMb();
    const k0 = Math.min(1, t0 / d.T), k1 = Math.min(1, d.t / d.T);
    const dx = d.x1 - d.x0, dy = d.y1 - d.y0;
    const buoc = Math.max(1, Math.ceil((hyp(dx, dy) * (k1 - k0)) / 40));
    for (let i = 0; i <= buoc; i++) {
      const k = k0 + ((k1 - k0) * i) / buoc;
      const px = d.x0 + dx * k, py = d.y0 + dy * k;
      if (Math.abs(px - c.x) < MB_TRUNG_BK && Math.abs(py - c.y) < MB_TRUNG_BK * 0.75) {
        this.trungMb();
        return;
      }
    }
  }

  private trungMb(): void {
    const m = this.mayBay;
    if (m.pha === 'trung' || m.pha === 'no') return;
    m.pha = 'trung';
    m.t = 0;
    m.chay = false;
    const c = this.tamMb();
    this.chu.push({ id: this.id++, x: c.x, y: c.y - 200, text: '💥 TRÚNG CHƯỞNG!', mau: '#ff9f43', t: 0 });
    this.rungMan(0.3, 8);
  }

  // Máy bay nổ: ba vụ nổ, mọi người rơi xuống đúng chỗ đó (đất liền: đứng dậy, biển: chết); trên đất liền thì máy bay hồi phục ở đó sau MB_HOI giây
  private noMb(): void {
    const m = this.mayBay;
    const c = this.tamMb();
    const dat = trongVuon(m.x, m.y) || doSau(m.x, m.y) > 0;
    for (let i = 0; i < 3; i++) this.vet.push({ id: this.id++, x: c.x + ngauNhien(-60, 60), y: c.y + ngauNhien(-40, 40), t: 0, loai: 'chay', co: 1.4 + i * 0.3 });
    this.am.noMayBay();
    this.rungMan(0.5, 14);
    this.dungKhung(0.12);
    m.pha = 'no';
    m.t = 0;
    m.chay = false;
    const roi = m.ngoi;
    m.ngoi = [];
    roi.forEach((p, i) => {
      const n = this.nguoi[p];
      n.x = m.x + (i === 0 ? -70 : 70);
      n.y = m.y + 25;
      n.dich = null;
      n.dangDi = false;
      n.combo = 0;
      if (dat) {
        giuTrongMap(n, leNhanVat(n.nv.heSoTo));
        n.nv.tiepDat();
        this.chu.push({ id: this.id++, x: n.x, y: n.y - 220, text: '🪂 RƠI XUỐNG!', mau: '#9be7ff', t: 0 });
      } else {
        this.chu.push({ id: this.id++, x: n.x, y: n.y - 220, text: '🌊 RƠI XUỐNG BIỂN!', mau: '#5ab8ff', t: 0 });
        this.chetNv(n);
      }
    });
    if (dat) {
      const g = { x: m.x, y: m.y };
      if (trongVuon(g.x, g.y)) {
        g.x = kep(g.x, TUONG + MB_LE, MAP - TUONG - MB_LE);
        g.y = kep(g.y, TUONG + MB_LE, MAP - TUONG - MB_LE);
      } else veDat(g);
      m.goc = g;
    } else if (this.nguoi.every((q) => q.het)) this.ketThuc(false);
  }

  // Nhân vật chết ngay (rơi xuống biển): giống lúc hết máu trong nhanSatThuong()
  private chetNv(n: NguoiChoi): void {
    n.hp = 0;
    n.het = true;
    this.am.phat('nvChet');
    n.dich = null;
    n.dangDi = false;
    n.bay = null;
    n.nv.tuKhi(false);
    n.nv.nga();
  }

  /** Hình máy bay để vẽ (null = không hiện: đã nổ xong, chờ hồi phục) */
  private mbHinh(): MbHinh | null {
    const m = this.mayBay;
    const co = this.nguoi.filter((n) => !n.vang).length;
    const nang = MB_CENTRO + MB_NANG * m.z;
    const h: MbHinh = { x: m.x, y: m.y, nang, khung: 0, a: 1, to: MB_TO, lat: m.lat, rung: 0, bong: m.z > 0 ? 1 : 0.6, nhan: null };
    if (m.pha === 'dau') {
      h.nang += Math.sin(this.t * 2.2) * 3;
      h.nhan = `✈ ${m.ngoi.length}/${co}`;
    } else if (m.pha === 'cat') h.khung = m.t < MB_CAT * 0.7 ? 3 : 1;
    else if (m.pha === 'bay') h.khung = m.chay ? 2 : 1;
    else if (m.pha === 'trung') {
      h.khung = 4;
      h.rung = Math.sin(this.t * 60) * 8;
    } else {
      if (m.t >= MB_NO_HINH) return null;
      const k = m.t / MB_NO_HINH;
      h.khung = 5;
      h.to = MB_TO * (0.5 + 0.9 * Math.min(1, k * 2.5));
      h.a = dongHe01((1 - k) * 2.5);
      h.bong = 0;
    }
    return h;
  }

  /** Số giây còn lại tới lúc máy bay hồi phục, và chỗ nó sẽ xuất hiện lại */
  private mbDem(): { x: number; y: number; con: number } | null {
    const m = this.mayBay;
    return m.pha === 'no' ? { x: m.goc.x, y: m.goc.y, con: Math.max(1, Math.ceil(MB_HOI - m.t)) } : null;
  }

  /** Chỗ máy bay / phi thuyền đang ở dưới đất (đậu, cất / hạ cánh, máy bay chờ hồi phục) */
  private xeDuoiDat(): { x: number; y: number }[] {
    const mb = this.mayBay, pt = this.phiThuyen;
    const kq: { x: number; y: number }[] = [];
    if (mb.pha === 'no') kq.push(mb.goc);
    else if (mb.z < 0.5) kq.push(mb);
    if (pt.z < 0.5) kq.push(pt);
    return kq;
  }

  /** Cây / vật trang trí đứng chắn trước máy bay / phi thuyền dưới đất: không vẽ, không đánh đổ (chỗ xe đậu coi như trống) */
  private cayCheXe(t: TrangTri, xe: { x: number; y: number }[]): boolean {
    const r = XE_CHE_X * (t.to ? CAY_TO_HE_SO : 1);
    return xe.some((v) => Math.abs(t.x - v.x) < r && t.y > v.y - XE_CHE_SAU && t.y < v.y + XE_CHE_TRUOC * (t.to ? CAY_TO_HE_SO : 1));
  }

  // ─── Phi thuyền ───

  // Đậu: có người lại gần thì mở cửa, đi vào là lên; đủ 2 nhân vật thì tự cất cánh bay thẳng tới bến kia (vườn gà ↔ núi đá), hạ cánh, mở cửa cho mọi người bước ra.
  // Còn dưới đất (đậu / cất cánh) mà trúng chưởng của Mabu / Zinbu thì nổ (danTrungPt), hồi phục sau MB_HOI giây ở bến đó; Cell không bắn.
  // Người bên trong không ra đòn và không lái được.
  private capNhatPt(dt: number): void {
    const m = this.phiThuyen;
    m.t += dt;
    if (m.pha === 'no') {
      m.mo = 0;
      if (m.t >= MB_HOI) {
        m.pha = 'dau';
        m.t = 0;
        this.chu.push({ id: this.id++, x: m.x, y: m.y - 560, text: '🛸 PHI THUYỀN ĐÃ HỒI PHỤC!', mau: '#9be7ff', t: 0 });
      }
      return;
    }
    const dung = this.nguoi.filter((n) => !n.vang);
    const hai = dung.length >= 2;
    const lenDuoc = (n: NguoiChoi, p: number) => !this.trieuHoi && !n.vang && !this.hopThe && !n.het && !n.nv.laMay && !n.bay && !n.nv.khoa && !this.trongMb(p) && !this.trongCau(p) && !this.dangCuu(p);
    const cach = (n: NguoiChoi) => hyp(n.x - m.x, (n.y - m.y) / EP_GA);
    m.cho = m.cho.filter((p) => !this.nguoi[p] || cach(this.nguoi[p]) < PT_BK * 1.5);
    if (m.pha === 'dau') {
      if (hai) {
        this.nguoi.forEach((n, p) => {
          if (!lenDuoc(n, p) || m.cho.includes(p) || cach(n) >= PT_BK) return;
          m.ngoi.push(p);
          n.dich = null;
          n.dangDi = false;
          n.combo = 0;
          this.am.phat('anTao');
          this.chu.push({ id: this.id++, x: m.x, y: m.y - 560, text: `🛸 ${n.ten} VÀO PHI THUYỀN!`, mau: n.mau, t: 0 });
        });
      }
      // Người còn ở ngoài bị gục: mọi người trong phi thuyền ra để cứu
      if (m.ngoi.length && dung.some((n) => n.het)) this.ptXuong();
      const gan = this.nguoi.some((n, p) => lenDuoc(n, p) && cach(n) < PT_MO_BK);
      const mo = m.ngoi.length > 0 || (hai && gan);
      m.mo = kep(m.mo + (mo ? dt : -dt) / 0.5, 0, 1);
      if (hai && m.ngoi.length >= dung.length) {
        m.pha = 'cat';
        m.t = 0;
        this.am.phat('chuong');
        this.chu.push({ id: this.id++, x: m.x, y: m.y - 560, text: m.noi === 'vuon' ? '🛸 PHI THUYỀN BAY TỚI NÚI ĐÁ!' : '🛸 PHI THUYỀN BAY VỀ VƯỜN GÀ!', mau: '#9be7ff', t: 0 });
      }
    } else if (m.pha === 'cat') {
      m.mo = kep(m.mo - dt / 0.4, 0, 1);
      const k = kep((m.t - 1.1) / (PT_CAT - 1.1), 0, 1);
      m.z = k * k * (3 - 2 * k);
      if (m.t >= 0.5 && m.t - dt < 0.5) this.rungMan(0.4, 5);
      if (m.t >= PT_CAT) { m.pha = 'bay'; m.t = 0; m.z = 1; }
    } else if (m.pha === 'bay') {
      const den = m[m.noi === 'vuon' ? 'nui' : 'vuon'];
      const dx = den.x - m.x, dy = den.y - m.y;
      const d = hyp(dx, dy);
      const b = PT_TOC * dt;
      if (Math.abs(dx) > d * 0.2) m.lat = dx < 0;
      if (d <= b) {
        m.x = den.x;
        m.y = den.y;
        m.noi = m.noi === 'vuon' ? 'nui' : 'vuon';
        m.pha = 'ha';
        m.t = 0;
      } else {
        m.x += (dx / d) * b;
        m.y += (dy / d) * b;
      }
    } else if (m.pha === 'ha') {
      const k = kep(m.t / 0.7, 0, 1);
      m.z = 1 - k * k * (3 - 2 * k);
      if (m.t >= 0.7 && m.t - dt < 0.7) {
        m.lat = false;
        this.rungMan(0.4, 10);
        for (let i = 0; i < 4; i++) this.vet.push({ id: this.id++, x: m.x + ngauNhien(-160, 160), y: m.y + ngauNhien(-30, 30), t: 0, loai: 'bui' });
      }
      if (m.t >= PT_HA) { m.pha = 'ra'; m.t = 0; m.z = 0; }
    } else if (m.pha === 'ra') {
      m.mo = kep(m.t / (PT_RA * 0.8), 0, 1);
      if (m.t >= PT_RA) {
        this.ptXuong();
        this.chu.push({ id: this.id++, x: m.x, y: m.y - 560, text: m.noi === 'nui' ? '🛸 ĐÃ TỚI NÚI ĐÁ!' : '🛸 ĐÃ VỀ VƯỜN GÀ!', mau: '#9be7ff', t: 0 });
      }
    }
    for (const p of m.ngoi) {
      const n = this.nguoi[p];
      n.x = m.x;
      n.y = m.y - PT_NANG * m.z;
      n.dangDi = false;
      n.dich = null;
      n.nv.lat = m.lat;
    }
  }

  /** Cổng dịch chuyển: giữa đảo 4 (`cong`) ↔ thần điện (`THAN_CONG`). Nhân vật (chưa gục, không bay, không trong máy bay / cầu)
   *  bước vào CONG_BK thì mọi người chơi đang đi bộ cùng được đưa sang cổng bên kia (giữ dây buộc), ra đứng phía trước cổng.
   *  Đồng đội đang gục / trốn trong cầu / đang bay thì cổng không mở. Người vừa ra phải đi khỏi CONG_RA mới vào lại được. */
  private capNhatCong(dt: number): void {
    if (banDoHt !== 'sa' || this.trieuHoi) return;
    this.congBao = Math.max(0, this.congBao - dt);
    const cap = [
      { a: this.cong, b: THAN_CONG, chu: '🌀 DỊCH CHUYỂN TỚI THẦN ĐIỆN!' },
      { a: THAN_CONG, b: this.cong, chu: '🌀 DỊCH CHUYỂN VỀ ĐẢO CELL!' },
    ];
    const cach = (n: { x: number; y: number }, c: { x: number; y: number }) => hyp(n.x - c.x, n.y - c.y);
    // Lần đầu (vào / tải ván): ai đang đứng sẵn trong cổng thì coi như vừa ra
    if (!this.congCho) this.congCho = this.nguoi.map((n, p) => (cap.some((c) => cach(n, c.a) < CONG_RA) ? p : -1)).filter((p) => p >= 0);
    this.congCho = this.congCho.filter((p) => cap.some((c) => cach(this.nguoi[p]!, c.a) < CONG_RA));
    const dung = this.nguoi.map((n, p) => ({ n, p })).filter(({ n, p }) => !n.vang && !this.trongMb(p));
    for (const c of cap) {
      const vao = dung.find(({ n, p }) => !n.het && !n.bay && !this.trongCau(p) && !this.congCho!.includes(p) && cach(n, c.a) < CONG_BK);
      if (!vao) continue;
      // Vào thần điện (khu vực của Frieza): phải đủ 2 người chơi và cả hai cùng đứng trong cổng
      if (c.a === this.cong) {
        const hai = this.nguoi.filter((n) => !n.vang).length >= 2;
        if (!hai || dung.some(({ n }) => cach(n, c.a) >= CONG_BK)) {
          if (this.congBao <= 0) {
            this.congBao = 2;
            this.chu.push({ id: this.id++, x: c.a.x, y: c.a.y - 700, text: hai ? '🌀 CẢ 2 NGƯỜI CÙNG VÀO CỔNG MỚI SANG THẦN ĐIỆN!' : '🌀 THẦN ĐIỆN CHỈ VÀO ĐƯỢC KHI CHƠI 2 NGƯỜI!', mau: '#c9a2ff', t: 0 });
          }
          return;
        }
      }
      if (dung.some(({ n, p }) => n.het || n.bay || this.trongCau(p))) {
        if (this.congBao <= 0) {
          this.congBao = 2;
          this.chu.push({ id: this.id++, x: c.a.x, y: c.a.y - 700, text: '🌀 CỔNG CHƯA MỞ: CHỜ ĐỒNG ĐỘI!', mau: '#c9a2ff', t: 0 });
        }
        return;
      }
      this.vet.push({ id: this.id++, x: c.a.x, y: c.a.y - 200, t: 0, loai: 'chay', co: 1.6 });
      dung.forEach(({ n }, i) => {
        n.x = c.b.x + (dung.length > 1 ? (i === 0 ? -170 : 170) : 0);
        n.y = c.b.y + CONG_RA_Y;
        n.dich = null;
        n.dangDi = false;
        giuTrongMap(n, leNhanVat(n.nv.heSoTo), false, 'dao');
      });
      this.congCho = dung.map(({ p }) => p);
      this.vet.push({ id: this.id++, x: c.b.x, y: c.b.y - 200, t: 0, loai: 'chay', co: 1.6 });
      this.chu.push({ id: this.id++, x: c.b.x, y: c.b.y - 700, text: c.chu, mau: '#c9a2ff', t: 0 });
      this.am.phat('chuong');
      this.rungMan(0.3, 8);
      this.camNgay = true;
      return;
    }
  }

  // Mọi người trong phi thuyền bước ra cửa rồi đi thêm một đoạn (ở núi đá: vào phía bóng ma Goku)
  private ptXuong(): void {
    const m = this.phiThuyen;
    const ra = m.ngoi;
    m.ngoi = [];
    m.pha = 'dau';
    m.t = 0;
    m.z = 0;
    m.mo = 1;
    m.cho = [...ra];
    const nui = m.noi === 'nui';
    const hx = nui ? NUI.x - m.x : 0, hy = nui ? NUI.y - m.y : 1;
    const hd = hyp(hx, hy) || 1;
    ra.forEach((p, i) => {
      const n = this.nguoi[p];
      n.x = m.x + 70 * PT_TO + (i === 0 ? -40 : 40);
      n.y = m.y + 40 + i * 50;
      giuTrongMap(n, leNhanVat(n.nv.heSoTo));
      n.dich = { x: n.x + (hx / hd) * 420 + (i === 0 ? -80 : 80), y: n.y + (hy / hd) * 420 };
      n.dangDi = true;
      n.combo = 0;
    });
  }

  /** Chưởng (Chiêu đặc biệt / socola) của Mabu / Zinbu quét qua thân phi thuyền lúc còn dưới đất (đậu / cất cánh) thì phi thuyền nổ */
  private danTrungPt(d: Dan, t0: number): void {
    const m = this.phiThuyen;
    if (m.pha !== 'dau' && m.pha !== 'cat') return;
    const cx = m.x, cy = m.y - PT_TAM - PT_NANG * m.z;
    const k0 = Math.min(1, t0 / d.T), k1 = Math.min(1, d.t / d.T);
    const dx = d.x1 - d.x0, dy = d.y1 - d.y0;
    const buoc = Math.max(1, Math.ceil((hyp(dx, dy) * (k1 - k0)) / 40));
    for (let i = 0; i <= buoc; i++) {
      const k = k0 + ((k1 - k0) * i) / buoc;
      if (Math.abs(d.x0 + dx * k - cx) < PT_TRUNG_X && Math.abs(d.y0 + dy * k - cy) < PT_TRUNG_Y) {
        this.noPt();
        return;
      }
    }
  }

  // Phi thuyền nổ (dưới đất): ba vụ nổ, mọi người bên trong văng ra đứng dậy tại chỗ; hồi phục ở đúng bến đó sau MB_HOI giây
  private noPt(): void {
    const m = this.phiThuyen;
    const cy = m.y - PT_TAM - PT_NANG * m.z;
    for (let i = 0; i < 3; i++) this.vet.push({ id: this.id++, x: m.x + ngauNhien(-120, 120), y: cy + ngauNhien(-60, 60), t: 0, loai: 'chay', co: 1.8 + i * 0.3 });
    this.am.noMayBay();
    this.rungMan(0.5, 14);
    this.dungKhung(0.12);
    this.chu.push({ id: this.id++, x: m.x, y: cy - 260, text: '💥 PHI THUYỀN NỔ TUNG!', mau: '#ff9f43', t: 0 });
    const ra = m.ngoi;
    if (ra.length) this.ptXuong();
    for (const p of ra) this.nguoi[p].nv.tiepDat();
    m.pha = 'no';
    m.t = 0;
    m.z = 0;
    m.mo = 0;
    m.lat = false;
  }

  /** Hình phi thuyền để vẽ (cùng kiểu với máy bay; khung theo atlas SP_PT); null = đã nổ, chờ hồi phục */
  private ptHinh(): MbHinh | null {
    const m = this.phiThuyen;
    if (m.pha === 'no') {
      if (m.t >= MB_NO_HINH) return null;
      const k = m.t / MB_NO_HINH;
      return { x: m.x, y: m.y, nang: 0, khung: 0, a: dongHe01((1 - k) * 2.5), to: PT_TO, lat: m.lat, rung: Math.sin(this.t * 60) * 10, bong: 0, nhan: null };
    }
    const h: MbHinh = { x: m.x, y: m.y, nang: PT_NANG * m.z, khung: 0, a: 1, to: PT_TO, lat: m.lat, rung: 0, bong: 0, nhan: null, nhanCao: 470 };
    const cua = m.mo <= 0 ? 0 : m.mo < 0.4 ? 1 : m.mo < 0.75 ? 2 : 3;
    if (m.pha === 'dau') {
      h.khung = cua;
      const co = this.nguoi.filter((n) => !n.vang).length;
      h.nhan = co < 2 ? '🛸 CẦN 2 NGƯỜI' : `🛸 ${m.ngoi.length}/2`;
    } else if (m.pha === 'cat') {
      h.khung = m.t < 0.5 ? cua : m.t < 1.1 ? 4 : m.t < 1.5 ? 5 : 6;
      h.rung = m.t >= 0.5 && m.t < 1.5 ? Math.sin(this.t * 50) * 3 : 0;
      h.bong = m.z;
    } else if (m.pha === 'bay') {
      h.khung = 7;
      h.nang += Math.sin(this.t * 6) * 8;
      h.bong = 1;
    } else if (m.pha === 'ha') {
      h.khung = m.t < 0.7 ? 8 : m.t < 1 ? 9 : m.t < 1.3 ? 10 : 11;
      h.bong = m.t < 0.7 ? m.z : 0;
    } else h.khung = cua;
    return h;
  }

  // ─── Quả cầu trốn ───

  /** Nhân vật p đang ở trong quả cầu (trốn hoặc đang vỡ ra): ẩn, không điều khiển, gà không thấy, không bị đánh */
  trongCau(p: number): boolean {
    return p >= 0 && this.cauTron.some((q) => q.p === p && (q.pha === 'trong' || q.pha === 'vo'));
  }

  /** Gà không thấy / không đánh được nhân vật này: đã gục, đang là mây hoặc đang trốn trong quả cầu */
  private khuat(n: NguoiChoi): boolean {
    const p = this.nguoi.indexOf(n);
    return n.het || n.nv.laMay || this.trongCau(p) || this.trongMb(p) || this.biNhap(p);
  }

  // Chạm quả cầu thì chui vào; trong cầu hồi máu tới đầy bình, đầy mana; hết CAU_TRON giây thì vỡ ra (hoạt ảnh) và thả nhân vật ra đúng chỗ đó
  private capNhatCau(dt: number): void {
    for (const q of this.cauTron) {
      q.t += dt;
      if (q.pha === 'san') {
        const p = this.nguoi.findIndex((n, i) => i === q.cua && !this.hopThe && !n.vang && !n.het && !n.nv.laMay && !n.bay && !n.nv.khoa && !this.trongCau(i) && !this.trongMb(i)
          && hyp(n.x - q.x, (n.y - q.y) / EP_GA) < CAU_BAN_KINH);
        if (p < 0) continue;
        const n = this.nguoi[p];
        q.pha = 'trong';
        q.p = p;
        q.t = 0;
        n.dich = null;
        n.dangDi = false;
        n.combo = 0;
        this.am.phat('anTao');
        this.chu.push({ id: this.id++, x: q.x, y: q.y - 380, text: '🛡 TRỐN VÀO QUẢ CẦU!', mau: '#ff9fd0', t: 0 });
      }
      if (q.pha === 'trong' || q.pha === 'vo') {
        const n = this.nguoi[q.p];
        n.x = q.x;
        n.y = q.y + 4;
        n.dich = null;
        n.dangDi = false;
        if (n.hp < HP_NV) n.hp = Math.min(HP_NV, n.hp + CAU_HOI_MAU * dt);
        if (n.mana < MANA_TOI_DA) n.mana = MANA_TOI_DA;
        n.bayKhoa = 0;
        if (q.pha === 'trong' && q.t >= CAU_TRON) {
          q.pha = 'vo';
          q.t = 0;
          this.am.phat('chuong');
          this.rungMan(0.25, 8);
        } else if (q.pha === 'vo' && q.t >= CAU_VO) {
          // Thoát ra: nhân vật đứng đúng chỗ quả cầu, quả cầu tan thành khói hồng
          q.pha = 'moc';
          q.t = 0;
          q.p = -1;
          n.nv.tiepDat();
          this.vet.push({ id: this.id++, x: q.x, y: q.y - 60, t: 0, loai: 'no' });
          this.chu.push({ id: this.id++, x: q.x, y: q.y - 380, text: `${n.ten} THOÁT RA!`, mau: '#ff9fd0', t: 0 });
        }
      } else if (q.pha === 'moc' && q.t >= CAU_MOC) {
        q.pha = 'san';
        q.t = 0;
      }
    }
  }

  /** Hình quả cầu để vẽ: khung atlas (hàng 0 Mabu · hàng 1 Zinbu), độ mờ, độ lắc (độ) và số giây còn trốn (null = không hiện) */
  /** Hàng atlas quả cầu theo nhân vật chủ quả cầu: 0 Mabu · 1 Zinbu (Vegeta dùng vỏ hàng 0) */
  cauHang(q: CauTron): number {
    const ki = this.nguoi[q.cua]?.ki ?? q.cua;
    return ki === 1 ? 1 : 0;
  }

  cauHinh(q: CauTron): { khung: number; a: number; lac: number; rungX: number; con: number | null } {
    const hang = this.cauHang(q) * 6;
    // Vegeta không có hàng riêng trong atlas quả cầu: dùng vỏ quả cầu hàng 0, lúc vỡ dừng ở khung khói (khung 2) thay vì hiện Mabu bước ra
    const vg = this.nguoi[q.cua]?.ki === 2;
    if (q.pha === 'vo' && vg) return { khung: hang + 2, a: 1, lac: 0, rungX: 0, con: null };
    if (q.pha === 'moc') return { khung: hang, a: dongHe01(q.t - (CAU_MOC - 1)), lac: 0, rungX: 0, con: null };
    if (q.pha === 'vo') return { khung: hang + 2 + Math.min(3, Math.floor((q.t / CAU_VO) * 4)), a: 1, lac: 0, rungX: 0, con: null };
    if (q.pha === 'trong') {
      const con = CAU_TRON - q.t;
      // 3 giây cuối: nứt ra và rung mạnh dần
      if (con < 3) return { khung: hang + 1, a: 1, lac: 0, rungX: Math.sin(this.t * 55) * (2 + (3 - con) * 2), con: Math.ceil(con) };
      return { khung: hang, a: 1, lac: Math.sin(this.t * 5) * 3, rungX: 0, con: Math.ceil(con) };
    }
    return { khung: hang, a: 1, lac: 0, rungX: 0, con: null };
  }

  dangCuu(p: number): boolean {
    return this.cuu.some((c) => c.p === p && c.cho <= 0);
  }

  readonly COMBO_GIAM_HOI = COMBO_GIAM_HOI;
  readonly CUU_THOI_GIAN = CUU_THOI_GIAN;

  private congDiem(p: number, diem: number, x: number, y: number, text: string): void {
    this.nguoi[p].diem += diem;
    this.chu.push({ id: this.id++, x, y, text, mau: this.nguoi[p].mau, t: 0 });
  }

  // nguoiThang: true = đã nhặt đủ 5 viên ngọc rồng; false = cả hai nhân vật cùng gục, quái vật thắng
  private ketThuc(nguoiThang: boolean): void {
    this.nguoiThangTran = nguoiThang;
    this.man = 'over';
    this.nguoi.forEach((n) => {
      n.dich = null;
      n.dangDi = false;
      n.nv.tuKhi(false);
    });
    this.onKetThuc({ diem: this.tongDiem, diemMabu: this.nguoi[0].diem, diemZinbu: this.nguoi[1].diem, thoiGian: Math.round(this.tGame) });
    if (this.tongDiem > this.kyLuc) {
      this.kyLuc = this.tongDiem;
      this.kyLucMoi = true;
      try {
        localStorage.setItem(KHOA_KY_LUC, String(this.kyLuc));
      } catch { /* trình duyệt chặn localStorage */ }
    }
  }

  // Phép chiếu từ khung nhìn (toạ độ -SIDE.., -BAR..) ra điểm ảnh CSS của canvas; dùng cho vẽ
  phepChieu(): { s: number; ox: number; oy: number } {
    const s = Math.min(this.cssW / (this.W + 2 * SIDE), this.cssH / (H + BAR));
    return { s, ox: (this.cssW - s * (this.W + 2 * SIDE)) / 2 + SIDE * s, oy: (this.cssH - s * (H + BAR)) / 2 + BAR * s };
  }

  private phimXuong(e: KeyboardEvent): void {
    if (this.man === 'over' && (e.key === 'y' || e.key === 'Y') && !e.repeat && !e.ctrlKey && !e.altKey && !e.metaKey) {
      const t = e.target as HTMLElement | null;
      if (!t || (t.tagName !== 'INPUT' && t.tagName !== 'TEXTAREA')) { this.onDong(); return; }
    }
  }

  // ─── Điều khiển bằng tay cầm (Gamepad API, bố cục kiểu Xbox; mapping "standard") ───
  // Dành cho trẻ em, chỉ các nút đơn giản: Chữ thập: chạy · Cần trái: bay · A đấm · X đá · Y chưởng · B / Cần phải: chiêu riêng
  // Menu: bắt đầu / tạm dừng · View: khi chỉ có 1 tay cầm thì đổi sang điều khiển nhân vật kia

  // ─── Hợp thể Super Bư ───

  /** p đang bị nhập vào Super Bư (ẩn, không bị đánh, không tự ra đòn) */
  biNhap(p: number): boolean {
    return !!this.hopThe && this.hopThe.nhap === p;
  }

  /** Sát thương gốc mỗi đòn của p theo nhóm đòn; Super Bư = HOP_THE_SAT_GAP × (Mabu + Zinbu) */
  private satNv(p: number, nhom: number): number {
    if (this.hopThe?.chu === p) {
      const goc = nhom === NHOM_MAY ? SAT_MAY + SAT_SOCOLA : SAT_THUONG[nhom]![0]! + SAT_THUONG[nhom]![1]!;
      return HOP_THE_SAT_GAP * goc;
    }
    return SAT_THUONG[nhom]![this.nguoi[p].ki]!;
  }

  /** Đội Mabu + Zinbu, cả hai đang đứng bình thường (không gục / mây / bay / máy bay / cầu / đang bị khoá) và cách nhau trong HOP_THE_GAN */
  private hopTheDuoc(): boolean {
    const [a, b] = this.nguoi;
    if (!a || !b || this.hopThe || a.ki + b.ki !== 1 || a.ki === b.ki) return false;
    const tot = (n: NguoiChoi, p: number) => !n.vang && !n.het && !n.bay && !n.nv.laMay && !n.may.dang && !n.nv.khoa && !this.trongMb(p) && !this.trongCau(p);
    // Chỉ hợp thể được trên thần điện (tháp của Frieza): cả hai phải đứng trên thần điện
    return tot(a, 0) && tot(b, 1) && this.hopTheCho(a, b) && hyp(a.x - b.x, a.y - b.y) <= HOP_THE_GAN;
  }

  /** Chỗ được hợp thể: cả hai trên thần điện, hoặc ở bất kỳ đâu từ phút 8 / khi Frieza đã bay đi truy sát (hopTheMo()) */
  private hopTheCho(a: NguoiChoi, b: NguoiChoi): boolean {
    return this.hopTheMo() || (trongThan(a.x, a.y) && trongThan(b.x, b.y));
  }

  /** Chữ gợi ý (chỉ trên đầu người còn đứng đầu tiên): đang chờ hồi hợp thể, hoặc đã sẵn sàng (đứng gần nhau) */
  hopTheGoiY(p: number): string | null {
    if (this.hopThe) return null;
    const [a, b] = this.nguoi;
    if (!a || !b || a.ki + b.ki !== 1 || a.ki === b.ki || a.vang || b.vang) return null;
    if (p !== this.nguoi.findIndex((n) => !n.het)) return null;
    if (!this.hopTheCho(a, b)) return null;
    if (this.hopTheHoi > 0) return `🔄 Hợp thể sau ${Math.ceil(this.hopTheHoi)}s`;
    return this.hopTheDuoc() ? '✨ Cùng bấm 1 nút: HỢP THỂ!' : null;
  }

  /** Hai người vừa cùng bấm một nút đánh (cách nhau ≤ HOP_THE_CUA giây) khi đứng gần nhau: hợp thể */
  private thuHopThe(): void {
    const [a, b] = this.hopNut;
    if (!a || !b || a.nut !== b.nut || Math.abs(a.t - b.t) > HOP_THE_CUA) return;
    this.hopNut = [null, null];
    if (this.hopThe) return;
    if (this.hopTheHoi > 0) {
      const [m, n] = this.nguoi;
      if (m && n && this.hopTheCho(m, n) && hyp(m.x - n.x, m.y - n.y) <= HOP_THE_GAN) this.chu.push({ id: this.id++, x: (m.x + n.x) / 2, y: (m.y + n.y) / 2 - 300, text: `⏳ CHƯA HỢP THỂ ĐƯỢC: CHỜ ${Math.ceil(this.hopTheHoi)}s`, mau: '#ffd23f', t: 0 });
      return;
    }
    if (this.hopTheDuoc()) this.batDauHopThe();
  }

  /** Hợp thể: người nhiều máu hơn (bằng nhau thì Mabu) mang thân Super Bư và ra đòn, người kia bị nhập và lái đi lại / bay */
  private batDauHopThe(): void {
    const [a, b] = this.nguoi as [NguoiChoi, NguoiChoi];
    const chu = a.hp > b.hp ? 0 : b.hp > a.hp ? 1 : a.ki === 0 ? 0 : 1;
    const C = this.nguoi[chu]!;
    const N = this.nguoi[1 - chu]!;
    const hpMax = Math.round(HOP_THE_GAP * (a.hp + b.hp));
    const manaMax = Math.round(a.mana + b.mana);
    this.conBu = [];
    this.conBuLan = 0;
    this.conBuHoi = 0;
    this.hopThe = { chu, nhap: 1 - chu, con: HOP_THE_T, nvCu: C.nv, truoc: this.nguoi.map((n) => ({ hp: n.hp, mana: n.mana })), hpMax, manaMax };
    const nv = new NhanVat(SUPER_BU);
    nv.lat = C.nv.lat;
    C.nv = nv;
    C.x = (a.x + b.x) / 2;
    C.y = (a.y + b.y) / 2;
    giuTrongMap(C, leNhanVat(1), false, vungCua(C));
    C.hp = hpMax;
    C.mana = manaMax;
    C.hoiChieu = 0.4;
    C.hoiSoc = 0;
    for (const n of [C, N]) {
      n.dich = null;
      n.bay = null;
      n.dangDi = false;
      n.cuaCan = false;
    }
    N.x = C.x;
    N.y = C.y;
    this.vet.push({ id: this.id++, x: C.x, y: C.y - 120, t: 0, loai: 'chay', co: 2.4 });
    this.vet.push({ id: this.id++, x: C.x, y: C.y - 60, t: 0, loai: 'bui', co: 2 });
    this.chu.push({ id: this.id++, x: C.x, y: C.y - 780, text: '✨ HỢP THỂ: SUPER BƯ!', mau: '#ff7ac8', t: 0 });
    this.chu.push({ id: this.id++, x: C.x, y: C.y - 720, text: `🕹 ${N.ten}: đi lại / bay · 🎯 ${C.ten}: ra đòn`, mau: '#ffffff', t: 0 });
    this.chu.push({ id: this.id++, x: C.x, y: C.y - 660, text: `👶 ${C.ten}: bấm LB / RB để đẻ ${CON_BU_SO} con Bư (tối đa ${CON_BU_LAN} lần)`, mau: '#ffb3e6', t: 0 });
    this.am.phat('chuong');
    this.rungMan(0.4, 12);
    this.rungTayCam(0, 400, 0.8);
    this.rungTayCam(1, 400, 0.8);
  }

  /** Máu / mana của từng người khi tách ra: theo tỉ lệ còn lại của Super Bư (bị hạ thì mỗi người còn HOP_THE_CON_MAU máu lúc hợp thể) */
  private chiaHopThe(chet: boolean): { hp: number; mana: number }[] {
    const h = this.hopThe!;
    const C = this.nguoi[h.chu]!;
    const rHp = chet ? HOP_THE_CON_MAU : Math.max(0, C.hp) / Math.max(1, h.hpMax);
    const rMana = Math.max(0, C.mana) / Math.max(1, h.manaMax);
    return h.truoc.map((t) => ({ hp: Math.max(1, Math.round(t.hp * rHp)), mana: Math.round(t.mana * rMana) }));
  }

  /** Hết giờ (hoặc Super Bư bị hạ): tách lại thành Mabu và Zinbu đứng hai bên, chờ HOP_THE_HOI giây mới hợp thể lại */
  private tachHopThe(chet: boolean): void {
    const h = this.hopThe;
    if (!h) return;
    const chia = this.chiaHopThe(chet);
    const C = this.nguoi[h.chu]!;
    const N = this.nguoi[h.nhap]!;
    h.nvCu.lat = C.nv.lat;
    h.nvCu.datNhom(Math.min(C.nv.nhom, h.nvCu.sp.nhomDon.length - 1), this.t);
    C.nv = h.nvCu;
    this.hopThe = null;
    this.conBuChetHet();
    this.hopTheHoi = HOP_THE_HOI;
    this.nguoi.forEach((n, p) => {
      n.hp = chia[p]!.hp;
      n.mana = chia[p]!.mana;
      n.het = false;
      n.dich = null;
      n.bay = null;
      n.dangDi = false;
      n.thuongLuc = this.tGame;
    });
    C.hoiChieu = 0.4;
    N.x = C.x + 90;
    C.x -= 90;
    N.y = C.y;
    N.nv.lat = true;
    C.nv.lat = false;
    for (const n of [C, N]) giuTrongMap(n, leNhanVat(1), false, vungCua(n));
    this.vet.push({ id: this.id++, x: (C.x + N.x) / 2, y: C.y - 100, t: 0, loai: 'chay', co: 1.8 });
    this.chu.push({ id: this.id++, x: (C.x + N.x) / 2, y: C.y - 380, text: chet ? '💥 SUPER BƯ BỊ HẠ: TÁCH RA!' : `💨 TÁCH RA! HỢP THỂ LẠI SAU ${HOP_THE_HOI}s`, mau: chet ? '#ff4d4d' : '#9be7ff', t: 0 });
    this.rungMan(0.25, 8);
  }

  /** Mỗi khung: đếm ngược thời gian hợp thể / thời gian hồi; người bị nhập luôn đứng đúng chỗ Super Bư */
  private capNhatHopThe(dt: number): void {
    this.hopTheHoi = Math.max(0, this.hopTheHoi - dt);
    const h = this.hopThe;
    if (!h) return;
    h.con -= dt;
    const C = this.nguoi[h.chu]!;
    const N = this.nguoi[h.nhap]!;
    N.x = C.x;
    N.y = C.y;
    N.dich = null;
    N.bay = null;
    N.dangDi = false;
    if (h.con <= 0 || C.het) { this.tachHopThe(C.het); return; }
    // Hợp thể chỉ có trên thần điện: ra khỏi thần điện (đi qua cổng, đáp xuống ngoài) thì tự tách luôn; đang bay thì chờ hạ xuống
    if (!this.hopTheMo() && !C.bay && !trongThan(C.x, C.y)) {
      this.tachHopThe(false);
      this.chu.push({ id: this.id++, x: C.x, y: C.y - 440, text: '🏯 RA KHỎI THẦN ĐIỆN: TÁCH HỢP THỂ!', mau: '#9be7ff', t: 0 });
    }
  }

  // ─── Con của Super Bư ───

  /** Con Bư gần (x, y) nhất trong bán kính r (null nếu không có) */
  private conBuGan(x: number, y: number, r: number): ConBu | null {
    let kq: ConBu | null = null, dMin = r * r;
    for (const cb of this.conBu) {
      const dx = cb.x - x, dy = cb.y - y, d2 = dx * dx + dy * dy;
      if (d2 < dMin) { dMin = d2; kq = cb; }
    }
    return kq;
  }

  /** Người ra đòn lúc hợp thể bấm LB / RB: Super Bư đẻ CON_BU_SO con quanh mình, tối đa CON_BU_LAN lần mỗi lần hợp thể */
  private deConBu(): void {
    const h = this.hopThe;
    if (!h || this.conBuHoi > 0) return;
    const C = this.nguoi[h.chu]!;
    if (C.het || C.vang) return;
    this.conBuHoi = CON_BU_HOI_DE;
    if (this.conBuLan >= CON_BU_LAN) {
      this.chu.push({ id: this.id++, x: C.x, y: C.y - 480, text: `👶 ĐÃ ĐẺ ĐỦ ${CON_BU_LAN} LẦN!`, mau: '#ff7ac8', t: 0 });
      return;
    }
    this.conBuLan++;
    const hpMax = Math.max(1, Math.round(h.hpMax * CON_BU_GAP));
    for (let i = 0; i < CON_BU_SO; i++) {
      const goc = (i / CON_BU_SO) * Math.PI * 2 + this.conBuLan * 0.9;
      const nv = new NhanVat(SUPER_BU);
      nv.lat = C.nv.lat;
      const cb: ConBu = { id: this.id++, x: C.x + Math.cos(goc) * 150, y: C.y + Math.sin(goc) * 80, hp: hpMax, hpMax, nv, cho: this.t + 0.5, choChuong: this.t + 1, goc, nhay: 0 };
      giuTrongMap(cb, leNhanVat(1), !!C.bay, vungCua(C));
      this.conBu.push(cb);
      this.vet.push({ id: this.id++, x: cb.x, y: cb.y - 80, t: 0, loai: 'chay', co: 0.9 });
      this.vet.push({ id: this.id++, x: cb.x, y: cb.y, t: 0, loai: 'bui' });
    }
    this.chu.push({ id: this.id++, x: C.x, y: C.y - 480, text: `👶 ĐẺ ${CON_BU_SO} CON BƯ! (${this.conBuLan}/${CON_BU_LAN})`, mau: '#ff7ac8', t: 0 });
    this.am.phat('chuong');
    this.rungMan(0.2, 8);
  }

  /** Super Bư tách ra (hết giờ hoặc bị hạ): mọi con Bư chết theo */
  private conBuChetHet(): void {
    if (!this.conBu.length) return;
    for (const cb of this.conBu) {
      this.vetGa({ id: this.id++, x: cb.x, y: cb.y - 80, t: 0, loai: 'chay', co: 1 });
      this.vetGa({ id: this.id++, x: cb.x, y: cb.y, t: 0, loai: 'bui' });
    }
    const a = this.conBu[0]!;
    this.chuGa({ id: this.id++, x: a.x, y: a.y - 260, text: '💨 CON BƯ BIẾN MẤT THEO SUPER BƯ!', mau: '#ffb3e6', t: 0 });
    this.conBu = [];
    this.conBuView = [];
  }

  /** Con Bư dính sát thương gốc `sat` (né NE_NV, giảm GIAM_NV như Super Bư); hết máu thì chết. Trả true nếu mất máu */
  private conBuNhan(cb: ConBu, sat: number): boolean {
    if (cb.hp <= 0) return false;
    if (Math.random() < NE_NV) {
      this.chuGa({ id: this.id++, x: cb.x, y: cb.y - 200, text: 'NÉ!', mau: '#9be7ff', t: 0 });
      return false;
    }
    const nhan = Math.max(1, Math.round(sat * (1 - GIAM_NV)));
    cb.hp -= nhan;
    cb.nhay = 0.15;
    this.chuGa({ id: this.id++, x: cb.x, y: cb.y - 200, text: `-${nhan}`, mau: '#ff4d4d', t: 0 });
    if (cb.hp <= 0) {
      this.conBu = this.conBu.filter((v) => v !== cb);
      this.vetGa({ id: this.id++, x: cb.x, y: cb.y - 80, t: 0, loai: 'chay', co: 1.2 });
      this.vetGa({ id: this.id++, x: cb.x, y: cb.y, t: 0, loai: 'bui' });
      this.chuGa({ id: this.id++, x: cb.x, y: cb.y - 260, text: '💀 CON BƯ BỊ HẠ!', mau: '#ff6b6b', t: 0 });
    }
    return true;
  }

  /** Gà g mổ con Bư đứng sát (khi không có nhân vật nào trong tầm) */
  private conBuBiGaDanh(g: Ga): boolean {
    const cb = this.conBuGan(g.x, g.y, CHAM_GA[g.loai] * (g.to ?? 1));
    if (!cb) return false;
    g.choDanh = this.t + HOI_DANH_GA[g.loai];
    g.mo = MO_THOI_GIAN;
    if (g.loai === 'boss') g.kieuMo = ((g.kieuMo ?? 0) + 1) % 2;
    g.lat = cb.x < g.x;
    this.conBuNhan(cb, satGa(g));
    return true;
  }

  /** Chùm chưởng của quái (Cell / Frieza) quét qua con Bư nào thì con đó trúng */
  private conBuTrungChum(x0: number, y0: number, vx: number, vy: number, L2: number, rong: number, sat: number): void {
    for (const cb of [...this.conBu]) {
      const py = cb.y - 70;
      const u = Math.max(0, Math.min(1, ((cb.x - x0) * vx + (py - y0) * vy) / L2));
      if (hyp(cb.x - (x0 + vx * u), py - (y0 + vy * u)) > rong) continue;
      this.conBuNhan(cb, sat);
    }
  }

  /** Quái gần nhất con Bư (trong CON_BU_TAM): toạ độ tâm thân + bán kính nửa thân (cộng vào tầm đấm). Gà, Cell, Frieza, bản sao bóng ma Goku */
  private conBuMuc(cb: ConBu): { x: number; y: number; r: number } | null {
    let kq: { x: number; y: number; r: number } | null = null;
    let dMin = CON_BU_TAM * CON_BU_TAM;
    const xet = (x: number, y: number, r: number) => {
      const dx = x - cb.x, dy = y - cb.y, d2 = dx * dx + dy * dy;
      if (d2 < dMin) { dMin = d2; kq = { x, y, r }; }
    };
    for (const g of this.ga) {
      if (g.chet) continue;
      const t = this.tamGa(g);
      xet(t.x, t.y, g.loai === 'boss' ? 90 : 40);
    }
    for (const c of this.cell) {
      if (c.chet) continue;
      const t = this.tamCell(c);
      xet(t.x, t.y, CELL_BK * cellK(c.cap));
    }
    if (!this.frieza.chet) {
      const t = this.tamFz();
      xet(t.x, t.y, FZ_BK * 0.8);
    }
    if (!this.ginyu.chet && this.ginyu.sao) {
      const t = this.tamGy();
      xet(t.x, t.y, GY_BK * 0.8);
    }
    return kq;
  }

  /** Mỗi khung: con Bư đi theo Super Bư, thấy quái gần thì đánh (đấm / đá khi sát, bắn chưởng khi xa) */
  private capNhatConBu(dt: number): void {
    this.conBuHoi = Math.max(0, this.conBuHoi - dt);
    const h = this.hopThe;
    if (!h) { this.conBuChetHet(); return; }
    if (!this.conBu.length) return;
    const C = this.nguoi[h.chu]!;
    for (const cb of [...this.conBu]) {
      const nv = cb.nv;
      cb.nhay = Math.max(0, cb.nhay - dt);
      let dangDi = false;
      let dC = hyp(C.x - cb.x, C.y - cb.y);
      // Bị bỏ quá xa thì dịch chuyển về cạnh Super Bư
      if (dC > CON_BU_DICH) {
        cb.x = C.x + Math.cos(cb.goc) * CON_BU_BAM * 0.6;
        cb.y = C.y + Math.sin(cb.goc) * CON_BU_BAM * 0.4;
        this.vetGa({ id: this.id++, x: cb.x, y: cb.y - 80, t: 0, loai: 'no' });
        dC = hyp(C.x - cb.x, C.y - cb.y);
      }
      if (!nv.khoa) {
        const muc = dC < CON_BU_XA ? this.conBuMuc(cb) : null;
        let tx: number | undefined, ty: number | undefined, toc = CON_BU_TOC;
        if (muc) {
          const dx = muc.x - cb.x, dy = muc.y - cb.y, d = hyp(dx, dy);
          const tamDam = CON_BU_TAM_DAM + muc.r;
          if (d <= tamDam && cb.cho <= this.t) {
            // Sát thì đấm / đá, thỉnh thoảng bắn chưởng sát mặt
            this.conBuRaDon(cb, h.chu, muc, cb.choChuong <= this.t && Math.random() < 0.25);
          } else if (d > CON_BU_TAM_CHUONG + muc.r && cb.choChuong <= this.t && cb.cho <= this.t) {
            this.conBuRaDon(cb, h.chu, muc, true);
          } else if (d > tamDam) { tx = muc.x; ty = muc.y; }
          else if (Math.abs(dx) > 5) nv.lat = dx < 0;
        } else {
          // Đi theo Super Bư: đứng quanh, mỗi con một góc; bị bỏ xa thì chạy nhanh để bắt kịp
          const gx = C.x + Math.cos(cb.goc) * CON_BU_BAM, gy = C.y + Math.sin(cb.goc) * CON_BU_BAM * 0.6;
          if (hyp(gx - cb.x, gy - cb.y) > 70) {
            tx = gx; ty = gy;
            if (dC > CON_BU_BAM * 2.5) toc *= 2.2;
          }
        }
        if (tx !== undefined && ty !== undefined) {
          const dx = tx - cb.x, dy = ty - cb.y, d = hyp(dx, dy);
          if (d > 6) {
            dangDi = true;
            const b = Math.min(d, toc * dt);
            cb.x += (dx / d) * b;
            cb.y += (dy / d) * b;
            if (Math.abs(dy) > Math.abs(dx) * 1.2) nv.huong = dy < 0 ? 'len' : 'xuong';
            else {
              nv.huong = 'ngang';
              if (Math.abs(dx) > d * 0.2) nv.lat = dx < 0;
            }
          }
        }
      }
      const truot = nv.capNhat(dt, dangDi);
      if (truot) cb.x += truot * S_NV * CON_BU_TO;
      giuTrongMap(cb, leNhanVat(1), !!C.bay, vungCua(C));
    }
  }

  /** Con Bư ra đòn vào quái `muc`: animation của Super Bư, đạn thật mang tên người ra đòn (p) nên trúng quái đúng như đòn Super Bư nhưng sát thương × CON_BU_GAP */
  private conBuRaDon(cb: ConBu, p: number, muc: { x: number; y: number }, chuong: boolean): void {
    const nv = cb.nv;
    const C = this.nguoi[p]!;
    nv.lat = muc.x < cb.x;
    nv.huong = 'ngang';
    const ma = chuong && Math.random() < CON_BU_TI_LE_MA;
    const nhom = chuong ? (ma ? NHOM_MAY : 2) : Math.random() < 0.6 ? 0 : 1;
    nv.datNhom(nhom, this.t);
    nv.raDon(this.t);
    cb.cho = this.t + (chuong ? 0.5 : CON_BU_HOI_DON);
    if (chuong) cb.choChuong = this.t + CON_BU_HOI_CHUONG;
    if (this.nvThay(cb.x, cb.y - 120, 300, 150)) this.am.phat(chuong ? 'chuong' : nhom === 1 ? 'da' : 'dam');
    const { dx, dy } = nv.diemBan;
    const k = S_NV * nv.heSoTo * (nv.sp.toBanDo ?? 1) * CON_BU_TO;
    const tay = { x: cb.x + (nv.lat ? -dx : dx) * k, y: cb.y + dy * k - nv.cao * S_NV };
    // Sát thương gốc = CON_BU_GAP × đòn Super Bư (cả phần sức mạnh / đậu thần của người ra đòn); trungGa() / trungFz() sẽ nhân lại suc + cộng satDau
    const suc = Math.max(0.01, C.suc);
    const sat = Math.max(1, (CON_BU_GAP * (this.satNv(p, nhom) * suc + C.satDau) - C.satDau) / suc);
    const T = hyp(muc.x - tay.x, muc.y - tay.y) / (chuong ? TOC_DO_DAN * 0.55 : TOC_DO_DAN);
    this.dan.push({ id: this.id++, p, x0: tay.x, y0: tay.y, x1: muc.x, y1: muc.y, t: 0, T, phu: false, to: chuong, sat, nhom, sb: chuong && !ma, ma, con: true });
  }

  /** Vị trí chân + hệ số phóng khi vẽ con Bư (như `nvViTri()`, thu nhỏ CON_BU_TO) */
  conBuViTri(cb: ConBu): { x: number; y: number; k: number } {
    const nv = cb.nv;
    return { x: cb.x, y: cb.y - (nv.cao - nv.nhun) * S_NV, k: S_NV * nv.heSoTo * (nv.sp.toBanDo ?? 1) * CON_BU_TO };
  }

  /** Thanh máu trên đầu con Bư: vị trí và tỉ lệ đầy */
  conBuThanh(cb: ConBu): { x: number; y: number; mau: number } {
    const nv = cb.nv;
    return { x: cb.x, y: cb.y - (nv.cao - nv.nhun) * S_NV - DAU_SB * CON_BU_TO, mau: Math.max(0, Math.min(1, cb.hp / Math.max(1, cb.hpMax))) };
  }

  /** Con Bư vừa trúng đòn thì nháy sáng */
  conBuLoc(cb: ConBu): string | null {
    return cb.nhay > 0 ? MAU_SANG : null;
  }

  private docTayCam(): void {
    const ds = this.dsTayCam;
    ds.length = 0;
    if (typeof navigator !== 'undefined' && navigator.getGamepads) {
      for (const g of navigator.getGamepads()) if (g && g.connected) ds.push(g);
    }
    const ten = ds.map((g) => g.id.replace(/\s*\(.*$/, '').slice(0, 40) + (g.mapping === 'standard' ? '' : ' [không chuẩn]'));
    if (ten.join('|') !== this.tayCamTen.join('|')) this.tayCamTen = ten;
    const cu = (g: Gamepad) => this.nutCu.get(g.index) ?? [];
    const duoc = (g: Gamepad, i: number) => !!g.buttons[i]?.pressed;
    const moi = (g: Gamepad, i: number) => duoc(g, i) && !cu(g)[i];

    // Nút bất kỳ vừa bấm (hiện ở màn bắt đầu để biết tay cầm lạ gửi nút số mấy)
    for (const g of ds) {
      const i = g.buttons.findIndex((_, k) => moi(g, k));
      if (i >= 0) this.tayCamNut = `nút ${i}`;
    }

    // Nút chung cho cả hai tay cầm: bắt đầu / chơi lại / tạm dừng
    for (const g of ds) {
      if (this.man === 'start' || this.man === 'over') {
        if (this.man === 'start') {
          // Chọn thẻ (trái / phải) chỉ tay cầm 1 (người chơi 1); X / A / B xác nhận thì tay cầm nào cũng được (kể cả màn hướng dẫn)
          if (g.index === ds[0]!.index) {
            const cx = g.axes[0] ?? 0;
            const canMoi = Math.abs(cx) > 0.6 ? Math.sign(cx) : 0;
            const sang = (moi(g, 15) ? 1 : 0) - (moi(g, 14) ? 1 : 0) || (canMoi && canMoi !== this.menuCanCu ? canMoi : 0);
            this.menuCanCu = canMoi;
            if (sang) this.menuChon = Math.max(0, Math.min(THE_CHON.length - 1, this.menuChon + sang));
          }
          // X: đánh dấu thẻ ở màn chọn chế độ · A / Menu: Tiếp / Vào chơi ở màn hướng dẫn · B: xác nhận / quay lại
          if (moi(g, 2)) this.onNutX();
          else if (moi(g, 0) || moi(g, 9)) this.onNutBatDau();
          else if (moi(g, 1)) this.onNutQuay();
        } else {
          // Màn kết thúc: bấm X trước rồi bấm B mới chơi lại, tránh lỡ tay chơi lại ngay
          if (moi(g, 2)) this.choiLaiChoB = true;
          else if (moi(g, 1) && this.choiLaiChoB) { this.choiLaiChoB = false; this.batDau(); }
          else if (moi(g, 3)) this.onDong();
        }
      } else if (moi(g, 9) || this.man === 'pause' && moi(g, 1)) this.tamDung();
      else if (this.man === 'pause') {
        // Màn tạm dừng: chữ thập / cần trái lên-xuống chọn nút, A bấm nút đang chọn; Menu / B tiếp tục chơi
        const cy = g.axes[1] ?? 0;
        const canMoi = Math.abs(cy) > 0.6 ? Math.sign(cy) : 0;
        const xuong = (moi(g, 13) ? 1 : 0) - (moi(g, 12) ? 1 : 0) || (canMoi && canMoi !== this.menuCanCu ? canMoi : 0);
        this.menuCanCu = canMoi;
        if (xuong) this.menuTamDung = Math.max(0, Math.min(1, this.menuTamDung + xuong));
        if (moi(g, 0)) this.onNutTamDung();
      }
      else if (moi(g, 8) && ds.length === 1 && this.man === 'play') this.doiTayCam();
    }

    // Tay cầm nào điều khiển nhân vật nào: giữ cố định theo chỉ số tay cầm, tay cầm 1 rút ra thì tay cầm 2 vẫn là Zinbu
    const gan: (Gamepad | undefined)[] = [undefined, undefined];
    const coMat = (i: number) => ds.find((g) => g.index === i);
    if (ds.length >= 2 && this.soNguoi === 2) {
      for (const p of [0, 1]) {
        if (!coMat(this.tayCamGan[p]) || this.tayCamGan[p] === this.tayCamGan[1 - p] && p === 1) this.tayCamGan[p] = -1;
      }
      for (const p of [0, 1]) {
        if (this.tayCamGan[p] < 0) this.tayCamGan[p] = ds.find((g) => g.index !== this.tayCamGan[1 - p])?.index ?? -1;
        gan[p] = coMat(this.tayCamGan[p]);
      }
    } else if (ds.length) {
      const dau = coMat(this.tayCamGan[this.tayCam]) ?? ds[0];
      this.tayCamGan = [-1, -1];
      this.tayCamGan[this.tayCam] = dau.index;
      gan[this.tayCam] = dau;
    }
    // Đang chơi mà tay cầm đã gán bị rút / mất kết nối thì tạm dừng (không để nhân vật đứng giữa trận)
    if (this.man === 'play' && this.dangGan.some((i, p) => i >= 0 && !gan[p] && !this.nguoi[p].vang && !ds.some((g) => g.index === i))) this.tamDung();
    this.dangGan = gan.map((g) => g?.index ?? -1);
    for (const p of [0, 1]) {
      const n = this.nguoi[p];
      const g = gan[p];
      if (this.man !== 'play' || !g) {
        if (n.cuaCan) n.dich = null;
        n.cuaCan = false;
        continue;
      }
      // Nút đánh vừa bấm (A / B / X / Y): hai người cùng bấm một nút khi đứng gần nhau thì hợp thể Super Bư (thuHopThe)
      const nutMoi = [0, 1, 2, 3].find((i) => moi(g, i));
      if (nutMoi !== undefined) this.hopNut[p] = { nut: nutMoi, t: this.t };
      // Đang hợp thể: người bị nhập chỉ đi lại / bay (điều khiển thân Super Bư), người mang thân chỉ ra đòn
      const h = this.hopThe;
      const diDuoc = !h || p === h.nhap;
      const danhDuoc = !h || p === h.chu;
      if (diDuoc) this.dieuKhienDi(h ? h.chu : p, g);
      // Người ra đòn lúc hợp thể: LB / RB đẻ con Bư
      if (h && p === h.chu && (moi(g, 4) || moi(g, 5))) this.deConBu();
      if (!danhDuoc) continue;
      // Mê cung bom: X ném bom (giữ càng lâu ném càng xa), A kích nổ, B đổ nước cứu, Y chọc kim cứu
      if (this.oMeCung(p)) { this.mcTayCam(p, (i) => moi(g, i), (i) => duoc(g, i)); continue; }
      const phai = this.canGat(g, 2, g.mapping === 'standard' || g.axes.length < 6 ? 3 : 5);
      // Ra đòn: giữ nút thì đánh liên tục theo thời gian hồi chiêu. A đấm · X đá · Y chưởng · B hoặc cần phải: chiêu riêng
      const nhom = duoc(g, 1) || phai.m > 0 || duoc(g, 11) ? NHOM_MAY : duoc(g, 3) ? 2 : duoc(g, 2) ? 1 : duoc(g, 0) ? 0 : -1;
      if (nhom >= 0) this.dungChieu(p, nhom);
    }
    if (this.man === 'play') this.thuHopThe();
    // Lưu trạng thái nút ở khung này để lần sau biết nút nào mới bấm
    const luu = new Map<number, boolean[]>();
    for (const g of ds) luu.set(g.index, g.buttons.map((b, i) => b.pressed || (i === 6 || i === 7) && b.value > 0.5));
    this.nutCu = luu;
  }

  /** Tay cầm g điều khiển đi lại / bay của nhân vật p (khi hợp thể: người bị nhập lái thân Super Bư) */
  private dieuKhienDi(p: number, g: Gamepad): void {
    const n = this.nguoi[p];
    const duoc = (i: number) => !!g.buttons[i]?.pressed;
    // Chữ thập: chạy. Cần trái: bay (gạt hướng nào bay hướng đó)
    const dx = (duoc(15) ? 1 : 0) - (duoc(14) ? 1 : 0);
    const dy = (duoc(13) ? 1 : 0) - (duoc(12) ? 1 : 0);
    // Mê cung bom: chữ thập / cần trái chỉ chọn 1 trong 4 hướng (không chéo, không bay), giữ thì đi tiếp từng ô
    if (this.oMeCung(p)) {
      const s = this.mc.nv[p]!;
      if (n.het) { s.di = null; return; }
      let hx = dx, hy = dy;
      if (!hx && !hy) {
        const can = this.canGat(g, 0, 1);
        if (can.m > 0) { if (Math.abs(can.x) >= Math.abs(can.y)) hx = Math.sign(can.x); else hy = Math.sign(can.y); }
      }
      // Bấm chéo: giữ trục đang đi (nếu còn bấm), không thì ưu tiên ngang
      if (hx && hy) { if (s.di?.y && s.di.y === hy) hx = 0; else hy = 0; }
      s.di = hx || hy ? { x: hx, y: hy } : null;
      if (s.di) { n.nhin = { x: hx, y: hy }; s.duong = []; }
      n.dich = null;
      n.cuaCan = false;
      return;
    }
    const bay = this.canGat(g, 0, 1, VUNG_BAY_CAN);
    // Cần trái gạt nhẹ (chưa tới ngưỡng bay) thì chạy theo hướng gạt; chữ thập vẫn ưu tiên
    const canNhe = this.canGat(g, 0, 1);
    const chay = dx || dy ? { x: dx, y: dy, m: hyp(dx, dy) } : canNhe;
    // Hướng nhìn theo hướng đang bay / chạy; không có điều khiển nào thì giữ nguyên
    const huong = bay.m > 0 ? bay : chay;
    if (huong.m > 0) n.nhin = { x: huong.x / huong.m, y: huong.y / huong.m };

    if (bay.m > 0) {
      // Gạt cần trái: bay một đoạn theo hướng gạt; đang khoá bay hoặc hết mana thì chỉ chạy
      this.datDichThe(p, n.x + (bay.x / bay.m) * BAY_CAN, n.y + (bay.y / bay.m) * BAY_CAN);
      n.cuaCan = true;
    } else if (chay.m > 0) {
      this.datDichThe(p, n.x + (chay.x / chay.m) * 200, n.y + (chay.y / chay.m) * 200);
      n.cuaCan = true;
    } else if (n.cuaCan) {
      n.dich = null;
      n.cuaCan = false;
    }
  }

  // Cần analog có vùng chết; trả hướng (đã co giãn) và độ lớn m (0 = đang nằm yên)
  private canGat(g: Gamepad, ax: number, ay: number, vung = VUNG_CHET_CAN): { x: number; y: number; m: number } {
    const x = g.axes[ax] ?? 0;
    const y = g.axes[ay] ?? 0;
    const m = hyp(x, y);
    return m < vung ? { x: 0, y: 0, m: 0 } : { x, y, m };
  }

  /** Rung tay cầm của nhân vật p (bị đánh / gục); bỏ qua nếu tay cầm không hỗ trợ, không đè nhau */
  private rungTayCam(p: number, ms: number, manh: number): void {
    if (p < 0 || this.t < this.rungLan[p]) return;
    const g = this.dangGan[p] >= 0 ? navigator.getGamepads?.()[this.dangGan[p]] : null;
    const rungDc = (g as any)?.vibrationActuator;
    if (!rungDc?.playEffect) return;
    this.rungLan[p] = this.t + ms / 1000;
    rungDc.playEffect('dual-rumble', { duration: ms, strongMagnitude: manh, weakMagnitude: manh * 0.7 }).catch(() => {});
  }

  private doiTayCam(): void {
    if (this.soNguoi < 2) return;
    this.nguoi[this.tayCam].dich = null;
    this.nguoi[this.tayCam].cuaCan = false;
    this.tayCam = 1 - this.tayCam;
  }

  // Dùng thẳng nhóm đòn k (chọn chiêu và ra đòn cùng lúc, tự ngắm); chiêu đang hồi / khoá thì bỏ qua
  private dungChieu(p: number, k: number): void {
    const n = this.nguoi[p];
    if (n.het || n.may.dang || this.trongCau(p) || this.trongPt(p) || this.oMeCung(p) || this.biDung(p)) return;
    // Trên máy bay không biến mây: dùng đấm thay
    if (this.trongMb(p) && k === NHOM_MAY && !!n.nv.sp.nhomDon[k]?.may) k = 0;
    // Chiêu riêng (mây / socola) hết mana hoặc đang hồi thì dùng chiêu kế tiếp còn dùng được: chưởng → đá
    if (k === NHOM_MAY && this.hetMana(p, k)) k = [2, 1].find((j) => !this.hetMana(p, j)) ?? 1;
    if (this.hetMana(p, k) || n.nv.sp.nhomDon.length <= k) return;
    if (n.nv.nhom !== k) n.nv.datNhom(k, this.t);
    const m = this.diemHuong(p);
    this.ban(p, kepX(m.x), kepY(m.y));
  }

  // Tay cầm: đánh theo hướng đang quay mặt (hướng chạy / bay gần nhất). Có gà trong tầm và trong góc ~45° phía trước thì đòn trúng con gần nhất đó, không thì đánh thẳng về phía trước
  private diemHuong(p: number): { x: number; y: number } {
    const n = this.nguoi[p];
    const len = hyp(n.nhin.x, n.nhin.y) || 1;
    const ux = n.nhin.x / len;
    const uy = n.nhin.y / len;
    const nhomSoc = n.nv.nhom === NHOM_MAY && !n.nv.sp.nhomDon[NHOM_MAY]?.may;
    const tam = nhomSoc ? TAM_SOCOLA : n.nv.nhom === 2 ? 800 : n.nv.nhom === 1 ? 480 : 380;
    let tot: Ga | null = null;
    let dm = tam;
    for (const g of this.ga) {
      if (g.chet) continue;
      const t = this.tamGa(g);
      const dx = t.x - n.x;
      const dy = t.y - n.y;
      const d = hyp(dx, dy) - (g.loai === 'boss' ? 125 : 0);
      if (d >= dm || (dx * ux + dy * uy) / (hyp(dx, dy) || 1) < 0.7) continue;
      dm = d;
      tot = g;
    }
    if (tot) {
      const t = this.tamGa(tot);
      return { x: t.x, y: t.y };
    }
    const xa = nhomSoc ? 500 : n.nv.nhom === 2 ? 600 * (this.hopThe?.chu === p ? SB_TAM_GAP : 1) : 250;
    return { x: n.x + ux * xa, y: n.y + uy * xa - 60 };
  }

  // Chỉ xa thì bay theo vòng cung, gần thì chạy
  /** Bay được khi không bị khoá và còn đủ thể lực */
  coTheBay(n: NguoiChoi): boolean {
    // Mê cung bom và đường hầm: không bay (không bay qua tường mê cung)
    return n.bayKhoa <= 0 && n.mana >= MANA_TOI_THIEU && !this.quanhMc(n);
  }

  /** Mana hiện có (số hiển thị giữa bình mana) */
  manaNv(p: number): number {
    return Math.floor(this.nguoi[p].mana);
  }

  /** 0..1: độ đầy của bình mana (so với max(MANA_TOI_DA, mana hiện có)) */
  nlBay(p: number): number {
    const day = this.hopThe?.chu === p ? this.hopThe.manaMax : MANA_TOI_DA;
    return Math.min(1, this.nguoi[p].mana / Math.max(day, this.nguoi[p].mana));
  }

  private datDichThe(p: number, x: number, y: number): void {
    const n = this.nguoi[p];
    if (this.biDung(p)) return;
    // Trên máy bay: chỉ phi công (người lên trước) lái, điều khiển di chuyển bình thường đặt điểm đến của máy bay; hành khách không lái được
    if (this.trongMb(p)) {
      const m = this.mayBay;
      if (m.ngoi[0] === p && m.pha === 'bay') n.dich = { x: kep(x, TG.x0 + MB_LE, TG.x1 - MB_LE), y: kep(y, TG.y0 + MB_LE, TG.y1 - MB_LE) };
      return;
    }
    if (n.nv.khoa || n.bay || n.het || this.trongCau(p)) return;
    // Mê cung bom: bấm chuột vào ô nào thì tìm đường theo ô (lên / xuống / trái / phải) tới đó
    if (this.oMeCung(p)) {
      const s = this.mc.nv[p]!;
      s.di = null;
      s.duong = this.mcDuong(s.toi ?? oCua(n.x, n.y), oCua(x, y));
      // Bấm ra phía đường hầm: tới ô cửa vào rồi bước ra hầm
      if (x > MC.x1 && trongHam(x, y)) s.duong.push({ i: MC_COT, j: O_VAO_MC.j });
      n.dich = null;
      return;
    }
    const o = this.nguoi[1 - p];
    const le = leNhanVat(n.nv.heSoTo);
    // Dây buộc chỉ áp khi người kia có mặt (chơi 1 người thì không bị giữ quanh nhân vật vắng mặt)
    let dich = o.vang ? { x, y } : {
      x: kep(x, o.x - MAX_DX, o.x + MAX_DX),
      y: kep(y, o.y - MAX_DY, o.y + MAX_DY),
    };
    giuTrongMap(dich, le, false, vungCua(n));
    let d = hyp(dich.x - n.x, dich.y - n.y);
    if (d > BAY_TOI_DA) {
      // Chỉ xa hơn tầm bay tối đa thì bay tới mép tầm theo hướng chuột
      dich = { x: n.x + ((dich.x - n.x) / d) * BAY_TOI_DA, y: n.y + ((dich.y - n.y) / d) * BAY_TOI_DA };
      d = BAY_TOI_DA;
    }
    // Dạng mây không bay, chỉ trôi tới nơi; đang khoá hoặc hết thể lực thì chỉ chạy bộ
    if (d <= BAY_KHI_XA || n.may.dang || !this.coTheBay(n)) {
      n.dich = dich;
      return;
    }
    // Thể lực không đủ bay hết quãng thì bay ngắn lại đúng bằng quãng thể lực cho phép
    const toiDa = (n.mana / MANA_BAY) * TOC_DO_BAY;
    if (d > toiDa) {
      dich = { x: n.x + ((dich.x - n.x) / d) * toiDa, y: n.y + ((dich.y - n.y) / d) * toiDa };
      d = toiDa;
    }
    n.dich = null;
    n.nv.lat = dich.x < n.x;
    n.bay = { x0: n.x, y0: n.y, x1: dich.x, y1: dich.y, t: 0, T: d / TOC_DO_BAY };
  }

  private gocView() {
    return { x: this.W / 2 - this.camX * this.camZ, y: TAM_VIEW_Y - this.camY * this.camZ };
  }

  // ─── Hỗ trợ vẽ ───

  // Camera đã kẹp trong map: gốc toạ độ thế giới trên màn hình (cộng rung khi nổ / trúng đòn) và mức zoom
  gocCamera(): { x: number; y: number; k: number } {
    const o = this.gocView();
    const rx = this.rung > 0 ? ngauNhien(-this.rungBien, this.rungBien) : 0;
    return { x: o.x + rx, y: o.y, k: this.camZ };
  }

  // Thanh máu trên đầu nhân vật (toạ độ thế giới của điểm giữa thanh)
  thanhTrenDau(p: number): { x: number; y: number } {
    const n = this.nguoi[p];
    const dau = this.hopThe?.chu === p ? DAU_SB : DAU_NV[n.ki] ?? 170;
    return { x: n.x, y: n.y - (n.nv.cao - n.nv.nhun) * S_NV - dau * this.toMc[p]! };
  }

  // Thanh máu trên đầu gà tướng (to hơn của nhân vật vì gà tướng cao gấp nhiều lần)
  thanhTuong(g: Ga): { x: number; y: number } {
    // Gà mẹ đang bay (g.h) thì thanh máu nâng theo, vẫn nằm trên đầu
    return { x: g.x, y: g.y - (310 * (g.to ?? 1) - 0) - g.h * EP_GA };
  }

  hpNv(p: number): number {
    return Math.max(0, Math.ceil(this.nguoi[p].hp));
  }

  /** Hệ số to của sprite nhân vật trên map (Super Bư to sẵn, mê cung bom to thêm) */
  private toNv(p: number): number {
    return (this.nguoi[p].nv.sp.toBanDo ?? 1) * (this.toMc[p] ?? 1);
  }

  /** Trong mê cung bom chỉ có 1 mạng: không tính máu (thanh / bình máu đầy, chữ "1 mạng") */
  motMang(p: number): boolean {
    return this.oMeCung(p) && !this.nguoi[p].het;
  }

  mauNv(p: number): number {
    if (this.motMang(p)) return 1;
    const day = this.hopThe?.chu === p ? this.hopThe.hpMax : HP_NV;
    return Math.min(1, Math.max(0, this.nguoi[p].hp) / Math.max(day, this.nguoi[p].hp));
  }


  // Vị trí điểm neo (chân) của sprite nhân vật trên map và hệ số phóng
  nvViTri(p: number): { x: number; y: number; k: number } {
    const n = this.nguoi[p];
    return { x: n.x, y: n.y - (n.nv.cao - n.nv.nhun) * S_NV, k: S_NV * n.nv.heSoTo * this.toNv(p) };
  }

  // Bảng chiêu của gà mẹ (thanh đen phía trên): 0 Mổ + đá · 1 Lao · 2 Bay · 3 Đen · 4 Vàng · 5 Đỏ · 6 Gọi gà con.
  // tien 0..1 là vòng tiến độ (hồi chiêu, hoặc thời gian còn lại khi màu đang chạy); không bấm được, chỉ để xem
  bangTuong(): { k: number; x: number; y: number; dung: boolean; tien: number; op: number }[] {
    const g = this.tuongBang;
    return [0, 1, 2, 3, 4, 5, 6].map((k) => {
      let dung = false;
      let tien = 0;
      let san = false;
      let co = true;
      if (g) {
        if (k === 0) { dung = !g.chieu; tien = 1; san = true; }
        else if (k <= 2) {
          const loai = k === 1 ? 'lao' : 'bay';
          const hoi = (k === 1 ? g.hoiLao : g.hoiBay) ?? 0;
          co = k === 1 ? duocLao(g) : duocBay(g);
          dung = g.chieu?.loai === loai;
          tien = 1 - hoi / (k === 1 ? hoiLaoCua(g) : hoiBayCua(g));
          san = hoi <= 0;
        } else if (k === 6) {
          // Gọi gà con: sẵn sàng khi hết hồi (chỉ dùng khi máu dưới GOI_MAU)
          dung = (g.dangGoi ?? 0) > 0;
          tien = 1 - (g.hoiGoi ?? 0) / GOI_HOI;
          san = (g.hoiGoi ?? 0) <= 0;
        } else {
          const m = MAU_TUONG[k - 3];
          const ds = dsMauCua(g);
          co = ds.includes(m);
          dung = g.mau === m;
          if (dung) tien = (g.conMau ?? 0) / MAU_KEO_DAI;
          else if (co && ds[(g.luotMau ?? 0) % ds.length] === m) tien = 1 - (g.hoiMau ?? 0) / (ds.length === 1 ? MAU_CHU_KY_CHUYEN : MAU_CHU_KY);
          san = dung || tien > 0;
        }
      }
      return { k, x: this.GIUA + (k - 3) * 44, y: -BAR / 2, dung, tien: kep(tien, 0, 1), op: !g ? 0.15 : !co ? 0.1 : dung ? 1 : san ? 0.55 : 0.25 };
    });
  }

  // Bộ lọc màu của gà: nháy sáng khi trúng đòn, báo hiệu trước khi lao / bay, đổi màu đen / vàng / đỏ
  locGa(g: Ga): string | null {
    if (g.loai === 'boss') {
      if ((g.socola ?? 0) > 0) return LOC_SOCOLA;
      if (g.chieu?.pha === 'bao' && Math.floor(g.chieu.t * 14) % 2 === 0) return LOC_BAO;
      if (g.mau === 'den') return LOC_DEN;
      if (g.mau === 'vang') return LOC_VANG;
      if (g.mau === 'do') return LOC_DO;
    }
    if ((g.socola ?? 0) > 0) return g.hong ? LOC_SOCOLA_HONG : LOC_SOCOLA;
    if (g.nhay > 0) return MAU_SANG;
    return laMePhu(g) && g.kieuPhu !== undefined ? LOC_PHU[g.kieuPhu] : null;
  }

  /** Màu thanh máu: gà mẹ gốc vàng, gà mẹ phụ theo màu riêng của kiểu, còn lại đỏ */
  mauThanh(g: Ga): string {
    return g.goc ? '#ffd23f' : laMePhu(g) && g.kieuPhu !== undefined ? MAU_PHU[g.kieuPhu] : '#ff4d4d';
  }

  // Nhóm đòn hiện biểu tượng dưới chân, theo thứ tự: Đấm → Chiêu đặc biệt → Đá → (Mabu) Mây
  dsBieuTuong(p: number): number[] {
    // Mê cung bom: 3 nút bom (0 lửa · 1 nước · 2 nổ, từ dưới lên) thay cho chiêu, trên cùng thêm 2 ô kho: 3 kim châm · 4 xô nước (chỉ để xem số còn lại)
    if (this.oMeCung(p)) return [0, 1, 2, 3, 4];
    return this.nguoi[p].nv.sp.nhomDon.length > NHOM_MAY ? [0, 2, 1, NHOM_MAY] : [0, 2, 1];
  }

  private viTriTay(p: number) {
    const n = this.nguoi[p];
    const { dx, dy } = n.nv.diemBan;
    const to = this.toNv(p);
    return { x: n.x + (n.nv.lat ? -dx : dx) * S_NV * to, y: n.y + (dy * to - n.nv.cao) * S_NV };
  }

  tamGa(g: Ga) {
    return { x: g.x, y: g.y - (CHAN_GA * tlGa(g) * S_GA + g.h) * EP_GA };
  }

  // Hình dạng vẽ của gà: vị trí chân, hệ số phóng ngang / dọc (dọc bị ép dẹt EP_GA), độ dời dy lên tâm thân và góc xoay (độ) quanh tâm thân
  // (mổ, đá, ngã, chúi khi Lao); sprite vẽ lùi xuống tới chân.
  gaHinh(g: Ga): { x: number; y: number; kx: number; ky: number; dy: number; xoay: number } {
    const k = S_GA * tlGa(g);
    let xoay = g.chet && g.loai !== 'boss' ? g.tChet * 540 : 0;
    const bay = g.h / (S_GA * tlGa(g));
    let nang = 0;
    // Mổ: gật mạnh về phía trước; gà tướng đá thì ngửa người và nhảy lên
    if (!g.chet && (g.mo ?? 0) > 0) {
      const k = Math.sin((1 - (g.mo ?? 0) / MO_THOI_GIAN) * Math.PI);
      const dau = g.lat ? -1 : 1;
      if (g.loai === 'boss' && g.kieuMo === 1) {
        xoay -= dau * 16 * k;
        nang = 22 * k;
      } else xoay += dau * 30 * k;
    }
    // Chiêu Lao: chúi người về phía trước
    if (g.chieu && g.chieu.loai === 'lao' && g.chieu.pha === 'chay') xoay += (g.lat ? -1 : 1) * 14;
    return { x: g.x, y: g.y, kx: k, ky: k * EP_GA, dy: -CHAN_GA - bay - nang, xoay };
  }

  gaSprite(g: Ga): KhungSprite {
    return MAU_GA[g.loai];
  }

  gaKhung(g: Ga): number {
    if (g.chet) return KHUNG_CHET;
    if ((g.socola ?? 0) > 0) return KHUNG_DUNG[0];
    if (g.loai === 'flyer' || (g.chieu?.loai === 'bay' && g.chieu.pha !== 'nghi')) return KHUNG_BAY[Math.floor(g.phase * 14) % KHUNG_BAY.length];
    const nhip = g.loai === 'boss' ? 0.5 : 1;
    if (g.vx || g.vy) return KHUNG_CHAY[Math.floor(g.phase * 10 * nhip) % KHUNG_CHAY.length];
    return KHUNG_DUNG[Math.floor(g.phase * 3 * nhip) % KHUNG_DUNG.length];
  }

  // Thanh máu gà tướng
  maxHpTuong(g: Ga): number {
    return Math.max(hpToiDa(g), g.hp);
  }

  danHienTai(d: Dan) {
    const k = Math.min(1, d.t / d.T);
    const k0 = Math.max(0, k - 0.12);
    return {
      x: d.x0 + (d.x1 - d.x0) * k, y: d.y0 + (d.y1 - d.y0) * k,
      xs: d.x0 + (d.x1 - d.x0) * k0, ys: d.y0 + (d.y1 - d.y0) * k0,
    };
  }

  // ─── Mê cung bom (phía tây đảo 1, qua đường hầm; xem me-cung.ts) ───

  /** p đang đứng trong lưới mê cung bom: chỉ dùng bom, không có đòn thường */
  oMeCung(p: number): boolean {
    const n = this.nguoi[p];
    return !!n && banDoHt === 'sa' && !n.vang && !this.trongMb(p) && trongMeCung(n.x, n.y);
  }

  /** Ở trong / sát mê cung hoặc trên đường hầm: không bay được */
  private quanhMc(n: { x: number; y: number }): boolean {
    return banDoHt === 'sa' && (trongMeCung(n.x, n.y, 300) || trongHam(n.x, n.y, 200));
  }

  /** Đang ở chính map mê cung bom (lưới mê cung, hoặc đoạn đường hầm đã ra khỏi đảo 1): chỉ ở đây nhân vật mới to hơn / camera mới lùi xa */
  vungMc(n: { x: number; y: number }): boolean {
    if (banDoHt !== 'sa') return false;
    if (trongMeCung(n.x, n.y, 300)) return true;
    const d = DAO[1]!;
    return trongHam(n.x, n.y, 200) && hyp(n.x - d.x, n.y - d.y) > d.r;
  }

  /** Camera lùi xa (thấy rộng hơn) khi mọi nhân vật có mặt, không ngồi xe, đều ở mê cung / đường hầm */
  private camMc(): boolean {
    let co = false;
    for (let p = 0; p < this.nguoi.length; p++) {
      const n = this.nguoi[p]!;
      if (n.vang) continue;
      if (this.trongMb(p) || !this.vungMc(n)) return false;
      co = true;
    }
    return co;
  }

  /** Mọi nhân vật có mặt (không ngồi xe) đều đứng trong lưới mê cung: camera đặt ở tâm mê cung, thấy toàn bộ */
  private camMcToan(): boolean {
    let co = false;
    for (let p = 0; p < this.nguoi.length; p++) {
      const n = this.nguoi[p]!;
      if (n.vang) continue;
      if (this.trongMb(p) || banDoHt !== 'sa' || !trongMeCung(n.x, n.y)) return false;
      co = true;
    }
    return co;
  }

  /** Mọi nhân vật còn sống đều ở mê cung bom hoặc phần đường hầm ngoài đảo 1: thanh đen ghi "Mê cung bom", avatar quái ăn thịt, nhạc nền u ám */
  get trenMeCung(): boolean {
    return this.moiNguoiSong((n) => trongMeCung(n.x, n.y, 200) || (trongHam(n.x, n.y, 100) && n.x < MC_HAM.x1 - 900));
  }

  /** Số quái ăn thịt đang sống trong mê cung */
  get soQuaiMc(): number {
    let k = 0;
    for (const q of this.mc.quai) if (q.chet === undefined) k++;
    return k;
  }

  /** Mức nạp hiện tại của p (0 = không giữ nút, 1..BOM_MUC = số ô sẽ ném xa) */
  mucNapNv(p: number): number {
    const nap = this.mc.nv[p]?.nap;
    return nap ? Math.min(BOM_MUC, 1 + Math.floor((this.t - nap.t0) / BOM_NAP_BUOC)) : 0;
  }

  /** Loại bom p đang giữ nạp (ngẫu nhiên khi bắt đầu giữ nút; null = không giữ nút), để sáng nút bom trên thanh đen */
  bomDangNap(p: number): LoaiBom | null {
    return this.mc.nv[p]?.nap?.loai ?? null;
  }

  /** Số bom loại `loai` p còn */
  bomCon(p: number, loai: LoaiBom): number {
    return this.mc.nv[p]?.bom[loai] ?? 0;
  }

  /** Tầm nổ hiện tại (số ô mỗi hướng) của bom lửa / nước: chờ càng lâu càng dài; đang bay thì 0 */
  tamBom(b: BomMc): number {
    if (b.tam) return b.tam;
    const dat = b.t - bayBom(b);
    return dat < 0 ? 0 : Math.min(BOM_TAM_MAX, Math.max(1, Math.floor(dat)));
  }

  /** Ngọc rồng 4 sao nằm ở ô cuối mê cung (chưa nhặt mà chưa có thì đặt lại; gọi lúc tạo / tải ván) */
  private datNgocMeCung(): void {
    if (this.ngocNhat.includes(MC_NGOC_SAO)) { this.mc.ba.chet = true; this.mc.ba.tChet = BA_CHET_T; }
    if (banDoHt !== 'sa' || this.ngocNhat.includes(MC_NGOC_SAO) || this.vatPham.some((v) => v.loai === 'ngoc' && v.sao === MC_NGOC_SAO)) return;
    const t = tamO(O_NGOC_MC.i, O_NGOC_MC.j);
    this.vatPham.push({ id: this.id++, x: t.x, y: t.y + 60, t: 0, loai: 'ngoc', sao: MC_NGOC_SAO, to: 0.75 });
  }

  /** Ô (i, j) bước vào được: trong lưới thì không phải ô chắn / ô bà phù thuỷ / bom đã chạm đất; ngoài lưới chỉ đường hầm (ra khỏi mê cung) */
  /** Ô (i, j) đang có người (trừ boP) hoặc quái (trừ boQ) đứng / đang đi tới. Mỗi ô mê cung chỉ chứa MỘT thứ:
   *  một người, hoặc một quái, hoặc thùng / ô bí ẩn / gạch; đang đi giữa 2 ô thì giữ cả ô đi tới */
  private mcChiem(i: number, j: number, boP = -1, boQ: QuaiMc | null = null): boolean {
    for (let k = 0; k < this.nguoi.length; k++) {
      const n = this.nguoi[k]!;
      if (k === boP || n.vang || this.trongMb(k) || !trongMeCung(n.x, n.y)) continue;
      const o = oCua(n.x, n.y);
      if (o.i === i && o.j === j) return true;
      const t = this.mc.nv[k]?.toi;
      if (t && t.i === i && t.j === j) return true;
    }
    for (const q of this.mc.quai) {
      if (q === boQ || q.chet !== undefined) continue;
      if (q.ti === i && q.tj === j) return true;
      const o = oCua(q.x, q.y);
      if (o.i === i && o.j === j) return true;
    }
    return false;
  }

  private mcVao(i: number, j: number): boolean {
    if (i < 0 || j < 0 || i >= MC_COT || j >= MC_HANG) { const t = tamO(i, j); return trongHam(t.x, t.y); }
    return !oCung(oMc(i, j)) && !this.oBa(i, j) && !this.mc.bom.some((b) => b.i === i && b.j === j && b.t >= bayBom(b));
  }

  /** Đường đi theo ô (BFS 4 hướng trong lưới) từ ô a tới ô b (không tới được thì tới ô tới được gần b nhất); không gồm ô a */
  private mcDuong(a: { i: number; j: number }, b: { i: number; j: number }): { i: number; j: number }[] {
    const bi = kep(b.i, 0, MC_COT - 1), bj = kep(b.j, 0, MC_HANG - 1);
    const truoc = new Map<number, number>();
    const k0 = a.j * MC_COT + a.i;
    truoc.set(k0, -1);
    const hang = [k0];
    let tot = k0, dTot = Math.abs(a.i - bi) + Math.abs(a.j - bj);
    for (let h = 0; h < hang.length; h++) {
      const k = hang[h]!, i = k % MC_COT, j = (k - i) / MC_COT;
      const d = Math.abs(i - bi) + Math.abs(j - bj);
      if (d < dTot) { dTot = d; tot = k; }
      if (!d) break;
      for (const [hx, hy] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
        const ni = i + hx, nj = j + hy, nk = nj * MC_COT + ni;
        if (ni < 0 || nj < 0 || ni >= MC_COT || nj >= MC_HANG || truoc.has(nk) || !this.mcVao(ni, nj)) continue;
        truoc.set(nk, k);
        hang.push(nk);
      }
    }
    const kq: { i: number; j: number }[] = [];
    for (let k = tot; k !== k0; k = truoc.get(k)!) kq.unshift({ i: k % MC_COT, j: Math.floor(k / MC_COT) });
    return kq;
  }

  /** Quay mặt theo hướng ô (lên / xuống / trái / phải) */
  private mcQuay(n: NguoiChoi, hx: number, hy: number): void {
    if (hy) n.nv.huong = hy < 0 ? 'len' : 'xuong';
    else if (hx) { n.nv.huong = 'ngang'; n.nv.lat = hx < 0; }
  }

  /** Đi theo ô trong lưới mê cung: mỗi bước đúng một ô theo 1 trong 4 hướng, luôn dừng ở tâm ô (không đứng trên vạch / giữa 2 ô).
   *  Trả false khi p không ở trong lưới (đi bộ thường) */
  private mcDi(p: number, dt: number): boolean {
    const n = this.nguoi[p]!;
    const s = this.mc.nv[p];
    if (!s || !this.oMeCung(p)) {
      if (s) { s.toi = null; s.duong = []; }
      return false;
    }
    n.dich = null;
    // Đã gục (nằm cháy / trong bong bóng chờ cứu): không đi được
    if (n.het) {
      if (s.toi) { const o = oCua(n.x, n.y); const t = tamO(o.i, o.j); n.x = t.x; n.y = t.y; }
      s.toi = null; s.di = null; s.duong = []; n.dangDi = false;
      return true;
    }
    let con = TOC_DO_DI * dt;
    for (let lan = 0; lan < 3 && con > 0; lan++) {
      const o = oCua(n.x, n.y);
      if (!s.toi) {
        const t = tamO(o.i, o.j);
        if (Math.abs(n.x - t.x) + Math.abs(n.y - t.y) > 0.5) {
          // Vừa bước từ đường hầm vào ô cửa mà ô đó đã có người / quái: lùi lại ra đường hầm, chờ ô trống
          if (lan === 0 && this.mcChiem(o.i, o.j, p) && o.i === MC_COT - 1) { n.x = MC.x1 + 2; n.dangDi = false; return false; }
          s.toi = o;
        } else {
          n.x = t.x;
          n.y = t.y;
          const ke = s.di ? { i: o.i + s.di.x, j: o.j + s.di.y } : s.duong.shift();
          if (ke && Math.abs(ke.i - o.i) + Math.abs(ke.j - o.j) === 1 && this.mcVao(ke.i, ke.j) && this.mcChiem(ke.i, ke.j, p)) {
            // Ô kế đang có người / quái: đứng chờ ở tâm ô (đường chuột bấm giữ nguyên)
            if (!s.di) s.duong.unshift(ke);
            else this.mcQuay(n, s.di.x, s.di.y);
            break;
          }
          if (ke && Math.abs(ke.i - o.i) + Math.abs(ke.j - o.j) === 1 && this.mcVao(ke.i, ke.j)) s.toi = ke;
          else {
            s.duong = [];
            if (s.di) this.mcQuay(n, s.di.x, s.di.y);
            break;
          }
        }
      } else if (s.di) {
        // Đang đi giữa 2 ô mà bấm hướng ngược lại: quay về ô vừa rời
        const t = tamO(s.toi.i, s.toi.j);
        const mx = Math.sign(t.x - n.x), my = Math.sign(t.y - n.y);
        if (Math.abs(mx) + Math.abs(my) === 1 && s.di.x === -mx && s.di.y === -my && !this.mcChiem(s.toi.i - mx, s.toi.j - my, p)) s.toi = { i: s.toi.i - mx, j: s.toi.j - my };
      }
      // Đi thẳng theo trục tới tâm ô (lệch tâm lúc mới vào lưới thì đi ngang trước rồi dọc)
      const t = tamO(s.toi.i, s.toi.j);
      const dx = t.x - n.x;
      if (dx) { const b = Math.min(Math.abs(dx), con); n.x += Math.sign(dx) * b; con -= b; this.mcQuay(n, Math.sign(dx), 0); }
      const dy = t.y - n.y;
      if (dy && con > 0) { const b = Math.min(Math.abs(dy), con); n.y += Math.sign(dy) * b; con -= b; this.mcQuay(n, 0, Math.sign(dy)); }
      if (n.x !== t.x || n.y !== t.y) break;
      s.toi = null;
      if (!this.oMeCung(p)) break;
    }
    n.dangDi = !!s.toi || (!!s.di && con <= 0);
    // Không trượt theo động tác đòn (ném bom) để luôn đứng đúng tâm ô
    n.nv.capNhat(dt, n.dangDi);
    return true;
  }

  /** p còn bom lửa / nước chưa nổ (mỗi người một quả lửa / nước và một quả bom nổ cùng lúc) */
  private mcBomCho(p: number): BomMc | undefined {
    return this.mc.bom.find((b) => b.p === p && b.loai !== 'no');
  }

  /** Bấm nút ném bom: có bom lửa / nước đang chờ thì kích nổ nó (nếu `kich`), không thì bắt đầu giữ nạp một quả bom NGẪU NHIÊN
   *  trong các loại còn bom (đang có bom lửa / nước chờ nổ thì chỉ còn bom nổ; bom chỉ bị trừ lúc ném ra thật) */
  private mcBam(p: number, kich = true): void {
    const n = this.nguoi[p]!;
    const s = this.mc.nv[p]!;
    if (n.het || s.trang || s.nap) return;
    if (kich && this.mcBomCho(p)) { this.mcKichNo(p); return; }
    if (!LOAI_BOM.some((l) => s.bom[l] > 0)) {
      this.chu.push({ id: this.id++, x: n.x, y: n.y - 260, text: '💣 HẾT BOM! TÌM TÚI BOM Ở Ô BÍ ẨN', mau: '#ff6b6b', t: 0 });
      return;
    }
    const duoc = LOAI_BOM.filter((l) => s.bom[l] > 0 && (l === 'no' ? !this.mc.bom.some((b) => b.p === p && b.loai === 'no') : !this.mcBomCho(p)));
    if (!duoc.length) return;
    s.nap = { loai: duoc[Math.floor(Math.random() * duoc.length)]!, t0: this.t };
  }

  /** Tay cầm trong mê cung: X ném bom (giữ để nạp, thả ra thì ném theo hướng đang nhìn; loại bom là ngẫu nhiên) · A kích nổ bom lửa / nước ·
   *  B đổ nước cứu đồng đội đang cháy (tốn 1 xô nước) · Y chọc kim cứu đồng đội đang sặc nước (tốn 1 kim châm) */
  private mcTayCam(p: number, moi: (i: number) => boolean, giu: (i: number) => boolean): void {
    const s = this.mc.nv[p]!;
    const n = this.nguoi[p]!;
    if (moi(0)) this.mcKichNo(p);
    if (moi(1)) {
      if (s.xo > 0) s.cuuNut = { loai: 'xo', t: this.t };
      else this.chu.push({ id: this.id++, x: n.x, y: n.y - 260, text: '🪣 HẾT XÔ NƯỚC!', mau: '#ff6b6b', t: 0 });
    }
    if (moi(3)) {
      if (s.kim > 0) s.cuuNut = { loai: 'kim', t: this.t };
      else this.chu.push({ id: this.id++, x: n.x, y: n.y - 260, text: '📍 HẾT KIM CHÂM!', mau: '#ff6b6b', t: 0 });
    }
    if (moi(2)) this.mcBam(p, false);
    if (s.nap && !giu(2)) {
      this.mcNem(p, n.nhin.x, n.nhin.y);
    }
  }

  /** Ném bom đang nạp theo hướng (dx, dy) (làm tròn về 4 hướng): bay xa đúng số mức nạp, dừng trước gạch / hang / bom khác;
   *  bom bay qua và đáp được lên thùng gỗ / ô bí ẩn (nổ là phá luôn thùng đó), nhưng không bao giờ nằm trên gạch / hang */
  private mcNem(p: number, dx: number, dy: number): void {
    const n = this.nguoi[p]!;
    const s = this.mc.nv[p]!;
    const nap = s.nap;
    const muc = this.mucNapNv(p);
    s.nap = null;
    if (!nap || n.het || s.trang || !this.oMeCung(p) || s.bom[nap.loai] <= 0) return;
    if (nap.loai === 'no' ? this.mc.bom.some((b) => b.p === p && b.loai === 'no') : this.mcBomCho(p)) return;
    let hx = 0, hy = 0;
    if (!dx && !dy) hx = n.nv.lat ? -1 : 1;
    else if (Math.abs(dx) >= Math.abs(dy)) hx = dx < 0 ? -1 : 1;
    else hy = dy < 0 ? -1 : 1;
    let { i, j } = oCua(n.x, n.y);
    const coBom = (a: number, b: number) => this.mc.bom.some((q) => q.i === a && q.j === b);
    for (let k = 0; k < muc; k++) {
      const ni = i + hx, nj = j + hy;
      if (oTuongMc(oMc(ni, nj)) || coBom(ni, nj) || this.oBa(ni, nj)) break;
      i = ni; j = nj;
    }
    if (coBom(i, j) || oTuongMc(oMc(i, j)) || this.oBa(i, j)) return;
    const tay = this.viTriTay(p);
    this.mc.bom.push({ id: this.id++, p, loai: nap.loai, i, j, x0: tay.x, y0: tay.y, t: 0 });
    s.bom[nap.loai]--;
    if (hx) n.nv.lat = hx < 0;
    n.nv.nemBom();
    this.am.phat('da');
  }

  /** Kích nổ bom lửa / nước của p (đang bay thì chạm đất là nổ) */
  private mcKichNo(p: number): void {
    const b = this.mcBomCho(p);
    if (!b) return;
    if (b.t < bayBom(b)) b.kich = true;
    else this.mcNo(b);
  }

  /** Bom nổ: lửa / nước chữ thập dài theo thời gian chờ (bị gạch / hang chặn, phá thùng / ô bí ẩn đầu tiên rồi dừng);
   *  bom nổ là vùng vuông bán kính BOM_NO_BK, ô sau gạch (theo đường từ tâm) được che. Bom khác trong vùng nổ theo. */
  private mcNo(b: BomMc): void {
    const k = this.mc.bom.indexOf(b);
    if (k < 0) return;
    this.mc.bom.splice(k, 1);
    const noi: BomMc[] = [];
    const dat = (i: number, j: number) => {
      this.mc.lua.push({ i, j, loai: b.loai, con: LUA_T, p: b.p, da: [] });
      // Bom khác đã chạm đất trong vùng nổ thì nổ theo (bom còn bay trên không thì không)
      const o = this.mc.bom.find((q) => q.i === i && q.j === j && q.t >= bayBom(q));
      if (o && !noi.includes(o)) noi.push(o);
    };
    if (b.loai === 'no') {
      for (let dj = -BOM_NO_BK; dj <= BOM_NO_BK; dj++) for (let di = -BOM_NO_BK; di <= BOM_NO_BK; di++) {
        const i = b.i + di, j = b.j + dj, c = oMc(i, j);
        if (c === '#' || c === 'H' || i < 0 || j < 0) continue;
        if (Math.max(Math.abs(di), Math.abs(dj)) === 2 && oMc(b.i + Math.round(di / 2), b.j + Math.round(dj / 2)) === '#') continue;
        if (c === 'w' || c === '?') this.mcPha(i, j);
        dat(i, j);
      }
    } else {
      const tam = b.kich && b.t - bayBom(b) < 1 ? 1 : this.tamBom(b);
      const goc = oMc(b.i, b.j);
      if (goc === 'w' || goc === '?') this.mcPha(b.i, b.j);
      dat(b.i, b.j);
      for (const [hx, hy] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
        for (let s = 1; s <= tam; s++) {
          const i = b.i + hx * s, j = b.j + hy * s, c = oMc(i, j);
          if (c === '#' || c === 'H') break;
          if (c === 'w' || c === '?') { this.mcPha(i, j); dat(i, j); break; }
          dat(i, j);
        }
      }
    }
    const t = tamO(b.i, b.j);
    this.vet.push({ id: this.id++, x: t.x, y: t.y, t: 0, loai: b.loai === 'nuoc' ? 'bui' : 'chay', co: b.loai === 'no' ? 1.8 : 1.1 });
    this.am.phat('chuong');
    this.rungMan(0.15, b.loai === 'no' ? 10 : 6);
    for (const o of noi) this.mcNo(o);
  }

  /** Phá thùng gỗ / ô bí ẩn; ô bí ẩn ra ngẫu nhiên: quái nhảy ra, bom bẫy (tự nổ), xô nước, kim châm hoặc mạng */
  private mcPha(i: number, j: number): void {
    const c = mcO[j]![i]!;
    mcO[j]![i] = '.';
    if (c === '?') this.mc.oHoi.push({ i, j, t: O_BI_AN_HOI });
    const t = tamO(i, j);
    this.vet.push({ id: this.id++, x: t.x, y: t.y, t: 0, loai: 'bui', co: 1.6 });
    if (c !== '?') return;
    let r = Math.random();
    let loai = TI_LE_O_BI_AN.find(([, x]) => (r -= x) < 0)?.[0] ?? 'mang';
    // Bà phù thuỷ đang bay trên ô này: quái không chui ra được, thành bom bẫy
    if (loai === 'quai' && this.oBa(i, j)) loai = 'bom';
    if (loai === 'quai') {
      const q = this.mcSinhQuai(i, j, -1, QUAI_RA * 1.5);
      this.chu.push({ id: this.id++, x: t.x, y: t.y - 160, text: `👾 ${QUAI_DL[q.loai].ten.toUpperCase()} NHẢY RA!`, mau: '#b46bff', t: 0 });
    } else if (loai === 'bom') {
      // Bom bẫy (không của ai): nảy lên từ ô vỡ rồi rơi xuống chính ô đó, tự nổ sau BAY_NO giây
      const lb = LOAI_BOM[Math.floor(Math.random() * LOAI_BOM.length)]!;
      this.mc.bom.push({ id: this.id++, p: -3, loai: lb, i, j, x0: t.x, y0: t.y, t: 0, bay: BAY_BAY, tam: BAY_TAM });
      this.chu.push({ id: this.id++, x: t.x, y: t.y - 160, text: '💣 BOM BẪY!', mau: '#ff6b6b', t: 0 });
    } else this.mc.vp.push({ id: this.id++, i, j, loai });
  }

  private mcSinhQuai(i: number, j: number, hang: number, ra = QUAI_RA): QuaiMc {
    const t = tamO(i, j);
    const loai: LoaiQuai = LOAI_QUAI[Math.floor(Math.random() * LOAI_QUAI.length)]!;
    const q: QuaiMc = {
      id: this.id++, loai, x: t.x, y: t.y, ti: i, tj: j, dang: false, huong: 0, hang, ra, choCan: 0, ph: Math.random() * 6,
      mau: QUAI_DL[loai].mau, lat: Math.random() < 0.5, nap: 0, tia: [], ban: 0, hoiChieu: QUAI_DL[loai].hoi / 2, danh: 0, dau: 0,
    };
    this.mc.quai.push(q);
    this.vetGa({ id: this.id++, x: t.x, y: t.y, t: 0, loai: 'bui', co: 1.4 });
    return q;
  }

  /** Quái bị hạ: xác nằm mờ dần QUAI_CHET_T giây; người ném bom (p ≥ 0) được điểm theo loài */
  private mcQuaiChet(q: QuaiMc, p: number): void {
    q.chet = 0;
    q.nap = 0;
    this.vetGa({ id: this.id++, x: q.x, y: q.y - 80, t: 0, loai: 'chay', co: 1 });
    const d = QUAI_DL[q.loai].diem;
    if (p >= 0 && !this.nguoi[p]!.vang) this.congDiem(p, d, q.x, q.y - 260, `👾 +${d}`);
  }

  /** p dính lửa / nước / bom nổ: bom nổ là gục (nằm cháy, chờ xô nước); lửa → bốc cháy, nước → sặc trong bong bóng (chờ đồng đội cứu) */
  private mcTrung(p: number, loai: LoaiBom): void {
    const n = this.nguoi[p]!;
    const s = this.mc.nv[p]!;
    if (loai === 'no') { this.nhanSatThuong(n, BOM_NO_SAT, true, '#ffb347', 'chay'); return; }
    if (s.trang) return;
    const can = loai === 'lua' ? 'xo' : 'kim';
    // Chơi 1 người: không ai cứu nên còn đúng đồ thì tự cứu ngay (tốn 1)
    if (this.soNguoi < 2 && s[can] > 0) {
      s[can]--;
      this.chu.push({ id: this.id++, x: n.x, y: n.y - 260, text: loai === 'lua' ? '🪣 TỰ DẬP LỬA!' : '📍 TỰ CHỌC BONG BÓNG!', mau: '#9be7ff', t: 0 });
      return;
    }
    const max = loai === 'lua' ? TRANG_CHAY : TRANG_BONG;
    s.trang = { loai: loai === 'lua' ? 'chay' : 'bong', con: max, max };
    s.nap = null;
    n.dich = null;
    this.chu.push({ id: this.id++, x: n.x, y: n.y - 260, text: loai === 'lua' ? `🔥 ${n.ten} BỐC CHÁY! CẦN XÔ NƯỚC` : `🫧 ${n.ten} SẶC NƯỚC! CẦN KIM CHÂM`, mau: loai === 'lua' ? '#ff6a2a' : '#5ab4ff', t: 0 });
  }

  /** Gục trong mê cung (hết giờ cháy / bong bóng, bom nổ, tia, quái cắn): có mạng dự phòng thì dùng một mạng, đứng dậy ngay;
   *  không thì gục nhưng KHÔNG hoá mây / socola: nằm tại chỗ, vẫn cháy (kieu 'chay', cần xô nước) hoặc trong bong bóng ('bong', cần kiếm / kim châm)
   *  chờ đồng đội cứu (mcCuu()). Cả hai gục là thua */
  private mcChet(p: number, kieu: 'chay' | 'bong'): void {
    const n = this.nguoi[p]!;
    const s = this.mc.nv[p]!;
    if (n.het) return;
    s.trang = null;
    s.nap = null;
    n.dich = null;
    if (s.mang > 0) {
      s.mang--;
      this.vet.push({ id: this.id++, x: n.x, y: n.y - 100, t: 0, loai: 'chay', co: 1 });
      this.chu.push({ id: this.id++, x: n.x, y: n.y - 300, text: `❤ ${n.ten} DÙNG MẠNG DỰ PHÒNG! (còn ${s.mang})`, mau: '#ff7aa8', t: 0 });
      return;
    }
    this.chetNv(n);
    s.guc = kieu;
    this.rungTayCam(p, 600, 1);
    this.chu.push({ id: this.id++, x: n.x, y: n.y - 300, text: kieu === 'chay' ? `💀 ${n.ten} GỤC: CẦN XÔ NƯỚC DẬP LỬA!` : `💀 ${n.ten} GỤC TRONG BONG BÓNG: CẦN KIM CHÂM!`, mau: '#ff4d4d', t: 0 });
    if (this.nguoi.every((m) => m.het)) this.ketThuc(false);
  }

  /** Đồng đội cứu được p (đang cháy / bong bóng, hoặc đã gục chờ cứu): người gục đứng dậy tại chỗ */
  private mcDuocCuu(p: number, q: number): void {
    const n = this.nguoi[p]!;
    const s = this.mc.nv[p]!;
    const dl = s.guc;
    s.trang = null;
    s.guc = null;
    if (dl) {
      n.het = false;
      n.hp = Math.max(1, s.luu?.hp ?? CUU_MAU);
      n.thuongLuc = this.tGame;
      n.hoiChieu = 0.5;
      n.nv.hoiSinh();
    }
    this.vet.push({ id: this.id++, x: n.x, y: n.y - 100, t: 0, loai: 'bui', co: 1.5 });
    this.chu.push({ id: this.id++, x: n.x, y: n.y - 300, text: `✨ ${this.nguoi[q]!.ten} ĐÃ CỨU ${n.ten}${dl ? ' SỐNG LẠI' : ''}!`, mau: '#7be04a', t: 0 });
  }

  /** Lối ra mê cung: mọi người đang đi bộ (kể cả người gục) dịch chuyển tới núi đá, chỗ bóng ma Goku; ra khỏi lưới mê cung
   *  nên máu / mana trả lại đúng như lúc bước vào (người gục thì trả lại khi được cứu sống) */
  private mcRaNui(raT: { x: number; y: number }): void {
    const dung = this.nguoi.map((n, p) => ({ n, p })).filter(({ n, p }) => !n.vang && !this.trongMb(p) && !this.trongCau(p));
    this.vet.push({ id: this.id++, x: raT.x, y: raT.y - 120, t: 0, loai: 'chay', co: 1.2 });
    const dx = NUI.x, dy = NUI.y + NUI.ry * 0.5;
    dung.forEach(({ n, p }, i) => {
      n.x = dx + (dung.length > 1 ? (i === 0 ? -170 : 170) : 0);
      n.y = dy;
      n.dich = null;
      n.dangDi = false;
      giuTrongMap(n, leNhanVat(n.nv.heSoTo), false, 'dao');
      const s = this.mc.nv[p]!;
      s.toi = null;
      s.di = null;
      s.duong = [];
      s.nap = null;
      s.trang = null;
      for (const cu of this.cuu) if (cu.p === p) { cu.x = n.x; cu.y = n.y; }
    });
    // Người đang gục chờ cứu trong mê cung: ra ngoài thì cứu đồng đội như thường (mây / socola)
    dung.forEach(({ n, p }) => {
      const s = this.mc.nv[p]!;
      if (!s.guc) return;
      s.guc = null;
      if (n.het) this.batDauCuu(n);
    });
    this.vet.push({ id: this.id++, x: dx, y: dy - 200, t: 0, loai: 'chay', co: 1.6 });
    this.chu.push({ id: this.id++, x: dx, y: dy - 600, text: '👻 RA KHỎI MÊ CUNG: TỚI NÚI ĐÁ CỦA BÓNG MA GOKU!', mau: '#c9a2ff', t: 0 });
    this.am.phat('chuong');
    this.rungMan(0.3, 8);
    this.camNgay = true;
  }

  /** Làm mới mê cung bom như lúc mới tạo ván: bố cục gạch / thùng / ô bí ẩn, quái, bà phù thuỷ (kèm viên ngọc 4 sao quay về chỗ bà), bom, đồ, kho của từng người */
  private lamMoiMeCung(): void {
    datLaiMeCung();
    this.mc = taoMeCung();
    this.vatPham = this.vatPham.filter((v) => !(v.loai === 'ngoc' && v.sao === MC_NGOC_SAO));
    this.datNgocMeCung();
  }

  /** Mỗi khung: bom, lửa / nước, trạng thái cháy / bong bóng / lưới, cứu người, nhặt đồ, quái ăn thịt.
   *  Không ai ở mê cung / đường hầm thì quái đứng im ("một chấm"), chỉ bom / lửa còn dở chạy nốt */
  private capNhatMeCung(dt: number): void {
    if (banDoHt !== 'sa') return;
    // Mỗi lần cả đội bước vào mê cung / đường hầm (từ lúc không còn ai ở đó) thì mọi thứ làm mới lại (bố cục, quái, bà phù thuỷ, đồ, kho xô / kim / bom),
    // trừ khi đã nhặt ngọc rồng 4 sao: giữ nguyên hiện trạng
    const coNguoi = this.nguoi.some((n, p) => !n.vang && !this.trongMb(p) && this.vungMc(n));
    if (coNguoi && !this.mcCoNguoi && !this.ngocNhat.includes(MC_NGOC_SAO)) this.lamMoiMeCung();
    this.mcCoNguoi = coNguoi;
    const mc = this.mc;
    for (const d of mc.doCuu) d.cho = Math.max(0, d.cho - dt);
    // Ô bí ẩn đã vỡ mọc lại sau O_BI_AN_HOI giây (chờ ô trống: không người / quái / bom / bà phù thuỷ / đồ)
    for (let k = mc.oHoi.length - 1; k >= 0; k--) {
      const o = mc.oHoi[k]!;
      o.t -= dt;
      if (o.t > 0) continue;
      if (mcO[o.j]![o.i] !== '.' || this.mcChiem(o.i, o.j) || this.oBa(o.i, o.j) || mc.bom.some((b) => b.i === o.i && b.j === o.j) || mc.vp.some((v) => v.i === o.i && v.j === o.j)) { o.t = 1; continue; }
      mcO[o.j]![o.i] = '?';
      mc.oHoi.splice(k, 1);
    }
    // Nhân vật to dần khi vào mê cung / đường hầm, nhỏ lại khi ra
    this.nguoi.forEach((n, p) => {
      const dich = !n.vang && !this.trongMb(p) && this.vungMc(n) ? MC_TO_NV : 1;
      this.toMc[p] = this.toMc[p]! + (dich - this.toMc[p]!) * Math.min(1, dt * 4);
    });
    // Lối ra góc dưới trái: ai (còn sống, không bị cháy / bong bóng / lưới) tới tâm ô lối ra thì cả đội dịch chuyển tới núi đá
    const raT = tamO(O_RA_MC.i, O_RA_MC.j);
    if (this.nguoi.some((n, p) => this.oMeCung(p) && !n.het && !mc.nv[p]!.trang && hyp(n.x - raT.x, n.y - raT.y) < MC_O * 0.3)) this.mcRaNui(raT);
    // 1 mạng trong mê cung: nhớ máu / mana lúc bước vào, ra khỏi mê cung (còn sống) thì trả lại đúng như cũ
    this.nguoi.forEach((n, p) => {
      const s = mc.nv[p]!;
      const o = this.oMeCung(p);
      if (o && !s.luu && !n.het) s.luu = { hp: n.hp, mana: n.mana };
      else if (!o && s.luu && !n.het && !n.vang) {
        n.hp = s.luu.hp;
        n.mana = s.luu.mana;
        s.luu = null;
        this.chu.push({ id: this.id++, x: n.x, y: n.y - 300, text: `↩ ${n.ten} RA KHỎI MÊ CUNG: MÁU ${Math.ceil(n.hp)} · MANA ${Math.ceil(n.mana)}`, mau: n.mau, t: 0 });
      }
    });
    this.nguoi.forEach((n, p) => {
      const s = mc.nv[p]!;
      if (n.vang || n.het) { s.trang = null; s.nap = null; if (!n.het) s.guc = null; return; }
      s.guc = null;
      if (s.nap && !this.oMeCung(p)) s.nap = null;
      if (!s.trang) return;
      s.trang.con -= dt;
      if (s.trang.con > 0) return;
      this.mcChet(p, s.trang.loai);
    });
    const hoat = this.nguoi.some((n) => !n.vang && !n.het && (trongMeCung(n.x, n.y, 400) || trongHam(n.x, n.y)));
    if (!hoat && !mc.bom.length && !mc.lua.length) return;
    for (const b of [...mc.bom]) {
      b.t += dt;
      const dat = b.t - bayBom(b);
      if (dat < 0) continue;
      // Bom của bà phù thuỷ: cùng luật như bom người chơi, bà kích nổ lửa / nước khi có người nằm trong tầm tia; bom bẫy tự nổ sau BAY_NO giây
      const no = b.kich || (b.loai === 'no' ? dat >= BOM_NO_T : b.p === -3 ? dat >= BAY_NO : dat >= BOM_TAM_MAX || (b.p === -1 && dat >= BA_BOM_CHO && this.mcBomTrung(b)));
      if (no) this.mcNo(b);
    }
    // Lửa / nước còn trên ô: ai (người, quái) đứng trong ô đó thì dính
    for (const t of mc.tia) t.t += dt;
    mc.tia = mc.tia.filter((t) => t.t < QUAI_TIA_T);
    for (const q of mc.quai) if (q.chet !== undefined) q.chet += dt;
    mc.quai = mc.quai.filter((q) => q.chet === undefined || q.chet < QUAI_CHET_T);
    for (const f of mc.lua) {
      f.con -= dt;
      this.nguoi.forEach((n, p) => {
        if (n.vang || n.het || f.da.includes(p) || this.trongMb(p)) return;
        const o = oCua(n.x, n.y);
        if (o.i !== f.i || o.j !== f.j) return;
        f.da.push(p);
        this.mcTrung(p, f.loai);
      });
      // Lửa quỷ canh cổng phun ra không hại quái; bom nổ trừ 2 máu, lửa / nước trừ 1 (mỗi ngọn trúng một con một lần)
      if (f.p === -2) continue;
      for (const q of mc.quai) {
        if (q.ra > 0 || q.chet !== undefined || f.quaiDa?.includes(q.id)) continue;
        const o = oCua(q.x, q.y);
        if (o.i !== f.i || o.j !== f.j) continue;
        (f.quaiDa ??= []).push(q.id);
        q.mau -= f.loai === 'no' ? 2 : 1;
        if (q.mau <= 0) this.mcQuaiChet(q, f.p);
        else {
          q.dau = QUAI_DAU_T;
          q.nap = 0;
          this.chuGa({ id: this.id++, x: q.x, y: q.y - 380, text: `💢 ${QUAI_DL[q.loai].ten.toUpperCase()} CÒN ${q.mau} MÁU`, mau: '#ffb347', t: 0 });
        }
      }
    }
    for (const f of mc.lua) if (f.p >= 0 && !f.baDa && this.oBa(f.i, f.j)) { f.baDa = true; this.mcTrungBa(f); }
    mc.lua = mc.lua.filter((f) => f.con > 0);
    if (!hoat) return;
    // Hang sinh quái theo đợt
    HANG_MC.forEach((h, k) => {
      mc.hang[k]! -= dt;
      if (mc.hang[k]! > 0) return;
      mc.hang[k] = QUAI_CACH;
      if (mc.quai.filter((q) => q.hang === k && q.chet === undefined).length >= QUAI_TOI_DA) return;
      // Quái chui ra ô trống cạnh hang (ô đó không có người / quái / bom)
      const ra = ([[1, 0], [-1, 0], [0, 1], [0, -1]] as const).map(([x, y]) => ({ i: h.i + x, j: h.j + y }))
        .filter((o) => !oCung(oMc(o.i, o.j)) && !oTrongVao(o.i, o.j) && !this.oBa(o.i, o.j) && !this.mcChiem(o.i, o.j) && !mc.bom.some((b) => b.i === o.i && b.j === o.j));
      if (ra.length) { const o = ra[Math.floor(Math.random() * ra.length)]!; this.mcSinhQuai(o.i, o.j, k); }
      else mc.hang[k] = 1;
    });
    for (const q of [...mc.quai]) if (q.chet === undefined) this.mcQuai(q, dt);
    this.mcBa(dt);
    // Cứu người (đang cháy / trong bong bóng, hoặc đã gục chờ cứu): đồng đội cầm xô nước (dập lửa) / kiếm, kim châm (chọc bong bóng) đứng ở ô bên cạnh
    this.nguoi.forEach((n, p) => {
      const s = mc.nv[p]!;
      const kieu = s.guc ?? s.trang?.loai;
      if (!kieu) return;
      const q = this.nguoi.findIndex((m, k) => {
        const sk = mc.nv[k]!;
        if (k === p || m.vang || m.het || sk.trang || hyp(m.x - n.x, m.y - n.y) >= CUU_MC_BK) return false;
        if ((kieu === 'chay' ? sk.xo : sk.kim) <= 0) return false;
        // Phải bấm B (đổ nước) / Y (chọc kim) mới cứu
        const c = mc.nv[k]!.cuuNut;
        return !!c && this.t - c.t <= 0.3 && c.loai === (kieu === 'chay' ? 'xo' : 'kim');
      });
      if (q < 0) return;
      if (kieu === 'chay') mc.nv[q]!.xo--;
      else mc.nv[q]!.kim--;
      this.mcDuocCuu(p, q);
    });
    // Nhặt kiếm / xô nước và vật phẩm rơi từ ô bí ẩn
    this.nguoi.forEach((n, p) => {
      const s = mc.nv[p]!;
      if (n.vang || n.het || s.trang || n.bay || !trongMeCung(n.x, n.y)) return;
      for (const d of mc.doCuu) {
        const t = tamO(d.i, d.j);
        if (d.cho > 0 || hyp(n.x - t.x, n.y - t.y) >= VP_MC_BK) continue;
        s[d.loai] += MC_DO_THEM;
        d.cho = DO_MC_HOI;
        this.chu.push({ id: this.id++, x: n.x, y: n.y - 260, text: d.loai === 'kim' ? `📍 ${n.ten} +${MC_DO_THEM} KIM CHÂM (${s.kim})` : `🪣 ${n.ten} +${MC_DO_THEM} XÔ NƯỚC (${s.xo})`, mau: n.mau, t: 0 });
      }
      const k = mc.vp.findIndex((v) => { const t = tamO(v.i, v.j); return hyp(n.x - t.x, n.y - t.y) < VP_MC_BK; });
      if (k < 0) return;
      // Mạng đã đủ thì để lại trên ô
      if (mc.vp[k]!.loai === 'mang' && s.mang >= MANG_TOI_DA) return;
      const v = mc.vp.splice(k, 1)[0]!;
      let text: string;
      if (v.loai === 'mang') { s.mang++; text = `❤ ${n.ten} +1 MẠNG (${1 + s.mang}♥)`; }
      else if (v.loai === 'tui') { for (const l of LOAI_BOM) s.bom[l] += MC_BOM_THEM; text = `💣 ${n.ten} NHẶT TÚI BOM: +${MC_BOM_THEM} MỖI LOẠI`; }
      else { s[v.loai] += MC_DO_THEM; text = v.loai === 'xo' ? `🪣 ${n.ten} +${MC_DO_THEM} XÔ NƯỚC (${s.xo})` : `📍 ${n.ten} +${MC_DO_THEM} KIM CHÂM (${s.kim})`; }
      this.am.phat('anTao');
      this.chu.push({ id: this.id++, x: n.x, y: n.y - 260, text, mau: v.loai === 'mang' ? '#ff7aa8' : '#ffd23f', t: 0 });
    });
  }

  // ─── Bà phù thuỷ (quái chính mê cung bom): cưỡi ngọc 4 sao bay khắp mê cung, ném bom vào người chơi, hồi sinh 2 lần ───

  /** Bà phù thuỷ chưa bị hạ hẳn (còn mang viên ngọc 4 sao, kể cả lúc đang chờ hồi sinh) */
  get baSong(): boolean {
    return banDoHt === 'sa' && !this.mc.ba.chet;
  }

  /** Tâm viên ngọc bà cưỡi, chiếu xuống mặt đất (bà vẽ cao hơn BA_BAY_CAO) */
  viTriBa(): { x: number; y: number } {
    return { x: this.mc.ba.x, y: this.mc.ba.y - 10 };
  }

  /** Hệ số nhanh của bà: mỗi lần hồi sinh bay và ném nhanh thêm BA_HOI_TANG */
  heSoBa(): number {
    return BA_HOI_TANG ** this.mc.ba.hoiSinh;
  }

  /** Nhân vật nhìn thấy bà: trên camera, cùng khối đất, trong tầm nhìn cộng BA_SANG (viên ngọc bà cưỡi phát sáng) */
  private baThay(): boolean {
    const v = this.viTriBa();
    return this.nvThay(v.x, v.y - 300, 500, BA_SANG);
  }

  /** Ô (i, j) là ô bà đang bay trên / đang bay tới (khi bà chưa bị hạ hẳn): người, quái không vào, bom không đáp vào được, ngọn lửa trên ô này trúng bà */
  private oBa(i: number, j: number): boolean {
    if (!this.baSong) return false;
    const ba = this.mc.ba;
    if (i === ba.ti && j === ba.tj) return true;
    const o = oCua(ba.x, ba.y);
    return i === o.i && j === o.j;
  }

  /** Khung sprite hiện tại của bà: 0 ngồi · 1 giơ bom · 2 nâng bom · 3 ném */
  khungBa(): number {
    const pha = this.mc.ba.pha;
    return pha < 0 ? 0 : pha < BA_PHA[0]! ? 1 : pha < BA_PHA[1]! ? 2 : 3;
  }

  /** Bom lửa / nước b của bà (đã chạm đất): có người chơi nằm trong tầm tia hiện tại (gạch / hang / thùng chặn tia) thì bà kích nổ */
  private mcBomTrung(b: BomMc): boolean {
    const tam = this.tamBom(b);
    return this.nguoi.some((n, p) => {
      if (n.vang || n.het || !this.oMeCung(p)) return false;
      const o = oCua(n.x, n.y);
      if (o.i !== b.i && o.j !== b.j) return false;
      const d = Math.abs(o.i - b.i) + Math.abs(o.j - b.j);
      if (d > tam) return false;
      const hi = Math.sign(o.i - b.i), hj = Math.sign(o.j - b.j);
      for (let k = 1; k < d; k++) if (oCung(oMc(b.i + hi * k, b.j + hj * k))) return false;
      return true;
    });
  }

  /** Ô (i, j) sắp dính bom của người chơi (bom đã chạm đất: lửa / nước dọc hàng / cột tới BOM_TAM_MAX ô, bom nổ vùng 5 × 5): bà né */
  private mcNguyBa(i: number, j: number): boolean {
    for (const b of this.mc.bom) {
      if (b.p < 0 || b.t < bayBom(b)) continue;
      if (b.loai === 'no') { if (Math.max(Math.abs(i - b.i), Math.abs(j - b.j)) <= BOM_NO_BK) return true; continue; }
      if (i !== b.i && j !== b.j) continue;
      const d = Math.abs(i - b.i) + Math.abs(j - b.j);
      if (d > BOM_TAM_MAX) continue;
      const hi = Math.sign(i - b.i), hj = Math.sign(j - b.j);
      let chan = false;
      for (let k = 1; k < d; k++) if (oCung(oMc(b.i + hi * k, b.j + hj * k))) { chan = true; break; }
      if (!chan) return true;
    }
    return false;
  }

  /** Bà bay vào được ô (i, j): bay xuyên thùng gỗ / ô bí ẩn (và bom), không xuyên gạch / hang; không vào ô có người / quái */
  private baDiDuoc(i: number, j: number): boolean {
    if (i < 0 || j < 0 || i >= MC_COT || j >= MC_HANG) return false;
    const c = oMc(i, j);
    return c !== '#' && c !== 'H' && !this.mcChiem(i, j);
  }

  /** Ngọn lửa / nước / nổ của người chơi trên ô bà: lửa / nước trừ 1, bom nổ trừ 2; hết máu thì ngã, còn lượt thì hồi sinh tại chỗ
   *  (nhanh thêm BA_HOI_TANG), hết lượt thì bị hạ hẳn, viên ngọc 4 sao rơi xuống ô đó */
  private mcTrungBa(f: LuaMc): void {
    const ba = this.mc.ba;
    if (ba.hp <= 0) return;
    const v = this.viTriBa();
    const mat = f.loai === 'no' ? 2 : 1;
    ba.hp = Math.max(0, ba.hp - mat);
    ba.trung = 0.4;
    this.chu.push({ id: this.id++, x: v.x, y: v.y - 560, text: `-${mat} ❤`, mau: '#ff6b6b', t: 0 });
    if (ba.hp > 0) return;
    ba.tChet = 0;
    ba.pha = -1;
    for (const [dx, dy] of [[0, -200], [-120, -400], [120, -320]] as const) this.vet.push({ id: this.id++, x: v.x + dx, y: v.y + dy, t: 0, loai: 'chay', co: 1.6 });
    this.rungMan(0.4, 14);
    this.am.phat('meChet');
    if (!this.nguoi[f.p]!.vang) this.congDiem(f.p, BA_DIEM, v.x, v.y - 800, `🧙 +${BA_DIEM}`);
    const con = BA_HOI_SINH - ba.hoiSinh;
    if (con > 0) {
      // Còn lượt: nằm chờ hồi sinh tại chỗ (vẫn giữ ngọc)
      ba.hoi = BA_HOI_T;
      this.chu.push({ id: this.id++, x: v.x, y: v.y - 700, text: `💥 BÀ PHÙ THUỶ NGÃ! CÒN ${con} LẦN HỒI SINH`, mau: '#ffd23f', t: 0 });
      return;
    }
    ba.chet = true;
    // Viên ngọc 4 sao rơi xuống ô bà bị hạ
    const o = oCua(ba.x, ba.y), t = tamO(o.i, o.j);
    // Bà bị hạ khi đang bay trên thùng / ô bí ẩn: ô đó vỡ luôn để nhặt được ngọc
    const c = oMc(o.i, o.j);
    if (c === 'w' || c === '?') this.mcPha(o.i, o.j);
    const ng = this.vatPham.find((x) => x.loai === 'ngoc' && x.sao === MC_NGOC_SAO);
    if (ng) { ng.x = t.x; ng.y = t.y + 60; }
    this.chu.push({ id: this.id++, x: v.x, y: v.y - 700, text: '💥 BÀ PHÙ THUỶ ĐÃ BỊ HẠ! NHẶT NGỌC 4 SAO!', mau: '#ffd23f', t: 0 });
    this.nguoi.forEach((_, q) => this.chuongLenTroi(q));
  }

  /** Mỗi khung (khi có người ở mê cung): bay theo ô (xuyên thùng, không xuyên gạch) đuổi người gần nhất tới khi cách ≤ BA_GAN ô, né bom người chơi;
   *  nhìn thấy người trong BA_TAM ô thì dừng lại giơ bom → nâng bom → ném vào ô người đó (1 trong 3 loại bom như người chơi) */
  private mcBa(dt: number): void {
    const ba = this.mc.ba;
    if (ba.chet) { ba.tChet += dt; return; }
    ba.trung = Math.max(0, ba.trung - dt);
    const nhanh = this.heSoBa();
    if (ba.hp <= 0) {
      ba.tChet += dt;
      ba.hoi -= dt;
      if (ba.hoi > 0) return;
      ba.hoiSinh++;
      ba.hp = BA_HP;
      ba.nem = 1;
      const v = this.viTriBa();
      this.vet.push({ id: this.id++, x: v.x, y: v.y - 300, t: 0, loai: 'chay', co: 1.8 });
      this.rungMan(0.3, 10);
      this.chu.push({ id: this.id++, x: v.x, y: v.y - 700, text: `🧙 BÀ PHÙ THUỶ HỒI SINH! (${ba.hoiSinh}/${BA_HOI_SINH}) · BAY & NÉM NHANH x${(BA_HOI_TANG ** ba.hoiSinh).toFixed(2).replace(/\.?0+$/, '')}`, mau: '#c9a2ff', t: 0 });
      return;
    }
    const v = this.viTriBa();
    // Người chơi gần nhất trong mê cung (không ẩn / gục), tính theo số ô
    let muc: NguoiChoi | null = null;
    let gan = Infinity;
    for (const n of this.nguoi) {
      if (n.vang || this.khuat(n) || !trongMeCung(n.x, n.y)) continue;
      const o = oCua(n.x, n.y);
      const d = Math.abs(o.i - ba.ti) + Math.abs(o.j - ba.tj);
      if (d < gan) { gan = d; muc = n; }
    }
    // Sẵn sàng ném (chỉ ra chiêu khi nhân vật nhìn thấy bà, người trong BA_TAM ô): tới tâm ô thì dừng lại ném
    if (ba.pha < 0) ba.nem -= dt;
    const nemDuoc = ba.pha < 0 && ba.nem <= 0 && !!muc && gan <= BA_TAM && this.baThay();
    // Bay: tới tâm ô đang bay tới rồi chọn ô kế (né ô sắp dính bom; đuổi người khi xa hơn BA_GAN ô); đang ném thì đứng yên
    if (ba.dang || ba.pha < 0) {
      let con = BA_TOC * nhanh * dt;
      for (let g = 0; g < 3 && con > 0; g++) {
        if (!ba.dang) {
          if (nemDuoc && !this.mcNguyBa(ba.ti, ba.tj)) break;
          const HUONG = [[1, 0], [-1, 0], [0, 1], [0, -1]] as const;
          const mo = [0, 1, 2, 3].filter((h) => this.baDiDuoc(ba.ti + HUONG[h]![0], ba.tj + HUONG[h]![1]));
          let h = -1;
          if (this.mcNguyBa(ba.ti, ba.tj)) {
            const an = mo.filter((x) => !this.mcNguyBa(ba.ti + HUONG[x]![0], ba.tj + HUONG[x]![1]));
            const ds = an.length ? an : mo;
            if (ds.length) h = ds[Math.floor(Math.random() * ds.length)]!;
          } else if (muc && gan > BA_GAN) {
            const o = oCua(muc.x, muc.y);
            const buoc = this.baDuong(ba.ti, ba.tj, o.i, o.j);
            if (buoc >= 0 && mo.includes(buoc) && !this.mcNguyBa(ba.ti + HUONG[buoc]![0], ba.tj + HUONG[buoc]![1])) h = buoc;
          }
          if (h < 0) break;
          ba.huong = h;
          if (HUONG[h]![0]) ba.lat = HUONG[h]![0] < 0;
          ba.ti += HUONG[h]![0];
          ba.tj += HUONG[h]![1];
          ba.dang = true;
        }
        const t = tamO(ba.ti, ba.tj);
        const dx = t.x - ba.x, dy = t.y - ba.y, d = Math.abs(dx) + Math.abs(dy);
        if (d <= con) { ba.x = t.x; ba.y = t.y; con -= d; ba.dang = false; }
        else { ba.x += Math.sign(dx) * con; ba.y += Math.sign(dy) * con; con = 0; }
      }
    }
    if (ba.pha < 0) {
      if (!nemDuoc || ba.dang || !muc) return;
      ba.pha = 0;
      ba.loai = LOAI_BOM[Math.floor(Math.random() * LOAI_BOM.length)]!;
      ba.lat = muc.x < v.x;
      return;
    }
    const truoc = ba.pha;
    ba.pha += dt * nhanh;
    if (muc) ba.lat = muc.x < v.x;
    // Vừa sang khung ném: bom rời tay, bay tới ô người chơi (ô chắn / đã có bom thì thôi)
    if (truoc < BA_PHA[1]! && ba.pha >= BA_PHA[1]! && muc) {
      const o = oCua(muc.x, muc.y);
      if (!oCung(oMc(o.i, o.j)) && !this.mc.bom.some((b) => b.i === o.i && b.j === o.j) && !this.oBa(o.i, o.j)) {
        const tay = BA_TAY[3]!;
        this.mc.bom.push({ id: this.id++, p: -1, loai: ba.loai, i: o.i, j: o.j, x0: v.x + tay[0] * BA_TO * (ba.lat ? -1 : 1), y0: v.y - BA_BAY_CAO + tay[1] * BA_TO, t: 0, bay: BA_BOM_BAY });
        this.am.phat('da');
      }
    }
    if (ba.pha >= BA_PHA[2]!) { ba.pha = -1; ba.nem = BA_NEM_CACH / nhanh; }
  }

  /** Hướng bước đầu (0 phải · 1 trái · 2 xuống · 3 lên) trên đường bay ngắn nhất của bà từ ô (ai, aj) tới cạnh ô (bi, bj) (BFS, xuyên thùng); -1 = không có */
  private baDuong(ai: number, aj: number, bi: number, bj: number): number {
    const HUONG = [[1, 0], [-1, 0], [0, 1], [0, -1]] as const;
    const dau = new Map<number, number>();
    const k0 = aj * MC_COT + ai;
    dau.set(k0, -1);
    const hang = [k0];
    for (let h = 0; h < hang.length; h++) {
      const k = hang[h]!, i = k % MC_COT, j = (k - i) / MC_COT;
      if (Math.abs(i - bi) + Math.abs(j - bj) <= BA_GAN && k !== k0) return dau.get(k)!;
      for (let x = 0; x < 4; x++) {
        const ni = i + HUONG[x]![0], nj = j + HUONG[x]![1], nk = nj * MC_COT + ni;
        if (dau.has(nk) || !this.baDiDuoc(ni, nj)) continue;
        dau.set(nk, k === k0 ? x : dau.get(k)!);
        hang.push(nk);
      }
    }
    return -1;
  }

  /** Quái mê cung (Số 19, Khỉ đột, Quỷ canh cổng): đi từng ô (không qua ô chắn / bom đã chạm đất; quỷ bay qua thùng / ô bí ẩn),
   *  đánh hơi người thì hay đi về phía đó; đứng thẳng hàng / cột với người trong tầm thì vận chiêu rồi bắn dọc hàng / cột; chạm thì đánh */
  private mcQuai(q: QuaiMc, dt: number): void {
    const dl = QUAI_DL[q.loai];
    q.ph += dt * 6;
    q.choCan = Math.max(0, q.choCan - dt);
    q.hoiChieu = Math.max(0, q.hoiChieu - dt);
    q.danh = Math.max(0, q.danh - dt);
    q.ban = Math.max(0, q.ban - dt);
    if (q.ra > 0) { q.ra -= dt; return; }
    if (q.dau > 0) { q.dau -= dt; return; }
    if (q.nap > 0) {
      q.nap -= dt;
      if (q.nap <= 0) this.mcQuaiBan(q);
      return;
    }
    if (q.ban > 0) return;
    const HUONG = [[1, 0], [-1, 0], [0, 1], [0, -1]] as const;
    const diDuoc = (i: number, j: number) => {
      return !oCung(oMc(i, j)) && !oTrongVao(i, j) && !this.oBa(i, j) && !this.mcChiem(i, j, -1, q) && !this.mc.bom.some((b) => b.i === i && b.j === j && b.t >= bayBom(b));
    };
    // Người trong mê cung (không ẩn / gục) gần nhất theo ô
    let muc: { i: number; j: number } | null = null;
    let gan = dl.ngui + 1;
    for (const n of this.nguoi) {
      if (n.vang || this.khuat(n) || !trongMeCung(n.x, n.y)) continue;
      const o = oCua(n.x, n.y);
      const d = Math.abs(o.i - q.ti) + Math.abs(o.j - q.tj);
      if (d < gan) { gan = d; muc = o; }
    }
    // Đứng ở tâm ô, thẳng hàng / cột với người trong tầm, đường không bị chắn: vận chiêu
    const thuChieu = (): boolean => {
      if (q.hoiChieu > 0 || q.danh > 0) return false;
      for (const n of this.nguoi) {
        if (n.vang || this.khuat(n) || !trongMeCung(n.x, n.y)) continue;
        const o = oCua(n.x, n.y);
        if (o.i !== q.ti && o.j !== q.tj) continue;
        const d = Math.abs(o.i - q.ti) + Math.abs(o.j - q.tj);
        if (d < 1 || d > dl.tam) continue;
        const hi = Math.sign(o.i - q.ti), hj = Math.sign(o.j - q.tj);
        let thong = true;
        for (let k = 1; k < d; k++) if (oCung(oMc(q.ti + hi * k, q.tj + hj * k))) { thong = false; break; }
        if (!thong) continue;
        // Các ô chiêu bay qua: tới hết tầm hoặc tới trước ô chắn
        q.tia = [];
        for (let k = 1; k <= dl.tam; k++) {
          const i = q.ti + hi * k, j = q.tj + hj * k;
          if (oCung(oMc(i, j))) break;
          q.tia.push({ i, j });
        }
        if (hi) q.lat = hi < 0;
        q.nap = dl.nap;
        return true;
      }
      return false;
    };
    if (!q.dang && thuChieu()) return;
    let con = dl.toc * dt;
    for (let g = 0; g < 4 && con > 0; g++) {
      if (!q.dang) {
        const mo = [0, 1, 2, 3].filter((h) => diDuoc(q.ti + HUONG[h]![0], q.tj + HUONG[h]![1]));
        if (!mo.length) break;
        let h: number;
        if (muc && Math.random() < dl.duoi) {
          h = mo.reduce((a, b) => {
            const da = Math.abs(q.ti + HUONG[a]![0] - muc!.i) + Math.abs(q.tj + HUONG[a]![1] - muc!.j);
            const db = Math.abs(q.ti + HUONG[b]![0] - muc!.i) + Math.abs(q.tj + HUONG[b]![1] - muc!.j);
            return db < da ? b : a;
          });
        } else if (mo.includes(q.huong) && Math.random() < 0.7) h = q.huong;
        else {
          const khongLui = mo.filter((x) => x !== (q.huong ^ 1));
          const ds = khongLui.length ? khongLui : mo;
          h = ds[Math.floor(Math.random() * ds.length)]!;
        }
        q.huong = h;
        if (HUONG[h]![0]) q.lat = HUONG[h]![0] < 0;
        q.ti += HUONG[h]![0];
        q.tj += HUONG[h]![1];
        q.dang = true;
      }
      const t = tamO(q.ti, q.tj);
      const dx = t.x - q.x, dy = t.y - q.y, d = Math.abs(dx) + Math.abs(dy);
      if (d <= con) { q.x = t.x; q.y = t.y; con -= d; q.dang = false; if (thuChieu()) return; }
      else { q.x += Math.sign(dx) * con; q.y += Math.sign(dy) * con; con = 0; }
    }
    if (q.choCan > 0) return;
    for (const n of this.nguoi) {
      if (n.vang || this.khuat(n) || !trongMeCung(n.x, n.y) || hyp(n.x - q.x, n.y - q.y) >= QUAI_CHAM) continue;
      q.choCan = QUAI_HOI;
      q.danh = 0.35;
      if (n.x !== q.x) q.lat = n.x < q.x;
      this.nhanSatThuong(n, QUAI_SAT);
      break;
    }
  }

  /** Hết vận chiêu: Số 19 / Khỉ đột bắn tia dọc các ô đã chọn (ai đứng trên đó trúng, khiên đỡ); quỷ phun cầu lửa: các ô thành lửa (bốc cháy như bom lửa) */
  private mcQuaiBan(q: QuaiMc): void {
    const dl = QUAI_DL[q.loai];
    q.nap = 0;
    q.ban = QUAI_TIA_T;
    q.hoiChieu = dl.hoi;
    const cuoi = q.tia[q.tia.length - 1];
    if (!cuoi) return;
    const t1 = tamO(cuoi.i, cuoi.j);
    const hi = Math.sign(cuoi.i - q.ti), hj = Math.sign(cuoi.j - q.tj);
    const nua = 180;
    this.mc.tia.push({ loai: q.loai, x0: q.x + hi * 70, y0: q.y, x1: t1.x + hi * nua, y1: t1.y + hj * nua, t: 0 });
    if (q.loai === 'quy') {
      for (const o of q.tia) this.mc.lua.push({ i: o.i, j: o.j, loai: 'lua', con: 0.6, p: -2, da: [] });
      this.am.phat('chuong');
      return;
    }
    this.am.phat('chuong');
    this.rungMan(0.12, q.loai === 'khi' ? 8 : 5);
    this.nguoi.forEach((n, p) => {
      if (n.vang || this.khuat(n) || this.trongMb(p)) return;
      const o = oCua(n.x, n.y);
      if (!q.tia.some((x) => x.i === o.i && x.j === o.j)) return;
      this.nhanSatThuong(n, QUAI_TIA_SAT, true, q.loai === 'khi' ? '#c77dff' : '#ff4d4d');
    });
  }

  // ─── Khởi tạo ───

  private taoNguoiChoi(): NguoiChoi[] {
    const dh = DOI_HINH[this.cheNguoi] ?? DOI_HINH.ca2;
    const mot = dh[0] === null || dh[1] === null;
    return [0, 1].map((p) => {
      const vang = dh[p] === null;
      const ki = dh[p] ?? p;
      return {
        vang, ki,
        ten: NHAN_VAT[ki]!.ten, mau: MAU_NV[ki]!,
        hp: vang ? 0 : HP_KHOI_DAU, het: vang, diem: 0, combo: 0, hoiChieu: 0, chumDen: 0, banTrung: 0, banTruot: 0,
        x: MAP / 2 + (mot ? 0 : p === 0 ? -160 : 160), y: MAP / 2 + 120, dich: null, dangDi: false,
        nv: this.taoNhanVat(p, ki), bay: null, mana: MANA_BAN_DAU, bayKhoa: 0, thuongLuc: -999, hoiSoc: 0,
        nhin: { x: p === 0 ? 1 : -1, y: 0 }, cuaCan: false, may: { dang: false, con: 0, hoi: 0 }, suc: 1, satDau: 0,
      };
    });
  }

  private taoNhanVat(p: number, ki: number): NhanVat {
    const nv = new NhanVat(NHAN_VAT[ki]!);
    nv.lat = p === 0;
    return nv;
  }

  private docKyLuc(): void {
    try {
      this.kyLuc = Number(localStorage.getItem(KHOA_KY_LUC)) || 0;
    } catch {
      this.kyLuc = 0;
    }
  }
}
