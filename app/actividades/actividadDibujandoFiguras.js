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
            .appendField(this.obtener_icono('../libs/data/derecha.png'))
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
            .appendField(this.obtener_icono('../libs/data/derecha.png'))
            .appendField('Girar');
        block.appendDummyInput()
            .appendField('grados');
    },

    nombre_comportamiento() {
        return 'Rotar';
    },

    argumentos(block) {
        var grados = Blockly.JavaScript.valueToCode(block, 'grados', Blockly.JavaScript.ORDER_ATOMIC);
        return '{angulo: (-' + grados + ')}';
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

export default {
  nombre: 'Dibujando Figuras',
  enunciado: 'TODO',
  consignaInicial: 'TODO',
  id: 'DibujandoFiguras',
  // la escena proviene de ejerciciosPilas
  escena: DibujandoFiguras, // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,
  usaParametros: true,

  bloques: [Procedimiento,Repetir,Si,Sino,Hasta,DibujarLado, GirarGrados,Numero, OpAritmetica],
};
