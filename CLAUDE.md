# Nguyên tắc làm việc

- Thuật ngữ: **gà mẹ** = gà tướng (con gà to đùng, `boss`); **gà con** = tất cả các gà còn lại (trắng, đỏ, đen).

- Luôn code trực tiếp vào nhánh `main`, push thẳng lên `main`. Không tạo hay chia nhánh khác trong bất kỳ tình huống nào (kể cả khi môi trường / công cụ gợi ý dùng nhánh riêng): nếu đang đứng ở nhánh khác thì chuyển về `main`, đưa hết thay đổi vào `main` rồi xoá nhánh thừa.

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

- Ngoại lệ do người dùng yêu cầu: có thêm thanh đen phía trên map chứa chiêu của gà mẹ (xem mục "Nguyên tắc gà mẹ"). Khung game chiếm cả cửa sổ, chiều rộng khung nhìn `W` tự theo tỉ lệ cửa sổ (`ResizeObserver`) nên map tràn sát hai bên, không có dải đen hai bên; `H` cố định.
- Bố cục: khung game chiếm cả cửa sổ. Map nằm giữa; phía trên có thanh đen ngang `BAR` (chiêu gà mẹ), hai bên có 2 thanh đen dọc rộng `SIDE` (Mabu trái, Zinbu phải). Toạ độ map vẫn là x 0..`W`, y 0..`H`; thanh đen nằm ở toạ độ âm / lớn hơn `W` (viewBox `-SIDE -BAR`). `W` tự theo tỉ lệ cửa sổ.
- Trên mỗi thanh bên (không có tên nhân vật): các chiêu thức xếp dọc từ dưới lên trên, nút đầu (Đấm) sát đáy (`nutBang()`, `xThanh()`); máu và mana là hai bình cầu xếp dọc (trên: máu đỏ, dưới: mana xanh dương, cùng màu hai quả táo; xám khi đang khoá bay; số máu / số mana nằm giữa bình; không còn thanh) nằm ngay phía trên nút trên cùng (`yMauNv()`). Nửa vòng tròn đen bán kính `R_NV` (= 2/3 `R_BANG`) nằm đúng ở góc dưới map như cũ, tâm ở góc dưới (`tamNv()`), chỉ có animation hiện tại của nhân vật (cùng `khung` / `lat` với trên map). Không thu nhỏ map vì bảng.
- Chiêu đang dùng sáng + phát sáng, chiêu khác mờ, chỉ Mây đang chạy hoặc hồi (`hetMana()`) thì mờ hẳn và không chọn được (Đấm, Đá, Chiêu đặc biệt không tốn mana, chỉ có thời gian hồi).
- Đổi chiêu: chế độ tay cầm bằng L1 / R1 (`chuyenChieu()` → `NhanVat.datNhom`), chế độ chuột bằng cách bấm vào nút chiêu trên thanh đen (`chonNut()`) hoặc phím 1–4 (`phimXuong()`); Mây đang chạy / hồi thì không chọn được ở cả hai chế độ. Không có con lăn.

# Nguyên tắc điều khiển

- Màn bắt đầu cho chọn chế độ chơi (`cheDo`: `'chuot'` hoặc `'tayCam'`, nút chọn ở màn bắt đầu, `datCheDo()`, nhớ lại trong `localStorage`; mặc định chuột). Chỉ chế độ đang chọn nhận điều khiển; chế độ kia bị bỏ qua hoàn toàn (kể cả nút bắt đầu / tạm dừng của tay cầm). Màn bắt đầu và README hướng dẫn cả hai chế độ.
- Chế độ tay cầm (Gamepad API, mapping "standard" kiểu PS, `docTayCam()` đọc mỗi khung hình): tay cầm 1 → Mabu, tay cầm 2 → Zinbu. Cần trái chạy, cần phải ngắm (không gạt thì tự ngắm `diemNham()`), ✕ / R2 ra đòn, ○ / L2 bay, L1 / R1 đổi chiêu (`chuyenChieu()`), Options bắt đầu / tạm dừng, Share (Select) đổi nhân vật khi chỉ có 1 tay cầm (`doiTayCam()`). Tay cầm không phải mapping "standard" dùng tạm chỉ số nút / cần như standard (cần phải lấy trục 2 và 5 nếu có ≥ 6 trục); màn bắt đầu hiện nút vừa bấm để dò.
- Chế độ chuột (chỉ có 1 chuột nên điều khiển 1 nhân vật tại một thời điểm, `chuot`): chuột phải chạy tới điểm bấm (xa thì bay, `datDich()`), chuột trái ra đòn tại điểm chuột (`bamChuot()`), bấm vào nút chiêu ở thanh đen để đổi chiêu, **Tab** chuyển chuột sang nhân vật kia (`doiChuot()`), menu chuột phải của trình duyệt bị chặn. Tâm ngắm vẽ theo chuột (`tamX` / `tamY`), ẩn khi chuột nằm trên bảng chiêu thức (`trenBang`); nhân vật đang dùng chuột không có tâm tự ngắm. Toạ độ chuột đổi qua `phepChieu()` (dùng chung với vẽ canvas).
- Thêm điều khiển mới thì gắn vào đúng chế độ của nó; không thêm phím tắt ngoài Tab và phím 1 / 2 / 3 / 4 (chọn chiêu thứ n từ dưới lên của nhân vật đang dùng chuột, `phimXuong()`; Mây đang chạy / hồi thì không chọn được). Chuột chỉ để bấm nút trên các màn bắt đầu / tạm dừng / kết thúc ở chế độ tay cầm.

