import { module, test } from 'qunit';
import EmberObject from '@ember/object';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | Scene details', function (hooks) {
  setupRenderingTest(hooks);
  
  const sceneInfo = {
    nombre: 'AlienTocaBoton',
    titulo: 'El alien toca el botón',
    enunciado: '#Ayuda \n a la *puma Duba* a comer su churrasco. Evitá los obstáculos.',
    consignaInicial: '#Ayuda \n al **tigre pipo** a comer su churrasco. Evitá los obstáculos.',
  }
  const sceneDetails = hbs`<SceneDetails @model={{this.model}}/>`

  hooks.beforeEach(function () {
    this.set('model', EmberObject.extend({...sceneInfo}).create());
  })

  test('it renders markdown', async function (assert) {
    await render(sceneDetails);

    const boldText = this.element.querySelector('strong');
    assert.dom(boldText).hasText('tigre pipo')

    const slantText = this.element.querySelector('em');
    assert.dom(slantText).hasText('puma Duba')

    const headerText = this.element.querySelector('h1');
    assert.dom(headerText).hasText('Ayuda')
  });

  test('clicking on a clue should activate it', async function (assert) {
    await clickClue(this)

    const clue = document.getElementById('clue')
    assert.dom(clue).hasClass('active')
  })

  test('clicking on a clue should deactivate statement tab', async function (assert) {
    await clickClue(this)

    const statement = document.getElementById('statement')
    assert.dom(statement).doesNotHaveClass('active')
  })

  test('clicking on a clue should show it and hide the statement tab', async function (assert) {
    await clickClue(this)

    const clue = document.getElementById('clue')
    const statement = document.getElementById('statement')
    assert.equal(window.getComputedStyle(statement).display, 'none')
    assert.equal(window.getComputedStyle(clue).display, 'block')
  })

  const clickClue = async (context) => {
    await render(sceneDetails)
    const clueButton = context.element.querySelectorAll('button')[1]
    await click(clueButton)
  }
});
