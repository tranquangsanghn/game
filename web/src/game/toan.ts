/**
 * Độ dài vectơ (dx, dy). Nhanh hơn Math.hypot nhiều (Math.hypot xử lý tràn số / nhiều đối số nên chậm),
 * dùng ở mọi vòng lặp mỗi khung (khoảng cách gà, Cell, sương mù…). Toạ độ game nhỏ nên không lo tràn số.
 */
export function hyp(dx: number, dy: number): number {
  return Math.sqrt(dx * dx + dy * dy);
}
