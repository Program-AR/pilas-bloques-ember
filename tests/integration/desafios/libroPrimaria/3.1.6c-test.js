import {moduloActividad, actividadTest} from '../../../helpers/actividadTest';

let nombre = "3.1.6c";

moduloActividad(nombre);

actividadTest(nombre, {
	solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
  <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="MoverACasillaDerecha" id="@@f$tXo8V4J{{9R/G.F-">
        <next>
          <block type="MoverACasillaArriba" id="5,iMvJu]}U?V9)?_A.?+">
            <next>
              <block type="ComerChurrasco" id="07n$(t28zuuDLB7wSas3"></block>
            </next>
          </block>
        </next>
      </block>
    </statement>
  </block>
</xml>`,
});
