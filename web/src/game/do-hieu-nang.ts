/**
 * Bộ đo hiệu năng (chỉ bật khi mở game với `?doHieuNang` trên đường dẫn; tắt thì mọi hàm trả về ngay, gần như không tốn gì).
 *
 * - Mỗi khung: đo thời gian từng phần (logic gà, Cell, đạn…, vẽ nền, thế giới, HUD) bằng `moc(ten)`:
 *   thời gian từ mốc trước tới mốc này được cộng cho `ten`.
 * - Mỗi giây ghi một dòng log: FPS, khung chậm nhất, ms trung bình từng phần, số vật trong từng mảng của game,
 *   cỡ bộ nhớ đệm ảnh, RAM JS (Chrome), dpr / mát máy, vùng đang đứng.
 * - Tự đánh dấu bất thường (`canh`): FPS thấp, khung dài (kèm phần tốn nhất), nghẽn vẽ / GPU (khung dài mà JS ngắn),
 *   RAM tăng đều, GC dọn nhiều, mảng tăng bất thường, long task của trình duyệt.
 * - Giữ ~10 phút gần nhất (bộ đệm vòng), lưu vào localStorage mỗi 5s (tải lại trang / treo vẫn còn),
 *   bảng nhỏ góc dưới trái có nút Tải log (JSON) / Xoá; console: `__hieuNang.tai()`, `__hieuNang.log`.
 */

const SO_DONG = 600;
const KHOA_LUU = 'ga-hieu-nang';
const KHUNG_DAI = 50;
const FPS_THAP = 30;

type Phan = Record<string, number>;

export interface DongLog {
  /** Giờ máy (ISO) */
  luc: string;
  /** Giây kể từ lúc bật bộ đo */
  s: number;
  fps: number;
  /** Khoảng cách lớn nhất giữa 2 khung (ms) */
  khungMax: number;
  /** ms JS trung bình mỗi khung (tổng các phần) */
  js: number;
  /** ms trung bình mỗi khung theo từng phần */
  phan: Phan;
  /** Số vật trong từng mảng của game, cỡ bộ nhớ đệm, vùng… */
  dem: Record<string, number | string | boolean>;
  /** RAM JS đang dùng (MB, chỉ Chrome / Edge) */
  ram?: number;
  canh: string[];
}

interface CuaSo { __hieuNang?: DoHieuNang }
interface BoNho { usedJSHeapSize: number }

export class DoHieuNang {
  readonly bat: boolean;
  log: DongLog[] = [];
  private moc0 = 0;
  private phanKhung: Phan = {};
  private phanGiay: Phan = {};
  private soKhung = 0;
  private khungTruoc = 0;
  private khungMax = 0;
  private dauGiay = 0;
  private batLuc = 0;
  private ramTruoc = 0;
  private longTask: string[] = [];
  private bang: HTMLDivElement | null = null;
  private lanLuu = 0;
  /** Bảng thu gọn (chỉ dòng đầu) */
  private gon = false;

  constructor() {
    let bat = false;
    try { bat = new URLSearchParams(location.search).has('doHieuNang'); } catch { /* không có location */ }
    this.bat = bat;
    if (!bat) return;
    try { this.log = JSON.parse(localStorage.getItem(KHOA_LUU) ?? '[]') as DongLog[]; } catch { this.log = []; }
    if (this.log.length) this.log.push({ luc: new Date().toISOString(), s: 0, fps: 0, khungMax: 0, js: 0, phan: {}, dem: {}, canh: ['— mở lại trang (log cũ ở trên) —'] });
    this.batLuc = performance.now();
    (window as unknown as CuaSo).__hieuNang = this;
    try {
      new PerformanceObserver((ds) => {
        for (const d of ds.getEntries()) this.longTask.push(`long task trình duyệt ${Math.round(d.duration)}ms`);
      }).observe({ type: 'longtask', buffered: false });
    } catch { /* Firefox / Safari không có longtask */ }
  }

