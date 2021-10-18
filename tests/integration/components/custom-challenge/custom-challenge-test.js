/* global fetch */
import { module, test } from 'qunit';
import { zipUrl } from './zip-content'
import { setupPBIntegrationTest } from '../../../helpers/utils'
//import { actividadTest, moduloActividad } from '../../../helpers/actividadTest';

module('Integration | Component | custom-challenge', function (hooks) {
  var challengeJson
  const zipContent = fetch(zipUrl).then(res => res.arrayBuffer()) //This needs to be fetched before setting up the fetch mock.
  setupPBIntegrationTest(hooks);


  hooks.beforeEach(async function () {
    const importComponent = this.owner.factoryFor('component:import-custom-challenge').create();
    await importComponent._loadChallenge(await zipContent, (challenge) => { challengeJson = challenge })
  })

  test('Custom challenge should have title', function (assert) { assert.equal(challengeJson.titulo, 'Lita y frutas'); })
  test('Should preload challenge images', function (assert) { assert.equal(challengeJson.imagesToPreload.length, 13); })
});


//Mirage breaks the fetch of this test.
/*
moduloActividad('custom-activity', (hooks) => {

  hooks.beforeEach(async function () {
    const zipContent = await fetch(zipUrl).then(res => res.arrayBuffer())
    const importComponent = this.owner.factoryFor('component:import-custom-challenge').create();
    await importComponent.leerSolucionWeb(zipContent)
  })

  actividadTest('LitaFrutas', { solucion: `` })

})
*/