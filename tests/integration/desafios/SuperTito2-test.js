import {moduloActividad, actividadTest} from '../../helpers/actividadTest';

const nombre = 'SuperTito2';

moduloActividad(nombre);

actividadTest(nombre, {
	solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="76" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="hasta" id="77" inline="true"><value name="condition"><block type="tocandoFinal" id="78"></block></value><statement name="block"><block type="procedures_callnoreturn" id="79"><mutation name="Prender si hay luz"></mutation><next><block type="MoverACasillaAbajo" id="87"></block></next></block></statement></block></statement></block><block type="procedures_defnoreturn" id="81" x="-8" y="184"><mutation></mutation><field name="NAME">Prender si hay luz</field><statement name="STACK"><block type="si" id="82" inline="true"><value name="condition"><block type="tocandoLuz" id="83"></block></value><statement name="block"><block type="EncenderLuz" id="84"></block></statement></block></statement></block></xml>',
});
