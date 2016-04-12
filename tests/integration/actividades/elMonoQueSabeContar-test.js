import {moduloActividad, actividadTest} from '../../helpers/actividadTest';
import actividad from 'pilas-engine-bloques/actividades/actividadElMonoQueSabeContar';

moduloActividad(actividad);

actividadTest(actividad, {
	solucion: '',
});