  /** Đầu khung hình (sau khi đã qua giới hạn FPS) */
  batDauKhung(now: number): void {
    if (!this.bat) return;
    if (this.khungTruoc) this.khungMax = Math.max(this.khungMax, now - this.khungTruoc);
    this.khungTruoc = now;
    this.phanKhung = {};
    this.moc0 = performance.now();
  }

  /** Cộng thời gian từ mốc trước tới giờ cho phần `ten` */
  moc(ten: string): void {
    if (!this.bat) return;
    const t = performance.now();
    this.phanKhung[ten] = (this.phanKhung[ten] ?? 0) + t - this.moc0;
    this.moc0 = t;
  }

  /** Cuối khung: dồn số liệu; mỗi giây ghi một dòng (thongKe chỉ gọi mỗi giây) */
  ketKhung(now: number, thongKe: () => Record<string, number | string | boolean>): void {
    if (!this.bat) return;
    this.soKhung++;
    let js = 0;
    for (const k in this.phanKhung) {
      const v = this.phanKhung[k]!;
      js += v;
      this.phanGiay[k] = (this.phanGiay[k] ?? 0) + v;
    }
    if (js > KHUNG_DAI) this.longTask.push(`khung JS dài ${Math.round(js)}ms: ${topPhan(this.phanKhung, 3)}`);
    if (!this.dauGiay) this.dauGiay = now;
    if (now - this.dauGiay >= 1000) this.ghiDong(now, thongKe());
  }

  private ghiDong(now: number, dem: Record<string, number | string | boolean>): void {
    const n = Math.max(1, this.soKhung);
    const fps = Math.round((this.soKhung * 1000) / (now - this.dauGiay));
    const phan: Phan = {};
    let js = 0;
    for (const k in this.phanGiay) { phan[k] = tron(this.phanGiay[k]! / n); js += this.phanGiay[k]!; }
    js = tron(js / n);
    const bn = (performance as unknown as { memory?: BoNho }).memory;
    const ram = bn ? tron(bn.usedJSHeapSize / 1048576) : undefined;
    const canh = this.longTask.splice(0, 5);
    const muc = typeof dem['fpsMucTieu'] === 'number' ? dem['fpsMucTieu'] : 60;
    if (fps < FPS_THAP) canh.push(`FPS thấp ${fps}: tốn nhất ${topPhan(phan, 3)}`);
    // Khung thưa mà JS ngắn: thời gian nằm ở trình duyệt vẽ / GPU (canvas to, dpr cao, nhiều điểm ảnh phủ) hoặc máy bận việc khác
    const khungTb = 1000 / Math.max(1, fps);
    if (fps < muc * 0.85 && js < khungTb * 0.4) canh.push(`nghẽn ngoài JS (vẽ / GPU / máy bận): khung ${tron(khungTb)}ms nhưng JS chỉ ${js}ms`);
    if (ram !== undefined && this.ramTruoc) {
      if (ram < this.ramTruoc - 20) canh.push(`GC dọn ${tron(this.ramTruoc - ram)}MB`);
    }
    if (ram !== undefined) this.ramTruoc = ram;
    // So với 60 giây trước: RAM tăng đều, mảng phình ra
    const cu = this.log.length >= 60 ? this.log[this.log.length - 60] : undefined;
    if (cu && cu.s > 0) {
      if (ram !== undefined && cu.ram !== undefined && ram - cu.ram > 40) canh.push(`RAM tăng ${tron(ram - cu.ram)}MB trong 60s (${cu.ram} → ${ram}MB)`);
      for (const k in dem) {
        const a = cu.dem[k], b = dem[k];
        if (typeof a === 'number' && typeof b === 'number' && b > 100 && b > a * 2) canh.push(`mảng ${k} tăng ${a} → ${b} trong 60s`);
      }
    }
    const dong: DongLog = { luc: new Date().toISOString(), s: Math.round((now - this.batLuc) / 1000), fps, khungMax: Math.round(this.khungMax), js, phan, dem, ram, canh };
    this.log.push(dong);
    if (this.log.length > SO_DONG) this.log.splice(0, this.log.length - SO_DONG);
    for (const c of canh) console.warn('[hiệu năng]', c);
    this.phanGiay = {};
    this.soKhung = 0;
    this.khungMax = 0;
    this.dauGiay = now;
    this.veBang(dong);
    if (now - this.lanLuu > 5000) {
      this.lanLuu = now;
      try { localStorage.setItem(KHOA_LUU, JSON.stringify(this.log)); } catch { /* đầy bộ nhớ */ }
    }
  }

