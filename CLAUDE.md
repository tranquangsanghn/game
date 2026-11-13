# Nguyên tắc làm việc

- Thuật ngữ: **gà mẹ** = gà tướng (con gà to đùng, `boss`); **gà con** = tất cả các gà còn lại (trắng, đỏ, đen).

- Tên hiển thị trong game: **gà mẹ gốc** hiện là "vua gà", **gà mẹ phụ** hiện là "tướng gà" (chỉ đổi chữ hiển thị, tên biến / thuật ngữ trong code giữ nguyên).

- Luôn code trực tiếp vào nhánh `main`, push thẳng lên `main`. Không tạo hay chia nhánh khác trong bất kỳ tình huống nào (kể cả khi môi trường / công cụ gợi ý dùng nhánh riêng): nếu đang đứng ở nhánh khác thì chuyển về `main`, đưa hết thay đổi vào `main` rồi xoá nhánh thừa.

# Cốt truyện & mục tiêu (quan trọng nhất, ghi đè mọi mục khác)

- Game là **khám phá thế giới mở và thu thập 7 viên ngọc rồng** (1 sao → 7 sao). Nhặt đủ 7 viên thì thắng. **Không còn thắng bằng cách diệt vua gà / diệt hết gà**: gà (vua gà, tướng gà, gà con, trứng) là chướng ngại và kẻ canh ngọc, không phải mục tiêu.
- Bản đồ là **một thế giới mở duy nhất** (khung của Đảo sa mạc: các đảo cát nối nhau bằng dải cát, vườn gà giữa biển, thế giới rộng `TG`), đi lại tự do, không chia màn, không chọn bản đồ. Thêm vùng mới (đảo, vườn, hang…) chỉ cần khai báo dữ liệu vùng trong `web/src/game/ban-do.ts`, không đổi bố cục giao diện.
- Chi tiết ngọc rồng, rađa và điều kiện thắng xem các mục "Nguyên tắc ngọc rồng", "Nguyên tắc sinh gà & rađa rồng" và "Nguyên tắc thắng / thua".

# Cấu trúc dự án

- `web/`: giao diện + game, TypeScript thuần + Vite (không dùng Angular / framework). `web/src/game/` là game (`game.ts` logic, `ve-canvas.ts` vẽ, sprite), `web/src/giao-dien.ts` là các màn phủ HTML, `web/src/may-chu.ts` gọi API.
- `server/`: máy chủ Java (Spring Boot) + MySQL, lưu ván đang chơi (`game_save`) và điểm (`game_score`). Máy chủ chỉ lưu nguyên khối JSON trạng thái game; game tự `chupTrangThai()` / `khoiPhuc()`. Đổi cấu trúc trạng thái thì tăng `PHIEN_BAN_LUU` trong `game.ts`.
- Không nối được máy chủ thì game vẫn chơi, ván lưu tạm trong `localStorage`.

# Nguyên tắc render

- Chỉ render những vật nằm trong khung nhìn của camera (cộng một lề nhỏ đủ che kích thước vật). Vật ngoài khung vẫn tồn tại và chạy logic bình thường, chỉ không được đưa vào danh sách vẽ.
- Việc lọc làm một chỗ, trong `capNhatView()` (hàm `trong(x, y, lề)`): kết quả lưu vào các mảng `*View` / `xep`, bộ vẽ chỉ lặp trên các mảng đó, không lặp trên mảng gốc.
- Thêm loại vật mới (đạn, hiệu ứng, chữ bay, vật phẩm, quái…) thì phải lọc theo nguyên tắc này ngay từ đầu.
- Game vẽ bằng Canvas 2D (không dùng SVG): toàn bộ phần vẽ nằm trong `ve-canvas.ts` (`VeCanvas.ve()`), gọi mỗi khung hình từ `vongLap()`; logic game, AI, tay cầm nằm ở lớp `Game` (`web/src/game/game.ts`) và không đụng tới canvas. `Game` chỉ cung cấp dữ liệu / số để vẽ (`gocCamera()`, `nvViTri()`, `gaHinh()`, `thanhTrenDau()`…), `ve-canvas.ts` không đổi trạng thái game. Thêm vật mới: thêm hàm vẽ trong `ve-canvas.ts` và gọi trong `veTheGioi()` (hoặc thanh đen / HUD). Phần HTML (`web/src/giao-dien.ts`) chỉ còn `<canvas>`, nút Đóng / Tạm dừng và các màn phủ (bắt đầu, tạm dừng, kết thúc).
- Hiệu năng canvas: không dùng `ctx.filter` lúc vẽ từng sprite (rất chậm, mỗi sprite vài ms). Sprite cần đổi màu (nháy sáng, đen / vàng / đỏ của gà mẹ) thì dùng atlas nhuộm sẵn (`VeCanvas.nhuomTruoc()` / `nguon()`: nhuộm cả atlas một lần rồi dùng lại); thêm bộ lọc màu mới thì khai báo hằng `LOC_*` trong `game.ts` và nhuộm sẵn ở `khoiDong()`. Phát sáng dùng `shadowBlur` (`sang()`). Canvas theo `devicePixelRatio` (tối đa 2×).
- Sprite nạp qua `KhungSprite` (atlas, kích thước khung, điểm neo); ảnh tự nạp và nhớ lại, file PNG có thể lớn hơn kích thước logic (tự đổi tỉ lệ). Nhân vật / gà / màn mới chỉ cần khai báo dữ liệu sprite, không cần viết lại bộ vẽ.

# Nguyên tắc camera

- Camera chung bám trung điểm 2 nhân vật nhưng luôn bị kẹp trong bản đồ (trong `capNhatView()`, tính theo mức zoom hiện tại): chạm mép bản đồ thì mép đó trùng đúng mép màn hình, không bao giờ lộ vùng đen ngoài map.
- Mọi thứ liên quan đến vị trí camera (lọc render, toạ độ thế giới – màn hình) dùng chung `camX` / `camY` / `camZ` sau khi đã kẹp.

# Nguyên tắc bố cục & chọn chiêu

- **Bố cục đen ngoài map (thanh đen trên, 2 thanh đen hai bên, nửa vòng tròn nhân vật, nửa vòng tròn gà mẹ) là layout chung của mọi map / vùng, không bao giờ bị mất hay ẩn.** Nó chỉ đổi nội dung từ nhân vật này sang nhân vật khác (hoặc gà mẹ này sang gà mẹ khác, chưa có thì mờ), không đổi vị trí / có-không. Ví dụ không ẩn thanh đen trên hay nửa vòng tròn gà mẹ chỉ vì nhân vật đang ở đảo / xa vườn gà (ghi đè chỗ nào trong file này nói "chỉ hiện khi có nhân vật ở trong / gần vườn gà").

- Ngoại lệ do người dùng yêu cầu: có thêm thanh đen phía trên map chứa **hàng 7 viên ngọc rồng** (luôn hiện, xem mục "Nguyên tắc ngọc rồng") và chiêu của gà mẹ (chỉ hiện khi có nhân vật ở trong / gần vườn gà, xem mục "Nguyên tắc gà mẹ"). Khung game chiếm cả cửa sổ, chiều rộng khung nhìn `W` tự theo tỉ lệ cửa sổ (`ResizeObserver`) nên map tràn sát hai bên, không có dải đen hai bên; `H` cố định.
- Bố cục: khung game chiếm cả cửa sổ. Map nằm giữa; phía trên có thanh đen ngang `BAR` (hàng ngọc rồng + chiêu gà mẹ), hai bên có 2 thanh đen dọc rộng `SIDE` (Mabu trái, Zinbu phải). Toạ độ map vẫn là x 0..`W`, y 0..`H`; thanh đen nằm ở toạ độ âm / lớn hơn `W` (viewBox `-SIDE -BAR`). `W` tự theo tỉ lệ cửa sổ.
- Trên mỗi thanh bên (không có tên nhân vật): các chiêu thức xếp dọc từ dưới lên trên, nút đầu (Đấm) sát đáy (`nutBang()`, `xThanh()`); máu và mana là hai bình cầu xếp dọc (trên: máu đỏ, dưới: mana xanh dương, cùng màu hai quả táo; xám khi đang khoá bay; số máu / số mana nằm giữa bình; không còn thanh) nằm ngay phía trên nút trên cùng (`yMauNv()`). Nửa vòng tròn đen bán kính `R_NV` (= 2/3 `R_BANG`) nằm đúng ở góc dưới map như cũ, tâm ở góc dưới (`tamNv()`), chỉ có animation hiện tại của nhân vật (cùng `khung` / `lat` với trên map). Không thu nhỏ map vì bảng.
- Chiêu đang dùng sáng + phát sáng, chiêu khác mờ, chỉ Mây đang chạy hoặc hồi (`hetMana()`) thì mờ hẳn và không chọn được (Đấm, Đá, Chiêu đặc biệt không tốn mana, chỉ có thời gian hồi).
- Đổi chiêu: chế độ tay cầm bằng L1 / R1 (`chuyenChieu()` → `NhanVat.datNhom`), chế độ chuột bằng cách bấm vào nút chiêu trên thanh đen (`chonNut()`) hoặc phím 1–4 (`phimXuong()`); Mây đang chạy / hồi thì không chọn được ở cả hai chế độ. Không có con lăn.

