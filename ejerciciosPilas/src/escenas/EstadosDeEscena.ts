/// <reference path = "EscenaActividad.ts" />

/**

Qué son las FSM - Version clásica

FSM significa máquina de estados finitos. Se las usa para modelar sistemas reactivos y concurrentes,
fundamentalmente porque tienen definido el operador de composición (A||B) que
modela la ejecución concurrente de A y B.

En su versión clásica, es un conjunto de estados con transiciones etiquetadas. Hay un único estado
inicial y uno o más finales. La máquina va cambiando de estado a partir de las transiciones y, en
el caso de querer transicionar por una etiqueta no definida, salta a un estado “trampa” de error,
que se asume implícito en toda máquina.

Para qué usamos las FSM
Tienen tres objetivos en el contexto de Pilas-Bloques:
1. Modelar las restricciones de precedencia en las acciones de la escena.
Por ejemplo, en la escena “La gran aventura del mar encantado” (mirarla), donde
el orden es: llave, cofre, mago, caballero y unicornio, podemos definirlo en
términos de transiciones y “de regalo” sabemos que cualquier otra combinación es errónea.

2. Definir errores ad-hoc, más declarativos para el estudiante respecto de lo
que hizo mal. En LGADME, podemos definir errores específicos, por ejemplo, si no
busco la llave “debés buscar la llave primero”. En el caso de que no se defina nada,
hay un error por default definido.

3. Definir fácilmente el estado “ganador” de la escena: como toda la lógica de la escena
está definida en términos de la máquina, basta con marcar aquellos estados que son
ganadores como “finales”.

Cómo usarlas para implementar el Ganaste!
Todas las escenas deben implementar estaResueltoElProblema().

Cuando las escenas no tienen una máquina de estados (this.estado=undefined),
perfectamente se puede implementar una función que verifique la resolución. Por ejemplo,
en el caso de María la come sandías, basta verificar que no queden sandias en la escena al finalizar.

Cuando hay máquina de estado hay dos opciones: marcar estados como de aceptación
(finales) (notar que la clase EscenaActividad implementa estaResuletoElProblema()
como verificacion de estado de aceptación) o bien hacer override y dejar que la FSM
se encargue pura y exclusivamente  de los errores de orden.


======================================
PROBLEMA:
La máquina de estados por defecto considera errónea cualquier transición no definida
en el grafo de estados.
Es por ello que no sirve para ser usada en casos donde varias soluciones pueden ser correctas,
porque la configuración debe considerarlas todas.
En estos casos, se debe pensar bien si es necesaria la FSM, y cuáles son las transiciones aceptables.
*/


class Estado {
  funcionAceptacion;

  constructor(funcionAceptacion = () => false) {
    this.funcionAceptacion = funcionAceptacion;
  }

  verificarQuePuedoSeguir() {
  }

  soyAceptacion() {
    return this.funcionAceptacion();
  }
}

class EstadoConTransicion extends Estado{
  transiciones;
  identifier;

  constructor(idEstado){
    super();
    this.identifier=idEstado;
    this.transiciones={};
  }

  agregarTransicion(estadoEntrada, idTransicion, condicionTransicion = () => true) {
    this.transiciones[idTransicion] = {
      estadoEntrada: estadoEntrada,
      condicionTransicion: condicionTransicion,
    };
  }

  realizarTransicion(idTransicion, comportamiento) {
    if (!this.transiciones[idTransicion]) throw new ActividadError("¡Ups, esa no era la opción correcta!");
    pilas.escena_actual().estado = this.estadoSiguiente(comportamiento, idTransicion);
  }

  estadoSiguiente(comportamiento, idTransicion) {
      return this.transiciones[idTransicion].condicionTransicion() ?
        this.transiciones[idTransicion].estadoEntrada :
        this;
  }
}

class EstadoAceptacion extends EstadoConTransicion{
  soyAceptacion(){
    return true;
  }
}

class EstadoError {
  estadoAlQueVuelve;
  mensajeError;

  constructor(estado, mensaje) {
    this.estadoAlQueVuelve = estado;
    this.mensajeError = mensaje;
  }

  verificarQuePuedoSeguir() {
    throw new ActividadError(this.mensajeError);
  }

  estadoSiguiente(comportamiento, idTransicion) {
    return this.estadoAlQueVuelve;
  }
}

class BuilderStatePattern{
    estados;
    idEstadoInicial;

    constructor(idEstadoInicialp){
      this.idEstadoInicial=idEstadoInicialp;
      this.estados={};
      this.estados[idEstadoInicialp]= new EstadoConTransicion(idEstadoInicialp);
    }

    agregarEstado(idEstado){
      this.estados[idEstado]= new EstadoConTransicion(idEstado);
    }
    agregarEstadoAceptacion(idEstado){
      this.estados[idEstado] = new EstadoAceptacion(idEstado);
    }

    agregarTransicion(estadoSalida, estadoEntrada, transicion, condicionTransicion = () => true ) {
      this.estados[estadoSalida].agregarTransicion(this.estados[estadoEntrada], transicion, condicionTransicion);
    }

    agregarError(estadoSalida,transicion,error){
      this.estados[estadoSalida].agregarTransicion(new EstadoError(this.estados[estadoSalida],error),transicion);
    }

    agregarErrorAVariosEstadosDeSalida(estadoSalida,transicion,error,indexInicialSalida,indexFinalSalida){
      //agrega un error para varios estados de salida con prefijos.
      //pre indefFinalSalida>indexInicialSalida
      var tamano=indexFinalSalida-indexInicialSalida
      for(var index=0;index<=tamano;++index){
        this.estados[estadoSalida+(indexInicialSalida+index)].agregarTransicion(new EstadoError(this.estados[estadoSalida+(indexInicialSalida+index)],error),transicion);
      }
    }
    agregarErroresIterados(estadoSalida,transicion,error,indexInicialSalida,indexFinalSalida,indexInicialTransi,indexFinalTransi){
      //pre: indexFinalSalida-indexInicialSalida= indexFinalTransi-indexInicialTransi
      // NO TERMINADO
      var range=indexFinalSalida-indexInicialSalida;
      for(var index=0;index<range;++index){
          this.estados[estadoSalida+(indexInicialSalida+index)].agregarTransicion(new EstadoError(this.estados[estadoSalida+(indexInicialSalida+index)],error),transicion);
      }
    }

    estadoInicial(){
      return this.estados[this.idEstadoInicial];
    }

    agregarEstadosPrefijados(prefix,indexInicial,indexFinal){
      //prefix debe ser string e indexInicial y final ints
    for(var i=indexInicial;i<=indexFinal;++i){
      this.estados[prefix+i]=new EstadoConTransicion(prefix+i);
    }
    }

    agregarTransicionesIteradas(estadoSalidaPrefix,estadoEntradaPrefix,transicion ,inicialSalida,finSalida,inicialEntrada,finEntrada){
      //pre: |estadosSalida|=|estadosEntrada|
      //implica finSalida-inicialSalida=finEntrada-InicialEntrada
      var tamano=finSalida-inicialSalida
      for(var index=0;index<=tamano;++index){
                    this.estados[estadoSalidaPrefix+(inicialSalida+index)].agregarTransicion(this.estados[estadoEntradaPrefix+(inicialEntrada+index)],transicion);
      }
    }
}
