import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type UserService from 'app-casino/services/user';
import type Router from 'app-casino/router';

export default class LoginComponent extends Component {
  @service declare user: UserService;
  @service declare router: Router;

  @tracked username = '';

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
}
