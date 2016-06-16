import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';

var {Repetir, Procedimiento, AccionBuilder} = bloques;
var {IrDerecha, IrIzquierda, IrArriba, IrAbajo} = direcciones;

var AgarrarLlave = AccionBuilder.build({
  descripcion: 'Agarrar llave',
  icono: 'llave.png',
  comportamiento: 'Sostener',
  argumentos: '{etiqueta:"LlaveAnimado", idTransicion:"agarrarLlave"}',
});

var AbrirCofre = AccionBuilder.build({
  descripcion: 'Abrir cofre',
  icono: 'icono.cofre.png',
  comportamiento: 'Soltar',
  argumentos: '{etiqueta:"CofreAnimado", queSoltar:"LlaveAnimado", animacionColisionado:"abrir", idTransicion:"abrirCofre"}',
});

var DarSombrero = AccionBuilder.build({
  descripcion: 'Dar sombrero',
  icono: 'icono.sombrero.png',
  comportamiento: 'ComportamientoColision',
  argumentos: '{etiqueta:"MagoAnimado", animacionColisionado:"darEspada", idTransicion:"darSombrero"}',
});

var AtacarConEspada = AccionBuilder.build({
  descripcion: 'Atacar con espada',
  icono: 'icono.espada.png',
  comportamiento: 'SecuenciaAnimada',
  argumentos: '{idTransicion: "atacarConEspada", secuencia: [new ComportamientoColision({etiqueta: "CaballeroAnimado", animacionColisionado: "defender", nombreAnimacion:"atacar"}), new Sostener({etiqueta:"Principe"})]}',
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
  enunciado:  'Ayuda a la heroína a rescatar a su príncipe. Para ello debe superar en orden cada una de las siguientes pruebas:\n' +
              '1) Buscar la llave.\n'+
              '2) Abrir el cofre con la llave y tomar el sombrero mágico que está dentro.\n'+
              '3) Entregarle el sombrero al mago para recibir la espada a cambio.\n'+
              '4) Luchar con la espada contra el caballero oscuro.\n'+
              '5) Ir con el príncipe hasta el unicornio y escapar.',
  consignaInicial: '',
  escena: LaGranAventuraDelMarEncantado, // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,

  bloques: [Procedimiento, Repetir, IrDerecha, IrIzquierda, IrArriba, IrAbajo, AgarrarLlave, AbrirCofre, DarSombrero, AtacarConEspada, EscaparEnUnicornio],
};
