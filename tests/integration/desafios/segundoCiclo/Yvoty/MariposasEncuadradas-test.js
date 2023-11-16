import { moduloActividad, actividadTest } from '../../../../helpers/actividadTest';

let nombre = "MariposasEncuadradas";

moduloActividad(nombre, () => {

   actividadTest(nombre, {
      solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
      <block type="al_empezar_a_ejecutar" id="13" deletable="false" movable="false" editable="false" x="0" y="0">
        <statement name="program">
          <block type="procedures_callnoreturn" id="14">
            <mutation name="Observar mariposas hacia">
              <arg name="direccion"></arg>
            </mutation>
            <value name="ARG0">
              <block type="ParaLaDerecha" id="15"></block>
            </value>
            <next>
              <block type="procedures_callnoreturn" id="20">
                <mutation name="Observar mariposas hacia">
                  <arg name="direccion"></arg>
                </mutation>
                <value name="ARG0">
                  <block type="ParaAbajo" id="21"></block>
                </value>
                <next>
                  <block type="procedures_callnoreturn" id="16">
                    <mutation name="Observar mariposas hacia">
                      <arg name="direccion"></arg>
                    </mutation>
                    <value name="ARG0">
                      <block type="ParaLaIzquierda" id="17"></block>
                    </value>
                    <next>
                      <block type="procedures_callnoreturn" id="18">
                        <mutation name="Observar mariposas hacia">
                          <arg name="direccion"></arg>
                        </mutation>
                        <value name="ARG0">
                          <block type="ParaArriba" id="19"></block>
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
      <block type="procedures_defnoreturn" id="22" x="0" y="196">
        <mutation>
          <arg name="direccion"></arg>
        </mutation>
        <field name="NAME">Observar mariposas hacia</field>
        <field name="ARG0">direccion</field>
        <statement name="STACK">
          <block type="Repetir" id="23">
            <value name="count">
              <block type="math_number" id="24">
                <field name="NUM">6</field>
              </block>
            </value>
            <statement name="block">
              <block type="MoverA" id="25">
                  <value name="direccion">
                    <block type="param_get" id="26">
                      <field name="VAR">direccion</field>
                    </block>
                  </value>
                <next>
                  <block type="procedures_callnoreturn" id="27">
                    <mutation name="Observar mariposa si hay"></mutation>
                  </block>
                </next>
              </block>
            </statement>
          </block>
        </statement>
      </block>
      <block type="procedures_defnoreturn" id="28" x="2" y="363">
        <field name="NAME">Observar mariposa si hay</field>
        <statement name="STACK">
          <block type="si" id="29">
            <value name="condition">
              <block type="TocandoMariposa" id="30"></block>
            </value>
            <statement name="block">
              <block type="FotografiarMariposa" id="31"></block>
            </statement>
          </block>
        </statement>
      </block>
    </xml>`
   });

});