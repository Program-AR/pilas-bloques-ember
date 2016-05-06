import prendiendoCompus from 'pilas-engine-bloques/actividades/actividadPrendiendoLasCompus';
import {Numero,OpComparacion,OpAritmetica, Texto} from 'pilas-engine-bloques/actividades/expresiones';

var ConstructorDeAct = function(){};
ConstructorDeAct.prototype = prendiendoCompus;
var prendiendoCompusParam = new ConstructorDeAct();

prendiendoCompusParam.nombre = 'Prendiendo las compus parametrizado';
prendiendoCompusParam.id = 'PrendiendoLasCompusParametrizado';
prendiendoCompusParam.enunciado = 'A Definir';  
prendiendoCompusParam.consignaInicial = '';
prendiendoCompusParam.bloques = prendiendoCompus.bloques.slice();
prendiendoCompusParam.bloques =
  prendiendoCompusParam.bloques.concat([Numero,OpComparacion,OpAritmetica, Texto]);

export default prendiendoCompusParam;
