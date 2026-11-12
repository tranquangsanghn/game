# Dragon Ball

Game 2 nhân vật chơi hoàn toàn bằng chuột (sau này 2 chuột), viết bằng Angular, tách ra từ dự án EORM.

- Chơi online: https://tranquangsanghn.github.io/game/
- Mỗi lần push lên `main`, GitHub Actions tự build và deploy lên GitHub Pages.

## Điều khiển

Hai người chơi chung một khung hình. Camera bám trung điểm hai nhân vật và tự zoom ra khi họ xa nhau;
hai người không đi xa nhau quá mức camera chứa nổi (màn hình hiện cảnh báo khi gần chạm giới hạn).

Chỉ chơi bằng chuột; cả Mabu (bảng chiêu góc dưới trái) và Zinbu (góc dưới phải) điều khiển giống nhau:
- **Chuột phải**: chỉ chỗ để chạy tới (xa thì bay)
- **Chuột trái**: ra đòn
- **Bấm vào chiêu** ở bảng chiêu thức: đổi nhóm đòn (Đấm / Đá / Chiêu đặc biệt / Biến mây)
- **Tab**: chuyển chuột sang điều khiển nhân vật kia (tạm thời vì mới có 1 chuột; sau này mỗi nhân vật một chuột)

**Biến mây (chỉ Mabu)**: bấm vào nút đám mây (mana tím) trên bảng chiêu rồi bấm đánh. Mabu biến thành đám mây to gấp 2 trong 7 giây, không còn thanh máu / mana, mọi con gà mây quét qua đều trúng đòn. Sau đó phải chờ 40 giây mới dùng lại.

## Gà

Sprite gà lấy từ `tools/ga-goc.png`; chạy `python3 tools/tao-atlas-ga.py` để sinh lại các atlas trong `public/assets/game/` (cần Pillow + numpy).

- **Gà trắng** (10đ): đi bộ, đôi khi dẫn theo gà con · **Gà đỏ** (20đ): đi nhanh, nhảy · **Gà đen** (30đ): bay và thả trứng
- **Gà con** (vàng, nhỏ): bắn trúng bị trừ 50 điểm
- **Gà tướng** (500đ): to gấp 5 lần, đủ 3 màu (đầu trắng, cánh đỏ, thân đen), 14 máu; xuất hiện sau ~25 giây rồi cứ ~55 giây một lần. Hạ được thì cả đội được cộng thêm 1 mạng

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
- `public/assets/game/` — ảnh sprite atlas Mabu, Zinbu và các loại gà
- `tools/` — ảnh gà gốc và script tô màu / ghép atlas
- `src/app/app.ts` — vỏ app: mở game, xử lý nút Đóng
