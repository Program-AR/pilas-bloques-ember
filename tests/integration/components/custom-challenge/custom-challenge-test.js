/* global fetch */
import { module, test } from 'qunit';
import { zipUrl } from './zip-content'
import { setupPBIntegrationTest } from '../../../helpers/utils'

module('Integration | Component | custom-challenge', function (hooks) {
  var challengeJson
  setupPBIntegrationTest(hooks);


  hooks.beforeEach(async function () {
    const zipContent = await fetch(zipUrl).then(res => res.arrayBuffer())
    const importComponent = this.owner.factoryFor('component:import-custom-challenge').create();
    await importComponent._loadChallenge(zipContent, (challenge) => { challengeJson = challenge; console.log(challenge) })
  })

  test('Custom challenge should have title', function (assert) { assert.equal(challengeJson.titulo, 'Lita y frutas'); })
  test('Should preload challenge images', async function (assert) { assert.equal(challengeJson.imagesToPreload.length, 13); })
  //actividadTest(challengeJson.id, { solucion: `oidfjg0ajdf0` })

});