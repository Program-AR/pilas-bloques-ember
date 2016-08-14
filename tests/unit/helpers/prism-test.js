import { prism } from 'pilas-engine-bloques/helpers/prism';
import { module, test } from 'qunit';

module('Unit | Helper | prism');

// Replace this with your real tests.
test('it works', function(assert) {

  let result = prism(["hola"]);
  assert.equal(result, "hola", "Retorna el mismo texto si no hay nada de sintaxis especial.");

  let result_code = prism(["var hola"]);
  assert.equal(result_code.toString(), '<span class="token keyword" >var</span> hola', "Puede generar codigo html desde la sintaxis.");
});