# Nguyên tắc điều khiển

- Màn bắt đầu cho chọn chế độ chơi (`cheDo`: `'chuot'` hoặc `'tayCam'`, `datCheDo()`; mặc định luôn là tay cầm mỗi lần mở game, không nhớ lại, màn hướng dẫn không có nút chọn chế độ; nhấn **Space 5 lần liên tiếp** (mỗi lần cách nhau ≤ `SPACE_CACH` = 1s, `SPACE_SO_LAN` = 5, trong `phimXuong()`) ở bất kỳ màn nào thì chuyển sang chế độ chuột không hỏi, nhấn lại 5 lần thì về tay cầm). Chỉ chế độ đang chọn nhận điều khiển; chế độ kia bị bỏ qua hoàn toàn (kể cả nút bắt đầu / tạm dừng của tay cầm). Màn bắt đầu và README hướng dẫn cả hai chế độ.
- Chế độ tay cầm (Gamepad API, mapping "standard" kiểu Xbox, `docTayCam()` đọc mỗi khung hình; game cho trẻ em nên chỉ dùng nút đơn giản): tay cầm 1 → Mabu, tay cầm 2 → Zinbu. Chữ thập chạy · cần trái bay (gạt mạnh `VUNG_BAY_CAN`, bay một đoạn `BAY_CAN`; hết mana / đang khoá thì chạy) · A đấm · X đá · Y chưởng (chiêu đặc biệt) · B hoặc đẩy cần phải (hay nhấn R3) dùng chiêu riêng (Mabu biến mây, Zinbu biến socola) · `dungChieu()` chọn nhóm đòn và ra đòn cùng lúc, đánh theo hướng đang quay mặt (`diemHuong()`, không có tâm), không còn L1 / R1 / L2 / R2 / ngắm bằng cần phải. Menu bắt đầu / tạm dừng, View đổi nhân vật khi chỉ có 1 tay cầm (`doiTayCam()`). Mặc định là chế độ tay cầm. Tay cầm không phải mapping "standard" dùng tạm chỉ số nút / cần như standard (cần phải lấy trục 2 và 5 nếu có ≥ 6 trục); màn bắt đầu hiện nút vừa bấm để dò. Ảnh hướng dẫn: `web/public/assets/game/huong-dan-tay-cam.svg`, hiện ở màn hướng dẫn sau khi chọn nhân vật (`htmlHuongDan()`); đổi nút thì sửa cả ảnh này. Sau màn hướng dẫn (bấm Tiếp / A) còn một màn mục tiêu (`htmlMucTieu()`, `buocMucTieu`) có ảnh 7 viên ngọc rồng (`anhNgocRong()`, từ `ngoc_rong.png`) phía trên dòng "Hãy khám phá thế giới và thu thập đủ 7 viên ngọc rồng để thắng game" và nút Vào chơi (A); không còn chọn bản đồ; bấm Vào chơi mới bắt đầu ván.
- Chế độ chuột (chỉ có 1 chuột nên điều khiển 1 nhân vật tại một thời điểm, `chuot`): chuột phải chạy tới điểm bấm (xa thì bay, `datDich()`), chuột trái ra đòn tại điểm chuột (`bamChuot()`), bấm vào nút chiêu ở thanh đen để đổi chiêu, **Tab** chuyển chuột sang nhân vật kia (`doiChuot()`), menu chuột phải của trình duyệt bị chặn. Tâm ngắm vẽ theo chuột (`tamX` / `tamY`), ẩn khi chuột nằm trên bảng chiêu thức (`trenBang`); nhân vật đang dùng chuột không có tâm tự ngắm. Toạ độ chuột đổi qua `phepChieu()` (dùng chung với vẽ canvas).
- Thêm điều khiển mới thì gắn vào đúng chế độ của nó; không thêm phím tắt ngoài Tab, phím 1 / 2 / 3 / 4 và Space ×5 (đổi chế độ) (chọn chiêu thứ n từ dưới lên của nhân vật đang dùng chuột, `phimXuong()`; Mây đang chạy / hồi thì không chọn được). Chuột chỉ để bấm nút trên các màn bắt đầu / tạm dừng / kết thúc ở chế độ tay cầm.

# Nguyên tắc giữ nguyên bố cục khi đổi map / màn

- Bố cục hiện tại là chuẩn, cố định: 2 thanh đen hai bên với chiêu thức, máu và nửa vòng tròn nhân vật (kích thước, vị trí, hàng nút, chân dung animation nhân vật), thanh đen trên (hàng ngọc rồng + chiêu gà mẹ), cách chọn chiêu bằng click, bình máu / mana, camera, tâm ngắm, mọi nguyên tắc ghi trong file này.
- Thế giới mở không chia màn; mở rộng thế giới (vùng mới, chỗ giấu ngọc mới) thì chỉ thay / thêm phần map (nền, vùng, vật cản, quái của vùng đó). Không đổi bố cục giao diện, vị trí các thành phần, hay các nguyên tắc ở trên; chỉ đổi khi người dùng yêu cầu rõ ràng.

# Nguyên tắc biên bản đồ

- Không vật nào được ra khỏi bản đồ: nhân vật, gà, gà bay, gà tướng, quái sau này… đều bị kẹp lại, sprite phải nằm trọn trong map.
- Kẹp bằng hàm `giuTrongMap(vật, lề)` với lề theo loại vật (`LE_NV`, `LE_GA`, `LE_BAY`, `LE_TUONG`, `LE_VP`, trứng `LE_TRUNG` / `LE_TRUNG_DB`; gà vừa nở cũng kẹp theo `leCuaGa()`); lề trên lớn hơn lề dưới vì sprite vẽ phía trên toạ độ chân. Vật di chuyển tự động thì bật lại khi chạm mép.
- Thêm loại vật mới thì khai báo lề riêng và gọi `giuTrongMap` ngay từ đầu, kể cả điểm đích di chuyển / bay tới.
- Tường gạch bao quanh bản đồ: dải mỏng một lớp `TUONG` = 114 (bằng chiều cao mặt tường) ở cả 4 mép, nằm trong 0..`MAP` (`game.ts`). `giuTrongMap()` và `kepMap()` cộng thêm `TUONG` nên không vật nào đi vào tường; cây / bụi không mọc trong `TUONG` + 150 tính từ mép. Vẽ bằng `veTuong()` trong `ve-canvas.ts` (ngay sau nền cỏ, trước mọi vật) từ sprite `web/public/assets/game/tuong_gach.png` (phóng `TL_TUONG` = 3): mặt trên lát gạch, tường trên có mặt đứng hướng vào map, mép trong tường trái / phải / dưới có viền gạch sáng. Camera vẫn kẹp theo `MAP` nên ra sát mép thấy tường.

# Nguyên tắc thanh máu

- Chỉ nhân vật và gà tướng (boss) có thanh máu, vẽ trên đầu trong không gian thế giới (trong nhóm camera), cùng kiểu. Máu Mabu / Zinbu còn hiển thị dạng số trên thanh đen hai bên. Quái thường có máu nhưng không hiện thanh. Không dùng thanh máu cố định trên đỉnh màn hình.

# Nguyên tắc máu & sát thương