# Nguyên tắc giữ nguyên bố cục khi đổi map / màn

- Bố cục hiện tại là chuẩn, cố định: 2 thanh đen hai bên với chiêu thức, máu và nửa vòng tròn nhân vật (kích thước, vị trí, hàng nút, chân dung animation nhân vật), thanh đen trên của gà mẹ, cách chọn chiêu bằng click, bình máu / mana, camera, tâm ngắm, mọi nguyên tắc ghi trong file này.
- Sang map khác, màn khác thì chỉ thay phần map (nền, kích thước `MAP`, vật cản, quái của màn đó). Không đổi bố cục giao diện, vị trí các thành phần, hay các nguyên tắc ở trên; chỉ đổi khi người dùng yêu cầu rõ ràng.

# Nguyên tắc biên bản đồ

- Không vật nào được ra khỏi bản đồ: nhân vật, gà, gà bay, gà tướng, quái sau này… đều bị kẹp lại, sprite phải nằm trọn trong map.
- Kẹp bằng hàm `giuTrongMap(vật, lề)` với lề theo loại vật (`LE_NV`, `LE_GA`, `LE_BAY`, `LE_TUONG`); lề trên lớn hơn lề dưới vì sprite vẽ phía trên toạ độ chân. Vật di chuyển tự động thì bật lại khi chạm mép.
- Thêm loại vật mới thì khai báo lề riêng và gọi `giuTrongMap` ngay từ đầu, kể cả điểm đích di chuyển / bay tới.

# Nguyên tắc thanh máu

- Chỉ nhân vật và gà tướng (boss) có thanh máu, vẽ trên đầu trong không gian thế giới (trong nhóm camera), cùng kiểu. Máu Mabu / Zinbu còn hiển thị dạng số trên thanh đen hai bên. Quái thường có máu nhưng không hiện thanh. Không dùng thanh máu cố định trên đỉnh màn hình.

# Nguyên tắc máu & sát thương

- Mabu và Zinbu khởi đầu `HP_NV` = 200 máu; mỗi con quái (mọi loại gà, kể cả gà tướng) khởi đầu `HP_GA` = 100 máu. Máu tính riêng từng đối tượng, không còn máu chung của đội.
- Ngoài máu tối đa, mạnh / yếu thể hiện ở sát thương gây ra và tỉ lệ giảm sát thương khi nhận (`GIAM_NV`, `GIAM_GA`). Sát thương thực nhận = sát thương gốc × (1 − tỉ lệ giảm), làm tròn.
- Mabu và Zinbu giảm 50% sát thương nhận (gà đen đánh 60 thì nhận 30). Gà thường giảm 0%, gà tướng giảm 80%.
- Khả năng né đòn: gà con (trắng, đỏ, đen) 0%; Mabu và Zinbu né 25% đòn gà đánh (`NE_NV`, ngẫu nhiên từng đòn); gà mẹ không né ngẫu nhiên mà né 100% khi đang trong "thế phòng thủ" (`neGa()`, xem mục "Nguyên tắc thế phòng thủ & gọi gà con"), ngoài thế thì 0%. Né được thì không mất máu, không hiện hiệu ứng trúng, hiện chữ bay "NÉ!"; đòn bị né không tính trúng, không tính trượt và không ngắt combo.
- Sát thương nhân vật gây ra (`SAT_THUONG`), mỗi đòn trúng một con:
  - Đấm: Mabu 50 · Zinbu 50
  - Đá: Mabu 70 · Zinbu 100
  - Chiêu đặc biệt (bắn chưởng): Mabu 100 · Zinbu 150
  - Biến socola (riêng Zinbu, `SAT_SOCOLA`): 150 lên gà mẹ (xem mục "Nguyên tắc chiêu Biến socola")
  - Biến mây (riêng Mabu): 250 (`SAT_MAY`); với gà tướng cứ mỗi `MAY_NHIP` giây trừ một lần
