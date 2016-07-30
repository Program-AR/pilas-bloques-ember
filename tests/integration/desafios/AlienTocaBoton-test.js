import {moduloActividad, actividadTest} from '../../helpers/actividadTest';

const nombre = 'AlienTocaBoton';

moduloActividad(nombre);

actividadTest(nombre, {
	solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="MoverACasillaDerecha" id="4"><next><block type="MoverACasillaDerecha" id="7"><next><block type="MoverACasillaDerecha" id="10"><next><block type="ApretarBoton" id="13"></block></next></block></next></block></next></block></statement></block></xml>',
});

actividadTest(nombre, {
	descripcionAdicional: 'Da error al querer apretar botón cuando no hay',
	solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="21" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="ApretarBoton" id="24"></block></statement></block></xml>',
	errorEsperado: 'No hay un botón aquí',
});

actividadTest(nombre, {
	descripcionAdicional: 'Da error al querer avanzar hacia la derecha cuando ya no hay camino',
	solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="21" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="MoverACasillaDerecha" id="39"><next><block type="MoverACasillaDerecha" id="36"><next><block type="MoverACasillaDerecha" id="27"><next><block type="MoverACasillaDerecha" id="33"></block></next></block></next></block></next></block></statement></block></xml>',
	errorEsperado: 'No puedo ir para la derecha',
});
