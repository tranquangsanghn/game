export interface HoatAnh {
  f: number[];
  ms: number;
  lap: boolean;
  tien?: { tu: number; den: number; v: number };
  ban?: { o: number; dx: number; dy: number };
}
export interface BuocChet { anim: string; ticks?: number; vx?: number; vy?: number; bay?: boolean; giu?: boolean }
export interface NhomDon { ten: string; vong: boolean; don: string[]; may?: boolean }

export interface NhanVatSprite {
  ten: string; atlas: string; atlasW: number; atlasH: number; w: number; h: number; cot: number;
  neoX: number; neoY: number;
  anim: Record<string, HoatAnh>;
  khieuKhich: string[];
  nhomDon: NhomDon[];
  kieuChet: BuocChet[][];
  /** Khung riêng khi đi / đứng quay lên (nhìn lưng) hoặc xuống (nhìn thẳng). Thiếu thì dùng khung nhìn nghiêng */
  huong?: { len?: KhungHuong; xuong?: KhungHuong };
}

/** dung: khung khi đứng yên (idle) · di: khung khi đi (run) */
export interface KhungHuong { dung: number[]; di: number[] }

export type Huong = 'ngang' | 'len' | 'xuong';

type TrangThai = 'thuong' | 'khieuKhich' | 'tanCong' | 'tuKhi' | 'bay' | 'tiepDat' | 'chet' | 'dayLai' | 'may';

// Đơn vị trong file logic: px sprite / tick, 60 tick mỗi giây
const TICK = 60;
const TRONG_LUC = 0.32;
const NAM_GIU = 1.6;
const VONG_CHIEU = 5;
// Animation mỗi đòn của Mabu / Zinbu tự co giãn để chạy xong trong 90% của THOI_GIAN_DON (0,5s). Chỉ ảnh hưởng animation, không đổi tốc độ đánh.
const THOI_GIAN_DON = 0.5;
const ANIM_DON = THOI_GIAN_DON * 0.9;
const DO_CAO_BAY = 48;

const chonKhac = <T>(ds: T[], cu: T | undefined): T => {
  const con = ds.length > 1 ? ds.filter((v) => v !== cu) : ds;
  return con[Math.floor(Math.random() * con.length)];
};

/** Chạy animation + hành vi của 1 nhân vật theo *_logic.json. Vị trí trên bản đồ do game giữ. */
export class NhanVat {
  anim = 'idle';
  i = 0;
  lat = false;
  huong: Huong = 'ngang';
  cao = 0;
  nhom = 0;

  private tg = 0;
  private xong = false;
  private trangThai: TrangThai = 'thuong';
  private henKhieuKhich = this.henMoi();
  private khieuKhichCuoi?: string;
  private donCuoi?: string;
  private donCho: string | null = null;
  private chetCuoi?: BuocChet[];
  private chet = { buoc: [] as BuocChet[], k: 0, t: 0, vy: 0 };
  private tNhom = 0;
  private tMay = 0;

  constructor(readonly sp: NhanVatSprite) {}

  get khung(): number {
    if (this.huong !== 'ngang' && (this.anim === 'idle' || this.anim === 'run')) {
      const k = this.sp.huong?.[this.huong];
      const ds = k && (this.anim === 'run' ? k.di : k.dung);
      if (ds?.length) return ds[this.i % ds.length];
    }
    return this.sp.anim[this.anim].f[this.i];
  }

  /** Độ nhún lên xuống (px sprite, âm = lên) khi đi theo chiều dọc: mỗi bước một nhịp nhún */
  get nhun(): number {
    if (this.huong === 'ngang' || this.anim !== 'run') return 0;
    const a = this.sp.anim.run;
    const pha = (this.i + this.tg / a.ms) / a.f.length;
    return -Math.abs(Math.sin(2 * Math.PI * pha)) * 3;
  }

  /** Hệ số tua animation đòn đang chạy để cả đòn kéo dài đúng ANIM_DON giây */
  private get tocDon(): number {
    const a = this.sp.anim[this.anim];
    return (a.f.length * a.ms) / 1000 / ANIM_DON;
  }

  get khoa(): boolean {
    return this.trangThai === 'chet' || this.trangThai === 'dayLai';
  }

