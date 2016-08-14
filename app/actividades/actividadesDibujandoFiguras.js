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
  {
    id: 'DibujandoCuadrado'
  },
  {
    id: 'Dibujando5CuadradosHorizontal'
  },
  {
    id: 'Dibujando5CuadradosDiagonal'
  },
  {
    id: 'Dibujando4CuadradosInteriores'
  },
  {
    id: 'DibujandoCabezaElefante'
  },
  {
    id: 'DibujandoHexagono'
  },
  {
    id: 'DibujandoTrianguloEquilatero'
  },
  {
    id: 'DibujandoPoligonosInteriores'
  },
  {
    id: 'DibujandoCuevaEstalagtitas'
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
