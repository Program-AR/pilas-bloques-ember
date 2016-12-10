import bloques from 'pilas-engine-bloques/actividades/bloques';
var {AccionBuilder} = bloques;

var ComerNaranja = AccionBuilder.build({
  descripcion: 'Comer naranja',
  id: 'ComerNaranja',
  icono: 'naranja.png',
  comportamiento: 'RecogerPorEtiqueta',
  argumentos: '{\'etiqueta\' : \'NaranjaAnimada\',  nombreAnimacion: "comerNaranja"}',
});


export {ComerNaranja};