  /** Đang ở dạng mây (kể cả lúc đang biến vào / biến ra) */
  get laMay(): boolean {
    return this.trangThai === 'may';
  }

  /** Hệ số phóng to của sprite: 1 bình thường, 2 khi thành mây (tăng dần lúc biến hình) */
  get heSoTo(): number {
    if (this.trangThai !== 'may') return 1;
    if (this.anim === 'may_vao') return 1 + (this.i + 1) / 3;
    if (this.anim === 'may_ra') return 2 - (this.i + 1) / 3;
    return 2;
  }

  get dangBay(): boolean {
    return this.trangThai === 'bay';
  }

  get tenNhom(): string {
    return this.sp.nhomDon[this.nhom].ten;
  }

  /** Điểm bắn (tay / râu) so với chân, px sprite, quay mặt sang phải */
  get diemBan(): { dx: number; dy: number } {
    return this.sp.anim['energy_ball'].ban ?? { dx: 50, dy: -38 };
  }

  /** Đòn vừa ra gần nhất (dùng để tính tầm đánh) */
  get donVuaRa(): string | undefined {
    return this.donCuoi;
  }

  donVong(t: number): string {
    const ds = this.sp.nhomDon[this.nhom].don;
    return ds[Math.floor((t - this.tNhom) / VONG_CHIEU) % ds.length];
  }

  datNhom(k: number, t: number): void {
    if (k < 0 || k >= this.sp.nhomDon.length || k === this.nhom) return;
    this.nhom = k;
    this.tNhom = t;
  }

  doiNhom(buoc: number, t: number): void {
    const n = this.sp.nhomDon.length;
    this.nhom = (this.nhom + buoc + n) % n;
    this.tNhom = t;
  }

  /** Nhóm thường: random không trùng đòn vừa ra. Chiêu đặc biệt: đòn đang tới lượt trong vòng 5 giây */
  raDon(t: number): void {
    if (this.khoa || this.laMay) return;
    const nhom = this.sp.nhomDon[this.nhom];
    if (nhom.may) return;
    const don = nhom.vong ? this.donVong(t) : chonKhac(nhom.don, this.donCuoi);
    this.donCuoi = don;
    const dangDanh = this.trangThai === 'tanCong' && !this.xong;
    if (dangDanh && this.i < this.sp.anim[this.anim].f.length - 3) {
      this.donCho ??= don;
      return;
    }
    this.donCho = null;
    this.trangThai = 'tanCong';
    this.choi(don);
  }

  tuKhi(bat: boolean): void {
    if (bat && (this.trangThai === 'thuong' || this.trangThai === 'khieuKhich')) this.trangThai = 'tuKhi';
    else if (!bat && this.trangThai === 'tuKhi') this.veThuong();
  }

  /** k: tiến độ bay 0 → 1 theo chuỗi jump_up → fly → fall */
  bay(k: number): void {
    if (this.khoa || this.laMay) return;
    this.trangThai = 'bay';
    this.cao = DO_CAO_BAY * Math.sin(Math.PI * Math.min(1, k));
    this.choi(k < 0.15 ? 'jump_up' : k < 0.82 ? 'fly' : 'fall', false);
  }

  /** Biến thành đám mây (chỉ nhân vật có anim 'may') */
  vaoMay(): void {
    if (this.khoa || !this.sp.anim['may']) return;
    this.cao = 0;
    this.donCho = null;
    this.tMay = 0;
    this.trangThai = 'may';
    this.choi('may_vao');
  }

  /** Biến lại thành người */
  raMay(): void {
    if (this.trangThai === 'may' && this.anim !== 'may_ra') this.choi('may_ra');
  }

  tiepDat(): void {
    if (this.trangThai !== 'thuong' && this.trangThai !== 'bay') return;
    this.cao = 0;
    this.trangThai = 'tiepDat';
    this.choi('crouch_land');
  }

  nga(): void {
    if (this.khoa) return;
    const buoc = chonKhac(this.sp.kieuChet, this.chetCuoi);
    this.chetCuoi = buoc;
    this.donCho = null;
    this.trangThai = 'chet';
    this.chet = { buoc, k: 0, t: 0, vy: 0 };
    this.batDauBuoc();
  }

