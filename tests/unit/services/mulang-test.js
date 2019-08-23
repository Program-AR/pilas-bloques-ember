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
                  <block type="ComerChurrasco"></block>
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
    let ast = pilasMulang.parse(mainBlock)
    let expectations = [
      {
         "binding" : "Intransitive:al_empezar_a_ejecutar",
         "inspection" : "Uses:ComerChurrasco"
      }
    ]

    console.log(ast)

    console.log(mulang.analyse({
      "sample" : {
        "tag": "MulangSample",
        "ast": ast
      },
      "spec": {
        "expectations": expectations,
        "smellsSet": {
          "tag": 'NoSmells',
        }
      }
    }))

    assert.ok(true);
  });
});