  /** Tải log về máy (JSON) */
  tai(): void {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(this.log, null, 1)], { type: 'application/json' }));
    a.download = `hieu-nang-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  xoa(): void {
    this.log = [];
    try { localStorage.removeItem(KHOA_LUU); } catch { /* bỏ qua */ }
  }

  private veBang(d: DongLog): void {
    if (!this.bang) {
      const b = document.createElement('div');
      b.style.cssText = 'position:fixed;right:8px;top:56px;z-index:10001;max-width:min(380px,calc(100vw - 16px));padding:6px 8px;'
        + 'background:rgba(0,0,0,.72);color:#cfe;font:10px/1.3 ui-monospace,monospace;border-radius:6px;white-space:pre-wrap;pointer-events:auto';
      const nd = document.createElement('div');
      nd.style.cursor = 'pointer';
      nd.title = 'Bấm để thu gọn / mở rộng';
      nd.addEventListener('click', (e) => { e.stopPropagation(); this.gon = !this.gon; this.veBang(this.log[this.log.length - 1]!); });
      nd.addEventListener('pointerdown', (e) => e.stopPropagation());
      const nut = (chu: string, f: () => void) => {
        const n = document.createElement('button');
        n.textContent = chu;
        n.style.cssText = 'margin:4px 6px 0 0;font:11px sans-serif;padding:2px 8px;cursor:pointer';
        n.addEventListener('click', (e) => { e.stopPropagation(); f(); });
        n.addEventListener('pointerdown', (e) => e.stopPropagation());
        return n;
      };
      b.append(nd, nut('Tải log', () => this.tai()), nut('Xoá log', () => this.xoa()));
      document.body.append(b);
      this.bang = b;
    }
    const nd = this.bang.firstChild as HTMLDivElement;
    const dem = Object.entries(d.dem).filter(([, v]) => typeof v !== 'number' || v > 0).map(([k, v]) => `${k}:${v}`).join(' ');
    const canh = this.log.slice(-30).flatMap((l) => l.canh.map((c) => `${l.luc.slice(11, 19)} ${c}`)).slice(-3);
    if (this.gon) { nd.textContent = `FPS ${d.fps} · JS ${d.js}ms${d.ram !== undefined ? ` · RAM ${d.ram}MB` : ''}${canh.length ? ' ⚠' : ''}`; return; }
    nd.textContent = `FPS ${d.fps} · khung max ${d.khungMax}ms · JS ${d.js}ms${d.ram !== undefined ? ` · RAM ${d.ram}MB` : ''}\n`
      + `${topPhan(d.phan, 5)}\n${dem}${canh.length ? `\n⚠ ${canh.join('\n⚠ ')}` : ''}`;
  }
}

function tron(x: number): number {
  return Math.round(x * 100) / 100;
}

function topPhan(p: Phan, n: number): string {
  return Object.entries(p).sort((a, b) => b[1] - a[1]).slice(0, n).map(([k, v]) => `${k} ${tron(v)}ms`).join(', ');
}

/** Một bộ đo dùng chung cho cả game (game.ts, ve-canvas.ts) */
export const HN = new DoHieuNang();
