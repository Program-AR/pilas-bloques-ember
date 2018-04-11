import {moduloActividad, actividadTest} from '../../../helpers/actividadTest';

let nombre = "2.1.2c";

moduloActividad(nombre);

actividadTest(nombre, {
	solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
	<block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
	  <statement name="program">
		<block type="MoverACasillaAbajo" id="!qt\`8P39sG1c-Q]vH?_Y">
		  <next>
			<block type="MoverACasillaDerecha" id=",p].T7y2yKjPus:BWD{*">
			  <next>
				<block type="MoverACasillaDerecha" id="Y0f~w(|^hBZd#CDF[r.s">
				  <next>
					<block type="MoverACasillaDerecha" id="fo}s{cSKtXd[[}U_gIYV">
					  <next>
						<block type="ComerChurrasco" id="NUpdF^nWU:j|27,ujCJq"></block>
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
