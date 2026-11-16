"""Dựng atlas Vegeta (nhân vật chọn chơi thứ 3) và atlas chưởng / vụ nổ của Vegeta từ sheet người dùng gửi.
Dùng: python3 tools/tao-atlas-vegeta.py <vegeta-sheet.webp>
  - vegeta-sheet: sheet "Vegeta" (Ultimate LSW, 714×2000), nền trắng, nhân vật quay mặt sang phải (như Mabu / Zinbu)
    chỉ dùng dạng tóc đen (9 hàng đầu); chưởng = cầu lửa vàng ở hàng 6, vụ nổ = vòng nổ ở hàng Super Saiyan (nhuộm vàng)
Ra: web/public/assets/game/vegeta_atlas.png (ảnh to gấp PNG_TL kích thước logic; Scale2x ×2 rồi thu về; 16 cột, chân ở đáy, đầu ở giữa ngang)
    web/public/assets/game/vegeta_chuong.png (8 khung 192×160: 0–1 cầu lửa vàng (đầu quay phải) · 2 chớp nòng · 3–7 vụ nổ lớn dần)
In ra kích thước khung và danh sách khung theo tên animation để chép vào nhan-vat-du-lieu.ts.
Tách nền bằng loang từ mép khung (giáp / găng tay trắng của Vegeta không bị coi là nền)."""
import sys
from collections import deque
import numpy as np
from PIL import Image

src = np.array(Image.open(sys.argv[1]).convert('RGB')).astype(int)
X0, X1 = 36, 460  # vùng sprite (bên phải là ảnh chân dung)


def nen_trang(a):
    return (a.min(-1) > 214) & ((a.max(-1) - a.min(-1)) < 40)


def dai(y0, y1):
    m = ~nen_trang(src[y0:y1, X0:X1])
    p = m.sum(1)
    out, s = [], None
    for i, v in enumerate(list(p) + [0]):
        if v > 0 and s is None:
            s = i
        if v == 0 and s is not None:
            if i - s > 4:
                out.append((y0 + s, y0 + i))
            s = None
    return out


def cot(y0, y1):
    m = ~nen_trang(src[y0:y1, X0:X1])
    p = m.sum(0)
    out, s = [], None
    for i, v in enumerate(list(p) + [0]):
        if v > 0 and s is None:
            s = i
        if v == 0 and s is not None:
            out.append((X0 + s, X0 + i))
            s = None
    return out


DAI = dai(70, 660)
DAI[-1] = (515, 580)  # hàng 8: bỏ chùm chưởng tím to phía dưới
HANG = [[c for c in cot(*b) if c[1] - c[0] >= 10] for b in DAI]  # bỏ trái tim nhỏ


def loang_nen(a):
    """Nền = vùng trắng nối với mép khung"""
    t = nen_trang(a)
    h, w = t.shape
    nen = np.zeros_like(t)
    q = deque()
    for y in range(h):
        for x in (0, w - 1):
            if t[y, x] and not nen[y, x]:
                nen[y, x] = True; q.append((y, x))
    for x in range(w):
        for y in (0, h - 1):
            if t[y, x] and not nen[y, x]:
                nen[y, x] = True; q.append((y, x))
    while q:
        y, x = q.popleft()
        for yy, xx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
            if 0 <= yy < h and 0 <= xx < w and t[yy, xx] and not nen[yy, xx]:
                nen[yy, xx] = True; q.append((yy, xx))
    return nen


