import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { create, visitable, text, collection, attribute } from 'ember-cli-page-object';
import setupMirage from "ember-cli-mirage/test-support/setup-mirage";

/*
 * Prueba que en ver libros se ven los capitulos y grupos internacionalizados.
 */
module('Acceptance | vista de libro test', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  function testVistaDeLibro(libroId) {
    test(`visiting /libros/${libroId}`, async function (assert) {
      const page = create({
        scope: '.contenido-principal',
        visit: visitable(`/libros/${libroId}`),
        capitulos: collection('[data-test-vista-de-libro-capitulo]',
          {
            id: attribute('data-vista-de-libro-capitulo-id', '[data-vista-de-libro-capitulo-id]'),
            title: text('[data-vista-de-libro-capitulo-title]'),
            grupos: collection('[data-vista-de-libro-grupo]',
              {
                id: attribute('data-vista-de-libro-grupo-id', '[data-vista-de-libro-grupo-id]'),
                title: text('[data-vista-de-libro-grupo-title]'),
              }
            )
          }
        )
      });

      await page.visit();

      var intl = this.owner.lookup('service:intl');

      console.log(`page.capitulos.length: ${page.capitulos.length}`);

      for (var i = 0; i < page.capitulos.length; i++) {
        var capitulo = page.capitulos[i];

        assert.equal(capitulo.title, intl.t(`model.chapters.${capitulo.id}.title`).string, `Se muestra la internacionalizacion del titulo del capitulo '${capitulo.id}'`);

        for (var j = 0; j < capitulo.grupos.length; j++) {
          var grupo = capitulo.grupos[j];

          assert.equal(grupo.title, intl.t(`model.groups.${grupo.id}.title`).string, `Se muestra la internacionalizacion del titulo del grupo '${grupo.id}'`);
        }
      }
    });
  }

  testVistaDeLibro(1);
  testVistaDeLibro(2);
});
