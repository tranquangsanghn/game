# Dragon Ball

Game 2 nhân vật, chơi bằng chuột + Tab hoặc tay cầm kiểu Xbox (chọn ở màn bắt đầu), viết bằng TypeScript thuần (Vite), chỉ có giao diện (không có máy chủ), chạy trên GitHub Pages.

- Chơi online: https://tranquangsanghn.github.io/game/
- Mỗi lần push lên `main`, GitHub Actions tự build `web/` và deploy lên GitHub Pages.

## Chạy trên máy

Cần Node 20+. Chỉ có giao diện (`web/`), không có máy chủ: ván đang chơi và bảng điểm lưu trong `localStorage` của trình duyệt.

```bash
cd web
npm install
npm run dev
```

Mở http://localhost:5173, nhập **tên người chơi** ở màn bắt đầu. Bấm ❚❚ **Tạm dừng → 💾 Lưu game** để lưu; lần sau mở lại (cùng trình duyệt), màn bắt đầu có nút **▶ Chơi tiếp ván đã lưu**. Hết ván thì điểm được ghi vào bảng điểm cao nhất (của trình duyệt đó).

## Đưa lên GitHub Pages

Mỗi lần push lên `main`, GitHub Actions (`.github/workflows/deploy.yml`) tự build `web/` và deploy lên GitHub Pages. Lần đầu cần bật: GitHub → repo → **Settings → Pages → Source: GitHub Actions**.

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

**Hợp thể Super Bư** (đội Mabu + Zinbu, tay cầm): hai người đứng gần nhau (≤ 300) và **cùng bấm một nút đánh** (A, B, X hoặc Y) thì hợp thể thành Super Bư trong **50 giây** (đếm ngược trên đầu), mạnh gấp 3 lần Mabu + Zinbu cộng lại (máu, đấm, đá, chưởng; nút B bắn bóng ma nổ to). Người **ít máu hơn** lúc hợp thể chỉ điều khiển **đi lại / bay**, người **nhiều máu hơn** chỉ điều khiển **ra đòn**. Hết 50 giây thì tách ra (máu chia lại theo phần còn lại), **15 giây** sau mới hợp thể lại được. Chỉ hợp thể được trên thần điện của Frieza (đi qua cổng dịch chuyển ở đảo 4), ra khỏi thần điện thì tự tách ra. Chưởng và bóng ma của Super Bư hồi 0,5 giây.

**💣 Mê cung bom** (đi bộ qua đường hầm ở phía tây đảo 1, đảo có 3 con Cell): trong mê cung không có chiêu thường, chỉ có 3 loại bom. **Tay cầm**: **X ném bom** (LB / RB đổi loại: lửa · nước · nổ); **giữ nút càng lâu ném càng xa** (1–4 ô), thả ra là ném theo hướng đang nhìn; bom lửa / nước nằm chờ, **bấm A để nổ**, chờ càng lâu tia nổ càng dài (tối đa 4 ô, 4 giây thì tự nổ). Bom nổ tự nổ sau 2 giây, nổ vùng 5 × 5 ô, núp sau gạch thì không sao. **Chuột**: chọn bom ở thanh đen (hoặc phím 1 / 2 / 3), giữ chuột trái để nạp, thả để ném về phía chuột, bấm lại để nổ. Bom chỉ phá thùng gỗ và ô dấu ?; ô ? có giày chạy nhanh, khiên chống bom, lưới (bẫy) hoặc quái ăn thịt. Dính bom lửa thì bốc cháy, đồng đội phải mang **xô nước** tới cạnh rồi **bấm B** (đổ nước) cứu trong 4 giây; dính bom nước thì bị nhốt trong bong bóng, đồng đội phải mang **kiếm / kim châm** tới cạnh rồi **bấm Y** (chọc) cứu trong 5 giây. Quái ăn thịt chui ra từ các hang, cắn khi chạm. Cuối mê cung có **ngọc rồng 4 sao**. Trong mê cung và đường hầm không bay được.

**Vegeta**: nhân vật chọn chơi thứ 3 (chơi 1 người, hoặc 2 người cùng Mabu / Zinbu; màn chọn có 6 thẻ, tay cầm ◀ ▶ ▲ ▼ để chọn). Sức mạnh giữa Mabu và Zinbu (Đấm 50 · Đá 85 · Chưởng 160), chỉ có Đấm / Đá / Chiêu đặc biệt; nút B tự dùng chưởng. Chưởng là quả cầu sáng có đuôi, nổ thành đám lửa lớn.

