import Ember from 'ember';

export default Ember.Component.extend({
  iniciarBlockly: function() {
    var contenedor = this.$().find('#contenedor-blockly')[0];
    var bloques = ['move_to'];

    //obj.definir_bloques(bloques);
    //blockly.updateToolbox(obj._obtener_toolbox_como_string());

    function bloques_como_string() {
      var toolbox = '';
      toolbox += '<xml>';

      for (i in bloques) {
        toolbox += '  <block type="TIPO"></block>'.replace("TIPO", bloques[i]);
      }

      toolbox += '</xml>';

      return toolbox;
    }

    var toolbox = this.$().find('#toolbox')[0];



    Blockly.inject(contenedor, {
      path: './libs/blockly/',
      toolbox: toolbox,
      //bloques_como_string(),
    });

  }.on('didInsertElement'),
});
