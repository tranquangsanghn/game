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
- Trên mỗi thanh bên (không có tên nhân vật): các chiêu thức xếp dọc từ dưới lên trên, nút đầu (Đấm) sát đáy (`nutBang()`, `xThanh()`); máu (số `hp/HP_NV` và thanh) nằm ngay phía trên nút trên cùng (`yMauNv()`). Nửa vòng tròn đen bán kính `R_NV` (= 2/3 `R_BANG`) nằm đúng ở góc dưới map như cũ, tâm ở góc dưới (`tamNv()`), chỉ có animation hiện tại của nhân vật (cùng `khung` / `lat` với trên map). Không thu nhỏ map vì bảng.
- Chiêu đang dùng sáng + phát sáng, chiêu khác mờ, hết mana / đang khoá / Mây đang chạy hoặc hồi (`hetMana()`) thì mờ hẳn và không chọn được.
- Đổi chiêu: chế độ tay cầm bằng L1 / R1 (`chuyenChieu()` → `NhanVat.datNhom`), chế độ chuột bằng cách bấm vào nút chiêu trên thanh đen (`chonNut()`) hoặc phím 1–4 (`phimXuong()`); chiêu hết mana / đang khoá thì không chọn được ở cả hai chế độ. Không có con lăn.

# Nguyên tắc điều khiển

- Màn bắt đầu cho chọn chế độ chơi (`cheDo`: `'chuot'` hoặc `'tayCam'`, nút chọn ở màn bắt đầu, `datCheDo()`, nhớ lại trong `localStorage`; mặc định chuột). Chỉ chế độ đang chọn nhận điều khiển; chế độ kia bị bỏ qua hoàn toàn (kể cả nút bắt đầu / tạm dừng của tay cầm). Màn bắt đầu và README hướng dẫn cả hai chế độ.
- Chế độ tay cầm (Gamepad API, mapping "standard" kiểu PS, `docTayCam()` đọc mỗi khung hình): tay cầm 1 → Mabu, tay cầm 2 → Zinbu. Cần trái chạy, cần phải ngắm (không gạt thì tự ngắm `diemNham()`), ✕ / R2 ra đòn, ○ / L2 bay, L1 / R1 đổi chiêu (`chuyenChieu()`), Options bắt đầu / tạm dừng, Share (Select) đổi nhân vật khi chỉ có 1 tay cầm (`doiTayCam()`). Tay cầm không phải mapping "standard" dùng tạm chỉ số nút / cần như standard (cần phải lấy trục 2 và 5 nếu có ≥ 6 trục); màn bắt đầu hiện nút vừa bấm để dò.
- Chế độ chuột (chỉ có 1 chuột nên điều khiển 1 nhân vật tại một thời điểm, `chuot`): chuột phải chạy tới điểm bấm (xa thì bay, `datDich()`), chuột trái ra đòn tại điểm chuột (`bamChuot()`), bấm vào nút chiêu ở thanh đen để đổi chiêu, **Tab** chuyển chuột sang nhân vật kia (`doiChuot()`), menu chuột phải của trình duyệt bị chặn. Tâm ngắm vẽ theo chuột (`tamX` / `tamY`), ẩn khi chuột nằm trên bảng chiêu thức (`trenBang`); nhân vật đang dùng chuột không có tâm tự ngắm. Toạ độ chuột đổi qua `phepChieu()` (dùng chung với vẽ canvas).
- Thêm điều khiển mới thì gắn vào đúng chế độ của nó; không thêm phím tắt ngoài Tab và phím 1 / 2 / 3 / 4 (chọn chiêu thứ n từ dưới lên của nhân vật đang dùng chuột, `phimXuong()`; chiêu hết mana / khoá thì không chọn được). Chuột chỉ để bấm nút trên các màn bắt đầu / tạm dừng / kết thúc ở chế độ tay cầm.

# Nguyên tắc giữ nguyên bố cục khi đổi map / màn