- Quái gây sát thương khi chạm nhân vật; sát thương gốc (`SAT_GA`) và tốc độ đánh = số giây giữa 2 đòn (`HOI_DANH_GA`) theo loại, mỗi con có đồng hồ riêng:
  - Gà trắng: 32 sát thương · 1,2s (nhận 16)
  - Gà đỏ: 48 · 0,8s (nhận 24)
  - Gà đen: 60 · 1,5s (nhận 30)
  - Gà tướng: 80 · 2,5s (nhận 40)
- Nhân vật dạng mây không nhận sát thương. Nhân vật hết máu thì ngã và không điều khiển được; cả hai cùng hết máu thì thua (`ketThuc()`).
- Quái chỉ chết khi máu về 0 (chết thì mới tính điểm). Đòn trúng mà chưa chết thì gà nháy sáng. Hạ gà tướng không còn thưởng mạng; thay vào đó hồi `HOI_MAU_TUONG` = 60 máu (không trần) cho mỗi nhân vật còn sống.
- Vật phẩm là quả táo (`vatPham` → `vatPhamView`), chỉ rơi từ cây đổ: mỗi cây đổ có `TAO_ROI` = 30% rơi 1 quả, đỏ hoặc xanh ngẫu nhiên 50/50 (không rơi theo thời gian, không rơi từ gà). Máu và mana không có trần: táo đỏ cộng `VP_HOI` = 100 máu, táo xanh cộng 100 mana và mở khoá bay (`hoiDayMana()`); cộng dồn mãi, bình chỉ vẽ đầy tối đa (số giữa bình là giá trị thật). Nhân vật (không phải mây, chưa gục) đi vào bán kính `VP_BAN_KINH` là nhặt ngay. Gà (mọi loại, kể cả gà mẹ) đi qua trong `VP_GA_BAN_KINH` thì mổ ăn táo đỏ, hồi 100 máu không trần (táo xanh gà không ăn); gà không làm cây đổ. Không ai nhặt sau `VP_TON_TAI` = 45s thì biến mất (nhấp nháy 8s cuối). Không bị sương mù.

# Nguyên tắc mana

- Mana là một con số `mana` (không có trần), chỉ dùng để bay (`MANA_BAN_DAU` = 100, xem mục thể lực bay). Đấm, Đá, Chiêu đặc biệt không tốn mana, chỉ có thời gian hồi giữa 2 đòn (xem mục tốc độ đánh). Không còn mana theo nhóm đòn, không khoá 30s, không có quả cầu mana trên đầu nhân vật; mana chỉ hiện ở bình trên thanh đen hai bên.
- Thứ tự biểu tượng dưới chân: Đấm → Chiêu đặc biệt → Đá.

# Nguyên tắc chiêu Biến mây

- Riêng Mabu (nhóm đòn 3, `NHOM_MAY`), Jinbu/Zinbu không có. Bấm để biến thành mây to gấp 2 trong `MAY_THOI_GIAN` = 7s, sau đó chờ `MAY_HOI` = 40s mới dùng lại.
- Dạng mây: không có thanh máu, vòng sáng hay hàng biểu tượng nhóm đòn, không ra đòn khác, không bay (chỉ trôi, nhanh hơn). Mọi con gà chạm vùng mây (`mayQuet`) đều dính đòn `SAT_MAY` (250); gà tướng chỉ dính một lần mỗi `MAY_NHIP` giây. Đang là mây thì không nhận sát thương.
- Biểu tượng Mây là hình đám mây, đứng cuối cùng bên phải trong hàng biểu tượng.
- Mây to hơn nên dùng lề bản đồ riêng `LE_MAY` (nội suy theo `heSoTo` lúc biến hình), render lọc với lề rộng hơn.

