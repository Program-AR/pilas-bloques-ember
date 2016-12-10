import Ember from 'ember';

export default Ember.Service.extend({
  blockly: Ember.inject.service(),

  start() {
    let blockly = this.get('blockly');

    this._generarLenguaje();
    this._definirBloqueAlIniciar();
    this._definirBloques();
    this._definirBloquesAlias();
  },

  _definirBloques() {
    let blockly = this.get('blockly');

    blockly.createCustomBlockWithHelper('PrenderCompu', {
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
  },

  _definirBloquesAlias() {
    let blockly = this.get('blockly');

    blockly.createAlias('Si', 'controls_if');
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
      let codigo = `
      out_mensajes_configurados();
      ${programa}`;

      return codigo;
    };

  }
});
