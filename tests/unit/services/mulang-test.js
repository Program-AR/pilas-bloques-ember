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

  let sino = `
  <block type="SiNo">
    <value name="condition">
      <shadow type="required_value"></shadow>
      <block type="HayTomate"></block>
    </value>
    <statement name="block1">
      <shadow type="required_statement"></shadow>
      <block type="AgarrarTomate">
        <next>
          <block type="MoverACasillaIzquierda"></block>
        </next>
      </block>
    </statement>
    <statement name="block2">
      <shadow type="required_statement"></shadow>
      <block type="AgarrarLechuga">
        <next>
          <block type="MoverACasillaIzquierda"></block>
        </next>
      </block>
    </statement>
  </block>
  `
  parserTest('sino', sino, 
    IfElse(
      application("HayTomate"),
      sequence(
        application("AgarrarTomate"),
        application("MoverACasillaIzquierda")
      ),
      sequence(
        application("AgarrarLechuga"),
        application("MoverACasillaIzquierda")
      )
    )
  )

  let hasta = `
  <block type="Hasta">
    <value name="condition">
      <shadow type="required_value"></shadow>
      <block type="TocandoFinal"></block>
    </value>
    <statement name="block">
      <shadow type="required_statement"></shadow>
      <block type="EncenderLuz">
        <next>
          <block type="MoverACasillaAbajo"></block>
        </next>
      </block>
    </statement>
  </block>
  `
  parserTest('hasta', hasta, 
    muWhile(
      application("TocandoFinal"),
      application("EncenderLuz"),
      application("MoverACasillaAbajo")
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
      sequence(...seq)
    ]
  }
}

function sequence(...seq) {
  return {
    tag: "Sequence",
    contents: seq
  }
}

function reference(name) {
  return {
    tag: "Reference",
    contents: name
  }
}

function application(name, ...params) {
  return {
    tag: "Application",
    contents: [
      reference(name),
      params
    ]
  }
}

function repeat(count, ...seq) {
  return {
    tag: "Repeat",
    contents: [
      number(count),
      sequence(...seq)
    ]
  }
}

function muIf(condition, ...seq) {
  return {
    tag: "If",
    contents: [
      condition,
      sequence(...seq)
    ]
  }
}

function IfElse(condition, seqTrue, seqFalse) {
  return {
    tag: "If",
    contents: [
      condition,
      seqTrue,
      seqFalse
    ]
  }
}

function muWhile(condition, ...seq) {
  return {
    tag: "While",
    contents: [
      condition,
      sequence(...seq)
    ]
  }
}

function number(number) {
  return {
    tag: "MuNumber",
    contents: number
  }
}
