import type { KhungSprite } from './sprite';
import { VeCanvas } from './ve-canvas';
import { AmThanh } from './am-thanh';
import { NhanVat } from './nhan-vat-sprite';
import { MABU, ZINBU } from './nhan-vat-du-lieu';
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
  lan?: number; chieu?: ChieuTuong | null; hoiLao?: number; hoiBay?: number;
  mau?: MauTuong | null; conMau?: number; hoiMau?: number; luotMau?: number; dot?: number;
  // Gà mẹ GỐC (đánh dấu khác biệt): chỉ con này đẻ trứng, chỉ sống sót chứ không đi đánh; gà mẹ phụ (nở từ trứng đỏ) mới đi đánh. deDb = đếm ngược tới quả trứng đỏ kế tiếp
  goc?: boolean;
  // Gà mẹ đang bị biến thành socola: số giây còn lại (đứng yên, không né, không đánh)
  socola?: number; comboSoc?: boolean;
  // Gà con nở từ trứng đỏ: sức mạnh (nhân máu và sát thương) và độ to (nhân kích thước)
  suc?: number; to?: number; db?: boolean;
  // Gà mẹ phụ: kiểu chuyên (0 Lao · 1 Bay · 2 đen · 3 vàng · 4 đỏ), cũng là màu riêng của con đó
  kieuPhu?: number;
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
}
/** soc = chưởng biến socola của Zinbu · troi = chưởng tự bắn lên trời (chỉ để đẹp, không gây sát thương) */
interface Dan { id: number; p: number; /** nhóm đòn đã ra (0 Đấm · 1 Đá · 2 Chiêu đặc biệt) */ nhom?: number; /** chưởng xuyên: id các gà đã trúng trên đường bay */ da?: number[]; x0: number; y0: number; x1: number; y1: number; t: number; T: number; phu: boolean; to: boolean; sat: number; soc?: boolean; troi?: boolean; }
/** Quả táo rơi từ cây đổ: đỏ = hồi máu, xanh = hồi mana */
/** socola = gà con bị biến thành socola, ăn được +200 máu +200 mana */
export interface VatPham { id: number; x: number; y: number; t: number; loai?: 'do' | 'xanh' | 'socola'; }
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
  /** Mana (một con số, không có trần) chỉ dùng để bay; bayKhoa = giây còn khoá sau mỗi lần bay */
  mana: number; bayKhoa: number;
  /** Khiên tạm: máu vượt trần chuyển thành khiên (hấp thụ sát thương trước máu), mất sau khienCon giây; thuongLuc = tGame lúc bị thương gần nhất (để hồi máu tự nhiên) */
  khien: number; khienCon: number; thuongLuc: number;
  nhin: { x: number; y: number }; nham: { x: number; y: number } | null; ngam: { x: number; y: number } | null; cuaCan: boolean;
  may: { dang: boolean; con: number; hoi: number };
}
type VatXep =
  | { loai: 'ga'; y: number; ga: Ga }
  | { loai: 'nv'; y: number; p: number }
  | { loai: 'td'; y: number; td: TrangTri }
  | { loai: 'cuu'; y: number; cu: Cuu };

/** Cứu đồng đội: nhân vật còn sống phủ mây (Mabu cứu Zinbu) hoặc socola (Zinbu cứu Mabu) lên người ngã; sống sót CUU_THOI_GIAN giây (mây / socola bám theo, nối bằng dây) thì người ngã hồi sinh */
export interface Cuu { p: number; kieu: 'may' | 'socola'; x: number; y: number; cho: number; t: number; tach: number; }

/** Vật trang trí nền cỏ (cây, bụi, đá): chỉ để đẹp, không cản đường. loai là chỉ số trong TRANG_TRI_SPRITE (ve-canvas.ts) */
export interface TrangTri { x: number; y: number; loai: number; lat: boolean; /** thời điểm (`t` của game) bị đánh đổ; chỉ cây (loai 0), chưa đổ thì không có */ doLuc?: number; /** hướng đổ: 1 = sang phải, -1 = sang trái */ huongDo?: number; /** cây đã rơi táo thì biến mất, chỉ còn quả táo */ mat?: boolean }
/** Bán kính (quanh gốc cây) mà đòn / chưởng quét qua thì cây đổ */
const CAY_DO_KINH = 90;
/** Chiều cao thân cây tính từ gốc: đòn trúng trong khoảng này phía trên gốc là trúng cây */
const CAY_DO_CAO = 220;


