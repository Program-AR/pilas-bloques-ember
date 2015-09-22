var pilasTestCfg;

var modulePilas = function(name,objectToRun){
    pilasTestCfg = {};
    pilasTestCfg.beforeEach = objectToRun.beforeEach || function(){};
    pilasTestCfg.afterEach = objectToRun.afterEach || function(){};
    pilasTestCfg.childs = 0;

    pilasTestCfg.runTest = function(){
        pilasTestCfg.beforeEach();
        pilasTestCfg.pilasTest(pilasTestCfg.assert);
        pilasTestCfg.afterTest();
    };

    pilasTestCfg.afterTest = function(){
        if(pilasTestCfg.childs <= 0){
            pilasTestCfg.afterEach();
            pilasTestCfg.done();
        }
    };

    module(name);
};

var testPilas = function(nombre,cantidadAsserts,funcion){
  test(nombre, function(assert) {
    pilasTestCfg.pilasTest = funcion;
    pilasTestCfg.assert = assert;
    pilasTestCfg.done = assert.async();
    expect(cantidadAsserts);

    pilas = new Pilas();
    pilas.iniciar({ancho: 420, alto: 480, data_path: '../src/data'});

    pilas.onready = function(){
        pilasTestCfg.runTest();
    };

    pilas.ejecutar();

  });

};

function ComportamDecorator(argumentos) {
  this.argumentos = argumentos;
}

ComportamDecorator.prototype = {
  iniciar: function(receptor) {
        this.comportamiento = new this.argumentos.comportamiento(this.argumentos.argumentos);
        this.comportamiento.iniciar(receptor);
  },

  actualizar: function() {
        var termino = this.comportamiento.actualizar();
        if (termino) this.argumentos.callback();
        return termino;
  },
};

var hacerLuegoConCallback = function(actor, claseComport, argumentos, callback){
    pilasTestCfg.childs ++;

    var nuevoCallback = function(){
        callback.bind(pilasTestCfg)();
        pilasTestCfg.childs --;
        pilasTestCfg.afterTest();
    }
    actor.hacer_luego(ComportamDecorator,
        {comportamiento: claseComport, callback: nuevoCallback, argumentos: argumentos});
}