- Bố cục hiện tại là chuẩn, cố định: 2 thanh đen hai bên với chiêu thức, máu và nửa vòng tròn nhân vật (kích thước, vị trí, hàng nút, chân dung animation nhân vật), thanh đen trên của gà mẹ, cách chọn chiêu bằng click, thanh máu / mana, camera, tâm ngắm, mọi nguyên tắc ghi trong file này.
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
- Khả năng né đòn (`NE_GA`): gà tướng né 50% số đòn trúng nó (kể cả mỗi nhịp mây), gà con (trắng, đỏ, đen) 0%; Mabu và Zinbu né 25% đòn gà đánh (`NE_NV`). Né là tự động, ngẫu nhiên từng đòn. Né được thì không mất máu, không hiện hiệu ứng trúng, hiện chữ bay "NÉ!"; đòn bị né không tính trúng, không tính trượt và không ngắt combo.
- Sát thương nhân vật gây ra (`SAT_THUONG`), mỗi đòn trúng một con:
  - Đấm: Mabu 50 · Zinbu 50
  - Đá: Mabu 70 · Zinbu 100
  - Chiêu đặc biệt (bắn chưởng): Mabu 100 · Zinbu 150
  - Biến mây (riêng Mabu): 250 (`SAT_MAY`); với gà tướng cứ mỗi `MAY_NHIP` giây trừ một lần
- Quái gây sát thương khi chạm nhân vật; sát thương gốc (`SAT_GA`) và tốc độ đánh = số giây giữa 2 đòn (`HOI_DANH_GA`) theo loại, mỗi con có đồng hồ riêng:
  - Gà trắng: 32 sát thương · 1,2s (nhận 16)
  - Gà đỏ: 48 · 0,8s (nhận 24)
  - Gà đen: 60 · 1,5s (nhận 30)
  - Gà tướng: 80 · 2,5s (nhận 40)
- Nhân vật dạng mây không nhận sát thương. Nhân vật hết máu thì ngã và không điều khiển được; cả hai cùng hết máu thì thua (`ketThuc()`).
- Quái chỉ chết khi máu về 0 (chết thì mới tính điểm). Đòn trúng mà chưa chết thì gà nháy sáng. Hạ gà tướng không còn thưởng mạng; thay vào đó hồi `HOI_MAU_TUONG` = 60 máu cho mỗi nhân vật còn sống.
- Vật phẩm máu (trái tim, `vatPham` → `vatPhamView`): cứ `VP_CHU_KY` = 15s xuất hiện một cái cách một nhân vật còn sống 300–1100 (tối đa `VP_TOI_DA` = 5 trên map), gà con chết rơi với xác suất `VP_ROI` = 20%, gà mẹ chết rơi `VP_ROI_TUONG` = 3 cái. Nhân vật (không phải mây, chưa gục, chưa đầy máu) đi vào bán kính `VP_BAN_KINH` thì nhặt và hồi `VP_HOI` = 50 máu (hiện chữ "+50 ❤"); đầy máu thì không nhặt. Không ai nhặt sau `VP_TON_TAI` = 45s thì biến mất (nhấp nháy 8s cuối). Không bị sương mù.

# Nguyên tắc mana

- Mana tính riêng từng nhóm đòn (`MANA_TOI_DA`, `KHOA_MANA`, `HOI_MANA`): Đấm vô hạn · Đá 10 · Chiêu đặc biệt 5. Hết sạch thì khoá 30s rồi hồi mỗi 6s được 1 lần đánh.
- Chỉ có một quả cầu mana trên đầu nhân vật, đổi màu theo nhóm đang dùng (`MAU_MANA`): Đấm xanh, Đá cam, Chiêu đặc biệt đỏ. Thứ tự biểu tượng dưới chân: Đấm → Chiêu đặc biệt → Đá.

# Nguyên tắc chiêu Biến mây

