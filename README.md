# Dragon Ball

Game 2 người chơi chung bàn phím, viết bằng Angular, tách ra từ dự án EORM.

- Chơi online: https://tranquangsanghn.github.io/game/
- Mỗi lần push lên `main`, GitHub Actions tự build và deploy lên GitHub Pages.

## Điều khiển

Hai người chơi chung một khung hình. Camera bám trung điểm hai nhân vật và tự zoom ra khi họ xa nhau;
hai người không đi xa nhau quá mức camera chứa nổi (màn hình hiện cảnh báo khi gần chạm giới hạn).

**1P Mabu — chuột**
- **Chuột phải**: chỉ chỗ để chạy tới (xa thì bay)
- **Chuột trái**: ra đòn
- **Con lăn**: đổi nhóm đòn (Đấm / Đá / Chiêu đặc biệt)

**2P Zinbu — bàn phím hoặc tay cầm**
- **WASD / mũi tên**: di chuyển
- **J / Z**: ra đòn (tự ngắm con gà gần nhất, không ngắm gà con)
- **K / X**: đổi nhóm đòn · **Space / L**: bay nhanh theo hướng đang đi
- Tay cầm (tay cầm thứ nhất): cần trái / D-pad di chuyển, **A** đánh, **LB/RB** đổi đòn, **B** bay.
  Tay cầm thứ hai (nếu có) điều khiển 1P theo cùng cách.

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
