import { moduloActividad } from '../../../../helpers/actividadTest';

const nombre = 'YvotyDespiertaMasLuciernagas';

moduloActividad(nombre, () => {

	//TODO: descomentar una vez que tenga la misma solución que Tito recargado

	/* actividadTest(nombre, {
		solucion: `<?xml version="1.0" encoding="UTF-8"?>
	<xml xmlns="http://www.w3.org/1999/xhtml">
	   <block type="al_empezar_a_ejecutar" id="2" deletable="false" movable="false" editable="false" x="0" y="0">
		  <statement name="program">
			 <block type="Repetir" id="13" inline="true">
				<value name="count">
				   <block type="math_number" id="14">
					  <field name="NUM">6</field>
				   </block>
				</value>
				<statement name="block">
				   <block type="procedures_callnoreturn" id="25">
					  <mutation name="Despertar si hay luciernaga" />
					  <next>
						 <block type="MoverACasillaAbajo" id="22" />
					  </next>
				   </block>
				</statement>
			 </block>
		  </statement>
	   </block>
	   <block type="procedures_defnoreturn" id="4" x="445" y="11">
		  <mutation />
		  <field name="NAME">Despertar si hay luciernaga</field>
		  <statement name="STACK">
			 <block type="si" id="9" inline="true">
				<value name="condition">
				   <block type="TocandoLuciernaga" id="16" />
				</value>
				<statement name="block">
				   <block type="DespertarLuciernaga" id="19" />
				</statement>
			 </block>
		  </statement>
	   </block>
	</xml>`,
	});

	actividadTest(nombre, {
		descripcionAdicional: 'La actividad no está resuelta si no estoy al final',
		solucion: `<?xml version="1.0" encoding="UTF-8"?>
	<xml xmlns="http://www.w3.org/1999/xhtml">
	   <block type="al_empezar_a_ejecutar" id="2" deletable="false" movable="false" editable="false" x="0" y="0">
		  <statement name="program">
			 <block type="procedures_callnoreturn" id="60">
				<mutation name="Despertar luciernaga si esta dormida" />
				<next>
				   <block type="Repetir" id="45" inline="true">
					  <value name="count">
						 <block type="math_number" id="46">
							<field name="NUM">5</field>
						 </block>
					  </value>
					  <statement name="block">
						 <block type="MoverACasillaAbajo" id="24">
							<next>
							   <block type="procedures_callnoreturn" id="38">
								  <mutation name="Despertar luciernaga si esta dormida" />
							   </block>
							</next>
						 </block>
					  </statement>
				   </block>
				</next>
			 </block>
		  </statement>
	   </block>
	   <block type="procedures_defnoreturn" id="13" x="0" y="194">
		  <mutation />
		  <field name="NAME">Despertar luciernaga si esta dormida</field>
		  <statement name="STACK">
			 <block type="si" id="35" inline="true">
				<value name="condition">
				   <block type="TocandoLuciernaga" id="30" />
				</value>
				<statement name="block">
				   <block type="DespertarLuciernaga" id="5" />
				</statement>
			 </block>
		  </statement>
	   </block>
	</xml>`,
		resuelveDesafio: false,
	}); */

});