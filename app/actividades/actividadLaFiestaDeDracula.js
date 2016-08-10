import {AccionBuilder,Procedimiento,Repetir,Si,Sino,Hasta} from 'pilas-engine-bloques/actividades/bloques';
import {Numero,OpAritmetica} from 'pilas-engine-bloques/actividades/expresiones';

var CambiarColor = AccionBuilder.build({
  descripcion: 'Cambiar color del foco',
  id: 'cambiarColor',
  icono: 'icono.cambiar.color.png',
  comportamiento: 'CambiarColor',
  argumentos: '{}',
});

var SiguienteFoco = AccionBuilder.build({
  descripcion: 'Pasar al siguiente foco',
  id: 'siguienteFoco',
  icono: '../../iconos/derecha.png',
  comportamiento: 'MoverACasillaDerecha',
  argumentos: '{}',
});

var EmpezarFiesta = AccionBuilder.build({
  descripcion: 'Empezar fiesta',
  id: 'empezarFiesta',
  icono: 'icono.empezar.fiesta.png',
  comportamiento: 'EmpezarFiesta',
  argumentos: '{idTransicion:"empezarFiesta"}',
});

export default {
  // DEPRECATED: nombre: 'La fiesta de Drácula',
  id: 'LaFiestaDeDracula',
  // DEPRECATED: enunciado: 'Para que la fiesta de Drácula comience debemos cambiar el color de las 3 lámparas una cierta cantidad de veces: 5 veces la primera, 8 la segunda y 12 la tercera.',

  // DEPRECATED: escena: LaFiestaDeDracula,
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,

  bloques: [Procedimiento,Repetir,Si,Sino,Hasta,Numero,OpAritmetica, CambiarColor, SiguienteFoco, EmpezarFiesta],
};
