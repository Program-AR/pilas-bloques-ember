import {moduloActividad, actividadTest} from '../../../helpers/actividadTest';

let nombre = "2.1.2a";

moduloActividad(nombre);

actividadTest(nombre, {
	solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
	<block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
	  <statement name="program">
		<block type="MoverACasillaDerecha" id="8[h9[(my?v_@jD)IcuKE">
		  <next>
			<block type="MoverACasillaDerecha" id="v+,Ok5cc3fDiIKwPAk/4">
			  <next>
				<block type="MoverACasillaDerecha" id="OARN?q)8N!G$yqD~ggLS">
				  <next>
					<block type="ComerChurrasco" id="@q@H9YgNq*KKMvwR1piM"></block>
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
	descripcionAdicional: 'Da error al querer ir hacia un obstáculo para arriba',
	solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
  <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="MoverACasillaArriba" id="[j1z:])m?Mh%?/XP?l[L">
        <next>
          <block type="MoverACasillaArriba" id="S-R^yFz^|+NIp(zQ%NQz"></block>
        </next>
      </block>
    </statement>
	</block>
	</xml>`,
	errorEsperado: '¡Hay un obstáculo!',
});

actividadTest(nombre, {
	descripcionAdicional: 'Da error al querer ir hacia un obstáculo para abajo',
	solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
  <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="MoverACasillaAbajo" id="]1_W/tT]L@3Fen:kZ./o">
        <next>
          <block type="MoverACasillaAbajo" id="I=#YBk\`DIMK(HwFxND^: "></block>
        </next >
      </block >
    </statement >
  </block >
	<block type="MoverACasillaIzquierda" id="sUjx|1FMK-$Qk*M]r+v0" disabled="true" x="180" y="412"></block>
	</xml>`,
	errorEsperado: '¡Hay un obstáculo!',
});

actividadTest(nombre, {
	descripcionAdicional: 'Da error al querer ir hacia un obstáculo para la izquierda',
	solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
  <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="MoverACasillaArriba" id="[j1z:])m?Mh%?/XP?l[L">
        <next>
          <block type="MoverACasillaIzquierda" id="sUjx|1FMK-$Qk*M]r+v0"></block>
        </next>
      </block>
    </statement>
  </block>
	</xml>`,
	errorEsperado: '¡Hay un obstáculo!',
});

actividadTest(nombre, {
	descripcionAdicional: 'Da error al querer ir hacia un obstáculo para la derecha',
	solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
  <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="MoverACasillaAbajo" id="]1_W/tT]L@3Fen:kZ./o">
        <next>
          <block type="MoverACasillaDerecha" id="jl?^E$CNB+bTIr6s?Cm:">
            <next>
              <block type="MoverACasillaDerecha" id="A\`EX-GcDLDQ3: R3^)a1{
"></block>
            </next >
          </block >
        </next >
      </block >
    </statement >
  </block >
	</xml>`,
	errorEsperado: '¡Hay un obstáculo!',
});
