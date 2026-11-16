"""Dựng atlas "bóng ma Goku" (quái canh núi đá, thay hình Ginyu) từ sheet người dùng gửi (1024×723, nét đen trên nền ô caro xám / trắng giả trong suốt).
Dùng: python3 tools/tao-atlas-goku-ma.py <anh-goc> [anh-xem-thu.png]
Ra: web/public/assets/game/goku_ma_atlas.png: 10 cột × 3 hàng khung 200×200 (điểm ảnh nguồn), chân ở giữa đáy (neo 100, 196),
    quay mặt TRÁI (sheet gốc quay phải, lật lại để code giữ quy ước `lat` = quay phải).
    Khung: 0 đứng thẳng · 1 thả lỏng · 2 thủ thế · 3 nín thở (gồng) · 4 nghiêng · 5 nghiêng 3/4
           6 bay chính diện · 7 bay 3/4 · 8 bay ngang · 9 lao tới (dash)
           10–21 chuỗi quay người 0° → 330° (phóng ×1,45 cho bằng cỡ hàng đứng)
Tách nền: mảng sáng nối với mép khung, hoặc mảng sáng kín có nhiều điểm xám ô caro, là nền. Thân tô xanh lơ trong mờ, nét xanh đậm: dáng bóng ma."""
import sys
from collections import deque
import numpy as np
from PIL import Image

src = Image.open(sys.argv[1]).convert('L')
A = np.array(src).astype(int)

DUNG_Y = (72, 257)
BAY_Y = (283, 408)
Q1_Y, Q2_Y = (444, 564), (584, 703)
KHUNG = [
    (490, DUNG_Y[0], 554, DUNG_Y[1]),   # 0 đứng thẳng (Front)
    (612, DUNG_Y[0], 690, DUNG_Y[1]),   # 1 thả lỏng
    (728, DUNG_Y[0], 832, DUNG_Y[1]),   # 2 thủ thế
    (882, DUNG_Y[0], 966, DUNG_Y[1]),   # 3 nín thở
    (270, DUNG_Y[0], 336, DUNG_Y[1]),   # 4 nghiêng (Side)
    (380, DUNG_Y[0], 448, DUNG_Y[1]),   # 5 nghiêng 3/4
    (60, BAY_Y[0], 150, BAY_Y[1]),      # 6 bay chính diện
    (228, BAY_Y[0], 320, BAY_Y[1]),     # 7 bay 3/4
    (376, BAY_Y[0], 472, BAY_Y[1]),     # 8 bay ngang
    (858, BAY_Y[0], 974, BAY_Y[1]),     # 9 lao tới
]
for yy in (Q1_Y, Q2_Y):
    for cx in (95, 262, 430, 610, 778, 940):
        KHUNG.append((cx - 80, yy[0], cx + 80, yy[1]))
PHONG = [1.0] * 10 + [1.45] * 12

FW, FH, NX, NY, COT = 200, 200, 100, 196, 10


def gian(m, r):
    """Giãn mặt nạ r điểm ảnh (8 hướng)"""
    o = m.copy()
    for _ in range(r):
        t = o.copy()
        t[1:] |= o[:-1]; t[:-1] |= o[1:]; t[:, 1:] |= o[:, :-1]; t[:, :-1] |= o[:, 1:]
        t[1:, 1:] |= o[:-1, :-1]; t[:-1, :-1] |= o[1:, 1:]; t[1:, :-1] |= o[:-1, 1:]; t[:-1, 1:] |= o[1:, :-1]
        o = t
    return o


