"""Dựng atlas phi thuyền (đậu cạnh máy bay trong vườn gà, chở 2 nhân vật tới núi đá) từ sheet người dùng gửi (1408×768, pixel art trên nền trắng).
Dùng: python3 tools/tao-atlas-phi-thuyen.py <anh-goc>
Ra: web/public/assets/game/phi_thuyen.png: 6 cột × 2 hàng khung 300×240, neo giữa đáy (150, 230); khung bay ngang (7) đặt tâm thân ở (150, 150).
    Khung: 0 đậu · 1 cửa hé sáng · 2 cửa mở · 3 cửa mở (thang) · 4 cất cánh bụi · 5 phụt lửa · 6 nhấc lên · 7 bay ngang (quay phải)
           8 hạ xuống · 9 chạm đất bụi · 10 đất đá văng · 11 khói tan
Tách nền: điểm gần trắng nối với mép khung là nền (nền loang từ mép, thân trắng có viền tối nên giữ nguyên); dòng chữ trên sheet nằm ngoài các ô cắt."""
import sys
from collections import deque
import numpy as np
from PIL import Image

src = np.array(Image.open(sys.argv[1]).convert('RGB')).astype(int)

R1, R2 = (72, 272), (330, 512)
# (x0, x1, hàng, tâm thân x)
KHUNG = [
    (38, 199, R1, 118), (200, 362, R1, 283), (365, 552, R1, 445), (558, 740, R1, 628),
    (745, 892, R1, 820), (898, 1046, R1, 965), (1047, 1162, R1, 1105), (1163, 1380, R1, 1270),
    (105, 265, R2, 195), (380, 645, R2, 540), (728, 1012, R2, 880), (1100, 1350, R2, 1240),
]
FW, FH, NX, NY, COT = 300, 240, 150, 230, 6
out = Image.new('RGBA', (FW * COT, FH * 2), (0, 0, 0, 0))

for i, (x0, x1, (y0, y1), tx) in enumerate(KHUNG):
    g = src[y0:y1, x0:x1]
    h, w = g.shape[:2]
    trang = (765 - g.sum(2)) < 45
    nen = np.zeros((h, w), bool)
    q = deque()
    for y in range(h):
        for x in (0, w - 1):
            if trang[y, x] and not nen[y, x]: nen[y, x] = True; q.append((y, x))
    for x in range(w):
        for y in (0, h - 1):
            if trang[y, x] and not nen[y, x]: nen[y, x] = True; q.append((y, x))
    while q:
        y, x = q.popleft()
        for yy, xx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
            if 0 <= yy < h and 0 <= xx < w and trang[yy, xx] and not nen[yy, xx]:
                nen[yy, xx] = True; q.append((yy, xx))
    rgba = np.zeros((h, w, 4), np.uint8)
    rgba[..., :3] = g
    rgba[..., 3] = np.where(nen, 0, 255)
    ys = np.where((~nen).any(1))[0]
    im = Image.fromarray(rgba)
    if i == 7:
        oy = 150 - (ys[0] + ys[-1]) // 2
    else:
        oy = NY - ys[-1]
    ox = NX - (tx - x0)
    cx, cy = (i % COT) * FW, (i // COT) * FH
    tam = Image.new('RGBA', (FW, FH), (0, 0, 0, 0))
    tam.paste(im, (ox, oy), im)
    out.alpha_composite(tam, (cx, cy))

out.save('web/public/assets/game/phi_thuyen.png', optimize=True)
