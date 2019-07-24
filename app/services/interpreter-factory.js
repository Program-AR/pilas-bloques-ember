import Service, { inject as service } from '@ember/service';


export default Service.extend({
  pilas: service(),

  /**
   * Retorna un intérprete preparado para ejecutar el código que
   * se le envíe como argumento.
   *
   * El código se ejecutará de manera aislada, en un entorno protegido
   * sin acceso al exterior (no tendrá acceso a ember, pilas, window, ni nada...)
   * así que las únicas funciones a las que podrá acceder están detalladas
   * en la función _initFunction, que aparece más abajo.
   */
  crearInterprete(codigo, callback_cuando_ejecuta_bloque) {
    return new Interpreter(this.wrappearCodigo(codigo), (interpreter, scope) => {
      return this._initFunction(interpreter, scope, callback_cuando_ejecuta_bloque);
    });
  },

  /**
   * Inicializa el intérprete y su scope inicial, para que
   * pueda usar funcioens como "hacer", "console.log" etc..
   */
  _initFunction(interpreter, scope, callback_cuando_ejecuta_bloque) {
    let pilasService = this.pilas;
    var actor = pilasService.evaluar(`pilas.escena_actual().automata;`);

    var console_log_wrapper = function(txt) {
      txt = txt ? txt.toString() : '';
      return interpreter.createPrimitive(console.log(txt));
    };

    interpreter.setProperty(scope, 'console_log', interpreter.createNativeFunction(console_log_wrapper));

    // Esto deberia estar en otro lado, es un comportamiento que lo unico que
    // hace es llamar a una función.
    var ComportamientoLlamarCallback = function(args) {
      this.argumentos = args;

      this.iniciar = function() {
      };

      this.actualizar = function() {
        this.argumentos.callback();
        return true;
      };

      this.eliminar = function() {
      };
    };

    // Genera la función "out_hacer" que se llamará dentro del intérprete.
    //
    // Esta función encadenará dos comportamientos para simplificar el uso
    // de funciones asincrónicas. Agregará el comportamiento que represente
    // la acción que el usuario quiere hacer con el actor y luego agregará
    // otro comportamiento para indicar que la tarea asincrónica terminó.
    //
    // Por ejemplo, si en el código se llama a la función hacer así:
    //
    //      hacer("Saltar", {});
    //      hacer("Caminar", {pasos: 20});
    //
    // Internamente la función hará que el actor primero "salte" y luego
    // "camine" 20 pasos.
    var hacer_wrapper = function(comportamiento, params, callback) {
      comportamiento = comportamiento ? comportamiento.toString() : '';
      params = params ? params.toString() : '';
      params = JSON.parse(params);
      var clase_comportamiento = pilasService.evaluar(`
        var comportamiento = null;

        if (window['${comportamiento}']) {
          comportamiento = ${comportamiento};
        } else {
          if (pilas.comportamientos['${comportamiento}']) {
            comportamiento = pilas.comportamientos['${comportamiento}'];
          } else {
            throw new Error("No existe un comportamiento llamado '${comportamiento}'.");
          }
        }

        comportamiento;
      `);

      if(typeof params.receptor === 'string') {
        params.receptor = pilasService.evaluar(`pilas.escena_actual().${params.receptor}`);
      }

      actor.hacer_luego(clase_comportamiento, params);
      actor.hacer_luego(ComportamientoLlamarCallback, {callback});
    };

    interpreter.setProperty(scope, 'out_hacer', interpreter.createAsyncFunction(hacer_wrapper));

    /**
     * Es el código que se ejecuta con una expresión (sensor, operación, etc.)
     */
    function out_evaluar(expr) {
      expr = expr ? expr.toString() : '';
      return interpreter.createPrimitive(pilasService.evaluar(`
        try {
          var value = pilas.escena_actual().automata.${expr}
        } catch (e) {
          pilas.escena_actual().errorHandler.handle(e);
        }

        value`));
    }

    interpreter.setProperty(scope, 'evaluar', interpreter.createNativeFunction(out_evaluar));

    /**
     * Llama a callback_cuando_ejecuta_bloque con el id del bloque en ejecucion.
     */
    function out_highlightBlock(id) {
      id = id ? id.toString() : '';
      return interpreter.createPrimitive(callback_cuando_ejecuta_bloque.call(this, id));
    }

    interpreter.setProperty(scope, 'highlightBlock', interpreter.createNativeFunction(out_highlightBlock));
  },

  wrappearCodigo(codigo){
    return js_beautify(`
        var actor_id = 'demo'; // se asume el actor receptor de la escena.

        function hacer(id, comportamiento, params) {
          out_hacer(comportamiento, JSON.stringify(params));
        }

        function main() {
          ${codigo}
        }

        main();
      `);
  }
});
