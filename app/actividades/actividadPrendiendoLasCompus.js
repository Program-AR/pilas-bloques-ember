import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';

var {AccionBuilder, Repetir, Si, Hasta, Procedimiento} = bloques;
var {IrIzquierda, IrDerecha, IrArriba, IrAbajo} = direcciones;

var PrenderCompu = AccionBuilder.build({
  descripcion: 'Prender compu',
  icono: 'icono.computadora.png',
  comportamiento: 'DesencadenarAnimacionSiColisiona',
  argumentos: '{etiqueta:"CompuAnimada", animacionColisionado:"prendida", nombreAnimacion: "escribir" }',
});

var EstoyEnEsquina = AccionBuilder.buildSensor({
  descripcion: 'Estoy en una esquina',
  icono: 'casilla.prendiendoLasCompus2.png',
  funcionSensor: 'casillaActual().esEsquina()',
});

export default {
  nombre: 'Prendiendo las compus',
  id: 'PrendiendoLasCompus',
  enunciado:
    'TODO',

  consignaInicial: 'TODO',
  
  // la escena proviene de ejerciciosPilas
  escena: PrendiendoLasCompus,  // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,
  procedimientos: [Procedimiento],

  // TODO: aca irian atributos iniciales que se desean para un personaje
  variables: [],
  control: [Repetir, Si, Hasta],
  expresiones: [],
  acciones: [IrDerecha, IrArriba, IrAbajo, IrIzquierda, PrenderCompu],
  sensores: [EstoyEnEsquina],
};
