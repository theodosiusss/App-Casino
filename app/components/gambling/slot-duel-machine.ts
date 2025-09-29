import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import type UserService from 'app-casino/services/user';
import type { SlotMachineSignature } from 'app-casino/components/gambling/slot-machine';

export default class SlotDuelMachine extends Component<SlotMachineSignature> {
  @service declare user: UserService;

  @tracked playerWins = 0;
  @tracked botWins = 0;
  @tracked round = 1;
  @tracked pot = 1000;
  @tracked isSpinning = false;

  roundWinner = '';

  icons: string[] = this.args.icons ?? [
    '🍒', '🍋', '🍊', '🍇', '🍉', '🔔', '💎', '7️⃣', '⭐'
  ];

  // Audio elements
  private spinAudio = new Audio('/assets/sounds/spin.mp3');
  private winAudio = new Audio('/assets/sounds/win.mp3');
  private loseAudio = new Audio('/assets/sounds/lose.mp3');

  get cost() { return this.args.cost ?? 100; }
  get price() { return this.args.price ?? 1000; }
  get isLastRound(): boolean { return this.round >= 10; }

  /** Create a div or img element for each icon */
  private createIconElement(icon: string, opacity: number = 1): HTMLElement {
    const div = document.createElement('div');
    div.className = 'slot-icon';
    div.style.opacity = opacity.toString();
    div.style.width = '80px';
    div.style.height = '80px';
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

  /** Spin both player and bot reels */
  @action
  async spinBoth() {
    if (this.isSpinning || this.round >= 10) return;
    if(this.round == 1) {
      if(this.cost > this.user.balance) {
        alert("Nicht genug geldy")
        return;
      }
      else {
        this.user.changeBalance(-this.cost, true);

      }
    }

    this.isSpinning = true;
    this.playSpinSound(); // 🎧 Start spin sound


    const playerReelsEls = Array.from(document.querySelectorAll('.player .reel')) as HTMLElement[];
    const botReelsEls = Array.from(document.querySelectorAll('.bot .reel')) as HTMLElement[];

    // Animate all reels simultaneously
    await Promise.all([
      ...playerReelsEls.map(el => this.spinReel(el)),
      ...botReelsEls.map(el => this.spinReel(el)),
    ]);

    // Helper to get the middle symbol (emoji or image src)
    const getMiddleSymbol = (el: HTMLElement): string => {
      const middle = el.querySelectorAll('.slot-icon')[1];
      if (!middle) return '';
      const img = middle.querySelector('img');
      if (img) return img.src;
      return middle.textContent || '';
    };

    const playerResult = playerReelsEls.map(el => getMiddleSymbol(el));
    const botResult = botReelsEls.map(el => getMiddleSymbol(el));

    if (playerResult.every(x => x === playerResult[0])) this.playerWins++;
    if (botResult.every(x => x === botResult[0])) this.botWins++;

    this.stopSpinSound(); // 🛑 stop spinning sound
    this.round++;

    if (this.round >= 10) {
      if (this.playerWins > this.botWins) {
        this.roundWinner = 'Player wins the pot!';
        this.user.changeBalance(this.pot, true);
        this.playWinSound(); // 🏆
      } else if (this.botWins > this.playerWins) {
        this.roundWinner = 'Bot wins the pot!';
        this.playLoseSound(); // 💸
      } else {
        this.roundWinner = "It's a tie!";
      }

      // Restart the game after a short delay
      setTimeout(() => window.location.reload(), 3000);
    }

    this.isSpinning = false;
  }

  /** Animate a single reel */
  private spinReel(reelEl: HTMLElement): Promise<void> {
    return new Promise((resolve) => {
      const duration = 2000 + Math.random() * 1000;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        reelEl.innerHTML = '';
        const currentIndex = Math.floor(progress * this.icons.length * 6) % this.icons.length;
        for (let offset = -1; offset <= 1; offset++) {
          const index = (currentIndex + offset + this.icons.length) % this.icons.length;
          // @ts-ignore
          reelEl.appendChild(this.createIconElement(this.icons[index], offset === 0 ? 1 : 0.5));
        }

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Render final top/middle/bottom symbols
          const finalIndex = Math.floor(Math.random() * this.icons.length);
          const topIndex = (finalIndex - 1 + this.icons.length) % this.icons.length;
          const bottomIndex = (finalIndex + 1) % this.icons.length;

          reelEl.innerHTML = '';
          [topIndex, finalIndex, bottomIndex].forEach((i, idx) => {
            // @ts-ignore
            reelEl.appendChild(this.createIconElement(this.icons[i], idx === 1 ? 1 : 0.5));
          });

          resolve();
        }
      };

      animate();
    });
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
