import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import type UserService from 'app-casino/services/user';

export interface SlotMachineSignature {
  Args: {
    icons?: string[];
    spinDuration?: number;
    cost?: number;
    price?: number;
  };
  Blocks: {
    default: [];
  };
  Element: null;
}

export default class SlotMachine extends Component<SlotMachineSignature> {
  @tracked isSpinning = false;
  @tracked spinResults: string[] = [];
  @service declare user: UserService;

  cost = this.args.cost ?? 100;
  price = this.args.price ?? 1000;

  // Audio elements
  private spinAudio = new Audio('/assets/sounds/spin.mp3');
  private winAudio = new Audio('/assets/sounds/win.mp3');
  private loseAudio = new Audio('/assets/sounds/lose.mp3');

  iconWidth = 80;
  iconHeight = 80;

  get icons(): string[] {
    return (
      this.args.icons || [
        '🍒', '🍋', '🍊', '🍇', '🍉', '🔔', '💎', '7️⃣', '⭐', '🔔',
      ]
    );
  }

  get spinDuration(): number {
    return this.args.spinDuration || 3000;
  }

  private createIconElement(icon: string): HTMLElement {
    const div = document.createElement('div');
    div.className = 'slot-icon';
    div.style.width = `${this.iconWidth}px`;
    div.style.height = `${this.iconHeight}px`;
    div.style.display = 'flex';
    div.style.alignItems = 'center';
    div.style.justifyContent = 'center';
    div.style.fontSize = '40px';

    if (icon.match(/\.(jpg|jpeg|png|gif|svg)$/i)) {
      const img = document.createElement('img');
      img.src = icon;
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'contain';
      div.appendChild(img);
    } else {
      div.textContent = icon;
    }

    return div;
  }

  @action
  async spin(): Promise<void> {
    if (this.user.balance < this.cost) return;
    if (this.isSpinning) return;

    this.user.changeBalance(-this.cost, true);
    this.isSpinning = true;
    this.spinResults = [];

    // 🎧 Play spin sound (looped)
    this.playSpinSound();

    const reels = document.querySelectorAll('.reel');
    const promises: Promise<void>[] = [];

    for (let i = 0; i < reels.length; i++) {
      promises.push(this.spinReel(reels[i] as HTMLElement, i));
    }

    await Promise.all(promises);

    this.isSpinning = false;
    this.stopSpinSound();

    const isWin = this.spinResults.every((x) => x === this.spinResults[0]);
    if (isWin) {
      this.user.changeBalance(this.price, true);
      this.playWinSound();
      alert("You win!");
    } else {
      this.playLoseSound();
      alert("You lose!");
    }

    console.log(this.spinResults);
  }

  private async spinReel(reel: HTMLElement, reelIndex: number): Promise<void> {
    return new Promise((resolve) => {
      reel.innerHTML = '';

      const duration = this.spinDuration + reelIndex * 500;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);

        this.updateReelContent(reel, easeOut);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          const finalIndex = Math.floor(Math.random() * this.icons.length);
          const finalSymbol = this.icons[finalIndex] ?? '';
          this.spinResults[reelIndex] = finalSymbol;
          this.renderFinalReel(reel, finalIndex);
          resolve();
        }
      };

      animate();
    });
  }

  private updateReelContent(reel: HTMLElement, progress: number): void {
    reel.innerHTML = '';

    const currentIndex =
      Math.floor(progress * this.icons.length * 6) % this.icons.length;

    for (let offset = -1; offset <= 1; offset++) {
      const index =
        (currentIndex + offset + this.icons.length) % this.icons.length;
      const iconElement = this.createIconElement(this.icons[index] ?? '');
      iconElement.style.opacity = offset === 0 ? '1' : '0.5';
      reel.appendChild(iconElement);
    }
  }

  private renderFinalReel(reel: HTMLElement, finalIndex: number): void {
    reel.innerHTML = '';

    const topIndex = (finalIndex - 1 + this.icons.length) % this.icons.length;
    const bottomIndex = (finalIndex + 1) % this.icons.length;

    const topEl = this.createIconElement(this.icons[topIndex] ?? '');
    topEl.style.opacity = '0.5';

    const midEl = this.createIconElement(this.icons[finalIndex] ?? '');

    const botEl = this.createIconElement(this.icons[bottomIndex] ?? '');
    botEl.style.opacity = '0.5';

    reel.appendChild(topEl);
    reel.appendChild(midEl);
    reel.appendChild(botEl);
  }

  // --- Audio helpers ---

  private playSpinSound() {
    try {
      this.spinAudio.currentTime = 0;
      this.spinAudio.loop = true;
      this.spinAudio.play().catch(() => {});
    } catch (e) {
      console.warn('Spin audio failed', e);
    }
  }

  private stopSpinSound() {
    try {
      this.spinAudio.pause();
      this.spinAudio.currentTime = 0;
    } catch (e) {
      console.warn('Stop spin audio failed', e);
    }
  }

  private playWinSound() {
    try {
      this.winAudio.currentTime = 0;
      this.winAudio.play().catch(() => {});
    } catch (e) {
      console.warn('Win audio failed', e);
    }
  }

  private playLoseSound() {
    try {
      this.loseAudio.currentTime = 0;
      this.loseAudio.play().catch(() => {});
    } catch (e) {
      console.warn('Lose audio failed', e);
    }
  }
}
