import { module, test } from 'qunit';
import { setupRenderingTest } from 'app-casino/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | slot-machine', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<Gambling::Slot-Machine />`);

    assert.dom().hasText('Not enough Credits');

    // Template block usage:
    await render(hbs`
      <Gambling::Slot-Machine>
        template block text
      </Gambling::Slot-Machine>
    `);

    assert.dom().hasText('template block text');
  });
});