# Nguyên tắc tốc độ đánh

- Tốc độ đánh của Mabu và Zinbu là thời gian hồi `hoiChieu` giữa 2 đòn trong `ban()`, theo nhóm: Đấm 0,4s (đang đi 0,6s) · Đá 0,64s · Chiêu đặc biệt 1,6s. Không đổi khi chỉnh animation.
- Animation mỗi đòn tự co giãn (`tocDon` trong `NhanVat`) để chạy xong trong 90% của `THOI_GIAN_DON` = 0,5s (~0,45s), bất kể đòn có bao nhiêu khung hình. Quãng lao tới của đòn có chuyển động (`tien`) không đổi dù tua nhanh hay chậm.
- Tốc độ đánh của gà nằm ở `HOI_DANH_GA`.

# Nguyên tắc tâm tự ngắm

- Tâm tự ngắm (`nham`, vẽ qua `nhamView` đã lọc theo khung nhìn) tính lại mỗi khung hình cho cả 2 nhân vật. Hiện khi có gà trong tầm, hoặc luôn hiện theo hướng cần phải khi đang gạt cần ngắm (`ngam`); chưa ngã, không là mây. Hết điều kiện là tâm biến mất ngay, không giữ hình cũ.

# Nguyên tắc sương mù & gà lao vào

- Sương mù kiểu Dota / Liên Minh: chỉ ẩn quái, map vẫn vẽ bình thường (không phủ lớp tối nào). Chỉ thấy gà (kể cả gà tướng, thanh máu của nó) trong tầm nhìn `TAM_NHIN` = 1,5 × tầm xa nhất của đấm xa / đá xa (= 750). Tầm nhìn đến từ mỗi nhân vật còn sống và từng chưởng / đòn đang bay (bay hết quãng đường, mang tầm nhìn theo; `nhinNguon`, `thay()` trong `capNhatView()`). Gà ngoài tầm nhìn vẫn tồn tại và chạy logic, chỉ không được vẽ.
- Gà con (trắng, đỏ, đen) ngửi thấy nhân vật (không phải mây, chưa gục) trong `TAM_NGUI_NV` = 1500 thì đi / lao về phía nhân vật gần nhất (`gaLao()`, tốc độ `TOC_DO_LAO`; gà bay giữ tốc độ, đổi hướng); nếu nhân vật chưa vào `TAM_LAO` (= tầm đánh xa nhất, 500) mà có táo đỏ trong `TAM_NGUI_TAO` = 500 thì đi tới táo đỏ trước (táo xanh thì không); hết tầm thì đi lang thang lại. Gà tướng thấy nhân vật trong `TAM_NHIN_TUONG` (= 3 × `TAM_NHIN`) thì đuổi nhân vật gần nhất, không thì đi loanh quanh (`dieuTuong()`).
- Tốc độ di chuyển thật của mọi gà = tốc độ gốc × `HE_SO_TOC_GA` = 0,25 (áp ở chỗ cộng vị trí trong `capNhatGa()`); đổi tốc độ gà thì chỉnh hệ số này.
- Tốc độ thật khi lao vào (đã nhân `HE_SO_TOC_GA`): gà trắng 40 (`TOC_DO_LAO.hen` = 160) · gà đỏ 60 (240) · gà đen ~30 (tốc độ bay lúc sinh 110–130, không đổi theo màn).

# Nguyên tắc sinh gà & mũi tên chỉ gà tướng

