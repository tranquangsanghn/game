// Bản đồ "Đảo sa mạc": nguyên map đồng cỏ (vườn gà, 0..VUON, có tường gạch) nằm giữa biển; quanh nó là 5 đảo cát
// xếp thành vòng tròn, mỗi đảo nối với 2 đảo bên cạnh bằng dải cát. Vườn gà không nối với đảo nào: nhân vật không vào được, gà không ra được.
// Chỉ có dữ liệu / logic (không đụng canvas): `doSau()` = khoảng cách có dấu tới bờ đảo (dương = cát, âm = biển, đơn vị thế giới),
// lưới đi được để đẩy vật đang đứng dưới nước lên bờ gần nhất (`veDat()`). Phần vẽ nằm trong ve-canvas.ts.

export type LoaiBanDo = 'co' | 'sa';

/** Cỡ vườn gà (= map đồng cỏ), đặt ở 0..VUON */
export const VUON = 6400;
const TAM = VUON / 2;
/** Biển rộng tối thiểu giữa tường vườn gà và mép đảo (xa hơn tầm nhìn / tầm đánh / tầm ngửi của gà) */
const CACH_VUON = 2200;

/** Đảo: tâm, bán kính gốc, độ méo bờ (các sóng sin theo góc) */
interface Dao { x: number; y: number; r: number; a: [number, number, number]; p: [number, number, number] }

// Diện tích: đảo thường ≈ 2/3 vườn gà, đảo lớn nhất (đảo 0, phía dưới, chỗ xuất phát) ≈ 1,5 vườn gà
const R_THUONG = Math.sqrt(((2 / 3) * VUON * VUON) / Math.PI);
const R_LON = Math.sqrt((1.5 * VUON * VUON) / Math.PI);
// Nửa đường chéo vườn: đảo đặt đủ xa để góc vườn vẫn cách mép đảo CACH_VUON
const NUA_CHEO = TAM * Math.SQRT2;
const MEO: { a: [number, number, number]; p: [number, number, number] }[] = [
  { a: [0.06, 0.05, 0.025], p: [0.4, 2.1, 4.0] },
  { a: [0.08, 0.05, 0.03], p: [1.3, 0.2, 2.7] },
  { a: [0.07, 0.06, 0.03], p: [2.2, 3.1, 0.9] },
  { a: [0.09, 0.05, 0.03], p: [0.1, 1.7, 3.3] },
  { a: [0.07, 0.06, 0.025], p: [3.5, 0.6, 1.9] },
];
export const DAO: Dao[] = MEO.map((m, i) => {
  const r = i === 0 ? R_LON : R_THUONG;
  const d = NUA_CHEO + CACH_VUON + r * 1.2;
  const g = Math.PI / 2 + (i * 2 * Math.PI) / 5; // đảo 0 ở dưới vườn, rồi xoay vòng 72°
  return { x: TAM + Math.cos(g) * d, y: TAM + Math.sin(g) * d, r, a: m.a, p: m.p };
});
export const SO_DAO = DAO.length;
/** Chỗ xuất phát của nhân vật: giữa đảo lớn nhất */
export const XUAT_PHAT = { x: DAO[0]!.x, y: DAO[0]!.y };
/** Dải cát nối thành vòng: mỗi đảo nối với 2 đảo bên cạnh */
const CAU_NOI: [number, number][] = DAO.map((_, i) => [i, (i + 1) % DAO.length]);
/** Nửa bề rộng dải cát nối */
const NUA_RONG_NOI = 260;

/** Giới hạn thế giới (bao hết các đảo + một dải biển) */
const LE_BIEN = 1400;
export const TG = (() => {
  let x0 = 0, y0 = 0, x1 = VUON, y1 = VUON;
  for (const d of DAO) {
    x0 = Math.min(x0, d.x - d.r * 1.25); x1 = Math.max(x1, d.x + d.r * 1.25);
    y0 = Math.min(y0, d.y - d.r * 1.25); y1 = Math.max(y1, d.y + d.r * 1.25);
  }
  const o = 400;
  return {
    x0: Math.floor((x0 - LE_BIEN) / o) * o, y0: Math.floor((y0 - LE_BIEN) / o) * o,
    x1: Math.ceil((x1 + LE_BIEN) / o) * o, y1: Math.ceil((y1 + LE_BIEN) / o) * o,
  };
})();

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
/** Số ngẫu nhiên 0..1 cố định theo điểm (lấp lánh trên biển) */
export const bamDiem = bam;

// Hợp mềm hai vùng (max mềm) để chỗ dải cát nối vào đảo loe ra tự nhiên
const maxMem = (a: number, b: number, k: number) => {
  const h = Math.max(k - Math.abs(a - b), 0) / k;
  return Math.max(a, b) + (h * h * k) / 4;
};

