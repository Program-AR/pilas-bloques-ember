import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | multiple-scenarios-arrow', function (hooks) {
  setupRenderingTest(hooks);
  const arrow = hbs`{{multiple-scenarios-arrow shouldShowMultipleScenarioHelp=shouldShowMultipleScenarioHelp shouldUseFloatingMode=shouldUseFloatingMode}}`

  test('It shows in challenges with shouldShowMultipleScenarioHelp', async function (assert) {
    await renderArrow(this, true);
    assert.dom('div.multiple-scenarios-arrow').exists()
  });
  
  test('By default, it does NOT show', async function (assert) {
    await render(arrow);
    assert.dom('div.multiple-scenarios-arrow').doesNotExist()
  });

  test('It does NOT show for challenges with no shouldShowMultipleScenarioHelp', async function (assert) {
    await renderArrow(this, false);
    assert.dom('div.multiple-scenarios-arrow').doesNotExist()
  });

  test('It shows in full screen mode using floating mode', async function (assert) {
    await renderArrow(this, true, true);
    assert.dom('div.full-screen-arrow').exists()
  });

  test('It shows in normal screen mode when NOT using floating mode', async function (assert) {
    await renderArrow(this, true, false);
    assert.dom('div.normal-screen-arrow').exists()
  });

  async function renderArrow(testContext, shouldshouldShowMultipleScenarioHelp, shouldUseFloatingMode = true) {
    testContext.set('shouldShowMultipleScenarioHelp', shouldshouldShowMultipleScenarioHelp);
    testContext.set('shouldUseFloatingMode', shouldUseFloatingMode);
    await render(arrow);
  }
  
});