- Riêng Mabu (nhóm đòn 3, `NHOM_MAY`), Jinbu/Zinbu không có. Bấm để biến thành mây to gấp 2 trong `MAY_THOI_GIAN` = 7s, sau đó chờ `MAY_HOI` = 40s mới dùng lại.
- Dạng mây: không có thanh máu, quả cầu mana, vòng sáng hay hàng biểu tượng nhóm đòn, không ra đòn khác, không bay (chỉ trôi, nhanh hơn). Mọi con gà chạm vùng mây (`mayQuet`) đều dính đòn `SAT_MAY` (250); gà tướng chỉ dính một lần mỗi `MAY_NHIP` giây. Đang là mây thì không nhận sát thương.
- Mana chiêu này màu tím (`MAU_MANA[3]`): lúc mây chạy là thời gian còn lại, lúc chờ là tiến độ hồi. Biểu tượng là hình đám mây, đứng cuối cùng bên phải trong hàng biểu tượng.
- Mây to hơn nên dùng lề bản đồ riêng `LE_MAY` (nội suy theo `heSoTo` lúc biến hình), render lọc với lề rộng hơn.

# Nguyên tắc tốc độ đánh

- Tốc độ đánh của Mabu và Zinbu là thời gian hồi `hoiChieu` giữa 2 đòn trong `ban()`, theo nhóm: Đấm 0,4s (đang đi 0,6s) · Đá 0,64s · Chiêu đặc biệt 1,6s. Không đổi khi chỉnh animation.
- Animation mỗi đòn tự co giãn (`tocDon` trong `NhanVat`) để chạy xong trong 90% của `THOI_GIAN_DON` = 0,5s (~0,45s), bất kể đòn có bao nhiêu khung hình. Quãng lao tới của đòn có chuyển động (`tien`) không đổi dù tua nhanh hay chậm.
- Tốc độ đánh của gà nằm ở `HOI_DANH_GA`.

# Nguyên tắc tâm tự ngắm

- Tâm tự ngắm (`nham`, vẽ qua `nhamView` đã lọc theo khung nhìn) tính lại mỗi khung hình cho cả 2 nhân vật. Hiện khi có gà trong tầm, hoặc luôn hiện theo hướng cần phải khi đang gạt cần ngắm (`ngam`); chưa ngã, không là mây. Hết điều kiện là tâm biến mất ngay, không giữ hình cũ.

# Nguyên tắc sương mù & gà lao vào

- Sương mù kiểu Dota / Liên Minh: chỉ ẩn quái, map vẫn vẽ bình thường (không phủ lớp tối nào). Chỉ thấy gà (kể cả gà tướng, thanh máu của nó) trong tầm nhìn `TAM_NHIN` = 1,5 × tầm xa nhất của đấm xa / đá xa (= 750). Tầm nhìn đến từ mỗi nhân vật còn sống và từng chưởng / đòn đang bay (bay hết quãng đường, mang tầm nhìn theo; `nhinNguon`, `thay()` trong `capNhatView()`). Gà ngoài tầm nhìn vẫn tồn tại và chạy logic, chỉ không được vẽ.
- Gà con (trắng, đỏ, đen) có nhân vật (không phải mây, chưa gục) trong `TAM_LAO` (= tầm đánh xa nhất, 500, không đổi theo tầm nhìn) thì lao vào nhân vật gần nhất (`gaLao()`, tốc độ `TOC_DO_LAO`; gà bay giữ tốc độ, đổi hướng); hết tầm thì đi lang thang lại. Gà tướng thấy nhân vật trong `TAM_NHIN_TUONG` (= 3 × `TAM_NHIN`) thì đuổi nhân vật gần nhất, không thì đi loanh quanh (`dieuTuong()`).
- Tốc độ di chuyển thật của mọi gà = tốc độ gốc × `HE_SO_TOC_GA` = 0,25 (áp ở chỗ cộng vị trí trong `capNhatGa()`); đổi tốc độ gà thì chỉnh hệ số này.
- Tốc độ thật khi lao vào (đã nhân `HE_SO_TOC_GA`): gà trắng 40 (`TOC_DO_LAO.hen` = 160) · gà đỏ 60 (240) · gà đen ~30 (tốc độ bay lúc sinh 110–130, không đổi theo màn).

# Nguyên tắc sinh gà & mũi tên chỉ gà tướng

