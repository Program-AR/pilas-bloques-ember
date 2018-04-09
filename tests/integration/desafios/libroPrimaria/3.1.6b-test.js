import {moduloActividad, actividadTest} from '../../../helpers/actividadTest';

let nombre = "3.1.6b";

moduloActividad(nombre);

actividadTest(nombre, {
	solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
  <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="MoverACasillaIzquierda" id="g;sTk2UXUn~Z+sY@#Ti,">
        <next>
          <block type="MoverACasillaIzquierda" id="g)n,M+JWV7j,2\`]ig5$2">
            <next>
              <block type="MoverACasillaArriba" id="_]z.T[k.MZ=*m-w$cQSt">
                <next>
                  <block type="MoverACasillaArriba" id="V(@5{Mt@CP0ld\`G.)p+S">
                    <next>
                      <block type="ComerChurrasco" id="K!s\`yM]/jVK?_,Ou;3)l"></block>
                    </next>
                  </block>
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