  /** Trả về quãng trượt ngang (px sprite, dương = sang phải) do đòn lao tới hoặc bị đánh văng */
  capNhat(dt: number, dangDi: boolean): number {
    this.chayKhung(this.trangThai === 'tanCong' ? dt * this.tocDon : dt);
    switch (this.trangThai) {
      case 'chet':
        return this.capNhatChet(dt);
      case 'dayLai':
        if (this.xong) this.veThuong();
        return 0;
      case 'tanCong': {
        const tien = this.sp.anim[this.anim].tien;
        const dx = tien && this.i >= tien.tu && this.i <= tien.den ? tien.v * TICK * dt * this.tocDon * (this.lat ? -1 : 1) : 0;
        if (this.xong) {
          if (this.donCho) {
            const don = this.donCho;
            this.donCho = null;
            this.choi(don);
          } else this.veThuong();
        }
        return dx;
      }
      case 'tuKhi':
        if (dangDi) this.choi('run', false);
        else if (this.anim !== 'taunt_flex' || this.xong) this.choi('taunt_flex');
        return 0;
      case 'may':
        this.tMay += dt;
        if (this.anim === 'may_vao' && this.xong) this.choi('may');
        else if (this.anim === 'may_ra' && this.xong) {
          this.cao = 0;
          this.veThuong();
          return 0;
        }
        // Mây lơ lửng nhấp nhô, càng to càng bồng bềnh
        this.cao = (this.heSoTo - 1) * (10 + 4 * Math.sin(this.tMay * 4));
        return 0;
      case 'bay':
        return 0;
      case 'tiepDat':
        if (dangDi || this.xong) this.veThuong();
        return 0;
      case 'khieuKhich':
        if (dangDi || this.xong) this.veThuong();
        break;
    }
    if (this.trangThai !== 'thuong') return 0;
    if (dangDi) {
      this.choi('run', false);
      this.henKhieuKhich = this.henMoi();
      return 0;
    }
    this.choi('idle', false);
    this.henKhieuKhich -= dt;
    if (this.henKhieuKhich <= 0) {
      const ten = chonKhac(this.sp.khieuKhich, this.khieuKhichCuoi);
      this.khieuKhichCuoi = ten;
      this.trangThai = 'khieuKhich';
      this.choi(ten);
    }
    return 0;
  }

  private capNhatChet(dt: number): number {
    const c = this.chet;
    const b = c.buoc[c.k];
    c.t += dt;
    if (this.cao > 0 || c.vy < 0) {
      c.vy += TRONG_LUC * TICK * dt;
      this.cao = Math.max(0, this.cao - c.vy * TICK * dt);
      if (this.cao === 0) c.vy = 0;
    }
    // vx âm = lùi về sau so với hướng mặt
    const dx = (b.vx ?? 0) * TICK * dt * (this.lat ? -1 : 1);
    if (b.giu) {
      if (c.t >= NAM_GIU) {
        this.trangThai = 'dayLai';
        this.choi('get_up');
      }
    } else if (b.ticks ? c.t >= b.ticks / TICK : this.xong) {
      c.k++;
      this.batDauBuoc();
    }
    return dx;
  }

  private batDauBuoc(): void {
    const c = this.chet;
    const b = c.buoc[c.k];
    c.t = 0;
    if (b.vy !== undefined) c.vy = b.vy;
    this.choi(b.anim);
  }

  private veThuong(): void {
    this.trangThai = 'thuong';
    this.henKhieuKhich = this.henMoi();
    this.choi('idle');
  }

  private henMoi(): number {
    return (100 + Math.random() * 120) / TICK;
  }

  private choi(ten: string, tuDau = true): void {
    if (!tuDau && this.anim === ten) return;
    this.anim = ten;
    if (ten !== 'idle' && ten !== 'run') this.huong = 'ngang';
    this.i = 0;
    this.tg = 0;
    this.xong = false;
  }

  private chayKhung(dt: number): void {
    const a = this.sp.anim[this.anim];
    this.tg += dt * 1000;
    while (!this.xong && this.tg >= a.ms) {
      this.tg -= a.ms;
      if (this.i < a.f.length - 1) this.i++;
      else if (a.lap) this.i = 0;
      else this.xong = true;
    }
  }
}
