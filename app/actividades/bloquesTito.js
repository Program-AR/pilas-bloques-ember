import bloques from 'pilas-engine-bloques/actividades/bloques';
var {AccionBuilder} = bloques;

var EncenderLuz = AccionBuilder.build({
  descripcion: 'Prender la luz',
  id: 'EncenderLuz',
  icono: 'iconos/icono.Lamparita.png',
  comportamiento: 'EncenderPorEtiqueta',
  argumentos: "{'etiqueta':'Luz'}",
});

var TocandoLuz = AccionBuilder.buildSensor({
  descripcion: 'Hay lamparita acá',
  id: 'tocandoLuz',
  icono: 'iconos/icono.LamparitaApagada.png',
  funcionSensor: 'tocando("Lamparin")',
});


var TocandoFinal = AccionBuilder.buildSensor({
  descripcion: 'Llegué al final',
  id: 'tocandoFinal',
  icono: 'iconos/icono.SuperTitoTocandoFin.png',
  funcionSensor: 'estoyUltimaFila()',
});

export {EncenderLuz,TocandoLuz,TocandoFinal};
