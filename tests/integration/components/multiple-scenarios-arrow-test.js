import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | multiple-scenarios-arrow', function(hooks) {
  setupRenderingTest(hooks);
  const arrow = hbs`{{multiple-scenarios-arrow shouldShowMultipleScenarioHelp=shouldShowMultipleScenarioHelp shouldUseFloatingMode=shouldUseFloatingMode}}`

  hooks.beforeEach(function() {
    this.set('shouldUseFloatingMode', true);
  });

  test('Multiple Scenarios arrow shows in challenges with shouldShowMultipleScenarioHelp', async function (assert) {
    this.set('shouldShowMultipleScenarioHelp', true);
    await render(arrow);
    assert.dom('div.multiple-scenarios-arrow').exists()
  });

  test('Multiple Scenarios arrow does NOT show for challenges with no shouldShowMultipleScenarioHelp', async function (assert) {
    this.set('shouldShowMultipleScenarioHelp', false);
    await render(arrow);
    assert.dom('div.multiple-scenarios-arrow').doesNotExist()
  });
  
});
