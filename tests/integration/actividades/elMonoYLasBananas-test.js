import {moduloActividad, actividadTest} from '../../helpers/actividadTest';
import actividad from 'pilas-engine-bloques/actividades/actividadElMonoYLasBananas';

moduloActividad(actividad);

actividadTest(actividad, {
	solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="16" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="Avanzar" id="19"><next><block type="procedures_callnoreturn" id="31"><mutation name="Comer banana si hay"></mutation></block></next></block></statement></block><block type="procedures_defnoreturn" id="21" x="416" y="9"><mutation></mutation><field name="NAME">Comer banana si hay</field><statement name="STACK"><block type="si" id="23" inline="true"><value name="condition"><block type="tocandoBanana" id="25"></block></value><statement name="block"><block type="ComerBanana" id="28"></block></statement></block></statement></block></xml>',
});
