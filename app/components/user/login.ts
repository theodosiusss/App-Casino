import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import {tracked} from "@glimmer/tracking";
import type UserService from "app-casino/services/user";

export default class LoginComponent extends Component {
  @service declare user: UserService;

  @tracked username = '';

  @action
  submitLogin(event: Event) {
    event.preventDefault();
    this.user.setName(this.username);}
}
