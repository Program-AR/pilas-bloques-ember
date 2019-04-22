import {moduloActividad, actividadTest} from '../../helpers/actividadTest';

const nombre = 'FutbolRobots';

moduloActividad(nombre);

actividadTest(nombre, {
	solucion: `<?xml version="1.0" encoding="UTF-8"?>
	<xml xmlns="http://www.w3.org/1999/xhtml">
	   <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="0" y="0">
		  <statement name="program">
			 <block type="Repetir" id="14" inline="true">
				<value name="count">
				   <block type="math_number" id="15">
					  <field name="NUM">7</field>
				   </block>
				</value>
				<statement name="block">
				   <block type="procedures_callnoreturn" id="95">
					  <mutation name="Hacer gol" />
					  <next>
						 <block type="procedures_callnoreturn" id="99">
							<mutation name="Volver al inicio" />
							<next>
							   <block type="SiguienteFila" id="87" />
							</next>
						 </block>
					  </next>
				   </block>
				</statement>
				<next>
				   <block type="procedures_callnoreturn" id="107">
					  <mutation name="Hacer gol" />
				   </block>
				</next>
			 </block>
		  </statement>
	   </block>
	   <block type="procedures_defnoreturn" id="21" x="217" y="61">
		  <mutation />
		  <field name="NAME">Hacer gol</field>
		  <statement name="STACK">
			 <block type="hasta" id="33" inline="true">
				<value name="condition">
				   <block type="TocandoPelota" id="70" />
				</value>
				<statement name="block">
				   <block type="MoverACasillaDerecha" id="54" />
				</statement>
				<next>
				   <block type="PatearPelota" id="75" />
				</next>
			 </block>
		  </statement>
	   </block>
	   <block type="procedures_defnoreturn" id="24" x="6" y="235">
		  <mutation />
		  <field name="NAME">Volver al inicio</field>
		  <statement name="STACK">
			 <block type="hasta" id="42" inline="true">
				<value name="condition">
				   <block type="TocandoInicio" id="62" />
				</value>
				<statement name="block">
				   <block type="MoverACasillaIzquierda" id="59" />
				</statement>
			 </block>
		  </statement>
	   </block>
	</xml>`,
});
