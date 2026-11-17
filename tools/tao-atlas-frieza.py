"""Dựng atlas Frieza (quái thần điện) từ sheet người dùng gửi (tools/frieza-goc.png, 950×1096, Dragon Ball Z Super Butouden, nền xanh xám (84,109,142)).
Dùng: python3 tools/tao-atlas-frieza.py [anh-goc] [anh-xem-thu.png]
Ra: web/public/assets/game/frieza_atlas.png: 6 khung 80×84 ngang (điểm ảnh nguồn, không phóng: game vẽ không làm mịn),
    chân ở giữa đáy (neo 40, 82), quay mặt PHẢI như sheet gốc.
    Khung: 0–1 đứng thở · 2–5 đi bộ.
Căn giữa theo các điểm ảnh tím (đầu, vai, ngực) để thân không giật khi đuôi vẫy; chân căn theo đáy khung trong sheet."""
import sys
import numpy as np
from PIL import Image

goc = sys.argv[1] if len(sys.argv) > 1 else 'tools/frieza-goc.png'
A = np.array(Image.open(goc).convert('RGB')).astype(int)
NEN = np.array([84, 109, 142])

# (x0, x1, đáy) theo sheet: hàng 1 đứng (đáy 86), hàng 2 bốn khung đi (đáy 190)
KHUNG = [(15, 70, 87), (89, 150, 87), (92, 148, 191), (159, 224, 191), (237, 295, 191), (308, 373, 191)]
FW, FH, NX, NY = 80, 84, 40, 82

out = np.zeros((FH, FW * len(KHUNG), 4), np.uint8)
for i, (x0, x1, day) in enumerate(KHUNG):
    y0 = day - 80
    g = A[y0:day, x0:x1]
    vat = np.abs(g - NEN).sum(2) > 30
    vang = (g[:, :, 0] > 200) & (g[:, :, 1] > 180) & (g[:, :, 2] < 90)  # vạch vàng ngăn khung
    vat &= ~vang
    tim = (g[:, :, 0] > 110) & (g[:, :, 2] > 150) & (g[:, :, 1] < 110) & vat
    cx = int(round(np.where(tim)[1].mean())) if tim.any() else (x1 - x0) // 2
    h, w = g.shape[:2]
    dx = NX - cx
    dy = NY - h
    for yy in range(h):
        for xx in range(w):
            if not vat[yy, xx]:
                continue
            X, Y = i * FW + xx + dx, yy + dy
            if 0 <= X - i * FW < FW and 0 <= Y < FH:
                out[Y, X, :3] = g[yy, xx]
                out[Y, X, 3] = 255

Image.fromarray(out).save('web/public/assets/game/frieza_atlas.png')
if len(sys.argv) > 2:
    xem = Image.new('RGBA', (FW * len(KHUNG), FH), (60, 60, 60, 255))
    xem.alpha_composite(Image.fromarray(out))
    xem.resize((xem.width * 4, xem.height * 4), Image.NEAREST).save(sys.argv[2])
print('xong', out.shape)
