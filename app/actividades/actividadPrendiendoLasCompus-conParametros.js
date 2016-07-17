import bloques from 'pilas-engine-bloques/actividades/bloques';
import {ParaLaDerecha, ParaLaIzquierda,ParaArriba, ParaAbajo, MoverA} from 'pilas-engine-bloques/actividades/direccionesCuadricula';
import {Numero, OpAritmetica} from 'pilas-engine-bloques/actividades/expresiones';
import {PrenderCompu, EstoyEnEsquina} from 'pilas-engine-bloques/actividades/bloquesCompus';

var {Repetir, Si, Sino, Hasta, Procedimiento} = bloques;

export default {
  nombre: 'Prendiendo las compus parametrizado',
  id: 'PrendiendoLasCompusParametrizado',
  enunciado:
    'Ramiro necesita prender todas las compus de la habitación. Deberá recorrer cada hilera de compus y prenderlas una por una. Pista: la cantidad de compus cambia cada vez, pero el recorrido de Ramiro siempre va a seguir la forma de un rectángulo (de tamaño variable).',

  // la escena proviene de ejerciciosPilas
  escena: PrendiendoLasCompus,  // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,

  bloques: [ParaLaDerecha, ParaLaIzquierda, ParaArriba, ParaAbajo, MoverA, Procedimiento,
    Repetir, Si, Sino, Hasta, PrenderCompu, EstoyEnEsquina,
    Numero, OpAritmetica],
};
