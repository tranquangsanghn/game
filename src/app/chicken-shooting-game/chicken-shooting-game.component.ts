import {
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef,
  EventEmitter, NgZone, OnDestroy, Output, PLATFORM_ID, ViewChild, inject
} from '@angular/core';
import { NgTemplateOutlet, isPlatformBrowser } from '@angular/common';
import { SpriteComponent } from './sprite.component';
import { NhanVat } from './nhan-vat-sprite';
import { MABU, ZINBU } from './nhan-vat-du-lieu';

type ManChoi = 'start' | 'play' | 'pause' | 'over';
type LoaiGa = 'hen' | 'rooster' | 'flyer' | 'golden' | 'chick';
type LoaiVatPham = 'corn' | 'bread' | 'clock';

interface Ga {
  id: number; loai: LoaiGa; x: number; y: number; h: number; h0: number;
  vx: number; vy: number; phase: number; doiHuong: number; me: number;
  chet: boolean; tChet: number; daThaTrung: boolean;
}
interface Dan { id: number; p: number; x0: number; y0: number; x1: number; y1: number; t: number; T: number; phu: boolean; to: boolean; }
interface Trung { id: number; x0: number; y0: number; h0: number; xd: number; yd: number; t: number; T: number; }
interface VatPham { id: number; loai: LoaiVatPham; x: number; y: number; phase: number; t: number; }
interface Chu { id: number; x: number; y: number; text: string; mau: string; t: number; }
interface Long { id: number; x: number; y: number; vx: number; vy: number; xoay: number; vxoay: number; t: number; mau: string; }
interface Vet { id: number; x: number; y: number; t: number; loai: 'trung' | 'bui' | 'no'; }
interface ChuyenBay { x0: number; y0: number; x1: number; y1: number; t: number; T: number; }
interface NguoiChoi {
  ten: string; mau: string; diem: number; combo: number; tamX: number; tamY: number;
  hoiChieu: number; chumDen: number; banTrung: number; banTruot: number;
  x: number; y: number; dich: { x: number; y: number } | null; dangDi: boolean;
  dan: number; napDen: number; nv: NhanVat; bay: ChuyenBay | null;
}
type VatXep =
  | { loai: 'ga'; y: number; ga: Ga }
  | { loai: 'nv'; y: number; p: number };

const W = 1600;
const H = 900;
const GIUA = W / 2;
const MAP = 6400;
const TAM_VIEW_Y = 500;
// Camera đặt cao: thu nhỏ thế giới để nhìn được rộng hơn
const ZOOM = 0.55;
const MINI = 150;
const TAM_RADAR = 2600;
// Sprite pixel art phóng to S_NV lần, không ép dẹt để giữ nét
const S_NV = 2.8;
const S_GA = 0.9;
// Gà cũng bị ép dẹt theo chiều đứng như nhân vật khi nhìn từ trên cao
const EP_GA = 0.72;
const THOI_GIAN_HOANG_HON = 90;
const MANG_TOI_DA = 5;
const TOC_DO_DI = 460;
const TOC_DO_BAY = 900;
const BAY_KHI_XA = 700;
const TOC_DO_DAN = 2400;
const BANG_DAN = 12;
const THOI_GIAN_NAP = 1.4;
const TON_CHIEU = 3;
// Tầm đánh (đơn vị bản đồ). Đấm/Đá chọn ngẫu nhiên đòn gần hoặc đòn xa, đòn xa đánh được xa hơn.
// Chiêu đặc biệt đánh xa gấp 3 lần đòn xa nhất (đá xa).
const BAN_KINH_NO = 120;
const TAM_DAM_GAN = 200;
const TAM_DAM_XA = 340;
const TAM_DA_GAN = 240;
const TAM_DA_XA = 400;
const TAM_CHIEU = TAM_DA_XA * 3;
const TAM_DON: Record<string, number> = {
  punch_combo: TAM_DAM_GAN,
  punch_long: TAM_DAM_XA, punch_long_2: TAM_DAM_XA, punch_dash: TAM_DAM_XA, punch_charge: TAM_DAM_XA,
  kick_arc: TAM_DA_GAN, kick_sweep: TAM_DA_GAN,
  kick_long: TAM_DA_XA, kick_long_2: TAM_DA_XA, antenna_whip: TAM_DA_XA,
};
const KHOA_KY_LUC = 'chicken-shooting-game.ky-luc';

const DIEM: Record<LoaiGa, number> = { hen: 10, rooster: 20, flyer: 30, golden: 100, chick: -50 };
const BAN_KINH: Record<LoaiGa, number> = { hen: 34, rooster: 36, flyer: 32, golden: 30, chick: 20 };
const CHAN_GA: Record<LoaiGa, number> = { hen: 36, rooster: 36, flyer: 22, golden: 22, chick: 18 };
const MAU_LONG: Record<LoaiGa, string> = { hen: '#ffffff', rooster: '#c0392b', flyer: '#a0522d', golden: '#f7c600', chick: '#ffe14d' };

const TEN_DON: Record<string, string> = {
  antenna_wide: 'Quất râu quét', roll: 'Cuộn tròn', energy_ball: 'Cầu năng lượng',
};

