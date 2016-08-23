module('Estado Test');

test('Agregar Transicion', function(assert) {
      this.e2 = new Estado('id2');
      this.e = new Estado('id');
      this.e.agregarTransicion(this.e2,'transi');
      assert.equal(this.e.transiciones['transi'],this.e2,"Por la etiqueta llego a destino");
});


test('Constructor', function(assert) {
      this.e = new Estado('id');
      assert.deepEqual(this.e.transiciones,{});
      assert.equal(this.e.identifier,'id');
});
