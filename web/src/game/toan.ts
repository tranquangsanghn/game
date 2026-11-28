/**
 * Độ dài vectơ (dx, dy). Nhanh hơn Math.hypot nhiều (Math.hypot xử lý tràn số / nhiều đối số nên chậm),
 * dùng ở mọi vòng lặp mỗi khung (khoảng cách gà, Cell, sương mù…). Toạ độ game nhỏ nên không lo tràn số.
 */
export function hyp(dx: number, dy: number): number {
  return Math.sqrt(dx * dx + dy * dy);
}

/** Chuỗi combo đang tính trên một con quái (đòn người chơi trúng nó nối chuỗi, xem COMBO_HE trong game.ts; không lưu ván) */
export interface ChuoiCombo {
  /** thứ tự đòn hiện tại trong chuỗi */
  n: number;
  /** lúc (Game.t) đòn trúng gần nhất */
  luc: number;
  /** id lần ra đòn đã tính gần nhất (đạn phụ của cùng lần ra đòn không lên bậc) */
  don: number;
}
