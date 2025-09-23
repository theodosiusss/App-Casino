import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import {tracked} from "@glimmer/tracking";

export default class LoginComponent extends Component {
  @service user;

  @tracked username = '';

  @action
  submitLogin(event: Event) {
    event.preventDefault();
    this.user.setName(this.username);}
}
