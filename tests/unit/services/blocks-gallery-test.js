import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { blocklyWorkspaceMock } from '../../helpers/mocks';

module('Unit | Service | blocks-gallery', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.blocksGallery = this.owner.lookup('service:blocksGallery');
    this.blockly = this.owner.lookup('service:blockly');
    blocklyWorkspaceMock();
    this.blocksGallery.start();
  });



///////////// REQUIRED INPUTS /////////////

function createBlock(type) {
  return Blockly.mainWorkspace.newBlock(type) 
}

function assertRequiredInputs(assert, block, inputType, blockType) {
  block.inputList
    .filter(input => input.type == inputType)
    .forEach(input => {
      let inputBlock = input.connection.targetBlock()
      assert.ok(inputBlock, `${input.name} is required`)
      assert.equal(inputBlock.type, blockType)
    })
}

function testHasRequiredInputs(blockType) {
  test(`${blockType} has required inputs`, function(assert) {
    let block = createBlock(blockType)
    assertRequiredInputs(assert, block, Blockly.INPUT_VALUE, 'required_value')
    assertRequiredInputs(assert, block, Blockly.NEXT_STATEMENT, 'required_statement')
  });  
}

// Repeticiones
testHasRequiredInputs('RepetirVacio')
testHasRequiredInputs('Repetir')
testHasRequiredInputs('Hasta')

// Alternativas
testHasRequiredInputs('Si')
testHasRequiredInputs('SiNo')

// Operadores
testHasRequiredInputs('OpAritmetica')
testHasRequiredInputs('OpComparacion') //TODO

// Primitivas
testHasRequiredInputs('GirarGrados')


// Toolbox
let toolbox = `
<block type="GirarGrados">
  <value name="grados">
    <block type="math_number"><field name="NUM">90</field></block>
  </value>
</block>
`

test('When required input exists should be ok', function(assert) {
  let block = Blockly.textToBlock(toolbox)
  assert.notOk(findChildren(block, "required_value"))
  assert.ok(block.allInputsFilled(false))
});

test('When required input exists and it is disposed should be required again', function(assert) {
  let block = Blockly.textToBlock(toolbox)
  findChildren(block, "math_number").dispose()
  assert.ok(findChildren(block, "required_value"))
  assert.notOk(block.allInputsFilled(false))
});

///////////// PARAMS /////////////


let procedure = `
<block type="procedures_defnoreturn" id="whpKBVIV.;:t%=8XN+E_" x="778" y="185">
<mutation>
  <arg name="param"></arg>
</mutation>
<field name="NAME">Hacer algo</field>
<field name="ARG0">param</field>
<statement name="STACK">
  <block type="GirarGrados" id=";qf!gXUI;'/BUa0nx#y]">
    <value name="grados">
      <block type="variables_get" id="wAE7-:@m*P0G[x'Uf$Hv">
        <mutation var="param" parent="whpKBVIV.;:t%=8XN+E_"></mutation>
      </block>
    </value>
  </block>
</statement>
</block>
`

test('Parameter in parent procedure should be ok', function(assert) {
    let param = findParam(Blockly.textToBlock(procedure))
    assert.notOk(param.disabled)
    assert.notOk(param.warning)
});


let procedureWithDeletedParam = `
<block type="procedures_defnoreturn" id="whpKBVIV.;:t%=8XN+E_" x="778" y="185">
<field name="NAME">Hacer algo</field>
<statement name="STACK">
  <block type="GirarGrados" id=";qf!gXUI;'/BUa0nx#y]">
    <value name="grados">
      <block type="variables_get" id="wAE7-:@m*P0G[x'Uf$Hv">
        <mutation var="param" parent="whpKBVIV.;:t%=8XN+E_"></mutation>
      </block>
    </value>
  </block>
</statement>
</block>
`

test('Parameter in parent procedure without param should be disabled', function(assert) {
  let param = findParam(Blockly.textToBlock(procedureWithDeletedParam))
  assert.ok(param.disabled)
  assert.equal(param.warning.getText(), "Este bloque ya no puede usarse, el parámetro ha sido eliminado.") 
});


let emptyProcedure = `
<block type="procedures_defnoreturn" id="whpKBVIV.;:t%=8XN+E_" x="41" y="112">
<mutation>
  <arg name="param"></arg>
</mutation>
<field name="NAME">Hacer algo</field>
<field name="ARG0">param</field>
</block>
`

let main = `
<block type="al_empezar_a_ejecutar" id="~7u[uK:$SQa$}1uY9,h6" deletable="false" movable="false" editable="false" x="15" y="15">
<statement name="program">
  <block type="GirarGrados" id="jvQK2Fm?8Sh72]]8qk$Z">
    <value name="grados">
      <block type="variables_get" id="wAE7-:@m*P0G[x'Uf$Hv">
        <mutation var="param" parent="whpKBVIV.;:t%=8XN+E_"></mutation>
      </block>
    </value>
  </block>
</statement>
</block>
`

test('Parameter in non parent procedure should be disabled and with warning', function(assert) {
    Blockly.textToBlock(emptyProcedure)
    let param = findParam(Blockly.textToBlock(main))
    assert.ok(param.disabled)
    assert.equal(param.warning.getText(), "Este bloque no puede usarse aquí. Es un parámetro que sólo puede usarse en Hacer algo.") 
});


