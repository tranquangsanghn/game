"""Dựng atlas Ginyu (quái canh núi đá) từ sheet người dùng gửi (472×2000, nền xanh lá, các ô viền xanh sẫm, nền ngoài xanh mòng két).
Dùng: python3 tools/tao-atlas-ginyu.py <anh-goc> [anh-xem-thu.png]
Ra: web/public/assets/game/ginyu_atlas.png: 10 cột × 2 hàng khung logic 48×40 (PNG phóng ×4 = 192×160 mỗi khung, mỗi điểm ảnh nguồn đúng 4×4 điểm ảnh,
    không nội suy nên nét), chân ở giữa đáy (neo 24, 38), quay mặt TRÁI (như sheet gốc; vẽ lật khi đi sang phải).
    Hàng 0: 0–3 đứng · 4–7 chạy · 8–9 đấm.  Hàng 1: 0–1 đá · 2 chưởng · 3 trúng đòn · 4 ngã · 5–8 tạo dáng Ginyu Force · 9 trúng đòn 2."""
import sys
from collections import deque
import numpy as np
from PIL import Image

src = np.array(Image.open(sys.argv[1]).convert('RGB')).astype(int)
R, G, B = src[..., 0], src[..., 1], src[..., 2]
nen = ((G > R + 35) & (G > B + 5)) | ((R < 60) & (abs(G - 128) < 35) & (abs(B - 128) < 35))

# Khung chọn (x0, y0, x1, y1) theo toạ độ ảnh gốc, mỗi ô bao trọn một tư thế
DUNG = [(x0, 84, x1, 117) for x0, x1 in [(0, 29), (29, 58), (58, 87), (87, 116)]]
CHAY = [(x0, 116, x1, 145) for x0, x1 in [(0, 28), (28, 57), (57, 84), (84, 111)]]
DAM = [(82, 546, 123, 581), (123, 546, 164, 581)]
DA = [(65, 510, 97, 545), (97, 510, 129, 545)]
CHUONG = [(167, 1058, 213, 1094)]
TRUNG = [(0, 1673, 27, 1700)]
NGA = [(77, 1791, 117, 1822)]
DANG = [(x0, 1823, x1, 1858) for x0, x1 in [(185, 222), (222, 257), (257, 294), (147, 185)]]
TRUNG2 = [(27, 1673, 54, 1700)]
KHUNG = DUNG + CHAY + DAM + DA + CHUONG + TRUNG + NGA + DANG + TRUNG2

FW, FH, NX, NY, K = 48, 40, 24, 38, 4

def cat(x0, y0, x1, y1):
    m = nen[y0:y1, x0:x1]
    h, w = m.shape
    ngoai = np.zeros_like(m)
    q = deque([(y, x) for y in range(h) for x in (0, w - 1)] + [(y, x) for x in range(w) for y in (0, h - 1)])
    while q:
        y, x = q.popleft()
        if 0 <= y < h and 0 <= x < w and m[y, x] and not ngoai[y, x]:
            ngoai[y, x] = True
            q.extend([(y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)])
    a = ~ngoai
    # Bỏ cụm điểm lẻ (< 8 điểm, thường là vết đường kẻ ô / nhiễu nén ảnh)
    nhan = np.zeros((h, w), int)
    so = 0
    for sy in range(h):
        for sx in range(w):
            if a[sy, sx] and not nhan[sy, sx]:
                so += 1
                cum = [(sy, sx)]
                nhan[sy, sx] = so
                k = 0
                while k < len(cum):
                    y, x = cum[k]
                    k += 1
                    for dy in (-1, 0, 1):
                        for dx in (-1, 0, 1):
                            yy, xx = y + dy, x + dx
                            if 0 <= yy < h and 0 <= xx < w and a[yy, xx] and not nhan[yy, xx]:
                                nhan[yy, xx] = so
                                cum.append((yy, xx))
                if len(cum) < 8:
                    for y, x in cum:
                        a[y, x] = False
    rgba = np.zeros((h, w, 4), np.uint8)
    mau = src[y0:y1, x0:x1].copy()
    # Khử ám xanh lá ở viền (nền xanh lá lem vào do nén): G không vượt quá max(R, B)
    mau[..., 1] = np.minimum(mau[..., 1], np.maximum(mau[..., 0], mau[..., 2]) + 10)
    rgba[..., :3] = mau
    rgba[..., 3] = np.where(a, 255, 0)
    ys, xs = np.nonzero(a)
    return rgba[ys.min():ys.max() + 1, xs.min():xs.max() + 1]

atlas = np.zeros((2 * FH, 10 * FW, 4), np.uint8)
for i, k in enumerate(KHUNG):
    img = cat(*k)
    h, w = img.shape[:2]
    r, c = divmod(i, 10)
    x = NX - w // 2
    y = NY - h
    for j in range(h):
        for ii in range(w):
            yy, xx = y + j, x + ii
            if img[j, ii, 3] and 0 <= yy < FH and 0 <= xx < FW:
                atlas[r * FH + yy, c * FW + xx] = img[j, ii]
out = Image.fromarray(atlas, 'RGBA').resize((10 * FW * K, 2 * FH * K), Image.NEAREST)
out.save('web/public/assets/game/ginyu_atlas.png', optimize=True)
if len(sys.argv) > 2:
    xem = Image.new('RGBA', out.size, (40, 40, 40, 255))
    xem.alpha_composite(out)
    xem.save(sys.argv[2])
print('xong', len(KHUNG), 'khung')
