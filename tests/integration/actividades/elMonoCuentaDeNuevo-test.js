import {moduloActividad, actividadTest} from '../../helpers/actividadTest';
import actividad from 'pilas-engine-bloques/actividades/actividadElMonoCuentaDeNuevo';

moduloActividad(actividad);

actividadTest(actividad, {
	solucion: '',
});
