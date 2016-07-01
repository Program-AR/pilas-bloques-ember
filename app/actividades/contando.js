import bloques from 'pilas-engine-bloques/actividades/bloques';
var {AccionBuilder} = bloques;

var ContarBanana = AccionBuilder.build({
  id:'Contarbanana',
  descripcion: 'Contar una banana',
  icono: 'iconos.banana.png',
  comportamiento: 'ContarPorEtiqueta',
  argumentos: '{etiqueta: "BananaAnimada", nombreAnimacion: "comerBanana"}',
});

var ContarManzana = AccionBuilder.build({
  id: 'Contarmanzana',
  descripcion: 'Contar una manzana',
  icono: 'iconos.manzana.png',
  comportamiento: 'ContarPorEtiqueta',
  argumentos: '{etiqueta: "ManzanaAnimada", nombreAnimacion: "comerManzana"}',
});

export {ContarBanana,ContarManzana};
