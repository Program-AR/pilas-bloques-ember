import {moduloActividad, actividadTest} from '../../../helpers/actividadTest';

let nombre = "4.1.4a";

moduloActividad(nombre);

actividadTest(nombre, {
	solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
  <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="MoverACasillaIzquierda" id="00R9=JIOg%^k/N-Do-v~">
        <next>
          <block type="repetir" id="GrD]_~,7lja_5iNSApR]">
            <value name="count">
              <block type="math_number" id="4(0z{9svPaD4[yM*.dWc">
                <field name="NUM">4</field>
              </block>
            </value>
            <statement name="block">
              <block type="MoverACasillaArriba" id="~]G{vi7cl_)$oGuu,x_W"></block>
            </statement>
            <next>
              <block type="ComerChurrasco" id="q0H59/0i3~da-2vjO5V,"></block>
            </next>
          </block>
        </next>
      </block>
    </statement>
  </block>
</xml>`,
});
