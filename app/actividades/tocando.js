import bloques from 'pilas-engine-bloques/actividades/bloques';
var {AccionBuilder} = bloques;

var TocandoManzana = AccionBuilder.buildSensor({
  descripcion: 'Hay una manzana acá',
  id: 'tocandoManzana',
  icono: 'iconos.manzana.png',
  funcionSensor: 'tocando("ManzanaAnimada")',
});

var TocandoBanana = AccionBuilder.buildSensor({
  descripcion: 'Hay una banana acá',
  id: 'tocandoBanana',
  icono: 'iconos.banana.png',
  funcionSensor: 'tocando("BananaAnimada")',
});

var TocandoNaranja = AccionBuilder.buildSensor({
  descripcion: 'Hay una naranja acá',
  id: 'TocandoNaranja',
  icono: 'naranja.png',
  funcionSensor: 'tocando("NaranjaAnimada")',
});

var TocandoQueso = AccionBuilder.buildSensor({
  descripcion: 'Hay queso acá',
  id: 'tocandoQueso',
  icono: 'queso.png',
  funcionSensor: 'tocando("QuesoAnimado")',
});

var TocandoAbajo = AccionBuilder.buildSensor({
  descripcion: 'Puedo mover abajo',
  id: 'TocandoAbajo',
  icono: '../../iconos/abajo.png',
  funcionSensor: 'tocandoFlechaAbajo()',
});

var TocandoDerecha = AccionBuilder.buildSensor({
  descripcion: 'Puedo mover a la derecha',
  id: 'TocandoDerecha',
  icono: '../../iconos/derecha.png',
  funcionSensor: 'tocandoFlechaDerecha()',
});

var TocandoFinCamino = AccionBuilder.buildSensor({
  descripcion: 'Llegó a la meta',
  id: 'TocandoFinCamino',
  icono: 'icono.finCamino.png',
  funcionSensor: 'alFinalDelCamino()',
});

export {TocandoBanana,TocandoManzana,TocandoAbajo,TocandoDerecha,TocandoFinCamino,TocandoQueso,TocandoNaranja};
