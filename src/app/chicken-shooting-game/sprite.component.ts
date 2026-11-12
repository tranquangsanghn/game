import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NhanVatSprite } from './nhan-vat-sprite';

/** Vẽ 1 khung atlas, gốc tọa độ = điểm neo dưới chân; lật ngang quanh điểm neo */
@Component({
  selector: 'g[cgSprite]',
  standalone: true,
  template: `
    <svg:g [attr.transform]="lat ? 'scale(-1,1)' : null">
      <svg:svg [attr.x]="-sp.neoX" [attr.y]="-sp.neoY" [attr.width]="sp.w" [attr.height]="sp.h" [attr.viewBox]="viewBox"
        overflow="hidden">
        <svg:image [attr.href]="sp.atlas" [attr.width]="sp.atlasW" [attr.height]="sp.atlasH" preserveAspectRatio="none"
          style="image-rendering: pixelated" />
      </svg:svg>
    </svg:g>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpriteComponent {
  @Input({ required: true }) sp!: NhanVatSprite;
  @Input({ required: true }) khung = 0;
  @Input() lat = false;

  get viewBox(): string {
    const { w, h, cot } = this.sp;
    return `${(this.khung % cot) * w} ${Math.floor(this.khung / cot) * h} ${w} ${h}`;
  }
}
