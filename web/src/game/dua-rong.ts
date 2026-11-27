// Map đua rồng (Long Mạch): 6 rồng bay trên thân Cổ Long từ đuôi lên đầu, 6 luồng song song như đường chạy điền kinh.
// Chỉ có logic (không vẽ): Game tạo DuaRong khi cả đội đã nhập vào tượng rồng trên thần điện, mỗi khung gọi capNhat(dt, nhap),
// bộ vẽ ve-dua-rong.ts đọc dữ liệu ra vẽ. Toạ độ đường đua: s = quãng đã bay dọc thân rồng (0 = chóp đuôi, DUONG_DAI = viên ngọc trong miệng),
// u = vị trí ngang tính theo luồng (0..5, số thực khi đang đổi luồng). Xem mục "Nguyên tắc đua rồng" trong CLAUDE.md.

/** Số luồng bay */
export const SO_LUONG = 6;
/** Bề rộng một luồng (đơn vị đường đua) */
export const LW = 120;
/** Tốc độ tối đa của rồng chỉ số Tốc độ 3 (đơn vị / giây) */
export const V_CHUAN = 950;
/** Chiều dài đường đua: rồng tốc độ 3 bay tối đa suốt trận mất 180 giây */
export const DUONG_DAI = V_CHUAN * 180;
/** Nửa thân rồng dọc theo đường đua (va chạm) */
export const R_RONG = 45;
/** Đếm ngược trước khi bay (giây) */
export const DEM_NGUOC = 3;
/** Thời gian chờ hồi sinh (giây) */
export const HOI_SINH = 5;
/** Tim tối đa */
export const TIM_MAX = 3;
/** Tốc độ khi thả cần (phần của tốc độ tối đa) */
const TOC_THA = 0.6;
/** Tốc độ chậm nhất khi đẩy ngược */
const TOC_MIN = 0.3;
/** Trên mức này mà đâm vật chắn luồng thì chết, dưới thì chỉ khựng lại */
export const TOC_CHET = 0.5;
/** Long Khí: vượt tốc độ tối đa thêm 30% trong 10 giây */
const LONG_KHI_T = 10;
const LONG_KHI_HE = 1.3;
const KHIEN_T = 8;
/** Mỗi VAY_MOI vảy vàng cộng 1% tốc độ tối đa, tối đa VAY_TRAN lần */
export const VAY_MOI = 10;
const VAY_TRAN = 10;
/** Bắn hạ quái bay ngược: thưởng vảy, giảm hồi chiêu mọi skill */
const THUONG_VAY = 5;
const THUONG_HOI = 3;

/** Chặng theo giây (bay tối đa tốc độ chuẩn): Đuôi 0–30 · Bụng 30–70 · Lưng Vảy 70–110 · Cổ 110–150 · Đầu 150–180 */
export const CHANG: { ten: string; s0: number; s1: number }[] = [
  { ten: 'Đuôi Rồng', s0: 0, s1: 30 },
  { ten: 'Bụng Rồng', s0: 30, s1: 70 },
  { ten: 'Lưng Vảy', s0: 70, s1: 110 },
  { ten: 'Cổ Rồng', s0: 110, s1: 150 },
  { ten: 'Đầu Rồng', s0: 150, s1: 180 },
].map((c) => ({ ten: c.ten, s0: (c.s0 / 180) * DUONG_DAI, s1: (c.s1 / 180) * DUONG_DAI }));

export const changCua = (s: number): number => {
  for (let i = CHANG.length - 1; i > 0; i--) if (s >= CHANG[i]!.s0) return i;
  return 0;
};

/** Đường tâm thân rồng uốn lượn (toạ độ ngang của tâm đường đua tại s) */
export const tamDuong = (s: number): number => 260 * Math.sin(s / 3300) + 120 * Math.sin(s / 1270 + 1.3);
/** Toạ độ ngang của vị trí u (luồng) tại s */
export const xLuong = (s: number, u: number): number => tamDuong(s) + (u - (SO_LUONG - 1) / 2) * LW;

// ─── Dữ liệu 6 con rồng ───

export interface SkillDl { ten: string; icon: string; hoi: number }
export interface RongDl {
  ten: string; loai: string; mau: string; mau2: string;
  /** Chỉ số 1–5: tốc độ tối đa · tăng tốc · phanh · điều khiển (đổi luồng) · tấn công */
  toc: number; tang: number; phanh: number; dk: number; tc: number;
  tim: number;
  skill: [SkillDl, SkillDl, SkillDl];
}

export const RONG: RongDl[] = [
  { ten: 'Xích Viêm', loai: 'Hỏa Long', mau: '#e8412c', mau2: '#ffb347', toc: 3, tang: 3, phanh: 3, dk: 3, tc: 5, tim: 1,
    skill: [{ ten: 'Phun Lửa', icon: '🔥', hoi: 6 }, { ten: 'Trứng Nổ', icon: '🥚', hoi: 12 }, { ten: 'Hỏa Thân', icon: '☄️', hoi: 20 }] },
  { ten: 'Thanh Phong', loai: 'Phong Long', mau: '#22c3a0', mau2: '#c8fff0', toc: 5, tang: 4, phanh: 1, dk: 2, tc: 2, tim: 1,
    skill: [{ ten: 'Lướt Gió', icon: '💨', hoi: 5 }, { ten: 'Lốc Xoáy', icon: '🌪️', hoi: 14 }, { ten: 'Cưỡi Gió', icon: '🍃', hoi: 18 }] },
  { ten: 'Hàn Tuyết', loai: 'Băng Long', mau: '#a8e4ff', mau2: '#ffffff', toc: 3, tang: 2, phanh: 4, dk: 4, tc: 3, tim: 1,
    skill: [{ ten: 'Băng Tiễn', icon: '🏹', hoi: 7 }, { ten: 'Đóng Băng', icon: '❄️', hoi: 16 }, { ten: 'Tường Băng', icon: '🧊', hoi: 20 }] },
  { ten: 'Thiên Lôi', loai: 'Lôi Long', mau: '#9b5cff', mau2: '#fff27a', toc: 4, tang: 5, phanh: 3, dk: 3, tc: 3, tim: 1,
    skill: [{ ten: 'Chớp Giật', icon: '⚡', hoi: 8 }, { ten: 'Nam Châm Điện', icon: '🧲', hoi: 15 }, { ten: 'Lôi Cầu', icon: '🔮', hoi: 15 }] },
  { ten: 'Thạch Giáp', loai: 'Nham Long', mau: '#a0703f', mau2: '#e0c090', toc: 2, tang: 2, phanh: 4, dk: 2, tc: 4, tim: 2,
    skill: [{ ten: 'Húc Đá', icon: '🐏', hoi: 6 }, { ten: 'Giáp Đá', icon: '🛡️', hoi: 15 }, { ten: 'Mưa Đá', icon: '🪨', hoi: 20 }] },
  { ten: 'Lam Hải', loai: 'Thủy Long', mau: '#2b7bff', mau2: '#9fe8ff', toc: 3, tang: 3, phanh: 4, dk: 5, tc: 2, tim: 1,
    skill: [{ ten: 'Bọt Nước', icon: '🫧', hoi: 8 }, { ten: 'Hồi Thủy', icon: '💧', hoi: 25 }, { ten: 'Bom Mây', icon: '☁️', hoi: 18 }] },
];

/** Tốc độ tối đa (đơn vị / giây) theo chỉ số */
export const vMax = (d: RongDl): number => 800 + 50 * d.toc;
/** Tăng tốc / phanh: phần tốc độ tối đa mỗi giây */
const tangToc = (d: RongDl): number => 0.18 + 0.1 * d.tang;
const phanhToc = (d: RongDl): number => 0.15 + 0.2 * d.phanh;
/** Đổi luồng: số luồng mỗi giây */
const doiLuongToc = (d: RongDl): number => 2.5 + d.dk;

// ─── Vật phẩm ───

export type LoaiVp = 'khien' | 'longKhi' | 'hoaCau' | 'tim' | 'thienLoi';
export const VP_TEN: Record<LoaiVp, string> = { khien: 'Khiên Vảy', longKhi: 'Long Khí', hoaCau: 'Hỏa Cầu', tim: 'Tim Rồng', thienLoi: 'Thiên Lôi' };
export const VP_ICON: Record<LoaiVp, string> = { khien: '🛡️', longKhi: '💨', hoaCau: '🔥', tim: '❤️', thienLoi: '⚡' };
/** Hàng 6 ô vật phẩm ngang đường, mỗi luồng một ô; null = ô đã bị lấy (vỡ) */
export interface HangVp { s: number; o: (LoaiVp | null)[] }

