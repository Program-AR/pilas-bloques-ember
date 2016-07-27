import {moduloActividad, actividadTest} from '../../helpers/actividadTest';

const nombre = "ElMonoYLasBananas";

moduloActividad(nombre);

actividadTest(nombre, {
	solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="25" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="Avanzar" id="26"><next><block type="procedures_callnoreturn" id="40"><mutation name="Comer banana si hay"></mutation></block></next></block></statement></block><block type="procedures_defnoreturn" id="32" x="-11" y="110"><mutation></mutation><field name="NAME">Comer banana si hay</field><statement name="STACK"><block type="si" id="27" inline="true"><value name="condition"><block type="Tocandobanana" id="28"></block></value><statement name="block"><block type="Comerbanana" id="29"></block></statement></block></statement></block></xml>',
});
