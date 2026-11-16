import sys
from PIL import Image
import numpy as np
from collections import deque
src, out = sys.argv[1], sys.argv[2]
im = np.array(Image.open(src).convert('RGB')).astype(int)
H, W, _ = im.shape
mx = im.max(2); mn = im.min(2)
nen = (mx - mn <= 16) & (mn >= 190)
seen = np.zeros((H, W), bool)
q = deque()
for x in range(W):
    for y in (0, H-1):
        if nen[y, x]: seen[y, x] = True; q.append((y, x))
for y in range(H):
    for x in (0, W-1):
        if nen[y, x]: seen[y, x] = True; q.append((y, x))
# also seed the gap rows/cols between cells
for y in range(H):
    for x in range(0, W, 1):
        pass
while q:
    y, x = q.popleft()
    for dy, dx in ((1,0),(-1,0),(0,1),(0,-1)):
        ny, nx = y+dy, x+dx
        if 0 <= ny < H and 0 <= nx < W and not seen[ny, nx] and nen[ny, nx]:
            seen[ny, nx] = True; q.append((ny, nx))
a = np.where(seen, 0, 255).astype(np.uint8)
# remove tiny isolated blobs (watermark etc) : erase alpha in lower-right corner
a[700:, 1330:] = 0
rgba = np.dstack([im.astype(np.uint8), a])
Image.fromarray(rgba, 'RGBA').save(out)