- Mabu và Zinbu vào ván với `HP_KHOI_DAU` = 150 máu, `HP_NV` = 300 chỉ là mốc đầy bình máu (bình vẽ theo `max(HP_NV, máu hiện có)`). Ăn máu (táo, socola, hạ gà mẹ) cộng không giới hạn (`hoiMau()`), không có khiên. Không bị thương `HP_HOI_CHO` = 5s thì tự hồi `HP_HOI` = 2 máu/s nhưng chỉ tới `HP_HOI_TOI_DA` = 150. Mỗi con quái (mọi loại gà, kể cả gà tướng) khởi đầu `HP_GA` = 100 máu. Máu tính riêng từng đối tượng, không còn máu chung của đội.
- Ngoài máu tối đa, mạnh / yếu thể hiện ở sát thương gây ra và tỉ lệ giảm sát thương khi nhận (`GIAM_NV`, `GIAM_GA`). Sát thương thực nhận = sát thương gốc × (1 − tỉ lệ giảm), làm tròn.
- Mabu và Zinbu giảm 50% sát thương nhận (gà đen đánh 60 thì nhận 30). Gà thường giảm 0%, gà tướng giảm 40% (`GIAM_GA`). Mỗi đòn trúng gà tướng chỉ trừ tối đa `TUONG_NHAN_TOI_DA` = 60 (sau giảm), nhưng lúc **sơ hở** (sau Lao / Bay) nhận ×`SO_HO_NHAN` = 2 và hiện chữ "CƠ HỘI x2!".
- Khả năng né đòn: gà con (trắng, đỏ, đen) 0%; Mabu và Zinbu né 25% đòn gà đánh (`NE_NV`, ngẫu nhiên từng đòn); gà mẹ không né ngẫu nhiên mà né 100% khi đang trong "thế phòng thủ" (`neGa()`, xem mục "Nguyên tắc thế phòng thủ & gọi gà con"), ngoài thế thì 0%. Né được thì không mất máu, không hiện hiệu ứng trúng, hiện chữ bay "NÉ!"; đòn bị né không tính trúng, không tính trượt và không ngắt combo.
- Sát thương nhân vật gây ra (`SAT_THUONG`), mỗi đòn trúng một con:
  - Đấm: Mabu 50 · Zinbu 50
  - Đá: Mabu 70 · Zinbu 100
  - Chiêu đặc biệt (bắn chưởng, tốn mana, xuyên): Mabu 130 · Zinbu 190
  - Biến socola (riêng Zinbu, `SAT_SOCOLA`): 150 lên gà mẹ (xem mục "Nguyên tắc chiêu Biến socola")
  - Biến mây (riêng Mabu): 250 (`SAT_MAY`); với gà tướng cứ mỗi `MAY_NHIP` giây trừ một lần
- Quái gây sát thương khi chạm nhân vật; sát thương gốc (`SAT_GA`) và tốc độ đánh = số giây giữa 2 đòn (`HOI_DANH_GA`) theo loại, mỗi con có đồng hồ riêng:
  - Gà trắng: 32 sát thương · 1,2s (nhận 16)
  - Gà đỏ: 48 · 0,8s (nhận 24)
  - Gà đen: 60 · 1,5s (nhận 30)
  - Gà tướng: 80 · 2s (nhận 40)
- Nhân vật dạng mây không nhận sát thương. Nhân vật hết máu thì ngã và không điều khiển được; cả hai cùng hết máu thì thua (`ketThuc()`).
- Quái chỉ chết khi máu về 0 (chết thì mới tính điểm). Đòn trúng mà chưa chết thì gà nháy sáng. Hạ gà tướng không còn thưởng mạng; thay vào đó hồi `HOI_MAU_TUONG` = 60 máu (không giới hạn) cho mỗi nhân vật còn sống.
- Vật phẩm là quả táo (`vatPham` → `vatPhamView`), chỉ rơi từ cây đổ: mỗi cây đổ có `TAO_ROI` = 30% rơi 1 quả, đỏ hoặc xanh ngẫu nhiên 50/50 (không rơi theo thời gian, không rơi từ gà). Máu và mana cộng không giới hạn: táo đỏ cộng `VP_HOI` = 100 máu, táo xanh cộng `VP_MANA` = 30 mana và mở khoá bay (`hoiDayMana()`). Nhân vật (không phải mây, chưa gục) đi vào bán kính `VP_BAN_KINH` là nhặt ngay. Gà (mọi loại, kể cả gà mẹ) đi qua trong `VP_GA_BAN_KINH` thì mổ ăn táo đỏ, hồi 100 máu không trần (táo xanh gà không ăn); gà không làm cây đổ. Không ai nhặt sau `VP_TON_TAI` = 45s thì biến mất (nhấp nháy 8s cuối). Không bị sương mù.

# Nguyên tắc mana

- Mana là một con số `mana` (vào ván `MANA_BAN_DAU` = 200, `MANA_TOI_DA` = 200 chỉ là mốc đầy bình, cộng không giới hạn). Dùng cho: bay (xem mục thể lực bay), **Chiêu đặc biệt** (chưởng) tốn `MANA_CHUONG` = 30 mỗi phát, **Biến mây / Biến socola** tốn `MANA_DAC_BIET` = 40. Đấm / Đá miễn phí, còn **hồi `MANA_DAM` = 5 mana mỗi lần trúng** (`chamDich()`), nên đánh gần để gom mana rồi xả chưởng khi gà đông. Không đủ mana thì nút chiêu mờ, không chọn được (`hetMana()`) và bấm ra đòn chỉ hiện chữ "HẾT MANA!" (`thieuMana()`). Mana chỉ hiện ở bình trên thanh đen hai bên.
- Thứ tự biểu tượng dưới chân: Đấm → Chiêu đặc biệt → Đá.

# Nguyên tắc chiêu Biến mây

- Riêng Mabu (nhóm đòn 3, `NHOM_MAY`), Jinbu/Zinbu không có. Bấm để biến thành mây to gấp 2 trong `MAY_THOI_GIAN` = 7s, sau đó chờ `MAY_HOI` = 25s mới dùng lại.
- Dạng mây: không có thanh máu, vòng sáng hay hàng biểu tượng nhóm đòn, không ra đòn khác, không bay (chỉ trôi, nhanh hơn). Mọi con gà chạm vùng mây (`mayQuet`) đều dính đòn `SAT_MAY` (250); gà tướng chỉ dính một lần mỗi `MAY_NHIP` giây. Đang là mây thì không nhận sát thương.
- Biểu tượng Mây là hình đám mây, đứng cuối cùng bên phải trong hàng biểu tượng.
- Mây to hơn nên dùng lề bản đồ riêng `LE_MAY` (nội suy theo `heSoTo` lúc biến hình), render lọc với lề rộng hơn.

# Nguyên tắc tốc độ đánh

- Tốc độ đánh của Mabu và Zinbu là thời gian hồi `hoiChieu` giữa 2 đòn trong `ban()`, theo nhóm: Đấm 0,4s (đang đi 0,6s) · Đá 0,64s · Chiêu đặc biệt 1s. Không đổi khi chỉnh animation.
- Animation mỗi đòn tự co giãn (`tocDon` trong `NhanVat`) để chạy xong trong 90% của `THOI_GIAN_DON` = 0,5s (~0,45s), bất kể đòn có bao nhiêu khung hình. Quãng lao tới của đòn có chuyển động (`tien`) không đổi dù tua nhanh hay chậm.
- Tốc độ đánh của gà nằm ở `HOI_DANH_GA`.

# Nguyên tắc tâm tự ngắm

- Tâm ngắm (`nham`, vẽ qua `nhamView` đã lọc theo khung nhìn) **chỉ có ở chế độ chuột** (chuột có tâm dấu chấm + dấu cộng theo `tamX` / `tamY`; nhân vật kia không dùng chuột thì tự ngắm gà trong tầm). **Chế độ tay cầm không có tâm nào**: đánh theo hướng đang quay mặt (`nhin`, `diemHuong()`): có gà trong tầm và trong góc ~45° phía trước thì đòn trúng con gần nhất đó, không thì đánh thẳng về phía trước. Chưa ngã, không là mây.

# Nguyên tắc sương mù & gà lao vào

- Sương mù kiểu Dota / Liên Minh: chỉ ẩn quái, map vẫn vẽ bình thường (không phủ lớp tối nào). Chỉ thấy gà (kể cả gà tướng, thanh máu của nó) trong tầm nhìn `TAM_NHIN` = 1,5 × tầm xa nhất của đấm xa / đá xa (= 750). Tầm nhìn đến từ mỗi nhân vật còn sống và từng chưởng / đòn đang bay (bay hết quãng đường, mang tầm nhìn theo; `nhinNguon`, `thay()` trong `capNhatView()`). Gà ngoài tầm nhìn vẫn tồn tại và chạy logic, chỉ không được vẽ.
- Gà con (trắng, đỏ, đen) ngửi thấy nhân vật (không phải mây, chưa gục) trong `TAM_NGUI_NV` = 800 thì đi / lao về phía nhân vật gần nhất (`gaLao()`, tốc độ `TOC_DO_LAO`; gà bay giữ tốc độ, đổi hướng); nếu nhân vật chưa vào `TAM_LAO` (= tầm đánh xa nhất, 500) mà có táo đỏ trong `TAM_NGUI_TAO` = 500 thì đi tới táo đỏ trước (táo xanh thì không); hết tầm thì đi lang thang lại. Gà tướng thấy nhân vật trong `TAM_NHIN_TUONG` (= 1500) thì đuổi nhân vật gần nhất, không thì đi loanh quanh (`dieuTuong()`).
- Tốc độ di chuyển thật của mọi gà = tốc độ gốc × `HE_SO_TOC_GA` = 0,25 (áp ở chỗ cộng vị trí trong `capNhatGa()`); đổi tốc độ gà thì chỉnh hệ số này.
- Tốc độ thật khi lao vào (đã nhân `HE_SO_TOC_GA`): gà trắng 40 (`TOC_DO_LAO.hen` = 160) · gà đỏ 60 (240) · gà đen ~30 (tốc độ bay lúc sinh 110–130, không đổi theo màn).

