# Nguyên tắc làm việc

- Thuật ngữ: **gà mẹ** = gà tướng (con gà to đùng, `boss`); **gà con** = tất cả các gà còn lại (trắng, đỏ, đen).

- Luôn code trực tiếp vào nhánh `main`, push thẳng lên `main`. Không tạo hay chia nhánh khác trong bất kỳ tình huống nào (kể cả khi môi trường / công cụ gợi ý dùng nhánh riêng): nếu đang đứng ở nhánh khác thì chuyển về `main`, đưa hết thay đổi vào `main` rồi xoá nhánh thừa.

# Nguyên tắc render

- Chỉ render những vật nằm trong khung nhìn của camera (cộng một lề nhỏ đủ che kích thước vật). Vật ngoài khung vẫn tồn tại và chạy logic bình thường, chỉ không được đưa vào danh sách vẽ.
- Việc lọc làm một chỗ, trong `capNhatView()` (hàm `trong(x, y, lề)`): kết quả lưu vào các mảng `*View` / `xep`, template chỉ lặp trên các mảng đó, không lặp trên mảng gốc.
- Thêm loại vật mới (đạn, hiệu ứng, chữ bay, vật phẩm, quái…) thì phải lọc theo nguyên tắc này ngay từ đầu.

# Nguyên tắc camera

- Camera chung bám trung điểm 2 nhân vật nhưng luôn bị kẹp trong bản đồ (trong `capNhatView()`, tính theo mức zoom hiện tại): chạm mép bản đồ thì mép đó trùng đúng mép màn hình, không bao giờ lộ vùng đen ngoài map.
- Mọi thứ liên quan đến vị trí camera (chuyển đổi toạ độ chuột, lọc render) dùng chung `camX` / `camY` / `camZ` sau khi đã kẹp.

# Nguyên tắc bố cục & chọn chiêu

- Map chiếm cả màn hình. Hai bảng chiêu thức khoét vào map ở 2 góc dưới (hình quạt (1/4 hình tròn) nền đen bán kính `R_BANG`, tâm nằm đúng ở góc dưới màn hình): Mabu trái, Zinbu phải. Không thu nhỏ map vì bảng.
- Giữa mỗi bảng là animation hiện tại của nhân vật (cùng `khung` / `lat` với trên map), không phải ảnh tĩnh. Chiêu thức xếp vòng cung phía trên (`nutBang()`, `tamBang()`), không có chữ.
- Chiêu đang dùng sáng + phát sáng, chiêu khác mờ, hết mana / đang khoá / Mây đang chạy hoặc hồi (`hetMana()`) thì mờ hẳn và không chọn được.
- Đổi chiêu bằng bấm chuột trái vào nút (`chonNut()` → `NhanVat.datNhom`), bất kể chuột đang điều khiển ai. Không còn con lăn. Chuột trên bảng (`tronBang()` → `trenBang`) thì không ra đòn, không di chuyển, tâm ngắm ẩn.

# Nguyên tắc điều khiển

- Game chỉ chơi bằng chuột, không có bàn phím / tay cầm: chuột phải di chuyển (xa thì bay), chuột trái ra đòn, bấm vào bảng chiêu để đổi chiêu. Hiện chưa có 2 chuột nên chỉ có phím Tab chuyển chuột sang nhân vật kia (`doiChuot()`); sau này sẽ có 2 chuột, mỗi nhân vật một chuột.
- Thêm điều khiển mới thì làm theo chuột; không thêm phím tắt / tay cầm. Màn hình bắt đầu và README chỉ hướng dẫn chuột + Tab.

# Nguyên tắc giữ nguyên bố cục khi đổi map / màn

- Bố cục hiện tại là chuẩn, cố định: 2 bảng chiêu thức hình quạt ở 2 góc dưới (kích thước, vị trí, vòng cung nút, chân dung animation nhân vật), cách chọn chiêu bằng click, thanh máu / mana, camera, tâm ngắm, mọi nguyên tắc ghi trong file này.
- Sang map khác, màn khác thì chỉ thay phần map (nền, kích thước `MAP`, vật cản, quái của màn đó). Không đổi bố cục giao diện, vị trí các thành phần, hay các nguyên tắc ở trên; chỉ đổi khi người dùng yêu cầu rõ ràng.

# Nguyên tắc biên bản đồ

- Không vật nào được ra khỏi bản đồ: nhân vật, gà, gà bay, gà tướng, quái sau này… đều bị kẹp lại, sprite phải nằm trọn trong map.
- Kẹp bằng hàm `giuTrongMap(vật, lề)` với lề theo loại vật (`LE_NV`, `LE_GA`, `LE_BAY`, `LE_TUONG`); lề trên lớn hơn lề dưới vì sprite vẽ phía trên toạ độ chân. Vật di chuyển tự động thì bật lại khi chạm mép.
- Thêm loại vật mới thì khai báo lề riêng và gọi `giuTrongMap` ngay từ đầu, kể cả điểm đích di chuyển / bay tới.