**Biến socola (chỉ Zinbu)**: ném chưởng socola nổ diện rộng (tốn 40 mana). Gà con dính thì chết luôn và thành thanh socola, Mabu / Zinbu chạm vào là ăn được: +100 máu và +100 mana. Gà mẹ dính thì chịu sát thương rồi hoá socola 5 giây (đứng yên, không né); lúc đó nếu Mabu đang ở dạng mây quét trúng thì gà mẹ mất 30% máu (một lần mỗi lần hoá socola), từ 30% trở xuống thì chết luôn. Tướng gà đang hoá socola thì Mabu / Zinbu chạm vào là ăn luôn (vua gà thì không ăn được). Hồi chiêu 3 giây; trong lúc hồi Zinbu vẫn đấm / đá / chưởng bình thường.

**Biến mây (chỉ Mabu)**: chọn nút đám mây trên bảng chiêu rồi ra đòn (tốn 40 mana). Mabu biến thành đám mây to gấp 2 trong 7 giây, không nhận sát thương, mọi con gà mây quét qua đều trúng đòn. Sau đó phải chờ 25 giây mới dùng lại.

## Máu, mana và chiêu (cân bằng mới)

- **Máu**: vào ván 150. Ăn máu (táo đỏ +100, socola +100, hạ vua gà +60) cộng không giới hạn (bình máu đầy ở mốc 300). Không bị thương 5 giây thì tự hồi 2 máu/giây tới 150.
- **Mana**: vào ván 200, cộng không giới hạn (bình đầy ở mốc 200), tự hồi 2/giây tới 100. Bay tốn 15/giây, **chưởng tốn 30**, **Biến mây / socola tốn 40**. **Đấm / Đá trúng hồi 5 mana** (đánh gần để gom mana, xả chưởng khi gà đông). Táo xanh +30 mana.
- **Đá** hất lùi và làm choáng gà con 0,7s; **chưởng** xuyên qua mọi gà trên đường bay rồi nổ; combo 10+ thì chưởng hồi nhanh gấp đôi (hiện COMBO trên đầu nhân vật).
- **Cứu đồng đội**: một người ngã mà người kia còn sống thì Mabu phủ **mây** lên Zinbu / Zinbu phủ **cục socola** lên Mabu; mây / socola bám theo người còn sống (nối bằng dây), đếm ngược 15 giây, người cứu sống sót đủ 15s thì người ngã hồi sinh (100 máu).
- **Bản đồ**: ở màn mục tiêu (trước khi Vào chơi) chọn **Đồng cỏ** hoặc **Đảo sa mạc** (tay cầm ◀ ▶, chuột bấm). Đảo sa mạc: map đồng cỏ (vườn gà) nằm giữa biển, quanh nó là 5 đảo cát xếp thành vòng tròn nối nhau bằng dải cát (đảo lớn nhất phía dưới là chỗ xuất phát). Gà chỉ ở trong vườn, nhân vật không vào được vườn; đi bộ không xuống được biển, bay qua biển giữa các đảo được. Trên đảo không có gà, không có quả cầu trốn, mỗi đảo chỉ 1–2 cây.
- **Quả cầu trốn**: giữa map có 2 quả cầu, mỗi quả có avatar của chủ (trái của Mabu, phải của Zinbu), chỉ đúng chủ mới chui vào được. Chạm vào là chui vào trốn 10 giây: gà không nhìn thấy (đi lang thang tìm), không bị đánh, hồi 20 máu/giây tới đầy bình (300) và mana được hồi đầy. Hết 10 giây quả cầu vỡ ra khói hồng và nhân vật bước ra; 20 giây sau mới có quả cầu mới ở chỗ đó.
- **Gà mẹ**: ngoài thế phòng thủ giảm 40% sát thương (mỗi đòn tối đa 60); lúc **sơ hở** sau Lao / Bay nhận ×2 ("CƠ HỘI x2!"). Gà mẹ gốc dưới 50% máu vào **giai đoạn 2**, đẻ trứng nhanh hơn.
- **Gà con**: gà trắng đi thành đàn và vây quanh; gà đỏ lao 1,5s rồi khựng 1s (nhận thêm 50% sát thương); gà đen bay vòng quanh, báo hiệu bằng vệt đỏ rồi nhào xuống.

## Gà

Sprite gà lấy từ `tools/ga-goc.png`; chạy `python3 tools/tao-atlas-ga.py` để sinh lại các atlas trong `public/assets/game/` (cần Pillow + numpy).