export const PHIEN_BAN_LUU = 4;
/** Dữ liệu một ván đã lưu: các trường tuỳ ý của game, máy chủ chỉ lưu nguyên khối JSON */
export interface TrangThaiLuu {
  phienBan: number; tGame: number; t: number; chamDen: number; id: number;
  henTuong: number; soLanTuong: number; lanTuong: number;
  ga: Ga[]; trungDe: TrungGa[]; vatPham: VatPham[]; cuu: Cuu[];
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
// Máu: nhân vật và quái đều khởi đầu 100, khác nhau ở sát thương gây ra và tỉ lệ giảm sát thương khi nhận
// HP_NV là TRẦN máu của nhân vật; vào ván chỉ có HP_KHOI_DAU. Máu vượt trần (táo, socola, hạ gà mẹ) chuyển thành khiên tạm (tối đa KHIEN_TOI_DA, mất sau KHIEN_THOI_GIAN giây).
// Không bị thương HP_HOI_CHO giây thì tự hồi HP_HOI máu mỗi giây, nhưng chỉ hồi tới HP_HOI_TOI_DA.
const HP_NV = 300;
const HP_KHOI_DAU = 150;
const HP_HOI = 2;
const HP_HOI_CHO = 5;
const HP_HOI_TOI_DA = 150;
const KHIEN_TOI_DA = 100;
const KHIEN_THOI_GIAN = 5;
const HP_GA = 100;
const GIAM_NV = 0.5;
// Gà mẹ giảm 40% sát thương ngoài thế phòng thủ; mỗi đòn nhận tối đa TUONG_NHAN_TOI_DA (trước khi nhân đôi); lúc sơ hở sát thương nhận ×SO_HO_NHAN
const GIAM_GA: Record<string, number> = { hen: 0, rooster: 0, flyer: 0, boss: 0.4 };
const TUONG_NHAN_TOI_DA = 60;
const SO_HO_NHAN = 2;
// Gà mẹ gốc dưới GD2_MAU máu vào giai đoạn 2: đẻ trứng nhanh hơn (chu kỳ nhân GD2_DE)
const GD2_MAU = 0.5;
const GD2_DE = 0.6;
// Xác suất né đòn (tự động, ngẫu nhiên mỗi đòn trúng): nhân vật 25%, gà mẹ (gà tướng) 50%, gà con 0%
const NE_NV = 0.25;
const NE_GA: Record<string, number> = { hen: 0, rooster: 0, flyer: 0, boss: 0 };
// Sát thương nhân vật gây ra: [Mabu, Zinbu] theo nhóm đòn 0 Đấm · 1 Đá · 2 Chiêu đặc biệt; mây (riêng Mabu)
const SAT_THUONG = [[50, 50], [70, 100], [130, 190]];
const SAT_MAY = 250;
// Chiêu Biến socola (riêng Zinbu, nhóm đòn 3): chưởng bay tới điểm chuột (tối đa TAM_SOCOLA), nổ bán kính BAN_KINH_SOCOLA. Gà con dính thì chết luôn và thành socola; gà mẹ dính sát thương SAT_SOCOLA (như chiêu đặc biệt cũ) rồi hoá socola SOCOLA_THOI_GIAN giây (đứng yên, không né). Hồi SOCOLA_HOI giây.
const SAT_SOCOLA = 150;
const TAM_SOCOLA = 700;
const BAN_KINH_SOCOLA = 260;
const SOCOLA_THOI_GIAN = 5;
const SOCOLA_HOI = 6;
// Ăn socola (nhân vật chạm vào): cộng máu và mana (không có trần), rồi tự bắn chưởng lên trời
const SOCOLA_HOI_MAU = 200;
// Nhân vật ăn socola: hồi ít hơn gà vì có trần (phần vượt trần thành khiên)
const SOCOLA_NV_MAU = 100;
const SOCOLA_NV_MANA = 100;
// Gà (con, mẹ gốc, mẹ phụ) ăn socola: +SOCOLA_HOI_MAU máu, sức mạnh (nhân sát thương) +SOCOLA_SUC_GA, độ to +SOCOLA_TO_GA mỗi thanh; có trần để không to vô hạn
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
const HOI_DANH_GA: Record<string, number> = { hen: 1.2, rooster: 0.8, flyer: 1.5, boss: 2.5 };
// Gà tướng hồi sinh tối đa TUONG_HOI_SINH lần; mỗi lần sau sát thương nhân TUONG_TANG_SAT so với lần trước, tỉ lệ né cộng thêm TUONG_TANG_NE (tối đa NE_TOI_DA)
const TUONG_HOI_SINH = 2;
const TUONG_TANG_SAT = 0.5;
// Gà mẹ không còn né ngẫu nhiên: cứ THE_CHU_KY giây vào "thế phòng thủ" THE_KEO_DAI giây (cộng THE_TANG mỗi lần hồi sinh), trong thế né 100% mọi đòn (hiện chữ "NÉ!", có khiên sáng), ngoài thế thì không né đòn nào
const THE_CHU_KY = 6;
const THE_KEO_DAI = 2;
const THE_TANG = 0.5;
// Chiêu Gọi gà con (mọi gà mẹ): máu dưới GOI_MAU (40%) thì gọi GOI_DAN (cộng thêm 1 con mỗi lần hồi sinh) gà con ra bảo vệ, hồi GOI_HOI giây
const GOI_MAU = 0.4;
const GOI_HOI = 30;
const GOI_DAN: ('hen' | 'rooster' | 'flyer')[] = ['hen', 'hen', 'rooster', 'rooster', 'flyer'];
const GOI_HIEN = 1.2;
// Gà mẹ phụ chuyên một kiểu (xoay vòng theo thứ tự sinh), mỗi kiểu một màu riêng (hue-rotate trên atlas, nhuộm sẵn) và màu thanh máu
const KIEU_PHU = 5;
const MAU_PHU = ['#3fa7ff', '#ffd23f', '#b46bff', '#ff6bd6', '#ff3b30'];
// Nhuộm cả thân theo màu của con đó, chỉ giữ đầu trắng, mỏ và chân (tiền tố "tint:" được ve-canvas.ts nhận ra)
const LOC_PHU = MAU_PHU.map((m) => `tint:${m}`);
// Hồi chiêu riêng của kiểu chuyên: kiểu Lao hồi 8s, kiểu Bay hồi 12s (gà mẹ khác theo LAO_HOI / BAY_HOI)
const LAO_HOI_CHUYEN = 8;
const BAY_HOI_CHUYEN = 12;
const MAU_CHU_KY_CHUYEN = 12;
// Sau mỗi lần Lao / Bay gà mẹ lộ sơ hở SO_HO giây: không né được đòn nào. Giữa 2 chiêu bất kỳ (Lao, Bay, đổi màu) nghỉ ít nhất CHIEU_NGHI_CHUNG giây, và các chiêu không chạy cùng lúc.
const SO_HO = 3;
const CHIEU_NGHI_CHUNG = 4;
// Mỗi lần hồi sinh đẻ thêm 1 trứng, loại theo thứ tự này
const TRUNG_THEM: ('hen' | 'rooster' | 'flyer')[] = ['hen', 'rooster', 'hen'];
// Chiêu Lao: tốc độ thật TOC_LAO_THAT px/s, sát thương gấp LAO_SAT, hồi LAO_HOI giây.
// Chiêu Bay: TOC_BAY_THAT px/s, sát thương gấp BAY_SAT, hồi BAY_HOI giây. Cả hai đi thẳng một đường, trúng mỗi nhân vật một lần, nhân vật vẫn né được.
const TOC_LAO_THAT = 500;
const LAO_SAT = 2;
const LAO_HOI = 15;
const TOC_BAY_THAT = 700;
const BAY_SAT = 3;
const BAY_HOI = 20;
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
// Quả táo: mỗi lần cây đổ có TAO_ROI = 30% rơi 1 quả, đỏ / xanh ngẫu nhiên (50/50). Táo đỏ hồi VP_HOI máu (cộng dồn, tối đa HP_NV), táo xanh hồi VP_HOI mana (VP_HOI = đầy: mọi nhóm đòn và thể lực bay).
// Nhân vật (không phải mây, chưa gục, còn thiếu máu / mana tương ứng) đi vào bán kính VP_BAN_KINH thì nhặt; không ai nhặt sau VP_TON_TAI giây thì biến mất.
const TAO_ROI = 0.3;
const VP_HOI = 100;
// Táo xanh hồi VP_MANA mana (có trần MANA_TOI_DA)
const VP_MANA = 30;
const VP_BAN_KINH = 90;
const VP_GA_BAN_KINH = 60;
const VP_TON_TAI = 45;
// Hai thanh đen hai bên map (chứa chiêu thức và máu của Mabu / Zinbu) rộng SIDE; nửa vòng tròn chứa nhân vật nhô vào map, bán kính R_NV = 2/3 bảng cũ
const SIDE = 75;
const R_NV = (R_BANG * 2) / 3;
const TOC_DO_DI = 460;
const TOC_DO_BAY = 900;
const BAY_KHI_XA = 450;
const BAY_TOI_DA = 1200;
// Mana: bắt đầu MANA_BAN_DAU, trần MANA_TOI_DA. Dùng để bay (MANA_BAY mỗi giây bay), bắn Chiêu đặc biệt (MANA_CHUONG mỗi chưởng) và Biến mây / socola (MANA_DAC_BIET).
// Đấm / Đá trúng thì hồi MANA_DAM. Tự hồi MANA_HOI mỗi giây khi không bay (chỉ hồi tới MANA_HOI_TOI_DA rồi thôi, táo xanh / đòn trúng có thể đẩy cao hơn tới trần); còn dưới MANA_TOI_THIEU thì không bay. Mỗi lần bay xong khoá BAY_KHOA giây mới bay tiếp.
const MANA_BAN_DAU = 200;
const MANA_TOI_DA = 200;
const MANA_HOI_TOI_DA = 100;
const MANA_DAM = 5;
const MANA_CHUONG = 30;
const MANA_DAC_BIET = 40;
const MANA_HOI = 2;
const MANA_BAY = 15;
const MANA_TOI_THIEU = 15;
const BAY_KHOA = 5;
const VUNG_BAY_CAN = 0.6; // cần trái phải gạt mạnh mới bay (tránh bay nhầm)
const BAY_CAN = 600; // mỗi lần gạt cần trái bay một đoạn (xa hơn BAY_KHI_XA)
const VUNG_CHET_CAN = 0.25; // cần analog gạt dưới mức này coi như nằm yên
const TOC_DO_DAN = 2400;
// Chiêu Biến mây (riêng Mabu, nhóm đòn 3): mây to gấp 2, quét trúng mọi con gà nó đi qua. Hiệu lực MAY_THOI_GIAN giây, sau đó chờ MAY_HOI giây mới dùng lại.
// Mana của chiêu này màu tím: khi mây đang chạy là thời gian còn lại, khi chờ là tiến độ hồi.
const NHOM_MAY = 3;
// Bảng chiêu thức: bán kính cung và bán kính mỗi nút
const R_CUNG = 185;
const R_NUT = 30;
// Bảng chiêu gà mẹ (giữa phía trên) thu nhỏ còn 1/3 so với kích thước gốc, tâm vẫn ở mép trên giữa màn hình
const HE_BANG_TUONG = 1 / 3;
const MAY_THOI_GIAN = 7;
const MAY_HOI = 40;
const MAY_TOC_DO = 1.35;
// Vùng mây quét trúng trên mặt đất (bán kính ngang / dọc, đơn vị bản đồ), cộng thêm khi trúng gà tướng to
const MAY_RX = 330;
const MAY_RY = 150;
// Thân mây nằm cao hơn toạ độ chân nên tâm vùng quét nâng lên chừng này
const MAY_NANG = 90;
const MAY_NHAN_TUONG = { x: 150, y: 70 };
// Gà tướng nhiều máu: mây chỉ trừ 1 máu mỗi MAY_NHIP giây
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
const TAM_NHIN_TUONG = TAM_NHIN * 3;
// Tầm gà con phát hiện và lao vào nhân vật = tầm đánh xa nhất (không đổi theo tầm nhìn)
const TAM_LAO = TAM_DANH_XA;
// Gà con ngửi thấy nhân vật trong TAM_NGUI_NV thì đi về phía nhân vật (xu hướng đuổi theo); ngửi thấy táo đỏ trong TAM_NGUI_TAO thì đi tới ăn
const TAM_NGUI_NV = 1500;
const TAM_NGUI_TAO = 500;
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
const CHO_TUONG = 30;
const TOC_DO_TUONG = 60;
// Gà tướng đẻ trứng: mỗi lượt 4 quả thường (2 gà trắng, 1 gà đỏ, 1 gà đen, DAN_TRUNG) rồi quả thứ 5 là trứng đỏ đặc biệt, trứng nở sau TRUNG_NO giây, cách nhau TRUNG_CHO giây.
// Tổng số gà (kể cả gà tướng) + trứng đang ấp đạt GA_TOI_DA thì không đẻ nữa.
const DAN_TRUNG: ('hen' | 'rooster' | 'flyer')[] = ['hen', 'hen', 'rooster', 'flyer'];
const TRUNG_NO = 2;
const TRUNG_CHO = 15;
const GA_TOI_DA = 20;
// Trứng đỏ đặc biệt (do gà mẹ GỐC đẻ: quả thứ 5 của mỗi lượt trứng, cứ TRUNG_CHO giây, không tính vào GA_TOI_DA): to gấp TRUNG_DB_TO lần quả thường, gà mẹ gốc canh quanh nó (TRUNG_DB_BAO_VE).
// Cứ TRUNG_DB_NHIP giây nở một gà con mạnh dần (GA_DB_SUC: sức mạnh nhân máu / sát thương, GA_DB_TO: độ to): 2s gà con thường, 4s x2 to gấp đôi, 6s x3, 8s x4; hết TRUNG_DB_NO giây thì nở ra một gà mẹ phụ (đi đánh thay gà mẹ gốc, không giới hạn số lượng).
const TRUNG_DB_TO = 5;
const TRUNG_DB_NHIP = 2;
const TRUNG_DB_NO = 10;
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

const TEN_DON: Record<string, string> = {
  roll: 'Cuộn tròn', energy_ball: 'Cầu năng lượng',
};

const ngauNhien = (a: number, b: number) => a + Math.random() * (b - a);
const kep = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
// Sát mép bản đồ là dừng hẳn; ngoài mép là vùng đen
const kepMap = (v: number) => kep(v, 0, MAP);

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
      kq.push({ x, y, loai: k < 0.35 ? 0 : k < 0.65 ? 1 : k < 0.85 ? 2 : 3, lat: r() < 0.5 });
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
// Hệ số sát thương của gà tướng theo lần hồi sinh; sát thương gốc của mọi con gà
const heSoLan = (g: Ga) => 1 + TUONG_TANG_SAT * (g.lan ?? 0);
const satGa = (g: Ga) => SAT_GA[g.loai] * (g.loai === 'boss' ? heSoLan(g) : 1) * (g.suc ?? 1);
// Tỉ lệ né của gà: gà tướng tăng dần theo lần hồi sinh
const neGa = (g: Ga) => (g.loai === 'boss' ? ((g.the ?? 0) > 0 && (g.soHo ?? 0) <= 0 && (g.socola ?? 0) <= 0 ? 1 : 0) : NE_GA[g.loai]);
// Chiêu nào gà mẹ dùng được: gà mẹ gốc chỉ có ba màu; gà mẹ phụ theo kiểu chuyên (0 Lao · 1 Bay · 2-4 một màu cố định)
const duocLao = (g: Ga) => !g.goc && (g.kieuPhu === undefined || g.kieuPhu === 0);
const duocBay = (g: Ga) => !g.goc && (g.kieuPhu === undefined || g.kieuPhu === 1);
const dsMauCua = (g: Ga): MauTuong[] => (g.goc ? MAU_TUONG : g.kieuPhu === undefined ? MAU_TUONG : g.kieuPhu >= 2 ? [MAU_TUONG[g.kieuPhu - 2]] : []);
const hoiLaoCua = (g: Ga) => (g.kieuPhu === 0 ? LAO_HOI_CHUYEN : LAO_HOI);
const hoiBayCua = (g: Ga) => (g.kieuPhu === 1 ? BAY_HOI_CHUYEN : BAY_HOI);
// Kẹp vật vào trong bản đồ; trả về cờ chạm mép theo từng trục để vật tự bật lại
function giuTrongMap(o: { x: number; y: number }, le: Le) {
  const x = kep(o.x, le.x, MAP - le.x);
  const y = kep(o.y, le.tren, MAP - le.duoi);
  const r = { cx: x !== o.x, cy: y !== o.y };
  o.x = x;
  o.y = y;
  return r;
}

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
  nguoi: NguoiChoi[] = this.taoNguoiChoi();
  ga: Ga[] = [];
  trungDe: TrungGa[] = [];
  trungView: TrungGa[] = [];
  huongView: { x: number; y: number; goc: number; a: number; mau: string }[] = [];
  dan: Dan[] = [];
  vet: Vet[] = [];
  chu: Chu[] = [];
  long: Long[] = [];
  xep: VatXep[] = [];
  /** Toàn bộ cây / bụi / đá của map (sinh một lần, cố định); chỉ vật trong khung nhìn mới vào `xep` */
  readonly trangTri: TrangTri[] = taoTrangTri();
  gaBayView: Ga[] = [];
  /** Mọi gà mẹ (gốc + phụ) còn sống nằm trong khung nhìn và tầm nhìn: để vẽ thanh máu */
  tuongView: Ga[] = [];
  // Gà mẹ GỐC còn sống (không lọc theo khung nhìn): avatar, số mạng, mũi tên chỉ hướng
  tuongSong: Ga | null = null;
  // Gà mẹ đang đánh (phụ gần nhân vật nhất; chưa có thì gà mẹ gốc): chiêu hiện trên thanh đen phía trên
  tuongBang: Ga | null = null;
  // Vật phẩm máu trên map (vatPhamView: chỉ cái nằm trong khung nhìn)
  vatPham: VatPham[] = [];
  vatPhamView: VatPham[] = [];
  // Cứu đồng đội (cuuView: chỉ cái nằm trong khung nhìn)
  cuu: Cuu[] = [];
  cuuView: Cuu[] = [];
  // Giây hit-stop còn lại và biên độ rung màn hình
  private dungHinh = 0;
  private rungBien = RUNG_BIEN;
  // Vệt đỏ chỉ hướng lúc gà mẹ báo hiệu Lao / Bay (chỉ khi trong khung nhìn)
  vachView: { x1: number; y1: number; x2: number; y2: number; a: number; w?: number }[] = [];
  // Lần hồi sinh của gà tướng gần nhất (để bảng vẫn hiện khi chờ hồi sinh)
  lanTuong = 0;
  private soLanTuong = 0;
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
  // Chế độ điều khiển (chọn ở màn bắt đầu, nhớ lại lần sau)
  cheDo: CheDo = 'tayCam';
  private demSpace = 0;
  private spaceLuc = 0;
  // Chế độ chuột: người chơi mà chuột đang điều khiển (Tab để đổi) và chuột đang nằm trên bảng chiêu thức (không phải trên map)
  chuot = 0;
  /** Lựa chọn ở màn bắt đầu (nhớ để Chơi lại giữ nguyên) */
  cheNguoi: 'mabu' | 'zinbu' | 'ca2' = 'ca2';
  trenBang = false;
  // Chỉ có 1 tay cầm thì nó điều khiển nhân vật này (nút Share / Select để đổi); có 2 tay cầm thì mỗi tay một nhân vật
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
        this.dpr = Math.min(window.devicePixelRatio || 1, 2);
        const cv = this.canvasEl;
        const pw = Math.max(1, Math.round(kt.width * this.dpr));
        const ph = Math.max(1, Math.round(kt.height * this.dpr));
        if (cv.width !== pw || cv.height !== ph) {
          cv.width = pw;
          cv.height = ph;
        }
      };
      this.ctx = this.canvasEl.getContext('2d');
      this.ve.napTruoc(MABU.atlas, ZINBU.atlas, 'assets/game/map_co.png');
      for (const sp of [GA_TRANG, GA_DO, GA_DEN]) this.ve.nhuomTruoc(sp.atlas, [MAU_SANG, LOC_SOCOLA]);
      this.ve.nhuomTruoc(GA_TUONG.atlas, [MAU_SANG, LOC_BAO, LOC_DEN, LOC_VANG, LOC_DO, LOC_SOCOLA, ...LOC_PHU]);
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
      nghe(window, 'contextmenu', (e: Event) => { if (this.cheDo === 'chuot') e.preventDefault(); }, true);
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
    this.cheNguoi = che;
    this.nguoi = this.taoNguoiChoi();
    this.chonNguoiDau();
    this.ga = [];
    this.dan = [];
    this.vet = [];
    this.chu = [];
    this.long = [];
    this.tGame = 0;
    this.chamDen = 0;
    this.rung = 0;
    this.trungDe = [];
    this.vatPham = [];
    this.cuu = [];
    this.dungHinh = 0;
    this.henTuong = CHO_TUONG_DAU;
    this.soLanTuong = 0;
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
      phienBan: PHIEN_BAN_LUU,
      tGame: this.tGame, t: this.t, chamDen: this.chamDen, id: this.id,
      henTuong: this.henTuong, soLanTuong: this.soLanTuong, lanTuong: this.lanTuong,
      ga: this.ga, trungDe: this.trungDe, vatPham: this.vatPham, cuu: this.cuu,
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
    this.batDau();
    this.tGame = d.tGame; this.t = d.t; this.chamDen = d.chamDen; this.id = d.id;
    this.henTuong = d.henTuong; this.soLanTuong = d.soLanTuong; this.lanTuong = d.lanTuong;
    this.ga = d.ga; this.trungDe = d.trungDe; this.vatPham = d.vatPham; this.cuu = d.cuu ?? [];
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

  /** Số gà tính vào GA_TOI_DA: không tính gà mẹ phụ và gà / trứng của trứng đỏ (không giới hạn) */
  private demGaThuong(): number {
    return this.ga.filter((g) => !g.chet && !laMePhu(g) && !g.db).length + this.trungDe.filter((e) => !e.db).length;
  }

  // Thắng khi gà mẹ đã dùng hết mạng (đã hồi sinh đủ lần và chết) và không còn gà con nào, kể cả trứng chưa nở
  private kiemTraThang(): void {
    if (this.soLanTuong > TUONG_HOI_SINH && !this.ga.some((g) => !g.chet) && !this.trungDe.length) this.ketThuc(true);
  }

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
    this.am.nhacNen(this.man === 'play');
    if (this.ctx) this.ve.ve(this.ctx, this, this.dpr);
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

    this.capNhatTrungGa(dt);
    this.henTuong -= dtE;
    if (this.henTuong <= 0) {
      if (this.ga.some((g) => g.goc && !g.chet)) this.henTuong = 10;
      else if (this.soLanTuong <= TUONG_HOI_SINH) {
        this.sinhTuong();
        this.henTuong = CHO_TUONG;
      } else this.henTuong = 10;
    }
    const truoc = this.nguoi.map((n) => ({ x: n.x, y: n.y }));
    this.dieuKhien(dt);
    this.rangBuoc(truoc);
    this.nguoi.forEach((n) => giuTrongMap(n, leNhanVat(n.nv.heSoTo)));
    this.nguoi.forEach((n, p) => this.mayQuet(n, p));
    this.capNhatGa(dtE);
    this.gaDanhNguoi();
    this.capNhatDan(dt);
    this.capNhatCuu(dt);
    this.capNhatVatPham(dt);
    this.anGaSocola();
    this.capNhatHieuUng(dt, dtE);
    if (this.man === 'play') this.kiemTraThang();
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
  private capNhatVatPham(dt: number): void {
    const conLai: VatPham[] = [];
    for (const v of this.vatPham) {
      v.t += dt;
      if (v.t >= VP_TON_TAI) continue;
      const xanh = v.loai === 'xanh';
      const n = this.nguoi.find((m) => !m.het && !m.nv.laMay && Math.hypot(m.x - v.x, m.y - v.y) < VP_BAN_KINH);
      if (n) {
        this.am.phat('anTao');
        if (v.loai === 'socola') {
          this.anSocola(n);
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
          // Ăn socola: +SOCOLA_HOI_MAU máu, sức mạnh và độ to tăng theo
          ga.hp += SOCOLA_HOI_MAU;
          ga.suc = Math.min(SOCOLA_SUC_TOI_DA, (ga.suc ?? 1) + SOCOLA_SUC_GA);
          ga.to = Math.min(ga.loai === 'boss' ? SOCOLA_TO_TOI_DA_ME : SOCOLA_TO_TOI_DA, (ga.to ?? 1) + SOCOLA_TO_GA);
          this.chu.push({ id: this.id++, x: ga.x, y: this.tamGa(ga).y - 60, text: `🍫 +${SOCOLA_HOI_MAU} ❤ SỨC MẠNH x${ga.suc}`, mau: '#c98a4b', t: 0 });
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

  // Socola: hồi máu và mana (có trần, máu thừa thành khiên), mở khoá bay, rồi tự bắn chưởng lên trời
  private anSocola(n: NguoiChoi): void {
    this.hoiMau(n, SOCOLA_NV_MAU);
    this.hoiMana(n, SOCOLA_NV_MANA);
    n.bayKhoa = 0;
    this.chu.push({ id: this.id++, x: n.x, y: n.y - 250, text: `🍫 +${SOCOLA_NV_MAU} ❤ +${SOCOLA_NV_MANA} mana`, mau: '#c98a4b', t: 0 });
    this.chuongLenTroi(this.nguoi.indexOf(n));
  }

  // Gà con nở từ trứng đỏ đang hoá socola: nhân vật chạm vào là ăn (nhận như thanh socola), con gà biến mất và tính như hạ gà
  private anGaSocola(): void {
    for (const g of this.ga) {
      if (g.chet || g.loai === 'boss' || (g.socola ?? 0) <= 0) continue;
      const p = this.nguoi.findIndex((m) => !m.het && !m.nv.laMay && Math.hypot(m.x - g.x, m.y - g.y) < VP_BAN_KINH);
      if (p < 0) continue;
      this.anSocola(this.nguoi[p]);
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

  private themVatPham(x: number, y: number): void {
    const v = { x, y };
    giuTrongMap(v, LE_VP);
    this.vatPham.push({ id: this.id++, x: v.x, y: v.y, t: 0, loai: Math.random() < 0.5 ? 'do' : 'xanh' });
  }

  // Táo xanh: cộng VP_MANA mana (tối đa MANA_TOI_DA) và mở khoá bay
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
      // Khiên tạm hết hạn; không bị thương một lúc thì tự hồi máu chậm (chỉ tới HP_HOI_TOI_DA)
      n.khienCon = Math.max(0, n.khienCon - dt);
      if (n.khienCon <= 0) n.khien = 0;
      if (!n.het && n.hp < HP_HOI_TOI_DA && this.tGame - n.thuongLuc >= HP_HOI_CHO) n.hp = Math.min(HP_HOI_TOI_DA, n.hp + HP_HOI * dt);
      if (n.bay) n.mana = Math.max(0, n.mana - MANA_BAY * dt);
      else if (n.mana < MANA_HOI_TOI_DA) n.mana = Math.min(MANA_HOI_TOI_DA, n.mana + MANA_HOI * dt);

      // Tâm ngắm chỉ có ở chế độ chuột (nhân vật không dùng chuột thì tự ngắm); chế độ tay cầm không có tâm, đánh theo hướng đang quay mặt
      const m = this.diemNham(p);
      n.nham = this.cheDo !== 'chuot' || n.het || n.nv.laMay || p === this.chuot ? null : n.ngam ?? (m.co ? { x: m.x, y: m.y } : null);

      if (n.nv.khoa) {
        n.dich = null;
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
        n.x = kepMap(n.x + (dx / d) * buoc);
        n.y = kepMap(n.y + (dy / d) * buoc);
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
    if (truot) n.x = kepMap(n.x + truot * S_NV);
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
        giuTrongMap(g, leCuaGa(g));
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
          if (!g.chieu) g.de = (g.de ?? 0) - dt;
          // Giai đoạn 2: máu dưới GD2_MAU thì đẻ trứng nhanh hơn
          if (!g.gd2 && g.hp < HP_GA * GD2_MAU) {
            g.gd2 = true;
            g.de = Math.min(g.de ?? 0, 1.5);
            this.chu.push({ id: this.id++, x: g.x, y: g.y - 400, text: '🔥 GIAI ĐOẠN 2!', mau: '#ff6a3c', t: 0 });
          }
          if ((g.de ?? 0) <= 0) {
            g.de = g.gd2 ? TRUNG_CHO * GD2_DE : TRUNG_CHO;
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
        if (g.hp < HP_GA * GOI_MAU && g.hoiGoi <= 0 && !g.chieu) this.goiGaCon(g);
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
      const cham = giuTrongMap(g, leCuaGa(g));
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
      if (this.trungGa(g, d.p, d.sat, 2)) this.dungKhung(0.03);
    }
  }

  // Đòn / chưởng bay tới đâu thì cây dọc đường bay đổ tới đó (quét đoạn từ lần cập nhật trước tới giờ)
  private danDoCay(d: Dan, t0: number): void {
    const k0 = Math.min(1, t0 / d.T), k1 = Math.min(1, d.t / d.T);
    const ax = d.x0 + (d.x1 - d.x0) * k0, ay = d.y0 + (d.y1 - d.y0) * k0;
    const bx = d.x0 + (d.x1 - d.x0) * k1, by = d.y0 + (d.y1 - d.y0) * k1;
    const ex = bx - ax, ey = by - ay, e2 = ex * ex + ey * ey;
    // Thân cây cao (vẽ phía trên gốc) nên đánh vào thân / tán cũng đổ: hộp quanh thân, rộng CAY_DO_KINH, từ CAY_DO_CAO phía trên gốc xuống dưới gốc một chút. Lấy mẫu dọc đường bay để không bỏ sót.
    const r = CAY_DO_KINH * (d.to ? 1.4 : 1);
    const buoc = Math.max(1, Math.ceil(Math.sqrt(e2) / 30));
    for (const c of this.trangTri) {
      if (c.loai !== 0 || c.doLuc !== undefined) continue;
      for (let i = 0; i <= buoc; i++) {
        const px = ax + (ex * i) / buoc, py = ay + (ey * i) / buoc;
        if (Math.abs(px - c.x) > r || py < c.y - CAY_DO_CAO || py > c.y + 40) continue;
        c.doLuc = this.t;
        const dx = d.x1 - d.x0;
        c.huongDo = Math.abs(dx) > 20 ? Math.sign(dx) : c.lat ? -1 : 1;
        // Cây đổ có TAO_ROI cơ hội rơi 1 quả táo; rơi táo thì cây biến mất, chỉ còn quả táo ở gốc
        if (Math.random() < TAO_ROI) {
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
    if (g) {
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

  // Chiêu đặc biệt: nổ trúng mọi con gà trong bán kính
  private no(d: Dan): void {
    const trung = this.ga.filter((g) => {
      if (g.chet || d.da?.includes(g.id)) return false;
      const tam = this.tamGa(g);
      return Math.hypot(tam.x - d.x1, tam.y - d.y1) < BAN_KINH_NO;
    });
    trung.forEach((g) => this.trungGa(g, d.p, d.sat, 2));
    this.vet.push({ id: this.id++, x: d.x1, y: d.y1, t: 0, loai: 'no' });
    this.vet.push({ id: this.id++, x: d.x1, y: d.y1, t: 0, loai: 'chay', co: 0.9 });
    this.rungMan(0.15, 9);
    this.dungKhung(0.05);
    if (!trung.length && !d.da?.length) {
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
    if (!trung.length) {
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
    g.hp = 0;
    g.chet = true;
    g.tChet = 1;
    this.vet.push({ id: this.id++, x: g.x, y: tam.y, t: 0, loai: 'chay', co: 0.7 });
    const v = { x: g.x, y: g.y };
    giuTrongMap(v, LE_VP);
    this.vatPham.push({ id: this.id++, x: v.x, y: v.y, t: 0, loai: 'socola' });
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
    if (!n || n.vang || n.het || n.nv.laMay) return;
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
    const song = this.nguoi.filter((n) => !n.het);
    if (this.man !== 'play' || !song.length) return kq;
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
      if (trong(x, y, 150)) this.xTrungView.push({ x, y, con: Math.max(0, Math.ceil(TRUNG_DB_NO - trung.t)) });
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
    const ty = (a.y + b.y) / 2;
    const dx = Math.abs(a.x - b.x);
    const dy = Math.abs(a.y - b.y);
    const tz = kep(Math.min(ZOOM, dx > 1 ? VUNG_X / dx : ZOOM, dy > 1 ? VUNG_Y / dy : ZOOM), ZOOM_MIN, ZOOM);
    const kv = ngay ? 1 : 1 - Math.exp(-dt * 6);
    const kz = ngay ? 1 : 1 - Math.exp(-dt * 3);
    this.camX += (tx - this.camX) * kv;
    this.camY += (ty - this.camY) * kv;
    this.camZ += (tz - this.camZ) * kz;
    // Camera không ra khỏi bản đồ: chạm mép map thì mép đó nằm đúng mép màn hình, không lộ vùng đen
    const zc = this.camZ;
    this.camX = kep(this.camX, this.W / 2 / zc, MAP - this.W / 2 / zc);
    this.camY = kep(this.camY, TAM_VIEW_Y / zc, MAP - (H - TAM_VIEW_Y) / zc);

    const z = this.camZ;
    const trong = (x: number, y: number, le: number) =>
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
    // Người đang được mây / socola phủ lên thì thân được thay bằng mây / socola (cuuView)
    this.cuuView = this.cuu.filter((c) => trong(c.x, c.y, 500));
    for (const c of this.cuuView) xep.push({ loai: 'cuu', y: c.y, cu: c });
    this.nguoi.forEach((n, i) => { if (!n.vang && !this.dangCuu(i) && trong(n.x, n.y, n.nv.laMay ? 600 : 200)) xep.push({ loai: 'nv', y: n.y, p: i }); });
    for (const t of this.trangTri) if (!t.mat && trong(t.x, t.y, 400)) xep.push({ loai: 'td', y: t.y, td: t });
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
    return { x: kepMap(n.x + Math.cos(goc) * r), y: kepMap(n.y + Math.sin(goc) * r) };
  }

  // Gà tướng đẻ một lượt trứng quanh mình, trừ khi tổng số gà đã đủ GA_TOI_DA
  private deTrung(boss: Ga): void {
    this.am.phat('deTrung');
    if (this.demGaThuong() < GA_TOI_DA) {
      const dan = [...DAN_TRUNG, ...TRUNG_THEM.slice(0, boss.lan ?? 0)];
      for (const loai of dan) {
        this.trungDe.push({
          id: this.id++, loai, t: 0,
          x: kepMap(boss.x + ngauNhien(-110, 110)), y: kepMap(boss.y + ngauNhien(-60, 90)),
        });
      }
    }
    // Quả thứ 5 của mỗi lượt là trứng đỏ đặc biệt (không tính vào GA_TOI_DA)
    this.deTrungDb(boss);
  }

  // Trứng nở thành gà sau TRUNG_NO giây
  private capNhatTrungGa(dt: number): void {
    const conLai: TrungGa[] = [];
    for (const e of this.trungDe) {
      e.t += dt;
      if (e.db) {
        // Trứng đỏ: cứ TRUNG_DB_NHIP giây nở một gà con mạnh dần, hết TRUNG_DB_NO giây thì nở ra gà mẹ phụ
        const nhip = Math.min(GA_DB_SUC.length, Math.floor(e.t / TRUNG_DB_NHIP));
        for (let k = e.no ?? 0; k < nhip; k++) this.nuaGaDb(e, k);
        e.no = Math.max(e.no ?? 0, nhip);
        if (e.t < TRUNG_DB_NO) conLai.push(e);
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
      this.ga.push({
        id: this.id++, loai: e.loai, x: e.x, y: e.y, h: 0, h0: bay ? ngauNhien(200, 300) : 0,
        vx: Math.cos(huong) * v, vy: Math.sin(huong) * v, phase: Math.random() * 6, doiHuong: 0,
        chet: false, tChet: 0, lat: Math.cos(huong) < 0, hp: HP_GA, nhay: 0,
      });
      this.vet.push({ id: this.id++, x: e.x, y: e.y, t: 0, loai: 'bui' });
    }
    this.trungDe = conLai;
  }

  private sinhTuong(): void {
    const lan = this.soLanTuong++;
    this.lanTuong = lan;
    const co = this.nguoi.filter((n) => !n.vang);
    const mx = co.reduce((t, n) => t + n.x, 0) / co.length;
    const my = co.reduce((t, n) => t + n.y, 0) / co.length;
    // Xuất hiện ở chỗ ngẫu nhiên trên map, cách cả hai nhân vật ít nhất 2000
    let x = MAP / 2;
    let y = MAP / 2;
    for (let i = 0; i < 30; i++) {
      x = ngauNhien(600, MAP - 600);
      y = ngauNhien(600, MAP - 600);
      if (co.every((n) => Math.hypot(n.x - x, n.y - y) >= 2000)) break;
    }
    this.ga.push(this.taoTuong(x, y, x > mx, lan, true));
    const chuTuong = lan === 0 ? '🐔 GÀ TƯỚNG XUẤT HIỆN!' : `🐔 GÀ TƯỚNG HỒI SINH LẦN ${lan}!`;
    this.chu.push({ id: this.id++, x: mx, y: my - 330, text: chuTuong, mau: '#ff9f1a', t: 0 });
    this.rung = Math.max(this.rung, 0.4);
  }

  // Tạo một gà mẹ: goc = gà mẹ gốc (đẻ trứng, chỉ sống sót) hay gà mẹ phụ (nở từ trứng đỏ, đi đánh)
  private taoTuong(x: number, y: number, lat: boolean, lan: number, goc: boolean, kieuPhu?: number): Ga {
    return {
      id: this.id++, loai: 'boss', x, y, h: 0, h0: 0, vx: 0, vy: 0, phase: 0, doiHuong: 0,
      chet: false, tChet: 0, lat, hp: HP_GA, nhay: 0, de: 0,
      lan, chieu: null, hoiLao: LAO_HOI, hoiBay: BAY_HOI, mau: null, conMau: 0, hoiMau: MAU_CHU_KY, luotMau: 0, dot: 0,
      goc, socola: 0,
      ...(goc ? {} : { daDe: true, choChieu: 1, kieuPhu, hoiLao: 3, hoiBay: 3 }),
    };
  }

  // Gọi gà con ra bảo vệ gà mẹ (không tính vào GA_TOI_DA): GOI_DAN cộng thêm 1 con mỗi lần hồi sinh
  private goiGaCon(g: Ga): void {
    g.hoiGoi = GOI_HOI;
    g.dangGoi = GOI_HIEN;
    const dan = [...GOI_DAN, ...TRUNG_THEM.slice(0, g.lan ?? 0)];
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

  // Gà mẹ gốc đẻ một quả trứng đỏ đặc biệt (không tính vào GA_TOI_DA); mỗi lần chỉ có một quả đang ấp của gà mẹ này
  private deTrungDb(boss: Ga): void {
    if (this.trungDe.some((e) => e.db && e.me === boss.id)) return;
    const x = kepMap(boss.x + ngauNhien(-140, 140));
    const y = kepMap(boss.y + ngauNhien(40, 150));
    this.trungDe.push({ id: this.id++, loai: 'hen', t: 0, x, y, db: true, no: 0, me: boss.id });
    this.chu.push({ id: this.id++, x: boss.x, y: boss.y - 360, text: '🥚 TRỨNG ĐỎ!', mau: '#ff4d4d', t: 0 });
  }

  // Trứng đỏ nở gà con ở nhịp k (0 → gà con thường, 1 → x2 to gấp đôi, 2 → x3, 3 → x4)
  private nuaGaDb(e: TrungGa, k: number): void {
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
    giuTrongMap(g, leCuaGa(g));
    this.ga.push(g);
    this.vet.push({ id: this.id++, x: g.x, y: g.y, t: 0, loai: 'chay', co: 0.6 + 0.2 * k });
    if (k > 0) this.chu.push({ id: this.id++, x: g.x, y: g.y - 160, text: `GÀ CON x${suc}!`, mau: '#ff6a3c', t: 0 });
  }

  // Trứng đỏ nở ra gà mẹ phụ: đi đánh nhân vật thay gà mẹ gốc
  private sinhMePhu(e: TrungGa): void {
    const g = this.taoTuong(e.x, e.y, Math.random() < 0.5, this.lanTuong, false, this.demPhu++ % KIEU_PHU);
    giuTrongMap(g, LE_TUONG);
    this.ga.push(g);
    this.vet.push({ id: this.id++, x: g.x, y: g.y, t: 0, loai: 'chay', co: 2 });
    this.chu.push({ id: this.id++, x: g.x, y: g.y - 360, text: '🐔 GÀ MẸ MỚI RA ĐỜI!', mau: '#ff9f1a', t: 0 });
    this.rung = Math.max(this.rung, 0.3);
  }

  // Thanh socola gần nhất trong tầm ngửi TAM_NGUI_TAO của gà g
  private socolaGan(g: Ga): VatPham | null {
    let kq: VatPham | null = null;
    let xa = TAM_NGUI_TAO;
    for (const v of this.vatPham) {
      if (v.loai !== 'socola') continue;
      const d = Math.hypot(v.x - g.x, v.y - g.y);
      if (d < xa) { xa = d; kq = v; }
    }
    return kq;
  }

  // Gà mẹ gốc không đi đánh: có trứng đỏ đang ấp thì canh quanh quả trứng, không thì chạy trốn nhân vật gần nhất, không ai tới gần thì đi loanh quanh
  private dieuTuongGoc(g: Ga, dt: number): void {
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
      if (n.het || n.nv.laMay) continue;
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

  // Gà tướng: đi về phía người gần nhất, tới gần thì dừng lại
  // Gà thường: có nhân vật trong tầm ngửi (TAM_NGUI_NV) thì đuổi theo nhân vật gần nhất; táo đỏ trong tầm ngửi thì đi ăn. Trả về true nếu đang lao.
  private gaLao(g: Ga, dt: number): boolean {
    let muc: { x: number; y: number } | null = null;
    let gan = TAM_NGUI_NV;
    for (const n of this.nguoi) {
      if (n.het || n.nv.laMay) continue;
      const d = Math.hypot(n.x - g.x, n.y - g.y);
      if (d < gan) { gan = d; muc = n; }
    }
    // Nhân vật chưa vào tầm đánh (TAM_LAO) mà có táo đỏ trong tầm ngửi TAM_NGUI_TAO thì đi tới táo trước
    if (!muc || gan > TAM_LAO) {
      let xa = TAM_NGUI_TAO;
      for (const v of this.vatPham) {
        if (v.loai === 'xanh') continue;
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
      g.the = THE_KEO_DAI + THE_TANG * (g.lan ?? 0);
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
      if (n.het || n.nv.laMay || n.nv.khoa) continue;
      const dx = (n.x - g.x) / DOT_BAN_KINH;
      const dy = (n.y - g.y) / (DOT_BAN_KINH * EP_GA);
      if (dx * dx + dy * dy < 1) this.nhanSatThuong(n, DOT_SAT * DOT_NHIP * heSoLan(g), true, '#ff8a3c');
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
        if (n.het || n.nv.laMay) continue;
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
      if (c.trung[p] || n.het || n.nv.laMay || n.nv.khoa) return;
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
    let muc: NguoiChoi | null = null;
    let gan = TAM_NHIN_TUONG;
    for (const n of this.nguoi) {
      if (n.het || n.nv.laMay) continue;
      const d = Math.hypot(n.x - g.x, n.y - g.y);
      if (d < gan) { gan = d; muc = n; }
    }
    // Nhân vật chưa vào tầm đánh mà có socola trong tầm ngửi thì đi ăn socola trước
    const soc = this.socolaGan(g);
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
  }

  private comboSocolaMay(g: Ga, p: number): void {
    const t = this.tamGa(g);
    const nguong = HP_GA * SOCOLA_MAY_MAT;
    g.hp = g.hp <= nguong ? 0 : g.hp - nguong;
    this.vet.push({ id: this.id++, x: g.x, y: t.y, t: 0, loai: 'chay', co: 1.1 });
    this.chu.push({ id: this.id++, x: t.x + ngauNhien(-40, 40), y: t.y - 90, text: g.hp > 0 ? '🍫☁ -30%!' : '🍫☁ NGHIỀN NÁT!', mau: '#c98a4b', t: 0 });
    this.trungTuong(g, p);
  }

  // Nhóm Đấm: 1 viên, không tốn mana · Đá: 2 viên tản · Chiêu đặc biệt: 1 quả cầu nổ diện rộng. Đá và chiêu tốn 1 mana mỗi lần.
  private ban(p: number, x: number, y: number): void {
    const n = this.nguoi[p];
    if (n.hoiChieu > 0 || n.nv.khoa || n.het) return;
    const nhom = n.nv.nhom;
    // Nhóm 3: Mabu biến mây, Zinbu biến socola
    const nhomMay = !!n.nv.sp.nhomDon[nhom]?.may;
    const soc = nhom === NHOM_MAY && !nhomMay;
    const chieu = nhom === 2 || soc;
    // Chiêu đặc biệt (chưởng) tốn MANA_CHUONG, Biến mây / socola tốn MANA_DAC_BIET; Đấm / Đá miễn phí (còn hồi mana khi trúng)
    const phi = nhom === 2 ? MANA_CHUONG : nhom === NHOM_MAY ? MANA_DAC_BIET : 0;
    if (nhomMay) {
      if (!n.may.dang && n.may.hoi <= 0 && !n.bay && n.mana < phi) return this.thieuMana(n);
      if (this.vaoMay(n)) n.mana -= phi;
      return;
    }
    if (n.may.dang) return;
    if (n.mana < phi) return this.thieuMana(n);
    n.mana -= phi;
    // Thời gian hồi giữa 2 đòn theo nhóm (không phụ thuộc độ dài animation); combo cao thì chưởng hồi nhanh hơn
    const giamHoi = nhom === 2 && n.combo >= COMBO_GIAM_HOI ? COMBO_HOI_CHUONG : 1;
    n.hoiChieu = soc ? SOCOLA_HOI : (chieu ? 0.8 * giamHoi : n.nv.nhom === 1 ? 0.32 : n.dangDi ? 0.3 : 0.2) * 2;
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
    const tanX = n.dangDi ? ngauNhien(-18, 18) : 0;
    const tanY = n.dangDi ? ngauNhien(-14, 14) : 0;
    const lech = [...(n.nv.nhom === 1 ? [-28, 28] : [0]), ...(this.dangChum(p) ? [-70, 70] : [])];
    lech.forEach((dx, i) => {
      const x1 = x + tanX + dx;
      const y1 = y + tanY + Math.abs(dx) * 0.3;
      const T = Math.hypot(x1 - tay.x, y1 - tay.y) / (chieu ? TOC_DO_DAN * 0.55 : TOC_DO_DAN);
      this.dan.push({ id: this.id++, p, x0: tay.x, y0: tay.y, x1, y1, t: 0, T, phu: i > 0, to: chieu && i === 0, sat: soc ? SAT_SOCOLA : SAT_THUONG[nhom][p], soc: soc && i === 0, nhom });
    });
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

  // Đấm, Đá luôn dùng được; Chiêu đặc biệt cần MANA_CHUONG, Biến mây / socola cần MANA_DAC_BIET (Mây còn mờ khi đang chạy / đang hồi)
  hetMana(p: number, k: number): boolean {
    const n = this.nguoi[p];
    if (k === 2) return n.mana < MANA_CHUONG;
    if (k === NHOM_MAY) return n.mana < MANA_DAC_BIET || (!!n.nv.sp.nhomDon[k]?.may && (n.may.dang || n.may.hoi > 0));
    return false;
  }

  tenNhom(p: number): string {
    const nv = this.nguoi[p].nv;
    return nv.nhom === 2 ? TEN_DON[nv.donVong(this.t)] ?? nv.tenNhom : nv.tenNhom;
  }

  // kieu = nhóm đòn (0 Đấm · 1 Đá · 2 Chiêu đặc biệt; bỏ trống cho mây / socola). Trả về true nếu đòn thật sự trúng (không né / miss / phản)
  private trungGa(g: Ga, p: number, sat: number, kieu?: number): boolean {
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
    for (let i = 0; i < 9; i++) {
      this.long.push({
        id: this.id++, x: tam.x, y: tam.y, vx: ngauNhien(-220, 220), vy: ngauNhien(-260, 40),
        xoay: ngauNhien(0, 360), vxoay: ngauNhien(-400, 400), t: 0, mau: MAU_LONG[g.loai],
      });
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

  // Quái chạm nhân vật thì đánh (mỗi con có thời gian chờ riêng). Nhân vật dạng mây, đang ngã hoặc đã hết máu thì bỏ qua.
  private gaDanhNguoi(): void {
    for (const g of this.ga) {
      // Gà mẹ gốc không đi đánh; gà mẹ đang là socola thì đứng yên không đánh
      if (g.chet || g.chieu || g.goc || (g.socola ?? 0) > 0 || (g.choang ?? 0) > 0 || (g.choDanh ?? 0) > this.t) continue;
      for (let p = 0; p < 2; p++) {
        const n = this.nguoi[p];
        if (n.het || n.nv.laMay || n.nv.khoa) continue;
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
    if (!khongNe && Math.random() < NE_NV) {
      this.chu.push({ id: this.id++, x: n.x, y: n.y - 220, text: 'NÉ!', mau: '#9be7ff', t: 0 });
      return;
    }
    let nhan = Math.round(sat * (1 - GIAM_NV));
    n.thuongLuc = this.tGame;
    this.chu.push({ id: this.id++, x: n.x, y: n.y - 220, text: `-${nhan}`, mau: mauChu, t: 0 });
    // Khiên tạm hấp thụ sát thương trước máu
    if (n.khien > 0) {
      const hap = Math.min(n.khien, nhan);
      n.khien -= hap;
      nhan -= hap;
      if (nhan <= 0) return;
    }
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
    n.khien = 0;
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
          giuTrongMap(c, leNhanVat(n.nv.heSoTo));
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
      n.khien = 0;
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

  // ─── Điều khiển bằng tay cầm (Gamepad API, bố cục kiểu PS; mapping "standard") ───
  // Dành cho trẻ em, chỉ các nút đơn giản: Chữ thập: chạy · Cần trái: bay · ✕ đấm · □ đá · △ chưởng · ○ / Cần phải: chiêu riêng
  // Options: bắt đầu / tạm dừng · Share (Select): khi chỉ có 1 tay cầm thì đổi sang điều khiển nhân vật kia

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
        if (moi(g, 0) || moi(g, 9)) this.man === 'start' ? this.onNutBatDau() : this.batDau();
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

      // Ra đòn: giữ nút thì đánh liên tục theo thời gian hồi chiêu. ✕ đấm · □ đá · △ chưởng · ○ hoặc cần phải: chiêu riêng
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
    if (n.het || n.may.dang) return;
    // Chiêu riêng (mây / socola) hết mana hoặc đang hồi thì dùng chiêu kế tiếp còn dùng được: chưởng → đá
    if (k === NHOM_MAY && this.hetMana(p, k)) k = [2, 1].find((j) => !this.hetMana(p, j)) ?? 1;
    if (this.hetMana(p, k) || n.nv.sp.nhomDon.length <= k) return;
    if (n.nv.nhom !== k) n.nv.datNhom(k, this.t);
    const m = this.diemHuong(p);
    this.ban(p, kepMap(m.x), kepMap(m.y));
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

  /** 0..1: độ đầy của bình mana (so với trần MANA_TOI_DA) */
  nlBay(p: number): number {
    return Math.min(1, this.nguoi[p].mana / Math.max(MANA_TOI_DA, this.nguoi[p].mana));
  }

  private datDichThe(p: number, x: number, y: number): void {
    const n = this.nguoi[p];
    if (n.nv.khoa || n.bay || n.het) return;
    const o = this.nguoi[1 - p];
    const le = leNhanVat(n.nv.heSoTo);
    let dich = {
      x: kep(x, o.x - MAX_DX, o.x + MAX_DX),
      y: kep(y, o.y - MAX_DY, o.y + MAX_DY),
    };
    giuTrongMap(dich, le);
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

  // Thanh máu và quả cầu mana nhỏ trên đầu nhân vật (toạ độ thế giới của điểm giữa thanh)
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

  /** Số mạng còn lại của gà mẹ (tổng TUONG_HOI_SINH + 1 mạng; đang chờ hồi sinh thì mạng vừa chết không tính) */
  mangTuong(): number {
    return Math.max(0, this.TUONG_HOI_SINH + 1 - this.lanTuong - (this.tuongSong ? 0 : 1));
  }

  // Vị trí điểm neo (chân) của sprite nhân vật trên map và hệ số phóng
  nvViTri(p: number): { x: number; y: number; k: number } {
    const n = this.nguoi[p];
    return { x: n.x, y: n.y - (n.nv.cao - n.nv.nhun) * S_NV, k: S_NV * n.nv.heSoTo };
  }

  // Bảng chiêu của gà tướng (giữa phía trên, hình bán nguyệt úp): 0 Mổ + đá · 1 Lao · 2 Bay · 3 Đen · 4 Vàng · 5 Đỏ.
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
    if ((g.socola ?? 0) > 0) return LOC_SOCOLA;
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
  get maxHpTuong(): number {
    return HP_GA;
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
      nv: this.taoNhanVat(p), bay: null, mana: MANA_BAN_DAU, bayKhoa: 0, khien: 0, khienCon: 0, thuongLuc: -999,
      nhin: { x: p === 0 ? 1 : -1, y: 0 }, nham: null, ngam: null, cuaCan: false, may: { dang: false, con: 0, hoi: 0 },
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
