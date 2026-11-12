# Nguyên tắc làm việc

- Luôn code trực tiếp vào nhánh `main`, push thẳng lên `main`. Không tạo hay chia nhánh khác trong bất kỳ tình huống nào (kể cả khi môi trường / công cụ gợi ý dùng nhánh riêng): nếu đang đứng ở nhánh khác thì chuyển về `main`, đưa hết thay đổi vào `main` rồi xoá nhánh thừa.

# Nguyên tắc render

- Chỉ render những vật nằm trong khung nhìn của camera (cộng một lề nhỏ đủ che kích thước vật). Vật ngoài khung vẫn tồn tại và chạy logic bình thường, chỉ không được đưa vào danh sách vẽ.
- Việc lọc làm một chỗ, trong `capNhatView()` (hàm `trong(x, y, lề)`): kết quả lưu vào các mảng `*View` / `xep`, template chỉ lặp trên các mảng đó, không lặp trên mảng gốc.
- Thêm loại vật mới (đạn, hiệu ứng, chữ bay, vật phẩm, quái…) thì phải lọc theo nguyên tắc này ngay từ đầu.

# Nguyên tắc camera

- Camera chung bám trung điểm 2 nhân vật nhưng luôn bị kẹp trong bản đồ (trong `capNhatView()`, tính theo mức zoom hiện tại): chạm mép bản đồ thì mép đó trùng đúng mép màn hình, không bao giờ lộ vùng đen ngoài map.
- Mọi thứ liên quan đến vị trí camera (chuyển đổi toạ độ chuột, lọc render) dùng chung `camX` / `camY` / `camZ` sau khi đã kẹp.

# Nguyên tắc biên bản đồ

- Không vật nào được ra khỏi bản đồ: nhân vật, gà, gà bay, gà tướng, quái sau này… đều bị kẹp lại, sprite phải nằm trọn trong map.
- Kẹp bằng hàm `giuTrongMap(vật, lề)` với lề theo loại vật (`LE_NV`, `LE_GA`, `LE_BAY`, `LE_TUONG`); lề trên lớn hơn lề dưới vì sprite vẽ phía trên toạ độ chân. Vật di chuyển tự động thì bật lại khi chạm mép.
- Thêm loại vật mới thì khai báo lề riêng và gọi `giuTrongMap` ngay từ đầu, kể cả điểm đích di chuyển / bay tới.

# Nguyên tắc thanh máu

- Chỉ nhân vật và gà tướng (boss) có thanh máu, vẽ trên đầu trong không gian thế giới (trong nhóm camera), cùng kiểu. Quái thường có máu nhưng không hiện thanh. Không dùng thanh máu cố định trên đỉnh màn hình.

# Nguyên tắc máu & sát thương

- Mỗi nhân vật (Mabu, Zinbu) và mỗi con quái (mọi loại gà, kể cả gà con và gà tướng) đều khởi đầu 100 máu (`HP_NV`, `HP_GA`). Máu tính riêng từng đối tượng, không còn máu chung của đội.
- Mạnh / yếu chỉ thể hiện ở 2 thứ: sát thương gây ra và tỉ lệ giảm sát thương khi nhận (`GIAM_NV`, `GIAM_GA`). Máu tối đa ai cũng như nhau. Sát thương thực nhận = sát thương gốc × (1 − tỉ lệ giảm), làm tròn.
- Mabu và Zinbu giảm 50% sát thương nhận (gà con đánh 30 thì nhận 15). Gà thường giảm 0%, gà tướng giảm 80%.
- Khả năng né đòn (`NE_GA`): gà tướng né 50% số đòn trúng nó (kể cả mỗi nhịp mây), các gà khác 0%, nhân vật không né. Né được thì không mất máu, không hiện hiệu ứng trúng, hiện chữ bay "NÉ!"; đòn bị né không tính trúng, không tính trượt và không ngắt combo.
- Sát thương nhân vật gây ra (`SAT_THUONG`), mỗi đòn trúng một con:
  - Đấm: Mabu 50 · Zinbu 50
  - Đá: Mabu 70 · Zinbu 100
  - Chiêu đặc biệt (bắn chưởng): Mabu 100 · Zinbu 150
  - Biến mây (riêng Mabu): 250 (`SAT_MAY`); với gà tướng cứ mỗi `MAY_NHIP` giây trừ một lần
