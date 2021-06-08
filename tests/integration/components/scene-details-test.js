import { module, test } from 'qunit';
import EmberObject from '@ember/object';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | Scene details', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders markdown', async function (assert) {

    this.set('model', EmberObject.extend({...sceneInfo}).create());
  
    await render(hbs`<SceneDetails @model={{this.model}}/>`);

    const boldText = this.element.querySelector('strong');
    assert.dom(boldText).hasText('tigre pipo')

    const slantText = this.element.querySelector('em');
    assert.dom(slantText).hasText('puma Duba')

    const headerText = this.element.querySelector('h1');
    assert.dom(headerText).hasText('Ayuda')
  });

  const sceneInfo = {
    nombre: 'AlienTocaBoton',
    titulo: 'El alien toca el botón',
    enunciado: '#Ayuda \n a la *puma Duba* a comer su churrasco. Evitá los obstáculos.',
    consignaInicial: '#Ayuda \n al **tigre pipo** a comer su churrasco. Evitá los obstáculos.',
  }
});