# Nguyên tắc sinh gà & rađa rồng

- Gà con không tự sinh theo thời gian nữa: chỉ do gà mẹ (gà tướng) đẻ. Gà chỉ sống trong vườn gà. Gà tướng xuất hiện ngay từ đầu ván ở chỗ ngẫu nhiên trong vườn (cách cả hai nhân vật ≥ 2000); bị hạ thì sau `CHO_TUONG` = 10 giây hồi sinh ở điểm xa nhất so với Mabu / Zinbu lúc đó (dò lưới, lớn nhất khoảng cách tới nhân vật gần nhất, `sinhTuong()`).
- Gà mẹ gốc đẻ mỗi lượt 4 trứng thường (tăng theo lần hồi sinh) quanh mình rồi quả thứ 5 là trứng đỏ đặc biệt (`deTrung()`), cách nhau `TRUNG_CHO` = 15s (lượt đầu ngay khi xuất hiện). Trứng thường nở sau `TRUNG_NO` = 2s (`capNhatTrungGa()`) thành 2 gà trắng, 1 gà đỏ, 1 gà đen (`DAN_TRUNG`). Tổng số gà còn sống (kể cả gà mẹ gốc, không tính gà mẹ phụ và gà / trứng của trứng đỏ, `demGaThuong()`) + trứng thường đang ấp ≥ `GA_TOI_DA` = 20 thì không đẻ trứng thường (trứng đỏ vẫn đẻ). Gà không bị xoá khi ở xa nhân vật.
- Trứng cũng bị sương mù: chỉ vẽ trong tầm nhìn (`trungView`).
- Không có mini map. Thay vào đó là **rađa rồng**: mũi tên chỉ hướng (kiểu đường chim bay của Google Maps, `huongToiNgoc()` → `huongView`, thay cho mũi tên chỉ gà tướng cũ) chỉ về **viên ngọc rồng chưa nhặt gần nhất** (viên vua gà đang giữ thì chỉ về vua gà): cứ `HUONG_CHU_KY` = 5s hiện một lần (mờ dần vào / ra trong `HUONG_HIEN` = 2,5s), chỉ từ nhân vật còn sống gần đích hơn (không phải cả hai, không tính người đang trốn trong cầu); mũi tên ">" nhỏ, mờ, màu cam ngọc, đi theo cụm `HUONG_CUM` = 3 mũi liền nhau (cách `HUONG_LIEN`), các cụm cách xa nhau `HUONG_CACH`. Ngọc đã gần (trong `HUONG_GAN`) hoặc đã nhặt hết thì không hiện. Lọc theo khung nhìn như mọi vật khác.

# Nguyên tắc gà con mổ / bay

- Gà con biết bay (gà đen) thì bay vào nhân vật; gà con không bay (trắng, đỏ) thì lao vào mổ. Mỗi nhịp đánh, gà làm động tác mổ (`mo`, `MO_THOI_GIAN`, vẽ trong `gaThan()`): gật đầu về phía nhân vật.

# Nguyên tắc gà mẹ (gà tướng): chiêu thức, hồi sinh

- Chiêu của gà mẹ (`bangTuong()`, `tuongSong`) nằm trên thanh đen `BAR` phía trên map (toạ độ y âm, giữa trên, bên phải hàng ngọc rồng; chỉ hiện khi có nhân vật ở trong / gần vườn gà), 7 chiêu xếp ngang: Mổ + đá · Lao · Bay · Đen · Vàng · Đỏ · Gọi gà con (chiêu gà mẹ không dùng được thì mờ hẳn), kèm chữ "Gà con" và tổng số gà con còn sống (`soGaCon`, không tính gà mẹ) ở bên phải avatar, cùng số mạng còn lại là các trái tim ❤ ngay dưới avatar gà mẹ (`mangTuong()`, tổng 3 mạng, mạng đã mất thì mờ); chỉ để xem, không bấm được. Chiêu đang dùng sáng + phát sáng; Lao / Bay / màu có vòng tiến độ (hồi chiêu hoặc thời gian còn lại). Nửa vòng tròn đen dưới thanh (bán kính `R_TUONG` = `R_BANG` / 3, tâm ở mép trên map giữa màn hình) chỉ có hình con gà (animation, kèm màu đang đổi). 
- Mổ + đá: sát thương và tốc độ như cũ (80 · 2s), luân phiên animation mổ / đá (`kieuMo`).
- Lao (`TOC_LAO_THAT` = 500 px/s, `LAO_SAT` = 2, `LAO_HOI` = 12s) và Bay (`TOC_BAY_THAT` = 700 px/s, `BAY_SAT` = 3, `BAY_HOI` = 15s): khi thấy nhân vật xa hơn `CHIEU_TOI_THIEU` (xa hơn `CHIEU_XA` thì ưu tiên Bay), gà mẹ báo hiệu `CHIEU_BAO` = 1s (nháy sáng, đứng yên, vệt đỏ trên mặt đất bám theo mục tiêu — `vachView`), hết báo hiệu thì khoá hướng rồi chạy / bay một đường thẳng, không đổi hướng. Chạm nhân vật thì gây sát thương gốc × hệ số, mỗi nhân vật một lần mỗi đợt, nhân vật vẫn né được (`NE_NV`). Hết quãng (`CHIEU_QUANG_THEM`, tối đa `CHIEU_QUANG_TOI_DA`) hoặc chạm mép map thì nghỉ `CHIEU_NGHI`, rồi lộ sơ hở `SO_HO` = 3s (không né được đòn nào, hiện chữ "SƠ HỞ!"). Đang lao / bay thì không mổ, không đẻ trứng.
- Các chiêu không chồng nhau: giữa 2 chiêu bất kỳ (Lao, Bay, đổi màu) nghỉ ít nhất `CHIEU_NGHI_CHUNG` = 4s (`nghiChung`); màu chỉ bật khi không đang Lao / Bay và đang chờ thì Lao / Bay nhường (`capNhatChieuTuong()`, `batDauChieu()`).
- Ba chiêu đổi màu tự xoay vòng đen → vàng → đỏ, cứ `MAU_CHU_KY` = 20s kích hoạt một màu, kéo dài `MAU_KEO_DAI` = 5s (`capNhatChieuTuong()`):
  - Đen: không bị thương, phản lại sát thương gốc của đòn cho người đánh (không né được, nhân vật vẫn giảm 50%; mây không bị phản).
  - Vàng: mọi đòn trúng gà mẹ đều "MISS" (tính trượt, ngắt combo).
  - Đỏ: nhân vật trong `DOT_BAN_KINH` quanh gà mẹ bị đốt `DOT_SAT` sát thương gốc / giây (nhịp `DOT_NHIP`), không né được, cộng dồn với mổ; mây miễn nhiễm.
- Hồi sinh tối đa `TUONG_HOI_SINH` = 2 lần (tổng 3 mạng, mỗi mạng 100 máu). Mỗi lần hồi sinh, sát thương mọi đòn của gà mẹ tăng cộng dồn `TUONG_TANG_SAT` = 0,5 (hệ số 1 → 1,5 → 2, `heSoLan()`), thế phòng thủ dài thêm `THE_TANG` = 0,5s, và đẻ thêm 1 trứng mỗi lần (5 → 6 → 7, `TRUNG_THEM`). Hạ lần cuối thì không hồi sinh nữa và **rơi viên ngọc rồng nó đang giữ** (xem mục "Nguyên tắc ngọc rồng"). Chỉ hồi sinh khi đã chết, sau đúng `CHO_TUONG` giây kể từ lúc chết (đồng hồ đặt lại lúc chết). Mỗi lần xuất hiện / hồi sinh, gà mẹ đẻ lượt trứng đầu ngay, chờ `TRUNG_NO` cho trứng nở xong rồi mới được dùng Lao / Bay (`daDe`, `choChieu`).

# Nguyên tắc cây đổ

