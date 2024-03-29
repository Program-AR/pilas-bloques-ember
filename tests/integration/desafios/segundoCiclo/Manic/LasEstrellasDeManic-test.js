import { moduloActividad, actividadTest } from '../../../../helpers/actividadTest';

const nombre = "1038";

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
              <next>
                <block type=\"ObservarEstrella\"></block>
              </next>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`,
  });

});