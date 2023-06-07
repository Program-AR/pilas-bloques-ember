import { moduloActividad, actividadTest } from '../../../../helpers/actividadTest';

const nombre = "InfinitosTrofeos";

moduloActividad(nombre, () => {

	actividadTest(nombre, {
		solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
		<variables>
		  <variable type="" id=".~:L;MZH3#_ch^(xj6@4">cantidad</variable>
		  <variable type="" id="Fx]s3z{~2.?O{SlEh{#C">direccion</variable>
		</variables>
		<block type="al_empezar_a_ejecutar" id="115" deletable="false" movable="false" editable="false" x="0" y="0">
		  <statement name="program">
			<shadow type="required_statement" id="!y0Yy-v\`b%).EO}xnYu8"></shadow>
			<block type="procedures_callnoreturn" id="308">
			  <mutation name="Agarrar trofeos hacia">
				<arg name="cantidad = 3"></arg>
				<arg name="direccion = abajo"></arg>
			  </mutation>
			  <value name="ARG0">
				<shadow xmlns="" type="required_value"/>
				<block type="math_number" id="320">
				  <field name="NUM">4</field>
				</block>
			  </value>
			  <value name="ARG1">
				<shadow xmlns="" type="required_value"/>
				<block type="ParaLaDerecha" id="314"></block>
			  </value>
			  <next>
				<block type="procedures_callnoreturn" id="180">
				  <mutation name="Agarrar trofeos hacia">
					<arg name="cantidad = 3"></arg>
					<arg name="direccion = abajo"></arg>
				  </mutation>
				  <value name="ARG0">
					<shadow xmlns="" type="required_value"/>
					<block type="math_number" id="192">
					  <field name="NUM">3</field>
					</block>
				  </value>
				  <value name="ARG1">
					<shadow xmlns="" type="required_value"/>
					<block type="ParaAbajo" id="275"></block>
				  </value>
				  <next>
					<block type="procedures_callnoreturn" id="186">
					  <mutation name="Agarrar trofeos hacia">
						<arg name="cantidad = 3"></arg>
						<arg name="direccion = abajo"></arg>
					  </mutation>
					  <value name="ARG0">
						<shadow xmlns="" type="required_value"/>
						<block type="math_number" id="198">
						  <field name="NUM">4</field>
						</block>
					  </value>
					  <value name="ARG1">
						<shadow xmlns="" type="required_value"/>
						<block type="ParaLaIzquierda" id="284"></block>
					  </value>
					  <next>
						<block type="procedures_callnoreturn" id="183">
						  <mutation name="Agarrar trofeos hacia">
							<arg name="cantidad = 3"></arg>
							<arg name="direccion = abajo"></arg>
						  </mutation>
						  <value name="ARG0">
							<shadow xmlns="" type="required_value"/>
							<block type="math_number" id="205">
							  <field name="NUM">3</field>
							</block>
						  </value>
						  <value name="ARG1">
							<shadow xmlns="" type="required_value"/>
							<block type="ParaArriba" id="290"></block>
						  </value>
						  <next>
							<block type="procedures_callnoreturn" id="299">
							  <mutation name="Agarrar trofeos centro"></mutation>
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
		<block type="procedures_defnoreturn" id="126" x="20" y="230">
		  <mutation>
			<arg name="cantidad = 3"></arg>
			<arg name="direccion = abajo"></arg>
		  </mutation>
		  <field name="NAME">Agarrar trofeos hacia</field>
		  <field name="ARG0">cantidad = 3</field>
		  <field name="ARG1">direccion = abajo</field>
		  <statement name="STACK">
			<block type="MoverA" id="323">
			  <value name="direccion">
				<shadow type="required_value" id="(svjwFjIpWXA:TnbdyX:"></shadow>
				<block type="variables_get" id="FS2I:r5V\`K4o/}RQ?|om">
				  <mutation var="direccion = abajo" parent="126"></mutation>
				</block>
			  </value>
			  <next>
				<block type="Repetir" id="141">
				  <value name="count">
					<shadow type="required_value" id=".=tR[b{gHy[dieFq@|4R"></shadow>
					<block type="variables_get" id="@26j1B#)[_pjToaNW2Qj">
					  <mutation var="cantidad = 3" parent="126"></mutation>
					</block>
				  </value>
				  <statement name="block">
					<shadow type="required_statement" id="a4,G/S0$-QXOb/.6M$l?"></shadow>
					<block type="RecogerTrofeo" id="160">
					  <next>
						<block type="MoverA" id="157">
						  <value name="direccion">
							<shadow type="required_value" id="tLW5RE(}3qJd%r4yU)/X"></shadow>
							<block type="variables_get" id="A$I=sXn2/C/-w-dC{cM$">
							  <mutation var="direccion = abajo" parent="126"></mutation>
							</block>
						  </value>
						</block>
					  </next>
					</block>
				  </statement>
				</block>
			  </next>
			</block>
		  </statement>
		</block>
		<block type="procedures_defnoreturn" id="221" x="414" y="240">
		  <field name="NAME">Agarrar trofeos centro</field>
		  <statement name="STACK">
			<block type="Repetir" id="234">
			  <value name="count">
				<shadow type="required_value" id="3X2Cpvbi#Hn5^7|zMava"></shadow>
				<block type="math_number" id="235">
				  <field name="NUM">2</field>
				</block>
			  </value>
			  <statement name="block">
				<shadow type="required_statement" id="5E3p3kj!QPD[LEQHJGO*"></shadow>
				<block type="MoverA" id="210">
				  <value name="direccion">
					<shadow type="required_value" id="#GOy+C3;J^$OPq3E@tU/"></shadow>
					<block type="ParaAbajo" id="241"></block>
				  </value>
				</block>
			  </statement>
			  <next>
				<block type="procedures_callnoreturn" id="257">
				  <mutation name="Agarrar trofeos hacia">
					<arg name="cantidad = 3"></arg>
					<arg name="direccion = abajo"></arg>
				  </mutation>
				  <value name="ARG0">
					<shadow xmlns="" type="required_value"/>
					<block type="math_number" id="269">
					  <field name="NUM">4</field>
					</block>
				  </value>
				  <value name="ARG1">
					<shadow xmlns="" type="required_value"/>
					<block type="ParaLaDerecha" id="263"></block>
				  </value>
				</block>
			  </next>
			</block>
		  </statement>
		</block>
	  </xml>`,
	  skip: true
	});

});
