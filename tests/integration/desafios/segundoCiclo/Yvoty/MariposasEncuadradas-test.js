import { moduloActividad, actividadTest } from '../../../../helpers/actividadTest';

let nombre = "MariposasEncuadradas";

moduloActividad(nombre, () => {

   actividadTest(nombre, {
      solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
      <variables>
        <variable type="" id=";Hpnm3IaG$0W5,m[@zX/">direccion</variable>
      </variables>
      <block type="al_empezar_a_ejecutar" id="13" deletable="false" movable="false" editable="false" x="0" y="0">
        <statement name="program">
          <shadow type="required_statement" id="zfb.S.6LX24[.%Yiu9tr"></shadow>
          <block type="procedures_callnoreturn" id="14">
            <mutation name="Observar mariposas hacia">
              <arg name="direccion"></arg>
            </mutation>
            <value name="ARG0">
              <shadow xmlns="" type="required_value"/>
              <block type="ParaLaDerecha" id="15"></block>
            </value>
            <next>
              <block type="procedures_callnoreturn" id="20">
                <mutation name="Observar mariposas hacia">
                  <arg name="direccion"></arg>
                </mutation>
                <value name="ARG0">
                  <shadow xmlns="" type="required_value"/>
                  <block type="ParaAbajo" id="21"></block>
                </value>
                <next>
                  <block type="procedures_callnoreturn" id="16">
                    <mutation name="Observar mariposas hacia">
                      <arg name="direccion"></arg>
                    </mutation>
                    <value name="ARG0">
                      <shadow xmlns="" type="required_value"/>
                      <block type="ParaLaIzquierda" id="17"></block>
                    </value>
                    <next>
                      <block type="procedures_callnoreturn" id="18">
                        <mutation name="Observar mariposas hacia">
                          <arg name="direccion"></arg>
                        </mutation>
                        <value name="ARG0">
                          <shadow xmlns="" type="required_value"/>
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
              <shadow type="required_value" id="7ek+vVl[m*#]:{i=}(0V"></shadow>
              <block type="math_number" id="24">
                <field name="NUM">6</field>
              </block>
            </value>
            <statement name="block">
              <shadow type="required_statement" id="o2C:cvl~r3@y,AQr;B+]"></shadow>
              <block type="MoverA" id="25">
                <value name="direccion">
                  <shadow type="required_value" id="4$-aX;}BR1@|Y\`B@]FP0"></shadow>
                  <block type="variables_get" id="ox1nJ+c8Hl1(LpwS]_TK">
                    <mutation var="direccion" parent="22"></mutation>
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
              <shadow type="required_value" id="Z+Wpu$Dn+B@rqL;I\`[NY"></shadow>
              <block type="TocandoMariposa" id="30"></block>
            </value>
            <statement name="block">
              <shadow type="required_statement" id="^Dx\`KpAK\`MbXQ(@eatkT"></shadow>
              <block type="ObservarMariposa" id="31"></block>
            </statement>
          </block>
        </statement>
      </block>
    </xml>`,
    skip: true
   });

});