import bloques from 'pilas-engine-bloques/actividades/bloques';

var {AccionBuilder,Procedimiento} = bloques;

var Saludar = AccionBuilder.build({
  descripcion: 'Saludar',
  icono: 'iconos/icono.Saludar.png',
  comportamiento: 'ComportamientoAnimado',
  argumentos: '{nombreAnimacion: "saludando", idTransicion: "saludar"}',
});

var AbrirOjos = AccionBuilder.build({
  descripcion: 'Abrir ojos',
  icono: 'iconos/icono.AbrirOjos.png',
  comportamiento: 'AnimarSiNoEstoyYa',
  argumentos: '{nombreAnimacion: "abrirOjos", valorEstar: "con los ojos abiertos", descripcionEstar: "estadoOjos", nombreAnimacionSiguiente: "parado", arrancoAsi:true, idTransicion: "abrirOjos"}',
});

var CerrarOjos = AccionBuilder.build({
  descripcion: 'Cerrar ojos',
  icono: 'iconos/icono.CerrarOjos.png',
  comportamiento: 'AnimarSiNoEstoyYa',
  argumentos: '{nombreAnimacion: "cerrarOjos", valorEstar: "con los ojos cerrados", descripcionEstar: "estadoOjos", nombreAnimacionSiguiente: "ojosCerrados", idTransicion: "cerrarOjos"}',
});

var Acostarse = AccionBuilder.build({
  descripcion: 'Acostarse',
  icono: 'iconos/icono.Acostarse.png',
  comportamiento: 'ModificarRotacionYAltura',
  argumentos: '{alturaIr: -180 ,rotacionIr: 90, nombreAnimacion:"acostado", valorEstar: "acostado", descripcionEstar: "posicionCuerpo", idTransicion: "acostarse"}',
});

var Pararse = AccionBuilder.build({
  descripcion: 'Pararse',
  icono: 'iconos/icono.Pararse.png',
  comportamiento: 'ModificarRotacionYAltura',
  argumentos: '{alturaIr: -150 ,rotacionIr: 0, nombreAnimacion:"acostado", valorEstar: "parado", descripcionEstar: "posicionCuerpo", arrancoAsi:true, idTransicion: "levantarse"}',
});

var Volver = AccionBuilder.build({
  descripcion: 'Volver',
  icono: 'iconos/icono.Izquierda.png',
  comportamiento: 'MovimientoAnimado',
  argumentos: '{direccion: new Direct(-1,0), distancia: 50, idTransicion: "volver"}',
});

var Avanzar = AccionBuilder.build({
  descripcion: 'Avanzar',
  icono: 'iconos/icono.Derecha.png',
  comportamiento: 'MovimientoAnimado',
  argumentos: '{direccion: new Direct(1,0), distancia: 50, idTransicion: "avanzar"}',
});

var Soniar = AccionBuilder.build({
  descripcion: 'Soñar',
  icono: 'iconos/icono.Soniar.png',
  comportamiento: 'Pensar',
  argumentos: '{mensaje: "ZZzzZzZ...", hayQueAnimar: false, idTransicion: "soniar"}',
});

export default {
  // DEPRECATED: nombre: 'El gato en la calle',
  id: 'ElGatoEnLaCalle',
  // DEPRECATED: enunciado: 'Hacé que el gato avance un paso, se duerma, se despierte, salude y vuelva a su lugar.',
  // DEPRECATED: consignaInicial: 'Se pueden crear nuevas acciones en Procedimientos definiendo nuevos bloques que incluyan otras acciones.',

  // DEPRECATED: escena: ElGatoEnLaCalle,
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,

  bloques: [Procedimiento,Saludar,Avanzar,Volver,AbrirOjos,CerrarOjos,Acostarse,Pararse,Soniar],
};
