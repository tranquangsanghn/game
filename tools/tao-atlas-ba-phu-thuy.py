"""Dựng atlas bà phù thuỷ (quái chính của mê cung bom) từ ảnh người dùng gửi (tools/ba-phu-thuy-goc.jpg, 1195×896, 4 tư thế
ngồi trên quả cầu pha lê, nền trắng): 0 ngồi chắp tay · 1 giơ quả cầu qua đầu · 2 nâng quả cầu một tay · 3 ném.
Bỏ quả cầu pha lê (trong game bà ngồi trên viên ngọc rồng 4 sao, vẽ riêng) và quả cầu xanh trên tay (trong game là quả bom, vẽ riêng).
Dùng: python3 tools/tao-atlas-ba-phu-thuy.py tools/ba-phu-thuy-goc.jpg
Ra: web/public/assets/game/ba_phu_thuy.png (4 khung FW×FH ngang, tâm quả cầu cũ ở (CX, CY), bán kính đưa về R),
in ra toạ độ tay cầm bom mỗi khung (dán vào BA_TAY trong me-cung.ts)."""
import sys
from collections import deque
import numpy as np
from PIL import Image

src = np.array(Image.open(sys.argv[1]).convert('RGB')).astype(float)
H, W, _ = src.shape
FW, FH, CX, CY, R = 360, 520, 170, 420, 80
COT = [(60, 315), (328, 583), (605, 868), (855, 1172)]

r, g, b = src[..., 0], src[..., 1], src[..., 2]
mn = src.min(2)
xanh = (b > r + 25) & (b > 100)
xanhDam = (b > r + 60) & (b > 150)

def loang(di):
    nen = np.zeros(di.shape, bool); q = deque()
    for y in range(H):
        for x in (0, W - 1):
            if di[y, x]: nen[y, x] = True; q.append((y, x))
    for x in range(W):
        for y in (0, H - 1):
            if di[y, x] and not nen[y, x]: nen[y, x] = True; q.append((y, x))
    while q:
        y, x = q.popleft()
        for yy, xx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
            if 0 <= yy < H and 0 <= xx < W and di[yy, xx] and not nen[yy, xx]:
                nen[yy, xx] = True; q.append((yy, xx))
    return nen

# Nền = vùng sáng / xanh nối với mép ảnh (mắt trắng bị viền mặt bao kín nên giữ lại; quả cầu, quầng xanh bị loang hết)
nen = loang((mn > 200) | xanh)
alpha = np.where(nen, 0.0, 1.0)
# Mép mềm: điểm nền hơi xám sát vật giữ lại một phần
mem = nen & ~xanh & (mn <= 245)
alpha[mem] = np.clip((255 - mn[mem]) / 60, 0, 1)

def nhom(m):
    """Các cụm điểm liền nhau (4 hướng) của mặt nạ m: danh sách (y, x)"""
    m = m.copy(); h, w = m.shape; kq = []
    for y0, x0_ in zip(*np.where(m)):
        if not m[y0, x0_]: continue
        q = deque([(y0, x0_)]); m[y0, x0_] = False; c = []
        while q:
            y, x = q.popleft(); c.append((y, x))
            for yy, xx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
                if 0 <= yy < h and 0 <= xx < w and m[yy, xx]: m[yy, xx] = False; q.append((yy, xx))
        kq.append(c)
    return kq

out = np.zeros((FH, FW * 4, 4), np.uint8)
tay = []
for k, (x0, x1) in enumerate(COT):
    # Các cụm xanh đậm trong cột: cụm to nhất là quả cầu pha lê, cụm to kế tiếp (nếu có) là quả cầu trên tay
    cum = sorted(nhom(xanhDam[:, x0:x1]), key=len, reverse=True)
    cau = np.array(cum[0])
    ys, xs = cau[:, 0], cau[:, 1] + x0
    rr = (xs.max() - xs.min()) / 2 + 3
    cxx = (xs.max() + xs.min()) / 2
    cy = ys.max() + 3 - rr
    a = alpha.copy()
    yy, xx = np.mgrid[0:H, 0:W]
    d = np.hypot(xx - cxx, yy - cy)
    trong = d < rr + 6
    # Trong quả cầu chỉ giữ chân / áo (điểm tối) nằm sâu trong lòng; vòng viền cầu: giữ khi cả phía trong lẫn ngoài đều tối (áo đè lên viền)
    toi = mn < 110
    a[trong & ~toi] = 0
    vien = trong & (d > rr - 10)
    ux, uy = (xx - cxx) / np.maximum(d, 1), (yy - cy) / np.maximum(d, 1)
    def toiTai(s):
        px = np.clip((xx + ux * s).astype(int), 0, W - 1); py = np.clip((yy + uy * s).astype(int), 0, H - 1)
        return toi[py, px]
    a[vien & ~(toiTai(-14) & toiTai(14))] = 0
    # Quả cầu xanh trên tay (khung 1–3): tâm vùng xanh đậm ngoài quả cầu
    tl = 1.0 * R / rr
    if len(cum) > 1 and len(cum[1]) > 300:
        o = np.array(cum[1])
        # Xoá cả viền quả cầu trên tay (chỉ giữ tay: điểm màu da)
        oy, ox = o[:, 0].mean(), o[:, 1].mean() + x0
        orr = max(np.ptp(o[:, 0]), np.ptp(o[:, 1])) / 2 + 8
        da = (r > b + 50) & (mn > 60)
        a[(np.hypot(xx - ox, yy - oy) < orr) & ~da] = 0
        tay.append(((o[:, 1].mean() + x0 - cxx) * tl + CX, (o[:, 0].mean() - cy) * tl + CY))
    else:
        tay.append(None)
    # Cắt cột, phóng theo tỉ lệ R / rr, đặt tâm cầu vào (CX, CY)
    rgba = np.dstack([src, a * 255]).astype(np.uint8)
    im = Image.fromarray(rgba[:, x0:x1])
    im = im.resize((round((x1 - x0) * tl), round(H * tl)), Image.LANCZOS)
    khung = Image.new('RGBA', (FW, FH))
    khung.alpha_composite(im, (round(CX - (cxx - x0) * tl), round(CY - cy * tl)))
    arr = np.array(khung)
    # Chỉ giữ thân (cụm to): bỏ vệt gió, mảnh viền quả cầu, đốm lẻ
    for c in nhom(arr[..., 3] > 30):
        if len(c) < 3000:
            c = np.array(c); arr[c[:, 0], c[:, 1], 3] = 0
    out[:, k * FW:(k + 1) * FW] = arr
    print(k, 'cau', round(cxx), round(cy), round(rr), 'tay', tay[-1] and tuple(round(v) for v in tay[-1]))

Image.fromarray(out).save('web/public/assets/game/ba_phu_thuy.png', optimize=True)
