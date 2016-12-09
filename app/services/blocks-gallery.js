import Ember from 'ember';

export default Ember.Service.extend({
  blockly: Ember.inject.service(),

  start() {
    let blockly = this.get('blockly');

    this._generarLenguaje();
    this._definirBloqueAlIniciar();
    this._definirBloques();
  },

  _definirBloques() {
    let blockly = this.get('blockly');

    blockly.createCustomBlockWithHelper('PrenderCompu', {
      descripcion: 'Prender compu',
      icono: 'icono.computadora.png',

      comportamiento: 'PrenderCompuParaInstalar',
      argumentos: `{'etiqueta': 'CompuAnimada', 'mensajeError': 'No hay una compu aqui', 'idTransicion': 'prender', 'animacionColisionado': 'prendida', 'nombreAnimacion': 'escribir'}`,
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
      let codigo = `
      out_mensajes_configurados();
      ${programa}`;

      return codigo;
    };

  }
});
