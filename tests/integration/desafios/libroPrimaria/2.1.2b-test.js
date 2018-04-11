import {moduloActividad, actividadTest} from '../../../helpers/actividadTest';

let nombre = "2.1.2b";

moduloActividad(nombre);

actividadTest(nombre, {
	solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
	<block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
	  <statement name="program">
		<block type="MoverACasillaDerecha" id="vWmE|Gys1c:mq}x1MZd\`">
		  <next>
			<block type="MoverACasillaArriba" id="blishcLMaS@!CJ/jN2*C">
			  <next>
				<block type="MoverACasillaDerecha" id="v4eE0P;G:4s^0_J)g;aZ">
				  <next>
					<block type="ComerChurrasco" id="1Ung=~(.u7.3|xb=rB}T"></block>
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

