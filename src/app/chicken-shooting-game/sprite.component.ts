import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/** Phần mô tả atlas mà SpriteComponent cần để cắt 1 khung */
export interface KhungSprite {
  atlas: string; atlasW: number; atlasH: number; w: number; h: number; cot: number; neoX: number; neoY: number;
}

/** Vẽ 1 khung atlas, gốc tọa độ = điểm neo dưới chân; lật ngang quanh điểm neo */
@Component({
  selector: 'g[cgSprite]',
  standalone: true,
  template: `
    <svg:g [attr.transform]="lat ? 'scale(-1,1)' : null">
      <svg:svg [attr.x]="-sp.neoX" [attr.y]="-sp.neoY" [attr.width]="sp.w" [attr.height]="sp.h" [attr.viewBox]="viewBox"
        overflow="hidden">
        <svg:image [attr.href]="sp.atlas" [attr.width]="sp.atlasW" [attr.height]="sp.atlasH" preserveAspectRatio="none"
          [style.image-rendering]="muot ? 'auto' : 'pixelated'" />
      </svg:svg>
    </svg:g>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpriteComponent {
  @Input({ required: true }) sp!: KhungSprite;
  @Input({ required: true }) khung = 0;
  @Input() lat = false;
  /** true: làm mịn khi phóng/thu (ảnh vẽ tay); false: giữ nét pixel art */
  @Input() muot = false;

  get viewBox(): string {
    const { w, h, cot } = this.sp;
    return `${(this.khung % cot) * w} ${Math.floor(this.khung / cot) * h} ${w} ${h}`;
  }
}
