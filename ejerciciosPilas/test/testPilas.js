var pilasTestCfg;
var modulePilas = function(name,objectToRun){
     pilasTestCfg = {};
     pilasTestCfg.beforeEach = objectToRun.beforeEach || function(){};
     pilasTestCfg.afterEach = objectToRun.afterEach || function(){};
     module(name);
};

var testPilas = function(nombre,cantidadAsserts,funcion){
  test(nombre, function(assert) {
    pilasTestCfg.pilasTest = funcion;
    var done = assert.async();
    expect(cantidadAsserts);

    pilas = new Pilas();
    pilas.iniciar({ancho: 420, alto: 480, data_path: '../src/data'});

    pilas.onready = function(){
        pilasTestCfg.beforeEach();
        pilasTestCfg.pilasTest(assert);
        pilasTestCfg.afterEach();
        done();
    };

    pilas.ejecutar();

  });

};