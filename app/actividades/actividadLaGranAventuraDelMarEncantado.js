import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';

var {Repetir, Procedimiento, AccionBuilder} = bloques;
var {IrDerecha, IrIzquierda, IrArriba, IrAbajo} = direcciones;

var AgarrarLlave = AccionBuilder.build({
  descripcion: 'Agarrar llave',
  icono: 'llave.png',
  comportamiento: 'Sostener',
  argumentos: '{etiqueta:"LlaveAnimado"}',
});

var AbrirCofre = AccionBuilder.build({
  descripcion: 'Abrir cofre',
  icono: 'icono.cofre.png',
  comportamiento: 'Sostener',
  argumentos: '{etiqueta:"SombreroAnimado"}',
});

var DarSombrero = AccionBuilder.build({
  descripcion: 'Dar sombrero',
  icono: 'icono.sombrero.png',
  comportamiento: 'Sostener',
  argumentos: '{etiqueta:"EspadaAnimada"}',
});

var AtacarConEspada = AccionBuilder.build({
  descripcion: 'Atacar con espada',
  icono: 'icono.espada.png',
  comportamiento: 'Sostener',
  argumentos: '{etiqueta:"Princesa"}',
});

var EscaparEnUnicornio = AccionBuilder.build({
  descripcion: 'Escapar en unicornio',
  icono: 'icono.unicornio.png',
  comportamiento: 'Escapar',
  argumentos: '{escaparCon: pilas.escena_actual().unicornio}',
});

export default {
  nombre: 'La gran aventura del mar encantado',
  id: 'LaGranAventuraDelMarEncantado',
  enunciado:  'Ayuda al caballero a rescatar a la princesa. Para ello debe superar en orden cada una de las siguientes pruebas:\n' +
              '1. Buscar la llave.\n'+
              '2. Abrir el cofre con la llave y tomar el sombrero mágico que está dentro.\n'+
              '3. Entregarle el sombrero al mago para recibir la espada a cambio.\n'+
              '4. Luchar con la espada contra el caballero oscuro.\n'+
              '5. Ir con la princesa hasta el unicornio y escapar.',
  consignaInicial: '',
  escena: LaGranAventuraDelMarEncantado, // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,
  subtareas: [Procedimiento],
  variables: [],
  control: [Repetir],
  expresiones: [],
  acciones: [IrDerecha, IrIzquierda, IrArriba, IrAbajo, AgarrarLlave, AbrirCofre, DarSombrero, AtacarConEspada, EscaparEnUnicornio],
  sensores: []
};
