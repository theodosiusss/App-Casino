import { module, test } from 'qunit';
import { setupRenderingTest } from 'app-casino/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | bot-vs-player-slot', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(hbs`<Gambling::Bot-Vs-Player-Slot />`);

    assert.dom().hasText('Bot vs Player Slot Challenge');
    assert.dom().hasText('Compete against the bot in 10 spins!');
    assert.dom().hasText('Start Challenge (100 credits)');
  });

  test('it shows game controls when user has insufficient balance', async function (assert) {
    // Mock user service with insufficient balance
    this.owner.lookup('service:user').balance = 50;
    
    await render(hbs`<Gambling::Bot-Vs-Player-Slot />`);

    assert.dom().hasText('Start Challenge (100 credits)');
    // The button should be disabled due to insufficient balance
  });
});
