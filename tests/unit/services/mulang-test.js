import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { blocklyWorkspaceMock } from '../../helpers/mocks';

module('Unit | Service | pilas-mulang', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    blocklyWorkspaceMock()
    this.owner.lookup('service:blocksGallery').start()
  });

  let al_empezar_a_ejecutar = `
  <block type="al_empezar_a_ejecutar">
    <statement name="program">
      <block type="MoverACasillaDerecha">
        <next>
          <block type="MoverACasillaIzquierda">
            <next>
              <block type="MoverACasillaDerecha"></block>
            </next>
          </block>
        </next>
      </block>
    </statement>
  </block>
  `
  test('Should parse al_empezar_a_ejecutar', function(assert) {
    let pilasMulang = this.owner.lookup('service:pilas-mulang')
    let mainBlock = Blockly.textToBlock(al_empezar_a_ejecutar)
    let result = pilasMulang.parse(mainBlock)
    let expected = entryPoint(
      "al_empezar_a_ejecutar",
      application("MoverACasillaDerecha"),
      application("MoverACasillaIzquierda"),
      application("MoverACasillaDerecha")
    )
    assert.deepEqual(result, expected);
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
                  <block type="repetir">
                    <value name="count">
                      <shadow type="required_value"></shadow>
                      <block type="math_number">
                        <field name="NUM">10</field>
                      </block>
                    </value>
                    <statement name="block">
                      <shadow type="required_statement"></shadow>
                      <block type="MoverACasillaDerecha"></block>
                    </statement>
                  </block>
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
    let expectations = [
      {
         "binding" : "al_empezar_a_ejecutar",
         "inspection" : "UsesRepeat"
      }
    ]
    let result = pilasMulang.analyze(mainBlock, expectations)
    assertMulangResult(assert, result);
  });
});


function assertMulangResult(assert, {expectationResults}) {
  assert.ok(expectationResults.every(({result}) => result))
}

// Builders
function entryPoint(name, ...sequence) {
  return {
    tag: "EntryPoint",
    contents: [
      {
        tag: "Sequence",
        contents: sequence
      }
    ]
  }
}

function application(name) {
  return {
    tag: "Application",
    contents: [
      {
        tag: "Reference",
        contents: name
      },
      []
    ]
  }
}