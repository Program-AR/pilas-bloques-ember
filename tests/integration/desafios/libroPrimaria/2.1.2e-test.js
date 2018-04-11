import {moduloActividad, actividadTest} from '../../../helpers/actividadTest';

let nombre = "2.1.2e";

moduloActividad(nombre);

actividadTest(nombre, {
	descripcionAdicional: "La solución 1 funciona",
	solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
	<block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
	  <statement name="program">
		<block type="MoverACasillaAbajo" id="[R9.}A16EZ4|v*+kAx81">
		  <next>
			<block type="MoverACasillaAbajo" id="Unq{?$;[gC-|U$*V7ljp">
			  <next>
				<block type="MoverACasillaDerecha" id="bIhb6Dg~ath3ms_.BA(M">
				  <next>
					<block type="MoverACasillaDerecha" id="[3K3sg;Nx(A^z#,K(^9m">
					  <next>
						<block type="ComerChurrasco" id="8\`.V6vsJ)0TG}o$m|CFo"></block>
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

actividadTest(nombre, {
	descripcionAdicional: "La solución 2 funciona",
	solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
	<block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
	  <statement name="program">
		<block type="MoverACasillaDerecha" id="bIhb6Dg~ath3ms_.BA(M">
		  <next>
			<block type="MoverACasillaDerecha" id="[3K3sg;Nx(A^z#,K(^9m">
			  <next>
				<block type="MoverACasillaAbajo" id="[R9.}A16EZ4|v*+kAx81">
				  <next>
					<block type="MoverACasillaAbajo" id="Unq{?$;[gC-|U$*V7ljp">
					  <next>
						<block type="ComerChurrasco" id="8\`.V6vsJ)0TG}o$m|CFo"></block>
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
