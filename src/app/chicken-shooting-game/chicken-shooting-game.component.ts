import {
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef,
  EventEmitter, NgZone, OnDestroy, Output, PLATFORM_ID, ViewChild, inject
} from '@angular/core';
import { NgTemplateOutlet, isPlatformBrowser } from '@angular/common';
import { KhungSprite, SpriteComponent } from './sprite.component';
import { NhanVat } from './nhan-vat-sprite';
import { MABU, ZINBU } from './nhan-vat-du-lieu';
import { GA_DEN, GA_DO, GA_TRANG, GA_TUONG, GA_VANG, KHUNG_BAY, KHUNG_CHAY, KHUNG_CHET, KHUNG_DUNG } from './ga-du-lieu';

type ManChoi = 'start' | 'play' | 'pause' | 'over';
// hen = gà trắng (đi bộ) · rooster = gà đỏ (đi nhanh, nhảy) · flyer = gà đen (bay, thả trứng)
// chick = gà con (đừng bắn) · boss = gà tướng (to gấp 5 lần, đủ 3 màu, nhiều máu)
type LoaiGa = 'hen' | 'rooster' | 'flyer' | 'chick' | 'boss';

interface Ga {
  id: number; loai: LoaiGa; x: number; y: number; h: number; h0: number;
  vx: number; vy: number; phase: number; doiHuong: number; me: number;
  chet: boolean; tChet: number;
  lat: boolean; hp: number; nhay: number; chamMay?: number;
}
interface Dan { id: number; p: number; x0: number; y0: number; x1: number; y1: number; t: number; T: number; phu: boolean; to: boolean; }
interface Chu { id: number; x: number; y: number; text: string; mau: string; t: number; }
interface Long { id: number; x: number; y: number; vx: number; vy: number; xoay: number; vxoay: number; t: number; mau: string; }
interface Vet { id: number; x: number; y: number; t: number; loai: 'bui' | 'no'; }
interface ChuyenBay { x0: number; y0: number; x1: number; y1: number; t: number; T: number; }
interface NguoiChoi {
  ten: string; mau: string; diem: number; combo: number; tamX: number; tamY: number;
  hoiChieu: number; chumDen: number; banTrung: number; banTruot: number;
  x: number; y: number; dich: { x: number; y: number } | null; dangDi: boolean;
  mana: number[]; khoaMana: number[]; hoiMana: number[]; nv: NhanVat; bay: ChuyenBay | null;
  nhin: { x: number; y: number }; nham: { x: number; y: number } | null;
  may: { dang: boolean; con: number; hoi: number };
}
interface DauVao { hx: number; hy: number; danh: boolean; }
type VatXep =
  | { loai: 'ga'; y: number; ga: Ga }
  | { loai: 'nv'; y: number; p: number };

const W = 1600;
const H = 900;
const GIUA = W / 2;
const MAP = 6400;
const TAM_VIEW_Y = 520;
// Camera chung đặt ở trung điểm 2 nhân vật. ZOOM là mức gần nhất, hai người càng xa thì càng thu nhỏ tới ZOOM_MIN.
const ZOOM = 0.55;
const ZOOM_MIN = 0.36;
// Phần màn hình (pixel) dành cho khoảng cách giữa 2 nhân vật: chiều ngang, chiều dọc
const VUNG_X = 1000;
const VUNG_Y = 660;
// Khoảng cách tối đa giữa 2 nhân vật (đơn vị bản đồ), vượt quá thì bị chặn lại như dây buộc
const MAX_DX = VUNG_X / ZOOM_MIN;
const MAX_DY = VUNG_Y / ZOOM_MIN;
const DAI_BAY_PHIM = 650;
// Sprite pixel art phóng to S_NV lần, không ép dẹt để giữ nét
const S_NV = 2.8;
const S_GA = 0.9;
// Gà cũng bị ép dẹt theo chiều đứng như nhân vật khi nhìn từ trên cao
const EP_GA = 0.72;
const THOI_GIAN_HOANG_HON = 90;
const MANG_TOI_DA = 5;
const TOC_DO_DI = 460;
const TOC_DO_BAY = 900;
const BAY_KHI_XA = 450;
const BAY_TOI_DA = 1200;
const TOC_DO_DAN = 2400;
// Mana theo nhóm đòn (0 Đấm · 1 Đá · 2 Chiêu đặc biệt). Đấm không bao giờ hết; 0 nghĩa là vô hạn.
const MANA_TOI_DA = [0, 10, 5];
// Hết sạch mana thì khoá KHOA_MANA giây rồi mới bắt đầu hồi; sau đó cứ HOI_MANA giây hồi 1 lần đánh (hồi cả khi chưa hết sạch)
const KHOA_MANA = 30;
const HOI_MANA = 6;
// Màu quả cầu mana theo nhóm đòn đang dùng: Đấm xanh · Đá cam · Chiêu đặc biệt đỏ
const MAU_MANA = ['#3aa0ff', '#ff9a3c', '#ff2b2b', '#a855f7'];
// Chiêu Biến mây (riêng Mabu, nhóm đòn 3): mây to gấp 2, quét trúng mọi con gà nó đi qua. Hiệu lực MAY_THOI_GIAN giây, sau đó chờ MAY_HOI giây mới dùng lại.
// Mana của chiêu này màu tím: khi mây đang chạy là thời gian còn lại, khi chờ là tiến độ hồi.
const NHOM_MAY = 3;
const MAY_THOI_GIAN = 7;
const MAY_HOI = 40;
const MAY_TOC_DO = 1.35;
// Vùng mây quét trúng trên mặt đất (bán kính ngang / dọc, đơn vị bản đồ), cộng thêm khi trúng gà tướng to
const MAY_RX = 330;
const MAY_RY = 150;
// Thân mây nằm cao hơn toạ độ chân nên tâm vùng quét nâng lên chừng này
const MAY_NANG = 90;
const MAY_NHAN_TUONG = { x: 150, y: 70 };
// Gà tướng nhiều máu: mây chỉ trừ 1 máu mỗi MAY_NHIP giây
const MAY_NHIP = 0.5;
// Tầm đánh (đơn vị bản đồ). Đấm/Đá chọn ngẫu nhiên đòn gần hoặc đòn xa, đòn xa đánh được xa hơn.
// 
const BAN_KINH_NO = 120;
const TAM_DAM_GAN = 200;
const TAM_DAM_XA = 400;
const TAM_DA_GAN = 250;
const TAM_DA_XA = 500;
const TAM_CHIEU = 1200;
const TAM_DON: Record<string, number> = {
  punch_combo: TAM_DAM_GAN,
  punch_long: TAM_DAM_XA, punch_long_2: TAM_DAM_XA, punch_dash: TAM_DAM_XA, punch_charge: TAM_DAM_XA,
  kick_arc: TAM_DA_GAN, kick_sweep: TAM_DA_GAN,
  kick_long: TAM_DA_XA, kick_long_2: TAM_DA_XA, antenna_whip: TAM_DA_XA,
};
const PHIM_CHAN = [' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'];
const PHIM_DOI = ['k', 'x'];
const PHIM_BAY = [' ', 'l'];
const KHOA_KY_LUC = 'chicken-shooting-game.ky-luc';

