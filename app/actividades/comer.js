import bloques from 'pilas-engine-bloques/actividades/bloques';
var {AccionBuilder} = bloques;

var ComerBanana = AccionBuilder.build({
  descripcion: 'Comer banana',
  id: 'ComerBanana',
  icono: 'iconos/icono.Banana.png',
  comportamiento: 'RecogerPorEtiqueta',
  argumentos: '{\'etiqueta\' : \'BananaAnimada\',  nombreAnimacion: "comerBanana"}',
});

var ComerManzana = AccionBuilder.build({
  descripcion: 'Comer manzana',
  id: 'ComerManzana',
  icono: 'iconos/icono.Manzana.png',
  comportamiento: 'RecogerPorEtiqueta',
  argumentos: '{\'etiqueta\' : \'ManzanaAnimada\',  nombreAnimacion: "comerManzana"}',
});

var ComerQueso = AccionBuilder.build({
  descripcion: 'Comer queso',
  id: 'ComerQueso',
  icono: 'iconos/icono.Queso.png',
  comportamiento: 'RecogerPorEtiqueta',
  argumentos: '{\'etiqueta\' : \'QuesoAnimado\'}',
});

var ComerNaranja = AccionBuilder.build({
  descripcion: 'Comer naranja',
  id: 'ComerNaranja',
  icono: 'iconos/icono.Naranja.png',
  comportamiento: 'RecogerPorEtiqueta',
  argumentos: '{\'etiqueta\' : \'NaranjaAnimada\',  nombreAnimacion: "comerNaranja"}',
});


export {ComerBanana,ComerManzana,ComerQueso,ComerNaranja};
