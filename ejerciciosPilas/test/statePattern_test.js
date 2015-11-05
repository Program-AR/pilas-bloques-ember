module('State Pattern Test');

test('Agregar Estado', function(assert) {
      this.builder= new BuilderStatePattern('inicial');
      this.builder.agregarEstado('estado1');
      assert.equal(this.builder.estados['estado1'].identifier,'estado1','El estado que se agrega tiene el id correspondiente');
      assert.deepEqual(this.builder.estados['estado1'].transiciones,{},'El nuevo estado no tiene transiciones');
});


test('Agregar Transicion', function(assert) {
      this.builder= new BuilderStatePattern('inicial');
      this.builder.agregarEstado('e1');
      this.builder.agregarEstado('e2');
      this.builder.agregarTransicion('e1','e2','transi');
      assert.equal(this.builder.estados['e1'].transiciones['transi'],this.builder.estados['e2'])
});
test('Agregar Error', function(assert) {
    this.builder= new BuilderStatePattern('inicial');
    this.builder.agregarError('inicial','instalar','Primero hay que prender la computadora');
    assert.equal(this.builder.estados['inicial'].transiciones['instalar'].mensajeError,'Primero hay que prender la computadora');
    assert.equal(this.builder.estados['inicial'].transiciones['instalar'].estadoAlQueVuelve,this.builder.estados['inicial']);
});

test('Agregar estados prefijados', function(assert) {
  this.builder= new BuilderStatePattern('inicial');
  this.builder.agregarEstadosPrefijados('prendido',1,3);
  assert.notEqual(this.builder.estados['prendido1'],undefined,"Lo que se agrega es lo prefijado");
  assert.notEqual(this.builder.estados['prendido2'],undefined,"Lo que se agrega es lo prefijado");
  assert.notEqual(this.builder.estados['prendido3'],undefined,"Lo que se agrega es lo prefijado");
});

test('Estado Inicial (construir state pattern)', function(assert) {
  this.builder= new BuilderStatePattern('inicial');
  assert.equal(this.builder.estadoInicial(),this.builder.estados['inicial']);
});

test('Agregar error a varios estados de salida', function(assert) {
  /*Caso de test donde, para tres estados prefijados e1, e2 y e3,
  se agregan con una instruccion transiciones con la etiqueta
  'transiError' a un estado de error con el mensaje 'te equivocaste'
  */
  this.builder= new BuilderStatePattern('inicial');
  this.builder.agregarEstadosPrefijados('e',1,3);
  this.builder.agregarErrorAVariosEstadosDeSalida('e','transiError','te equivocaste',1,3);
  assert.equal(this.builder.estados['e1'].transiciones['transiError'].estadoAlQueVuelve,this.builder.estados['e1'],"El estado al que vuelve es correcto");
  assert.equal(this.builder.estados['e2'].transiciones['transiError'].estadoAlQueVuelve,this.builder.estados['e2'],"El estado al que vuelve es correcto");
  assert.equal(this.builder.estados['e3'].transiciones['transiError'].estadoAlQueVuelve,this.builder.estados['e3'],"El estado al que vuelve es correcto");
  assert.equal(this.builder.estados['e1'].transiciones['transiError'].mensajeError,'te equivocaste',"Los mensajes de error son correctos");
  assert.equal(this.builder.estados['e2'].transiciones['transiError'].mensajeError,'te equivocaste',"Los mensajes de error son correctos");
  assert.equal(this.builder.estados['e3'].transiciones['transiError'].mensajeError,'te equivocaste',"Los mensajes de error son correctos");
});



test('Agregar transiciones iteradas', function(assert) {
  /* Dados estados a1, a2, a3, b1, b2, b3, buscamos con una
  instrucción generar transiciones con etiqueta 't'
  de a_i a b_i 0<i<4
  */
  this.builder= new BuilderStatePattern('inicial');
  this.builder.agregarEstadosPrefijados('a',1,3);
  this.builder.agregarEstadosPrefijados('b',1,3);
  this.builder.agregarTransicionesIteradas('a','b','t' ,1,3,1,3);
  assert.equal(this.builder.estados['a1'].transiciones['t'].identifier,'b1');
  assert.equal(this.builder.estados['a2'].transiciones['t'].identifier,'b2');
  assert.equal(this.builder.estados['a3'].transiciones['t'].identifier,'b3');
});
