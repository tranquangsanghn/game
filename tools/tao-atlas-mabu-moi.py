# Dựng web/public/assets/game/mabu_atlas.png = atlas Mabu cũ (tools/mabu-atlas-cu.png) + khung từ sheet mới (tools/mabu-moi-goc.png).
# Khung mới thêm vào 2 hàng cuối (chỉ số 256..), thu nhỏ để cao bằng Mabu cũ, chân tại y = CHAN, tâm x = 70 (neoX).
# Chạy: python3 tools/tao-atlas-mabu-moi.py   (cần Pillow + numpy + scipy; chạy lại được vì luôn lấy atlas cũ làm gốc)
import os, importlib.util
from PIL import Image

D = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location('cat', os.path.join(D, 'tao-cat-mabu-moi.py'))
cat = importlib.util.module_from_spec(spec); spec.loader.exec_module(cat)

CW, CH, COT = 140, 84, 16
TL = 0.77      # tỉ lệ thu nhỏ: khung đứng mới cao ~77 -> ~59 như Mabu cũ
CHAN = 79      # y chân
NEO_X = 70

# chỉ số khung sheet -> chỉ số khung atlas mới (đều là bản quay mặt phải; game tự lật khi quay trái)
MOI = {
    256: 8, 257: 9, 258: 10,                  # đứng
    259: 20, 260: 21, 261: 22, 262: 25, 263: 26,   # chạy
    264: 13, 265: 14,                         # nhìn thẳng phía trước (xuống)
    266: 15, 267: 11,                         # bắn chưởng: chỉ tay sang phải
    268: 34, 269: 35, 270: 36,                # bay (áo choàng bay ngược về trái)
}
cu = Image.open(os.path.join(D, 'mabu-atlas-cu.png')).convert('RGBA')
hang = (max(MOI) // COT) + 1
out = Image.new('RGBA', (cu.width, hang * CH), (0, 0, 0, 0))
out.alpha_composite(cu, (0, 0))
for k, i in MOI.items():
    f = cat.cat(i)
    f = f.resize((round(f.width * TL), round(f.height * TL)), Image.LANCZOS)
    y, x = divmod(k, COT)
    out.alpha_composite(f, (x * CW + NEO_X - f.width // 2, y * CH + CHAN - f.height))
    if k in (266, 267):
        print('khung', k, 'tay phai nhat x', f.width // 2, 'cao', f.height)
out.save(os.path.join(D, '..', 'web', 'public', 'assets', 'game', 'mabu_atlas.png'))
print(out.size)
