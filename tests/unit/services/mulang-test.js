import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { blocklyWorkspaceMock } from '../../helpers/mocks';

let pilasMulang = null

module('Unit | Service | pilas-mulang', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    blocklyWorkspaceMock()
    this.owner.lookup('service:blocksGallery').start()
    pilasMulang = this.owner.lookup('service:pilas-mulang')
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
  mulangTest('al_empezar_a_ejecutar', al_empezar_a_ejecutar, 
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
  mulangTest('repetir', repetir, 
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
  mulangTest('si', si, 
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
  mulangTest('sino', sino, 
    ifElse(
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
  mulangTest('hasta', hasta, 
    muWhile(
      application("TocandoFinal"),
      application("EncenderLuz"),
      application("MoverACasillaAbajo")
    )
  )

  let applicationWithParameter = `
  <block type="MoverA">
    <value name="direccion">
      <shadow type="required_value"></shadow>
      <block type="ParaLaDerecha"></block>
    </value>
  </block>
  `
  mulangTest('application with reference param', applicationWithParameter, 
    application("MoverA", reference("ParaLaDerecha"))
  )

  let applicationWithApplicationParameter = `
  <block type="DibujarLado">
    <value name="longitud">
      <shadow type="required_value"></shadow>
      <block type="OpAritmetica">
        <field name="OP">ADD</field>
        <value name="A">
          <shadow type="required_value"></shadow>
          <block type="math_number">
            <field name="NUM">10</field>
          </block>
        </value>
        <value name="B">
          <shadow type="required_value"></shadow>
          <block type="math_number">
            <field name="NUM">100</field>
          </block>
        </value>
      </block>
    </value>
  </block>
  `
  mulangTest('application with application param', applicationWithApplicationParameter, 
    application("DibujarLado", 
      application("OpAritmetica", 
        number(10),
        number(100)
      )
    )
  )

  let applicationWithTextParameter = `
  <block type="EscribirTextoDadoEnOtraCuadricula">
    <field name="texto">A</field>
  </block>
  `
  mulangTest('application with text param', applicationWithTextParameter, 
    application("EscribirTextoDadoEnOtraCuadricula", string("A"))
  )

  
  let procedureProgram = `
  <block type="procedures_defnoreturn">
    <field name="NAME">esquina</field>
    <statement name="STACK">
      <shadow type="required_statement"></shadow>
      <block type="DibujarLado">
        <value name="longitud">
          <shadow type="required_value"></shadow>
          <block type="math_number">
            <field name="NUM">100</field>
          </block>
        </value>
        <next>
          <block type="GirarGrados">
            <value name="grados">
              <shadow type="required_value"></shadow>
              <block type="math_number">
                <field name="NUM">90</field>
              </block>
            </value>
            <next>
              <block type="DibujarLado">
                <value name="longitud">
                  <shadow type="required_value"></shadow>
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
  </block>
  `
  mulangTest('procedure', procedureProgram, 
    procedure("esquina", [], 
      application("DibujarLado", number(100)),
      application("GirarGrados", number(90)),
      application("DibujarLado", number(100))
    )
  )

  let procedureWithParams = `
  <block type="procedures_defnoreturn">
    <mutation>
      <arg name="lado"></arg>
      <arg name="angulo"></arg>
    </mutation>
    <field name="NAME">esquina</field>
    <field name="ARG0">lado</field>
    <field name="ARG1">angulo</field>
    <statement name="STACK">
      <shadow type="required_statement"></shadow>
      <block type="DibujarLado">
        <value name="longitud">
          <shadow type="required_value"></shadow>
          <block type="variables_get">
            <mutation var="lado" parent=":2hb{1CYnYqL(S0v_ou"></mutation>
          </block>
        </value>
        <next>
          <block type="GirarGrados">
            <value name="grados">
              <shadow type="required_value"></shadow>
              <block type="variables_get">
                <mutation var="angulo" parent=":2hb{1CYnYqL(S0v_ou"></mutation>
              </block>
            </value>
            <next>
              <block type="DibujarLado">
                <value name="longitud">
                  <shadow type="required_value"></shadow>
                  <block type="variables_get">
                    <mutation var="lado" parent=":2hb{1CYnYqL(S0v_ou"></mutation>
                  </block>
                </value>
              </block>
            </next>
          </block>
        </next>
      </block>
    </statement>
  </block>
  `
  mulangTest('procedure with params', procedureWithParams, 
    procedure("esquina", ["lado", "angulo"],
      application("DibujarLado", reference("lado")),
      application("GirarGrados", reference("angulo")),
      application("DibujarLado", reference("lado"))
    )
  )

  let parameter = `
  <block type="GirarGrados">
    <value name="grados">
      <shadow type="required_value"></shadow>
      <block type="variables_get">
        <mutation var="angulo" parent=":2hb{1CYnYqL(S0v_ou"></mutation>
      </block>
    </value>
  </block>
  `
  mulangTest('parameter', parameter, 
    application("GirarGrados",
      reference("angulo")
    )
  )
});


function mulangTest(name, code, mulangAst) {
  test(`Should parse ${name}`, function(assert) {
    let ast = pilasMulang.parse(Blockly.textToBlock(code))
    assert.deepEqual(ast, mulangAst)
  })

  test(`Should analyze ${name}`, function(assert) {
    let result = pilasMulang.analyze(Blockly.textToBlock(code))
    assertMulangResult(assert, result);
  })
}

function assertMulangResult(assert, {expectationResults}) {
  assert.ok(expectationResults.every(({result}) => result))
}



// Builders
function procedure(name, params, ...seq) {
  return {
    tag: "Procedure",
    contents: [
      name,
      [
        equation(params, ...seq)
      ]
    ]
  }
}

function equation(params, ...seq) {
  return [
    params.map(name => variable(name)),
    body(...seq)
  ]
}

function variable(name) {
  return {
    tag: "VariablePattern",
    contents: name
  }
}

function body(...seq) {
  return {
    tag: "UnguardedBody",
    contents: sequence(...seq)
  }
}

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
      sequence(...seq),
      none()
    ]
  }
}

function ifElse(condition, seqTrue, seqFalse) {
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

function number(n) {
  return {
    tag: "MuNumber",
    contents: n
  }
}

function string(s) {
  return {
    tag: "MuString",
    contents: s
  }
}

function none() {
  return {
    tag: "None",
    contents: []
  }
}