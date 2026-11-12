import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ChickenShootingGameComponent } from './chicken-shooting-game/chicken-shooting-game.component';

// Khi chạy trong iframe (nhúng từ EORM): bấm Đóng thì báo trang cha đóng khung game
const TIN_DONG_GAME = 'chicken-shooting-game:dong';

@Component({
  selector: 'app-root',
  imports: [ChickenShootingGameComponent],
  template: `
    @if (dangMo()) {
      <app-chicken-shooting-game (dong)="dong()" />
    } @else {
      <div class="cho">
        <button type="button" (click)="dangMo.set(true)">Chơi game bắn gà</button>
      </div>
    }
  `,
  styles: `
    .cho { height: 100vh; display: flex; align-items: center; justify-content: center; }
    button {
      padding: 14px 32px; font-size: 20px; font-weight: 600; cursor: pointer;
      border: none; border-radius: 12px; background: #f59e0b; color: #1f2937;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  dangMo = signal(true);

  dong(): void {
    this.dangMo.set(false);
    if (window.parent !== window) window.parent.postMessage(TIN_DONG_GAME, '*');
  }
}
