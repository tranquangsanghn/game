// Bản đồ "Đảo sa mạc": 5 đảo cát ngăn cách bởi biển, nối với nhau bằng các dải cát.
// Chỉ có dữ liệu / logic (không đụng canvas): hàm khoảng cách tới bờ `doSau()` (dương = đất, âm = biển, đơn vị bản đồ)
// và lưới đi được để đẩy vật đang đứng dưới nước lên bờ gần nhất (`veDat()`). Phần vẽ nằm trong ve-canvas.ts.

export type LoaiBanDo = 'co' | 'sa';

/** Đảo: tâm, bán kính gốc, độ méo bờ (các sóng sin theo góc) */
interface Dao { x: number; y: number; r: number; a: [number, number, number]; p: [number, number, number] }

// Map 6400 × 6400, tâm (3200, 3200) là đảo xuất phát (nhân vật + 2 quả cầu trốn)
const DAO: Dao[] = [
  { x: 3200, y: 3150, r: 1080, a: [0.07, 0.05, 0.03], p: [0.4, 2.1, 4.0] }, // 0 giữa
  { x: 1350, y: 1250, r: 880, a: [0.09, 0.06, 0.03], p: [1.3, 0.2, 2.7] }, // 1 tây bắc
  { x: 5050, y: 1300, r: 860, a: [0.08, 0.07, 0.04], p: [2.2, 3.1, 0.9] }, // 2 đông bắc
  { x: 1250, y: 5050, r: 840, a: [0.1, 0.05, 0.04], p: [0.1, 1.7, 3.3] }, // 3 tây nam
  { x: 5100, y: 5050, r: 920, a: [0.08, 0.06, 0.03], p: [3.5, 0.6, 1.9] }, // 4 đông nam
];
// Dải cát nối, mỗi đảo 1–2 đường: giữa – tây bắc, giữa – đông nam, tây bắc – đông bắc, đông bắc – đông nam, tây bắc – tây nam
const CAU_NOI: [number, number][] = [[0, 1], [0, 4], [1, 2], [2, 4], [1, 3]];
/** Nửa bề rộng dải cát nối (đơn vị bản đồ) */
const NUA_RONG_NOI = 175;

// Nhiễu giá trị (value noise) có hạt giống cố định: bờ đảo lượn sóng tự nhiên, mỗi ván như nhau
const bam = (x: number, y: number) => {
  let h = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};
const muot = (t: number) => t * t * (3 - 2 * t);
export function nhieu(x: number, y: number): number {
  const ix = Math.floor(x), iy = Math.floor(y);
  const fx = muot(x - ix), fy = muot(y - iy);
  const a = bam(ix, iy), b = bam(ix + 1, iy), c = bam(ix, iy + 1), d = bam(ix + 1, iy + 1);
  return (a + (b - a) * fx) * (1 - fy) + (c + (d - c) * fx) * fy;
}
/** Số ngẫu nhiên 0..1 cố định theo điểm ảnh (lấp lánh trên biển, đốm cát) */
export const bamDiem = bam;

// Hợp mềm hai vùng (max mềm) để chỗ dải cát nối vào đảo loe ra tự nhiên
const maxMem = (a: number, b: number, k: number) => {
  const h = Math.max(k - Math.abs(a - b), 0) / k;
  return Math.max(a, b) + (h * h * k) / 4;
};

/** Khoảng cách có dấu tới bờ (giải tích, chưa nhiễu) */
function doSauGoc(x: number, y: number): number {
  let s = -1e9;
  for (const d of DAO) {
    const dx = x - d.x, dy = y - d.y;
    const g = Math.atan2(dy, dx);
    const r = d.r * (1 + d.a[0] * Math.sin(3 * g + d.p[0]) + d.a[1] * Math.sin(5 * g + d.p[1]) + d.a[2] * Math.sin(9 * g + d.p[2]));
    s = Math.max(s, r - Math.hypot(dx, dy));
  }
  for (const [i, j] of CAU_NOI) {
    const a = DAO[i]!, b = DAO[j]!;
    const vx = b.x - a.x, vy = b.y - a.y;
    const t = Math.max(0, Math.min(1, ((x - a.x) * vx + (y - a.y) * vy) / (vx * vx + vy * vy)));
    // Dải cát hơi cong (lệch ngang theo hình sin) cho đỡ thẳng đuột
    const L = Math.hypot(vx, vy);
    const lech = Math.sin(t * Math.PI) * 140 * ((i + j) % 2 ? 1 : -1);
    const px = a.x + vx * t - (vy / L) * lech, py = a.y + vy * t + (vx / L) * lech;
    s = maxMem(s, NUA_RONG_NOI - Math.hypot(x - px, y - py), 220);
  }
  return s;
}

// Lưới khoảng cách (nội suy song tuyến) dùng chung cho vẽ và cho lưới đi được
const MAP = 6400;
const O_SAU = 16;
const N_SAU = MAP / O_SAU + 1;
let luoiSau: Float32Array | null = null;
function layLuoiSau(): Float32Array {
  if (luoiSau) return luoiSau;
  luoiSau = new Float32Array(N_SAU * N_SAU);
  for (let j = 0; j < N_SAU; j++) {
    for (let i = 0; i < N_SAU; i++) {
      const x = i * O_SAU, y = j * O_SAU;
      // Bờ lượn sóng: nhiễu to (vịnh, mũi đất) + nhiễu nhỏ (khấc bờ)
      luoiSau[j * N_SAU + i] = doSauGoc(x, y) + (nhieu(x / 380, y / 380) - 0.5) * 150 + (nhieu(x / 95 + 50, y / 95) - 0.5) * 40;
    }
  }
  return luoiSau;
}

