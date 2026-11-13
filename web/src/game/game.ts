import type { KhungSprite } from './sprite';
import { VeCanvas } from './ve-canvas';
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
}
type MauTuong = 'den' | 'vang' | 'do';
// Chiêu lao / bay của gà tướng: báo hiệu → chạy thẳng một đường (không đổi hướng) → nghỉ
interface ChieuTuong {
  loai: 'lao' | 'bay'; pha: 'bao' | 'chay' | 'nghi'; t: number; ux: number; uy: number; quang: number; trung: boolean[];
}
// Trứng do gà tướng đẻ: sau TRUNG_NO giây nở ra gà `loai`
export interface TrungGa { id: number; x: number; y: number; t: number; loai: 'hen' | 'rooster' | 'flyer'; }
interface Dan { id: number; p: number; x0: number; y0: number; x1: number; y1: number; t: number; T: number; phu: boolean; to: boolean; sat: number; }
/** Quả táo rơi từ cây đổ: đỏ = hồi máu, xanh = hồi mana */
export interface VatPham { id: number; x: number; y: number; t: number; loai?: 'do' | 'xanh'; }
interface Chu { id: number; x: number; y: number; text: string; mau: string; t: number; }
interface Long { id: number; x: number; y: number; vx: number; vy: number; xoay: number; vxoay: number; t: number; mau: string; }
interface Vet { id: number; x: number; y: number; t: number; loai: 'bui' | 'no'; }
interface ChuyenBay { x0: number; y0: number; x1: number; y1: number; t: number; T: number; }
export interface NguoiChoi {
  ten: string; mau: string; diem: number; combo: number; tamX: number; tamY: number;
  hoiChieu: number; chumDen: number; banTrung: number; banTruot: number;
  x: number; y: number; dich: { x: number; y: number } | null; dangDi: boolean;
  hp: number; het: boolean;
  mana: number[]; khoaMana: number[]; hoiMana: number[]; nv: NhanVat; bay: ChuyenBay | null;
  /** Thể lực bay (giây bay còn lại) và thời gian còn khoá sau mỗi lần bay */
  bayNl: number; bayKhoa: number;
  nhin: { x: number; y: number }; nham: { x: number; y: number } | null; ngam: { x: number; y: number } | null; cuaCan: boolean;
  may: { dang: boolean; con: number; hoi: number };
}
type VatXep =
  | { loai: 'ga'; y: number; ga: Ga }
  | { loai: 'nv'; y: number; p: number }
  | { loai: 'td'; y: number; td: TrangTri };

/** Vật trang trí nền cỏ (cây, bụi, đá): chỉ để đẹp, không cản đường. loai là chỉ số trong TRANG_TRI_SPRITE (ve-canvas.ts) */
export interface TrangTri { x: number; y: number; loai: number; lat: boolean; /** thời điểm (`t` của game) bị đánh đổ; chỉ cây (loai 0), chưa đổ thì không có */ doLuc?: number; /** hướng đổ: 1 = sang phải, -1 = sang trái */ huongDo?: number; /** cây đã rơi táo thì biến mất, chỉ còn quả táo */ mat?: boolean }
/** Bán kính (quanh gốc cây) mà đòn / chưởng quét qua thì cây đổ */
const CAY_DO_KINH = 90;
/** Chiều cao thân cây tính từ gốc: đòn trúng trong khoảng này phía trên gốc là trúng cây */
const CAY_DO_CAO = 220;


