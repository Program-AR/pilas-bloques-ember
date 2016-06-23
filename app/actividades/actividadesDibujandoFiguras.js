import bloques from 'pilas-engine-bloques/actividades/bloques';
import {Numero, OpAritmetica} from 'pilas-engine-bloques/actividades/expresiones';

var {Accion, Repetir, Si, Sino, Hasta, Procedimiento, ParamValor} = bloques;

var DibujarLado = Accion.extend({
    init() {
        this._super();
        this.set('id', 'DibujarLado');
    },

    block_init(block) {
        this._super(block);
        block.appendValueInput('longitud')
            .setCheck('Number')
            .appendField(this.obtener_icono('../libs/data/icono.DibujarLinea.png'))
            .appendField('Dibujar lado de ');
    },

    nombre_comportamiento() {
        return 'DibujarHaciaAdelante';
    },

    argumentos(block) {
        var longitud = Blockly.JavaScript.valueToCode(block, 'longitud', Blockly.JavaScript.ORDER_ATOMIC);
        return '{distancia: (' + longitud + '), voltearAlIrAIzquierda: false}';
    },

    get_parametros() {
        return [
            ParamValor.create({
                nombre_param: 'longitud',
                tipo_bloque: 'math_number',
                nombre_valor: 'NUM',
                valor: '100'
            })
        ];
    }
});

var GirarGrados = Accion.extend({
    init() {
        this._super();
        this.set('id', 'GirarGrados');
    },

    block_init(block) {
        this._super(block);
        block.appendValueInput('grados')
            .setCheck('Number')
            .appendField(this.obtener_icono('../libs/data/icono.Girar.png'))
            .appendField('Girar');
        block.appendDummyInput()
            .appendField('grados');
    },

    nombre_comportamiento() {
        return 'Rotar';
    },

    argumentos(block) {
        var grados = Blockly.JavaScript.valueToCode(block, 'grados', Blockly.JavaScript.ORDER_ATOMIC);
        return '{angulo: (-(' + grados + '))}';
    },

    get_parametros() {
        return [
            ParamValor.create({
                nombre_param: 'grados',
                tipo_bloque: 'math_number',
                nombre_valor: 'NUM',
                valor: '45'
            })
        ];
    }
});

// ---------------------------------------------------------------------------
var actividadesDibujando = [
  { nombre: 'Dibujando: Al cuadrado',
    enunciado: 'TODO',
    consignaInicial: 'TODO',
    id: 'DibujandoCuadrado',
    escena: DibujandoCuadrado, // jshint ignore:line
  },
  { nombre: 'Dibujando: Rayuela robótica',
    enunciado: 'TODO',
    consignaInicial: 'TODO',
    id: 'Dibujando5CuadradosHorizontal',
    escena: Dibujando5CuadradosHorizontal, // jshint ignore:line
  },
  { nombre: 'Dibujando: Corto por la diagonal',
    enunciado: 'TODO',
    consignaInicial: 'TODO',
    id: 'Dibujando5CuadradosDiagonal',
    escena: Dibujando5CuadradosDiagonal, // jshint ignore:line
  },
  { nombre: 'Dibujando: Mamushka cuadrada',
    enunciado: 'TODO',
    consignaInicial: 'TODO',
    id: 'Dibujando4CuadradosInteriores',
    escena: Dibujando4CuadradosInteriores, // jshint ignore:line
  },
  { nombre: 'Dibujando: Escalera cuadrada',
    enunciado: 'TODO',
    consignaInicial: 'TODO',
    id: 'DibujandoCabezaElefante',
    escena: DibujandoCabezaElefante, // jshint ignore:line
  },
  { nombre: 'Dibujando: Hexágono',
    enunciado: 'TODO',
    consignaInicial: 'TODO',
    id: 'DibujandoHexagono',
    escena: DibujandoHexagono, // jshint ignore:line
  },
  { nombre: 'Dibujando: Pirámide invertida',
    enunciado: 'TODO',
    consignaInicial: 'TODO',
    id: 'DibujandoTrianguloEquilatero',
    escena: DibujandoTrianguloEquilatero, // jshint ignore:line
  },
  { nombre: 'Dibujando: Figuras dentro de figuras',
    enunciado: 'TODO',
    consignaInicial: 'TODO',
    id: 'DibujandoPoligonosInteriores',
    escena: DibujandoPoligonosInteriores, // jshint ignore:line
  },
  { nombre: 'Dibujando: La cueva de estalagtitas',
    enunciado: 'TODO',
    consignaInicial: 'TODO',
    id: 'DibujandoCuevaEstalagtitas',
    escena: DibujandoCuevaEstalagtitas, // jshint ignore:line
  },
];


actividadesDibujando.forEach(function(act){
  act.puedeComentar = false;
  act.puedeDesactivar = false;
  act.puedeDuplicar = false;
  act.usaParametros = true;
  act.bloques = [Procedimiento,Repetir,Si,Sino,Hasta,DibujarLado, GirarGrados,Numero, OpAritmetica];
});

export default actividadesDibujando;