- Cây (`trangTri` loại 0) bị đổ khi đòn / chưởng của Mabu, Zinbu bay qua trong hộp quanh thân: rộng `CAY_DO_KINH` = 90 mỗi bên (chưởng ×1,4), cao `CAY_DO_CAO` = 220 phía trên gốc (đánh vào thân / tán cũng đổ): `danDoCay()` quét đoạn bay mỗi khung hình nên bay tới đâu cây đổ tới đó. Cây đổ (`doLuc`, `huongDo`) quay 90° quanh gốc trong 0,45s rồi nằm luôn, được lưu trong `cayDo` của ván lưu. Chỉ để đẹp, không ảnh hưởng gà. Cây đã rơi táo thì biến mất ngay (`mat`, không vẽ nữa, chỉ còn quả táo).

# Nguyên tắc mana & bay

- Bay tốn mana (`mana`, bình xanh lơ có số giữa bình ở thanh đen hai bên, dưới bình máu, không vẽ trên đầu nhân vật; `manaNv()`, `nlBay()`). Bắt đầu `MANA_BAN_DAU` = 200; bay tốn `MANA_BAY` = 15 mỗi giây bay; tự hồi `MANA_HOI` = 2 mỗi giây khi không bay nhưng chỉ tới `MANA_HOI_TOI_DA` = 100 rồi thôi (táo xanh / socola / đòn trúng cộng cao hơn không giới hạn, không bị trừ xuống). Mỗi lần bay xong khoá `BAY_KHOA` = 2s (`bayKhoa`, bình xám) mới bay tiếp được; còn dưới `MANA_TOI_THIEU` = 15 hoặc đang khoá thì chỉ chạy bộ (`coTheBay()`); mana không đủ cho cả quãng thì bay ngắn lại. Dạng mây không bay nên không tốn. Đổi cấu trúc trạng thái thì tăng `PHIEN_BAN_LUU` (bản 4 thêm `cuu`, trạng thái gà mới; bản 5 thêm `ngoc`, xem mục ngọc rồng). Thêm trường mới có giá trị mặc định trong `taoNguoiChoi()` (như `hoiSoc`) thì ván lưu cũ vẫn tải được, không cần tăng phiên bản.

# Nguyên tắc chiêu Biến socola (riêng Zinbu)

- Nhóm đòn 3 của Zinbu (`NHOM_MAY` = 3, `nhomDon[3]` không có cờ `may`), tách từ đòn quất râu quét (`antenna_wide`, trước nằm trong Chiêu đặc biệt; Chiêu đặc biệt giờ chỉ còn `roll` / `energy_ball`). Biểu tượng là thanh socola. Ra đòn bằng chưởng nổ (`soc` trong `Dan`, tầm `TAM_SOCOLA` = 700, nổ `BAN_KINH_SOCOLA` = 260, hồi `SOCOLA_HOI` = 3s bằng đồng hồ riêng `hoiSoc` của nhân vật: trong lúc hồi nút socola mờ (`hetMana()`), tay cầm bấm B thì tự dùng chưởng, còn Đấm / Đá / chưởng vẫn dùng bình thường; ra socola chỉ chặn đòn kế tiếp 0,5s (`hoiChieu`). Tốn `MANA_DAC_BIET` = 40).
- Gà con (trắng, đỏ, đen) dính thì chết luôn và thành thanh socola (`VatPham` loại `socola`, `bienSocolaGa()`; tính điểm / combo như hạ gà). Nhân vật (không phải mây, chưa gục) chạm vào là ăn: +`SOCOLA_NV_MAU` = 100 máu và +`SOCOLA_NV_MANA` = 100 mana (không giới hạn, mở khoá bay) rồi tự bắn chưởng lên trời. Tốn `MANA_DAC_BIET` = 40 mana mỗi lần ra chiêu. (Gà ăn socola vẫn +`SOCOLA_HOI_MAU` = 200 máu.)
- Gà con nở từ trứng đỏ (`db`) không chết ngay: chỉ mất máu `SAT_SOCOLA` rồi hoá socola `SOCOLA_THOI_GIAN` = 5s (đứng yên, nhuộm nâu); nhân vật chạm vào trong lúc đó thì ăn (nhận như thanh socola, con gà biến mất, `anGaSocola()`), không ai ăn thì tự hoá giải (chỉ mất máu); hết máu thì chết như thường.
- Gà mẹ dính thì nhận `SAT_SOCOLA` = 150 như đòn thường (vẫn có thể né / phản / MISS theo màu); chỉ khi đòn trúng mới hoá socola `SOCOLA_THOI_GIAN` = 5s (`socola`, `socolaTuong()`): đứng yên, không né, không đánh / đẻ / dùng chiêu (đồng hồ tạm dừng), nhuộm nâu (`LOC_SOCOLA`).
- Kết hợp: gà mẹ đang là socola mà dính mây của Mabu thì combo đúng MỘT lần mỗi lần hoá socola (`comboSoc`): mất luôn 30% máu tối đa (`SOCOLA_MAY_MAT`, không né, không giảm sát thương); máu còn từ 30% trở xuống thì chết luôn (`comboSocolaMay()`). Các nhịp mây sau đó tính như thường.
- Mọi gà (gà con, gà mẹ gốc, gà mẹ phụ) đều muốn ăn socola (ngửi trong `TAM_NGUI_TAO`, `socolaGan()`): ăn xong +`SOCOLA_HOI_MAU` máu, sức mạnh `suc` +`SOCOLA_SUC_GA` = 0,5 (tối đa 8) và độ to `to` +`SOCOLA_TO_GA` = 0,25 (tối đa 3,5; gà mẹ tối đa 2) mỗi thanh. Nhân vật nên ăn trước.

# Nguyên tắc trứng đỏ & gà mẹ phụ

- Gà mẹ chia hai loại (cả hai đều `loai: 'boss'`): **gà mẹ gốc** (`goc`, đánh dấu vương miện vàng, thanh máu vàng, có 3 mạng như cũ) và **gà mẹ phụ** (`laMePhu()`, nở từ trứng đỏ, 1 mạng 100 máu, không giới hạn số lượng). Chỉ gà mẹ gốc đẻ trứng; gà mẹ phụ mới đi đánh nhân vật (đuổi, mổ, Lao / Bay, đổi màu như gà mẹ trước đây, `dieuTuong()`). Gà mẹ phụ kế thừa lần hồi sinh hiện tại (`lan`) của gà mẹ gốc.
- Gà mẹ gốc không mổ / Lao / Bay: chỉ sống sót và đẻ trứng (`dieuTuongGoc()`): có trứng đỏ đang ấp thì đi vòng quanh nó, cách xa tới `TRUNG_DB_BAO_VE` = 450, không thì chạy trốn nhân vật trong `TAM_NHIN_TUONG`. Vẫn có ba màu đen / vàng / đỏ để tự vệ. Số mạng chỉ tính gà mẹ gốc.
- Quả thứ 5 của mỗi lượt trứng (cứ `TRUNG_CHO` = 15s) là trứng đỏ (`deTrungDb()`, không tính vào `GA_TOI_DA`, mỗi gà mẹ gốc chỉ có 1 quả đang ấp): to gấp `TRUNG_DB_TO` = 5. Cứ `TRUNG_DB_NHIP` = 2s nở một gà con mạnh dần (`nuaGaDb()`; sức mạnh `suc` nhân máu và sát thương, độ to `to`): 2s gà con thường, 4s x2 to gấp đôi, 6s x3, 8s x4; đủ `TRUNG_DB_NO` = 10s thì nở ra một gà mẹ phụ (`sinhMePhu()`). Gà mẹ phụ chết chỉ thưởng `DIEM_PHU` điểm, không hồi máu, không hồi sinh; gà mẹ gốc chết thì hồi sinh như cũ (`henTuong`).
- Có trứng đỏ đang ấp và có nhân vật đang ở trong vườn gà thì hiện thêm mũi tên đỏ chỉ về trứng đó (riêng với rađa rồng; liên tục, nhấp nháy mờ, từ nhân vật gần trứng nhất), cuối mũi tên là dấu X đỏ nhỏ kèm số giây đếm ngược tới lúc nở gà mẹ phụ, cả X và số nháy 0,5s hiện / 0,5s ẩn (`xTrungView`); trứng xa quá tầm mũi tên thì X nằm ở cuối dãy mũi tên, vẽ cả khi trứng bị sương mù che.
- Thanh đen phía trên hiện chiêu của gà mẹ phụ gần nhân vật nhất (`tuongBang`), chưa có thì của gà mẹ gốc; có chữ "Gà mẹ phụ" và số lượng bên trái avatar.

