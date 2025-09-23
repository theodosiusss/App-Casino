import { module, test } from 'qunit';
import { setupTest } from 'app-casino/tests/helpers';

module('Unit | Route | games', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    const route = this.owner.lookup('route:games');
    assert.ok(route);
  });
});
