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
  funcionAceptacion : () => boolean;

  constructor(funcionAceptacion : () => boolean = () => false) {
    this.funcionAceptacion = funcionAceptacion;
  }

  soyAceptacion() : boolean {
    return this.funcionAceptacion();
  }

  // Para que sea polimórfico con EstadoConTransicion
  realizarTransicion(idTransicion : string) {}
}

class EstadoConTransicion extends Estado {
  escena : EscenaActividad;
  identifier : string;
  datos : { [id : string] : any } = {};
  transiciones : { [id : string] : { estadoEntrada : Estado, condicionTransicion: () => boolean } } ;
  errores : { [id : string] : string }

  constructor(escena : EscenaActividad, idEstado : string, soyAceptacion : boolean = false) {
    super(() => soyAceptacion);
    this.escena = escena;
    this.identifier = idEstado;
    this.transiciones = {};
    this.errores = {};
  }

  agregarTransicion(estadoEntrada : Estado, idTransicion : string, condicionTransicion : () => boolean = () => true) {
    this.transiciones[idTransicion] = {
      estadoEntrada: estadoEntrada,
      condicionTransicion: condicionTransicion,
    };
  }

  agregarError(idTransicion : string, mensajeError : string) {
    this.errores[idTransicion] = mensajeError;
  }

  realizarTransicion(idTransicion : string) {
    if (this.puedoTransicionarA(idTransicion)) {
      // console.log("Transicion:" + idTransicion + ", self:" + this.identifier + ", estado escena:" + pilas.escena_actual().estado.identifier + ", al estado:" + this.estadoSiguiente(comportamiento, idTransicion).identifier + ", comportamiento:" + comportamiento.constructor.name + ", receptor:" + comportamiento.receptor.constructor.name);
      this.escena.estado = this.estadoSiguiente(idTransicion);
    }
    else if (idTransicion in this.errores) {
      throw new ActividadError(this.errores[idTransicion]);
    }
    else {
      throw new ActividadError("¡Ups, esa no era la opción correcta!");
    }
  }

  puedoTransicionarA(idTransicion : string) : boolean {
    return idTransicion in this.transiciones;
  }

  estadoSiguiente(idTransicion : string) : Estado {
      return this.transiciones[idTransicion].condicionTransicion() ?
        this.transiciones[idTransicion].estadoEntrada :
        this;
  }
}

// Sirve para que no tire error para salirse del camino
class EstadoTransicionSinError extends EstadoConTransicion {
  puedoTransicionarA(idTransicion) : boolean {
    return ! (idTransicion in this.errores); // Siempre que no haya error definido me deja
  }

  estadoSiguiente(idTransicion : string) {
    if (!super.puedoTransicionarA(idTransicion)){
      return new EstadoTransicionSinError(this.escena, 'meFuiDelCamino');
    } else {
      return super.estadoSiguiente(idTransicion);
    }
  }
}

class BuilderStatePattern {
  estados : { [id : string] : EstadoConTransicion };
  idEstadoInicial : string;
  escena : EscenaActividad;

  constructor(escena : EscenaActividad, idEstadoInicial : string, tiraErrorSiSeVaDelCamino : boolean = true){
    this.idEstadoInicial = idEstadoInicial;
    this.estados = {};
    this.escena = escena;
    this.estados[idEstadoInicial] = tiraErrorSiSeVaDelCamino
      ? new EstadoConTransicion(this.escena, idEstadoInicial)
      : new EstadoTransicionSinError(this.escena, idEstadoInicial);
  }

  estadoInicial(): EstadoConTransicion {
    return this.estados[this.idEstadoInicial];
  }

  agregarEstado(idEstado : string, tiraErrorSiSeVaDelCamino : boolean = true){
    this.estados[idEstado] = tiraErrorSiSeVaDelCamino
      ? new EstadoConTransicion(this.escena, idEstado)
      : new EstadoTransicionSinError(this.escena, idEstado);
  }

  agregarEstadoAceptacion(idEstado : string){
    this.estados[idEstado] = new EstadoConTransicion(this.escena, idEstado, true);
  }

  agregarTransicion(estadoSalida : string, estadoEntrada : string, transicion : string, condicionTransicion : () => boolean = () => true ) {
    this.estados[estadoSalida].agregarTransicion(this.estados[estadoEntrada], transicion, condicionTransicion);
  }

  agregarError(estadoSalida : string, transicion : string, mensajeError : string){
    this.estados[estadoSalida].agregarError(transicion, mensajeError);
  }

  agregarErrorAVariosEstadosDeSalida(estadoSalida : string, transicion : string, error : string, indexInicialSalida : number, indexFinalSalida : number){
    //agrega un error para varios estados de salida con prefijos.
    //pre indexFinalSalida>indexInicialSalida
    var tamano = indexFinalSalida - indexInicialSalida;
    for (var index = 0; index <= tamano; ++index) {
      this.agregarError(estadoSalida + (indexInicialSalida + index), transicion, error);
    }
  }

  agregarEstadosPrefijados(prefix : string, indexInicial : number, indexFinal : number) {
    //prefix debe ser string e indexInicial y final ints
    for (var i = indexInicial; i <= indexFinal; ++i) {
      this.agregarEstado(prefix + i);
    }
  }

  agregarTransicionesIteradas(estadoSalidaPrefix,estadoEntradaPrefix,transicion ,inicialSalida,finSalida,inicialEntrada,finEntrada){
    //pre: |estadosSalida|=|estadosEntrada|
    //implica finSalida-inicialSalida=finEntrada-InicialEntrada
    var tamano = finSalida - inicialSalida;
    for (var index = 0; index <= tamano; ++index) {
      this.agregarTransicion(estadoSalidaPrefix + (inicialSalida + index), estadoEntradaPrefix + (inicialEntrada + index), transicion);
    }
  }
}

class EstadoParaContarBuilder extends BuilderStatePattern {
  constructor(escena : EscenaActividad, idTransicion : string, cantidadEsperada : number) {
    super(escena, 'faltan');
    this.agregarEstadoAceptacion('llegue');
    var estado = this.estados['llegue'];
    estado.datos['cant'] = 0;

    this.agregarTransicion('faltan', 'llegue', idTransicion, () => {
      estado.datos['cant'] += 1;
      return (estado.datos['cant'] === cantidadEsperada);
    });

    this.agregarError('llegue', idTransicion, 'Ya no hay más para ' + idTransicion);
  }
}
