import {moduloActividad, actividadTest} from '../../helpers/actividadTest';

const nombre = 'ElSuperviaje';

moduloActividad(nombre);

actividadTest(nombre, {
	solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="repetir" id="26" inline="true"><value name="count"><block type="KmsTotales" id="29"></block></value><statement name="block"><block type="AvanzarKm" id="12"></block></statement></block></statement></block></xml>',
});
