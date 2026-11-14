import type { KhungSprite } from './sprite';
import { VeCanvas } from './ve-canvas';
import { AmThanh } from './am-thanh';
import { NhanVat } from './nhan-vat-sprite';
import { MABU, ZINBU } from './nhan-vat-du-lieu';
import { chuanBiSaMac, daoCua, doSau, trongVuon, veDat, SO_DAO, TG, XUAT_PHAT, type LoaiBanDo } from './ban-do';
import { SO_CAP, cellK, CELL_TU, CELL_TU_TAM, leCell, CELL_BK, CELL_KHUNG, CELL_CHAM, CELL_CHET_T, CELL_DANH_T, CELL_DIEM, CELL_HOI, CELL_HP, CELL_NGUI, CELL_NHAY_T, CELL_SAT, CELL_TEN, CELL_TO, CELL_TOC, CELL_XICH, SP_CELL, taoCell, type Cell } from './cell';
import { taoTiec, CHUONG_LOAI, TIEC_BIEN, TIEC_AURA, TIEC_PHONG, TIEC_KHUNG, SP_CELL_TIEC, TIEC_TOC, viTriVong, TIEC_CHU_KY, TIEC_DI, TIEC_CHUONG_T, TIEC_NGUI, type ChuongTiec, type Tiec } from './tiec';
import { GA_DEN, GA_DO, GA_TRANG, GA_TUONG, KHUNG_BAY, KHUNG_CHAY, KHUNG_CHET, KHUNG_DUNG } from './ga-du-lieu';

export type ManChoi = 'start' | 'play' | 'pause' | 'over';
// Chế độ điều khiển chọn ở màn bắt đầu: chuột (+ Tab đổi nhân vật) hoặc tay cầm
export type CheDo = 'chuot' | 'tayCam';
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
interface Dan { id: number; p: number; /** nhóm đòn đã ra (0 Đấm · 1 Đá · 2 Chiêu đặc biệt) */ nhom?: number; /** chưởng xuyên: id các gà đã trúng trên đường bay */ da?: number[]; x0: number; y0: number; x1: number; y1: number; t: number; T: number; phu: boolean; to: boolean; sat: number; soc?: boolean; troi?: boolean; /** đòn ăn: gà con trúng thì hoá socola (hong = socola hồng của Mabu) và bị kéo về nhân vật ăn */ an?: 'soc' | 'hong'; }
/** Quả táo rơi từ cây đổ: đỏ = hồi máu, xanh = hồi mana */
/** socola = gà con bị biến thành socola: nhân vật ăn +SOCOLA_NV_MAU máu +SOCOLA_NV_MANA mana, gà ăn hồi SOCOLA_GA_TI_LE máu tối đa */
export interface VatPham { id: number; x: number; y: number; t: number; loai?: 'do' | 'xanh' | 'socola' | 'ngoc'; /** socola: số máu = số mana nhân vật nhận khi ăn (thiếu thì SOCOLA_NV_MAU / SOCOLA_NV_MANA) */ luong?: number; /** socola: máu tối đa của con gà đã chết thành socola; gà ăn hồi SOCOLA_GA_TI_LE × số này */ hpGa?: number; }
interface Chu { id: number; x: number; y: number; text: string; mau: string; t: number; }
interface Long { id: number; x: number; y: number; vx: number; vy: number; xoay: number; vxoay: number; t: number; mau: string; }
/** chay = cháy nổ (lửa + tia lửa); co = hệ số kích thước */
interface Vet { id: number; x: number; y: number; t: number; loai: 'bui' | 'no' | 'chay'; co?: number; }
interface ChuyenBay { x0: number; y0: number; x1: number; y1: number; t: number; T: number; }
export interface NguoiChoi {
  ten: string; mau: string; diem: number; combo: number; tamX: number; tamY: number;
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
  nhin: { x: number; y: number }; nham: { x: number; y: number } | null; ngam: { x: number; y: number } | null; cuaCan: boolean;
  may: { dang: boolean; con: number; hoi: number };
  /** Sức mạnh: hệ số nhân sát thương mọi đòn đánh gà (mặc định 1; ăn gà mẹ socola được cộng thêm) */
  suc: number;
}
type VatXep =
  | { loai: 'ga'; y: number; ga: Ga }
  | { loai: 'nv'; y: number; p: number }
  | { loai: 'td'; y: number; td: TrangTri }
  | { loai: 'cuu'; y: number; cu: Cuu }
  | { loai: 'cau'; y: number; cau: CauTron }
  | { loai: 'mb'; y: number }
  | { loai: 'cell'; y: number; ce: Cell }
  | { loai: 'banh'; y: number; tc: Tiec };

/** Quả cầu trốn: san = sẵn sàng · trong = có nhân vật p đang trốn · vo = đang vỡ ra (hoạt ảnh) · moc = đã vỡ, chờ CAU_MOC giây mọc quả mới. t = số giây của pha hiện tại */
/** cua = chủ quả cầu (0 Mabu · 1 Zinbu): chỉ đúng người đó chui vào được, quả cầu có avatar của người đó */
export interface CauTron { x: number; y: number; pha: 'san' | 'trong' | 'vo' | 'moc'; p: number; t: number; cua: number; }
/** Tự hạ độ phân giải: dưới FPS_THAP thì giảm DPR_BUOC mỗi lần, không thấp hơn DPR_SAN */
const FPS_THAP = 50;
const DPR_BUOC = 0.25;
const DPR_SAN = 1;
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
export interface MbHinh { x: number; y: number; nang: number; khung: number; a: number; to: number; lat: boolean; rung: number; bong: number; nhan: string | null; }
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

/** Cứu đồng đội: nhân vật còn sống phủ mây (Mabu cứu Zinbu) hoặc socola (Zinbu cứu Mabu) lên người ngã; sống sót CUU_THOI_GIAN giây (mây / socola bám theo, nối bằng dây) thì người ngã hồi sinh */
export interface Cuu { p: number; kieu: 'may' | 'socola'; x: number; y: number; cho: number; t: number; tach: number; }

/** Vật trang trí nền cỏ (cây, bụi, đá): chỉ để đẹp, không cản đường. loai là chỉ số trong TRANG_TRI_SPRITE (ve-canvas.ts) */
export interface TrangTri { x: number; y: number; loai: number; lat: boolean; /** thời điểm (`t` của game) bị đánh đổ; chỉ cây (loai 0), chưa đổ thì không có */ doLuc?: number; /** hướng đổ: 1 = sang phải, -1 = sang trái */ huongDo?: number; /** cây đã rơi táo thì biến mất, chỉ còn quả táo */ mat?: boolean; /** cây to: đổ thì chắc chắn rơi CAY_TO_MAU táo đỏ + CAY_TO_MANA táo xanh */ to?: boolean; /** trang trí của đảo cát (ảnh sa mạc) */ sa?: boolean }
/** Bán kính (quanh gốc cây) mà đòn / chưởng quét qua thì cây đổ */
// Cây đổ xong CAY_MOC_LAI giây thì mọc lại. Cây to (to gấp CAY_TO_HE_SO) đổ thì chắc chắn rơi CAY_TO_MAU táo đỏ + CAY_TO_MANA táo xanh
const CAY_MOC_LAI = 10;
const CAY_TO_HE_SO = 1.8;
const CAY_TO_MAU = 2;
const CAY_TO_MANA = 2;
const CAY_DO_KINH = 90;
/** Chiều cao thân cây tính từ gốc: đòn trúng trong khoảng này phía trên gốc là trúng cây */
const CAY_DO_CAO = 220;


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
  /** Vườn gà ngủ / tổ trứng chờ vua gà (thiếu = vườn đang hoạt động bình thường) */
  vuon?: { ngu: boolean; to: { x: number; y: number } | null; toDe: number; daNoPhu: number; choVua: boolean };
  /** Bản đồ của ván (thiếu = ván lưu cũ, đồng cỏ) */
  banDo?: LoaiBanDo;
  /** Cây đã đổ: [chỉ số trong trangTri, thời điểm đổ, hướng đổ] */
  cayDo?: [number, number, number, number?][];
  nguoi: (Omit<NguoiChoi, 'nv' | 'nham' | 'ngam' | 'cuaCan' | 'dich' | 'bay'> & { nhom: number; lat: boolean; huong: 'ngang' | 'len' | 'xuong' })[];
}

// Chiều rộng khung nhìn (đơn vị khung) thay đổi theo tỉ lệ cửa sổ để map tràn hai bên; H cố định. Phía trên map có thanh đen cao BAR chứa các chiêu của gà mẹ (toạ độ y âm).
const W_MAC_DINH = 1600;
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
// Sát thương nhân vật gây ra: [Mabu, Zinbu] theo nhóm đòn 0 Đấm · 1 Đá · 2 Chiêu đặc biệt; mây (riêng Mabu)
const SAT_THUONG = [[50, 50], [70, 100], [130, 190]];
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
const HP_VUA = 600;
const NGOC_BAN_KINH = 110;
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
/** Gà mẹ đang hoá socola: nhân vật chạm vào (trong bán kính này × độ to) là ăn, nhận ĂN_TUONG_TI_LE máu hiện có và sức mạnh của nó */
const AN_TUONG_BAN_KINH = 150;
const AN_TUONG_TI_LE = 0.3;
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
// Tầm nhìn (sương mù kiểu Dota) = 1,5 × tầm xa nhất của đấm xa / đá xa. Gà ngoài tầm nhìn thì ẩn; nhân vật và chưởng đang bay đều mang theo tầm nhìn.
const TAM_DANH_XA = Math.max(TAM_DAM_XA, TAM_DA_XA);
const TAM_NHIN = TAM_DANH_XA * 1.5;
// Gà tướng nhìn xa gấp 3 lần nhân vật: thấy nhân vật trong tầm này thì đuổi đánh, không thì đi loanh quanh
const TAM_NHIN_TUONG = 1500;
// Tầm gà con phát hiện và lao vào nhân vật = tầm đánh xa nhất (không đổi theo tầm nhìn)
const TAM_LAO = TAM_DANH_XA;
// Gà con ngửi thấy nhân vật trong TAM_NGUI_NV thì đi về phía nhân vật (xu hướng đuổi theo); ngửi thấy táo đỏ trong TAM_NGUI_TAO thì đi tới ăn
const TAM_NGUI_NV = 800;
const TAM_NGUI_TAO = 500;
// Giới hạn số gà (hiệu năng): đủ ME_PHU_TOI_DA tướng gà thì trứng đỏ không nở thêm tướng gà; đủ GA_CON_TOI_DA gà con thì không nở / gọi thêm gà con.
// Khi đã đủ, loại gà đó bỏ giới hạn tầm ngửi: đi ăn táo đỏ / socola và tìm Mabu / Zinbu (đang ở trong vườn gà) khắp vườn (dayCon / dayPhu).
const ME_PHU_TOI_DA = 40;
const GA_CON_TOI_DA = 120;
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
// Nhấn Space SPACE_SO_LAN lần liên tiếp (cách nhau tối đa SPACE_CACH giây) thì đổi chế độ chuột <-> tay cầm
const SPACE_SO_LAN = 5;
const SPACE_CACH = 1;

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
      if (Math.hypot(x - MAP / 2, y - MAP / 2) < 450) continue;
      const k = r();
      const loai = k < 0.35 ? 0 : k < 0.65 ? 1 : k < 0.85 ? 2 : 3;
      const lat = r() < 0.5;
      // Để trống quanh 2 quả cầu trốn (bỏ sau khi đã rút số ngẫu nhiên để phần còn lại của map không đổi)
      // Không mọc sát / trong tường gạch quanh map
      if (Math.min(x, y, MAP - x, MAP - y) < TUONG + 150) continue;
      if (CAU_VI_TRI.some(([dx, dy]) => Math.hypot(x - MAP / 2 - dx, y - MAP / 2 - dy) < 500)) continue;
      // Một phần cây là cây to (chọn theo toạ độ, không dùng r() để map không đổi)
      kq.push({ x, y, loai, lat, to: loai === 0 && Math.floor(x * 7 + y * 13) % 4 === 0 });
    }
  }
  return kq;
}

