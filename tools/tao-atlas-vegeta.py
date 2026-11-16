"""Dựng atlas Vegeta (nhân vật chọn chơi thứ 3) từ sheet người dùng gửi.
Dùng: python3 tools/tao-atlas-vegeta.py <vegeta-sheet.png>
  - vegeta-sheet: sheet Vegeta 920×1478 (ripped by Dazz & Fret), nền tím nhạt (128,128,255), lưới 10 cột,
    nhân vật quay mặt sang phải (như Mabu / Zinbu)
Ra: web/public/assets/game/vegeta_atlas.png: mỗi điểm ảnh nguồn = đúng 4 điểm ảnh PNG (Scale2x ×2, không nội suy nên nét),
    khung đứng cao 50 × TL = 62,5 logic (bằng Mabu ~61)
In ra kích thước khung và danh sách khung theo tên animation để chép vào nhan-vat-du-lieu.ts.
Ảnh chưởng / vụ nổ giữ nguyên (tools/tao-chuong-vegeta.py, từ sheet cũ)."""
import sys
import numpy as np
from PIL import Image

src = np.array(Image.open(sys.argv[1]).convert('RGB')).astype(int)
NEN = np.array([128, 128, 255])


def nen(a):
    return np.abs(a - NEN).sum(-1) < 24


M = ~nen(src)
M[1290:, 760:] = False  # bỏ chữ ký góc dưới phải


def doan(p, gop=0):
    out, s = [], None
    for i, v in enumerate(list(p) + [0]):
        if v > 0 and s is None:
            s = i
        if v == 0 and s is not None:
            if out and s - out[-1][1] <= gop:
                out[-1] = (out[-1][0], i)
            else:
                out.append((s, i))
            s = None
    return out


DAI = [d for d in doan(M.sum(1)) if d[1] - d[0] > 4]
HANG = [doan(M[y0:y1].sum(0), 3) for y0, y1 in DAI]
print('số hàng', len(DAI), [len(h) for h in HANG])


