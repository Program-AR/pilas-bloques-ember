import Bloque from 'pilas-engine-bloques/actividades/bloque';


var ExpresionDeBlockly = Bloque.extend({

  registrar_en_blockly() {
    // pisado porque ya viene con blockly
    // ni tampoco quiero modificar el javascript
  }

});

var Numero = ExpresionDeBlockly.extend({
  init() {
    this._super();
    this.set('id', 'math_number');
  },
});

var OpAritmetica = ExpresionDeBlockly.extend({
  init() {
    this._super();
    this.set('id', 'math_arithmetic');
  },
});

var Booleano = ExpresionDeBlockly.extend({
  init() {
    this._super();
    this.set('id', 'logic_boolean');
  },
});

var OpComparacion = ExpresionDeBlockly.extend({
  init() {
    this._super();
    this.set('id', 'logic_compare');
  },
});

var OpLogica = ExpresionDeBlockly.extend({
  init() {
    this._super();
    this.set('id', 'logic_operation');
  },
});

var OpNegacion = ExpresionDeBlockly.extend({
  init() {
    this._super();
    this.set('id', 'logic_negate');
  },
});


var expresiones = {
  ExpresionDeBlockly, Numero, OpAritmetica, Booleano,
  OpComparacion, OpLogica, OpNegacion
};


export default expresiones;
