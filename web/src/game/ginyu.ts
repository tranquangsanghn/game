// Ginyu: quái canh núi đá (đảo hình elip phía nam đảo 0). Một con duy nhất, ngồi giữa núi tạo dáng.
// Sức mạnh SAO CHÉP: lúc gặp (nhìn thấy) Mabu / Zinbu / Vegeta, nó lấy đúng sức mạnh của nhân vật đầu tiên và gần nó nhất lúc đó
// (máu hiện có, sát thương Đấm / Đá / Chiêu đặc biệt × sức mạnh `suc` + đậu thần `satDau`, né 25%, giảm 50% sát thương như nhân vật). Mỗi lần chạm trán mới lại sao chép lại,
// giữ nguyên tỉ lệ máu đang có (đánh dở rồi chạy ra rồi quay lại không hồi đầy máu cho nó).
// File này chỉ có dữ liệu + hàm thuần; logic chạy trong Game (`capNhatGinyu()`), vẽ trong ve-canvas.ts (`veGinyu()`).
// Sprite: web/public/assets/game/ginyu_atlas.png (dựng bằng tools/tao-atlas-ginyu.py), 10 cột × 2 hàng khung logic 48×40 (PNG ×4), neo đáy giữa, quay mặt TRÁI.
import type { KhungSprite } from './sprite';
import { NUI } from './ban-do';

export const SP_GINYU: KhungSprite = { atlas: 'assets/game/ginyu_atlas.png', atlasW: 480, atlasH: 80, w: 48, h: 40, cot: 10, neoX: 24, neoY: 38 };
/** Khung trong atlas: đứng, chạy, đấm, đá, chưởng, trúng đòn, ngã, tạo dáng Ginyu Force */
export const GY_KHUNG = { dung: [0, 1, 2, 3], chay: [4, 5, 6, 7], dam: [8, 9], da: [10, 11], chuong: 12, trung: [13, 19], nga: 14, dang: [15, 16, 17, 18] } as const;

/** Độ to (nhân kích thước sprite logic; thân cao ~29 → ~200 px, cỡ Mabu / Zinbu) */
export const GY_TO = 7;
/** Bán kính thân (trúng đòn), tâm thân cao hơn chân GY_TAM_CAO */
export const GY_BK = 90;
export const GY_TAM_CAO = 100;
/** Thanh máu cao trên chân */
export const GY_THANH_CAO = 250;
/** Tầm chạm để đấm / đá */
export const GY_CHAM = 150;
/** Tốc độ chạy thật (px/s; nhân vật đi bộ 460) */
export const GY_TOC = 400;
/** Người đứng trong núi đá (cộng lề) mới là mục tiêu của Ginyu; Ginyu không rời núi */
export const GY_NUI_LE = 250;
/** Chưởng của Ginyu: tốc độ bay, tầm xa, bán kính trúng, thời gian vận chưởng (đứng yên giơ tay) và hồi chiêu (nhân vật bị giới hạn mana nên Ginyu hồi lâu hơn 1s của nhân vật) */
export const GY_DAN_TOC = 1100;
export const GY_DAN_TAM = 1100;
export const GY_DAN_BK = 90;
export const GY_NAP = 0.45;
export const GY_CHUONG_HOI = 3;
/** Hồi giữa 2 đòn: Đấm · Đá (giống nhân vật) */
export const GY_HOI = [0.4, 0.64];
/** Thời gian tạo dáng Ginyu Force lúc mới gặp (vẫn bị đánh được) */
export const GY_DANG_T = 1.4;
/** Không thấy ai trong chừng này giây thì thôi chạm trán, đi về giữa núi (lần gặp sau sao chép lại) */
export const GY_QUEN = 4;
/** Thời gian nháy sáng khi trúng đòn / hoạt ảnh đánh / xác mờ dần */
export const GY_NHAY_T = 0.18;
export const GY_DANH_T = 0.3;
export const GY_CHET_T = 2.5;
/** Hoá socola (trúng Biến socola mà chưa chết): đứng yên giây */
export const GY_SOCOLA_T = 4;
/** Điểm khi hạ Ginyu */
export const GY_DIEM = 500;
/** Máu mặc định trước khi sao chép (chưa gặp ai) */
export const GY_HP_GOC = 150;

export interface Ginyu {
  x: number; y: number;
  /** Chỗ đứng giữa núi */
  hx: number; hy: number;
  hp: number; hpMax: number;
  /** Sát thương gốc sao chép được: Đấm, Đá, Chiêu đặc biệt (đã nhân `suc` và cộng `satDau` của nhân vật) */
  sat: [number, number, number];
  /** Nhân vật bị sao chép (ki: 0 Mabu · 1 Zinbu · 2 Vegeta); undefined = chưa gặp ai */
  ki?: number;
  lat: boolean; chay: boolean; phase: number;
  /** Đang chạm trán (đã sao chép); quen = giây không thấy ai */
  gap: boolean; quen: number;
  /** Ô người chơi đang đuổi */
  muc?: number;
  /** kieuDanh = đòn cận chiến kế tiếp (0 Đấm · 1 Đá); don = đòn vừa ra (0 Đấm · 1 Đá · 2 chưởng, để chọn khung) */
  choDanh: number; kieuDanh: number; don: number; danh: number; choChuong: number;
  /** Đang vận chưởng: số giây đã vận */
  nap?: number;
  /** Tạo dáng còn lại (giây) */
  dang: number;
  nhay: number; thuongLuc: number;
  chet: boolean; tChet: number;
  socola?: number; chamMay?: number;
}

/** Chưởng của Ginyu (cầu năng lượng tím hồng bay thẳng) */
export interface DanGinyu { id: number; x: number; y: number; vx: number; vy: number; con: number; sat: number; t: number; }

export function taoGinyu(): Ginyu {
  return {
    x: NUI.x, y: NUI.y, hx: NUI.x, hy: NUI.y,
    hp: GY_HP_GOC, hpMax: GY_HP_GOC, sat: [50, 70, 130],
    lat: false, chay: false, phase: 0, gap: false, quen: 0,
    choDanh: 0, kieuDanh: 0, don: 0, danh: 0, choChuong: 0, dang: 0,
    nhay: 0, thuongLuc: -99, chet: false, tChet: 0,
  };
}
