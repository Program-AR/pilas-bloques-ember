import {AccionBuilder,Procedimiento,Repetir,Si,Sino,Hasta} from 'pilas-engine-bloques/actividades/bloques';
import {Numero,OpAritmetica} from 'pilas-engine-bloques/actividades/expresiones';

var CambiarColor = AccionBuilder.build({
  descripcion: 'Cambiar Color',
  id: 'cambiarColor',
  icono: 'icono.cambiar.color.png',
  comportamiento: 'CambiarColor',
  argumentos: '{}',
});

var SiguienteFoco = AccionBuilder.build({
  descripcion: 'Siguiente Foco',
  id: 'siguienteFoco',
  icono: '../../iconos/derecha.png',
  comportamiento: 'MoverACasillaDerecha',
  argumentos: '{}',
});

var EmpezarFiesta = AccionBuilder.build({
  descripcion: 'Empezar Fiesta',
  id: 'empezarFiesta',
  icono: 'icono.empezar.fiesta.png',
  comportamiento: 'EmpezarFiesta',
  argumentos: '{}',
});

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

  bloques: [Procedimiento,Repetir,Si,Sino,Hasta,Numero,OpAritmetica, CambiarColor, SiguienteFoco, EmpezarFiesta],
};
