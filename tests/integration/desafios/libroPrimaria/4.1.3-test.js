import {moduloActividad, actividadTest} from '../../../helpers/actividadTest';

let nombre = "4.1.3";

moduloActividad(nombre);

actividadTest(nombre, {
	solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
  <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="repetir" id="UlUZ3,U|,L#eh!@LcB!;">
        <value name="count">
          <block type="math_number" id="8!0uQ|r1ELWn@|Cvi7gc">
            <field name="NUM">5</field>
          </block>
        </value>
        <statement name="block">
          <block type="MoverACasillaDerecha" id="e[$92Vp-AJn~UE\`W=_(l"></block>
        </statement>
        <next>
          <block type="ComerChurrasco" id="q0H59/0i3~da-2vjO5V,"></block>
        </next>
      </block>
    </statement>
  </block>
</xml>`,
});