- Gà con không tự sinh theo thời gian nữa: chỉ do gà mẹ (gà tướng) đẻ. Gà tướng xuất hiện ngay từ đầu ván ở chỗ ngẫu nhiên trên map (cách cả hai nhân vật ≥ 2000); bị hạ thì sau `CHO_TUONG` = 30 giây xuất hiện lại.
- Gà mẹ gốc đẻ mỗi lượt 4 trứng thường (tăng theo lần hồi sinh) quanh mình rồi quả thứ 5 là trứng đỏ đặc biệt (`deTrung()`), cách nhau `TRUNG_CHO` = 15s (lượt đầu ngay khi xuất hiện). Trứng thường nở sau `TRUNG_NO` = 2s (`capNhatTrungGa()`) thành 2 gà trắng, 1 gà đỏ, 1 gà đen (`DAN_TRUNG`). Tổng số gà còn sống (kể cả gà mẹ gốc, không tính gà mẹ phụ và gà / trứng của trứng đỏ, `demGaThuong()`) + trứng thường đang ấp ≥ `GA_TOI_DA` = 20 thì không đẻ trứng thường (trứng đỏ vẫn đẻ). Gà không bị xoá khi ở xa nhân vật.
- Trứng cũng bị sương mù: chỉ vẽ trong tầm nhìn (`trungView`).
- Không có mini map. Thay vào đó là mũi tên chỉ hướng (kiểu đường chim bay của Google Maps, `huongToiTuong()` → `huongView`): cứ `HUONG_CHU_KY` = 5s hiện một lần (mờ dần vào / ra trong `HUONG_HIEN` = 2,5s), chỉ từ nhân vật còn sống gần đích hơn (không phải cả hai) về phía gà tướng (khi có trứng đỏ đang ấp thì chỉ về trứng đỏ, xem mục "Nguyên tắc trứng đỏ"); mũi tên ">" nhỏ, mờ, đi theo cụm `HUONG_CUM` = 3 mũi liền nhau (cách `HUONG_LIEN`), các cụm cách xa nhau `HUONG_CACH`. Gà tướng đã gần (trong `HUONG_GAN`) hoặc đã chết thì không hiện. Lọc theo khung nhìn như mọi vật khác.

# Nguyên tắc gà con mổ / bay

- Gà con biết bay (gà đen) thì bay vào nhân vật; gà con không bay (trắng, đỏ) thì lao vào mổ. Mỗi nhịp đánh, gà làm động tác mổ (`mo`, `MO_THOI_GIAN`, vẽ trong `gaThan()`): gật đầu về phía nhân vật.

# Nguyên tắc gà mẹ (gà tướng): chiêu thức, hồi sinh

- Chiêu của gà mẹ (`bangTuong()`, `tuongSong`) nằm trên thanh đen `BAR` phía trên map (toạ độ y âm, giữa trên), 7 chiêu xếp ngang: Mổ + đá · Lao · Bay · Đen · Vàng · Đỏ · Gọi gà con (chiêu gà mẹ không dùng được thì mờ hẳn), kèm chữ "Gà con" và tổng số gà con còn sống (`soGaCon`, không tính gà mẹ) ở bên phải avatar, cùng số mạng còn lại là các trái tim ❤ ngay dưới avatar gà mẹ (`mangTuong()`, tổng 3 mạng, mạng đã mất thì mờ); chỉ để xem, không bấm được. Chiêu đang dùng sáng + phát sáng; Lao / Bay / màu có vòng tiến độ (hồi chiêu hoặc thời gian còn lại). Nửa vòng tròn đen dưới thanh (bán kính `R_TUONG` = `R_BANG` / 3, tâm ở mép trên map giữa màn hình) chỉ có hình con gà (animation, kèm màu đang đổi). 
- Mổ + đá: sát thương và tốc độ như cũ (80 · 2,5s), luân phiên animation mổ / đá (`kieuMo`).
- Lao (`TOC_LAO_THAT` = 500 px/s, `LAO_SAT` = 2, `LAO_HOI` = 15s) và Bay (`TOC_BAY_THAT` = 700 px/s, `BAY_SAT` = 3, `BAY_HOI` = 20s): khi thấy nhân vật xa hơn `CHIEU_TOI_THIEU` (xa hơn `CHIEU_XA` thì ưu tiên Bay), gà mẹ báo hiệu `CHIEU_BAO` = 1s (nháy sáng, đứng yên, vệt đỏ trên mặt đất bám theo mục tiêu — `vachView`), hết báo hiệu thì khoá hướng rồi chạy / bay một đường thẳng, không đổi hướng. Chạm nhân vật thì gây sát thương gốc × hệ số, mỗi nhân vật một lần mỗi đợt, nhân vật vẫn né được (`NE_NV`). Hết quãng (`CHIEU_QUANG_THEM`, tối đa `CHIEU_QUANG_TOI_DA`) hoặc chạm mép map thì nghỉ `CHIEU_NGHI`, rồi lộ sơ hở `SO_HO` = 3s (không né được đòn nào, hiện chữ "SƠ HỞ!"). Đang lao / bay thì không mổ, không đẻ trứng.
- Các chiêu không chồng nhau: giữa 2 chiêu bất kỳ (Lao, Bay, đổi màu) nghỉ ít nhất `CHIEU_NGHI_CHUNG` = 4s (`nghiChung`); màu chỉ bật khi không đang Lao / Bay và đang chờ thì Lao / Bay nhường (`capNhatChieuTuong()`, `batDauChieu()`).
- Ba chiêu đổi màu tự xoay vòng đen → vàng → đỏ, cứ `MAU_CHU_KY` = 20s kích hoạt một màu, kéo dài `MAU_KEO_DAI` = 5s (`capNhatChieuTuong()`):
  - Đen: không bị thương, phản lại sát thương gốc của đòn cho người đánh (không né được, nhân vật vẫn giảm 50%; mây không bị phản).
  - Vàng: mọi đòn trúng gà mẹ đều "MISS" (tính trượt, ngắt combo).
  - Đỏ: nhân vật trong `DOT_BAN_KINH` quanh gà mẹ bị đốt `DOT_SAT` sát thương gốc / giây (nhịp `DOT_NHIP`), không né được, cộng dồn với mổ; mây miễn nhiễm.
