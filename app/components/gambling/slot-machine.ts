import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

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

  @action
  async spin(): Promise<void> {
    if (this.isSpinning) return;

    this.isSpinning = true;
    this.spinResults = [];

    const reels = document.querySelectorAll('.reel');
    const promises = [];

    // Spin each reel
    for (let i = 0; i < reels.length; i++) {
      promises.push(this.spinReel(reels[i] as HTMLElement, i));
    }

    // Wait for all reels to stop
    await Promise.all(promises);

    this.isSpinning = false;

    console.log(this.spinResults);


    // Call completion callback if provided
    if (this.args.onSpinComplete) {
      this.args.onSpinComplete(this.spinResults);
    }
  }

  private async spinReel(reel: HTMLElement, reelIndex: number): Promise<void> {
    return new Promise((resolve) => {
      // Clear previous content
      reel.innerHTML = '';

      // Create spinning animation
      const duration = this.spinDuration + (reelIndex * 500); // Stagger the stops
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth deceleration
        const easeOut = 1 - Math.pow(1 - progress, 3);

        // Update reel content during spin
        this.updateReelContent(reel, easeOut);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Final result
          const finalIcon = this.getRandomIcon();
          this.updateReelContent(reel, 1, finalIcon);
          this.spinResults[reelIndex] = finalIcon;
          resolve();
        }
      };

      animate();
    });
  }

  private updateReelContent(reel: HTMLElement, progress: number, finalIcon?: string): void {
    reel.innerHTML = '';

    if (finalIcon) {
      // Display final result
      const iconElement = this.createIconElement(finalIcon);
      reel.appendChild(iconElement);
    } else {
      // Display spinning animation
      const currentIndex = Math.floor(progress * this.icons.length * 3) % this.icons.length;
      const iconElement =!!this.icons[currentIndex] ? this.createIconElement(this.icons[currentIndex]) : this.createIconElement("");
      iconElement.style.opacity = '0.7';
      reel.appendChild(iconElement);
    }
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

    // Check if it's an image URL or emoji/text
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

  private getRandomIcon(): string {
    const randomIndex = Math.floor(Math.random() * this.icons.length);
    return !!this.icons[randomIndex] ? this.icons[randomIndex] : this.icons.toString();
  }
}
