// Âm thanh game: hiệu ứng ngắn phát chồng được (nhân bản thẻ Audio), nhạc nền lặp vô hạn.
// Trình duyệt chỉ cho phát tiếng sau lần bấm / nhấn phím đầu tiên, nên mọi lệnh phát lỗi đều bị nuốt và nhạc nền tự thử lại.
export type TenAm = 'dam' | 'da' | 'chuong' | 'anTao' | 'deTrung' | 'meChet' | 'nvChet';

const FILE: Record<TenAm, string> = {
  dam: 'dam.wav',
  da: 'da.wav',
  chuong: 'ban-chuong.mp3',
  anTao: 'an-tao.mp3',
  deTrung: 'ga-de-trung.mp3',
  meChet: 'ga-me-chet.mp3',
  nvChet: 'nv-chet.mp3',
};
const DUONG_DAN = 'assets/am-thanh/';
const AM_LUONG: Record<TenAm, number> = { dam: 0.7, da: 0.7, chuong: 0.7, anTao: 0.8, deTrung: 0.6, meChet: 0.9, nvChet: 0.9 };
const AM_LUONG_NHAC = 0.35;
const GIAN_CACH = 0.06; // giây: cùng một tiếng không phát lại dày hơn mức này
const TOI_DA_CHONG = 4; // số bản phát chồng tối đa của một tiếng

export class AmThanh {
  private mau = new Map<TenAm, HTMLAudioElement[]>();
  private lanCuoi = new Map<TenAm, number>();
  private nhac: HTMLAudioElement | null = null;
  private muonNhac = false;
  private tat = false;

  constructor() {
    if (typeof Audio === 'undefined') return;
    for (const ten of Object.keys(FILE) as TenAm[]) {
      const a = new Audio(DUONG_DAN + FILE[ten]);
      a.preload = 'auto';
      this.mau.set(ten, [a]);
    }
    this.nhac = new Audio(DUONG_DAN + 'nhac-nen.mp3');
    this.nhac.loop = true;
    this.nhac.volume = AM_LUONG_NHAC;
    this.nhac.preload = 'auto';
    // Sau cú bấm đầu tiên của người chơi, thử lại nhạc nền nếu trước đó bị chặn
    const mo = () => { if (this.muonNhac) this.nhacNen(true); };
    for (const s of ['pointerdown', 'keydown']) window.addEventListener(s, mo, { capture: true });
  }

  phat(ten: TenAm): void {
    if (this.tat) return;
    const ds = this.mau.get(ten);
    if (!ds) return;
    const bay = performance.now() / 1000;
    if (bay - (this.lanCuoi.get(ten) ?? -1) < GIAN_CACH) return;
    this.lanCuoi.set(ten, bay);
    let a = ds.find((x) => x.paused || x.ended);
    if (!a) {
      if (ds.length >= TOI_DA_CHONG) { a = ds[0]; a.currentTime = 0; } else { a = ds[0].cloneNode() as HTMLAudioElement; ds.push(a); }
    }
    a.volume = AM_LUONG[ten];
    a.currentTime = 0;
    a.play().catch(() => { /* chưa được phép phát tiếng */ });
  }

  /** Bật / dừng nhạc nền theo trạng thái ván (gọi mỗi khung hình đều được, chỉ đổi khi khác trạng thái) */
  nhacNen(bat: boolean): void {
    this.muonNhac = bat;
    const a = this.nhac;
    if (!a) return;
    if (bat && !this.tat) {
      if (a.paused) a.play().catch(() => { /* chờ lần bấm đầu tiên */ });
    } else if (!a.paused) a.pause();
  }
}
