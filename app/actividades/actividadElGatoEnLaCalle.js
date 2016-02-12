/* globals ElGatoEnLaCalle */
import bloques from 'pilas-engine-bloques/actividades/bloques';

var {AccionBuilder,Procedimiento} = bloques;

var Saludar = AccionBuilder.build({
  descripcion: 'Saludar',
  icono: 'icono.saludar.png',
  comportamiento: 'ComportamientoAnimado',
  argumentos: '{nombreAnimacion: "saludando"}',
});

var AbrirOjos = AccionBuilder.build({
  descripcion: 'Abrir ojos',
  icono: 'icono.abrirOjos.png',
  comportamiento: 'ComportamientoAnimado',
  argumentos: '{nombreAnimacion: "abrirOjos"}',
});

var CerrarOjos = AccionBuilder.build({
  descripcion: 'Cerrar ojos',
  icono: 'icono.cerrarOjos.png',
  comportamiento: 'ComportamientoAnimado',
  argumentos: '{nombreAnimacion: "cerrarOjos"}',
});

var Acostarse = AccionBuilder.build({
  descripcion: 'Acostarse',
  icono: 'icono.acostarse.png',
  comportamiento: 'ModificarRotacionYAltura',
  argumentos: '{alturaIr: -180 ,rotacionIr: 90}',
});

var Pararse = AccionBuilder.build({
  descripcion: 'Pararse',
  icono: 'icono.pararse.png',
  comportamiento: 'ModificarRotacionYAltura',
  argumentos: '{alturaIr: -150 ,rotacionIr: 0}',
});

var Volver = AccionBuilder.build({
  descripcion: 'Volver',
  icono: 'izquierda.png',
  comportamiento: 'ComportamientoAnimado',
  argumentos: '{nombreAnimacion: "volver"}',
});

var Avanzar = AccionBuilder.build({
  descripcion: 'Avanzar',
  icono: 'derecha.png',
  comportamiento: 'ComportamientoAnimado',
  argumentos: '{nombreAnimacion: "correr"}',
});

var Soniar = AccionBuilder.build({
  descripcion: 'Soñar',
  icono: 'icono.soniar.png',
  comportamiento: 'Pensar',
  argumentos: '{mensaje: "ZZzzZzZ..." }',
});

export default {
  nombre: 'El gato en la calle',
  id: 'ElGatoEnLaCalle',
  enunciado: 'Hacé que el gato avance un paso, se duerma, se despierte, salude y vuelva a su lugar.',
  consignaInicial: 'Se pueden crear nuevas acciones en Procedimientos definiendo nuevos bloques que incluyan otras acciones.',

  escena: ElGatoEnLaCalle,
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,
  procedimientos: [Procedimiento],

  // TODO: aca irian atributos iniciales que se desean para un personaje
  variables: [],

  control: [],
  expresiones: [],
  acciones: [Saludar,Avanzar,Volver,AbrirOjos,CerrarOjos,Acostarse,Pararse,Soniar],
  sensores: []
};
