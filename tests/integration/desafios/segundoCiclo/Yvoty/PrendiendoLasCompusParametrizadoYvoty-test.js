import { moduloActividad, actividadTest } from '../../../../helpers/actividadTest';

const nombre = 'PrendiendoLasCompusParametrizadoYvoty';

moduloActividad(nombre, () => {

	actividadTest(nombre, {
		solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
		<variables>
		  <variable type="" id="i0)F?:LYp*zutb,AI.@E">direccion</variable>
		</variables>
		<block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="0" y="0">
		  <statement name="program">
			<shadow type="required_statement" id="C3M/%+fO0x9_T47!*H7-"></shadow>
			<block type="procedures_callnoreturn" id="46">
			  <mutation name="Prender compus hacia">
				<arg name="direccion"></arg>
			  </mutation>
			  <value name="ARG0">
				<shadow xmlns="" type="required_value"/>
				<block type="ParaLaDerecha" id="61"></block>
			  </value>
			  <next>
				<block type="procedures_callnoreturn" id="64">
				  <mutation name="Prender compus hacia">
					<arg name="direccion"></arg>
				  </mutation>
				  <value name="ARG0">
					<shadow xmlns="" type="required_value"/>
					<block type="ParaAbajo" id="72"></block>
				  </value>
				  <next>
					<block type="procedures_callnoreturn" id="77">
					  <mutation name="Prender compus hacia">
						<arg name="direccion"></arg>
					  </mutation>
					  <value name="ARG0">
						<shadow xmlns="" type="required_value"/>
						<block type="ParaLaIzquierda" id="83"></block>
					  </value>
					  <next>
						<block type="procedures_callnoreturn" id="92">
						  <mutation name="Prender compus hacia">
							<arg name="direccion"></arg>
						  </mutation>
						  <value name="ARG0">
							<shadow xmlns="" type="required_value"/>
							<block type="ParaArriba" id="89"></block>
						  </value>
						</block>
					  </next>
					</block>
				  </next>
				</block>
			  </next>
			</block>
		  </statement>
		</block>
		<block type="procedures_defnoreturn" id="18" x="7" y="207">
		  <mutation>
			<arg name="direccion"></arg>
		  </mutation>
		  <field name="NAME">Prender compus hacia</field>
		  <field name="ARG0">direccion</field>
		  <comment pinned="true" h="80" w="160">Describe esta función...</comment>
		  <statement name="STACK">
			<block type="MoverA" id="95">
			  <value name="direccion">
				<shadow type="required_value" id="DJGZT7CJms.URyD+_|Z\`"></shadow>
				<block type="variables_get" id="/][:vGe_g7k=RqDI-cdO">
				  <mutation var="direccion" parent="18"></mutation>
				</block>
			  </value>
			  <next>
				<block type="hasta" id="29">
				  <value name="condition">
					<shadow type="required_value" id="LJWbvl!?gaTI4@@ymkZK"></shadow>
					<block type="EstoyEnEsquina" id="31"></block>
				  </value>
				  <statement name="block">
					<shadow type="required_statement" id="-.Je5-:.=G1ADwqV``pA"></shadow>
					<block type="PrenderComputadora" id="41">
					  <next>
						<block type="MoverA" id="34">
						  <value name="direccion">
							<shadow type="required_value" id="q_!(oY|Q\`Qj*#-#-AUC5"></shadow>
							<block type="variables_get" id="*u9QTaxAdQxHEGsDuN|N">
							  <mutation var="direccion" parent="18"></mutation>
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
	  </xml> 
	`
	});

	actividadTest(nombre, {
		descripcionAdicional: 'Da error si se intenta prender una computadora donde no hay',
		errorEsperado: 'No hay una computadora aquí',
		solucion: `<?xml version="1.0" encoding="UTF-8"?>
							<xml xmlns="http://www.w3.org/1999/xhtml">
   							<variables />
  	 						<block type="al_empezar_a_ejecutar" id="IAu_wXvP7R@SfU%v^Vtk" deletable="false" movable="false" editable="false" x="15" y="15">
      						<statement name="program">
        		 				<block type="PrenderComputadora" id="zcbpp]rCxf0V_fAjI_B," />
      						</statement>
   							</block>
						</xml>`,
	});

	actividadTest(nombre, {
		descripcionAdicional: 'Da error si se intenta prender una computadora que ya esta prendida',
		errorEsperado: 'Esta computadora ya fue prendida',
		solucion: `<?xml version="1.0" encoding="UTF-8"?>
	<xml xmlns="http://www.w3.org/1999/xhtml">
		 <variables />
		 <block type="al_empezar_a_ejecutar" id="i(OI|s9pE2Qvpapiwd/6" deletable="false" movable="false" editable="false" x="15" y="15">
				<statement name="program">
					 <block type="MoverA" id="|]=Mhkm?SiH~~(CmXm5A">
							<value name="direccion">
								 <block type="ParaAbajo" id="G({j[b8r$e.%v_}Y{wri" />
							</value>
							<next>
								 <block type="PrenderComputadora" id="eKE{4Vs^$=VZ;T-Ze!0M">
										<next>
											 <block type="PrenderComputadora" id="hn_h}miHQ6Jo9Ng_t5Zt" />
										</next>
								 </block>
							</next>
					 </block>
				</statement>
		 </block>
	</xml>`,
	});

});