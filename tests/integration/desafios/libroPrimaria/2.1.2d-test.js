import {moduloActividad, actividadTest} from '../../../helpers/actividadTest';

let nombre = "2.1.2d";

moduloActividad(nombre);

actividadTest(nombre, {
	solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
	<block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
	  <statement name="program">
		<block type="MoverACasillaAbajo" id="4d^RFl:3Hm3l4}%72ACw">
		  <next>
			<block type="MoverACasillaAbajo" id="Gn0fSd*\`m}f@zd]Oc{/w">
			  <next>
				<block type="MoverACasillaDerecha" id="n0+i)4+X,f9Jq1EtY[_y">
				  <next>
					<block type="MoverACasillaAbajo" id="!pg3lRSOp_a|CFYEi3Vc">
					  <next>
						<block type="ComerChurrasco" id="?+W)lEebw*)\`.V^6bg$~"></block>
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
