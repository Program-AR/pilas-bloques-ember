import { test } from 'qunit';
import { moduloEjerciciosPilas } from '../../helpers/ejerciciosPilasTest';
import createPilasTest from '../../helpers/createPilasTest';

const nombre = 'State Pattern';

moduloEjerciciosPilas(nombre, () => {

  test('Agregar Estado', function (assert) {
    return createPilasTest(this, 'EscenaTests', (pilas, resolve, pilasService) => {
      let BuilderStatePattern = pilasService.evaluar("BuilderStatePattern");
      let builder = new BuilderStatePattern(pilas.escena_actual(), 'inicial');
      builder.agregarEstado('estado1');
      assert.equal(builder.estados['estado1'].identifier, 'estado1', 'El estado que se agrega tiene el id correspondiente');
      assert.equal(Object.keys(builder.estados['estado1'].transiciones).length, 0, 'El nuevo estado no tiene transiciones');
      resolve();
    });
  });

  test('Agregar Transicion', function (assert) {
    return createPilasTest(this, 'EscenaTests', (pilas, resolve, pilasService) => {
      let BuilderStatePattern = pilasService.evaluar("BuilderStatePattern");
      let builder = new BuilderStatePattern(pilas.escena_actual(), 'inicial');
      builder.agregarEstado('e1');
      builder.agregarEstado('e2');
      builder.agregarTransicion('e1', 'e2', 'transi');
      assert.equal(builder.estados['e1'].transiciones['transi']['estadoEntrada'], builder.estados['e2']);
      resolve();
    });
  });

  test('Agregar Error', function (assert) {
    return createPilasTest(this, 'EscenaTests', (pilas, resolve, pilasService) => {
      let BuilderStatePattern = pilasService.evaluar("BuilderStatePattern");
      let builder = new BuilderStatePattern(pilas.escena_actual(), 'inicial');
      builder.agregarError('inicial', 'instalar', 'Primero hay que prender la computadora');
      assert.equal(builder.estados['inicial'].errores['instalar'], 'Primero hay que prender la computadora');
      resolve();
    });
  });

  test('Agregar estados prefijados', function (assert) {
    return createPilasTest(this, 'EscenaTests', (pilas, resolve, pilasService) => {
      let BuilderStatePattern = pilasService.evaluar("BuilderStatePattern");
      let builder = new BuilderStatePattern(pilas.escena_actual(), 'inicial');
      builder.agregarEstadosPrefijados('prendido', 1, 3);
      assert.notEqual(builder.estados['prendido1'], undefined, "Lo que se agrega es lo prefijado");
      assert.notEqual(builder.estados['prendido2'], undefined, "Lo que se agrega es lo prefijado");
      assert.notEqual(builder.estados['prendido3'], undefined, "Lo que se agrega es lo prefijado");
      resolve();
    });
  });

  test('Estado Inicial (construir state pattern)', function (assert) {
    return createPilasTest(this, 'EscenaTests', (pilas, resolve, pilasService) => {
      let BuilderStatePattern = pilasService.evaluar("BuilderStatePattern");
      let builder = new BuilderStatePattern(pilas.escena_actual(), 'inicial');
      assert.equal(builder.estadoInicial(), builder.estados['inicial']);
      resolve();
    });
  });

  test('Agregar error a varios estados de salida', function (assert) {
    /*Caso de test donde, para tres estados prefijados e1, e2 y e3,
    se agregan con una instruccion transiciones con la etiqueta
    'transiError' a un estado de error con el mensaje 'te equivocaste'
    */
    return createPilasTest(this, 'EscenaTests', (pilas, resolve, pilasService) => {
      let BuilderStatePattern = pilasService.evaluar("BuilderStatePattern");
      let builder = new BuilderStatePattern(pilas.escena_actual(), 'inicial');
      builder.agregarEstadosPrefijados('e', 1, 3);
      builder.agregarErrorAVariosEstadosDeSalida('e', 'transiError', 'te equivocaste', 1, 3);
      // assert.equal(builder.estados['e1'].transiciones['transiError']['estadoEntrada'].estadoAlQueVuelve,builder.estados['e1'],"El estado al que vuelve es correcto");
      // assert.equal(builder.estados['e2'].transiciones['transiError']['estadoEntrada'].estadoAlQueVuelve,builder.estados['e2'],"El estado al que vuelve es correcto");
      // assert.equal(builder.estados['e3'].transiciones['transiError']['estadoEntrada'].estadoAlQueVuelve,builder.estados['e3'],"El estado al que vuelve es correcto");
      // assert.equal(builder.estados['e1'].transiciones['transiError']['estadoEntrada'].mensajeError,'te equivocaste',"Los mensajes de error son correctos");
      // assert.equal(builder.estados['e2'].transiciones['transiError']['estadoEntrada'].mensajeError,'te equivocaste',"Los mensajes de error son correctos");
      // assert.equal(builder.estados['e3'].transiciones['transiError']['estadoEntrada'].mensajeError,'te equivocaste',"Los mensajes de error son correctos");
      assert.equal(builder.estados['e1'].errores['transiError'], 'te equivocaste', "Los mensajes de error son correctos");
      assert.equal(builder.estados['e2'].errores['transiError'], 'te equivocaste', "Los mensajes de error son correctos");
      assert.equal(builder.estados['e3'].errores['transiError'], 'te equivocaste', "Los mensajes de error son correctos");
      resolve();
    });
  });

  test('Agregar transiciones iteradas', function (assert) {
    /* Dados estados a1, a2, a3, b1, b2, b3, buscamos con una
    instrucción generar transiciones con etiqueta 't'
    de a_i a b_i 0<i<4
    */
    return createPilasTest(this, 'EscenaTests', (pilas, resolve, pilasService) => {
      let BuilderStatePattern = pilasService.evaluar("BuilderStatePattern");
      let builder = new BuilderStatePattern(pilas.escena_actual(), 'inicial');
      builder.agregarEstadosPrefijados('a', 1, 3);
      builder.agregarEstadosPrefijados('b', 1, 3);
      builder.agregarTransicionesIteradas('a', 'b', 't', 1, 3, 1, 3);
      assert.equal(builder.estados['a1'].transiciones['t']['estadoEntrada'].identifier, 'b1');
      assert.equal(builder.estados['a2'].transiciones['t']['estadoEntrada'].identifier, 'b2');
      assert.equal(builder.estados['a3'].transiciones['t']['estadoEntrada'].identifier, 'b3');
      resolve();
    });
  });

});