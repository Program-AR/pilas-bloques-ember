import { moduleFor, test } from 'ember-qunit';
import { blocklyWorkspaceMock } from '../../helpers/mocks';

var validator

moduleFor('service:available-blocks-validator', 'Unit | Service | available-blocks-validator', { 
  needs: ['service:blocksGallery', 'service:blockly'],
  setup() {
    blocklyWorkspaceMock()
    validator = this.subject()
    
    this.container.lookup('service:blocksGallery').start()
  }
});

let simpleProgram = `
<block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="269" y="15">
    <statement name="program">
    <block type="MoverACasillaDerecha">
        <next>
        <block type="MoverACasillaIzquierda"></block>
        </next>
    </block>
    </statement>
</block>
`

test('Should not disable global available blocks', function(assert) {
  let program = Blockly.textToBlock(simpleProgram)

  validator.disableNotAvailableBlocksInWorkspace([])

  assert.notOk(program.disabled)
});

test('Should disable not available activity blocks', function(assert) {
  let program = Blockly.textToBlock(simpleProgram)
  let moveLeft = findBlockByTypeIn(program, "MoverACasillaIzquierda")

  validator.disableNotAvailableBlocksInWorkspace(["MoverACasillaDerecha"])

  assertDisabled(assert, moveLeft)
});

test('Should not disable available activity blocks', function(assert) {
  let program = Blockly.textToBlock(simpleProgram)
  let moveRight = findBlockByTypeIn(program, "MoverACasillaDerecha")

  validator.disableNotAvailableBlocksInWorkspace(["MoverACasillaDerecha"])

  assert.notOk(moveRight.disabled)
});

let procedureDefinition = `
<block type="procedures_defnoreturn" id="whpKBVIV.;:t%=8XN+E_" x="778" y="185">
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
</block>
`

let procedureCallProgram = `
<block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="0" y="0">
<statement name="program">
  <block type="procedures_callnoreturn">
    <mutation name="Hacer algo"></mutation>
  </block>
</statement>
</block>
`

test('Should disable procedure blocks when they are not available', function(assert) {
  let procedure = Blockly.textToBlock(procedureDefinition)
  let variable = findBlockByTypeIn(procedure, "variables_get")
  let program = Blockly.textToBlock(procedureCallProgram)
  let procedureCall = findBlockByTypeIn(program, "procedures_callnoreturn")

  validator.disableNotAvailableBlocksInWorkspace(["GirarGrados"])
  
  assertDisabled(assert, procedure)
  assertDisabled(assert, variable)
  assertDisabled(assert, procedureCall)
});

test('Should not disable procedure blocks when they are not available', function(assert) {
  let procedure = Blockly.textToBlock(procedureDefinition)
  let variable = findBlockByTypeIn(procedure, "variables_get")
  let program = Blockly.textToBlock(procedureCallProgram)
  let procedureCall = findBlockByTypeIn(program, "procedures_callnoreturn")

  validator.disableNotAvailableBlocksInWorkspace(["GirarGrados", "Procedimiento"])

  assert.notOk(procedure.disabled)
  assert.notOk(variable.disabled)
  assert.notOk(procedureCall.disabled)
});

let mathArithmeticProgram = `
<block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="15" y="15">
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
</block>
`

test('Should works for original blocks with alias', function(assert) {
  let program = Blockly.textToBlock(mathArithmeticProgram)
  let mathArithmetic = findBlockByTypeIn(program, "math_arithmetic")

  validator.disableNotAvailableBlocksInWorkspace(["GirarGrados", "OpAritmetica"])

  assert.notOk(mathArithmetic.disabled)
});


//TODO: Mover a un lugar más general (se repoite en blocks-gallery-test)
function findBlockByTypeIn(rootBlock, type) {
  let block = rootBlock.type == type ? rootBlock : findChildren(rootBlock, type)
  if (block.onchange) block.onchange() // Force initialize
  return block
}
function findChildren(rootBlock, type) {
    return rootBlock.getChildren().find((b) => b.type == type) || findChildren(rootBlock.getChildren()[0], type)
}


function assertDisabled(assert, block) {
  assert.ok(block.disabled)
  assert.equal(block.warning.getText(), "Este bloque no está disponible en esta actividad.") 
}