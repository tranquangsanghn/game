"""(Bản 2: thêm biến hình, phóng chưởng vàng / tím, hào quang)
Tách animation vận nội công (hào quang) + bắn chưởng của Cell từ ảnh sprite Dragon Ball Z: Legendary Super Warriors.
Dùng: python3 tools/tao-atlas-cell-tiec.py <anh-goc.png>
Ra: web/public/assets/game/cell_tiec.png (5 cấp × 5 khung 80×64: 0–2 hào quang, 3 gồng, 4 phóng chưởng; chân ở y=59, giữa x=40)
    cell_chuong.png / cell_chuong_vang.png / cell_chuong_tim.png (3 loại chưởng: xanh, vàng, tím; quả gốc + thân + đầu)"""
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

# Mỗi cấp: hàng hào quang (y0, y1), x 3 khung hào quang, hàng chiêu (y0, y1), x gồng, x phóng xanh, x phóng vàng, x phóng tím,
# biến hình (x, y0, y1), gió ngang (x, y0, y1), gió dọc (x, y0, y1)
# cấp 0 Junior, 1 Imperfect 1, 2 Imperfect 2, 3 Perfect (cấp 4 = Perfect nhuộm đỏ)
CAP = [
    ((1026, 1096), [(235, 298), (305, 368), (375, 438)], (1196, 1238), (336, 360), (371, 510), (2, 99), (121, 274), (41, 1050, 1100), (152, 1060, 1094), (202, 1052, 1096)),
    ((90, 152), [(248, 311), (318, 381), (388, 451)], (268, 316), (335, 364), (376, 520), (2, 99), (119, 274), (42, 100, 152), (165, 110, 146), (215, 108, 152)),
    ((410, 470), [(248, 311), (318, 381), (388, 451)], (588, 634), (335, 363), (376, 520), (2, 99), (119, 274), (42, 420, 470), (165, 428, 464), (215, 426, 470)),
    ((728, 789), [(248, 311), (318, 381), (388, 451)], (908, 953), (338, 366), (376, 520), (2, 99), (119, 274), (42, 740, 790), (165, 748, 782), (215, 745, 790)),
]
# Độ rộng tư thế (px) trước khi tới quả gốc của chùm: vàng, tím
CUT_VANG, CUT_TIM = 34, 41

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

COT = 10  # 0–2 hào quang · 3 gồng · 4 phóng xanh · 5 phóng vàng · 6 phóng tím · 7 biến hình · 8 gió ngang · 9 gió dọc
atlas = np.zeros((5 * 64, COT * 80, 4), np.uint8)
beams = {}
for r, (hy, hx, cy, gx, px, vx, tx, bh, gn, gd) in enumerate(CAP):
    for c, (x0, x1) in enumerate(hx):
        dat(atlas, r, c, cat(hy[0], hy[1], x0, x1))
    dat(atlas, r, 3, cat(cy[0], cy[1], gx[0], gx[1] + 2))
    full = cat(cy[0], cy[1], px[0], px[1])
    cut = 29 if r == 0 else 33  # tư thế phóng xanh (Junior vào sớm hơn 5 px); phần sau là chùm kamehameha
    dat(atlas, r, 4, full[:, :cut])
    fv = cat(cy[0], cy[1], vx[0], vx[1])
    dat(atlas, r, 5, fv[:, :CUT_VANG])
    ft = cat(cy[0], cy[1], tx[0], tx[1])
    dat(atlas, r, 6, ft[:, :CUT_TIM])
    dat(atlas, r, 7, cat(bh[1], bh[2], bh[0], bh[0] + 31))
    dat(atlas, r, 8, cat(gn[1], gn[2], gn[0], gn[0] + 39))
    dat(atlas, r, 9, cat(gd[1], gd[2], gd[0], gd[0] + 23))
    if r == 3:
        beams['chuong'] = full[:, cut:]
        beams['chuong_vang'] = fv[:, CUT_VANG:]
        beams['chuong_tim'] = ft[:, CUT_TIM:]

# Cấp 4: Perfect nhuộm đỏ (phần xanh lá → đỏ)
for c in range(COT):
    t = atlas[3 * 64:4 * 64, c * 80:(c + 1) * 80].copy()
    g = t[:, :, 1].astype(int)
    m = (t[:, :, 3] > 0) & (g > t[:, :, 0] + 40) & (g > t[:, :, 2] + 40)
    t[m, 0] = np.clip(g[m] * 1.147, 0, 255).astype(np.uint8)
    t[m, 1] = 0
    t[m, 2] = 0
    atlas[4 * 64:5 * 64, c * 80:(c + 1) * 80] = t

Image.fromarray(atlas).save('web/public/assets/game/cell_tiec.png')
for ten, b in beams.items():
    Image.fromarray(b).save(f'web/public/assets/game/cell_{ten}.png')
    print(ten, b.shape)
