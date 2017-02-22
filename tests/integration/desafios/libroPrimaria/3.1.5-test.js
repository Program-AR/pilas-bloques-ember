import {moduloActividad, actividadTest} from '../../../helpers/actividadTest';

let nombre = "3.1.5";

moduloActividad(nombre);

actividadTest(nombre, {
	solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
  <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="MoverACasillaDerecha" id="}lD?u,NzNl1tiWh74BkN">
        <next>
          <block type="MoverACasillaArriba" id="cf*mBojY/kM^-2pP-d;h">
            <next>
              <block type="MoverACasillaDerecha" id="v_oUcTG6U4|\`13;3HmX:">
                <next>
                  <block type="ComerChurrasco" id="~@i=]vSZD:WNC}9mIkaV"></block>
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
