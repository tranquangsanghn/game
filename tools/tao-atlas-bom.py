"""Dựng atlas bom của mê cung bom từ ảnh người dùng gửi (tools/bom-goc.webp, 1408×768, lưới ô có nhãn chữ trên nền trắng).
Dùng: python3 tools/tao-atlas-bom.py tools/bom-goc.webp
Ra: web/public/assets/game/bom.png, khung 200×200 (vật ở giữa khung):
  hàng 0: bom lửa (đỏ) · bom nước (xanh) · bom nổ (đen) (quả bom cao ~BOM_CAO điểm ảnh, tâm quả ở giữa khung)
  hàng 1: nổ lửa 5 khung (khói → cầu lửa) · hàng 2: nổ nước 4 khung (lửa xanh) · hàng 3: nổ đen 4 khung (khói → khối đen nứt lửa)
Tách nền: color-to-alpha (cộng thêm độ đặc theo độ bão hoà cho lõi lửa) với nền trắng (khói mờ thành bán trong suốt); bỏ dải nhãn chữ trên đầu mỗi ô và đường kẻ ô."""
import sys
import numpy as np
from PIL import Image

src = np.array(Image.open(sys.argv[1]).convert('RGB')).astype(float)
F = 200
# (x0, y0, x1, y1) từng ô; y0 đã bỏ dải nhãn chữ
BOM = [(4, 18, 137, 132), (4, 286, 137, 381), (144, 520, 277, 630)]
NO = [
    [(706, 18, 842, 132), (848, 18, 982, 132), (988, 18, 1123, 132), (1129, 18, 1263, 132), (1269, 18, 1405, 132)],
    [(706, 286, 842, 500), (848, 286, 1053, 500), (1059, 286, 1229, 500), (1235, 286, 1405, 500)],
    [(706, 654, 863, 765), (869, 654, 1053, 765), (1059, 654, 1229, 765), (1235, 654, 1405, 765)],
]

def tach(o):
    x0, y0, x1, y1 = o
    g = src[y0:y1, x0:x1]
    a = np.clip(((255 - g) / 255).max(2) * 1.6, 0, 1)
    # Lõi lửa sáng gần trắng nhưng đậm màu: giữ đặc theo độ bão hoà (không thì lõi thành trong suốt, ám xanh trên nền tối)
    a = np.maximum(a, np.clip((g.max(2) - g.min(2) - 25) / 50, 0, 1))
    a[a < 0.06] = 0
    c = np.where(a[..., None] > 0, (g - (1 - a[..., None]) * 255) / np.maximum(a[..., None], 1e-3), 0)
    rgba = np.dstack([np.clip(c, 0, 255), a * 255]).astype(np.uint8)
    ys, xs = np.where(a > 0.15)
    return Image.fromarray(rgba).crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))

out = Image.new('RGBA', (F * 5, F * 4))
for k, o in enumerate(BOM):
    im = tach(o)
    tl = 120 / max(im.size)
    im = im.resize((round(im.width * tl), round(im.height * tl)), Image.LANCZOS)
    out.alpha_composite(im, (k * F + (F - im.width) // 2, (F - im.height) // 2))
for h, hang in enumerate(NO):
    anh = [tach(o) for o in hang]
    tl = min(190 / max(max(i.size) for i in anh), 1.5)
    for k, im in enumerate(anh):
        im = im.resize((max(1, round(im.width * tl)), max(1, round(im.height * tl))), Image.LANCZOS)
        out.alpha_composite(im, (k * F + (F - im.width) // 2, (h + 1) * F + (F - im.height) // 2))
out.save('web/public/assets/game/bom.png', optimize=True)
