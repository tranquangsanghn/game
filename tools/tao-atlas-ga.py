"""Tách sprite sheet gà gốc (tools/ga-goc.png, 4x4 khung) và tô thành các atlas:
trắng (nguyên bản), đỏ, đen, tướng (3 màu đỏ-trắng-đen, độ phân giải cao).
Chạy: python3 tools/tao-atlas-ga.py   (cần Pillow + numpy)
In ra thông số khung để điền vào ga-du-lieu.ts."""
import os
import numpy as np
from PIL import Image

GOC = os.path.join(os.path.dirname(__file__), 'ga-goc.png')
RA = os.path.join(os.path.dirname(__file__), '..', 'public', 'assets', 'game')
COT = 4
# Khung trong ảnh gốc: các cột / hàng nằm cách nhau bởi khoảng trống
X = [(0, 88), (95, 185), (192, 281), (290, 377)]
Y = [(0, 86), (90, 176), (180, 266), (271, 356)]

src = np.array(Image.open(GOC).convert('RGBA'))


def cat_khung():
    ds = []
    for (y0, y1) in Y:
        for (x0, x1) in X:
            ds.append(src[y0:y1, x0:x1].copy())
    return ds


def diem_neo(f):
    """Trọng tâm mào đỏ (đỏ thuần, nửa trên) làm mốc căn các khung với nhau"""
    r, g, b, a = [f[..., i].astype(int) for i in range(4)]
    m = (a > 200) & (r > 220) & (g < 60) & (b < 60)
    m[f.shape[0] * 2 // 3:] = False
    ys, xs = np.nonzero(m)
    return xs.mean(), ys.mean()


khung = cat_khung()
neo = [diem_neo(f) for f in khung]
# Ô chung: căn mào đỏ về cùng một chỗ, ô đủ chứa mọi khung
trai = max(n[0] for n in neo)
tren = max(n[1] for n in neo)
rong = int(np.ceil(max(n[0] + (khung[i].shape[1] - n[0]) for i, n in enumerate(neo)) + trai - min(n[0] for n in neo)))
rong = int(np.ceil(max(trai - n[0] + f.shape[1] for n, f in zip(neo, khung)))) + 2
cao = int(np.ceil(max(tren - n[1] + f.shape[0] for n, f in zip(neo, khung)))) + 2
ox = [int(round(trai - n[0])) for n in neo]
oy = [int(round(tren - n[1])) for n in neo]


def ghep(frames):
    sheet = np.zeros((cao * 4, rong * COT, 4), np.uint8)
    for i, f in enumerate(frames):
        cy, cx = divmod(i, COT)
        h, w = f.shape[:2]
        sheet[cy * cao + oy[i]: cy * cao + oy[i] + h, cx * rong + ox[i]: cx * rong + ox[i] + w] = f
    return sheet


def hsv_nhanh(rgb):
    return rgb


def la_long(f):
    """Pixel lông: kem (R>=G>=B, B thấp hơn R rõ rệt), không phải chân/mỏ (vàng đậm) hay mào (đỏ)."""
    r, g, b = [f[..., i].astype(float) for i in range(3)]
    a = f[..., 3] > 0
    kem = (r - b > 14) & (g - b > 8) & (r - g < 22) & (r > 150)
    # chân/mỏ vàng đậm: B rất thấp
    vang = (b < 150) & (r > 200) & (g > 150)
    return a & kem & ~vang


def to_mau(f, goc, sang=None, vung=None):
    """Tô lông về màu `goc` (RGB) giữ nguyên sắc độ sáng/tối. vung: mảng chỉ số màu theo pixel (tuỳ chọn)."""
    out = f.copy().astype(float)
    r = f[..., 0].astype(float)
    mask = la_long(f)
    v = (r / 255.0)[..., None]  # 1.0 ở màu lông gốc, tối hơn ở vùng bóng
    if vung is None:
        base = np.array(goc, float)[None, None, :]
    else:
        base = np.array([goc[k] for k in range(len(goc))], float)[vung]
    mau = base * v
    if sang is not None:
        # vùng sáng nhất (v>0.97) pha thêm sắc sáng để lông đen/đỏ không bẹt
        t = np.clip((v - 0.9) / 0.1, 0, 1)
        mau = mau * (1 - t) + np.array(sang, float)[None, None, :] * t
    out[..., :3] = np.where(mask[..., None], mau, out[..., :3])
    return np.clip(out, 0, 255).astype(np.uint8)


def luu(ten, frames, he_so):
    sheet = ghep(frames)
    im = Image.fromarray(sheet, 'RGBA')
    im = im.resize((im.width * he_so, im.height * he_so), Image.LANCZOS)
    im.save(os.path.join(RA, ten), optimize=True)


def vung_tuong(f, i):
    """Gà tướng: đầu trắng, cánh đỏ, thân đen (toạ độ tính từ mào đỏ của từng khung)."""
    h, w = f.shape[:2]
    cxx, cyy = neo[i]
    yy, xx = np.mgrid[0:h, 0:w]
    dx = xx - cxx
    dy = yy - cyy
    dau = (dy < 20 + 0.35 * (dx + 14)) & (dx > -16)
    canh = (dx < -10) & (dy < 24) & ~dau
    k = np.full((h, w), 2, int)  # mặc định thân đen
    k[canh] = 1
    k[dau] = 0
    return k


TRANG = (255, 246, 213)
DO = (206, 48, 36)
DEN = (64, 64, 78)

trang = [f for f in khung]
do = [to_mau(f, DO) for f in khung]
den = [to_mau(f, DEN) for f in khung]
tuong = []
for i, f in enumerate(khung):
    k = vung_tuong(f, i)
    # k: 0 trắng, 1 đỏ, 2 đen
    ban = to_mau(f, (TRANG, DO, DEN), vung=k)
    tuong.append(ban)

luu('ga_trang.png', trang, 2)
luu('ga_do.png', do, 2)
luu('ga_den.png', den, 2)
luu('ga_tuong.png', tuong, 4)
print('o', rong, cao, 'neo x', trai, 'y (chân thấp nhất)', max(oy[i] + khung[i].shape[0] for i in range(16)))
print('mao', trai, tren)