- Hồi sinh tối đa `TUONG_HOI_SINH` = 2 lần (tổng 3 mạng, mỗi mạng 100 máu). Mỗi lần hồi sinh, sát thương mọi đòn của gà mẹ tăng cộng dồn `TUONG_TANG_SAT` = 0,5 (hệ số 1 → 1,5 → 2, `heSoLan()`), thế phòng thủ dài thêm `THE_TANG` = 0,5s, và đẻ thêm 1 trứng mỗi lần (5 → 6 → 7, `TRUNG_THEM`). Hạ lần cuối thì không hồi sinh nữa. Chỉ hồi sinh khi đã chết, sau đúng `CHO_TUONG` giây kể từ lúc chết (đồng hồ đặt lại lúc chết). Mỗi lần xuất hiện / hồi sinh, gà mẹ đẻ lượt trứng đầu ngay, chờ `TRUNG_NO` cho trứng nở xong rồi mới được dùng Lao / Bay (`daDe`, `choChieu`).

# Nguyên tắc cây đổ

- Cây (`trangTri` loại 0) bị đổ khi đòn / chưởng của Mabu, Zinbu bay qua trong hộp quanh thân: rộng `CAY_DO_KINH` = 90 mỗi bên (chưởng ×1,4), cao `CAY_DO_CAO` = 220 phía trên gốc (đánh vào thân / tán cũng đổ): `danDoCay()` quét đoạn bay mỗi khung hình nên bay tới đâu cây đổ tới đó. Cây đổ (`doLuc`, `huongDo`) quay 90° quanh gốc trong 0,45s rồi nằm luôn, được lưu trong `cayDo` của ván lưu. Chỉ để đẹp, không ảnh hưởng gà. Cây đã rơi táo thì biến mất ngay (`mat`, không vẽ nữa, chỉ còn quả táo).

# Nguyên tắc mana & bay

- Bay tốn mana (`mana`, số không có trần, bình xanh lơ có số giữa bình ở thanh đen hai bên, dưới bình máu, không vẽ trên đầu nhân vật; `manaNv()`, `nlBay()`). Bắt đầu `MANA_BAN_DAU` = 100; bay tốn `MANA_BAY` = 50 mỗi giây bay; tự hồi `MANA_HOI` = 2 mỗi giây khi không bay nhưng chỉ tới `MANA_HOI_TOI_DA` = 100 rồi thôi (táo xanh có thể đẩy cao hơn, không bị trừ xuống). Mỗi lần bay xong khoá `BAY_KHOA` = 5s (`bayKhoa`, bình xám) mới bay tiếp được; còn dưới `MANA_TOI_THIEU` = 15 hoặc đang khoá thì chỉ chạy bộ (`coTheBay()`); mana không đủ cho cả quãng thì bay ngắn lại. Dạng mây không bay nên không tốn. Đổi cấu trúc trạng thái nên `PHIEN_BAN_LUU` = 3 (ván lưu cũ không tải được).

# Nguyên tắc chiêu Biến socola (riêng Zinbu)

