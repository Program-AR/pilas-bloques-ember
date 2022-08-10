import { moduloActividad, actividadTest } from '../../helpers/actividadTest';

const nombre = "LosCaminosDeNano";

moduloActividad(nombre, () => {

  actividadTest(nombre, {
    solucion: `<xml xmlns=\"http://www.w3.org/1999/xhtml\">
    <variables></variables>
    <block type=\"procedures_defnoreturn\" x=\"-359\" y=\"-97\">
      <field name=\"NAME\">Ir por camino alternativo</field>
      <statement name=\"STACK\">
        <block type=\"repetir\">
          <value name=\"count\">
            <shadow type=\"required_value\"></shadow>
            <block type=\"Numero\">
              <field name=\"NUM\">4</field>
            </block>
          </value>
          <statement name=\"block\">
            <shadow type=\"required_statement\"></shadow>
            <block type=\"MoverACasillaDerecha\"></block>
          </statement>
          <next>
            <block type=\"MoverACasillaAbajo\">
              <next>
                <block type=\"MoverACasillaAbajo\">
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
              </next>
            </block>
          </next>
        </block>
      </statement>
    </block>
    <block type=\"al_empezar_a_ejecutar\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"15\" y=\"15\">
      <statement name=\"program\">
        <shadow type=\"required_statement\"></shadow>
        <block type=\"MoverACasillaAbajo\">
          <next>
            <block type=\"procedures_callnoreturn\">
              <mutation name=\"Recorrer camino\"></mutation>
              <next>
                <block type=\"procedures_callnoreturn\">
                  <mutation name=\"Ir a segundo camino\"></mutation>
                  <next>
                    <block type=\"procedures_callnoreturn\">
                      <mutation name=\"Recorrer camino\"></mutation>
                      <next>
                        <block type=\"ComerBanana\"></block>
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
    <block type=\"procedures_defnoreturn\" x=\"239\" y=\"215\">
      <field name=\"NAME\">Ir a segundo camino</field>
      <statement name=\"STACK\">
        <block type=\"MoverACasillaAbajo\">
          <next>
            <block type=\"MoverACasillaAbajo\">
              <next>
                <block type=\"MoverACasillaDerecha\"></block>
              </next>
            </block>
          </next>
        </block>
      </statement>
    </block>
    <block type=\"procedures_defnoreturn\" x=\"-365\" y=\"254\">
      <field name=\"NAME\">Recorrer camino</field>
      <statement name=\"STACK\">
        <block type=\"SiNo\">
          <value name=\"condition\">
            <shadow type=\"required_value\"></shadow>
            <block type=\"HayObstaculoAbajo\"></block>
          </value>
          <statement name=\"block1\">
            <shadow type=\"required_statement\"></shadow>
            <block type=\"procedures_callnoreturn\">
              <mutation name=\"Ir por camino alternativo\"></mutation>
            </block>
          </statement>
          <statement name=\"block2\">
            <shadow type=\"required_statement\"></shadow>
            <block type=\"MoverACasillaAbajo\">
              <next>
                <block type=\"MoverACasillaAbajo\"></block>
              </next>
            </block>
          </statement>
        </block>
      </statement>
    </block>
  </xml>`,
  });

});