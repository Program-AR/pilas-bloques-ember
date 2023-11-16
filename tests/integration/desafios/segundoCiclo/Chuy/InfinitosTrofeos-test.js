import { moduloActividad, actividadTest } from '../../../../helpers/actividadTest';

const nombre = "InfinitosTrofeos";

moduloActividad(nombre, () => {

	actividadTest(nombre, {
		solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
		<variables>
		  <variable type="math_number" id=".~:L;MZH3#_ch^(xj6@4">cantidad</variable>
		</variables>
		<block type="al_empezar_a_ejecutar" id="115" deletable="false" movable="false" editable="false" x="0" y="0">
		  <statement name="program">
			<shadow type="required_statement" id="oDul2_6$rV7|OIOxg0l"></shadow>
			<block type="procedures_callnoreturn" id="308">
			  <mutation name="Agarrar trofeos hacia">
				<arg name="cantidad"></arg>
				<arg name="direccion"></arg>
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
					<arg name="cantidad"></arg>
					<arg name="direccion"></arg>
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
						<arg name="cantidad"></arg>
						<arg name="direccion"></arg>
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
							<arg name="cantidad"></arg>
							<arg name="direccion"></arg>
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
			<arg name="cantidad"></arg>
			<arg name="direccion"></arg>
		  </mutation>
		  <field name="NAME">Agarrar trofeos hacia</field>
		  <field name="ARG0">cantidad</field>
		  <field name="ARG1">direccion</field>
		  <statement name="STACK">
			<block type="MoverA" id="323">
				<value name="direccion">
					<block type="param_get" id="261a">
					<field name="VAR">direccion</field>
					</block>
				</value>
			  <next>
				<block type="Repetir" id="141">
				  <value name="count">
					<block type="param_get" id="26">
						<field name="VAR">cantidad</field>
					</block>
				  </value>
				  <statement name="block">
					<shadow type="required_statement" id="##,3~5b4!+Se54x#ge.D"></shadow>
					<block type="RecogerTrofeo" id="160">
					  <next>
						<block type="MoverA" id="157">
							<value name="direccion">
								<block type="param_get" id="261b">
								<field name="VAR">direccion</field>
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
				<shadow type="required_value" id="D4m!h{+@gO2c1BrzkTMp"></shadow>
				<block type="math_number" id="235">
				  <field name="NUM">2</field>
				</block>
			  </value>
			  <statement name="block">
				<shadow type="required_statement" id="%,0:y*ZK+a_07o*/D~1V"></shadow>
				<block type="MoverA" id="210">
				  <value name="direccion">
					<shadow type="required_value" id="K[WegV(@8ZcHAa[08c4)"></shadow>
					<block type="ParaAbajo" id="241"></block>
				  </value>
				</block>
			  </statement>
			  <next>
				<block type="procedures_callnoreturn" id="257">
				  <mutation name="Agarrar trofeos hacia">
					<arg name="cantidad"></arg>
					<arg name="direccion"></arg>
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
	  </xml>`
	});

});
