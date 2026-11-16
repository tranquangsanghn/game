"""Dựng ảnh map núi đá từ ảnh người dùng gửi (bảng tile sa mạc đá cam, 1408×768):
- dat.png: mặt đất đá lặp: nhiễu tuần hoàn tô bằng bảng màu của ô đất cam trong ảnh (lặp liền, không lộ hoa văn lật gương)
- vach.png: vách núi lặp (sườn mesa sọc dọc), ghép bản lật gương để lặp liền cả hai chiều
- da.png: atlas tảng đá (tách nền trắng bằng loang từ mép), in ra bảng toạ độ để dán vào DA_NUI (ve-canvas.ts)
Cách chạy: python3 -I tools/tao-atlas-nui-da.py <ảnh gốc.jpg> web/public/assets/game/nui
"""
import sys
from collections import deque
from PIL import Image, ImageOps

SRC, OUT = sys.argv[1], sys.argv[2]
im = Image.open(SRC).convert('RGB')


def guong(o: Image.Image) -> Image.Image:
    """Ghép 2×2 (gốc, lật ngang, lật dọc, lật cả hai): lặp liền không lộ đường nối"""
    w, h = o.size
    kq = Image.new('RGB', (w * 2, h * 2))
    kq.paste(o, (0, 0))
    kq.paste(ImageOps.mirror(o), (w, 0))
    kq.paste(ImageOps.flip(o), (0, h))
    kq.paste(ImageOps.flip(ImageOps.mirror(o)), (w, h))
    return kq


# Mặt đất: nhiễu tuần hoàn (lặp liền, không lật gương) lượng tử thành vài mảng màu lấy từ ô đất cam trong ảnh, kiểu điểm ảnh
import math, random
random.seed(7)
N, O = 64, 8  # ô 64×64 điểm ảnh, lưới nhiễu 8×8 (tuần hoàn)


def luoi(n):
    return [[random.random() for _ in range(n)] for _ in range(n)]


def nhieu(g, n, x, y):
    fx, fy = x * n / N, y * n / N
    i, j = int(fx), int(fy)
    tx, ty = fx - i, fy - j
    tx, ty = tx * tx * (3 - 2 * tx), ty * ty * (3 - 2 * ty)
    a, b = g[j % n][i % n], g[j % n][(i + 1) % n]
    c, d = g[(j + 1) % n][i % n], g[(j + 1) % n][(i + 1) % n]
    return (a + (b - a) * tx) * (1 - ty) + (c + (d - c) * tx) * ty


g1, g2 = luoi(O), luoi(O * 2)
MAU = [(196, 104, 42), (214, 124, 52), (230, 145, 64), (238, 160, 78)]
dat = Image.new('RGB', (N, N))
px = dat.load()
for y in range(N):
    for x in range(N):
        v = nhieu(g1, O, x, y) * 0.65 + nhieu(g2, O * 2, x, y) * 0.35
        px[x, y] = MAU[min(3, max(0, int((v - 0.25) * 8)))]
# Vài viên sỏi nhỏ (bóng tối dưới, đỉnh sáng)
for _ in range(10):
    x, y = random.randrange(N), random.randrange(N)
    px[x, y] = (150, 74, 34)
    px[(x + 1) % N, y] = (150, 74, 34)
    px[x, (y - 1) % N] = (246, 180, 100)
dat.resize((N * 2, N * 2), Image.NEAREST).save(f'{OUT}/dat.png')

# Vách: sườn mesa thứ nhất (sọc dọc nâu tím), bỏ mép trên / dưới để lật gương không lộ vạch ngang
vach = im.crop((75, 290, 190, 318)).resize((230, 112), Image.NEAREST)
guong(vach).save(f'{OUT}/vach.png')


def tach(hop):
    """Cắt một tảng đá, nền trắng (gần trắng, loang từ mép) thành trong suốt, cắt sát"""
    o = im.crop(hop).convert('RGBA')
    w, h = o.size
    px = o.load()
    trang = lambda p: min(p[:3]) > 200 and max(p[:3]) - min(p[:3]) < 40
    q = deque((x, y) for x in range(w) for y in (0, h - 1))
    q.extend((x, y) for y in range(h) for x in (0, w - 1))
    seen = set()
    while q:
        x, y = q.popleft()
        if (x, y) in seen or not (0 <= x < w and 0 <= y < h):
            continue
        seen.add((x, y))
        if not trang(px[x, y]):
            continue
        px[x, y] = (0, 0, 0, 0)
        q.extend(((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)))
    return o.crop(o.getbbox())


# Tảng đá: 2 khối to, 4 vừa, 2 nhỏ (toạ độ trong ảnh gốc)
HOP = [(425, 380, 552, 502), (563, 380, 690, 502), (343, 438, 415, 500), (285, 448, 342, 500),
       (348, 385, 397, 435), (218, 395, 268, 435), (220, 452, 270, 500), (160, 470, 215, 500)]
anh = [tach(h) for h in HOP]
RONG, PAD = 512, 2
x = y = hang = 0
vt = []
for a in anh:
    if x + a.width > RONG:
        x, y, hang = 0, y + hang + PAD, 0
    vt.append((x, y, a.width, a.height))
    x += a.width + PAD
    hang = max(hang, a.height)
atlas = Image.new('RGBA', (RONG, y + hang))
for a, (ax, ay, _, _) in zip(anh, vt):
    atlas.paste(a, (ax, ay))
atlas.save(f'{OUT}/da.png')
for v in vt:
    print('  { sx: %d, sy: %d, w: %d, h: %d },' % v)