const DIEM: Record<LoaiGa, number> = { hen: 10, rooster: 20, flyer: 30, chick: -50, boss: 500 };
// Cỡ gà so với gà thường (gà tướng gấp 5 lần)
const TL_GA: Record<LoaiGa, number> = { hen: 1, rooster: 1.1, flyer: 1, chick: 0.45, boss: 5 };
// Bán kính trúng đòn của gà cỡ 1; nhân với TL_GA
const BAN_KINH_GA = 44;
// Từ chân tới tâm thân gà (đơn vị sprite, trước khi nhân TL_GA)
const CHAN_GA = 40;
const MAU_LONG: Record<LoaiGa, string> = { hen: '#fff6d5', rooster: '#ce3024', flyer: '#40404e', chick: '#ffe246', boss: '#ce3024' };
const MAU_LONG_TUONG = ['#fff6d5', '#ce3024', '#40404e'];
const MAU_GA = { hen: GA_TRANG, rooster: GA_DO, flyer: GA_DEN, chick: GA_VANG, boss: GA_TUONG } satisfies Record<LoaiGa, KhungSprite>;
const MAU_SANG = 'brightness(1.7) saturate(0.6)';
// Gà tướng: máu, thời gian chờ giữa 2 lần xuất hiện (giây), tốc độ đi
const HP_TUONG = 14;
const CHO_TUONG_DAU = 25;
const CHO_TUONG = 55;
const TOC_DO_TUONG = 60;
const DIEM_DANH_TUONG = 15;

const TEN_DON: Record<string, string> = {
  antenna_wide: 'Quất râu quét', roll: 'Cuộn tròn', energy_ball: 'Cầu năng lượng',
};

const ngauNhien = (a: number, b: number) => a + Math.random() * (b - a);
const kep = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
// Sát mép bản đồ là dừng hẳn; ngoài mép là vùng đen
const kepMap = (v: number) => kep(v, 0, MAP);