- Gà con không tự sinh theo thời gian nữa: chỉ do gà mẹ (gà tướng) đẻ. Gà tướng xuất hiện ngay từ đầu ván ở chỗ ngẫu nhiên trên map (cách cả hai nhân vật ≥ 2000); bị hạ thì sau `CHO_TUONG` = 30 giây xuất hiện lại.
- Gà tướng đẻ 5 trứng mỗi lượt (tăng theo lần hồi sinh) quanh mình (`deTrung()`), cách nhau `TRUNG_CHO` = 30s (lượt đầu ngay khi xuất hiện). Trứng nở sau `TRUNG_NO` = 2s (`capNhatTrungGa()`) thành 2 gà trắng, 2 gà đỏ, 1 gà đen (`DAN_TRUNG`). Tổng số gà còn sống (kể cả gà tướng) + trứng đang ấp ≥ `GA_TOI_DA` = 20 thì không đẻ. Gà không bị xoá khi ở xa nhân vật.
- Trứng cũng bị sương mù: chỉ vẽ trong tầm nhìn (`trungView`).
- Không có mini map. Thay vào đó là mũi tên chỉ hướng (kiểu đường chim bay của Google Maps, `huongToiTuong()` → `huongView`): cứ `HUONG_CHU_KY` = 5s hiện một lần (mờ dần vào / ra trong `HUONG_HIEN` = 2,5s), chỉ từ nhân vật còn sống gần gà tướng hơn (không phải cả hai) về phía gà tướng; mũi tên ">" nhỏ, mờ, đi theo cụm `HUONG_CUM` = 3 mũi liền nhau (cách `HUONG_LIEN`), các cụm cách xa nhau `HUONG_CACH`. Gà tướng đã gần (trong `HUONG_GAN`) hoặc đã chết thì không hiện. Lọc theo khung nhìn như mọi vật khác.

# Nguyên tắc gà con mổ / bay

- Gà con biết bay (gà đen) thì bay vào nhân vật; gà con không bay (trắng, đỏ) thì lao vào mổ. Mỗi nhịp đánh, gà làm động tác mổ (`mo`, `MO_THOI_GIAN`, vẽ trong `gaThan()`): gật đầu về phía nhân vật.

# Nguyên tắc gà mẹ (gà tướng): chiêu thức, hồi sinh

- Chiêu của gà mẹ (`bangTuong()`, `tuongSong`) nằm trên thanh đen `BAR` phía trên map (toạ độ y âm, giữa trên), 6 chiêu xếp ngang: Mổ + đá · Lao · Bay · Đen · Vàng · Đỏ, kèm chữ "Gà mẹ · hồi sinh n/3"; chỉ để xem, không bấm được. Chiêu đang dùng sáng + phát sáng; Lao / Bay / màu có vòng tiến độ (hồi chiêu hoặc thời gian còn lại). Nửa vòng tròn đen dưới thanh (bán kính `R_TUONG` = `R_BANG` / 3, tâm ở mép trên map giữa màn hình) chỉ có hình con gà (animation, kèm màu đang đổi). 
- Mổ + đá: sát thương và tốc độ như cũ (80 · 2,5s), luân phiên animation mổ / đá (`kieuMo`).
- Lao (`TOC_LAO_THAT` = 500 px/s, `LAO_SAT` = 2, `LAO_HOI` = 15s) và Bay (`TOC_BAY_THAT` = 700 px/s, `BAY_SAT` = 3, `BAY_HOI` = 20s): khi thấy nhân vật xa hơn `CHIEU_TOI_THIEU` (xa hơn `CHIEU_XA` thì ưu tiên Bay), gà mẹ báo hiệu `CHIEU_BAO` = 1s (nháy sáng, đứng yên, vệt đỏ trên mặt đất bám theo mục tiêu — `vachView`), hết báo hiệu thì khoá hướng rồi chạy / bay một đường thẳng, không đổi hướng. Chạm nhân vật thì gây sát thương gốc × hệ số, mỗi nhân vật một lần mỗi đợt, nhân vật vẫn né được (`NE_NV`). Hết quãng (`CHIEU_QUANG_THEM`, tối đa `CHIEU_QUANG_TOI_DA`) hoặc chạm mép map thì nghỉ `CHIEU_NGHI`, rồi lộ sơ hở `SO_HO` = 3s (không né được đòn nào, hiện chữ "SƠ HỞ!"). Đang lao / bay thì không mổ, không đẻ trứng.
- Các chiêu không chồng nhau: giữa 2 chiêu bất kỳ (Lao, Bay, đổi màu) nghỉ ít nhất `CHIEU_NGHI_CHUNG` = 4s (`nghiChung`); màu chỉ bật khi không đang Lao / Bay và đang chờ thì Lao / Bay nhường (`capNhatChieuTuong()`, `batDauChieu()`).
- Ba chiêu đổi màu tự xoay vòng đen → vàng → đỏ, cứ `MAU_CHU_KY` = 20s kích hoạt một màu, kéo dài `MAU_KEO_DAI` = 5s (`capNhatChieuTuong()`):
  - Đen: không bị thương, phản lại sát thương gốc của đòn cho người đánh (không né được, nhân vật vẫn giảm 50%; mây không bị phản).
  - Vàng: mọi đòn trúng gà mẹ đều "MISS" (tính trượt, ngắt combo).
  - Đỏ: nhân vật trong `DOT_BAN_KINH` quanh gà mẹ bị đốt `DOT_SAT` sát thương gốc / giây (nhịp `DOT_NHIP`), không né được, cộng dồn với mổ; mây miễn nhiễm.
