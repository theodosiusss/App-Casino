import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class EichelComponent extends Component {
  @tracked pipo = 'rescueHeliSpotterPipoSanktGallen';

  @action
  addPipoSanktGallen() {
    this.pipo += ' rescueHeliSpotterPipoSanktGallen';
  }
}