/** Trang trí trên các đảo cát (đánh dấu `sa`): chỉ mọc trên cát cách bờ đủ xa; mỗi đảo chỉ 1–2 cây (đảo chẵn 2, lẻ 1), cây thừa đổi thành bụi */
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
  for (let gx = TG.x0; gx < TG.x1; gx += O) {
    for (let gy = TG.y0; gy < TG.y1; gy += O) {
      if (r() > 0.55) continue;
      const x = gx + r() * O;
      const y = gy + 60 + r() * (O - 60);
      const k = r();
      let loai = k < 0.05 ? 0 : 1 + Math.floor(r() * (SO_TRANG_TRI_SA - 1));
      const lat = r() < 0.5;
      if (trongVuon(x, y) || doSau(x, y) < (loai === 0 ? 260 : 120)) continue;
      // Để trống quanh chỗ xuất phát
      if (Math.hypot(x - XUAT_PHAT.x, y - XUAT_PHAT.y) < 500) continue;
      if (loai === 0) {
        const d = daoCua(x, y);
        if (soCay[d]! >= (d % 2 ? 1 : 2)) loai = 1;
        else soCay[d]!++;
      }
      kq.push({ x, y, loai, lat, sa: true, to: loai === 0 && soCay[daoCua(x, y)] === 1 });
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
const satGa = (g: Ga) => SAT_GA[g.loai] * (g.suc ?? 1);
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
      r.cx ||= d.cx;
      r.cy ||= d.cy;
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
  /** Thẻ đang chọn ở màn chọn chế độ (0 Mabu · 1 Zinbu · 2 hai người), chữ thập / cần trái trái-phải để chọn */
  menuChon = 2;
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
  /** Tiệc sinh nhật Cell: bánh ở giữa vòng Cell; chưởng Cell bắn vào bánh (chỉ để đẹp, không lưu); banhView = bánh nằm trong khung nhìn */
  tiec: Tiec[] = [];
  chuongTiec: ChuongTiec[] = [];
  chuongTiecView: ChuongTiec[] = [];
  banhView: Tiec[] = [];
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
  thayDao = true;
  // Gà mẹ GỐC còn sống (không lọc theo khung nhìn): avatar, số mạng, mũi tên chỉ hướng
  tuongSong: Ga | null = null;
  /** Ngọc rồng đã nhặt (số sao, theo thứ tự nhặt) xếp ở thanh đen trên, bên trái; ngocBay = viên đang bay từ chỗ nhặt lên thanh đen */
  ngocNhat: number[] = [];
  ngocBay: { x: number; y: number; t: number; slot: number }[] = [];
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
  readonly SP_CELL = SP_CELL;
  readonly SP_CELL_TIEC = SP_CELL_TIEC;
  cauView: CauTron[] = [];
  // Máy bay trong vườn gà (mayBay) và hình / số giây hồi phục để vẽ (chỉ lấy khi nằm trong khung nhìn)
  mayBay: MayBay = taoMayBay(MAP / 2, MAP / 2);
  readonly SP_MB = SP_MB;
  mbView: MbHinh | null = null;
  mbDemView: { x: number; y: number; con: number } | null = null;
  // Giây hit-stop còn lại và biên độ rung màn hình
  private dungHinh = 0;
  private rungBien = RUNG_BIEN;
  // Vệt đỏ chỉ hướng lúc gà mẹ báo hiệu Lao / Bay (chỉ khi trong khung nhìn)
  vachView: { x1: number; y1: number; x2: number; y2: number; a: number; w?: number }[] = [];
  // Lần hồi sinh của gà tướng gần nhất (để bảng vẫn hiện khi chờ hồi sinh)
  lanTuong = 0;
  private soLanTuong = 0;
  // Vườn gà ngủ khi máy bay bay ra ngoài vườn (không gà, không trứng); khi máy bay về thì tổ trứng ẩn đẻ / ấp đủ ME_PHU_HIEN_VUA gà mẹ phụ rồi vua gà mới xuất hiện
  private vuonNgu = false;
  private toTrung: { x: number; y: number } | null = null;
  private toDe = 0;
  private daNoPhu = 0;
  private choVua = false;
  // Số gà mẹ phụ đã sinh trong ván (quyết định kiểu chuyên và màu của con kế tiếp)
  private demPhu = 0;
  /** Dấu X đỏ đếm ngược của trứng đỏ (cuối mũi tên chỉ hướng); chỉ lấy khi nằm trong khung nhìn */
  xTrungView: { x: number; y: number; con: number }[] = [];
  nhamView: { x: number; y: number; mau: string }[] = [];
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
  // Chế độ điều khiển: mặc định tay cầm mỗi lần mở game (không nhớ lại); Space ×5 để đổi
  cheDo: CheDo = 'tayCam';
  private demSpace = 0;
  private spaceLuc = 0;
  // Chế độ chuột: người chơi mà chuột đang điều khiển (Tab để đổi) và chuột đang nằm trên bảng chiêu thức (không phải trên map)
  chuot = 0;
  /** Lựa chọn ở màn bắt đầu (nhớ để Chơi lại giữ nguyên) */
  cheNguoi: 'mabu' | 'zinbu' | 'ca2' = 'ca2';
  trenBang = false;
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
  /** Trần độ phân giải canvas (đơn vị: tỉ lệ điểm ảnh): tự hạ dần khi FPS thấp (máy yếu), không tăng lại để khỏi dao động */
  private dprTran = 2;
  private fpsThap = 0;
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
        this.dpr = Math.min(window.devicePixelRatio || 1, this.dprTran);
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
      this.ve.napTruoc(MABU.atlas, ZINBU.atlas, 'assets/game/map_co.png', 'assets/game/tuong_gach.png', SP_CAU.atlas, SP_NGOC.atlas, SP_MB.atlas, SP_CELL.atlas, SP_CELL_TIEC.atlas, ...CHUONG_LOAI.map((l) => l.atlas));
      for (const sp of [GA_TRANG, GA_DO, GA_DEN]) this.ve.nhuomTruoc(sp.atlas, [MAU_SANG, LOC_SOCOLA, LOC_SOCOLA_HONG]);
      this.ve.nhuomTruoc(GA_TUONG.atlas, [MAU_SANG, LOC_BAO, LOC_DEN, LOC_VANG, LOC_DO, LOC_SOCOLA, ...LOC_PHU]);
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
      // Chế độ chuột: chuột phải chạy / bay, chuột trái ra đòn, bấm vào chiêu ở thanh đen để đổi chiêu, Tab đổi chuột sang nhân vật kia
      nghe(cv, 'pointermove', (e: PointerEvent) => this.diChuot(e));
      nghe(cv, 'pointerdown', (e: PointerEvent) => {
        this.khungEl.focus({ preventScroll: true });
        this.bamChuot(e);
      });
      // Luôn chặn menu chuột phải của trình duyệt (kể cả chế độ tay cầm mặc định): hiện menu sẽ cướp focus, mất điều khiển
      nghe(window, 'contextmenu', (e: Event) => e.preventDefault(), true);
      nghe(window, 'keydown', (e: KeyboardEvent) => this.phimXuong(e), true);
      // Trình duyệt ngừng đọc tay cầm khi tab mất focus: tạm dừng ván để không bị đánh trong lúc không điều khiển được
      nghe(window, 'blur', () => { if (this.cheDo === 'tayCam' && this.man === 'play') this.tamDung(); });

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
    this.chuot = p < 0 ? 0 : p;
    this.tayCam = this.chuot;
  }

  /** Bắt đầu ván: 'mabu' / 'zinbu' = chơi 1 nhân vật, 'ca2' = chơi cả hai */
  batDau(che: 'mabu' | 'zinbu' | 'ca2' = this.cheNguoi): void {
    this.choiLaiChoB = false;
    this.cheNguoi = che;
    banDoHt = this.banDo;
    this.banDoVan = this.banDo;
    if (this.banDo === 'sa') chuanBiSaMac();
    this.trangTri = this.banDo === 'sa' ? [...taoTrangTri(), ...taoTrangTriSa()] : taoTrangTri();
    this.nguoi = this.taoNguoiChoi();
    // Nhân vật xuất phát ở góc vườn gà xa vua gà nhất: chốt chỗ vua gà xuất hiện trước, rồi chọn góc xa nó nhất
    this.viTriVua = { x: ngauNhien(600, MAP - 600), y: ngauNhien(600, MAP - 600) };
    const le = TUONG + 320;
    const goc = [[le, le], [MAP - le, le], [le, MAP - le], [MAP - le, MAP - le]] as const;
    const [gx, gy] = goc.reduce((a, b) => (Math.hypot(b[0] - this.viTriVua!.x, b[1] - this.viTriVua!.y) > Math.hypot(a[0] - this.viTriVua!.x, a[1] - this.viTriVua!.y) ? b : a));
    const vao = gx < MAP / 2 ? 1 : -1;
    const xuong = gy < MAP / 2 ? 1 : -1;
    this.nguoi.forEach((n, p) => { n.x = gx + (this.cheNguoi === 'ca2' ? (p === 0 ? 0 : 170 * vao) : 0); n.y = gy + (this.cheNguoi === 'ca2' ? (p === 0 ? 0 : 60 * xuong) : 0); });
    this.chonNguoiDau();
    // Máy bay đậu trong vườn gà, gần chỗ xuất phát (phía trong vườn)
    this.mayBay = taoMayBay(kep(gx + vao * 700, TUONG + MB_LE, MAP - TUONG - MB_LE), kep(gy + xuong * 380, TUONG + MB_LE, MAP - TUONG - MB_LE));
    this.ga = [];
    this.keoGa = [];
    this.cell = taoCell(() => this.id++);
    this.tiec = taoTiec(this.cell);
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
    this.ngocBay = [];
    this.cuu = [];
    // Quả cầu trốn nằm trong vườn gà (giữa thế giới mở)
    this.cauTron = taoCauTron();
    this.dungHinh = 0;
    this.henTuong = CHO_TUONG_DAU;
    this.soLanTuong = 0;
    this.vuonNgu = false;
    this.toTrung = null;
    this.toDe = 0;
    this.daNoPhu = 0;
    this.choVua = false;
    this.lanTuong = 0;
    this.demPhu = 0;
    this.kyLucMoi = false;
    this.trenBang = false;
    this.capNhatView(0, true);
    this.man = 'play';
  }

  datCheDo(c: CheDo): void {
    if (this.cheDo === c) return;
    this.cheDo = c;
    this.nguoi.forEach((n) => { n.dich = null; n.cuaCan = false; n.ngam = null; });
    this.trenBang = false;
  }

  tamDung(): void {
    if (this.man === 'play') this.man = 'pause';
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
      ga: this.ga, trungDe: this.trungDe, vatPham: this.vatPham, ngocNhat: this.ngocNhat, cuu: this.cuu, cauTron: this.cauTron, cell: this.cell, tiec: this.tiec, mayBay: this.mayBay,
      vuon: { ngu: this.vuonNgu, to: this.toTrung, toDe: this.toDe, daNoPhu: this.daNoPhu, choVua: this.choVua },
      cayDo: this.trangTri.flatMap((c, i) => (c.doLuc === undefined ? [] : [[i, c.doLuc, c.huongDo ?? 1, c.mat ? 1 : 0]])),
      nguoi: this.nguoi.map((n) => {
        const { nv, nham, ngam, cuaCan, dich, bay, ...r } = n;
        void nham; void ngam; void cuaCan; void dich;
        // Đang bay thì coi như đã bay tới nơi
        return { ...r, x: bay ? bay.x1 : n.x, y: bay ? bay.y1 : n.y, nhom: nv.nhom, lat: nv.lat, huong: nv.huong };
      }),
    }));
  }

  /** Nạp lại ván đã lưu và dừng ở màn Tạm dừng để người chơi bấm Tiếp tục */
  khoiPhuc(d: TrangThaiLuu): void {
    if (!d || d.phienBan !== PHIEN_BAN_LUU || !Array.isArray(d.nguoi) || d.nguoi.length !== 2) throw new Error('Dữ liệu lưu không hợp lệ');
    this.banDo = d.banDo === 'sa' ? 'sa' : 'co';
    this.batDau();
    this.tGame = d.tGame; this.t = d.t; this.chamDen = d.chamDen; this.id = d.id;
    this.henTuong = d.henTuong; this.soLanTuong = d.soLanTuong; this.lanTuong = d.lanTuong;
    this.ga = d.ga; this.trungDe = d.trungDe; this.vatPham = d.vatPham; this.ngocNhat = d.ngocNhat ?? []; this.ngocBay = []; this.cuu = d.cuu ?? [];
    this.cauTron = d.cauTron?.length ? d.cauTron.map((q, i) => ({ ...q, cua: q.cua ?? i })) : taoCauTron();
    if (d.vuon) { this.vuonNgu = d.vuon.ngu; this.toTrung = d.vuon.to; this.toDe = d.vuon.toDe; this.daNoPhu = d.vuon.daNoPhu; this.choVua = d.vuon.choVua; }
    if (d.cell?.length) this.cell = d.cell;
    this.tiec = Array.isArray(d.tiec) ? d.tiec : [];
    this.chuongTiec = [];
    for (const c of this.cell) if (!this.tiecCua(c)?.on) c.tiec = false;
    if (d.mayBay) this.mayBay = { ...taoMayBay(d.mayBay.x, d.mayBay.y), ...d.mayBay };
    for (const c of this.trangTri) { delete c.doLuc; delete c.huongDo; delete c.mat; }
    for (const [i, t, h, m] of d.cayDo ?? []) if (this.trangTri[i]) { this.trangTri[i].doLuc = t; this.trangTri[i].huongDo = h; this.trangTri[i].mat = !!m; }
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
    this.cheNguoi = this.nguoi[0].vang ? 'zinbu' : this.nguoi[1].vang ? 'mabu' : 'ca2';
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

  private vongLap = (now: number) => {
    const dt = Math.min(0.05, (now - this.lanCuoi) / 1000);
    // Đếm FPS thật (số khung hình vẽ ra mỗi giây), cập nhật mỗi 0.5 giây
    this.fpsDem++;
    if (now - this.fpsMoc >= 500) {
      this.fps = Math.round((this.fpsDem * 1000) / (now - this.fpsMoc));
      this.fpsDem = 0;
      this.fpsMoc = now;
      // Máy yếu: FPS dưới FPS_THAP 3 lần đo liền (1,5s) khi đang chơi thì hạ độ phân giải canvas một bậc (số điểm ảnh phải vẽ giảm mạnh)
      if (this.man === 'play' && !document.hidden && this.fps < FPS_THAP && this.dpr > DPR_SAN) {
        if (++this.fpsThap >= 3) {
          this.fpsThap = 0;
          this.dprTran = Math.max(DPR_SAN, this.dpr - DPR_BUOC);
          this.datKhung();
        }
      } else this.fpsThap = 0;
    }
    this.lanCuoi = now;
    this.docTayCam();
    if (this.man !== 'pause') {
      this.t += dt;
      if (this.man === 'play') {
        // Hit-stop: đòn mạnh trúng thì game chậm lại một chút
        const dtGame = this.dungHinh > 0 ? dt * DUNG_HE_SO : dt;
        this.dungHinh = Math.max(0, this.dungHinh - dt);
        this.capNhat(dtGame);
      }
      else this.nguoi.forEach((n) => this.capNhatNhanVat(n, dt));
      this.capNhatView(dt);
    }
    this.am.nhacNen(this.man === 'play', this.trenDao);
    if (this.ctx) this.ve.ve(this.ctx, this, this.dpr, this.ctxNen, NEN_TL);
    // Màn chơi chỉ vẽ canvas; phần HTML (màn bắt đầu / tạm dừng / kết thúc, nút) chỉ cập nhật khi cần
    if (this.man !== 'play' || this.manDaVe !== this.man) this.onManPhu();
    this.manDaVe = this.man;
    this.rafId = requestAnimationFrame(this.vongLap);
  };

  private capNhat(dt: number): void {
    this.tGame += dt;
    const k = kep(this.tGame / THOI_GIAN_HOANG_HON, 0, 1);
    this.mauHoangHon = tronMau([255, 220, 140], [255, 110, 60], k);
    this.doHoangHon = k * 0.3;

    const dtE = dt * (this.dangCham ? 0.45 : 1);
    this.rung = Math.max(0, this.rung - dt);
    if (this.rung === 0) this.rungBien = RUNG_BIEN;

    this.dayCon = this.soGaCon >= GA_CON_TOI_DA;
    this.dayPhu = this.soMePhu >= ME_PHU_TOI_DA;
    this.capNhatVuon(dtE);
    this.capNhatTrungGa(dt);
    this.henTuong -= dtE;
    if (this.vuonNgu || this.choVua) this.henTuong = Math.max(this.henTuong, 0.1);
    else if (this.henTuong <= 0) {
      if (this.ga.some((g) => g.goc && !g.chet)) this.henTuong = 10;
      else if (this.soLanTuong <= TUONG_HOI_SINH) {
        this.sinhTuong();
        this.henTuong = CHO_TUONG;
      } else this.henTuong = 10;
    }
    const truoc = this.nguoi.map((n) => ({ x: n.x, y: n.y }));
    this.dieuKhien(dt);
    this.rangBuoc(truoc);
    // Nhân vật đi bộ / bay không đổi vùng: đang trong vườn gà thì ở lại trong vườn, đang ở đảo thì ở lại đảo (chỉ máy bay mới ra / vào vườn)
    this.nguoi.forEach((n, p) => { if (!this.trongMb(p)) giuTrongMap(n, leNhanVat(n.nv.heSoTo), !!n.bay, vungCua(truoc[p])); });
    this.capNhatMb(dt);
    this.nguoi.forEach((n, p) => this.mayQuet(n, p));
    this.capNhatGa(dtE);
    this.gaDanhNguoi();
    this.capNhatCell(dtE);
    this.capNhatTiec(dtE);
    this.capNhatDan(dt);
    this.capNhatKeo(dt);
    this.capNhatCuu(dt);
    this.capNhatCau(dt);
    this.capNhatCay();
    this.capNhatVatPham(dt);
    this.anGaSocola();
    this.capNhatHieuUng(dt, dtE);
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
      if (c.doLuc !== undefined && this.t - c.doLuc >= CAY_MOC_LAI) { delete c.doLuc; delete c.huongDo; delete c.mat; }
    }
  }

  private capNhatVatPham(dt: number): void {
    const conLai: VatPham[] = [];
    for (const b of this.ngocBay) b.t += dt;
    this.ngocBay = this.ngocBay.filter((b) => b.t < this.NGOC_BAY_T);
    for (const v of this.vatPham) {
      v.t += dt;
      const ngoc = v.loai === 'ngoc';
      if (!ngoc && v.t >= VP_TON_TAI) continue;
      if (ngoc) {
        const m = this.nguoi.find((q) => !this.khuat(q) && !q.bay && Math.hypot(q.x - v.x, q.y - v.y) < NGOC_BAN_KINH);
        if (m) {
          this.am.phat('anTao');
          this.chu.push({ id: this.id++, x: m.x, y: m.y - 220, text: '⭐ NGỌC RỒNG 1 SAO!', mau: '#ffb347', t: 0 });
          this.vet.push({ id: this.id++, x: v.x, y: v.y, t: 0, loai: 'chay', co: 1.2 });
          this.chuongLenTroi(this.nguoi.indexOf(m));
          this.ngocBay.push({ x: v.x, y: v.y - 40, t: 0, slot: this.ngocNhat.length });
          this.ngocNhat.push(1);
        } else conLai.push(v);
        continue;
      }
      const xanh = v.loai === 'xanh';
      const n = this.nguoi.find((m) => !this.khuat(m) && Math.hypot(m.x - v.x, m.y - v.y) < VP_BAN_KINH);
      if (n) {
        this.am.phat('anTao');
        if (v.loai === 'socola') {
          this.anSocola(n, v.luong);
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
      // Gà đi qua chỉ mổ ăn táo đỏ (táo xanh gà không ăn): hồi VP_HOI máu, không có trần. Socola thì mọi gà (con, mẹ gốc, mẹ phụ) đều ăn
      const socola = v.loai === 'socola';
      const ga = xanh ? undefined : this.ga.find((g) => !g.chet && Math.hypot(g.x - v.x, g.y - v.y) < (g.loai === 'boss' ? VP_GA_BAN_KINH * 2.5 : VP_GA_BAN_KINH));
      if (ga) {
        ga.mo = MO_THOI_GIAN;
        ga.lat = v.x < ga.x;
        if (socola) {
          // Ăn socola: hồi 2% máu tối đa, sức mạnh và độ to tăng theo
          const hoiGa = Math.max(1, Math.round((v.hpGa ?? HP_GA) * SOCOLA_GA_TI_LE));
          ga.hp += hoiGa;
          ga.suc = Math.min(SOCOLA_SUC_TOI_DA, (ga.suc ?? 1) + SOCOLA_SUC_GA);
          ga.to = Math.min(ga.loai === 'boss' ? SOCOLA_TO_TOI_DA_ME : SOCOLA_TO_TOI_DA, (ga.to ?? 1) + SOCOLA_TO_GA);
          this.chu.push({ id: this.id++, x: ga.x, y: this.tamGa(ga).y - 60, text: `🍫 +${hoiGa} ❤ SỨC MẠNH x${ga.suc}`, mau: '#c98a4b', t: 0 });
        } else {
          ga.hp += VP_HOI;
          this.chu.push({ id: this.id++, x: ga.x, y: this.tamGa(ga).y - 60, text: `+${VP_HOI} ❤`, mau: '#ff6b6b', t: 0 });
        }
        this.vet.push({ id: this.id++, x: v.x, y: v.y, t: 0, loai: 'bui' });
        continue;
      }
      conLai.push(v);
    }
    this.vatPham = conLai;
  }

  // Socola: cộng máu và mana (không giới hạn), mở khoá bay, rồi tự bắn chưởng lên trời
  private anSocola(n: NguoiChoi, luong?: number): void {
    const mau = luong ?? SOCOLA_NV_MAU;
    const mana = luong ?? SOCOLA_NV_MANA;
    this.hoiMau(n, mau);
    this.hoiMana(n, mana);
    n.bayKhoa = 0;
    this.chu.push({ id: this.id++, x: n.x, y: n.y - 250, text: `🍫 +${mau} ❤ +${mana} mana`, mau: '#c98a4b', t: 0 });
    this.chuongLenTroi(this.nguoi.indexOf(n));
  }

  // Gà con nở từ trứng đỏ đang hoá socola: nhân vật chạm vào là ăn (nhận như thanh socola), con gà biến mất và tính như hạ gà
  private anGaSocola(): void {
    for (const g of this.ga) {
      if (g.chet || (g.socola ?? 0) <= 0) continue;
      // Vua gà (gà mẹ gốc) không ăn được, chỉ ăn tướng gà (gà mẹ phụ) và gà con
      if (g.loai === 'boss') { if (!g.goc) this.anTuongSocola(g); continue; }
      const p = this.nguoi.findIndex((m) => !this.khuat(m) && Math.hypot(m.x - g.x, m.y - g.y) < VP_BAN_KINH);
      if (p < 0) continue;
      this.anSocola(this.nguoi[p], Math.max(1, Math.round(Math.max(0, g.hp) * SOCOLA_AN_TI_LE)));
      const tam = this.tamGa(g);
      g.hp = 0;
      g.chet = true;
      g.tChet = 1;
      this.vet.push({ id: this.id++, x: g.x, y: tam.y, t: 0, loai: 'chay', co: 0.7 });
      const n = this.nguoi[p];
      n.combo++;
      n.banTrung++;
      const hs = this.heSo(p);
      const diem = DIEM[g.loai] * (g.suc ?? 1) * hs;
      this.congDiem(p, diem, tam.x, tam.y - 30, `🍫 +${diem}${hs > 1 ? ` x${hs}` : ''}`);
    }
  }

  // Tướng gà (gà mẹ phụ) đang hoá socola: nhân vật chạm vào là ăn luôn, nhận 30% máu hiện có và 30% sức mạnh của nó; gà mẹ chết như bị hạ
  private anTuongSocola(g: Ga): void {
    const bk = AN_TUONG_BAN_KINH * (g.to ?? 1);
    const p = this.nguoi.findIndex((m) => !m.vang && !this.khuat(m) && Math.hypot(m.x - g.x, m.y - g.y) < bk);
    if (p < 0) return;
    const n = this.nguoi[p];
    const mau = Math.max(1, Math.round(Math.max(0, g.hp) * AN_TUONG_TI_LE));
    const suc = Math.round(AN_TUONG_TI_LE * (g.suc ?? 1) * 100) / 100;
    this.hoiMau(n, mau);
    n.suc = Math.round((n.suc + suc) * 100) / 100;
    this.am.phat('anTao');
    this.chu.push({ id: this.id++, x: n.x, y: n.y - 280, text: `🍫 ĂN TƯỚNG GÀ! +${mau} ❤ SỨC MẠNH x${n.suc}`, mau: '#c98a4b', t: 0 });
    g.hp = 0;
    this.trungTuong(g, p);
  }

  private themVatPham(x: number, y: number, loai: 'do' | 'xanh' = Math.random() < 0.5 ? 'do' : 'xanh'): void {
    const v = { x, y };
    giuTrongMap(v, LE_VP);
    this.vatPham.push({ id: this.id++, x: v.x, y: v.y, t: 0, loai });
  }

  // Táo xanh: cộng VP_MANA mana và mở khoá bay
  private hoiDayMana(n: NguoiChoi): void {
    this.hoiMana(n, VP_MANA);
    n.bayKhoa = 0;
  }

  private hoiMana(n: NguoiChoi, luong: number): void {
    n.mana += luong;
  }

  // Hồi máu không giới hạn (ăn táo / socola / hạ gà mẹ cộng thẳng vào máu, không còn trần hay khiên)
  private hoiMau(n: NguoiChoi, luong: number): void {
    n.hp += luong;
  }

  private dieuKhien(dt: number): void {
    this.nguoi.forEach((n, p) => {
      if (n.vang) return;
      n.hoiChieu = Math.max(0, n.hoiChieu - dt);
      this.capNhatMay(n, dt);
      n.bayKhoa = Math.max(0, n.bayKhoa - dt);
      n.hoiSoc = Math.max(0, n.hoiSoc - dt);
      // Không bị thương một lúc thì tự hồi máu chậm (chỉ tới HP_HOI_TOI_DA)
      if (!n.het && n.hp < HP_HOI_TOI_DA && this.tGame - n.thuongLuc >= HP_HOI_CHO) n.hp = Math.min(HP_HOI_TOI_DA, n.hp + HP_HOI * dt);
      if (n.bay) n.mana = Math.max(0, n.mana - MANA_BAY * dt);
      else if (n.mana < MANA_HOI_TOI_DA) n.mana = Math.min(MANA_HOI_TOI_DA, n.mana + MANA_HOI * dt);

      // Tâm ngắm chỉ có ở chế độ chuột (nhân vật không dùng chuột thì tự ngắm); chế độ tay cầm không có tâm, đánh theo hướng đang quay mặt
      const m = this.diemNham(p);
      n.nham = this.cheDo !== 'chuot' || this.khuat(n) || p === this.chuot ? null : n.ngam ?? (m.co ? { x: m.x, y: m.y } : null);

      if (n.nv.khoa || this.trongCau(p)) {
        n.dich = null;
        n.dangDi = false;
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

      let dx = 0;
      let dy = 0;
      if (n.dich) {
        dx = n.dich.x - n.x;
        dy = n.dich.y - n.y;
        if (Math.hypot(dx, dy) < 6) {
          n.dich = null;
          dx = dy = 0;
          n.nv.tiepDat();
        }
      }
      const d = Math.hypot(dx, dy);
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
    if (truot) n.x = kepX(n.x + truot * S_NV);
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

  private capNhatGa(dt: number): void {
    const conLai: Ga[] = [];
    for (const g of this.ga) {
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
          this.chu.push({ id: this.id++, x: g.x, y: this.tamGa(g).y - 60, text: 'HOÁ GIẢI!', mau: '#9be7ff', t: 0 });
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
          if (!g.chieu) g.de = (g.de ?? 0) - dt;
          // Giai đoạn 2: máu dưới GD2_MAU thì đẻ trứng nhanh hơn
          if (!g.gd2 && g.hp < hpToiDa(g) * GD2_MAU) {
            g.gd2 = true;
            g.de = Math.min(g.de ?? 0, 1.5);
            this.chu.push({ id: this.id++, x: g.x, y: g.y - 400, text: '🔥 GIAI ĐOẠN 2!', mau: '#ff6a3c', t: 0 });
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
        }
        g.choChieu = Math.max(0, (g.choChieu ?? 0) - dt);
        // Gọi gà con bảo vệ khi máu dưới GOI_MAU
        g.hoiGoi = Math.max(0, (g.hoiGoi ?? 0) - dt);
        g.dangGoi = Math.max(0, (g.dangGoi ?? 0) - dt);
        if (g.hp < hpToiDa(g) * GOI_MAU && g.hoiGoi <= 0 && !g.chieu && this.soGaCon < GA_CON_TOI_DA) this.goiGaCon(g);
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
              const dd = Math.hypot(o.x - g.x, o.y - g.y);
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
        g.tron = Math.max(0, g.tron - Math.hypot(g.vx, g.vy) * dt * HE_SO_TOC_GA);
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
      if (!d.troi) this.danDoCay(d, t0);
      if (d.to && !d.troi) this.danTrungMb(d, t0);
      if (d.to && !d.soc && !d.troi && d.t < d.T) this.chuongXuyen(d);
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
      if (Math.hypot(tam.x - vt.x, tam.y - vt.y) >= CHUONG_XUYEN + BAN_KINH_GA * tlGa(g) * S_GA * 0.8) continue;
      (d.da ??= []).push(g.id);
      if (this.danAn(d, g)) continue;
      if (this.trungGa(g, d.p, d.sat, 2)) this.dungKhung(0.03);
    }
    for (const c of this.cell) {
      if (c.chet || d.da?.includes(c.id)) continue;
      const tam = this.tamCell(c);
      if (Math.hypot(tam.x - vt.x, tam.y - vt.y) >= CHUONG_XUYEN + CELL_BK * cellK(c.cap) * 3) continue;
      (d.da ??= []).push(c.id);
      if (this.trungCell(c, d.p, d.sat)) this.dungKhung(0.03);
    }
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
    for (const c of this.trangTri) {
      if (c.loai !== 0 || c.doLuc !== undefined) continue;
      const hs = c.to ? CAY_TO_HE_SO : 1;
      const r = rg * hs;
      for (let i = 0; i <= buoc; i++) {
        const px = ax + (ex * i) / buoc, py = ay + (ey * i) / buoc;
        if (Math.abs(px - c.x) > r || py < c.y - CAY_DO_CAO * hs || py > c.y + 40) continue;
        c.doLuc = this.t;
        const dx = d.x1 - d.x0;
        c.huongDo = Math.abs(dx) > 20 ? Math.sign(dx) : c.lat ? -1 : 1;
        // Cây đổ có TAO_ROI cơ hội rơi 1 quả táo; rơi táo thì cây biến mất, chỉ còn quả táo ở gốc
        if (c.to) {
          // Cây to: chắc chắn rơi 2 táo đỏ (máu) + 2 táo xanh (mana)
          c.mat = true;
          for (let k = 0; k < CAY_TO_MAU + CAY_TO_MANA; k++) this.themVatPham(c.x + ngauNhien(-70, 70), c.y + ngauNhien(0, 50), k < CAY_TO_MAU ? 'do' : 'xanh');
        } else if (Math.random() < TAO_ROI) {
          c.mat = true;
          this.themVatPham(c.x + ngauNhien(-30, 30), c.y + ngauNhien(0, 30));
        }
        break;
      }
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
      return Math.hypot(tam.x - x, tam.y - y) < BAN_KINH_GA * tlGa(v) * S_GA * 1.25;
    });
    // Gà nhỏ đứng trước mặt gà tướng thì ưu tiên gà nhỏ
    const g = trungDon.find((v) => v.loai !== 'boss') ?? trungDon[0];
    if (!g) {
      const ce = this.cell.find((c) => !c.chet && Math.hypot(this.tamCell(c).x - x, this.tamCell(c).y - y) < CELL_BK * cellK(c.cap) * 3.5);
      if (ce) {
        if (this.trungCell(ce, p, d.sat) && (d.nhom === 0 || d.nhom === 1)) {
          this.hoiMana(this.nguoi[p], MANA_DAM);
          if (d.nhom === 1) this.dungKhung(0.04);
        }
        return;
      }
    }
    if (g) {
      if (this.danAn(d, g)) return;
      if (this.trungGa(g, p, d.sat, d.nhom)) {
        // Đấm / Đá trúng thì hồi mana; Đá và đòn trúng gà mẹ làm game khựng một nhịp
        if (d.nhom === 0 || d.nhom === 1) this.hoiMana(this.nguoi[p], MANA_DAM);
        if (d.nhom === 1 || g.loai === 'boss') this.dungKhung(0.04);
      }
      return;
    }
    this.vet.push({ id: this.id++, x, y, t: 0, loai: 'bui' });
    if (!d.phu) {
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
    const an = Math.max(1, Math.round(Math.max(0, g.hp) * (AN_TI_LE[d.p] ?? 0.02)));
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
      const d = Math.hypot(dx, dy);
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
    const trung = this.ga.filter((g) => {
      if (g.chet || d.da?.includes(g.id)) return false;
      const tam = this.tamGa(g);
      return Math.hypot(tam.x - d.x1, tam.y - d.y1) < BAN_KINH_NO;
    });
    trung.forEach((g) => { if (!this.danAn(d, g)) this.trungGa(g, d.p, d.sat, 2); });
    const ceTrung = this.cell.filter((c) => !c.chet && !d.da?.includes(c.id) && Math.hypot(this.tamCell(c).x - d.x1, this.tamCell(c).y - d.y1) < BAN_KINH_NO + CELL_BK * cellK(c.cap) * 2);
    ceTrung.forEach((c) => this.trungCell(c, d.p, d.sat));
    this.vet.push({ id: this.id++, x: d.x1, y: d.y1, t: 0, loai: 'no' });
    this.vet.push({ id: this.id++, x: d.x1, y: d.y1, t: 0, loai: 'chay', co: 0.9 });
    this.rungMan(0.15, 9);
    this.dungKhung(0.05);
    if (!trung.length && !ceTrung.length && !d.da?.length) {
      this.nguoi[d.p].combo = 0;
      this.nguoi[d.p].banTruot++;
    }
  }

  // Chiêu Biến socola: gà con trong vùng nổ chết luôn và thành socola; gà mẹ dính sát thương rồi hoá socola
  private noSocola(d: Dan): void {
    const trung = this.ga.filter((g) => {
      if (g.chet) return false;
      const tam = this.tamGa(g);
      return Math.hypot(tam.x - d.x1, tam.y - d.y1) < BAN_KINH_SOCOLA + (g.loai === 'boss' ? 150 : 0);
    });
    this.vet.push({ id: this.id++, x: d.x1, y: d.y1, t: 0, loai: 'chay', co: 1.3 });
    this.rung = Math.max(this.rung, 0.15);
    // Gà con trước, gà mẹ sau (gà mẹ có thể chết và đẻ thêm hiệu ứng)
    for (const g of trung.filter((v) => v.loai !== 'boss')) this.bienSocolaGa(g, d.p);
    for (const g of trung.filter((v) => v.loai === 'boss')) this.socolaTuong(g, d.p, d.sat);
    // Cell không hoá socola được: chỉ nhận sát thương
    const ceTrung = this.cell.filter((c) => !c.chet && Math.hypot(this.tamCell(c).x - d.x1, this.tamCell(c).y - d.y1) < BAN_KINH_SOCOLA);
    ceTrung.forEach((c) => this.trungCell(c, d.p, SAT_SOCOLA));
    if (!trung.length && !ceTrung.length) {
      this.nguoi[d.p].combo = 0;
      this.nguoi[d.p].banTruot++;
    }
  }

  // Gà con thành socola: chết ngay (biến mất, không rơi lông), để lại một thanh socola ăn được; tính điểm / combo như hạ gà
  private bienSocolaGa(g: Ga, p: number): void {
    // Gà con nở từ trứng đỏ không chết ngay: chỉ mất máu (SAT_SOCOLA) rồi hoá socola SOCOLA_THOI_GIAN giây;
    // nhân vật ăn trong lúc đó thì nhận socola, không ai ăn thì tự hoá giải (chỉ mất máu). Hết máu thì chết như thường.
    if (g.db) {
      this.trungGa(g, p, SAT_SOCOLA);
      if (!g.chet && (g.socola ?? 0) <= 0) {
        g.socola = SOCOLA_THOI_GIAN;
        g.vx = g.vy = 0;
        this.chu.push({ id: this.id++, x: g.x, y: this.tamGa(g).y - 60, text: '🍫 HOÁ SOCOLA!', mau: '#c98a4b', t: 0 });
      }
      return;
    }
    const n = this.nguoi[p];
    const tam = this.tamGa(g);
    const luong = Math.max(1, Math.round(Math.max(0, g.hp) * SOCOLA_AN_TI_LE));
    g.hp = 0;
    g.chet = true;
    g.tChet = 1;
    this.vet.push({ id: this.id++, x: g.x, y: tam.y, t: 0, loai: 'chay', co: 0.7 });
    const v = { x: g.x, y: g.y };
    giuTrongMap(v, LE_VP);
    this.vatPham.push({ id: this.id++, x: v.x, y: v.y, t: 0, loai: 'socola', luong, hpGa: hpToiDa(g) });
    n.combo++;
    n.banTrung++;
    const hs = this.heSo(p);
    const diem = DIEM[g.loai] * (g.suc ?? 1) * hs;
    this.congDiem(p, diem, tam.x, tam.y - 30, `🍫 +${diem}${hs > 1 ? ` x${hs}` : ''}`);
  }

  // Gà mẹ dính chiêu socola: nhận sát thương như đòn thường (có thể né / phản / miss theo màu); chỉ khi đòn trúng và gà mẹ còn sống mới hoá socola
  private socolaTuong(g: Ga, p: number, sat: number): void {
    const truoc = g.hp;
    this.trungGa(g, p, sat);
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

  private capNhatHieuUng(dt: number, dtE: number): void {
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

  /** Nhân vật còn sống nào cũng đang ngoài vườn gà (ở đảo / trên biển): hiệu ứng của vườn gà tắt, avatar trên thanh đen là Cell đỏ */
  get trenDao(): boolean {
    if (banDoHt !== 'sa') return false;
    const song = this.nguoi.filter((n) => !n.vang && !n.het);
    return song.length > 0 && song.every((n) => !trongVuon(n.x, n.y));
  }

  rungTrung(e: TrungGa): number {
    // Trứng đỏ rung mạnh dần theo thời gian
    if (e.db) return Math.sin(e.t * 30) * (2 + e.t * 1.2);
    return e.t > 1 ? Math.sin(e.t * 40) * 12 : 0;
  }

  // Các mũi tên ">" chỉ từ nhân vật gần đích nhất về phía đích; chỉ lấy mũi tên nằm trong khung nhìn.
  // Đích là trứng đỏ đang ấp (mũi tên hiện liên tục, cuối mũi tên là dấu X đỏ nhấp nháy kèm số giây đếm ngược tới lúc nở gà mẹ phụ), không có thì là gà mẹ gốc (hiện từng đợt).
  private huongToiTuong(trong: (x: number, y: number, le: number) => boolean) {
    const kq: { x: number; y: number; goc: number; a: number; mau: string }[] = [];
    this.xTrungView = [];
    const song = this.nguoi.filter((n, p) => !n.het && !this.trongCau(p));
    if (this.man !== 'play' || !song.length) return kq;
    // Mọi nhân vật đã rời vườn gà (đang ở đảo): không còn mũi tên / dấu X / số đếm ngược của vườn gà
    if (this.trenDao) return kq;
    const gan = (o: { x: number; y: number }) => Math.min(...song.map((n) => Math.hypot(n.x - o.x, n.y - o.y)));
    const trung = this.trungDe.filter((e) => e.db).sort((a, b) => gan(a) - gan(b))[0];
    const tw = this.ga.find((g) => g.goc && !g.chet);
    const dich = trung ?? tw;
    if (!dich) return kq;
    let a: number;
    if (trung) a = 0.3 + 0.2 * Math.abs(Math.sin(this.t * 3));
    else {
      const pha = this.tGame % HUONG_CHU_KY;
      if (pha > HUONG_HIEN) return kq;
      a = Math.sin((Math.PI * pha) / HUONG_HIEN) * 0.5;
    }
    // Chỉ nhân vật còn sống và gần đích hơn mới có mũi tên
    const n = [...song].sort((p, q) => Math.hypot(p.x - dich.x, p.y - dich.y) - Math.hypot(q.x - dich.x, q.y - dich.y))[0];
    const dx = dich.x - n.x;
    const dy = dich.y - n.y;
    const d = Math.hypot(dx, dy);
    const ux = d ? dx / d : 0;
    const uy = d ? dy / d : 0;
    const gom = trung ? 300 : HUONG_GAN;
    if (d >= gom) {
      const cuoi = Math.min(d - gom * 0.4, HUONG_TOI_DA);
      for (let k0 = HUONG_BAT_DAU; k0 <= cuoi; k0 += HUONG_CACH) {
        for (let i = 0; i < HUONG_CUM; i++) {
          const k = k0 + i * HUONG_LIEN;
          const x = n.x + ux * k;
          const y = n.y + uy * k;
          if (trong(x, y, 60)) kq.push({ x, y, goc: (Math.atan2(uy, ux) * 180) / Math.PI, a, mau: n.mau });
        }
      }
    }
    // Dấu X đỏ ở cuối mũi tên: đúng chỗ quả trứng nếu trong tầm, xa hơn thì ở cuối dãy mũi tên
    if (trung) {
      const xa = d > HUONG_TOI_DA + 150;
      const x = xa ? n.x + ux * (HUONG_TOI_DA + 150) : trung.x;
      const y = xa ? n.y + uy * (HUONG_TOI_DA + 150) : trung.y;
      if (trong(x, y, 150)) this.xTrungView.push({ x, y, con: Math.max(0, Math.ceil((trung.ap ?? TRUNG_DB_NO) - trung.t)) });
    }
    return kq;
  }

  // Camera chung: bám trung điểm 2 nhân vật, zoom ra khi họ xa nhau; rồi lọc vật trong khung nhìn
  private capNhatView(dt: number, ngay = false): void {
    const [a0, b0] = this.nguoi;
    // Chơi 1 người: camera chỉ bám nhân vật có mặt (coi như hai điểm trùng nhau)
    const a = a0.vang ? b0 : a0;
    const b = b0.vang ? a0 : b0;
    const tx = (a.x + b.x) / 2;
    // Máy bay bay cao: camera lùi ra (thấy xa hơn, vật dưới đất nhỏ đi) và nâng lên theo độ cao
    const zb = this.mayBay.pha === 'bay' || this.mayBay.pha === 'trung' || this.mayBay.pha === 'cat' ? this.mayBay.z : 0;
    const ty = (a.y + b.y) / 2 - MB_NANG * zb * 0.5;
    const dx = Math.abs(a.x - b.x);
    const dy = Math.abs(a.y - b.y);
    const tz = kep(Math.min(ZOOM, dx > 1 ? VUNG_X / dx : ZOOM, dy > 1 ? VUNG_Y / dy : ZOOM), ZOOM_MIN, ZOOM) * (1 - (1 - MB_ZOOM) * zb);
    const kv = ngay ? 1 : 1 - Math.exp(-dt * 6);
    const kz = ngay ? 1 : 1 - Math.exp(-dt * 3);
    this.camX += (tx - this.camX) * kv;
    this.camY += (ty - this.camY) * kv;
    this.camZ += (tz - this.camZ) * kz;
    // Camera không ra khỏi bản đồ: chạm mép map thì mép đó nằm đúng mép màn hình, không lộ vùng đen
    const zc = this.camZ;
    const bien = banDoHt === 'sa' ? TG : { x0: 0, y0: 0, x1: MAP, y1: MAP };
    this.camX = kep(this.camX, bien.x0 + this.W / 2 / zc, bien.x1 - this.W / 2 / zc);
    this.camY = kep(this.camY, bien.y0 + TAM_VIEW_Y / zc, bien.y1 - (H - TAM_VIEW_Y) / zc);

    const z = this.camZ;
    // Không lên máy bay thì không nhìn ra ngoài: chỉ thấy khối đất (vườn gà / vòng đảo) có nhân vật đang đứng; ai trên máy bay thì thấy hết
    const ngoai = banDoHt !== 'sa' || this.nguoi.some((_, i) => this.trongMb(i));
    const dung = this.nguoi.filter((n) => !n.vang);
    this.thayVuon = ngoai || !dung.length || dung.some((n) => trongVuon(n.x, n.y));
    this.thayDao = ngoai || !dung.length || dung.some((n) => !trongVuon(n.x, n.y));
    const trong = (x: number, y: number, le: number) =>
      (trongVuon(x, y) ? this.thayVuon : this.thayDao) &&
      Math.abs(x - this.camX) < this.W / 2 / z + le && y - this.camY > -TAM_VIEW_Y / z - le && y - this.camY < (H - TAM_VIEW_Y) / z + le;
    this.vatPhamView = this.vatPham.filter((v) => trong(v.x, v.y, 100));
    this.trungView = this.trungDe.filter((e) => this.thay(e.x, e.y) && trong(e.x, e.y, e.db ? 300 : 100));
    this.huongView = this.huongToiTuong(trong);
    this.nhinNguon = [
      ...this.nguoi.filter((n) => !n.het).map((n) => ({ x: n.x, y: n.y })),
      ...this.dan.filter((d) => !d.troi).map((d) => { const vt = this.danHienTai(d); return { x: vt.x, y: vt.y }; }),
    ];
    const xep: VatXep[] = [];
    for (const g of this.ga) {
      if (g.loai === 'flyer' || !this.thay(g.x, g.y) || !trong(g.x, g.y, g.loai === 'boss' ? 450 : 80)) continue;
      xep.push({ loai: 'ga', y: g.y, ga: g });
    }
    for (const g of this.keoGa) if (trong(g.x, g.y, 120)) xep.push({ loai: 'ga', y: g.y, ga: g });
    // Cell, bánh sinh nhật, chưởng tiệc: không bị sương mù, cứ nằm trong khung nhìn camera là vẽ, ra khỏi khung thì thôi
    // (trước đây theo sương mù nên Cell hiện ra / biến mất đột ngột ngay giữa màn hình). Lề theo kích thước sprite thật.
    this.cellView = this.cell.filter((c) => trong(c.x, c.y - 32 * cellK(c.cap), (c.cap === SO_CAP - 1 ? 58 : 40) * cellK(c.cap) + 60));
    for (const c of this.cellView) xep.push({ loai: 'cell', y: c.y, ce: c });
    this.banhView = this.tiec.filter((tc) => trong(tc.x, tc.y - 250 * tc.to, 400 * tc.to));
    for (const tc of this.banhView) xep.push({ loai: 'banh', y: tc.y, tc });
    this.chuongTiecView = this.chuongTiec.filter((q) => {
      const dai = Math.hypot(q.x1 - q.x0, q.y1 - q.y0);
      return trong((q.x0 + q.x1) / 2, (q.y0 + q.y1) / 2, dai / 2 + 60 * q.k);
    });
    // Người đang được mây / socola phủ lên thì thân được thay bằng mây / socola (cuuView)
    this.cuuView = this.cuu.filter((c) => trong(c.x, c.y, 500));
    for (const c of this.cuuView) xep.push({ loai: 'cuu', y: c.y, cu: c });
    this.cauView = this.cauTron.filter((q) => (q.pha !== 'moc' || q.t > CAU_MOC - 1) && trong(q.x, q.y, 400));
    for (const q of this.cauView) xep.push({ loai: 'cau', y: q.y, cau: q });
    // Máy bay: đang bay thì luôn nằm trên mọi vật
    const mb = this.mbHinh();
    this.mbView = mb && trong(mb.x, mb.y - mb.nang, 700) ? mb : null;
    if (this.mbView) xep.push({ loai: 'mb', y: this.mayBay.y + this.mayBay.z * 20000 });
    const dem = this.mbDem();
    this.mbDemView = dem && trong(dem.x, dem.y, 300) ? dem : null;
    this.nguoi.forEach((n, i) => { if (!n.vang && !this.dangCuu(i) && !this.trongCau(i) && !this.trongMb(i) && trong(n.x, n.y, n.nv.laMay ? 600 : 200)) xep.push({ loai: 'nv', y: n.y, p: i }); });
    for (const t of this.trangTri) if (!t.mat && trong(t.x, t.y, t.to ? 700 : 400)) xep.push({ loai: 'td', y: t.y, td: t });
    xep.sort((a, b) => a.y - b.y);
    this.xep = xep;
    this.gaBayView = this.ga.filter((g) => g.loai === 'flyer' && this.thay(g.x, g.y) && trong(g.x, g.y, 400));
    this.vetView = this.vet.filter((v) => trong(v.x, v.y, 200));
    this.danView = this.dan.filter((d) => {
      const vt = this.danHienTai(d);
      return trong(vt.x, vt.y, 200);
    });
    this.longView = this.long.filter((l) => trong(l.x, l.y, 100));
    this.nhamView = this.nguoi.flatMap((n) => (n.nham && trong(n.nham.x, n.nham.y, 100) ? [{ x: n.nham.x, y: n.nham.y, mau: n.mau }] : []));
    this.chuView = this.chu.filter((c) => trong(c.x, c.y, 300));
    // Chỉ nhân vật và gà mẹ (gốc + phụ) có thanh máu trên đầu; chỉ lấy khi nằm trong khung nhìn
    const cacTuong = this.ga.filter((g) => g.loai === 'boss' && !g.chet);
    this.tuongSong = cacTuong.find((g) => g.goc) ?? null;
    const song = this.nguoi.filter((n) => !n.het);
    const gan = (g: Ga) => Math.min(...song.map((n) => Math.hypot(n.x - g.x, n.y - g.y)), Infinity);
    this.tuongBang = cacTuong.filter(laMePhu).sort((a, b) => gan(a) - gan(b))[0] ?? this.tuongSong;
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
    this.tuongView = cacTuong.filter((t) => this.thay(t.x, t.y) && trong(t.x, t.y, 450));
  }

  // Điểm có nằm trong tầm nhìn của nhân vật hoặc chưởng nào không
  private thay(x: number, y: number): boolean {
    return this.nhinNguon.some((o) => Math.hypot(o.x - x, o.y - y) < TAM_NHIN);
  }

  // Dây buộc: 2 nhân vật không xa nhau quá mức camera chứa nổi. Người vừa di chuyển nhiều hơn là người bị chặn lại.
  private rangBuoc(truoc: { x: number; y: number }[]): void {
    const [a, b] = this.nguoi;
    if (a.vang || b.vang) return;
    const ma = Math.hypot(a.x - truoc[0].x, a.y - truoc[0].y);
    const mb = Math.hypot(b.x - truoc[1].x, b.y - truoc[1].y);
    const sa = ma + mb > 0.01 ? ma / (ma + mb) : 0.5;
    for (const [k, max] of [['x', MAX_DX], ['y', MAX_DY]] as const) {
      const d = a[k] - b[k];
      const thua = Math.abs(d) - max;
      if (thua <= 0) continue;
      const dau = Math.sign(d);
      a[k] -= dau * thua * sa;
      b[k] += dau * thua * (1 - sa);
    }
  }

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
    const v = this.viTriManHinh(p);
    const x = kep(v.x, 70, this.W - 70);
    const y = kep(v.y, 130, H - 70);
    if (x === v.x && y === v.y) return null;
    return { x, y, goc: (Math.atan2(v.y - y, v.x - x) * 180) / Math.PI };
  }

  // ─── Sinh đối tượng ───

  private khoangCachGanNhat(x: number, y: number): number {
    return Math.min(...this.nguoi.map((n) => Math.hypot(n.x - x, n.y - y)));
  }

  private diemQuanh(p: number, rMin: number, rMax: number) {
    const n = this.nguoi[p];
    const goc = ngauNhien(0, Math.PI * 2);
    const r = ngauNhien(rMin, rMax);
    return { x: kepX(n.x + Math.cos(goc) * r), y: kepY(n.y + Math.sin(goc) * r) };
  }

  // Máy bay ra khỏi vườn gà → vườn ngủ (gà, trứng biến mất, không hoạt động). Máy bay về → tổ trứng ẩn đẻ / ấp đủ ME_PHU_HIEN_VUA gà mẹ phụ thì vua gà mới xuất hiện lại (nếu vua gà chưa bị hạ)
  private capNhatVuon(dtE: number): void {
    const ngoai = !trongVuon(this.mayBay.x, this.mayBay.y);
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
          if (co.every((n) => Math.hypot(n.x - x, n.y - y) >= 1500)) break;
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
    this.am.phat('deTrung');
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
      this.vet.push({ id: this.id++, x: g.x, y: g.y, t: 0, loai: 'bui' });
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
        if (co.every((n) => Math.hypot(n.x - x, n.y - y) >= 2000)) break;
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
          const d = Math.min(...co.map((n) => Math.hypot(n.x - cx, n.y - cy)));
          if (d > tot) { tot = d; x = cx; y = cy; }
        }
      }
    }
    this.ga.push(this.taoTuong(x, y, x > mx, true));
    const chuTuong = lan === 0 ? '🐔 GÀ TƯỚNG XUẤT HIỆN!' : `🐔 GÀ TƯỚNG HỒI SINH LẦN ${lan}!`;
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
      this.vet.push({ id: this.id++, x: c.x, y: c.y, t: 0, loai: 'chay', co: 0.6 });
    });
    this.chu.push({ id: this.id++, x: g.x, y: g.y - 360, text: '📣 GỌI GÀ CON!', mau: '#ffd23f', t: 0 });
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
    this.chu.push({ id: this.id++, x: boss.x, y: boss.y - 360, text: '🥚 TRỨNG ĐỎ!', mau: '#ff4d4d', t: 0 });
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
    this.vet.push({ id: this.id++, x: g.x, y: g.y, t: 0, loai: 'chay', co: 0.6 + 0.2 * k });
    if (k > 0) this.chu.push({ id: this.id++, x: g.x, y: g.y - 160, text: `GÀ CON x${suc}!`, mau: '#ff6a3c', t: 0 });
  }

  // Trứng đỏ nở ra gà mẹ phụ: đi đánh nhân vật thay gà mẹ gốc
  private sinhMePhu(e: TrungGa): void {
    if (this.soMePhu >= ME_PHU_TOI_DA) return;
    const g = this.taoTuong(e.x, e.y, Math.random() < 0.5, false, this.demPhu++ % KIEU_PHU);
    giuTrongMap(g, LE_TUONG, false, 'vuon');
    this.ga.push(g);
    this.daNoPhu++;
    this.vet.push({ id: this.id++, x: g.x, y: g.y, t: 0, loai: 'chay', co: 2 });
    this.chu.push({ id: this.id++, x: g.x, y: g.y - 360, text: '🐔 GÀ MẸ MỚI RA ĐỜI!', mau: '#ff9f1a', t: 0 });
    this.rung = Math.max(this.rung, 0.3);
  }

  // Thanh socola gần nhất trong tầm ngửi TAM_NGUI_TAO của gà g; khongGioiHan: tìm khắp vườn, kể cả táo đỏ (tướng gà khi đã đủ ME_PHU_TOI_DA)
  private socolaGan(g: Ga, khongGioiHan = false): VatPham | null {
    let kq: VatPham | null = null;
    let xa = khongGioiHan ? Infinity : TAM_NGUI_TAO;
    for (const v of this.vatPham) {
      if (v.loai !== 'socola' && !(khongGioiHan && (v.loai ?? 'do') === 'do')) continue;
      if (khongGioiHan && !trongVuon(v.x, v.y)) continue;
      const d = Math.hypot(v.x - g.x, v.y - g.y);
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
      const d = Math.hypot(n.x - g.x, n.y - g.y);
      if (d < gan) { gan = d; muc = n; }
    }
    if (!muc) return false;
    const d = Math.hypot(g.x - muc.x, g.y - muc.y) || 1;
    const ux = (g.x - muc.x) / d;
    const uy = (g.y - muc.y) / d;
    let toc = TOC_TRON;
    if ((g.daTron ?? 0) < TRON_LAN) {
      // Trốn chạy nhanh (tối đa TRON_LAN lần): khoá hướng ra xa nhân vật gần nhất, bất tử trong lúc chạy
      g.daTron = (g.daTron ?? 0) + 1;
      g.tron = TRON_QUANG;
      g.tronX = ux;
      g.tronY = uy;
      toc *= TRON_TOC;
      this.chu.push({ id: this.id++, x: g.x, y: g.y - 380, text: '🏃 VUA GÀ TRỐN CHẠY!', mau: '#ffd23c', t: 0 });
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
      const d = Math.hypot(e.x - g.x, e.y - g.y);
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
      const d = Math.hypot(n.x - g.x, n.y - g.y);
      if (d < gan) { gan = d; muc = n; }
    }
    // Không có nhân vật nào gần mà có socola trong tầm ngửi thì đi ăn
    const soc = this.socolaGan(g);
    if (soc && (!muc || gan > 800)) {
      const d = Math.hypot(soc.x - g.x, soc.y - g.y) || 1;
      g.vx = ((soc.x - g.x) / d) * TOC_DO_TUONG * 3;
      g.vy = ((soc.y - g.y) / d) * TOC_DO_TUONG * 3;
      g.lat = g.vx < 0;
      return;
    }
    if (muc) {
      const d = Math.hypot(muc.x - g.x, muc.y - g.y) || 1;
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
      const d = Math.hypot(n.x - g.x, n.y - g.y);
      if (d < gan || (day && trongVuon(n.x, n.y) && (!muc || d < gan))) { gan = d; muc = n; }
    }
    // Nhân vật chưa vào tầm đánh (TAM_LAO) mà có táo đỏ trong tầm ngửi TAM_NGUI_TAO thì đi tới táo trước
    if (!muc || gan > TAM_LAO) {
      let xa = day ? Infinity : TAM_NGUI_TAO;
      for (const v of this.vatPham) {
        if (v.loai === 'xanh' || v.loai === 'ngoc') continue;
        if (day && !trongVuon(v.x, v.y)) continue;
        const d = Math.hypot(v.x - g.x, v.y - g.y);
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
      this.denNhao(g, muc as NguoiChoi, dt);
      return true;
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
    const d = Math.hypot(dx, dy) || 1;
    // Gà đỏ lao DO_CHAY giây rồi khựng DO_KHUNG giây (thở dốc, nhận thêm sát thương)
    if (g.loai === 'rooster' && laNguoi) {
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
    const v = g.loai === 'flyer' ? Math.hypot(g.vx, g.vy) || 150 : d > 40 ? TOC_DO_LAO[g.loai] : 0;
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
    const d = Math.hypot(dx, dy) || 1;
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
      const e = Math.hypot(ex, ey) || 1;
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
      this.chu.push({ id: this.id++, x: g.x, y: g.y - 360, text: '🛡 THẾ PHÒNG THỦ!', mau: '#7fd4ff', t: 0 });
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
      this.chu.push({
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
      if (dx * dx + dy * dy < 1) this.nhanSatThuong(n, DOT_SAT * DOT_NHIP, true, '#ff8a3c');
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
    this.chu.push({ id: this.id++, x: g.x, y: g.y - 360, t: 0, text: '😵 SƠ HỞ!', mau: '#7ee787' });
  }

  // Chọn chiêu lao / bay khi thấy mục tiêu đủ xa; bắt đầu từ pha báo hiệu. Trả về true nếu đã bắt đầu.
  private batDauChieu(g: Ga, muc: NguoiChoi, d: number): boolean {
    if (!g.daDe || (g.choChieu ?? 0) > 0 || (g.nghiChung ?? 0) > 0 || g.mau || (dsMauCua(g).length && (g.hoiMau ?? 1) <= 0)) return false;
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
        const d = Math.hypot(n.x - g.x, n.y - g.y);
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
      if (Math.hypot(n.x - g.x, n.y - g.y) >= CHAM_GA.boss) return;
      c.trung[p] = true;
      this.nhanSatThuong(n, satGa(g) * (c.loai === 'lao' ? LAO_SAT : BAY_SAT));
    });
  }

  private dieuTuong(g: Ga, dt: number): void {
    if (g.chieu) {
      this.chayChieu(g, g.chieu, dt);
      return;
    }
    // Thấy nhân vật trong tầm nhìn gấp 3 thì đuổi người gần nhất, không thì đi loanh quanh
    // Đã đủ ME_PHU_TOI_DA tướng gà: tìm Mabu / Zinbu khắp vườn và đi ăn táo đỏ / socola khắp vườn
    let muc: NguoiChoi | null = null;
    let gan = TAM_NHIN_TUONG;
    for (const n of this.nguoi) {
      if (this.khuat(n)) continue;
      const d = Math.hypot(n.x - g.x, n.y - g.y);
      if (d < gan || (this.dayPhu && trongVuon(n.x, n.y) && (!muc || d < gan))) { gan = d; muc = n; }
    }
    // Nhân vật chưa vào tầm đánh mà có socola trong tầm ngửi thì đi ăn socola trước
    const soc = this.socolaGan(g, this.dayPhu);
    if (soc && (!muc || gan > TAM_LAO)) {
      const d = Math.hypot(soc.x - g.x, soc.y - g.y) || 1;
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
      const d = Math.hypot(dx, dy) || 1;
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
      this.trungCell(c, p, SAT_MAY);
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
    if (n.hoiChieu > 0 || n.nv.khoa || n.het || this.trongCau(p)) return;
    // Trên máy bay: đấm / đá bình thường; bắn chưởng (Chiêu đặc biệt / socola) thì máy bay nổ; không biến mây
    const tren = this.trongMb(p);
    const nhom = n.nv.nhom;
    // Nhóm 3: Mabu biến mây, Zinbu biến socola
    const nhomMay = !!n.nv.sp.nhomDon[nhom]?.may;
    const soc = nhom === NHOM_MAY && !nhomMay;
    if (tren && nhomMay) return;
    const chieu = nhom === 2 || soc;
    // Chiêu đặc biệt (chưởng) tốn MANA_CHUONG, Biến mây / socola tốn MANA_DAC_BIET; Đấm / Đá miễn phí (còn hồi mana khi trúng)
    const phi = nhom === 2 ? MANA_CHUONG : nhom === NHOM_MAY ? MANA_DAC_BIET : 0;
    if (nhomMay) {
      if (!n.may.dang && n.may.hoi <= 0 && !n.bay && n.mana < phi) return this.thieuMana(n);
      if (this.vaoMay(n)) n.mana -= phi;
      return;
    }
    if (n.may.dang) return;
    // Biến socola đang hồi: không ra chiêu (các đòn khác vẫn dùng bình thường)
    if (soc && n.hoiSoc > 0) return;
    if (n.mana < phi) return this.thieuMana(n);
    n.mana -= phi;
    if (soc) n.hoiSoc = SOCOLA_HOI;
    // Thời gian hồi giữa 2 đòn theo nhóm (không phụ thuộc độ dài animation); combo cao thì chưởng hồi nhanh hơn.
    // Socola chỉ chặn đòn kế tiếp 0,5s (đủ cho animation); hồi chiêu socola nằm ở hoiSoc
    const giamHoi = nhom === 2 && n.combo >= COMBO_GIAM_HOI ? COMBO_HOI_CHUONG : 1;
    n.hoiChieu = soc ? 0.5 : (chieu ? 0.5 * giamHoi : n.nv.nhom === 1 ? 0.32 : n.dangDi ? 0.3 : 0.2) * 2;
    if (!n.dangDi) {
      n.nv.lat = x < n.x;
      n.nv.huong = 'ngang';
    }
    if (!n.bay) n.nv.raDon(this.t);
    this.am.phat(chieu ? 'chuong' : nhom === 1 ? 'da' : 'dam');

    // Giới hạn tầm theo đòn vừa ra: chuột trỏ xa hơn tầm thì đòn dừng ở mép tầm đánh
    const tam = soc ? TAM_SOCOLA : chieu ? TAM_CHIEU : TAM_DON[n.nv.donVuaRa ?? ''] ?? (n.nv.nhom === 1 ? TAM_DA_GAN : TAM_DAM_GAN);
    const ddx = x - n.x;
    const ddy = y - n.y;
    const dd = Math.hypot(ddx, ddy);
    if (dd > tam) {
      x = n.x + (ddx / dd) * tam;
      y = n.y + (ddy / dd) * tam;
    }

    const tay = this.viTriTay(p);
    // Đòn ăn: Zinbu quất râu → socola, Mabu bắn chưởng → socola hồng
    const an: Dan['an'] = !soc && n.nv.donVuaRa === DON_AN[n.nv.sp.ten] ? (n.nv.sp.ten === 'Mabu' ? 'hong' : 'soc') : undefined;
    const tanX = n.dangDi ? ngauNhien(-18, 18) : 0;
    const tanY = n.dangDi ? ngauNhien(-14, 14) : 0;
    const lech = [...(n.nv.nhom === 1 ? [-28, 28] : [0]), ...(this.dangChum(p) ? [-70, 70] : [])];
    lech.forEach((dx, i) => {
      const x1 = x + tanX + dx;
      const y1 = y + tanY + Math.abs(dx) * 0.3;
      const T = Math.hypot(x1 - tay.x, y1 - tay.y) / (chieu ? TOC_DO_DAN * 0.55 : TOC_DO_DAN);
      this.dan.push({ id: this.id++, p, x0: tay.x, y0: tay.y, x1, y1, t: 0, T, phu: i > 0, to: chieu && i === 0, sat: soc ? SAT_SOCOLA : SAT_THUONG[nhom][p], soc: soc && i === 0, nhom, an });
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
    const n = this.nguoi[p];
    if (k === 2) return n.mana < MANA_CHUONG;
    if (k === NHOM_MAY) return n.mana < MANA_DAC_BIET || (n.nv.sp.nhomDon[k]?.may ? n.may.dang || n.may.hoi > 0 : n.hoiSoc > 0);
    return false;
  }

  tenNhom(p: number): string {
    const nv = this.nguoi[p].nv;
    return nv.nhom === 2 ? TEN_DON[nv.donVong(this.t)] ?? nv.tenNhom : nv.tenNhom;
  }

  // kieu = nhóm đòn (0 Đấm · 1 Đá · 2 Chiêu đặc biệt; bỏ trống cho mây / socola). Trả về true nếu đòn thật sự trúng (không né / miss / phản)
  private trungGa(g: Ga, p: number, sat: number, kieu?: number): boolean {
    // Sức mạnh nhân vật (ăn gà mẹ socola) nhân sát thương mọi đòn
    sat *= this.nguoi[p]?.suc ?? 1;
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
        if (!n.het && !n.nv.laMay) this.nhanSatThuong(n, sat, true);
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
        const dd = Math.hypot(dx, dy) || 1;
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
    if (p === 1 && kieu !== undefined) {
      const v = { x: g.x, y: g.y };
      giuTrongMap(v, LE_VP);
      const luong = Math.max(1, Math.round(HP_GA * (g.suc ?? 1) * AN_TI_LE[1]!));
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

  // ─── Cell canh đảo ───

  /** Tâm thân Cell (để tính trúng đòn / vẽ số sát thương) */
  tamCell(c: Cell) {
    return { x: c.x, y: c.y - 20 * cellK(c.cap) };
  }

  // Cell nhận đòn: trừ máu, nháy sáng, hết máu thì ngã (tính điểm / combo). Trả về true nếu đòn trúng.
  private trungCell(c: Cell, p: number, sat: number): boolean {
    if (c.chet) return false;
    if (c.tiec) this.ketThucTiec(this.tiecCua(c));
    const n = this.nguoi[p];
    const mat = Math.max(1, Math.round(sat * (n?.suc ?? 1)));
    const tam = this.tamCell(c);
    c.hp -= mat;
    c.nhay = CELL_NHAY_T;
    this.chu.push({ id: this.id++, x: tam.x + ngauNhien(-40, 40), y: tam.y - 40, text: `-${mat}`, mau: '#ffffff', t: 0 });
    n.banTrung++;
    if (c.hp > 0) return true;
    c.hp = 0;
    c.chet = true;
    c.tChet = 0;
    this.vet.push({ id: this.id++, x: c.x, y: tam.y, t: 0, loai: 'chay', co: 0.5 + c.cap * 0.15 });
    n.combo++;
    const hs = this.heSo(p);
    const diem = CELL_DIEM[c.cap]! * hs;
    this.congDiem(p, diem, tam.x, tam.y - 70, `+${diem}${hs > 1 ? ` x${hs}` : ''} ${CELL_TEN[c.cap]}`);
    return true;
  }

  // Cell: đi lang thang quanh chỗ đứng, ngửi thấy nhân vật (không ẩn / gục / mây) thì đuổi và đánh khi chạm; ra xa nhà quá thì quay về
  private capNhatCell(dt: number): void {
    for (const c of this.cell) {
      if (c.chet) { c.tChet += dt; continue; }
      c.phase += dt;
      c.nhay = Math.max(0, c.nhay - dt);
      c.danh = Math.max(0, c.danh - dt);
      // Đang dự tiệc: ngồi quanh bánh, bắn chưởng vào bánh; có nhân vật lại gần thì tiệc tan
      const tcc = c.tiec ? this.tiecCua(c) : undefined;
      if (tcc?.on) {
        if (this.nguoi.some((n) => !n.vang && !this.khuat(n) && Math.hypot(n.x - c.x, n.y - c.y) < TIEC_NGUI)) this.ketThucTiec(tcc);
        else { this.cellTiec(c, tcc, dt); continue; }
      }
      const to = CELL_TO[c.cap]!;
      let muc: { x: number; y: number } | null = null;
      let gan = CELL_NGUI;
      let ke: NguoiChoi | null = null;
      for (const n of this.nguoi) {
        if (n.vang || this.khuat(n)) continue;
        const d = Math.hypot(n.x - c.x, n.y - c.y);
        if (d < gan && Math.hypot(n.x - c.hx, n.y - c.hy) < CELL_XICH) { gan = d; ke = n; }
      }
      if (ke) {
        muc = ke;
        c.lat = ke.x < c.x;
        // Chạm nhân vật thì đánh
        if (gan < CELL_CHAM * to && c.choDanh <= this.t && !ke.nv.khoa) {
          c.choDanh = this.t + CELL_HOI[c.cap]!;
          c.danh = CELL_DANH_T;
          this.nhanSatThuong(ke, CELL_SAT[c.cap]!);
        }
      } else {
        c.doi -= dt;
        if (c.doi <= 0 || Math.hypot(c.dx - c.x, c.dy - c.y) < 30) {
          // Hay tụ tập: thường đi tới đứng cạnh một Cell khác cùng đảo, không thì đi ngẫu nhiên quanh nhà
          const k = cellK(c.cap);
          const ban = this.cell.filter((o) => o !== c && !o.chet && Math.hypot(o.x - c.x, o.y - c.y) < CELL_TU_TAM);
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
        // Đang đuổi xa nhà quá thì về nhà
        if (Math.hypot(c.x - c.hx, c.y - c.hy) > CELL_XICH) { c.dx = c.hx; c.dy = c.hy; }
        muc = { x: c.dx, y: c.dy };
      }
      const dx = muc.x - c.x, dy = muc.y - c.y, dd = Math.hypot(dx, dy);
      // Đứng sát nhân vật thì không xô vào; lang thang thì đi chậm hơn
      const toc = CELL_TOC[c.cap]! * (ke ? 1 : 0.5);
      c.chay = dd > (ke ? CELL_CHAM * to * 0.6 : 20) && c.danh <= 0;
      if (c.chay) {
        const b = Math.min(dd, toc * dt);
        const cu = { x: c.x, y: c.y };
        c.x += (dx / dd) * b;
        c.y += (dy / dd) * b;
        if (!ke) c.lat = dx < 0;
        giuTrongMap(c, leCell(c.cap), false, 'dao');
        // Bị bờ biển chặn mà không nhích được thì chọn điểm khác
        if (!ke && Math.hypot(c.x - cu.x, c.y - cu.y) < b * 0.3) c.doi = 0;
      }
    }
    // Xác nằm đủ lâu thì biến mất
    this.cell = this.cell.filter((c) => !c.chet || c.tChet < CELL_CHET_T);
  }

  // ─── Tiệc sinh nhật của Cell ───

  /** Tiệc của đảo Cell `c` */
  tiecCua(c: Cell): Tiec | undefined {
    return this.tiec.find((t) => t.dao === c.dao);
  }

  /** Tiệc tan: mọi Cell của đảo đứng dậy (về AI bình thường: ngửi thấy nhân vật thì đuổi); bánh ở lại */
  private ketThucTiec(tc: Tiec | undefined): void {
    if (!tc?.on) return;
    tc.on = false;
    for (const c of this.cell) if (c.dao === tc.dao) { c.tiec = false; c.nap = undefined; }
    this.chu.push({ id: this.id++, x: tc.x, y: tc.y - 420 * tc.to / 0.6, text: '🎂 TIỆC TAN RỒI!', mau: '#ffd166', t: 0 });
  }

  /** Một Cell dự tiệc: cả đội cùng đi vòng quanh bánh `TIEC_DI` = 2s (animation chạy), rồi cùng dừng: biến hình → vận nội công (hào quang) → phóng một loại chưởng ngẫu nhiên vào bánh, rồi lại đi vòng (theo giờ tiệc chung `tc.t` nên các Cell luôn cách đều nhau) */
  private cellTiec(c: Cell, tc: Tiec, dt: number): void {
    const k = cellK(c.cap);
    c.lat = tc.x < c.x;
    const u = tc.t % TIEC_CHU_KY;
    if (u < TIEC_DI) {
      c.nap = undefined;
      c.goc = (c.goc ?? 0) + ((TIEC_TOC * k) / tc.bk) * dt;
      const p = viTriVong(tc, c.goc);
      c.x = p.x; c.y = p.y;
      c.chay = true;
      c.lat = Math.sin(c.goc) > 0;
      return;
    }
    c.chay = false;
    const truoc = c.nap;
    c.nap = u - TIEC_DI;
    if (truoc === undefined) c.loaiChuong = Math.floor(Math.random() * CHUONG_LOAI.length);
    const luc = TIEC_BIEN + TIEC_AURA;
    if ((truoc ?? 0) < luc && c.nap >= luc) {
      const l = CHUONG_LOAI[c.loaiChuong ?? 0]!;
      const hx = c.x + (c.lat ? -1 : 1) * l.tayX * k, hy = c.y - l.tayY * k;
      this.chuongTiec.push({
        id: this.id++, k, loai: c.loaiChuong ?? 0,
        x0: hx, y0: hy,
        x1: tc.x + ngauNhien(-50, 50) * tc.to / 0.6, y1: tc.y - 150 * tc.to + ngauNhien(-60, 60) * tc.to / 0.6, t: 0,
      });
      this.vet.push({ id: this.id++, x: hx, y: hy, t: 0, loai: 'chay', co: 0.25 + 0.05 * k });
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
      q.t += dt;
      if (q.t >= TIEC_CHUONG_T) this.vet.push({ id: this.id++, x: q.x1, y: q.y1, t: 0, loai: 'chay', co: 0.35 });
    }
    this.chuongTiec = this.chuongTiec.filter((q) => q.t < TIEC_CHUONG_T);
    for (const tc of this.tiec) if (tc.on) tc.t += dt;
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
    for (const g of this.ga) {
      // Gà mẹ gốc không đi đánh; gà mẹ đang là socola thì đứng yên không đánh
      if (g.chet || g.chieu || g.goc || (g.socola ?? 0) > 0 || (g.choang ?? 0) > 0 || (g.choDanh ?? 0) > this.t) continue;
      for (let p = 0; p < 2; p++) {
        const n = this.nguoi[p];
        if (this.khuat(n) || n.nv.khoa) continue;
        if (Math.hypot(n.x - g.x, n.y - g.y) >= CHAM_GA[g.loai] * (g.to ?? 1)) continue;
        g.choDanh = this.t + HOI_DANH_GA[g.loai];
        g.mo = MO_THOI_GIAN;
        if (g.loai === 'boss') g.kieuMo = ((g.kieuMo ?? 0) + 1) % 2;
        g.lat = n.x < g.x;
        this.nhanSatThuong(n, satGa(g));
        break;
      }
    }
  }

  // khongNe: đòn phản / đốt cháy không né được; mauChu: màu chữ bay
  private nhanSatThuong(n: NguoiChoi, sat: number, khongNe = false, mauChu = '#ff4d4d'): void {
    if (this.trongCau(this.nguoi.indexOf(n)) || this.trongMb(this.nguoi.indexOf(n))) return;
    if (!khongNe && Math.random() < NE_NV) {
      this.chu.push({ id: this.id++, x: n.x, y: n.y - 220, text: 'NÉ!', mau: '#9be7ff', t: 0 });
      return;
    }
    const nhan = Math.round(sat * (1 - GIAM_NV));
    n.thuongLuc = this.tGame;
    this.chu.push({ id: this.id++, x: n.x, y: n.y - 220, text: `-${nhan}`, mau: mauChu, t: 0 });
    n.hp = Math.max(0, n.hp - nhan);
    this.rung = Math.max(this.rung, 0.15);
    this.rungTayCam(this.nguoi.indexOf(n), n.hp <= 0 ? 600 : 180, n.hp <= 0 ? 1 : 0.6);
    if (n.hp > 0) return;
    n.het = true;
    this.am.phat('nvChet');
    n.dich = null;
    n.dangDi = false;
    n.bay = null;
    n.nv.tuKhi(false);
    n.nv.nga();
    if (this.nguoi.every((m) => m.het)) this.ketThuc(false);
    else this.batDauCuu(n);
  }

  // Một nhân vật ngã mà người kia còn sống: bắt đầu cứu (Mabu phủ mây lên Zinbu, Zinbu phủ socola lên Mabu)
  private batDauCuu(n: NguoiChoi): void {
    const p = this.nguoi.indexOf(n);
    const b = this.nguoi[1 - p];
    if (b.vang || b.het || this.cuu.some((c) => c.p === p)) return;
    this.cuu.push({ p, kieu: p === 1 ? 'may' : 'socola', x: n.x, y: n.y, cho: CUU_CHO, t: 0, tach: 0 });
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
        const d = Math.hypot(dx, dy) || 1;
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
    return p >= 0 && this.mayBay.ngoi.includes(p);
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
        if (n.vang || m.ngoi.includes(p) || n.het || n.nv.laMay || n.bay || n.nv.khoa || this.trongCau(p) || this.dangCuu(p)) return;
        if (Math.hypot(n.x - m.x, (n.y - m.y) / EP_GA) >= MB_BK) return;
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
      if (pl?.dich) {
        const dx = pl.dich.x - m.x;
        const dy = pl.dich.y - m.y;
        const d = Math.hypot(dx, dy);
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

  // Chưởng (Chiêu đặc biệt / socola, không tính chưởng tự bắn lên trời) bay qua thân máy bay thì máy bay trúng (người ngồi trên máy bay bắn chưởng thì máy bay nổ ngay, xem ban())
  private danTrungMb(d: Dan, t0: number): void {
    const m = this.mayBay;
    if (m.pha === 'trung' || m.pha === 'no') return;
    const c = this.tamMb();
    const k0 = Math.min(1, t0 / d.T), k1 = Math.min(1, d.t / d.T);
    const dx = d.x1 - d.x0, dy = d.y1 - d.y0;
    const buoc = Math.max(1, Math.ceil((Math.hypot(dx, dy) * (k1 - k0)) / 40));
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

  // ─── Quả cầu trốn ───

  /** Nhân vật p đang ở trong quả cầu (trốn hoặc đang vỡ ra): ẩn, không điều khiển, gà không thấy, không bị đánh */
  trongCau(p: number): boolean {
    return p >= 0 && this.cauTron.some((q) => q.p === p && (q.pha === 'trong' || q.pha === 'vo'));
  }

  /** Gà không thấy / không đánh được nhân vật này: đã gục, đang là mây hoặc đang trốn trong quả cầu */
  private khuat(n: NguoiChoi): boolean {
    const p = this.nguoi.indexOf(n);
    return n.het || n.nv.laMay || this.trongCau(p) || this.trongMb(p);
  }

  // Chạm quả cầu thì chui vào; trong cầu hồi máu tới đầy bình, đầy mana; hết CAU_TRON giây thì vỡ ra (hoạt ảnh) và thả nhân vật ra đúng chỗ đó
  private capNhatCau(dt: number): void {
    for (const q of this.cauTron) {
      q.t += dt;
      if (q.pha === 'san') {
        const p = this.nguoi.findIndex((n, i) => i === q.cua && !n.vang && !n.het && !n.nv.laMay && !n.bay && !n.nv.khoa && !this.trongCau(i) && !this.trongMb(i)
          && Math.hypot(n.x - q.x, (n.y - q.y) / EP_GA) < CAU_BAN_KINH);
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
  cauHinh(q: CauTron): { khung: number; a: number; lac: number; rungX: number; con: number | null } {
    const hang = q.cua * 6;
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

  // nguoiThang: true = hai nhân vật diệt hết gà mẹ và gà con; false = cả hai nhân vật cùng gục, quái vật thắng
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

  // ─── Điều khiển bằng chuột + Tab (chế độ chuột) ───

  // Phép chiếu từ khung nhìn (toạ độ -SIDE.., -BAR..) ra điểm ảnh CSS của canvas; dùng chung cho vẽ và đọc chuột
  phepChieu(): { s: number; ox: number; oy: number } {
    const s = Math.min(this.cssW / (this.W + 2 * SIDE), this.cssH / (H + BAR));
    return { s, ox: (this.cssW - s * (this.W + 2 * SIDE)) / 2 + SIDE * s, oy: (this.cssH - s * (H + BAR)) / 2 + BAR * s };
  }

  private toaDo(e: MouseEvent): { x: number; y: number } | null {
    if (!this.cssW || !this.cssH) return null;
    const kt = this.canvasEl.getBoundingClientRect();
    const { s, ox, oy } = this.phepChieu();
    return { x: (e.clientX - kt.left - ox) / s, y: (e.clientY - kt.top - oy) / s };
  }

  // Chuột có nằm trên vùng không phải map không: thanh đen trên / hai bên, nửa vòng tròn của gà mẹ và của Mabu / Zinbu
  private tronBang(x: number, y: number): boolean {
    return y < 0 || x < 0 || x > this.W || Math.hypot(x - this.GIUA, y) <= R_BANG * HE_BANG_TUONG
      || [0, 1].some((p) => Math.hypot(x - this.tamNv(p).x, y - this.tamNv(p).y) <= R_NV);
  }

  // Bấm vào nút chiêu thức ở thanh đen thì chọn chiêu đó (chiêu hết mana / đang khoá thì không chọn được)
  private chonNut(x: number, y: number): void {
    for (const p of [0, 1]) {
      const n = this.nutBang(p).find((b) => Math.hypot(b.x - x, b.y - y) <= R_NUT * 0.8 + 6);
      if (n) {
        if (this.hetMana(p, n.k)) return;
        this.nguoi[p].nv.datNhom(n.k, this.t);
        return;
      }
    }
  }

  private diChuot(e: PointerEvent): void {
    if (this.cheDo !== 'chuot') return;
    const pt = this.toaDo(e);
    if (!pt) return;
    this.trenBang = this.tronBang(pt.x, pt.y);
    if (this.trenBang) return;
    const p = this.chuot;
    this.nguoi[p].tamX = pt.x;
    this.nguoi[p].tamY = pt.y;
    if (this.man !== 'play') return;
    // Bấm thêm nút khi nút khác đang giữ: trình duyệt chỉ phát pointermove
    if (e.button === 0 || e.button === 2) this.bamChuot(e);
    else if (e.buttons & 2) this.datDich(p, pt.x, pt.y);
  }

  private bamChuot(e: PointerEvent): void {
    if (this.cheDo !== 'chuot' || this.man !== 'play') return;
    const pt = this.toaDo(e);
    if (!pt) return;
    // Bấm vào bảng chiêu thức: chọn chiêu, không ra đòn / di chuyển
    if (this.tronBang(pt.x, pt.y)) {
      if (e.button === 0 && e.buttons & 1) this.chonNut(pt.x, pt.y);
      return;
    }
    const p = this.chuot;
    if (e.button === 2 && e.buttons & 2) {
      this.datDich(p, pt.x, pt.y);
      return;
    }
    if (e.button !== 0 || !(e.buttons & 1)) return;
    const w = this.manHinhRaThe(pt.x, pt.y);
    this.ban(p, w.x, w.y);
  }

  // Chuột phải: chạy tới điểm đó (xa thì bay)
  private datDich(p: number, x: number, y: number): void {
    const w = this.manHinhRaThe(x, y);
    this.datDichThe(p, w.x, w.y);
  }

  // Chỉ có 1 chuột nên Tab chuyển chuột sang nhân vật kia
  // Phím 1 / 2 / 3 / 4 chọn chiêu thứ 1 / 2 / 3 / 4 (tính từ dưới lên trên, cùng thứ tự nút trên thanh đen) của nhân vật đang dùng chuột
  private phimXuong(e: KeyboardEvent): void {
    // Nhấn Space 5 lần liên tiếp (mỗi lần cách nhau < SPACE_CACH giây): chuyển qua lại giữa chế độ chuột và tay cầm, không hỏi
    if (e.key !== ' ') this.demSpace = 0;
    else if (!e.repeat) {
      const now = performance.now();
      this.demSpace = now - this.spaceLuc <= SPACE_CACH * 1000 ? this.demSpace + 1 : 1;
      this.spaceLuc = now;
      if (this.demSpace >= SPACE_SO_LAN) {
        this.demSpace = 0;
        e.preventDefault();
        this.datCheDo(this.cheDo === 'chuot' ? 'tayCam' : 'chuot');
        this.onManPhu?.();
        return;
      }
    }
    if (this.cheDo !== 'chuot') return;
    if (e.key === 'Tab') {
      e.preventDefault();
      e.stopPropagation();
      if (!e.repeat) this.doiChuot();
      return;
    }
    if (this.man !== 'play' || e.repeat || e.ctrlKey || e.altKey || e.metaKey || !/^[1-4]$/.test(e.key)) return;
    const t = e.target as HTMLElement | null;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return;
    const n = this.nutBang(this.chuot)[Number(e.key) - 1];
    if (!n || this.nguoi[this.chuot].het || this.hetMana(this.chuot, n.k)) return;
    this.nguoi[this.chuot].nv.datNhom(n.k, this.t);
  }

  private doiChuot(): void {
    if (this.soNguoi < 2) return;
    const cu = this.nguoi[this.chuot];
    this.chuot = 1 - this.chuot;
    const moi = this.nguoi[this.chuot];
    moi.tamX = cu.tamX;
    moi.tamY = cu.tamY;
    cu.dich = null;
  }

  // ─── Điều khiển bằng tay cầm (Gamepad API, bố cục kiểu Xbox; mapping "standard") ───
  // Dành cho trẻ em, chỉ các nút đơn giản: Chữ thập: chạy · Cần trái: bay · A đấm · X đá · Y chưởng · B / Cần phải: chiêu riêng
  // Menu: bắt đầu / tạm dừng · View: khi chỉ có 1 tay cầm thì đổi sang điều khiển nhân vật kia

  private docTayCam(): void {
    const ds = this.dsTayCam;
    ds.length = 0;
    if (typeof navigator !== 'undefined' && navigator.getGamepads) {
      for (const g of navigator.getGamepads()) if (g && g.connected) ds.push(g);
    }
    const ten = ds.map((g) => g.id.replace(/\s*\(.*$/, '').slice(0, 40));
    if (ten.join('|') !== this.tayCamTen.join('|')) this.tayCamTen = ten;
    const cu = (g: Gamepad) => this.nutCu.get(g.index) ?? [];
    const duoc = (g: Gamepad, i: number) => !!g.buttons[i]?.pressed;
    const moi = (g: Gamepad, i: number) => duoc(g, i) && !cu(g)[i];

    // Nút bất kỳ vừa bấm (hiện ở màn bắt đầu để biết tay cầm lạ gửi nút số mấy)
    for (const g of ds) {
      const i = g.buttons.findIndex((_, k) => moi(g, k));
      if (i >= 0) this.tayCamNut = `nút ${i}`;
    }

    // Chế độ chuột: không đọc điều khiển từ tay cầm (chỉ giữ tên tay cầm để hiện ở màn bắt đầu)
    const dungTayCam = this.cheDo === 'tayCam';
    // Nút chung cho cả hai tay cầm: bắt đầu / chơi lại / tạm dừng
    for (const g of dungTayCam ? ds : []) {
      if (this.man === 'start' || this.man === 'over') {
        if (this.man === 'start') {
          // Chọn thẻ (trái / phải) chỉ tay cầm 1 (người chơi 1); X / A / B xác nhận thì tay cầm nào cũng được (kể cả màn hướng dẫn)
          if (g.index === ds[0]!.index) {
            const cx = g.axes[0] ?? 0;
            const canMoi = Math.abs(cx) > 0.6 ? Math.sign(cx) : 0;
            const sang = (moi(g, 15) ? 1 : 0) - (moi(g, 14) ? 1 : 0) || (canMoi && canMoi !== this.menuCanCu ? canMoi : 0);
            this.menuCanCu = canMoi;
            if (sang) this.menuChon = Math.max(0, Math.min(2, this.menuChon + sang));
          }
          // X: đánh dấu thẻ ở màn chọn chế độ · A / Menu: Tiếp / Vào chơi ở màn hướng dẫn · B: xác nhận / quay lại
          if (moi(g, 2)) this.onNutX();
          else if (moi(g, 0) || moi(g, 9)) this.onNutBatDau();
          else if (moi(g, 1)) this.onNutQuay();
        } else {
          // Màn kết thúc: bấm X trước rồi bấm B mới chơi lại, tránh lỡ tay chơi lại ngay
          if (moi(g, 2)) this.choiLaiChoB = true;
          else if (moi(g, 1) && this.choiLaiChoB) { this.choiLaiChoB = false; this.batDau(); }
        }
      } else if (moi(g, 9)) this.tamDung();
      else if (moi(g, 8) && ds.length === 1 && this.man === 'play') this.doiTayCam();
    }

    // Tay cầm nào điều khiển nhân vật nào: giữ cố định theo chỉ số tay cầm, tay cầm 1 rút ra thì tay cầm 2 vẫn là Zinbu
    const gan: (Gamepad | undefined)[] = [undefined, undefined];
    if (dungTayCam) {
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
    }
    this.dangGan = gan.map((g) => g?.index ?? -1);
    for (const p of [0, 1]) {
      const n = this.nguoi[p];
      const g = gan[p];
      if (this.man !== 'play' || !g) {
        // Chế độ chuột: dịch chuyển do chuột đặt (n.dich), không xoá ở đây
        if (dungTayCam && n.cuaCan) n.dich = null;
        n.cuaCan = false;
        n.ngam = null;
        continue;
      }
      // Chữ thập: chạy. Cần trái: bay (gạt hướng nào bay hướng đó). Cần phải: chiêu riêng (Mabu biến mây, Zinbu biến socola)
      const dx = (duoc(g, 15) ? 1 : 0) - (duoc(g, 14) ? 1 : 0);
      const dy = (duoc(g, 13) ? 1 : 0) - (duoc(g, 12) ? 1 : 0);
      const bay = this.canGat(g, 0, 1, VUNG_BAY_CAN);
      const phai = this.canGat(g, 2, g.mapping === 'standard' || g.axes.length < 6 ? 3 : 5);
      // Cần trái gạt nhẹ (chưa tới ngưỡng bay) thì chạy theo hướng gạt; chữ thập vẫn ưu tiên
      const canNhe = this.canGat(g, 0, 1);
      const chay = dx || dy ? { x: dx, y: dy, m: Math.hypot(dx, dy) } : canNhe;
      // Hướng nhìn theo hướng đang bay / chạy; không có điều khiển nào thì giữ nguyên
      const huong = bay.m > 0 ? bay : chay;
      if (huong.m > 0) n.nhin = { x: huong.x / huong.m, y: huong.y / huong.m };
      n.ngam = null;

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

      // Ra đòn: giữ nút thì đánh liên tục theo thời gian hồi chiêu. A đấm · X đá · Y chưởng · B hoặc cần phải: chiêu riêng
      const nhom = duoc(g, 1) || phai.m > 0 || duoc(g, 11) ? NHOM_MAY : duoc(g, 3) ? 2 : duoc(g, 2) ? 1 : duoc(g, 0) ? 0 : -1;
      if (nhom >= 0) this.dungChieu(p, nhom);
    }
    // Lưu trạng thái nút ở khung này để lần sau biết nút nào mới bấm
    const luu = new Map<number, boolean[]>();
    for (const g of ds) luu.set(g.index, g.buttons.map((b, i) => b.pressed || (i === 6 || i === 7) && b.value > 0.5));
    this.nutCu = luu;
  }

  // Cần analog có vùng chết; trả hướng (đã co giãn) và độ lớn m (0 = đang nằm yên)
  private canGat(g: Gamepad, ax: number, ay: number, vung = VUNG_CHET_CAN): { x: number; y: number; m: number } {
    const x = g.axes[ax] ?? 0;
    const y = g.axes[ay] ?? 0;
    const m = Math.hypot(x, y);
    return m < vung ? { x: 0, y: 0, m: 0 } : { x, y, m };
  }

  /** Rung tay cầm của nhân vật p (bị đánh / gục); bỏ qua nếu tay cầm không hỗ trợ, không đè nhau */
  private rungTayCam(p: number, ms: number, manh: number): void {
    if (this.cheDo !== 'tayCam' || p < 0 || this.t < this.rungLan[p]) return;
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
    if (n.het || n.may.dang || this.trongCau(p)) return;
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
    const len = Math.hypot(n.nhin.x, n.nhin.y) || 1;
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
      const d = Math.hypot(dx, dy) - (g.loai === 'boss' ? 125 : 0);
      if (d >= dm || (dx * ux + dy * uy) / (Math.hypot(dx, dy) || 1) < 0.7) continue;
      dm = d;
      tot = g;
    }
    if (tot) {
      const t = this.tamGa(tot);
      return { x: t.x, y: t.y };
    }
    const xa = nhomSoc ? 500 : n.nv.nhom === 2 ? 600 : 250;
    return { x: n.x + ux * xa, y: n.y + uy * xa - 60 };
  }

  // Chỉ xa thì bay theo vòng cung, gần thì chạy
  /** Bay được khi không bị khoá và còn đủ thể lực */
  coTheBay(n: NguoiChoi): boolean {
    return n.bayKhoa <= 0 && n.mana >= MANA_TOI_THIEU;
  }

  /** Mana hiện có (số hiển thị giữa bình mana) */
  manaNv(p: number): number {
    return Math.floor(this.nguoi[p].mana);
  }

  /** 0..1: độ đầy của bình mana (so với max(MANA_TOI_DA, mana hiện có)) */
  nlBay(p: number): number {
    return Math.min(1, this.nguoi[p].mana / Math.max(MANA_TOI_DA, this.nguoi[p].mana));
  }

  private datDichThe(p: number, x: number, y: number): void {
    const n = this.nguoi[p];
    // Trên máy bay: chỉ phi công (người lên trước) lái, điều khiển di chuyển bình thường đặt điểm đến của máy bay; hành khách không lái được
    if (this.trongMb(p)) {
      const m = this.mayBay;
      if (m.ngoi[0] === p && m.pha === 'bay') n.dich = { x: kep(x, TG.x0 + MB_LE, TG.x1 - MB_LE), y: kep(y, TG.y0 + MB_LE, TG.y1 - MB_LE) };
      return;
    }
    if (n.nv.khoa || n.bay || n.het || this.trongCau(p)) return;
    const o = this.nguoi[1 - p];
    const le = leNhanVat(n.nv.heSoTo);
    // Dây buộc chỉ áp khi người kia có mặt (chơi 1 người thì không bị giữ quanh nhân vật vắng mặt)
    let dich = o.vang ? { x, y } : {
      x: kep(x, o.x - MAX_DX, o.x + MAX_DX),
      y: kep(y, o.y - MAX_DY, o.y + MAX_DY),
    };
    giuTrongMap(dich, le, false, vungCua(n));
    let d = Math.hypot(dich.x - n.x, dich.y - n.y);
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

  private manHinhRaThe(x: number, y: number) {
    const o = this.gocView();
    return { x: (x - o.x) / this.camZ, y: (y - o.y) / this.camZ };
  }

  // Tự ngắm vào con gà gần nhất trong tầm; không có thì đánh theo hướng đang nhìn
  private diemNham(p: number): { x: number; y: number; co: boolean } {
    const n = this.nguoi[p];
    const tam = n.nv.nhom === NHOM_MAY && !n.nv.sp.nhomDon[NHOM_MAY]?.may ? TAM_SOCOLA : n.nv.nhom === 2 ? 800 : n.nv.nhom === 1 ? 480 : 380;
    let tot: Ga | null = null;
    let dm = tam;
    for (const g of this.ga) {
      if (g.chet) continue;
      const t = this.tamGa(g);
      // Gà tướng rất to: tính khoảng cách tới mép thân chứ không phải tới tâm
      const d = Math.hypot(t.x - n.x, t.y - n.y) - (g.loai === 'boss' ? 125 : 0);
      if (d < dm) {
        dm = d;
        tot = g;
      }
    }
    if (tot) {
      const t = this.tamGa(tot);
      return { x: t.x, y: t.y, co: true };
    }
    return { x: n.x + n.nhin.x * 300, y: n.y + n.nhin.y * 300 - 60, co: false };
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
    return { x: n.x, y: n.y - (n.nv.cao - n.nv.nhun) * S_NV - (p === 0 ? 195 : 150) };
  }

  // Thanh máu trên đầu gà tướng (to hơn của nhân vật vì gà tướng cao gấp nhiều lần)
  thanhTuong(g: Ga): { x: number; y: number } {
    // Gà mẹ đang bay (g.h) thì thanh máu nâng theo, vẫn nằm trên đầu
    return { x: g.x, y: g.y - (310 * (g.to ?? 1) - 0) - g.h * EP_GA };
  }

  hpNv(p: number): number {
    return Math.max(0, Math.ceil(this.nguoi[p].hp));
  }

  mauNv(p: number): number {
    return Math.min(1, Math.max(0, this.nguoi[p].hp) / Math.max(HP_NV, this.nguoi[p].hp));
  }


  // Vị trí điểm neo (chân) của sprite nhân vật trên map và hệ số phóng
  nvViTri(p: number): { x: number; y: number; k: number } {
    const n = this.nguoi[p];
    return { x: n.x, y: n.y - (n.nv.cao - n.nv.nhun) * S_NV, k: S_NV * n.nv.heSoTo };
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
    return this.nguoi[p].nv.sp.nhomDon.length > NHOM_MAY ? [0, 2, 1, NHOM_MAY] : [0, 2, 1];
  }

  private viTriTay(p: number) {
    const n = this.nguoi[p];
    const { dx, dy } = n.nv.diemBan;
    return { x: n.x + (n.nv.lat ? -dx : dx) * S_NV, y: n.y + (dy - n.nv.cao) * S_NV };
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

  bongGa(g: Ga): number {
    return Math.max(0.35, 1 - g.h / 400);
  }

  // Thanh máu gà tướng
  maxHpTuong(g: Ga): number {
    return hpToiDa(g);
  }

  danHienTai(d: Dan) {
    const k = Math.min(1, d.t / d.T);
    const k0 = Math.max(0, k - 0.12);
    return {
      x: d.x0 + (d.x1 - d.x0) * k, y: d.y0 + (d.y1 - d.y0) * k,
      xs: d.x0 + (d.x1 - d.x0) * k0, ys: d.y0 + (d.y1 - d.y0) * k0,
    };
  }

  dichNhay(): number {
    return 1 - ((this.t * 2) % 1);
  }

  // ─── Khởi tạo ───

  private taoNguoiChoi(): NguoiChoi[] {
    const mot = this.cheNguoi !== 'ca2';
    const co = this.cheNguoi === 'zinbu' ? 1 : 0;
    return [0, 1].map((p) => ({
      vang: mot && p !== co,
      ten: p === 0 ? MABU.ten : ZINBU.ten, mau: p === 0 ? '#e84393' : '#8e44ad',
      hp: mot && p !== co ? 0 : HP_KHOI_DAU, het: mot && p !== co, diem: 0, combo: 0, tamX: W_MAC_DINH / 2, tamY: 300, hoiChieu: 0, chumDen: 0, banTrung: 0, banTruot: 0,
      x: MAP / 2 + (mot ? 0 : p === 0 ? -160 : 160), y: MAP / 2 + 120, dich: null, dangDi: false,
      nv: this.taoNhanVat(p), bay: null, mana: MANA_BAN_DAU, bayKhoa: 0, thuongLuc: -999, hoiSoc: 0,
      nhin: { x: p === 0 ? 1 : -1, y: 0 }, nham: null, ngam: null, cuaCan: false, may: { dang: false, con: 0, hoi: 0 }, suc: 1,
    }));
  }

  private taoNhanVat(p: number): NhanVat {
    const nv = new NhanVat(p === 0 ? MABU : ZINBU);
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
