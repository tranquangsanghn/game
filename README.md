# Dragon Ball

Game 2 nhân vật, chơi bằng chuột + Tab hoặc tay cầm kiểu Xbox (chọn ở màn bắt đầu), viết bằng TypeScript thuần (Vite) + máy chủ Java / MySQL để lưu ván và điểm, tách ra từ dự án EORM.

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
- **Phím 1 / 2 / 3 / 4**: chọn chiêu thứ 1 / 2 / 3 / 4 (từ dưới lên trên) của nhân vật đang dùng chuột
- **Tab**: chuyển chuột sang nhân vật kia (Mabu ↔ Zinbu)

**🎮 Tay cầm** (Gamepad API, mapping "standard" kiểu Xbox; dành cho trẻ em nên chỉ dùng các nút đơn giản). Tay cầm thứ nhất điều khiển Mabu (thanh đen bên trái), tay cầm thứ hai điều khiển Zinbu (bên phải). Nối tay cầm rồi bấm một nút bất kỳ để trình duyệt nhận ra nó:
- **Mũi tên (chữ thập)**: chạy
- **Cần trái**: bay (gạt hướng nào bay hướng đó, tốn mana, bay xong nghỉ 5 giây; hết mana hoặc đang nghỉ thì chạy)
- **A**: đấm · **X**: đá · **Y**: chưởng (chiêu đặc biệt) — giữ để đánh liên tục, đánh theo hướng đang quay mặt (không có tâm ngắm)
- **B hoặc cần phải** (đẩy đâu cũng được): chiêu riêng — Mabu biến thành mây, Zinbu biến gà thành socola
- **Menu**: bắt đầu / tạm dừng / tiếp tục · **View**: khi chỉ có 1 tay cầm, chuyển tay cầm sang nhân vật kia
- Tay cầm rung khi nhân vật bị đánh / gục; rút tay cầm hoặc chuyển sang cửa sổ khác thì ván tự tạm dừng; 2 tay cầm giữ cố định vai (rút / cắm lại không đổi người)

Chọn nhân vật xong sẽ vào màn hướng dẫn (ảnh `web/public/assets/game/huong-dan-tay-cam.svg`): chọn Chuột + Tab hoặc Tay cầm, xem cách dùng Đấm / Đá / Chiêu đặc biệt / chiêu riêng rồi bấm Vào chơi (A).

Màn bắt đầu (chế độ tay cầm) hiện tên các tay cầm đã nối và nút vừa bấm (để dò tay cầm lạ có gửi đúng chỉ số nút không).

**Biến socola (chỉ Zinbu)**: chiêu quất râu quét rộng. Gà con dính thì chết luôn và thành thanh socola, Mabu / Zinbu chạm vào là ăn được: +200 máu và +200 mana. Gà mẹ dính thì chịu sát thương rồi hoá socola 5 giây (đứng yên, không né); lúc đó nếu Mabu đang ở dạng mây quét trúng thì gà mẹ luôn mất 30% máu mỗi nhịp, từ 30% trở xuống thì chết luôn. Hồi chiêu 6 giây.

**Biến mây (chỉ Mabu)**: chọn nút đám mây (mana tím) trên bảng chiêu rồi ra đòn. Mabu biến thành đám mây to gấp 2 trong 7 giây, không còn thanh máu / mana, mọi con gà mây quét qua đều trúng đòn. Sau đó phải chờ 25 giây mới dùng lại.

## Máu, mana và chiêu (cân bằng mới)

