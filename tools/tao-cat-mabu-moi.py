# Cắt sheet Mabu mới (tools/mabu-moi-goc.png, do người dùng gửi) thành các dải khung theo hướng / hành động.
# Dùng: python3 tools/tao-cat-mabu-moi.py   (cần Pillow + numpy + scipy)  -> tools/mabu-moi/*.png
import os
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as ndi

GOC = os.path.join(os.path.dirname(__file__), 'mabu-moi-goc.png')
RA = os.path.join(os.path.dirname(__file__), 'mabu-moi')
os.makedirs(RA, exist_ok=True)
BONG = (96, 64, 168)  # màu bóng tím dưới chân (chỉ dùng cho bóng), xoá cho khớp game (không có bóng)

im = Image.open(GOC).convert('RGBA')
a = np.array(im)
lab, n = ndi.label(a[..., 3] > 0, structure=np.ones((3, 3)))
cac = []
for i, sl in enumerate(ndi.find_objects(lab)):
    ar = int((lab[sl] == i + 1).sum())
    if ar >= 250:  # bỏ tia sáng / vòng gió nhỏ
        cac.append((sl[0].start, sl[1].start, sl[0].stop, sl[1].stop, i + 1))
cac.sort(key=lambda t: (round((t[0] + t[2]) / 2 / 45), t[1]))  # theo hàng rồi theo cột (chỉ số 0..82)

def cat(i):
    y0, x0, y1, x1, id_ = cac[i]
    m = lab[y0:y1, x0:x1] == id_
    c = a[y0:y1, x0:x1].copy()
    c[~m] = 0
    bong = (c[..., :3] == BONG).all(-1)
    bong[: c.shape[0] - 10] = False
    c[bong] = 0
    ys, xs = np.nonzero(c[..., 3] > 0)
    return Image.fromarray(c).crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))

DAI = {
    'trai': [17, 18, 19, 23, 24],        # đi sang trái (mặt quay trái)
    'phai': [20, 21, 22, 25, 26],        # đi sang phải
    'truoc': [13, 14],                   # nhìn thẳng phía trước
    'sau': [66, 69],                     # ra sau (sheet không có góc lưng thật: tạm dùng 2 khung áo choàng phủ kín)
    'chuong_phai': [15, 11, 11, 15],     # bắn chưởng, chỉ tay sang phải
    'chuong_trai': [12, 16, 16, 12],     # bắn chưởng, chỉ tay sang trái
    'bay_trai': [27, 28, 29],            # bay, áo choàng bay ngược về phải
    'bay_phai': [36, 35, 34],            # bay, áo choàng bay ngược về trái
}
anh = {k: [cat(i) for i in v] for k, v in DAI.items()}
cw = max(f.width for fs in anh.values() for f in fs) + 4
ch = max(f.height for fs in anh.values() for f in fs) + 4

def dai(fs):
    d = Image.new('RGBA', (cw * len(fs), ch), (0, 0, 0, 0))
    for k, f in enumerate(fs):
        d.alpha_composite(f, (k * cw + (cw - f.width) // 2, ch - 2 - f.height))  # chân đồng đều, căn giữa
    return d

for k, fs in anh.items():
    dai(fs).save(os.path.join(RA, f'mabu_{k}.png'))

# Một ảnh gộp: mỗi hàng một dải (cột cố định cw x ch), kèm bản xem trước nền xanh có nhãn, phóng x2
tong = Image.new('RGBA', (cw * max(len(v) for v in anh.values()), ch * len(anh)), (0, 0, 0, 0))
for r, fs in enumerate(anh.values()):
    tong.alpha_composite(dai(fs), (0, r * ch))
tong.save(os.path.join(RA, 'mabu_moi_tong.png'))
xem = Image.new('RGBA', (tong.width + 130, tong.height), (60, 110, 60, 255))
xem.alpha_composite(tong, (130, 0))
d = ImageDraw.Draw(xem)
for r, k in enumerate(anh):
    d.text((6, r * ch + ch // 2), k, fill=(255, 255, 255, 255))
xem.resize((xem.width * 2, xem.height * 2), Image.NEAREST).save(os.path.join(RA, 'xem_truoc.png'))
print('cell', cw, ch)
