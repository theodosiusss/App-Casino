import Component from '@glimmer/component';
import { service } from '@ember/service';
import type UserService from 'app-casino/services/user';

export default class HeaderComponent extends Component {
  @service declare user: UserService;
}
