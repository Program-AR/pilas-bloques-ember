import { moduleFor, test } from 'ember-qunit'

moduleFor('service:blocks-gallery', 'Unit | Service | blocks-gallery', {
    needs: ['service:blocksGallery', 'service:blockly'],
    setup() {
        this.container.lookup('service:blocksGallery').start();
    }
})

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