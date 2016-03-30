import bloques from 'pilas-engine-bloques/actividades/bloques';

var {Accion, Si, Repetir, Hasta, Procedimiento, ParamValor} = bloques;

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
                valor: '10'
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
  procedimientos: [Procedimiento],

  // TODO: aca irian atributos iniciales que se desean para un personaje
  variables: [],
  usaParametros: true,
  control: [Si,Repetir,Hasta],
  expresiones: [],
  acciones: [DibujarLado],
  sensores: [],
};
