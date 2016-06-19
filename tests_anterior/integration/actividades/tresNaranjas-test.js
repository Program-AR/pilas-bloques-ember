import {moduloActividad, actividadTest} from '../../helpers/actividadTest';
import actividad from 'pilas-engine-bloques/actividades/actividadTresNaranjas';

moduloActividad(actividad);

actividadTest(actividad, {
	solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="2" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="repetir" id="3" inline="true"><value name="count"><block type="math_number" id="4"><field name="NUM">3</field></block></value><statement name="block"><block type="MoverACasillaDerecha" id="5"><next><block type="si" id="6" inline="true"><value name="condition"><block type="TocandoNaranja" id="7"></block></value><statement name="block"><block type="ComerNaranja" id="8"></block></statement></block></next></block></statement></block></statement></block></xml>',
});

actividadTest(actividad, {
	descripcionAdicional: 'Da error al querer avanzar hacia la derecha cuando ya no hay camino',
	solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="2" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="repetir" id="3" inline="true"><value name="count"><block type="math_number" id="4"><field name="NUM">4</field></block></value><statement name="block"><block type="MoverACasillaDerecha" id="5"><next><block type="si" id="6" inline="true"><value name="condition"><block type="TocandoNaranja" id="7"></block></value><statement name="block"><block type="ComerNaranja" id="8"></block></statement></block></next></block></statement></block></statement></block></xml>',
	expectedErrorMsg: 'No puedo ir para la derecha',
});