- Nhóm đòn 3 của Zinbu (`NHOM_MAY` = 3, `nhomDon[3]` không có cờ `may`), tách từ đòn quất râu quét (`antenna_wide`, trước nằm trong Chiêu đặc biệt; Chiêu đặc biệt giờ chỉ còn `roll` / `energy_ball`). Biểu tượng là thanh socola. Ra đòn bằng chưởng nổ (`soc` trong `Dan`, tầm `TAM_SOCOLA` = 700, nổ `BAN_KINH_SOCOLA` = 260, hồi `SOCOLA_HOI` = 6s, không tốn mana).
- Gà con (trắng, đỏ, đen, cả gà con của trứng đỏ) dính thì chết luôn và thành thanh socola (`VatPham` loại `socola`, `bienSocolaGa()`; tính điểm / combo như hạ gà). Nhân vật (không phải mây, chưa gục) chạm vào là ăn: +`SOCOLA_HOI_MAU` = 200 máu và +`SOCOLA_HOI_MANA` = 200 mana (không trần, mở khoá bay) rồi tự bắn chưởng lên trời.
- Gà mẹ dính thì nhận `SAT_SOCOLA` = 150 như đòn thường (vẫn có thể né / phản / MISS theo màu); chỉ khi đòn trúng mới hoá socola `SOCOLA_THOI_GIAN` = 5s (`socola`, `socolaTuong()`): đứng yên, không né, không đánh / đẻ / dùng chiêu (đồng hồ tạm dừng), nhuộm nâu (`LOC_SOCOLA`).
- Kết hợp: gà mẹ đang là socola mà dính mây của Mabu thì combo đúng MỘT lần mỗi lần hoá socola (`comboSoc`): mất luôn 30% máu tối đa (`SOCOLA_MAY_MAT`, không né, không giảm sát thương); máu còn từ 30% trở xuống thì chết luôn (`comboSocolaMay()`). Các nhịp mây sau đó tính như thường.
- Mọi gà (gà con, gà mẹ gốc, gà mẹ phụ) đều muốn ăn socola (ngửi trong `TAM_NGUI_TAO`, `socolaGan()`): ăn xong +`SOCOLA_HOI_MAU` máu, sức mạnh `suc` +`SOCOLA_SUC_GA` = 0,5 (tối đa 8) và độ to `to` +`SOCOLA_TO_GA` = 0,25 (tối đa 3,5; gà mẹ tối đa 2) mỗi thanh. Nhân vật nên ăn trước.

# Nguyên tắc trứng đỏ & gà mẹ phụ

- Gà mẹ chia hai loại (cả hai đều `loai: 'boss'`): **gà mẹ gốc** (`goc`, đánh dấu vương miện vàng, thanh máu vàng, có 3 mạng như cũ) và **gà mẹ phụ** (`laMePhu()`, nở từ trứng đỏ, 1 mạng 100 máu, không giới hạn số lượng). Chỉ gà mẹ gốc đẻ trứng; gà mẹ phụ mới đi đánh nhân vật (đuổi, mổ, Lao / Bay, đổi màu như gà mẹ trước đây, `dieuTuong()`). Gà mẹ phụ kế thừa lần hồi sinh hiện tại (`lan`) của gà mẹ gốc.
- Gà mẹ gốc không mổ / Lao / Bay: chỉ sống sót và đẻ trứng (`dieuTuongGoc()`): có trứng đỏ đang ấp thì đi vòng quanh nó, cách xa tới `TRUNG_DB_BAO_VE` = 450, không thì chạy trốn nhân vật trong `TAM_NHIN_TUONG`. Vẫn có ba màu đen / vàng / đỏ để tự vệ. Mũi tên chỉ hướng và số mạng chỉ tính gà mẹ gốc.
- Quả thứ 5 của mỗi lượt trứng (cứ `TRUNG_CHO` = 15s) là trứng đỏ (`deTrungDb()`, không tính vào `GA_TOI_DA`, mỗi gà mẹ gốc chỉ có 1 quả đang ấp): to gấp `TRUNG_DB_TO` = 5. Cứ `TRUNG_DB_NHIP` = 2s nở một gà con mạnh dần (`nuaGaDb()`; sức mạnh `suc` nhân máu và sát thương, độ to `to`): 2s gà con thường, 4s x2 to gấp đôi, 6s x3, 8s x4; đủ `TRUNG_DB_NO` = 10s thì nở ra một gà mẹ phụ (`sinhMePhu()`). Gà mẹ phụ chết chỉ thưởng `DIEM_PHU` điểm, không hồi máu, không hồi sinh; gà mẹ gốc chết thì hồi sinh như cũ (`henTuong`).
- Có trứng đỏ đang ấp thì mũi tên chỉ hướng chỉ về trứng đó (liên tục, nhấp nháy mờ, từ nhân vật gần trứng nhất), cuối mũi tên là dấu X đỏ nhỏ kèm số giây đếm ngược tới lúc nở gà mẹ phụ, cả X và số nháy 0,5s hiện / 0,5s ẩn (`xTrungView`); trứng xa quá tầm mũi tên thì X nằm ở cuối dãy mũi tên, vẽ cả khi trứng bị sương mù che.
- Thanh đen phía trên hiện chiêu của gà mẹ phụ gần nhân vật nhất (`tuongBang`), chưa có thì của gà mẹ gốc; có chữ "Gà mẹ phụ" và số lượng bên trái avatar.