- **Gà trắng** (10đ): đi bộ · **Gà đỏ** (20đ): đi nhanh, nhảy · **Gà đen** (30đ): bay và thả trứng
- **Gà tướng / gà mẹ** (500đ): to gấp 5 lần, đẻ trứng ra gà con. Có chiêu Lao (500 px/s, sát thương ×2, 12s/lần) và Bay (700 px/s, sát thương ×3, 15s/lần) kèm vệt đỏ báo hiệu, rồi lộ sơ hở 3s; cứ 20s lại đổi màu 5s: đen (phản đòn), vàng (miễn đòn), đỏ (đốt cháy xung quanh). Chiêu của gà mẹ nằm trên thanh đen phía trên màn hình. Có 3 mạng (hồi sinh tối đa 2 lần), mỗi lần sát thương +50%, thế phòng thủ dài thêm 0,5s và đẻ thêm 1 trứng. Hạ được vua gà thì cả đội hồi 60 máu
- **Gà mẹ gốc** (có vương miện): chỉ chạy trốn và đẻ trứng. Máu 100, mỗi lần hồi sinh thêm 100 (100 → 200 → 300), tự hồi 2 máu mỗi giây tới đầy. Dưới 20% máu thì bỏ canh trứng, chỉ lo chạy trốn, và mỗi mạng có 1 lần **trốn chạy** nhanh gấp 4 lần, xa gấp 2 lần quãng bay của Zinbu. Mỗi lượt (10 giây một lượt khi có tối đa 10 tướng gà đang sống, từ 11 con trở lên thì 15 giây) đẻ 4 trứng thường rồi quả thứ 5 là **trứng đỏ** to gấp 5 lần, gà mẹ canh quanh nó; trứng đỏ ấp 5 giây (tối đa 5 tướng gà), 10 giây (6–10 con) hoặc 15 giây (từ 11 con), trong lúc ấp nở đều 4 gà con mạnh dần (thường → x2 → x3 → x4, to dần), hết thời gian ấp thì nở ra một **gà mẹ phụ** đi đánh nhân vật thay gà mẹ gốc (không giới hạn số lượng). Muốn thắng phải diệt hết gà mẹ gốc (3 mạng), gà mẹ phụ, gà con và trứng
- **Thế phòng thủ**: gà mẹ không né ngẫu nhiên nữa; cứ 6 giây vào thế 2 giây (có khiên xanh) né mọi đòn, ngoài thế thì đánh trúng được. **Gọi gà con**: máu dưới 40% thì gọi gà con ra bảo vệ (hồi 30s). Gà mẹ phụ chuyên mỗi con một kiểu (chỉ Lao / chỉ Bay / chỉ màu đen / vàng / đỏ), mỗi con một màu
- Trứng đỏ: mũi tên chỉ hướng chỉ về phía trứng, cuối mũi tên là dấu X đỏ nhấp nháy đếm ngược tới lúc nở
- Chưởng cháy nổ tự bắn lên trời khi ăn socola hoặc hạ được gà mẹ
- **Táo**: chỉ rơi từ cây bị đánh đổ (30% một quả; cây to chắc chắn rơi 2 táo đỏ + 2 táo xanh). Táo đỏ +100 máu, táo xanh +30 mana. Gà đi qua cũng mổ ăn táo đỏ

Kỷ lục lưu trong `localStorage` của trình duyệt.

## Đo hiệu năng

Mở game với `?doHieuNang` ở cuối đường dẫn (ví dụ `…/game/?doHieuNang`). Góc trên phải hiện bảng đo (bấm để thu gọn): FPS, thời gian từng phần logic / vẽ, số vật, RAM, cảnh báo bất thường. Log mỗi giây được giữ khoảng 10 phút gần nhất (còn cả khi tải lại trang); bấm **Tải log** để lấy file JSON.

## Nhúng vào trang khác (iframe)

Khi người chơi bấm Đóng, game gửi `postMessage('chicken-shooting-game:dong')` lên trang cha để trang cha tự đóng khung iframe.

## Cấu trúc

- `src/app/chicken-shooting-game/` — toàn bộ game: component (logic), `ve-canvas.ts` (vẽ bằng Canvas 2D), sprite, dữ liệu nhân vật
- `public/assets/game/` — ảnh sprite atlas Mabu, Zinbu và các loại gà
- `tools/` — ảnh gà gốc và script tô màu / ghép atlas
- `src/app/app.ts` — vỏ app: mở game, xử lý nút Đóng
