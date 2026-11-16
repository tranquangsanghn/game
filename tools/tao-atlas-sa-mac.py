"""Dựng ảnh đảo sa mạc từ gói "Free Desert Top-Down Tileset" (LudicArts):
- trang_tri.png: atlas trang trí (cắt sát, thu nhỏ TL), in ra bảng toạ độ để dán vào TRANG_TRI_SA (ve-canvas.ts)
- cat.png: ô cát lặp (Tile_5) thu nhỏ còn 128
- vach.png: vách đá lặp (giữa Tile_8, ghép thêm bản lật dọc để lặp liền theo chiều dọc), rộng 128
Cách chạy: python3 -I tools/tao-atlas-sa-mac.py <thư mục images của gói> web/public/assets/game/sa_mac
"""
import sys
from PIL import Image

SRC, OUT = sys.argv[1], sys.argv[2]
TL = 0.55
# Thứ tự khớp loai trong game (0 = cây đổ được)
DS = ['Object_17', 'Object_3', 'Object_15', 'Object_13', 'Object_10', 'Object_1',
      'Object_14', 'Object_4', 'Object_16', 'Object_11', 'Object_2', 'Object_9']

anh = []
for ten in DS:
    im = Image.open(f'{SRC}/{ten}.png').convert('RGBA')
    im = im.crop(im.getbbox())
    im = im.resize((max(1, round(im.width * TL)), max(1, round(im.height * TL))), Image.LANCZOS)
    anh.append(im)

# Xếp kệ đơn giản, rộng 512
RONG, PAD = 512, 2
x = y = hang = 0
vt = []
for im in anh:
    if x + im.width > RONG:
        x, y, hang = 0, y + hang + PAD, 0
    vt.append((x, y, im.width, im.height))
    x += im.width + PAD
    hang = max(hang, im.height)
atlas = Image.new('RGBA', (RONG, y + hang))
for im, (ax, ay, _, _) in zip(anh, vt):
    atlas.paste(im, (ax, ay))
atlas.save(f'{OUT}/trang_tri.png', optimize=True)
for ten, (ax, ay, w, h) in zip(DS, vt):
    print(f'  {{ sx: {ax}, sy: {ay}, w: {w}, h: {h} }}, // {ten}')

Image.open(f'{SRC}/Tile_5.png').convert('RGB').resize((128, 128), Image.LANCZOS).save(f'{OUT}/cat.png', optimize=True)

v = Image.open(f'{SRC}/Tile_8.png').convert('RGB').crop((0, 70, 256, 200))
v = v.resize((128, round(v.height * 128 / 256)), Image.LANCZOS)
lap = Image.new('RGB', (128, v.height * 2))
lap.paste(v, (0, 0))
lap.paste(v.transpose(Image.FLIP_TOP_BOTTOM), (0, v.height))
lap.save(f'{OUT}/vach.png', optimize=True)
