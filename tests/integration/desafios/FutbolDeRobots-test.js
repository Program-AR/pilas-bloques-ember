import {moduloActividad, actividadTest} from '../../helpers/actividadTest';

const nombre = 'FutbolRobots';

moduloActividad(nombre);

actividadTest(nombre, {
	solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="repetir" id="14" inline="true"><value name="count"><block type="math_number" id="15"><field name="NUM">7</field></block></value><statement name="block"><block type="procedures_callnoreturn" id="95"><mutation name="Hacer gol"></mutation><next><block type="procedures_callnoreturn" id="99"><mutation name="Volver al inicio"></mutation><next><block type="SiguienteFila" id="87"></block></next></block></next></block></statement><next><block type="procedures_callnoreturn" id="107"><mutation name="Hacer gol"></mutation></block></next></block></statement></block><block type="procedures_defnoreturn" id="21" x="217" y="61"><mutation></mutation><field name="NAME">Hacer gol</field><statement name="STACK"><block type="hasta" id="33" inline="true"><value name="condition"><block type="tocandoPelota" id="70"></block></value><statement name="block"><block type="MoverACasillaDerecha" id="54"></block></statement><next><block type="PatearPelota" id="75"></block></next></block></statement></block><block type="procedures_defnoreturn" id="24" x="6" y="235"><mutation></mutation><field name="NAME">Volver al inicio</field><statement name="STACK"><block type="hasta" id="42" inline="true"><value name="condition"><block type="tocandoInicio" id="62"></block></value><statement name="block"><block type="MoverACasillaIzquierda" id="59"></block></statement></block></statement></block></xml>',
});
