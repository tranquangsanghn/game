"""Dựng atlas Vegeta (nhân vật chọn chơi thứ 3) và atlas chưởng / vụ nổ của Vegeta từ 2 ảnh người dùng gửi.
Dùng: python3 tools/tao-atlas-vegeta.py <vegeta-sheet.webp> <frieza-sheet.png>
  - vegeta-sheet: sheet Vegeta nền xanh lá (453×2000), mỗi khung một ô; nhân vật quay mặt sang trái (atlas lật lại quay phải như Mabu / Zinbu)
  - frieza-sheet: Frieza (Dragon Ball Z Super Butouden, SNES), chỉ lấy quả chưởng và vụ nổ
Ra: web/public/assets/game/vegeta_atlas.png (16 cột, khung W×H in ra cuối, chân ở đáy, đầu ở giữa ngang)
    web/public/assets/game/vegeta_chuong.png (8 khung 192×160: 0 chưởng sao chổi · 1 quả trắng · 2 quả vàng có vòng · 3–6 vụ nổ lớn dần · 7 vụ nổ to nhất)
In ra danh sách khung theo tên animation để chép vào nhan-vat-du-lieu.ts."""
import sys
import numpy as np
from PIL import Image

TL = 2  # phóng to nguyên điểm ảnh
src = np.array(Image.open(sys.argv[1]).convert('RGB')).astype(int)
r, g, b = src[..., 0], src[..., 1], src[..., 2]
H, W = r.shape
teal = (r < 16) & (abs(g - 128) < 18) & (abs(b - 128) < 18)
vien = (r < 25) & (g > 115) & (g < 190) & (b < 100)
xanh = (g > r + 35) & (g > b + 15)
fg = (~teal) & ~xanh

# Tách hàng: đường viền ngang (xanh sẫm) chiếm gần hết bề ngang
nt = (~teal).sum(1)
fr = np.where(nt > 0, vien.sum(1) / np.maximum(nt, 1), 0)
cat = [0]
for y in range(H):
    if fr[y] > 0.45 and y - cat[-1] > 3:
        cat.append(y)
cat.append(H)
hang = []
for a, c in zip(cat, cat[1:]):
    y0, y1 = (a + 1 if a else 0), c
    if y1 - y0 < 10:
        continue
    col = fg[y0:y1].sum(0)
    runs, x = [], 0
    while x < W:
        if col[x] > 0:
            s = x
            while x < W and col[x] > 0:
                x += 1
            if runs and s - runs[-1][1] <= 1:
                runs[-1][1] = x
            else:
                runs.append([s, x])
        else:
            x += 1
    khung = []
    for s, e in runs:
        if fg[y0:y1, s:e].sum() <= 25:
            continue
        ys = np.where(fg[y0:y1, s:e].sum(1) > 0)[0]
        khung.append((s, e, y0 + ys[0], y0 + ys[-1] + 1))
    hang.append(khung)

# Animation: (hàng, khung) theo thứ tự hàng / khung tách được ở trên
A = {
    'idle': [(1, i) for i in range(4)],
    'guard': [(2, 0)],
    'taunt_flex': [(3, i) for i in range(6)],
    'taunt_wave': [(12, i) for i in range(7)],
    'taunt_stretch': [(53, i) for i in range(9)],
    'taunt_antenna': [(52, i) for i in range(8)],
    'taunt_puff': [(54, i) for i in range(6)],
    'run': [(4, 0), (4, 1), (4, 2), (6, 0), (6, 1), (6, 2)],
    'fly': [(11, 1), (9, 1)],
    'jump_up': [(7, 1), (7, 2)],
    'fall': [(7, 5), (7, 6)],
    'crouch_land': [(7, 0)],
    'hit': [(41, 0), (41, 1), (43, 0)],
    'knockdown': [(51, 0), (51, 2)],
    'blown_away': [(48, 0), (48, 1)],
    'burn': [(42, 0), (42, 1), (42, 2), (42, 3)],
    'lifted': [(44, 0), (44, 1)],
    'launched': [(49, 0), (49, 1), (49, 2)],
    'air_recover': [(49, 2), (49, 3)],
    'get_up': [(51, 5), (51, 6), (51, 7)],
    'thrown': [(50, 0), (50, 1), (50, 2), (50, 3)],
    'lie': [(51, 2)],
    'punch_combo': [(14, i) for i in range(5)],
    'punch_long': [(16, i) for i in range(4)],
    'punch_long_2': [(18, i) for i in range(4)],
    'punch_dash': [(20, i) for i in range(5)],
    'punch_charge': [(21, i) for i in range(4)],
    'kick_long': [(23, i) for i in range(6)],
    'kick_long_2': [(25, i) for i in range(4)],
    'kick_sweep': [(30, i) for i in range(4)],
    'kick_arc': [(29, i) for i in range(7)],
    'kick_high': [(26, i) for i in range(4)],
    'roll': [(31, i) for i in range(7)],
    'energy_ball': [(39, 0), (39, 1), (45, 0), (45, 1), (45, 1), (45, 1)],
}

