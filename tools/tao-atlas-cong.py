"""Dựng atlas cổng dịch chuyển (đặt giữa đảo Cell 10 con) từ ảnh người dùng gửi (1152×928, 4 khung 2×2 trên nền trắng).
Dùng: python3 tools/tao-atlas-cong.py <anh-goc>
Ra: web/public/assets/game/cong_dich_chuyen.png: 4 cột × 1 hàng khung 480×320, neo giữa đáy (240, 310).
Tách nền: nền trắng loang từ mép khung; phần vật (đá + xoáy) là vùng không phải nền, lấp lỗ, giữ đặc;
quầng mờ quanh xoáy (xám nhạt sát nền) đổi sang trong suốt bằng color-to-alpha (trắng → trong suốt) để thành bóng tối mờ."""
import sys
from collections import deque
import numpy as np
from PIL import Image

src = np.array(Image.open(sys.argv[1]).convert('RGB')).astype(float)
FW, FH = 480, 320
# góc trên trái mỗi khung (vật nằm x 70..543 / 610..1082, y 96..399 / 515..815)
GOC = [(66, 92), (606, 92), (66, 509), (606, 509)]
out = np.zeros((FH, FW * 4, 4), np.uint8)

def loang(mask_di):
    h, w = mask_di.shape
    nen = np.zeros((h, w), bool); q = deque()
    for y in range(h):
        for x in (0, w - 1):
            if mask_di[y, x] and not nen[y, x]: nen[y, x] = True; q.append((y, x))
    for x in range(w):
        for y in (0, h - 1):
            if mask_di[y, x] and not nen[y, x]: nen[y, x] = True; q.append((y, x))
    while q:
        y, x = q.popleft()
        for yy, xx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
            if 0 <= yy < h and 0 <= xx < w and mask_di[yy, xx] and not nen[yy, xx]:
                nen[yy, xx] = True; q.append((yy, xx))
    return nen

for i, (x0, y0) in enumerate(GOC):
    g = src[y0:y0 + FH, x0:x0 + FW]
    mn = g.min(2)
    # vật đặc: điểm đậm (min < 150) + mọi thứ bị nó bao kín
    dac = ~loang(mn >= 150)
    # color-to-alpha với nền trắng
    a = ((255 - g) / 255).max(2)
    a = np.clip(a, 0, 1)
    a[dac] = 1
    a[mn > 248] = 0
    am = np.maximum(a, 1e-6)[..., None]
    col = np.clip((g - 255 * (1 - am)) / am, 0, 255)
    col[dac] = g[dac]
    out[:, i * FW:(i + 1) * FW, :3] = col.astype(np.uint8)
    out[:, i * FW:(i + 1) * FW, 3] = (a * 255).astype(np.uint8)

Image.fromarray(out, 'RGBA').save('web/public/assets/game/cong_dich_chuyen.png', optimize=True)
print('ok')
