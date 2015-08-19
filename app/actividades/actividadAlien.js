import bloques from 'pilas-engine-bloques/actividades/bloques';
var {Accion, Sensor, Repetir,Si,Procedimientos} = bloques;


var EscenaAlien = (function (_super) {
    __extends(EscenaAlien, _super);     // jshint ignore:line
    function EscenaAlien() {            // jshint ignore:line
      _super.apply(this, arguments);
    }

    EscenaAlien.prototype.coord_grilla = function(fila, columna) {
      var columnas = [-175, -105, -35, 35, 105, 175];
      var filas = [140, 60, -20, -100, -180];

      return {x: columnas[columna-1], y: filas[fila-1]};
    };

    EscenaAlien.prototype.iniciar = function() {

      new pilas.fondos.Laberinto1();
      var alien = new pilas.actores.Alien(-175, -180);

      this.automata = alien;

      // metodo para ver si choca con tuerca
      alien.choca_con_tuerca = function() {
        var actores = pilas.obtener_actores_en(alien.x, alien.y + 20, 'Tuerca');
        return actores.length > 0;
      };

      alien.cuando_busca_recoger = function() {
        var actores = pilas.obtener_actores_en(alien.x, alien.y + 20, 'Tuerca');
        if (actores.length > 0) {
          var mensaje = '';
          actores[0].eliminar();
          var restantes = pilas.obtener_actores_con_etiqueta('Tuerca').length;

          if (restantes > 0) {
            mensaje = 'genial, aún quedan: ' + restantes;
          } else {
            mensaje = '¡Nivel completado!';
          }

          // alien.decir(mensaje);
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
    };

    return EscenaAlien;
})(Base);


var IrDerecha = Accion.extend({

  init() {
    this._super();
    this.set('id', 'ir_derecha');
  },

  block_init(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField(this.obtener_icono('derecha.png'))
         .appendField('ir derecha');
  },

  nombre_comportamiento() {
    return 'MoverHaciaDerecha';
  },

  argumentos() {
    return '{cantidad: 68, tiempo: 1}';
  }

});

var IrIzquierda = Accion.extend({

  init() {
    this._super();
    this.set('id', 'ir_izquierda');
  },

  block_init(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField(this.obtener_icono('izquierda.png'))
         .appendField('ir izquierda');
  },

  nombre_comportamiento() {
    return 'MoverHaciaIzquierda';
  },

  argumentos() {
    return '{cantidad: 68, tiempo: 1}';
  }

});


var IrArriba = Accion.extend({

  init() {
    this._super();
    this.set('id', 'ir_arriba');
  },

  block_init(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField(this.obtener_icono('arriba.png'))
         .appendField('ir arriba');
  },

  nombre_comportamiento() {
    return 'MoverHaciaArriba';
  },

  argumentos() {
    return '{cantidad: 80, tiempo: 1}';
  }

});


var IrAbajo = Accion.extend({

  init() {
    this._super();
    this.set('id', 'ir_abajo');
  },

  block_init(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField(this.obtener_icono('abajo.png'))
         .appendField('ir abajo');
  },

  nombre_comportamiento() {
    return 'MoverHaciaAbajo';
  },

  argumentos() {
    return '{cantidad: 80, tiempo: 1}';
  }

});

var Recoger = Accion.extend({

  init() {
    this._super();
    this.set('id', 'recoger');
  },

  block_init(block) {
    this._super(block);
    block.appendDummyInput()
        .appendField('recoger')
        .appendField(new Blockly.FieldImage('libs/data/tuerca.png', 16, 16, 'tuerca'));
  },

  nombre_comportamiento() {
    return 'Recoger';
  },

  argumentos() {
    return '{tiempo: 1}';
  }

});




var ChocaConTuerca = Sensor.extend({
  init() {
    this._super();
    this.set('id', 'choca_con_tuerca');
  },

  block_init(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField('choca con')
         .appendField(new Blockly.FieldImage('libs/data/tuerca.png', 15, 15, 'tuerca'));
  },

  nombre_sensor() {
    return 'choca_con_tuerca()';
  }
});


var actividadAlien = {
  nombre: 'El alien y las tuercas',
  enunciado: 'Define un programa para que el alien junte todas las tuercas',

  escena: EscenaAlien,
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,
  subtareas: [Procedimientos],

  // TODO: aca irian atributos iniciales que se desean para un personaje
  variables: [],

  control: [Repetir,Si],
  expresiones: [],
  acciones: [IrDerecha, IrIzquierda, IrArriba, IrAbajo, Recoger],
  sensores: [ChocaConTuerca]
};

export default actividadAlien;
