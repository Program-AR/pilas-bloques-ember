import bloques from 'pilas-engine-bloques/actividades/bloques';
var {AccionBuilder} = bloques;

var TocandoManzana = AccionBuilder.buildSensor({
  descripcion: 'Hay una manzana acá',
  id: 'tocandoManzana',
  icono: 'iconos/icono.Manzana.png',
  funcionSensor: 'tocando("ManzanaAnimada")',
});

var TocandoBanana = AccionBuilder.buildSensor({
  descripcion: 'Hay una banana acá',
  id: 'tocandoBanana',
  icono: 'iconos/icono.Banana.png',
  funcionSensor: 'tocando("BananaAnimada")',
});

var TocandoNaranja = AccionBuilder.buildSensor({
  descripcion: 'Hay una naranja acá',
  id: 'TocandoNaranja',
  icono: 'iconos/icono.Naranja.png',
  funcionSensor: 'tocando("NaranjaAnimada")',
});

var TocandoQueso = AccionBuilder.buildSensor({
  descripcion: 'Hay queso acá',
  id: 'tocandoQueso',
  icono: 'iconos/icono.Queso.png',
  funcionSensor: 'tocando("QuesoAnimado")',
});

var TocandoAbajo = AccionBuilder.buildSensor({
  descripcion: 'Puedo mover abajo',
  id: 'TocandoAbajo',
  icono: 'iconos/icono.Abajo.png',
  funcionSensor: 'tocandoFlechaAbajo()',
});

var TocandoDerecha = AccionBuilder.buildSensor({
  descripcion: 'Puedo mover a la derecha',
  id: 'TocandoDerecha',
  icono: 'iconos/icono.Derecha.png',
  funcionSensor: 'tocandoFlechaDerecha()',
});

var TocandoFinCamino = AccionBuilder.buildSensor({
  descripcion: 'Llegó a la meta',
  id: 'TocandoFinCamino',
  icono: 'iconos/icono.FinCamino.png',
  funcionSensor: 'alFinalDelCamino()',
});

export {TocandoBanana,TocandoManzana,TocandoAbajo,TocandoDerecha,TocandoFinCamino,TocandoQueso,TocandoNaranja};
