import { moduloActividad, actividadTest } from '../../../helpers/actividadTest';

const nombre = 'SuperYvoty2';

moduloActividad(nombre, () => {

	//TODO: sacar skip una vez que tenga la misma solución que supertito2

	actividadTest(nombre, {
		solucion: `<?xml version="1.0" encoding="UTF-8"?>
	<xml xmlns="http://www.w3.org/1999/xhtml">
	   <block type="al_empezar_a_ejecutar" id="76" deletable="false" movable="false" editable="false" x="0" y="0">
		  <statement name="program">
			 <block type="hasta" id="77" inline="true">
				<value name="condition">
				   <block type="TocandoFinal" id="78" />
				</value>
				<statement name="block">
				   <block type="procedures_callnoreturn" id="79">
					  <mutation name="Despertar si hay luciernaga" />
					  <next>
						 <block type="MoverACasillaAbajo" id="87" />
					  </next>
				   </block>
				</statement>
			 </block>
		  </statement>
	   </block>
	   <block type="procedures_defnoreturn" id="81" x="-8" y="184">
		  <mutation />
		  <field name="NAME">Despertar si hay luciernaga</field>
		  <statement name="STACK">
			 <block type="si" id="82" inline="true">
				<value name="condition">
				   <block type="TocandoLuciernaga" id="83" />
				</value>
				<statement name="block">
				   <block type="DespertarLuciernaga" id="84" />
				</statement>
			 </block>
		  </statement>
	   </block>
	</xml>`,
		skip: true
	});

});