// Lề giữ vật nằm trọn trong bản đồ (đơn vị bản đồ). Sprite vẽ phía trên toạ độ chân nên lề trên lớn hơn lề dưới.
// Thêm loại vật mới thì khai báo lề ở đây và gọi giuTrongMap() cho nó.
interface Le { x: number; tren: number; duoi: number; }
const LE_NV: Le = { x: 80, tren: 230, duoi: 75 };
const LE_GA: Le = { x: 50, tren: 90, duoi: 10 };
const LE_BAY: Le = { x: 70, tren: 150, duoi: 60 };
const LE_TUONG: Le = { x: 220, tren: 330, duoi: 20 };
// Mabu dạng mây to gấp 2 nên lề rộng hơn; k = hệ số phóng to (1 → 2) để lề đổi mượt lúc biến hình
const LE_MAY: Le = { x: 380, tren: 200, duoi: 45 };
const leNhanVat = (k: number): Le => ({
  x: LE_NV.x + (LE_MAY.x - LE_NV.x) * (k - 1),
  tren: LE_NV.tren + (LE_MAY.tren - LE_NV.tren) * (k - 1),
  duoi: LE_NV.duoi + (LE_MAY.duoi - LE_NV.duoi) * (k - 1),
});
const leCuaGa = (g: { loai: LoaiGa }): Le => (g.loai === 'boss' ? LE_TUONG : g.loai === 'flyer' ? LE_BAY : LE_GA);
// Kẹp vật vào trong bản đồ; trả về cờ chạm mép theo từng trục để vật tự bật lại
function giuTrongMap(o: { x: number; y: number }, le: Le) {
  const x = kep(o.x, le.x, MAP - le.x);
  const y = kep(o.y, le.tren, MAP - le.duoi);
  const r = { cx: x !== o.x, cy: y !== o.y };
  o.x = x;
  o.y = y;
  return r;
}

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
  readonly MAU_LONG = MAU_LONG;
  readonly MAU_SANG = MAU_SANG;
  readonly HP_TUONG = HP_TUONG;
  readonly S_NV = S_NV;

  man: ManChoi = 'start';
  nguoi: NguoiChoi[] = this.taoNguoiChoi();
  ga: Ga[] = [];
  dan: Dan[] = [];
  vet: Vet[] = [];
  chu: Chu[] = [];
  long: Long[] = [];
  xep: VatXep[] = [];
  gaBayView: Ga[] = [];
  tuong: Ga | null = null;
  // Chỉ những vật trong khung nhìn mới được vẽ (xem CLAUDE.md)
  vetView: Vet[] = [];
  danView: Dan[] = [];
  longView: Long[] = [];
  chuView: Chu[] = [];
  fps = 0;
  private fpsDem = 0;
  private fpsMoc = 0;
  camX = MAP / 2;
  camY = MAP / 2;
  camZ = ZOOM;
  // Người chơi mà chuột đang điều khiển (Tab để đổi) — tạm thời khi chỉ có 1 chuột
  chuot = 0;
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
  private henTuong = CHO_TUONG_DAU;
  private goLangNghe: (() => void)[] = [];
  private phim = new Set<string>();
  private vao: DauVao[] = [{ hx: 0, hy: 0, danh: false }, { hx: 0, hy: 0, danh: false }];
  private padNutCu: Record<number, boolean[]> = {};

  constructor() {
    this.capNhatView(0, true);
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
      nghe(svg, 'pointerdown', (e: PointerEvent) => {
        this.khungRef.nativeElement.focus({ preventScroll: true });
        this.bamChuot(e);
      });
      // Chặn menu chuột phải của trình duyệt trên toàn trang: chuột phải chỉ dùng để di chuyển
      nghe(window, 'contextmenu', (e: Event) => e.preventDefault(), true);
      nghe(svg, 'wheel', (e: WheelEvent) => this.lanChuot(e));
      nghe(window, 'keydown', (e: KeyboardEvent) => this.phimXuong(e), true);
      nghe(window, 'keyup', (e: KeyboardEvent) => this.phim.delete(e.key.toLowerCase()));
      nghe(window, 'blur', () => this.phim.clear());

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
    this.vet = [];
    this.chu = [];
    this.long = [];
    this.mang = MANG_TOI_DA;
    this.tGame = 0;
    this.chamDen = 0;
    this.rung = 0;
    this.henGa = [0.5, 0.8];
    this.henTuong = CHO_TUONG_DAU;
    this.kyLucMoi = false;
    this.phim.clear();
    this.capNhatView(0, true);
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
    // Đếm FPS thật (số khung hình vẽ ra mỗi giây), cập nhật mỗi 0.5 giây
    this.fpsDem++;
    if (now - this.fpsMoc >= 500) {
      this.fps = Math.round((this.fpsDem * 1000) / (now - this.fpsMoc));
      this.fpsDem = 0;
      this.fpsMoc = now;
    }
    this.lanCuoi = now;
    if (this.man !== 'pause') {
      this.t += dt;
      if (this.man === 'play') this.capNhat(dt);
      else this.nguoi.forEach((n) => this.capNhatNhanVat(n, dt));
      this.capNhatView(dt);
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
    this.henTuong -= dtE;
    if (this.henTuong <= 0) {
      if (this.ga.some((g) => g.loai === 'boss' && !g.chet)) this.henTuong = 10;
      else {
        this.sinhTuong();
        this.henTuong = CHO_TUONG;
      }
    }
    const truoc = this.nguoi.map((n) => ({ x: n.x, y: n.y }));
    this.docDauVao();
    this.dieuKhien(dt);
    this.rangBuoc(truoc);
    this.nguoi.forEach((n) => giuTrongMap(n, leNhanVat(n.nv.heSoTo)));
    this.nguoi.forEach((n, p) => this.mayQuet(n, p));
    this.capNhatGa(dtE);
    this.capNhatDan(dt);
    this.capNhatHieuUng(dt, dtE);
  }

  private dieuKhien(dt: number): void {
    this.nguoi.forEach((n, p) => {
      n.hoiChieu = Math.max(0, n.hoiChieu - dt);
      this.hoiMana(n, dt);
      this.capNhatMay(n, dt);

      const hv = this.vao[p];
      const hl = Math.hypot(hv.hx, hv.hy);
      const coHuong = hl > 0.01;
      if (coHuong && !n.nv.khoa && !n.bay) {
        n.nhin = { x: hv.hx / hl, y: hv.hy / hl };
        n.dich = null;
      }
      if (p === 1 || hv.danh) {
        const m = this.diemNham(p);
        n.nham = m.co ? { x: m.x, y: m.y } : null;
      }

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
      if (coHuong) {
        dx = hv.hx;
        dy = hv.hy;
      } else if (n.dich) {
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
        const buoc = Math.min(TOC_DO_DI * (n.may.dang ? MAY_TOC_DO : 1) * dt, n.dich ? d : Infinity);
        n.x = kepMap(n.x + (dx / d) * buoc);
        n.y = kepMap(n.y + (dy / d) * buoc);
        // Đi chủ yếu theo chiều dọc thì quay lên / xuống, còn lại quay trái / phải
        if (Math.abs(dy) > Math.abs(dx) * 1.2) n.nv.huong = dy < 0 ? 'len' : 'xuong';
        else {
          n.nv.huong = 'ngang';
          if (Math.abs(dx) > d * 0.2) n.nv.lat = dx < 0;
        }
      }
      this.capNhatNhanVat(n, dt);

      if (hv.danh) {
        const m = this.diemNham(p);
        this.ban(p, m.x, m.y);
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
        if (g.tChet < (g.loai === 'boss' ? 2 : 1)) conLai.push(g);
        continue;
      }
      g.phase += dt;
      const bay = g.loai === 'flyer';
      g.nhay = Math.max(0, g.nhay - dt);
      if (g.loai === 'boss') this.dieuTuong(g, dt);
      else if (!bay) {
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
      if (g.vx) g.lat = g.vx < 0;
      g.x += g.vx * dt;
      g.y += g.vy * dt;
      const cham = giuTrongMap(g, leCuaGa(g));
      if (cham.cx) g.vx = -g.vx;
      if (cham.cy) g.vy = -g.vy;
      switch (g.loai) {
        case 'rooster': g.h = Math.abs(Math.sin(g.phase * 5)) * 28; break;
        case 'flyer': g.h = g.h0 + Math.sin(g.phase * 3) * 30; break;
        default: g.h = 0;
      }
      if (g.loai === 'boss' || this.khoangCachGanNhat(g.x, g.y) < 1400) conLai.push(g);
    }
    this.ga = conLai;
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
    const trungDon = this.ga.filter((v) => {
      if (v.chet) return false;
      const tam = this.tamGa(v);
      return Math.hypot(tam.x - x, tam.y - y) < BAN_KINH_GA * TL_GA[v.loai] * S_GA * 1.25;
    });
    // Gà nhỏ đứng trước mặt gà tướng thì ưu tiên gà nhỏ
    const g = trungDon.find((v) => v.loai !== 'boss') ?? trungDon[0];
    if (g) {
      this.trungGa(g, p);
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
    this.vet = this.vet.filter((v) => v.t < 0.45);
  }

  // Camera chung: bám trung điểm 2 nhân vật, zoom ra khi họ xa nhau; rồi lọc vật trong khung nhìn
  private capNhatView(dt: number, ngay = false): void {
    const [a, b] = this.nguoi;
    const tx = (a.x + b.x) / 2;
    const ty = (a.y + b.y) / 2;
    const dx = Math.abs(a.x - b.x);
    const dy = Math.abs(a.y - b.y);
    const tz = kep(Math.min(ZOOM, dx > 1 ? VUNG_X / dx : ZOOM, dy > 1 ? VUNG_Y / dy : ZOOM), ZOOM_MIN, ZOOM);
    const kv = ngay ? 1 : 1 - Math.exp(-dt * 6);
    const kz = ngay ? 1 : 1 - Math.exp(-dt * 3);
    this.camX += (tx - this.camX) * kv;
    this.camY += (ty - this.camY) * kv;
    this.camZ += (tz - this.camZ) * kz;
    // Camera không ra khỏi bản đồ: chạm mép map thì mép đó nằm đúng mép màn hình, không lộ vùng đen
    const zc = this.camZ;
    this.camX = kep(this.camX, W / 2 / zc, MAP - W / 2 / zc);
    this.camY = kep(this.camY, TAM_VIEW_Y / zc, MAP - (H - TAM_VIEW_Y) / zc);

    const z = this.camZ;
    const trong = (x: number, y: number, le: number) =>
      Math.abs(x - this.camX) < W / 2 / z + le && y - this.camY > -TAM_VIEW_Y / z - le && y - this.camY < (H - TAM_VIEW_Y) / z + le;
    const xep: VatXep[] = [];
    for (const g of this.ga) {
      if (g.loai === 'flyer' || !trong(g.x, g.y, g.loai === 'boss' ? 450 : 80)) continue;
      xep.push({ loai: 'ga', y: g.y, ga: g });
    }
    this.nguoi.forEach((n, i) => { if (trong(n.x, n.y, n.nv.laMay ? 600 : 200)) xep.push({ loai: 'nv', y: n.y, p: i }); });
    xep.sort((a, b) => a.y - b.y);
    this.xep = xep;
    this.gaBayView = this.ga.filter((g) => g.loai === 'flyer' && trong(g.x, g.y, 400));
    this.vetView = this.vet.filter((v) => trong(v.x, v.y, 200));
    this.danView = this.dan.filter((d) => {
      const vt = this.danHienTai(d);
      return trong(vt.x, vt.y, 200);
    });
    this.longView = this.long.filter((l) => trong(l.x, l.y, 100));
    this.chuView = this.chu.filter((c) => trong(c.x, c.y, 300));
    // Chỉ gà tướng có thanh máu trên đầu; chỉ lấy khi nằm trong khung nhìn
    const t = this.ga.find((g) => g.loai === 'boss' && !g.chet);
    this.tuong = t && trong(t.x, t.y, 450) ? t : null;
  }

  // Dây buộc: 2 nhân vật không xa nhau quá mức camera chứa nổi. Người vừa di chuyển nhiều hơn là người bị chặn lại.
  private rangBuoc(truoc: { x: number; y: number }[]): void {
    const [a, b] = this.nguoi;
    const ma = Math.hypot(a.x - truoc[0].x, a.y - truoc[0].y);
    const mb = Math.hypot(b.x - truoc[1].x, b.y - truoc[1].y);
    const sa = ma + mb > 0.01 ? ma / (ma + mb) : 0.5;
    for (const [k, max] of [['x', MAX_DX], ['y', MAX_DY]] as const) {
      const d = a[k] - b[k];
      const thua = Math.abs(d) - max;
      if (thua <= 0) continue;
      const dau = Math.sign(d);
      a[k] -= dau * thua * sa;
      b[k] += dau * thua * (1 - sa);
    }
  }

  kepTet(v: number): number {
    return kep((v - 0.7) / 0.3, 0, 1) * 0.8;
  }

  // Mức căng của dây buộc: 0 là sát nhau, 1 là chạm giới hạn
  get tetDo(): number {
    const [a, b] = this.nguoi;
    return Math.max(Math.abs(a.x - b.x) / MAX_DX, Math.abs(a.y - b.y) / MAX_DY);
  }

  // Vị trí nhân vật trên màn hình (toạ độ khung W×H)
  viTriManHinh(p: number) {
    const n = this.nguoi[p];
    return { x: W / 2 + (n.x - this.camX) * this.camZ, y: TAM_VIEW_Y + (n.y - this.camY) * this.camZ };
  }

  // Mũi tên ở mép màn hình chỉ hướng nhân vật khi họ ra ngoài khung nhìn
  muiTen(p: number) {
    const v = this.viTriManHinh(p);
    const x = kep(v.x, 70, W - 70);
    const y = kep(v.y, 130, H - 70);
    if (x === v.x && y === v.y) return null;
    return { x, y, goc: (Math.atan2(v.y - y, v.x - x) * 180) / Math.PI };
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
    if (this.ga.filter((g) => !g.chet && g.loai !== 'boss' && Math.hypot(g.x - n.x, g.y - n.y) < 900 / ZOOM).length >= gioiHan) return;

    const r = Math.random() * 100;
    const loai: LoaiGa = r < 40 ? 'hen' : r < 65 ? 'rooster' : 'flyer';
    const tao = (l: LoaiGa, x: number, y: number, vx: number, vy: number, h0: number, me = 0) => {
      const g: Ga = {
        id: this.id++, loai: l, x, y, h: h0, h0, vx, vy, phase: Math.random() * 6, doiHuong: 0, me,
        chet: false, tChet: 0, lat: vx < 0, hp: 1, nhay: 0,
      };
      this.ga.push(g);
      return g;
    };

    if (loai === 'flyer') {
      const goc = ngauNhien(0, Math.PI * 2);
      const x = n.x + Math.cos(goc) * 700 / ZOOM;
      const y = n.y + Math.sin(goc) * 700 / ZOOM;
      const huong = Math.atan2(n.y - y, n.x - x) + ngauNhien(-0.35, 0.35);
      const v = ngauNhien(150, 210) * (1 + this.chang * 0.2);
      tao(loai, x, y, Math.cos(huong) * v, Math.sin(huong) * v, ngauNhien(200, 300));
      return;
    }
    const vt = this.diemQuanh(p, 480 / ZOOM, 680 / ZOOM);
    const me = tao(loai, vt.x, vt.y, 0, 0, 0);
    if (loai === 'hen' && Math.random() < 0.45) {
      const soCon = Math.random() < 0.5 ? 1 : 2;
      for (let i = 1; i <= soCon; i++) tao('chick', vt.x - 40 * i, vt.y + 12 * i, 0, 0, 0, me.id);
    }
  }

  // Gà tướng xuất hiện ở rìa khung nhìn, từ từ tiến về phía hai người chơi
  private sinhTuong(): void {
    const mx = (this.nguoi[0].x + this.nguoi[1].x) / 2;
    const my = (this.nguoi[0].y + this.nguoi[1].y) / 2;
    const goc = ngauNhien(0, Math.PI * 2);
    const x = kepMap(mx + Math.cos(goc) * 1200);
    const y = kepMap(my + Math.sin(goc) * 1000);
    this.ga.push({
      id: this.id++, loai: 'boss', x, y, h: 0, h0: 0, vx: 0, vy: 0, phase: 0, doiHuong: 0, me: 0,
      chet: false, tChet: 0, lat: x > mx, hp: HP_TUONG, nhay: 0,
    });
    this.chu.push({ id: this.id++, x: mx, y: my - 330, text: '🐔 GÀ TƯỚNG XUẤT HIỆN!', mau: '#ff9f1a', t: 0 });
    this.rung = Math.max(this.rung, 0.4);
  }

  // Gà tướng: đi về phía người gần nhất, tới gần thì dừng lại
  private dieuTuong(g: Ga, dt: number): void {
    let gan = this.nguoi[0];
    for (const n of this.nguoi) {
      if (Math.hypot(n.x - g.x, n.y - g.y) < Math.hypot(gan.x - g.x, gan.y - g.y)) gan = n;
    }
    const dx = gan.x - g.x;
    const dy = gan.y - g.y;
    const d = Math.hypot(dx, dy) || 1;
    const v = d > 260 ? TOC_DO_TUONG * (1 + this.chang * 0.25) : 0;
    g.vx = (dx / d) * v;
    g.vy = (dy / d) * v;
    g.lat = dx < 0;
  }

  // ─── Bắn & tính điểm ───

  // Hồi mana: hết sạch thì khoá rồi mới hồi; mỗi HOI_MANA giây được thêm 1 lần đánh
  private hoiMana(n: NguoiChoi, dt: number): void {
    for (const g of [1, 2]) {
      if (n.khoaMana[g] > 0) {
        n.khoaMana[g] = Math.max(0, n.khoaMana[g] - dt);
        n.hoiMana[g] = 0;
      } else if (n.mana[g] < MANA_TOI_DA[g]) {
        n.hoiMana[g] += dt;
        if (n.hoiMana[g] >= HOI_MANA) {
          n.hoiMana[g] -= HOI_MANA;
          n.mana[g]++;
        }
      }
    }
  }

  // Biến mây: đếm giờ hiệu lực, hết thì biến lại và bắt đầu chờ hồi
  private capNhatMay(n: NguoiChoi, dt: number): void {
    const m = n.may;
    if (m.dang) {
      m.con -= dt;
      if (m.con <= 0) {
        m.dang = false;
        m.con = 0;
        m.hoi = MAY_HOI;
        n.nv.raMay();
      }
    } else if (m.hoi > 0) m.hoi = Math.max(0, m.hoi - dt);
  }

  private vaoMay(n: NguoiChoi): void {
    if (n.may.dang || n.may.hoi > 0 || n.bay || n.nv.khoa || n.nv.laMay) return;
    n.may.dang = true;
    n.may.con = MAY_THOI_GIAN;
    n.nv.vaoMay();
  }

  // Mây quét qua: mọi con gà (kể cả gà con, gà bay) chạm vùng mây đều dính đòn
  private mayQuet(n: NguoiChoi, p: number): void {
    if (!n.may.dang) return;
    for (const g of this.ga) {
      if (g.chet) continue;
      const boss = g.loai === 'boss';
      const rx = MAY_RX + (boss ? MAY_NHAN_TUONG.x : 0);
      const ry = MAY_RY + (boss ? MAY_NHAN_TUONG.y : 0);
      if (((g.x - n.x) / rx) ** 2 + ((g.y - (n.y - MAY_NANG)) / ry) ** 2 >= 1) continue;
      if (boss) {
        if ((g.chamMay ?? 0) > this.t) continue;
        g.chamMay = this.t + MAY_NHIP;
      }
      this.vet.push({ id: this.id++, x: g.x, y: this.tamGa(g).y, t: 0, loai: 'no' });
      this.trungGa(g, p);
    }
  }

  // Nhóm Đấm: 1 viên, không tốn mana · Đá: 2 viên tản · Chiêu đặc biệt: 1 quả cầu nổ diện rộng. Đá và chiêu tốn 1 mana mỗi lần.
  private ban(p: number, x: number, y: number): void {
    const n = this.nguoi[p];
    if (n.hoiChieu > 0 || n.nv.khoa) return;
    const chieu = n.nv.nhom === 2;
    const nhom = n.nv.nhom;
    if (nhom === NHOM_MAY) {
      this.vaoMay(n);
      return;
    }
    if (n.may.dang) return;
    if (nhom > 0 && (n.khoaMana[nhom] > 0 || n.mana[nhom] < 1)) return;
    // Animation đòn chạy chậm 1/2 nên thời gian hồi cũng gấp đôi
    n.hoiChieu = (chieu ? 0.8 : n.nv.nhom === 1 ? 0.32 : n.dangDi ? 0.3 : 0.2) * 2;
    if (nhom > 0) {
      n.mana[nhom]--;
      if (n.mana[nhom] < 1) {
        n.khoaMana[nhom] = KHOA_MANA;
        n.hoiMana[nhom] = 0;
      }
    }
    if (!n.dangDi) {
      n.nv.lat = x < n.x;
      n.nv.huong = 'ngang';
    }
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
  }

  doiNhom(p: number, buoc: number): void {
    this.nguoi[p].nv.doiNhom(buoc, this.t);
  }

  tenNhom(p: number): string {
    const nv = this.nguoi[p].nv;
    return nv.nhom === 2 ? TEN_DON[nv.donVong(this.t)] ?? nv.tenNhom : nv.tenNhom;
  }

  private trungGa(g: Ga, p: number): void {
    if (g.loai === 'boss') {
      this.trungTuong(g, p);
      return;
    }
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

  // Gà tướng nhiều máu: mỗi đòn trúng trừ 1 máu, hết máu mới ngã
  private trungTuong(g: Ga, p: number): void {
    const n = this.nguoi[p];
    const tam = this.tamGa(g);
    const hs = this.heSo(p);
    g.hp--;
    g.nhay = 0.15;
    n.combo++;
    n.banTrung++;
    const rai = (soLuong: number) => {
      for (let i = 0; i < soLuong; i++) {
        this.long.push({
          id: this.id++, x: tam.x + ngauNhien(-60, 60), y: tam.y + ngauNhien(-60, 40),
          vx: ngauNhien(-320, 320), vy: ngauNhien(-340, 60), xoay: ngauNhien(0, 360), vxoay: ngauNhien(-400, 400),
          t: 0, mau: MAU_LONG_TUONG[i % 3],
        });
      }
    };
    if (g.hp > 0) {
      rai(5);
      this.congDiem(p, DIEM_DANH_TUONG * hs, tam.x + ngauNhien(-40, 40), tam.y - 80, `+${DIEM_DANH_TUONG * hs}`);
      return;
    }
    g.chet = true;
    g.h0 = 0;
    rai(40);
    this.rung = Math.max(this.rung, 0.6);
    this.congDiem(p, DIEM.boss * hs, tam.x, tam.y - 110, `+${DIEM.boss * hs} HẠ GÀ TƯỚNG!`);
    // Thưởng thêm mạng cho cả đội khi hạ được gà tướng
    if (this.mang < MANG_TOI_DA) this.mang++;
  }

  private congDiem(p: number, diem: number, x: number, y: number, text: string): void {
    this.nguoi[p].diem += diem;
    this.chu.push({ id: this.id++, x, y, text, mau: this.nguoi[p].mau, t: 0 });
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
    this.doiNhom(this.chuot, e.deltaY > 0 ? 1 : -1);
  }

  private diChuot(e: PointerEvent): void {
    const pt = this.toaDo(e);
    if (!pt) return;
    const p = this.chuot;
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
    const p = this.chuot;
    if (e.button === 2 && e.buttons & 2) {
      this.datDich(p, pt.x, pt.y);
      return;
    }
    if (e.button !== 0 || !(e.buttons & 1)) return;
    const w = this.manHinhRaThe(pt.x, pt.y);
    this.ban(p, w.x, w.y);
  }

  // Chỉ xa thì bay theo vòng cung, gần thì chạy
  private datDich(p: number, x: number, y: number): void {
    const w = this.manHinhRaThe(x, y);
    this.datDichThe(p, w.x, w.y);
  }

  private datDichThe(p: number, x: number, y: number): void {
    const n = this.nguoi[p];
    if (n.nv.khoa || n.bay) return;
    const o = this.nguoi[1 - p];
    const le = leNhanVat(n.nv.heSoTo);
    let dich = {
      x: kep(x, o.x - MAX_DX, o.x + MAX_DX),
      y: kep(y, o.y - MAX_DY, o.y + MAX_DY),
    };
    giuTrongMap(dich, le);
    let d = Math.hypot(dich.x - n.x, dich.y - n.y);
    if (d > BAY_TOI_DA) {
      // Chỉ xa hơn tầm bay tối đa thì bay tới mép tầm theo hướng chuột
      dich = { x: n.x + ((dich.x - n.x) / d) * BAY_TOI_DA, y: n.y + ((dich.y - n.y) / d) * BAY_TOI_DA };
      d = BAY_TOI_DA;
    }
    // Dạng mây không bay, chỉ trôi tới nơi
    if (d <= BAY_KHI_XA || n.may.dang) {
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

  private gocView() {
    return { x: W / 2 - this.camX * this.camZ, y: TAM_VIEW_Y - this.camY * this.camZ };
  }

  private manHinhRaThe(x: number, y: number) {
    const o = this.gocView();
    return { x: (x - o.x) / this.camZ, y: (y - o.y) / this.camZ };
  }

  // ─── Bàn phím & tay cầm: P2 dùng bàn phím (hoặc tay cầm 1), tay cầm 2 điều khiển P1 ───

  private phimXuong(e: KeyboardEvent): void {
    const k = e.key.toLowerCase();
    if (k === 'tab') {
      e.preventDefault();
      e.stopPropagation();
      if (!e.repeat) this.doiChuot();
      return;
    }
    if (this.man !== 'play') return;
    if (PHIM_CHAN.includes(k)) e.preventDefault();
    this.phim.add(k);
    if (e.repeat) return;
    if (PHIM_DOI.includes(k)) this.doiNhom(1, 1);
    if (PHIM_BAY.includes(k)) this.bayTheoHuong(1);
  }

  private docDauVao(): void {
    const v: DauVao[] = [{ hx: 0, hy: 0, danh: false }, { hx: 0, hy: 0, danh: false }];
    const co = (...ds: string[]) => ds.some((d) => this.phim.has(d));
    v[1].hx = (co('d', 'arrowright') ? 1 : 0) - (co('a', 'arrowleft') ? 1 : 0);
    v[1].hy = (co('s', 'arrowdown') ? 1 : 0) - (co('w', 'arrowup') ? 1 : 0);
    v[1].danh = co('j', 'z');
    this.vao = v;

    const pads = (navigator.getGamepads?.() ?? []).filter((g): g is Gamepad => !!g).slice(0, 2);
    pads.forEach((pad, i) => {
      const p = i === 0 ? 1 : 0;
      const nut = (j: number) => !!pad.buttons[j]?.pressed;
      const truc = (j: number) => (Math.abs(pad.axes[j] ?? 0) > 0.25 ? pad.axes[j] : 0);
      v[p].hx += truc(0) + (nut(15) ? 1 : 0) - (nut(14) ? 1 : 0);
      v[p].hy += truc(1) + (nut(13) ? 1 : 0) - (nut(12) ? 1 : 0);
      if (nut(0) || nut(2)) v[p].danh = true;
      const cu = (this.padNutCu[pad.index] ??= []);
      if (nut(5) && !cu[5]) this.doiNhom(p, 1);
      if (nut(4) && !cu[4]) this.doiNhom(p, -1);
      if (nut(1) && !cu[1]) this.bayTheoHuong(p);
      for (const j of [1, 4, 5]) cu[j] = nut(j);
    });
  }

  private doiChuot(): void {
    const cu = this.nguoi[this.chuot];
    this.chuot = 1 - this.chuot;
    const moi = this.nguoi[this.chuot];
    moi.tamX = cu.tamX;
    moi.tamY = cu.tamY;
    cu.dich = null;
  }

  private bayTheoHuong(p: number): void {
    const n = this.nguoi[p];
    const v = this.vao[p];
    const l = Math.hypot(v.hx, v.hy);
    const h = l > 0.01 ? { x: v.hx / l, y: v.hy / l } : n.nhin;
    this.datDichThe(p, n.x + h.x * DAI_BAY_PHIM, n.y + h.y * DAI_BAY_PHIM);
  }

  // Tự ngắm vào con gà (không phải gà con) gần nhất trong tầm; không có thì đánh theo hướng đang nhìn
  private diemNham(p: number): { x: number; y: number; co: boolean } {
    const n = this.nguoi[p];
    const tam = n.nv.nhom === 2 ? 800 : n.nv.nhom === 1 ? 480 : 380;
    let tot: Ga | null = null;
    let dm = tam;
    for (const g of this.ga) {
      if (g.chet || g.loai === 'chick') continue;
      const t = this.tamGa(g);
      // Gà tướng rất to: tính khoảng cách tới mép thân chứ không phải tới tâm
      const d = Math.hypot(t.x - n.x, t.y - n.y) - (g.loai === 'boss' ? 125 : 0);
      if (d < dm) {
        dm = d;
        tot = g;
      }
    }
    if (tot) {
      const t = this.tamGa(tot);
      return { x: t.x, y: t.y, co: true };
    }
    return { x: n.x + n.nhin.x * 300, y: n.y + n.nhin.y * 300 - 60, co: false };
  }

  // ─── Hỗ trợ vẽ ───

  viewTransform(): string {
    const o = this.gocView();
    const rx = this.rung > 0 ? ngauNhien(-6, 6) : 0;
    return `translate(${(o.x + rx).toFixed(1)},${o.y.toFixed(1)}) scale(${this.camZ.toFixed(4)})`;
  }

  // Thanh máu (máu chung của đội) và quả cầu năng lượng (đạn) nhỏ trên đầu nhân vật
  thanhTrenDau(p: number): string {
    const n = this.nguoi[p];
    return `translate(${n.x.toFixed(1)},${(n.y - (n.nv.cao - n.nv.nhun) * S_NV - (p === 0 ? 195 : 150)).toFixed(1)})`;
  }

  // Thanh máu trên đầu gà tướng (to hơn của nhân vật vì gà tướng cao gấp nhiều lần)
  thanhTuong(g: Ga): string {
    return `translate(${g.x.toFixed(1)},${(g.y - 310).toFixed(1)}) scale(3)`;
  }

  // Biểu tượng nhóm đòn nằm ngay dưới chân nhân vật
  duoiChan(p: number): string {
    const n = this.nguoi[p];
    return `translate(${n.x.toFixed(1)},${(n.y + 38).toFixed(1)})`;
  }

  get mauTiLe(): number {
    return Math.max(0, this.mang) / MANG_TOI_DA;
  }

  // 0..1: mana còn lại của nhóm đòn đang dùng (Đấm luôn đầy)
  nangLuong(p: number): number {
    const n = this.nguoi[p];
    const g = n.nv.nhom;
    if (g === NHOM_MAY) return n.may.dang ? n.may.con / MAY_THOI_GIAN : 1 - n.may.hoi / MAY_HOI;
    return g === 0 ? 1 : n.mana[g] / MANA_TOI_DA[g];
  }

  // Quả cầu mana chỉ có một, đổi màu theo nhóm đòn đang dùng
  mauMana(p: number): string {
    return MAU_MANA[this.nguoi[p].nv.nhom];
  }

  nvTransform(p: number): string {
    const n = this.nguoi[p];
    return `translate(${n.x.toFixed(1)},${(n.y - (n.nv.cao - n.nv.nhun) * S_NV).toFixed(1)}) scale(${S_NV * n.nv.heSoTo})`;
  }

  // Nhóm đòn hiện biểu tượng dưới chân, theo thứ tự: Đấm → Chiêu đặc biệt → Đá → (Mabu) Mây
  dsBieuTuong(p: number): number[] {
    return this.nguoi[p].nv.sp.nhomDon.some((d) => d.may) ? [0, 2, 1, NHOM_MAY] : [0, 2, 1];
  }

  private viTriTay(p: number) {
    const n = this.nguoi[p];
    const { dx, dy } = n.nv.diemBan;
    return { x: n.x + (n.nv.lat ? -dx : dx) * S_NV, y: n.y + (dy - n.nv.cao) * S_NV };
  }

  tamGa(g: Ga) {
    return { x: g.x, y: g.y - (CHAN_GA * TL_GA[g.loai] * S_GA + g.h) * EP_GA };
  }

  gaTransform(g: Ga): string {
    const k = S_GA * TL_GA[g.loai];
    return `translate(${g.x.toFixed(1)},${g.y.toFixed(1)}) scale(${k},${k * EP_GA})`;
  }

  // Gốc tọa độ ở tâm thân (để xoay khi ngã); sprite vẽ lùi xuống tới chân bằng gaSprite()
  gaThan(g: Ga): string {
    const xoay = g.chet && g.loai !== 'boss' ? g.tChet * 540 : 0;
    const bay = g.h / (S_GA * TL_GA[g.loai]);
    return `translate(0,${(-CHAN_GA - bay).toFixed(1)}) rotate(${xoay.toFixed(0)})`;
  }

  gaSprite(g: Ga): KhungSprite {
    return MAU_GA[g.loai];
  }

  gaKhung(g: Ga): number {
    if (g.chet) return KHUNG_CHET;
    if (g.loai === 'flyer') return KHUNG_BAY[Math.floor(g.phase * 14) % KHUNG_BAY.length];
    const nhip = g.loai === 'boss' ? 0.5 : g.loai === 'chick' ? 1.3 : 1;
    if (g.vx || g.vy) return KHUNG_CHAY[Math.floor(g.phase * 10 * nhip) % KHUNG_CHAY.length];
    return KHUNG_DUNG[Math.floor(g.phase * 3 * nhip) % KHUNG_DUNG.length];
  }

  bongGa(g: Ga): number {
    return Math.max(0.35, 1 - g.h / 400);
  }

  // Thanh máu gà tướng
  get maxHpTuong(): number {
    return HP_TUONG;
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

  // ─── Khởi tạo ───

  private taoNguoiChoi(): NguoiChoi[] {
    return [0, 1].map((p) => ({
      ten: p === 0 ? MABU.ten : ZINBU.ten, mau: p === 0 ? '#e84393' : '#8e44ad',
      diem: 0, combo: 0, tamX: GIUA, tamY: 300, hoiChieu: 0, chumDen: 0, banTrung: 0, banTruot: 0,
      x: MAP / 2 + (p === 0 ? -160 : 160), y: MAP / 2 + 120, dich: null, dangDi: false,
      mana: MANA_TOI_DA.map((m) => m), khoaMana: [0, 0, 0], hoiMana: [0, 0, 0], nv: this.taoNhanVat(p), bay: null,
      nhin: { x: p === 0 ? 1 : -1, y: 0 }, nham: null, may: { dang: false, con: 0, hoi: 0 },
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
