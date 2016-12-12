import Ember from 'ember';

export default Ember.Service.extend({
  blockly: Ember.inject.service(),

  start() {
    this._generarLenguaje();
    this._definirBloqueAlIniciar();
    this._definirBloques();
    this._definirBloquesAlias();
    this._definirBloquesSensores();
  },

  /*
   * Método auxiliar para crear un bloque acción.
   *
   * El argumento 'opciones' tiene que definir estas propiedades:
   *
   *   - descripcion
   *   - icono
   *   - comportamiento
   *   - argumentos
   *
   */
  crearBloqueAccion(nombre, opciones) {
    let blockly = this.get('blockly');
    let opcionesObligatorias = ['descripcion',
                                'icono',
                                'comportamiento',
                                'argumentos'];

    this._validar_opciones_obligatorias(nombre, opciones, opcionesObligatorias);
    return blockly.createCustomBlockWithHelper(nombre, opciones);
  },

  /*
   * Método auxiliar para crear un bloque nuevo a partir de otro original.
   *
   * Este método sirve para crear bloques como 'Si', 'Repetir' etc... ya que
   * esos bloques en realidad se generan a partir de los bloques estándar
   * como 'controls_if'.
   */
  crearBloqueAlias(nombre, nombreDelBloqueOriginal) {
    let blockly = this.get('blockly');
    blockly.createAlias(nombre, nombreDelBloqueOriginal);
  },

  /*
   * Método auxiliar para crear un bloque que sirva como sensor.
   *
   * El argumento 'opciones' tiene que definir estas propiedades:
   *
   *   - descripcion
   *   - icono
   *   - funcionSensor
   *
   */
  crearBloqueSensor(nombre, opciones) {
    let blockly = this.get('blockly');
    let opcionesObligatorias = ['descripcion',
                                'icono',
                                'funcionSensor'];

    this._validar_opciones_obligatorias(nombre, opciones, opcionesObligatorias);
    let descripcion = `¿${opciones.descripcion}?`;

    return blockly.createCustomBlock(nombre, {
      message0: `%1 ¿${opciones.descripcion}?`,
      previousStatement: true,
      nextStatement: true,
      args0: [
        {
          type: "field_image",
          src: `iconos/${opciones.icono}`,
          width: 16,
          height: 16,
          alt: "*"
        }
      ],
      code: `receptor.${opciones.funcionSensor}`
    });
  },

  /*
   * Lanza una exception si un diccionario no presenta alguna clave obligatoria.
   */
  _validar_opciones_obligatorias(nombre, opciones, listaDeOpcionesObligatorias) {
    listaDeOpcionesObligatorias.forEach((opcion) => {
      if (!(opcion in opciones)) {
        throw new Error(`No se puede crear el bloque ${nombre} porque no se indicó un valor para la opción ${opcion}.`);
      }
    });
  },

  _definirBloques() {
    let blockly = this.get('blockly');

    this.crearBloqueAccion('PrenderCompu', {
      descripcion: 'Prender compu',
      icono: 'icono.computadora.png',
      comportamiento: 'PrenderCompuParaInstalar',
      argumentos: `{'etiqueta': 'CompuAnimada', 'mensajeError': 'No hay una compu aqui', 'idTransicion': 'prender', 'animacionColisionado': 'prendida', 'nombreAnimacion': 'escribir'}`,
    });

    blockly.createCustomBlockWithHelper('ApretarBoton', {
      descripcion: 'Apretar botón',
      icono: 'iconos.botonRojo.png',
      comportamiento: 'DesencadenarAnimacionSiColisiona',
      argumentos: '{\'animacionColisionado\':\'prendida\',\'nombreAnimacion\':\'apretar\',\'etiqueta\':\'BotonAnimado\',\'mensajeError\': \'No hay un botón aquí\',\'idTransicion\':\'apretarBoton\'}',
    });

    blockly.createCustomBlockWithHelper('EncenderLuz', {
      descripcion: 'Prender la luz',
      icono: 'icono.Lamparita.png',
      comportamiento: 'EncenderPorEtiqueta',
      argumentos: "{'etiqueta':'Luz'}"
    });

    blockly.createCustomBlockWithHelper('ComerBanana', {
      descripcion: 'Comer banana',
      icono: 'iconos.banana.png',
      comportamiento: 'RecogerPorEtiqueta',
      argumentos: '{\'etiqueta\' : \'BananaAnimada\',  nombreAnimacion: "comerBanana"}',
    });

    blockly.createCustomBlockWithHelper('ComerManzana', {
      descripcion: 'Comer manzana',
      icono: 'iconos.manzana.png',
      comportamiento: 'RecogerPorEtiqueta',
      argumentos: '{\'etiqueta\' : \'ManzanaAnimada\',  nombreAnimacion: "comerManzana"}',
    });

    blockly.createCustomBlockWithHelper('ComerQueso', {
      descripcion: 'Comer queso',
      icono: 'queso.png',
      comportamiento: 'RecogerPorEtiqueta',
      argumentos: '{\'etiqueta\' : \'QuesoAnimado\'}',
    });

    blockly.createCustomBlockWithHelper('ComerNaranja', {
      descripcion: 'Comer naranja',
      icono: 'naranja.png',
      comportamiento: 'RecogerPorEtiqueta',
      argumentos: '{\'etiqueta\' : \'NaranjaAnimada\',  nombreAnimacion: "comerNaranja"}',
    });

    blockly.createCustomBlockWithHelper('IrDerecha', {
      descripcion: 'Mover a la derecha',
      icono: 'derecha.png',
      comportamiento: 'MoverACasillaDerecha',
      argumentos: '{}',
    });

  },

  _definirBloquesAlias() {
    this.crearBloqueAlias('Si', 'controls_if');
  },

  _definirBloquesSensores() {

    this.crearBloqueSensor('TocandoBanana', {
      id: 'Tocandobanana',
      descripcion: 'Hay banana acá',
      icono: 'iconos.banana.png',
      funcionSensor: 'tocando("BananaAnimada")',
    });

  },

  _definirBloqueAlIniciar() {

    Blockly.Blocks['al_empezar_a_ejecutar'] = {
      init: function() {
        this.setColour(200);

        this.appendDummyInput().appendField('Al empezar a ejecutar');

        this.appendStatementInput('program');
        this.setDeletable(false);

        this.setEditable(false);
        this.setMovable(false);
      }
    };

  },

  _generarLenguaje() {
    Blockly.MyLanguage = Blockly.JavaScript;
    Blockly.MyLanguage.addReservedWords('main', 'hacer', 'out_hacer');

    Blockly.MyLanguage['al_empezar_a_ejecutar'] = function(block) {
      let programa = Blockly.JavaScript.statementToCode(block, 'program');
      let codigo = `${programa}`;
      return codigo;
    };

    Blockly.MyLanguage.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
    Blockly.MyLanguage.addReservedWords('highlightBlock');
  }
});