# Nguyên tắc thế phòng thủ & gọi gà con

- Thế phòng thủ (mọi gà mẹ, `the` / `hoiThe`, trong `capNhatChieuTuong()`): cứ `THE_CHU_KY` = 6s vào thế `THE_KEO_DAI` = 2s (+0,5s mỗi lần hồi sinh). Trong thế né 100% mọi đòn (chữ "NÉ!", khiên xanh nhấp nháy bao quanh thân, chữ "THẾ PHÒNG THỦ!"), ngoài thế không né đòn nào. Không vào thế khi đang sơ hở, Lao / Bay, đổi màu hay hoá socola.
- Gọi gà con (mọi gà mẹ, `goiGaCon()`, nút thứ 7 trên thanh đen): máu dưới `GOI_MAU` = 40% thì gọi `GOI_DAN` = 2 gà trắng, 2 gà đỏ, 1 gà đen (+1 con mỗi lần hồi sinh) quanh mình, hồi `GOI_HOI` = 30s; không tính vào `GA_TOI_DA`; không dùng khi đang Lao / Bay / socola.
- Gà mẹ phụ chuyên một kiểu, xoay vòng theo thứ tự sinh (`kieuPhu`, `KIEU_PHU` = 5): 0 chỉ Lao (hồi 8s) · 1 chỉ Bay (hồi 12s) · 2 chỉ màu đen · 3 chỉ màu vàng · 4 chỉ màu đỏ (một màu cố định thì chu kỳ 12s); chiêu không thuộc kiểu thì không dùng (mờ trên thanh đen). Mỗi kiểu một màu riêng nhuộm cả thân (chỉ giữ đầu trắng, mỏ và chân; `LOC_PHU` dạng `tint:#màu`, `nhuomMau()` trong `ve-canvas.ts`, nhuộm sẵn atlas) và màu thanh máu riêng (`MAU_PHU`, `mauThanh()`). Gà mẹ gốc chỉ có ba màu, không Lao / Bay.

# Nguyên tắc hiệu ứng cháy nổ

- Gà không có bóng đổ dưới chân (không vẽ ellipse bóng).

- `Vet` loại `chay` (`veChay()` trong `ve-canvas.ts`): quầng lửa, khói, tia lửa; `co` là hệ số kích thước, sống 0,7s. Dùng cho mọi vụ nổ chưởng, socola, trứng đỏ nở, gà mẹ chết (3 vụ nổ).
- Chưởng tự bắn lên trời (`chuongLenTroi()`, `Dan.troi`, hoàn toàn tự động, không sát thương, không đổ cây, không mang tầm nhìn): nhân vật ăn socola bắn 3 tia, và khi hạ được một gà mẹ thì cả hai nhân vật cùng bắn; nổ cháy trên trời (`noTroi()`).

# Nguyên tắc thắng / thua

- Nhân vật thắng (`kiemTraThang()` → `ketThuc(true)`, `nguoiThangTran` = true): gà mẹ đã dùng hết mạng (đã sinh đủ `TUONG_HOI_SINH` + 1 lần và đã chết), không còn gà con và gà mẹ phụ nào sống và không còn trứng (kể cả trứng đỏ) chưa nở, tức diệt hết gà mẹ và gà con. Màn kết thúc hiện "Chiến thắng!".
- Quái vật thắng (`ketThuc(false)`): cả hai nhân vật cùng hết máu. Màn kết thúc hiện "Quái vật thắng!".
- Cả hai trường hợp đều ghi điểm / kỷ lục như cũ; điểm chỉ dùng để chọn nhân vật ghi nhiều điểm nhất (MVP) ở màn kết thúc, không quyết định thắng thua.