/** Khoảng cách có dấu tới bờ: đảo (nhiễu to cho bờ lượn) và dải cát nối (nhiễu nhỏ để không bị đứt) hợp mềm với nhau */
function doSauGoc(x: number, y: number): number {
  let s = -1e9;
  for (const d of DAO) {
    const dx = x - d.x, dy = y - d.y;
    const kc = Math.hypot(dx, dy);
    // Quá xa đảo này (kể cả độ méo) thì bỏ qua, đỡ tính atan2
    if (d.r * 1.25 - kc < s) continue;
    const g = Math.atan2(dy, dx);
    const r = d.r * (1 + d.a[0] * Math.sin(3 * g + d.p[0]) + d.a[1] * Math.sin(5 * g + d.p[1]) + d.a[2] * Math.sin(9 * g + d.p[2]));
    s = Math.max(s, r - kc);
  }
  if (s > -2000) s += (nhieu(x / 1100, y / 1100) - 0.5) * 600 + (nhieu(x / 380 + 20, y / 380) - 0.5) * 180;
  let noi = -1e9;
  for (const [i, j] of CAU_NOI) {
    const a = DAO[i]!, b = DAO[j]!;
    const vx = b.x - a.x, vy = b.y - a.y;
    const t = Math.max(0, Math.min(1, ((x - a.x) * vx + (y - a.y) * vy) / (vx * vx + vy * vy)));
    // Dải cát cong ra phía ngoài vòng (xa vườn gà) cho giống vành tròn
    const mx = (a.x + b.x) / 2 - TAM, my = (a.y + b.y) / 2 - TAM;
    const ml = Math.hypot(mx, my);
    const lech = Math.sin(t * Math.PI) * 900 + Math.sin(t * Math.PI * 3) * 120;
    const px = a.x + vx * t + (mx / ml) * lech, py = a.y + vy * t + (my / ml) * lech;
    noi = Math.max(noi, NUA_RONG_NOI - Math.hypot(x - px, y - py));
  }
  if (noi > -2000) noi += (nhieu(x / 500 + 7, y / 500) - 0.5) * 90;
  return maxMem(s, noi, 380);
}

/** Khoảng cách tới vườn gà (âm ngoài vườn, đơn vị thế giới): chỉ để tô biển nông / bọt quanh tường */
export function doSauVuon(x: number, y: number): number {
  const dx = Math.max(-x, 0, x - VUON), dy = Math.max(-y, 0, y - VUON);
  return -Math.hypot(dx, dy);
}

/** Điểm nằm trong vườn gà (kể cả tường) */
export const trongVuon = (x: number, y: number) => x >= 0 && y >= 0 && x <= VUON && y <= VUON;

// Lưới khoảng cách (nội suy song tuyến) dùng chung cho vẽ và cho lưới đi được
const O_SAU = 40;
const NX_SAU = (TG.x1 - TG.x0) / O_SAU + 1;
const NY_SAU = (TG.y1 - TG.y0) / O_SAU + 1;
let luoiSau: Float32Array | null = null;
function layLuoiSau(): Float32Array {
  if (luoiSau) return luoiSau;
  luoiSau = new Float32Array(NX_SAU * NY_SAU);
  for (let j = 0; j < NY_SAU; j++) {
    for (let i = 0; i < NX_SAU; i++) {
      const x = TG.x0 + i * O_SAU, y = TG.y0 + j * O_SAU;
      // Cộng thêm nhiễu nhỏ (khấc bờ)
      luoiSau[j * NX_SAU + i] = doSauGoc(x, y) + (nhieu(x / 130 + 50, y / 130) - 0.5) * 40;
    }
  }
  return luoiSau;
}

/** Khoảng cách có dấu tới bờ đảo tại (x, y): dương = trên cát, âm = dưới biển (vườn gà tính là biển) */
export function doSau(x: number, y: number): number {
  const L = layLuoiSau();
  const fx = Math.max(0, Math.min(NX_SAU - 1.001, (x - TG.x0) / O_SAU)), fy = Math.max(0, Math.min(NY_SAU - 1.001, (y - TG.y0) / O_SAU));
  const i = Math.floor(fx), j = Math.floor(fy);
  const tx = fx - i, ty = fy - j;
  const k = j * NX_SAU + i;
  const a = L[k]!, b = L[k + 1]!, c = L[k + NX_SAU]!, d = L[k + NX_SAU + 1]!;
  return (a + (b - a) * tx) * (1 - ty) + (c + (d - c) * tx) * ty;
}

