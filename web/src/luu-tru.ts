import type { TrangThaiLuu } from './game/game';

// Chỉ có giao diện (chạy trên GitHub Pages), không có máy chủ: ván đang chơi và bảng điểm lưu trong localStorage của trình duyệt.
const KHOA_LUU = 'dragon-ball.luu.';
const KHOA_TEN = 'dragon-ball.ten';
const KHOA_DIEM = 'dragon-ball.diem';
const DIEM_TOI_DA = 50;

export interface BanLuu { nguoiChoi: string; diem: number; thoiGian: number; luuLuc: string; trangThai: TrangThaiLuu; }
export interface DiemCao { nguoiChoi: string; diem: number; diemMabu: number; diemZinbu: number; thoiGian: number; luc: string; }

function doc<T>(khoa: string): T | null {
  try {
    const s = localStorage.getItem(khoa);
    return s ? (JSON.parse(s) as T) : null;
  } catch { return null; }
}
function ghi(khoa: string, v: unknown): boolean {
  try { localStorage.setItem(khoa, JSON.stringify(v)); return true; } catch { return false; }
}

export const tenDaNho = (): string => {
  try { return localStorage.getItem(KHOA_TEN) || 'Người chơi'; } catch { return 'Người chơi'; }
};
export const nhoTen = (ten: string): void => {
  try { localStorage.setItem(KHOA_TEN, ten); } catch { /* bị chặn */ }
};

/** Ván đã lưu của người chơi (null nếu không có) */
export const layLuu = (ten: string): BanLuu | null => doc<BanLuu>(KHOA_LUU + ten);

/** Lưu ván; false nếu trình duyệt chặn / đầy bộ nhớ */
export function luuGame(ten: string, diem: number, thoiGian: number, trangThai: TrangThaiLuu): BanLuu | null {
  const ban: BanLuu = { nguoiChoi: ten, diem, thoiGian, luuLuc: new Date().toISOString(), trangThai };
  return ghi(KHOA_LUU + ten, ban) ? ban : null;
}

export function xoaLuu(ten: string): void {
  try { localStorage.removeItem(KHOA_LUU + ten); } catch { /* bị chặn */ }
}

export function guiDiem(d: Omit<DiemCao, 'luc'>): void {
  const ds = doc<DiemCao[]>(KHOA_DIEM) ?? [];
  ds.push({ ...d, luc: new Date().toISOString() });
  ds.sort((a, b) => b.diem - a.diem);
  ghi(KHOA_DIEM, ds.slice(0, DIEM_TOI_DA));
}

export const bangDiem = (gioiHan = 5): DiemCao[] => (doc<DiemCao[]>(KHOA_DIEM) ?? []).slice(0, gioiHan);