// ─── Chướng ngại vật ───

export type LoaiCn =
  | 'da' // đá vụn: chậm 1 giây
  | 'thach' // thiên thạch (2 luồng): mất 1 tim
  | 'chan' // vật chắn luồng (nhũ đá / gai xương): đâm nhanh thì chết, chậm thì khựng
  | 'vach' // vách dài chắn luồng mép (Cổ Rồng co lại)
  | 'lua' // cột lửa phun từ vảy theo nhịp
  | 'ran' | 'gai' // quái hai bên: rắn vảy / cây gai, đánh 2 luồng mép theo nhịp
  | 'xuctu' // xúc tu mây: quấn, chậm 2 giây
  | 'doi' | 'ung' | 'ma' // quái bay ngược: dơi lửa / chim ưng đá / ma rồng (bắn cầu tối)
  | 'trung' | 'loc' | 'tuongBang'; // do skill tạo ra: trứng nổ / lốc xoáy / tường băng

export interface ChuongNgai {
  id: number; loai: LoaiCn;
  /** Mép sau (phía đuôi) theo s, chiều dài dọc đường */
  s: number; dai: number;
  /** Luồng đầu và số luồng chiếm */
  l: number; w: number;
  /** Lệch pha nhịp (cột lửa, quái hai bên), giây */
  pha: number;
  /** Quái hai bên: -1 trái, 1 phải */
  ben: number;
  song: boolean;
  /** Quái bay ngược: đã thức dậy, tốc độ dọc s (âm = bay về phía đuôi), đếm giờ báo hiệu / bắn */
  kich: boolean; vs: number; tg: number;
  /** Rồng tạo ra (skill) và giờ hết hạn (theo đồng hồ trận), -1 = không */
  chu: number; het: number;
}

export type LoaiDan = 'hoaCau' | 'bangTien' | 'loiCau' | 'botNuoc' | 'cauToi';
export interface Dan { id: number; loai: LoaiDan; s: number; u: number; v: number; chu: number; muc: number; con: number }

export type LoaiHieu = 'no' | 'set' | 'phun' | 'bang' | 'luot' | 'chop' | 'khien' | 'roi' | 'hoiSinh' | 'tim' | 'vay';
export interface HieuUng { loai: LoaiHieu; s: number; u: number; t: number; dai: number; mau?: string; u2?: number; s2?: number }
export interface ChuBay { s: number; u: number; text: string; mau: string; t: number; p: number }

/** Một con rồng trong trận */
export interface Rong {
  id: number; dl: RongDl; ki: number;
  /** Người điều khiển: 0 / 1 = người chơi (tay cầm), -1 = máy */
  nguoi: number;
  ten: string;
  s: number; u: number; luong: number;
  /** Tốc độ hiện tại (phần của tốc độ tối đa, Long Khí vượt 1) */
  toc: number;
  tim: number; vp: LoaiVp | null; vay: number;
  hoi: [number, number, number];
  /** Đếm ngược hồi sinh (> 0 = đang chết), đang rơi xuống vực (giây đã rơi, -1 = không) */
  chet: number; roi: number; roiHuong: number;
  /** Giờ về đích (giây của trận), -1 = chưa */
  xong: number;
  /** Chậm: còn bao lâu, trần tốc độ */
  cham: number; chamHe: number;
  dongBang: number; bong: number; mu: number; quan: number;
  khien: number; giap: number; longKhi: number; cuoiGio: number; hoaThan: number; namCham: number; huc: number;
  /** Chỗ đã trúng (khoá va chạm lặp với cùng chướng ngại / quái / rồng), id → giờ hết khoá */
  va: Map<number, number>;
  /** Hàng vật phẩm đã đi qua (chỉ số hàng) */
  daQua: number;
  /** Đổi luồng bằng tay cầm: hướng đang giữ và giờ được lặp lại */
  ctlCu: number; ctlLap: number; huongCuoi: number;
  /** Vừa trúng đòn (nháy đỏ) */
  trung: number;
  /** Máy: tốc độ ưa thích, giờ quyết định kế tiếp, luồng muốn tới, giờ dùng vật phẩm */
  aiToc: number; aiNghi: number; aiLuong: number; aiVp: number; aiSkill: number;
  hang: number;
}

/** Điều khiển của một người chơi trong khung này (Game đọc tay cầm rồi đưa vào) */
export interface NhapDua {
  /** Cần trái (đã trừ vùng chết) */
  x: number; y: number;
  /** Chữ thập: -1 / 0 / 1 */
  dx: number; dy: number;
  /** Nút vừa bấm ở khung này: A vật phẩm · X skill 1 · Y skill 2 · B skill 3 */
  a: boolean; xBam: boolean; yBam: boolean; b: boolean;
}

/** Biên hai bên đường: 'vach' = có vách (gạt ra ngoài thì suot vách, chậm) · 'ho' = hở (gạt ra ngoài là rơi xuống biển mây) */
export interface DoanBien { s0: number; s1: number; trai: 'vach' | 'ho'; phai: 'vach' | 'ho' }
/** Đoạn tách nhánh: luồng 0–2 (an toàn) và 3–5 (gió đẩy nhanh hơn nhưng nhiều chướng ngại) bị ngăn bởi vách giữa */
export interface DoanNhanh { s0: number; s1: number }

