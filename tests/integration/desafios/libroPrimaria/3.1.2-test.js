import {moduloActividad, actividadTest} from '../../../helpers/actividadTest';

let nombre = "3.1.2";

moduloActividad(nombre);

actividadTest(nombre, {
	solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
  <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="MoverACasillaDerecha" id="=F|pcHdkxfxdR[YZ3pVx">
        <next>
          <block type="MoverACasillaDerecha" id="g;CNbjY+#]H[{juk*=s*">
            <next>
              <block type="MoverACasillaDerecha" id="$pHdSXVZC@TA}dD6|q(s">
                <next>
                  <block type="ComerChurrasco" id="yz1\`;./7zw1Mph%H?5b4"></block>
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

actividadTest(nombre, {
	descripcionAdicional: 'Da error al querer ir hacia un obstáculo',
	solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
  <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="MoverACasillaAbajo" id="75SC}YQxgjH=gsOxUIXe"></block>
    </statement>
  </block>
</xml>`,
	errorEsperado: 'Hay un obstáculo para abajo',
});