# Cắt từng khung (không trùng), tách nền, lật quay phải, phóng TL
ds, so = [], {}
def khung_rgba(rk):
    s, e, y0, y1 = hang[rk[0]][rk[1]]
    o = np.zeros((y1 - y0, e - s, 4), np.uint8)
    p = src[y0:y1, s:e].copy()
    m = fg[y0:y1, s:e]
    # Khử ánh xanh viền: kênh xanh lá không vượt kênh lớn hơn trong đỏ / xanh dương
    p[..., 1] = np.minimum(p[..., 1], np.maximum(p[..., 0], p[..., 2]) + 12)
    o[..., :3] = np.clip(p, 0, 255)
    o[..., 3] = np.where(m, 255, 0)
    o = o[:, ::-1]
    # Đầu = giữa các điểm ảnh của 5 hàng trên cùng
    top = np.where(o[:5, :, 3].sum(0) > 0)[0]
    dau = (top.min() + top.max() + 1) / 2
    return o, dau
for ten, ks in A.items():
    for rk in ks:
        if rk not in so:
            so[rk] = len(ds)
            ds.append(khung_rgba(rk))
trai = max(d for _, d in ds) * TL
phai = max(o.shape[1] - d for o, d in ds) * TL
cao = max(o.shape[0] for o, _ in ds) * TL
KW, KH = int(np.ceil(trai + phai)) + 4, int(cao) + 4
NX, NY = int(np.ceil(trai)) + 2, KH - 2
COT = 16
hang_so = (len(ds) + COT - 1) // COT
atlas = Image.new('RGBA', (COT * KW, hang_so * KH), (0, 0, 0, 0))
for i, (o, d) in enumerate(ds):
    im = Image.fromarray(o, 'RGBA').resize((o.shape[1] * TL, o.shape[0] * TL), Image.NEAREST)
    x = (i % COT) * KW + NX - int(round(d * TL))
    y = (i // COT) * KH + NY - im.height
    atlas.alpha_composite(im, (x, y))
atlas.save('web/public/assets/game/vegeta_atlas.png', optimize=True)
print(f'atlasW: {atlas.width}, atlasH: {atlas.height}, w: {KW}, h: {KH}, cot: {COT}, neoX: {NX}, neoY: {NY}')
for ten, ks in A.items():
    print(f'{ten}: [{", ".join(str(so[k]) for k in ks)}]')

# ─── Chưởng + vụ nổ (Frieza sheet) ───
fz = np.array(Image.open(sys.argv[2]).convert('RGBA'))
nen = fz[5, 5, :3].astype(int)
mk = np.abs(fz[..., :3].astype(int) - nen).sum(2) > 30
fz[..., 3] = np.where(mk, 255, 0)
HOP = [(326, 580, 380, 612), (261, 580, 293, 612), (355, 485, 388, 517),
       (441, 624, 503, 688), (514, 616, 588, 696), (608, 599, 710, 711), (747, 582, 901, 720), (737, 425, 913, 569)]
CW, CH = 192, 160
ch = Image.new('RGBA', (CW * len(HOP), CH), (0, 0, 0, 0))
for i, (x0, y0, x1, y1) in enumerate(HOP):
    im = Image.fromarray(fz[y0:y1, x0:x1])
    ch.alpha_composite(im, (i * CW + (CW - im.width) // 2, (CH - im.height) // 2))
ch.save('web/public/assets/game/vegeta_chuong.png', optimize=True)
print('vegeta_chuong', ch.size)
