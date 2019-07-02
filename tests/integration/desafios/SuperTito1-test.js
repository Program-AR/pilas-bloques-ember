import { moduloActividad, actividadTest } from '../../helpers/actividadTest';

const nombre = 'SuperTito1';

moduloActividad(nombre, () => {

	actividadTest(nombre, {
		solucion: `<?xml version="1.0" encoding="UTF-8"?>
	<xml xmlns="http://www.w3.org/1999/xhtml">
	   <block type="al_empezar_a_ejecutar" id="11" deletable="false" movable="false" editable="false" x="0" y="0">
		  <statement name="program">
			 <block type="hasta" id="21" inline="true">
				<value name="condition">
				   <block type="TocandoFinal" id="24" />
				</value>
				<statement name="block">
				   <block type="EncenderLuz" id="27">
					  <next>
						 <block type="MoverACasillaAbajo" id="30" />
					  </next>
				   </block>
				</statement>
			 </block>
		  </statement>
	   </block>
	</xml>`,
	});

});
