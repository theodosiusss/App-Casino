import Component from '@glimmer/component';
import {action} from '@ember/object';
import {service} from '@ember/service';
import {tracked} from '@glimmer/tracking';
import type UserService from 'app-casino/services/user';
import type Router from 'app-casino/router';

export default class LoginComponent extends Component {
  @service declare user: UserService;
  @service declare router: Router;

  stream = null;

  badges = [{
      path: "assets/badges/img.png",
      price: 10000,
      name: "gambler"
    },
    {
      path: "assets/badges/img_1.png",
      price: 20000,
      name: "supergambler"
    },
    {
      path: "assets/badges/img_2.png",
      price: 30000,
      name: "superdupergambler"
    },
    {
      path: "assets/badges/img_3.png",
      price: 100000,
      name: "superdupermegagambler"
    },


  ]

  @tracked username = '';

  @action
  hasBadge(path: string): boolean {
    return this.user.badges.some((b) => b === path);
  }

  @action
  updateUsername(event: Event) {
    this.username = (event.target as HTMLInputElement).value;
  }

  @action
  submitLogin(event: Event) {
    event.preventDefault();
    this.user.setName(this.username);
    setTimeout(() => this.router.transitionTo('/'), 1000);
  }
  @action
  buyBadge(path : string, price : number){
    if(this.user.balance < price){
      alert("Du kannst dir dieses abzeichen nicht leisten");
      return;
    }
    this.user.addBadge(path);
    console.log(this.user.badges);
    this.user.changeBalance(-price,true);
  }


  @action
  async startVerification() {
    // Modal öffnen
    // @ts-ignore
    const modal = new bootstrap.Modal(document.getElementById("verifyModal"));
    modal.show();

    const videoEl = document.getElementById("verifyVideo");
    const statusEl = document.getElementById("verifyStatus");

    try {
      // @ts-ignore
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // @ts-ignore
      videoEl.srcObject = this.stream;
      // @ts-ignore
      statusEl.textContent = "Verifiziere ...";

      // Nach 15 Sekunden stoppen
      setTimeout(() => {
        // @ts-ignore
        this.stream.getTracks().forEach((track) => track.stop());
        // @ts-ignore
        statusEl.textContent = "✅ Verified!";
        this.user.verify();
        setTimeout(()=> modal.hide(), 1000);
      }, 5000);
    } catch (err) {
      // @ts-ignore
      statusEl.textContent = "❌ Kamera konnte nicht gestartet werden.";
      console.error("Kamera-Fehler:", err);
    }
  }



}
