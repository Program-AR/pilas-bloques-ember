import {moduloActividad, actividadTest} from '../../../helpers/actividadTest';

let nombre = "4.2.1b";

moduloActividad(nombre);

actividadTest(nombre, {
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="repetir">
        <value name="count">
          <block type="math_number">
            <field name="NUM">7</field>
          </block>
        </value>
        <statement name="block">
          <block type="MoverACasillaDerecha">
          <next>
          <block type="si">
            <value name="condition">
              <block type="HayChurrasco"></block>
            </value>
            <statement name="block">
              <block type="ComerChurrasco">
              </block>
            </statement>
          </block>
          </next>
          </block>
        </statement>
      </block>
    </statement>
    </block>
  </xml>`
});
