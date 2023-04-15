import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { blocklyWorkspaceMock } from '../../helpers/mocks';
import { setUpTestLocale, findBlockByTypeIn } from '../../helpers/utils';

var highlighter;

module('Unit | Service | highlighter', function (hooks) {
  setupTest(hooks);
  setUpTestLocale(hooks)

  hooks.beforeEach(function () {
    highlighter = this.owner.lookup('service:highlighter')
    this.blockly = this.owner.lookup('service:blockly');
    highlighter.workspace = blocklyWorkspaceMock()
    highlighter.clear()

    this.owner.lookup('service:blocksGallery').start()
  });

  let linealProgram = [`
  <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="269" y="15">
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
  `]

  test('Should not highlight program block', function (assert) {
    loadProgramAndSendSteps(1, linealProgram)
    assertHighlight(assert, [])
  });

  test('On lineal program should highlight only current block', function (assert) {
    loadProgramAndSendSteps(3, linealProgram)
    assertHighlight(assert, ['MoverACasillaIzquierda'])
  });

  test('At finish, last block stay highlighted', function (assert) {
    loadProgramAndSendSteps(Infinity, linealProgram)
    assertHighlight(assert, ['MoverACasillaDerecha'])
  });

  let repetitionProgram = [`
  <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="269" y="15">
      <statement name="program">
      <block type="MoverACasillaArriba">
          <next>
          <block type="repetir">
              <value name="count">
              <block type="math_number">
                  <field name="NUM">1</field>
              </block>
              </value>
              <statement name="block">
              <block type="MoverACasillaIzquierda">
                  <next>
                  <block type="MoverACasillaDerecha"></block>
                  </next>
              </block>
              </statement>
              <next>
              <block type="MoverACasillaAbajo"></block>
              </next>
          </block>
          </next>
      </block>
      </statement>
  </block>
  `]

  test('Should highlight repetition block', function (assert) {
    loadProgramAndSendSteps(3, repetitionProgram)
    assertHighlight(assert, ['repetir'])
  });

  test('When enter on repetition block should only highlight current block', function (assert) {
    loadProgramAndSendSteps(5, repetitionProgram)
    assertHighlight(assert, ['MoverACasillaDerecha'])
  });

  test('When go out repetition block should only highlight next block', function (assert) {
    loadProgramAndSendSteps(6, repetitionProgram)
    assertHighlight(assert, ['MoverACasillaAbajo'])
  });


  let alternativeProgram = [`
  <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="269" y="15">
      <statement name="program">
      <block type="MoverACasillaAbajo">
          <next>
          <block type="si">
              <value name="condition">
              <block type="HayTomate"></block>
              </value>
              <statement name="block">
              <block type="MoverACasillaArriba">
                  <next>
                  <block type="MoverACasillaAbajo"></block>
                  </next>
              </block>
              </statement>
              <next>
              <block type="MoverACasillaAbajo"></block>
              </next>
          </block>
          </next>
      </block>
      </statement>
  </block>
  `]

  test('Should highlight alternative block', function (assert) {
    loadProgramAndSendSteps(3, alternativeProgram)
    assertHighlight(assert, ['si'])
  });

  test('When enter on alternative block should only highlight current block', function (assert) {
    loadProgramAndSendSteps(5, alternativeProgram)
    assertHighlight(assert, ['MoverACasillaAbajo'])
  });

  test('When go out alternative block should only highlight next block', function (assert) {
    loadProgramAndSendSteps(6, alternativeProgram)
    assertHighlight(assert, ['MoverACasillaAbajo'])
  });

  let programWithProcedures = [`
  <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="15" y="15">
      <statement name="program">
        <block type="DibujarLado">
          <value name="longitud">
            <block type="math_number">
              <field name="NUM">100</field>
            </block>
          </value>
          <next>
            <block type="procedures_callnoreturn">
              <mutation name="procedimiento general"></mutation>
              <next>
                <block type="DibujarLado">
                  <value name="longitud">
                    <block type="math_number">
                      <field name="NUM">100</field>
                    </block>
                  </value>
                </block>
              </next>
            </block>
          </next>
        </block>
      </statement>
  </block>`,
    `<block type="procedures_defnoreturn" x="46" y="247">
      <field name="NAME">procedimiento general</field>
      <statement name="STACK">
        <block type="GirarGrados">
          <value name="grados">
            <block type="math_number">
              <field name="NUM">90</field>
            </block>
          </value>
          <next>
            <block type="procedures_callnoreturn">
              <mutation name="procedimiento especifico"></mutation>
              <next>
                <block type="GirarGrados">
                  <value name="grados">
                    <block type="math_number">
                      <field name="NUM">90</field>
                    </block>
                  </value>
                </block>
              </next>
            </block>
          </next>
        </block>
      </statement>
  </block>`,
    `<block type="procedures_defnoreturn" x="62" y="421">
      <field name="NAME">procedimiento especifico</field>
      <statement name="STACK">
        <block type="SaltarHaciaAdelante">
          <value name="longitud">
            <block type="math_number">
              <field name="NUM">100</field>
            </block>
          </value>
          <next>
            <block type="SaltarHaciaAdelante">
              <value name="longitud">
                <block type="math_number">
                  <field name="NUM">100</field>
                </block>
              </value>
            </block>
          </next>
        </block>
      </statement>
  </block>
  `]

  test('Should not highlight procedure definition block', function (assert) {
    loadProgramAndSendSteps(4, programWithProcedures)
    assertHighlight(assert, ['procedures_callnoreturn'])
  });

  test('When enter on procedure block should highlight procedure call and current block', function (assert) {
    loadProgramAndSendSteps(5, programWithProcedures)
    assertHighlight(assert, ['procedures_callnoreturn', 'GirarGrados'])
  });

  test('Step on procedure block should highlight procedure call and go lineal', function (assert) {
    loadProgramAndSendSteps(6, programWithProcedures)
    assertHighlight(assert, ['procedures_callnoreturn', 'procedures_callnoreturn'])
  });

  test('Should highlight all procedure calls involve in current stack', function (assert) {
    loadProgramAndSendSteps(8, programWithProcedures)
    assertHighlight(assert, ['procedures_callnoreturn', 'procedures_callnoreturn', 'SaltarHaciaAdelante'])
  });

  test('When go out procedure block should only highlight next block', function (assert) {
    loadProgramAndSendSteps(11, programWithProcedures)
    assertHighlight(assert, ['DibujarLado'])
  });


  let programFinishInProcedure = [`
  <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="15" y="15">
      <statement name="program">
        <block type="DibujarLado">
          <value name="longitud">
            <block type="math_number">
              <field name="NUM">100</field>
            </block>
          </value>
          <next>
            <block type="procedures_callnoreturn">
              <mutation name="procedimiento general"></mutation>
            </block>
          </next>
        </block>
      </statement>
  </block>`,
    `<block type="procedures_defnoreturn" x="46" y="247">
      <field name="NAME">procedimiento general</field>
      <comment pinned="false" h="80" w="160">Describe esta función...</comment>
      <statement name="STACK">
        <block type="GirarGrados">
          <value name="grados">
            <block type="math_number">
              <field name="NUM">90</field>
            </block>
          </value>
        </block>
      </statement>
  </block>`
  ]

  test('When program finishes with procedure call should highlight both blocks', function (assert) {
    loadProgramAndSendSteps(Infinity, programFinishInProcedure)
    assertHighlight(assert, ['procedures_callnoreturn', 'GirarGrados'])
  });


  let programWithArgs = [`
  <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="procedures_callnoreturn">
        <mutation name="procedimiento con params">
          <arg name="parámetro 1"></arg>
          <arg name="parámetro 2"></arg>
        </mutation>
        <value name="ARG0">
          <block type="math_number">
            <field name="NUM">90</field>
          </block>
        </value>
        <value name="ARG1">
          <block type="math_number">
            <field name="NUM">100</field>
          </block>
        </value>
        <next>
          <block type="procedures_callnoreturn">
            <mutation name="procedimiento con params">
              <arg name="parámetro 1"></arg>
              <arg name="parámetro 2"></arg>
            </mutation>
            <value name="ARG0">
              <block type="math_number">
                <field name="NUM">90</field>
              </block>
            </value>
            <value name="ARG1">
              <block type="math_number">
                <field name="NUM">100</field>
              </block>
            </value>
            <next>
              <block type="DibujarLado">
                <value name="longitud">
                  <block type="math_number">
                    <field name="NUM">10</field>
                  </block>
                </value>
              </block>
            </next>
          </block>
        </next>
      </block>
    </statement>
  </block>`,
    `<block type="procedures_defnoreturn" id="XuB4wFa*5LTziQzQfJ_^" x="304" y="153">
      <mutation>
        <arg name="parámetro 1"></arg>
        <arg name="parámetro 2"></arg>
      </mutation>
      <field name="NAME">procedimiento con params</field>
      <field name="ARG0">parámetro 1</field>
      <field name="ARG1">parámetro 2</field>
      <statement name="STACK">
        <block type="GirarGrados">
          <value name="grados">
            <block type="variables_get">
              <mutation var="parámetro 1" parent="XuB4wFa*5LTziQzQfJ_^"></mutation>
            </block>
          </value>
          <next>
            <block type="DibujarLado">
              <value name="longitud">
                <block type="variables_get">
                  <mutation var="parámetro 2" parent="XuB4wFa*5LTziQzQfJ_^"></mutation>
                </block>
              </value>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`
  ]

  test('When procedure with args is executed should show parameter values', function (assert) {
    loadProgramAndSendSteps(4, programWithArgs)
    assertHighlight(assert, ['procedures_callnoreturn', 'GirarGrados'])
    assert.deepEqual(highlighter.highlightedProcedures[0].getVars(), ['parámetro 1 = 90', 'parámetro 2 = 100'])
  });

  test('When procedure with args is executed should show parameter values in parameter blocks', function (assert) {
    loadProgramAndSendSteps(4, programWithArgs)
    assertHighlight(assert, ['procedures_callnoreturn', 'GirarGrados'])
    const paramBlock = findBlockByTypeIn(highlighter.highlightedProcedures[0], 'variables_get')
    assert.deepEqual(paramBlock.getFieldValue("VAR"), 'parámetro 1 = 90')
    //TODO: Test parámetro 2
  });

  test('When procedure with args is executed should not show parameter values in procedure call blocks', function (assert) {
    loadProgramAndSendSteps(4, programWithArgs)
    assertHighlight(assert, ['procedures_callnoreturn', 'GirarGrados'])
    const currentProcedureCall = highlighter.blocks[0]
    assert.deepEqual(currentProcedureCall.getFieldValue("ARGNAME0"), 'parámetro 1')
    assert.deepEqual(currentProcedureCall.getFieldValue("ARGNAME1"), 'parámetro 2')
    const nextProcedureCall = currentProcedureCall.getNextBlock()
    assert.deepEqual(nextProcedureCall.getFieldValue("ARGNAME0"), 'parámetro 1')
    assert.deepEqual(nextProcedureCall.getFieldValue("ARGNAME1"), 'parámetro 2')
  });


  test('When procedure with args finish execution should not show parameter values', function (assert) {
    loadProgramAndSendSteps(Infinity, programWithArgs)
    assertHighlight(assert, ['DibujarLado'])
    const procedureBlock = Blockly.getMainWorkspace().getBlockById('XuB4wFa*5LTziQzQfJ_^')
    assert.deepEqual(procedureBlock.getVars(), ['parámetro 1', 'parámetro 2'])
  });

  test('When procedure with args finish execution should not show parameter values in parameter blocks', function (assert) {
    loadProgramAndSendSteps(Infinity, programWithArgs)
    assertHighlight(assert, ['DibujarLado'])
    const procedureBlock = Blockly.getMainWorkspace().getBlockById('XuB4wFa*5LTziQzQfJ_^')
    const paramBlock = findBlockByTypeIn(procedureBlock, 'variables_get')
    assert.deepEqual(paramBlock.getFieldValue("VAR"), 'parámetro 1')
    //TODO: Test parámetro 2
  });

  test('When procedure with args finish execution should not show parameter values in procedure call blocks', function (assert) {
    loadProgramAndSendSteps(Infinity, programWithArgs)
    assertHighlight(assert, ['DibujarLado'])
    const procedureCallBlock = Blockly.getMainWorkspace().getTopBlocks()[0].getChildren()[0]
    assert.deepEqual(procedureCallBlock.getFieldValue("ARGNAME0"), 'parámetro 1')
    assert.deepEqual(procedureCallBlock.getFieldValue("ARGNAME1"), 'parámetro 2')
    const nextProcedureCall = procedureCallBlock.getNextBlock()
    assert.deepEqual(nextProcedureCall.getFieldValue("ARGNAME0"), 'parámetro 1')
    assert.deepEqual(nextProcedureCall.getFieldValue("ARGNAME1"), 'parámetro 2')
  });



  function loadProgramAndSendSteps(steps, blocksAsText) {
    let definitionIndex = 0
    let definitionBlocks = blocksAsText
      .map(Blockly.textToBlock)

    let ignoredBlockTypes = ["math_number", "HayTomate"]
    // Esta ejecución solamente RECORRE los bloques. ¡No tiene en cuenta la lógica!
    // En los procedure_call ejecuta el próximo bloque de definición
    function doStep(block) {
      if (steps === 0 || ignoredBlockTypes.includes(block.type)) return
      highlighter.step(block.id)
      steps--
      if (block.defType_) { // procedure_call
        definitionIndex++
        doStep(definitionBlocks[definitionIndex])
        definitionIndex--
      }
      block.getChildren().forEach(doStep)
    }
    doStep(definitionBlocks[definitionIndex])
  }

  //TODO: Config assert?
  function assertHighlight(assert, expectedTypes) {
    assertLength(assert, highlighter.blocks, expectedTypes.length)
    assertTypes(assert, highlighter.blocks, expectedTypes)
  }

  function assertTypes(assert, blocks, expectedTypes) {
    assert.deepEqual(blocks.map((it) => it.type), expectedTypes)
  }

  //TODO: Mover a un lugar más general
  function assertLength(assert, list, count) {
    assert.deepEqual(list.length, count)
  }
});