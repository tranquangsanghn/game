# Game bắn gà (Mabu & Zinbu)

Game 2 người chơi chung bàn phím, viết bằng Angular, tách ra từ dự án EORM.

- Chơi online: https://tranquangsanghn.github.io/game/
- Mỗi lần push lên `main`, GitHub Actions tự build và deploy lên GitHub Pages.

## Điều khiển

| | Người 1 (Mabu, nửa trái) | Người 2 (Zinbu, nửa phải) |
|---|---|---|
| Di chuyển | W A S D | Phím mũi tên |
| Bắn | Space | Enter |
| Nạp đạn | R | Ctrl phải |
| Đổi đòn | Q | Shift phải |

`P` tạm dừng, `Esc` đóng game. Kỷ lục lưu trong `localStorage` của trình duyệt.

## Chạy trên máy

```bash
npm install
npm start
```

Mở http://localhost:4200

## Nhúng vào trang khác (iframe)

Khi người chơi bấm Đóng, game gửi `postMessage('chicken-shooting-game:dong')` lên trang cha để trang cha tự đóng khung iframe.

## Cấu trúc

- `src/app/chicken-shooting-game/` — toàn bộ game (component, sprite, dữ liệu nhân vật)
- `public/assets/game/` — ảnh sprite atlas Mabu, Zinbu
- `src/app/app.ts` — vỏ app: mở game, xử lý nút Đóng
