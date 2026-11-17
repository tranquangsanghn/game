"""Dựng atlas Super Bư (dạng hợp thể của Mabu + Zinbu) từ sheet người dùng gửi.
Dùng: python3 tools/tao-atlas-super-buu.py [sheet-goc] [anh-ma-goc]   (cần Pillow + numpy + scipy)
Vào:  tools/super-buu-goc.webp (765×1024, nền trắng, lưới 4 cột × 6 hàng, quay mặt PHẢI)
      tools/super-buu-ma-goc.jpg (con ma Bư nền trắng, dùng làm đạn của chiêu Bóng ma)
Ra:   web/public/assets/game/super_buu_atlas.png: 25 khung, 5 cột; khung PNG gấp 2 khung logic (in ra cuối script).
        0–23 theo thứ tự sheet: 0 đứng · 1–2 đấm · 3–4 đứng · 5 đá · 6 đá (quay trái) · 7 đứng · 8–11 lướt (bay)
        12–15 bắn chưởng · 16–19 gọi bóng ma · 20–23 ăn kẹo; 24 = khung 6 lật gương (đá quay phải).
        Mọi khung căn theo chân (trung bình điểm ảnh ở dải đáy) và đáy, nên đổi khung không giật.
      web/public/assets/game/super_buu_ma.png: con ma, cao MA_CAO điểm ảnh, quay mặt người xem.
Tách nền: điểm ảnh gần trắng nối với mép ảnh là nền (mở hình thái học để không lọt vào quần trắng qua khe nét viền),
khe kín trắng tinh giữa tay và thân cũng là nền (trừ hàng bắn chưởng: lõi quả cầu trắng)."""
import sys
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

SHEET = sys.argv[1] if len(sys.argv) > 1 else 'tools/super-buu-goc.webp'
MA = sys.argv[2] if len(sys.argv) > 2 else 'tools/super-buu-ma-goc.jpg'
RA = 'web/public/assets/game/super_buu_atlas.png'
RA_MA = 'web/public/assets/game/super_buu_ma.png'
HANG, COT_SHEET, COT = 6, 4, 5
MA_CAO = 256


def tron(r):
    y, x = np.ogrid[-r:r + 1, -r:r + 1]
    return x * x + y * y <= r * r


def tach_nen(a, nen, r, ho=None):
    """Trả về ảnh RGBA: nền = vùng `nen` nối với mép ảnh (+ khe kín `ho` đủ to)."""
    loi = ndi.binary_opening(nen, tron(r)) if r else nen
    nhan, _ = ndi.label(loi)
    mep = set(np.unique(np.concatenate([nhan[0], nhan[-1], nhan[:, 0], nhan[:, -1]]))) - {0}
    bg = np.isin(nhan, list(mep))
    if r:
        bg = ndi.binary_dilation(bg, tron(r + 1)) & nen
    if ho is not None:
        hn, so = ndi.label(ho & ~bg)
        co = ndi.sum(np.ones_like(hn), hn, range(so + 1))
        bg |= np.isin(hn, [i for i in range(1, so + 1) if co[i] > 150])
    alpha = np.where(bg, 0, 255).astype(np.uint8)
    alpha[~bg & ~ndi.binary_erosion(~bg)] = 170  # viền mềm 1 điểm ảnh
    return np.dstack([a.astype(np.uint8), alpha])


def cat(mask, n, size, lan=50):
    """Đường cắt giữa các ô: chỗ ít điểm ảnh nhất gần đường chia đều (±lan; ±25 thì hàng 2 bị cắt ngang giày khung 4, 7)."""
    res = [0]
    for k in range(1, n):
        c = size * k // n
        res.append(c - lan + int(np.argmin(mask[c - lan:c + lan])))
    return res + [size]


a = np.array(Image.open(SHEET).convert('RGB')).astype(int)
nen = (a.min(2) > 236) & (np.ptp(a, 2) < 14)
ho = (a.min(2) >= 244) & (np.ptp(a, 2) < 12)
co_ho = tach_nen(a, nen, 1)
m = co_ho[..., 3] > 0
H, W = m.shape
ys = cat(m.sum(1), HANG, H)
khung = []
for r in range(HANG):
    xs = cat(m[ys[r]:ys[r + 1]].sum(0), COT_SHEET, W, 25)
    for c in range(COT_SHEET):
        o = co_ho[ys[r]:ys[r + 1], xs[c]:xs[c + 1]].copy()
        # Khe kín trắng (giữa râu và lưng, tay và thân) là nền; hàng bắn chưởng thì chỉ nửa trái (lõi quả cầu ở bên phải)
        hk, so = ndi.label(ho[ys[r]:ys[r + 1], xs[c]:xs[c + 1]] & (o[..., 3] > 0))
        for k, (sy, sx) in enumerate(ndi.find_objects(hk), 1):
            co = (hk[sy, sx] == k).sum()
            if co > 120 and (r != 3 or sx.stop < o.shape[1] * 0.45):
                o[hk == k, 3] = 0
        # Bỏ mẩu của ô bên cạnh lọt vào (chạm mép trên / dưới ô, nhỏ)
        nh, so = ndi.label(o[..., 3] > 0)
        co = ndi.sum(np.ones_like(nh), nh, range(so + 1))
        to = co[1:].max()
        for k in range(1, so + 1):
            yy = np.where(nh == k)[0]
            if co[k] < 20 or ((yy.min() == 0 or yy.max() == o.shape[0] - 1) and co[k] < 0.15 * to):
                o[nh == k, 3] = 0
        im = Image.fromarray(o, 'RGBA')
        khung.append(im.crop(im.getbbox()))
khung.append(khung[6].transpose(Image.FLIP_LEFT_RIGHT))

# Chân: trung bình x của điểm ảnh đặc ở dải 12% đáy khung
chan = []
for im in khung:
    al = np.array(im)[..., 3] > 128
    day = al[int(al.shape[0] * 0.88):]
    chan.append(int(round(np.where(day)[1].mean())))
trai = max(cx for cx in chan) + 4
phai = max(im.width - cx for im, cx in zip(khung, chan)) + 4
cao = max(im.height for im in khung) + 4
FW, FH = trai + phai, cao
FW += FW % 2
FH += FH % 2
NX, NY = trai, FH - 2
dong = (len(khung) + COT - 1) // COT
atlas = Image.new('RGBA', (FW * COT, FH * dong), (0, 0, 0, 0))
for i, (im, cx) in enumerate(zip(khung, chan)):
    atlas.alpha_composite(im, ((i % COT) * FW + NX - cx, (i // COT) * FH + NY - im.height))
atlas.save(RA, optimize=True)

# Con ma (nền trắng, thân trắng xanh: chỉ trắng tinh nối mép là nền)
b = np.array(Image.open(MA).convert('RGB')).astype(int)
ma = Image.fromarray(tach_nen(b, b.min(2) >= 250, 3), 'RGBA')
ma = ma.crop(ma.getbbox())
ma = ma.resize((round(ma.width * MA_CAO / ma.height), MA_CAO), Image.LANCZOS)
ma.save(RA_MA, optimize=True)

print(f'{RA}: {atlas.width}×{atlas.height}, khung PNG {FW}×{FH}, neo {NX}/{NY}')
print(f'  logic (÷2): atlasW {atlas.width / 2} atlasH {atlas.height / 2} w {FW / 2} h {FH / 2} neoX {NX / 2} neoY {NY / 2} cot {COT}')
print(f'{RA_MA}: {ma.width}×{ma.height}')
