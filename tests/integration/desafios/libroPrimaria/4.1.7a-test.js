import {moduloActividad, actividadTest} from '../../../helpers/actividadTest';

let nombre = "4.1.7a";

moduloActividad(nombre);

actividadTest(nombre, {
	solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
  <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="MoverACasillaArriba" id="SI4=l3z@.Re/}/Axao*X">
        <next>
          <block type="repetir" id="|KneHL[}QuG.8DM_bHtq">
            <value name="count">
              <block type="math_number" id="K/^RF-kMoU2vQeYQdh7-">
                <field name="NUM">5</field>
              </block>
            </value>
            <statement name="block">
              <block type="MoverACasillaIzquierda" id="o=|VymUssynr0IA01}a?"></block>
            </statement>
            <next>
              <block type="ComerChurrasco" id="d4y{D[O3OmG$%MA/{qk9"></block>
            </next>
          </block>
        </next>
      </block>
    </statement>
  </block>
</xml>`,
});
