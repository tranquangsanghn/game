# Nguyên tắc làm việc

- Luôn code trực tiếp vào nhánh `main`. Không tạo hay chia nhánh khác.

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

- Chỉ gà tướng (boss) có thanh máu, vẽ trên đầu trong không gian thế giới (trong nhóm camera) cùng kiểu thanh máu của nhân vật. Quái thường không hiện máu. Không dùng thanh máu cố định trên đỉnh màn hình.

# Nguyên tắc mana

- Mana tính riêng từng nhóm đòn (`MANA_TOI_DA`, `KHOA_MANA`, `HOI_MANA`): Đấm vô hạn · Đá 10 · Chiêu đặc biệt 5. Hết sạch thì khoá 30s rồi hồi mỗi 6s được 1 lần đánh.
- Chỉ có một quả cầu mana trên đầu nhân vật, đổi màu theo nhóm đang dùng (`MAU_MANA`): Đấm xanh, Đá cam, Chiêu đặc biệt đỏ. Thứ tự biểu tượng dưới chân: Đấm → Chiêu đặc biệt → Đá.

# Nguyên tắc chiêu Biến mây

- Riêng Mabu (nhóm đòn 3, `NHOM_MAY`), Jinbu/Zinbu không có. Bấm để biến thành mây to gấp 2 trong `MAY_THOI_GIAN` = 10s, sau đó chờ `MAY_HOI` = 40s mới dùng lại.
- Dạng mây: không có thanh máu, không có quả cầu mana, không ra đòn khác, không bay (chỉ trôi, nhanh hơn). Mọi con gà chạm vùng mây (`mayQuet`) đều dính đòn; gà tướng bị trừ 1 máu mỗi `MAY_NHIP` giây.
- Mana chiêu này màu tím (`MAU_MANA[3]`): lúc mây chạy là thời gian còn lại, lúc chờ là tiến độ hồi. Biểu tượng là hình đám mây, đứng cuối cùng bên phải trong hàng biểu tượng.
- Mây to hơn nên dùng lề bản đồ riêng `LE_MAY` (nội suy theo `heSoTo` lúc biến hình), render lọc với lề rộng hơn.