def cat_khung(r, k):
    """Khung (hàng r, cột k) → RGBA sát viền + toạ độ x giữa đầu"""
    y0, y1 = DAI[r]
    s, e = HANG[r][k]
    a = src[y0:y1, s:e]
    m = M[y0:y1, s:e]
    ys, xs = np.where(m)
    a = a[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    m = m[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    o = np.zeros(a.shape[:2] + (4,), np.uint8)
    o[..., :3] = a
    o[..., 3] = np.where(m, 255, 0)
    # Giữa đầu: tóc đen (điểm tối) ở 1/4 trên của khung
    toi = (a.max(-1) < 70) & m
    vung = toi[: max(4, a.shape[0] // 4)]
    xs = np.where(vung.sum(0) > 0)[0]
    if not len(xs):
        xs = np.where(m[:4].sum(0) > 0)[0]
    return o, (xs.min() + xs.max() + 1) / 2


# Animation: (hàng, cột) trên sheet
A = {
    'idle': [(0, 0), (0, 1), (0, 2), (0, 3)],
    'guard': [(1, 0)],
    'taunt_flex': [(5, 6), (5, 7), (5, 8), (5, 9), (5, 8)],
    'taunt_wave': [(15, 9), (16, 0), (16, 1), (16, 0)],
    'taunt_stretch': [(5, 1), (5, 2), (5, 3), (5, 4)],
    'taunt_antenna': [(6, 1), (6, 2), (6, 3), (6, 4)],
    'taunt_puff': [(15, 0), (15, 1), (15, 2), (15, 3), (15, 4), (15, 5), (15, 6), (15, 7), (15, 8)],
    'run': [(0, 4), (0, 5), (0, 6), (0, 7)],
    'fly': [(0, 8), (0, 9)],
    'jump_up': [(1, 3), (1, 4)],
    'fall': [(1, 5), (1, 8)],
    'crouch_land': [(1, 6)],
    'hit': [(2, 0), (2, 1), (2, 0)],
    'knockdown': [(2, 2), (2, 4)],
    'blown_away': [(3, 0), (3, 1)],
    'burn': [(2, 5), (2, 6), (2, 7), (2, 8)],
    'lifted': [(3, 4), (3, 5)],
    'launched': [(3, 8), (2, 3), (2, 2)],
    'air_recover': [(4, 8), (4, 9)],
    'get_up': [(4, 9), (5, 0), (0, 0)],
    'thrown': [(3, 9), (2, 2), (2, 4), (14, 2)],
    'lie': [(2, 4)],
    'punch_combo': [(9, 0), (9, 2), (9, 3)],
    'punch_long': [(8, 5), (6, 6), (6, 7)],
    'punch_long_2': [(9, 1), (9, 3), (9, 4)],
    'punch_dash': [(8, 0), (8, 1), (8, 2), (8, 3)],
    'punch_charge': [(10, 2), (10, 3), (10, 4), (10, 5)],
    'kick_long': [(7, 3), (7, 1), (7, 2)],
    'kick_long_2': [(10, 0), (7, 5), (7, 8)],
    'kick_sweep': [(11, 4), (11, 5), (11, 6)],
    'kick_arc': [(7, 6), (7, 7), (7, 8)],
    'kick_high': [(13, 0), (13, 1), (13, 2)],
    'roll': [(4, 1), (4, 2), (4, 3), (4, 4), (4, 5), (4, 6), (4, 7)],
    'energy_ball': [(12, 0), (12, 1), (12, 1), (12, 1), (12, 1), (12, 0)],
}

ds, so = [], {}
for ten, ks in A.items():
    for rk in ks:
        if rk not in so:
            so[rk] = len(ds)
            ds.append(cat_khung(*rk))

NGUONG_MAU = 70


def scale2x(a):
    """Phóng 2 lần kiểu Scale2x (EPX): mượt cạnh chéo của pixel art, không nội suy màu"""
    h, w = a.shape[:2]
    p = np.pad(a, ((1, 1), (1, 1), (0, 0)), mode='edge')
    E = p[1:-1, 1:-1]; B = p[:-2, 1:-1]; H = p[2:, 1:-1]; D = p[1:-1, :-2]; F = p[1:-1, 2:]
    bang_ = lambda x, y: (np.abs(x[..., :3].astype(int) - y[..., :3].astype(int)).sum(-1) < NGUONG_MAU) & (x[..., 3] == y[..., 3])
    BD, BF, DH, HF = bang_(B, D), bang_(B, F), bang_(D, H), bang_(H, F)
    E0 = np.where((BD & ~BF & ~DH)[..., None], D, E)
    E1 = np.where((BF & ~BD & ~HF)[..., None], F, E)
    E2 = np.where((DH & ~BD & ~HF)[..., None], D, E)
    E3 = np.where((HF & ~DH & ~BF)[..., None], F, E)
    o = np.zeros((h * 2, w * 2, a.shape[2]), a.dtype)
    o[0::2, 0::2] = E0; o[0::2, 1::2] = E1; o[1::2, 0::2] = E2; o[1::2, 1::2] = E3
    return o


# Tỉ lệ logic: khung đứng (cao 50 điểm ảnh nguồn) cao 62,5 logic ≈ Mabu (~61)
h_dung = ds[so[(0, 0)]][0].shape[0]
TL = 1.25  # điểm ảnh nguồn → logic
P = 4  # điểm ảnh nguồn → PNG (Scale2x ×2, không thu phóng thêm)
PNG_TL = P / TL

trai = max(d for _, d in ds)
phai = max(o.shape[1] - d for o, d in ds)
cao = max(o.shape[0] for o, _ in ds)
# Khung tính theo điểm ảnh nguồn rồi đổi ra logic; giữ số nguyên ở cả logic lẫn PNG
chan = lambda v: int(np.ceil(v / 2)) * 2  # số chẵn để toạ độ PNG (× 4) và logic gọn
KWn, KHn = chan(trai + phai + 2), chan(cao + 2)
NXn = chan(trai + 1)
COT = 10
hang_so = (len(ds) + COT - 1) // COT
AW, AH = COT * KWn * P, hang_so * KHn * P
atlas = Image.new('RGBA', (AW, AH), (0, 0, 0, 0))
for i, (o, d) in enumerate(ds):
    im = Image.fromarray(scale2x(scale2x(o)), 'RGBA')
    x = round(((i % COT) * KWn + NXn - d) * P)
    y = ((i // COT) * KHn + KHn - 2) * P - im.height
    atlas.alpha_composite(im, (x, y))
atlas.save('web/public/assets/game/vegeta_atlas.png', optimize=True)
f = lambda v: round(v * TL, 3)
print(f'h_dung {h_dung}, TL {TL:.4f}, PNG {AW}×{AH}')
print(f'atlasW: {f(COT * KWn)}, atlasH: {f(hang_so * KHn)}, w: {f(KWn)}, h: {f(KHn)}, cot: {COT}, neoX: {f(NXn)}, neoY: {f(KHn - 2)}')
for ten, ks in A.items():
    print(f'{ten}: [{", ".join(str(so[k]) for k in ks)}]')
o, d = ds[so[(12, 1)]]
print('energy_ball khung (12,1): rộng', o.shape[1], 'cao', o.shape[0], 'giữa đầu', d, '→ mép phải logic', f(o.shape[1] - d))
