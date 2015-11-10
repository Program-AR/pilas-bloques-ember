
test('Constructor', function(assert) {
});


test('Crear casillas', function(assert) {
});


test('Hay derecha', function(assert) {
  this.cantidadFilas=5;
  this.cantidadColumnas=6;
  var matriz= [
    ['T','T','T','T','T','T'],
    ['T','F','F','F','F','T'],
    ['T','T','T','T','T','T'],
    ['T','F','F','F','F','T'],
    ['T','T','T','T','T','T']]
  this.cuadricula = new CuadriculaEsparsa(0,0,this.cantidadFilas,this.cantidadColumnas,{alto: 100},{grilla:'casillaLightbot.png', cantColumnas: 5},matriz)

});


test('Hay izquierda', function(assert) {
});

test('Hay arriba', function(assert) {
});

test('Hay abajo', function(assert) {
});
