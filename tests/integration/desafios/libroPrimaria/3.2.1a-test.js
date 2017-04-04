import {moduloActividad, actividadTest} from '../../../helpers/actividadTest';

let nombre = "3.2.1a";

moduloActividad(nombre);

actividadTest(nombre, {
	solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
  <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="MoverDerechaDibujando" id="9[b/CUw\`Hl:030jh!zaG">
        <next>
          <block type="MoverArribaDibujando" id="rXDM}6Q{0C.bD(HE[r/=">
            <next>
              <block type="MoverDerechaDibujando" id="!e7vCEtObnZ={HqA1:5A">
                <next>
                  <block type="MoverAbajoDibujando" id="jYO$UAS7oKiS*[9H^(!}"></block>
                </next>
              </block>
            </next>
          </block>
        </next>
      </block>
    </statement>
  </block>
</xml>`,
});
