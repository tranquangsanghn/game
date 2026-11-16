"""Dựng atlas chưởng / vụ nổ của Vegeta từ sheet Vegeta cũ người dùng gửi (atlas nhân vật: tools/tao-atlas-vegeta.py).
Dùng: python3 tools/tao-chuong-vegeta.py <vegeta-sheet.webp>
  - vegeta-sheet: sheet "Vegeta" (Ultimate LSW, 714×2000), nền trắng, nhân vật quay mặt sang phải (như Mabu / Zinbu)
    chỉ dùng dạng tóc đen (9 hàng đầu); chưởng = cầu lửa vàng ở hàng 6, vụ nổ = vòng nổ ở hàng Super Saiyan (nhuộm vàng)
Ra: web/public/assets/game/vegeta_chuong.png (8 khung 192×160: 0–1 cầu lửa vàng (đầu quay phải) · 2 chớp nòng · 3–7 vụ nổ lớn dần)
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
