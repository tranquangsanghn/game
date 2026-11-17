"""Dựng atlas Golden Frieza (chiêu biến hình của Frieza) từ sheet người dùng gửi.

Nguồn: tools/golden-frieza-goc.png (7 khung 512×768 ngang, nền trong suốt, chân ở y = 750):
0 đứng thủ thế · 1 khoanh tay tập trung · 2 bùng hào quang vận công · 3 tụ lực trong tay ·
4 nâng cầu năng lượng · 5 cầu năng lượng cực đại · 6 phóng chưởng.
Ra: web/public/assets/game/golden_frieza.png (giữ nguyên khung, chỉ nén lại). Khai báo SP_FRIEZA_VANG trong frieza.ts.
Chạy: python3 tools/tao-atlas-golden-frieza.py
"""
from pathlib import Path
from PIL import Image

GOC = Path(__file__).parent / 'golden-frieza-goc.png'
RA = Path(__file__).parent.parent / 'web/public/assets/game/golden_frieza.png'

im = Image.open(GOC).convert('RGBA')
assert im.size == (512 * 7, 768), im.size
# Xoá màu ở điểm ảnh trong suốt hẳn cho nén tốt hơn
px = im.load()
for y in range(im.height):
    for x in range(im.width):
        if px[x, y][3] == 0:
            px[x, y] = (0, 0, 0, 0)
im.save(RA, optimize=True)
print(RA, RA.stat().st_size)
