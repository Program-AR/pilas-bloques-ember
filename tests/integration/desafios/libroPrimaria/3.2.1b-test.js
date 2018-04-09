import {moduloActividad, actividadTest} from '../../../helpers/actividadTest';

let nombre = "3.2.1b";

moduloActividad(nombre);

actividadTest(nombre, {
	solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
  <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="MoverDerechaDibujando" id="]Mt=|u9}pyI-AFC}(^9o">
        <next>
          <block type="MoverDerechaDibujando" id="C4H~*,q4dgB:3+EALy5n">
            <next>
              <block type="MoverArribaDibujando" id="s8#~;^]moK!|^Q|0ytK3">
                <next>
                  <block type="MoverIzquierdaDibujando" id="l/S\`m,SWM=WZ4g*Jr11@">
                    <next>
                      <block type="MoverIzquierdaDibujando" id="@UE3/%NUy\`,pA4+F]b:V">
                        <next>
                          <block type="MoverAbajoDibujando" id="n9PQ+$MS#3C;)?vrVjCk"></block>
                        </next>
                      </block>
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