# Nguyên tắc thanh máu

- Chỉ nhân vật và gà tướng (boss) có thanh máu, vẽ trên đầu trong không gian thế giới (trong nhóm camera), cùng kiểu. Quái thường có máu nhưng không hiện thanh. Không dùng thanh máu cố định trên đỉnh màn hình.

# Nguyên tắc máu & sát thương

- Mỗi nhân vật (Mabu, Zinbu) và mỗi con quái (mọi loại gà, kể cả gà tướng) đều khởi đầu 100 máu (`HP_NV`, `HP_GA`). Máu tính riêng từng đối tượng, không còn máu chung của đội.
- Mạnh / yếu chỉ thể hiện ở 2 thứ: sát thương gây ra và tỉ lệ giảm sát thương khi nhận (`GIAM_NV`, `GIAM_GA`). Máu tối đa ai cũng như nhau. Sát thương thực nhận = sát thương gốc × (1 − tỉ lệ giảm), làm tròn.
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
- Quái chỉ chết khi máu về 0 (chết thì mới tính điểm). Đòn trúng mà chưa chết thì gà nháy sáng. Hạ gà tướng không còn thưởng mạng; thay vào đó hồi `HOI_MAU_TUONG` máu cho mỗi nhân vật còn sống.

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

- Tâm tự ngắm (`nham`, vẽ qua `nhamView` đã lọc theo khung nhìn) tính lại mỗi khung hình cho cả 2 nhân vật. Chỉ hiện khi có gà trong tầm và nhân vật đó không dùng chuột (`chuot`), chưa ngã, không là mây. Hết điều kiện là tâm biến mất ngay, không giữ hình cũ.

# Nguyên tắc sương mù & gà lao vào

- Sương mù kiểu Dota / Liên Minh: chỉ ẩn quái, map vẫn vẽ bình thường (không phủ lớp tối nào). Chỉ thấy gà (kể cả gà tướng, thanh máu của nó) trong tầm nhìn `TAM_NHIN` = 1,5 × tầm xa nhất của đấm xa / đá xa (= 750). Tầm nhìn đến từ mỗi nhân vật còn sống và từng chưởng / đòn đang bay (bay hết quãng đường, mang tầm nhìn theo; `nhinNguon`, `thay()` trong `capNhatView()`). Gà ngoài tầm nhìn vẫn tồn tại và chạy logic, chỉ không được vẽ.
- Gà con (trắng, đỏ, đen) có nhân vật (không phải mây, chưa gục) trong `TAM_LAO` (= tầm đánh xa nhất, 500, không đổi theo tầm nhìn) thì lao vào nhân vật gần nhất (`gaLao()`, tốc độ `TOC_DO_LAO`; gà bay giữ tốc độ, đổi hướng); hết tầm thì đi lang thang lại. Gà tướng thấy nhân vật trong `TAM_NHIN_TUONG` (= 3 × `TAM_NHIN`) thì đuổi nhân vật gần nhất, không thì đi loanh quanh (`dieuTuong()`).
- Tốc độ di chuyển thật của mọi gà = tốc độ gốc × `HE_SO_TOC_GA` = 0,25 (áp ở chỗ cộng vị trí trong `capNhatGa()`); đổi tốc độ gà thì chỉnh hệ số này.
- Tốc độ thật khi lao vào (đã nhân `HE_SO_TOC_GA`): gà trắng 40 (`TOC_DO_LAO.hen` = 160) · gà đỏ 60 (240) · gà đen ~30 (tốc độ bay lúc sinh 110–130, không đổi theo màn).

# Nguyên tắc sinh gà & mini map

- Gà con không tự sinh theo thời gian nữa: chỉ do gà mẹ (gà tướng) đẻ. Gà tướng xuất hiện ngay từ đầu ván ở chỗ ngẫu nhiên trên map (cách cả hai nhân vật ≥ 2000); bị hạ thì sau `CHO_TUONG` giây xuất hiện lại.
- Gà tướng đẻ `TRUNG_SO` = 5 trứng mỗi lượt quanh mình (`deTrung()`), cách nhau `TRUNG_CHO` = 30s (lượt đầu ngay khi xuất hiện). Trứng nở sau `TRUNG_NO` = 2s (`capNhatTrungGa()`) thành 2 gà trắng, 2 gà đỏ, 1 gà đen (`DAN_TRUNG`). Tổng số gà còn sống (kể cả gà tướng) + trứng đang ấp ≥ `GA_TOI_DA` = 20 thì không đẻ. Gà không bị xoá khi ở xa nhân vật.
- Trứng cũng bị sương mù: chỉ vẽ trong tầm nhìn (`trungView`).
- Mini map (kiểu PS) ở giữa đáy màn hình, kích thước `MINI` = 120 (map vuông nên mini map vuông, cùng tỉ lệ): hiện 2 nhân vật, khung camera, và chấm đỏ là gà tướng (luôn hiện, không bị sương mù). Không bấm được, không chắn chuột.