// Lưới đi được: ô O_DI, đứng được khi chân cách mép nước ít nhất BIEN_DI; ô dưới nước nhớ ô đi được gần nhất
const O_DI = 40;
const NX_DI = (TG.x1 - TG.x0) / O_DI;
const NY_DI = (TG.y1 - TG.y0) / O_DI;
const BIEN_DI = 36;
let diDuoc: Uint8Array | null = null;
let ganNhat: Int32Array | null = null;
function layLuoiDi(): { di: Uint8Array; gan: Int32Array } {
  if (diDuoc && ganNhat) return { di: diDuoc, gan: ganNhat };
  const N = NX_DI * NY_DI;
  const di = new Uint8Array(N);
  const gan = new Int32Array(N).fill(-1);
  const hang = new Int32Array(N);
  let cuoi = 0;
  for (let j = 0; j < NY_DI; j++) {
    for (let i = 0; i < NX_DI; i++) {
      const k = j * NX_DI + i;
      if (doSau(TG.x0 + (i + 0.5) * O_DI, TG.y0 + (j + 0.5) * O_DI) > BIEN_DI) {
        di[k] = 1;
        gan[k] = k;
        hang[cuoi++] = k;
      }
    }
  }
  // Loang từ mọi ô đi được, mỗi ô giữ nguồn gần nhất theo khoảng cách thật (xấp xỉ biến đổi khoảng cách)
  const kc2 = (a: number, b: number) => {
    const dx = (a % NX_DI) - (b % NX_DI), dy = ((a / NX_DI) | 0) - ((b / NX_DI) | 0);
    return dx * dx + dy * dy;
  };
  for (let h = 0; h < cuoi; h++) {
    const k = hang[h]!;
    const s = gan[k]!;
    const i = k % NX_DI, j = (k / NX_DI) | 0;
    for (let dj = -1; dj <= 1; dj++) {
      for (let dx = -1; dx <= 1; dx++) {
        const ni = i + dx, nj = j + dj;
        if ((!dx && !dj) || ni < 0 || nj < 0 || ni >= NX_DI || nj >= NY_DI) continue;
        const n = nj * NX_DI + ni;
        if (gan[n] === -1) {
          gan[n] = s;
          hang[cuoi++] = n;
        } else if (!di[n] && kc2(n, s) < kc2(n, gan[n]!)) gan[n] = s;
      }
    }
  }
  diDuoc = di;
  ganNhat = gan;
  return { di, gan };
}

/** Vật đang đứng dưới biển (hoặc trong vườn gà) thì đẩy lên ô cát gần nhất (trượt dọc bờ); trả về cờ bị đẩy theo từng trục */
export function veDat(o: { x: number; y: number }): { cx: boolean; cy: boolean } {
  const { di, gan } = layLuoiDi();
  const i = Math.max(0, Math.min(NX_DI - 1, Math.floor((o.x - TG.x0) / O_DI)));
  const j = Math.max(0, Math.min(NY_DI - 1, Math.floor((o.y - TG.y0) / O_DI)));
  const k = j * NX_DI + i;
  if (di[k]) return { cx: false, cy: false };
  const t = gan[k]!;
  if (t < 0) return { cx: false, cy: false };
  const x0 = TG.x0 + (t % NX_DI) * O_DI, y0 = TG.y0 + ((t / NX_DI) | 0) * O_DI;
  const x = Math.max(x0 + 1, Math.min(x0 + O_DI - 1, o.x));
  const y = Math.max(y0 + 1, Math.min(y0 + O_DI - 1, o.y));
  const r = { cx: x !== o.x, cy: y !== o.y };
  o.x = x;
  o.y = y;
  return r;
}

/** Đảo gần điểm (x, y) nhất (tính theo mép đảo; điểm trên dải cát thuộc đảo gần hơn) */
export function daoCua(x: number, y: number): number {
  let k = 0, gan = Infinity;
  DAO.forEach((d, i) => {
    const v = Math.hypot(x - d.x, y - d.y) - d.r;
    if (v < gan) { gan = v; k = i; }
  });
  return k;
}

/** Tính trước lưới (nặng, chỉ một lần): gọi sớm để vào ván không bị khựng */
export function chuanBiSaMac(): void {
  layLuoiDi();
}

/** Điểm ngẫu nhiên trên cát của đảo `i`, cách bờ ít nhất `cachBo` (thử nhiều lần; không được thì lấy tâm đảo) */
export function diemTrenDao(i: number, cachBo = 300): { x: number; y: number } {
  const d = DAO[i]!;
  for (let k = 0; k < 200; k++) {
    const g = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random()) * d.r * 0.75;
    const x = d.x + Math.cos(g) * r, y = d.y + Math.sin(g) * r;
    if (doSau(x, y) > cachBo && daoCua(x, y) === i) return { x, y };
  }
  return { x: d.x, y: d.y };
}

