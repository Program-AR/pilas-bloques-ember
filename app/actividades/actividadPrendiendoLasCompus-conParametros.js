import prendiendoCompus from 'pilas-engine-bloques/actividades/actividadPrendiendoLasCompus';
import {Numero,OpComparacion,OpAritmetica, Texto} from 'pilas-engine-bloques/actividades/expresiones';

var ConstructorDeAct = function(){};
ConstructorDeAct.prototype = prendiendoCompus;
var prendiendoCompusParam = new ConstructorDeAct();

prendiendoCompusParam.nombre = 'Prendiendo las compus parametrizado';
prendiendoCompusParam.id = 'PrendiendoLasCompusParametrizado';
prendiendoCompusParam.enunciado = 'Ramiro necesita prender todas las compus de la habitación. Deberá recorrer cada hilera de compus y prenderlas una por una. Pista: la cantidad de compus cambia cada vez, pero el recorrido de Ramiro siempre va a seguir la forma de un rectángulo.';  
prendiendoCompusParam.consignaInicial = '';
prendiendoCompusParam.bloques = prendiendoCompus.bloques.slice();
prendiendoCompusParam.bloques =
  prendiendoCompusParam.bloques.concat([Numero,OpComparacion,OpAritmetica, Texto]);

export default prendiendoCompusParam;
