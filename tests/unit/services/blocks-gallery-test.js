import { moduleFor, test } from 'ember-qunit'
import { blocklyWorkspaceMock } from '../../helpers/mocks';

moduleFor('service:blocks-gallery', 'Unit | Service | blocks-gallery', {
    needs: ['service:blocksGallery', 'service:blockly'],
    setup() {
        this.container.lookup('service:blocksGallery').start();
    }
})


let procedure = `
<block type="procedures_defnoreturn" x="386" y="56">
    <mutation>
      <arg name="param"></arg>
    </mutation>
    <field name="NAME">Hacer algo</field>
    <field name="ARG0">param</field>
    <statement name="STACK">
      <block type="DibujarLado">
        <value name="longitud">
          <block type="variables_get">
            <mutation var="param"></mutation>
          </block>
        </value>
      </block>
    </statement>
</block>
`

test('Parameters should have $parent procedure id', function(assert) {
    let block = Blockly.Xml.domToBlock(Blockly.Xml.textToDom(procedure), blocklyWorkspaceMock())
    let param = findParam(block)
    assert.equal(param.$parent, block.id)
});

function findParam(rootBlock) {
    let param = findChildren(rootBlock, "variables_get")
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