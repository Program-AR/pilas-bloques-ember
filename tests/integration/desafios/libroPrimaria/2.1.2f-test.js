import {moduloActividad, actividadTest} from '../../../helpers/actividadTest';

let nombre = "2.1.2f";

moduloActividad(nombre);

actividadTest(nombre, {
	solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
	<block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
	  <statement name="program">
		<block type="MoverACasillaArriba" id="c/ns5YzzTOu52ksu\`$fA">
		  <next>
			<block type="MoverACasillaArriba" id="X!=;kUH]p$;}@N%Ze-c2">
			  <next>
				<block type="MoverACasillaDerecha" id="T0E[i5GoG_?*d$V!=hXv">
				  <next>
					<block type="MoverACasillaDerecha" id="^HU+kGMwLLAyseYZEp]1">
					  <next>
						<block type="MoverACasillaAbajo" id=";|msv)0jl+P(/01!Z(hk">
						  <next>
							<block type="ComerChurrasco" id="+1DMZb!Q2.O?L:NZj{K("></block>
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
