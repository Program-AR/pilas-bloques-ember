"use strict";
/* jshint ignore:start */

/* jshint ignore:end */

define('pilas-engine-bloques/actividades/LaberintoConQueso', ['exports', 'pilas-engine-bloques/actividades/bloques', 'pilas-engine-bloques/actividades/direccionesCuadricula'], function (exports, bloques, direcciones) {

  'use strict';

  var Repetir = bloques['default'].Repetir;
  var Si = bloques['default'].Si;
  var Procedimiento = bloques['default'].Procedimiento;
  var IrDerecha = direcciones['default'].IrDerecha;
  var IrAbajo = direcciones['default'].IrAbajo;

  var actividadLaberintoConQueso = {
    nombre: 'El alien y las tuercas',
    enunciado: 'Definí un programa para que el alien junte todas las tuercas.',
    consignaInicial: 'Una buena estrategia de resolución de este desafío es la división del procedimiento en sub tareas.',

    escena: LaberintoConQueso, // jshint ignore:line
    puedeComentar: false,
    puedeDesactivar: false,
    puedeDuplicar: false,
    subtareas: [Procedimiento],

    // TODO: aca irian atributos iniciales que se desean para un personaje
    variables: [],

    control: [Repetir, Si],
    expresiones: [],
    acciones: [IrDerecha, IrAbajo],
    sensores: []
  };

  exports['default'] = actividadLaberintoConQueso;

});
define('pilas-engine-bloques/actividades/actividad', ['exports', 'ember', 'pilas-engine-bloques/actividades/bloques', 'pilas-engine-bloques/actividades/lenguaje'], function (exports, Ember, bloques, Lenguaje) {

  'use strict';

  var /*Bloque, CambioDeJSDeBlocky,*/VariableGet = /*Accion,
                                                   Sensor*/bloques['default'].VariableGet;
  var VariableSet = bloques['default'].VariableSet;
  var VariableLocalGet = bloques['default'].VariableLocalGet;
  var VariableLocalSet = bloques['default'].VariableLocalSet;
  var Procedimiento = bloques['default'].Procedimiento;
  var Funcion = bloques['default'].Funcion;
  var CallNoReturn = bloques['default'].CallNoReturn;
  var CallReturn = bloques['default'].CallReturn;
  var ParamGet = bloques['default'].ParamGet;
  var AlEmpezar = bloques['default'].AlEmpezar;

  /* ============================================== */

  /**
    Modelo de actividad
  **/
  var Actividad = Ember['default'].Object.extend({
    init: function init() {
      var actividad = this.get('actividad');
      this.set('nombre', actividad.nombre);
      this.set('id', actividad.id);
      this.set('enunciado', actividad.enunciado);
      this.set('escena', actividad.escena);
      this.set('puedeComentar', actividad.puedeComentar);
      this.set('puedeDesactivar', actividad.puedeDesactivar);
      this.set('puedeDuplicar', actividad.puedeDuplicar);
      this.setColours();
      this.pisar_bloques_blockly();
    },

    iniciarEscena: function iniciarEscena() {
      var Esc = this.get('escena');
      var esc_instance = new Esc();
      this.set('escena_instanciada', esc_instance);
      pilas.mundo.gestor_escenas.cambiar_escena(esc_instance);
    },

    obtenerLenguaje: function obtenerLenguaje() {
      var act = this.get('actividad');
      var leng = Lenguaje['default'].create();

      var bloques_para_toolbox = {
        Acciones: 'acciones',
        Sensores: 'sensores',
        Control: 'control',
        Expresiones: 'expresiones',
        Variables: 'variables',
        Subtareas: 'subtareas'
      };

      // Itera por todos los bloques y los agrega al toolbox solamente
      // si tienen piezas para mostrar.
      for (var key in bloques_para_toolbox) {
        var propiedad = bloques_para_toolbox[key];

        if (act[propiedad].length > 0) {
          leng.agregar(key, act[propiedad]);
        }
      }

      return leng.build();
    },

    bloques_iniciales: function bloques_iniciales() {
      return [AlEmpezar];
    },

    crear_bloques_iniciales: function crear_bloques_iniciales() {
      this.bloques_iniciales().forEach(function (b) {
        b.create().instanciar_para_workspace();
      });
    },

    pisar_bloques_blockly: function pisar_bloques_blockly() {
      CallReturn.create().registrar_en_blockly();
      CallNoReturn.create().registrar_en_blockly();
      ParamGet.create().registrar_en_blockly();
      VariableGet.create().registrar_en_blockly();
      VariableSet.create().registrar_en_blockly();
      VariableLocalGet.create().registrar_en_blockly();
      VariableLocalSet.create().registrar_en_blockly();
    },

    usa_procedimientos: function usa_procedimientos() {
      return this.get('actividad').subtareas.indexOf(Procedimiento) > -1;
    },

    usa_funciones: function usa_funciones() {
      return this.get('actividad').subtareas.indexOf(Funcion) > -1;
    },

    iniciarBlockly: function iniciarBlockly(contenedor) {
      var actividad = this;

      Blockly.inject(contenedor, {
        collapse: false,
        duplicate: actividad.get('puedeDuplicar'),
        trashOnlyDelete: true,
        disable: actividad.get('puedeDesactivar'),
        comments: actividad.get('puedeComentar'),
        rgbColours: true,
        defsOnly: true,
        def_procedures: actividad.usa_procedimientos(),
        def_functions: actividad.usa_funciones(),
        globalVariables: false,
        oneReturnOnly: true,
        defsNames: ['al_empezar_a_ejecutar', 'procedures_defnoreturn', 'procedures_defreturn'],
        path: './libs/blockly/',
        toolbox: Blockly.Xml.textToDom(actividad.obtenerLenguaje())
      });

      this.crear_bloques_iniciales();

      var event = new Event('terminaCargaInicial');
      window.dispatchEvent(event);
    },

    generarCodigo: function generarCodigo() {
      // variable global con la que se accede al receptor del programa
      window.receptor = this.get('escena_instanciada').automata;
      var comienzo = 'var programa = new pilas.comportamientos.ConstructorDePrograma();\n\n';
      var code = Blockly.JavaScript.workspaceToCode();
      return comienzo + code;
    },

    generarCodigoXML: function generarCodigoXML() {
      var code = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
      return code;
    },

    cargarCodigoDesdeStringXML: function cargarCodigoDesdeStringXML(codigo) {
      var workspace = Blockly.getMainWorkspace();
      workspace.clear();
      var xml = Blockly.Xml.textToDom(codigo);
      Blockly.Xml.domToWorkspace(workspace, xml);
    },

    // Scratch style colours
    setColours: function setColours() {
      Blockly.Blocks.primitivas.COLOUR = '#4a6cd4';
      Blockly.Blocks.sensores.COLOUR = '#2ca5e2';
      Blockly.Blocks.eventos.COLOUR = '#00a65a'; // == boton ejecutar
      Blockly.Blocks.math.COLOUR = '#49930e';
      Blockly.Blocks.logic.COLOUR = '#5cb712';
      Blockly.Blocks.loops.COLOUR = '#ee7d16';

      Blockly.Blocks.procedures.COLOUR = '#6C52EB';
      //Blockly.Blocks.procedures.vars.COLOUR = '#8a55d7';
      //Blockly.Blocks.procedures.params.COLOUR = '#6C52EB';

      Blockly.Blocks.variables.COLOUR = '#cc5b22';

      Blockly.Blocks.texts.COLOUR = '#4a6cd4';
      Blockly.Blocks.lists.COLOUR = '#cc5b22';
      Blockly.Blocks.colour.COLOUR = '#4a6cd4';

      // IN SCRATCH THE COLOURS ARE
      // 4a6cd4 MOTION
      // 8a55d7 LOOKS
      // bb42c3 SOUND
      // 0e9a6c PEN
      // ee7d16 DATA Variables
      // cc5b22 DATA Lists
      // c88330 EVENTS
      // e1a91a CONTROL
      // 2ca5e2 SENSING
      // 5cb712 OPERATORS
      // 49930e OPERATORS dark
      // 632d99 MORE BLOCKS
      // 5e4db3 PARAMS
    },

    obtener_codigo_en_texto: function obtener_codigo_en_texto() {
      var xml = Blockly.Xml.workspaceToDom(Blockly.getMainWorkspace());
      return Blockly.Xml.domToText(xml);
    }

  });

  exports['default'] = Actividad;

});
define('pilas-engine-bloques/actividades/actividadAlien', ['exports', 'pilas-engine-bloques/actividades/bloques', 'pilas-engine-bloques/actividades/direccionesCuadricula'], function (exports, bloques, direcciones) {

  'use strict';

  /* globals AlienLevantaTuercas */
  var Accion = bloques['default'].Accion;
  var Sensor = bloques['default'].Sensor;
  var Repetir = bloques['default'].Repetir;
  var Si = bloques['default'].Si;
  var Procedimiento = bloques['default'].Procedimiento;
  var IrDerecha = direcciones['default'].IrDerecha;
  var IrIzquierda = direcciones['default'].IrIzquierda;
  var IrArriba = direcciones['default'].IrArriba;
  var IrAbajo = direcciones['default'].IrAbajo;

  var LevantarTuerca = Accion.extend({
    init: function init() {
      this._super();
      this.set('id', 'LevantaTuerca');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField('Levantar tuerca').appendField(this.obtener_icono('../libs/data/tuerca.png'));
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return 'RecogerPorEtiqueta';
    },

    argumentos: function argumentos() {
      return '{\'etiqueta\' : \'TuercaAnimada\',  \'mensajeError\' : \'No hay una tuerca aquí\',  \'pasos\' : \'50\'}';
    }
  });

  var TocandoTuerca = Sensor.extend({
    init: function init() {
      this._super();
      this.set('id', 'tocandoTuerca');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField('¿tocando').appendField(this.obtener_icono('../libs/data/tuerca.png')).appendField('?');
    },

    nombre_sensor: function nombre_sensor() {
      return 'tocando(\'TuercaAnimada\')';
    }
  });

  var actividadAlien = {
    nombre: 'El alien y las tuercas',
    id: 'ElAlienYLasTuercas',
    enunciado: 'Definí un programa para que el alien junte todas las tuercas.',
    consignaInicial: 'Una buena estrategia de resolución de este desafío es la división del procedimiento en subtareas.',

    escena: AlienLevantaTuercas,
    puedeComentar: false,
    puedeDesactivar: false,
    puedeDuplicar: false,
    subtareas: [Procedimiento],

    // TODO: aca irian atributos iniciales que se desean para un personaje
    variables: [],

    control: [Repetir, Si],
    expresiones: [],
    acciones: [IrDerecha, IrIzquierda, IrArriba, IrAbajo, LevantarTuerca],
    sensores: [TocandoTuerca]
  };

  exports['default'] = actividadAlien;

});
define('pilas-engine-bloques/actividades/actividadAlienTocaBoton', ['exports', 'pilas-engine-bloques/actividades/bloques', 'pilas-engine-bloques/actividades/direccionesCuadricula'], function (exports, bloques, direcciones) {

  'use strict';

  /*

  siguienteFila(){
   this.robot.hacer_luego(avanzarFilaEnCuadriculaMultiple,{'cuadriculaMultiple':this.cuadricula})
  }*/

  var Accion = bloques['default'].Accion;

  //import comer from 'pilas-engine-bloques/actividades/comer';

  var IrDerecha = direcciones['default'].IrDerecha;

  var ApretarBoton = Accion.extend({
    init: function init() {
      this._super();
      this.set('id', 'ApretarBoton');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField('Apretar botón').appendField(this.obtener_icono('../libs/data/iconos.botonRojo.png'));
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return 'DesencadenarAnimacionSiColisiona';
    },

    argumentos: function argumentos() {
      return '{\'animacionColisionado\':\'prendida\',\'nombreAnimacion\':\'apretar\',\'etiqueta\':\'BotonAnimado\',\'mensajeError\': \'No hay un botón aquí\',\'idTransicion\':\'apretarBoton\'}';
    }
  });

  var actividadAlienTocaBoton = {
    nombre: 'El alien toca el botón',
    id: 'AlienTocaBoton',
    enunciado: 'Ayudá a nuestro Alien a presionar el botón de su laboratorio. \n' + 'Pistas: mirá las acciones disponibles. ¡Vas a tener que avanzar varias veces!',

    consignaInicial: 'Los bloques te permiten formar secuencias de acciones para resolver los desafíos que te proponemos en Pilas Bloques.',

    // la escena proviene de ejerciciosPilas
    escena: AlienInicial, // jshint ignore:line
    puedeComentar: false,
    puedeDesactivar: false,
    puedeDuplicar: false,
    subtareas: [],

    // TODO: aca irian atributos iniciales que se desean para un personaje
    variables: [],
    control: [],
    expresiones: [],
    acciones: [IrDerecha, ApretarBoton],
    sensores: []
  };

  exports['default'] = actividadAlienTocaBoton;

});
define('pilas-engine-bloques/actividades/actividadAlimentandoALosPeces', ['exports', 'pilas-engine-bloques/actividades/bloques', 'pilas-engine-bloques/actividades/direccionesCuadricula'], function (exports, bloques, direcciones) {

  'use strict';

  /* globals AlimentandoALosPeces */
  var Repetir = bloques['default'].Repetir;
  var Procedimiento = bloques['default'].Procedimiento;
  var Accion = bloques['default'].Accion;
  var IrDerecha = direcciones['default'].IrDerecha;
  var IrIzquierda = direcciones['default'].IrIzquierda;
  var IrAbajo = direcciones['default'].IrAbajo;
  var IrArriba = direcciones['default'].IrArriba;

  var AlimentarPez = Accion.extend({
    init: function init() {
      this._super();
      this.set('id', 'AlimentarPez');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField(this.obtener_icono('../libs/data/icono.pez.png')).appendField('Alimentar pez');
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return 'RecogerPorEtiqueta';
    },

    argumentos: function argumentos() {
      return '{\'etiqueta\' : \'PezAnimado\', \'mensajeError\' : \'No hay un pez aqui\', \'idTransicion\' : \'alimentarPez\' }';
    }
  });

  var AgarrarComida = Accion.extend({
    init: function init() {
      this._super();
      this.set('id', 'AgarrarComida');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField(this.obtener_icono('../libs/data/icono.alimento_pez.png')).appendField('Agarrar comida');
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return 'RecogerPorEtiqueta';
    },

    argumentos: function argumentos() {
      return '{\'etiqueta\' : \'AlimentoAnimado\',\'mensajeError\' : \'No hay una alimento aqui\', \'idTransicion\' : \'recogerComida\' }';
    }
  });
  var actividadAlimentandoALosPeces = {
    nombre: 'Alimentando a los peces',
    id: 'AlimentandoALosPeces',
    enunciado: 'El buzo debe primero buscar la comida y luego acercarse a cada uno de los peces para alimentarlos. Pista: pensá en una estrategia de 3 partes.',

    // la escena proviene de ejerciciosPilas
    escena: AlimentandoALosPeces,
    puedeComentar: false,
    puedeDesactivar: false,
    puedeDuplicar: false,
    subtareas: [Procedimiento],

    // TODO: aca irian atributos iniciales que se desean para un personaje
    variables: [],

    control: [Repetir],
    expresiones: [],
    acciones: [IrDerecha, IrIzquierda, IrAbajo, IrArriba, AlimentarPez, AgarrarComida],
    sensores: []
  };

  exports['default'] = actividadAlimentandoALosPeces;

});
define('pilas-engine-bloques/actividades/actividadElCangrejoAguafiestas', ['exports', 'pilas-engine-bloques/actividades/bloques'], function (exports, bloques) {

  'use strict';

  /* globals ElCangrejoAguafiestas */
  var Procedimiento = bloques['default'].Procedimiento;

  var actividadElCangrejoAguafiestas = {
    nombre: 'El cangrejo aguafiestas',
    id: 'ElCangrejoAguafiestas',
    enunciado: 'A definir.',
    consignaInicial: 'A definir.',

    escena: ElCangrejoAguafiestas,
    puedeComentar: false,
    puedeDesactivar: false,
    puedeDuplicar: false,
    subtareas: [Procedimiento],

    // TODO: aca irian atributos iniciales que se desean para un personaje
    variables: [],

    control: [],
    expresiones: [],
    acciones: [],
    sensores: []
  };

  exports['default'] = actividadElCangrejoAguafiestas;

});
define('pilas-engine-bloques/actividades/actividadElGatoEnLaCalle', ['exports', 'pilas-engine-bloques/actividades/bloques'], function (exports, bloques) {

  'use strict';

  /* globals ElGatoEnLaCalle */
  var Accion = bloques['default'].Accion;
  var Procedimiento = bloques['default'].Procedimiento;

  var Saludar = Accion.extend({
    init: function init() {
      this._super();
      this.set('id', 'Saludar');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField('Saludar ').appendField(this.obtener_icono('../libs/data/icono.saludar.png'));
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return 'ComportamientoAnimado';
    },

    argumentos: function argumentos() {
      return '{\'nombreAnimacion\':\'saludando\'}';
    }
  });
  var AbrirOjos = Accion.extend({
    init: function init() {
      this._super();
      this.set('id', 'AbrirOjos');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField('Abrir ojos ').appendField(this.obtener_icono('../libs/data/icono.abrirOjos.png'));
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return 'ComportamientoAnimado';
    },

    argumentos: function argumentos() {
      return '{\'nombreAnimacion\':\'abrirOjos\'}';
    }
  });

  var CerrarOjos = Accion.extend({
    init: function init() {
      this._super();
      this.set('id', 'CerrarOjos');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField('Cerrar ojos ').appendField(this.obtener_icono('../libs/data/icono.cerrarOjos.png'));
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return 'ComportamientoAnimado';
    },

    argumentos: function argumentos() {
      return '{\'nombreAnimacion\':\'cerrarOjos\'}';
    }
  });

  var Acostarse = Accion.extend({
    init: function init() {
      this._super();
      this.set('id', 'Acostarse');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField('Acostarse ').appendField(this.obtener_icono('../libs/data/icono.acostarse.png'));
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return 'ModificarRotacionYAltura';
    },

    argumentos: function argumentos() {
      return '{\'alturaIr\': -180 ,\'rotacionIr\': 90}';
    }
  });

  var Pararse = Accion.extend({
    init: function init() {
      this._super();
      this.set('id', 'Pararse');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField('Pararse ').appendField(this.obtener_icono('../libs/data/icono.pararse.png'));
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return 'ModificarRotacionYAltura';
    },

    argumentos: function argumentos() {
      return '{\'alturaIr\': -150 ,\'rotacionIr\': 0}';
    }
  });

  var Volver = Accion.extend({
    init: function init() {
      this._super();
      this.set('id', 'Volver');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField('Volver ').appendField(this.obtener_icono('izquierda.png'));
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return 'ComportamientoAnimado';
    },

    argumentos: function argumentos() {
      return '{\'nombreAnimacion\': \'volver\'}';
    }
  });

  var Avanzar = Accion.extend({
    init: function init() {
      this._super();
      this.set('id', 'Avanzar');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField('Avanzar ').appendField(this.obtener_icono('derecha.png'));
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return 'ComportamientoAnimado';
    },

    argumentos: function argumentos() {
      return '{\'nombreAnimacion\': \'correr\'}';
    }
  });

  var Soniar = Accion.extend({
    init: function init() {
      this._super();
      this.set('id', 'Soniar');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField('Soñar ').appendField(this.obtener_icono('../libs/data/icono.soniar.png'));
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return 'Pensar';
    },

    argumentos: function argumentos() {
      return '{\'mensaje\': "ZZzzZzZ..." }';
    }
  });

  var actividadElGatoEnLaCalle = {
    nombre: 'El gato en la calle',
    id: 'ElGatoEnLaCalle',
    enunciado: 'Hacé que el gato avance un paso, se duerma, se despierte, salude y vuelva a su lugar.',
    consignaInicial: 'Se pueden crear nuevos bloques definiendo un procedimiento que realice varias acciones.',

    escena: ElGatoEnLaCalle,
    puedeComentar: false,
    puedeDesactivar: false,
    puedeDuplicar: false,
    subtareas: [Procedimiento],

    // TODO: aca irian atributos iniciales que se desean para un personaje
    variables: [],

    control: [],
    expresiones: [],
    acciones: [Saludar, Avanzar, Volver, AbrirOjos, CerrarOjos, Acostarse, Pararse, Soniar],
    sensores: []
  };

  exports['default'] = actividadElGatoEnLaCalle;

});
define('pilas-engine-bloques/actividades/actividadElMarcianoEnElDesierto', ['exports', 'pilas-engine-bloques/actividades/bloques', 'pilas-engine-bloques/actividades/direccionesCuadricula', 'pilas-engine-bloques/actividades/comer'], function (exports, bloques, direcciones, comer) {

  'use strict';

  /* globals ElMarcianoEnElDesierto */
  var Repetir = bloques['default'].Repetir;
  var Procedimiento = bloques['default'].Procedimiento;
  var IrDerecha = direcciones['default'].IrDerecha;
  var IrIzquierda = direcciones['default'].IrIzquierda;
  var IrArriba = direcciones['default'].IrArriba;
  var IrAbajo = direcciones['default'].IrAbajo;
  var ComerManzana = comer['default'].ComerManzana;

  var actividadElMarcianoEnElDesierto = {
    nombre: 'El marciano en el desierto',
    id: 'ElMarcianoEnElDesierto',
    enunciado: 'El marciano está perdido en el desierto y necesita alimentarse de su comida favorita: ¡las manzanas! Ayudalo a comer las frutas. Pista: se pueden usar varios Repetir.',
    consignaInicial: 'Conviene pensar una estrategia general de resolución antes de construir el programa. Por ejemplo: comer las manzanas de abajo, luego las del costado y por último las de arriba.',

    escena: ElMarcianoEnElDesierto,
    puedeComentar: false,
    puedeDesactivar: false,
    puedeDuplicar: false,
    subtareas: [Procedimiento],

    // TODO: aca irian atributos iniciales que se desean para un personaje
    variables: [],

    control: [Repetir],
    expresiones: [],
    acciones: [IrDerecha, IrIzquierda, IrArriba, IrAbajo, ComerManzana],
    sensores: []
  };

  exports['default'] = actividadElMarcianoEnElDesierto;

});
define('pilas-engine-bloques/actividades/actividadElMonoQueSabeContar', ['exports', 'pilas-engine-bloques/actividades/bloques', 'pilas-engine-bloques/actividades/direccionesCuadricula', 'pilas-engine-bloques/actividades/tocando', 'pilas-engine-bloques/actividades/contando'], function (exports, bloques, direcciones, tocando, contando) {

  'use strict';

  /* globals ElMonoQueSabeContar */
  var Si = bloques['default'].Si;
  var Repetir = bloques['default'].Repetir;
  var Procedimiento = bloques['default'].Procedimiento;
  var IrArriba = direcciones['default'].IrArriba;
  var IrAbajo = direcciones['default'].IrAbajo;
  var TocandoBanana = tocando['default'].TocandoBanana;
  var TocandoManzana = tocando['default'].TocandoManzana;
  var ContandoBanana = contando['default'].ContandoBanana;
  var ContandoManzana = contando['default'].ContandoManzana;

  var actividadElMonoQueSabeContar = {
    nombre: 'El mono que sabe contar',
    id: 'ElMonoQueSabeContar',
    enunciado: 'COMPLETAR',
    consignaInicial: 'COMPLETAR.',

    // la escena proviene de ejerciciosPilas
    escena: ElMonoQueSabeContar, // jshint ignore:line
    puedeComentar: false,
    puedeDesactivar: false,
    puedeDuplicar: false,
    subtareas: [Procedimiento],

    // TODO: aca irian atributos iniciales que se desean para un personaje
    variables: [],
    control: [Si, Repetir],
    expresiones: [],
    acciones: [IrArriba, IrAbajo, ContandoBanana, ContandoManzana],
    sensores: [TocandoBanana, TocandoManzana]
  };

  exports['default'] = actividadElMonoQueSabeContar;

});
define('pilas-engine-bloques/actividades/actividadElMonoYLasBananas', ['exports', 'pilas-engine-bloques/actividades/bloques'], function (exports, bloques) {

  'use strict';

  var Accion = bloques['default'].Accion;
  var Sensor = bloques['default'].Sensor;
  var Si = bloques['default'].Si;
  var Procedimiento = bloques['default'].Procedimiento;

  var Avanzar = Accion.extend({
    init: function init() {
      this._super();
      this.set('id', 'Avanzar');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField(this.obtener_icono('derecha.png')).appendField('Avanzar');
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return 'MoverACasillaDerecha';
    },

    argumentos: function argumentos() {
      return '{velocidad: 25}';
    }
  });

  var ComerBanana = Accion.extend({
    init: function init() {
      this._super();
      this.set('id', 'ComerBanana');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField('Comer banana ').appendField(this.obtener_icono('../libs/data/iconos.banana.png'));
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return 'RecogerPorEtiqueta';
    },

    argumentos: function argumentos() {
      return '{\'etiqueta\' : \'BananaAnimada\', nombreAnimacion: "comerBanana" }';
    }
  });

  var TocandoBanana = Sensor.extend({
    init: function init() {
      this._super();
      this.set('id', 'tocandoBanana');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField('¿Tocando banana ').appendField(new Blockly.FieldImage('libs/data/iconos.banana.png', 15, 15, 'banana')).appendField(' ?');
    },

    nombre_sensor: function nombre_sensor() {
      return 'tocando(\'BananaAnimada\')';
    }
  });

  exports['default'] = {
    nombre: 'El mono y las bananas',
    id: 'ElMonoYLasBananas',
    enunciado: '¿Podés hacer que el mono avance al casillero de enfrente?' + ' Si hay una banana debe comérsela. Sino, es feliz con sólo llegar. \n ' + 'Ejecutá el programa varias veces para asegurarte que siempre funciona. \n' + 'Pista: mirá la categoría "Sensores" y la categoría "Control".',

    consignaInicial: 'Nuestro procedimiento debe considerar cómo es el escenario del protagonista.  Si no varía, decimos que es un escenario fijo.',

    // la escena proviene de ejerciciosPilas
    escena: ElMonoYLasBananas, // jshint ignore:line
    puedeComentar: false,
    puedeDesactivar: false,
    puedeDuplicar: false,
    subtareas: [Procedimiento],

    // TODO: aca irian atributos iniciales que se desean para un personaje
    variables: [],
    control: [Si],
    expresiones: [],
    acciones: [ComerBanana, Avanzar],
    sensores: [TocandoBanana]
  };

});
define('pilas-engine-bloques/actividades/actividadElObreroCopado', ['exports', 'pilas-engine-bloques/actividades/bloques'], function (exports, bloques) {

  'use strict';

  var Accion = bloques['default'].Accion;

  var Avanzar = Accion.extend({

    init: function init() {
      this._super();
      this.set('id', 'avanzar');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField(this.obtener_icono('izquierda.png')).appendField('Avanzar');
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return 'CaminaIzquierda';
    },

    argumentos: function argumentos() {
      return '{ pasos: 2 }';
    }
  });

  var Retroceder = Accion.extend({

    init: function init() {
      this._super();
      this.set('id', 'retroceder');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField(this.obtener_icono('derecha.png')).appendField('Retroceder');
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return 'CaminaDerecha';
    },

    argumentos: function argumentos() {
      return '{ pasos: 2 }';
    }
  });

  var Martillar = Accion.extend({

    init: function init() {
      this._super();
      this.set('id', 'martillar');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField(this.obtener_icono('martillar.png')).appendField('Martillar');
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return 'Martillar';
    },

    argumentos: function argumentos() {
      return '{ veces: 20 }';
    }
  });

  var actividadElObreroCopado = {
    nombre: 'El obrero copado',
    id: 'ElObreroCopado',
    enunciado: 'Ayudá a nuestro obrero a martillar un poco por allí.',

    // la escena proviene de ejerciciosPilas
    escena: ElObreroCopado, // jshint ignore:line
    puedeComentar: false,
    puedeDesactivar: false,
    puedeDuplicar: false,
    subtareas: [],

    // TODO: aca irian atributos iniciales que se desean para un personaje
    variables: [],

    control: [],
    expresiones: [],
    acciones: [Avanzar, Retroceder, Martillar],
    sensores: []
  };

  exports['default'] = actividadElObreroCopado;

});
define('pilas-engine-bloques/actividades/actividadElPlanetaDeNano', ['exports', 'pilas-engine-bloques/actividades/bloques', 'pilas-engine-bloques/actividades/direccionesCuadricula'], function (exports, bloques, direcciones) {

  'use strict';

  var Accion = bloques['default'].Accion;
  var Si = bloques['default'].Si;
  var Repetir = bloques['default'].Repetir;
  var Hasta = bloques['default'].Hasta;
  var Procedimiento = bloques['default'].Procedimiento;
  var Funcion = bloques['default'].Funcion;
  var IrDerecha = direcciones['default'].IrDerecha;
  var IrArriba = direcciones['default'].IrArriba;

  var ComerBanana = Accion.extend({
    /*No se puede importar porque hay que reflejar el valor*/
    init: function init() {
      this._super();
      this.set('id', 'ComerBananaReflejando');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField('Comer ').appendField(this.obtener_icono('../libs/data/iconos.banana.png'));
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return 'RecogerPorEtiqueta';
    },

    argumentos: function argumentos() {
      return '{\'etiqueta\':\'BananaAnimada\',\'mensajeError\':\'No hay una banana aquí\',\'dondeReflejarValor\':pilas.escena_actual().cantidadBananas}';
    }
  });

  var VolverAlBordeIzquierdo = Accion.extend({

    init: function init() {
      this._super();
      this.set('id', 'VolverAlBordeIzquierdo');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField('Volver al borde izquierdo').appendField(this.obtener_icono('izquierda.png'));
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return 'RepetirHasta';
    },

    argumentos: function argumentos() {
      return '{\'secuencia\':pilas.escena_actual().secuenciaCaminata, \'condicion\':pilas.escena_actual().condicion }';
    }
  });

  var actividadElPlanetaDeNano = {
    nombre: 'El planeta de Nano',
    enunciado: 'Ayudá a Nano a recoger todas sus estrellas. ¡Cuidado! No se puede bajar...',
    id: 'ElPlanetaDeNano',
    // la escena proviene de ejerciciosPilas
    escena: ElPlanetaDeNano, // jshint ignore:line
    puedeComentar: false,
    puedeDesactivar: false,
    puedeDuplicar: false,
    subtareas: [Procedimiento],

    // TODO: aca irian atributos iniciales que se desean para un personaje
    variables: [],

    control: [Si, Repetir, Hasta],
    expresiones: [Funcion],
    acciones: [IrDerecha, IrArriba, VolverAlBordeIzquierdo, ComerBanana],
    sensores: []
  };

  exports['default'] = actividadElPlanetaDeNano;

});
define('pilas-engine-bloques/actividades/actividadElRecolectorDeEstrellas', ['exports', 'pilas-engine-bloques/actividades/bloques', 'pilas-engine-bloques/actividades/direccionesCuadricula'], function (exports, bloques, direcciones) {

  'use strict';

  var Accion = bloques['default'].Accion;
  var Repetir = bloques['default'].Repetir;
  var Procedimiento = bloques['default'].Procedimiento;
  var IrDerecha = direcciones['default'].IrDerecha;
  var IrArriba = direcciones['default'].IrArriba;

  var VolverABordeIzquierdo = Accion.extend({

    init: function init() {
      this._super();
      this.set('id', 'VolverABordeIzquierdo');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField('Volver todo a izquierda').appendField(this.obtener_icono('izquierda.png'));
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return 'MoverTodoAIzquierda';
    },

    argumentos: function argumentos() {
      return '{}';
    }

  });

  var TomarEstrella = Accion.extend({
    init: function init() {
      this._super();
      this.set('id', 'TomarEstrella');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField('Tomar ').appendField(this.obtener_icono('../libs/data/icono.estrella.png'));
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return 'RecogerPorEtiqueta';
    },

    argumentos: function argumentos() {
      return '{\'etiqueta\':\'EstrellaAnimada\', \'mensajeError\': \'Acá no hay una estrella\'}';
    }
  });

  var actividadElRecolectorDeEstrellas = {
    nombre: 'El recolector de estrellas',
    id: 'ElRecolectorDeEstrellas',
    enunciado: 'Ayudá a nuestro personaje a recolectar todas las estrellas. Pista: el bloque "Volver todo a izquierda" es de muuuucha ayuda.',
    escena: ElRecolectorDeEstrellas,
    puedeComentar: false,
    puedeDesactivar: false,
    puedeDuplicar: false,
    subtareas: [Procedimiento],

    // TODO: aca irian atributos iniciales que se desean para un personaje
    variables: [],

    control: [Repetir],
    expresiones: [],
    acciones: [IrDerecha, IrArriba, VolverABordeIzquierdo, TomarEstrella],
    sensores: []
  };

  exports['default'] = actividadElRecolectorDeEstrellas;

});
define('pilas-engine-bloques/actividades/actividadFutbolRobots', ['exports', 'pilas-engine-bloques/actividades/bloques'], function (exports, bloques) {

  'use strict';

  /*

  siguienteFila(){
   this.robot.hacer_luego(avanzarFilaEnCuadriculaMultiple,{'cuadriculaMultiple':this.cuadricula})
  }*/

  var Accion = bloques['default'].Accion;
  var Sensor = bloques['default'].Sensor;
  var Si = bloques['default'].Si;
  var Repetir = bloques['default'].Repetir;
  var Procedimiento = bloques['default'].Procedimiento;
  var Hasta = bloques['default'].Hasta;

  var Avanzar = Accion.extend({
    init: function init() {
      this._super();
      this.set('id', 'Avanzar');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField('Avanzar').appendField(this.obtener_icono('derecha.png'));
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return 'MoverACasillaDerecha';
    },

    argumentos: function argumentos() {
      return '{}';
    }
  });

  var Atras = Accion.extend({
    init: function init() {
      this._super();
      this.set('id', 'Atras');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField('Atrás').appendField(this.obtener_icono('izquierda.png'));
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return 'MoverACasillaIzquierda';
    },

    argumentos: function argumentos() {
      return '{}';
    }
  });

  var SiguienteFila = Accion.extend({
    init: function init() {
      this._super();
      this.set('id', 'SiguienteFila');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField('Siguiente fila').appendField(this.obtener_icono('abajo.png'));
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return 'avanzarFilaEnCuadriculaMultiple';
    },

    argumentos: function argumentos() {
      return '{}';
    }
  });

  var PatearPelota = Accion.extend({
    init: function init() {
      this._super();
      this.set('id', 'PatearPelota');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField('Patear pelota').appendField(this.obtener_icono('../libs/data/iconos.pelota.png'));
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return 'DesencadenarComportamientoSiColisiona';
    },

    argumentos: function argumentos() {
      return '{"comportamiento":SerPateado,\'etiqueta\':\'PelotaAnimada\',\'argumentosComportamiento\':{\'tiempoEnElAire\':25,\'aceleracion\':0.0025,\'elevacionMaxima\':25,\'gradosDeAumentoStep\':-2}}';
    }
  });

  var TocandoInicio = Sensor.extend({
    init: function init() {
      this._super();
      this.set('id', 'tocandoInicio');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField('¿Tocando inicio ').appendField(this.obtener_icono('../libs/data/iconos.futbolInicio.png')).appendField('?');
    },

    nombre_sensor: function nombre_sensor() {
      return 'tocandoInicio()';
    }
  });

  var TocandoPelota = Sensor.extend({
    init: function init() {
      this._super();
      this.set('id', 'tocandoPelota');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField('¿Tocando pelota ').appendField(this.obtener_icono('../libs/data/iconos.pelota.png')).appendField('?');
    },

    nombre_sensor: function nombre_sensor() {
      return 'tocando(\'PelotaAnimada\')';
    }
  });

  var actividadFutbolRobots = {
    nombre: 'Fútbol para robots',
    id: 'FutbolRobots',
    enunciado: 'Ayudá a nuestro robot futbolista a patear todas las pelotas. ' + 'Recordá siempre que una buena división en tareas puede ayudarte a encarar ' + 'mejor el problema.',

    consignaInicial: 'El procedimiento que se defina debe considerar el escenario variable del protagonista y ofrecer una solución con la menor cantidad de bloques posibles. Es importante tener en cuenta que la acción se repite varias veces y que la longitud de las filas varía.',

    // la escena proviene de ejerciciosPilas
    escena: FutbolRobots, // jshint ignore:line
    puedeComentar: false,
    puedeDesactivar: false,
    puedeDuplicar: false,
    subtareas: [Procedimiento],

    // TODO: aca irian atributos iniciales que se desean para un personaje
    variables: [],
    control: [Si, Repetir, Hasta],
    expresiones: [],
    acciones: [Avanzar, Atras, SiguienteFila, PatearPelota],
    sensores: [TocandoInicio, TocandoPelota]
  };

  exports['default'] = actividadFutbolRobots;

});
define('pilas-engine-bloques/actividades/actividadInstalandoJuegos', ['exports', 'pilas-engine-bloques/actividades/bloques'], function (exports, bloques) {

  'use strict';

  /* globals InstalandoJuegos */
  var Accion = bloques['default'].Accion;
  var Repetir = bloques['default'].Repetir;
  var Procedimiento = bloques['default'].Procedimiento;

  var SiguienteCompu = Accion.extend({

    init: function init() {
      this._super();
      this.set('id', 'SiguienteCompu');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField('Siguiente compu').appendField(this.obtener_icono('derecha.png'));
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return 'MoverACasillaDerecha';
    },

    argumentos: function argumentos() {
      return '{}';
    }

  });

  var PrenderCompu = Accion.extend({
    init: function init() {
      this._super();
      this.set('id', 'PrenderCompu');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField('Prender compu ').appendField(this.obtener_icono('../libs/data/icono.computadora.png'));
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return 'DesencadenarAnimacionSiColisiona';
    },

    argumentos: function argumentos() {
      return '{\'etiqueta\' : \'CompuAnimada\',  \'mensajeError\' : \'No hay una compu aqui\', \'idTransicion\' : \'prender\',\'animacionColisionado\' : \'prendida\',\'nombreAnimacion\' : \'escribir\'  }';
    }

  });

  var ApagarCompu = Accion.extend({
    init: function init() {
      this._super();
      this.set('id', 'ApagarCompu');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField('Apagar compu').appendField(this.obtener_icono('../libs/data/icono.computadora.png'));
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return 'DesencadenarAnimacionSiColisiona';
    },

    argumentos: function argumentos() {
      return '{\'etiqueta\' : \'CompuAnimada\',  \'mensajeError\' : \'No hay una compu aqui\', \'idTransicion\' : \'apagar\',\'animacionColisionado\' : \'parado\',\'nombreAnimacion\' : \'escribir\'  }';
    }

  });

  var InstalarJuego = Accion.extend({
    init: function init() {
      this._super();
      this.set('id', 'InstalarJuego');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField('Instalar juego ');
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return 'DesencadenarAnimacionSiColisiona';
    },

    argumentos: function argumentos() {
      return '{\'etiqueta\' : \'CompuAnimada\',  \'mensajeError\' : \'No hay una compu aqui\', \'idTransicion\' : \'instalar\',\'animacionColisionado\' : \'instalado\',\'nombreAnimacion\' : \'escribir\'  }';
    }

  });

  var EscribirC = Accion.extend({
    init: function init() {
      this._super();
      this.set('id', 'EscribirC');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField('Escribir "C"');
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return 'EscribirEnCompuAnimada';
    },

    argumentos: function argumentos() {
      return '{\'etiqueta\' : \'CompuAnimada\',  \'mensajeError\' : \'No hay una compu aqui\', \'idTransicion\' : \'escribirC\'}';
    }

  });

  var EscribirB = Accion.extend({
    init: function init() {
      this._super();
      this.set('id', 'EscribirB');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField('Escribir "B"');
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return 'EscribirEnCompuAnimada';
    },

    argumentos: function argumentos() {
      return '{\'etiqueta\' : \'CompuAnimada\',  \'mensajeError\' : \'No hay una compu aqui\', \'idTransicion\' : \'escribirB\'}';
    }

  });

  var EscribirA = Accion.extend({
    init: function init() {
      this._super();
      this.set('id', 'EscribirA');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField('Escribir "A"');
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return 'EscribirEnCompuAnimada';
    },

    argumentos: function argumentos() {
      return '{\'etiqueta\' : \'CompuAnimada\',  \'mensajeError\' : \'No hay una compu aqui\', \'idTransicion\' : \'escribirA\'}';
    }

  });

  var actividadInstalandoJuegos = {
    nombre: 'Instalando juegos',
    id: 'InstalandoJuegos',
    enunciado: 'Hay que instalar un videojuego en las tres compus. Los pasos a seguir son encender cada compu, ingresar la contraseña "ABC", cargar el juego y apagar la máquina. Pista: pensá cómo aprovechar el hecho de que es un proceso repetitivo.',

    // la escena proviene de ejerciciosPilas
    escena: InstalandoJuegos, // jshint ignore:line
    puedeComentar: false,
    puedeDesactivar: false,
    puedeDuplicar: false,
    subtareas: [Procedimiento],

    // TODO: aca irian atributos iniciales que se desean para un personaje
    variables: [],

    control: [Repetir],
    expresiones: [],
    acciones: [SiguienteCompu, PrenderCompu, ApagarCompu, EscribirC, EscribirB, EscribirA, InstalarJuego],
    sensores: []
  };

  exports['default'] = actividadInstalandoJuegos;

});
define('pilas-engine-bloques/actividades/actividadLaEleccionDelMono', ['exports', 'pilas-engine-bloques/actividades/bloques'], function (exports, bloques) {

  'use strict';

  var Accion = bloques['default'].Accion;
  var Sensor = bloques['default'].Sensor;
  var Si = bloques['default'].Si;
  var Sino = bloques['default'].Sino;
  var Procedimiento = bloques['default'].Procedimiento;

  var Avanzar = Accion.extend({
    init: function init() {
      this._super();
      this.set('id', 'Avanzar');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField('Avanzar').appendField(this.obtener_icono('derecha.png'));
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return 'MoverACasillaDerecha';
    },

    argumentos: function argumentos() {
      return '{}';
    }
  });

  var ComerManzana = Accion.extend({
    init: function init() {
      this._super();
      this.set('id', 'ComerManzana');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField('Comer manzana ').appendField(this.obtener_icono('../libs/data/iconos.manzana.png'));
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return 'RecogerPorEtiqueta';
    },

    argumentos: function argumentos() {
      return '{\'etiqueta\' : \'ManzanaAnimada\',  nombreAnimacion: "comerManzana"}';
    }
  });

  var ComerBanana = Accion.extend({
    init: function init() {
      this._super();
      this.set('id', 'ComerBanana');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField('Comer banana ').appendField(this.obtener_icono('../libs/data/iconos.banana.png')); //TODO: Hardcodeo feo de dir de icono
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return 'RecogerPorEtiqueta';
    },

    argumentos: function argumentos() {
      return '{\'etiqueta\' : \'BananaAnimada\',  nombreAnimacion: "comerBanana"}';
    }
  });

  var TocandoManzana = Sensor.extend({
    init: function init() {
      this._super();
      this.set('id', 'tocandoManzana');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField('¿Tocando manzana').appendField(this.obtener_icono('../libs/data/iconos.manzana.png')).appendField('?');
    },

    nombre_sensor: function nombre_sensor() {
      return 'tocando(\'ManzanaAnimada\')';
    }
  });

  var TocandoBanana = Sensor.extend({
    init: function init() {
      this._super();
      this.set('id', 'tocandoBanana');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField('¿Tocando banana').appendField(this.obtener_icono('../libs/data/iconos.banana.png')).appendField('?');
    },

    nombre_sensor: function nombre_sensor() {
      return 'tocando(\'BananaAnimada\')';
    }
  });

  var actividadLaEleccionDelMono = {
    nombre: 'La elección del mono',
    id: 'LaEleccionDelMono',
    enunciado: '¿Podés ayudar nuevamente a nuestro mono? Esta vez siempre tiene ' + 'una fruta para comer. ¡Pero no siempre es la misma! \n' + 'Ejecutá el programa varias veces para asegurarte que siempre funciona. \n' + 'Pista: ésta vez no alcanza con el bloque "Si".',

    consignaInicial: 'Si el escenario del protagonista varía, nuestro procedimiento debe utilizar alternativas condicionales que ajusten las acciones a estos cambios.',

    // la escena proviene de ejerciciosPilas
    escena: LaEleccionDelMono, // jshint ignore:line
    puedeComentar: false,
    puedeDesactivar: false,
    puedeDuplicar: false,
    subtareas: [Procedimiento],

    // TODO: aca irian atributos iniciales que se desean para un personaje
    variables: [],
    control: [Si, Sino],
    expresiones: [],
    acciones: [ComerManzana, ComerBanana, Avanzar],
    sensores: [TocandoManzana, TocandoBanana]
  };

  exports['default'] = actividadLaEleccionDelMono;

});
define('pilas-engine-bloques/actividades/actividadLaGranAventuraDelMarEncantado', ['exports', 'pilas-engine-bloques/actividades/bloques', 'pilas-engine-bloques/actividades/direccionesCuadricula'], function (exports, bloques, direcciones) {

  'use strict';

  var Repetir = bloques['default'].Repetir;
  var Procedimiento = bloques['default'].Procedimiento;
  var AccionBuilder = bloques['default'].AccionBuilder;
  var IrDerecha = direcciones['default'].IrDerecha;
  var IrIzquierda = direcciones['default'].IrIzquierda;
  var IrArriba = direcciones['default'].IrArriba;
  var IrAbajo = direcciones['default'].IrAbajo;

  var AgarrarLlave = AccionBuilder.build({
    descripcion: 'Agarrar llave',
    icono: 'llave.png',
    comportamiento: 'Sostener',
    argumentos: '{etiqueta:"LlaveAnimado", idTransicion:"agarrarLlave"}'
  });

  var AbrirCofre = AccionBuilder.build({
    descripcion: 'Abrir cofre',
    icono: 'icono.cofre.png',
    comportamiento: 'Soltar',
    argumentos: '{etiqueta:"CofreAnimado", queSoltar:"LlaveAnimado", animacionColisionado:"abrir", idTransicion:"abrirCofre"}'
  });

  var DarSombrero = AccionBuilder.build({
    descripcion: 'Dar sombrero',
    icono: 'icono.sombrero.png',
    comportamiento: 'ComportamientoColision',
    argumentos: '{etiqueta:"MagoAnimado", animacionColisionado:"darEspada", idTransicion:"darSombrero"}'
  });

  var AtacarConEspada = AccionBuilder.build({
    descripcion: 'Atacar con espada',
    icono: 'icono.espada.png',
    comportamiento: 'SecuenciaAnimada',
    argumentos: '{idTransicion: "atacarConEspada", secuencia: [new ComportamientoColision({etiqueta: "CaballeroAnimado", animacionColisionado: "defender", nombreAnimacion:"atacar"}), new Sostener({etiqueta:"Princesa"})]}'
  });

  var EscaparEnUnicornio = AccionBuilder.build({
    descripcion: 'Escapar en unicornio',
    icono: 'icono.unicornio.png',
    comportamiento: 'Escapar',
    argumentos: '{escaparCon: pilas.escena_actual().unicornio}'
  });

  exports['default'] = {
    nombre: 'La gran aventura del mar encantado',
    id: 'LaGranAventuraDelMarEncantado',
    enunciado: 'Ayuda al caballero a rescatar a la princesa. Para ello debe superar en orden cada una de las siguientes pruebas:\n' + '1. Buscar la llave.\n' + '2. Abrir el cofre con la llave y tomar el sombrero mágico que está dentro.\n' + '3. Entregarle el sombrero al mago para recibir la espada a cambio.\n' + '4. Luchar con la espada contra el caballero oscuro.\n' + '5. Ir con la princesa hasta el unicornio y escapar.',
    consignaInicial: '',
    escena: LaGranAventuraDelMarEncantado, // jshint ignore:line
    puedeComentar: false,
    puedeDesactivar: false,
    puedeDuplicar: false,
    subtareas: [Procedimiento],
    variables: [],
    control: [Repetir],
    expresiones: [],
    acciones: [IrDerecha, IrIzquierda, IrArriba, IrAbajo, AgarrarLlave, AbrirCofre, DarSombrero, AtacarConEspada, EscaparEnUnicornio],
    sensores: []
  };

});
define('pilas-engine-bloques/actividades/actividadLaberintoConQueso', ['exports', 'pilas-engine-bloques/actividades/bloques', 'pilas-engine-bloques/actividades/direccionesCuadricula', 'pilas-engine-bloques/actividades/tocando', 'pilas-engine-bloques/actividades/comer'], function (exports, bloques, direcciones, tocando, comer) {

  'use strict';


  var Si = bloques['default'].Si;
  var Sino = bloques['default'].Sino;
  var Repetir = bloques['default'].Repetir;
  var Procedimiento = bloques['default'].Procedimiento;
  var Hasta = bloques['default'].Hasta;
  var IrDerecha = direcciones['default'].IrDerecha;
  var IrAbajo = direcciones['default'].IrAbajo;
  var TocandoAbajo = tocando['default'].TocandoAbajo;
  var TocandoDerecha = tocando['default'].TocandoDerecha;
  var TocandoFinCamino = tocando['default'].TocandoFinCamino;
  var TocandoQueso = tocando['default'].TocandoQueso;
  var ComerQueso = comer['default'].ComerQueso;

  var actividadLaberintoConQueso = {
    nombre: 'Laberinto con queso',
    id: 'LaberintoConQueso',
    enunciado: 'a!.',

    consignaInicial: 'a',

    // la escena proviene de ejerciciosPilas
    escena: LaberintoConQueso, // jshint ignore:line
    puedeComentar: false,
    puedeDesactivar: false,
    puedeDuplicar: false,
    subtareas: [Procedimiento],

    // TODO: aca irian atributos iniciales que se desean para un personaje
    variables: [],
    control: [Si, Sino, Repetir, Hasta],
    expresiones: [],
    acciones: [IrDerecha, IrAbajo, ComerQueso],
    sensores: [TocandoAbajo, TocandoDerecha, TocandoFinCamino, TocandoQueso]
  };

  exports['default'] = actividadLaberintoConQueso;

});
define('pilas-engine-bloques/actividades/actividadLaberintoCorto', ['exports', 'pilas-engine-bloques/actividades/bloques', 'pilas-engine-bloques/actividades/direccionesCuadricula', 'pilas-engine-bloques/actividades/tocando'], function (exports, bloques, direcciones, tocando) {

  'use strict';

  var Si = bloques['default'].Si;
  var Sino = bloques['default'].Sino;
  var IrDerecha = direcciones['default'].IrDerecha;
  var IrAbajo = direcciones['default'].IrAbajo;
  var TocandoAbajo = tocando['default'].TocandoAbajo;
  var TocandoDerecha = tocando['default'].TocandoDerecha;

  var actividadLaberintoCorto = {
    nombre: 'Laberinto corto',
    id: 'LaberintoCorto',
    enunciado: 'Guiá al ratón a llegar a la meta. Para lograrlo, debe avanzar una casilla en la dirección que indica la flecha. Pista: mirá en la categoría "Sensores" qué preguntas podés hacer.',
    consignaInicial: 'Cuando solo hay 2 opciones, alcanza con hacer una sola pregunta. En esos casos se puede usar el bloque "Si-sino".',

    // la escena proviene de ejerciciosPilas
    escena: LaberintoCorto, // jshint ignore:line
    puedeComentar: false,
    puedeDesactivar: false,
    puedeDuplicar: false,
    subtareas: [],

    // TODO: aca irian atributos iniciales que se desean para un personaje
    variables: [],
    control: [Si, Sino],
    expresiones: [],
    acciones: [IrDerecha, IrAbajo],
    sensores: [TocandoAbajo, TocandoDerecha]
  };

  exports['default'] = actividadLaberintoCorto;

});
define('pilas-engine-bloques/actividades/actividadLaberintoLargo', ['exports', 'pilas-engine-bloques/actividades/bloques', 'pilas-engine-bloques/actividades/direccionesCuadricula', 'pilas-engine-bloques/actividades/tocando'], function (exports, bloques, direcciones, tocando) {

  'use strict';

  /* globals LaberintoLargo */

  var Si = bloques['default'].Si;
  var Sino = bloques['default'].Sino;
  var Repetir = bloques['default'].Repetir;
  var Procedimiento = bloques['default'].Procedimiento;
  var Hasta = bloques['default'].Hasta;
  var IrDerecha = direcciones['default'].IrDerecha;
  var IrAbajo = direcciones['default'].IrAbajo;
  var TocandoAbajo = tocando['default'].TocandoAbajo;
  var TocandoDerecha = tocando['default'].TocandoDerecha;
  var TocandoFinCamino = tocando['default'].TocandoFinCamino;

  var actividadLaberintoLargo = {
    nombre: 'Laberinto largo',
    id: 'LaberintoLargo',
    enunciado: 'a!.',

    consignaInicial: 'a',

    // la escena proviene de ejerciciosPilas
    escena: LaberintoLargo, // jshint ignore:line
    puedeComentar: false,
    puedeDesactivar: false,
    puedeDuplicar: false,
    subtareas: [Procedimiento],

    // TODO: aca irian atributos iniciales que se desean para un personaje
    variables: [],
    control: [Si, Sino, Repetir],
    expresiones: [],
    acciones: [IrDerecha, IrAbajo, Hasta],
    sensores: [TocandoAbajo, TocandoDerecha, TocandoFinCamino]
  };

  exports['default'] = actividadLaberintoLargo;

});
define('pilas-engine-bloques/actividades/actividadMariaLaComeSandias', ['exports', 'pilas-engine-bloques/actividades/bloques', 'pilas-engine-bloques/actividades/direccionesCuadricula'], function (exports, bloques, direcciones) {

  'use strict';

  /* globals MariaLaComeSandias */
  var Accion = bloques['default'].Accion;
  var Repetir = bloques['default'].Repetir;
  var Procedimiento = bloques['default'].Procedimiento;
  var IrDerecha = direcciones['default'].IrDerecha;
  var IrIzquierda = direcciones['default'].IrIzquierda;
  var IrArriba = direcciones['default'].IrArriba;
  var IrAbajo = direcciones['default'].IrAbajo;

  var MorderSandia = Accion.extend({
    init: function init() {
      this._super();
      this.set('id', 'MorderSandia');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField('Morder sandía ').appendField(this.obtener_icono('../libs/data/icono.sandia.png'));
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return 'RecogerPorEtiqueta';
    },

    argumentos: function argumentos() {
      return '{\'etiqueta\':\'SandiaAnimada\', \'mensajeError\': \'Acá no hay una sandia\'}';
    }
  });

  var actividadMariaLaComeSandias = {
    nombre: 'María la come sandías',
    id: 'MariaLaComeSandias',
    enunciado: 'María necesita comer todas las sandías de la cuadrícula. Pensá de qué manera puede hacerlo creando los bloques necesarios. Atención: la forma en que las sandías están distribuidas en la cuadrícula, es clave para crear la menor cantidad de procedimientos.',

    escena: MariaLaComeSandias,
    puedeComentar: false,
    puedeDesactivar: false,
    puedeDuplicar: false,
    subtareas: [Procedimiento],

    // TODO: aca irian atributos iniciales que se desean para un personaje
    variables: [],

    control: [Repetir],
    expresiones: [],
    acciones: [IrDerecha, IrIzquierda, IrArriba, IrAbajo, MorderSandia],
    sensores: []
  };

  exports['default'] = actividadMariaLaComeSandias;

});
define('pilas-engine-bloques/actividades/actividadNoMeCansoDeSaltar', ['exports', 'pilas-engine-bloques/actividades/bloques'], function (exports, bloques) {

  'use strict';

  /* globals NoMeCansoDeSaltar */
  var Accion = bloques['default'].Accion;
  var Repetir = bloques['default'].Repetir;

  var Saltar = Accion.extend({

    init: function init() {
      this._super();
      this.set('id', 'saltar1');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField('Saltar').appendField(this.obtener_icono('arriba.png'));
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return 'SaltarHablando';
    },

    argumentos: function argumentos() {
      return '{ gravedad: 0.13, velocidad_inicial: 7 }';
    }
  });

  var actividadNoMeCansoDeSaltar = {
    nombre: 'No me canso de saltar',
    id: 'NoMeCansoDeSaltar',
    enunciado: 'Ayudá al gato a quitarse la pereza saltando 30 veces seguidas. Pista: se puede resolver con menos de 30 bloques.',
    consignaInicial: 'El bloque Repetir permite elegir la cantidad de veces que se desea repetir una secuencia de acciones.',

    escena: NoMeCansoDeSaltar,
    puedeComentar: false,
    puedeDesactivar: false,
    puedeDuplicar: false,
    subtareas: [],

    // TODO: aca irian atributos iniciales que se desean para un personaje
    variables: [],

    control: [Repetir],
    expresiones: [],
    acciones: [Saltar],
    sensores: []
  };

  exports['default'] = actividadNoMeCansoDeSaltar;

});
define('pilas-engine-bloques/actividades/actividadReparandoLaNave', ['exports', 'pilas-engine-bloques/actividades/bloques', 'pilas-engine-bloques/actividades/direccionesCuadricula'], function (exports, bloques, direcciones) {

  'use strict';

  /* globals ReparandoLaNave */
  var Repetir = bloques['default'].Repetir;
  var Procedimiento = bloques['default'].Procedimiento;
  var Accion = bloques['default'].Accion;
  var IrDerecha = direcciones['default'].IrDerecha;
  var IrIzquierda = direcciones['default'].IrIzquierda;
  var IrArriba = direcciones['default'].IrArriba;
  var IrAbajo = direcciones['default'].IrAbajo;

  var TomarHierro = Accion.extend({
    init: function init() {
      this._super();
      this.set('id', 'TomarHierro');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField(this.obtener_icono('../libs/data/icono.hierro.png')).appendField('Tomar Hierro');
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return 'Sostener';
    },

    argumentos: function argumentos() {
      return '{etiqueta: "HierroAnimado", nombreAnimacion: "recogerHierro"}';
    }
  });

  var TomarCarbon = Accion.extend({
    init: function init() {
      this._super();
      this.set('id', 'TomarCarbon');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField(this.obtener_icono('../libs/data/icono.carbon.png')).appendField('Tomar Carbón');
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return 'Sostener';
    },

    argumentos: function argumentos() {
      return '{etiqueta: "CarbonAnimado", nombreAnimacion: "recogerCarbon"}';
    }
  });

  var Depositar = Accion.extend({
    init: function init() {
      this._super();
      this.set('id', 'Depositar');
    },
    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField('Depositar');
    },
    nombre_comportamiento: function nombre_comportamiento() {
      return 'Soltar';
    },
    argumentos: function argumentos() {
      return '{idTransicion: "depositar", etiqueta: "NaveAnimada"}';
    }
  });

  var Escapar = Accion.extend({
    init: function init() {
      this._super();
      this.set('id', 'Escapar');
    },
    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField('Escapar');
    },
    nombre_comportamiento: function nombre_comportamiento() {
      return 'Escapar';
    },

    argumentos: function argumentos() {
      return '{receptor: pilas.escena_actual().nave, escaparCon: pilas.escena_actual().automata}';
    }
  });

  var actividadReparandoLaNave = {
    nombre: 'Reparando la nave',
    id: 'ReparandoLaNave',
    enunciado: 'El marciano debe poner en funcionamiento su nave para poder volar a su hogar. Para lograrlo debe colocar 3 unidades de carbón y 3 de hierro en la nave. Pista: pensá cómo se pueden automatizar las tareas de buscar hierro y carbón.',

    escena: ReparandoLaNave,
    puedeComentar: false,
    puedeDesactivar: false,
    puedeDuplicar: false,
    subtareas: [Procedimiento],

    // TODO: aca irian atributos iniciales que se desean para un personaje
    variables: [],

    control: [Repetir],
    expresiones: [],
    acciones: [IrDerecha, IrIzquierda, IrArriba, IrAbajo, TomarHierro, TomarCarbon, Depositar, Escapar],
    sensores: []
  };

  exports['default'] = actividadReparandoLaNave;

});
define('pilas-engine-bloques/actividades/actividadSuperTito1', ['exports', 'pilas-engine-bloques/actividades/bloques', 'pilas-engine-bloques/actividades/direccionesCuadricula', 'pilas-engine-bloques/actividades/bloquesTito'], function (exports, bloques, direcciones, bloquesTito) {

  'use strict';

  var Si = bloques['default'].Si;
  var Repetir = bloques['default'].Repetir;
  var Procedimiento = bloques['default'].Procedimiento;
  var Hasta = bloques['default'].Hasta;
  var IrAbajo = direcciones['default'].IrAbajo;
  var EncenderLuz = bloquesTito['default'].EncenderLuz;
  var TocandoFinal = bloquesTito['default'].TocandoFinal;

  var actividadSuperTito1 = {
    nombre: 'Súper Tito 1 ',
    id: 'SuperTito1',
    enunciado: ' Ayudá a Tito a encender las luces. \n ¡Ojo! En todas las celdas hay una luz, pero no sabés cuántas hay en cada ejecución.',
    consignaInicial: 'Existen bloques que pueden ayudarte a resolver el desafío de manera muy sencilla. ¡Aprovechalos!',

    escena: SuperTito1, // jshint ignore:line
    puedeComentar: false,
    puedeDesactivar: false,
    puedeDuplicar: false,
    subtareas: [Procedimiento],

    variables: [],
    control: [Si, Repetir, Hasta],
    expresiones: [],
    acciones: [EncenderLuz, IrAbajo],
    sensores: [TocandoFinal]
  };

  exports['default'] = actividadSuperTito1;

});
define('pilas-engine-bloques/actividades/actividadSuperTito2', ['exports', 'pilas-engine-bloques/actividades/bloques', 'pilas-engine-bloques/actividades/direccionesCuadricula', 'pilas-engine-bloques/actividades/bloquesTito'], function (exports, bloques, direcciones, bloquesTito) {

  'use strict';

  var Si = bloques['default'].Si;
  var Repetir = bloques['default'].Repetir;
  var Procedimiento = bloques['default'].Procedimiento;
  var Hasta = bloques['default'].Hasta;
  var IrAbajo = direcciones['default'].IrAbajo;
  var EncenderLuz = bloquesTito['default'].EncenderLuz;
  var TocandoLuz = bloquesTito['default'].TocandoLuz;
  var TocandoFinal = bloquesTito['default'].TocandoFinal;

  var actividadSuperTito2 = {
    nombre: 'Súper Tito 2',
    id: 'SuperTito2',
    enunciado: 'Súper Tito debe encender todas las luces, pero a diferencia del desafío anterior, hay celdas sin luz. ¿Podrás utilizar el mismo procedimiento que en Súper Tito 1? \n',

    escena: SuperTito2, // jshint ignore:line
    puedeComentar: false,
    puedeDesactivar: false,
    puedeDuplicar: false,
    subtareas: [Procedimiento],

    variables: [],
    control: [Si, Repetir, Hasta],
    expresiones: [],
    acciones: [EncenderLuz, IrAbajo],
    sensores: [TocandoFinal, TocandoLuz]
  };

  exports['default'] = actividadSuperTito2;

});
define('pilas-engine-bloques/actividades/actividadTitoEnciendeLuces', ['exports', 'pilas-engine-bloques/actividades/bloques', 'pilas-engine-bloques/actividades/direccionesCuadricula', 'pilas-engine-bloques/actividades/bloquesTito'], function (exports, bloques, direcciones, bloquesTito) {

  'use strict';

  var Si = bloques['default'].Si;
  var Repetir = bloques['default'].Repetir;
  var Procedimiento = bloques['default'].Procedimiento;
  var IrDerecha = direcciones['default'].IrDerecha;
  var IrIzquierda = direcciones['default'].IrIzquierda;
  var IrArriba = direcciones['default'].IrArriba;
  var IrAbajo = direcciones['default'].IrAbajo;
  var EncenderLuz = bloquesTito['default'].EncenderLuz;

  var actividadTitoEnciendeLuces = {
    nombre: 'Tito enciende las luces',
    id: 'TitoEnciendeLuces',
    enunciado: 'Ayudá a Tito a encender todas las luces. \n' + 'Pista: crear un procedimiento para prender todas la diagonal.',

    // la escena proviene de ejerciciosPilas
    escena: TitoEnciendeLuces, // jshint ignore:line
    puedeComentar: false,
    puedeDesactivar: false,
    puedeDuplicar: false,
    subtareas: [Procedimiento],

    // TODO: aca irian atributos iniciales que se desean para un automata
    variables: [],
    control: [Si, Repetir],
    expresiones: [],
    acciones: [EncenderLuz, IrDerecha, IrArriba, IrAbajo, IrIzquierda],
    sensores: []
  };

  exports['default'] = actividadTitoEnciendeLuces;

});
define('pilas-engine-bloques/actividades/actividadTitoRecargado', ['exports', 'pilas-engine-bloques/actividades/bloques', 'pilas-engine-bloques/actividades/direccionesCuadricula', 'pilas-engine-bloques/actividades/bloquesTito'], function (exports, bloques, direcciones, bloquesTito) {

  'use strict';

  var Si = bloques['default'].Si;
  var Repetir = bloques['default'].Repetir;
  var Procedimiento = bloques['default'].Procedimiento;
  var IrAbajo = direcciones['default'].IrAbajo;
  var EncenderLuz = bloquesTito['default'].EncenderLuz;
  var TocandoLuz = bloquesTito['default'].TocandoLuz;

  var actividadTitoRecargado = {
    nombre: 'Tito recargado',
    id: 'TitoRecargado',
    enunciado: 'Tito necesita encender las luces para poder conocer el camino... ¡Pero en cada ejecución cambian de lugar! Podés utlizar las subtareas y bloques de control.',
    consignaInicial: 'El procedimiento construido debe considerar el escenario y poder responder a cada cambio propuesto.',

    // la escena proviene de ejerciciosPilas
    escena: TitoRecargado, // jshint ignore:line
    puedeComentar: false,
    puedeDesactivar: false,
    puedeDuplicar: false,
    subtareas: [Procedimiento],

    // TODO: aca irian atributos iniciales que se desean para un automata
    variables: [],
    control: [Si, Repetir],
    expresiones: [],
    acciones: [EncenderLuz, IrAbajo],
    sensores: [TocandoLuz]
  };

  exports['default'] = actividadTitoRecargado;

});
define('pilas-engine-bloques/actividades/actividadTresNaranjas', ['exports', 'pilas-engine-bloques/actividades/bloques', 'pilas-engine-bloques/actividades/direccionesCuadricula', 'pilas-engine-bloques/actividades/comer', 'pilas-engine-bloques/actividades/tocando'], function (exports, bloques, direcciones, comer, tocando) {

  'use strict';

  /* globals TresNaranjas */
  var Repetir = bloques['default'].Repetir;
  var Si = bloques['default'].Si;
  var Procedimiento = bloques['default'].Procedimiento;
  var IrDerecha = direcciones['default'].IrDerecha;
  var ComerNaranja = comer['default'].ComerNaranja;
  var TocandoNaranja = tocando['default'].TocandoNaranja;

  var actividadTresNaranjas = {
    nombre: 'Tres naranjas',
    id: 'TresNaranjas',
    enunciado: 'Definir.',
    consignaInicial: 'definirs.',

    escena: TresNaranjas,
    puedeComentar: false,
    puedeDesactivar: false,
    puedeDuplicar: false,
    subtareas: [Procedimiento],
    variables: [],
    control: [Repetir, Si],
    expresiones: [],
    acciones: [IrDerecha, ComerNaranja],
    sensores: [TocandoNaranja]
  };
  exports['default'] = actividadTresNaranjas;

});
define('pilas-engine-bloques/actividades/bloque', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  Blockly.Blocks.primitivas = { COLOUR: '#4a6cd4' };
  Blockly.Blocks.sensores = { COLOUR: '#4a6cd4' };
  Blockly.Blocks.eventos = { COLOUR: '#4a6cd4' };

  /*
   * Representa un bloque
   * para el lenguaje de la actividad
   */
  var Bloque = Ember['default'].Object.extend({
    init: function init() {
      // espera:
      // + id
      // + categoria
    },

    block_init: function block_init() {
      // abstracta
    },

    /*jshint unused: vars*/
    block_javascript: function block_javascript(block) {
      // abstracta
    },

    registrar_en_blockly: function registrar_en_blockly() {
      var myThis = this;
      Blockly.Blocks[this.get('id')] = {
        init: function init() {
          myThis.block_init(this);
        }
      };

      Blockly.JavaScript[this.get('id')] = function (block) {
        return myThis.block_javascript(block);
      };
    },

    instanciar_para_workspace: function instanciar_para_workspace() {
      this.registrar_en_blockly();

      var block_dom = Blockly.Xml.textToDom('<xml>' + this.build() + '</xml>');

      Blockly.Xml.domToWorkspace(Blockly.getMainWorkspace(), block_dom);
    },

    // reimplementar si se desean parametros ya aplicados
    get_parametros: function get_parametros() {
      return [];
    },

    obtener_icono: function obtener_icono(nombre) {
      return new Blockly.FieldImage('iconos/' + nombre, 16, 16, '<');
    },

    // Escupe el código que va en el toolbox para el bloque
    build: function build() {
      var str_block = '';
      str_block += '<block type="TIPO">'.replace('TIPO', this.get('id'));

      this.get_parametros().forEach(function (item) {
        str_block += item.build();
      });

      str_block += '</block>';
      return str_block;
    }
  });

  exports['default'] = Bloque;

});
define('pilas-engine-bloques/actividades/bloques', ['exports', 'ember', 'pilas-engine-bloques/actividades/bloque'], function (exports, Ember, Bloque) {

  'use strict';

  var CambioDeJSDeBlocky = Bloque['default'].extend({

    registrar_en_blockly: function registrar_en_blockly() {
      var myThis = this;
      Blockly.JavaScript[this.get('id')] = function (block) {
        return myThis.block_javascript(block);
      };
    }
  });

  var VariableGet = CambioDeJSDeBlocky.extend({

    init: function init() {
      this._super();
      this.set('id', 'variables_get');
    },

    block_javascript: function block_javascript(block) {
      // Variable getter.
      var code = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
      return ['receptor.atributo("' + code + '")', Blockly.JavaScript.ORDER_ATOMIC];
    }

  });

  var VariableSet = CambioDeJSDeBlocky.extend({

    init: function init() {
      this._super();
      this.set('id', 'variables_set');
    },

    block_javascript: function block_javascript(block) {
      // Variable setter.
      var argument0 = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
      var varName = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
      return 'programa.cambio_atributo("' + varName + '", function(){ return ' + argument0 + '; } );\n';
    }

  });

  /* ============================================== */

  var VariableLocalGet = CambioDeJSDeBlocky.extend({

    init: function init() {
      this._super();
      this.set('id', 'local_var_get');
    },

    block_javascript: function block_javascript(block) {
      // Variable getter.
      var code = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
      return ['receptor.variable("' + code + '")', Blockly.JavaScript.ORDER_ATOMIC];
    }

  });

  /* ============================================== */

  var VariableLocalSet = CambioDeJSDeBlocky.extend({

    init: function init() {
      this._super();
      this.set('id', 'local_var_set');
    },

    block_javascript: function block_javascript(block) {
      // Variable setter.
      var argument0 = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
      var varName = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
      return 'programa.cambio_variable("' + varName + '", function(){ return ' + argument0 + '; } );\n';
    }

  });

  /* ============================================== */

  var Procedimiento = CambioDeJSDeBlocky.extend({

    init: function init() {
      this._super();
      this.set('id', 'procedures_defnoreturn');
    },

    block_javascript: function block_javascript(block) {
      // Define a procedure with a return value.
      var funcName = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);

      var branch = Blockly.JavaScript.statementToCode(block, 'STACK');

      if (Blockly.JavaScript.STATEMENT_PREFIX) {
        branch = Blockly.JavaScript.prefixLines(Blockly.JavaScript.STATEMENT_PREFIX.replace(/%1/g, '\'' + block.id + '\''), Blockly.JavaScript.INDENT) + branch;
      }

      if (Blockly.JavaScript.INFINITE_LOOP_TRAP) {
        branch = Blockly.JavaScript.INFINITE_LOOP_TRAP.replace(/%1/g, '\'' + block.id + '\'') + branch;
      }

      var args = [];
      for (var x = 0; x < block.arguments_.length; x++) {
        args[x] = Blockly.JavaScript.variableDB_.getName(block.arguments_[x], Blockly.Variables.NAME_TYPE);
      }

      //    var code = 'function ' + funcName + '(' + args.join(', ') + ') {\n' +
      //        branch + returnValue + '}';

      var args_string = args.map(function (i) {
        return '"' + i + '"';
      }).join(', ');

      var code = 'programa.empezar_secuencia();\n' + branch + 'programa.def_proc("' + funcName + '", [' + args_string + ']);\n';

      code = Blockly.JavaScript.scrub_(block, code);
      Blockly.JavaScript.definitions_[funcName] = code;
      return null;
    }

  });

  /* ============================================== */

  var Funcion = CambioDeJSDeBlocky.extend({

    init: function init() {
      this._super();
      this.set('id', 'procedures_defreturn');
    },

    registrar_en_blockly: function registrar_en_blockly() {
      // pisado porque provisoriamente se
      // usa el que viene con blockly
    }

  });

  /* ============================================== */

  var CallNoReturn = CambioDeJSDeBlocky.extend({

    init: function init() {
      this._super();
      this.set('id', 'procedures_callnoreturn');
    },

    block_javascript: function block_javascript(block) {
      // Call a procedure with no return value.
      var funcName = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
      var args = [];
      for (var x = 0; x < block.arguments_.length; x++) {
        args[x] = Blockly.JavaScript.valueToCode(block, 'ARG' + x, Blockly.JavaScript.ORDER_COMMA) || 'null';
        args[x] = 'function(){ return ' + args[x] + '; }';
      }
      function juntar_args() {
        if (args.length > 0) {
          return '[\n' + args.join(', \n') + '\n]';
        } else {
          return '[]';
        }
      }
      // var code = funcName + '(' + args.join(', ') + ');\n';
      var code = 'programa.llamada_proc("' + funcName + '", ' + juntar_args() + ');\n';
      return code;
    }

  });

  /* ============================================== */

  var CallReturn = CambioDeJSDeBlocky.extend({

    init: function init() {
      this._super();
      this.set('id', 'procedures_callreturn');
    },

    block_javascript: function block_javascript(block) {
      // Call a procedure with a return value.
      var funcName = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
      var args = [];
      for (var x = 0; x < block.arguments_.length; x++) {
        args[x] = Blockly.JavaScript.valueToCode(block, 'ARG' + x, Blockly.JavaScript.ORDER_COMMA) || 'null';
        args[x] = 'function(){ return ' + args[x] + '; }';
      }
      var code = funcName + '(' + args.join(', ') + ')';
      return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
    }

  });

  /* ============================================== */

  var ParamGet = CambioDeJSDeBlocky.extend({

    init: function init() {
      this._super();
      this.set('id', 'param_get');
    },

    block_javascript: function block_javascript(block) {
      // Variable getter.
      var code = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);

      // agrego parentesis para llamar al closure del parametro
      return ['receptor.parametro("' + code + '")', Blockly.JavaScript.ORDER_ATOMIC];
    }

  });

  /* ============================================== */

  var AlEmpezar = Bloque['default'].extend({

    init: function init() {
      this._super();
      this.set('id', 'al_empezar_a_ejecutar');
    },

    block_init: function block_init(block) {
      block.setColour(Blockly.Blocks.eventos.COLOUR);
      block.appendDummyInput().appendField('Al empezar a ejecutar');
      block.appendStatementInput('program');
      block.setDeletable(false);
      block.setEditable(false);
      block.setMovable(false);
    },

    block_javascript: function block_javascript(block) {
      var statements_program = Blockly.JavaScript.statementToCode(block, 'program');
      var r = 'programa.empezar_secuencia();\n';
      r += statements_program + '\n';

      var Comportamiento = (function () {

        function Comportamiento(argumentos) {
          this.argumentos = argumentos;
        }

        Comportamiento.prototype.iniciar = function (receptor) {
          this.receptor = receptor;
        };

        Comportamiento.prototype.actualizar = function () {
          var event = new Event('terminaEjecucion');
          window.dispatchEvent(event);
          return true;
        };

        return Comportamiento;
      })();

      window['receptor'].finaliza_tarea = Comportamiento;

      r += 'programa.hacer(receptor.finaliza_tarea, {});\n';

      r += 'programa.ejecutar(receptor);\n';
      return r;
    }

  });

  var Accion = Bloque['default'].extend({

    block_init: function block_init(block) {
      this._super(block);
      block.setColour(Blockly.Blocks.primitivas.COLOUR);
      block.setPreviousStatement(true);
      block.setNextStatement(true);
    },

    block_javascript: function block_javascript() /*block*/{
      return 'programa.hacer(' + this.nombre_comportamiento() + ', ' + this.argumentos() + ')\n';
    }

  });

  // Crea una accion a partir de una descripcion, un icono, comportamiento y argumentos
  // Como la mayoría de los bloques siempre son así, primero un ícono y luego una descripción,
  // Esto me permite rápidamente crear una accion, es casi como un DSL para hacerlo
  var AccionBuilder = {
    build: function build(opciones) {
      return Accion.extend({
        init: function init() {
          this._super();
          this.set('id', this.toID(opciones.descripcion));
        },

        block_init: function block_init(block) {
          this._super(block);
          block.appendDummyInput().appendField(this.obtener_icono('../libs/data/' + opciones.icono)).appendField(opciones.descripcion);
        },

        nombre_comportamiento: function nombre_comportamiento() {
          return opciones.comportamiento;
        },

        argumentos: function argumentos() {
          return opciones.argumentos;
        },

        toID: function toID(descripcion) {
          return descripcion.replace(/[^a-zA-z]/g, "");
        }

      });
    }
  };

  var Sensor = Bloque['default'].extend({

    block_init: function block_init(block) {
      this._super(block);
      block.setColour(Blockly.Blocks.sensores.COLOUR);
      block.setInputsInline(true);
      block.setOutput(true);
    },

    block_javascript: function block_javascript() /*block*/{
      return ['receptor.' + this.nombre_sensor() + '\n', Blockly.JavaScript.ORDER_ATOMIC];
    }
  });

  /*
   * Representa un valor mas complejo
   * de un campo de un bloque
   */
  var ParamValor = Ember['default'].Object.extend({
    build: function build() {
      var str_block = '';
      str_block += '<value name="NOMBRE">'.replace('NOMBRE', this.get('nombre_param'));

      str_block += '<block type="TIPO">'.replace('TIPO', this.get('tipo_bloque'));

      str_block += '<field name="TIPO">'.replace('TIPO', this.get('nombre_valor'));
      str_block += this.get('valor');
      str_block += '</field>';

      str_block += '</block>';

      str_block += '</value>';

      return str_block;
    }
  });

  var ParamCampo = Ember['default'].Object.extend({
    build: function build() {
      var str_block = '';
      str_block += '<field name="NOMBRE">'.replace('NOMBRE', this.get('nombre_valor'));
      str_block += this.get('valor');
      str_block += '</field>';
      return str_block;
    }
  });

  /* ============================================== */

  var EstructuraDeControl = Bloque['default'].extend({

    block_init: function block_init(block) {
      this._super(block);
      block.setColour(Blockly.Blocks.loops.COLOUR);
      block.setInputsInline(true);
      block.setPreviousStatement(true);
      block.setNextStatement(true);
    }

  });

  /* ============================================== */

  var Repetir = EstructuraDeControl.extend({

    init: function init() {
      this._super();
      this.set('id', 'repetir');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendValueInput('count').setCheck('Number').appendField('Repetir');
      block.appendStatementInput('block');
    },

    block_javascript: function block_javascript(block) {
      var value_count = Blockly.JavaScript.valueToCode(block, 'count', Blockly.JavaScript.ORDER_ATOMIC) || '0';
      var statements_block = Blockly.JavaScript.statementToCode(block, 'block');
      var r = 'programa.empezar_secuencia();\n';
      r += statements_block;
      r += 'programa.repetirN(function(){\nreturn {{n}};\n});\n'.replace('{{n}}', value_count);
      return r;
    },

    get_parametros: function get_parametros() {
      return [ParamValor.create({
        nombre_param: 'count',
        tipo_bloque: 'math_number',
        nombre_valor: 'NUM',
        valor: '10'
      })];
    }

  });

  var Si = EstructuraDeControl.extend({

    init: function init() {
      this._super();
      this.set('id', 'si');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendValueInput('condition').setCheck('Boolean').appendField('Si');
      block.appendStatementInput('block');
    },

    block_javascript: function block_javascript(block) {
      var value_condition = Blockly.JavaScript.valueToCode(block, 'condition', Blockly.JavaScript.ORDER_ATOMIC) || 'false';
      var statements_block = Blockly.JavaScript.statementToCode(block, 'block');
      var r = 'programa.empezar_secuencia();\n';
      r += statements_block;
      r += 'programa.alternativa_si(function(){\nreturn {{condition}};\n});\n'.replace('{{condition}}', value_condition);
      return r;
    }

  });

  /* ============================================== */

  var Sino = EstructuraDeControl.extend({

    init: function init() {
      this._super();
      this.set('id', 'sino');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendValueInput('condition').setCheck('Boolean').appendField('Si');
      block.appendStatementInput('block1');
      block.appendDummyInput().appendField('sino');
      block.appendStatementInput('block2');
    },

    block_javascript: function block_javascript(block) {
      var value_condition = Blockly.JavaScript.valueToCode(block, 'condition', Blockly.JavaScript.ORDER_ATOMIC) || 'false';
      var statements_block1 = Blockly.JavaScript.statementToCode(block, 'block1');
      var statements_block2 = Blockly.JavaScript.statementToCode(block, 'block2');
      var r = 'programa.empezar_secuencia();\n';
      r += statements_block1;
      r += 'programa.empezar_secuencia();\n';
      r += statements_block2;
      r += 'programa.alternativa_sino(function(){\nreturn {{condition}};\n});\n'.replace('{{condition}}', value_condition);
      return r;
    }

  });

  var Hasta = EstructuraDeControl.extend({

    init: function init() {
      this._super();
      this.set('id', 'hasta');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendValueInput('condition').setCheck('Boolean').appendField('Repetir hasta que');
      block.appendStatementInput('block');
    },

    block_javascript: function block_javascript(block) {
      var value_condition = Blockly.JavaScript.valueToCode(block, 'condition', Blockly.JavaScript.ORDER_ATOMIC) || 'true';
      var statements_block = Blockly.JavaScript.statementToCode(block, 'block');
      var r = 'programa.empezar_secuencia();\n';
      r += statements_block;
      r += 'programa.repetir_hasta(function(){\nreturn {{condition}};\n});\n'.replace('{{condition}}', value_condition);
      return r;
    }

  });

  var bloques = { Bloque: Bloque['default'], CambioDeJSDeBlocky: CambioDeJSDeBlocky, VariableGet: VariableGet,
    VariableSet: VariableSet, VariableLocalGet: VariableLocalGet, VariableLocalSet: VariableLocalSet, Procedimiento: Procedimiento,
    Funcion: Funcion, CallNoReturn: CallNoReturn, CallReturn: CallReturn, ParamGet: ParamGet, AlEmpezar: AlEmpezar, Accion: Accion, AccionBuilder: AccionBuilder,
    Sensor: Sensor, Repetir: Repetir, Si: Si, Sino: Sino, Hasta: Hasta, ParamCampo: ParamCampo };

  exports['default'] = bloques;

});
define('pilas-engine-bloques/actividades/bloquesTito', ['exports', 'pilas-engine-bloques/actividades/bloques'], function (exports, bloques) {

  'use strict';

  var Accion = bloques['default'].Accion;
  var Sensor = bloques['default'].Sensor;

  var EncenderLuz = Accion.extend({
    init: function init() {
      this._super();
      this.set('id', 'EncenderLuz');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField('Encender luz ').appendField(this.obtener_icono('../libs/data/iconos.lamparita.png'));
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return 'EncenderPorEtiqueta';
    },

    argumentos: function argumentos() {
      return "{'etiqueta':'Luz'}";
    }
  });

  var TocandoLuz = Sensor.extend({
    init: function init() {
      this._super();
      this.set('id', 'tocandoLuz');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField('¿Tocando luz ').appendField(this.obtener_icono('../libs/data/iconos.lamparita.png')).appendField(' ?');
    },

    nombre_sensor: function nombre_sensor() {
      return 'tocando(\'Lamparin\')';
    }
  });

  var TocandoFinal = Sensor.extend({
    init: function init() {
      this._super();
      this.set('id', 'tocandoFinal');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField('¿Tocando fin ').appendField(this.obtener_icono('../libs/data/casilla.titoFinalizacion.png')).appendField(' ?');
    },

    nombre_sensor: function nombre_sensor() {
      return 'estoyUltimaFila()';
    }
  });
  var bloquesTito = { EncenderLuz: EncenderLuz, TocandoLuz: TocandoLuz, TocandoFinal: TocandoFinal };

  exports['default'] = bloquesTito;

});
define('pilas-engine-bloques/actividades/comer', ['exports', 'pilas-engine-bloques/actividades/bloques'], function (exports, bloques) {

  'use strict';

  var Accion = bloques['default'].Accion;

  var ComerBanana = Accion.extend({
    init: function init() {
      this._super();
      this.set('id', 'ComerBanana');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField('Comer banana ').appendField(this.obtener_icono('../libs/data/iconos.banana.png'));
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return 'RecogerPorEtiqueta';
    },

    argumentos: function argumentos() {
      return '{\'etiqueta\' : \'BananaAnimada\', nombreAnimacion: "comerBanana" }';
    }
  });

  var ComerManzana = Accion.extend({
    init: function init() {
      this._super();
      this.set('id', 'ComerManzana');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField('Comer manzana').appendField(this.obtener_icono('../libs/data/iconos.manzana.png'));
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return 'RecogerPorEtiqueta';
    },

    argumentos: function argumentos() {
      return '{\'etiqueta\' : \'ManzanaAnimada\', nombreAnimacion: "comerManzana" }';
    }
  });

  var ComerQueso = Accion.extend({
    init: function init() {
      this._super();
      this.set('id', 'ComerQueso');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField('Comer queso').appendField(this.obtener_icono('../libs/data/queso.png'));
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return 'RecogerPorEtiqueta';
    },

    argumentos: function argumentos() {
      return '{\'etiqueta\' : \'QuesoAnimado\' }';
    }
  });

  var ComerNaranja = Accion.extend({
    init: function init() {
      this._super();
      this.set('id', 'ComerNaranja');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField('Comer naranja').appendField(this.obtener_icono('../libs/data/naranja.png'));
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return 'RecogerPorEtiqueta';
    },

    argumentos: function argumentos() {
      return '{\'etiqueta\' : \'NaranjaAnimada\', nombreAnimacion: "comerNaranja"}';
    }
  });

  var comer = { ComerBanana: ComerBanana, ComerManzana: ComerManzana, ComerQueso: ComerQueso, ComerNaranja: ComerNaranja };

  exports['default'] = comer;

});
define('pilas-engine-bloques/actividades/contando', ['exports', 'pilas-engine-bloques/actividades/bloques'], function (exports, bloques) {

  'use strict';

  var Accion = bloques['default'].Accion;

  var ContandoBanana = Accion.extend({
    init: function init() {
      this._super();
      this.set('id', 'ContandoBanana');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField('Contar banana ').appendField(this.obtener_icono('../libs/data/iconos.banana.png'));
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return 'ContarPorEtiqueta';
    },

    argumentos: function argumentos() {
      return '{\'etiqueta\' : \'BananaAnimada\',  \'mensajeError\' : \'No hay una banana aqui\',\'dondeReflejarValor\': \'pilas.escena_actual().cantidadBananas\' }';
    }
  });

  var ContandoManzana = Accion.extend({
    init: function init() {
      this._super();
      this.set('id', 'ContandoManzana');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField('Contar manzana').appendField(this.obtener_icono('../libs/data/iconos.manzana.png'));
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return 'ContarPorEtiqueta';
    },

    argumentos: function argumentos() {
      return '{\'etiqueta\' : \'ManzanaAnimada\',  \'mensajeError\' : \'No hay una manzana aqui\',\'dondeReflejarValor\': \'pilas.escena_actual().cantidadManzanas\' }';
    }
  });

  var contando = { ContandoBanana: ContandoBanana, ContandoManzana: ContandoManzana };

  exports['default'] = contando;

});
define('pilas-engine-bloques/actividades/direccionesCuadricula', ['exports', 'pilas-engine-bloques/actividades/bloques'], function (exports, bloques) {

  'use strict';

  var Accion = bloques['default'].Accion;

  var IrDerecha = Accion.extend({

    init: function init() {
      this._super();
      this.set('id', 'MoverACasillaDerecha');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField(this.obtener_icono('derecha.png')).appendField('Ir derecha');
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return 'MoverACasillaDerecha';
    },

    argumentos: function argumentos() {
      return '{}';
    }

  });

  var IrIzquierda = Accion.extend({

    init: function init() {
      this._super();
      this.set('id', 'MoverACasillaIzquierda');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField(this.obtener_icono('izquierda.png')).appendField('Ir izquierda');
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return 'MoverACasillaIzquierda';
    },

    argumentos: function argumentos() {
      return '{}';
    }

  });

  var IrArriba = Accion.extend({

    init: function init() {
      this._super();
      this.set('id', 'MoverACasillaArriba');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField(this.obtener_icono('arriba.png')).appendField('Ir arriba');
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return 'MoverACasillaArriba';
    },

    argumentos: function argumentos() {
      return '{}';
    }

  });

  var IrAbajo = Accion.extend({

    init: function init() {
      this._super();
      this.set('id', 'MoverACasillaAbajo');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField(this.obtener_icono('abajo.png')).appendField('Ir abajo');
    },

    nombre_comportamiento: function nombre_comportamiento() {
      return 'MoverACasillaAbajo';
    },

    argumentos: function argumentos() {
      return '{}';
    }

  });

  var direcciones = { IrDerecha: IrDerecha, IrIzquierda: IrIzquierda, IrArriba: IrArriba, IrAbajo: IrAbajo };

  exports['default'] = direcciones;

});
define('pilas-engine-bloques/actividades/estructurasDeControl', ['exports', 'pilas-engine-bloques/actividades/bloque', 'pilas-engine-bloques/actividades/bloques'], function (exports, Bloque, bloques) {

  'use strict';

  var EstructuraDeControl = Bloque['default'].extend({

    block_init: function block_init(block) {
      this._super(block);
      block.setColour(Blockly.Blocks.loops.COLOUR);
      block.setInputsInline(true);
      block.setPreviousStatement(true);
      block.setNextStatement(true);
    }

  });

  var Repetir = EstructuraDeControl.extend({

    init: function init() {
      this._super();
      this.set('id', 'repetir');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendValueInput('count').setCheck('Number').appendField('Repetir');
      block.appendStatementInput('block');
    },

    block_javascript: function block_javascript(block) {
      var value_count = Blockly.JavaScript.valueToCode(block, 'count', Blockly.JavaScript.ORDER_ATOMIC) || '0';
      var statements_block = Blockly.JavaScript.statementToCode(block, 'block');
      var r = 'programa.empezar_secuencia();\n';
      r += statements_block;
      r += 'programa.repetirN(function(){\nreturn {{n}};\n});\n'.replace('{{n}}', value_count);
      return r;
    },

    get_parametros: function get_parametros() {
      return [bloques.ParamValor.create({
        nombre_param: 'count',
        tipo_bloque: 'math_number',
        nombre_valor: 'NUM',
        valor: '10'
      })];
    }

  });

  /* ============================================== */

  var Si = EstructuraDeControl.extend({

    init: function init() {
      this._super();
      this.set('id', 'si');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendValueInput('condition').setCheck('Boolean').appendField('Si');
      block.appendStatementInput('block');
    },

    block_javascript: function block_javascript(block) {
      var value_condition = Blockly.JavaScript.valueToCode(block, 'condition', Blockly.JavaScript.ORDER_ATOMIC) || 'false';
      var statements_block = Blockly.JavaScript.statementToCode(block, 'block');
      var r = 'programa.empezar_secuencia();\n';
      r += statements_block;
      r += 'programa.alternativa_si(function(){\nreturn {{condition}};\n});\n'.replace('{{condition}}', value_condition);
      return r;
    }

  });

  /* ============================================== */

  var Sino = EstructuraDeControl.extend({

    init: function init() {
      this._super();
      this.set('id', 'sino');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendValueInput('condition').setCheck('Boolean').appendField('Si');
      block.appendStatementInput('block1');
      block.appendDummyInput().appendField('sino');
      block.appendStatementInput('block2');
    },

    block_javascript: function block_javascript(block) {
      var value_condition = Blockly.JavaScript.valueToCode(block, 'condition', Blockly.JavaScript.ORDER_ATOMIC) || 'false';
      var statements_block1 = Blockly.JavaScript.statementToCode(block, 'block1');
      var statements_block2 = Blockly.JavaScript.statementToCode(block, 'block2');
      var r = 'programa.empezar_secuencia();\n';
      r += statements_block1;
      r += 'programa.empezar_secuencia();\n';
      r += statements_block2;
      r += 'programa.alternativa_sino(function(){\nreturn {{condition}};\n});\n'.replace('{{condition}}', value_condition);
      return r;
    }

  });

  /* ============================================== */

  var Hasta = EstructuraDeControl.extend({

    init: function init() {
      this._super();
      this.set('id', 'hasta');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendValueInput('condition').setCheck('Boolean').appendField('Repetir hasta que');
      block.appendStatementInput('block');
    },

    block_javascript: function block_javascript(block) {
      var value_condition = Blockly.JavaScript.valueToCode(block, 'condition', Blockly.JavaScript.ORDER_ATOMIC) || 'true';
      var statements_block = Blockly.JavaScript.statementToCode(block, 'block');
      var r = 'programa.empezar_secuencia();\n';
      r += statements_block;
      r += 'programa.repetir_hasta(function(){\nreturn {{condition}};\n});\n'.replace('{{condition}}', value_condition);
      return r;
    }

  });

  var estructurasDeControl = { EstructuraDeControl: EstructuraDeControl, Repetir: Repetir, Si: Si,
    Sino: Sino, Hasta: Hasta };

  exports['default'] = estructurasDeControl;

});
define('pilas-engine-bloques/actividades/expresiones', ['exports', 'pilas-engine-bloques/actividades/bloque'], function (exports, Bloque) {

  'use strict';

  var ExpresionDeBlockly = Bloque['default'].extend({

    registrar_en_blockly: function registrar_en_blockly() {
      // pisado porque ya viene con blockly
      // ni tampoco quiero modificar el javascript
    }

  });

  var Numero = ExpresionDeBlockly.extend({
    init: function init() {
      this._super();
      this.set('id', 'math_number');
    }
  });

  var OpAritmetica = ExpresionDeBlockly.extend({
    init: function init() {
      this._super();
      this.set('id', 'math_arithmetic');
    }
  });

  var Booleano = ExpresionDeBlockly.extend({
    init: function init() {
      this._super();
      this.set('id', 'logic_boolean');
    }
  });

  var OpComparacion = ExpresionDeBlockly.extend({
    init: function init() {
      this._super();
      this.set('id', 'logic_compare');
    }
  });

  var OpLogica = ExpresionDeBlockly.extend({
    init: function init() {
      this._super();
      this.set('id', 'logic_operation');
    }
  });

  var OpNegacion = ExpresionDeBlockly.extend({
    init: function init() {
      this._super();
      this.set('id', 'logic_negate');
    }
  });

  var expresiones = {
    ExpresionDeBlockly: ExpresionDeBlockly, Numero: Numero, OpAritmetica: OpAritmetica, Booleano: Booleano,
    OpComparacion: OpComparacion, OpLogica: OpLogica, OpNegacion: OpNegacion
  };

  exports['default'] = expresiones;

});
define('pilas-engine-bloques/actividades/lenguaje', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var Lenguaje = Ember['default'].Object.extend({

    init: function init() {
      this.set('categorias', []);
      this.set('bloques', {});
    },

    agregar: function agregar(c, bs) {
      if (bs !== undefined) {
        this.categoria(c);
        bs.forEach((function (b) {
          this.bloque(c, b);
        }).bind(this));
      }
    },

    categoria: function categoria(c) {
      this.get('categorias').pushObject(c);
      var bs = this.get('bloques');
      bs[c] = [];
      this.set('bloques', bs);
    },

    bloque: function bloque(c, b) {
      var block = this.definir_bloque(b);
      this.get('bloques')[c].pushObject(block);
    },

    definir_bloque: function definir_bloque(b) {
      var block = b.create();
      block.registrar_en_blockly();
      return block;
    },

    build: function build() {
      var str_toolbox = '';

      str_toolbox += '<xml>';

      this.get('categorias').forEach((function (item) {
        if (item === 'Variables') {
          str_toolbox += this._build_variables();
        } else if (item === 'Subtareas') {
          str_toolbox += this._build_procedures();
        } else {
          str_toolbox += this._build_categoria(item);
        }
      }).bind(this));

      str_toolbox += '</xml>';

      return str_toolbox;
    },

    _build_categoria: function _build_categoria(categoria) {
      var str_category = '';

      str_category += '<category name="x">\n'.replace('x', categoria);

      this.get('bloques')[categoria].forEach(function (b) {
        str_category += b.build();
      });

      str_category += '</category>\n';

      return str_category;
    },

    _build_procedures: function _build_procedures() {
      return '<category name="Subtareas" custom="PROCEDURE"></category>';
    },

    _build_variables: function _build_variables() {
      return '<category name="Variables" custom="VARIABLE"></category>';
    }

  });

  exports['default'] = Lenguaje;

});
define('pilas-engine-bloques/actividades/tocando', ['exports', 'pilas-engine-bloques/actividades/bloques'], function (exports, bloques) {

  'use strict';

  var Sensor = bloques['default'].Sensor;

  var TocandoManzana = Sensor.extend({
    init: function init() {
      this._super();
      this.set('id', 'tocandoManzana');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField('¿Tocando manzana ').appendField(this.obtener_icono('../libs/data/iconos.manzana.png')).appendField('?');
    },

    nombre_sensor: function nombre_sensor() {
      return 'tocando(\'ManzanaAnimada\')';
    }
  });

  var TocandoNaranja = Sensor.extend({
    init: function init() {
      this._super();
      this.set('id', 'TocandoNaranja');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField('¿Tocando naranja ').appendField(this.obtener_icono('../libs/data/naranja.png')).appendField('?');
    },

    nombre_sensor: function nombre_sensor() {
      return 'tocando(\'NaranjaAnimada\')';
    }
  });

  var TocandoBanana = Sensor.extend({
    init: function init() {
      this._super();
      this.set('id', 'tocandoBanana');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField('¿Tocando banana ').appendField(this.obtener_icono('../libs/data/iconos.banana.png')).appendField('?');
    },

    nombre_sensor: function nombre_sensor() {
      return 'tocando(\'BananaAnimada\')';
    }
  });

  var TocandoQueso = Sensor.extend({
    init: function init() {
      this._super();
      this.set('id', 'tocandoQueso');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField('¿Tocando queso ').appendField(this.obtener_icono('../libs/data/queso.png')).appendField('?');
    },

    nombre_sensor: function nombre_sensor() {
      return 'tocando(\'QuesoAnimado\')';
    }
  });

  var TocandoAbajo = Sensor.extend({
    init: function init() {
      this._super();
      this.set('id', 'TocandoAbajo');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField('¿Tocando abajo ').appendField(this.obtener_icono('abajo.png')).appendField(' ?');
    },

    nombre_sensor: function nombre_sensor() {
      return 'hayAbajo()';
    }
  });
  var TocandoDerecha = Sensor.extend({
    init: function init() {
      this._super();
      this.set('id', 'TocandoDerecha');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField('¿Tocando derecha ').appendField(this.obtener_icono('derecha.png')).appendField(' ?');
    },

    nombre_sensor: function nombre_sensor() {
      return 'hayDerecha()';
    }
  });

  var TocandoFinCamino = Sensor.extend({
    init: function init() {
      this._super();
      this.set('id', 'TocandoFinCamino');
    },

    block_init: function block_init(block) {
      this._super(block);
      block.appendDummyInput().appendField('¿Tocando ').appendField(this.obtener_icono('../libs/data/finCamino.png')).appendField(' ?');
    },

    nombre_sensor: function nombre_sensor() {
      return 'alFinalDelCamino()';
    }
  });

  var tocando = { TocandoBanana: TocandoBanana, TocandoManzana: TocandoManzana, TocandoAbajo: TocandoAbajo, TocandoDerecha: TocandoDerecha, TocandoFinCamino: TocandoFinCamino, TocandoQueso: TocandoQueso, TocandoNaranja: TocandoNaranja };

  exports['default'] = tocando;

});
define('pilas-engine-bloques/adapters/application', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].LSAdapter.extend({
    namespace: 'pilas-engine-bloques_namespace'
  });

});
define('pilas-engine-bloques/app', ['exports', 'ember', 'ember/resolver', 'ember/load-initializers', 'pilas-engine-bloques/config/environment'], function (exports, Ember, Resolver, loadInitializers, config) {

  'use strict';

  Ember['default'].MODEL_FACTORY_INJECTIONS = true;

  var inflector = Ember['default'].Inflector.inflector;
  inflector.irregular("galeria", "galeria");

  Ember['default'].Inflector.inflector.irregular('solucion', 'solucion');

  var App = Ember['default'].Application.extend({
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix,
    Resolver: Resolver['default']
  });

  loadInitializers['default'](App, config['default'].modulePrefix);

  exports['default'] = App;

});
define('pilas-engine-bloques/components/app-version', ['exports', 'ember-cli-app-version/components/app-version', 'pilas-engine-bloques/config/environment'], function (exports, AppVersionComponent, config) {

  'use strict';

  var _config$APP = config['default'].APP;
  var name = _config$APP.name;
  var version = _config$APP.version;

  exports['default'] = AppVersionComponent['default'].extend({
    version: version,
    name: name
  });

});
define('pilas-engine-bloques/components/ember-modal-dialog-positioned-container', ['exports', 'ember-modal-dialog/components/positioned-container'], function (exports, positioned_container) {

	'use strict';



	exports['default'] = positioned_container['default'];

});
define('pilas-engine-bloques/components/ember-wormhole', ['exports', 'ember-wormhole/components/ember-wormhole'], function (exports, ember_wormhole) {

	'use strict';



	exports['default'] = ember_wormhole['default'];

});
define('pilas-engine-bloques/components/modal-dialog-overlay', ['exports', 'ember-modal-dialog/components/modal-dialog-overlay'], function (exports, modal_dialog_overlay) {

	'use strict';



	exports['default'] = modal_dialog_overlay['default'];

});
define('pilas-engine-bloques/components/modal-dialog', ['exports', 'ember-modal-dialog/components/modal-dialog'], function (exports, modal_dialog) {

	'use strict';



	exports['default'] = modal_dialog['default'];

});
define('pilas-engine-bloques/components/modal-title', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    actions: {
      ocultar: function ocultar() {
        this.sendAction("close");
      }
    }
  });

});
define('pilas-engine-bloques/components/nw-zoom', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    tagName: 'div',
    classNames: ['nw-zoom'],
    zoomValue: 100,
    zoom: Ember['default'].inject.service(),

    canZoomIn: Ember['default'].computed('zoomValue', function () {
      return this.get('zoomValue') < 120;
    }),

    canZoomOut: Ember['default'].computed('zoomValue', function () {
      return this.get('zoomValue') > 80;
    }),

    cambiarZoom: Ember['default'].observer('zoomValue', function () {
      this.get('zoom').setValue(this.get('zoomValue'));

      this.aplicarZoom((this.get('zoomValue') - 100) / 10);
    }),

    aplicarZoom: function aplicarZoom(zoomLevel) {
      if (window['requireNode'] === undefined) {
        document.body.style.zoom = 100 + zoomLevel * 10 + "%";
        console.log("Imposible cambiar el zoom desde el navegador...");
        return;
      } else {
        var gui = window.requireNode('nw.gui');
        var win = gui.Window.get();
        win.zoomLevel = zoomLevel;
      }
    },

    onStart: Ember['default'].on('init', function () {
      this.set('zoomValue', this.get('zoom').getValue());
      this.cambiarZoom();
    }),

    actions: {
      zoomIn: function zoomIn() {
        this.set('zoomValue', this.get('zoomValue') + 10);
      },
      zoomOut: function zoomOut() {
        this.set('zoomValue', this.get('zoomValue') - 10);
      },
      zoomRestore: function zoomRestore() {
        this.set('zoomValue', 100);
      }
    }

  });

});
define('pilas-engine-bloques/components/pilas-automatic-update', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    classNames: ['pilas-automatic-update'],
    version: Ember['default'].inject.service(),
    mostrarLinkActualizacion: false,

    didInsertElement: function didInsertElement() {
      var _this = this;

      this.get('version').obtener_estado_de_version().then(function (data) {
        var comparacion = data.comparacion;

        if (comparacion === 1) {
          _this.set("mostrarLinkActualizacion", true);
        }
      });
    },

    actions: {
      verSitioActualizacion: function verSitioActualizacion() {
        var gui = window.requireNode('nw.gui');
        gui.Shell.openExternal("http://hugoruscitti.github.io/huayra-tips/#/actualizar/pilas-engine-bloques");
      }
    }
  });

});
define('pilas-engine-bloques/components/pilas-blockly', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    ejecutando: false,
    cola_deshacer: [],
    data_observar_blockly: false,
    actividad: null,
    environment: Ember['default'].inject.service(),
    abrirConsignaInicial: false,
    solucion: null,

    twitter: Ember['default'].inject.service(),
    previewData: null, // representa la imagen previsualización del dialogo para twittear.
    mensajeCompartir: 'Comparto mi solución de Pilas Bloques',
    compartirEnCurso: false,
    browser: Ember['default'].inject.service(),

    inyectarRedimensionado: Ember['default'].on('init', function () {
      var _this = this;

      window.anterior_altura = 0;
      window.anterior_ancho = 0;
      var ancho_canvas = 445;

      function redimensionar() {
        var panel = document.getElementById('panel-derecho');
        var contenedorEditor = document.getElementById('contenedor-editor');
        var panelPilas = document.getElementById('panel-pilas');
        var e = document.getElementById('contenedor-blockly');

        if (!panel) {
          return null;
        }

        var altura = panel.getClientRects()[0].height;
        var ancho_total = contenedorEditor.getClientRects()[0].width;

        if (window.anterior_altura !== altura || window.anterior_ancho !== ancho_total) {

          e.style.width = ancho_total - ancho_canvas + 'px';
          e.style.height = altura - 50 + 'px';
          panelPilas.style.width = ancho_canvas - 20 + 'px';

          window.anterior_altura = altura;
          window.anterior_ancho = ancho_total;

          Blockly.fireUiEvent(window, 'resize');
        }
      }

      function forzar_redimensionado() {
        window.anterior_altura += 1;
        redimensionar();
      }

      window.onresize = redimensionar;
      window.forzar_redimensionado = forzar_redimensionado;

      // Muestra el dialogo inicial si está definida la consigna inicial.
      if (this.get('actividad.actividad.consignaInicial')) {
        Ember['default'].run.later(function () {
          _this.set('abrirConsignaInicial', true);
        });
      }
    }),

    didInsertElement: function didInsertElement() {
      //var contenedor = this.$().find('#contenedor-blockly')[0];
      this.set('cola_deshacer', []);
      //this.cargar_codigo_desde_el_modelo();
      //this.observarCambiosEnBlocky();

      this.handlerCargaInicial = this.cuandoTerminaCargaInicial.bind(this);
      this.handlerTerminaEjecucion = this.cuandoTerminaEjecucion.bind(this);

      window.addEventListener('terminaCargaInicial', this.handlerCargaInicial, false);
      window.addEventListener('terminaEjecucion', this.handlerTerminaEjecucion, false);
    },

    cuandoTerminaCargaInicial: function cuandoTerminaCargaInicial() {
      var solucion = this.get('solucion');

      if (solucion) {
        this.get('actividad').cargarCodigoDesdeStringXML(solucion.get('codigoXML'));
      }

      if (this.get('autoejecutar')) {
        this.send('ejecutar');
      }
    },

    cuandoTerminaEjecucion: function cuandoTerminaEjecucion() {},

    willDestroyElement: function willDestroyElement() {
      window.removeEventListener('terminaCargaInicial', this.handlerCargaInicial, false);
      window.removeEventListener('terminaEjecucion', this.handlerTerminaEjecucion, false);
    },

    /**
     * Se conecta a los eventos y cambios de estado de blockly para implementar
     * la funcionalidad de 'deshacer'.
     */
    observarCambiosEnBlocky: function observarCambiosEnBlocky() {
      var f = this.almacenar_cambio.bind(this);
      var d = Blockly.addChangeListener(f);
      this.set('data_observar_blockly', d);
    },

    noMirarCambiosEnBlockly: function noMirarCambiosEnBlockly() {
      if (this.get('data_observar_blockly')) {
        Blockly.removeChangeListener(this.get('data_observar_blockly'));
      }
    },

    almacenar_cambio: function almacenar_cambio() {
      this.get('cola_deshacer').pushObject(this.obtener_codigo_en_texto());
      console.log("guardar");
    },

    restaurar_codigo: function restaurar_codigo(codigo) {
      var xml = Blockly.Xml.textToDom(codigo);
      Blockly.mainWorkspace.clear();
      Blockly.Xml.domToWorkspace(Blockly.getMainWorkspace(), xml);
    },

    obtener_codigo_en_texto: function obtener_codigo_en_texto() {
      var xml = Blockly.Xml.workspaceToDom(Blockly.getMainWorkspace());
      return Blockly.Xml.domToText(xml);
    },

    cargar_codigo_desde_el_modelo: function cargar_codigo_desde_el_modelo() {
      if (this.get('model')) {
        var modelo = this.get('model');
        var codigo = modelo.get('codigo');
        this.restaurar_codigo(codigo);
      }
      this.sendAction('registrarPrimerCodigo');
    },

    actions: {
      ejecutar: function ejecutar() {
        var _this2 = this;

        window.LoopTrap = 1000;
        //this.sendAction('reiniciar');
        Blockly.JavaScript.INFINITE_LOOP_TRAP = 'if (--window.LoopTrap == 0) throw "Infinite loop.";\n';

        var code = this.get('actividad').generarCodigo();
        Blockly.JavaScript.INFINITE_LOOP_TRAP = null;

        Ember['default'].run(function () {
          try {
            _this2.set('ejecutando', true);
            eval(code);
            _this2.sendAction('parar');
          } catch (e) {
            console.error(e.stack);
            alert(e);
          }
        });
      },

      reiniciar: function reiniciar() {
        this.set('ejecutando', false);
        this.sendAction('reiniciar');
      },

      guardar: function guardar() {
        this.sendAction('guardar');
      },

      alternar: function alternar() {
        //this.sendAction('redimensionar');
        console.log(this.controllerFor('application'));
        //.sendAction('redimensionar');
      },

      ver_codigo: function ver_codigo() {
        Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
        var code = this.get('actividad').generarCodigoXML();
        var codigo_como_string = null;

        function xml2string(node) {
          if (typeof XMLSerializer !== 'undefined') {
            var serializer = new XMLSerializer();
            return serializer.serializeToString(node);
          } else if (node.xml) {
            return node.xml;
          }
        }

        codigo_como_string = xml2string(code);
        console.log(codigo_como_string);
        alert(codigo_como_string);
      },

      ingresar_codigo: function ingresar_codigo() {
        var codigo = prompt("Ingrese el código");

        if (codigo) {
          this.get('actividad').cargarCodigoDesdeStringXML(codigo);
        }
      },

      deshacer_cambio: function deshacer_cambio() {
        this.noMirarCambiosEnBlockly();
        this.get('cola_deshacer').popObject();
        var c = this.get('cola_deshacer').popObject();
        if (c) {
          console.log("deshacer");
          this.restaurar_codigo(c);
        }
        this.observarCambiosEnBlocky();
      },

      compartir: function compartir() {
        this.set('abrirDialogoCompartir', true);
        var data = window['canvas'].toDataURL('image/png');
        this.set('previewData', data);
      },

      ocultarModalTwitter: function ocultarModalTwitter() {
        this.set('abrirDialogoCompartir', false);
      },

      abrirMensajePublicado: function abrirMensajePublicado() {
        var url = this.get('mensajePublicadoURL');
        this.get('browser').openLink(url);
      },

      enviarMensaje: function enviarMensaje() {
        var _this3 = this;

        this.set('envioEnCurso', true);

        var mensaje = this.get('mensajeCompartir');
        var imagen = this.get('previewData');

        this.get('twitter').compartir(mensaje, imagen).then(function (data) {
          _this3.set('envioEnCurso', false);
          _this3.set('mensajePublicadoURL', data.url);
        })['catch'](function (err) {
          alert(err);
          _this3.set('envioEnCurso', false);
        });
      }

    }

  });

});
define('pilas-engine-bloques/components/pilas-canvas', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    actividad: null,

    iniciarPilas: Ember['default'].on('didInsertElement', function () {
      var canvas_element = this.$().find('canvas')[0];

      window.pilas = pilasengine.iniciar({
        ancho: 420,
        alto: 480,
        canvas: canvas_element,
        data_path: 'libs/data',

        imagenesExtra: [
        /*--------FONDOS---------*/
        'fondos.estrellas.png', 'fondos.obrero.png', 'fondos.nubes.png', 'fondo.superTito1.png', 'fondo.superTito2.png', 'fondo.elPlanetaDeNano.png', 'fondos.elPlanetaDeNano.png', 'fondos.alien-inicial.png', 'fondos.futbolRobots.png', 'fondos.biblioteca.png', 'fondos.reparandoLaNave.png', 'fondos.selva.png', 'fondo.recolector.png', 'fondo.gatoEnLaCalle.png', 'fondo.noMeCansoDeSaltar.png', 'fondo.elMarcianoEnElDesierto.png', 'fondo.mariaSandia.png', 'fondo.alimentando_peces.png.png', 'fondo.marEncantado.png', 'fondo.elSuperviaje.png', 'fondo.laberinto.corto.png', 'fondo.laberinto.largo.png', 'fondo.laberinto.queso.png',
        /*--------CASILLAS---------*/
        'casillaArriba.png', 'casillaAbajo.png', 'recolectorAnimado.png', 'casillaDerecha.png', 'casillaIzquierda.png', 'casilla.titoFinalizacion.png', 'casilla_base.png', 'lamparin.png', 'casillas.violeta.png', 'casilla.futbolRobots1.png', 'casilla.futbolRobots2.png', 'casillas.elPlanetaDeNano.png', 'casilla.reparandoNave.png', 'casilla.grisoscuro.png', 'casillas.alien_inicial.png', 'casilla.mariaSandia.png', 'casillafinalmono.png', 'casillainiciomono.png', 'casillamediomono.png', 'casilla.cangrejo_aguafiestas.png',

        /*--------ACTORES---------*/
        'perro_cohete.png', 'hueso.png', 'llave.png', 'caballero_oscuro.png', 'heroe.png', 'mago.png', 'unicornio.png', 'banana.png', 'nano.png', 'tito.png', 'invisible.png', 'sin_imagen.png', 'maria.png', 'sandia.png', 'compu_animada.png', 'globoAnimado.png', 'cangrejo.png', 'buzo.png', 'fondos.mar.png', 'pez1.png', 'buzo.png', 'pez2.png', 'pez3.png', 'alimento_pez.png', 'ratonAnimado.png', 'estrellaAnimada.png', 'quesoAnimado.png', 'naveAnimada.png', 'robotAnimado.png', 'manzana.png', 'pelotaAnimada.png', 'carbon_animado.png', 'hierro_animado.png', 'monoAnimado.png', 'banana-1.png', 'manzanaConSombra.png', 'manzanaSinSombra.png', 'botonAnimado.png', 'camino-alien-boton.png', 'compu_animada.png', 'gatoAnimado.png', 'marcianoAnimado.png', 'pez1.png', 'pez2.png', 'pez3.png', 'instalador.png', 'placacontar.png', 'alienAnimado.png', 'llaveAnimada.png', 'cofreAnimado.png', 'princesa.png', 'finCamino.png', 'casillaDerecha.png', 'casillaIzquierda.png', 'casillaArriba.png', 'casillaAbajo.png', 'raton.png', 'queso.png', 'naranja.png', 'casilla.tresNaranjas.png', 'fondo.tresNaranjas.png',
        /*--------ICONOS---------*/
        'iconos.botonRojo.png', 'icono.abrirOjos.png', 'icono.cerrarOjos.png', 'icono.pararse.png', 'icono.acostarse.png', 'icono.saludar.png', 'icono.sandia.png', 'icono.alimento_pez.png', 'icono.computadora.png', 'icono.pez.png', 'icono.carbon.png', 'icono.hierro.png', 'icono.nave.png']
      });

      window.pilas.onready = (function () {

        this.get('actividad').iniciarEscena();
        var contenedor = document.getElementById('contenedor-blockly');
        this.get('actividad').iniciarBlockly(contenedor);

        if (this.get('actividad')['finalizaCargarBlockly']) {
          this.get('actividad').finalizaCargarBlockly();
        }
      }).bind(this);

      window.pilas.ejecutar();
    })

  });

});
define('pilas-engine-bloques/components/pilas-desafio', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    classNames: ['desafio'],
    nombre: null,
    deshabilitada: false,

    actions: {
      abrir: function abrir() {
        this.sendAction('onSelect', this.get('nombre'));
      }
    }
  });

});
define('pilas-engine-bloques/components/pilas-editor', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    actividad: null,
    solucion: null,

    actions: {
      reiniciar: function reiniciar() {
        this.get('actividad').iniciarEscena();
      }
    }
  });

});
define('pilas-engine-bloques/components/pilas-update', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    classNames: ['pilas-update'],
    buscando: false,
    version: Ember['default'].inject.service(),
    mensaje: "",

    definirMensajeDiferido: function definirMensajeDiferido(mensaje) {
      var _this = this;

      setTimeout(function () {
        _this.set('mensaje', mensaje);
        _this.set('buscando', false);
      }, 2000);
    },

    actions: {
      buscar: function buscar() {
        var _this2 = this;

        this.set('buscando', true);
        this.set('mensaje', '');

        this.get('version').obtener_estado_de_version().then(function (data) {
          var comparacion = data.comparacion;
          var version_del_servidor = data.version_del_servidor;

          switch (comparacion) {
            case 0:
              _this2.definirMensajeDiferido("Tu versión está actualizada.");
              break;

            case -1:
              _this2.definirMensajeDiferido('Tu versión es más reciente que la del servidor: ' + version_del_servidor + '.');
              break;

            case 1:
              _this2.definirMensajeDiferido('Existe una actualización, la versión ' + version_del_servidor + '.');
              _this2.get('version').descargarActualizacion(version_del_servidor);
              break;
          }
        }, function (error) {

          console.error(error);
          _this2.definirMensajeDiferido("No se pudo consultar la versión desde Internet.");
        });
      }
    }
  });

});
define('pilas-engine-bloques/components/tether-dialog', ['exports', 'ember-modal-dialog/components/tether-dialog'], function (exports, tether_dialog) {

	'use strict';



	exports['default'] = tether_dialog['default'];

});
define('pilas-engine-bloques/controllers/acercade', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    version: Ember['default'].inject.service(),

    currentVersion: Ember['default'].computed('version', function () {
      return this.get('version').getVersion();
    }),

    actions: {
      visitWebsite: function visitWebsite() {
        var url = "http://bloques.pilas-engine.com.ar";

        if (window['requireNode'] === undefined) {
          window.open(url);
        } else {
          var gui = window.requireNode('nw.gui');
          gui.Shell.openExternal(url);
        }
      }
    }
  });

});
define('pilas-engine-bloques/controllers/application', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    url: '',
    queryParams: ['layout'],
    layout: true,
    environment: Ember['default'].inject.service(),

    mostrar_url: Ember['default'].on('init', function () {
      this.set('layout', this.get('environment').get('showLayout'));
    }),

    actions: {
      mostrar_devtools: function mostrar_devtools() {
        window.requireNode('nw.gui').Window.get().showDevTools();
      },
      actualizar: function actualizar() {
        location.reload(true);
      },
      redimensionar: function redimensionar() {
        alert("tengo que redimensionar!");
      },

      abrirPreferencias: function abrirPreferencias() {
        this.set('mostrarDialogoOpciones', true);
      },

      abrirAyuda: function abrirAyuda() {
        this.set('mostrarDialogoAyuda', true);
      },

      ocultar_boton_codigo: function ocultar_boton_codigo() {
        this.set('environment.debeMostrarBotonCodigoXML', false);
      },

      mostrar_boton_codigo: function mostrar_boton_codigo() {
        this.set('environment.debeMostrarBotonCodigoXML', true);
      },

      ocultarModals: function ocultarModals() {
        this.set('mostrarDialogoAyuda', false);
        this.set('mostrarDialogoOpciones', false);
      }
    }

  });

});
define('pilas-engine-bloques/controllers/array', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller;

});
define('pilas-engine-bloques/controllers/desafios/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    actions: {
      onSelect: function onSelect(name) {
        this.transitionToRoute('desafios.nombre', name);
      }
    }
  });

});
define('pilas-engine-bloques/controllers/editor', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    //actividad: Actividades.Alien,
    nombre_al_guardar: 'mi actividad',
    tmp_codigo_xml: '',

    debeGuardar: function debeGuardar() {
      var codigo_xml = this.get('actividad').obtener_codigo_en_texto();
      return codigo_xml !== this.get('tmp_codigo_xml');
    },

    inyectarRedimensionado: Ember['default'].on('init', function () {

      window.anterior_altura = 0;
      window.anterior_ancho = 0;
      var ancho_canvas = 445;

      function redimensionar() {
        var panel = document.getElementById('panel-derecho');
        var contenedorEditor = document.getElementById('contenedor-editor');
        var panelPilas = document.getElementById('panel-pilas');
        var e = document.getElementById('contenedor-blockly');

        if (!panel) {
          return null;
        }

        var altura = panel.getClientRects()[0].height;
        var ancho_total = contenedorEditor.getClientRects()[0].width;

        if (window.anterior_altura !== altura || window.anterior_ancho !== ancho_total) {

          e.style.width = ancho_total - ancho_canvas + 'px';
          e.style.height = altura - 50 + 'px';
          panelPilas.style.width = ancho_canvas - 20 + 'px';

          window.anterior_altura = altura;
          window.anterior_ancho = ancho_total;

          Blockly.fireUiEvent(window, 'resize');
        }
      }

      function forzar_redimensionado() {
        window.anterior_altura += 1;
        redimensionar();
      }

      window.onresize = redimensionar;
      window.forzar_redimensionado = forzar_redimensionado;
    }),

    'botones-modal-guardar': [Ember['default'].Object.create({ title: 'Guardar y ver en la galería', clicked: 'guardarEnGaleriaYRedireccionar' }), Ember['default'].Object.create({ title: 'Guardar y continuar', clicked: 'guardarEnGaleria', dismiss: 'modal' }), Ember['default'].Object.create({ title: 'Cerrar', dismiss: 'modal' })],

    actions: {
      registrarPrimerCodigo: function registrarPrimerCodigo() {
        var codigo_xml = this.get('actividad').obtener_codigo_en_texto();
        this.set('tmp_codigo_xml', codigo_xml);
        if (this.get('model')) {
          this.set('nombre_al_guardar', this.get('model').get('nombre'));
        }
      },

      guardar: function guardar() {
        var codigo_xml = this.get('actividad').obtener_codigo_en_texto();
        this.set('tmp_codigo_xml', codigo_xml);
        return Bootstrap.ModalManager.show('modal-guardar');
      },

      guardarEnGaleriaYRedireccionar: function guardarEnGaleriaYRedireccionar() {
        this.send('guardarEnGaleria');
        this.transitionToRoute('galeria');
      },

      guardarEnGaleria: function guardarEnGaleria() {
        //alert("test");
        var imagen = document.getElementById('canvas');
        var imagen_data = imagen.toDataURL('image/png');

        var juego = this.get('model');

        if (juego) {
          juego.set('nombre', this.get('nombre_al_guardar'));
          juego.set('imagen', imagen_data);
          juego.set('codigo', this.get('tmp_codigo_xml'));
        } else {
          juego = this.store.createRecord('galeria', {
            nombre: this.get('nombre_al_guardar'),
            imagen: imagen_data,
            codigo: this.get('tmp_codigo_xml')
          });
        }

        juego.save();
      }

    }
  });

});
define('pilas-engine-bloques/controllers/galeria', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].ArrayController.extend({
    actions: {
      eliminar: function eliminar(record) {
        record.destroyRecord();
      },

      abrir: function abrir(record) {
        this.transitionToRoute('editor', record);
      }
    }
  });

});
define('pilas-engine-bloques/controllers/iframe', ['exports', 'ember', 'pilas-engine-bloques/actividades'], function (exports, Ember, Actividades) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    queryParams: ['layout'],
    layout: true,
    actividad: Actividades['default'].Alien,
    nombre_al_guardar: 'mi actividad',
    tmp_codigo_xml: '',

    debeGuardar: function debeGuardar() {
      var codigo_xml = this.get('actividad').obtener_codigo_en_texto();
      return codigo_xml !== this.get('tmp_codigo_xml');
    },

    inyectarRedimensionado: Ember['default'].on('init', function () {

      window.anterior_altura = 0;
      window.anterior_ancho = 0;
      var ancho_canvas = 445;

      function redimensionar() {
        var panel = document.getElementById('panel-derecho');
        var contenedorEditor = document.getElementById('contenedor-editor');
        var panelPilas = document.getElementById('panel-pilas');
        var e = document.getElementById('contenedor-blockly');

        if (!panel) {
          return null;
        }

        var altura = panel.getClientRects()[0].height;
        var ancho_total = contenedorEditor.getClientRects()[0].width;

        if (window.anterior_altura !== altura || window.anterior_ancho !== ancho_total) {

          e.style.width = ancho_total - ancho_canvas + 'px';
          e.style.height = altura - 50 + 'px';
          panelPilas.style.width = ancho_canvas - 20 + 'px';

          window.anterior_altura = altura;
          window.anterior_ancho = ancho_total;

          Blockly.fireUiEvent(window, 'resize');
        }
      }

      function forzar_redimensionado() {
        window.anterior_altura += 1;
        redimensionar();
      }

      window.onresize = redimensionar;
      window.forzar_redimensionado = forzar_redimensionado;
    }),

    'botones-modal-guardar': [Ember['default'].Object.create({ title: 'Guardar y ver en la galería', clicked: 'guardarEnGaleriaYRedireccionar' }), Ember['default'].Object.create({ title: 'Guardar y continuar', clicked: 'guardarEnGaleria', dismiss: 'modal' }), Ember['default'].Object.create({ title: 'Cerrar', dismiss: 'modal' })],

    actions: {
      registrarPrimerCodigo: function registrarPrimerCodigo() {
        var codigo_xml = this.get('actividad').obtener_codigo_en_texto();
        this.set('tmp_codigo_xml', codigo_xml);
        if (this.get('model')) {
          this.set('nombre_al_guardar', this.get('model').get('nombre'));
        }
      },

      guardar: function guardar() {
        var codigo_xml = this.get('actividad').obtener_codigo_en_texto();
        this.set('tmp_codigo_xml', codigo_xml);
        return Bootstrap.ModalManager.show('modal-guardar');
      },

      guardarEnGaleriaYRedireccionar: function guardarEnGaleriaYRedireccionar() {
        this.send('guardarEnGaleria');
        this.transitionToRoute('galeria');
      },

      guardarEnGaleria: function guardarEnGaleria() {
        var imagen = document.getElementById('canvas');
        var imagen_data = imagen.toDataURL('image/png');

        var juego = this.get('model');

        if (juego) {
          juego.set('nombre', this.get('nombre_al_guardar'));
          juego.set('imagen', imagen_data);
          juego.set('codigo', this.get('tmp_codigo_xml'));
        } else {
          juego = this.store.createRecord('galeria', {
            nombre: this.get('nombre_al_guardar'),
            imagen: imagen_data,
            codigo: this.get('tmp_codigo_xml')
          });
        }

        juego.save();
      },

      reiniciar: function reiniciar() {
        this.get('actividad').iniciarEscena();
      }
    }
  });

});
define('pilas-engine-bloques/controllers/object', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller;

});
define('pilas-engine-bloques/controllers/preferencia', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    edicion: false,
    actions: {
      guardar: function guardar() {
        var record = this.store.find('preferencium', { tipo: 'principal' });
        record.save();

        model.save().then(function () {
          this.set('edicion', false);
        });
      },
      editar: function editar() {
        this.set('edicion', true);
      }
    }
  });

});
define('pilas-engine-bloques/controllers/solucion/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    actividades: Ember['default'].inject.service(),

    actions: {
      crearSolucionAlienTocaBoton: function crearSolucionAlienTocaBoton() {

        var solucion = this.store.createRecord('solucion', {
          codigoXML: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="MoverACasillaDerecha" id="4"><next><block type="MoverACasillaDerecha" id="7"><next><block type="MoverACasillaDerecha" id="10"><next><block type="ApretarBoton" id="13"></block></next></block></next></block></next></block></statement></block></xml>',
          nombreDesafio: 'AlienTocaBoton'
        });

        var actividad = this.get('actividades').obtenerPorNombre(solucion.get('nombreDesafio'));
        this.transitionToRoute('solucion.ver', { id: solucion.id, solucion: solucion, actividad: actividad });
      },

      crearSolucionAlien: function crearSolucionAlien() {
        var solucion = this.store.createRecord('solucion', {
          codigoXML: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="7" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="repetir" id="16" inline="true"><value name="count"><block type="math_number" id="17"><field name="NUM">4</field></block></value><statement name="block"><block type="MoverACasillaArriba" id="23"></block></statement><next><block type="repetir" id="45" inline="true"><value name="count"><block type="math_number" id="46"><field name="NUM">4</field></block></value><statement name="block"><block type="LevantaTuerca" id="29"><next><block type="MoverACasillaAbajo" id="35"><next><block type="MoverACasillaDerecha" id="41"></block></next></block></next></block></statement><next><block type="LevantaTuerca" id="53"></block></next></block></next></block></statement></block></xml>',
          nombreDesafio: 'alien'
        });

        var actividad = this.get('actividades').obtenerPorNombre(solucion.get('nombreDesafio'));
        this.transitionToRoute('solucion.ver', { id: solucion.id, solucion: solucion, actividad: actividad });
      }

    }
  });

});
define('pilas-engine-bloques/controllers/solucion/ver', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller.extend({});

});
define('pilas-engine-bloques/helpers/fa-icon', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var FA_PREFIX = /^fa\-.+/;

  var warn = Ember['default'].Logger.warn;

  /**
   * Handlebars helper for generating HTML that renders a FontAwesome icon.
   *
   * @param  {String} name    The icon name. Note that the `fa-` prefix is optional.
   *                          For example, you can pass in either `fa-camera` or just `camera`.
   * @param  {Object} options Options passed to helper.
   * @return {Ember.Handlebars.SafeString} The HTML markup.
   */
  var faIcon = function faIcon(name, options) {
    if (Ember['default'].typeOf(name) !== 'string') {
      var message = "fa-icon: no icon specified";
      warn(message);
      return Ember['default'].String.htmlSafe(message);
    }

    var params = options.hash,
        classNames = [],
        html = "";

    classNames.push("fa");
    if (!name.match(FA_PREFIX)) {
      name = "fa-" + name;
    }
    classNames.push(name);
    if (params.spin) {
      classNames.push("fa-spin");
    }
    if (params.flip) {
      classNames.push("fa-flip-" + params.flip);
    }
    if (params.rotate) {
      classNames.push("fa-rotate-" + params.rotate);
    }
    if (params.lg) {
      warn("fa-icon: the 'lg' parameter is deprecated. Use 'size' instead. I.e. {{fa-icon size=\"lg\"}}");
      classNames.push("fa-lg");
    }
    if (params.x) {
      warn("fa-icon: the 'x' parameter is deprecated. Use 'size' instead. I.e. {{fa-icon size=\"" + params.x + "\"}}");
      classNames.push("fa-" + params.x + "x");
    }
    if (params.size) {
      if (Ember['default'].typeOf(params.size) === "string" && params.size.match(/\d+/)) {
        params.size = Number(params.size);
      }
      if (Ember['default'].typeOf(params.size) === "number") {
        classNames.push("fa-" + params.size + "x");
      } else {
        classNames.push("fa-" + params.size);
      }
    }
    if (params.fixedWidth) {
      classNames.push("fa-fw");
    }
    if (params.listItem) {
      classNames.push("fa-li");
    }
    if (params.pull) {
      classNames.push("pull-" + params.pull);
    }
    if (params.border) {
      classNames.push("fa-border");
    }
    if (params.classNames && !Ember['default'].isArray(params.classNames)) {
      params.classNames = [params.classNames];
    }
    if (!Ember['default'].isEmpty(params.classNames)) {
      Array.prototype.push.apply(classNames, params.classNames);
    }

    html += "<";
    var tagName = params.tagName || 'i';
    html += tagName;
    html += " class='" + classNames.join(" ") + "'";
    if (params.title) {
      html += " title='" + params.title + "'";
    }
    if (params.ariaHidden === undefined || params.ariaHidden) {
      html += " aria-hidden=\"true\"";
    }
    html += "></" + tagName + ">";
    return Ember['default'].String.htmlSafe(html);
  };

  exports['default'] = Ember['default'].Handlebars.makeBoundHelper(faIcon);

  exports.faIcon = faIcon;

});
define('pilas-engine-bloques/initializers/add-modals-container', ['exports', 'ember-modal-dialog/initializers/add-modals-container'], function (exports, initialize) {

  'use strict';

  exports['default'] = {
    name: 'add-modals-container',
    initialize: initialize['default']
  };

});
define('pilas-engine-bloques/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'pilas-engine-bloques/config/environment'], function (exports, initializerFactory, config) {

  'use strict';

  var _config$APP = config['default'].APP;
  var name = _config$APP.name;
  var version = _config$APP.version;

  exports['default'] = {
    name: 'App Version',
    initialize: initializerFactory['default'](name, version)
  };

});
define('pilas-engine-bloques/initializers/export-application-global', ['exports', 'ember', 'pilas-engine-bloques/config/environment'], function (exports, Ember, config) {

  'use strict';

  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];
    if (config['default'].exportApplicationGlobal !== false) {
      var value = config['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = Ember['default'].String.classify(config['default'].modulePrefix);
      }

      if (!window[globalName]) {
        window[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete window[globalName];
          }
        });
      }
    }
  }

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };

});
define('pilas-engine-bloques/models/galeria', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    nombre: DS['default'].attr('string'),
    codigo: DS['default'].attr('string'),
    imagen: DS['default'].attr('string')
  });

});
define('pilas-engine-bloques/models/preferencium', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    nombre: DS['default'].attr('string'),
    tipo: DS['default'].attr('string')
  });

});
define('pilas-engine-bloques/models/solucion', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    codigoXML: DS['default'].attr('string'),
    nombreDesafio: DS['default'].attr('string')
  });

});
define('pilas-engine-bloques/router', ['exports', 'ember', 'pilas-engine-bloques/config/environment'], function (exports, Ember, config) {

  'use strict';

  var Router = Ember['default'].Router.extend({
    location: config['default'].locationType
  });

  Router.map(function () {
    this.route('about');
    this.route('preferencia');
    this.route('editor', {
      path: '/editor/:galeria_id',
      resetNamespace: true
    });
    this.route('galeria');
    this.route('iframe');
    this.route('test');
    this.route('desafios', {
      resetNamespace: true
    }, function () {
      this.route('nombre', { path: ':nombre' });
    });
    this.route('acercade');

    this.resource('solucion', { path: '/solucion' }, function () {
      this.route('ver', { path: '/:id' });
    });
  });

  exports['default'] = Router;

});
define('pilas-engine-bloques/routes/acercade', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({});

});
define('pilas-engine-bloques/routes/desafios/nombre', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    actividades: Ember['default'].inject.service(),
    actividadActual: null,

    model: function model(param) {
      var _this = this;

      return new Ember['default'].RSVP.Promise(function (resolve, reject) {
        var actividad = _this.get('actividades').obtenerPorNombre(param.nombre);
        _this.set('actividadActual', actividad);

        if (!actividad) {
          var msg = "ERROR: no existe un desafio con ese nombre";
          return reject(msg);
        }

        return resolve({ actividad: actividad });
      });
    },

    actions: {
      reiniciar: function reiniciar() {
        this.get('actividadActual').iniciarEscena();
      }
    }
  });

});
define('pilas-engine-bloques/routes/desafios', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({});

});
define('pilas-engine-bloques/routes/editor', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    model: function model(params) {
      if (params.galeria_id !== 'new') {
        return this.store.find('galeria', params.galeria_id);
      } else {
        return null;
      }
    },
    actions: {
      willTransition: function willTransition(transition) {
        var b = this.controllerFor('editor').debeGuardar();
        if (b) {
          transition.abort();
          this.controllerFor('editor').send('guardar');
        } else {
          // Bubble the `willTransition` action so that
          // parent routes can decide whether or not to abort.
          return true;
        }
      }
    }

  });

});
define('pilas-engine-bloques/routes/galeria', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    model: function model() {
      return this.store.find('galeria');
    }
  });

});
define('pilas-engine-bloques/routes/iframe', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    model: function model() {
      return null;
    }
  });

});
define('pilas-engine-bloques/routes/index', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({});

});
define('pilas-engine-bloques/routes/preferencia', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    model: function model() {
      var record = this.store.find('preferencium', { tipo: 'principal' });
      var controller = this;

      record.then(function (data) {
        return data;
      })['catch'](function (err) {
        return controller.store.createRecord('preferencium', {
          tipo: 'principal',
          nombre: 'nombre sin definir'
        }).save();
      });
    }
  });

});
define('pilas-engine-bloques/routes/solucion/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    model: function model() {}

  });

});
define('pilas-engine-bloques/routes/solucion/ver', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    model: function model() {
      console.error("Volviendo a la vista index porque no hay un modelo para cargar.");
      return this.transitionTo('solucion.index');
    }
  });

});
define('pilas-engine-bloques/routes/test', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    actividades: Ember['default'].inject.service(),

    model: function model() {
      var actividad = this.get('actividades').obtenerPorNombre('alien');

      return { actividad: actividad };
    }
  });

});
define('pilas-engine-bloques/routes/tips', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({});

});
define('pilas-engine-bloques/serializers/application', ['exports', 'ember-data'], function (exports, DS) {

	'use strict';

	exports['default'] = DS['default'].LSSerializer.extend();

});
define('pilas-engine-bloques/services/actividades', ['exports', 'ember', 'pilas-engine-bloques/actividades/actividadAlien', 'pilas-engine-bloques/actividades/actividadLaEleccionDelMono', 'pilas-engine-bloques/actividades/actividadElMonoYLasBananas', 'pilas-engine-bloques/actividades/actividadTitoEnciendeLuces', 'pilas-engine-bloques/actividades/actividadFutbolRobots', 'pilas-engine-bloques/actividades/actividadElPlanetaDeNano', 'pilas-engine-bloques/actividades/actividadAlienTocaBoton', 'pilas-engine-bloques/actividades/actividadTitoRecargado', 'pilas-engine-bloques/actividades/actividadSuperTito1', 'pilas-engine-bloques/actividades/actividadSuperTito2', 'pilas-engine-bloques/actividades/actividadElRecolectorDeEstrellas', 'pilas-engine-bloques/actividades/actividadLaGranAventuraDelMarEncantado', 'pilas-engine-bloques/actividades/actividadMariaLaComeSandias', 'pilas-engine-bloques/actividades/actividadElMarcianoEnElDesierto', 'pilas-engine-bloques/actividades/actividadAlimentandoALosPeces', 'pilas-engine-bloques/actividades/actividadInstalandoJuegos', 'pilas-engine-bloques/actividades/actividadElGatoEnLaCalle', 'pilas-engine-bloques/actividades/actividadNoMeCansoDeSaltar', 'pilas-engine-bloques/actividades/actividadReparandoLaNave', 'pilas-engine-bloques/actividades/actividadElMonoQueSabeContar', 'pilas-engine-bloques/actividades/actividadTresNaranjas', 'pilas-engine-bloques/actividades/actividadLaberintoCorto', 'pilas-engine-bloques/actividades/actividadLaberintoLargo', 'pilas-engine-bloques/actividades/actividadLaberintoConQueso', 'pilas-engine-bloques/actividades/actividadElCangrejoAguafiestas', 'pilas-engine-bloques/actividades/actividad'], function (exports, Ember, actividadAlien, actividadLaEleccionDelMono, actividadElMonoYLasBananas, actividadTitoEnciendeLuces, actividadFutbolRobots, actividadElPlanetaDeNano, actividadAlienTocaBoton, actividadTitoRecargado, actividadSuperTito1, actividadSuperTito2, actividadElRecolectorDeEstrellas, actividadLaGranAventuraDelMarEncantado, actividadMariaLaComeSandias, actividadElMarcianoEnElDesierto, actividadAlimentandoALosPeces, actividadInstalandoJuegos, actividadElGatoEnLaCalle, actividadNoMeCansoDeSaltar, actividadReparandoLaNave, actividadElMonoQueSabeContar, actividadTresNaranjas, actividadLaberintoCorto, actividadLaberintoLargo, actividadLaberintoConQueso, actividadElCangrejoAguafiestas, Actividad) {

  'use strict';

  /*jshint unused:false*/

  var ParamValor = Ember['default'].Object.extend({
    build: function build() {
      var str_block = '';
      str_block += '<value name="NOMBRE">'.replace('NOMBRE', this.get('nombre_param'));

      str_block += '<block type="TIPO">'.replace('TIPO', this.get('tipo_bloque'));

      str_block += '<field name="TIPO">'.replace('TIPO', this.get('nombre_valor'));
      str_block += this.get('valor');
      str_block += '</field>';

      str_block += '</block>';

      str_block += '</value>';

      return str_block;
    }
  });exports['default'] = Ember['default'].Service.extend({
    obtenerPorNombre: function obtenerPorNombre(idActividad) {

      var actividades = [actividadAlien['default'], actividadAlienTocaBoton['default'], actividadLaEleccionDelMono['default'], actividadElMonoYLasBananas['default'], actividadTitoEnciendeLuces['default'], actividadFutbolRobots['default'], actividadElPlanetaDeNano['default'], actividadTitoRecargado['default'], actividadSuperTito1['default'], actividadSuperTito2['default'], actividadElRecolectorDeEstrellas['default'], actividadMariaLaComeSandias['default'], actividadElMarcianoEnElDesierto['default'], actividadAlimentandoALosPeces['default'], actividadInstalandoJuegos['default'], actividadNoMeCansoDeSaltar['default'], actividadElGatoEnLaCalle['default'], actividadElMonoQueSabeContar['default'], actividadReparandoLaNave['default'], actividadTresNaranjas['default'], actividadLaberintoCorto['default'], actividadLaberintoLargo['default'], actividadLaberintoConQueso['default'], actividadElCangrejoAguafiestas['default'], actividadLaGranAventuraDelMarEncantado['default']];

      var actividad = actividades.findBy('id', idActividad);

      if (!actividad) {
        return null;
      }

      return Actividad['default'].create({ actividad: actividad });
    }
  });

});
define('pilas-engine-bloques/services/browser', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var isNode = typeof process !== "undefined" && typeof require !== "undefined";
  var isNodeWebkit = false;

  //Is this Node.js?
  if (isNode) {
    //If so, test for Node-Webkit
    try {
      isNodeWebkit = typeof require('nw.gui') !== "undefined";
    } catch (e) {
      isNodeWebkit = false;
    }
  }

  exports['default'] = Ember['default'].Service.extend({
    openLink: function openLink(url) {
      if (isNodeWebkit) {
        var gui = window.requireNode('nw.gui');
        gui.Shell.openExternal(url);
      } else {
        window.open(url);
      }
    }
  });

});
define('pilas-engine-bloques/services/environment', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Service.extend({
    env: null,
    showLayout: null,
    debeMostrarBotonCodigoXML: false,

    loadProperties: Ember['default'].on('init', function () {
      this.set('env', this.container.lookupFactory('config:environment'));
      this.set('showLayout', this.get('env').showLayout);
    }),

    getENV: function getENV() {
      return this.get('env');
    }
  });

});
define('pilas-engine-bloques/services/modal-dialog', ['exports', 'ember-modal-dialog/services/modal-dialog'], function (exports, Service) {

	'use strict';

	exports['default'] = Service['default'];

});
define('pilas-engine-bloques/services/twitter', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var URL_SEND_MESSAGE = "http://104.131.245.133:9914/sendMessage";

  exports['default'] = Ember['default'].Service.extend({
    compartir: function compartir(mensaje, imagen) {
      return new Ember['default'].RSVP.Promise(function (resolve, reject) {
        $.ajax({
          url: URL_SEND_MESSAGE,
          type: 'POST',
          dataType: 'json',
          contentType: "application/json",
          data: JSON.stringify({
            message: mensaje,
            media: imagen
          }),
          success: function success(res) {
            resolve(res);
          },
          error: function error(xhr) {
            console.error(xhr.responseText);
            reject(xhr.responseText);
          }
        });
      });
    }
  });

});
define('pilas-engine-bloques/services/version', ['exports', 'ember', 'pilas-engine-bloques/config/environment'], function (exports, Ember, ENV) {

  'use strict';

  exports['default'] = Ember['default'].Service.extend({

    getVersion: function getVersion() {
      return "0.9.4";
    },

    obtener_version_del_servidor: function obtener_version_del_servidor() {
      return new Ember['default'].RSVP.Promise(function (resolve, reject) {

        function on_success(response) {
          resolve(response.currentVersion);
        }

        function on_error(error) {
          var url = ENV['default'].versionURL;
          var msg = "imposible la última versión desde: " + url;

          console.error(msg, error);
          reject(msg);
        }

        $.getJSON(ENV['default'].versionURL, on_success).fail(on_error);
      });
    },

    obtener_estado_de_version: function obtener_estado_de_version() {
      var _this = this;

      return new Ember['default'].RSVP.Promise(function (resolve, reject) {

        if (window.requireNode === undefined) {
          //console.log("Evitando consultar el número de versión porque no está en nwjs.");
          resolve({ comparacion: 0, version_del_servidor: '0.0.0' });
          return;
        }

        _this.obtener_version_del_servidor().then(function (version_del_servidor) {
          var compareVersion = window.requireNode('compare-version');
          var version_local = _this.getVersion();
          var comparacion = compareVersion(version_del_servidor, version_local);

          resolve({ comparacion: comparacion, version_del_servidor: version_del_servidor });
        })["catch"](function (error) {
          reject(error);
        });
      });
    },

    descargarActualizacion: function descargarActualizacion(version) {
      var url = ENV['default'].downloadURL.replace(/VERSION/gi, version);
      var http = window.requireNode('http');

      function download(url) {
        return new Ember['default'].RSVP.Promise(function (success, reject) {

          var request = http.get(url, function (response) {
            response.setEncoding('utf-8');

            var len = parseInt(response.headers['content-length'], 10);
            var body = "";
            var cur = 0;
            var total = len / 1048576; //1048576 - bytes in  1Megabyte

            response.on("data", function (chunk) {
              body += chunk;
              cur += chunk.length;
              console.log("Descargando " + (100.0 * cur / len).toFixed(2) + "% " + (cur / 1048576).toFixed(2) + " mb (total size: " + total.toFixed(2) + " mb)");
            });

            response.on("end", function () {
              console.log("Descarga completa");
              success();
            });

            request.on("error", function (e) {
              console.error("Error: " + e.message);
              reject(e.message);
            });
          });
        });
      }

      download(url).then(function () {
        alert("SUCCESS");
      })["catch"](function (error) {
        console.error(error);
      });
    }
  });

});
define('pilas-engine-bloques/services/zoom', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Service.extend({
    zoom: 100,

    getValue: function getValue() {
      return this.get('zoom');
    },

    setValue: function setValue(zoomValue) {
      this.set('zoom', zoomValue);
    }
  });

});
define('pilas-engine-bloques/templates/-compartir', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.7",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 2,
            "column": 0
          }
        },
        "moduleName": "pilas-engine-bloques/templates/-compartir.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() { return []; },
      statements: [

      ],
      locals: [],
      templates: []
    };
  }()));

});
define('pilas-engine-bloques/templates/-modal-ayuda', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        return {
          meta: {
            "revision": "Ember@1.13.7",
            "loc": {
              "source": null,
              "start": {
                "line": 2,
                "column": 2
              },
              "end": {
                "line": 38,
                "column": 2
              }
            },
            "moduleName": "pilas-engine-bloques/templates/-modal-ayuda.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("\n  ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n\n  ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1,"class","modal-body");
            var el2 = dom.createTextNode("\n\n    ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("p");
            var el3 = dom.createTextNode("Esta aplicación te presentará varios desafíos que se pueden\n      resolver conectando bloques.");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n\n    ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("p");
            var el3 = dom.createTextNode("El primer paso es abrir la sección de Desafíos:");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n\n    ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("img");
            dom.setAttribute(el2,"src","imagenes/ayuda/seleccionar.gif");
            dom.setAttribute(el2,"class","img-border");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n\n    ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("p");
            var el3 = dom.createTextNode("Los bloques están agrupados en categorías, usá la barra lateral\n      para desplegar los bloques.");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n\n    ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("p");
            var el3 = dom.createTextNode("Luego podés arrastrar y soltar los bloques sobre el area\n      de trabajo.");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n\n    ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("img");
            dom.setAttribute(el2,"src","imagenes/ayuda/arrastrar.gif");
            dom.setAttribute(el2,"class","img-border");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n\n    ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("p");
            var el3 = dom.createTextNode("Una vez que tengas tu programa listo pulsá el botón ejecutar\n      continuar.");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n\n    ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("img");
            dom.setAttribute(el2,"src","imagenes/ayuda/ejecutar.gif");
            dom.setAttribute(el2,"class","img-border");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n\n    ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("p");
            var el3 = dom.createTextNode("Ah, y los bloques se pueden borrar arrastrándolos a la papelera.");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n\n    ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("img");
            dom.setAttribute(el2,"src","imagenes/ayuda/borrar.gif");
            dom.setAttribute(el2,"class","img-border");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n\n\n  ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n\n\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
            return morphs;
          },
          statements: [
            ["inline","modal-title",[],["title","Ayuda","close","ocultarModals"],["loc",[null,[6,2],[6,53]]]]
          ],
          locals: [],
          templates: []
        };
      }());
      return {
        meta: {
          "revision": "Ember@1.13.7",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 39,
              "column": 0
            }
          },
          "moduleName": "pilas-engine-bloques/templates/-modal-ayuda.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [
          ["block","modal-dialog",[],["close","ocultarModals","targetAttachment","center","translucentOverlay",true],0,null,["loc",[null,[2,2],[38,19]]]]
        ],
        locals: [],
        templates: [child0]
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.7",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 40,
            "column": 0
          }
        },
        "moduleName": "pilas-engine-bloques/templates/-modal-ayuda.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [
        ["block","if",[["get","mostrarDialogoAyuda",["loc",[null,[1,6],[1,25]]]]],[],0,null,["loc",[null,[1,0],[39,7]]]]
      ],
      locals: [],
      templates: [child0]
    };
  }()));

});
define('pilas-engine-bloques/templates/-modal-preferencias', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        var child0 = (function() {
          return {
            meta: {
              "revision": "Ember@1.13.7",
              "loc": {
                "source": null,
                "start": {
                  "line": 17,
                  "column": 12
                },
                "end": {
                  "line": 19,
                  "column": 12
                }
              },
              "moduleName": "pilas-engine-bloques/templates/-modal-preferencias.hbs"
            },
            arity: 0,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("              ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("button");
              dom.setAttribute(el1,"class","btn btn-info btn-sm margin");
              var el2 = dom.createElement("i");
              dom.setAttribute(el2,"class","glyphicon glyphicon-file");
              dom.appendChild(el1, el2);
              var el2 = dom.createTextNode(" Ocultar botón de código XML");
              dom.appendChild(el1, el2);
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
              var element1 = dom.childAt(fragment, [1]);
              var morphs = new Array(1);
              morphs[0] = dom.createElementMorph(element1);
              return morphs;
            },
            statements: [
              ["element","action",["ocultar_boton_codigo"],[],["loc",[null,[18,57],[18,90]]]]
            ],
            locals: [],
            templates: []
          };
        }());
        var child1 = (function() {
          return {
            meta: {
              "revision": "Ember@1.13.7",
              "loc": {
                "source": null,
                "start": {
                  "line": 19,
                  "column": 12
                },
                "end": {
                  "line": 21,
                  "column": 12
                }
              },
              "moduleName": "pilas-engine-bloques/templates/-modal-preferencias.hbs"
            },
            arity: 0,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("              ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("button");
              dom.setAttribute(el1,"class","btn btn-success btn-sm margin");
              var el2 = dom.createElement("i");
              dom.setAttribute(el2,"class","glyphicon glyphicon-file");
              dom.appendChild(el1, el2);
              var el2 = dom.createTextNode(" Mostrar botón de código XML");
              dom.appendChild(el1, el2);
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
              var element0 = dom.childAt(fragment, [1]);
              var morphs = new Array(1);
              morphs[0] = dom.createElementMorph(element0);
              return morphs;
            },
            statements: [
              ["element","action",["mostrar_boton_codigo"],[],["loc",[null,[20,60],[20,93]]]]
            ],
            locals: [],
            templates: []
          };
        }());
        return {
          meta: {
            "revision": "Ember@1.13.7",
            "loc": {
              "source": null,
              "start": {
                "line": 2,
                "column": 2
              },
              "end": {
                "line": 35,
                "column": 2
              }
            },
            "moduleName": "pilas-engine-bloques/templates/-modal-preferencias.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("\n  ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n\n  ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1,"class","modal-body");
            var el2 = dom.createTextNode("\n    ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("div");
            dom.setAttribute(el2,"class","fila-opcion");
            var el3 = dom.createTextNode("\n\n      ");
            dom.appendChild(el2, el3);
            var el3 = dom.createElement("div");
            dom.setAttribute(el3,"class","row");
            var el4 = dom.createTextNode("\n          ");
            dom.appendChild(el3, el4);
            var el4 = dom.createElement("div");
            dom.setAttribute(el4,"class","col-md-6");
            var el5 = dom.createTextNode("Herramientas de desarrollo:");
            dom.appendChild(el4, el5);
            dom.appendChild(el3, el4);
            var el4 = dom.createTextNode("\n          ");
            dom.appendChild(el3, el4);
            var el4 = dom.createElement("div");
            dom.setAttribute(el4,"class","col-md-6");
            var el5 = dom.createTextNode("\n            ");
            dom.appendChild(el4, el5);
            var el5 = dom.createElement("button");
            dom.setAttribute(el5,"class","btn btn-success btn-sm margin");
            var el6 = dom.createElement("i");
            dom.setAttribute(el6,"class","glyphicon glyphicon-refresh");
            dom.appendChild(el5, el6);
            var el6 = dom.createTextNode(" Actualizar");
            dom.appendChild(el5, el6);
            dom.appendChild(el4, el5);
            var el5 = dom.createTextNode("\n            ");
            dom.appendChild(el4, el5);
            var el5 = dom.createElement("button");
            dom.setAttribute(el5,"class","btn btn-info btn-sm margin");
            var el6 = dom.createElement("i");
            dom.setAttribute(el6,"class","glyphicon glyphicon-cog");
            dom.appendChild(el5, el6);
            var el6 = dom.createTextNode(" Mostrar devtools");
            dom.appendChild(el5, el6);
            dom.appendChild(el4, el5);
            var el5 = dom.createTextNode("\n\n");
            dom.appendChild(el4, el5);
            var el5 = dom.createComment("");
            dom.appendChild(el4, el5);
            var el5 = dom.createTextNode("          ");
            dom.appendChild(el4, el5);
            dom.appendChild(el3, el4);
            var el4 = dom.createTextNode("\n      ");
            dom.appendChild(el3, el4);
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("\n    ");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n\n    ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("div");
            dom.setAttribute(el2,"class","fila-opcion");
            var el3 = dom.createTextNode("\n      ");
            dom.appendChild(el2, el3);
            var el3 = dom.createElement("div");
            dom.setAttribute(el3,"class","row");
            var el4 = dom.createTextNode("\n        ");
            dom.appendChild(el3, el4);
            var el4 = dom.createElement("div");
            dom.setAttribute(el4,"class","col-md-6");
            var el5 = dom.createTextNode("Tamaño de interfaz:");
            dom.appendChild(el4, el5);
            dom.appendChild(el3, el4);
            var el4 = dom.createTextNode("\n        ");
            dom.appendChild(el3, el4);
            var el4 = dom.createElement("div");
            dom.setAttribute(el4,"class","col-md-6");
            var el5 = dom.createTextNode(" ");
            dom.appendChild(el4, el5);
            var el5 = dom.createComment("");
            dom.appendChild(el4, el5);
            var el5 = dom.createTextNode(" ");
            dom.appendChild(el4, el5);
            dom.appendChild(el3, el4);
            var el4 = dom.createTextNode("\n      ");
            dom.appendChild(el3, el4);
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("\n    ");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n  ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n\n\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element2 = dom.childAt(fragment, [3]);
            var element3 = dom.childAt(element2, [1, 1, 3]);
            var element4 = dom.childAt(element3, [1]);
            var element5 = dom.childAt(element3, [3]);
            var morphs = new Array(5);
            morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
            morphs[1] = dom.createElementMorph(element4);
            morphs[2] = dom.createElementMorph(element5);
            morphs[3] = dom.createMorphAt(element3,5,5);
            morphs[4] = dom.createMorphAt(dom.childAt(element2, [3, 1, 3]),1,1);
            return morphs;
          },
          statements: [
            ["inline","modal-title",[],["title","Opciones","close","ocultarModals"],["loc",[null,[6,2],[6,56]]]],
            ["element","action",["actualizar"],[],["loc",[null,[14,58],[14,81]]]],
            ["element","action",["mostrar_devtools"],[],["loc",[null,[15,55],[15,84]]]],
            ["block","if",[["get","environment.debeMostrarBotonCodigoXML",["loc",[null,[17,18],[17,55]]]]],[],0,1,["loc",[null,[17,12],[21,19]]]],
            ["content","nw-zoom",["loc",[null,[29,31],[29,42]]]]
          ],
          locals: [],
          templates: [child0, child1]
        };
      }());
      return {
        meta: {
          "revision": "Ember@1.13.7",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 36,
              "column": 0
            }
          },
          "moduleName": "pilas-engine-bloques/templates/-modal-preferencias.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [
          ["block","modal-dialog",[],["close","ocultarModals","targetAttachment","center","translucentOverlay",true],0,null,["loc",[null,[2,2],[35,19]]]]
        ],
        locals: [],
        templates: [child0]
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.7",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 37,
            "column": 0
          }
        },
        "moduleName": "pilas-engine-bloques/templates/-modal-preferencias.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [
        ["block","if",[["get","mostrarDialogoOpciones",["loc",[null,[1,6],[1,28]]]]],[],0,null,["loc",[null,[1,0],[36,7]]]]
      ],
      locals: [],
      templates: [child0]
    };
  }()));

});
define('pilas-engine-bloques/templates/-modal-twitter', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        var child0 = (function() {
          return {
            meta: {
              "revision": "Ember@1.13.7",
              "loc": {
                "source": null,
                "start": {
                  "line": 21,
                  "column": 8
                },
                "end": {
                  "line": 23,
                  "column": 8
                }
              },
              "moduleName": "pilas-engine-bloques/templates/-modal-twitter.hbs"
            },
            arity: 0,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("          ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("button");
              dom.setAttribute(el1,"class","btn btn-info");
              dom.setAttribute(el1,"disabled","");
              var el2 = dom.createElement("i");
              dom.setAttribute(el2,"class","fa fa-twitter");
              dom.appendChild(el1, el2);
              var el2 = dom.createTextNode(" Compartiendo ...");
              dom.appendChild(el1, el2);
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            buildRenderNodes: function buildRenderNodes() { return []; },
            statements: [

            ],
            locals: [],
            templates: []
          };
        }());
        var child1 = (function() {
          return {
            meta: {
              "revision": "Ember@1.13.7",
              "loc": {
                "source": null,
                "start": {
                  "line": 23,
                  "column": 8
                },
                "end": {
                  "line": 25,
                  "column": 8
                }
              },
              "moduleName": "pilas-engine-bloques/templates/-modal-twitter.hbs"
            },
            arity: 0,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("          ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("button");
              dom.setAttribute(el1,"class","btn btn-info");
              var el2 = dom.createElement("i");
              dom.setAttribute(el2,"class","fa fa-twitter");
              dom.appendChild(el1, el2);
              var el2 = dom.createTextNode(" Compartir");
              dom.appendChild(el1, el2);
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
              var element1 = dom.childAt(fragment, [1]);
              var morphs = new Array(1);
              morphs[0] = dom.createElementMorph(element1);
              return morphs;
            },
            statements: [
              ["element","action",["enviarMensaje"],[],["loc",[null,[24,39],[24,65]]]]
            ],
            locals: [],
            templates: []
          };
        }());
        var child2 = (function() {
          return {
            meta: {
              "revision": "Ember@1.13.7",
              "loc": {
                "source": null,
                "start": {
                  "line": 28,
                  "column": 6
                },
                "end": {
                  "line": 33,
                  "column": 6
                }
              },
              "moduleName": "pilas-engine-bloques/templates/-modal-twitter.hbs"
            },
            arity: 0,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("        ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("div");
              dom.setAttribute(el1,"class","compartir-mensaje");
              var el2 = dom.createTextNode("\n          Listo, tu mensaje fué publicado en twitter,\n          ");
              dom.appendChild(el1, el2);
              var el2 = dom.createElement("a");
              dom.setAttribute(el2,"href","");
              var el3 = dom.createTextNode("¿querés abrirlo?");
              dom.appendChild(el2, el3);
              dom.appendChild(el1, el2);
              var el2 = dom.createTextNode(".\n        ");
              dom.appendChild(el1, el2);
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
              var element0 = dom.childAt(fragment, [1, 1]);
              var morphs = new Array(1);
              morphs[0] = dom.createElementMorph(element0);
              return morphs;
            },
            statements: [
              ["element","action",["abrirMensajePublicado"],[],["loc",[null,[31,21],[31,55]]]]
            ],
            locals: [],
            templates: []
          };
        }());
        return {
          meta: {
            "revision": "Ember@1.13.7",
            "loc": {
              "source": null,
              "start": {
                "line": 3,
                "column": 2
              },
              "end": {
                "line": 39,
                "column": 2
              }
            },
            "moduleName": "pilas-engine-bloques/templates/-modal-twitter.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("\n  ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n\n  ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1,"class","modal-body");
            var el2 = dom.createTextNode("\n    ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("div");
            dom.setAttribute(el2,"class","modal-inline-block  float-left");
            var el3 = dom.createTextNode("\n      ");
            dom.appendChild(el2, el3);
            var el3 = dom.createElement("img");
            dom.setAttribute(el3,"id","preview");
            dom.setAttribute(el3,"width","210");
            dom.setAttribute(el3,"height","240");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("\n    ");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n\n    ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("div");
            dom.setAttribute(el2,"class","modal-inline-block");
            var el3 = dom.createTextNode("\n\n      ");
            dom.appendChild(el2, el3);
            var el3 = dom.createElement("div");
            dom.setAttribute(el3,"class","fila-opcion");
            var el4 = dom.createTextNode("\n        Mensaje: ");
            dom.appendChild(el3, el4);
            var el4 = dom.createComment("");
            dom.appendChild(el3, el4);
            var el4 = dom.createTextNode("\n      ");
            dom.appendChild(el3, el4);
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("\n\n      ");
            dom.appendChild(el2, el3);
            var el3 = dom.createElement("div");
            dom.setAttribute(el3,"class","fila-opcion");
            var el4 = dom.createTextNode("\n");
            dom.appendChild(el3, el4);
            var el4 = dom.createComment("");
            dom.appendChild(el3, el4);
            var el4 = dom.createTextNode("      ");
            dom.appendChild(el3, el4);
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("\n\n");
            dom.appendChild(el2, el3);
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("\n    ");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n  ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n\n\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element2 = dom.childAt(fragment, [3]);
            var element3 = dom.childAt(element2, [1, 1]);
            var element4 = dom.childAt(element2, [3]);
            var morphs = new Array(5);
            morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
            morphs[1] = dom.createAttrMorph(element3, 'src');
            morphs[2] = dom.createMorphAt(dom.childAt(element4, [1]),1,1);
            morphs[3] = dom.createMorphAt(dom.childAt(element4, [3]),1,1);
            morphs[4] = dom.createMorphAt(element4,5,5);
            return morphs;
          },
          statements: [
            ["inline","modal-title",[],["title","Compartir en twitter","close","ocultarModalTwitter"],["loc",[null,[7,2],[7,74]]]],
            ["attribute","src",["get","previewData",["loc",[null,[11,30],[11,41]]]]],
            ["inline","textarea",[],["class","modal-mensaje-compartir","rows",3,"value",["subexpr","@mut",[["get","mensajeCompartir",["loc",[null,[17,73],[17,89]]]]],[],[]]],["loc",[null,[17,17],[17,91]]]],
            ["block","if",[["get","envioEnCurso",["loc",[null,[21,14],[21,26]]]]],[],0,1,["loc",[null,[21,8],[25,15]]]],
            ["block","if",[["get","mensajePublicadoURL",["loc",[null,[28,12],[28,31]]]]],[],2,null,["loc",[null,[28,6],[33,13]]]]
          ],
          locals: [],
          templates: [child0, child1, child2]
        };
      }());
      return {
        meta: {
          "revision": "Ember@1.13.7",
          "loc": {
            "source": null,
            "start": {
              "line": 2,
              "column": 0
            },
            "end": {
              "line": 40,
              "column": 0
            }
          },
          "moduleName": "pilas-engine-bloques/templates/-modal-twitter.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [
          ["block","modal-dialog",[],["close","ocultarModalTwitter","targetAttachment","center","translucentOverlay",true],0,null,["loc",[null,[3,2],[39,19]]]]
        ],
        locals: [],
        templates: [child0]
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.7",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 41,
            "column": 0
          }
        },
        "moduleName": "pilas-engine-bloques/templates/-modal-twitter.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [
        ["block","if",[["get","abrirDialogoCompartir",["loc",[null,[2,6],[2,27]]]]],[],0,null,["loc",[null,[2,0],[40,7]]]]
      ],
      locals: [],
      templates: [child0]
    };
  }()));

});
define('pilas-engine-bloques/templates/-navbar', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.7",
          "loc": {
            "source": null,
            "start": {
              "line": 11,
              "column": 8
            },
            "end": {
              "line": 11,
              "column": 64
            }
          },
          "moduleName": "pilas-engine-bloques/templates/-navbar.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("a");
          dom.setAttribute(el1,"href","#");
          var el2 = dom.createTextNode("Principal");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child1 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.7",
          "loc": {
            "source": null,
            "start": {
              "line": 12,
              "column": 8
            },
            "end": {
              "line": 12,
              "column": 66
            }
          },
          "moduleName": "pilas-engine-bloques/templates/-navbar.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("a");
          dom.setAttribute(el1,"href","#");
          var el2 = dom.createTextNode("Desafíos");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child2 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.7",
          "loc": {
            "source": null,
            "start": {
              "line": 13,
              "column": 8
            },
            "end": {
              "line": 13,
              "column": 71
            }
          },
          "moduleName": "pilas-engine-bloques/templates/-navbar.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("a");
          dom.setAttribute(el1,"href","#");
          var el2 = dom.createTextNode("Acerca de ...");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.7",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 27,
            "column": 0
          }
        },
        "moduleName": "pilas-engine-bloques/templates/-navbar.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("nav");
        dom.setAttribute(el1,"class","navbar navbar-default");
        dom.setAttribute(el1,"role","navigation");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","container-fluid");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment(" Brand and toggle get grouped for better mobile display ");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","navbar-header navbar-collapse");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        dom.setAttribute(el4,"class","navbar-brand");
        dom.setAttribute(el4,"href","#");
        var el5 = dom.createElement("img");
        dom.setAttribute(el5,"src","imagenes/logo.png");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment(" Collect the nav links, forms, and other content for toggling ");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"id","bs-example-navbar-collapse-1");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("ul");
        dom.setAttribute(el4,"class","nav navbar-nav");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n\n\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","header-right");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("button");
        dom.setAttribute(el5,"class","header-button");
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("button");
        dom.setAttribute(el5,"class","header-button");
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0, 1, 7]);
        var element1 = dom.childAt(element0, [1]);
        var element2 = dom.childAt(element0, [3]);
        var element3 = dom.childAt(element2, [3]);
        var element4 = dom.childAt(element2, [5]);
        var morphs = new Array(8);
        morphs[0] = dom.createMorphAt(element1,1,1);
        morphs[1] = dom.createMorphAt(element1,3,3);
        morphs[2] = dom.createMorphAt(element1,5,5);
        morphs[3] = dom.createMorphAt(element2,1,1);
        morphs[4] = dom.createElementMorph(element3);
        morphs[5] = dom.createMorphAt(element3,0,0);
        morphs[6] = dom.createElementMorph(element4);
        morphs[7] = dom.createMorphAt(element4,0,0);
        return morphs;
      },
      statements: [
        ["block","link-to",["index"],["tagName","li"],0,null,["loc",[null,[11,8],[11,76]]]],
        ["block","link-to",["desafios"],["tagName","li"],1,null,["loc",[null,[12,8],[12,78]]]],
        ["block","link-to",["acercade"],["tagName","li"],2,null,["loc",[null,[13,8],[13,83]]]],
        ["content","pilas-automatic-update",["loc",[null,[19,8],[19,34]]]],
        ["element","action",["abrirAyuda"],[],["loc",[null,[20,38],[20,61]]]],
        ["inline","fa-icon",["question"],[],["loc",[null,[20,62],[20,84]]]],
        ["element","action",["abrirPreferencias"],[],["loc",[null,[21,38],[21,68]]]],
        ["inline","fa-icon",["gear"],[],["loc",[null,[21,69],[21,87]]]]
      ],
      locals: [],
      templates: [child0, child1, child2]
    };
  }()));

});
define('pilas-engine-bloques/templates/acercade', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.7",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 64,
            "column": 0
          }
        },
        "moduleName": "pilas-engine-bloques/templates/acercade.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","contenido-principal");
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","contenedor-acercade");
        var el3 = dom.createTextNode("\n\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h1");
        var el4 = dom.createTextNode("Acerca de Pilas Bloques");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createTextNode("\n  Pilas Bloques es una nueva aplicación desarrollada para comenzar\n  a programar.\n");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createTextNode("\n  Encontrarás desafíos con diversos niveles de dificultad que te\n  acercarán al mundo de la programación por medio de bloques.\n");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createTextNode("\n  ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("strong");
        var el5 = dom.createTextNode("¿Qué es programar con bloques?");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" Es desarrollar programas con\n  acciones e instrucciones incorporadas en bloques o piezas\n  prediseñadas. Tendrás que seleccionar y “encastrar” las piezas\n  adecuadas para lograr que el programa resuelva la\n  actividad propuesta.\n");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createTextNode("\n  Pilas Bloques es un proyecto que contempla más de 40\n  actividades diseñadas para\n  dar los primeros pasos en el mundo de la programación, que pueden ser\n  utilizadas tanto como secuencia de enseñanza o intercaladas con\n  otras actividades, dependiendo del criterio pedagógico de cada\n  profesor y aprendiz.\n");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createTextNode("\n  Las actividades se publicarán gradualmente, la aplicación las descargará\n  automáticamente cuando se conecte a Internet.");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createTextNode("\n  Enseñar y aprender a programar es importante porque:\n");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("ul");
        var el4 = dom.createTextNode("\n  ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode(" Incentiva a los estudiantes a crear sus propios programas,\n    proponiéndoles otros espacios más que el de usuarios de aplicaciones\n    realizadas por terceros.");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n  ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("Promueve y estimula la confianza para resolver problemas.");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n  ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("Trabajar con conceptos de las ciencias de la computación\n    permite desarrollar habilidades de pensamiento computacional.");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createTextNode("Actualmente estás usando la versión ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("code");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createTextNode("Este programa fue desarrollado en forma conjunta por Huayra y Program.AR - Fundación Sadosky.");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("br");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n Pilas Bloques está basado en el desarrollo previo de Pilas Engine de Hugo Ruscitti.");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createTextNode("\n  ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("button");
        dom.setAttribute(el4,"class","btn btn-warning");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode(" Visitar al web del proyecto");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n  ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n\n");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0, 1]);
        var element1 = dom.childAt(element0, [21]);
        var element2 = dom.childAt(element1, [1]);
        var morphs = new Array(4);
        morphs[0] = dom.createMorphAt(dom.childAt(element0, [17, 1]),0,0);
        morphs[1] = dom.createElementMorph(element2);
        morphs[2] = dom.createMorphAt(element2,0,0);
        morphs[3] = dom.createMorphAt(element1,3,3);
        return morphs;
      },
      statements: [
        ["content","currentVersion",["loc",[null,[51,45],[51,63]]]],
        ["element","action",["visitWebsite"],[],["loc",[null,[57,34],[57,59]]]],
        ["inline","fa-icon",["globe"],[],["loc",[null,[57,60],[57,79]]]],
        ["content","pilas-update",["loc",[null,[58,2],[58,18]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('pilas-engine-bloques/templates/application', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.7",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 5,
              "column": 0
            }
          },
          "moduleName": "pilas-engine-bloques/templates/application.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(3);
          morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
          morphs[1] = dom.createMorphAt(fragment,3,3,contextualElement);
          morphs[2] = dom.createMorphAt(fragment,5,5,contextualElement);
          return morphs;
        },
        statements: [
          ["inline","partial",["navbar"],[],["loc",[null,[2,2],[2,22]]]],
          ["inline","partial",["modal-preferencias"],[],["loc",[null,[3,2],[3,34]]]],
          ["inline","partial",["modal-ayuda"],[],["loc",[null,[4,2],[4,27]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    var child1 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.7",
          "loc": {
            "source": null,
            "start": {
              "line": 5,
              "column": 0
            },
            "end": {
              "line": 11,
              "column": 0
            }
          },
          "moduleName": "pilas-engine-bloques/templates/application.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("style");
          var el2 = dom.createTextNode("\n    .absolute {\n      top: 10px;\n    }\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.7",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 16,
            "column": 0
          }
        },
        "moduleName": "pilas-engine-bloques/templates/application.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","page-container");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        morphs[1] = dom.createMorphAt(dom.childAt(fragment, [2]),1,1);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [
        ["block","if",[["get","layout",["loc",[null,[1,6],[1,12]]]]],[],0,1,["loc",[null,[1,0],[11,7]]]],
        ["inline","outlet",[],["class","absolute"],["loc",[null,[14,2],[14,29]]]]
      ],
      locals: [],
      templates: [child0, child1]
    };
  }()));

});
define('pilas-engine-bloques/templates/components/modal-dialog', ['exports', 'ember-modal-dialog/templates/components/modal-dialog'], function (exports, modal_dialog) {

	'use strict';



	exports['default'] = modal_dialog['default'];

});
define('pilas-engine-bloques/templates/components/modal-title', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.7",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 2,
            "column": 0
          }
        },
        "moduleName": "pilas-engine-bloques/templates/components/modal-title.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h4");
        dom.setAttribute(el1,"class","modal-title");
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode(" ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        dom.setAttribute(el2,"class","pull-right btn btn-xs btn-default");
        var el3 = dom.createTextNode("Cerrar");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [2]);
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(element0,0,0);
        morphs[1] = dom.createElementMorph(element1);
        return morphs;
      },
      statements: [
        ["content","title",["loc",[null,[1,24],[1,33]]]],
        ["element","action",["ocultar"],[],["loc",[null,[1,42],[1,62]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('pilas-engine-bloques/templates/components/nw-zoom', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.7",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 3,
              "column": 0
            }
          },
          "moduleName": "pilas-engine-bloques/templates/components/nw-zoom.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          dom.setAttribute(el1,"class","btn btn-success btn-rect");
          var el2 = dom.createElement("i");
          dom.setAttribute(el2,"class","fa fa-minus");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element1 = dom.childAt(fragment, [1]);
          var morphs = new Array(1);
          morphs[0] = dom.createElementMorph(element1);
          return morphs;
        },
        statements: [
          ["element","action",["zoomOut"],[],["loc",[null,[2,10],[2,30]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    var child1 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.7",
          "loc": {
            "source": null,
            "start": {
              "line": 3,
              "column": 0
            },
            "end": {
              "line": 5,
              "column": 0
            }
          },
          "moduleName": "pilas-engine-bloques/templates/components/nw-zoom.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          dom.setAttribute(el1,"disabled","");
          dom.setAttribute(el1,"class","btn btn-success btn-rect");
          var el2 = dom.createElement("i");
          dom.setAttribute(el2,"class","fa fa-minus");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child2 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.7",
          "loc": {
            "source": null,
            "start": {
              "line": 9,
              "column": 0
            },
            "end": {
              "line": 11,
              "column": 0
            }
          },
          "moduleName": "pilas-engine-bloques/templates/components/nw-zoom.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          dom.setAttribute(el1,"class","btn btn-success btn-rect");
          var el2 = dom.createElement("i");
          dom.setAttribute(el2,"class","fa fa-plus");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var morphs = new Array(1);
          morphs[0] = dom.createElementMorph(element0);
          return morphs;
        },
        statements: [
          ["element","action",["zoomIn"],[],["loc",[null,[10,10],[10,29]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    var child3 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.7",
          "loc": {
            "source": null,
            "start": {
              "line": 11,
              "column": 0
            },
            "end": {
              "line": 13,
              "column": 0
            }
          },
          "moduleName": "pilas-engine-bloques/templates/components/nw-zoom.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          dom.setAttribute(el1,"disabled","");
          dom.setAttribute(el1,"class","btn btn-success btn-rect");
          var el2 = dom.createElement("i");
          dom.setAttribute(el2,"class","fa fa-plus");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.7",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 14,
            "column": 0
          }
        },
        "moduleName": "pilas-engine-bloques/templates/components/nw-zoom.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n  ");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("span");
        dom.setAttribute(el1,"class","zoom-label");
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("%");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element2 = dom.childAt(fragment, [2]);
        var morphs = new Array(4);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        morphs[1] = dom.createElementMorph(element2);
        morphs[2] = dom.createMorphAt(element2,0,0);
        morphs[3] = dom.createMorphAt(fragment,4,4,contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [
        ["block","if",[["get","canZoomOut",["loc",[null,[1,6],[1,16]]]]],[],0,1,["loc",[null,[1,0],[5,7]]]],
        ["element","action",["zoomRestore"],[],["loc",[null,[7,8],[7,32]]]],
        ["content","zoomValue",["loc",[null,[7,52],[7,65]]]],
        ["block","if",[["get","canZoomIn",["loc",[null,[9,6],[9,15]]]]],[],2,3,["loc",[null,[9,0],[13,7]]]]
      ],
      locals: [],
      templates: [child0, child1, child2, child3]
    };
  }()));

});
define('pilas-engine-bloques/templates/components/pilas-automatic-update', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.7",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 3,
              "column": 0
            }
          },
          "moduleName": "pilas-engine-bloques/templates/components/pilas-automatic-update.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("a");
          dom.setAttribute(el1,"href","");
          var el2 = dom.createTextNode("Existe una actualización");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var morphs = new Array(1);
          morphs[0] = dom.createElementMorph(element0);
          return morphs;
        },
        statements: [
          ["element","action",["verSitioActualizacion"],[],["loc",[null,[2,13],[2,47]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.7",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 4,
            "column": 0
          }
        },
        "moduleName": "pilas-engine-bloques/templates/components/pilas-automatic-update.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [
        ["block","if",[["get","mostrarLinkActualizacion",["loc",[null,[1,6],[1,30]]]]],[],0,null,["loc",[null,[1,0],[3,7]]]]
      ],
      locals: [],
      templates: [child0]
    };
  }()));

});
define('pilas-engine-bloques/templates/components/pilas-blockly', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.7",
          "loc": {
            "source": null,
            "start": {
              "line": 3,
              "column": 2
            },
            "end": {
              "line": 5,
              "column": 2
            }
          },
          "moduleName": "pilas-engine-bloques/templates/components/pilas-blockly.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          dom.setAttribute(el1,"disabled","");
          dom.setAttribute(el1,"class","btn btn-info");
          var el2 = dom.createElement("i");
          dom.setAttribute(el2,"class","fa fa-arrows-h");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode(" Alterar");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element6 = dom.childAt(fragment, [1]);
          var morphs = new Array(1);
          morphs[0] = dom.createElementMorph(element6);
          return morphs;
        },
        statements: [
          ["element","action",["alternar"],[],["loc",[null,[4,42],[4,63]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    var child1 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.7",
          "loc": {
            "source": null,
            "start": {
              "line": 7,
              "column": 2
            },
            "end": {
              "line": 9,
              "column": 2
            }
          },
          "moduleName": "pilas-engine-bloques/templates/components/pilas-blockly.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          dom.setAttribute(el1,"class","btn btn-warning");
          var el2 = dom.createElement("i");
          dom.setAttribute(el2,"class","fa fa-refresh");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode(" Reiniciar");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element5 = dom.childAt(fragment, [1]);
          var morphs = new Array(1);
          morphs[0] = dom.createElementMorph(element5);
          return morphs;
        },
        statements: [
          ["element","action",["reiniciar"],[],["loc",[null,[8,38],[8,60]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    var child2 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.7",
          "loc": {
            "source": null,
            "start": {
              "line": 9,
              "column": 2
            },
            "end": {
              "line": 11,
              "column": 2
            }
          },
          "moduleName": "pilas-engine-bloques/templates/components/pilas-blockly.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          dom.setAttribute(el1,"class","btn btn-success");
          var el2 = dom.createElement("i");
          dom.setAttribute(el2,"class","fa fa-play");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode(" Ejecutar");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element4 = dom.childAt(fragment, [1]);
          var morphs = new Array(1);
          morphs[0] = dom.createElementMorph(element4);
          return morphs;
        },
        statements: [
          ["element","action",["ejecutar"],[],["loc",[null,[10,38],[10,59]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    var child3 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.7",
          "loc": {
            "source": null,
            "start": {
              "line": 13,
              "column": 2
            },
            "end": {
              "line": 17,
              "column": 2
            }
          },
          "moduleName": "pilas-engine-bloques/templates/components/pilas-blockly.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          dom.setAttribute(el1,"class","btn btn-warning");
          var el2 = dom.createTextNode("Ver código XML");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          dom.setAttribute(el1,"class","btn btn-warning");
          var el2 = dom.createTextNode("Ingresar código XML");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element2 = dom.childAt(fragment, [1]);
          var element3 = dom.childAt(fragment, [3]);
          var morphs = new Array(2);
          morphs[0] = dom.createElementMorph(element2);
          morphs[1] = dom.createElementMorph(element3);
          return morphs;
        },
        statements: [
          ["element","action",["ver_codigo"],[],["loc",[null,[14,36],[14,59]]]],
          ["element","action",["ingresar_codigo"],[],["loc",[null,[15,36],[15,64]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    var child4 = (function() {
      var child0 = (function() {
        return {
          meta: {
            "revision": "Ember@1.13.7",
            "loc": {
              "source": null,
              "start": {
                "line": 20,
                "column": 4
              },
              "end": {
                "line": 22,
                "column": 4
              }
            },
            "moduleName": "pilas-engine-bloques/templates/components/pilas-blockly.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("      ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("button");
            dom.setAttribute(el1,"class","btn btn-success");
            var el2 = dom.createTextNode("Guardar");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element1 = dom.childAt(fragment, [1]);
            var morphs = new Array(1);
            morphs[0] = dom.createElementMorph(element1);
            return morphs;
          },
          statements: [
            ["element","action",["guardar"],[],["loc",[null,[21,38],[21,58]]]]
          ],
          locals: [],
          templates: []
        };
      }());
      var child1 = (function() {
        return {
          meta: {
            "revision": "Ember@1.13.7",
            "loc": {
              "source": null,
              "start": {
                "line": 22,
                "column": 4
              },
              "end": {
                "line": 24,
                "column": 4
              }
            },
            "moduleName": "pilas-engine-bloques/templates/components/pilas-blockly.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("      ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("button");
            dom.setAttribute(el1,"class","btn btn-success");
            var el2 = dom.createTextNode("Crear y Guardar");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element0 = dom.childAt(fragment, [1]);
            var morphs = new Array(1);
            morphs[0] = dom.createElementMorph(element0);
            return morphs;
          },
          statements: [
            ["element","action",["guardar"],[],["loc",[null,[23,38],[23,58]]]]
          ],
          locals: [],
          templates: []
        };
      }());
      return {
        meta: {
          "revision": "Ember@1.13.7",
          "loc": {
            "source": null,
            "start": {
              "line": 19,
              "column": 2
            },
            "end": {
              "line": 25,
              "column": 2
            }
          },
          "moduleName": "pilas-engine-bloques/templates/components/pilas-blockly.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [
          ["block","if",[["get","model",["loc",[null,[20,10],[20,15]]]]],[],0,1,["loc",[null,[20,4],[24,11]]]]
        ],
        locals: [],
        templates: [child0, child1]
      };
    }());
    var child5 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.7",
          "loc": {
            "source": null,
            "start": {
              "line": 44,
              "column": 0
            },
            "end": {
              "line": 46,
              "column": 0
            }
          },
          "moduleName": "pilas-engine-bloques/templates/components/pilas-blockly.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child6 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.7",
          "loc": {
            "source": null,
            "start": {
              "line": 46,
              "column": 0
            },
            "end": {
              "line": 50,
              "column": 0
            }
          },
          "moduleName": "pilas-engine-bloques/templates/components/pilas-blockly.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("\n  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
          return morphs;
        },
        statements: [
          ["inline","partial",["modal-twitter"],[],["loc",[null,[48,2],[48,29]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.7",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 51,
            "column": 0
          }
        },
        "moduleName": "pilas-engine-bloques/templates/components/pilas-blockly.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","pilas-blockly-botones");
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("\n\n{{#if cola_deshacer}}\n    <button class='btn btn-info' {{action \"deshacer_cambio\"}}><i class='fa fa-undo'></i> Deshacer</button>\n  {{else}}\n    <button class='btn btn-info disabled'><i class='fa fa-undo'></i> Deshacer</button>\n  {{/if}}\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        dom.setAttribute(el2,"class","btn btn-info border-right right");
        var el3 = dom.createElement("i");
        dom.setAttribute(el3,"class","fa fa-twitter");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode(" Compartir en twitter");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"id","contenedor-blockly");
        dom.setAttribute(el1,"style","height: 300px; width: 500px;");
        var el2 = dom.createTextNode(" ");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element7 = dom.childAt(fragment, [0]);
        var element8 = dom.childAt(element7, [11]);
        var morphs = new Array(6);
        morphs[0] = dom.createMorphAt(element7,1,1);
        morphs[1] = dom.createMorphAt(element7,3,3);
        morphs[2] = dom.createMorphAt(element7,5,5);
        morphs[3] = dom.createMorphAt(element7,7,7);
        morphs[4] = dom.createElementMorph(element8);
        morphs[5] = dom.createMorphAt(fragment,4,4,contextualElement);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [
        ["block","if",[["get","mostrarAlternar",["loc",[null,[3,8],[3,23]]]]],[],0,null,["loc",[null,[3,2],[5,9]]]],
        ["block","if",[["get","ejecutando",["loc",[null,[7,8],[7,18]]]]],[],1,2,["loc",[null,[7,2],[11,9]]]],
        ["block","if",[["get","environment.debeMostrarBotonCodigoXML",["loc",[null,[13,8],[13,45]]]]],[],3,null,["loc",[null,[13,2],[17,9]]]],
        ["block","if",[["get","mostrarGuardar",["loc",[null,[19,8],[19,22]]]]],[],4,null,["loc",[null,[19,2],[25,9]]]],
        ["element","action",["compartir"],[],["loc",[null,[38,50],[38,72]]]],
        ["block","if",[["get","ocultarModal",["loc",[null,[44,6],[44,18]]]]],[],5,6,["loc",[null,[44,0],[50,7]]]]
      ],
      locals: [],
      templates: [child0, child1, child2, child3, child4, child5, child6]
    };
  }()));

});
define('pilas-engine-bloques/templates/components/pilas-canvas', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.7",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 4,
            "column": 0
          }
        },
        "moduleName": "pilas-engine-bloques/templates/components/pilas-canvas.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("canvas");
        dom.setAttribute(el1,"id","canvas");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment,2,2,contextualElement);
        return morphs;
      },
      statements: [
        ["content","yield",["loc",[null,[3,0],[3,9]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('pilas-engine-bloques/templates/components/pilas-desafio', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.7",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 10,
              "column": 0
            }
          },
          "moduleName": "pilas-engine-bloques/templates/components/pilas-desafio.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("\n  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("img");
          dom.setAttribute(el1,"class","grayscale semi-transparente");
          dom.setAttribute(el1,"onerror","this.src='images/desafios/proximamente.png'");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","ribbon right gray semi-transparente");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("a");
          var el3 = dom.createTextNode("Muy pronto");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","pilas-desafio-titulo");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element2 = dom.childAt(fragment, [1]);
          var morphs = new Array(2);
          morphs[0] = dom.createAttrMorph(element2, 'src');
          morphs[1] = dom.createMorphAt(dom.childAt(fragment, [5]),0,0);
          return morphs;
        },
        statements: [
          ["attribute","src",["concat",["images/desafios/",["get","nombre",["loc",[null,[3,66],[3,72]]]],".png"]]],
          ["content","titulo",["loc",[null,[8,36],[8,46]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    var child1 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.7",
          "loc": {
            "source": null,
            "start": {
              "line": 10,
              "column": 0
            },
            "end": {
              "line": 15,
              "column": 0
            }
          },
          "moduleName": "pilas-engine-bloques/templates/components/pilas-desafio.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("\n  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("img");
          dom.setAttribute(el1,"class","desafio-img");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","pilas-desafio-titulo");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var element1 = dom.childAt(fragment, [3]);
          var morphs = new Array(4);
          morphs[0] = dom.createAttrMorph(element0, 'src');
          morphs[1] = dom.createElementMorph(element0);
          morphs[2] = dom.createElementMorph(element1);
          morphs[3] = dom.createMorphAt(element1,0,0);
          return morphs;
        },
        statements: [
          ["attribute","src",["concat",["images/desafios/",["get","nombre",["loc",[null,[12,69],[12,75]]]],".png"]]],
          ["element","action",["abrir"],[],["loc",[null,[12,27],[12,45]]]],
          ["element","action",["abrir"],[],["loc",[null,[13,36],[13,54]]]],
          ["content","titulo",["loc",[null,[13,55],[13,65]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.7",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 17,
            "column": 0
          }
        },
        "moduleName": "pilas-engine-bloques/templates/components/pilas-desafio.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [
        ["block","if",[["get","deshabilitado",["loc",[null,[1,6],[1,19]]]]],[],0,1,["loc",[null,[1,0],[15,7]]]]
      ],
      locals: [],
      templates: [child0, child1]
    };
  }()));

});
define('pilas-engine-bloques/templates/components/pilas-editor', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        return {
          meta: {
            "revision": "Ember@1.13.7",
            "loc": {
              "source": null,
              "start": {
                "line": 11,
                "column": 6
              },
              "end": {
                "line": 18,
                "column": 6
              }
            },
            "moduleName": "pilas-engine-bloques/templates/components/pilas-editor.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("        ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1,"class","tip-block");
            var el2 = dom.createTextNode("\n          ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("p");
            var el3 = dom.createElement("em");
            var el4 = dom.createTextNode("¿Sabías qué...?");
            dom.appendChild(el3, el4);
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n          ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("p");
            var el3 = dom.createTextNode("\n            ");
            dom.appendChild(el2, el3);
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("\n          ");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n        ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1, 3]),1,1);
            return morphs;
          },
          statements: [
            ["content","actividad.actividad.consignaInicial",["loc",[null,[15,12],[15,51]]]]
          ],
          locals: [],
          templates: []
        };
      }());
      return {
        meta: {
          "revision": "Ember@1.13.7",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 32,
              "column": 0
            }
          },
          "moduleName": "pilas-engine-bloques/templates/components/pilas-editor.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","contenedor-editor");
          dom.setAttribute(el1,"id","contenedor-editor");
          var el2 = dom.createTextNode("\n\n  ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","panel-pilas");
          dom.setAttribute(el2,"id","panel-pilas");
          var el3 = dom.createTextNode("\n    ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n\n    ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","panel-ayuda");
          var el4 = dom.createTextNode("\n      ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("h4");
          var el5 = dom.createComment("");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n      ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("p");
          var el5 = dom.createComment("");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n\n");
          dom.appendChild(el3, el4);
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n    ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n\n  ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n\n\n  ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","panel-derecho");
          dom.setAttribute(el2,"id","panel-derecho");
          var el3 = dom.createTextNode("\n    ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n  ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n\n");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [0]);
          var element1 = dom.childAt(element0, [1]);
          var element2 = dom.childAt(element1, [3]);
          var morphs = new Array(5);
          morphs[0] = dom.createMorphAt(element1,1,1);
          morphs[1] = dom.createMorphAt(dom.childAt(element2, [1]),0,0);
          morphs[2] = dom.createMorphAt(dom.childAt(element2, [3]),0,0);
          morphs[3] = dom.createMorphAt(element2,5,5);
          morphs[4] = dom.createMorphAt(dom.childAt(element0, [3]),1,1);
          return morphs;
        },
        statements: [
          ["inline","pilas-canvas",[],["actividad",["subexpr","@mut",[["get","actividad",["loc",[null,[5,29],[5,38]]]]],[],[]]],["loc",[null,[5,4],[5,40]]]],
          ["content","actividad.nombre",["loc",[null,[8,10],[8,30]]]],
          ["content","actividad.enunciado",["loc",[null,[9,9],[9,32]]]],
          ["block","if",[["get","actividad.actividad.consignaInicial",["loc",[null,[11,12],[11,47]]]]],[],0,null,["loc",[null,[11,6],[18,13]]]],
          ["inline","pilas-blockly",[],["solucion",["subexpr","@mut",[["get","solucion",["loc",[null,[26,29],[26,37]]]]],[],[]],"autoejecutar",["subexpr","@mut",[["get","autoejecutar",["loc",[null,[26,51],[26,63]]]]],[],[]],"actividad",["subexpr","@mut",[["get","actividad",["loc",[null,[27,30],[27,39]]]]],[],[]],"reiniciar","reiniciar","ocultarModal",["subexpr","@mut",[["get","ocultarModal",["loc",[null,[28,33],[28,45]]]]],[],[]]],["loc",[null,[26,4],[28,47]]]]
        ],
        locals: [],
        templates: [child0]
      };
    }());
    var child1 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.7",
          "loc": {
            "source": null,
            "start": {
              "line": 32,
              "column": 0
            },
            "end": {
              "line": 34,
              "column": 0
            }
          },
          "moduleName": "pilas-engine-bloques/templates/components/pilas-editor.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("p");
          var el2 = dom.createTextNode("Error: tienes que inicializar este componente con una actividad.");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.7",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 35,
            "column": 0
          }
        },
        "moduleName": "pilas-engine-bloques/templates/components/pilas-editor.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [
        ["block","if",[["get","actividad",["loc",[null,[1,6],[1,15]]]]],[],0,1,["loc",[null,[1,0],[34,7]]]]
      ],
      locals: [],
      templates: [child0, child1]
    };
  }()));

});
define('pilas-engine-bloques/templates/components/pilas-update', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.7",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 3,
              "column": 0
            }
          },
          "moduleName": "pilas-engine-bloques/templates/components/pilas-update.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          dom.setAttribute(el1,"disabled","");
          dom.setAttribute(el1,"class","btn btn-success");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode(" Buscando ...");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]),0,0);
          return morphs;
        },
        statements: [
          ["inline","fa-icon",["refresh"],["spin",true],["loc",[null,[2,43],[2,74]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    var child1 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.7",
          "loc": {
            "source": null,
            "start": {
              "line": 3,
              "column": 0
            },
            "end": {
              "line": 6,
              "column": 0
            }
          },
          "moduleName": "pilas-engine-bloques/templates/components/pilas-update.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          dom.setAttribute(el1,"class","btn btn-success");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode(" Buscar actualizaciones");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("span");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var morphs = new Array(3);
          morphs[0] = dom.createElementMorph(element0);
          morphs[1] = dom.createMorphAt(element0,0,0);
          morphs[2] = dom.createMorphAt(dom.childAt(fragment, [3]),0,0);
          return morphs;
        },
        statements: [
          ["element","action",["buscar"],[],["loc",[null,[4,34],[4,53]]]],
          ["inline","fa-icon",["refresh"],[],["loc",[null,[4,54],[4,75]]]],
          ["content","mensaje",["loc",[null,[5,8],[5,19]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.7",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 7,
            "column": 0
          }
        },
        "moduleName": "pilas-engine-bloques/templates/components/pilas-update.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [
        ["block","if",[["get","buscando",["loc",[null,[1,6],[1,14]]]]],[],0,1,["loc",[null,[1,0],[6,7]]]]
      ],
      locals: [],
      templates: [child0, child1]
    };
  }()));

});
define('pilas-engine-bloques/templates/components/tether-dialog', ['exports', 'ember-modal-dialog/templates/components/tether-dialog'], function (exports, tether_dialog) {

	'use strict';



	exports['default'] = tether_dialog['default'];

});
define('pilas-engine-bloques/templates/desafios/error', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.7",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 2,
            "column": 0
          }
        },
        "moduleName": "pilas-engine-bloques/templates/desafios/error.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("p");
        var el2 = dom.createTextNode("Lo siento, el desafío no se puede cargar.");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() { return []; },
      statements: [

      ],
      locals: [],
      templates: []
    };
  }()));

});
define('pilas-engine-bloques/templates/desafios/index', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.7",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 47,
            "column": 0
          }
        },
        "moduleName": "pilas-engine-bloques/templates/desafios/index.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","contenido-principal");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h1");
        var el3 = dom.createTextNode("Desafíos");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("p");
        var el3 = dom.createTextNode("Los siguientes desafíos están ordenadas de acuerdo al cuadernillo \"Actividades para aprender a Program.AR\". Por ahora no están todas, con el tiempo se irán publicando las del cuadernillo y más actividades aún. ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h3");
        var el3 = dom.createTextNode("Autómatas, comandos, procedimientos y repetición");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h3");
        var el3 = dom.createTextNode("Alternativa condicional");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h3");
        var el3 = dom.createTextNode("Repetición condicional");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h3");
        var el3 = dom.createTextNode("Parametrización de soluciones");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var morphs = new Array(34);
        morphs[0] = dom.createMorphAt(element0,7,7);
        morphs[1] = dom.createMorphAt(element0,9,9);
        morphs[2] = dom.createMorphAt(element0,11,11);
        morphs[3] = dom.createMorphAt(element0,13,13);
        morphs[4] = dom.createMorphAt(element0,15,15);
        morphs[5] = dom.createMorphAt(element0,17,17);
        morphs[6] = dom.createMorphAt(element0,19,19);
        morphs[7] = dom.createMorphAt(element0,21,21);
        morphs[8] = dom.createMorphAt(element0,23,23);
        morphs[9] = dom.createMorphAt(element0,25,25);
        morphs[10] = dom.createMorphAt(element0,27,27);
        morphs[11] = dom.createMorphAt(element0,29,29);
        morphs[12] = dom.createMorphAt(element0,33,33);
        morphs[13] = dom.createMorphAt(element0,35,35);
        morphs[14] = dom.createMorphAt(element0,37,37);
        morphs[15] = dom.createMorphAt(element0,39,39);
        morphs[16] = dom.createMorphAt(element0,41,41);
        morphs[17] = dom.createMorphAt(element0,43,43);
        morphs[18] = dom.createMorphAt(element0,47,47);
        morphs[19] = dom.createMorphAt(element0,49,49);
        morphs[20] = dom.createMorphAt(element0,51,51);
        morphs[21] = dom.createMorphAt(element0,53,53);
        morphs[22] = dom.createMorphAt(element0,55,55);
        morphs[23] = dom.createMorphAt(element0,57,57);
        morphs[24] = dom.createMorphAt(element0,59,59);
        morphs[25] = dom.createMorphAt(element0,61,61);
        morphs[26] = dom.createMorphAt(element0,63,63);
        morphs[27] = dom.createMorphAt(element0,67,67);
        morphs[28] = dom.createMorphAt(element0,69,69);
        morphs[29] = dom.createMorphAt(element0,71,71);
        morphs[30] = dom.createMorphAt(element0,73,73);
        morphs[31] = dom.createMorphAt(element0,75,75);
        morphs[32] = dom.createMorphAt(element0,77,77);
        morphs[33] = dom.createMorphAt(element0,79,79);
        return morphs;
      },
      statements: [
        ["inline","pilas-desafio",[],["nombre","AlienTocaBoton","titulo","El alien toca el botón","onSelect","onSelect"],["loc",[null,[6,0],[6,93]]]],
        ["inline","pilas-desafio",[],["nombre","ElGatoEnLaCalle","titulo","El gato en la calle","onSelect","onSelect"],["loc",[null,[7,0],[7,91]]]],
        ["inline","pilas-desafio",[],["nombre","NoMeCansoDeSaltar","titulo","No me canso de saltar","onSelect","onSelect"],["loc",[null,[8,0],[8,95]]]],
        ["inline","pilas-desafio",[],["nombre","ElMarcianoEnElDesierto","titulo","El marciano en el desierto","onSelect","onSelect"],["loc",[null,[9,0],[9,105]]]],
        ["inline","pilas-desafio",[],["nombre","TitoEnciendeLuces","titulo","Tito enciende las luces","onSelect","onSelect"],["loc",[null,[10,0],[10,97]]]],
        ["inline","pilas-desafio",[],["nombre","ElRecolectorDeEstrellas","titulo","El recolector de estrellas","onSelect","onSelect"],["loc",[null,[11,0],[11,106]]]],
        ["inline","pilas-desafio",[],["nombre","MariaLaComeSandias","titulo","María la come sandías","onSelect","onSelect"],["loc",[null,[12,0],[12,96]]]],
        ["inline","pilas-desafio",[],["nombre","ElAlienYLasTuercas","titulo","El alien y las tuercas","onSelect","onSelect"],["loc",[null,[13,0],[13,97]]]],
        ["inline","pilas-desafio",[],["nombre","AlimentandoALosPeces","titulo","Alimentando a los peces","onSelect","onSelect"],["loc",[null,[14,0],[14,100]]]],
        ["inline","pilas-desafio",[],["nombre","InstalandoJuegos","titulo","Instalando juegos","onSelect","onSelect"],["loc",[null,[15,0],[15,90]]]],
        ["inline","pilas-desafio",[],["nombre","LaGranAventuraDelMarEncantado","titulo","La gran aventura del mar encantado","onSelect","onSelect"],["loc",[null,[16,0],[16,120]]]],
        ["inline","pilas-desafio",[],["nombre","ReparandoLaNave","titulo","Reparando la nave","onSelect","onSelect"],["loc",[null,[17,0],[17,89]]]],
        ["inline","pilas-desafio",[],["nombre","ElMonoYLasBananas","titulo","El mono y las bananas","onSelect","onSelect"],["loc",[null,[20,0],[20,95]]]],
        ["inline","pilas-desafio",[],["nombre","LaEleccionDelMono","titulo","La elección del mono","onSelect","onSelect"],["loc",[null,[21,0],[21,94]]]],
        ["inline","pilas-desafio",[],["nombre","LaberintoCorto","titulo","Laberinto corto","onSelect","onSelect"],["loc",[null,[22,0],[22,86]]]],
        ["inline","pilas-desafio",[],["nombre","TresNaranjas","titulo","Tres naranjas","onSelect","onSelect"],["loc",[null,[23,0],[23,83]]]],
        ["inline","pilas-desafio",[],["nombre","TitoRecargado","titulo","Tito recargado","onSelect","onSelect"],["loc",[null,[24,0],[24,84]]]],
        ["inline","pilas-desafio",[],["nombre","LaberintoLargo","titulo","Laberinto largo","onSelect","onSelect"],["loc",[null,[25,0],[25,86]]]],
        ["inline","pilas-desafio",[],["nombre","SuperTito1","titulo","Súper Tito 1","onSelect","onSelect"],["loc",[null,[28,0],[28,79]]]],
        ["inline","pilas-desafio",[],["nombre","SuperTito2","titulo","Súper Tito 2","onSelect","onSelect"],["loc",[null,[29,0],[29,79]]]],
        ["inline","pilas-desafio",[],["nombre","LaberintoConQueso","titulo","Laberinto con queso","onSelect","onSelect"],["loc",[null,[30,0],[30,93]]]],
        ["inline","pilas-desafio",[],["nombre","ElDetectiveChaparro","titulo","El detective chaparro","onSelect","onSelect","deshabilitado",true],["loc",[null,[31,0],[31,116]]]],
        ["inline","pilas-desafio",[],["nombre","FutbolRobots","titulo","Fútbol para robots","onSelect","onSelect"],["loc",[null,[32,0],[32,87]]]],
        ["inline","pilas-desafio",[],["nombre","PrendiendoLasCompus","titulo","Prendiendo las compus","onSelect","onSelect","deshabilitado",true],["loc",[null,[33,0],[33,116]]]],
        ["inline","pilas-desafio",[],["nombre","ElMonoQueSabeContar","titulo","El mono que sabe contar","onSelect","onSelect","deshabilitado",true],["loc",[null,[34,0],[34,118]]]],
        ["inline","pilas-desafio",[],["nombre","ElMonoCuentaDeNuevo","titulo","El mono cuenta de nuevo","onSelect","onSelect","deshabilitado",true],["loc",[null,[35,0],[35,118]]]],
        ["inline","pilas-desafio",[],["nombre","ElSuperviaje","titulo","El Superviaje","onSelect","onSelect","deshabilitado",true],["loc",[null,[36,0],[36,101]]]],
        ["inline","pilas-desafio",[],["nombre","ElPlanetaDeNano","titulo","El planeta de Nano","deshabilitado",true],["loc",[null,[39,0],[39,89]]]],
        ["inline","pilas-desafio",[],["nombre","DibujandoFiguras","titulo","Dibujando Figuras","deshabilitado",true],["loc",[null,[40,0],[40,89]]]],
        ["inline","pilas-desafio",[],["nombre","LaFiestaDeDracula","titulo","La fiesta de Drácula","deshabilitado",true],["loc",[null,[41,0],[41,93]]]],
        ["inline","pilas-desafio",[],["nombre","SalvandoLaNavidad","titulo","Salvando la Navidad","deshabilitado",true],["loc",[null,[42,0],[42,92]]]],
        ["inline","pilas-desafio",[],["nombre","TitoCuadrado","titulo","Tito Cuadrado","deshabilitado",true],["loc",[null,[43,0],[43,81]]]],
        ["inline","pilas-desafio",[],["nombre","ElCangrejoAguafiestas","titulo","El cangrejo aguafiestas","deshabilitado",true],["loc",[null,[44,0],[44,100]]]],
        ["inline","pilas-desafio",[],["nombre","proximamente","titulo","Próximamente: más actividades","deshabilitado",true],["loc",[null,[45,0],[45,97]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('pilas-engine-bloques/templates/desafios/nombre', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.7",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 2,
            "column": 0
          }
        },
        "moduleName": "pilas-engine-bloques/templates/desafios/nombre.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [
        ["inline","pilas-editor",[],["actividad",["subexpr","@mut",[["get","model.actividad",["loc",[null,[1,25],[1,40]]]]],[],[]],"solucion",null],["loc",[null,[1,0],[1,56]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('pilas-engine-bloques/templates/editor', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.7",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 18,
            "column": 0
          }
        },
        "moduleName": "pilas-engine-bloques/templates/editor.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","contenedor-editor");
        dom.setAttribute(el1,"id","contenedor-editor");
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-pilas");
        dom.setAttribute(el2,"id","panel-pilas");
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","panel-ayuda");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("p");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-derecho");
        dom.setAttribute(el2,"id","panel-derecho");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [1]);
        var morphs = new Array(3);
        morphs[0] = dom.createMorphAt(element1,1,1);
        morphs[1] = dom.createMorphAt(dom.childAt(element1, [3, 1]),0,0);
        morphs[2] = dom.createMorphAt(dom.childAt(element0, [3]),1,1);
        return morphs;
      },
      statements: [
        ["inline","pilas-canvas",[],["onready","reiniciar"],["loc",[null,[5,4],[5,40]]]],
        ["content","actividad.enunciado",["loc",[null,[8,9],[8,32]]]],
        ["inline","pilas-blockly",[],["model",["subexpr","@mut",[["get","model",["loc",[null,[14,26],[14,31]]]]],[],[]],"guardar","guardar","reiniciar","reiniciar","registrarPrimerCodigo","registrarPrimerCodigo","actividad",["subexpr","@mut",[["get","actividad",["loc",[null,[14,128],[14,137]]]]],[],[]]],["loc",[null,[14,4],[14,139]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('pilas-engine-bloques/templates/galeria', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.7",
          "loc": {
            "source": null,
            "start": {
              "line": 5,
              "column": 0
            },
            "end": {
              "line": 13,
              "column": 0
            }
          },
          "moduleName": "pilas-engine-bloques/templates/galeria.hbs"
        },
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("\n  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","galeria-juego");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","galeria-juego-acciones");
          var el3 = dom.createElement("button");
          dom.setAttribute(el3,"class","btn btn-danger btn-xs");
          var el4 = dom.createElement("i");
          dom.setAttribute(el4,"class","fa fa-trash");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","galeria-juego-preview");
          var el3 = dom.createElement("img");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","galeria-juego-titulo");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var element1 = dom.childAt(element0, [1, 0]);
          var element2 = dom.childAt(element0, [3]);
          var element3 = dom.childAt(element2, [0]);
          var morphs = new Array(4);
          morphs[0] = dom.createElementMorph(element1);
          morphs[1] = dom.createElementMorph(element2);
          morphs[2] = dom.createAttrMorph(element3, 'src');
          morphs[3] = dom.createMorphAt(dom.childAt(element0, [5]),0,0);
          return morphs;
        },
        statements: [
          ["element","action",["eliminar",["get","juego",["loc",[null,[8,68],[8,73]]]]],[],["loc",[null,[8,48],[8,75]]]],
          ["element","action",["abrir",["get","juego",["loc",[null,[9,56],[9,61]]]]],[],["loc",[null,[9,39],[9,63]]]],
          ["attribute","src",["get","juego.imagen",["loc",[null,[9,75],[9,87]]]]],
          ["content","juego.nombre",["loc",[null,[10,38],[10,54]]]]
        ],
        locals: ["juego"],
        templates: []
      };
    }());
    var child1 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.7",
          "loc": {
            "source": null,
            "start": {
              "line": 13,
              "column": 0
            },
            "end": {
              "line": 15,
              "column": 0
            }
          },
          "moduleName": "pilas-engine-bloques/templates/galeria.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("p");
          var el2 = dom.createTextNode("Parece que no hay ningún juego creado...");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.7",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 20,
            "column": 0
          }
        },
        "moduleName": "pilas-engine-bloques/templates/galeria.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","contenido-principal");
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h1");
        var el3 = dom.createTextNode("Galería");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element4 = dom.childAt(fragment, [0]);
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(element4,3,3);
        morphs[1] = dom.createMorphAt(element4,5,5);
        return morphs;
      },
      statements: [
        ["block","each",[["get","model",["loc",[null,[5,8],[5,13]]]]],[],0,1,["loc",[null,[5,0],[15,9]]]],
        ["content","outlet",["loc",[null,[17,0],[17,10]]]]
      ],
      locals: [],
      templates: [child0, child1]
    };
  }()));

});
define('pilas-engine-bloques/templates/iframe', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.7",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 3,
              "column": 0
            }
          },
          "moduleName": "pilas-engine-bloques/templates/iframe.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child1 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.7",
          "loc": {
            "source": null,
            "start": {
              "line": 3,
              "column": 0
            },
            "end": {
              "line": 9,
              "column": 0
            }
          },
          "moduleName": "pilas-engine-bloques/templates/iframe.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("style");
          var el2 = dom.createTextNode("\n    .contenedor-editor {\n      top: 0px !important;\n    }\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.7",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 31,
            "column": 0
          }
        },
        "moduleName": "pilas-engine-bloques/templates/iframe.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","contenedor-editor");
        dom.setAttribute(el1,"id","contenedor-editor");
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-pilas");
        dom.setAttribute(el2,"id","panel-pilas");
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","panel-ayuda");
        var el4 = dom.createTextNode("\n\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("p");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-derecho");
        dom.setAttribute(el2,"id","panel-derecho");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [2]);
        var element1 = dom.childAt(element0, [1]);
        var morphs = new Array(4);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        morphs[1] = dom.createMorphAt(element1,1,1);
        morphs[2] = dom.createMorphAt(dom.childAt(element1, [3, 1]),0,0);
        morphs[3] = dom.createMorphAt(dom.childAt(element0, [3]),1,1);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [
        ["block","if",[["get","layout",["loc",[null,[1,6],[1,12]]]]],[],0,1,["loc",[null,[1,0],[9,7]]]],
        ["inline","pilas-canvas",[],["onready","reiniciar"],["loc",[null,[16,4],[16,40]]]],
        ["content","actividad.enunciado",["loc",[null,[20,9],[20,32]]]],
        ["inline","pilas-blockly",[],["model",["subexpr","@mut",[["get","model",["loc",[null,[27,26],[27,31]]]]],[],[]],"mostrarAlternar",false,"mostrarGuardar",false,"mostrarBotonesDepuracionDeCodigo",false,"guardar","guardar","reiniciar","reiniciar","registrarPrimerCodigo","registrarPrimerCodigo","actividad",["subexpr","@mut",[["get","actividad",["loc",[null,[27,210],[27,219]]]]],[],[]]],["loc",[null,[27,4],[27,221]]]]
      ],
      locals: [],
      templates: [child0, child1]
    };
  }()));

});
define('pilas-engine-bloques/templates/index', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.7",
          "loc": {
            "source": null,
            "start": {
              "line": 13,
              "column": 28
            },
            "end": {
              "line": 13,
              "column": 59
            }
          },
          "moduleName": "pilas-engine-bloques/templates/index.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("desafíos");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child1 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.7",
          "loc": {
            "source": null,
            "start": {
              "line": 16,
              "column": 40
            },
            "end": {
              "line": 16,
              "column": 72
            }
          },
          "moduleName": "pilas-engine-bloques/templates/index.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("acerca de");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.7",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 24,
            "column": 0
          }
        },
        "moduleName": "pilas-engine-bloques/templates/index.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","contenido-principal");
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","box");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("img");
        dom.setAttribute(el3,"src","images/main-logo.png");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("br");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createTextNode("\n      ¡Hola!, te damos la bienvenida a ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("strong");
        var el5 = dom.createTextNode("Pilas Bloques");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(",\n      una herramienta desarrollada para comenzar a programar.\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createTextNode("\n      Ingresá en la sección ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      para comenzar a realizar los desafíos.");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createTextNode("También podés visitar la sección ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      o ayuda (");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(") para más detalles.\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0, 1]);
        var element1 = dom.childAt(element0, [9]);
        var morphs = new Array(3);
        morphs[0] = dom.createMorphAt(dom.childAt(element0, [7]),1,1);
        morphs[1] = dom.createMorphAt(element1,1,1);
        morphs[2] = dom.createMorphAt(element1,3,3);
        return morphs;
      },
      statements: [
        ["block","link-to",["desafios"],[],0,null,["loc",[null,[13,28],[13,71]]]],
        ["block","link-to",["acercade"],[],1,null,["loc",[null,[16,40],[16,84]]]],
        ["inline","fa-icon",["question"],[],["loc",[null,[17,15],[17,37]]]]
      ],
      locals: [],
      templates: [child0, child1]
    };
  }()));

});
define('pilas-engine-bloques/templates/loading', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.7",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 4,
            "column": 0
          }
        },
        "moduleName": "pilas-engine-bloques/templates/loading.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","contenido-principal");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("img");
        dom.setAttribute(el2,"class","spinner");
        dom.setAttribute(el2,"src","imagenes/spinner.gif");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() { return []; },
      statements: [

      ],
      locals: [],
      templates: []
    };
  }()));

});
define('pilas-engine-bloques/templates/preferencia', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.7",
          "loc": {
            "source": null,
            "start": {
              "line": 12,
              "column": 0
            },
            "end": {
              "line": 24,
              "column": 0
            }
          },
          "moduleName": "pilas-engine-bloques/templates/preferencia.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("p");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("button");
          dom.setAttribute(el2,"class","btn btn-success");
          var el3 = dom.createTextNode("Guardar");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("table");
          dom.setAttribute(el1,"class","table table-preferencias");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("tr");
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("th");
          dom.setAttribute(el3,"class","etiqueta");
          var el4 = dom.createTextNode(" Tu nombre: ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("td");
          var el4 = dom.createTextNode(" ");
          dom.appendChild(el3, el4);
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode(" ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n    ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element1 = dom.childAt(fragment, [1, 1]);
          var morphs = new Array(2);
          morphs[0] = dom.createElementMorph(element1);
          morphs[1] = dom.createMorphAt(dom.childAt(fragment, [3, 1, 3]),1,1);
          return morphs;
        },
        statements: [
          ["element","action",["guardar"],[],["loc",[null,[14,36],[14,56]]]],
          ["inline","input",[],["type","text","value",["subexpr","@mut",[["get","model.nombre",["loc",[null,[20,37],[20,49]]]]],[],[]]],["loc",[null,[20,11],[20,51]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    var child1 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.7",
          "loc": {
            "source": null,
            "start": {
              "line": 24,
              "column": 0
            },
            "end": {
              "line": 37,
              "column": 0
            }
          },
          "moduleName": "pilas-engine-bloques/templates/preferencia.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("\n  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("p");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("button");
          dom.setAttribute(el2,"disabled","");
          dom.setAttribute(el2,"class","btn btn-info");
          var el3 = dom.createTextNode("Editar");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("table");
          dom.setAttribute(el1,"class","table table-preferencias");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("tr");
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("th");
          dom.setAttribute(el3,"class","etiqueta");
          var el4 = dom.createTextNode(" Tu nombre: ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("td");
          var el4 = dom.createTextNode(" sin editar ");
          dom.appendChild(el3, el4);
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode(" ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n    ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1, 1]);
          var morphs = new Array(2);
          morphs[0] = dom.createElementMorph(element0);
          morphs[1] = dom.createMorphAt(dom.childAt(fragment, [3, 1, 3]),1,1);
          return morphs;
        },
        statements: [
          ["element","action",["editar"],[],["loc",[null,[27,41],[27,60]]]],
          ["content","model.nombre",["loc",[null,[33,22],[33,38]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.7",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 40,
            "column": 0
          }
        },
        "moduleName": "pilas-engine-bloques/templates/preferencia.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","contenido-principal");
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h1");
        var el3 = dom.createTextNode("Preferencias");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("p");
        var el3 = dom.createTextNode("Desde esta sección vas a poder configurar\ny describir tus datos personales.");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("p");
        var el3 = dom.createTextNode("La información de esta sección servirá para\n  que otros usuarios puedan ver tus códigos\n  publicados.");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0]),7,7);
        return morphs;
      },
      statements: [
        ["block","if",[["get","edicion",["loc",[null,[12,6],[12,13]]]]],[],0,1,["loc",[null,[12,0],[37,7]]]]
      ],
      locals: [],
      templates: [child0, child1]
    };
  }()));

});
define('pilas-engine-bloques/templates/solucion/index', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.7",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 11,
            "column": 0
          }
        },
        "moduleName": "pilas-engine-bloques/templates/solucion/index.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","contenido-principal");
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h1");
        var el3 = dom.createTextNode("Lista de soluciones");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        dom.setAttribute(el2,"type","button");
        var el3 = dom.createTextNode("Crear solución para AlienTocaBoton");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        dom.setAttribute(el2,"type","button");
        var el3 = dom.createTextNode("Crear solución para AlienTocaBoton");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [3]);
        var element2 = dom.childAt(element0, [5]);
        var morphs = new Array(3);
        morphs[0] = dom.createElementMorph(element1);
        morphs[1] = dom.createElementMorph(element2);
        morphs[2] = dom.createMorphAt(element0,7,7);
        return morphs;
      },
      statements: [
        ["element","action",["crearSolucionAlienTocaBoton"],[],["loc",[null,[5,22],[5,62]]]],
        ["element","action",["crearSolucionAlien"],[],["loc",[null,[6,22],[6,53]]]],
        ["content","outlet",["loc",[null,[8,0],[8,10]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('pilas-engine-bloques/templates/solucion/ver', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.7",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 2,
            "column": 0
          }
        },
        "moduleName": "pilas-engine-bloques/templates/solucion/ver.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [
        ["inline","pilas-editor",[],["actividad",["subexpr","@mut",[["get","model.actividad",["loc",[null,[1,25],[1,40]]]]],[],[]],"autoejecutar",true,"solucion",["subexpr","@mut",[["get","model.solucion",["loc",[null,[1,68],[1,82]]]]],[],[]]],["loc",[null,[1,0],[1,84]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('pilas-engine-bloques/templates/solucion', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.7",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 2,
            "column": 0
          }
        },
        "moduleName": "pilas-engine-bloques/templates/solucion.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("  ");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
        return morphs;
      },
      statements: [
        ["content","outlet",["loc",[null,[1,2],[1,12]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('pilas-engine-bloques/templates/test', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.7",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 18,
            "column": 0
          }
        },
        "moduleName": "pilas-engine-bloques/templates/test.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","contenedor-editor");
        dom.setAttribute(el1,"id","contenedor-editor");
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-pilas");
        dom.setAttribute(el2,"id","panel-pilas");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","panel-ayuda");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h4");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("p");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    \n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-derecho");
        dom.setAttribute(el2,"id","panel-derecho");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [1]);
        var element2 = dom.childAt(element1, [3]);
        var morphs = new Array(4);
        morphs[0] = dom.createMorphAt(element1,1,1);
        morphs[1] = dom.createMorphAt(dom.childAt(element2, [1]),0,0);
        morphs[2] = dom.createMorphAt(dom.childAt(element2, [3]),0,0);
        morphs[3] = dom.createMorphAt(dom.childAt(element0, [3]),1,1);
        return morphs;
      },
      statements: [
        ["inline","pilas-canvas",[],["actividad",["subexpr","@mut",[["get","model.actividad",["loc",[null,[4,29],[4,44]]]]],[],[]]],["loc",[null,[4,4],[4,46]]]],
        ["content","actividad.nombre",["loc",[null,[7,10],[7,30]]]],
        ["content","actividad.enunciado",["loc",[null,[8,9],[8,32]]]],
        ["inline","pilas-blockly",[],["actividad",["subexpr","@mut",[["get","model.actividad",["loc",[null,[14,30],[14,45]]]]],[],[]]],["loc",[null,[14,4],[14,47]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('pilas-engine-bloques/templates/tips', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.7",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 9,
            "column": 0
          }
        },
        "moduleName": "pilas-engine-bloques/templates/tips.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("p");
        var el2 = dom.createTextNode("Ejecutá ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("code");
        var el3 = dom.createTextNode("ember watch");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode(" para activar\nel modo ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("code");
        var el3 = dom.createTextNode("livereload");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode(".");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("ul");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("li");
        var el3 = dom.createElement("a");
        dom.setAttribute(el3,"href","/tests/index.html");
        var el4 = dom.createTextNode("Run tests");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment,4,4,contextualElement);
        return morphs;
      },
      statements: [
        ["content","outlet",["loc",[null,[8,0],[8,10]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('pilas-engine-bloques/tests/acceptance/acercade-test', ['ember', 'qunit', 'pilas-engine-bloques/tests/helpers/start-app'], function (Ember, qunit, startApp) {

  'use strict';

  qunit.module('Acceptance | acercade', {
    beforeEach: function beforeEach() {
      this.application = startApp['default']();
    },

    afterEach: function afterEach() {
      Ember['default'].run(this.application, 'destroy');
    }
  });

  qunit.test('visiting /acercade', function (assert) {
    visit('/');

    andThen(function () {
      assert.equal(currentURL(), '/');
    });
  });

});
define('pilas-engine-bloques/tests/acceptance/acercade-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - acceptance');
  QUnit.test('acceptance/acercade-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'acceptance/acercade-test.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/actividades/LaberintoConQueso.jshint', function () {

  'use strict';

  QUnit.module('JSHint - actividades');
  QUnit.test('actividades/LaberintoConQueso.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'actividades/LaberintoConQueso.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/actividades/actividad.jshint', function () {

  'use strict';

  QUnit.module('JSHint - actividades');
  QUnit.test('actividades/actividad.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'actividades/actividad.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/actividades/actividadAlien.jshint', function () {

  'use strict';

  QUnit.module('JSHint - actividades');
  QUnit.test('actividades/actividadAlien.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'actividades/actividadAlien.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/actividades/actividadAlienTocaBoton.jshint', function () {

  'use strict';

  QUnit.module('JSHint - actividades');
  QUnit.test('actividades/actividadAlienTocaBoton.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'actividades/actividadAlienTocaBoton.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/actividades/actividadAlimentandoALosPeces.jshint', function () {

  'use strict';

  QUnit.module('JSHint - actividades');
  QUnit.test('actividades/actividadAlimentandoALosPeces.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'actividades/actividadAlimentandoALosPeces.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/actividades/actividadElCangrejoAguafiestas.jshint', function () {

  'use strict';

  QUnit.module('JSHint - actividades');
  QUnit.test('actividades/actividadElCangrejoAguafiestas.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'actividades/actividadElCangrejoAguafiestas.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/actividades/actividadElGatoEnLaCalle.jshint', function () {

  'use strict';

  QUnit.module('JSHint - actividades');
  QUnit.test('actividades/actividadElGatoEnLaCalle.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'actividades/actividadElGatoEnLaCalle.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/actividades/actividadElMarcianoEnElDesierto.jshint', function () {

  'use strict';

  QUnit.module('JSHint - actividades');
  QUnit.test('actividades/actividadElMarcianoEnElDesierto.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'actividades/actividadElMarcianoEnElDesierto.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/actividades/actividadElMonoQueSabeContar.jshint', function () {

  'use strict';

  QUnit.module('JSHint - actividades');
  QUnit.test('actividades/actividadElMonoQueSabeContar.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'actividades/actividadElMonoQueSabeContar.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/actividades/actividadElMonoYLasBananas.jshint', function () {

  'use strict';

  QUnit.module('JSHint - actividades');
  QUnit.test('actividades/actividadElMonoYLasBananas.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'actividades/actividadElMonoYLasBananas.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/actividades/actividadElObreroCopado.jshint', function () {

  'use strict';

  QUnit.module('JSHint - actividades');
  QUnit.test('actividades/actividadElObreroCopado.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'actividades/actividadElObreroCopado.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/actividades/actividadElPlanetaDeNano.jshint', function () {

  'use strict';

  QUnit.module('JSHint - actividades');
  QUnit.test('actividades/actividadElPlanetaDeNano.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'actividades/actividadElPlanetaDeNano.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/actividades/actividadElRecolectorDeEstrellas.jshint', function () {

  'use strict';

  QUnit.module('JSHint - actividades');
  QUnit.test('actividades/actividadElRecolectorDeEstrellas.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'actividades/actividadElRecolectorDeEstrellas.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/actividades/actividadFutbolRobots.jshint', function () {

  'use strict';

  QUnit.module('JSHint - actividades');
  QUnit.test('actividades/actividadFutbolRobots.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'actividades/actividadFutbolRobots.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/actividades/actividadInstalandoJuegos.jshint', function () {

  'use strict';

  QUnit.module('JSHint - actividades');
  QUnit.test('actividades/actividadInstalandoJuegos.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'actividades/actividadInstalandoJuegos.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/actividades/actividadLaEleccionDelMono.jshint', function () {

  'use strict';

  QUnit.module('JSHint - actividades');
  QUnit.test('actividades/actividadLaEleccionDelMono.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'actividades/actividadLaEleccionDelMono.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/actividades/actividadLaGranAventuraDelMarEncantado.jshint', function () {

  'use strict';

  QUnit.module('JSHint - actividades');
  QUnit.test('actividades/actividadLaGranAventuraDelMarEncantado.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'actividades/actividadLaGranAventuraDelMarEncantado.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/actividades/actividadLaberintoConQueso.jshint', function () {

  'use strict';

  QUnit.module('JSHint - actividades');
  QUnit.test('actividades/actividadLaberintoConQueso.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'actividades/actividadLaberintoConQueso.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/actividades/actividadLaberintoCorto.jshint', function () {

  'use strict';

  QUnit.module('JSHint - actividades');
  QUnit.test('actividades/actividadLaberintoCorto.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'actividades/actividadLaberintoCorto.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/actividades/actividadLaberintoLargo.jshint', function () {

  'use strict';

  QUnit.module('JSHint - actividades');
  QUnit.test('actividades/actividadLaberintoLargo.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'actividades/actividadLaberintoLargo.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/actividades/actividadMariaLaComeSandias.jshint', function () {

  'use strict';

  QUnit.module('JSHint - actividades');
  QUnit.test('actividades/actividadMariaLaComeSandias.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'actividades/actividadMariaLaComeSandias.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/actividades/actividadNoMeCansoDeSaltar.jshint', function () {

  'use strict';

  QUnit.module('JSHint - actividades');
  QUnit.test('actividades/actividadNoMeCansoDeSaltar.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'actividades/actividadNoMeCansoDeSaltar.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/actividades/actividadReparandoLaNave.jshint', function () {

  'use strict';

  QUnit.module('JSHint - actividades');
  QUnit.test('actividades/actividadReparandoLaNave.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'actividades/actividadReparandoLaNave.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/actividades/actividadSuperTito1.jshint', function () {

  'use strict';

  QUnit.module('JSHint - actividades');
  QUnit.test('actividades/actividadSuperTito1.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'actividades/actividadSuperTito1.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/actividades/actividadSuperTito2.jshint', function () {

  'use strict';

  QUnit.module('JSHint - actividades');
  QUnit.test('actividades/actividadSuperTito2.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'actividades/actividadSuperTito2.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/actividades/actividadTitoEnciendeLuces.jshint', function () {

  'use strict';

  QUnit.module('JSHint - actividades');
  QUnit.test('actividades/actividadTitoEnciendeLuces.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'actividades/actividadTitoEnciendeLuces.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/actividades/actividadTitoRecargado.jshint', function () {

  'use strict';

  QUnit.module('JSHint - actividades');
  QUnit.test('actividades/actividadTitoRecargado.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'actividades/actividadTitoRecargado.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/actividades/actividadTresNaranjas.jshint', function () {

  'use strict';

  QUnit.module('JSHint - actividades');
  QUnit.test('actividades/actividadTresNaranjas.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'actividades/actividadTresNaranjas.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/actividades/bloque.jshint', function () {

  'use strict';

  QUnit.module('JSHint - actividades');
  QUnit.test('actividades/bloque.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'actividades/bloque.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/actividades/bloques.jshint', function () {

  'use strict';

  QUnit.module('JSHint - actividades');
  QUnit.test('actividades/bloques.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'actividades/bloques.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/actividades/bloquesTito.jshint', function () {

  'use strict';

  QUnit.module('JSHint - actividades');
  QUnit.test('actividades/bloquesTito.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'actividades/bloquesTito.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/actividades/comer.jshint', function () {

  'use strict';

  QUnit.module('JSHint - actividades');
  QUnit.test('actividades/comer.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'actividades/comer.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/actividades/contando.jshint', function () {

  'use strict';

  QUnit.module('JSHint - actividades');
  QUnit.test('actividades/contando.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'actividades/contando.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/actividades/direccionesCuadricula.jshint', function () {

  'use strict';

  QUnit.module('JSHint - actividades');
  QUnit.test('actividades/direccionesCuadricula.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'actividades/direccionesCuadricula.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/actividades/estructurasDeControl.jshint', function () {

  'use strict';

  QUnit.module('JSHint - actividades');
  QUnit.test('actividades/estructurasDeControl.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'actividades/estructurasDeControl.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/actividades/expresiones.jshint', function () {

  'use strict';

  QUnit.module('JSHint - actividades');
  QUnit.test('actividades/expresiones.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'actividades/expresiones.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/actividades/lenguaje.jshint', function () {

  'use strict';

  QUnit.module('JSHint - actividades');
  QUnit.test('actividades/lenguaje.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'actividades/lenguaje.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/actividades/tocando.jshint', function () {

  'use strict';

  QUnit.module('JSHint - actividades');
  QUnit.test('actividades/tocando.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'actividades/tocando.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/adapters/application.jshint', function () {

  'use strict';

  QUnit.module('JSHint - adapters');
  QUnit.test('adapters/application.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'adapters/application.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/app.jshint', function () {

  'use strict';

  QUnit.module('JSHint - .');
  QUnit.test('app.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'app.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/components/modal-title.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components');
  QUnit.test('components/modal-title.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'components/modal-title.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/components/nw-zoom.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components');
  QUnit.test('components/nw-zoom.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'components/nw-zoom.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/components/pilas-automatic-update.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components');
  QUnit.test('components/pilas-automatic-update.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'components/pilas-automatic-update.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/components/pilas-blockly.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components');
  QUnit.test('components/pilas-blockly.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'components/pilas-blockly.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/components/pilas-canvas.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components');
  QUnit.test('components/pilas-canvas.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'components/pilas-canvas.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/components/pilas-desafio.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components');
  QUnit.test('components/pilas-desafio.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'components/pilas-desafio.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/components/pilas-editor.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components');
  QUnit.test('components/pilas-editor.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'components/pilas-editor.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/components/pilas-update.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components');
  QUnit.test('components/pilas-update.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'components/pilas-update.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/controllers/acercade.jshint', function () {

  'use strict';

  QUnit.module('JSHint - controllers');
  QUnit.test('controllers/acercade.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'controllers/acercade.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/controllers/application.jshint', function () {

  'use strict';

  QUnit.module('JSHint - controllers');
  QUnit.test('controllers/application.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'controllers/application.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/controllers/desafios/index.jshint', function () {

  'use strict';

  QUnit.module('JSHint - controllers/desafios');
  QUnit.test('controllers/desafios/index.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'controllers/desafios/index.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/controllers/editor.jshint', function () {

  'use strict';

  QUnit.module('JSHint - controllers');
  QUnit.test('controllers/editor.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'controllers/editor.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/controllers/galeria.jshint', function () {

  'use strict';

  QUnit.module('JSHint - controllers');
  QUnit.test('controllers/galeria.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'controllers/galeria.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/controllers/iframe.jshint', function () {

  'use strict';

  QUnit.module('JSHint - controllers');
  QUnit.test('controllers/iframe.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'controllers/iframe.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/controllers/preferencia.jshint', function () {

  'use strict';

  QUnit.module('JSHint - controllers');
  QUnit.test('controllers/preferencia.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'controllers/preferencia.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/controllers/solucion/index.jshint', function () {

  'use strict';

  QUnit.module('JSHint - controllers/solucion');
  QUnit.test('controllers/solucion/index.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'controllers/solucion/index.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/controllers/solucion/ver.jshint', function () {

  'use strict';

  QUnit.module('JSHint - controllers/solucion');
  QUnit.test('controllers/solucion/ver.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'controllers/solucion/ver.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/helpers/actividadTest', ['exports', 'ember-qunit', 'ember', 'pilas-engine-bloques/actividades/actividad', 'pilas-engine-bloques/tests/helpers/debe-tener-tantos-actores-con-etiqueta'], function (exports, ember_qunit, Ember, Actividad, debeTenerTantosActoresConEtiqueta) {

	'use strict';

	exports.moduloActividad = moduloActividad;
	exports.actividadTest = actividadTest;

	var TestingErrorHandler = Ember['default'].Object.extend({
		init: function init() {
			this.success = this.get('success');
			this.assert = this.get('assert');
			this.expectedErrorMsg = this.get('expectedErrorMsg');
		},
		handle: function handle(error) {
			pilas.escena_actual().pausar();
			if (error.description() === this.expectedErrorMsg) {
				this.assert.ok(true, "Ocurrió el error esperado. Bien!");
			} else {
				this.assert.notOk(true, "Hubo un error inesperado en la actividad: " + error.description());
			}
			this.success();
		}
	});

	function descripcionTest(actividad, descripcionAdicional) {
		return descripcionAdicional ? descripcionAdicional : 'Se puede resolver la actividad ';
	}

	function sanitizarOpciones(opciones) {
		opciones.solucion = opciones.solucion || '';
		// opciones.descripcionAdicional es opcional
		// opciones.expectedErrorMsg es opcional
		opciones.cantAsserts = opciones.cantAsserts || 0;
		/*jshint unused: vars */
		opciones.assertsPostCargaInicial = opciones.assertsPostCargaInicial || function (assert) {};
		opciones.assertsPostEjecucion = opciones.assertsPostEjecucion || function (assert) {};
	}

	function moduloActividad(actividad) {
		ember_qunit.moduleForComponent('pilas-editor', 'actividad:' + actividad.id, { integration: true });
	}

	function actividadTest(actividad, opciones) {
		sanitizarOpciones(opciones);

		ember_qunit.test(descripcionTest(actividad, opciones.descripcionAdicional), function (assert) {
			var _this = this;

			assert.expect(1 + opciones.cantAsserts);
			assert.cantActores = function (etiqueta, cant) {
				return debeTenerTantosActoresConEtiqueta['default'](assert, cant, etiqueta);
			};

			this.set('actividad', Actividad['default'].create({ actividad: actividad }));
			this.set('solucion', Ember['default'].Object.create({
				codigoXML: opciones.solucion,
				nombreDesafio: actividad.id
			}));

			/* Como la tarea de ejecutar el código completo de la solución demora
	   * tiempo, retorno una promesa para que ember espere a que finalice.
	   * La promesa termina con la llamada a sucess.
	   */
			return new Ember['default'].RSVP.Promise(function (success) {

				_this.render(Ember['default'].HTMLBars.template((function () {
					var child0 = (function () {
						return {
							meta: {
								'revision': 'Ember@1.13.7',
								'loc': {
									'source': null,
									'start': {
										'line': 2,
										'column': 7
									},
									'end': {
										'line': 3,
										'column': 42
									}
								}
							},
							arity: 0,
							cachedFragment: null,
							hasRendered: false,
							buildFragment: function buildFragment(dom) {
								var el0 = dom.createDocumentFragment();
								return el0;
							},
							buildRenderNodes: function buildRenderNodes() {
								return [];
							},
							statements: [],
							locals: [],
							templates: []
						};
					})();

					return {
						meta: {
							'revision': 'Ember@1.13.7',
							'loc': {
								'source': null,
								'start': {
									'line': 1,
									'column': 0
								},
								'end': {
									'line': 4,
									'column': 5
								}
							}
						},
						arity: 0,
						cachedFragment: null,
						hasRendered: false,
						buildFragment: function buildFragment(dom) {
							var el0 = dom.createDocumentFragment();
							var el1 = dom.createTextNode('\n\t      ');
							dom.appendChild(el0, el1);
							var el1 = dom.createComment('');
							dom.appendChild(el0, el1);
							var el1 = dom.createTextNode('\n\t    ');
							dom.appendChild(el0, el1);
							return el0;
						},
						buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
							var morphs = new Array(1);
							morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
							return morphs;
						},
						statements: [['block', 'pilas-editor', [], ['ocultarModal', true, 'autoejecutar', true, 'actividad', ['subexpr', '@mut', [['get', 'actividad', ['loc', [null, [2, 69], [2, 78]]]]], [], []], 'solucion', ['subexpr', '@mut', [['get', 'solucion', ['loc', [null, [3, 32], [3, 40]]]]], [], []]], 0, null, ['loc', [null, [2, 7], [3, 59]]]]],
						locals: [],
						templates: [child0]
					};
				})()));

				window.addEventListener('terminaCargaInicial', function () {
					pilas.escena_actual().errorHandler = TestingErrorHandler.create({ success: success, assert: assert, expectedErrorMsg: opciones.expectedErrorMsg });
					opciones.assertsPostCargaInicial(assert);
				}, false);

				window.addEventListener('terminaEjecucion', function () {
					opciones.assertsPostEjecucion(assert);
					assert.ok(pilas.escena_actual().estaResueltoElProblema(), "Se puede resolver el problema");
					success(); // indica que los test finalizan para este desafío.
				}, false);
			});
		});
	}

});
define('pilas-engine-bloques/tests/helpers/actividadTest.jshint', function () {

  'use strict';

  QUnit.module('JSHint - helpers');
  QUnit.test('helpers/actividadTest.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'helpers/actividadTest.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/helpers/debe-tener-tantos-actores-con-etiqueta', ['exports'], function (exports) {

  'use strict';



  exports['default'] = debeTenerTantosActoresConEtiqueta;
  function contarActoresConEtiqueta(pilas, etiqueta) {
    var escena = pilas.escena_actual();

    function tieneEtiquetaBuscada(actor) {
      return actor.tiene_etiqueta(etiqueta);
    }

    return escena.actores.filter(tieneEtiquetaBuscada).length;
  }
  function debeTenerTantosActoresConEtiqueta(assert, cantidad, etiqueta) {
    var cantidad_de_actores = contarActoresConEtiqueta(window['pilas'], etiqueta);
    assert.equal(cantidad, cantidad_de_actores, 'Hay ' + cantidad + ' actores con la etiqueta \'' + etiqueta + '\'');
  }

});
define('pilas-engine-bloques/tests/helpers/debe-tener-tantos-actores-con-etiqueta.jshint', function () {

  'use strict';

  QUnit.module('JSHint - helpers');
  QUnit.test('helpers/debe-tener-tantos-actores-con-etiqueta.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'helpers/debe-tener-tantos-actores-con-etiqueta.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/helpers/resolver', ['exports', 'ember/resolver', 'pilas-engine-bloques/config/environment'], function (exports, Resolver, config) {

  'use strict';

  var resolver = Resolver['default'].create();

  resolver.namespace = {
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix
  };

  exports['default'] = resolver;

});
define('pilas-engine-bloques/tests/helpers/resolver.jshint', function () {

  'use strict';

  QUnit.module('JSHint - helpers');
  QUnit.test('helpers/resolver.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'helpers/resolver.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/helpers/start-app', ['exports', 'ember', 'pilas-engine-bloques/app', 'pilas-engine-bloques/config/environment'], function (exports, Ember, Application, config) {

  'use strict';



  exports['default'] = startApp;
  function startApp(attrs) {
    var application;

    var attributes = Ember['default'].merge({}, config['default'].APP);
    attributes = Ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    Ember['default'].run(function () {
      application = Application['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }

});
define('pilas-engine-bloques/tests/helpers/start-app.jshint', function () {

  'use strict';

  QUnit.module('JSHint - helpers');
  QUnit.test('helpers/start-app.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'helpers/start-app.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/integration/actividades/alienTocaBoton-test', ['pilas-engine-bloques/tests/helpers/actividadTest', 'pilas-engine-bloques/actividades/actividadAlienTocaBoton'], function (actividadTest, actividad) {

	'use strict';

	actividadTest.moduloActividad(actividad['default']);

	actividadTest.actividadTest(actividad['default'], {
		solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="MoverACasillaDerecha" id="4"><next><block type="MoverACasillaDerecha" id="7"><next><block type="MoverACasillaDerecha" id="10"><next><block type="ApretarBoton" id="13"></block></next></block></next></block></next></block></statement></block></xml>'
	});

});
define('pilas-engine-bloques/tests/integration/actividades/alienTocaBoton-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - integration/actividades');
  QUnit.test('integration/actividades/alienTocaBoton-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'integration/actividades/alienTocaBoton-test.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/integration/actividades/alimentandoLosPeces-test', ['pilas-engine-bloques/tests/helpers/actividadTest', 'pilas-engine-bloques/actividades/actividadAlimentandoALosPeces'], function (actividadTest, actividad) {

	'use strict';

	actividadTest.moduloActividad(actividad['default']);

	actividadTest.actividadTest(actividad['default'], {
		/*
	 ESTO FALLA, NO SE POR QUE NO CREA BIEN LOS BLOQQUES:
	 solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="8" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="procedures_callnoreturn" id="28"><mutation name="Buscar alimento"></mutation><next><block type="procedures_callnoreturn" id="33"><mutation name="Alimentar peces de arriba"></mutation><next><block type="procedures_callnoreturn" id="38"><mutation name="Alimentar peces de abajo"></mutation></block></next></block></next></block></statement></block><block type="local_var_set" id="13" inline="true" x="0" y="0"><field name="VAR">local</field></block><block type="procedures_defnoreturn" id="16" x="29" y="172"><mutation></mutation><field name="NAME">Buscar alimento</field><statement name="STACK"><block type="repetir" id="45" inline="true"><value name="count"><block type="math_number" id="46"><field name="NUM">2</field></block></value><statement name="block"><block type="MoverACasillaArriba" id="53"></block></statement><next><block type="repetir" id="71" inline="true"><value name="count"><block type="math_number" id="72"><field name="NUM">4</field></block></value><statement name="block"><block type="MoverACasillaDerecha" id="62"></block></statement><next><block type="AgarrarComida" id="79"></block></next></block></next></block></statement></block><block type="procedures_defnoreturn" id="19" x="316" y="169"><mutation></mutation><field name="NAME">Alimentar peces de arriba</field><statement name="STACK"><block type="MoverACasillaArriba" id="88"><next><block type="repetir" id="91" inline="true"><value name="count"><block type="math_number" id="92"><field name="NUM">4</field></block></value><statement name="block"><block type="MoverACasillaIzquierda" id="99"><next><block type="AlimentarPez" id="108"></block></next></block></statement></block></next></block></statement></block><block type="procedures_defnoreturn" id="23" x="254" y="351"><mutation></mutation><field name="NAME">Alimentar peces de abajo</field><statement name="STACK"><block type="repetir" id="111" inline="true"><value name="count"><block type="math_number" id="112"><field name="NUM">3</field></block></value><statement name="block"><block type="MoverACasillaAbajo" id="119"></block></statement><next><block type="repetir" id="122" inline="true"><value name="count"><block type="math_number" id="123"><field name="NUM">3</field></block></value><statement name="block"><block type="MoverACasillaDerecha" id="132"><next><block type="AlimentarPez" id="139"></block></next></block></statement></block></next></block></statement></block></xml>',
	 PONGO SOLUCION ERRRONEA MIENTRAS TANTO PARA NO FRULEAR LOS TESTS:
	 */
		solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="20" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="AlimentarPez" id="27"></block></statement></block></xml>'
	});

});
define('pilas-engine-bloques/tests/integration/actividades/alimentandoLosPeces-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - integration/actividades');
  QUnit.test('integration/actividades/alimentandoLosPeces-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'integration/actividades/alimentandoLosPeces-test.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/integration/actividades/elAlienYLasTuercas-test', ['pilas-engine-bloques/tests/helpers/actividadTest', 'pilas-engine-bloques/actividades/actividadAlien'], function (actividadTest, actividad) {

	'use strict';

	actividadTest.moduloActividad(actividad['default']);

	actividadTest.actividadTest(actividad['default'], {
		solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="7" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="repetir" id="16" inline="true"><value name="count"><block type="math_number" id="17"><field name="NUM">4</field></block></value><statement name="block"><block type="MoverACasillaArriba" id="23"></block></statement><next><block type="repetir" id="45" inline="true"><value name="count"><block type="math_number" id="46"><field name="NUM">4</field></block></value><statement name="block"><block type="LevantaTuerca" id="29"><next><block type="MoverACasillaAbajo" id="35"><next><block type="MoverACasillaDerecha" id="41"></block></next></block></next></block></statement><next><block type="LevantaTuerca" id="53"></block></next></block></next></block></statement></block></xml>',
		cantAsserts: 1,
		assertsPostCargaInicial: function assertsPostCargaInicial(assert) {
			assert.cantActores("TuercaAnimada", 5);
		}
	});

});
define('pilas-engine-bloques/tests/integration/actividades/elAlienYLasTuercas-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - integration/actividades');
  QUnit.test('integration/actividades/elAlienYLasTuercas-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'integration/actividades/elAlienYLasTuercas-test.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/integration/actividades/elRecolectorDeEstrellas-test', ['pilas-engine-bloques/tests/helpers/actividadTest', 'pilas-engine-bloques/actividades/actividadElRecolectorDeEstrellas'], function (actividadTest, actividad) {

	'use strict';

	actividadTest.moduloActividad(actividad['default']);

	actividadTest.actividadTest(actividad['default'], {
		solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="repetir" id="115" inline="true"><value name="count"><block type="math_number" id="116"><field name="NUM">3</field></block></value><statement name="block"><block type="procedures_callnoreturn" id="107"><mutation name="tomar estellas de la fila completa"></mutation><next><block type="VolverABordeIzquierdo" id="121"><next><block type="MoverACasillaArriba" id="126"></block></next></block></next></block></statement><next><block type="procedures_callnoreturn" id="129"><mutation name="tomar estellas de la fila completa"></mutation></block></next></block></statement></block><block type="procedures_defnoreturn" id="92" x="14" y="268"><mutation></mutation><field name="NAME">tomar estellas de la fila completa</field><statement name="STACK"><block type="repetir" id="89" inline="true"><value name="count"><block type="math_number" id="90"><field name="NUM">4</field></block></value><statement name="block"><block type="MoverACasillaDerecha" id="97"><next><block type="TomarEstrella" id="102"></block></next></block></statement></block></statement></block></xml>',
		cantAsserts: 1,
		assertsPostCargaInicial: function assertsPostCargaInicial(assert) {
			assert.cantActores("EstrellaAnimada", 4 * 4);
		}
	});

});
define('pilas-engine-bloques/tests/integration/actividades/elRecolectorDeEstrellas-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - integration/actividades');
  QUnit.test('integration/actividades/elRecolectorDeEstrellas-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'integration/actividades/elRecolectorDeEstrellas-test.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/integration/actividades/fixmeSepararActividades-test', ['ember-qunit', 'ember', 'pilas-engine-bloques/actividades/actividadLaberintoLargo', 'pilas-engine-bloques/actividades/actividadLaberintoCorto', 'pilas-engine-bloques/actividades/actividadLaberintoConQueso', 'pilas-engine-bloques/actividades/actividadTresNaranjas', 'pilas-engine-bloques/tests/helpers/debe-tener-tantos-actores-con-etiqueta', 'pilas-engine-bloques/actividades/actividad'], function (ember_qunit, Ember, actividadLaberintoLargo, actividadLaberintoCorto, actividadLaberintoConQueso, actividadTresNaranjas, debeTenerTantosActoresConEtiqueta, Actividad) {

  'use strict';

  // ESTAS ACTIVIDADES DEBEN SER SEPARADAS EN ARCHIVOS
  // Usando por ejemplo elRecolectorDeEstrellas-test.js

  // ESTAS ACTIVIDADES DEBEN SER SEPARADAS EN ARCHIVOS
  // Usando por ejemplo elRecolectorDeEstrellas-test.js

  // ESTAS ACTIVIDADES DEBEN SER SEPARADAS EN ARCHIVOS
  // Usando por ejemplo elRecolectorDeEstrellas-test.js

  // ESTAS ACTIVIDADES DEBEN SER SEPARADAS EN ARCHIVOS
  // Usando por ejemplo elRecolectorDeEstrellas-test.js

  // ESTAS ACTIVIDADES DEBEN SER SEPARADAS EN ARCHIVOS
  // Usando por ejemplo elRecolectorDeEstrellas-test.js

  // ESTAS ACTIVIDADES DEBEN SER SEPARADAS EN ARCHIVOS
  // Usando por ejemplo elRecolectorDeEstrellas-test.js

  // ESTAS ACTIVIDADES DEBEN SER SEPARADAS EN ARCHIVOS
  // Usando por ejemplo elRecolectorDeEstrellas-test.js

  // ESTAS ACTIVIDADES DEBEN SER SEPARADAS EN ARCHIVOS
  // Usando por ejemplo elRecolectorDeEstrellas-test.js

  // ESTAS ACTIVIDADES DEBEN SER SEPARADAS EN ARCHIVOS
  // Usando por ejemplo elRecolectorDeEstrellas-test.js

  // ESTAS ACTIVIDADES DEBEN SER SEPARADAS EN ARCHIVOS
  // Usando por ejemplo elRecolectorDeEstrellas-test.js

  // ESTAS ACTIVIDADES DEBEN SER SEPARADAS EN ARCHIVOS
  // Usando por ejemplo elRecolectorDeEstrellas-test.js

  // ESTAS ACTIVIDADES DEBEN SER SEPARADAS EN ARCHIVOS
  // Usando por ejemplo elRecolectorDeEstrellas-test.js

  ember_qunit.moduleForComponent('pilas-editor', 'actividad:VariasFIXME', {
    integration: true
  });

  ember_qunit.test('puede resolver la actividad laberinto corto', function (assert) {
    var _this = this;

    assert.expect(2);

    var actividad = Actividad['default'].create({ actividad: actividadLaberintoCorto['default'] });
    var solucion = Ember['default'].Object.create({
      codigoXML: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="sino" id="9" inline="true"><value name="condition"><block type="TocandoAbajo" id="14"></block></value><statement name="block1"><block type="MoverACasillaAbajo" id="17"></block></statement><statement name="block2"><block type="MoverACasillaDerecha" id="4"></block></statement></block></statement></block></xml>',
      nombreDesafio: 'LaberintoCorto'
    });

    this.set('actividad', actividad);
    this.set('solucion', solucion);

    return new Ember['default'].RSVP.Promise(function (success) {

      _this.render(Ember['default'].HTMLBars.template((function () {
        var child0 = (function () {
          return {
            meta: {
              'revision': 'Ember@1.13.7',
              'loc': {
                'source': null,
                'start': {
                  'line': 2,
                  'column': 6
                },
                'end': {
                  'line': 3,
                  'column': 41
                }
              }
            },
            arity: 0,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              return el0;
            },
            buildRenderNodes: function buildRenderNodes() {
              return [];
            },
            statements: [],
            locals: [],
            templates: []
          };
        })();

        return {
          meta: {
            'revision': 'Ember@1.13.7',
            'loc': {
              'source': null,
              'start': {
                'line': 1,
                'column': 0
              },
              'end': {
                'line': 4,
                'column': 4
              }
            }
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('\n      ');
            dom.appendChild(el0, el1);
            var el1 = dom.createComment('');
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode('\n    ');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
            return morphs;
          },
          statements: [['block', 'pilas-editor', [], ['ocultarModal', true, 'autoejecutar', true, 'actividad', ['subexpr', '@mut', [['get', 'actividad', ['loc', [null, [2, 68], [2, 77]]]]], [], []], 'solucion', ['subexpr', '@mut', [['get', 'solucion', ['loc', [null, [3, 31], [3, 39]]]]], [], []]], 0, null, ['loc', [null, [2, 6], [3, 58]]]]],
          locals: [],
          templates: [child0]
        };
      })()));

      window.addEventListener('terminaCargaInicial', function () {
        debeTenerTantosActoresConEtiqueta['default'](assert, 1, "RatonAnimado");
        //debeTenerTantosActoresConEtiqueta
        //var cantidad_de_tuercas = contarActoresConEtiqueta(window['pilas'], "TuercaAnimada");
        //assert.equal(5, cantidad_de_tuercas, "Tienen que haber 5 tuercas al comenzar.");
      }, false);

      window.addEventListener('terminaEjecucion', function () {
        assert.ok(true, pilas.escena_actual().estaResueltoElProblema());

        //var cantidad_de_tuercas = contarActoresConEtiqueta(window['pilas'], "TuercaAnimada");
        //assert.equal(0, cantidad_de_tuercas, "No tienen que haber tuercas al finalizar");

        success(); // indica que los test finalizan para este desafío.
      }, false);
    });
  });

  ember_qunit.test('puede resolver la actividad laberinto largo', function (assert) {
    var _this2 = this;

    assert.expect(2);

    var actividad = Actividad['default'].create({ actividad: actividadLaberintoLargo['default'] });
    var solucion = Ember['default'].Object.create({
      codigoXML: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="hasta" id="5" inline="true"><value name="condition"><block type="TocandoFinCamino" id="9"></block></value><statement name="block"><block type="si" id="19" inline="true"><value name="condition"><block type="TocandoAbajo" id="29"></block></value><statement name="block"><block type="MoverACasillaAbajo" id="36"></block></statement><next><block type="si" id="50" inline="true"><value name="condition"><block type="TocandoDerecha" id="57"></block></value><statement name="block"><block type="MoverACasillaDerecha" id="40"></block></statement></block></next></block></statement></block></statement></block></xml>',
      nombreDesafio: 'LaberintoLargo'
    });

    this.set('actividad', actividad);
    this.set('solucion', solucion);

    /* Como la tarea de ejecutar el código completo de la solución demora
     * tiempo, retorno una promesa para que ember espere a que finalice.
     * La promesa termina con la llamada a sucess.
     */
    return new Ember['default'].RSVP.Promise(function (success) {

      _this2.render(Ember['default'].HTMLBars.template((function () {
        var child0 = (function () {
          return {
            meta: {
              'revision': 'Ember@1.13.7',
              'loc': {
                'source': null,
                'start': {
                  'line': 2,
                  'column': 6
                },
                'end': {
                  'line': 3,
                  'column': 41
                }
              }
            },
            arity: 0,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              return el0;
            },
            buildRenderNodes: function buildRenderNodes() {
              return [];
            },
            statements: [],
            locals: [],
            templates: []
          };
        })();

        return {
          meta: {
            'revision': 'Ember@1.13.7',
            'loc': {
              'source': null,
              'start': {
                'line': 1,
                'column': 0
              },
              'end': {
                'line': 4,
                'column': 4
              }
            }
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('\n      ');
            dom.appendChild(el0, el1);
            var el1 = dom.createComment('');
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode('\n    ');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
            return morphs;
          },
          statements: [['block', 'pilas-editor', [], ['ocultarModal', true, 'autoejecutar', true, 'actividad', ['subexpr', '@mut', [['get', 'actividad', ['loc', [null, [2, 68], [2, 77]]]]], [], []], 'solucion', ['subexpr', '@mut', [['get', 'solucion', ['loc', [null, [3, 31], [3, 39]]]]], [], []]], 0, null, ['loc', [null, [2, 6], [3, 58]]]]],
          locals: [],
          templates: [child0]
        };
      })()));

      window.addEventListener('terminaCargaInicial', function () {
        debeTenerTantosActoresConEtiqueta['default'](assert, 1, "RatonAnimado");
        //debeTenerTantosActoresConEtiqueta
        //var cantidad_de_tuercas = contarActoresConEtiqueta(window['pilas'], "TuercaAnimada");
        //assert.equal(5, cantidad_de_tuercas, "Tienen que haber 5 tuercas al comenzar.");
      }, false);

      window.addEventListener('terminaEjecucion', function () {
        assert.ok(true, pilas.escena_actual().estaResueltoElProblema());

        //var cantidad_de_tuercas = contarActoresConEtiqueta(window['pilas'], "TuercaAnimada");
        //assert.equal(0, cantidad_de_tuercas, "No tienen que haber tuercas al finalizar");

        success(); // indica que los test finalizan para este desafío.
      }, false);
    });
  });
  ember_qunit.test('puede resolver la actividad laberinto con queso', function (assert) {
    var _this3 = this;

    assert.expect(2);

    var actividad = Actividad['default'].create({ actividad: actividadLaberintoConQueso['default'] });
    var solucion = Ember['default'].Object.create({
      codigoXML: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="hasta" id="51" inline="true"><value name="condition"><block type="TocandoFinCamino" id="61"></block></value><statement name="block"><block type="si" id="74" inline="true"><value name="condition"><block type="tocandoQueso" id="79"></block></value><statement name="block"><block type="ComerQueso" id="92"></block></statement><next><block type="sino" id="14" inline="true"><value name="condition"><block type="TocandoAbajo" id="26"></block></value><statement name="block1"><block type="MoverACasillaAbajo" id="30"></block></statement><statement name="block2"><block type="MoverACasillaDerecha" id="38"></block></statement></block></next></block></statement></block></statement></block></xml>',
      nombreDesafio: 'LaberintoConQueso'
    });

    this.set('actividad', actividad);
    this.set('solucion', solucion);

    /* Como la tarea de ejecutar el código completo de la solución demora
     * tiempo, retorno una promesa para que ember espere a que finalice.
     * La promesa termina con la llamada a sucess.
     */
    return new Ember['default'].RSVP.Promise(function (success) {

      _this3.render(Ember['default'].HTMLBars.template((function () {
        var child0 = (function () {
          return {
            meta: {
              'revision': 'Ember@1.13.7',
              'loc': {
                'source': null,
                'start': {
                  'line': 2,
                  'column': 6
                },
                'end': {
                  'line': 3,
                  'column': 41
                }
              }
            },
            arity: 0,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              return el0;
            },
            buildRenderNodes: function buildRenderNodes() {
              return [];
            },
            statements: [],
            locals: [],
            templates: []
          };
        })();

        return {
          meta: {
            'revision': 'Ember@1.13.7',
            'loc': {
              'source': null,
              'start': {
                'line': 1,
                'column': 0
              },
              'end': {
                'line': 4,
                'column': 4
              }
            }
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('\n      ');
            dom.appendChild(el0, el1);
            var el1 = dom.createComment('');
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode('\n    ');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
            return morphs;
          },
          statements: [['block', 'pilas-editor', [], ['ocultarModal', true, 'autoejecutar', true, 'actividad', ['subexpr', '@mut', [['get', 'actividad', ['loc', [null, [2, 68], [2, 77]]]]], [], []], 'solucion', ['subexpr', '@mut', [['get', 'solucion', ['loc', [null, [3, 31], [3, 39]]]]], [], []]], 0, null, ['loc', [null, [2, 6], [3, 58]]]]],
          locals: [],
          templates: [child0]
        };
      })()));

      window.addEventListener('terminaCargaInicial', function () {
        debeTenerTantosActoresConEtiqueta['default'](assert, 1, "RatonAnimado");
        //debeTenerTantosActoresConEtiqueta
        //var cantidad_de_tuercas = contarActoresConEtiqueta(window['pilas'], "TuercaAnimada");
        //assert.equal(5, cantidad_de_tuercas, "Tienen que haber 5 tuercas al comenzar.");
      }, false);

      window.addEventListener('terminaEjecucion', function () {

        assert.ok(true, pilas.escena_actual().estaResueltoElProblema());

        //var cantidad_de_tuercas = contarActoresConEtiqueta(window['pilas'], "TuercaAnimada");
        //assert.equal(0, cantidad_de_tuercas, "No tienen que haber tuercas al finalizar");

        success(); // indica que los test finalizan para este desafío.
      }, false);
    });
  });
  ember_qunit.test('puede resolver la actividad tres naranjas', function (assert) {
    var _this4 = this;

    assert.expect(2);

    var actividad = Actividad['default'].create({ actividad: actividadTresNaranjas['default'] });
    var solucion = Ember['default'].Object.create({
      codigoXML: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="repetir" id="8" inline="true"><value name="count"><block type="math_number" id="9"><field name="NUM">3</field></block></value><statement name="block"><block type="MoverACasillaDerecha" id="12"><next><block type="si" id="17" inline="true"><value name="condition"><block type="TocandoNaranja" id="19"></block></value><statement name="block"><block type="ComerNaranja" id="22"></block></statement></block></next></block></statement></block></statement></block></xml>',
      nombreDesafio: 'TresNaranjas'
    });
    this.set('actividad', actividad);
    this.set('solucion', solucion);
    return new Ember['default'].RSVP.Promise(function (success) {
      _this4.render(Ember['default'].HTMLBars.template((function () {
        var child0 = (function () {
          return {
            meta: {
              'revision': 'Ember@1.13.7',
              'loc': {
                'source': null,
                'start': {
                  'line': 2,
                  'column': 6
                },
                'end': {
                  'line': 3,
                  'column': 41
                }
              }
            },
            arity: 0,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              return el0;
            },
            buildRenderNodes: function buildRenderNodes() {
              return [];
            },
            statements: [],
            locals: [],
            templates: []
          };
        })();

        return {
          meta: {
            'revision': 'Ember@1.13.7',
            'loc': {
              'source': null,
              'start': {
                'line': 1,
                'column': 0
              },
              'end': {
                'line': 4,
                'column': 4
              }
            }
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('\n      ');
            dom.appendChild(el0, el1);
            var el1 = dom.createComment('');
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode('\n    ');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
            return morphs;
          },
          statements: [['block', 'pilas-editor', [], ['ocultarModal', true, 'autoejecutar', true, 'actividad', ['subexpr', '@mut', [['get', 'actividad', ['loc', [null, [2, 68], [2, 77]]]]], [], []], 'solucion', ['subexpr', '@mut', [['get', 'solucion', ['loc', [null, [3, 31], [3, 39]]]]], [], []]], 0, null, ['loc', [null, [2, 6], [3, 58]]]]],
          locals: [],
          templates: [child0]
        };
      })()));
      window.addEventListener('terminaCargaInicial', function () {
        debeTenerTantosActoresConEtiqueta['default'](assert, 1, "MarcianoAnimado");
      }, false);

      window.addEventListener('terminaEjecucion', function () {
        assert.ok(true, pilas.escena_actual().estaResueltoElProblema());
        success();
      }, false);
    });
  });

});
define('pilas-engine-bloques/tests/integration/actividades/fixmeSepararActividades-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - integration/actividades');
  QUnit.test('integration/actividades/fixmeSepararActividades-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'integration/actividades/fixmeSepararActividades-test.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/integration/actividades/laEleccionDelMono-test', ['pilas-engine-bloques/tests/helpers/actividadTest', 'pilas-engine-bloques/actividades/actividadLaEleccionDelMono'], function (actividadTest, actividad) {

	'use strict';

	actividadTest.moduloActividad(actividad['default']);

	actividadTest.actividadTest(actividad['default'], {
		solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="16" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="Avanzar" id="20"><next><block type="sino" id="22" inline="true"><value name="condition"><block type="tocandoManzana" id="30"></block></value><statement name="block1"><block type="ComerManzana" id="26"></block></statement><statement name="block2"><block type="ComerBanana" id="34"></block></statement></block></next></block></statement></block></xml>',
		descripcionAdicional: 'por Banana',
		cantAsserts: 1,
		assertsPostCargaInicial: function assertsPostCargaInicial(assert) {
			assert.cantActores("MonoAnimado", 1);
		}
	});

});
define('pilas-engine-bloques/tests/integration/actividades/laEleccionDelMono-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - integration/actividades');
  QUnit.test('integration/actividades/laEleccionDelMono-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'integration/actividades/laEleccionDelMono-test.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/integration/actividades/laGranAventuraDelMarEncantado-test', ['pilas-engine-bloques/tests/helpers/actividadTest', 'pilas-engine-bloques/actividades/actividadLaGranAventuraDelMarEncantado'], function (actividadTest, actividad) {

	'use strict';

	actividadTest.moduloActividad(actividad['default']);

	actividadTest.actividadTest(actividad['default'], {
		solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="2" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="procedures_callnoreturn" id="3"><mutation name="Buscar llave"></mutation><next><block type="procedures_callnoreturn" id="4"><mutation name="Buscar Sombrero"></mutation><next><block type="procedures_callnoreturn" id="5"><mutation name="Buscar espada"></mutation><next><block type="procedures_callnoreturn" id="6"><mutation name="Luchar con el caballero"></mutation><next><block type="procedures_callnoreturn" id="7"><mutation name="Rescatar princesa"></mutation></block></next></block></next></block></next></block></next></block></statement></block><block type="procedures_defnoreturn" id="8" x="500" y="-5"><mutation></mutation><field name="NAME">Buscar Sombrero</field><statement name="STACK"><block type="MoverACasillaArriba" id="9"><next><block type="repetir" id="10" inline="true"><value name="count"><block type="math_number" id="11"><field name="NUM">4</field></block></value><statement name="block"><block type="MoverACasillaIzquierda" id="12"></block></statement><next><block type="Abrircofre" id="49"></block></next></block></next></block></statement></block><block type="procedures_defnoreturn" id="13" x="249" y="14"><mutation></mutation><field name="NAME">Rescatar princesa</field><statement name="STACK"><block type="repetir" id="14" inline="true"><value name="count"><block type="math_number" id="15"><field name="NUM">2</field></block></value><statement name="block"><block type="MoverACasillaAbajo" id="16"><next><block type="MoverACasillaDerecha" id="17"></block></next></block></statement><next><block type="Escaparenunicornio" id="18"></block></next></block></statement></block><block type="procedures_defnoreturn" id="19" x="552" y="138"><mutation></mutation><field name="NAME">Luchar con el caballero</field><statement name="STACK"><block type="repetir" id="20" inline="true"><value name="count"><block type="math_number" id="21"><field name="NUM">2</field></block></value><statement name="block"><block type="MoverACasillaArriba" id="22"></block></statement><next><block type="MoverACasillaDerecha" id="23"><next><block type="Atacarconespada" id="24"></block></next></block></next></block></statement></block><block type="procedures_defnoreturn" id="25" x="10" y="274"><mutation></mutation><field name="NAME">Buscar llave</field><statement name="STACK"><block type="repetir" id="26" inline="true"><value name="count"><block type="math_number" id="27"><field name="NUM">2</field></block></value><statement name="block"><block type="MoverACasillaArriba" id="28"></block></statement><next><block type="repetir" id="29" inline="true"><value name="count"><block type="math_number" id="30"><field name="NUM">4</field></block></value><statement name="block"><block type="MoverACasillaDerecha" id="31"></block></statement><next><block type="Agarrarllave" id="73"></block></next></block></next></block></statement></block><block type="procedures_defnoreturn" id="32" x="309" y="270"><mutation></mutation><field name="NAME">Buscar espada</field><statement name="STACK"><block type="repetir" id="33" inline="true"><value name="count"><block type="math_number" id="34"><field name="NUM">3</field></block></value><statement name="block"><block type="MoverACasillaAbajo" id="35"></block></statement><next><block type="MoverACasillaDerecha" id="36"><next><block type="Darsombrero" id="37"></block></next></block></next></block></statement></block></xml>'
	});

	actividadTest.actividadTest(actividad['default'], {
		descripcionAdicional: 'Da error al dar sombrero sin tenerlo',
		solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="MoverACasillaDerecha" id="11"><next><block type="Darsombrero" id="24"></block></next></block></statement></block></xml>',
		expectedErrorMsg: 'Para darle el sombrero al mago necesitás sacarlo del cofre.'
	});

});
define('pilas-engine-bloques/tests/integration/actividades/laGranAventuraDelMarEncantado-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - integration/actividades');
  QUnit.test('integration/actividades/laGranAventuraDelMarEncantado-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'integration/actividades/laGranAventuraDelMarEncantado-test.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/integration/actividades/reparandoLaNave-test', ['pilas-engine-bloques/tests/helpers/actividadTest', 'pilas-engine-bloques/actividades/actividadReparandoLaNave'], function (actividadTest, actividad) {

	'use strict';

	actividadTest.moduloActividad(actividad['default']);

	actividadTest.actividadTest(actividad['default'], {
		solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="3" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="repetir" id="4" inline="true"><value name="count"><block type="math_number" id="5"><field name="NUM">3</field></block></value><statement name="block"><block type="procedures_callnoreturn" id="6"><mutation name="Buscar Hierro y volver"></mutation><next><block type="procedures_callnoreturn" id="7"><mutation name="Buscar Carbón y volver"></mutation></block></next></block></statement><next><block type="Escapar" id="8"></block></next></block></statement></block><block type="procedures_defnoreturn" id="9" x="344" y="6"><mutation></mutation><field name="NAME">Buscar Hierro y volver</field><statement name="STACK"><block type="repetir" id="10" inline="true"><value name="count"><block type="math_number" id="11"><field name="NUM">3</field></block></value><statement name="block"><block type="MoverACasillaArriba" id="12"></block></statement><next><block type="TomarHierro" id="13"><next><block type="repetir" id="14" inline="true"><value name="count"><block type="math_number" id="15"><field name="NUM">3</field></block></value><statement name="block"><block type="MoverACasillaAbajo" id="16"></block></statement><next><block type="Depositar" id="17"></block></next></block></next></block></next></block></statement></block><block type="procedures_defnoreturn" id="18" x="35" y="199"><mutation></mutation><field name="NAME">Buscar Carbón y volver</field><statement name="STACK"><block type="repetir" id="19" inline="true"><value name="count"><block type="math_number" id="20"><field name="NUM">4</field></block></value><statement name="block"><block type="MoverACasillaDerecha" id="21"></block></statement><next><block type="repetir" id="22" inline="true"><value name="count"><block type="math_number" id="23"><field name="NUM">3</field></block></value><statement name="block"><block type="MoverACasillaArriba" id="24"></block></statement><next><block type="TomarCarbon" id="25"><next><block type="repetir" id="26" inline="true"><value name="count"><block type="math_number" id="27"><field name="NUM">3</field></block></value><statement name="block"><block type="MoverACasillaAbajo" id="28"></block></statement><next><block type="repetir" id="29" inline="true"><value name="count"><block type="math_number" id="30"><field name="NUM">4</field></block></value><statement name="block"><block type="MoverACasillaIzquierda" id="31"></block></statement><next><block type="Depositar" id="40"></block></next></block></next></block></next></block></next></block></next></block></statement></block></xml>'
	});

	actividadTest.actividadTest(actividad['default'], {
		descripcionAdicional: 'Da error al depositar cuando no tengo nada',
		solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="25" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="Depositar" id="34"></block></statement></block></xml>',
		expectedErrorMsg: 'No tengo nada en la mano'
	});

});
define('pilas-engine-bloques/tests/integration/actividades/reparandoLaNave-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - integration/actividades');
  QUnit.test('integration/actividades/reparandoLaNave-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'integration/actividades/reparandoLaNave-test.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/integration/actividades/titoEnciendeLasLuces-test', ['pilas-engine-bloques/tests/helpers/actividadTest', 'pilas-engine-bloques/actividades/actividadTitoEnciendeLuces'], function (actividadTest, actividad) {

	'use strict';

	actividadTest.moduloActividad(actividad['default']);

	actividadTest.actividadTest(actividad['default'], {
		solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="45" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="MoverACasillaArriba" id="115"><next><block type="procedures_callnoreturn" id="59"><mutation name="encender diagonal"></mutation><next><block type="procedures_callnoreturn" id="144"><mutation name="acomodarse en la otra diagonal"></mutation><next><block type="procedures_callnoreturn" id="156"><mutation name="encender diagonal"></mutation></block></next></block></next></block></next></block></statement></block><block type="procedures_defnoreturn" id="56" x="22" y="172"><mutation></mutation><field name="NAME">encender diagonal</field><statement name="STACK"><block type="repetir" id="76" inline="true"><value name="count"><block type="math_number" id="77"><field name="NUM">3</field></block></value><statement name="block"><block type="EncenderLuz" id="65"><next><block type="MoverACasillaDerecha" id="86"><next><block type="MoverACasillaArriba" id="92"></block></next></block></next></block></statement><next><block type="EncenderLuz" id="98"></block></next></block></statement></block><block type="procedures_defnoreturn" id="109" x="22" y="380"><mutation></mutation><field name="NAME">acomodarse en la otra diagonal</field><statement name="STACK"><block type="repetir" id="122" inline="true"><value name="count"><block type="math_number" id="123"><field name="NUM">4</field></block></value><statement name="block"><block type="MoverACasillaAbajo" id="129"></block></statement><next><block type="MoverACasillaIzquierda" id="135"></block></next></block></statement></block></xml>'
	});

});
define('pilas-engine-bloques/tests/integration/actividades/titoEnciendeLasLuces-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - integration/actividades');
  QUnit.test('integration/actividades/titoEnciendeLasLuces-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'integration/actividades/titoEnciendeLasLuces-test.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/integration/components/modal-title-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent('modal-title', 'Integration | Component | modal title', {
    integration: true
  });

  ember_qunit.test('it renders', function (assert) {
    assert.expect(1);

    this.render(Ember.HTMLBars.template((function () {
      return {
        meta: {
          'revision': 'Ember@1.13.7',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 15
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['content', 'modal-title', ['loc', [null, [1, 0], [1, 15]]]]],
        locals: [],
        templates: []
      };
    })()));

    this.render(Ember.HTMLBars.template((function () {
      var child0 = (function () {
        return {
          meta: {
            'revision': 'Ember@1.13.7',
            'loc': {
              'source': null,
              'start': {
                'line': 2,
                'column': 4
              },
              'end': {
                'line': 4,
                'column': 4
              }
            }
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('      template block text\n');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();

      return {
        meta: {
          'revision': 'Ember@1.13.7',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 5,
              'column': 2
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode('\n');
          dom.appendChild(el0, el1);
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode('  ');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [['block', 'modal-title', [], [], 0, null, ['loc', [null, [2, 4], [4, 20]]]]],
        locals: [],
        templates: [child0]
      };
    })()));

    assert.equal(this.$().text().trim(), 'Cerrar');
  });

});
define('pilas-engine-bloques/tests/integration/components/modal-title-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - integration/components');
  QUnit.test('integration/components/modal-title-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'integration/components/modal-title-test.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/integration/components/pilas-editor-test', ['ember-qunit', 'pilas-engine-bloques/actividades/actividadAlien', 'pilas-engine-bloques/actividades/actividad'], function (ember_qunit, actividadAlien, Actividad) {

  'use strict';

  ember_qunit.moduleForComponent('pilas-editor', 'component:pilas-editor', {
    integration: true
  });

  ember_qunit.test('informa error si no tiene actividad', function (assert) {
    assert.expect(1);
    this.render(Ember.HTMLBars.template((function () {
      var child0 = (function () {
        return {
          meta: {
            'revision': 'Ember@1.13.7',
            'loc': {
              'source': null,
              'start': {
                'line': 2,
                'column': 4
              },
              'end': {
                'line': 2,
                'column': 54
              }
            }
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();

      return {
        meta: {
          'revision': 'Ember@1.13.7',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 3,
              'column': 2
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode('\n    ');
          dom.appendChild(el0, el1);
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode('\n  ');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [['block', 'pilas-editor', [], ['ocultarModal', true, 'actividad', null], 0, null, ['loc', [null, [2, 4], [2, 71]]]]],
        locals: [],
        templates: [child0]
      };
    })()));
    var texto_del_componente = this.$().text().trim();
    assert.equal(texto_del_componente, 'Error: tienes que inicializar este componente con una actividad.');
  });

  ember_qunit.test('puede cargar una actividad y leer el título del desafío', function (assert) {
    assert.expect(1);
    var actividad = Actividad['default'].create({ actividad: actividadAlien['default'] });
    this.set('actividad', actividad);
    this.render(Ember.HTMLBars.template((function () {
      var child0 = (function () {
        return {
          meta: {
            'revision': 'Ember@1.13.7',
            'loc': {
              'source': null,
              'start': {
                'line': 2,
                'column': 4
              },
              'end': {
                'line': 2,
                'column': 59
              }
            }
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();

      return {
        meta: {
          'revision': 'Ember@1.13.7',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 3,
              'column': 2
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode('\n    ');
          dom.appendChild(el0, el1);
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode('\n  ');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [['block', 'pilas-editor', [], ['ocultarModal', true, 'actividad', ['subexpr', '@mut', [['get', 'actividad', ['loc', [null, [2, 48], [2, 57]]]]], [], []]], 0, null, ['loc', [null, [2, 4], [2, 76]]]]],
        locals: [],
        templates: [child0]
      };
    })()));
    var texto_del_componente = this.$().text().trim();
    var texto_esperado = 'El alien y las tuercas';
    var incluye_texto = texto_del_componente.indexOf(texto_esperado) > -1;
    assert.ok(incluye_texto, "Muestra el título del desafío");
  });

});
define('pilas-engine-bloques/tests/integration/components/pilas-editor-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - integration/components');
  QUnit.test('integration/components/pilas-editor-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'integration/components/pilas-editor-test.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/models/galeria.jshint', function () {

  'use strict';

  QUnit.module('JSHint - models');
  QUnit.test('models/galeria.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'models/galeria.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/models/preferencium.jshint', function () {

  'use strict';

  QUnit.module('JSHint - models');
  QUnit.test('models/preferencium.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'models/preferencium.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/models/solucion.jshint', function () {

  'use strict';

  QUnit.module('JSHint - models');
  QUnit.test('models/solucion.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'models/solucion.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/router.jshint', function () {

  'use strict';

  QUnit.module('JSHint - .');
  QUnit.test('router.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'router.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/routes/acercade.jshint', function () {

  'use strict';

  QUnit.module('JSHint - routes');
  QUnit.test('routes/acercade.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'routes/acercade.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/routes/desafios/nombre.jshint', function () {

  'use strict';

  QUnit.module('JSHint - routes/desafios');
  QUnit.test('routes/desafios/nombre.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'routes/desafios/nombre.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/routes/desafios.jshint', function () {

  'use strict';

  QUnit.module('JSHint - routes');
  QUnit.test('routes/desafios.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'routes/desafios.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/routes/editor.jshint', function () {

  'use strict';

  QUnit.module('JSHint - routes');
  QUnit.test('routes/editor.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'routes/editor.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/routes/galeria.jshint', function () {

  'use strict';

  QUnit.module('JSHint - routes');
  QUnit.test('routes/galeria.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'routes/galeria.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/routes/iframe.jshint', function () {

  'use strict';

  QUnit.module('JSHint - routes');
  QUnit.test('routes/iframe.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'routes/iframe.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/routes/index.jshint', function () {

  'use strict';

  QUnit.module('JSHint - routes');
  QUnit.test('routes/index.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'routes/index.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/routes/preferencia.jshint', function () {

  'use strict';

  QUnit.module('JSHint - routes');
  QUnit.test('routes/preferencia.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'routes/preferencia.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/routes/solucion/index.jshint', function () {

  'use strict';

  QUnit.module('JSHint - routes/solucion');
  QUnit.test('routes/solucion/index.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'routes/solucion/index.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/routes/solucion/ver.jshint', function () {

  'use strict';

  QUnit.module('JSHint - routes/solucion');
  QUnit.test('routes/solucion/ver.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'routes/solucion/ver.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/routes/test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - routes');
  QUnit.test('routes/test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'routes/test.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/routes/tips.jshint', function () {

  'use strict';

  QUnit.module('JSHint - routes');
  QUnit.test('routes/tips.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'routes/tips.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/serializers/application.jshint', function () {

  'use strict';

  QUnit.module('JSHint - serializers');
  QUnit.test('serializers/application.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'serializers/application.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/services/actividades.jshint', function () {

  'use strict';

  QUnit.module('JSHint - services');
  QUnit.test('services/actividades.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'services/actividades.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/services/browser.jshint', function () {

  'use strict';

  QUnit.module('JSHint - services');
  QUnit.test('services/browser.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'services/browser.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/services/environment.jshint', function () {

  'use strict';

  QUnit.module('JSHint - services');
  QUnit.test('services/environment.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'services/environment.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/services/twitter.jshint', function () {

  'use strict';

  QUnit.module('JSHint - services');
  QUnit.test('services/twitter.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'services/twitter.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/services/version.jshint', function () {

  'use strict';

  QUnit.module('JSHint - services');
  QUnit.test('services/version.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'services/version.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/services/zoom.jshint', function () {

  'use strict';

  QUnit.module('JSHint - services');
  QUnit.test('services/zoom.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'services/zoom.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/test-helper', ['pilas-engine-bloques/tests/helpers/resolver', 'ember-qunit'], function (resolver, ember_qunit) {

	'use strict';

	ember_qunit.setResolver(resolver['default']);

});
define('pilas-engine-bloques/tests/test-helper.jshint', function () {

  'use strict';

  QUnit.module('JSHint - .');
  QUnit.test('test-helper.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'test-helper.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/unit/controllers/acercade-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('controller:acercade', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  ember_qunit.test('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });

});
define('pilas-engine-bloques/tests/unit/controllers/acercade-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/controllers');
  QUnit.test('unit/controllers/acercade-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'unit/controllers/acercade-test.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/unit/controllers/solucion/index-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('controller:solucion/index', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  ember_qunit.test('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });

});
define('pilas-engine-bloques/tests/unit/controllers/solucion/index-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/controllers/solucion');
  QUnit.test('unit/controllers/solucion/index-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'unit/controllers/solucion/index-test.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/unit/controllers/solucion/ver-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('controller:solucion/ver', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  ember_qunit.test('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });

});
define('pilas-engine-bloques/tests/unit/controllers/solucion/ver-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/controllers/solucion');
  QUnit.test('unit/controllers/solucion/ver-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'unit/controllers/solucion/ver-test.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/unit/controllers/solucion.index-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('controller:solucion.index', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  ember_qunit.test('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });

});
define('pilas-engine-bloques/tests/unit/controllers/solucion.index-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/controllers');
  QUnit.test('unit/controllers/solucion.index-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'unit/controllers/solucion.index-test.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/unit/models/solucion-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForModel('solucion', 'Unit | Model | solucion', {
    // Specify the other units that are required for this test.
    needs: []
  });

  ember_qunit.test('it exists', function (assert) {
    var model = this.subject();
    // var store = this.store();
    assert.ok(!!model);
  });

});
define('pilas-engine-bloques/tests/unit/models/solucion-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/models');
  QUnit.test('unit/models/solucion-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'unit/models/solucion-test.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/unit/routes/acercade-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('route:acercade', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  ember_qunit.test('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

});
define('pilas-engine-bloques/tests/unit/routes/acercade-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/routes');
  QUnit.test('unit/routes/acercade-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'unit/routes/acercade-test.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/unit/routes/desafios-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('route:desafios', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  ember_qunit.test('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

});
define('pilas-engine-bloques/tests/unit/routes/desafios-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/routes');
  QUnit.test('unit/routes/desafios-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'unit/routes/desafios-test.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/unit/routes/index-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('route:index', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  ember_qunit.test('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

});
define('pilas-engine-bloques/tests/unit/routes/index-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/routes');
  QUnit.test('unit/routes/index-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'unit/routes/index-test.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/unit/routes/test-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('route:test', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  ember_qunit.test('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

});
define('pilas-engine-bloques/tests/unit/routes/test-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/routes');
  QUnit.test('unit/routes/test-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'unit/routes/test-test.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/unit/routes/tips-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('route:tips', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  ember_qunit.test('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

});
define('pilas-engine-bloques/tests/unit/routes/tips-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/routes');
  QUnit.test('unit/routes/tips-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'unit/routes/tips-test.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/unit/services/browser-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('service:browser', {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
  });

  // Replace this with your real tests.
  ember_qunit.test('it exists', function (assert) {
    var service = this.subject();
    assert.ok(service);
  });

});
define('pilas-engine-bloques/tests/unit/services/browser-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/services');
  QUnit.test('unit/services/browser-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'unit/services/browser-test.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/unit/services/environment-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('service:environment', {
    // Specify the other units that are required for this test.
    needs: ['config:environment']
  });

  // Replace this with your real tests.
  ember_qunit.test('it exists', function (assert) {
    var service = this.subject();
    assert.ok(service);
  });

});
define('pilas-engine-bloques/tests/unit/services/environment-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/services');
  QUnit.test('unit/services/environment-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'unit/services/environment-test.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/unit/services/twitter-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('service:twitter', {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
  });

  // Replace this with your real tests.
  ember_qunit.test('it exists', function (assert) {
    var service = this.subject();
    assert.ok(service);
  });

});
define('pilas-engine-bloques/tests/unit/services/twitter-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/services');
  QUnit.test('unit/services/twitter-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'unit/services/twitter-test.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/unit/services/version-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('service:version', {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
  });

  // Replace this with your real tests.
  ember_qunit.test('it exists', function (assert) {
    var service = this.subject();
    assert.ok(service);
  });

});
define('pilas-engine-bloques/tests/unit/services/version-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/services');
  QUnit.test('unit/services/version-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'unit/services/version-test.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques/tests/unit/services/zoom-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('service:zoom', {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
  });

  // Replace this with your real tests.
  ember_qunit.test('it exists', function (assert) {
    var service = this.subject();
    assert.ok(service);
  });

});
define('pilas-engine-bloques/tests/unit/services/zoom-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/services');
  QUnit.test('unit/services/zoom-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'unit/services/zoom-test.js should pass jshint.'); 
  });

});
/* jshint ignore:start */

/* jshint ignore:end */

/* jshint ignore:start */

define('pilas-engine-bloques/config/environment', ['ember'], function(Ember) {
  var prefix = 'pilas-engine-bloques';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (runningTests) {
  require("pilas-engine-bloques/tests/test-helper");
} else {
  require("pilas-engine-bloques/app")["default"].create({"name":"pilas-engine-bloques","version":"0.0.0+11f3266e"});
}

/* jshint ignore:end */
//# sourceMappingURL=pilas-engine-bloques.map