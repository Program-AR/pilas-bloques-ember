import { moduloActividad, actividadTest } from '../../helpers/actividadTest';

const nombre = 'FutbolRobots';

moduloActividad(nombre, () => {

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

	actividadTest(nombre, {
		descripcionAdicional: 'No puedo patear 2 veces la misma pelota',
		errorEsperado: 'No puedo patear dos veces la misma pelota',
		solucion: `<?xml version="1.0" encoding="UTF-8"?>
			<xml xmlns="http://www.w3.org/1999/xhtml">
			<variables />
			<block type="al_empezar_a_ejecutar" id="R#u-G?}cX2zfH[M-UVuc" deletable="false" movable="false" editable="false" x="15" y="15">
				<statement name="program">
					<shadow type="required_statement" id="fF@TlUQgOpLWN_m1b*){" />
					<block type="procedures_callnoreturn" id="lC,iTKKXrAH2};q3n*L2">
						<mutation name="Patear todas las pelotas" />
					</block>
				</statement>
			</block>
			<block type="procedures_defnoreturn" id="pS^gxbVTfES(#_uh4u00" x="17" y="102">
				<field name="NAME">Patear la pelota de una fila</field>
				<statement name="STACK">
					<block type="Hasta" id="5xjsZ0L9lRx]8Do/H!p@">
						<value name="condition">
						<shadow type="required_value" id="}j_8+/@XXv|8XRX!0*:p" />
						<block type="TocandoPelota" id="Y;=e=uXBs[)XS9+GGGrh" />
						</value>
						<statement name="block">
						<shadow type="required_statement" id="vRZIe-,nTB=o7EsXkpD;" />
						<block type="MoverACasillaDerecha" id="2!~m@gW)0@Q*qNVkM3!|" />
						</statement>
						<next>
						<block type="PatearPelota" id="R/25PmB,pTT*3_I)#.q_" />
						</next>
					</block>
				</statement>
			</block>
			<block type="procedures_defnoreturn" id="S9Z1N#Aq8XJp9i_H_Gi?" x="376" y="96">
				<field name="NAME">Patear todas las pelotas</field>
				<statement name="STACK">
					<block type="repetir" id="n8KTdgC{VMVZRy#H]%zx">
						<value name="count">
						<shadow type="required_value" id="m[3/=#Q*g5^C=;NM;GrY" />
						<block type="math_number" id=",b{M=z$;nw7-})T.vn7c">
							<field name="NUM">7</field>
						</block>
						</value>
						<statement name="block">
						<shadow type="required_statement" id="$;Lq[3i[6IzxUg!i,|bK" />
						<block type="procedures_callnoreturn" id="46RBv#=^7BJYJ$F:+M:z">
							<mutation name="Patear la pelota de una fila" />
							<next>
								<block type="procedures_callnoreturn" id="5Uw+9I[-A9Gb?8/Up]u#">
									<mutation name="Pasar a la siguente fila" />
								</block>
							</next>
						</block>
						</statement>
						<next>
						<block type="procedures_callnoreturn" id="eUk(kjVaul6FOa)?S0pv">
							<mutation name="Patear la pelota de una fila" />
						</block>
						</next>
					</block>
				</statement>
			</block>
			<block type="procedures_callnoreturn" id="Yo+%Hn_6#L+C2~q-z-8j" disabled="true" x="743" y="115">
				<mutation name="Patear todas las pelotas" />
			</block>
			<block type="procedures_callnoreturn" id="[9rV,3DyLt+K!09lam3)" disabled="true" x="743" y="115">
				<mutation name="Patear todas las pelotas" />
			</block>
			<block type="procedures_defnoreturn" id="V=A)VCb:?l-?L[_0WP!R" x="20" y="275">
				<field name="NAME">Pasar a la siguente fila</field>
			</block>
			</xml>
		`,
	});


});