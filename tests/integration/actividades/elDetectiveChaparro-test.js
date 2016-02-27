import {moduloActividad, actividadTest} from '../../helpers/actividadTest';
import actividad from 'pilas-engine-bloques/actividades/actividadElDetectiveChaparro';

moduloActividad(actividad);

// Solución esperada. Usa el bloque Repetir
actividadTest(actividad, {
	solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="Primersospechoso" id="5"><next><block type="hasta" id="13" inline="true"><value name="condition"><block type="Descubralculpable" id="19"></block></value><statement name="block"><block type="Sacardisfraz" id="34"><next><block type="Siguientesospechoso" id="38"></block></next></block></statement><next><block type="Sacardisfraz" id="42"></block></next></block></next></block></statement></block></xml>',
});