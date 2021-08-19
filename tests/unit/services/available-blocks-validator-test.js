import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { blocklyWorkspaceMock } from '../../helpers/mocks';
import { findBlockByTypeIn, assertNotDisabled, assertNotAvailable, setUpTestLocale } from '../../helpers/utils';

module('Unit | Service | available-blocks-validator', function (hooks) {
  setupTest(hooks);
  setUpTestLocale(hooks)

  var validator

  hooks.beforeEach(function () {
    validator = this.owner.lookup('service:available-blocks-validator');
    this.blocksGallery = this.owner.lookup('service:blocksGallery');
    blocklyWorkspaceMock()
    this.blocksGallery.start();
  });

  let simpleProgram =
    `<block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="269" y="15">
        <statement name="program">
        <block type="MoverACasillaDerecha">
            <next>
            <block type="MoverACasillaIzquierda"></block>
            </next>
        </block>
        </statement>
    </block>`

  test('Should not disable global available blocks', function (assert) {
    let program = Blockly.textToBlock(simpleProgram)
    validator.disableNotAvailableBlocksInWorkspace([])
    assertNotDisabled(assert, program)
  });

  test('Should disable not available activity blocks', function (assert) {
    let program = Blockly.textToBlock(simpleProgram)
    let moveLeft = findBlockByTypeIn(program, "MoverACasillaIzquierda")
    validator.disableNotAvailableBlocksInWorkspace(["MoverACasillaDerecha"])
    assertNotAvailable(assert, moveLeft)
  });

  test('Should not disable available activity blocks', function (assert) {
    let program = Blockly.textToBlock(simpleProgram)
    let moveRight = findBlockByTypeIn(program, "MoverACasillaDerecha")
    validator.disableNotAvailableBlocksInWorkspace(["MoverACasillaDerecha"])
    assertNotDisabled(assert, moveRight)
  });

  let procedureDefinition =
    `<block type="procedures_defnoreturn" id="whpKBVIV.;:t%=8XN+E_" x="778" y="185">
        <mutation>
          <arg name="param"></arg>
        </mutation>
        <field name="NAME">Hacer algo</field>
        <field name="ARG0">param</field>
        <statement name="STACK">
          <block type="GirarGrados" id=";qf!gXUI;'/BUa0nx#y]">
            <value name="grados">
              <block type="variables_get" id="wAE7-:@m*P0G[x'Uf$Hv">
                <mutation var="param" parent="whpKBVIV.;:t%=8XN+E_"></mutation>
              </block>
            </value>
          </block>
        </statement>
      </block>`

  let procedureCallProgram =
    `<block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="0" y="0">
      <statement name="program">
        <block type="procedures_callnoreturn">
          <mutation name="Hacer algo"></mutation>
        </block>
      </statement>
    </block>`

  test('Should disable procedure blocks when they are not available', function (assert) {
    let procedure = Blockly.textToBlock(procedureDefinition)
    let variable = findBlockByTypeIn(procedure, "variables_get")
    let program = Blockly.textToBlock(procedureCallProgram)
    let procedureCall = findBlockByTypeIn(program, "procedures_callnoreturn")

    validator.disableNotAvailableBlocksInWorkspace(["GirarGrados"])

    assertNotAvailable(assert, procedure)
    assertNotAvailable(assert, variable)
    assertNotAvailable(assert, procedureCall)
  });

  test('Should not disable procedure blocks when they are available', function (assert) {
    let procedure = Blockly.textToBlock(procedureDefinition)
    let variable = findBlockByTypeIn(procedure, "variables_get")
    let program = Blockly.textToBlock(procedureCallProgram)
    let procedureCall = findBlockByTypeIn(program, "procedures_callnoreturn")

    validator.disableNotAvailableBlocksInWorkspace(["GirarGrados", "Procedimiento"])

    assertNotDisabled(assert, procedure)
    assertNotDisabled(assert, variable)
    assertNotDisabled(assert, procedureCall)
  });

  let mathArithmeticProgram =
    `<block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="15" y="15">
      <statement name="program">
        <block type="GirarGrados">
          <value name="grados">
            <block type="math_arithmetic">
              <field name="OP">ADD</field>
              <value name="A">
                <block type="math_number">
                  <field name="NUM">90</field>
                </block>
              </value>
              <value name="B">
                <block type="math_number">
                  <field name="NUM">90</field>
                </block>
              </value>
            </block>
          </value>
        </block>
      </statement>
    </block>`

  test('Should works for original blocks with alias', function (assert) {
    let program = Blockly.textToBlock(mathArithmeticProgram)
    let mathArithmetic = findBlockByTypeIn(program, "math_arithmetic")

    validator.disableNotAvailableBlocksInWorkspace(["GirarGrados", "OpAritmetica"])

    assertNotDisabled(assert, mathArithmetic)
  });

});