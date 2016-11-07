import {moduloActividad, actividadTest} from '../../helpers/actividadTest';

const nombre = "ElGatoEnLaCalle";

moduloActividad(nombre);

actividadTest(nombre, {
	solucion: '<xml><block y="0" x="0" editable="false" movable="false" deletable="false" id="1" type="al_empezar_a_ejecutar"></block><block y="0" x="0" editable="false" movable="false" deletable="false" id="2" type="al_empezar_a_ejecutar"><statement name="program"><block id="3" type="Avanzar"><next><block id="5" type="procedures_callnoreturn"><mutation name="dormirse"></mutation><next><block id="6" type="procedures_callnoreturn"><mutation name="despertarse"></mutation><next><block id="4" type="Saludar"><next><block id="7" type="Volver"></block></next></block></next></block></next></block></next></block></statement></block><block y="197" x="11" id="8" type="procedures_defnoreturn"><mutation></mutation><field name="NAME">dormirse</field><statement name="STACK"><block id="9" type="Acostarse"><next><block id="10" type="Cerrarojos"><next><block id="11" type="Soar"></block></next></block></next></block></statement></block><block y="333" x="8" id="12" type="procedures_defnoreturn"><mutation></mutation><field name="NAME">despertarse</field><statement name="STACK"><block id="13" type="Abrirojos"><next><block id="14" type="Pararse"></block></next></block></statement></block></xml>',
});

actividadTest(nombre, {
	descripcionAdicional: 'Invirtiendo acciones sigue funcionando la solución',
	solucion: '<xml><block y="0" x="0" editable="false" movable="false" deletable="false" id="1" type="al_empezar_a_ejecutar"></block><block y="0" x="0" editable="false" movable="false" deletable="false" id="11" type="al_empezar_a_ejecutar"></block><block y="0" x="0" editable="false" movable="false" deletable="false" id="12" type="al_empezar_a_ejecutar"><statement name="program"><block id="13" type="Avanzar"><next><block id="14" type="procedures_callnoreturn"><mutation name="dormirse"></mutation><next><block id="15" type="procedures_callnoreturn"><mutation name="despertarse"></mutation><next><block id="16" type="Saludar"><next><block id="17" type="Volver"></block></next></block></next></block></next></block></next></block></statement></block><block y="197" x="11" id="18" type="procedures_defnoreturn"><mutation></mutation><field name="NAME">dormirse</field><statement name="STACK"><block id="20" type="Cerrarojos"><next><block id="19" type="Acostarse"><next><block id="21" type="Soar"><next><block id="33" type="Soar"><next><block id="42" type="Soar"></block></next></block></next></block></next></block></next></block></statement></block><block y="379" x="4" id="22" type="procedures_defnoreturn"><mutation></mutation><field name="NAME">despertarse</field><statement name="STACK"><block id="24" type="Pararse"><next><block id="23" type="Abrirojos"></block></next></block></statement></block></xml>',
});

actividadTest(nombre, {
	descripcionAdicional: 'Puedo acostarme y pararme varias veces idem ojos',
	solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="105" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="Cerrarojos" id="155"><next><block type="Abrirojos" id="164"><next><block type="Cerrarojos" id="173"><next><block type="Abrirojos" id="182"><next><block type="Acostarse" id="191"><next><block type="Pararse" id="200"><next><block type="Acostarse" id="209"></block></next></block></next></block></next></block></next></block></next></block></next></block></statement></block></xml>',
	resuelveDesafio: false,
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
