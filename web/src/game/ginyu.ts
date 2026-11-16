// Bóng ma Goku (tên biến / ván lưu vẫn là `ginyu`): quái canh núi đá (đảo hình elip phía nam đảo 0). Một con duy nhất, lơ lửng giữa núi.
// Sức mạnh SAO CHÉP: lúc gặp (nhìn thấy) Mabu / Zinbu / Vegeta, nó lấy đúng sức mạnh của nhân vật đầu tiên và gần nó nhất lúc đó
// (máu hiện có, sát thương Đấm / Đá / Chiêu đặc biệt × sức mạnh `suc` + đậu thần `satDau`, né 25%, giảm 50% sát thương như nhân vật). Mỗi lần chạm trán mới lại sao chép lại,
// giữ nguyên tỉ lệ máu đang có (đánh dở rồi chạy ra rồi quay lại không hồi đầy máu cho nó).
// Chỉ có MỘT chiêu: gồng `GY_NAP` giây rồi bay thẳng vào người nó đang đuổi (bám theo mục tiêu, không né được), sát thương = Chiêu đặc biệt sao chép được.
// File này chỉ có dữ liệu + hàm thuần; logic chạy trong Game (`capNhatGinyu()`), vẽ trong ve-canvas.ts (`veGinyu()`).
// Sprite: web/public/assets/game/goku_ma_atlas.png (dựng bằng tools/tao-atlas-goku-ma.py), 10 cột × 3 hàng khung 200×200, neo đáy giữa, quay mặt TRÁI.
import type { KhungSprite } from './sprite';
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
/** Giữa 2 lần lao: lượn quanh mục tiêu ở khoảng cách này */
export const GY_GIU_XA = 520;
/** Người đứng trong núi đá (cộng lề) mới là mục tiêu; bóng ma không rời núi (trừ lúc đang lao) */
export const GY_NUI_LE = 250;
/** Chiêu duy nhất "Lao thẳng": gồng GY_NAP giây (đứng yên, hào quang) → bay bám theo mục tiêu tốc độ GY_LAO_TOC, chạm (GY_LAO_CHAM) là trúng, không né được;
 *  lao quá GY_LAO_TOI_DA giây thì thôi. Hồi GY_LAO_HOI giây; trúng xong bật lùi GY_LUI_T giây. */
export const GY_NAP = 0.8;
export const GY_LAO_TOC = 1500;
export const GY_LAO_CHAM = 110;
export const GY_LAO_TOI_DA = 2.5;
export const GY_LAO_HOI = 3;
export const GY_LUI_T = 0.35;
export const GY_LUI_TOC = 900;
/** Thời gian quay người tạo dáng lúc mới gặp (vẫn bị đánh được) */
export const GY_DANG_T = 1.4;
/** Không thấy ai trong chừng này giây thì thôi chạm trán, về giữa núi (lần gặp sau sao chép lại) */
export const GY_QUEN = 4;
/** Thời gian nháy sáng khi trúng đòn / hiện khung lao sau khi đâm trúng / xác mờ dần */
export const GY_NHAY_T = 0.18;
export const GY_DANH_T = 0.3;
export const GY_CHET_T = 2.5;
/** Hoá socola (trúng Biến socola mà chưa chết): đứng yên giây */
export const GY_SOCOLA_T = 4;
/** Điểm khi hạ */
export const GY_DIEM = 500;
/** Máu mặc định trước khi sao chép (chưa gặp ai) */
export const GY_HP_GOC = 150;
/** Tên hiển thị */
export const GY_TEN = 'Bóng ma Goku';

export interface Ginyu {
  x: number; y: number;
  /** Chỗ lơ lửng giữa núi */
  hx: number; hy: number;
  hp: number; hpMax: number;
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
