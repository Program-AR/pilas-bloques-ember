import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { createActivity, createGroup } from '../../helpers/mocks'

module('Integration | Component | challenge-navigation-arrows', function (hooks) {
  let firstActivity
  let lastActivity
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    const group = createGroup(this.owner, { id: 1, desafioIds: [201, 202, 203] })
    firstActivity = createActivity(this.owner, { id: 201, grupo: group })
    createActivity(this.owner, { id: 202, grupo: group })
    lastActivity = createActivity(this.owner, { id: 203, grupo: group })
  })

  test('A challenge with a next challenge should have a next challenge arrow', async function (assert) {
    this.set('challenge', firstActivity)
    await render(hbs`<ChallengeNavigationArrows @challenge={{challenge}}/>`)
    assert.dom('#next-challenge-arrow').exists()
  });

  test('A challenge without next challenge should not have a next challenge arrow', async function (assert) {
    this.set('challenge', lastActivity)
    await render(hbs`<ChallengeNavigationArrows @challenge={{challenge}}/>`)
    assert.dom('#next-challenge-arrow').doesNotExist()
  })

  test('A challenge with previous challenge should have a previous challenge arrow', async function (assert) {
    this.set('challenge', lastActivity)
    await render(hbs`<ChallengeNavigationArrows @challenge={{challenge}}/>`)
    assert.dom('#previous-challenge-arrow').exists()
  })

  test('A challenge without previous challenge should not have a previous challenge arrow', async function (assert) {
    this.set('challenge', firstActivity)
    await render(hbs`<ChallengeNavigationArrows @challenge={{challenge}}/>`)
    assert.dom('#previous-challenge-arrow').doesNotExist()
  })

  test('Should not render arrows when challenge is undefined', async function (assert) {
    await render(hbs`<ChallengeNavigationArrows`)
    assert.dom('#previous-challenge-arrow').doesNotExist()
    assert.dom('#next-challenge-arrow').doesNotExist()
  })
});
