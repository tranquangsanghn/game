"""Tách cây cối / vật dụng của thần điện thành vật riêng (phá được bằng chưởng), còn lại nền gạch.

Dùng: python3 tools/tao-vat-than-dien.py web/public/assets/game/than_dien.png \
        web/public/assets/game/than_dien_nen.png web/public/assets/game/than_dien_vat.png web/src/game/than-dien-vat.ts [xem.png]
- Nền gạch là một ô 16px lặp đều: điểm ảnh khác ô gạch đó (cây, bồn cỏ, điện thờ, chòi vòm, bóng đổ) là điểm của vật.
- Mỗi điểm vật thuộc về vật có "xương" (chuỗi điểm khai báo tay bên dưới) gần nhất.
- Ra: ảnh nền chỉ còn gạch (điểm vật thay bằng ô gạch), atlas từng vật (nền trong suốt), file TS: khung, chỗ trong atlas, vật cản của từng vật.
"""
import sys
import numpy as np
from PIL import Image

a = np.array(Image.open(sys.argv[1]).convert('RGBA')).astype(np.int32)
H, W = a.shape[:2]
O = 16
# Ô gạch mẫu: trung vị các ô ở sân trống giữa điện thờ và hàng cọ
cells = [a[y:y + O, x:x + O, :3] for y in range(240, 400, O) for x in range(288, 432, O)]
T = np.median(np.stack(cells), 0).astype(np.int32)
F = np.tile(T, (H // O, W // O, 1))
# Ngưỡng thấp để lấy cả bóng mờ, rồi nới mask 1 điểm ảnh cho sạch viền
vat = np.abs(a[..., :3] - F).sum(2) > 12
vat[1:] |= vat[:-1]; vat[:-1] |= vat[1:]; vat[:, 1:] |= vat[:, :-1]; vat[:, :-1] |= vat[:, 1:]
vat &= a[..., 3] > 0

# ─── Xương từng vật (điểm ảnh) ───
VAT = []  # (ten, loai, [điểm])


def cay(ten, x, y0, y1):
    VAT.append((ten, 'cay', [(x, y) for y in range(y0, y1 + 1, 4)]))


# Cây tháp 4 góc (trái trên, phải trên = gương)
for k, (x, yc, yb) in enumerate([(129, 25, 47), (96, 60, 78), (64, 80, 110), (31, 115, 142)]):
    cay(f'cay-tt{k}', x, yc - 10, yb)
    cay(f'cay-pt{k}', 720 - x, yc - 10, yb)
for k, (x, yc, yb) in enumerate([(31, 345, 366), (64, 370, 397), (96, 390, 430), (129, 422, 462)]):
    cay(f'cay-td{k}', x, yc - 10, yb)
    cay(f'cay-pd{k}', 720 - x, yc - 10, yb)
# Hai vườn cây trước điện thờ
for k, x in enumerate([229, 252, 276, 300]):
    cay(f'vuon-t{k}', x, 172, 218)
    cay(f'vuon-p{k}', 720 - x, 172, 218)
# Hai hàng cọ (mỗi cây: tán → gốc)
for k, c in enumerate([306, 345, 384, 422]):
    cay(f'co-t{k}', 275, c - 8, c + 34 if k < 3 else 476)
    cay(f'co-p{k}', 445, c - 8, c + 34 if k < 3 else 476)
# Chòi vòm (vòm → chân cột, cả bề ngang vòm)
for ten, x, yv, yc in [('choi-tt', 219, 30, 100), ('choi-pt', 501, 30, 100), ('choi-td', 187, 148, 220), ('choi-pd', 533, 148, 220)]:
    VAT.append((ten, 'choi', [(x + dx, yv) for dx in (-20, -10, 0, 10, 20)] + [(x, y) for y in range(yv, yc + 1, 5)]))
# Điện thờ: lưới điểm phủ thân (tháp, mái hồng, chính điện, bậc thềm)
HOP_DIEN = [(255, 0, 465, 100), (225, 100, 495, 158), (318, 158, 402, 240)]
VAT.append(('dien-tho', 'dien', [(x, y) for x0, y0, x1, y1 in HOP_DIEN for x in range(x0, x1 + 1, 6) for y in range(y0, y1 + 1, 6)]))

# ─── Gán điểm vật cho vật gần nhất ───
ys, xs = np.nonzero(vat)
best = np.full(len(xs), 1e9)
chu = np.full(len(xs), -1)
for k, (_, _, pts) in enumerate(VAT):
    p = np.array(pts, float)
    d = np.full(len(xs), 1e9)
    for px, py in p:
        d = np.minimum(d, (xs - px) ** 2 + (ys - py) ** 2)
    m = d < best
    best[m] = d[m]
    chu[m] = k
gan = best < 60 ** 2
so_huu = np.full((H, W), -1)
so_huu[ys[gan], xs[gan]] = chu[gan]

# Nền chỉ còn gạch
nen = a.copy()
m = so_huu >= 0
nen[m, :3] = F[m]
Image.fromarray(nen.astype(np.uint8), 'RGBA').save(sys.argv[2])

# ─── Vật cản: ô 16px phần lớn là cỏ / cây của vật đó; điện thờ và cột chòi khai báo tay ───
xanh = (a[..., 1] > a[..., 0] + 25) & (a[..., 1] > a[..., 2] + 25) & (a[..., 3] > 0)
CHAN_TAY = {
    'dien-tho': [(255, 0, 465, 100), (225, 100, 495, 158), (318, 158, 402, 226)],
    'choi-tt': [(214, 56, 225, 104)], 'choi-pt': [(494, 56, 505, 104)],
    'choi-td': [(183, 174, 195, 222)], 'choi-pd': [(526, 174, 538, 222)],
}
o_chu = np.full((H // O, W // O), -1)
for j in range(H // O):
    for i in range(W // O):
        s = so_huu[j * O:(j + 1) * O, i * O:(i + 1) * O]
        x = xanh[j * O:(j + 1) * O, i * O:(i + 1) * O]
        if x.mean() > 0.3 and (s >= 0).any():
            v = np.bincount(s[s >= 0])
            o_chu[j, i] = int(v.argmax())

ra = []
anh = []
for k, (ten, loai, _) in enumerate(VAT):
    yy, xx = np.nonzero(so_huu == k)
    x0, y0, x1, y1 = int(xx.min()), int(yy.min()), int(xx.max()) + 1, int(yy.max()) + 1
    cat = np.zeros((y1 - y0, x1 - x0, 4), np.uint8)
    mm = so_huu[y0:y1, x0:x1] == k
    cat[mm] = a[y0:y1, x0:x1][mm]
    anh.append(cat)
    chan = list(CHAN_TAY.get(ten, []))
    if ten not in CHAN_TAY:
        for j in range(H // O):
            i = 0
            while i < W // O:
                if o_chu[j, i] != k:
                    i += 1
                    continue
                e = i
                while e < W // O and o_chu[j, e] == k:
                    e += 1
                chan.append((i * O, j * O, e * O, (j + 1) * O))
                i = e
    ra.append(dict(ten=ten, loai=loai, x=x0, y=y0, w=x1 - x0, h=y1 - y0, chan=chan))

# Atlas: xếp kệ, rộng 512, cách 2px
RONG = 512
cx = cy = hang = 0
for r, im in zip(ra, anh):
    if cx + r['w'] > RONG:
        cx, cy, hang = 0, cy + hang + 2, 0
    r['ax'], r['ay'] = cx, cy
    cx += r['w'] + 2
    hang = max(hang, r['h'])
atlas = np.zeros((cy + hang, RONG, 4), np.uint8)
for r, im in zip(ra, anh):
    atlas[r['ay']:r['ay'] + r['h'], r['ax']:r['ax'] + r['w']] = im
Image.fromarray(atlas, 'RGBA').save(sys.argv[3])

with open(sys.argv[4], 'w') as f:
    f.write('// Sinh bởi tools/tao-vat-than-dien.py: cây cối / vật dụng của thần điện (điểm ảnh của than_dien.png),\n')
    f.write('// x / y / w / h: khung trên ảnh; ax / ay: chỗ trong atlas than_dien_vat.png; chan: vật cản [x0, y0, x1, y1]\n')
    f.write("export interface ThanVatDl { ten: string; loai: 'cay' | 'choi' | 'dien'; x: number; y: number; w: number; h: number; ax: number; ay: number; chan: [number, number, number, number][] }\n")
    f.write('export const THAN_VAT: ThanVatDl[] = [\n')
    for r in ra:
        ch = ', '.join(f'[{a_}, {b}, {c}, {d}]' for a_, b, c, d in r['chan'])
        f.write(f"  {{ ten: '{r['ten']}', loai: '{r['loai']}', x: {r['x']}, y: {r['y']}, w: {r['w']}, h: {r['h']}, ax: {r['ax']}, ay: {r['ay']}, chan: [{ch}] }},\n")
    f.write('];\n')
print(len(ra), 'vật, atlas', atlas.shape[1], 'x', atlas.shape[0])

if len(sys.argv) > 5:
    # Ảnh xem: trái = nền gạch, phải = mỗi vật một màu + vật cản viền đỏ
    from PIL import ImageDraw
    rng = np.random.default_rng(1)
    mau = rng.integers(40, 255, (len(VAT), 3))
    to = a[..., :3].copy()
    to[m] = (to[m] * 0.3 + mau[so_huu[m]] * 0.7).astype(np.int32)
    xem = Image.new('RGB', (W * 2, H))
    xem.paste(Image.fromarray(nen.astype(np.uint8), 'RGBA').convert('RGB'), (0, 0))
    b = Image.fromarray(to.astype(np.uint8))
    d = ImageDraw.Draw(b)
    for r in ra:
        for x0, y0, x1, y1 in r['chan']:
            d.rectangle((x0, y0, x1 - 1, y1 - 1), outline=(255, 0, 0))
    xem.paste(b, (W, 0))
    xem.resize((W * 4, H * 2), Image.NEAREST).save(sys.argv[5])