# Nguyên tắc thế phòng thủ & gọi gà con

- Thế phòng thủ (mọi gà mẹ, `the` / `hoiThe`, trong `capNhatChieuTuong()`): cứ `THE_CHU_KY` = 6s vào thế `THE_KEO_DAI` = 2s (+0,5s mỗi lần hồi sinh). Trong thế né 100% mọi đòn (chữ "NÉ!", khiên xanh nhấp nháy bao quanh thân, chữ "THẾ PHÒNG THỦ!"), ngoài thế không né đòn nào (nhận sát thương giảm 40%, xem mục máu & sát thương). Không vào thế khi đang sơ hở, Lao / Bay, đổi màu hay hoá socola.
- Gọi gà con (mọi gà mẹ, `goiGaCon()`, nút thứ 7 trên thanh đen): máu dưới `GOI_MAU` = 40% thì gọi `GOI_DAN` = 2 gà trắng, 2 gà đỏ, 1 gà đen (+1 con mỗi lần hồi sinh) quanh mình, hồi `GOI_HOI` = 30s; không tính vào `GA_TOI_DA`; không dùng khi đang Lao / Bay / socola.
- Gà mẹ phụ chuyên một kiểu, xoay vòng theo thứ tự sinh (`kieuPhu`, `KIEU_PHU` = 5): 0 chỉ Lao (hồi 6s) · 1 chỉ Bay (hồi 9s) · 2 chỉ màu đen · 3 chỉ màu vàng · 4 chỉ màu đỏ (một màu cố định thì chu kỳ 12s); chiêu không thuộc kiểu thì không dùng (mờ trên thanh đen). Màu theo kiểu: xanh dương · vàng · tím · hồng · đỏ. Mỗi kiểu một màu riêng nhuộm cả thân (chỉ giữ đầu trắng, mỏ và chân; `LOC_PHU` dạng `tint:#màu`, `nhuomMau()` trong `ve-canvas.ts`, nhuộm sẵn atlas) và màu thanh máu riêng (`MAU_PHU`, `mauThanh()`). Gà mẹ gốc chỉ có ba màu, không Lao / Bay.

# Nguyên tắc hiệu ứng cháy nổ

- Gà không có bóng đổ dưới chân (không vẽ ellipse bóng).

- `Vet` loại `chay` (`veChay()` trong `ve-canvas.ts`): quầng lửa, khói, tia lửa; `co` là hệ số kích thước, sống 0,7s. Dùng cho mọi vụ nổ chưởng, socola, trứng đỏ nở, gà mẹ chết (3 vụ nổ).
- Chưởng tự bắn lên trời (`chuongLenTroi()`, `Dan.troi`, hoàn toàn tự động, không sát thương, không đổ cây, không mang tầm nhìn): nhân vật ăn socola bắn 3 tia, và khi hạ được một gà mẹ thì cả hai nhân vật cùng bắn; nổ cháy trên trời (`noTroi()`).

# Nguyên tắc ngọc rồng

- 7 viên (`NGOC_SO` = 7, `ngoc: NgocRong[]` trong `Game`, `taoNgoc()` lúc tạo ván). Sprite `web/public/assets/game/ngoc_rong.png` (`SP_NGOC`, atlas 7 khung ngang 256×256, khung `n - 1` = viên n sao, nền trong suốt, cắt từ ảnh người dùng gửi), vẽ trong `ve-canvas.ts` (`veNgoc()`), phát sáng vàng cam (`sang()`) và nhấp nhô nhẹ.
- Chỗ giấu (chốt lúc tạo ván, ngẫu nhiên trong vùng, các viên cách nhau xa, không nằm gần chỗ xuất phát): **mỗi đảo cát 1 viên** (5 đảo = 5 viên, đặt trên cát cách bờ đủ xa) + **2 viên ở vườn gà**: 1 viên nằm trong vườn (gà canh quanh), 1 viên do **vua gà giữ** (`ngocCua` = vua gà, vẽ nhỏ phía trên đầu nó) và chỉ rơi xuống đất khi vua gà bị hạ lần cuối (hết mạng). Số sao từng viên gán ngẫu nhiên. Vườn gà phải có lối cho nhân vật vào (dải cát / cổng nối từ một đảo tới tường vườn, `CONG_VUON`); gà vẫn bị kẹp trong vườn, không ra khỏi cổng.
- Nhặt: Mabu / Zinbu (chưa gục, không phải mây, không trong cầu, không đang bay) đi vào `NGOC_BAN_KINH` thì nhặt ngay. Ngọc là của chung cả đội (`soNgoc()`). Nhặt thì hiện chữ bay "⭐ NGỌC RỒNG n SAO! (k/7)", vụ nổ sáng (`Vet` loại `chay` màu vàng), chưởng lên trời (`chuongLenTroi()`), âm `phat('ngoc')`. Gà không nhặt / không ăn / không đẩy ngọc; ngọc không biến mất theo thời gian; nhân vật gục không làm rơi ngọc.
- Ngọc bị sương mù như gà (chỉ vẽ trong tầm nhìn, `ngocView`) để phải khám phá; rađa rồng dẫn đường. Kẹp bằng `giuTrongMap(ngọc, LE_NGOC)`, lọc render trong `capNhatView()`.
- Thanh đen trên luôn có hàng 7 ô ngọc (1 → 7 sao, `bangNgoc()`), viên đã nhặt sáng + phát sáng, chưa nhặt mờ hẳn; chỉ để xem, không bấm được.
- Lưu ván: `ngoc` (vị trí, số sao, đã nhặt, viên vua gà giữ) nằm trong ván lưu; đổi cấu trúc nên `PHIEN_BAN_LUU` = 5.

# Nguyên tắc thắng / thua

- Nhân vật thắng (`kiemTraThang()` → `ketThuc(true)`, `nguoiThangTran` = true): **đã nhặt đủ 7 viên ngọc rồng** (`soNgoc() === NGOC_SO`), bất kể gà còn sống hay không. Nhặt viên cuối thì hiện hiệu ứng 7 viên sáng rực rồi mới sang màn kết thúc "Chiến thắng! Đã thu đủ 7 viên ngọc rồng". Diệt vua gà / diệt hết gà không còn là điều kiện thắng.
- Quái vật thắng (`ketThuc(false)`): cả hai nhân vật cùng hết máu (dù đã nhặt được bao nhiêu viên). Màn kết thúc hiện "Quái vật thắng!" kèm số ngọc đã nhặt (k / 7).
- Cả hai trường hợp đều ghi điểm / kỷ lục như cũ; điểm chỉ dùng để chọn nhân vật ghi nhiều điểm nhất (MVP) ở màn kết thúc, không quyết định thắng thua.

# Nguyên tắc vai trò từng chiêu

- **Đấm**: nhanh, miễn phí, mỗi lần trúng hồi `MANA_DAM` = 5 mana. **Đá**: miễn phí, cũng hồi mana; gà con (không phải gà mẹ) trúng Đá thì bị **hất lùi** `DA_DAY` = 900 px/s (giảm dần, khoảng 150px) và **choáng** `DA_CHOANG` = 0,7s (`choang`, `day` trong `Ga`; đứng yên, không đánh; vẽ 💫) để gỡ vây. **Chiêu đặc biệt** (chưởng): tốn `MANA_CHUONG` = 30, **xuyên** mọi gà trên đường bay (`chuongXuyen()`, mỗi gà một lần, `Dan.da`) rồi nổ bán kính `BAN_KINH_NO` = 150 ở điểm cuối (không trúng lại gà đã bị xuyên). Combo từ `COMBO_GIAM_HOI` = 10 trở lên thì chưởng hồi nhanh gấp đôi (`COMBO_HOI_CHUONG`); combo hiện trên đầu nhân vật (từ 3 đòn, kèm ⚡ khi đủ 10). Biến mây / socola xem các mục riêng (tốn `MANA_DAC_BIET` = 40).
- Nhóm đòn đã ra nằm trong `Dan.nhom`; `trungGa(g, p, sat, kieu)` trả `true` nếu đòn thật sự trúng (không né / miss / phản), chỉ khi đó mới hồi mana.

# Nguyên tắc tính cách gà con

