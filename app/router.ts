import EmberRouter from '@ember/routing/router';
import config from 'app-casino/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('home', {path: '/'});
  this.route('games', function() {
    this.route('slot', { path: 'slot/:id' });
    this.route('slot-duel', { path: 'slot-duel/:id' });
  });
  this.route('login');
  this.route('payment');
});
