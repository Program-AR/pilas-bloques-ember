
var Categoria = function(nombre){
  this.nombre = nombre;
};
Categoria.prototype =  {
  generarXML: function(clasesBloques){
    var misBloques = clasesBloques.filter(b => b.categoria() === this);
    if(misBloques.length > 0) {
      return this.doGenerarXML(misBloques);
    }

    return '';
  },

  doGenerarXML(clasesBloques){ //Template method
    var str_category = ('<category name="x" ' + this.atributosExtra() + '>\n').replace('x', this.nombre);
    clasesBloques.forEach(b => str_category += b.build());
    return str_category + '</category>\n';
  },

  atributosExtra(){
    return '';
  }
};

var Comandos = new Categoria('Primitivas');

var MisProcedimientos = new Categoria('Mis procedimientos');
MisProcedimientos.atributosExtra = function(){
    return 'custom="PROCEDURE"';
};

var Repeticiones = new Categoria('Repeticiones');

var Alternativas = new Categoria('Alternativas');

var Variables = new Categoria('Variables');
/* TODO: Desactivado porque blockly trata diferente a estas cosas,
  y no puedo meter variables ya creadas, con sólo sus getters.
  Esto está en blockly/core/variables.js en Blockly.Variables.flyoutCategory
Variables.atributosExtra = function(){
    return 'custom="VARIABLE"';
};
*/
var Sensores = new Categoria('Sensores');

var Operadores = new Categoria('Operadores');

var Valores = new Categoria('Valores');

var MisFunciones = new Categoria('Mis funciones');

var Separador = new Categoria('Separador');
Separador.generarXML = function(bloques){ // jshint ignore: line
    return '<sep></sep>';
};

// TODO: repite código con Categoria
var Titulo = function(titulo, categorias) {
  var cat = new Categoria(titulo);
  cat.generarXML = function(bloques){ // jshint ignore: line
    var str_category = '<category name="x" expanded="true">\n'.replace('x', this.nombre);
    var sinCategorias = str_category;
    categorias.forEach(c => str_category += c.generarXML(bloques));
    // si no se agregaron categorías, no genero nada:
    return sinCategorias !== str_category ? str_category + '</category>\n' : '';
  };
  return cat;
};

export {
      Comandos,
      MisProcedimientos,
      Repeticiones, Alternativas,
      Separador,
      Variables,
      Valores,
      Sensores,
      Operadores,
      MisFunciones,
      Titulo };