- **Gà trắng** đi thành đàn: khi đi lang thang hay hướng về gà trắng gần nhất trong `HEN_DAN` = 700; khi lao vào nhân vật thì tản ra vây quanh (`HEN_VAY` = 55, mỗi con một hướng theo `id`).
- **Gà đỏ** lao `DO_CHAY` = 1,5s rồi khựng `DO_KHUNG` = 1s (`kiet`, thở dốc, vẽ 💦), lúc khựng nhận sát thương ×`DO_NHAN` = 1,5.
- **Gà đen** (`denNhao()`, `Ga.nhao`): bay vòng quanh nhân vật bán kính `DEN_VONG_BK` = 380 trong ~`DEN_VONG_T` = 3s → đứng báo hiệu `DEN_BAO` = 0,8s (vệt đỏ mảnh, qua `vachView` với `w`) → nhào thẳng một đường tốc độ thật `DEN_NHAO_TOC` = 650 → nghỉ `DEN_NGHI` = 1,2s rồi bay vòng tiếp. Hết mục tiêu thì trở lại tốc độ bay thường (đừng để vận tốc nhào còn sót lại).
- Gà mẹ gốc xuống dưới `GD2_MAU` = 50% máu thì vào **giai đoạn 2** (`gd2`, chữ "GIAI ĐOẠN 2!"): đẻ trứng nhanh hơn (chu kỳ ×`GD2_DE` = 0,6).

# Nguyên tắc cứu đồng đội

- Một nhân vật ngã mà người kia còn sống thì bắt đầu cứu (`batDauCuu()` → `cuu` / `cuuView`, `Cuu` lưu trong ván lưu): **Mabu cứu Zinbu bằng mây** (mây tách ra từ Mabu, phủ lên Zinbu), **Zinbu cứu Mabu bằng một cục socola to**. Sau `CUU_CHO` = 1,5s (cho animation ngã chạy) thân người ngã được thay bằng mây / socola (`dangCuu()`, vẽ `veCuu()`, xếp theo y trong `xep`).
- Mây / socola không còn vòng tròn: sau `CUU_CHO` nó bám theo người còn sống (cách `CUU_BAM` = 170, `capNhatCuu()`), nối với người đó bằng sợi dây đỏ nét đứt như dây buộc khi 2 người đi xa nhau, đếm ngược `CUU_THOI_GIAN` = 15s (số to trên đầu, kèm chữ "Bạn sống được 15s thì đồng đội sẽ sống lại") khi người cứu còn sống; hết 15s thì người ngã hồi sinh tại chỗ với `CUU_MAU` = 100 máu (`capNhatCuu()`, `NhanVat.hoiSinh()`). Người cứu ngã thì ngừng đếm; cả hai cùng ngã vẫn là thua. Gà không đụng tới mây / socola cứu người.
- Nhân vật đã ngã (`het`) không điều khiển, không ra đòn, không bay (kể cả chế độ chuột, `ban()` / `datDichThe()`).

# Nguyên tắc quả cầu trốn

- 2 quả cầu (`cauTron`, `CauTron`, `taoCauTron()`) đặt cố định gần giữa map (`CAU_VI_TRI`, tránh chỗ nhân vật xuất hiện; cây / bụi không mọc trong bán kính 500 quanh cầu; vẽ to ×1,4). Sprite `web/public/assets/game/cau_buu.png` (`SP_CAU`, 6 cột × 2 hàng: hàng 0 Mabu, hàng 1 Zinbu; khung 0 nguyên quả · 1 nứt rung · 2 nổ khói hồng · 3 bóng đen trong khói · 4 nhân vật hiện ra · 5 nhân vật giơ tay trên vỏ vỡ), nguồn ảnh tách nền ô caro bằng script, neo ở đáy quả cầu.
- Pha (`capNhatCau()`): `san` → nhân vật (chưa gục, không phải mây, không đang bay) chạm vào trong `CAU_BAN_KINH` thì chui vào (`trong`, ngắt combo) → trốn `CAU_TRON` = 10s → `vo` (hoạt ảnh vỡ `CAU_VO` = 1,6s, khung 2–5 theo hàng của nhân vật) → nhân vật đứng ra đúng chỗ quả cầu, quả cầu `moc` `CAU_MOC` = 20s rồi lại `san` (mờ dần hiện lại giây cuối). 3 giây cuối quả cầu nứt và rung; có số giây đếm ngược trên đầu.
- Mỗi quả cầu có chủ (`cua`: quả trái của Mabu, quả phải của Zinbu): chỉ đúng chủ mới chui vào được; quả trống có avatar chủ (khung 5 của hàng chủ, trong vòng tròn viền màu nhân vật phía trên, `veAvatarCau()`); chơi 1 người vẫn hiện đủ 2 quả (quả của người vắng chỉ đứng đó, không ai chui vào).
- Trong cầu (`trongCau(p)`, cả pha `trong` và `vo`): nhân vật ẩn (không vẽ, không thanh máu), không điều khiển / ra đòn / bay, không nhặt đồ, không nhận sát thương (`nhanSatThuong()`), gà không thấy (`khuat(n)` = gục / mây / trong cầu, dùng ở mọi chỗ gà chọn mục tiêu) nên đi lang thang tìm; mũi tên chỉ hướng không tính người đang trốn. Hồi `CAU_HOI_MAU` = 20 máu/s tới `HP_NV` (đầy bình), mana đầy `MANA_TOI_DA` ngay, mở khoá bay. Lưu trong ván lưu (`cauTron`, thiếu thì tạo mới).

# Nguyên tắc cảm giác đánh

- Hit-stop (`dungKhung()`, `dungHinh`): đòn Đá, đòn trúng gà mẹ, chưởng xuyên / nổ làm game chạy chậm còn `DUNG_HE_SO` = 8% trong 0,03–0,05s; gà mẹ chết khựng 0,18s. Chỉ chậm phần logic (`capNhat`), HUD và vẽ vẫn chạy.
- Rung màn hình (`rungMan(giay, bien)`, `rungBien`): mặc định ±`RUNG_BIEN` = 6px, chưởng nổ ±9, gà mẹ chết ±14; về mặc định khi hết rung.
- Đòn trúng gà mẹ hiện số sát thương bay (`-mat`) như gà con.

# Nguyên tắc âm thanh

- Âm thanh nằm trong `web/public/assets/am-thanh/`, phát qua `AmThanh` (`web/src/game/am-thanh.ts`, `this.am` trong `Game`): `phat('dam' | 'da' | 'chuong' | 'anTao' | 'deTrung' | 'meChet' | 'nvChet' | 'ngoc')`, nhạc nền lặp (`nhacNen()`) chỉ chạy khi đang chơi (`man === 'play'`), tạm dừng / kết thúc thì dừng. Đấm / Đá / chưởng (kể cả socola) phát trong `ban()`, ăn táo / socola trong `capNhatVatPham()`, gà mẹ đẻ trứng trong `deTrung()`, gà mẹ chết (gốc hoặc phụ) và nhân vật gục. Trình duyệt chỉ cho phát sau lần bấm / nhấn phím đầu tiên (nhạc nền tự thử lại). Thêm âm mới thì thêm vào `FILE` / `AM_LUONG`.

# Ghi chú mới nhất (ghi đè các mục trên)

- Mana vào ván `MANA_BAN_DAU` = 200. Ăn máu (táo, socola, hạ gà mẹ) và ăn mana (táo xanh, socola, đòn trúng) cộng không giới hạn (không còn trần `HP_NV` / `MANA_TOI_DA` khi cộng, không còn khiên từ máu thừa); `HP_NV` / `MANA_TOI_DA` chỉ còn là mốc đầy bình, bình vẽ theo `max(mốc, giá trị hiện có)`. Tự hồi vẫn chỉ tới `HP_HOI_TOI_DA` / `MANA_HOI_TOI_DA`.
- Cần trái gạt nhẹ (dưới `VUNG_BAY_CAN`) thì chạy bộ theo hướng gạt (không còn đứng yên); gạt mạnh mà hết mana / đang khoá bay thì vẫn chạy, không đứng.
- Tay cầm: chiêu riêng (B / cần phải: Biến mây / socola) hết mana hoặc đang hồi thì tự dùng chưởng, hết mana chưởng thì dùng đá (`dungChieu()`), không còn bấm mà không có tác dụng. Mây đang chạy vẫn không ra đòn khác.

- Cây mọc lại: cây đổ (kể cả cây đã rơi táo và biến mất) sau `CAY_MOC_LAI` = 10s thì mọc lại đứng thẳng (`capNhatCay()`). Một phần cây là **cây to** (`TrangTri.to`, to gấp `CAY_TO_HE_SO` = 1,8; hộp đánh đổ cũng to theo): đổ thì chắc chắn rơi `CAY_TO_MAU` = 2 táo đỏ + `CAY_TO_MANA` = 2 táo xanh.

- Màn kết thúc (tay cầm): chơi lại phải bấm X rồi B (`choiLaiChoB`); Menu / X đơn lẻ không còn chơi lại ngay.

