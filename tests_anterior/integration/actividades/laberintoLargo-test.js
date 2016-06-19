import {moduloActividad, actividadTest} from '../../helpers/actividadTest';
import actividad from 'pilas-engine-bloques/actividades/actividadLaberintoLargo';

moduloActividad(actividad);

actividadTest(actividad, {
	solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="repetir" id="88" inline="true"><value name="count"><block type="math_number" id="89"><field name="NUM">14</field></block></value><statement name="block"><block type="sino" id="10" inline="true"><value name="condition"><block type="TocandoAbajo" id="24"></block></value><statement name="block1"><block type="MoverACasillaAbajo" id="27"></block></statement><statement name="block2"><block type="MoverACasillaDerecha" id="55"></block></statement></block></statement></block></statement></block></xml>',
});

actividadTest(actividad, {
	descripcionAdicional: 'Da error al querer avanzar hacia la derecha cuando ya no hay camino',
	solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="repetir" id="88" inline="true"><value name="count"><block type="math_number" id="89"><field name="NUM">15</field></block></value><statement name="block"><block type="sino" id="10" inline="true"><value name="condition"><block type="TocandoAbajo" id="24"></block></value><statement name="block1"><block type="MoverACasillaAbajo" id="27"></block></statement><statement name="block2"><block type="MoverACasillaDerecha" id="55"></block></statement></block></statement></block></statement></block></xml>',
	expectedErrorMsg: 'No puedo ir para la derecha',
});
