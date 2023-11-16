import { moduloActividad, actividadTest } from '../../../../helpers/actividadTest';

const nombre = "InfinitosTrofeos";

moduloActividad(nombre, () => {

	actividadTest(nombre, {
		solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
			<block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="0" y="0">
				<statement name="program">
					<block type="procedures_callnoreturn" inline="true">
						<mutation name="Agarrar trofeos hacia">
							<arg name="cantidad"></arg>
							<arg name="direccion"></arg>
						</mutation>
						<value name="ARG0">
							<block type="math_number">
								<field name="NUM">4</field>
							</block>
						</value>
						<value name="ARG1">
							<block type="ParaLaDerecha"></block>
						</value>
						<next>
							<block type="procedures_callnoreturn" inline="true">
								<mutation name="Agarrar trofeos hacia">
									<arg name="cantidad"></arg>
									<arg name="direccion"></arg>
								</mutation>
								<value name="ARG0">
									<block type="math_number">
										<field name="NUM">3</field>
									</block>
								</value>
								<value name="ARG1">
									<block type="ParaAbajo"></block>
								</value>
								<next>
								<block type="procedures_callnoreturn" inline="true">
								<mutation name="Agarrar trofeos hacia">
									<arg name="cantidad"></arg>
									<arg name="direccion"></arg>
								</mutation>
								<value name="ARG0">
									<block type="math_number">
										<field name="NUM">4</field>
									</block>
								</value>
								<value name="ARG1">
									<block type="ParaLaIzquierda"></block>
								</value>
								<next>
								<block type="procedures_callnoreturn" inline="true">
								<mutation name="Agarrar trofeos hacia">
									<arg name="cantidad"></arg>
									<arg name="direccion"></arg>
								</mutation>
								<value name="ARG0">
									<block type="math_number">
										<field name="NUM">3</field>
									</block>
								</value>
								<value name="ARG1">
									<block type="ParaArriba"></block>
								</value>
								<next>
								<block type="procedures_callnoreturn">
									<mutation name="Agarrar trofeos centro">
									</mutation>
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
			<block type="procedures_defnoreturn" x="20" y="230">
				<mutation>
					<arg name="cantidad"></arg>
					<arg name="direccion"></arg>
				</mutation>
				<field name="NAME">Agarrar trofeos hacia</field>
				<statement name="STACK">
					<block type="MoverA" inline="true">
						<value name="direccion">
							<block type="param_get">
								<field name="VAR">direccion</field>
							</block>
						</value>
						<next>
						<block type="Repetir" inline="true">
							<value name="count">
								<block type="param_get">
									<field name="VAR">cantidad</field>
								</block>
							</value>
							<statement name="block">
								<block type="RecogerTrofeo">
									<next>
									<block type="MoverA" inline="true">
										<value name="direccion">
											<block type="param_get">
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
			<block type="procedures_defnoreturn" x="40" y="399">
				<mutation></mutation>
				<field name="NAME">Agarrar trofeos centro</field>
				<statement name="STACK">
					<block type="Repetir" inline="true">
						<value name="count">
							<block type="math_number">
								<field name="NUM">2</field>
							</block>
						</value>
						<statement name="block">
							<block type="MoverA" inline="true">
								<value name="direccion">
									<block type="ParaAbajo"></block>
								</value>
							</block>
						</statement>
						<next>
						<block type="procedures_callnoreturn" inline="true">
							<mutation name="Agarrar trofeos hacia">
								<arg name="cantidad"></arg>
								<arg name="direccion"></arg>
							</mutation>
							<value name="ARG0">
								<block type="math_number">
									<field name="NUM">4</field>
								</block>
							</value>
							<value name="ARG1">
								<block type="ParaLaDerecha"></block>
							</value>
						</block>
						</next>
					</block>
				</statement>
			</block>
		</xml>`
	});

});
