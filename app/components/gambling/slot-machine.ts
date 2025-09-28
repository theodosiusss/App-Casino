import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import {service} from "@ember/service";
import type UserService from "app-casino/services/user";

export interface SlotMachineSignature {
  Args: {
    icons?: string[]; // Array of icon URLs or paths
    spinDuration?: number; // Duration of spin in milliseconds
    onSpinComplete?: (results: string[]) => void; // Callback when spin completes
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

  // Default values
  iconWidth = 80;
  iconHeight = 80;
  iconNumber = 10;

  // Default icons if none provided
  get icons(): string[] {
    return this.args.icons || [
      '🍒', '🍋', '🍊', '🍇', '🍉',
      '🔔', '💎', '7️⃣', '⭐', '🔔'
    ];
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

    // If it's an image URL
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
    if(this.user.balance < 100) return;
    if (this.isSpinning) return;
    this.user.changeBalance(-100);
    this.isSpinning = true;
    this.spinResults = [];

    const reels = document.querySelectorAll('.reel');
    const promises: Promise<void>[] = [];

    // Spin each reel
    for (let i = 0; i < reels.length; i++) {
      promises.push(this.spinReel(reels[i] as HTMLElement, i));
    }

    // Wait for all reels to stop
    await Promise.all(promises);

    this.isSpinning = false;

    if(this.spinResults.every((x) => x === this.spinResults[0])){
      this.user.addBadges();
      this.user.changeBalance(1000);
    }
    console.log(this.spinResults);

    // Call completion callback if provided
    if (this.args.onSpinComplete) {
      this.args.onSpinComplete(this.spinResults);
    }
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
          // Pick a random icon for the middle row
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

    // Pick a "scrolling" index
    const currentIndex = Math.floor(progress * this.icons.length * 6) % this.icons.length;

    for (let offset = -1; offset <= 1; offset++) {
      const index = (currentIndex + offset + this.icons.length) % this.icons.length;
      const iconElement = this.createIconElement(this.icons[index] ?? '');
      iconElement.style.opacity = offset === 0 ? '1' : '0.5';
      reel.appendChild(iconElement);
    }
  }

  private renderFinalReel(reel: HTMLElement, finalIndex: number): void {
    reel.innerHTML = '';

    // top, middle, bottom
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

  private getRandomIcon(): string {
    const randomIndex = Math.floor(Math.random() * this.icons.length);
    return this.icons[randomIndex] ?? '';
  }
}
