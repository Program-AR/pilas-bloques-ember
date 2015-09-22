modulePilas('Casilla Test',{
  beforeEach: function(){
    this.cuadricula = new Cuadricula(0, 0, 3, 5,
         { alto: 300, ancho: 200 },
         //implica casilla.ancho==40 && casilla.alto==100
         { grilla: 'invisible.png', cantColumnas: 1 });
  },

  afterEach: function(){
    this.cuadricula.eliminar()
  }
});

testPilas('Reubicar casilla',6, function(assert) {
      var casilla = this.cuadricula.casilla(1,2);
      var casilla2 = this.cuadricula.casilla(0,0);
      this.cuadricula.setAlto(150);
      this.cuadricula.setAncho(100);
      assert.equal(casilla.alto,50,'resizea alto bien');
      assert.equal(casilla.ancho,20,'resizea ancho bien');
      assert.equal(casilla.x,0,'reposiciona x bien cuando es 0');
      assert.equal(casilla.y,0,'reposiciona y bien cuando es 0');
      assert.equal(casilla2.x,-40,'reposiciona x bien');
      assert.equal(casilla2.y,50,'reposiciona y bien');
      done();

});
