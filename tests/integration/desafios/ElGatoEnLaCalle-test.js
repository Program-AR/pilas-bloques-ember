import { moduloActividad, actividadTest } from '../../helpers/actividadTest';

const nombre = "ElGatoEnLaCalle";

moduloActividad(nombre, () => {

	actividadTest(nombre, {
		solucion: `
	<xml xmlns="http://www.w3.org/1999/xhtml">
		<block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="0" y="0">
			<statement name="program">
				<block type="Avanzar" id="33">
					<next>
						<block type="procedures_callnoreturn" id="53">
							<mutation name="dormirse"></mutation>
							<next>
								<block type="procedures_callnoreturn" id="99">
									<mutation name="despertarse"></mutation>
									<next>
										<block type="Saludar" id="117">
											<next>
												<block type="Volver" id="126"></block>
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
		<block type="procedures_defnoreturn" id="74" x="476" y="134">
			<mutation></mutation>
			<field name="NAME">despertarse</field>
			<statement name="STACK">
				<block type="AbrirOjos" id="83">
					<next>
						<block type="Pararse" id="108"></block>
					</next>
				</block>
			</statement>
		</block>
		<block type="procedures_defnoreturn" id="3" x="209" y="190">
			<mutation></mutation>
			<field name="NAME">dormirse</field>
			<statement name="STACK">
				<block type="Acostarse" id="42">
					<next>
						<block type="CerrarOjos" id="62">
							<next>
								<block type="Soniar" id="71"></block>
							</next>
						</block>
					</next>
				</block>
			</statement>
		</block>
	</xml>
	`,
	});

	actividadTest(nombre, {
		descripcionAdicional: 'Invirtiendo acciones sigue funcionando la solución',
		solucion: `
	<xml xmlns="http://www.w3.org/1999/xhtml">
	<block type="al_empezar_a_ejecutar" id="16" deletable="false" movable="false" editable="false" x="0" y="0">
		<statement name="program">
			<block type="Avanzar" id="17">
				<next>
					<block type="procedures_callnoreturn" id="18">
						<mutation name="dormirse"></mutation>
						<next>
							<block type="procedures_callnoreturn" id="19">
								<mutation name="despertarse"></mutation>
								<next>
									<block type="Saludar" id="20">
										<next>
											<block type="Volver" id="21"></block>
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
	<block type="procedures_defnoreturn" id="22" x="476" y="134">
		<mutation></mutation>
		<field name="NAME">despertarse</field>
		<statement name="STACK">
			<block type="Pararse" id="24">
				<next>
					<block type="AbrirOjos" id="23"></block>
				</next>
			</block>
		</statement>
	</block>
	<block type="procedures_defnoreturn" id="25" x="209" y="190">
		<mutation></mutation>
		<field name="NAME">dormirse</field>
		<statement name="STACK">
			<block type="CerrarOjos" id="27">
				<next>
					<block type="Acostarse" id="26">
						<next>
							<block type="Soniar" id="28"></block>
						</next>
					</block>
				</next>
			</block>
		</statement>
	</block>
</xml>
`
	});

	actividadTest(nombre, {
		descripcionAdicional: 'Puedo acostarme y pararme varias veces idem ojos',
		solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="105" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="CerrarOjos" id="155"><next><block type="AbrirOjos" id="164"><next><block type="CerrarOjos" id="173"><next><block type="AbrirOjos" id="182"><next><block type="Acostarse" id="191"><next><block type="Pararse" id="200"><next><block type="Acostarse" id="209"></block></next></block></next></block></next></block></next></block></next></block></next></block></statement></block></xml>',
		resuelveDesafio: false,
	});

	actividadTest(nombre, {
		descripcionAdicional: 'da error al intentar cerrar ojos dos veces',
		solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="39" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="CerrarOjos" id="40"><next><block type="CerrarOjos" id="41"></block></next></block></statement></block></xml>',
		errorEsperado: 'No puedo, ya estoy con los ojos cerrados',
	});

	actividadTest(nombre, {
		descripcionAdicional: 'da error al intentar abrir ojos dos veces',
		solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="19" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="CerrarOjos" id="38"><next><block type="AbrirOjos" id="20"><next><block type="AbrirOjos" id="21"></block></next></block></next></block></statement></block></xml>',
		errorEsperado: 'No puedo, ya estoy con los ojos abiertos',
	});

	actividadTest(nombre, {
		descripcionAdicional: 'da error al intentar pararse dos veces',
		solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="57" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="Acostarse" id="75"><next><block type="Pararse" id="58"><next><block type="Pararse" id="59"></block></next></block></next></block></statement></block></xml>',
		errorEsperado: 'No puedo, ya estoy parado',
	});

	actividadTest(nombre, {
		descripcionAdicional: 'da error al intentar acostarse dos veces',
		solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="76" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="Acostarse" id="77"><next><block type="Acostarse" id="78"></block></next></block></statement></block></xml>',
		errorEsperado: 'No puedo, ya estoy acostado',
	});

	actividadTest(nombre, {
		descripcionAdicional: 'da error al intentar pararse al principio',
		solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="105" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="Pararse" id="244"></block></statement></block></xml>',
		errorEsperado: 'No puedo, ya estoy parado',
	});

});