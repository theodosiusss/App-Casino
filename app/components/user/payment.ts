import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import {tracked} from "@glimmer/tracking";
import type UserService from "app-casino/services/user";

export default class PaymentComponent extends Component {
  @service   @service declare user: UserService;


}
