import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';
import bloquesTito from 'pilas-engine-bloques/actividades/bloquesTito';
var {Repetir, Procedimiento} = bloques;
var {IrDerecha, IrIzquierda, IrArriba, IrAbajo} = direcciones;
var {EncenderLuz} = bloquesTito;


var actividadTitoEnciendeLuces = {
  nombre: 'Tito enciende las luces',
  id: 'TitoEnciendeLuces',
  enunciado: 'Ayudá a Tito a encender todas las luces. \n'+
    'Pista: creá un procedimiento para prender todas las luces de una diagonal.',
  consignaInicial: 'Se puede crear un procedimiento una vez y usarlo todas las veces que quieras dentro de un programa.',

  // la escena proviene de ejerciciosPilas
  escena: TitoEnciendeLuces,  // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,

  bloques: [Procedimiento, Repetir, EncenderLuz,IrDerecha,IrArriba,IrAbajo,IrIzquierda],
};

export default actividadTitoEnciendeLuces;