def cat(x0, y0, x1, y1):
    g = A[y0:y1, x0:x1]
    h, w = g.shape
    net = g < 170
    # Nét giãn 2 điểm ảnh làm tường để bịt khe hở của nét vẽ, loang nền từ mép / mảng caro kín
    sang = ~gian(net, 2)
    nhan = np.zeros((h, w), int)
    nen = np.zeros((h, w), bool)
    so = 0
    for sy in range(h):
        for sx in range(w):
            if not sang[sy, sx] or nhan[sy, sx]:
                continue
            so += 1
            cum = [(sy, sx)]
            nhan[sy, sx] = so
            k = 0
            bien = False
            while k < len(cum):
                y, x = cum[k]
                k += 1
                if y in (0, h - 1) or x in (0, w - 1):
                    bien = True
                for yy, xx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
                    if 0 <= yy < h and 0 <= xx < w and sang[yy, xx] and not nhan[yy, xx]:
                        nhan[yy, xx] = so
                        cum.append((yy, xx))
            ys = np.array([c[0] for c in cum]); xs = np.array([c[1] for c in cum])
            # Ô caro đổi màu xám ↔ trắng mỗi 9 điểm ảnh: so điểm với điểm cách 9 ngang trong cùng mảng (vết mờ trong thân thì không đổi)
            caro = 0.0
            if not bien and len(cum) > 12:
                xs9 = xs + 9
                ok = xs9 < w
                ok[ok] &= nhan[ys[ok], xs9[ok]] == so
                if ok.sum() > 6:
                    caro = (np.abs(g[ys[ok], xs[ok]] - g[ys[ok], xs9[ok]]) > 35).mean()
            if bien or caro > 0.4:
                nen[ys, xs] = True
    # Trả lại phần nền sát nét (bị tường giãn che) nhưng không lấn vào nét
    for _ in range(3):
        nen |= gian(nen, 1) & ~net
    than = ~nen
    # Giữ cụm thân lớn nhất (bỏ chữ chú thích / vết lẻ): cụm 8-liên thông, giữ cụm ≥ 4% cụm lớn nhất
    lab = np.zeros((h, w), int)
    cums = []
    for sy in range(h):
        for sx in range(w):
            if than[sy, sx] and not lab[sy, sx]:
                i = len(cums) + 1
                cum = [(sy, sx)]
                lab[sy, sx] = i
                k = 0
                while k < len(cum):
                    y, x = cum[k]
                    k += 1
                    for dy in (-1, 0, 1):
                        for dx in (-1, 0, 1):
                            yy, xx = y + dy, x + dx
                            if 0 <= yy < h and 0 <= xx < w and than[yy, xx] and not lab[yy, xx]:
                                lab[yy, xx] = i
                                cum.append((yy, xx))
                cums.append(cum)
    lon = max(len(c) for c in cums)
    giu = np.zeros((h, w), bool)
    for c in cums:
        if len(c) >= lon * 0.04:
            for y, x in c:
                giu[y, x] = True
    # Màu bóng ma: nét đậm → xanh đêm, thân sáng → xanh lơ nhạt trong mờ
    t = np.clip((g - 60) / 195, 0, 1)  # 0 = nét, 1 = trắng
    rgba = np.zeros((h, w, 4), np.uint8)
    rgba[..., 0] = (30 + t * 170).astype(np.uint8)
    rgba[..., 1] = (60 + t * 180).astype(np.uint8)
    rgba[..., 2] = (140 + t * 115).astype(np.uint8)
    rgba[..., 3] = np.where(giu, (255 - t * 85), 0).astype(np.uint8)
    im = Image.fromarray(rgba, 'RGBA')
    bb = im.getbbox()
    return im.crop(bb)


out = Image.new('RGBA', (FW * COT, FH * ((len(KHUNG) + COT - 1) // COT)), (0, 0, 0, 0))
for i, (b, k) in enumerate(zip(KHUNG, PHONG)):
    im = cat(*b).transpose(Image.FLIP_LEFT_RIGHT)
    if k != 1:
        im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
    if im.height > NY or im.width > FW:
        s = min(NY / im.height, FW / im.width)
        im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    c, r = i % COT, i // COT
    out.alpha_composite(im, (c * FW + NX - im.width // 2, r * FH + NY - im.height))
out.save('web/public/assets/game/goku_ma_atlas.png', optimize=True)
if len(sys.argv) > 2:
    xem = Image.new('RGBA', out.size, (40, 60, 40, 255))
    xem.alpha_composite(out)
    xem.save(sys.argv[2])
print(out.size)
