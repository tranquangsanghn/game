# Dragon Ball

Game 2 nhân vật, chơi bằng chuột + Tab hoặc tay cầm kiểu PS (chọn ở màn bắt đầu), viết bằng TypeScript thuần (Vite) + máy chủ Java / MySQL để lưu ván và điểm, tách ra từ dự án EORM.

- Chơi online: https://tranquangsanghn.github.io/game/
- Mỗi lần push lên `main`, GitHub Actions tự build `web/` và deploy lên GitHub Pages (bản này không có máy chủ nên ván lưu tạm trong trình duyệt).

## Chạy game + lưu vào MySQL

Cần: Node 20+, Java 17+, Maven, MySQL 8 (đang chạy). Cấu trúc: `web/` (giao diện + game), `server/` (Java Spring Boot + MySQL).

1. **Máy chủ** (cổng 8091). Tự tạo database `dragonball` và 2 bảng nếu chưa có (user MySQL cần quyền CREATE):
   ```bash
   cd server
   DB_USER=root DB_PASS=matkhau mvn spring-boot:run
   ```
   Muốn khỏi gõ mật khẩu mỗi lần: tạo file `server/application.properties` (đã nằm trong `.gitignore`) chứa `spring.datasource.username=...` và `spring.datasource.password=...`.
   Hoặc đổi cấu hình bằng biến môi trường: `DB_URL` (mặc định `jdbc:mysql://localhost:3306/dragonball?createDatabaseIfNotExist=true...`), `DB_USER` (mặc định `root`), `DB_PASS` (mặc định rỗng), `PORT`, `CORS_ORIGINS`.
2. **Giao diện** (cổng 5173, tự chuyển `/api` sang máy chủ):
   ```bash
   cd web
   npm install
   npm run dev
   ```
3. Mở http://localhost:5173, nhập **tên người chơi** ở màn bắt đầu. Bấm ❚❚ **Tạm dừng → 💾 Lưu game** để lưu; lần sau mở lại, màn bắt đầu có nút **▶ Chơi tiếp ván đã lưu**. Hết ván thì điểm được ghi vào bảng điểm cao nhất.

API: `GET/PUT/DELETE /api/saves/{tên}` (ván đang chơi) · `POST /api/scores`, `GET /api/scores?limit=5` (điểm). Test máy chủ: `cd server && mvn test` (dùng H2 trong bộ nhớ).

## Điều khiển

Hai người chơi chung một khung hình. Camera bám trung điểm hai nhân vật và tự zoom ra khi họ xa nhau;
hai người không đi xa nhau quá mức camera chứa nổi (màn hình hiện cảnh báo khi gần chạm giới hạn).

Màn bắt đầu cho chọn chế độ chơi (nhớ lại lần sau):

**🖱️ Chuột + Tab** (chưa có tay cầm; chỉ có 1 chuột nên điều khiển từng nhân vật một):
- **Chuột phải**: chạy tới chỗ bấm (xa thì bay)
- **Chuột trái**: ra đòn tại chỗ chuột trỏ
- **Bấm vào chiêu** ở thanh đen hai bên: đổi nhóm đòn (Đấm / Chiêu đặc biệt / Đá / Biến mây)
- **Tab**: chuyển chuột sang nhân vật kia (Mabu ↔ Zinbu)

**🎮 Tay cầm** (Gamepad API, mapping "standard" kiểu PS). Tay cầm thứ nhất điều khiển Mabu (thanh đen bên trái), tay cầm thứ hai điều khiển Zinbu (bên phải). Nối tay cầm rồi bấm một nút bất kỳ để trình duyệt nhận ra nó:
- **Cần trái**: chạy theo hướng gạt
- **Cần phải**: ngắm (không gạt thì tự ngắm vào con gà gần nhất)
- **✕ hoặc R2**: ra đòn (giữ để đánh liên tục)
- **○ hoặc L2**: bay một đoạn xa theo hướng cần trái
- **L1 / R1**: đổi nhóm đòn trước / sau (Đấm / Chiêu đặc biệt / Đá / Biến mây), bỏ qua chiêu đang khoá
- **Options**: bắt đầu / tạm dừng / tiếp tục · **✕** ở màn bắt đầu / kết thúc: chơi lại
- **Share (Select)**: khi chỉ có 1 tay cầm, chuyển tay cầm sang nhân vật kia

Màn bắt đầu (chế độ tay cầm) hiện tên các tay cầm đã nối và nút vừa bấm (để dò tay cầm lạ có gửi đúng chỉ số nút không).

**Biến mây (chỉ Mabu)**: chọn nút đám mây (mana tím) trên bảng chiêu rồi ra đòn. Mabu biến thành đám mây to gấp 2 trong 7 giây, không còn thanh máu / mana, mọi con gà mây quét qua đều trúng đòn. Sau đó phải chờ 40 giây mới dùng lại.

## Gà

Sprite gà lấy từ `tools/ga-goc.png`; chạy `python3 tools/tao-atlas-ga.py` để sinh lại các atlas trong `public/assets/game/` (cần Pillow + numpy).

- **Gà trắng** (10đ): đi bộ · **Gà đỏ** (20đ): đi nhanh, nhảy · **Gà đen** (30đ): bay và thả trứng
- **Gà tướng / gà mẹ** (500đ): to gấp 5 lần, 100 máu, đẻ trứng ra gà con. Có chiêu Lao (500 px/s, sát thương ×2, 15s/lần) và Bay (700 px/s, sát thương ×3, 20s/lần) kèm vệt đỏ báo hiệu, rồi lộ sơ hở 3s; cứ 20s lại đổi màu 5s: đen (phản đòn), vàng (miễn đòn), đỏ (đốt cháy xung quanh). Chiêu của gà mẹ nằm trên thanh đen phía trên màn hình. Hồi sinh tối đa 3 lần, mỗi lần sát thương +50%, né thêm 15% và đẻ thêm 1 trứng. Hạ được thì cả đội hồi 60 máu
- **Vật phẩm máu** (trái tim): thỉnh thoảng xuất hiện trên map hoặc do gà rơi, Mabu / Zinbu đi vào để nhặt, hồi 50 máu

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

- `src/app/chicken-shooting-game/` — toàn bộ game: component (logic), `ve-canvas.ts` (vẽ bằng Canvas 2D), sprite, dữ liệu nhân vật
- `public/assets/game/` — ảnh sprite atlas Mabu, Zinbu và các loại gà
- `tools/` — ảnh gà gốc và script tô màu / ghép atlas
- `src/app/app.ts` — vỏ app: mở game, xử lý nút Đóng