- Quái gây sát thương khi chạm nhân vật; sát thương gốc (`SAT_GA`) và tốc độ đánh = số giây giữa 2 đòn (`HOI_DANH_GA`) theo loại, mỗi con có đồng hồ riêng:
  - Gà trắng: 32 sát thương · 1,2s (nhận 16)
  - Gà đỏ: 48 · 0,8s (nhận 24)
  - Gà đen: 60 · 1,5s (nhận 30)
  - Gà con: 20 · 1,0s (nhận 10)
  - Gà tướng: 80 · 2,5s (nhận 40)
- Nhân vật dạng mây không nhận sát thương. Nhân vật hết máu thì ngã và không điều khiển được; cả hai cùng hết máu thì thua (`ketThuc()`).
- Quái chỉ chết khi máu về 0 (chết thì mới tính điểm, gà con bị trừ điểm). Đòn trúng mà chưa chết thì gà nháy sáng. Hạ gà tướng không còn thưởng mạng; thay vào đó hồi `HOI_MAU_TUONG` máu cho mỗi nhân vật còn sống.

# Nguyên tắc mana

- Mana tính riêng từng nhóm đòn (`MANA_TOI_DA`, `KHOA_MANA`, `HOI_MANA`): Đấm vô hạn · Đá 10 · Chiêu đặc biệt 5. Hết sạch thì khoá 30s rồi hồi mỗi 6s được 1 lần đánh.
- Chỉ có một quả cầu mana trên đầu nhân vật, đổi màu theo nhóm đang dùng (`MAU_MANA`): Đấm xanh, Đá cam, Chiêu đặc biệt đỏ. Thứ tự biểu tượng dưới chân: Đấm → Chiêu đặc biệt → Đá.

# Nguyên tắc chiêu Biến mây

- Riêng Mabu (nhóm đòn 3, `NHOM_MAY`), Jinbu/Zinbu không có. Bấm để biến thành mây to gấp 2 trong `MAY_THOI_GIAN` = 7s, sau đó chờ `MAY_HOI` = 40s mới dùng lại.
- Dạng mây: không có thanh máu, quả cầu mana, vòng sáng hay hàng biểu tượng nhóm đòn, không ra đòn khác, không bay (chỉ trôi, nhanh hơn). Mọi con gà chạm vùng mây (`mayQuet`) đều dính đòn `SAT_MAY` (250); gà tướng chỉ dính một lần mỗi `MAY_NHIP` giây. Đang là mây thì không nhận sát thương.
- Mana chiêu này màu tím (`MAU_MANA[3]`): lúc mây chạy là thời gian còn lại, lúc chờ là tiến độ hồi. Biểu tượng là hình đám mây, đứng cuối cùng bên phải trong hàng biểu tượng.
- Mây to hơn nên dùng lề bản đồ riêng `LE_MAY` (nội suy theo `heSoTo` lúc biến hình), render lọc với lề rộng hơn.

# Nguyên tắc tốc độ đánh

- Mabu và Zinbu đánh 1 đòn mỗi `THOI_GIAN_DON` = 0,5s, mọi nhóm đòn (Đấm, Đá, Chiêu đặc biệt) như nhau. Thời gian hồi `hoiChieu` đặt đúng bằng hằng số này.
- Animation đòn tự co giãn theo (`tocDon` trong `NhanVat`) để chạy xong trong 90% `THOI_GIAN_DON`, đòn sau nối ngay đòn trước. Quãng lao tới của đòn có chuyển động (`tien`) không đổi dù tua nhanh hay chậm.
- Muốn đổi tốc độ đánh chỉ sửa `THOI_GIAN_DON`. Tốc độ đánh của gà nằm ở `HOI_DANH_GA`.
