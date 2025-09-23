import { module, test } from 'qunit';
import { setupTest } from 'app-casino/tests/helpers';

module('Unit | Service | user', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    const service = this.owner.lookup('service:user');
    assert.ok(service);
  });
});
