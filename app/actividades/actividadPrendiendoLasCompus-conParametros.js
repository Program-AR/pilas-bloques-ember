import prendiendoCompus from 'pilas-engine-bloques/actividades/actividadPrendiendoLasCompus';
import {Numero,OpComparacion,OpAritmetica, Texto} from 'pilas-engine-bloques/actividades/expresiones';

var ConstructorDeAct = function(){};
ConstructorDeAct.prototype = prendiendoCompus;
var prendiendoCompusParam = new ConstructorDeAct();

prendiendoCompusParam.nombre = 'Prendiendo las compus parametrizado';
prendiendoCompusParam.id = 'PrendiendoLasCompusParametrizado';
prendiendoCompusParam.enunciado = 'Al igual que antes, debemos prender todas las compus. Pero esta vez tenés que definir un único procedimiento que prenda cualquiera de los lados.';  
prendiendoCompusParam.consignaInicial = 'Los parámetros pueden ser de texto además de numéricos. Por ejemplo, un parámetro podría ser la dirección en que el autómata debe moverse.';
prendiendoCompusParam.bloques = prendiendoCompus.bloques.slice();
prendiendoCompusParam.bloques =
  prendiendoCompusParam.bloques.concat([Numero,OpComparacion,OpAritmetica, Texto]);

export default prendiendoCompusParam;
