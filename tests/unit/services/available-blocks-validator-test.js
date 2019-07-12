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

let linealProgram = [`
<block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="269" y="15">
    <statement name="program">
    <block type="MoverACasillaDerecha">
        <next>
        <block type="MoverACasillaIzquierda"></block>
        </next>
    </block>
    </statement>
</block>
`]

test('Should disable only not available blocks', function(assert) {
  let program = Blockly.textToBlock(linealProgram)
  let moveRight = findByType(program, "MoverACasillaDerecha")
  let moveLeft = findByType(program, "MoverACasillaIzquierda")
  validator.disableNotAvailableBlocksInWorkspace(["MoverACasillaDerecha"])

  assert.notOk(program.disabled)
  assert.notOk(moveRight.disabled)
  assert.ok(moveLeft.disabled)
  assert.equal(moveLeft.warning.getText(), "Este bloque no está disponible en esta actividad.") 

});

//TODO: Mover a un lugar más general (se repoite en blocks-gallery-test)
function findByType(rootBlock, type) {
  let block = rootBlock.type == type ? rootBlock : findChildren(rootBlock, type)
  if (block.onchange) block.onchange() // Force initialize
  return block
}
function findChildren(rootBlock, type) {
    return rootBlock.getChildren().find((b) => b.type == type) || findChildren(rootBlock.getChildren()[0], type)
}
