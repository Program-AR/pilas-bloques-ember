
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

var Comandos = new Categoria('Comandos');

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

var Expresiones = new Categoria('Expresiones');

var MisFunciones = new Categoria('Mis funciones');

var Separador = new Categoria('Separador');
Separador.generarXML = function(bloques){ // jshint ignore: line
    return '<sep></sep>';
};

export {
      Comandos,
      MisProcedimientos,
      Control,
      Separador,
      Variables,
      Sensores,
      Expresiones,
      MisFunciones,
    };
