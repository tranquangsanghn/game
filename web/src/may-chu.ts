import type { TrangThaiLuu } from './game/game';

// Máy chủ Java + MySQL (thư mục server/). Không nối được thì game vẫn chơi bình thường, ván lưu tạm trong localStorage.
const API = (import.meta.env.VITE_API as string | undefined) ?? '/api';
const KHOA_LUU = 'dragon-ball.luu.';
const KHOA_TEN = 'dragon-ball.ten';

export interface BanLuu {
  nguoiChoi: string; diem: number; thoiGian: number; luuLuc: string; trangThai: TrangThaiLuu;
  nguon: 'may-chu' | 'tam';
}
export interface DiemCao { nguoiChoi: string; diem: number; diemMabu: number; diemZinbu: number; thoiGian: number; luc: string; }

async function goi<T>(duong: string, init?: RequestInit): Promise<T | null> {
  const dk = new AbortController();
  const hen = setTimeout(() => dk.abort(), 6000);
  try {
    const r = await fetch(API + duong, { ...init, signal: dk.signal, headers: { 'Content-Type': 'application/json' } });
    if (r.status === 404) return null;
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r.status === 204 ? null : ((await r.json()) as T);
  } finally {
    clearTimeout(hen);
  }
}

const tam = {
  doc(ten: string): BanLuu | null {
    try {
      const s = localStorage.getItem(KHOA_LUU + ten);
      return s ? ({ ...JSON.parse(s), nguon: 'tam' } as BanLuu) : null;
    } catch { return null; }
  },
  ghi(b: BanLuu): void {
    try { localStorage.setItem(KHOA_LUU + b.nguoiChoi, JSON.stringify(b)); } catch { /* bị chặn */ }
  },
  xoa(ten: string): void {
    try { localStorage.removeItem(KHOA_LUU + ten); } catch { /* bị chặn */ }
  },
};

export const tenDaNho = (): string => {
  try { return localStorage.getItem(KHOA_TEN) || 'Người chơi'; } catch { return 'Người chơi'; }
};
export const nhoTen = (ten: string): void => {
  try { localStorage.setItem(KHOA_TEN, ten); } catch { /* bị chặn */ }
};

const enc = encodeURIComponent;

/** Lấy ván đã lưu: ưu tiên máy chủ, không nối được thì lấy bản lưu tạm trong trình duyệt */
export async function layLuu(ten: string): Promise<{ luu: BanLuu | null; mayChuOk: boolean }> {
  try {
    const r = await goi<Omit<BanLuu, 'nguon'>>(`/saves/${enc(ten)}`);
    return { luu: r ? { ...r, nguon: 'may-chu' } : null, mayChuOk: true };
  } catch {
    return { luu: tam.doc(ten), mayChuOk: false };
  }
}

/** Lưu ván; trả về nơi đã lưu: 'may-chu' (MySQL) hoặc 'tam' (chỉ trong trình duyệt này) */
export async function luuGame(ten: string, diem: number, thoiGian: number, trangThai: TrangThaiLuu): Promise<'may-chu' | 'tam'> {
  const ban: BanLuu = { nguoiChoi: ten, diem, thoiGian, luuLuc: new Date().toISOString(), trangThai, nguon: 'tam' };
  try {
    await goi(`/saves/${enc(ten)}`, { method: 'PUT', body: JSON.stringify({ diem, thoiGian, trangThai }) });
    tam.xoa(ten);
    return 'may-chu';
  } catch {
    tam.ghi(ban);
    return 'tam';
  }
}

export async function xoaLuu(ten: string): Promise<void> {
  tam.xoa(ten);
  try { await goi(`/saves/${enc(ten)}`, { method: 'DELETE' }); } catch { /* máy chủ tắt */ }
}

export async function guiDiem(d: { nguoiChoi: string; diem: number; diemMabu: number; diemZinbu: number; thoiGian: number }): Promise<void> {
  try { await goi('/scores', { method: 'POST', body: JSON.stringify(d) }); } catch { /* máy chủ tắt */ }
}

export async function bangDiem(gioiHan = 5): Promise<DiemCao[] | null> {
  try { return (await goi<DiemCao[]>(`/scores?limit=${gioiHan}`)) ?? []; } catch { return null; }
}
