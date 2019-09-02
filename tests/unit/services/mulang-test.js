import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { blocklyWorkspaceMock } from '../../helpers/mocks';

module('Unit | Service | pilas-mulang', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    blocklyWorkspaceMock()
    this.owner.lookup('service:blocksGallery').start()
  });


  /////////// PARSE ////////////

  function parserTest(name, code, mulangAst) {
    test(`Should parse ${name}`, function(assert) {
      let pilasMulang = this.owner.lookup('service:pilas-mulang')
      let result = pilasMulang.parse(Blockly.textToBlock(code))
      assert.deepEqual(result, mulangAst)
    });  
  }


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
  parserTest('al_empezar_a_ejecutar', al_empezar_a_ejecutar, 
    entryPoint(
      "al_empezar_a_ejecutar",
      application("MoverACasillaDerecha"),
      application("MoverACasillaIzquierda"),
      application("MoverACasillaDerecha")
    )

  )

  let repetir = `
  <block type="repetir">
    <value name="count">
      <block type="math_number">
        <field name="NUM">10</field>
      </block>
    </value>
    <statement name="block">
      <block type="MoverACasillaIzquierda">
        <next>
          <block type="MoverACasillaDerecha"></block>
        </next>
      </block>
    </statement>
  </block>
  `
  parserTest('repetir', repetir, 
    repeat(
      10,
      application("MoverACasillaIzquierda"),
      application("MoverACasillaDerecha")
    )
  )

  let si = `
  <block type="Si">
    <value name="condition">
      <block type="HayChurrasco"></block>
    </value>
    <statement name="block">
      <block type="MoverACasillaDerecha">
        <next>
          <block type="ComerChurrasco"></block>
        </next>
      </block>
    </statement>
  </block>
  `
  parserTest('si', si, 
    muIf(
      application("HayChurrasco"),
      application("MoverACasillaDerecha"),
      application("ComerChurrasco")
    )
  )





  /////////// ANALYZE ////////////


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
function entryPoint(name, ...seq) {
  return {
    tag: "EntryPoint",
    contents: [
      name,
      sequence(seq)
    ]
  }
}

function sequence(seq) {
  return {
    tag: "Sequence",
    contents: seq
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

function repeat(count, ...seq) {
  return {
    tag: "Repeat",
    contents: [
      number(count),
      sequence(seq)
    ]
  }
}

function muIf(condition, ...seq) {
  return {
    tag: "If",
    contents: [
      condition,
      sequence(seq)
    ]
  }
}

function number(number) {
  return {
    tag: "MuNumber",
    contents: number
  }
}
