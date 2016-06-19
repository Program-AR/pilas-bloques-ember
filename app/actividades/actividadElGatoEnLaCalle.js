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
  comportamiento: 'AnimarSiNoEstoyYa',
  argumentos: '{nombreAnimacion: "abrirOjos", valorEstar: "con los ojos abiertos", descripcionEstar: "estadoOjos", nombreAnimacionSiguiente: "parado", arrancoAsi:true}',
});

var CerrarOjos = AccionBuilder.build({
  descripcion: 'Cerrar ojos',
  icono: 'icono.cerrarOjos.png',
  comportamiento: 'AnimarSiNoEstoyYa',
  argumentos: '{nombreAnimacion: "cerrarOjos", valorEstar: "con los ojos cerrados", descripcionEstar: "estadoOjos", nombreAnimacionSiguiente: "ojosCerrados"}',
});

var Acostarse = AccionBuilder.build({
  descripcion: 'Acostarse',
  icono: 'icono.acostarse.png',
  comportamiento: 'ModificarRotacionYAltura',
  argumentos: '{alturaIr: -180 ,rotacionIr: 90, nombreAnimacion:"acostado", valorEstar: "acostado", descripcionEstar: "posicionCuerpo"}',
});

var Pararse = AccionBuilder.build({
  descripcion: 'Pararse',
  icono: 'icono.pararse.png',
  comportamiento: 'ModificarRotacionYAltura',
  argumentos: '{alturaIr: -150 ,rotacionIr: 0, nombreAnimacion:"acostado", valorEstar: "parado", descripcionEstar: "posicionCuerpo", arrancoAsi:true}',
});

var Volver = AccionBuilder.build({
  descripcion: 'Volver',
  icono: '../../iconos/izquierda.png',
  comportamiento: 'MovimientoAnimado',
  argumentos: '{direccion: new Direct(-1,0), distancia: 50}',
});

var Avanzar = AccionBuilder.build({
  descripcion: 'Avanzar',
  icono: '../../iconos/derecha.png',
  comportamiento: 'MovimientoAnimado',
  argumentos: '{direccion: new Direct(1,0), distancia: 50}',
});

var Soniar = AccionBuilder.build({
  descripcion: 'Soñar',
  icono: 'icono.soniar.png',
  comportamiento: 'Pensar',
  argumentos: '{mensaje: "ZZzzZzZ..." }',
});

export default {
  // DEPRECATED: nombre: 'El gato en la calle',
  id: 'ElGatoEnLaCalle',
  // DEPRECATED: enunciado: 'Hacé que el gato avance un paso, se duerma, se despierte, salude y vuelva a su lugar.',
  // DEPRECATED: consignaInicial: 'Se pueden crear nuevas acciones en Procedimientos definiendo nuevos bloques que incluyan otras acciones.',
  esDeExploracion: true,

  // DEPRECATED: escena: ElGatoEnLaCalle,
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,

  bloques: [Procedimiento,Saludar,Avanzar,Volver,AbrirOjos,CerrarOjos,Acostarse,Pararse,Soniar],
};