/** Đường bờ đảo (mức doSau = 0) dạng các vòng khép kín [x0, y0, x1, y1, …], tính một lần bằng marching squares trên lưới
 *  khoảng cách rồi lược bớt điểm (sai lệch ≤ LUOC). Bộ vẽ dựng Path2D một lần từ đây rồi chỉ fill / stroke: rẻ hơn hẳn dựng ảnh mảnh. */
const LUOC = 6;
let duongBoCache: number[][] | null = null;
export function duongBo(): number[][] {
  if (duongBoCache) return duongBoCache;
  const L = layLuoiSau();
  const NX = NX_SAU, NY = NY_SAU;
  // Điểm cắt trên cạnh: cạnh ngang (i,j)-(i+1,j) khoá 2·k, cạnh dọc (i,j)-(i,j+1) khoá 2·k+1
  const diem = new Map<number, [number, number]>();
  const cat = (khoa: number): number => {
    if (!diem.has(khoa)) {
      const k = khoa >> 1, i = k % NX, j = (k - i) / NX;
      const a = L[k]!, b = (khoa & 1) ? L[k + NX]! : L[k + 1]!;
      const t = a / (a - b);
      diem.set(khoa, (khoa & 1) ? [TG.x0 + i * O_SAU, TG.y0 + (j + t) * O_SAU] : [TG.x0 + (i + t) * O_SAU, TG.y0 + j * O_SAU]);
    }
    return khoa;
  };
  // Mỗi đoạn đi từ điểm vào tới điểm ra, đất bên tay trái (hướng nhất quán nên các vòng tự nối)
  const tiep = new Map<number, number>();
  for (let j = 0; j < NY - 1; j++) {
    for (let i = 0; i < NX - 1; i++) {
      const k = j * NX + i;
      const a = L[k]! >= 0, b = L[k + 1]! >= 0, c = L[k + NX + 1]! >= 0, d = L[k + NX]! >= 0;
      const ma = (a ? 1 : 0) | (b ? 2 : 0) | (c ? 4 : 0) | (d ? 8 : 0);
      if (ma === 0 || ma === 15) continue;
      const T = 2 * k, R = 2 * (k + 1) + 1, B = 2 * (k + NX), Lf = 2 * k + 1;
      const noi = (u: number, v: number) => tiep.set(cat(u), cat(v));
      switch (ma) {
        case 1: noi(Lf, T); break;
        case 2: noi(T, R); break;
        case 3: noi(Lf, R); break;
        case 4: noi(R, B); break;
        case 5: noi(Lf, T); noi(R, B); break;
        case 6: noi(T, B); break;
        case 7: noi(Lf, B); break;
        case 8: noi(B, Lf); break;
        case 9: noi(B, T); break;
        case 10: noi(T, R); noi(B, Lf); break;
        case 11: noi(B, R); break;
        case 12: noi(R, Lf); break;
        case 13: noi(R, T); break;
        case 14: noi(T, Lf); break;
      }
    }
  }
  const vong: number[][] = [];
  const daDi = new Set<number>();
  for (const dau of tiep.keys()) {
    if (daDi.has(dau)) continue;
    const pts: [number, number][] = [];
    let k: number | undefined = dau;
    while (k !== undefined && !daDi.has(k)) {
      daDi.add(k);
      pts.push(diem.get(k)!);
      k = tiep.get(k);
    }
    if (pts.length < 8) continue;
    vong.push(luocDiem(pts));
  }
  duongBoCache = vong;
  return vong;
}

/** Lược điểm thừa (Douglas–Peucker) của một vòng khép kín */
function luocDiem(p: [number, number][]): number[] {
  const giu = new Uint8Array(p.length);
  const xet = (a: number, b: number) => {
    const st: [number, number][] = [[a, b]];
    while (st.length) {
      const [u, v] = st.pop()!;
      const [ax, ay] = p[u]!, [bx, by] = p[v]!;
      const dx = bx - ax, dy = by - ay, l = Math.hypot(dx, dy) || 1;
      let xa = -1, xk = LUOC;
      for (let i = u + 1; i < v; i++) {
        const e = Math.abs((p[i]![0] - ax) * dy - (p[i]![1] - ay) * dx) / l;
        if (e > xk) { xk = e; xa = i; }
      }
      if (xa >= 0) { giu[xa] = 1; st.push([u, xa], [xa, v]); }
    }
  };
  const giua = p.length >> 1;
  giu[0] = giu[giua] = 1;
  xet(0, giua);
  // Nửa sau: nối về điểm đầu
  p.push(p[0]!);
  xet(giua, p.length - 1);
  p.pop();
  const kq: number[] = [];
  p.forEach((q, i) => { if (giu[i]) kq.push(q[0], q[1]); });
  return kq;
}
