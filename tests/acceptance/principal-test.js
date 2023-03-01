import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { create, visitable, text, count } from 'ember-cli-page-object';
import { currentURL } from '@ember/test-helpers';

const page = create({
  scope: '.contenido-principal',
  visit: visitable('/'),
  tituloModal: text('h4', { scope: '.ember-modal-dialog', resetScope: true }),
  cantidadDeImagenes: count('img'),
  cantidadDeLinks: count('a'),
  translatedText: text(),
});

module('Acceptance | principal', function (hooks) {
  setupApplicationTest(hooks);

  test('visiting /', async function (assert) {
    await page.visit();
    // test translations
    assert.equal(currentURL(), '/libros', " current url is "+currentURL()+" instead of /libros");
    assert.true(page.translatedText.includes("Los desafíos que ofrecemos están organizados en los siguientes grupos:"),"text should be tranlated "+page.translatedText)
    assert.false(page.translatedText.includes("Missing translation"),"no translations should be missing")
  });
});