let flying = `
<block type="variables_get" id="wAE7-:@m*P0G[x'Uf$Hv" disabled="true" x="399" y="294">
<mutation var="param" parent="whpKBVIV.;:t%=8XN+E_"></mutation>
</block>
`

test('Parameter in non parent procedure should only be disabled', function(assert) {
    Blockly.textToBlock(emptyProcedure)
    let param = findParam(Blockly.textToBlock(flying))
    assert.ok(param.disabled)
    assert.notOk(param.warning)
});

test('Parameter should dispose when procedure is disposed', function(assert) {
    let procedure = Blockly.textToBlock(emptyProcedure)
    let param = findParam(Blockly.textToBlock(flying))
    assert.ok(param.workspace)
    procedure.dispose()
    assertAsync(assert, function() {
        assert.notOk(param.workspace)
    })
});


let mainWithoutParent = `
<block type="al_empezar_a_ejecutar" id="~7u[uK:$SQa$}1uY9,h6" deletable="false" movable="false" editable="false" x="15" y="15">
<statement name="program">
  <block type="GirarGrados" id="jvQK2Fm?8Sh72]]8qk$Z">
    <value name="grados">
      <block type="variables_get" id="wAE7-:@m*P0G[x'Uf$Hv">
        <mutation var="param"></mutation>
      </block>
    </value>
  </block>
</statement>
</block>
`

test('Parameter without parent procedure should be always ok', function(assert) {
    let param = findParam(Blockly.textToBlock(mainWithoutParent))
    assert.notOk(param.disabled)
    assert.notOk(param.warning)
});



function findParam(rootBlock) {
    let param = findChildren(rootBlock, "variables_get")
    param.onchange() // Force initialize
    return param
}


function findChildren(rootBlock, type) {
  if (!rootBlock) return null
  if (rootBlock.type == type) return rootBlock
  return rootBlock.getChildren().map(b => findChildren(b, type)).find(b => b != undefined)
}



function assertAsync(assert, fn) {
  let done = assert.async(1)
  setTimeout(function() {
      fn(); done()
  })
}

///////////// ALIAS /////////////

let testAlias = function (alias, type) {
    test(`check if ${alias} block definition exist and is equal to ${type} block definition`, function (assert) {
      assert.ok(this.blocksGallery.areAliases(alias, type));
    });
  }

  testAlias('si', 'Si');
  testAlias('sino', 'SiNo');
  testAlias('Sino', 'SiNo');
  testAlias('hasta', 'Hasta');
  testAlias('prenderCompuConColision', 'PrenderComputadora');
  testAlias('PrenderCompu', 'PrenderComputadora');
  testAlias('ApagarCompu', 'ApagarComputadora');
  testAlias('SiguienteCompu', 'PasarASiguienteComputadora');
  testAlias('Descubralculpable', 'EsCulpable');
  testAlias('repetir', 'Repetir');
  testAlias('tocandoBanana', 'TocandoBanana');
  testAlias('tocandoManzana', 'TocandoManzana');
  testAlias('PrenderFogata', 'PrenderFogata');
  testAlias('Dejarregalo', 'DejarRegalo');
  testAlias('Contarbanana', 'ContarBanana');
  testAlias('Contarmanzana', 'ContarManzana');
  testAlias('AvanzarKm', 'Avanzar1km');
  testAlias('cambiarColor', 'CambiarColor');
  testAlias('siguienteFoco', 'siguienteFoco');
  testAlias('empezarFiesta', 'EmpezarFiesta');
  testAlias('Volveralbordeizquierdo', 'VolverAlBordeIzquierdo');
  testAlias('Primersospechoso', 'IrAlPrimerSospechoso');
  testAlias('PrimerSospechoso', 'IrAlPrimerSospechoso');
  testAlias('Siguientesospechoso', 'IrAlSiguienteSospechoso');
  testAlias('SiguienteSospechoso', 'IrAlSiguienteSospechoso');
  testAlias('Sacardisfraz', 'InterrogarSospechoso');
  testAlias('SacarDisfraz', 'InterrogarSospechoso');
  testAlias('Estoyenunaesquina', 'EstoyEnEsquina');
  testAlias('tocandoFogata', 'TocandoFogata');
  testAlias('tocandoInicio', 'TocandoInicio');
  testAlias('tocandoFinal', 'TocandoFinal');
  testAlias('tocandoPelota', 'TocandoPelota');
  testAlias('tocandoQueso', 'TocandoQueso');
  testAlias('tocandoLuz', 'TocandoLuz');
  testAlias('Abrirojos', 'AbrirOjos');
  testAlias('Cerrarojos', 'CerrarOjos');
  testAlias('Soar', 'Soniar');
  testAlias('Agarrarllave', 'AgarrarLlave');
  testAlias('Abrircofre', 'AbrirCofre');
  testAlias('Darsombrero', 'DarSombrero');
  testAlias('Atacarconespada', 'AtacarConEspada');
  testAlias('Escaparenunicornio', 'EscaparEnUnicornio');
  testAlias('estoyInicio', 'EstoySobreElInicio');
  testAlias('estoyAlInicio', 'EstoySobreElInicio');
  testAlias('estoyFinColumna', 'EstoySobreElFinal');
  testAlias('EstoyAlFin', 'EstoySobreElFinal');
  testAlias('ComerBananaNano', 'ComerBanana');
  testAlias('saltar1', 'SaltarHablando');
});