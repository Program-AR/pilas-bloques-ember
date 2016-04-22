
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

  doGenerarXML(clasesBloques){
    var str_category = '<category name="x">\n'.replace('x', this.nombre);
    clasesBloques.forEach(b => str_category += b.build());
    return str_category + '</category>\n';
  }
};

var Comandos = new Categoria('Primitivas');

var MisProcedimientos = new Categoria('Mis procedimientos');
MisProcedimientos.doGenerarXML = function(bloques){ // jshint ignore: line
    return '<category name="'+ this.nombre +'" custom="PROCEDURE"></category>';
};

var Control = new Categoria('Control');

var Variables = new Categoria('Variables');
Variables.doGenerarXML = function(bloques){ // jshint ignore: line
    return '<category name="'+ this.nombre +'" custom="VARIABLE"></category>';
};

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
    var str_category = '<category name="x">\n'.replace('x', this.nombre);
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
      Control,
      Separador,
      Variables,
      Valores,
      Sensores,
      Operadores,
      MisFunciones,
      Titulo };
