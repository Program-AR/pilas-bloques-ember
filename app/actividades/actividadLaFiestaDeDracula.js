import {AccionBuilder,Procedimiento,Repetir,Si,Sino,Hasta} from 'pilas-engine-bloques/actividades/bloques';
import {Numero,OpAritmetica} from 'pilas-engine-bloques/actividades/expresiones';



export default {
  nombre: 'La fiesta de Drácula',
  id: 'LaFiestaDeDracula',
  enunciado: 'A definir.',
  consignaInicial: 'A definir.',

  /*global LaFiestaDeDracula */
  escena: LaFiestaDeDracula,
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,

  bloques: [Procedimiento,Repetir,Si,Sino,Hasta,Numero,OpAritmetica],
};
