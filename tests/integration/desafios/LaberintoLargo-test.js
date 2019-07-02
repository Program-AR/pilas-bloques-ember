import { moduloActividad, actividadTest } from '../../helpers/actividadTest';

const nombre = 'LaberintoLargo';

moduloActividad(nombre, () => {

	actividadTest(nombre, {
		solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="Repetir" id="88" inline="true"><value name="count"><block type="math_number" id="89"><field name="NUM">14</field></block></value><statement name="block"><block type="SiNo" id="10" inline="true"><value name="condition"><block type="TocandoAbajo" id="24"></block></value><statement name="block1"><block type="MoverACasillaAbajo" id="27"></block></statement><statement name="block2"><block type="MoverACasillaDerecha" id="55"></block></statement></block></statement></block></statement></block></xml>',
	});

	actividadTest(nombre, {
		descripcionAdicional: 'Da error al querer avanzar hacia la derecha cuando ya no hay camino',
		solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="2" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="Repetir" id="3" inline="true"><value name="count"><block type="math_number" id="4"><field name="NUM">14</field></block></value><statement name="block"><block type="SiNo" id="5" inline="true"><value name="condition"><block type="TocandoAbajo" id="6"></block></value><statement name="block1"><block type="MoverACasillaAbajo" id="7"></block></statement><statement name="block2"><block type="MoverACasillaDerecha" id="8"></block></statement></block></statement><next><block type="MoverACasillaDerecha" id="11"></block></next></block></statement></block></xml>',
		errorEsperado: 'No puedo ir para la derecha',
	});

	actividadTest(nombre, {
		descripcionAdicional: 'Debe dar error si se intenta preguntar en la meta final',
		solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="11" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="Repetir" id="12" inline="true"><value name="count"><block type="math_number" id="13"><field name="NUM">14</field></block></value><statement name="block"><block type="si" id="20" inline="true"><value name="condition"><block type="TocandoAbajo" id="15"></block></value><statement name="block"><block type="MoverACasillaAbajo" id="16"></block></statement><next><block type="si" id="23" inline="true"><value name="condition"><block type="TocandoDerecha" id="34"></block></value><statement name="block"><block type="MoverACasillaDerecha" id="17"></block></statement></block></next></block></statement></block></statement></block></xml>',
		errorEsperado: 'No se puede preguntar más, ya estoy al final del camino',
	});

});