- **Máu**: vào ván 100, trần 200. Máu vượt trần (táo đỏ +100, socola +100, hạ gà mẹ +60) thành **khiên tạm** 5 giây (tối đa 100). Không bị thương 5 giây thì tự hồi 2 máu/giây tới 100.
- **Mana**: vào ván 100, trần 200. Bay tốn 15/giây, **chưởng tốn 30**, **Biến mây / socola tốn 40**. **Đấm / Đá trúng hồi 5 mana** (đánh gần để gom mana, xả chưởng khi gà đông). Táo xanh +30 mana.
- **Đá** hất lùi và làm choáng gà con 0,7s; **chưởng** xuyên qua mọi gà trên đường bay rồi nổ; combo 10+ thì chưởng hồi nhanh gấp đôi (hiện COMBO trên đầu nhân vật).
- **Cứu đồng đội**: một người ngã mà người kia còn sống thì Mabu phủ **mây** lên Zinbu / Zinbu phủ **cục socola** lên Mabu; mây / socola bám theo người còn sống (nối bằng dây), đếm ngược 15 giây, người cứu sống sót đủ 15s thì người ngã hồi sinh (100 máu).
- **Gà mẹ**: ngoài thế phòng thủ giảm 40% sát thương (mỗi đòn tối đa 60); lúc **sơ hở** sau Lao / Bay nhận ×2 ("CƠ HỘI x2!"). Gà mẹ gốc dưới 50% máu vào **giai đoạn 2**, đẻ trứng nhanh hơn.
- **Gà con**: gà trắng đi thành đàn và vây quanh; gà đỏ lao 1,5s rồi khựng 1s (nhận thêm 50% sát thương); gà đen bay vòng quanh, báo hiệu bằng vệt đỏ rồi nhào xuống.

## Gà

Sprite gà lấy từ `tools/ga-goc.png`; chạy `python3 tools/tao-atlas-ga.py` để sinh lại các atlas trong `public/assets/game/` (cần Pillow + numpy).

- **Gà trắng** (10đ): đi bộ · **Gà đỏ** (20đ): đi nhanh, nhảy · **Gà đen** (30đ): bay và thả trứng
- **Gà tướng / gà mẹ** (500đ): to gấp 5 lần, 100 máu, đẻ trứng ra gà con. Có chiêu Lao (500 px/s, sát thương ×2, 12s/lần) và Bay (700 px/s, sát thương ×3, 15s/lần) kèm vệt đỏ báo hiệu, rồi lộ sơ hở 3s; cứ 20s lại đổi màu 5s: đen (phản đòn), vàng (miễn đòn), đỏ (đốt cháy xung quanh). Chiêu của gà mẹ nằm trên thanh đen phía trên màn hình. Hồi sinh tối đa 3 lần, mỗi lần sát thương +50%, né thêm 15% và đẻ thêm 1 trứng. Hạ được thì cả đội hồi 60 máu
- **Gà mẹ gốc** (có vương miện): chỉ chạy trốn và đẻ trứng. Dưới 20% máu thì bỏ canh trứng, chỉ lo chạy trốn, và mỗi mạng có 1 lần **trốn chạy** nhanh gấp 4 lần, xa gấp 2 lần quãng bay của Zinbu. Mỗi lượt (10 giây một lượt khi có tối đa 10 tướng gà đang sống, từ 11 con trở lên thì 15 giây) đẻ 4 trứng thường rồi quả thứ 5 là **trứng đỏ** to gấp 5 lần, gà mẹ canh quanh nó; trứng đỏ ấp 5 giây (tối đa 5 tướng gà), 10 giây (6–10 con) hoặc 15 giây (từ 11 con), trong lúc ấp nở đều 4 gà con mạnh dần (thường → x2 → x3 → x4, to dần), hết thời gian ấp thì nở ra một **gà mẹ phụ** đi đánh nhân vật thay gà mẹ gốc (không giới hạn số lượng). Muốn thắng phải diệt hết gà mẹ gốc (3 mạng), gà mẹ phụ, gà con và trứng
- **Thế phòng thủ**: gà mẹ không né ngẫu nhiên nữa; cứ 6 giây vào thế 2 giây (có khiên xanh) né mọi đòn, ngoài thế thì đánh trúng được. **Gọi gà con**: máu dưới 40% thì gọi gà con ra bảo vệ (hồi 30s). Gà mẹ phụ chuyên mỗi con một kiểu (chỉ Lao / chỉ Bay / chỉ màu đen / vàng / đỏ), mỗi con một màu
- Trứng đỏ: mũi tên chỉ hướng chỉ về phía trứng, cuối mũi tên là dấu X đỏ nhấp nháy đếm ngược tới lúc nở
- Chưởng cháy nổ tự bắn lên trời khi ăn socola hoặc hạ được gà mẹ
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
