import Service from '@ember/service';
import {tracked} from "@glimmer/tracking";
import {action} from "@ember/object";

export default class UserService extends Service {

  @tracked name = "";
  @tracked balance = 0;
  @tracked isVerified = false;
  @tracked badges: string[] = [];

  constructor() {
    super(...arguments);
    this.getSavedUser();

    window.addEventListener('beforeunload', () => {
      this.saveAll();
    });
  }

  get isLoggedIn(){
    return !!(this.balance && this.name);
  }

  setName(name: string) {
    this.name = name;
    this.balance +=100;
    this.saveAll();
  }
  @action
  changeBalance(sum : number) {
    this.balance += sum;
    this.saveAll();
  }
  @action
  verify(){
    this.isVerified = true;
    this.saveAll();
  }

  @action
  addBadges(){
    if (this.balance > 1000 && !this.badges.includes("SuperGambler")) {
      this.badges.push("SuperGambler");
    }
    if (this.balance > 10000 && !this.badges.includes("AlphaGambler")) {
      this.badges.push("AlphaGambler");
    }
    if (this.balance > 20000 && !this.badges.includes("SigmaGambler")) {
      this.badges.push("SigmaGambler");
    }
    this.saveAll();

  }
  saveAll(){
    localStorage.setItem("user", JSON.stringify(this.name));
    localStorage.setItem("balance", JSON.stringify(this.balance));
    localStorage.setItem("badges", JSON.stringify(this.badges));
    localStorage.setItem("isVerified", JSON.stringify(this.isVerified));
  }
  getSavedUser(){
    const name = localStorage.getItem("user");
    const balance = localStorage.getItem("balance");
    const badges = localStorage.getItem("badges");
    const isVerified = localStorage.getItem("isVerified");

    if (name) {
      this.name = JSON.parse(name);
    }
    if (balance) {
      this.balance = JSON.parse(balance);
    }
    if (badges) {
      this.badges = JSON.parse(badges);
    }
    if (isVerified) {
      this.isVerified = JSON.parse(isVerified);
    }
  }




}

// Don't remove this declaration: this is what enables TypeScript to resolve
// this service using `Owner.lookup('service:user')`, as well
// as to check when you pass the service name as an argument to the decorator,
// like `@service('user') declare altName: UserService;`.
declare module '@ember/service' {
  interface Registry {
    user: UserService;
  }
}