export const PHIEN_BAN_LUU = 1;
/** Dữ liệu một ván đã lưu: các trường tuỳ ý của game, máy chủ chỉ lưu nguyên khối JSON */
export interface TrangThaiLuu {
  phienBan: number; tGame: number; t: number; chamDen: number; id: number;
  henTuong: number; soLanTuong: number; lanTuong: number;
  ga: Ga[]; trungDe: TrungGa[]; vatPham: VatPham[];
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
const HP_NV = 200;
const HP_GA = 100;
const GIAM_NV = 0.5;
const GIAM_GA: Record<string, number> = { hen: 0, rooster: 0, flyer: 0, boss: 0.8 };
// Xác suất né đòn (tự động, ngẫu nhiên mỗi đòn trúng): nhân vật 25%, gà mẹ (gà tướng) 50%, gà con 0%
const NE_NV = 0.25;
const NE_GA: Record<string, number> = { hen: 0, rooster: 0, flyer: 0, boss: 0.5 };
// Sát thương nhân vật gây ra: [Mabu, Zinbu] theo nhóm đòn 0 Đấm · 1 Đá · 2 Chiêu đặc biệt; mây (riêng Mabu)
const SAT_THUONG = [[50, 50], [70, 100], [100, 150]];
const SAT_MAY = 250;
// Quái chạm nhân vật thì đánh: sát thương gốc, bán kính chạm (chân với chân), thời gian chờ giữa 2 lần đánh (tốc độ đánh)
const SAT_GA: Record<string, number> = { hen: 32, rooster: 48, flyer: 60, boss: 80 };
const CHAM_GA: Record<string, number> = { hen: 70, rooster: 70, flyer: 70, boss: 220 };
const HOI_DANH_GA: Record<string, number> = { hen: 1.2, rooster: 0.8, flyer: 1.5, boss: 2.5 };
// Gà tướng hồi sinh tối đa TUONG_HOI_SINH lần; mỗi lần sau sát thương nhân TUONG_TANG_SAT so với lần trước, tỉ lệ né cộng thêm TUONG_TANG_NE (tối đa NE_TOI_DA)
const TUONG_HOI_SINH = 3;
const TUONG_TANG_SAT = 0.5;
const TUONG_TANG_NE = 0.15;
const NE_TOI_DA = 0.8;
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
const VP_BAN_KINH = 90;
const VP_TON_TAI = 45;
// Hai thanh đen hai bên map (chứa chiêu thức và máu của Mabu / Zinbu) rộng SIDE; nửa vòng tròn chứa nhân vật nhô vào map, bán kính R_NV = 2/3 bảng cũ
const SIDE = 75;
const R_NV = (R_BANG * 2) / 3;
const TOC_DO_DI = 460;
const TOC_DO_BAY = 900;
const BAY_KHI_XA = 450;
const BAY_TOI_DA = 1200;
// Thể lực bay riêng: đầy = BAY_NL_TOI_DA giây bay, hao theo thời gian bay, hồi BAY_NL_HOI giây-bay mỗi giây; mỗi lần bay xong khoá BAY_KHOA giây mới bay tiếp; còn dưới BAY_NL_TOI_THIEU thì không bay
const BAY_NL_TOI_DA = 2;
const BAY_NL_HOI = 0.2 / 3;
const BAY_NL_TOI_THIEU = 0.3;
const BAY_KHOA = 5;
const VUNG_CHET_CAN = 0.25; // cần analog gạt dưới mức này coi như nằm yên
const TOC_DO_DAN = 2400;
// Mana theo nhóm đòn (0 Đấm · 1 Đá · 2 Chiêu đặc biệt). Đấm không bao giờ hết; 0 nghĩa là vô hạn.
const MANA_TOI_DA = [0, 10, 5];
// Hết sạch mana thì khoá KHOA_MANA giây rồi mới bắt đầu hồi; sau đó cứ HOI_MANA giây hồi 1 lần đánh (hồi cả khi chưa hết sạch)
const KHOA_MANA = 30;
const HOI_MANA = 6;
// Màu quả cầu mana theo nhóm đòn đang dùng: Đấm xanh · Đá cam · Chiêu đặc biệt đỏ
const MAU_MANA = ['#3aa0ff', '#ff9a3c', '#ff2b2b', '#a855f7'];
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
const BAN_KINH_NO = 120;
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
const KHOA_KY_LUC = 'chicken-shooting-game.ky-luc';
const KHOA_CHE_DO = 'chicken-shooting-game.che-do';

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
// Gà tướng đẻ trứng: mỗi lượt TRUNG_SO quả (2 gà trắng, 2 gà đỏ, 1 gà đen), trứng nở sau TRUNG_NO giây, cách nhau TRUNG_CHO giây.
// Tổng số gà (kể cả gà tướng) + trứng đang ấp đạt GA_TOI_DA thì không đẻ nữa.
const DAN_TRUNG: ('hen' | 'rooster' | 'flyer')[] = ['hen', 'hen', 'rooster', 'rooster', 'flyer'];
const TRUNG_NO = 2;
const TRUNG_CHO = 30;
const GA_TOI_DA = 20;
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

const TEN_DON: Record<string, string> = {
  antenna_wide: 'Quất râu quét', roll: 'Cuộn tròn', energy_ball: 'Cầu năng lượng',
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
const leCuaGa = (g: { loai: LoaiGa }): Le => (g.loai === 'boss' ? LE_TUONG : g.loai === 'flyer' ? LE_BAY : LE_GA);
// Hệ số sát thương của gà tướng theo lần hồi sinh; sát thương gốc của mọi con gà
const heSoLan = (g: Ga) => 1 + TUONG_TANG_SAT * (g.lan ?? 0);
const satGa = (g: Ga) => SAT_GA[g.loai] * (g.loai === 'boss' ? heSoLan(g) : 1);
// Tỉ lệ né của gà: gà tướng tăng dần theo lần hồi sinh
const neGa = (g: Ga) => (g.loai === 'boss' ? ((g.soHo ?? 0) > 0 ? 0 : Math.min(NE_TOI_DA, NE_GA.boss + TUONG_TANG_NE * (g.lan ?? 0))) : NE_GA[g.loai]);
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
  tuong: Ga | null = null;
  // Gà tướng còn sống (không lọc theo khung nhìn) cho bảng chiêu ở giữa phía trên
  tuongSong: Ga | null = null;
  // Vật phẩm máu trên map (vatPhamView: chỉ cái nằm trong khung nhìn)
  vatPham: VatPham[] = [];
  vatPhamView: VatPham[] = [];
  // Vệt đỏ chỉ hướng lúc gà mẹ báo hiệu Lao / Bay (chỉ khi trong khung nhìn)
  vachView: { x1: number; y1: number; x2: number; y2: number; a: number }[] = [];
  // Lần hồi sinh của gà tướng gần nhất (để bảng vẫn hiện khi chờ hồi sinh)
  lanTuong = 0;
  private soLanTuong = 0;
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
  cheDo: CheDo = 'chuot';
  // Chế độ chuột: người chơi mà chuột đang điều khiển (Tab để đổi) và chuột đang nằm trên bảng chiêu thức (không phải trên map)
  chuot = 0;
  trenBang = false;
  // Chỉ có 1 tay cầm thì nó điều khiển nhân vật này (nút Share / Select để đổi); có 2 tay cầm thì mỗi tay một nhân vật
  tayCam = 0;
  // Thông tin tay cầm đang kết nối (hiện ở màn bắt đầu) và nút vừa bấm gần nhất (để dò tay cầm lạ)
  tayCamTen: string[] = [];
  tayCamNut = '';
  private nutCu = new Map<number, boolean[]>();
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
      for (const sp of [GA_TRANG, GA_DO, GA_DEN]) this.ve.nhuomTruoc(sp.atlas, [MAU_SANG]);
      this.ve.nhuomTruoc(GA_TUONG.atlas, [MAU_SANG, LOC_BAO, LOC_DEN, LOC_VANG, LOC_DO]);
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

      this.lanCuoi = performance.now();
      this.rafId = requestAnimationFrame(this.vongLap);
    }
  }

  huy(): void {
    cancelAnimationFrame(this.rafId);
    this.goLangNghe.forEach((go) => go());
  }

  // ─── Điều khiển màn chơi ───

  batDau(): void {
    this.nguoi = this.taoNguoiChoi();
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
    this.henTuong = CHO_TUONG_DAU;
    this.soLanTuong = 0;
    this.lanTuong = 0;
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
    try {
      localStorage.setItem(KHOA_CHE_DO, c);
    } catch { /* trình duyệt chặn localStorage */ }
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
      ga: this.ga, trungDe: this.trungDe, vatPham: this.vatPham,
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
    this.ga = d.ga; this.trungDe = d.trungDe; this.vatPham = d.vatPham;
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

  get nguoiThang(): number {
    const [a, b] = this.nguoi;
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
      if (this.man === 'play') this.capNhat(dt);
      else this.nguoi.forEach((n) => this.capNhatNhanVat(n, dt));
      this.capNhatView(dt);
    }
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

    this.capNhatTrungGa(dt);
    this.henTuong -= dtE;
    if (this.henTuong <= 0) {
      if (this.ga.some((g) => g.loai === 'boss' && !g.chet)) this.henTuong = 10;
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
    this.capNhatVatPham(dt);
    this.capNhatHieuUng(dt, dtE);
  }

  // Quả táo: hết hạn thì biến mất, nhân vật chạm vào thì nhặt (đỏ: còn thiếu máu · xanh: còn thiếu mana)
  private capNhatVatPham(dt: number): void {
    const conLai: VatPham[] = [];
    for (const v of this.vatPham) {
      v.t += dt;
      if (v.t >= VP_TON_TAI) continue;
      const xanh = v.loai === 'xanh';
      const n = this.nguoi.find((m) => !m.het && !m.nv.laMay && (xanh ? this.thieuMana(m) : m.hp < HP_NV) && Math.hypot(m.x - v.x, m.y - v.y) < VP_BAN_KINH);
      if (n) {
        if (xanh) {
          this.hoiDayMana(n);
          this.chu.push({ id: this.id++, x: n.x, y: n.y - 220, text: `+${VP_HOI} mana`, mau: '#3aa0ff', t: 0 });
        } else {
          const hoi = Math.min(VP_HOI, HP_NV - n.hp);
          n.hp += hoi;
          this.chu.push({ id: this.id++, x: n.x, y: n.y - 220, text: `+${hoi} ❤`, mau: '#35d96a', t: 0 });
        }
        this.vet.push({ id: this.id++, x: v.x, y: v.y, t: 0, loai: 'bui' });
        continue;
      }
      conLai.push(v);
    }
    this.vatPham = conLai;
  }

  private themVatPham(x: number, y: number): void {
    const v = { x, y };
    giuTrongMap(v, LE_VP);
    this.vatPham.push({ id: this.id++, x: v.x, y: v.y, t: 0, loai: Math.random() < 0.5 ? 'do' : 'xanh' });
  }

  private thieuMana(n: NguoiChoi): boolean {
    return n.mana.some((m, g) => m < MANA_TOI_DA[g]) || n.khoaMana.some((k) => k > 0) || n.bayNl < BAY_NL_TOI_DA || n.bayKhoa > 0;
  }

  // Táo xanh: đầy mana mọi nhóm đòn (mở khoá luôn) và thể lực bay
  private hoiDayMana(n: NguoiChoi): void {
    n.mana = MANA_TOI_DA.map((m) => m);
    n.khoaMana = n.khoaMana.map(() => 0);
    n.hoiMana = n.hoiMana.map(() => 0);
    n.bayNl = BAY_NL_TOI_DA;
    n.bayKhoa = 0;
  }

  private dieuKhien(dt: number): void {
    this.nguoi.forEach((n, p) => {
      n.hoiChieu = Math.max(0, n.hoiChieu - dt);
      this.hoiMana(n, dt);
      this.capNhatMay(n, dt);
      n.bayKhoa = Math.max(0, n.bayKhoa - dt);
      if (n.bay) n.bayNl = Math.max(0, n.bayNl - dt);
      else n.bayNl = Math.min(BAY_NL_TOI_DA, n.bayNl + BAY_NL_HOI * dt);

      // Tâm ngắm cập nhật mỗi khung hình: cần ngắm phải đang gạt thì ngắm theo hướng gạt, không thì tự ngắm; ẩn khi đã ngã hoặc đang là mây
      const m = this.diemNham(p);
      n.nham = n.het || n.nv.laMay || (this.cheDo === 'chuot' && p === this.chuot) ? null : n.ngam ?? (m.co ? { x: m.x, y: m.y } : null);

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
      g.phase += dt;
      const bay = g.loai === 'flyer';
      g.nhay = Math.max(0, g.nhay - dt);
      g.mo = Math.max(0, (g.mo ?? 0) - dt);
      if (g.loai === 'boss') {
        this.capNhatChieuTuong(g, dt);
        // Đang lao / bay thì không đẻ trứng
        if (!g.chieu) g.de = (g.de ?? 0) - dt;
        if ((g.de ?? 0) <= 0) {
          g.de = TRUNG_CHO;
          this.deTrung(g);
          // Mỗi lần xuất hiện / hồi sinh: đẻ lượt đầu rồi chờ trứng nở xong mới được dùng chiêu Lao / Bay
          if (!g.daDe) {
            g.daDe = true;
            g.choChieu = TRUNG_NO;
          }
        }
        g.choChieu = Math.max(0, (g.choChieu ?? 0) - dt);
        this.dieuTuong(g, dt);
      }
      else if (this.gaLao(g, dt)) {
        // đang lao vào nhân vật trong tầm
      } else if (!bay) {
        g.doiHuong -= dt;
        if (g.doiHuong <= 0) {
          g.doiHuong = ngauNhien(1.5, 3.5);
          const goc = ngauNhien(0, Math.PI * 2);
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
      this.danDoCay(d, t0);
      if (d.t < d.T) conLai.push(d);
      else this.chamDich(d);
    }
    this.dan = conLai;
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
    if (d.to) {
      this.no(d);
      return;
    }
    const trungDon = this.ga.filter((v) => {
      if (v.chet) return false;
      const tam = this.tamGa(v);
      return Math.hypot(tam.x - x, tam.y - y) < BAN_KINH_GA * TL_GA[v.loai] * S_GA * 1.25;
    });
    // Gà nhỏ đứng trước mặt gà tướng thì ưu tiên gà nhỏ
    const g = trungDon.find((v) => v.loai !== 'boss') ?? trungDon[0];
    if (g) {
      this.trungGa(g, p, d.sat);
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
      if (g.chet) return false;
      const tam = this.tamGa(g);
      return Math.hypot(tam.x - d.x1, tam.y - d.y1) < BAN_KINH_NO;
    });
    trung.forEach((g) => this.trungGa(g, d.p, d.sat));
    this.vet.push({ id: this.id++, x: d.x1, y: d.y1, t: 0, loai: 'no' });
    this.rung = Math.max(this.rung, 0.15);
    if (!trung.length) {
      this.nguoi[d.p].combo = 0;
      this.nguoi[d.p].banTruot++;
    }
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
    this.vet = this.vet.filter((v) => v.t < 0.45);
  }

  // Góc rung của quả trứng sắp nở
  rungTrung(e: TrungGa): number {
    return e.t > 1 ? Math.sin(e.t * 40) * 12 : 0;
  }

  // Các mũi tên ">" chỉ từ mỗi nhân vật về phía gà tướng; chỉ lấy mũi tên nằm trong khung nhìn
  private huongToiTuong(trong: (x: number, y: number, le: number) => boolean) {
    const kq: { x: number; y: number; goc: number; a: number; mau: string }[] = [];
    const tw = this.ga.find((g) => g.loai === 'boss' && !g.chet);
    const pha = this.tGame % HUONG_CHU_KY;
    if (!tw || this.man !== 'play' || pha > HUONG_HIEN) return kq;
    const a = Math.sin((Math.PI * pha) / HUONG_HIEN) * 0.5;
    // Chỉ nhân vật còn sống và gần gà tướng hơn mới có mũi tên
    const gan = this.nguoi.filter((n) => !n.het).sort((a, b) => Math.hypot(a.x - tw.x, a.y - tw.y) - Math.hypot(b.x - tw.x, b.y - tw.y))[0];
    for (const n of gan ? [gan] : []) {
      const dx = tw.x - n.x;
      const dy = tw.y - n.y;
      const d = Math.hypot(dx, dy);
      if (d < HUONG_GAN) continue;
      const ux = dx / d;
      const uy = dy / d;
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
    const [a, b] = this.nguoi;
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
    this.trungView = this.trungDe.filter((e) => this.thay(e.x, e.y) && trong(e.x, e.y, 100));
    this.huongView = this.huongToiTuong(trong);
    this.nhinNguon = [
      ...this.nguoi.filter((n) => !n.het).map((n) => ({ x: n.x, y: n.y })),
      ...this.dan.map((d) => { const vt = this.danHienTai(d); return { x: vt.x, y: vt.y }; }),
    ];
    const xep: VatXep[] = [];
    for (const g of this.ga) {
      if (g.loai === 'flyer' || !this.thay(g.x, g.y) || !trong(g.x, g.y, g.loai === 'boss' ? 450 : 80)) continue;
      xep.push({ loai: 'ga', y: g.y, ga: g });
    }
    this.nguoi.forEach((n, i) => { if (trong(n.x, n.y, n.nv.laMay ? 600 : 200)) xep.push({ loai: 'nv', y: n.y, p: i }); });
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
    // Chỉ gà tướng có thanh máu trên đầu; chỉ lấy khi nằm trong khung nhìn
    const t = this.ga.find((g) => g.loai === 'boss' && !g.chet);
    this.tuongSong = t ?? null;
    this.vachView = [];
    if (t?.chieu?.pha === 'bao' && this.thay(t.x, t.y)) {
      const c = t.chieu;
      const x2 = t.x + c.ux * c.quang;
      const y2 = t.y + c.uy * c.quang;
      if ([0, 0.25, 0.5, 0.75, 1].some((k) => trong(t.x + (x2 - t.x) * k, t.y + (y2 - t.y) * k, 450))) {
        this.vachView = [{ x1: t.x, y1: t.y, x2, y2, a: 0.25 + 0.2 * Math.abs(Math.sin(c.t * 10)) }];
      }
    }
    this.tuong = t && this.thay(t.x, t.y) && trong(t.x, t.y, 450) ? t : null;
  }

  // Điểm có nằm trong tầm nhìn của nhân vật hoặc chưởng nào không
  private thay(x: number, y: number): boolean {
    return this.nhinNguon.some((o) => Math.hypot(o.x - x, o.y - y) < TAM_NHIN);
  }

  // Dây buộc: 2 nhân vật không xa nhau quá mức camera chứa nổi. Người vừa di chuyển nhiều hơn là người bị chặn lại.
  private rangBuoc(truoc: { x: number; y: number }[]): void {
    const [a, b] = this.nguoi;
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
    if (this.ga.filter((g) => !g.chet).length + this.trungDe.length >= GA_TOI_DA) return;
    const dan = [...DAN_TRUNG, ...TRUNG_THEM.slice(0, boss.lan ?? 0)];
    for (const loai of dan) {
      this.trungDe.push({
        id: this.id++, loai, t: 0,
        x: kepMap(boss.x + ngauNhien(-110, 110)), y: kepMap(boss.y + ngauNhien(-60, 90)),
      });
    }
  }

  // Trứng nở thành gà sau TRUNG_NO giây
  private capNhatTrungGa(dt: number): void {
    const conLai: TrungGa[] = [];
    for (const e of this.trungDe) {
      e.t += dt;
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
    const mx = (this.nguoi[0].x + this.nguoi[1].x) / 2;
    const my = (this.nguoi[0].y + this.nguoi[1].y) / 2;
    // Xuất hiện ở chỗ ngẫu nhiên trên map, cách cả hai nhân vật ít nhất 2000
    let x = MAP / 2;
    let y = MAP / 2;
    for (let i = 0; i < 30; i++) {
      x = ngauNhien(600, MAP - 600);
      y = ngauNhien(600, MAP - 600);
      if (this.nguoi.every((n) => Math.hypot(n.x - x, n.y - y) >= 2000)) break;
    }
    this.ga.push({
      id: this.id++, loai: 'boss', x, y, h: 0, h0: 0, vx: 0, vy: 0, phase: 0, doiHuong: 0,
      chet: false, tChet: 0, lat: x > mx, hp: HP_GA, nhay: 0, de: 0,
      lan, chieu: null, hoiLao: LAO_HOI, hoiBay: BAY_HOI, mau: null, conMau: 0, hoiMau: MAU_CHU_KY, luotMau: 0, dot: 0,
    });
    const chuTuong = lan === 0 ? '🐔 GÀ TƯỚNG XUẤT HIỆN!' : `🐔 GÀ TƯỚNG HỒI SINH LẦN ${lan}!`;
    this.chu.push({ id: this.id++, x: mx, y: my - 330, text: chuTuong, mau: '#ff9f1a', t: 0 });
    this.rung = Math.max(this.rung, 0.4);
  }

  // Gà tướng: đi về phía người gần nhất, tới gần thì dừng lại
  // Gà thường: có nhân vật nằm trong tầm đánh xa nhất (TAM_LAO) thì lao vào nhân vật gần nhất. Trả về true nếu đang lao.
  private gaLao(g: Ga, dt: number): boolean {
    let muc: NguoiChoi | null = null;
    let gan = TAM_LAO;
    for (const n of this.nguoi) {
      if (n.het || n.nv.laMay) continue;
      const d = Math.hypot(n.x - g.x, n.y - g.y);
      if (d < gan) { gan = d; muc = n; }
    }
    if (!muc) return false;
    const dx = muc.x - g.x;
    const dy = muc.y - g.y;
    const d = Math.hypot(dx, dy) || 1;
    const v = g.loai === 'flyer' ? Math.hypot(g.vx, g.vy) || 150 : d > 40 ? TOC_DO_LAO[g.loai] : 0;
    g.vx = (dx / d) * v;
    g.vy = (dy / d) * v;
    g.doiHuong = 0;
    return true;
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
    g.hoiMau = Math.max(0, (g.hoiMau ?? MAU_CHU_KY) - dt);
    // Màu chỉ bật khi đến lượt, không đang Lao / Bay, không đang đổi màu khác và đã nghỉ đủ; chưa bật được thì chờ
    if (g.hoiMau <= 0 && !g.mau && !g.chieu && g.daDe && (g.choChieu ?? 0) <= 0 && (g.nghiChung ?? 0) <= 0) {
      g.hoiMau = MAU_CHU_KY;
      g.mau = MAU_TUONG[(g.luotMau ?? 0) % MAU_TUONG.length];
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
    if (!g.daDe || (g.choChieu ?? 0) > 0 || (g.nghiChung ?? 0) > 0 || g.mau || (g.hoiMau ?? 1) <= 0) return false;
    const sanLao = (g.hoiLao ?? 0) <= 0;
    const sanBay = (g.hoiBay ?? 0) <= 0;
    let loai: 'lao' | 'bay' | null = null;
    if (sanBay && d > CHIEU_XA) loai = 'bay';
    else if (sanLao && d > CHIEU_TOI_THIEU) loai = 'lao';
    else if (sanBay && d > CHIEU_TOI_THIEU) loai = 'bay';
    if (!loai) return false;
    g.chieu = { loai, pha: 'bao', t: 0, ux: 0, uy: 0, quang: 0, trung: [false, false] };
    if (loai === 'lao') g.hoiLao = LAO_HOI;
    else g.hoiBay = BAY_HOI;
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

  // Hồi mana: hết sạch thì khoá rồi mới hồi; mỗi HOI_MANA giây được thêm 1 lần đánh
  private hoiMana(n: NguoiChoi, dt: number): void {
    for (const g of [1, 2]) {
      if (n.khoaMana[g] > 0) {
        n.khoaMana[g] = Math.max(0, n.khoaMana[g] - dt);
        n.hoiMana[g] = 0;
      } else if (n.mana[g] < MANA_TOI_DA[g]) {
        n.hoiMana[g] += dt;
        if (n.hoiMana[g] >= HOI_MANA) {
          n.hoiMana[g] -= HOI_MANA;
          n.mana[g]++;
        }
      }
    }
  }

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

  private vaoMay(n: NguoiChoi): void {
    if (n.may.dang || n.may.hoi > 0 || n.bay || n.nv.khoa || n.nv.laMay) return;
    n.may.dang = true;
    n.may.con = MAY_THOI_GIAN;
    n.nv.vaoMay();
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
      this.trungGa(g, p, SAT_MAY);
    }
  }

  // Nhóm Đấm: 1 viên, không tốn mana · Đá: 2 viên tản · Chiêu đặc biệt: 1 quả cầu nổ diện rộng. Đá và chiêu tốn 1 mana mỗi lần.
  private ban(p: number, x: number, y: number): void {
    const n = this.nguoi[p];
    if (n.hoiChieu > 0 || n.nv.khoa) return;
    const chieu = n.nv.nhom === 2;
    const nhom = n.nv.nhom;
    if (nhom === NHOM_MAY) {
      this.vaoMay(n);
      return;
    }
    if (n.may.dang) return;
    if (nhom > 0 && (n.khoaMana[nhom] > 0 || n.mana[nhom] < 1)) return;
    // Thời gian hồi giữa 2 đòn theo nhóm (không phụ thuộc độ dài animation)
    n.hoiChieu = (chieu ? 0.8 : n.nv.nhom === 1 ? 0.32 : n.dangDi ? 0.3 : 0.2) * 2;
    if (nhom > 0) {
      n.mana[nhom]--;
      if (n.mana[nhom] < 1) {
        n.khoaMana[nhom] = KHOA_MANA;
        n.hoiMana[nhom] = 0;
      }
    }
    if (!n.dangDi) {
      n.nv.lat = x < n.x;
      n.nv.huong = 'ngang';
    }
    if (!n.bay) n.nv.raDon(this.t);

    // Giới hạn tầm theo đòn vừa ra: chuột trỏ xa hơn tầm thì đòn dừng ở mép tầm đánh
    const tam = chieu ? TAM_CHIEU : TAM_DON[n.nv.donVuaRa ?? ''] ?? (n.nv.nhom === 1 ? TAM_DA_GAN : TAM_DAM_GAN);
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
      this.dan.push({ id: this.id++, p, x0: tay.x, y0: tay.y, x1, y1, t: 0, T, phu: i > 0, to: chieu && i === 0, sat: SAT_THUONG[nhom][p] });
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

  // Chiêu hết mana (đang khoá / chưa hồi) hoặc Mây đang chạy / đang hồi: không dùng được
  hetMana(p: number, k: number): boolean {
    const n = this.nguoi[p];
    if (k === 0) return false;
    if (k === NHOM_MAY) return n.may.dang || n.may.hoi > 0;
    return n.khoaMana[k] > 0 || n.mana[k] < 1;
  }

  tenNhom(p: number): string {
    const nv = this.nguoi[p].nv;
    return nv.nhom === 2 ? TEN_DON[nv.donVong(this.t)] ?? nv.tenNhom : nv.tenNhom;
  }

  private trungGa(g: Ga, p: number, sat: number): void {
    if (g.loai === 'boss' && g.mau) {
      const n = this.nguoi[p];
      const t = this.tamGa(g);
      if (g.mau === 'vang') {
        // Màu vàng: mọi đòn đều trượt
        this.chu.push({ id: this.id++, x: t.x + ngauNhien(-40, 40), y: t.y - 80, text: 'MISS', mau: '#ffd23f', t: 0 });
        n.combo = 0;
        n.banTruot++;
        return;
      }
      if (g.mau === 'den') {
        // Màu đen: không bị thương, phản lại 100% sát thương cho người đánh (mây không nhận sát thương nên không bị phản)
        this.chu.push({ id: this.id++, x: t.x + ngauNhien(-40, 40), y: t.y - 80, text: 'PHẢN!', mau: '#c77dff', t: 0 });
        if (!n.het && !n.nv.laMay) this.nhanSatThuong(n, sat, true);
        return;
      }
    }
    if (Math.random() < neGa(g)) {
      const t = this.tamGa(g);
      this.chu.push({ id: this.id++, x: t.x + ngauNhien(-40, 40), y: t.y - 80, text: 'NÉ!', mau: '#9be7ff', t: 0 });
      return;
    }
    const mat = Math.round(sat * (1 - GIAM_GA[g.loai]));
    g.hp -= mat;
    if (g.loai === 'boss') {
      this.trungTuong(g, p);
      return;
    }
    const n = this.nguoi[p];
    const tam = this.tamGa(g);
    if (g.hp > 0) {
      g.nhay = 0.15;
      n.banTrung++;
      this.chu.push({ id: this.id++, x: tam.x, y: tam.y - 30, text: `-${mat}`, mau: '#ffffff', t: 0 });
      return;
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
    this.congDiem(p, DIEM[g.loai] * hs, tam.x, tam.y - 30, `+${DIEM[g.loai] * hs}${nhan}`);
    if (n.combo > 0 && n.combo % 5 === 0 && hs > 1) {
      this.chu.push({ id: this.id++, x: tam.x, y: tam.y - 70, text: `${n.ten} COMBO x${hs}!`, mau: '#ff9f1a', t: 0 });
    }
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
    // Chỉ hồi sinh sau khi chết, chờ đủ CHO_TUONG giây kể từ lúc chết
    this.henTuong = CHO_TUONG;
    rai(40);
    this.rung = Math.max(this.rung, 0.6);
    this.congDiem(p, DIEM.boss * hs, tam.x, tam.y - 110, `+${DIEM.boss * hs} HẠ GÀ TƯỚNG!`);
    // Hạ được gà tướng thì nhân vật còn sống được hồi máu
    this.nguoi.forEach((m) => {
      if (!m.het) m.hp = Math.min(HP_NV, m.hp + HOI_MAU_TUONG);
    });
  }

  // Quái chạm nhân vật thì đánh (mỗi con có thời gian chờ riêng). Nhân vật dạng mây, đang ngã hoặc đã hết máu thì bỏ qua.
  private gaDanhNguoi(): void {
    for (const g of this.ga) {
      if (g.chet || g.chieu || (g.choDanh ?? 0) > this.t) continue;
      for (let p = 0; p < 2; p++) {
        const n = this.nguoi[p];
        if (n.het || n.nv.laMay || n.nv.khoa) continue;
        if (Math.hypot(n.x - g.x, n.y - g.y) >= CHAM_GA[g.loai]) continue;
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
    const nhan = Math.round(sat * (1 - GIAM_NV));
    n.hp = Math.max(0, n.hp - nhan);
    this.chu.push({ id: this.id++, x: n.x, y: n.y - 220, text: `-${nhan}`, mau: mauChu, t: 0 });
    this.rung = Math.max(this.rung, 0.15);
    if (n.hp > 0) return;
    n.het = true;
    n.dich = null;
    n.dangDi = false;
    n.bay = null;
    n.nv.tuKhi(false);
    n.nv.nga();
    if (this.nguoi.every((m) => m.het)) this.ketThuc();
  }

  private congDiem(p: number, diem: number, x: number, y: number, text: string): void {
    this.nguoi[p].diem += diem;
    this.chu.push({ id: this.id++, x, y, text, mau: this.nguoi[p].mau, t: 0 });
  }

  private ketThuc(): void {
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
    const cu = this.nguoi[this.chuot];
    this.chuot = 1 - this.chuot;
    const moi = this.nguoi[this.chuot];
    moi.tamX = cu.tamX;
    moi.tamY = cu.tamY;
    cu.dich = null;
  }

  // ─── Điều khiển bằng tay cầm (Gamepad API, bố cục kiểu PS; mapping "standard") ───
  // Cần trái: chạy · Cần phải: ngắm (không gạt thì tự ngắm) · ✕ / R2: ra đòn · ○ / L2: bay · L1 / R1: đổi chiêu
  // Options: bắt đầu / tạm dừng · Share (Select): khi chỉ có 1 tay cầm thì đổi sang điều khiển nhân vật kia

  private docTayCam(): void {
    const ds = typeof navigator !== 'undefined' && navigator.getGamepads
      ? Array.from(navigator.getGamepads()).filter((g): g is Gamepad => !!g && g.connected)
      : [];
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
        if (moi(g, 0) || moi(g, 9)) this.batDau();
      } else if (moi(g, 9)) this.tamDung();
      else if (moi(g, 8) && ds.length === 1 && this.man === 'play') this.doiTayCam();
    }

    // Tay cầm nào điều khiển nhân vật nào
    const gan: (Gamepad | undefined)[] = !dungTayCam ? [undefined, undefined] : ds.length >= 2 ? [ds[0], ds[1]] : this.tayCam === 0 ? [ds[0], undefined] : [undefined, ds[0]];
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
      const trai = this.canGat(g, 0, 1);
      const phai = this.canGat(g, 2, g.mapping === 'standard' || g.axes.length < 6 ? 3 : 5);
      // Hướng nhìn theo cần ngắm, không có thì theo hướng chạy
      if (phai.m > 0) n.nhin = { x: phai.x / phai.m, y: phai.y / phai.m };
      else if (trai.m > 0) n.nhin = { x: trai.x / trai.m, y: trai.y / trai.m };
      n.ngam = phai.m > 0 ? { x: kepMap(n.x + n.nhin.x * 300), y: kepMap(n.y + n.nhin.y * 300 - 60) } : null;

      // Chạy: gạt cần thì chạy theo hướng gạt, buông cần thì đứng lại
      if (trai.m > 0) {
        this.datDichThe(p, n.x + (trai.x / trai.m) * 200, n.y + (trai.y / trai.m) * 200);
        n.cuaCan = true;
      } else if (n.cuaCan) {
        n.dich = null;
        n.cuaCan = false;
      }
      // Bay một đoạn xa theo hướng cần chạy (không gạt thì theo hướng đang nhìn)
      if (moi(g, 1) || ((g.buttons[6]?.value ?? 0) > 0.5 && !cu(g)[6])) {
        const h = trai.m > 0 ? { x: trai.x / trai.m, y: trai.y / trai.m } : n.nhin;
        this.datDichThe(p, n.x + h.x * BAY_TOI_DA, n.y + h.y * BAY_TOI_DA);
      }
      if (moi(g, 4)) this.chuyenChieu(p, -1);
      if (moi(g, 5)) this.chuyenChieu(p, 1);
      // Ra đòn: giữ ✕ / R2 thì đánh liên tục theo thời gian hồi chiêu
      if (duoc(g, 0) || duoc(g, 7)) {
        const m = this.diemNham(p);
        const a = n.ngam ? { x: n.x + n.nhin.x * TAM_CHIEU, y: n.y + n.nhin.y * TAM_CHIEU - 60 } : m;
        this.ban(p, kepMap(a.x), kepMap(a.y));
      }
    }
    // Lưu trạng thái nút ở khung này để lần sau biết nút nào mới bấm
    const luu = new Map<number, boolean[]>();
    for (const g of ds) luu.set(g.index, g.buttons.map((b, i) => b.pressed || (i === 6 || i === 7) && b.value > 0.5));
    this.nutCu = luu;
  }

  // Cần analog có vùng chết; trả hướng (đã co giãn) và độ lớn m (0 = đang nằm yên)
  private canGat(g: Gamepad, ax: number, ay: number): { x: number; y: number; m: number } {
    const x = g.axes[ax] ?? 0;
    const y = g.axes[ay] ?? 0;
    const m = Math.hypot(x, y);
    return m < VUNG_CHET_CAN ? { x: 0, y: 0, m: 0 } : { x, y, m };
  }

  private doiTayCam(): void {
    this.nguoi[this.tayCam].dich = null;
    this.nguoi[this.tayCam].cuaCan = false;
    this.tayCam = 1 - this.tayCam;
  }

  // L1 / R1: sang chiêu trước / sau, bỏ qua chiêu đang khoá hoặc hết mana
  private chuyenChieu(p: number, buoc: number): void {
    const ds = this.dsBieuTuong(p);
    const nv = this.nguoi[p].nv;
    let i = ds.indexOf(nv.nhom);
    for (let s = 0; s < ds.length; s++) {
      i = (i + buoc + ds.length) % ds.length;
      if (!this.hetMana(p, ds[i])) {
        nv.datNhom(ds[i], this.t);
        return;
      }
    }
  }

  // Chỉ xa thì bay theo vòng cung, gần thì chạy
  /** Bay được khi không bị khoá và còn đủ thể lực */
  coTheBay(n: NguoiChoi): boolean {
    return n.bayKhoa <= 0 && n.bayNl >= BAY_NL_TOI_THIEU;
  }

  /** 0..1: thể lực bay còn lại (thanh nhỏ trên đầu nhân vật) */
  nlBay(p: number): number {
    return this.nguoi[p].bayNl / BAY_NL_TOI_DA;
  }

  private datDichThe(p: number, x: number, y: number): void {
    const n = this.nguoi[p];
    if (n.nv.khoa || n.bay) return;
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
    const toiDa = n.bayNl * TOC_DO_BAY;
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
    const tam = n.nv.nhom === 2 ? 800 : n.nv.nhom === 1 ? 480 : 380;
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
    const rx = this.rung > 0 ? ngauNhien(-6, 6) : 0;
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
    return { x: g.x, y: g.y - 310 - g.h * EP_GA };
  }

  hpNv(p: number): number {
    return Math.max(0, Math.ceil(this.nguoi[p].hp));
  }

  mauNv(p: number): number {
    return Math.max(0, this.nguoi[p].hp) / HP_NV;
  }

  // 0..1: mana còn lại của nhóm đòn đang dùng (Đấm luôn đầy)
  nangLuong(p: number): number {
    const n = this.nguoi[p];
    const g = n.nv.nhom;
    if (g === NHOM_MAY) return n.may.dang ? n.may.con / MAY_THOI_GIAN : 1 - n.may.hoi / MAY_HOI;
    return g === 0 ? 1 : n.mana[g] / MANA_TOI_DA[g];
  }

  // 0..1: mana / thời gian của một nhóm đòn bất kỳ (vòng tiến độ trên nút chiêu thức)
  manaNhom(p: number, k: number): number {
    const n = this.nguoi[p];
    if (k === NHOM_MAY) return n.may.dang ? n.may.con / MAY_THOI_GIAN : 1 - n.may.hoi / MAY_HOI;
    return k === 0 ? 1 : n.mana[k] / MANA_TOI_DA[k];
  }

  // Quả cầu mana chỉ có một, đổi màu theo nhóm đòn đang dùng
  mauMana(p: number): string {
    return MAU_MANA[this.nguoi[p].nv.nhom];
  }

  // Vị trí điểm neo (chân) của sprite nhân vật trên map và hệ số phóng
  nvViTri(p: number): { x: number; y: number; k: number } {
    const n = this.nguoi[p];
    return { x: n.x, y: n.y - (n.nv.cao - n.nv.nhun) * S_NV, k: S_NV * n.nv.heSoTo };
  }

  // Bảng chiêu của gà tướng (giữa phía trên, hình bán nguyệt úp): 0 Mổ + đá · 1 Lao · 2 Bay · 3 Đen · 4 Vàng · 5 Đỏ.
  // tien 0..1 là vòng tiến độ (hồi chiêu, hoặc thời gian còn lại khi màu đang chạy); không bấm được, chỉ để xem
  bangTuong(): { k: number; x: number; y: number; dung: boolean; tien: number; op: number }[] {
    const g = this.tuongSong;
    return [0, 1, 2, 3, 4, 5].map((k) => {
      let dung = false;
      let tien = 0;
      let san = false;
      if (g) {
        if (k === 0) { dung = !g.chieu; tien = 1; san = true; }
        else if (k <= 2) {
          const loai = k === 1 ? 'lao' : 'bay';
          const hoi = (k === 1 ? g.hoiLao : g.hoiBay) ?? 0;
          dung = g.chieu?.loai === loai;
          tien = 1 - hoi / (k === 1 ? LAO_HOI : BAY_HOI);
          san = hoi <= 0;
        } else {
          const m = MAU_TUONG[k - 3];
          dung = g.mau === m;
          if (dung) tien = (g.conMau ?? 0) / MAU_KEO_DAI;
          else if ((g.luotMau ?? 0) % MAU_TUONG.length === k - 3) tien = 1 - (g.hoiMau ?? 0) / MAU_CHU_KY;
          san = dung || tien > 0;
        }
      }
      return { k, x: this.GIUA + (k - 2.5) * 44, y: -BAR / 2, dung, tien: kep(tien, 0, 1), op: !g ? 0.15 : dung ? 1 : san ? 0.55 : 0.25 };
    });
  }

  // Bộ lọc màu của gà: nháy sáng khi trúng đòn, báo hiệu trước khi lao / bay, đổi màu đen / vàng / đỏ
  locGa(g: Ga): string | null {
    if (g.loai === 'boss') {
      if (g.chieu?.pha === 'bao' && Math.floor(g.chieu.t * 14) % 2 === 0) return LOC_BAO;
      if (g.mau === 'den') return LOC_DEN;
      if (g.mau === 'vang') return LOC_VANG;
      if (g.mau === 'do') return LOC_DO;
    }
    return g.nhay > 0 ? MAU_SANG : null;
  }

  // Nhóm đòn hiện biểu tượng dưới chân, theo thứ tự: Đấm → Chiêu đặc biệt → Đá → (Mabu) Mây
  dsBieuTuong(p: number): number[] {
    return this.nguoi[p].nv.sp.nhomDon.some((d) => d.may) ? [0, 2, 1, NHOM_MAY] : [0, 2, 1];
  }

  private viTriTay(p: number) {
    const n = this.nguoi[p];
    const { dx, dy } = n.nv.diemBan;
    return { x: n.x + (n.nv.lat ? -dx : dx) * S_NV, y: n.y + (dy - n.nv.cao) * S_NV };
  }

  tamGa(g: Ga) {
    return { x: g.x, y: g.y - (CHAN_GA * TL_GA[g.loai] * S_GA + g.h) * EP_GA };
  }

  // Hình dạng vẽ của gà: vị trí chân, hệ số phóng ngang / dọc (dọc bị ép dẹt EP_GA), độ dời dy lên tâm thân và góc xoay (độ) quanh tâm thân
  // (mổ, đá, ngã, chúi khi Lao); sprite vẽ lùi xuống tới chân.
  gaHinh(g: Ga): { x: number; y: number; kx: number; ky: number; dy: number; xoay: number } {
    const k = S_GA * TL_GA[g.loai];
    let xoay = g.chet && g.loai !== 'boss' ? g.tChet * 540 : 0;
    const bay = g.h / (S_GA * TL_GA[g.loai]);
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
    return [0, 1].map((p) => ({
      ten: p === 0 ? MABU.ten : ZINBU.ten, mau: p === 0 ? '#e84393' : '#8e44ad',
      hp: HP_NV, het: false, diem: 0, combo: 0, tamX: W_MAC_DINH / 2, tamY: 300, hoiChieu: 0, chumDen: 0, banTrung: 0, banTruot: 0,
      x: MAP / 2 + (p === 0 ? -160 : 160), y: MAP / 2 + 120, dich: null, dangDi: false,
      mana: MANA_TOI_DA.map((m) => m), khoaMana: [0, 0, 0], hoiMana: [0, 0, 0], nv: this.taoNhanVat(p), bay: null, bayNl: BAY_NL_TOI_DA, bayKhoa: 0,
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
      this.cheDo = localStorage.getItem(KHOA_CHE_DO) === 'tayCam' ? 'tayCam' : 'chuot';
    } catch {
      this.kyLuc = 0;
    }
  }
}
