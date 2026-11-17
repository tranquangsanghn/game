"""Cắt ảnh Thần điện (ảnh người dùng gửi) thành nền map: bỏ logo / khung chữ / NPC, trời xanh và đất cam thành trong suốt.

Dùng: python3 tools/tao-than-dien.py <anh_goc> <ra.png> <ra_vien.ts>
- Vá khung chữ và NPC bằng một mảnh khác của chính ảnh (dời theo bội số ô 16px hoặc lật gương), chọn mảnh có viền khớp nhất.
- Ghi đa giác viền (theo điểm ảnh, gốc ở góc trên trái phần map) ra file TS để logic biết chỗ đứng được.
"""
import sys
import numpy as np
from PIL import Image

goc = np.array(Image.open(sys.argv[1]).convert('RGB')).astype(np.int32)
X0, Y0, X1, Y1 = 16, 192, 736, 672  # phần map (720 x 480), bỏ logo phía trên
a = goc[Y0:Y1, X0:X1].copy()
H, W = a.shape[:2]

# Vùng cần vá (toạ độ ảnh gốc, x0, y0, x1, y1 không gồm mép phải / dưới)
# Bóng đổ dưới bậc thềm + khung chữ "Speak to Kami": thay cả dải bằng nền ô trơn (bóng không lặp nên không vá khớp được)
DAI = (280, 430, 472, 486)
a[DAI[1] - Y0:DAI[3] - Y0, DAI[0] - X0:DAI[2] - X0] = a[DAI[1] - Y0:DAI[3] - Y0, DAI[0] - X0 - 192:DAI[2] - X0 - 192]
# Khung chữ "Speak to Korrin" nằm đè hàng cây bậc thang: vá từng dải hẹp (trái → phải) để dời chéo theo bậc thang được
VA = [(x, 206, x + 16, 242) for x in range(106, 194, 16)] + [(202, 206, 278, 242)] + [
    (180, 244, 203, 274),  # Korin
    (341, 398, 363, 434),  # Dende
    (404, 402, 428, 434),  # Mr. Popo
]
VA = [(x0 - X0, y0 - Y0, x1 - X0, y1 - Y0) for x0, y0, x1, y1 in VA]
mask = np.zeros((H, W), bool)
for x0, y0, x1, y1 in VA:
    mask[y0:y1, x0:x1] = True


def lay(x0, y0, x1, y1, ung):
    """Toạ độ nguồn cho từng điểm của khung theo phương án `ung` = ('dich', dx, dy) | ('guong', c, dy)"""
    ys, xs = np.mgrid[y0:y1, x0:x1]
    if ung[0] == 'dich':
        return xs + ung[1], ys + ung[2]
    return 2 * ung[1] - xs, ys + ung[2]


VIEN = 3
for x0, y0, x1, y1 in VA:
    # Vòng viền quanh khung để so độ khớp
    bx0, by0, bx1, by1 = max(0, x0 - VIEN), max(0, y0 - VIEN), min(W, x1 + VIEN), min(H, y1 + VIEN)
    vien = np.zeros((H, W), bool)
    vien[by0:by1, bx0:bx1] = True
    vien[y0:y1, x0:x1] = False
    vien &= ~mask
    tot, chon = None, None
    ung_vien = [('dich', 16 * i, 16 * j) for i in range(-12, 13) for j in range(-6, 7) if i or j]
    ung_vien += [('guong', c / 2, 16 * j) for c in range(2 * 300, 2 * 480) for j in (-1, 0, 1)]
    for ung in ung_vien:
        sx, sy = lay(bx0, by0, bx1, by1, ung)
        if sx.min() < 0 or sy.min() < 0 or sx.max() >= W or sy.max() >= H:
            continue
        sx = np.round(sx).astype(int); sy = np.round(sy).astype(int)
        # Nguồn không được chạm vùng đang cần vá
        ix, iy = lay(x0, y0, x1, y1, ung)
        ix = np.round(ix).astype(int); iy = np.round(iy).astype(int)
        if mask[iy, ix].any():
            continue
        v = vien[by0:by1, bx0:bx1]
        d = ((a[sy, sx] - a[by0:by1, bx0:bx1]) ** 2).sum(2)[v].mean()
        if tot is None or d < tot:
            tot, chon = d, ung
    ix, iy = lay(x0, y0, x1, y1, chon)
    a[y0:y1, x0:x1] = a[np.round(iy).astype(int), np.round(ix).astype(int)]
    mask[y0:y1, x0:x1] = False
    print('vá', (x0 + X0, y0 + Y0), chon, round(tot, 1))

# Trời xanh (trên) và đất cam (dưới) ngoài mép thần điện thành trong suốt
r, g, b = a[..., 0], a[..., 1], a[..., 2]
troi = (b > 180) & (r < 120) & (g < 160)
dat = (r > 150) & (g > 60) & (g < 130) & (b < 60)
# Chỉ lấy vùng trời / đất nối liền mép ảnh (màu xanh trong thần điện giữ nguyên)
cho = troi | dat
ngoai = np.zeros((H, W), bool)
hang = [(y, x) for y in range(H) for x in (0, W - 1) if cho[y, x]] + [(y, x) for x in range(W) for y in (0, H - 1) if cho[y, x]]
for y, x in hang:
    ngoai[y, x] = True
