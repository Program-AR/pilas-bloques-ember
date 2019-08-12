import { moduloActividad, actividadTest } from '../../helpers/actividadTest';

const nombre = 'TresNaranjas';

moduloActividad(nombre, () => {

	actividadTest(nombre, {
		solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="2" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="Repetir" id="3" inline="true"><value name="count"><block type="math_number" id="4"><field name="NUM">3</field></block></value><statement name="block"><block type="MoverACasillaDerecha" id="5"><next><block type="Si" id="6" inline="true"><value name="condition"><block type="TocandoNaranja" id="7"></block></value><statement name="block"><block type="ComerNaranja" id="8"></block></statement></block></next></block></statement></block></statement></block></xml>',
	});

	actividadTest(nombre, {
		descripcionAdicional: 'No debe marcar actividad resuelta si todavía no llegué al final',
		solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="2" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="Repetir" id="3" inline="true"><value name="count"><block type="math_number" id="4"><field name="NUM">2</field></block></value><statement name="block"><block type="MoverACasillaDerecha" id="5"><next><block type="si" id="6" inline="true"><value name="condition"><block type="TocandoNaranja" id="7"></block></value><statement name="block"><block type="ComerNaranja" id="8"></block></statement></block></next></block></statement></block></statement></block></xml>',
		resuelveDesafio: false,
	});

	actividadTest(nombre, {
		descripcionAdicional: 'Da error al querer avanzar hacia la derecha cuando ya no hay camino',
		solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="2" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="Repetir" id="3" inline="true"><value name="count"><block type="math_number" id="4"><field name="NUM">4</field></block></value><statement name="block"><block type="MoverACasillaDerecha" id="5"><next><block type="si" id="6" inline="true"><value name="condition"><block type="TocandoNaranja" id="7"></block></value><statement name="block"><block type="ComerNaranja" id="8"></block></statement></block></next></block></statement></block></statement></block></xml>',
		errorEsperado: 'No puedo ir para la derecha',
	});

	actividadTest(nombre, {
		descripcionAdicional: 'Al tener un bloque con un id que contenga el caracter $, deberia funcionar correctamente',
		solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="|6JNA2=.$0V+DuSa+qbd" deletable="false" movable="false" editable="false" x="15" y="15"><statement name="program"><block type="MoverACasillaDerecha" id="%eFKw~*o-wfmLXO6!mj-"><next><block type="procedures_callnoreturn" id="AYf_-:#ke?O[B%eSMVbF"><mutation name="COMER NARANJA SI HAY"></mutation></block></next></block></statement></block><block type="procedures_defnoreturn" id="FMF7V%|312bV)g_h5D9$" x="310" y="26"><field name="NAME">COMER NARANJA SI HAY</field><comment pinned="false" h="80" w="160">Describe esta funcin...</comment><statement name="STACK"><block type="Si" id="Cvp$!KL$T-SjO2Y?kp/e"><value name="condition"><block type="TocandoNaranja" id="UV9d54{l/1o.jiYP+p@5"></block></value><statement name="block"><block type="ComerNaranja" id="dJ5?cn([fcvs%EZr~DEO"></block></statement></block></statement></block></xml>',
		resuelveDesafio: false,
	});

});