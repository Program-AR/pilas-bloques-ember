import Ember from 'ember';

/*
 * Representa un bloque
 * para el lenguaje de la actividad
 */
var Bloque = Ember.Object.extend({
  build: function() {
    var str_block = '';
    str_block += '<block type="TIPO">'.replace('TIPO', this.get('tipo'));

    this.get('parametros').forEach(function(item) {
       str_block += item.build();
    });

    str_block += '</block>';
    return str_block;
  }
});

/*
 * Representa el valor
 * de un campo string de un bloque
 */
var ParamCampo = Ember.Object.extend({
   build: function() {
     var str_block = '';
     str_block += '<field name="NOMBRE">'.replace('NOMBRE', this.get('nombre_valor'));
     str_block += this.get('valor');
     str_block += '</field>';
     return str_block;
   }
});

/*
 * Representa un valor mas complejo
 * de un campo de un bloque
 */
var ParamValor = Ember.Object.extend({
   build: function() {
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

/*
 * Representa el lenguaje que podra utilizarse
 * en una actividad
 */
var Lenguaje = Ember.Object.extend({

  init: function() {
    var bloques = {};
    this.get('categorias').forEach(function(i) {
      bloques[i] = [];
    });
    this.set('bloques', bloques);
  },

  bloque: function(categoria, nombre, params) {
    var nuevo_bloque = Bloque.create({
      tipo: nombre,
      parametros: params || []
    });

    this.get('bloques')[categoria].pushObject(nuevo_bloque);
  },

  build: function() {
    var str_toolbox = '';

    str_toolbox += '<xml>';

    this.get('categorias').forEach(function(item) {
      if(item === 'Subtareas') {
        str_toolbox += this._build_subtareas();
      } else if (item === 'Variables') {
        str_toolbox += this._build_variables();
      } else {
        str_toolbox += this._build_categoria(item);
      }
    }.bind(this));

    str_toolbox += '</xml>';

    return str_toolbox;
  },

  _build_categoria: function(categoria) {
   var str_category = '';

   str_category += '<category name="x">\n'.replace('x', categoria);

   this.get('bloques')[categoria].forEach(function(b) {
       str_category += b.build();
   });

   str_category += '</category>\n';

   return str_category;
  },


  _build_subtareas: function() {
    return '<category name="Subtareas" custom="PROCEDURE"></category>';
  },

  _build_variables: function() {
    return '<category name="Variables" custom="VARIABLE"></category>';
  }

});

/**
  Modelo de actividad
**/
var Actividad = Ember.Object.extend({
  init: function() {
    this.set('puedeDuplicar', false);
    this.set('puedeDesactivar', false);
    this.set('puedeComentar', false);
  },

  construirLenguaje: function() {
    return this.getLenguaje().build();
  }

  // definir en subclases
  // iniciarEscena
  // getLenguaje
});

var ActividadAlien = Actividad.extend({

  init: function() {
    this._super();
    this.set('nombre', 'El alien y las tuercas');
    this.set('enunciado', 'Define un programa para que el alien junte todas las tuercas');
    this.set('tuercas_recolectadas', 0);
  },

  coord_grilla: function(fila, columna) {
    var columnas = [-175, -105, -35, 35, 105, 175];
    var filas = [140, 60, -20, -100, -180];

    return {x: columnas[columna-1], y: filas[fila-1]};
  },

  iniciarEscena: function() {
    pilas.reiniciar();

    var fondo = new pilas.fondos.Laberinto1();
    var alien = new pilas.actores.Alien(-175, -180);

    window.alien = alien;
    window.fondo = fondo;

    var actividad = this;

    this.set('tuercas_recolectadas', 0);

    alien.cuando_busca_recoger = function() {
      var actores = pilas.obtener_actores_en(alien.x, alien.y + 20, 'Tuerca');

      if (actores.length > 0) {
        var mensaje = '';
        actores[0].eliminar();
        var restantes = pilas.obtener_actores_con_etiqueta('Tuerca').length;

        actividad.incrementProperty('tuercas_recolectadas');

        if (restantes > 0) {
          mensaje = 'genial, aún quedan: ' + restantes;
        } else {
          mensaje = '¡Nivel completado!';
        }

        //alien.decir(mensaje);
        //console.log(mensaje);
      }
    };

    var posicion = this.coord_grilla(1, 1);
    new pilas.actores.Tuerca(posicion.x, posicion.y);

    posicion = this.coord_grilla(2, 2);
    new pilas.actores.Tuerca(posicion.x, posicion.y);

    posicion = this.coord_grilla(3, 3);
    new pilas.actores.Tuerca(posicion.x, posicion.y);

    posicion = this.coord_grilla(4, 4);
    new pilas.actores.Tuerca(posicion.x, posicion.y);

    posicion = this.coord_grilla(5, 5);
    new pilas.actores.Tuerca(posicion.x, posicion.y);
  },

  getLenguaje: function() {

    var leng = Lenguaje.create({
       categorias: ['Acciones', 'Sensores', 'Control', 'Expresiones', 'Variables', 'Subtareas']
    });

    leng.bloque('Acciones', 'alien-ir_derecha');
    leng.bloque('Acciones', 'alien-ir_izquierda');
    leng.bloque('Acciones', 'alien-ir_arriba');
    leng.bloque('Acciones', 'alien-ir_abajo');
    leng.bloque('Acciones', 'alien-recoger');
    leng.bloque('Sensores', 'choca_con_tuerca');

    leng.bloque('Control', 'repetir', [
      ParamValor.create({
        nombre_param: 'count',
        tipo_bloque: 'math_number',
        nombre_valor: 'NUM',
        valor: '10'
      })
    ]);

    leng.bloque('Control', 'si');
    leng.bloque('Control', 'sino');
    leng.bloque('Control', 'hasta');

    leng.bloque('Expresiones', 'math_number');
    leng.bloque('Expresiones', 'math_arithmetic');
    leng.bloque('Expresiones', 'logic_boolean');
    leng.bloque('Expresiones', 'logic_compare');
    leng.bloque('Expresiones', 'logic_operation');
    leng.bloque('Expresiones', 'logic_negate');

    return leng;

  }
});

var Actividades = {
  Alien: ActividadAlien,
};

export default Actividades;