/** Khoảng cách có dấu tới bờ tại (x, y): dương = trên cát, âm = dưới biển */
export function doSau(x: number, y: number): number {
  const L = layLuoiSau();
  const fx = Math.max(0, Math.min(N_SAU - 1.001, x / O_SAU)), fy = Math.max(0, Math.min(N_SAU - 1.001, y / O_SAU));
  const i = Math.floor(fx), j = Math.floor(fy);
  const tx = fx - i, ty = fy - j;
  const k = j * N_SAU + i;
  const a = L[k]!, b = L[k + 1]!, c = L[k + N_SAU]!, d = L[k + N_SAU + 1]!;
  return (a + (b - a) * tx) * (1 - ty) + (c + (d - c) * tx) * ty;
}

// Lưới đi được: ô O_DI, đứng được khi chân cách mép nước ít nhất BIEN_DI; ô dưới nước nhớ ô đi được gần nhất
const O_DI = 32;
const N_DI = MAP / O_DI;
const BIEN_DI = 30;
let diDuoc: Uint8Array | null = null;
let ganNhat: Int32Array | null = null;
function layLuoiDi(): { di: Uint8Array; gan: Int32Array } {
  if (diDuoc && ganNhat) return { di: diDuoc, gan: ganNhat };
  const di = new Uint8Array(N_DI * N_DI);
  const gan = new Int32Array(N_DI * N_DI).fill(-1);
  const hang: number[] = [];
  for (let j = 0; j < N_DI; j++) {
    for (let i = 0; i < N_DI; i++) {
      const k = j * N_DI + i;
      if (doSau((i + 0.5) * O_DI, (j + 0.5) * O_DI) > BIEN_DI) {
        di[k] = 1;
        gan[k] = k;
        hang.push(k);
      }
    }
  }
  // Loang từ mọi ô đi được, mỗi ô giữ nguồn gần nhất theo khoảng cách thật (xấp xỉ biến đổi khoảng cách)
  const kc = (a: number, b: number) => Math.hypot((a % N_DI) - (b % N_DI), Math.floor(a / N_DI) - Math.floor(b / N_DI));
  for (let h = 0; h < hang.length; h++) {
    const k = hang[h]!;
    const s = gan[k]!;
    const i = k % N_DI, j = Math.floor(k / N_DI);
    for (let dj = -1; dj <= 1; dj++) {
      for (let dx = -1; dx <= 1; dx++) {
        const ni = i + dx, nj = j + dj;
        if ((!dx && !dj) || ni < 0 || nj < 0 || ni >= N_DI || nj >= N_DI) continue;
        const n = nj * N_DI + ni;
        if (gan[n] === -1 || (!di[n] && kc(n, s) + 1e-6 < kc(n, gan[n]!))) {
          const moi = gan[n] === -1;
          gan[n] = s;
          if (moi) hang.push(n);
        }
      }
    }
  }
  diDuoc = di;
  ganNhat = gan;
  return { di, gan };
}

/** Điểm (x, y) đứng được trên cát (không dưới biển) */
export function laDat(x: number, y: number): boolean {
  const { di } = layLuoiDi();
  const i = Math.floor(x / O_DI), j = Math.floor(y / O_DI);
  if (i < 0 || j < 0 || i >= N_DI || j >= N_DI) return false;
  return di[j * N_DI + i] === 1;
}

/** Vật đang đứng dưới biển thì đẩy lên ô cát gần nhất (trượt dọc bờ); trả về cờ bị đẩy theo từng trục */
export function veDat(o: { x: number; y: number }): { cx: boolean; cy: boolean } {
  const { di, gan } = layLuoiDi();
  const i = Math.max(0, Math.min(N_DI - 1, Math.floor(o.x / O_DI)));
  const j = Math.max(0, Math.min(N_DI - 1, Math.floor(o.y / O_DI)));
  const k = j * N_DI + i;
  if (di[k]) return { cx: false, cy: false };
  const t = gan[k]!;
  if (t < 0) return { cx: false, cy: false };
  const x0 = (t % N_DI) * O_DI, y0 = Math.floor(t / N_DI) * O_DI;
  const x = Math.max(x0 + 1, Math.min(x0 + O_DI - 1, o.x));
  const y = Math.max(y0 + 1, Math.min(y0 + O_DI - 1, o.y));
  const r = { cx: x !== o.x, cy: y !== o.y };
  o.x = x;
  o.y = y;
  return r;
}

/** Số đảo và đảo gần điểm (x, y) nhất (tính theo mép đảo; điểm trên dải cát thuộc đảo gần hơn) */
export const SO_DAO = DAO.length;
export function daoCua(x: number, y: number): number {
  let k = 0, gan = Infinity;
  DAO.forEach((d, i) => {
    const v = Math.hypot(x - d.x, y - d.y) - d.r;
    if (v < gan) { gan = v; k = i; }
  });
  return k;
}

/** Tính trước lưới (gọi lúc chọn bản đồ để khung hình đầu không bị khựng) */
export function chuanBiSaMac(): void {
  layLuoiDi();
}
