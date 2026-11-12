# Dragon Ball: Mabu & Zinbu

Game 2 người chơi chung bàn phím, viết bằng Angular, tách ra từ dự án EORM.

- Chơi online: https://tranquangsanghn.github.io/game/
- Mỗi lần push lên `main`, GitHub Actions tự build và deploy lên GitHub Pages.

## Điều khiển (chỉ dùng chuột)

Mỗi người chơi một nửa màn hình, chuột ở nửa nào thì điều khiển nhân vật nửa đó.

- **Chuột phải**: chỉ chỗ để chạy tới (xa thì bay)
- **Chuột trái**: ra đòn
- **Con lăn**: đổi nhóm đòn (Đấm / Đá / Chiêu đặc biệt)

Kỷ lục lưu trong `localStorage` của trình duyệt.

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
