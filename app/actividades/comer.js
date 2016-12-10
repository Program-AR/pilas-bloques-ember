import bloques from 'pilas-engine-bloques/actividades/bloques';
var {AccionBuilder} = bloques;

var ComerQueso = AccionBuilder.build({
  descripcion: 'Comer queso',
  id: 'ComerQueso',
  icono: 'queso.png',
  comportamiento: 'RecogerPorEtiqueta',
  argumentos: '{\'etiqueta\' : \'QuesoAnimado\'}',
});

var ComerNaranja = AccionBuilder.build({
  descripcion: 'Comer naranja',
  id: 'ComerNaranja',
  icono: 'naranja.png',
  comportamiento: 'RecogerPorEtiqueta',
  argumentos: '{\'etiqueta\' : \'NaranjaAnimada\',  nombreAnimacion: "comerNaranja"}',
});


export {ComerQueso,ComerNaranja};
