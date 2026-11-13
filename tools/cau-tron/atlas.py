import sys
from PIL import Image
import numpy as np
t = Image.open(sys.argv[1]); out = sys.argv[2]
a = np.array(t)[:, :, 3]
H, W = a.shape
CW, CH, NEO_Y = 240, 400, 350
at = Image.new('RGBA', (CW * 6, CH * 2), (0, 0, 0, 0))
for r in range(2):
    for c in range(6):
        x0 = round(c * W / 6); x1 = round((c + 1) * W / 6); y0 = r * H // 2; y1 = (r + 1) * H // 2
        s = a[y0:y1, x0:x1]
        ys, xs = np.nonzero(s)
        day = ys.max()
        # tâm quả cầu: dải ngang trong 70px dưới cùng
        m = ys > day - 70
        cx = (xs[m].min() + xs[m].max()) / 2
        o = t.crop((x0, y0, x1, y1))
        dx = round(CW / 2 - cx); dy = NEO_Y - day
        at.paste(o, (c * CW + dx, r * CH + dy), o)
        print(r, c, dx, dy)
at.save(out, optimize=True)
