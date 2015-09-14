testPilas('Reubicar casilla',8, function(assert) {
      var cuadricula = new Cuadricula(0, 0, 3, 5,
        { alto: 300, ancho: 200 },
        //implica casilla.ancho==40 && casilla.alto==100
        { grilla: 'invisible.png', cantColumnas: 1 });

      var casilla = cuadricula.casilla(1,2);
      var casilla2 = cuadricula.casilla(0,0);
      cuadricula.setAlto(150);
      cuadricula.setAncho(100);
      assert.equal(casilla.alto,50,"Alto casilla");
      assert.equal(casilla.ancho,20);
      assert.equal(casilla2.alto,50);
      assert.equal(casilla2.ancho,20);
      assert.equal(casilla.x,0);
      assert.equal(casilla.y,0);
      assert.equal(casilla2.x,-40);
      assert.equal(casilla2.y,50);
    
});
