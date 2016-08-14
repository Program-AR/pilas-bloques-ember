import {moduloActividad, actividadTest} from '../../helpers/actividadTest';

const nombre = "ElGatoEnLaCalle";

moduloActividad(nombre);

actividadTest(nombre, {
	solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="10" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="Avanzar" id="11"><next><block type="Saludar" id="12"><next><block type="procedures_callnoreturn" id="13"><mutation name="dormirse"></mutation><next><block type="procedures_callnoreturn" id="14"><mutation name="despertarse"></mutation><next><block type="Volver" id="15"></block></next></block></next></block></next></block></next></block></statement></block><block type="procedures_defnoreturn" id="16" x="251" y="64"><mutation></mutation><field name="NAME">dormirse</field><statement name="STACK"><block type="Acostarse" id="17"><next><block type="Cerrarojos" id="18"><next><block type="Soar" id="19"></block></next></block></next></block></statement></block><block type="procedures_defnoreturn" id="20" x="254" y="241"><mutation></mutation><field name="NAME">despertarse</field><statement name="STACK"><block type="Abrirojos" id="22"><next><block type="Pararse" id="21"></block></next></block></statement></block></xml>',
});

actividadTest(nombre, {
	descripcionAdicional: 'Puedo acostarme y pararme varias veces idem ojos',
	solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="105" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="Cerrarojos" id="155"><next><block type="Abrirojos" id="164"><next><block type="Cerrarojos" id="173"><next><block type="Abrirojos" id="182"><next><block type="Acostarse" id="191"><next><block type="Pararse" id="200"><next><block type="Acostarse" id="209"></block></next></block></next></block></next></block></next></block></next></block></next></block></statement></block></xml>',
});

actividadTest(nombre, {
	descripcionAdicional: 'da error al intentar cerrar ojos dos veces',
	solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="39" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="Cerrarojos" id="40"><next><block type="Cerrarojos" id="41"></block></next></block></statement></block></xml>',
	errorEsperado: 'No puedo, ya estoy con los ojos cerrados',
});

actividadTest(nombre, {
	descripcionAdicional: 'da error al intentar abrir ojos dos veces',
	solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="19" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="Cerrarojos" id="38"><next><block type="Abrirojos" id="20"><next><block type="Abrirojos" id="21"></block></next></block></next></block></statement></block></xml>',
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
