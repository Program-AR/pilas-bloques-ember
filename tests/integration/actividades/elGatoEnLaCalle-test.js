import {moduloActividad, actividadTest} from '../../helpers/actividadTest';
import actividad from 'pilas-engine-bloques/actividades/actividadElGatoEnLaCalle';

moduloActividad(actividad);

actividadTest(actividad, {
	solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="52" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="Saludar" id="61"></block></statement></block></xml>',
});