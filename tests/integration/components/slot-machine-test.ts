import { module, test } from 'qunit';
import { setupRenderingTest } from 'app-casino/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | slot-machine', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<SlotMachine />`);

    assert.dom().hasText('');

    // Template block usage:
    await render(hbs`
      <SlotMachine>
        template block text
      </SlotMachine>
    `);

    assert.dom().hasText('template block text');
  });
});
