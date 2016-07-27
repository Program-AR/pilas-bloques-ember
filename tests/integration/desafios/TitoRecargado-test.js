import {moduloActividad, actividadTest} from '../../helpers/actividadTest';

const nombre = 'TitoRecargado';

moduloActividad(nombre);

actividadTest(nombre, {
	solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="2" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="repetir" id="13" inline="true"><value name="count"><block type="math_number" id="14"><field name="NUM">6</field></block></value><statement name="block"><block type="procedures_callnoreturn" id="25"><mutation name="Prender si es luz"></mutation><next><block type="MoverACasillaAbajo" id="22"></block></next></block></statement></block></statement></block><block type="procedures_defnoreturn" id="4" x="445" y="11"><mutation></mutation><field name="NAME">Prender si es luz</field><statement name="STACK"><block type="si" id="9" inline="true"><value name="condition"><block type="tocandoLuz" id="16"></block></value><statement name="block"><block type="EncenderLuz" id="19"></block></statement></block></statement></block></xml>',
});
