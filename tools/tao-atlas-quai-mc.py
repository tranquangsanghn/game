"""Dựng atlas 3 quái của mê cung bom từ ảnh người dùng gửi (thay quái ăn thịt cũ vẽ bằng vector).
Dùng: python3 tools/tao-atlas-quai-mc.py   (cần Pillow + numpy + scipy)
Nguồn:
  tools/so19-goc.png   sheet Số 19 (Android 19, Dragon Ball Z: Legendary Super Warriors, nền trắng, quay mặt phải)
  tools/khi-dot-goc.png sheet Khỉ đột (Oozaru, cùng game, nền trắng, quay mặt phải)
  tools/quy-goc/*.png  khung Quỷ canh cổng (Guardian, ảnh rời nền trong suốt, quay mặt phải)
Ra: web/public/assets/game/quai_mc.png, 10 cột × 4 hàng khung 200×200, chân ở (100, 196) (khớp QUAI_KHUNG / SP_QUAI trong me-cung.ts):
  hàng 0 Số 19:  0 đứng · 1–2 chạy · 3 đấm · 4 bắn tia (tay đưa ra) · 5 trúng đòn · 6 nằm gục
  hàng 1 Khỉ đột: 0 đứng · 1 bước · 2 đấm · 3 há miệng (bắn tia) · 4 giơ tay gầm · 5 trúng đòn · 6 gầm
  hàng 2 Quỷ:    0–5 vỗ cánh bay · 6 phun lửa · 7 trúng đòn · 8 nằm gục · 9 húc
  hàng 3 hiệu ứng (tâm ở giữa khung): 0 cầu lửa của quỷ · 1 cầu lửa kéo đuôi · 2 đầu tia đỏ của Số 19
Pixel art (Số 19, khỉ đột) phóng ×4 không nội suy; tách nền trắng chỉ ở phần nền nối ra mép ô (mặt trắng của Số 19 giữ nguyên)."""
import numpy as np
from PIL import Image
from scipy import ndimage

F = 200
out = Image.new('RGBA', (F * 10, F * 4))


def tach_trang(path, o):
    """Cắt ô (x, y, w, h) trên sheet nền trắng, nền trắng nối ra mép ô thành trong suốt"""
    x, y, w, h = o
    a = np.array(Image.open(path).convert('RGB'))[y - 1:y + h + 1, x - 1:x + w + 1].astype(int)
    trang = a.sum(2) >= 750
    lab, _ = ndimage.label(trang)
    vien = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    nen = np.isin(lab, list(vien))
    rgba = np.dstack([a, np.where(nen, 0, 255)]).astype(np.uint8)
    im = Image.fromarray(rgba)
    return im.crop(im.getbbox())


def dat(im, cot, hang, tl, giua=False, muot=False):
    im = im.resize((max(1, round(im.width * tl)), max(1, round(im.height * tl))), Image.LANCZOS if muot else Image.NEAREST)
    if im.width > F or im.height > F - 4:
        k = min(F / im.width, (F - 4) / im.height)
        im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
    x = cot * F + (F - im.width) // 2
    y = hang * F + ((F - im.height) // 2 if giua else 196 - im.height)
    out.alpha_composite(im, (x, y))


# Số 19: (x, y, w, h) trên sheet
SO19 = [(3, 107, 21, 43), (74, 111, 32, 39), (116, 108, 28, 42), (45, 160, 31, 39), (3, 310, 32, 39), (148, 213, 27, 38), (323, 232, 44, 19)]
for k, o in enumerate(SO19):
    dat(tach_trang('tools/so19-goc.png', o), k, 0, 4)
# Khỉ đột: đứng · bước · đấm · há miệng · giơ tay · trúng đòn (nhấp nháy) · gầm
KHI = [(2, 107, 32, 44), (275, 107, 40, 46), (224, 107, 40, 46), (47, 107, 32, 44), (93, 108, 32, 45), (139, 108, 32, 45), (183, 105, 32, 48)]
for k, o in enumerate(KHI):
    dat(tach_trang('tools/khi-dot-goc.png', o), k, 1, 4)
# Quỷ canh cổng (ảnh rời)
QUY = ['1', '2', '3', '4', '5', '6', 'lua-1', 'dau', 'chet', 'huc']
for k, t in enumerate(QUY):
    im = Image.open(f'tools/quy-goc/{t}.png').convert('RGBA')
    dat(im.crop(im.getbbox()), k, 2, 1.45, muot=True)
# Hiệu ứng
for k, t in enumerate(['lua-1a', 'lua-2']):
    im = Image.open(f'tools/quy-goc/{t}.png').convert('RGBA')
    dat(im.crop(im.getbbox()), k, 3, 1.6, giua=True, muot=True)
dat(tach_trang('tools/so19-goc.png', (84, 320, 16, 12)), 2, 3, 6, giua=True)
out.save('web/public/assets/game/quai_mc.png', optimize=True)
