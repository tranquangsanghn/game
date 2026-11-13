"""Tách animation vận nội công (hào quang) + bắn chưởng của Cell từ ảnh sprite Dragon Ball Z: Legendary Super Warriors.
Dùng: python3 tools/tao-atlas-cell-tiec.py <anh-goc.png>
Ra: web/public/assets/game/cell_tiec.png (5 cấp × 5 khung 80×64: 0–2 hào quang, 3 gồng, 4 phóng chưởng; chân ở y=59, giữa x=40)
    web/public/assets/game/cell_chuong.png (chùm kamehameha xanh nhỏ: quả gốc + thân + đầu)"""
import sys
import numpy as np
from PIL import Image

src = np.array(Image.open(sys.argv[1]).convert('RGBA'))
white = (src[:, :, :3] >= 253).all(axis=2)
H, W = white.shape
bg = np.zeros_like(white)
st = [(y, x) for y in (0, H - 1) for x in range(W)] + [(y, x) for x in (0, W - 1) for y in range(H)]
while st:
    y, x = st.pop()
    if 0 <= y < H and 0 <= x < W and white[y, x] and not bg[y, x]:
        bg[y, x] = True
        st += [(y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)]
src[:, :, 3] = np.where(bg, 0, 255)

# Mỗi cấp: (hàng hào quang y0..y1, x của 3 khung hào quang, hàng chiêu y0..y1, x gồng, x phóng chưởng)
# cấp 0 Junior, 1 Imperfect 1, 2 Imperfect 2, 3 Perfect (cấp 4 = Perfect nhuộm đỏ)
CAP = [
    ((1026, 1096), [(235, 298), (305, 368), (375, 438)], (1196, 1238), (336, 360), (371, 510)),
    ((90, 152), [(248, 311), (318, 381), (388, 451)], (268, 316), (335, 364), (376, 520)),
    ((410, 470), [(248, 311), (318, 381), (388, 451)], (588, 634), (335, 363), (376, 520)),
    ((728, 789), [(248, 311), (318, 381), (388, 451)], (908, 953), (338, 366), (376, 520)),
]

def cat(y0, y1, x0, x1):
    sub = src[y0:y1 + 1, x0:x1 + 1].copy()
    ys, xs = np.nonzero(sub[:, :, 3])
    return sub[ys.min():ys.max() + 1, xs.min():xs.max() + 1]

def dat(atlas, row, col, img, canGiua=True):
    h, w = img.shape[:2]
    x = 40 - w // 2
    y = 60 - h  # chân ở hàng 59
    tile = atlas[row * 64:(row + 1) * 64, col * 80:(col + 1) * 80]
    for j in range(h):
        for i in range(w):
            if img[j, i, 3] and 0 <= y + j < 64 and 0 <= x + i < 80:
                tile[y + j, x + i] = img[j, i]

atlas = np.zeros((5 * 64, 5 * 80, 4), np.uint8)
beam = None
for r, (hy, hx, cy, gx, px) in enumerate(CAP):
    for c, (x0, x1) in enumerate(hx):
        dat(atlas, r, c, cat(hy[0], hy[1], x0, x1))
    dat(atlas, r, 3, cat(cy[0], cy[1], gx[0], gx[1] + 2))
    full = cat(cy[0], cy[1], px[0], px[1])
    # Tư thế phóng là phần đầu (33 px; Junior vào sớm hơn 5 px), phần sau là chùm kamehameha
    cut = 29 if r == 0 else 33
    dat(atlas, r, 4, full[:, :cut])
    if r == 3:
        beam = full[:, cut:]
        print('pose w', cut, 'beam', beam.shape)

# Cấp 4: Perfect nhuộm đỏ (phần xanh lá → đỏ)
for c in range(5):
    t = atlas[3 * 64:4 * 64, c * 80:(c + 1) * 80].copy()
    g = t[:, :, 1].astype(int)
    m = (t[:, :, 3] > 0) & (g > t[:, :, 0] + 40) & (g > t[:, :, 2] + 40)
    t[m, 0] = np.clip(g[m] * 1.147, 0, 255).astype(np.uint8)
    t[m, 1] = 0
    t[m, 2] = 0
    atlas[4 * 64:5 * 64, c * 80:(c + 1) * 80] = t

Image.fromarray(atlas).save('web/public/assets/game/cell_tiec.png')
Image.fromarray(beam).save('web/public/assets/game/cell_chuong.png')
