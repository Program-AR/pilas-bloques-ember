import { module, test } from 'qunit';
import { zipUrl } from './zip-content'
import { setUpTestLocale } from '../../../helpers/utils'
import { setupTest } from 'ember-qunit'

module('Integration | Component | custom-challenge', function (hooks) {
  var zipContent

  setupTest(hooks);
  setUpTestLocale(hooks)

  hooks.before(async () => {
    zipContent = await fetch(zipUrl).then(res => res.arrayBuffer())
  })

  const customChallengeJsonTest = async (testName, testAssert) =>
    test(testName, async function (assert) {
      const importComponent = this.owner.factoryFor('component:import-custom-challenge').create();
      await importComponent._loadChallenge(zipContent, (challengeJson) => testAssert(assert, challengeJson))
    })

  customChallengeJsonTest('Custom challenge should have title', (assert, challengeJson) => { assert.equal(challengeJson.titulo, 'Lita y frutas'); })
  customChallengeJsonTest('Should preload challenge images', (assert, challengeJson) => { assert.equal(challengeJson.imagesToPreload.length, 13); })
});
