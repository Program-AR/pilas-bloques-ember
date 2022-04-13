import QUnit, { module, test } from 'qunit'
import { procedure, entryPoint, sequence, rawSequence, reference, application, repeat, muIf, ifElse, muUntil, number, string, none } from '../../helpers/astFactories'
import { setupPBUnitTest, setUpTestWorkspace } from '../../helpers/utils'


let pilasMulang = null

module('Unit | Service | pilas-mulang | Parse', function (hooks) {
  setupPBUnitTest(hooks)
  setUpTestWorkspace(hooks)

  hooks.beforeEach(function () {
    QUnit.dump.maxDepth = 10 // For deepEqual assertion
    pilasMulang = this.owner.lookup('service:pilas-mulang')
  })

  /**
   * BLOCKS
   */

  let emptyProgram = `
  <block type="al_empezar_a_ejecutar">
    <statement name="program">
      <shadow type="required_statement"></shadow>
    </statement>
  </block>
  `
  mulangParseBlockTest('emptyProgram', emptyProgram,
    entryPoint(
      "al_empezar_a_ejecutar"
    )
  )

  let simpleProgram = `
  <block type="al_empezar_a_ejecutar">
    <statement name="program">
      <shadow type="required_statement"></shadow>
      <block type="MoverACasillaDerecha"></block>
    </statement>
  </block>
  `
  let simpleProgramAST =
    entryPoint(
      "al_empezar_a_ejecutar",
      application("MoverACasillaDerecha")
    )
  mulangParseBlockTest('simpleProgram', simpleProgram, simpleProgramAST)

  let al_empezar_a_ejecutar = `
  <block type="al_empezar_a_ejecutar">
    <statement name="program">
      <shadow type="required_statement"></shadow>
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
  mulangParseBlockTest('al_empezar_a_ejecutar', al_empezar_a_ejecutar,
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
  mulangParseBlockTest('repetir', repetir,
    repeat(
      number(10),
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
  mulangParseBlockTest('si', si,
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
  mulangParseBlockTest('sino', sino,
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
  mulangParseBlockTest('hasta', hasta,
    muUntil(
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
  mulangParseBlockTest('application with reference param', applicationWithParameter,
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
  mulangParseBlockTest('application with application param', applicationWithApplicationParameter,
    application("DibujarLado",
      application("ADD",
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
  mulangParseBlockTest('application with text param', applicationWithTextParameter,
    application("EscribirTextoDadoEnOtraCuadricula", string("A"))
  )

  let operator = `
  <block type="Si">
    <value name="condition">
      <shadow type="required_value"></shadow>
      <block type="OpComparacion">
        <field name="OP">EQ</field>
        <value name="A">
          <shadow type="required_value"></shadow>
          <block type="Numero">
            <field name="NUM">0</field>
          </block>
        </value>
        <value name="B">
          <shadow type="required_value"></shadow>
          <block type="Numero">
            <field name="NUM">0</field>
          </block>
        </value>
      </block>
    </value>
    <statement name="block">
      <shadow type="required_statement"></shadow>
      <block type="MoverACasillaDerecha">
        <next>
          <block type="PrenderFogata"></block>
        </next>
      </block>
    </statement>
  </block>
  `
  mulangParseBlockTest('operator', operator,
    muIf(
      application("EQ",
        number(0),
        number(0)
      ),
      application("MoverACasillaDerecha"),
      application("PrenderFogata")
    )
  )


  let procedureDefinition = `
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
  let procedureAST =
    procedure("esquina", [],
      application("DibujarLado", number(100)),
      application("GirarGrados", number(90)),
      application("DibujarLado", number(100))
    )
  mulangParseBlockTest('procedure', procedureDefinition, procedureAST)

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
  mulangParseBlockTest('procedure with params', procedureWithParams,
    procedure("esquina", ["lado", "angulo"],
      application("DibujarLado", reference("lado")),
      application("GirarGrados", reference("angulo")),
      application("DibujarLado", reference("lado"))
    )
  )

  let procedureCall = `
  <block type="procedures_callnoreturn">
    <mutation name="Hacer algo"></mutation>
  </block>
  `
  mulangParseBlockTest('procedureCall', procedureCall,
    application("Hacer algo")
  )

  let procedureCallWithParam = `
  <block type="procedures_callnoreturn" disabled="true">
    <mutation name="Hacer algo2">
      <arg name="parámetro 1"></arg>
    </mutation>
    <value name="ARG0">
      <shadow type="required_value"></shadow>
      <block type="math_number">
        <field name="NUM">90</field>
      </block>
    </value>
  </block>
  `
  mulangParseBlockTest('procedureCallWithParam', procedureCallWithParam,
    application("Hacer algo2", number(90))
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
  mulangParseBlockTest('parameter', parameter,
    application("GirarGrados",
      reference("angulo")
    )
  )

  let alias = `
  <block type="si">
    <value name="condition">
      <shadow type="required_value"></shadow>
    </value>
    <statement name="block">
      <shadow type="required_statement"></shadow>
    </statement>
  </block>
  `
  mulangParseBlockTest('alias', alias,
    muIf(none())
  )

  /**
   * WORKSPACE
   */
  mulangParseWorkspaceTest(`one block`, [simpleProgram], [simpleProgramAST])

  mulangParseWorkspaceTest(`every blocks`, [simpleProgram, procedureDefinition], [simpleProgramAST, procedureAST])

  let evilSolution = [`
  <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <shadow type="required_statement"></shadow>
      <block type="repetir">
        <value name="count">
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
            </value>
          </block>
        </value>
        <statement name="block">
          <shadow type="required_statement"></shadow>
        </statement>
        <next>
          <block type="procedures_callnoreturn">
            <mutation name="Hacer algo2"></mutation>
          </block>
        </next>
      </block>
    </statement>
  </block>
  `, `
  <block type="procedures_defnoreturn" x="385" y="21">
    <mutation>
      <arg name="parámetro 1"></arg>
    </mutation>
    <field name="NAME">Hacer algo</field>
    <field name="ARG0">parámetro 1</field>
    <statement name="STACK">
      <block type="DibujarLado">
        <value name="longitud">
          <shadow type="required_value"></shadow>
        </value>
        <next>
          <block type="procedures_callnoreturn">
            <mutation name="Hacer algo">
              <arg name="parámetro 1"></arg>
            </mutation>
            <value name="ARG0">
              <shadow type="required_value"></shadow>
            </value>
          </block>
        </next>
      </block>
    </statement>
  </block>
  `, `
  <block type="procedures_defnoreturn" x="709" y="10">
    <field name="NAME">Hacer algo2</field>
    <statement name="STACK">
      <block type="GirarGrados">
        <value name="grados">
          <shadow type="required_value"></shadow>
          <block type="variables_get" disabled="true">
            <mutation var="parámetro 1" parent="hZ6TYHUC~Lmbq+5encV["></mutation>
          </block>
        </value>
        <next>
          <block type="SiNo" disabled="true" x="394" y="141">
            <value name="condition">
              <shadow type="required_value"></shadow>
            </value>
            <statement name="block1">
              <shadow type="required_statement"></shadow>
            </statement>
            <statement name="block2">
              <shadow type="required_statement"></shadow>
            </statement>
          </block>
        </next>
      </block>
    </statement>
  </block>
  `, `
  <block type="variables_get" disabled="true" x="358" y="216">
    <mutation var="parámetro 1" parent="hZ6TYHUC~Lmbq+5encV["></mutation>
  </block>
  `, `
  <block type="math_number" disabled="true" x="609" y="218">
    <field name="NUM">100</field>
  </block>
  `, `
  <block type="SaltarHaciaAdelante" disabled="true" x="156" y="292">
    <value name="longitud">
      <shadow type="required_value"></shadow>
    </value>
  </block>
  `]
  mulangParseWorkspaceTest(`errors`, evilSolution, [
    entryPoint('al_empezar_a_ejecutar',
      repeat(application('ADD', number(10), none()), none()),
      application('Hacer algo2')
    ),
    procedure('Hacer algo', ['parámetro 1'],
      application('DibujarLado', none()),
      application('Hacer algo', none())
    ),
    procedure('Hacer algo2', [],
      application('GirarGrados', reference('parámetro 1')),
      ifElse(none(), none(), none())
    ),
    reference('parámetro 1'),
    number(100),
    application('SaltarHaciaAdelante', none())
  ])

  let completeSolution = [`
  <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="0" y="0">
    <statement name="program">
      <block type="procedures_callnoreturn" id="46">
        <mutation name="Prender compus hacia">
          <arg name="direccion"></arg>
        </mutation>
        <value name="ARG0">
          <block type="ParaLaDerecha" id="61"></block>
        </value>
        <next>
          <block type="procedures_callnoreturn" id="64">
            <mutation name="Prender compus hacia">
              <arg name="direccion"></arg>
            </mutation>
            <value name="ARG0">
              <block type="ParaAbajo" id="72"></block>
            </value>
            <next>
              <block type="procedures_callnoreturn" id="77">
                <mutation name="Prender compus hacia">
                  <arg name="direccion"></arg>
                </mutation>
                <value name="ARG0">
                  <block type="ParaLaIzquierda" id="83"></block>
                </value>
                <next>
                  <block type="procedures_callnoreturn" id="92">
                    <mutation name="Prender compus hacia">
                      <arg name="direccion"></arg>
                    </mutation>
                    <value name="ARG0">
                      <block type="ParaArriba" id="89"></block>
                    </value>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </next>
      </block>
    </statement>
  </block>
  `, `
  <block type="procedures_defnoreturn" id="18" x="7" y="207">
    <mutation>
      <arg name="direccion"></arg>
    </mutation>
    <field name="NAME">Prender compus hacia</field>
    <comment pinned="false" h="80" w="160">Describe esta función...</comment>
    <statement name="STACK">
      <block type="MoverA" id="95">
        <value name="direccion">
          <block type="param_get" id="99">
            <field name="VAR">direccion</field>
          </block>
        </value>
        <next>
          <block type="hasta" id="29">
            <value name="condition">
              <block type="EstoyEnEsquina" id="31"></block>
            </value>
            <statement name="block">
              <block type="PrenderComputadora" id="41">
                <next>
                  <block type="MoverA" id="34">
                    <value name="direccion">
                      <block type="param_get" id="38">
                        <field name="VAR">direccion</field>
                      </block>
                    </value>
                  </block>
                </next>
              </block>
            </statement>
            <next>
              <block type="procedures_callnoreturn">
                <mutation name="Hacer algo"></mutation>
              </block>
            </next>
          </block>
        </next>
      </block>
    </statement>
  </block>
  `, `
  <block type="procedures_defnoreturn" x="168" y="252">
    <field name="NAME">Hacer algo</field>
    <statement name="STACK">
      <block type="repetir">
        <value name="count">
          <shadow type="required_value"></shadow>
          <block type="math_number">
            <field name="NUM">10</field>
          </block>
        </value>
        <statement name="block">
          <shadow type="required_statement"></shadow>
          <block type="SiNo">
            <value name="condition">
              <shadow type="required_value"></shadow>
              <block type="TocandoBanana"></block>
            </value>
            <statement name="block1">
              <shadow type="required_statement"></shadow>
              <block type="ComerBanana"></block>
            </statement>
            <statement name="block2">
              <shadow type="required_statement"></shadow>
              <block type="ComerManzana"></block>
            </statement>
          </block>
        </statement>
      </block>
    </statement>
  </block>
  `]
  mulangParseWorkspaceTest(`complete solution`, completeSolution, [
    entryPoint('al_empezar_a_ejecutar',
      application('Prender compus hacia', reference('ParaLaDerecha')),
      application('Prender compus hacia', reference('ParaAbajo')),
      application('Prender compus hacia', reference('ParaLaIzquierda')),
      application('Prender compus hacia', reference('ParaArriba')),
    ),
    procedure('Prender compus hacia', ['direccion'],
      application('MoverA', reference('direccion')),
      muUntil(application('EstoyEnEsquina'),
        application('PrenderComputadora'),
        application('MoverA', reference('direccion')),
      ),
      application('Hacer algo'),
    ),
    procedure('Hacer algo', [],
      repeat(number(10),
        ifElse(application('TocandoBanana'),
          application('ComerBanana'),
          application('ComerManzana')
        )
      )
    )
  ])

})


function mulangParseBlockTest(name, code, expectedAst) {
  test(`Should parse ${name} block`, function (assert) {
    let ast = pilasMulang.parse(Blockly.textToBlock(code))
    assert.deepEqual(ast, expectedAst)
  })
}

function mulangParseWorkspaceTest(description, definitions, expectedAst) {
  test(`Should parse workspace with ${description}`, function (assert) {
    definitions.forEach(Blockly.textToBlock)
    let ast = pilasMulang.parseAll(Blockly.mainWorkspace)
    assert.deepEqual(ast, rawSequence(expectedAst))
  })
}

