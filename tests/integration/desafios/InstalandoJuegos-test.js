import {moduloActividad, actividadTest} from '../../helpers/actividadTest';

const nombre = 'InstalandoJuegos';

moduloActividad(nombre);

actividadTest(nombre, {
	solucion: `<?xml version="1.0" encoding="UTF-8"?>
	<xml xmlns="http://www.w3.org/1999/xhtml">
	   <block type="al_empezar_a_ejecutar" id="193" deletable="false" movable="false" editable="false" x="0" y="0">
		  <statement name="program">
			 <block type="Repetir" id="212" inline="true">
				<value name="count">
				   <block type="Numero" id="213">
					  <field name="NUM">3</field>
				   </block>
				</value>
				<statement name="block">
				   <block type="SiguienteComputadora" id="221">
					  <next>
						 <block type="procedures_callnoreturn" id="209">
							<mutation name="Procesar compu" />
						 </block>
					  </next>
				   </block>
				</statement>
			 </block>
		  </statement>
	   </block>
	   <block type="Procedimiento" id="195" x="23" y="215">
		  <mutation />
		  <field name="NAME">Procesar compu</field>
		  <statement name="STACK">
			 <block type="PrenderComputadora" id="229">
				<next>
				   <block type="procedures_callnoreturn" id="233">
					  <mutation name="Ingresar password" />
					  <next>
						 <block type="InstalarJuego" id="241">
							<next>
							   <block type="ApagarComputadora" id="249" />
							</next>
						 </block>
					  </next>
				   </block>
				</next>
			 </block>
		  </statement>
	   </block>
	   <block type="Procedimiento" id="198" x="487" y="218">
		  <mutation />
		  <field name="NAME">Ingresar password</field>
		  <statement name="STACK">
			 <block type="EscribirA" id="257">
				<next>
				   <block type="EscribirB" id="265">
					  <next>
						 <block type="EscribirC" id="273" />
					  </next>
				   </block>
				</next>
			 </block>
		  </statement>
	   </block>
	</xml>`,
});

actividadTest(nombre, {
	descripcionAdicional: 'No debe poderse resolver la actividad si no están las tres máquinas instaladas',
	solucion: `<?xml version="1.0" encoding="UTF-8"?>
	<xml>
	   <block y="0" x="0" editable="false" movable="false" deletable="false" id="32" type="al_empezar_a_ejecutar">
		  <statement name="program">
			 <block id="35" type="SiguienteComputadora">
				<next>
				   <block inline="true" id="33" type="Repetir">
					  <value name="count">
						 <block id="34" type="Numero">
							<field name="NUM">3</field>
						 </block>
					  </value>
					  <statement name="block">
						 <block id="36" type="procedures_callnoreturn">
							<mutation name="Procesar compu" />
						 </block>
					  </statement>
				   </block>
				</next>
			 </block>
		  </statement>
	   </block>
	   <block y="215" x="23" id="37" type="Procedimiento">
		  <mutation />
		  <field name="NAME">Procesar compu</field>
		  <statement name="STACK">
			 <block id="38" type="PrenderComputadora">
				<next>
				   <block id="39" type="procedures_callnoreturn">
					  <mutation name="Ingresar password" />
					  <next>
						 <block id="40" type="InstalarJuego">
							<next>
							   <block id="41" type="ApagarComputadora" />
							</next>
						 </block>
					  </next>
				   </block>
				</next>
			 </block>
		  </statement>
	   </block>
	   <block y="218" x="487" id="42" type="Procedimiento">
		  <mutation />
		  <field name="NAME">Ingresar password</field>
		  <statement name="STACK">
			 <block id="43" type="EscribirA">
				<next>
				   <block id="44" type="EscribirB">
					  <next>
						 <block id="45" type="EscribirC" />
					  </next>
				   </block>
				</next>
			 </block>
		  </statement>
	   </block>
	</xml>`,
	errorEsperado: 'Esta compu ya la prendiste antes',
});
