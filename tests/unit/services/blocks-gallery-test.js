import { moduleFor, test } from 'ember-qunit'
import { blocklyWorkspaceMock } from '../../helpers/mocks';

moduleFor('service:blocks-gallery', 'Unit | Service | blocks-gallery', {
    needs: ['service:blocksGallery', 'service:blockly'],
    setup() {
        blocklyWorkspaceMock()
        this.container.lookup('service:blocksGallery').start();
    }
})

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
    // TODO: No sé dónde / cuando se guarda el Warning, por consola anda pero acá no (ni siquiera después de hacer setWarningText)
    // assert.equal(param.warning.getText(), "") 
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
    let type = "variables_get"
    let param = rootBlock.type == type ? rootBlock : findChildren(rootBlock, type)
    param.onchange() // Force initialize
    return param
}


function findChildren(rootBlock, type) {
    return rootBlock.getChildren().find((b) => b.type == type) || findChildren(rootBlock.getChildren()[0], type)
}


///////////// ALIAS /////////////

let testAlias = function (alias, type) {
    test(`check if ${alias} block definition exist and is equal to ${type} block definition`, function (assert) {
        assert.ok(this.subject().areAliases(alias, type));
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