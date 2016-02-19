import {moduloActividad, actividadTest} from '../../helpers/actividadTest';
import actividad from 'pilas-engine-bloques/actividades/actividadElGatoEnLaCalle';

moduloActividad(actividad);

actividadTest(actividad, {
	solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="Avanzar" id="19"><next><block type="Saludar" id="10"><next><block type="procedures_callnoreturn" id="132"><mutation name="dormirse"></mutation><next><block type="procedures_callnoreturn" id="128"><mutation name="despertarse"></mutation><next><block type="Volver" id="96"></block></next></block></next></block></next></block></next></block></statement></block><block type="procedures_defnoreturn" id="48" x="251" y="64"><mutation></mutation><field name="NAME">dormirse</field><statement name="STACK"><block type="Acostarse" id="60"><next><block type="Cerrarojos" id="78"><next><block type="Soar" id="87"></block></next></block></next></block></statement></block><block type="procedures_defnoreturn" id="51" x="254" y="241"><mutation></mutation><field name="NAME">despertarse</field><statement name="STACK"><block type="Pararse" id="69"><next><block type="Abrirojos" id="29"></block></next></block></statement></block></xml>',
});

actividadTest(actividad, {
	descripcionAdicional: 'Puedo acostarme y pararme varias veces idem ojos',
	solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="105" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="Cerrarojos" id="155"><next><block type="Abrirojos" id="164"><next><block type="Cerrarojos" id="173"><next><block type="Abrirojos" id="182"><next><block type="Acostarse" id="191"><next><block type="Pararse" id="200"><next><block type="Acostarse" id="209"></block></next></block></next></block></next></block></next></block></next></block></next></block></statement></block></xml>',
});

actividadTest(actividad, {
	descripcionAdicional: 'da error al intentar cerrar ojos dos veces',
	solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="2" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="Cerrarojos" id="95"><next><block type="Cerrarojos" id="104"></block></next></block></statement></block><block type="procedures_defnoreturn" id="8" x="251" y="64"><mutation></mutation><field name="NAME">dormirse</field><statement name="STACK"><block type="Acostarse" id="9"><next><block type="Cerrarojos" id="10"><next><block type="Soar" id="11"></block></next></block></next></block></statement></block><block type="procedures_defnoreturn" id="12" x="254" y="241"><mutation></mutation><field name="NAME">despertarse</field><statement name="STACK"><block type="Pararse" id="13"><next><block type="Abrirojos" id="14"></block></next></block></statement></block></xml>',
	expectedErrorMsg: 'No puedo, ya estoy con los ojos cerrados',
});

actividadTest(actividad, {
	descripcionAdicional: 'da error al intentar abrir ojos dos veces',
	solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="2" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="Abrirojos" id="77"><next><block type="Abrirojos" id="86"></block></next></block></statement></block><block type="procedures_defnoreturn" id="8" x="251" y="64"><mutation></mutation><field name="NAME">dormirse</field><statement name="STACK"><block type="Acostarse" id="9"><next><block type="Cerrarojos" id="10"><next><block type="Soar" id="11"></block></next></block></next></block></statement></block><block type="procedures_defnoreturn" id="12" x="254" y="241"><mutation></mutation><field name="NAME">despertarse</field><statement name="STACK"><block type="Pararse" id="13"><next><block type="Abrirojos" id="14"></block></next></block></statement></block></xml>',
	expectedErrorMsg: 'No puedo, ya estoy con los ojos abiertos',
});

actividadTest(actividad, {
	descripcionAdicional: 'da error al intentar pararse dos veces',
	solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="2" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="Pararse" id="59"><next><block type="Pararse" id="68"></block></next></block></statement></block><block type="procedures_defnoreturn" id="8" x="251" y="64"><mutation></mutation><field name="NAME">dormirse</field><statement name="STACK"><block type="Acostarse" id="9"><next><block type="Cerrarojos" id="10"><next><block type="Soar" id="11"></block></next></block></next></block></statement></block><block type="procedures_defnoreturn" id="12" x="254" y="241"><mutation></mutation><field name="NAME">despertarse</field><statement name="STACK"><block type="Pararse" id="13"><next><block type="Abrirojos" id="14"></block></next></block></statement></block></xml>',
	expectedErrorMsg: 'No puedo, ya estoy parado',
});

actividadTest(actividad, {
	descripcionAdicional: 'da error al intentar acostarse dos veces',
	solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="2" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="Acostarse" id="41"><next><block type="Acostarse" id="50"></block></next></block></statement></block><block type="procedures_defnoreturn" id="8" x="251" y="64"><mutation></mutation><field name="NAME">dormirse</field><statement name="STACK"><block type="Acostarse" id="9"><next><block type="Cerrarojos" id="10"><next><block type="Soar" id="11"></block></next></block></next></block></statement></block><block type="procedures_defnoreturn" id="12" x="254" y="241"><mutation></mutation><field name="NAME">despertarse</field><statement name="STACK"><block type="Pararse" id="13"><next><block type="Abrirojos" id="14"></block></next></block></statement></block></xml>',
	expectedErrorMsg: 'No puedo, ya estoy acostado',
});

actividadTest(actividad, {
	descripcionAdicional: 'da error al intentar pararse al principio',
	solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="105" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="Pararse" id="244"></block></statement></block></xml>',
	expectedErrorMsg: 'No puedo, ya estoy parado',
});