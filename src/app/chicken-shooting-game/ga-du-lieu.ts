// Sprite gà: atlas 4×4 khung do tools/tao-atlas-ga.py sinh ra từ tools/ga-goc.png.
// Kích thước khai báo là toạ độ logic (không phụ thuộc độ phân giải file PNG) — file PNG lớn hơn 2× (gà tướng 4×) cho nét.
import { KhungSprite } from './sprite.component';

const khung = (atlas: string): KhungSprite => ({
  atlas, atlasW: 420, atlasH: 384, w: 105, h: 96, cot: 4, neoX: 52, neoY: 90,
});

export const GA_TRANG = khung('assets/game/ga_trang.png');
export const GA_DO = khung('assets/game/ga_do.png');
export const GA_DEN = khung('assets/game/ga_den.png');
// Gà tướng: đầu trắng, cánh đỏ, thân đen
export const GA_TUONG = khung('assets/game/ga_tuong.png');

// Các khung trong atlas
export const KHUNG_CHAY = [0, 1, 2, 3, 4, 5, 6, 7];
export const KHUNG_DUNG = [8, 9, 12, 13];
export const KHUNG_BAY = [3, 7, 2, 6];
export const KHUNG_CHET = 11;
