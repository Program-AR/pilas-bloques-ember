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
    enunciado: 'Dibujá un cuadrado que tenga 100 de lado.',
    id: 'DibujandoCuadrado',
    escena: DibujandoCuadrado, // jshint ignore:line
  },
  { nombre: 'Dibujando: Rayuela robótica',
    enunciado: 'Dibujá 5 cuadrados en fila, cada uno de lado 50, como muestra la figura sombreada. Pista: podés usar el procedimiento para dibujar cuadrado que ya te damos hecho.',
    id: 'Dibujando5CuadradosHorizontal',
    escena: Dibujando5CuadradosHorizontal, // jshint ignore:line
  },
  { nombre: 'Dibujando: Corto por la diagonal',
    enunciado: 'Dibujá 5 cuadrados en diagonal, cada uno de lado 50, como muestra la figura sombreada.',
    id: 'Dibujando5CuadradosDiagonal',
    escena: Dibujando5CuadradosDiagonal, // jshint ignore:line
  },
  { nombre: 'Dibujando: Mamushka cuadrada',
    enunciado: 'Dibujá 4 cuadrados de lados 50, 100, 150 y 200, como muestra la figura sombreada. Pista: creá un procedimiento nuevo para dibujar cuadrados de cualquier longitud de lado.',
    consignaInicial: 'Incluir parámetros en los procedimientos permite generalizar un concepto. Por ejemplo, la longitud del lado de un cuadrado.',
    id: 'Dibujando4CuadradosInteriores',
    escena: Dibujando4CuadradosInteriores, // jshint ignore:line
  },
  { nombre: 'Dibujando: Escalera cuadrada',
    enunciado: 'Dibujá 5 cuadros de lado 50 y uno de 100, como muestra la figura sombreada. Pista: podés mirar y usar el procedimiento parametrizado para dibujar un cuadro de cualquier longitud de lado.',
    consignaInicial: 'Al crear un procedimiento con parámetros, sus valores no están definidos (por ej. "longitud de lado"). Al usar los procedimientos hay que darles un valor concreto a esos parámetros (50, 150, etc.).',
    id: 'DibujandoCabezaElefante',
    escena: DibujandoCabezaElefante, // jshint ignore:line
  },
  { nombre: 'Dibujando: Hexágono',
    enunciado: 'Dibujá un hexágono de lado 100, como muestra la figura sombreada. Pista: pensá cuántos grados debe girar el robot sabiendo cuánto miden los ángulos internos del hexágono.',
    consignaInicial: 'En los polígonos, el valor de un ángulo externo es igual a 180 menos el valor de un ángulo interno.',
    id: 'DibujandoHexagono',
    escena: DibujandoHexagono, // jshint ignore:line
  },
  { nombre: 'Dibujando: Pirámide invertida',
    enunciado: 'Dibujá un triángulo equilátero de lado 100, como muestra la figura sombreada. Pista: pensá si existe una relación entre los ángulos y la cantidad de lados.',
    consignaInicial: 'En los polígonos, la suma de todos los ángulos externos es 360.',
    id: 'DibujandoTrianguloEquilatero',
    escena: DibujandoTrianguloEquilatero, // jshint ignore:line
  },
  { nombre: 'Dibujando: Figuras dentro de figuras',
    enunciado: 'Dibujá un triángulo, un cuadrado y un hexágono de lados 100, como muestra la figura sombreada. Pista: creá un procedimiento con un parámetro para la cantidad de lados.',
    consignaInicial: 'Para agregar un parámetro a un procedimiento nuevo, hay que hacer clic en la estrella que aparece al lado de "Definir" y luego arrastrar el bloque "nombre de entrada" a "entradas".',
    id: 'DibujandoPoligonosInteriores',
    escena: DibujandoPoligonosInteriores, // jshint ignore:line
  },
  { nombre: 'Dibujando: La cueva de estalagtitas',
    enunciado: 'Dibujá 3 triángulos de lados 40, 60 y 100, y un cuadrado de lado 100, como muestra la figura sombreada. Pista: creá un procedimiento con 2 parámetros, uno para la cantidad de lados y otro para la longitud de los lados.',
    consignaInicial: 'Para poder usar los parámetros en un nuevo procedimiento, hay que hacer clic derecho en el bloque que define dicho procedimiento.',
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
