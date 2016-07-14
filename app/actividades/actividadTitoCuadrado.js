import {Repetir, Si, Sino, Hasta, Procedimiento} from 'pilas-engine-bloques/actividades/bloques';
import {ParaLaDerecha, ParaLaIzquierda,ParaArriba, ParaAbajo, MoverA} from 'pilas-engine-bloques/actividades/direccionesCuadricula';
import {EncenderLuz,TocandoLuz} from 'pilas-engine-bloques/actividades/bloquesTito';
import {Numero,OpAritmetica} from 'pilas-engine-bloques/actividades/expresiones';

export default {
  nombre: 'Tito cuadrado',
  id: 'TitoCuadrado',
  enunciado: 'Tito debe encender todas las luces del cuadrado, en cada ejecución distribuidas de una manera diferente. Tené en cuenta que las casillas de la esquina nunca se prenden y que el tamaño del cuadrado no varía de una ejecución a la otra.',

  escena: TitoCuadrado,  // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,

  bloques: [ParaLaDerecha, ParaLaIzquierda, ParaArriba, ParaAbajo, MoverA, Procedimiento,
    Repetir, Si, Sino, Hasta, TocandoLuz, EncenderLuz,
    Numero,OpAritmetica],
};
