import { moduloActividad, actividadTest } from '../../helpers/actividadTest';

moduloActividad('DibujandoCuadradoManic', () => {

  actividadTest('DibujandoCuadradoManic', {
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" id="18" deletable="false" movable="false" editable="false" x="0" y="0">
      <statement name="program">
        <block type="procedures_callnoreturn" id="21">
          <mutation name="Dibujar cuadrado de 100"></mutation>
        </block>
      </statement>
    </block>
    <block type="procedures_defnoreturn" id="24" x="20" y="180">
      <mutation></mutation>
      <field name="NAME">Dibujar cuadrado de 100</field>
      <statement name="STACK">
        <block type="repetir" id="25" inline="true">
          <value name="count">
            <block type="math_number" id="26">
              <field name="NUM">4</field>
            </block>
          </value>
          <statement name="block">
            <block type="DibujarLado" id="27" inline="true">
              <value name="longitud">
                <block type="math_number" id="28">
                  <field name="NUM">100</field>
                </block>
              </value>
              <next>
                <block type="GirarGrados" id="29" inline="true">
                  <value name="grados">
                    <block type="math_number" id="30">
                      <field name="NUM">90</field>
                    </block>
                  </value>
                </block>
              </next>
            </block>
          </statement>
        </block>
      </statement>
    </block>
  </xml>`
  });

});