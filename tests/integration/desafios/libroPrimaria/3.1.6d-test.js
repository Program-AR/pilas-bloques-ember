import {moduloActividad, actividadTest} from '../../../helpers/actividadTest';

let nombre = "3.1.6d";

moduloActividad(nombre);

actividadTest(nombre, {
	solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
  <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="MoverACasillaAbajo" id="iQ?*Ug7k;[[yLp$|6nl8">
        <next>
          <block type="MoverACasillaAbajo" id="-bmcQf?Kp;m;W~_EQ2]U">
            <next>
              <block type="MoverACasillaIzquierda" id="n1$?Go8Ksg|(f.CCO$z2">
                <next>
                  <block type="MoverACasillaIzquierda" id=":O@u$;oa/x#n:0Y|%dA[">
                    <next>
                      <block type="MoverACasillaArriba" id="ol@}P96m@5RM~iBIOL@r">
                        <next>
                          <block type="MoverACasillaArriba" id="~]G{vi7cl_)$oGuu,x_W">
                            <next>
                              <block type="ComerChurrasco" id="q0H59/0i3~da-2vjO5V,"></block>
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
        </next>
      </block>
    </statement>
  </block>
</xml>`,
});