while hang:
    y, x = hang.pop()
    for ny, nx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
        if 0 <= ny < H and 0 <= nx < W and cho[ny, nx] and not ngoai[ny, nx]:
            ngoai[ny, nx] = True
            hang.append((ny, nx))
alpha = np.where(ngoai, 0, 255).astype(np.uint8)
out = np.dstack([a.astype(np.uint8), alpha])
Image.fromarray(out, 'RGBA').save(sys.argv[2])

# Đa giác viền: mép thần điện là các bậc thang theo ô 16px ⇒ mỗi cột 16px lấy hàng trên cùng / dưới cùng có đất
O = 16
cot = W // O
tren, duoi = [], []
for i in range(cot):
    c = ~ngoai[:, i * O + O // 2]
    ys = np.where(c)[0]
    tren.append(int(ys.min()))
    duoi.append(int(ys.max()) + 1)
pts = []
for i in range(cot):
    pts += [(i * O, tren[i]), ((i + 1) * O, tren[i])]
for i in reversed(range(cot)):
    pts += [((i + 1) * O, duoi[i]), (i * O, duoi[i])]
# Bỏ điểm thẳng hàng
gon = []
for k, p in enumerate(pts):
    q, s = pts[k - 1], pts[(k + 1) % len(pts)]
    if (p[0] - q[0]) * (s[1] - p[1]) - (p[1] - q[1]) * (s[0] - p[0]) != 0:
        gon.append(p)
with open(sys.argv[3], 'w') as f:
    f.write('// Sinh bởi tools/tao-than-dien.py: viền thần điện (điểm ảnh của than_dien.png, gốc góc trên trái)\n')
    f.write(f'export const THAN_ANH_W = {W};\nexport const THAN_ANH_H = {H};\n')
    f.write('export const THAN_VIEN: [number, number][] = [\n')
    for k in range(0, len(gon), 8):
        f.write('  ' + ' '.join(f'[{x}, {y}],' for x, y in gon[k:k + 8]) + '\n')
    f.write('];\n')
print('đa giác', len(gon), 'điểm')

# Vật cản (nhân vật không đi xuyên): các ô 16px phần lớn là cỏ / cây (vườn cây, hàng cọ, cây góc) + điện thờ + chân các cột vòm
xanh = (a[..., 1] > a[..., 0] + 25) & (a[..., 1] > a[..., 2] + 25) & ~ngoai
o_chan = np.zeros((H // O, W // O), bool)
for j in range(H // O):
    for i in range(W // O):
        o_chan[j, i] = xanh[j * O:(j + 1) * O, i * O:(i + 1) * O].mean() > 0.3
CHAN_TAY = [
    (255, 0, 465, 100),   # các tháp giữa điện thờ
    (225, 100, 495, 226), # thân điện thờ, mái hồng, hai vườn cây trước điện
    (214, 56, 225, 104), (494, 56, 505, 104),   # cột vòm trên
    (183, 174, 195, 222), (526, 174, 538, 222), # cột vòm dưới
]
# Gộp ô thành hình chữ nhật: theo hàng (dải liền) rồi gộp dọc các dải trùng nhau
dai = {}
for j in range(H // O):
    i = 0
    while i < W // O:
        if not o_chan[j, i]:
            i += 1
            continue
        k = i
        while k < W // O and o_chan[j, k]:
            k += 1
        dai.setdefault((i, k), []).append(j)
        i = k
chan = []
for (i, k), js in dai.items():
    s = js[0]
    for t in range(1, len(js) + 1):
        if t == len(js) or js[t] != js[t - 1] + 1:
            chan.append((i * O, s * O, k * O, (js[t - 1] + 1) * O))
            if t < len(js):
                s = js[t]
chan = [c for c in chan if not any(c[0] >= m[0] and c[1] >= m[1] and c[2] <= m[2] and c[3] <= m[3] for m in CHAN_TAY)] + CHAN_TAY
with open(sys.argv[3], 'a') as f:
    f.write('/** Vật cản [x0, y0, x1, y1] (điểm ảnh): vườn cây, hàng cọ, điện thờ, chân cột vòm */\n')
    f.write('export const THAN_CHAN: [number, number, number, number][] = [\n')
    for k in range(0, len(chan), 6):
        f.write('  ' + ' '.join(f'[{x0}, {y0}, {x1}, {y1}],' for x0, y0, x1, y1 in chan[k:k + 6]) + '\n')
    f.write('];\n')
print('vật cản', len(chan))
if len(sys.argv) > 4:
    from PIL import ImageDraw
    xem = Image.fromarray(out, 'RGBA').convert('RGB')
    d = ImageDraw.Draw(xem)
    for x0, y0, x1, y1 in chan:
        d.rectangle((x0, y0, x1 - 1, y1 - 1), outline=(255, 0, 0))
    xem.resize((W * 2, H * 2), Image.NEAREST).save(sys.argv[4])
