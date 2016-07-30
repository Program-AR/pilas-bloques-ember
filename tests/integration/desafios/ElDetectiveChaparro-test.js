import {moduloActividad, actividadTest} from '../../helpers/actividadTest';

const nombre = "ElDetectiveChaparro";

moduloActividad(nombre);

actividadTest(nombre, {
	solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="2" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="Primersospechoso" id="3"><next><block type="Sacardisfraz" id="8"><next><block type="hasta" id="4" inline="true"><value name="condition"><block type="Descubralculpable" id="5"></block></value><statement name="block"><block type="Siguientesospechoso" id="7"><next><block type="Sacardisfraz" id="6"></block></next></block></statement></block></next></block></next></block></statement></block></xml>',
});