def cat_khung(r, k, xc=None):
    """Khung nhân vật (hàng r, cột k) → RGBA sát viền + toạ độ x giữa đầu. xc: cắt bớt bên phải (chớp chưởng dính liền)"""
    y0, y1 = DAI[r]
    s, e = HANG[r][k]
    if xc:
        e = s + xc
    a = src[y0 - 1:y1 + 1, s - 1:e + 1]
    nen = loang_nen(a)
    # Viền mờ của ảnh nén: điểm sáng sát nền thì bỏ
    sat = np.zeros_like(nen)
    sat[1:] |= nen[:-1]; sat[:-1] |= nen[1:]; sat[:, 1:] |= nen[:, :-1]; sat[:, :-1] |= nen[:, 1:]
    m = ~nen & ~(sat & (a.min(-1) > 190))
    lan = np.zeros(m.shape, int)
    lan[1:] += m[:-1]; lan[:-1] += m[1:]; lan[:, 1:] += m[:, :-1]; lan[:, :-1] += m[:, 1:]
    m &= lan > 1
    ys, xs = np.where(m)
    m = m[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    a = a[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    o = np.zeros(a.shape[:2] + (4,), np.uint8)
    o[..., :3] = np.clip(a, 0, 255)
    o[..., 3] = np.where(m, 255, 0)
    top = np.where(m[:4].sum(0) > 0)[0]
    return o, (top.min() + top.max() + 1) / 2


# Animation: (hàng, cột) theo hàng / cột tách được ở trên (sheet đã quay mặt sang phải)
A = {
    'idle': [(0, 2), (0, 3), (0, 4), (0, 3)],
    'guard': [(3, 0)],
    'taunt_flex': [(0, 5), (0, 6), (0, 7), (0, 7), (0, 6)],
    'taunt_wave': [(0, 8), (0, 8), (0, 7), (0, 8)],
    'taunt_stretch': [(2, 4), (2, 4), (2, 5), (2, 0)],
    'taunt_antenna': [(0, 0), (0, 1), (0, 2)],
    'taunt_puff': [(8, 0), (8, 1), (8, 2), (8, 3), (8, 4), (8, 4), (8, 5)],
    'run': [(1, 1), (1, 7), (1, 1), (1, 7)],
    'fly': [(1, 3), (1, 3)],
    'jump_up': [(2, 1), (2, 2)],
    'fall': [(2, 3), (2, 6)],
    'crouch_land': [(2, 0)],
    'hit': [(7, 0), (7, 1), (7, 0)],
    'knockdown': [(7, 4), (7, 5)],
    'blown_away': [(7, 1), (7, 4)],
    'burn': [(7, 0), (7, 2), (7, 0), (7, 2)],
    'lifted': [(7, 2), (7, 3)],
    'launched': [(7, 3), (7, 4), (7, 5)],
    'air_recover': [(1, 6), (1, 7)],
    'get_up': [(7, 5), (2, 0), (0, 4)],
    'thrown': [(7, 1), (7, 4), (7, 5), (7, 6)],
    'lie': [(7, 6)],
    'punch_combo': [(4, 0), (4, 1), (4, 2)],
    'punch_long': [(4, 3), (4, 4), (4, 5)],
    'punch_long_2': [(4, 5), (4, 6), (4, 7)],
    'punch_dash': [(4, 1), (4, 2), (4, 4), (4, 5)],
    'punch_charge': [(4, 8), (4, 9), (4, 11), (4, 12)],
    'kick_long': [(5, 0), (5, 1), (5, 2)],
    'kick_long_2': [(5, 3), (5, 4), (5, 5)],
    'kick_sweep': [(5, 9), (5, 11), (5, 12)],
    'kick_arc': [(5, 6), (5, 7), (5, 8)],
    'kick_high': [(5, 9), (5, 10), (5, 12)],
    'roll': [(1, 1), (1, 4), (1, 5), (1, 4), (1, 5), (4, 4), (4, 5)],
    'energy_ball': [(6, 0), (6, 1), (6, 2), (6, 3), (6, 3), (6, 2)],
}
CAT = {(6, 3): 24}  # khung bắn chưởng: chớp chưởng dính liền, chỉ lấy phần người

ds, so = [], {}
for ten, ks in A.items():
    for rk in ks:
        if rk not in so:
            so[rk] = len(ds)
            ds.append(cat_khung(*rk, CAT.get(rk)))

NGUONG_MAU = 70


def scale2x(a):
    """Phóng 2 lần kiểu Scale2x (EPX): mượt cạnh chéo của pixel art"""
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


# Tỉ lệ logic: khung đứng (idle) cao bằng Vegeta cũ / Mabu (~61 px logic)
CAO_DUNG = 61
TL = CAO_DUNG / ds[so[(0, 3)]][0].shape[0]
PNG_TL = 1.5  # ảnh PNG to gấp 1,5 kích thước logic (như atlas cũ)
P = TL * PNG_TL  # điểm ảnh nguồn → điểm ảnh PNG

trai = max(d for _, d in ds) * TL
phai = max(o.shape[1] - d for o, d in ds) * TL
cao = max(o.shape[0] for o, _ in ds) * TL
KW, KH = int(np.ceil(trai + phai)) + 4, int(np.ceil(cao)) + 4
NX, NY = int(np.ceil(trai)) + 2, KH - 2
COT = 16
hang_so = (len(ds) + COT - 1) // COT


def phong(o):
    im = Image.fromarray(scale2x(scale2x(o)), 'RGBA')
    w, h = max(1, round(o.shape[1] * P)), max(1, round(o.shape[0] * P))
    # Thu từ ×4 về đúng cỡ PNG trên ảnh nhân trước alpha (không viền đen / trắng)
    a = np.array(im).astype(float)
    a[..., :3] *= a[..., 3:] / 255
    im2 = Image.fromarray(a.astype(np.uint8), 'RGBA').resize((w, h), Image.LANCZOS)
    b = np.array(im2).astype(float)
    al = np.maximum(b[..., 3:], 1)
    b[..., :3] = np.clip(b[..., :3] * 255 / al, 0, 255)
    b[..., 3] = np.where(b[..., 3] < 40, 0, np.clip((b[..., 3] - 40) * 255 / 160, 0, 255))
    return Image.fromarray(b.astype(np.uint8), 'RGBA')


AW, AH = round(COT * KW * PNG_TL), round(hang_so * KH * PNG_TL)
atlas = Image.new('RGBA', (AW, AH), (0, 0, 0, 0))
for i, (o, d) in enumerate(ds):
    im = phong(o)
    x = round(((i % COT) * KW + NX) * PNG_TL - d * P)
    y = round(((i // COT) * KH + NY) * PNG_TL) - im.height
    atlas.alpha_composite(im, (x, y))
atlas.save('web/public/assets/game/vegeta_atlas.png', optimize=True)
print(f'PNG {AW}×{AH}; atlasW: {COT * KW}, atlasH: {hang_so * KH}, w: {KW}, h: {KH}, cot: {COT}, neoX: {NX}, neoY: {NY}')
for ten, ks in A.items():
    print(f'{ten}: [{", ".join(str(so[k]) for k in ks)}]')


# ─── Chưởng + vụ nổ ───
def tach_sang(a):
    """Hiệu ứng sáng trên nền trắng → RGBA: alpha theo độ lệch khỏi trắng, phần lõi trắng kín bên trong giữ đặc"""
    nen = loang_nen(a)
    lech = (255 - a.min(-1)).astype(float)
    al = np.clip(lech / 120, 0, 1)
    al = np.where(nen, al, 1.0)
    mau = np.clip(255 - (255 - a) / np.maximum(al[..., None], 1e-3), 0, 255)
    o = np.zeros(a.shape[:2] + (4,), np.uint8)
    o[..., :3] = mau
    o[..., 3] = (al * 255).astype(np.uint8)
    return o


def nhuom_vang(o):
    """Vòng nổ hồng / tím → vàng cam (giữ độ sáng)"""
    o = o.copy().astype(float)
    sang = o[..., :3].mean(-1, keepdims=True) / 255
    vang = np.array([255, 200, 60], float)
    o[..., :3] = np.clip(vang * (0.35 + 0.65 * sang) + 255 * np.clip(sang - 0.75, 0, 1) * 2.4, 0, 255)
    return o.astype(np.uint8)


def hop(x0, y0, x1, y1):
    return tach_sang(src[y0:y1, x0:x1])


y60, y61 = DAI[6]
c6 = HANG[6]
cau1 = hop(c6[-2][0] - 1, y60, c6[-2][1] + 1, y61)  # cầu lửa vàng 1 (đuôi phía trái trên)
cau2 = hop(c6[-1][0] - 1, y60, c6[-1][1] + 1, y61)
s3, e3 = c6[3]
chop = hop(s3 + 22, y60, e3 + 1, y61)  # chớp nòng (phần bên phải khung bắn chưởng)

# Vòng nổ hồng ở hàng Super Saiyan: cầu sáng · vòng · vòng mờ (cắt tránh hình nhân vật bên trái)
no = [nhuom_vang(hop(*h)) for h in ((400, 1200, 468, 1272), (478, 1203, 547, 1272), (559, 1214, 616, 1266))]
print('vòng nổ', [n.shape[:2] for n in no])
CW, CH = 192, 160


def dat(img, khung, co, xoay=0):
    """xoay: độ quay ngược chiều kim đồng hồ (cầu lửa trong sheet bay chéo xuống phải → đầu quay sang phải)"""
    im = Image.fromarray(img, 'RGBA')
    if xoay:
        im = im.rotate(xoay, Image.BICUBIC, expand=True)
        im = im.crop(im.getbbox())
    k = min(co * CW / im.width, co * CH / im.height)
    im = im.resize((max(1, round(im.width * k)), max(1, round(im.height * k))), Image.LANCZOS)
    ch.alpha_composite(im, (khung * CW + (CW - im.width) // 2, (CH - im.height) // 2))


ch = Image.new('RGBA', (CW * 8, CH), (0, 0, 0, 0))
dat(cau1, 0, 0.75, 38)
dat(cau2, 1, 0.75, 38)
dat(chop, 2, 0.9)
dat(no[0], 3, 0.3)
dat(no[0], 4, 0.55)
dat(no[0], 5, 0.8)
dat(no[1], 6, 0.95)
dat(no[2], 7, 1.0)
ch.save('web/public/assets/game/vegeta_chuong.png', optimize=True)
print('vegeta_chuong', ch.size)
