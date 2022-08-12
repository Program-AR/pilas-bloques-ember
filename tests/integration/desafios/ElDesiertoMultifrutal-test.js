import { moduloActividad, actividadTest } from '../../helpers/actividadTest';

const nombre = "ElDesiertoMultiFrutal";

moduloActividad(nombre, () => {

  actividadTest(nombre, {
    solucion: `<xml xmlns=\"http://www.w3.org/1999/xhtml\">
    <variables></variables>
    <block type=\"al_empezar_a_ejecutar\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"15\" y=\"15\">
      <statement name=\"program\">
        <shadow type=\"required_statement\"></shadow>
        <block type=\"procedures_callnoreturn\">
          <mutation name=\"Comer frutas en fila\"></mutation>
          <next>
            <block type=\"MoverACasillaAbajo\">
              <next>
                <block type=\"MoverACasillaAbajo\">
                  <next>
                    <block type=\"procedures_callnoreturn\">
                      <mutation name=\"Comer frutas en fila\"></mutation>
                      <next>
                        <block type=\"MoverACasillaAbajo\">
                          <next>
                            <block type=\"MoverACasillaAbajo\">
                              <next>
                                <block type=\"MoverACasillaAbajo\">
                                  <next>
                                    <block type=\"procedures_callnoreturn\">
                                      <mutation name=\"Comer frutas en fila\"></mutation>
                                    </block>
                                  </next>
                                </block>
                              </next>
                            </block>
                          </next>
                        </block>
                      </next>
                    </block>
                  </next>
                </block>
              </next>
            </block>
          </next>
        </block>
      </statement>
    </block>
    <block type=\"procedures_defnoreturn\" x=\"-346\" y=\"114\">
      <field name=\"NAME\">Comer frutas en fila</field>
      <statement name=\"STACK\">
        <block type=\"repetir\">
          <value name=\"count\">
            <shadow type=\"required_value\"></shadow>
            <block type=\"math_number\">
              <field name=\"NUM\">4</field>
            </block>
          </value>
          <statement name=\"block\">
            <shadow type=\"required_statement\"></shadow>
            <block type=\"MoverACasillaDerecha\">
              <next>
                <block type=\"procedures_callnoreturn\">
                  <mutation name=\"Comer fruta que haya\"></mutation>
                </block>
              </next>
            </block>
          </statement>
          <next>
            <block type=\"repetir\">
              <value name=\"count\">
                <shadow type=\"required_value\"></shadow>
                <block type=\"math_number\">
                  <field name=\"NUM\">4</field>
                </block>
              </value>
              <statement name=\"block\">
                <shadow type=\"required_statement\"></shadow>
                <block type=\"MoverACasillaIzquierda\"></block>
              </statement>
            </block>
          </next>
        </block>
      </statement>
    </block>
    <block type=\"procedures_defnoreturn\" x=\"29\" y=\"330\">
      <field name=\"NAME\">Comer fruta que haya</field>
      <statement name=\"STACK\">
        <block type=\"Si\">
          <value name=\"condition\">
            <shadow type=\"required_value\"></shadow>
            <block type=\"TocandoNaranja\"></block>
          </value>
          <statement name=\"block\">
            <shadow type=\"required_statement\"></shadow>
            <block type=\"ComerNaranja\"></block>
          </statement>
          <next>
            <block type=\"Si\">
              <value name=\"condition\">
                <shadow type=\"required_value\"></shadow>
                <block type=\"TocandoManzana\"></block>
              </value>
              <statement name=\"block\">
                <shadow type=\"required_statement\"></shadow>
                <block type=\"ComerManzana\"></block>
              </statement>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`,
  });

}); 