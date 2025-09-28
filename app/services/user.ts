import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class UserService extends Service {
  @tracked name = '';
  @tracked balance = 0;
  @tracked isVerified = false;
  @tracked badges: string[] = [];

  constructor(...args: ConstructorParameters<typeof Service>) {
    super(...args);
    this.getSavedUser();

    // window.addEventListener('beforeunload', () => {
    //   this.saveAll();
    /// });
  }

  get isLoggedIn() {
    return !!this.name;
  }

  get insufficientBalance() {
    return this.balance < 100;
  }
  setName(name: string) {
    this.name = name;
    this.balance += 100;
    this.saveAll();
  }
  @action
  changeBalance(sum: number, isNotPay: boolean) {
    if(isNotPay){
      if(this.balance + sum >= 0){
      this.balance += sum;
      this.saveAll();
      }
      else {
        alert("Du kannst dir dieses abzeichen nicht leisten")
        this.saveAll();
      }
    }else {
    if(this.balance + sum >= 10000){
      alert("Sie können maximal 9999€ einzahlen");
    }else {
      this.balance += sum;
      this.saveAll();
    }
    }

  }
  @action
  verify() {
    this.isVerified = true;
    this.saveAll();
  }
  @action
  addBadge(path: string) {
    this.badges = [...this.badges, path];
    this.saveAll();
  }



  saveAll() {
    localStorage.setItem('user', JSON.stringify(this.name));
    localStorage.setItem('balance', JSON.stringify(this.balance));
    localStorage.setItem('badges', JSON.stringify(this.badges));
    localStorage.setItem('isVerified', JSON.stringify(this.isVerified));
  }
  getSavedUser() {
    const name = localStorage.getItem('user');
    const balance = localStorage.getItem('balance');
    const badges = localStorage.getItem('badges');
    const isVerified = localStorage.getItem('isVerified');

    if (name) {
      this.name = JSON.parse(name) as string;
    }
    if (balance) {
      this.balance = JSON.parse(balance) as number;
    }
    if (badges) {
      this.badges = JSON.parse(badges) as string[];
    }
    if (isVerified) {
      this.isVerified = JSON.parse(isVerified) as boolean;
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