// Số ngẫu nhiên có hạt giống (mỗi trận một đường đua)
const taoNgauNhien = (hat: number) => () => {
  hat |= 0; hat = (hat + 0x6d2b79f5) | 0;
  let t = Math.imul(hat ^ (hat >>> 15), 1 | hat);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/** Chướng ngại cứng (đâm vào là khựng / chết) */
const cung = (c: ChuongNgai) => c.loai === 'chan' || c.loai === 'vach' || c.loai === 'tuongBang';
/** Quái bay ngược (bắn hạ được) */
export const quaiBay = (c: ChuongNgai) => c.loai === 'doi' || c.loai === 'ung' || c.loai === 'ma';

/** Nhịp quái hai bên (giây): nghỉ · báo hiệu · đánh */
export const BEN_CHU_KY = 2.6;
export const BEN_BAO = 0.9;
export const BEN_DANH = 1.6;
/** Nhịp cột lửa: báo hiệu · phun */
export const LUA_CHU_KY = 3.2;
export const LUA_BAO = 1.4;
export const LUA_PHUN = 2.3;
/** Chim ưng đá báo hiệu trước khi lao (giây) */
export const UNG_BAO = 1;

export const nhipBen = (c: ChuongNgai, t: number): number => (((t + c.pha) % BEN_CHU_KY) + BEN_CHU_KY) % BEN_CHU_KY;
export const nhipLua = (c: ChuongNgai, t: number): number => (((t + c.pha) % LUA_CHU_KY) + LUA_CHU_KY) % LUA_CHU_KY;

/** Rết Đá ở chặng Cổ Rồng: bò theo sau, đớp rồng nào chậm (mất 1 tim, mỗi rồng một lần) */
export interface RetDa { s: number; chay: boolean; xong: boolean; daDop: Set<number> }

export class DuaRong {
  /** Đồng hồ trận (giây, tính cả đếm ngược) */
  t = 0;
  /** Giây đếm ngược còn lại trước khi bay */
  dem = DEM_NGUOC;
  rong: Rong[] = [];
  cn: ChuongNgai[] = [];
  dan: Dan[] = [];
  hang: HangVp[] = [];
  vay: { s: number; l: number; an: boolean }[] = [];
  moc: number[] = [];
  bien: DoanBien[] = [];
  nhanh: DoanNhanh[] = [];
  hieu: HieuUng[] = [];
  chu: ChuBay[] = [];
  ret: RetDa;
  /** Gió Cổ Long thở: hệ số tốc độ hiện tại (1 = lặng) */
  gio = 1;
  /** Người chơi về đích trước (0 / 1), -1 = chưa ai */
  nguoiVe = -1;
  /** Rung tay cầm cần phát (Game lấy ra rồi xoá): người chơi, thời gian ms, độ mạnh */
  rung: { p: number; ms: number; manh: number }[] = [];
  private id = 1;
  private rnd: () => number;

  /** chon[p] = rồng người chơi p chọn (chỉ số RONG), -1 = không chơi; ten[p] = tên nhân vật */
  constructor(chon: number[], ten: string[], hat = Date.now()) {
    this.rnd = taoNgauNhien(hat);
    this.taoDuong();
    this.ret = { s: CHANG[3]!.s0 - 1500, chay: false, xong: false, daDop: new Set() };
    const nguoi = chon.map((ki, p) => ({ ki, p })).filter((x) => x.ki >= 0);
    const may = RONG.map((_, ki) => ki).filter((ki) => !nguoi.some((x) => x.ki === ki));
    const ds = [...nguoi.map((x) => ({ ki: x.ki, p: x.p })), ...may.map((ki) => ({ ki, p: -1 }))];
    // Xếp luồng xuất phát ngẫu nhiên
    const luong = [0, 1, 2, 3, 4, 5];
    for (let i = luong.length - 1; i > 0; i--) { const j = Math.floor(this.rnd() * (i + 1)); [luong[i], luong[j]] = [luong[j]!, luong[i]!]; }
    ds.forEach((x, i) => {
      const dl = RONG[x.ki]!;
      const l = luong[i]!;
      this.rong.push({
        id: this.id++, dl, ki: x.ki, nguoi: x.p, ten: x.p >= 0 ? ten[x.p] ?? dl.ten : dl.ten,
        s: 0, u: l, luong: l, toc: 0, tim: dl.tim, vp: null, vay: 0, hoi: [DEM_NGUOC, DEM_NGUOC, DEM_NGUOC],
        chet: 0, roi: -1, roiHuong: 0, xong: -1, cham: 0, chamHe: 1,
        dongBang: 0, bong: 0, mu: 0, quan: 0, khien: 0, giap: 0, longKhi: 0, cuoiGio: 0, hoaThan: 0, namCham: 0, huc: 0,
        va: new Map(), daQua: 0, ctlCu: 0, ctlLap: 0, huongCuoi: l < 3 ? 1 : -1, trung: 0,
        aiToc: 0.86 + this.rnd() * 0.09, aiNghi: 0, aiLuong: l, aiVp: 0, aiSkill: this.rnd(), hang: i + 1,
      });
    });
  }

  // ─── Dựng đường đua ───

  private taoDuong(): void {
    const L = DUONG_DAI, r = this.rnd;
    // Hàng vật phẩm: 2 hàng mỗi chặng
    for (const c of CHANG) for (const f of [0.3, 0.75]) this.hang.push({ s: Math.round(c.s0 + (c.s1 - c.s0) * f), o: this.taoHang() });
    // Điểm hồi sinh mỗi 1/36 đường (~5 giây bay)
    for (let i = 0; i < 36; i++) this.moc.push((i * L) / 36);
    // Biên hai bên: đoạn dài 2500–5000, đuôi hầu hết có vách, càng lên càng nhiều đoạn hở
    const tiLeHo = [0.15, 0.5, 0.4, 0.6, 0.5];
    for (let s = 0; s < L + 3000;) {
      const dai = 2500 + r() * 2500;
      const h = tiLeHo[changCua(s)]!;
      this.bien.push({ s0: s, s1: s + dai, trai: s < 2500 || r() > h ? 'vach' : 'ho', phai: s < 2500 || r() > h ? 'vach' : 'ho' });
      s += dai;
    }
    // Tách nhánh ở Bụng và Đầu
    const bung = CHANG[1]!, dau = CHANG[4]!, co = CHANG[3]!;
    this.nhanh.push({ s0: bung.s0 + (bung.s1 - bung.s0) * 0.42, s1: bung.s0 + (bung.s1 - bung.s0) * 0.42 + 5000 });
    this.nhanh.push({ s0: dau.s0 + (dau.s1 - dau.s0) * 0.38, s1: dau.s0 + (dau.s1 - dau.s0) * 0.38 + 4500 });
    // Cổ Rồng co lại: vách dài chắn luồng mép
    for (const f of [0.12, 0.52]) {
      const s0 = co.s0 + (co.s1 - co.s0) * f;
      this.themCn('vach', s0, 3200, 0, 1);
      this.themCn('vach', s0 + 400, 2800, 5, 1);
    }
    const tranh = (s: number): boolean =>
      this.hang.some((h) => Math.abs(h.s - s) < 550) ||
      this.moc.some((m) => s > m - 250 && s < m + 650) ||
      this.nhanh.some((n) => Math.abs(n.s0 - s) < 450) || s > L - 1800;
    const khoangCach = [[1300, 1900], [900, 1400], [800, 1200], [850, 1300], [800, 1150]];
    const loaiChang: [LoaiCn, number][][] = [
      [['da', 45], ['thach', 25], ['doi', 15], ['ran', 15]],
      [['chan', 35], ['da', 20], ['xuctu', 15], ['thach', 15], ['doi', 15]],
      [['chan', 35], ['lua', 25], ['ran', 8], ['gai', 7], ['ung', 10], ['da', 15]],
      [['chan', 25], ['thach', 20], ['ung', 15], ['ma', 10], ['lua', 15], ['doi', 15]],
      [['chan', 30], ['lua', 20], ['ma', 10], ['ung', 15], ['thach', 15], ['gai', 10]],
    ];
    const chonLoai = (ds: [LoaiCn, number][]): LoaiCn => {
      const tong = ds.reduce((a, b) => a + b[1], 0);
      let x = r() * tong;
      for (const [l, w] of ds) { x -= w; if (x < 0) return l; }
      return ds[0]![0];
    };
    for (let s = 2600; s < L - 1500;) {
      const c = changCua(s);
      const [a, b] = khoangCach[c]!;
      s += a + r() * (b - a);
      if (tranh(s)) continue;
      // Luồng bị vách Cổ chắn sẵn thì không đặt thêm ở đó
      const mo = [0, 1, 2, 3, 4, 5].filter((l) => !this.cn.some((x) => x.loai === 'vach' && (l >= x.l && l < x.l + x.w) && s > x.s - 300 && s < x.s + x.dai + 300));
      const nh = this.nhanh.find((n) => s >= n.s0 - 200 && s <= n.s1);
      // Trong đoạn tách nhánh: bên trái (an toàn) chỉ đôi khi có, bên phải dày hơn
      const chonLuong = (): number => {
        let ds = mo;
        if (nh) ds = r() < 0.75 ? mo.filter((l) => l >= 3) : mo.filter((l) => l < 3);
        return ds[Math.floor(r() * ds.length)] ?? 2;
      };
      const loai = chonLoai(loaiChang[c]!);
      if (loai === 'chan') {
        // Gai xương / nhũ đá: 1–2 luồng ở cùng hàng (Lưng Vảy hay có 2), luôn chừa ít nhất 3 luồng
        const so = c === 2 && r() < 0.55 ? 2 : 1;
        const da: number[] = [];
        for (let k = 0; k < so; k++) {
          const l = chonLuong();
          if (!da.includes(l)) { da.push(l); this.themCn('chan', s + k * 40, 70, l, 1); }
        }
      } else if (loai === 'thach') {
        const l = Math.max(0, Math.min(4, chonLuong()));
        this.themCn('thach', s, 160, l, 2);
      } else if (loai === 'ran' || loai === 'gai') {
        const ben = r() < 0.5 ? -1 : 1;
        const cn = this.themCn(loai, s, 140, ben < 0 ? 0 : 4, 2);
        cn.ben = ben;
        cn.pha = r() * BEN_CHU_KY;
      } else {
        const cn = this.themCn(loai, s, loai === 'lua' ? 110 : loai === 'da' ? 60 : 90, chonLuong(), 1);
        cn.pha = r() * LUA_CHU_KY;
        if (loai === 'da' && r() < 0.5) this.themCn('da', s + 120 + r() * 200, 60, chonLuong(), 1);
      }
    }
    // Vảy vàng: hàng 6 vảy dọc một luồng, rải đều
    for (let s = 1800; s < L - 1500; s += 1600 + r() * 1400) {
      const l = Math.floor(r() * SO_LUONG);
      for (let k = 0; k < 6; k++) this.vay.push({ s: s + k * 90, l, an: false });
    }
  }

  /** Một hàng 6 ô: 1 Khiên, 1 Long Khí, 2 Hỏa Cầu, 1 Tim Rồng, 1 ô đặc biệt (Thiên Lôi ở ~1/3 số hàng, còn lại Khiên / Hỏa Cầu), xáo trộn */
  private taoHang(): (LoaiVp | null)[] {
    const r = this.rnd;
    const o: LoaiVp[] = ['khien', 'longKhi', 'hoaCau', 'hoaCau', 'tim', r() < 0.34 ? 'thienLoi' : r() < 0.5 ? 'khien' : 'hoaCau'];
    for (let i = o.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [o[i], o[j]] = [o[j]!, o[i]!]; }
    return o;
  }

  private themCn(loai: LoaiCn, s: number, dai: number, l: number, w: number, chu = -1, song = -1): ChuongNgai {
    const c: ChuongNgai = { id: this.id++, loai, s, dai, l, w, pha: 0, ben: 0, song: true, kich: false, vs: 0, tg: 0, chu, het: song < 0 ? -1 : this.t + song };
    this.cn.push(c);
    return c;
  }

  // ─── Tra cứu ───

  bienTai(s: number): DoanBien {
    for (const b of this.bien) if (s >= b.s0 && s < b.s1) return b;
    return this.bien[this.bien.length - 1]!;
  }

  nhanhTai(s: number): DoanNhanh | null {
    for (const n of this.nhanh) if (s >= n.s0 && s <= n.s1) return n;
    return null;
  }

  /** Luồng (số nguyên) đang chiếm: đang đổi luồng giữa chừng thì chiếm cả hai */
  private chiem(r: Rong, l: number): boolean {
    return Math.abs(r.u - l) < 0.62;
  }

  private trongCn(r: Rong, c: ChuongNgai): boolean {
    for (let l = c.l; l < c.l + c.w; l++) if (this.chiem(r, l)) return true;
    return false;
  }

  /** Tốc độ tối đa của r (tính vảy vàng) */
  vToiDa(r: Rong): number {
    return vMax(r.dl) * (1 + Math.min(VAY_TRAN, Math.floor(r.vay / VAY_MOI)) / 100);
  }

  dangBay(r: Rong): boolean {
    return r.chet <= 0 && r.roi < 0 && r.xong < 0;
  }

  /** Rồng của người chơi p */
  cuaNguoi(p: number): Rong | undefined {
    return this.rong.find((r) => r.nguoi === p);
  }

  /** Hàng vật phẩm kế tiếp phía trước s (để vẽ sơ đồ luồng) */
  hangToi(s: number): HangVp | null {
    for (const h of this.hang) if (h.s > s) return h;
    return null;
  }

  // ─── Cập nhật ───

  capNhat(dt: number, nhap: (NhapDua | null)[]): void {
    this.t += dt;
    for (const h of this.hieu) h.t += dt;
    this.hieu = this.hieu.filter((h) => h.t < h.dai);
    for (const c of this.chu) c.t += dt;
    this.chu = this.chu.filter((c) => c.t < 1.4);
    if (this.dem > 0) {
      this.dem -= dt;
      return;
    }
    // Cổ Long thở: thở ra có gió đẩy, hít vào có gió ngược (nhịp 10 giây)
    const nhip = (this.t - DEM_NGUOC) % 10;
    this.gio = nhip < 3 ? 1.1 : nhip >= 6.5 && nhip < 9 ? 0.9 : 1;
    // Chướng ngại do skill hết hạn
    this.cn = this.cn.filter((c) => c.song && (c.het < 0 || this.t < c.het));
    for (const r of this.rong) {
      const n = r.nguoi >= 0 ? nhap[r.nguoi] ?? null : null;
      this.capNhatRong(r, dt, n);
    }
    this.capNhatQuai(dt);
    this.capNhatDan(dt);
    this.capNhatRet(dt);
    this.xepHang();
  }

  private xepHang(): void {
    const ds = [...this.rong].sort((a, b) => {
      if (a.xong >= 0 || b.xong >= 0) return (a.xong < 0 ? Infinity : a.xong) - (b.xong < 0 ? Infinity : b.xong);
      return b.s - a.s;
    });
    ds.forEach((r, i) => (r.hang = i + 1));
  }

  private capNhatRong(r: Rong, dt: number, n: NhapDua | null): void {
    r.trung = Math.max(0, r.trung - dt);
    if (r.xong >= 0) {
      r.toc = Math.max(0, r.toc - dt);
      return;
    }
    if (r.chet > 0) {
      r.chet -= dt;
      if (r.chet <= 0) this.hoiSinh(r);
      return;
    }
    if (r.roi >= 0) {
      r.roi += dt;
      r.u += r.roiHuong * dt * 1.2;
      if (r.roi > 0.8) this.chet(r);
      return;
    }
    for (let k = 0; k < 3; k++) r.hoi[k] = Math.max(0, r.hoi[k]! - dt);
    r.cham = Math.max(0, r.cham - dt);
    r.dongBang = Math.max(0, r.dongBang - dt);
    r.bong = Math.max(0, r.bong - dt);
    r.mu = Math.max(0, r.mu - dt);
    r.quan = Math.max(0, r.quan - dt);
    r.khien = Math.max(0, r.khien - dt);
    r.giap = Math.max(0, r.giap - dt);
    r.longKhi = Math.max(0, r.longKhi - dt);
    r.cuoiGio = Math.max(0, r.cuoiGio - dt);
    r.hoaThan = Math.max(0, r.hoaThan - dt);
    r.namCham = Math.max(0, r.namCham - dt);
    r.huc = Math.max(0, r.huc - dt);
    const biGiu = r.dongBang > 0 || r.bong > 0 || r.quan > 0;

    // Điều khiển: người chơi theo tay cầm, máy tự lái
    let muon = TOC_THA;
    if (n) {
      const len = Math.max(n.dy < 0 ? 1 : 0, n.y < -0.15 ? Math.min(1, (-n.y - 0.15) / 0.75) : 0);
      const lui = Math.max(n.dy > 0 ? 1 : 0, n.y > 0.15 ? Math.min(1, (n.y - 0.15) / 0.75) : 0);
      muon = len > 0 ? TOC_THA + (1 - TOC_THA) * len : lui > 0 ? TOC_THA - (TOC_THA - TOC_MIN) * lui : TOC_THA;
      const gx = n.dx || (Math.abs(n.x) > 0.5 ? Math.sign(n.x) : 0);
      if (gx && (gx !== r.ctlCu || this.t >= r.ctlLap)) {
        this.doiLuong(r, gx);
        r.ctlLap = this.t + (gx !== r.ctlCu ? 0.34 : 0.2);
      }
      r.ctlCu = gx;
      if (gx) r.huongCuoi = gx;
      if (n.xBam) this.dungSkill(r, 0, n);
      if (n.yBam) this.dungSkill(r, 1, n);
      if (n.b) this.dungSkill(r, 2, n);
      if (n.a) this.dungVp(r);
    } else muon = this.aiLai(r);

    // Tốc độ: tiến tới tốc độ muốn với tốc tăng / phanh của rồng; bị chậm thì cắt ngay xuống trần
    let tran = r.longKhi > 0 ? LONG_KHI_HE : 1;
    if (r.longKhi > 0) muon = LONG_KHI_HE;
    if (r.cham > 0) tran = Math.min(tran, r.chamHe);
    if (r.quan > 0) tran = Math.min(tran, 0.3);
    if (r.bong > 0) tran = Math.min(tran, 0.2);
    if (r.dongBang > 0) tran = Math.min(tran, 0.25);
    muon = Math.min(Math.max(muon, biGiu ? 0 : TOC_MIN), tran);
    if (r.toc > tran) r.toc = tran;
    if (r.toc < muon) r.toc = Math.min(muon, r.toc + tangToc(r.dl) * (r.longKhi > 0 ? 2 : 1) * dt);
    else r.toc = Math.max(muon, r.toc - (biGiu ? 1.5 : phanhToc(r.dl)) * dt);

    // Đổi luồng: trượt ngang tới luồng muốn
    const dl = r.luong - r.u;
    const buoc = doiLuongToc(r.dl) * dt;
    r.u = Math.abs(dl) <= buoc ? r.luong : r.u + Math.sign(dl) * buoc;

    // Quãng bay khung này
    let he = this.gio;
    if (r.cuoiGio > 0) he = Math.max(1, he) * 1.2;
    const nh = this.nhanhTai(r.s);
    if (nh && r.u > 2.5) he *= 1.15;
    if (r.huc > 0) he *= 1.7;
    let ds = r.toc * this.vToiDa(r) * he * dt;
    // Đâm vật chắn luồng
    for (const c of this.cn) {
      if (!cung(c) || !this.trongCn(r, c)) continue;
      if (r.s + R_RONG <= c.s && r.s + ds + R_RONG > c.s) {
        ds = Math.max(0, c.s - R_RONG - 1 - r.s);
        this.dam(r, c);
        if (r.chet > 0) return;
      }
    }
    r.s += ds;

    // Va chạm mềm (một lần mỗi chướng ngại)
    for (const c of this.cn) {
      if (cung(c) || !c.song) continue;
      if (r.s + R_RONG < c.s || r.s - R_RONG > c.s + c.dai) continue;
      if (!this.trongCn(r, c) && c.loai !== 'ran' && c.loai !== 'gai') continue;
      this.chamCn(r, c);
      if (r.chet > 0 || r.roi >= 0) return;
    }
    // Rồng khác: Hỏa Thân đốt / Húc Đá đẩy
    if (r.hoaThan > 0 || r.huc > 0) {
      for (const o of this.rong) {
        if (o === r || !this.dangBay(o) || Math.abs(o.s - r.s) > (r.huc > 0 ? 120 : 140) || Math.abs(o.u - r.u) > (r.huc > 0 ? 0.6 : 1.4)) continue;
        if (r.huc > 0 && o.s < r.s) continue;
        if (this.khoa(r, o.id + 100000, 1.5)) continue;
        if (r.huc > 0) {
          const sang = o.luong <= 0 ? 1 : o.luong >= SO_LUONG - 1 ? -1 : o.u >= r.u ? 1 : -1;
          o.luong = Math.max(0, Math.min(SO_LUONG - 1, o.luong + sang));
          this.hieu.push({ loai: 'no', s: o.s, u: o.u, t: 0, dai: 0.4, mau: '#c9a36b' });
        }
        this.truTim(o, r.huc > 0 ? 'Húc Đá' : 'Hỏa Thân');
      }
    }
    this.nhatVay(r);
    this.quaHang(r);
    if (r.s >= DUONG_DAI) {
      r.s = DUONG_DAI;
      r.xong = this.t;
      this.hieu.push({ loai: 'no', s: r.s, u: r.u, t: 0, dai: 0.8, mau: '#ffd23f' });
      if (r.nguoi >= 0 && this.nguoiVe < 0) this.nguoiVe = r.nguoi;
    }
  }

  /** Khoá va chạm lặp: lần đầu trả false và khoá trong `giay` giây */
  private khoa(r: Rong, id: number, giay: number): boolean {
    const h = r.va.get(id);
    if (h !== undefined && this.t < h) return true;
    r.va.set(id, this.t + giay);
    return false;
  }

  private doiLuong(r: Rong, d: number): void {
    if (r.quan > 0) {
      // Bị xúc tu quấn: gạt qua lại để thoát nhanh
      r.quan = Math.max(0, r.quan - 0.4);
      return;
    }
    if (r.dongBang > 0 || r.bong > 0) return;
    const toi = r.luong + d;
    const nh = this.nhanhTai(r.s + R_RONG);
    if (nh && (r.luong === 2 && d > 0 || r.luong === 3 && d < 0)) {
      this.suot(r);
      return;
    }
    if (toi < 0 || toi >= SO_LUONG) {
      const b = this.bienTai(r.s);
      if ((toi < 0 ? b.trai : b.phai) === 'ho') {
        r.roi = 0;
        r.roiHuong = d;
        r.luong = toi;
        if (r.nguoi >= 0) this.rung.push({ p: r.nguoi, ms: 400, manh: 0.8 });
        this.noiChu(r, '😱 RƠI XUỐNG VỰC!', '#ff6b6b');
      } else this.suot(r);
      return;
    }
    r.luong = toi;
  }

  /** Sượt vách: chậm một chút */
  private suot(r: Rong): void {
    this.lamCham(r, 0.6, 0.7);
    if (!this.khoa(r, -1, 0.6)) {
      this.hieu.push({ loai: 'no', s: r.s, u: r.u, t: 0, dai: 0.3, mau: '#c9b79c' });
      if (r.nguoi >= 0) this.rung.push({ p: r.nguoi, ms: 120, manh: 0.3 });
    }
  }

  private lamCham(r: Rong, giay: number, he: number): void {
    if (r.cham > 0 && r.chamHe <= he) r.cham = Math.max(r.cham, giay);
    else { r.cham = giay; r.chamHe = he; }
  }

  /** Đâm vật chắn luồng: nhanh hơn TOC_CHET thì chết (khiên / Giáp Đá đỡ), chậm thì khựng lại; tường băng chỉ khựng */
  private dam(r: Rong, c: ChuongNgai): void {
    const nhanh = r.toc > TOC_CHET && c.loai !== 'tuongBang';
    const moi = !this.khoa(r, c.id, 0.8);
    if (nhanh && r.giap <= 0 && r.khien <= 0) {
      this.hieu.push({ loai: 'no', s: r.s, u: r.u, t: 0, dai: 0.6, mau: '#ff8a3d' });
      this.noiChu(r, '💥 ĐÂM VÀO VẬT CHẮN!', '#ff6b6b');
      this.chet(r);
      return;
    }
    if (nhanh && r.giap <= 0 && r.khien > 0) {
      r.khien = 0;
      this.hieu.push({ loai: 'khien', s: r.s, u: r.u, t: 0, dai: 0.5 });
    }
    r.toc = Math.min(r.toc, 0.3);
    this.lamCham(r, 2, 0.5);
    if (moi) {
      this.hieu.push({ loai: 'no', s: r.s + R_RONG, u: r.u, t: 0, dai: 0.35, mau: '#d8d0c0' });
      if (r.nguoi >= 0) { this.rung.push({ p: r.nguoi, ms: 200, manh: 0.5 }); this.noiChu(r, 'KHỰNG LẠI!', '#ffd23f'); }
    }
  }

  /** Chạm chướng ngại mềm / quái */
  private chamCn(r: Rong, c: ChuongNgai): void {
    switch (c.loai) {
      case 'da':
        if (r.longKhi > 0 || r.hoaThan > 0 || r.huc > 0) { this.phaDa(c); return; }
        if (r.ki === 4 || this.khoa(r, c.id, 2)) return; // Nham Long: va đá vụn không bị chậm
        this.lamCham(r, 1, 0.5);
        this.hieu.push({ loai: 'no', s: c.s, u: r.u, t: 0, dai: 0.3, mau: '#a89f91' });
        return;
      case 'thach':
        if (this.khoa(r, c.id, 3)) return;
        this.truTim(r, 'Thiên thạch');
        return;
      case 'lua': {
        const k = nhipLua(c, this.t);
        if (k < LUA_BAO || k >= LUA_PHUN || this.khoa(r, c.id, 1)) return;
        this.truTim(r, 'Cột lửa');
        return;
      }
      case 'ran': case 'gai': {
        const k = nhipBen(c, this.t);
        if (k < BEN_DANH || !this.trongCn(r, c) || this.khoa(r, c.id, 1)) return;
        this.truTim(r, c.loai === 'ran' ? 'Rắn Vảy' : 'Cây Gai');
        return;
      }
      case 'xuctu':
        if (this.khoa(r, c.id, 3)) return;
        r.quan = 2;
        this.noiChu(r, '🐙 BỊ QUẤN! GẠT QUA LẠI!', '#c78bff');
        return;
      case 'doi': case 'ung': case 'ma':
        if (r.hoaThan > 0 || r.huc > 0 || r.longKhi > 0 && c.loai === 'doi') { this.giet(c, r); return; }
        if (c.loai === 'ung' && c.tg > 0) return; // chim ưng còn đang báo hiệu (chưa lao)
        if (this.khoa(r, c.id, 2)) return;
        this.truTim(r, c.loai === 'doi' ? 'Dơi Lửa' : c.loai === 'ung' ? 'Chim Ưng Đá' : 'Ma Rồng');
        return;
      case 'trung':
        if (c.chu === r.id) return;
        c.song = false;
        this.hieu.push({ loai: 'no', s: c.s, u: c.l, t: 0, dai: 0.6, mau: '#ff5a1f' });
        this.truTim(r, 'Trứng Nổ');
        return;
      case 'loc':
        if (c.chu === r.id || this.khoa(r, c.id, 3)) return;
        this.truTim(r, 'Lốc Xoáy');
        return;
      default:
    }
  }

  /** Phá chướng ngại nhỏ (đá vụn) */
  private phaDa(c: ChuongNgai): void {
    c.song = false;
    this.hieu.push({ loai: 'no', s: c.s, u: c.l, t: 0, dai: 0.4, mau: '#b0a490' });
  }

  /** Bắn hạ quái bay ngược: thưởng vảy vàng và giảm hồi chiêu */
  private giet(c: ChuongNgai, r: Rong | null): void {
    if (!c.song) return;
    c.song = false;
    this.hieu.push({ loai: 'no', s: c.s, u: c.l + (c.w - 1) / 2, t: 0, dai: 0.5, mau: '#ffb347' });
    if (!r) return;
    r.vay += THUONG_VAY;
    for (let k = 0; k < 3; k++) r.hoi[k] = Math.max(0, r.hoi[k]! - THUONG_HOI);
    this.noiChu(r, `+${THUONG_VAY} VẢY · HỒI CHIÊU -${THUONG_HOI}s`, '#ffd23f');
  }

  /** Mất 1 tim (khiên đỡ một đòn, Giáp Đá miễn hết); hết tim là chết */
  truTim(r: Rong, nguon: string): void {
    if (!this.dangBay(r)) return;
    if (r.giap > 0) { this.hieu.push({ loai: 'khien', s: r.s, u: r.u, t: 0, dai: 0.4, mau: '#c9a36b' }); return; }
    if (r.khien > 0) {
      r.khien = 0;
      this.hieu.push({ loai: 'khien', s: r.s, u: r.u, t: 0, dai: 0.5 });
      this.noiChu(r, '🛡️ KHIÊN ĐỠ!', '#9fe8ff');
      return;
    }
    r.tim--;
    r.trung = 0.5;
    if (r.nguoi >= 0) this.rung.push({ p: r.nguoi, ms: 250, manh: 0.7 });
    if (r.tim <= 0) {
      this.noiChu(r, `💀 ${nguon.toUpperCase()}!`, '#ff6b6b');
      this.hieu.push({ loai: 'no', s: r.s, u: r.u, t: 0, dai: 0.7, mau: '#ff8a3d' });
      this.chet(r);
    } else this.noiChu(r, `-1 ❤ ${nguon}`, '#ff6b6b');
  }

  private chet(r: Rong): void {
    r.chet = HOI_SINH;
    r.roi = -1;
    r.vp = null;
    r.vay = Math.floor(r.vay / 2);
    r.cham = r.dongBang = r.bong = r.mu = r.quan = r.khien = r.giap = r.longKhi = r.cuoiGio = r.hoaThan = r.namCham = r.huc = 0;
    r.toc = 0;
    if (r.nguoi >= 0) this.rung.push({ p: r.nguoi, ms: 500, manh: 1 });
  }

  /** Hồi sinh ở điểm hồi sinh gần nhất phía sau, luồng trống; tim về mức khởi đầu (không hồi đầy) */
  private hoiSinh(r: Rong): void {
    let moc = 0;
    for (const m of this.moc) if (m <= r.s) moc = m;
    let tot = -1, diem = -Infinity;
    for (let l = 0; l < SO_LUONG; l++) {
      let d = -Math.abs(l - 2.5) * 0.5 + this.rnd() * 0.3;
      for (const c of this.cn) if (c.l <= l && l < c.l + c.w && c.s + c.dai > moc - 100 && c.s < moc + 900) d -= 10;
      for (const o of this.rong) if (o !== r && this.dangBay(o) && Math.abs(o.s - moc) < 200 && Math.abs(o.u - l) < 0.6) d -= 3;
      if (d > diem) { diem = d; tot = l; }
    }
    r.s = moc;
    r.luong = tot;
    r.u = tot;
    r.toc = TOC_THA;
    r.tim = r.dl.tim;
    r.chet = 0;
    r.roi = -1;
    r.va.clear();
    r.aiLuong = tot;
    this.hieu.push({ loai: 'hoiSinh', s: r.s, u: r.u, t: 0, dai: 0.8, mau: r.dl.mau });
  }

  private nhatVay(r: Rong): void {
    const rong = r.namCham > 0 ? 1.6 : 0.6;
    const doc = r.namCham > 0 ? 260 : 60;
    for (const v of this.vay) {
      if (v.an || v.s < r.s - doc) continue;
      if (v.s > r.s + doc) break;
      if (Math.abs(v.l - r.u) > rong) continue;
      v.an = true;
      r.vay++;
      if (r.vay % VAY_MOI === 0 && r.vay / VAY_MOI <= VAY_TRAN) this.noiChu(r, `+1% TỐC ĐỘ`, '#ffd23f');
    }
  }

  /** Đi qua hàng vật phẩm: nhận ô ở luồng mình (mỗi hàng tối đa 1 ô; ô đã vỡ thì không nhận gì; hạng 1–2 không nhận Thiên Lôi) */
  private quaHang(r: Rong): void {
    while (r.daQua < this.hang.length && this.hang[r.daQua]!.s <= r.s) {
      const h = this.hang[r.daQua]!;
      r.daQua++;
      let l = Math.round(r.u);
      if (l < 0 || l >= SO_LUONG) continue;
      const lay = (i: number) => {
        const vp = h.o[i];
        return !!vp && !(vp === 'thienLoi' && r.hang <= 2);
      };
      if (!lay(l) && r.namCham > 0) {
        // Nam Châm Điện: ô của mình đã vỡ thì lấy ô trống ngay bên cạnh
        if (l > 0 && lay(l - 1)) l--;
        else if (l < SO_LUONG - 1 && lay(l + 1)) l++;
      }
      const vp = h.o[l];
      if (!vp) {
        if (r.nguoi >= 0) this.noiChu(r, 'Ô ĐÃ VỠ', '#9aa');
        continue;
      }
      if (vp === 'thienLoi' && r.hang <= 2) {
        if (r.nguoi >= 0) this.noiChu(r, '⚡ HẠNG 1–2 KHÔNG NHẬN THIÊN LÔI', '#9aa');
        continue;
      }
      h.o[l] = null;
      r.vp = vp;
      r.aiVp = this.t + 0.5 + this.rnd() * 1.5;
      this.hieu.push({ loai: 'vay', s: h.s, u: l, t: 0, dai: 0.5, mau: '#ffd23f' });
      if (r.nguoi >= 0) this.noiChu(r, `${VP_ICON[vp]} ${VP_TEN[vp]}`, '#ffffff');
    }
  }

  private noiChu(r: Rong, text: string, mau: string): void {
    this.chu.push({ s: r.s + 140, u: r.u, text, mau, t: 0, p: r.nguoi });
  }

  // ─── Vật phẩm & skill ───

  /** Rồng gần nhất phía trước (bất kỳ luồng nào; luongGan: chỉ luồng ± sai) trong tầm */
  private truocMat(r: Rong, tam: number, luong = -1, sai = 0.5): Rong | null {
    let kq: Rong | null = null;
    for (const o of this.rong) {
      if (o === r || !this.dangBay(o) || o.s <= r.s || o.s - r.s > tam) continue;
      if (luong >= 0 && Math.abs(o.u - luong) > sai) continue;
      if (!kq || o.s < kq.s) kq = o;
    }
    return kq;
  }

  private dungVp(r: Rong): void {
    if (!r.vp || !this.dangBay(r)) return;
    const vp = r.vp;
    r.vp = null;
    switch (vp) {
      case 'khien': r.khien = KHIEN_T; break;
      case 'longKhi': r.longKhi = LONG_KHI_T; break;
      case 'tim':
        r.tim = Math.min(TIM_MAX, r.tim + 1);
        this.hieu.push({ loai: 'tim', s: r.s, u: r.u, t: 0, dai: 0.8 });
        break;
      case 'hoaCau': {
        const muc = this.truocMat(r, 6000);
        this.dan.push({ id: this.id++, loai: 'hoaCau', s: r.s + 60, u: r.u, v: 0, chu: r.id, muc: muc?.id ?? -1, con: 6000 });
        break;
      }
      case 'thienLoi':
        for (const o of this.rong) {
          if (o === r || !this.dangBay(o)) continue;
          this.hieu.push({ loai: 'set', s: o.s, u: o.u, t: 0, dai: 0.6 });
          this.truTim(o, 'Thiên Lôi');
        }
        break;
    }
  }

  /** Dùng skill k (0..2) của r; skill không dùng được thì không tính hồi chiêu */
  private dungSkill(r: Rong, k: number, n: NhapDua | null): void {
    if (r.hoi[k]! > 0 || !this.dangBay(r) || r.dongBang > 0 || r.bong > 0) return;
    const l = Math.round(Math.max(0, Math.min(SO_LUONG - 1, r.u)));
    const v = r.toc * this.vToiDa(r);
    let duoc = true;
    switch (r.ki * 3 + k) {
      // Xích Viêm: Phun Lửa · Trứng Nổ · Hỏa Thân
      case 0:
        this.hieu.push({ loai: 'phun', s: r.s + 40, u: r.u, t: 0, dai: 0.45, mau: '#ff7a1f' });
        for (const o of this.rong) if (o !== r && this.dangBay(o) && o.s >= r.s - 20 && o.s - r.s <= 330 && Math.abs(o.u - r.u) <= 1.5) this.truTim(o, 'Phun Lửa');
        for (const c of this.cn) if (quaiBay(c) && c.song && c.s >= r.s - 20 && c.s - r.s <= 360 && Math.abs(c.l - r.u) <= 1.5) this.giet(c, r);
        break;
      case 1: this.themCn('trung', r.s - 80, 50, l, 1, r.id, 15); break;
      case 2: r.hoaThan = 3; break;
      // Thanh Phong: Lướt Gió · Lốc Xoáy · Cưỡi Gió
      case 3: {
        let h = (n && (n.dx || (Math.abs(n.x) > 0.3 ? Math.sign(n.x) : 0))) || r.huongCuoi || 1;
        if (r.luong + 2 * h < 0 || r.luong + 2 * h >= SO_LUONG) h = -h;
        let toi = Math.max(0, Math.min(SO_LUONG - 1, r.luong + 2 * h));
        const nh = this.nhanhTai(r.s + R_RONG);
        if (nh) toi = r.luong < 3 ? Math.min(toi, 2) : Math.max(toi, 3);
        if (toi === r.luong) { duoc = false; break; }
        this.hieu.push({ loai: 'luot', s: r.s, u: r.u, u2: toi, t: 0, dai: 0.4, mau: '#c8fff0' });
        r.luong = toi;
        r.u = toi;
        r.quan = 0;
        break;
      }
      case 4: this.themCn('loc', r.s - 200, 80, l, 1, r.id, 8); break;
      case 5: r.cuoiGio = 4; break;
      // Hàn Tuyết: Băng Tiễn · Đóng Băng · Tường Băng
      case 6: this.dan.push({ id: this.id++, loai: 'bangTien', s: r.s + 60, u: l, v: v + 900, chu: r.id, muc: -1, con: 2500 }); break;
      case 7: {
        const o = this.truocMat(r, 3000);
        if (!o) { duoc = false; if (r.nguoi >= 0) this.noiChu(r, 'KHÔNG CÓ AI PHÍA TRƯỚC', '#9aa'); break; }
        o.dongBang = 5;
        this.hieu.push({ loai: 'bang', s: o.s, u: o.u, s2: r.s, u2: r.u, t: 0, dai: 0.5 });
        this.noiChu(o, '❄️ BỊ ĐÓNG BĂNG!', '#a8e4ff');
        break;
      }
      case 8: {
        const l2 = l < 3 ? l + 1 : l - 1;
        this.themCn('tuongBang', r.s - 240, 40, Math.min(l, l2), 2, r.id, 6);
        break;
      }
      // Thiên Lôi: Chớp Giật · Nam Châm Điện · Lôi Cầu
      case 9: {
        const toi = Math.min(DUONG_DAI - 10, r.s + 500);
        const chan = this.cn.some((c) => cung(c) && this.trongCn(r, c) && c.s + c.dai > r.s && c.s < toi + R_RONG + 20);
        if (chan) { duoc = false; if (r.nguoi >= 0) this.noiChu(r, 'PHÍA TRƯỚC CÓ VẬT CHẮN!', '#9aa'); break; }
        this.hieu.push({ loai: 'chop', s: r.s, s2: toi, u: r.u, t: 0, dai: 0.4, mau: '#fff27a' });
        r.s = toi;
        break;
      }
      case 10: r.namCham = 6; break;
      case 11: this.dan.push({ id: this.id++, loai: 'loiCau', s: r.s + 60, u: l, v: v + 350, chu: r.id, muc: -1, con: 3000 }); break;
      // Thạch Giáp: Húc Đá · Giáp Đá · Mưa Đá
      case 12: r.huc = 0.35; break;
      case 13: r.giap = 3; break;
      case 14:
        for (let i = l - 1; i <= l + 1; i++) if (i >= 0 && i < SO_LUONG) this.themCn('da', r.s - 260 - this.rnd() * 80, 60, i, 1, r.id, 10);
        break;
      // Lam Hải: Bọt Nước · Hồi Thủy · Bom Mây
      case 15: this.dan.push({ id: this.id++, loai: 'botNuoc', s: r.s + 60, u: l, v: v + 800, chu: r.id, muc: -1, con: 2500 }); break;
      case 16:
        if (r.tim >= TIM_MAX) { duoc = false; if (r.nguoi >= 0) this.noiChu(r, 'ĐẦY TIM RỒI', '#9aa'); break; }
        r.tim++;
        this.hieu.push({ loai: 'tim', s: r.s, u: r.u, t: 0, dai: 0.8 });
        break;
      case 17:
        this.hieu.push({ loai: 'no', s: r.s - 200, u: r.u, t: 0, dai: 0.8, mau: '#ffffff' });
        for (const o of this.rong) if (o !== r && this.dangBay(o) && o.s < r.s && r.s - o.s < 2500) o.mu = 3;
        break;
      default:
    }
    if (duoc) r.hoi[k] = r.dl.skill[k]!.hoi;
  }

  // ─── Quái, đạn, Rết Đá ───

  private capNhatQuai(dt: number): void {
    for (const c of this.cn) {
      if (!c.song || !quaiBay(c)) continue;
      // Rồng gần nhất phía sau (quái bay ngược thức dậy khi có rồng tới gần)
      let gan: Rong | null = null;
      for (const r of this.rong) if (this.dangBay(r) && r.s < c.s && (!gan || r.s > gan.s)) gan = r;
      if (!c.kich) {
        if (!gan || c.s - gan.s > (c.loai === 'ma' ? 1700 : 2300)) continue;
        c.kich = true;
        if (c.loai === 'doi') c.vs = -420;
        if (c.loai === 'ung') { c.tg = UNG_BAO; c.l = Math.round(Math.max(0, Math.min(SO_LUONG - 1, gan.u))); }
        if (c.loai === 'ma') c.tg = 1;
      }
      if (c.loai === 'ung' && c.tg > 0) {
        c.tg -= dt;
        if (c.tg <= 0) c.vs = -950;
      }
      if (c.loai === 'ma') {
        c.tg -= dt;
        if (c.tg <= 0 && gan && c.s - gan.s < 1800) {
          c.tg = 2.2;
          this.dan.push({ id: this.id++, loai: 'cauToi', s: c.s - 40, u: c.l, v: -650, chu: -1, muc: -1, con: 2600 });
        }
      }
      c.s += c.vs * dt;
      if (c.s < 0 || c.s < this.cuoiCung() - 3000) c.song = false;
    }
  }

  /** s của rồng đang bay xa đuôi nhất */
  private cuoiCung(): number {
    let m = Infinity;
    for (const r of this.rong) if (r.xong < 0) m = Math.min(m, r.s);
    return m === Infinity ? DUONG_DAI : m;
  }

  private capNhatDan(dt: number): void {
    for (const d of this.dan) {
      if (d.con <= 0) continue;
      const chu = this.rong.find((r) => r.id === d.chu);
      if (d.loai === 'hoaCau') {
        const muc = this.rong.find((r) => r.id === d.muc && this.dangBay(r));
        d.v = Math.max(chu ? chu.toc * this.vToiDa(chu) : 0, muc ? muc.toc * this.vToiDa(muc) : 0) + 900;
        if (muc) d.u += Math.sign(muc.u - d.u) * Math.min(Math.abs(muc.u - d.u), 4 * dt);
      }
      const buoc = d.v * dt;
      d.s += buoc;
      d.con -= Math.abs(buoc);
      // Trúng rồng
      for (const r of this.rong) {
        if (r.id === d.chu || !this.dangBay(r)) continue;
        if (d.loai === 'hoaCau' && d.muc >= 0 && r.id !== d.muc) continue;
        const sai = d.loai === 'loiCau' ? 1.4 : 0.55;
        if (Math.abs(r.s - d.s) > 70 || Math.abs(r.u - d.u) > sai) continue;
        this.danTrung(d, r, chu ?? null);
        break;
      }
      if (d.con <= 0) continue;
      // Đạn của rồng trúng quái bay ngược
      if (d.loai !== 'cauToi') {
        for (const c of this.cn) {
          if (!c.song || !quaiBay(c) || Math.abs(c.s - d.s) > 70 || Math.abs(c.l - d.u) > 0.6) continue;
          this.giet(c, chu ?? null);
          if (d.loai !== 'loiCau') d.con = 0;
          break;
        }
      }
    }
    this.dan = this.dan.filter((d) => d.con > 0 && d.s > -500 && d.s < DUONG_DAI + 500);
  }

  private danTrung(d: Dan, r: Rong, chu: Rong | null): void {
    d.con = 0;
    switch (d.loai) {
      case 'hoaCau': case 'cauToi':
        this.hieu.push({ loai: 'no', s: r.s, u: r.u, t: 0, dai: 0.5, mau: d.loai === 'hoaCau' ? '#ff7a1f' : '#8a4dff' });
        this.truTim(r, d.loai === 'hoaCau' ? 'Hỏa Cầu' : 'Ma Rồng');
        break;
      case 'bangTien':
        if (r.giap > 0 || r.khien > 0) { this.truKhien(r); break; }
        this.lamCham(r, 5, 0.6);
        this.noiChu(r, '🏹 CHẬM 40%!', '#a8e4ff');
        break;
      case 'botNuoc':
        if (r.giap > 0 || r.khien > 0) { this.truKhien(r); break; }
        r.bong = 5;
        this.noiChu(r, '🫧 BỊ NHỐT TRONG BỌT!', '#9fe8ff');
        break;
      case 'loiCau':
        this.hieu.push({ loai: 'set', s: d.s, u: d.u, t: 0, dai: 0.5 });
        for (const o of this.rong) {
          if ((chu && o.id === chu.id) || !this.dangBay(o) || Math.abs(o.s - d.s) > 160 || Math.abs(o.u - d.u) > 1.4) continue;
          this.truTim(o, 'Lôi Cầu');
        }
        break;
    }
  }

  /** Đòn khống chế trúng rồng có khiên / Giáp Đá: khiên mất, Giáp Đá miễn */
  private truKhien(r: Rong): void {
    if (r.giap <= 0) r.khien = 0;
    this.hieu.push({ loai: 'khien', s: r.s, u: r.u, t: 0, dai: 0.5 });
  }

  private capNhatRet(dt: number): void {
    const re = this.ret, co = CHANG[3]!;
    if (re.xong) return;
    if (!re.chay) {
      if (this.rong.some((r) => r.s > co.s0 + 800)) re.chay = true;
      return;
    }
    re.s += V_CHUAN * 0.8 * dt;
    if (re.s > co.s1) { re.xong = true; return; }
    for (const r of this.rong) {
      if (!this.dangBay(r) || re.daDop.has(r.id) || r.s > re.s + 120 || r.s < re.s - 400) continue;
      re.daDop.add(r.id);
      this.hieu.push({ loai: 'no', s: r.s, u: r.u, t: 0, dai: 0.5, mau: '#8b5a2b' });
      this.truTim(r, 'Rết Đá đớp');
    }
  }

  // ─── Máy tự lái ───

  /** Rồng máy chọn luồng, tốc độ, skill, vật phẩm; trả tốc độ muốn */
  private aiLai(r: Rong): number {
    const v = Math.max(300, r.toc * this.vToiDa(r));
    const xa = Math.max(900, v * 1.7);
    const cur = Math.round(r.u);
    // Chấm điểm từng luồng (càng thấp càng tốt)
    if (this.t >= r.aiNghi && r.mu <= 0) {
      r.aiNghi = this.t + 0.12 + this.rnd() * 0.18;
      const nh = this.nhanhTai(r.s + R_RONG);
      let tot = cur, diem = Infinity;
      for (let l = 0; l < SO_LUONG; l++) {
        let d = Math.abs(l - cur) * 40 + Math.abs(l - 2.5) * 5;
        if (nh && (l < 3) !== (cur < 3)) d += 99999;
        for (const c of this.cn) {
          if (!c.song || c.s + c.dai < r.s || c.s > r.s + xa) continue;
          if (l < c.l || l >= c.l + c.w) continue;
          const gan = 1 - Math.max(0, c.s - r.s) / xa;
          if (cung(c)) d += 1000 * gan + 600;
          else if (c.loai === 'da') d += r.ki === 4 ? 0 : 80;
          else if (c.chu !== r.id) d += 300 * gan + 120;
        }
        const h = this.hangToi(r.s);
        if (h && h.s - r.s < xa) {
          const vp = h.o[l];
          if (vp && !(vp === 'thienLoi' && r.hang <= 2)) d -= r.vp ? 40 : vp === 'thienLoi' || vp === 'hoaCau' ? 200 : vp === 'tim' && r.tim < TIM_MAX ? 180 : 130;
        }
        for (const vy of this.vay) {
          if (vy.s < r.s) continue;
          if (vy.s > r.s + xa) break;
          if (!vy.an && vy.l === l) d -= 10;
        }
        if (d < diem) { diem = d; tot = l; }
      }
      r.aiLuong = tot;
      if (tot !== r.luong && Math.abs(r.u - r.luong) < 0.1) this.doiLuongAi(r, Math.sign(tot - r.luong));
    }
    // Vật chắn ngay trước mặt mà chưa né kịp thì phanh xuống dưới mức chết
    let muon = r.aiToc;
    for (const c of this.cn) {
      if (!cung(c) || !this.trongCn(r, c)) continue;
      const kc = c.s - r.s;
      if (kc > 0 && kc < v * Math.max(0, r.toc - 0.45) / phanhToc(r.dl) + 160) { muon = 0.32; break; }
    }
    // Vật phẩm: dùng sau một chút
    if (r.vp && this.t >= r.aiVp) {
      const vp = r.vp;
      if (vp === 'hoaCau' ? !!this.truocMat(r, 3500) : vp === 'tim' ? r.tim < TIM_MAX : vp === 'longKhi' ? !this.cn.some((c) => cung(c) && this.trongCn(r, c) && c.s > r.s && c.s - r.s < 2500) : true) this.dungVp(r);
      else r.aiVp = this.t + 0.5;
    }
    // Skill: xét mỗi ~0,5 giây
    if (this.t >= r.aiSkill) {
      r.aiSkill = this.t + 0.4 + this.rnd() * 0.4;
      this.aiSkill(r);
    }
    return muon;
  }

  private doiLuongAi(r: Rong, d: number): void {
    const toi = r.luong + d;
    if (toi < 0 || toi >= SO_LUONG) return;
    // Không lao vào vật chắn ở luồng bên cạnh ngay sát
    if (this.cn.some((c) => cung(c) && c.l <= toi && toi < c.l + c.w && c.s - r.s < 140 && c.s + c.dai > r.s - R_RONG)) return;
    this.doiLuong(r, d);
  }

  private aiSkill(r: Rong): void {
    const sau = (tam: number, luong: boolean) => this.rong.some((o) => o !== r && this.dangBay(o) && o.s < r.s && r.s - o.s < tam && (!luong || Math.abs(o.u - r.u) < 0.6));
    const truoc = (tam: number, sai: number) => !!this.truocMat(r, tam, Math.round(r.u), sai);
    const chanGan = this.cn.some((c) => cung(c) && this.trongCn(r, c) && c.s > r.s && c.s - r.s < 380);
    const thu = (k: number, dk: boolean) => { if (dk && r.hoi[k]! <= 0) this.dungSkill(r, k, null); };
    switch (r.ki) {
      case 0: thu(0, truoc(320, 1.5)); thu(1, sau(900, true)); thu(2, this.rong.some((o) => o !== r && this.dangBay(o) && Math.abs(o.s - r.s) < 140 && Math.abs(o.u - r.u) < 1.4)); break;
      case 1: thu(0, chanGan && r.toc > TOC_CHET); thu(1, sau(700, true)); thu(2, !chanGan && this.rnd() < 0.15); break;
      case 2: thu(0, truoc(1800, 0.5)); thu(1, !!this.truocMat(r, 3000)); thu(2, sau(900, false)); break;
      case 3: thu(0, !this.cn.some((c) => cung(c) && this.trongCn(r, c) && c.s > r.s && c.s - r.s < 700) && this.rnd() < 0.3); thu(1, !!this.hangToi(r.s) && this.hangToi(r.s)!.s - r.s < 1300); thu(2, truoc(2000, 1.4)); break;
      case 4: thu(0, truoc(300, 0.5)); thu(1, chanGan && r.toc > TOC_CHET); thu(2, sau(900, false)); break;
      case 5: thu(0, truoc(1800, 0.5)); thu(1, r.tim < 2); thu(2, sau(1500, false)); break;
      default:
    }
  }
}
