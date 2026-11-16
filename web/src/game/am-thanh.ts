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
const AM_LUONG_NHAC = 0.12;
const AM_LUONG_NHAC_DAO = 0.3;
const GIAN_CACH = 0.06; // giây: cùng một tiếng không phát lại dày hơn mức này
const TOI_DA_CHONG = 4; // số bản phát chồng tối đa của một tiếng

export class AmThanh {
  private mau = new Map<TenAm, HTMLAudioElement[]>();
  private lanCuoi = new Map<TenAm, number>();
  private nhac: HTMLAudioElement | null = null;
  private muonNhac = false;
  private tat = false;
  private ac: AudioContext | null = null;
  private nhacDao: HTMLAudioElement | null = null;
  private oDao = false;

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
    // Nhạc khu đảo (Cell nhảy múa trên thanh đen): thay hẳn nhạc nền
    this.nhacDao = new Audio(DUONG_DAN + 'happy-birthday.mp3');
    this.nhacDao.loop = true;
    this.nhacDao.volume = AM_LUONG_NHAC_DAO;
    this.nhacDao.preload = 'auto';
    // Sau cú bấm đầu tiên của người chơi, thử lại nhạc nền nếu trước đó bị chặn
    const mo = () => { if (this.muonNhac) this.nhacNen(true, this.oDao); this.ac?.resume().catch(() => { /* chưa được phép */ }); };
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

  /** Tiếng nổ máy bay (tổng hợp bằng Web Audio, không cần file): nhiễu trắng lọc thấp tắt dần + tiếng "bùm" trầm */
  noMayBay(): void {
    if (this.tat || typeof AudioContext === 'undefined') return;
    if (!this.ac) this.ac = new AudioContext();
    const ac = this.ac;
    if (ac.state === 'suspended') { ac.resume().catch(() => { /* chờ lần bấm đầu tiên */ }); return; }
    const now = ac.currentTime;
    const dai = 1.1;
    const out = ac.createGain();
    out.gain.setValueAtTime(0.9, now);
    out.gain.exponentialRampToValueAtTime(0.0001, now + dai);
    out.connect(ac.destination);
    const nhieu = ac.createBuffer(1, Math.floor(ac.sampleRate * dai), ac.sampleRate);
    const d = nhieu.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = ac.createBufferSource();
    src.buffer = nhieu;
    const loc = ac.createBiquadFilter();
    loc.type = 'lowpass';
    loc.frequency.setValueAtTime(2400, now);
    loc.frequency.exponentialRampToValueAtTime(120, now + dai);
    src.connect(loc);
    loc.connect(out);
    src.start(now);
    const bum = ac.createOscillator();
    const bumG = ac.createGain();
    bum.type = 'sine';
    bum.frequency.setValueAtTime(110, now);
    bum.frequency.exponentialRampToValueAtTime(30, now + 0.5);
    bumG.gain.setValueAtTime(1, now);
    bumG.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
    bum.connect(bumG);
    bumG.connect(out);
    bum.start(now);
    bum.stop(now + 0.65);
  }

  /** Bật / dừng nhạc nền theo trạng thái ván (gọi mỗi khung hình đều được). `dao`: đang ở khu đảo thì phát bài sinh nhật thay nhạc nền thường */
  nhacNen(bat: boolean, dao = false): void {
    this.muonNhac = bat;
    this.oDao = dao;
    const dung = dao ? this.nhacDao : this.nhac;
    const tat = dao ? this.nhac : this.nhacDao;
    if (tat && !tat.paused) tat.pause();
    if (!dung) return;
    if (bat && !this.tat) {
      if (dung.paused) dung.play().catch(() => { /* chờ lần bấm đầu tiên */ });
    } else if (!dung.paused) dung.pause();
  }
}