- Màn chọn chế độ 1 / 2 người (tay cầm): chỉ tay cầm 1 được chọn thẻ, chữ thập / cần trái trái-phải chọn thẻ, bấm X rồi B (tay cầm nào cũng được, `onNutX`) mới xác nhận vào màn hướng dẫn (`daBamX` trong `giao-dien.ts`); ở màn hướng dẫn / mục tiêu bấm A (hoặc Menu) để Tiếp / Vào chơi, B để quay lại.

- Tay cầm bố cục **Xbox** (cần analog chéo: cần trái trên-trái, chữ thập dưới-trái, cần phải dưới-phải). Mapping "standard" theo vị trí nên chỉ số nút giữ nguyên: nút 0 = **A** (dưới, đấm) · 1 = **B** (phải, chiêu riêng) · 2 = **X** (trái, đá) · 3 = **Y** (trên, chưởng) · 8 = **View** (đổi nhân vật) · 9 = **Menu** (bắt đầu / tạm dừng). Mọi chữ hiển thị / hướng dẫn dùng tên nút Xbox (A / B / X / Y, Menu, View), không dùng ✕ ○ □ △ / Options / Share.

- Ăn gà mẹ socola: chỉ **gà mẹ phụ** (tướng gà) đang hoá socola ăn được, **gà mẹ gốc (vua gà) không ăn được**; không ai ăn thì hết `SOCOLA_THOI_GIAN` tự hoá giải như cũ. Gà mẹ phụ đang hoá socola mà Mabu / Zinbu (không phải mây, chưa gục) chạm vào (trong `AN_TUONG_BAN_KINH` × độ to) thì ăn luôn (`anTuongSocola()`, gọi từ `anGaSocola()`): nhận `AN_TUONG_TI_LE` = 30% máu hiện có của gà mẹ và +30% sức mạnh của nó (`heSoLan × suc`) vào `NguoiChoi.suc` (hệ số nhân sát thương mọi đòn trong `trungGa()`, mặc định 1, lưu trong ván lưu); gà mẹ chết như bị hạ (`trungTuong()`: điểm, hồi sinh gà mẹ gốc, thưởng máu như cũ).

- Đòn ăn (`DON_AN`, `Dan.an`, `danAn()`): đòn **quất râu** của Zinbu (`antenna_whip`, trong nhóm Đá) và đòn **bắn chưởng** của Mabu (`energy_ball`, trong Chiêu đặc biệt) trúng gà con nào (trắng, đỏ, đen, kể cả gà nở từ trứng đỏ) thì con đó hoá socola ngay bất kể máu (Mabu: socola hồng `LOC_SOCOLA_HONG`), bị kéo về nhân vật (`keoGa`, tốc độ `KEO_TOC`, `capNhatKeo()`, vẽ qua `xep` như gà) rồi bị ăn: nhân vật nhận `AN_TI_LE` = 2% máu hiện có của con gà vào **cả máu lẫn mana** (gà không có mana), mở khoá bay, tính điểm / combo như hạ gà. Gà mẹ (gốc / phụ) trúng thì tính như đòn thường. Gà đang bị kéo không lưu trong ván lưu.

- Thời gian ấp / đẻ theo số tướng gà (gà mẹ phụ) đang sống (`soMePhu`), chốt lúc đẻ: trứng đỏ ấp (`apTrungDb()`, lưu `TrungGa.ap`) ≤ 5 con: 5s · 6–10 con: 10s · từ 11 con: 15s; 4 gà con của trứng đỏ nở đều trong thời gian ấp (nhịp = ấp / 5). Thời gian giữa 2 lượt đẻ (`choDeTrung()`): ≤ 10 con: 10s · từ 11 con: 15s (giai đoạn 2 vẫn ×`GD2_DE`). Trứng thường vẫn nở sau `TRUNG_NO` = 2s.

- Vua gà (gà mẹ gốc) dưới `TRON_MAU` = 20% máu (`HP_GA`): bỏ canh trứng đỏ / đi ăn socola, chỉ chạy trốn nhân vật gần nhất trong `TAM_NHIN_TUONG` (`tronNhanh()` gọi đầu `dieuTuongGoc()`); mỗi mạng đúng 1 lần **trốn chạy nhanh** (`daTron`, `tron` / `tronX` / `tronY` trong `Ga`): khoá hướng ra xa nhân vật gần nhất, tốc độ `TOC_TRON` × `TRON_TOC` = 4 (thật ~480 px/s), quãng `TRON_QUANG` = 2 × `BAY_CAN` (quãng bay của Zinbu) = 1200, chạm mép map thì thôi, hiện chữ "🏃 VUA GÀ TRỐN CHẠY!". Tướng gà (gà mẹ phụ) không đổi.

- Vua gà (gà mẹ gốc) tự hồi `HOI_MAU_VUA` = 2 máu/s tới máu tối đa của mạng đó (`hpToiDa()`, 100 / 200 / 300), cả khi đang bị đánh; đang hoá socola thì không hồi. Tướng gà và gà con không tự hồi.

- Máu vua gà (gà mẹ gốc) tăng theo lần hồi sinh: `hpToiDa()` = `HP_GA` × (1 + `lan`) = 100 → 200 → 300 (gà mẹ phụ, gà con vẫn 100). Mọi ngưỡng % máu của vua gà (giai đoạn 2, gọi gà con, trốn chạy, combo socola + mây 30%, tự hồi, thanh máu `maxHpTuong(g)`) tính theo máu tối đa này.

- **Thế giới mở** (trước là bản đồ Đảo sa mạc `'sa'`; nay là bản đồ duy nhất, bỏ chọn bản đồ ở màn mục tiêu và bỏ map đồng cỏ đứng riêng `'co'`; ván lưu thiếu `banDo` coi là thế giới mở). Bố cục (`web/src/game/ban-do.ts`): **nguyên map đồng cỏ = vườn gà** (0..`MAP`, có tường gạch, vua gà / gà con / trứng chạy như map cỏ) nằm giữa biển; quanh nó **5 đảo cát xếp thành vòng** (`DAO`: đảo 0 phía dưới to ≈ 1,5 vườn gà về diện tích, là chỗ xuất phát `XUAT_PHAT`; 4 đảo kia ≈ 2/3 vườn), mỗi đảo nối 2 đảo bên cạnh bằng dải cát (`CAU_NOI`). Vườn gà cách mép đảo ít nhất `CACH_VUON` = 2200 biển; nhân vật vào vườn qua lối `CONG_VUON` (xem mục "Nguyên tắc ngọc rồng"), gà chỉ ở trong vườn. Thế giới rộng `TG` (camera và `kepX` / `kepY` kẹp theo `TG`).
- Biên / biển: `giuTrongMap(vật, lề, quaNuoc, vung)`: `vung` = `'vuon'` (gà, trứng, gà mẹ: kẹp trong tường vườn như cũ) hoặc `'dao'` (nhân vật, đích bay / chạy, cứu: kẹp trong `TG` rồi `veDat()` đẩy khỏi biển / vườn lên ô cát gần nhất); không ghi thì theo vị trí (`trongVuon()`), ví dụ táo rơi từ cây trên đảo. `quaNuoc` (nhân vật đang bay) được ở trên biển, hạ xuống thì bị đẩy lên bờ. `doSau(x, y)` = khoảng cách có dấu tới bờ đảo (dương = cát). Lưới nặng (~1s) tính một lần khi chọn map (`chuanBiSaMac()`).
- Trên đảo không có gà; quả cầu trốn chỉ nằm trong vườn gà. Rađa rồng chạy ở mọi nơi; thanh đen trên chỉ còn hàng ngọc khi không ai ở gần vườn gà. Thắng khi đủ 7 viên ngọc, cả hai gục vẫn thua. Mabu / Zinbu giữ nguyên mọi thuộc tính. Trang trí đảo (`taoTrangTriSa()`, `TrangTri.sa`, ảnh `TRANG_TRI_SA` trong `ve-canvas.ts`, loai 0 = cây đổ được, 1–8 bụi / xương rồng / đá / xương / cỏ khô) chỉ mọc trên cát cách bờ đủ xa; mỗi đảo chỉ 1–2 cây (`daoCua()`, đảo chẵn 2, lẻ 1; cây đầu mỗi đảo là cây to). Vẽ: `veNenSa()` (ảnh lót cả thế giới + mảnh chi tiết `MANH` dựng dần tối đa `MANH_MOI` / khung, giữ tối đa `MANH_GIU` mảnh, mảnh nằm hẳn trong vườn bỏ qua) rồi `veNen()` + `veTuong()` của vườn gà. Ảnh từ gói Desert Tileset ở `web/public/assets/game/sa_mac/`.
