import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { blocklyWorkspaceMock } from '../../helpers/mocks';

module('Unit | Service | pilas-mulang', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    blocklyWorkspaceMock()
    this.owner.lookup('service:blocksGallery').start()
  });


  let program = `
  <block type="al_empezar_a_ejecutar">
    <statement name="program">
      <shadow type="required_statement"></shadow>
      <block type="MoverACasillaDerecha">
        <next>
          <block type="MoverACasillaDerecha">
            <next>
              <block type="MoverACasillaDerecha">
                <next>
                  <block type="Repetir"></block>
                </next>
              </block>
            </next>
          </block>
        </next>
      </block>
    </statement>
  </block>
  `

  // Replace this with your real tests.
  test('Can analize blocks with mulang', function(assert) {
    let pilasMulang = this.owner.lookup('service:pilas-mulang')
    let mainBlock = Blockly.textToBlock(program)
    let result = pilasMulang.analyze(mainBlock)
    assertMulangResult(assert, result);
  });
});


function assertMulangResult(assert, {expectationResults}) {
  assert.ok(expectationResults.every(({result}) => result))
}