module('Cuadricula Esparsa Test');




test('Constructor', function(assert) {
  this.cantidadFilas=5;
  this.cantidadColumnas=6;
  var matriz= [
    ['T','T','T','T','T','T'],
    ['T','F','F','F','F','T'],
    ['T','T','T','T','T','T'],
    ['T','F','F','F','F','T'],
    ['T','T','T','T','T','T']];

  this.cuadricula = new CuadriculaEsparsa(0,0,{alto: 100},{grilla:'invisible.png',cantColumnas: 1},matriz);
  assert.ok(this.cuadricula.casillas.length==22);

});

test('Direcciones', function(assert) {
  this.cantidadFilas=5;
  this.cantidadColumnas=6;
  var matriz= [
    ['T','T','T','T','T','T'],
    ['T','F','F','F','F','T'],
    ['T','T','T','T','T','T'],
    ['T','F','F','F','F','T'],
    ['T','T','T','T','T','T']];

  this.cuadricula = new CuadriculaEsparsa(0,0,{alto: 100},{grilla:'invisible.png',cantColumnas: 1},matriz);

    /*Cuatro esquinas*/
    //izquierda arriba
    var casilla=this.cuadricula.casilla(0,0);
    assert.ok(!this.cuadricula.hayArriba(casilla));
    assert.ok(this.cuadricula.hayAbajo(casilla));
    assert.ok(!this.cuadricula.hayIzquierda(casilla));
    assert.ok(this.cuadricula.hayDerecha(casilla));

    //izquierda abajo
    var casilla=this.cuadricula.casilla(4,0);
    assert.ok(this.cuadricula.hayArriba(casilla));
    assert.ok(!this.cuadricula.hayAbajo(casilla));
    assert.ok(!this.cuadricula.hayIzquierda(casilla));
    assert.ok(this.cuadricula.hayDerecha(casilla));

    //derecha arriba
    var casilla=this.cuadricula.casilla(0,5);
    assert.ok(!this.cuadricula.hayArriba(casilla));
    assert.ok(this.cuadricula.hayAbajo(casilla));
    assert.ok(this.cuadricula.hayIzquierda(casilla));
    assert.ok(!this.cuadricula.hayDerecha(casilla));

    //derecha abajo
    var casilla=this.cuadricula.casilla(4,5);
    assert.ok(this.cuadricula.hayArriba(casilla));
    assert.ok(!this.cuadricula.hayAbajo(casilla));
    assert.ok(this.cuadricula.hayIzquierda(casilla));
    assert.ok(!this.cuadricula.hayDerecha(casilla));


    var casilla=this.cuadricula.casilla(1,0);
    //assert.equal(this.cuadricula.hayIzquierda(casilla),false);
    assert.ok(this.cuadricula.hayArriba(casilla));
    assert.ok(this.cuadricula.hayAbajo(casilla));
    assert.ok(!this.cuadricula.hayIzquierda(casilla));
    assert.ok(!this.cuadricula.hayDerecha(casilla));

    var casilla=this.cuadricula.casilla(2,2);
    //assert.equal(this.cuadricula.hayIzquierda(casilla),false);
    assert.ok(!this.cuadricula.hayArriba(casilla));
    assert.ok(!this.cuadricula.hayAbajo(casilla));
    assert.ok(this.cuadricula.hayIzquierda(casilla));
    assert.ok(this.cuadricula.hayDerecha(casilla));

});
