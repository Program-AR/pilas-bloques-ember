testPilas = function(nombre,cantidadAsserts,funcion){

  test(nombre, function(assert) {
    var done = assert.async();
    expect(cantidadAsserts);

    pilas = new Pilas();
    pilas.iniciar({ancho: 420, alto: 480, data_path: '../src/data'});

    pilas.onready = function(){
        funcion(assert);
        done();
    };

    pilas.ejecutar();

  });

};
