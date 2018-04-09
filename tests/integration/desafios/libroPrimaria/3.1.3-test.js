import {moduloActividad, actividadTest} from '../../../helpers/actividadTest';

let nombre = "3.1.3";

moduloActividad(nombre);

actividadTest(nombre, {
	solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
  <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="MoverACasillaIzquierda" id="0gh[rSvAYk{!o.G5)Lzv">
        <next>
          <block type="MoverACasillaAbajo" id="2r#@)~|buWuAp+W8=1oQ">
            <next>
              <block type="MoverACasillaAbajo" id="6g=7u+%J~X8tFrKvs-[-">
                <next>
                  <block type="ComerChurrasco" id="Nvf-9ERJGvH]N23!*}@~"></block>
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