- Hồi sinh tối đa `TUONG_HOI_SINH` = 3 lần (tổng 4 mạng, mỗi mạng 100 máu). Mỗi lần hồi sinh, sát thương mọi đòn của gà mẹ tăng cộng dồn `TUONG_TANG_SAT` = 0,5 (hệ số 1 → 1,5 → 2 → 2,5, `heSoLan()`), tỉ lệ né cộng thêm `TUONG_TANG_NE` = 15 điểm % (50 → 65 → 80%, tối đa `NE_TOI_DA` = 80%, `neGa()`), và đẻ thêm 1 trứng mỗi lần (5 → 6 → 7 → 8, `TRUNG_THEM`). Hạ lần cuối thì không hồi sinh nữa. Chỉ hồi sinh khi đã chết, sau đúng `CHO_TUONG` giây kể từ lúc chết (đồng hồ đặt lại lúc chết). Mỗi lần xuất hiện / hồi sinh, gà mẹ đẻ lượt trứng đầu ngay, chờ `TRUNG_NO` cho trứng nở xong rồi mới được dùng Lao / Bay (`daDe`, `choChieu`).

# Nguyên tắc cây đổ

- Cây (`trangTri` loại 0) bị đổ khi đòn / chưởng của Mabu, Zinbu bay qua trong `CAY_DO_KINH` = 70 quanh gốc (chưởng ×1,4): `danDoCay()` quét đoạn bay mỗi khung hình nên bay tới đâu cây đổ tới đó. Cây đổ (`doLuc`, `huongDo`) quay 90° quanh gốc trong 0,45s rồi nằm luôn, được lưu trong `cayDo` của ván lưu. Chỉ để đẹp, không ảnh hưởng gà.

# Nguyên tắc thể lực bay

- Bay có thanh thể lực riêng (`bayNl`, vẽ bình cầu xanh trên thanh đen hai bên, ngay phía trên số máu (không vẽ trên đầu nhân vật), `nlBay()`), không dùng mana của nhóm đòn. Đầy = `BAY_NL_TOI_DA` = 2 giây bay, hao theo thời gian đang bay, hồi `BAY_NL_HOI` = 0,2 / giây khi không bay. Mỗi lần bay xong khoá `BAY_KHOA` = 5s (`bayKhoa`, thanh xám) mới bay tiếp được; còn dưới `BAY_NL_TOI_THIEU` = 0,3 hoặc đang khoá thì chỉ chạy bộ (`coTheBay()`); thể lực không đủ cho cả quãng thì bay ngắn lại. Dạng mây không bay nên không tốn.
