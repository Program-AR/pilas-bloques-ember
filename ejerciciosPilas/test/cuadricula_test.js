modulePilas('Cuadricula Test',{
  beforeEach: function(){

    this.cuadricula = new Cuadricula(0, 0, 3, 5,
         { alto: 300, ancho: 200 },
         //implica casilla.ancho==40 && casilla.alto==100
         { grilla: 'invisible.png', cantColumnas: 1 });
    this.actor1 = new AlienAnimado(0,0);
    this.actor2 = new AlienAnimado(0,0);
    this.actor3 = new AlienAnimado(0,0);

  },


  afterEach: function(){
    this.cuadricula.eliminar();
    this.actor1.eliminar();
    this.actor2.eliminar();
    this.actor3.eliminar();

  }
});

testPilas('Set Ancho',3, function(assert) {
      this.cuadricula.setAncho(100);
      assert.equal(this.cuadricula.ancho,100);
      assert.equal(this.cuadricula.casilla(0,0).ancho,20);
      assert.equal(this.cuadricula.casilla(0,0).alto,100);
       /*Modifica el ancho de las casillas pero no el alto*/
});

testPilas('Set Alto ',3, function(assert) {
      this.cuadricula.setAlto(600);
      assert.equal(this.cuadricula.alto,600);
      assert.equal(this.cuadricula.casilla(0,0).ancho,40);
      assert.equal(this.cuadricula.casilla(0,0).alto,200);
});


testPilas('Colisionan',6, function(assert) {
      this.cuadricula.agregarActor(this.actor1,0,0);
      this.cuadricula.agregarActor(this.actor2,0,0);
      this.cuadricula.agregarActor(this.actor3,0,1);

      assert.equal(this.cuadricula.colisionan(this.actor1,this.actor2),true);
      assert.equal(this.cuadricula.colisionan(this.actor2,this.actor1),true);
      assert.equal(this.cuadricula.colisionan(this.actor1,this.actor3),false);
      assert.equal(this.cuadricula.colisionan(this.actor3,this.actor1),false);
      assert.equal(this.cuadricula.colisionan(this.actor3,this.actor2),false);
      assert.equal(this.cuadricula.colisionan(this.actor2,this.actor3),false);

});

testPilas('Casilla ',7, function(assert) {
      assert.equal(this.cuadricula.casilla(0,0)!=this.cuadricula.casilla(0,1),true,'son distintas');
      assert.equal(this.cuadricula.casilla(0,0).nroFila,0);
      assert.equal(this.cuadricula.casilla(0,0).nroColumna,0);
      assert.equal(this.cuadricula.casilla(0,1).nroFila,0);
      assert.equal(this.cuadricula.casilla(0,1).nroColumna,1);
      assert.equal(this.cuadricula.casilla(1,1).nroColumna,1);
      assert.equal(this.cuadricula.casilla(1,1).nroFila,1);
});

testPilas('Mover a casilla derecha ',3, function(assert) {
      this.cuadricula.agregarActor(this.actor1,0,0);
      var x = this.actor1.x;
      var y = this.actor1.y;
      hacerLuegoConCallback(this.actor1, MoverACasillaDerecha, {}, function(){
        assert.equal(this.actor1.x, x + this.cuadricula.casilla(0,0).ancho, 'Movi a la derecha bien');
        assert.equal(this.actor1.y, y, 'Me mantuve en altura');
        assert.equal(this.actor1.casillaActual(), this.cuadricula.casilla(0,1), 'Mi casillaActual es la correspondiente');
      });
      
});



/*
testPilas('Mover a casilla izquierda ',2, function(assert) {

      this.cuadricula.agregarActor(this.actor1,0,1);
      var x= this.actor1.x;
      var y= this.actor1.y;
      this.actor1.hacer_luego(MoverACasillaIzquierda);
      assert.equal(this.actor1.x,x-this.cuadricula.casilla(0,0).ancho);
      assert.equal(this.actor1.casillaActual(),this.cuadricula.casilla(0,0));
});
*/
/*
testPilas('Constructor',0, function(assert) {
      this.cuadricula.setAlto(600);
      assert.equal(this.cuadricula.alto,600);
      assert.equal(this.cuadricula.casilla(0,0).ancho,40);
      assert.equal(this.cuadricula.casilla(0,0).alto,200);
});*/