const ngauNhien = (a: number, b: number) => a + Math.random() * (b - a);
const kep = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const kepMap = (v: number) => kep(v, 60, MAP - 60);

function tronMau(a: number[], b: number[], k: number) {
  const c = a.map((v, i) => Math.round(v + (b[i] - v) * k));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

@Component({
  selector: 'app-chicken-shooting-game',
  standalone: true,
  imports: [SpriteComponent, NgTemplateOutlet],
  templateUrl: './chicken-shooting-game.component.html',
  styleUrl: './chicken-shooting-game.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChickenShootingGameComponent implements AfterViewInit, OnDestroy {
  @Output() dong = new EventEmitter<void>();
  @ViewChild('khung') khungRef!: ElementRef<HTMLDivElement>;
  @ViewChild('manHinh') svgRef!: ElementRef<SVGSVGElement>;

  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);
  private laTrinhDuyet = isPlatformBrowser(inject(PLATFORM_ID));

  readonly W = W;
  readonly H = H;
  readonly GIUA = GIUA;
  readonly MAP = MAP;
  readonly MINI = MINI;
  readonly MAU_LONG = MAU_LONG;
  readonly S_NV = S_NV;
  readonly BANG_DAN = BANG_DAN;
  readonly oDan = Array.from({ length: BANG_DAN }, (_, i) => i);

  man: ManChoi = 'start';
  nguoi: NguoiChoi[] = this.taoNguoiChoi();
  ga: Ga[] = [];
  dan: Dan[] = [];
  trung: Trung[] = [];
  vet: Vet[] = [];
  vatPham: VatPham[] = [];
  chu: Chu[] = [];
  long: Long[] = [];
  xep: VatXep[][] = [[], []];
  gaBayView: Ga[][] = [[], []];
  mang = MANG_TOI_DA;
  tGame = 0;
  t = 0;
  rung = 0;
  chamDen = 0;
  kyLuc = 0;
  kyLucMoi = false;
  mauHoangHon = 'rgb(255,220,140)';
  doHoangHon = 0;

  private id = 1;
  private rafId = 0;
  private lanCuoi = 0;
  private henGa = [0.5, 0.8];
  private henVatPham = 8;
  private goLangNghe: (() => void)[] = [];

  constructor() {
    this.capNhatView();
    this.docKyLuc();
  }

  ngAfterViewInit(): void {
    if (!this.laTrinhDuyet) return;
    (document.activeElement as HTMLElement | null)?.blur();
    this.khungRef.nativeElement.focus();

    this.zone.runOutsideAngular(() => {
      const svg = this.svgRef.nativeElement;
      const nghe = <K extends keyof WindowEventMap>(el: Window | SVGSVGElement, ten: K, fn: (e: any) => void, capture = false) => {
        el.addEventListener(ten, fn, capture);
        this.goLangNghe.push(() => el.removeEventListener(ten, fn, capture));
      };
      nghe(svg, 'pointermove', (e: PointerEvent) => this.diChuot(e));
      nghe(svg, 'pointerdown', (e: PointerEvent) => this.bamChuot(e));
      nghe(svg, 'contextmenu', (e: Event) => e.preventDefault());
      nghe(svg, 'wheel', (e: WheelEvent) => this.lanChuot(e));

      this.lanCuoi = performance.now();
      this.rafId = requestAnimationFrame(this.vongLap);
    });
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.rafId);
    this.goLangNghe.forEach((go) => go());
  }

  // ─── Điều khiển màn chơi ───

  batDau(): void {
    this.nguoi = this.taoNguoiChoi();
    this.ga = [];
    this.dan = [];
    this.trung = [];
    this.vet = [];
    this.vatPham = [];
    this.chu = [];
    this.long = [];
    this.mang = MANG_TOI_DA;
    this.tGame = 0;
    this.chamDen = 0;
    this.rung = 0;
    this.henGa = [0.5, 0.8];
    this.henVatPham = ngauNhien(6, 9);
    this.kyLucMoi = false;
    this.man = 'play';
  }

  tamDung(): void {
    if (this.man === 'play') this.man = 'pause';
    else if (this.man === 'pause') this.man = 'play';
  }

  dongGame(): void {
    this.dong.emit();
  }

  get chang(): number {
    return this.tGame < 30 ? 0 : this.tGame < 60 ? 1 : 2;
  }

  get tenChang(): string {
    return ['Buổi sáng', 'Buổi chiều', 'Hoàng hôn'][this.chang];
  }

  get tongDiem(): number {
    return this.nguoi[0].diem + this.nguoi[1].diem;
  }

  get nguoiThang(): number {
    const [a, b] = this.nguoi;
    return a.diem === b.diem ? -1 : a.diem > b.diem ? 0 : 1;
  }

  get dangCham(): boolean {
    return this.chamDen > this.tGame;
  }

  dangChum(p: number): boolean {
    return this.nguoi[p].chumDen > this.tGame;
  }

  dangNap(p: number): boolean {
    return this.nguoi[p].napDen > this.tGame;
  }

  heSo(p: number): number {
    return Math.min(3, 1 + Math.floor(this.nguoi[p].combo / 5));
  }

  doChinhXac(p: number): number {
    const n = this.nguoi[p];
    const tong = n.banTrung + n.banTruot;
    return tong ? Math.round((n.banTrung / tong) * 100) : 0;
  }

  // ─── Vòng lặp ───

  private vongLap = (now: number) => {
    const dt = Math.min(0.05, (now - this.lanCuoi) / 1000);
    this.lanCuoi = now;
    if (this.man !== 'pause') {
      this.t += dt;
      if (this.man === 'play') this.capNhat(dt);
      else this.nguoi.forEach((n) => this.capNhatNhanVat(n, dt));
      this.capNhatView();
    }
    this.cdr.detectChanges();
    this.rafId = requestAnimationFrame(this.vongLap);
  };

  private capNhat(dt: number): void {
    this.tGame += dt;
    const k = kep(this.tGame / THOI_GIAN_HOANG_HON, 0, 1);
    this.mauHoangHon = tronMau([255, 220, 140], [255, 110, 60], k);
    this.doHoangHon = k * 0.3;

    const dtE = dt * (this.dangCham ? 0.45 : 1);
    this.rung = Math.max(0, this.rung - dt);

    for (let p = 0; p < 2; p++) {
      this.henGa[p] -= dtE;
      if (this.henGa[p] <= 0) {
        this.sinhGa(p);
        this.henGa[p] = [1.3, 1.0, 0.75][this.chang] * ngauNhien(0.6, 1.4);
      }
    }
    this.henVatPham -= dt;
    if (this.henVatPham <= 0) {
      this.sinhVatPham();
      this.henVatPham = ngauNhien(7, 12);
    }

    this.dieuKhien(dt);
    this.capNhatGa(dtE);
    this.capNhatTrung(dtE);
    this.capNhatDan(dt);
    this.capNhatHieuUng(dt, dtE);
  }

  private dieuKhien(dt: number): void {
    this.nguoi.forEach((n, p) => {
      n.hoiChieu = Math.max(0, n.hoiChieu - dt);
      if (n.napDen && n.napDen <= this.tGame) {
        n.napDen = 0;
        n.dan = BANG_DAN;
      }
      n.nv.tuKhi(this.dangNap(p));

      if (n.nv.khoa) {
        n.dich = null;
        n.dangDi = false;
        this.capNhatNhanVat(n, dt);
        return;
      }
      if (n.bay) {
        this.capNhatBay(n, dt);
        this.capNhatNhanVat(n, dt);
        return;
      }

      let dx = 0;
      let dy = 0;
      if (n.dich) {
        dx = n.dich.x - n.x;
        dy = n.dich.y - n.y;
        if (Math.hypot(dx, dy) < 6) {
          n.dich = null;
          dx = dy = 0;
          n.nv.tiepDat();
        }
      }
      const d = Math.hypot(dx, dy);
      n.dangDi = d > 0;
      if (n.dangDi) {
        const buoc = Math.min(TOC_DO_DI * dt, n.dich ? d : Infinity);
        n.x = kepMap(n.x + (dx / d) * buoc);
        n.y = kepMap(n.y + (dy / d) * buoc);
        if (Math.abs(dx) > d * 0.2) n.nv.lat = dx < 0;
      }
      this.capNhatNhanVat(n, dt);

      const vi = this.vatPham.findIndex((v) => Math.hypot(v.x - n.x, v.y - n.y) < 55);
      if (vi >= 0) {
        this.anVatPham(this.vatPham[vi], p);
        this.vatPham.splice(vi, 1);
      }
    });
  }

  private capNhatNhanVat(n: NguoiChoi, dt: number): void {
    const truot = n.nv.capNhat(dt, n.dangDi);
    if (truot) n.x = kepMap(n.x + truot * S_NV);
  }

  private capNhatBay(n: NguoiChoi, dt: number): void {
    const b = n.bay!;
    b.t += dt;
    const k = Math.min(1, b.t / b.T);
    n.x = b.x0 + (b.x1 - b.x0) * k;
    n.y = b.y0 + (b.y1 - b.y0) * k;
    n.dangDi = true;
    if (k < 1) {
      n.nv.bay(k);
      return;
    }
    n.bay = null;
    n.dangDi = false;
    n.nv.tiepDat();
  }

  private capNhatGa(dt: number): void {
    const conLai: Ga[] = [];
    for (const g of this.ga) {
      if (g.chet) {
        g.tChet += dt;
        g.h = Math.max(0, g.h0 + 180 * g.tChet - 600 * g.tChet * g.tChet);
        if (g.tChet < 1) conLai.push(g);
        continue;
      }
      g.phase += dt;
      const bay = g.loai === 'flyer' || g.loai === 'golden';
      if (!bay) {
        g.doiHuong -= dt;
        const me = g.loai === 'chick' ? this.ga.find((m) => m.id === g.me && !m.chet) : undefined;
        if (me) {
          const dx = me.x - 30 - g.x;
          const dy = me.y + 10 - g.y;
          const d = Math.hypot(dx, dy) || 1;
          const v = d > 40 ? 90 : 0;
          g.vx = (dx / d) * v;
          g.vy = (dy / d) * v;
        } else if (g.doiHuong <= 0) {
          g.doiHuong = ngauNhien(1.5, 3.5);
          const goc = ngauNhien(0, Math.PI * 2);
          const v = Math.random() < 0.25 ? 0 : g.loai === 'rooster' ? ngauNhien(70, 130) : ngauNhien(35, 75);
          g.vx = Math.cos(goc) * v;
          g.vy = Math.sin(goc) * v;
        }
      }
      g.x += g.vx * dt;
      g.y += g.vy * dt;
      if (!bay) {
        if (g.x < 60 || g.x > MAP - 60) g.vx = -g.vx;
        if (g.y < 60 || g.y > MAP - 60) g.vy = -g.vy;
        g.x = kepMap(g.x);
        g.y = kepMap(g.y);
      }
      switch (g.loai) {
        case 'rooster': g.h = Math.abs(Math.sin(g.phase * 5)) * 28; break;
        case 'flyer': g.h = g.h0 + Math.sin(g.phase * 3) * 30; break;
        case 'golden': g.h = g.h0 + Math.sin(g.phase * 5) * 45; break;
        default: g.h = 0;
      }
      if (g.loai === 'flyer' && !g.daThaTrung) {
        const n = this.nguoi.find((v) => Math.hypot(v.x - g.x, v.y - g.y) < 170);
        if (n && Math.random() < dt * [1.2, 1.6, 2.2][this.chang]) {
          g.daThaTrung = true;
          this.trung.push({
            id: this.id++, x0: g.x, y0: g.y, h0: (g.h + CHAN_GA[g.loai] * S_GA) * EP_GA,
            xd: n.x + ngauNhien(-40, 40), yd: n.y + ngauNhien(-25, 25), t: 0, T: 1.0,
          });
        }
      }
      if (this.khoangCachGanNhat(g.x, g.y) < 1400) conLai.push(g);
    }
    this.ga = conLai;
  }

  private capNhatTrung(dt: number): void {
    const conLai: Trung[] = [];
    for (const e of this.trung) {
      e.t += dt;
      if (e.t >= e.T) {
        const n = this.nguoi.find((v) => !v.nv.khoa && v.nv.cao < 10 && Math.hypot(v.x - e.xd, (v.y - e.yd) * 1.5) < 45);
        if (n) this.biTrung(e, n);
        else this.vet.push({ id: this.id++, x: e.xd, y: e.yd, t: 0, loai: 'trung' });
        continue;
      }
      conLai.push(e);
    }
    this.trung = conLai;
  }

  private capNhatDan(dt: number): void {
    const conLai: Dan[] = [];
    for (const d of this.dan) {
      d.t += dt;
      if (d.t < d.T) conLai.push(d);
      else this.chamDich(d);
    }
    this.dan = conLai;
  }

  private chamDich(d: Dan): void {
    const { x1: x, y1: y, p } = d;
    if (d.to) {
      this.no(d);
      return;
    }
    const g = this.ga.find((v) => {
      if (v.chet) return false;
      const tam = this.tamGa(v);
      return Math.hypot(tam.x - x, tam.y - y) < BAN_KINH[v.loai] * S_GA * 1.25;
    });
    if (g) {
      this.trungGa(g, p);
      return;
    }
    const ei = this.trung.findIndex((e) => {
      const vt = this.viTriTrung(e);
      return Math.hypot(vt.x - x, vt.y - y) < 26;
    });
    if (ei >= 0) {
      const vt = this.viTriTrung(this.trung[ei]);
      this.trung.splice(ei, 1);
      this.congDiem(p, 5, vt.x, vt.y, '+5 vỡ trứng');
      this.nguoi[p].banTrung++;
      return;
    }
    const vi = this.vatPham.findIndex((v) => Math.hypot(v.x - x, v.y - 40 - y) < 40);
    if (vi >= 0) {
      this.anVatPham(this.vatPham[vi], p);
      this.vatPham.splice(vi, 1);
      return;
    }
    this.vet.push({ id: this.id++, x, y, t: 0, loai: 'bui' });
    if (!d.phu) {
      this.nguoi[p].combo = 0;
      this.nguoi[p].banTruot++;
    }
  }

  // Chiêu đặc biệt: nổ trúng mọi con gà trong bán kính, kể cả gà con
  private no(d: Dan): void {
    const trung = this.ga.filter((g) => {
      if (g.chet) return false;
      const tam = this.tamGa(g);
      return Math.hypot(tam.x - d.x1, tam.y - d.y1) < BAN_KINH_NO;
    });
    trung.forEach((g) => this.trungGa(g, d.p));
    this.vet.push({ id: this.id++, x: d.x1, y: d.y1, t: 0, loai: 'no' });
    this.rung = Math.max(this.rung, 0.15);
    if (!trung.length) {
      this.nguoi[d.p].combo = 0;
      this.nguoi[d.p].banTruot++;
    }
  }

  private capNhatHieuUng(dt: number, dtE: number): void {
    for (const v of this.vatPham) {
      v.phase += dtE;
      v.t += dt;
    }
    this.vatPham = this.vatPham.filter((v) => v.t < 14);

    for (const c of this.chu) {
      c.t += dt;
      c.y -= 55 * dt;
    }
    this.chu = this.chu.filter((c) => c.t < 1);

    for (const l of this.long) {
      l.t += dt;
      l.vy += 160 * dt;
      l.vx *= 0.97;
      l.x += l.vx * dt;
      l.y += l.vy * dt;
      l.xoay += l.vxoay * dt;
    }
    this.long = this.long.filter((l) => l.t < 1.3);

    for (const v of this.vet) v.t += dt;
    this.vet = this.vet.filter((v) => v.t < (v.loai === 'trung' ? 3 : 0.45));
  }

  // Lọc vật trong khung nhìn từng nửa, xếp theo y để vẽ trước/sau
  private capNhatView(): void {
    for (let p = 0; p < 2; p++) {
      const cam = this.nguoi[p];
      const trong = (x: number, y: number, le: number) =>
        Math.abs(x - cam.x) < 400 / ZOOM + le && y - cam.y > -TAM_VIEW_Y / ZOOM - le && y - cam.y < (H - TAM_VIEW_Y) / ZOOM + le;
      const xep: VatXep[] = [];
      for (const g of this.ga) {
        if (g.loai === 'flyer' || g.loai === 'golden' || !trong(g.x, g.y, 80)) continue;
        xep.push({ loai: 'ga', y: g.y, ga: g });
      }
      this.nguoi.forEach((n, i) => { if (trong(n.x, n.y, 200)) xep.push({ loai: 'nv', y: n.y, p: i }); });
      xep.sort((a, b) => a.y - b.y);
      this.xep[p] = xep;
      this.gaBayView[p] = this.ga.filter((g) => (g.loai === 'flyer' || g.loai === 'golden') && trong(g.x, g.y, 400));
    }
  }

  // ─── Sinh đối tượng ───

  private khoangCachGanNhat(x: number, y: number): number {
    return Math.min(...this.nguoi.map((n) => Math.hypot(n.x - x, n.y - y)));
  }

  private diemQuanh(p: number, rMin: number, rMax: number) {
    const n = this.nguoi[p];
    const goc = ngauNhien(0, Math.PI * 2);
    const r = ngauNhien(rMin, rMax);
    return { x: kepMap(n.x + Math.cos(goc) * r), y: kepMap(n.y + Math.sin(goc) * r) };
  }

  private sinhGa(p: number): void {
    const n = this.nguoi[p];
    const gioiHan = [10, 12, 14][this.chang];
    if (this.ga.filter((g) => !g.chet && Math.hypot(g.x - n.x, g.y - n.y) < 900 / ZOOM).length >= gioiHan) return;

    const r = Math.random() * 100;
    const loai: LoaiGa = r < 38 ? 'hen' : r < 62 ? 'rooster' : r < 96.5 ? 'flyer' : 'golden';
    const tao = (l: LoaiGa, x: number, y: number, vx: number, vy: number, h0: number, me = 0) => {
      const g: Ga = {
        id: this.id++, loai: l, x, y, h: h0, h0, vx, vy, phase: Math.random() * 6, doiHuong: 0, me,
        chet: false, tChet: 0, daThaTrung: false,
      };
      this.ga.push(g);
      return g;
    };

    if (loai === 'flyer' || loai === 'golden') {
      const goc = ngauNhien(0, Math.PI * 2);
      const x = n.x + Math.cos(goc) * 700 / ZOOM;
      const y = n.y + Math.sin(goc) * 700 / ZOOM;
      const huong = Math.atan2(n.y - y, n.x - x) + ngauNhien(-0.35, 0.35);
      const v = loai === 'golden' ? ngauNhien(330, 420) : ngauNhien(150, 210) * (1 + this.chang * 0.2);
      tao(loai, x, y, Math.cos(huong) * v, Math.sin(huong) * v, loai === 'golden' ? 260 : ngauNhien(200, 300));
      return;
    }
    const vt = this.diemQuanh(p, 480 / ZOOM, 680 / ZOOM);
    const me = tao(loai, vt.x, vt.y, 0, 0, 0);
    if (loai === 'hen' && Math.random() < 0.45) {
      const soCon = Math.random() < 0.5 ? 1 : 2;
      for (let i = 1; i <= soCon; i++) tao('chick', vt.x - 40 * i, vt.y + 12 * i, 0, 0, 0, me.id);
    }
  }

  private sinhVatPham(): void {
    const ds: LoaiVatPham[] = ['corn', 'corn', 'clock', 'bread'];
    const loai = this.mang < MANG_TOI_DA ? ds[Math.floor(Math.random() * ds.length)] : (Math.random() < 0.6 ? 'corn' : 'clock');
    const vt = this.diemQuanh(Math.random() < 0.5 ? 0 : 1, 200, 380);
    this.vatPham.push({ id: this.id++, loai, x: vt.x, y: vt.y, phase: 0, t: 0 });
  }

  // ─── Bắn & tính điểm ───

  private napDan(p: number): void {
    const n = this.nguoi[p];
    if (this.dangNap(p) || n.dan === BANG_DAN) return;
    n.napDen = this.tGame + THOI_GIAN_NAP;
  }

  // Nhóm Đấm: 1 viên · Đá: 2 viên tản · Chiêu đặc biệt: 1 quả cầu nổ diện rộng, tốn 3 khí
  private ban(p: number, x: number, y: number): void {
    const n = this.nguoi[p];
    if (n.hoiChieu > 0 || this.dangNap(p) || n.nv.khoa) return;
    const chieu = n.nv.nhom === 2;
    const ton = chieu ? TON_CHIEU : 1;
    if (n.dan < ton) {
      this.napDan(p);
      return;
    }
    // Animation đòn chạy chậm 1/2 nên thời gian hồi cũng gấp đôi
    n.hoiChieu = (chieu ? 0.8 : n.nv.nhom === 1 ? 0.32 : n.dangDi ? 0.3 : 0.2) * 2;
    n.dan -= ton;
    if (!n.dangDi) n.nv.lat = x < n.x;
    if (!n.bay) n.nv.raDon(this.t);

    // Giới hạn tầm theo đòn vừa ra: chuột trỏ xa hơn tầm thì đòn dừng ở mép tầm đánh
    const tam = chieu ? TAM_CHIEU : TAM_DON[n.nv.donVuaRa ?? ''] ?? (n.nv.nhom === 1 ? TAM_DA_GAN : TAM_DAM_GAN);
    const ddx = x - n.x;
    const ddy = y - n.y;
    const dd = Math.hypot(ddx, ddy);
    if (dd > tam) {
      x = n.x + (ddx / dd) * tam;
      y = n.y + (ddy / dd) * tam;
    }

    const tay = this.viTriTay(p);
    const tanX = n.dangDi ? ngauNhien(-18, 18) : 0;
    const tanY = n.dangDi ? ngauNhien(-14, 14) : 0;
    const lech = [...(n.nv.nhom === 1 ? [-28, 28] : [0]), ...(this.dangChum(p) ? [-70, 70] : [])];
    lech.forEach((dx, i) => {
      const x1 = x + tanX + dx;
      const y1 = y + tanY + Math.abs(dx) * 0.3;
      const T = Math.hypot(x1 - tay.x, y1 - tay.y) / (chieu ? TOC_DO_DAN * 0.55 : TOC_DO_DAN);
      this.dan.push({ id: this.id++, p, x0: tay.x, y0: tay.y, x1, y1, t: 0, T, phu: i > 0, to: chieu && i === 0 });
    });
    if (n.dan === 0) this.napDan(p);
  }

  doiNhom(p: number, buoc: number): void {
    this.nguoi[p].nv.doiNhom(buoc, this.t);
  }

  tenNhom(p: number): string {
    const nv = this.nguoi[p].nv;
    return nv.nhom === 2 ? TEN_DON[nv.donVong(this.t)] ?? nv.tenNhom : nv.tenNhom;
  }

  private trungGa(g: Ga, p: number): void {
    const n = this.nguoi[p];
    const tam = this.tamGa(g);
    g.chet = true;
    g.h0 = g.h;
    for (let i = 0; i < 9; i++) {
      this.long.push({
        id: this.id++, x: tam.x, y: tam.y, vx: ngauNhien(-220, 220), vy: ngauNhien(-260, 40),
        xoay: ngauNhien(0, 360), vxoay: ngauNhien(-400, 400), t: 0, mau: MAU_LONG[g.loai],
      });
    }
    if (g.loai === 'chick') {
      n.combo = 0;
      n.banTruot++;
      n.diem = Math.max(0, n.diem + DIEM.chick);
      this.chu.push({ id: this.id++, x: tam.x, y: tam.y - 30, text: '-50 Gà con!', mau: '#e74c3c', t: 0 });
      return;
    }
    n.combo++;
    n.banTrung++;
    const hs = this.heSo(p);
    const nhan = hs > 1 ? ` x${hs}` : '';
    this.congDiem(p, DIEM[g.loai] * hs, tam.x, tam.y - 30, `+${DIEM[g.loai] * hs}${nhan}`);
    if (n.combo > 0 && n.combo % 5 === 0 && hs > 1) {
      this.chu.push({ id: this.id++, x: tam.x, y: tam.y - 70, text: `${n.ten} COMBO x${hs}!`, mau: '#ff9f1a', t: 0 });
    }
  }

  private congDiem(p: number, diem: number, x: number, y: number, text: string): void {
    this.nguoi[p].diem += diem;
    this.chu.push({ id: this.id++, x, y, text, mau: this.nguoi[p].mau, t: 0 });
  }

  private anVatPham(v: VatPham, p: number): void {
    const n = this.nguoi[p];
    if (v.loai === 'corn') {
      n.chumDen = this.tGame + 5;
      this.chu.push({ id: this.id++, x: v.x, y: v.y - 60, text: `${n.ten}: bắn chùm 5s!`, mau: '#f39c12', t: 0 });
    } else if (v.loai === 'bread') {
      this.mang = Math.min(MANG_TOI_DA, this.mang + 1);
      this.chu.push({ id: this.id++, x: v.x, y: v.y - 60, text: '+1 mạng', mau: '#27ae60', t: 0 });
    } else {
      this.chamDen = this.tGame + 5;
      this.chu.push({ id: this.id++, x: v.x, y: v.y - 60, text: 'Gà chậm lại 5s!', mau: '#8e44ad', t: 0 });
    }
  }

  private biTrung(e: Trung, n: NguoiChoi): void {
    n.bay = null;
    n.nv.nga();
    this.mang--;
    this.rung = 0.35;
    this.vet.push({ id: this.id++, x: e.xd, y: e.yd, t: 0, loai: 'trung' });
    this.chu.push({ id: this.id++, x: e.xd, y: e.yd - 170, text: '-1 mạng', mau: '#e74c3c', t: 0 });
    if (this.mang <= 0) this.ketThuc();
  }

  private ketThuc(): void {
    this.man = 'over';
    this.nguoi.forEach((n) => {
      n.dich = null;
      n.dangDi = false;
      n.nv.tuKhi(false);
    });
    if (this.tongDiem > this.kyLuc) {
      this.kyLuc = this.tongDiem;
      this.kyLucMoi = true;
      try {
        localStorage.setItem(KHOA_KY_LUC, String(this.kyLuc));
      } catch { /* trình duyệt chặn localStorage */ }
    }
  }

  // ─── Input ───

  private lanChuot(e: WheelEvent): void {
    e.preventDefault();
    const pt = this.toaDo(e);
    if (!pt || this.man !== 'play' || !e.deltaY) return;
    this.doiNhom(pt.x < GIUA ? 0 : 1, e.deltaY > 0 ? 1 : -1);
  }

  private diChuot(e: PointerEvent): void {
    const pt = this.toaDo(e);
    if (!pt) return;
    const p = pt.x < GIUA ? 0 : 1;
    this.nguoi[p].tamX = pt.x;
    this.nguoi[p].tamY = pt.y;
    if (this.man !== 'play') return;
    // Bấm thêm nút khi nút khác đang giữ: trình duyệt chỉ phát pointermove
    if (e.button === 0 || e.button === 2) this.bamChuot(e);
    else if (e.buttons & 2) this.datDich(p, pt.x, pt.y);
  }

  private bamChuot(e: PointerEvent): void {
    if (this.man !== 'play') return;
    const pt = this.toaDo(e);
    if (!pt) return;
    const p = pt.x < GIUA ? 0 : 1;
    if (e.button === 2 && e.buttons & 2) {
      this.datDich(p, pt.x, pt.y);
      return;
    }
    if (e.button !== 0 || !(e.buttons & 1)) return;
    const w = this.manHinhRaThe(p, pt.x, pt.y);
    this.ban(p, w.x, w.y);
  }

  // Chỉ xa thì bay theo vòng cung, gần thì chạy
  private datDich(p: number, x: number, y: number): void {
    const n = this.nguoi[p];
    if (n.nv.khoa || n.bay) return;
    const w = this.manHinhRaThe(p, x, y);
    const dich = { x: kepMap(w.x), y: kepMap(w.y) };
    const d = Math.hypot(dich.x - n.x, dich.y - n.y);
    if (d <= BAY_KHI_XA) {
      n.dich = dich;
      return;
    }
    n.dich = null;
    n.nv.lat = dich.x < n.x;
    n.bay = { x0: n.x, y0: n.y, x1: dich.x, y1: dich.y, t: 0, T: d / TOC_DO_BAY };
  }

  private toaDo(e: MouseEvent): DOMPoint | null {
    const ctm = this.svgRef.nativeElement.getScreenCTM();
    return ctm ? new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse()) : null;
  }

  private gocView(p: number) {
    const n = this.nguoi[p];
    return { x: p * GIUA + GIUA / 2 - n.x * ZOOM, y: TAM_VIEW_Y - n.y * ZOOM };
  }

  private manHinhRaThe(p: number, x: number, y: number) {
    const o = this.gocView(p);
    return { x: (x - o.x) / ZOOM, y: (y - o.y) / ZOOM };
  }

  // ─── Hỗ trợ vẽ ───

  viewBoxRadar(p: number): string {
    const n = this.nguoi[p];
    return `${(n.x - TAM_RADAR / 2).toFixed(0)} ${(n.y - TAM_RADAR / 2).toFixed(0)} ${TAM_RADAR} ${TAM_RADAR}`;
  }

  khungMini(p: number) {
    const n = this.nguoi[p];
    return { x: n.x - GIUA / 2 / ZOOM, y: n.y - TAM_VIEW_Y / ZOOM, w: GIUA / ZOOM, h: H / ZOOM };
  }

  viewTransform(p: number): string {
    const o = this.gocView(p);
    const rx = this.rung > 0 ? ngauNhien(-6, 6) : 0;
    return `translate(${(o.x + rx).toFixed(1)},${o.y.toFixed(1)}) scale(${ZOOM})`;
  }

  nvTransform(p: number): string {
    const n = this.nguoi[p];
    return `translate(${n.x.toFixed(1)},${(n.y - n.nv.cao * S_NV).toFixed(1)}) scale(${S_NV})`;
  }

  private viTriTay(p: number) {
    const n = this.nguoi[p];
    const { dx, dy } = n.nv.diemBan;
    return { x: n.x + (n.nv.lat ? -dx : dx) * S_NV, y: n.y + (dy - n.nv.cao) * S_NV };
  }

  tamGa(g: Ga) {
    return { x: g.x, y: g.y - (CHAN_GA[g.loai] * S_GA + g.h) * EP_GA };
  }

  gaTransform(g: Ga): string {
    return `translate(${g.x.toFixed(1)},${g.y.toFixed(1)}) scale(${S_GA},${S_GA * EP_GA})`;
  }

  gaThan(g: Ga): string {
    const xoay = g.chet ? g.tChet * 540 : 0;
    return `translate(0,${(-CHAN_GA[g.loai] - g.h / S_GA).toFixed(1)}) rotate(${xoay.toFixed(0)}) scale(${g.vx < 0 ? -1 : 1},1)`;
  }

  bongGa(g: Ga): number {
    return Math.max(0.35, 1 - g.h / 400);
  }

  vatPhamTransform(v: VatPham): string {
    return `translate(${v.x.toFixed(1)},${(v.y - 40 + Math.sin(v.phase * 4) * 6).toFixed(1)})`;
  }

  viTriTrung(e: Trung) {
    const k = e.t / e.T;
    return { x: e.x0 + (e.xd - e.x0) * k, y: e.y0 + (e.yd - e.y0) * k - e.h0 * (1 - k * k) };
  }

  bongTrungTransform(e: Trung): string {
    const k = e.t / e.T;
    return `translate(${(e.x0 + (e.xd - e.x0) * k).toFixed(1)},${(e.y0 + (e.yd - e.y0) * k).toFixed(1)})`;
  }

  trungTransform(e: Trung): string {
    const vt = this.viTriTrung(e);
    return `translate(${vt.x.toFixed(1)},${vt.y.toFixed(1)})`;
  }

  bongTrung(e: Trung): number {
    return e.t / e.T;
  }

  danHienTai(d: Dan) {
    const k = Math.min(1, d.t / d.T);
    const k0 = Math.max(0, k - 0.12);
    return {
      x: d.x0 + (d.x1 - d.x0) * k, y: d.y0 + (d.y1 - d.y0) * k,
      xs: d.x0 + (d.x1 - d.x0) * k0, ys: d.y0 + (d.y1 - d.y0) * k0,
    };
  }

  dichNhay(): number {
    return 1 - ((this.t * 2) % 1);
  }

  chanGa(g: Ga): number {
    return g.chet || (!g.vx && !g.vy) ? 0 : Math.sin(g.phase * 14) * 7;
  }

  canhGa(g: Ga): number {
    return Math.sin(g.phase * (g.loai === 'golden' ? 26 : 18)) * 38;
  }

  moGa(g: Ga): number {
    return g.loai === 'hen' && !g.chet && !g.vx && !g.vy ? Math.max(0, Math.sin(g.phase * 4)) * 22 : 0;
  }

  mauThan(g: Ga): string {
    return { hen: '#fdfdfd', rooster: '#c0392b', flyer: '#a0522d', golden: '#f7c600', chick: '#ffe14d' }[g.loai];
  }

  mauCanh(g: Ga): string {
    return { hen: '#e3e3e3', rooster: '#8e2a1a', flyer: '#7a3d1d', golden: '#e0a800', chick: '#f5cc2e' }[g.loai];
  }

  mauDau(g: Ga): string {
    return g.loai === 'rooster' ? '#e0662f' : this.mauThan(g);
  }

  // ─── Khởi tạo ───

  private taoNguoiChoi(): NguoiChoi[] {
    return [0, 1].map((p) => ({
      ten: p === 0 ? MABU.ten : ZINBU.ten, mau: p === 0 ? '#e84393' : '#8e44ad',
      diem: 0, combo: 0, tamX: p * GIUA + GIUA / 2, tamY: 300, hoiChieu: 0, chumDen: 0, banTrung: 0, banTruot: 0,
      x: MAP / 2 + (p === 0 ? -160 : 160), y: MAP / 2 + 120, dich: null, dangDi: false,
      dan: BANG_DAN, napDen: 0, nv: this.taoNhanVat(p), bay: null,
    }));
  }

  private taoNhanVat(p: number): NhanVat {
    const nv = new NhanVat(p === 0 ? MABU : ZINBU);
    nv.lat = p === 0;
    return nv;
  }

  private docKyLuc(): void {
    if (!this.laTrinhDuyet) return;
    try {
      this.kyLuc = Number(localStorage.getItem(KHOA_KY_LUC)) || 0;
    } catch {
      this.kyLuc = 0;
    }
  }
}
