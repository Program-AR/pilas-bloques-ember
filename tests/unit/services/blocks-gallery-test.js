import { moduleFor, test } from 'ember-qunit';

moduleFor('service:blocks-gallery', 'Unit | Service | blocks-gallery', {
    needs: ['service:blocksGallery', 'service:blockly'],
    setup() {
        this.container.lookup('service:blocksGallery').start()
    }
});

test('check if "si" block definition exist and is equal to "Si" block definition', function (assert) {
    let service = this.subject()
    let alias = 'si'
    let type = 'Si'
    assert.ok(service.existBlockType(alias))
    assert.ok(service.areAlias(alias, type))
    assert.notOk(service.areAllAlias(service.getBlockTypesWithNotAlias(alias), type))
});

test('check if "sino" block definition exist and is equal to "SiNo" block definition', function (assert) {
    let service = this.subject()
    let alias = 'sino'
    let type = 'SiNo'
    assert.ok(service.existBlockType(alias))
    assert.ok(service.areAlias(alias, type))
    assert.notOk(service.areAllAlias(service.getBlockTypesWithNotAlias(alias), type))
});

test('check if "Sino" block definition exist and is equal to "SiNo" block definition', function (assert) {
    let service = this.subject()
    let alias = 'Sino'
    let type = 'SiNo'
    assert.ok(service.existBlockType(alias))
    assert.ok(service.areAlias(alias, type))
    assert.notOk(service.areAllAlias(service.getBlockTypesWithNotAlias(alias), type))
});

test('check if "hasta" block definition exist and is equal to "Hasta" block definition', function (assert) {
    let service = this.subject()
    let alias = 'hasta'
    let type = 'Hasta'
    assert.ok(service.existBlockType(alias))
    assert.ok(service.areAlias(alias, type))
    assert.notOk(service.areAllAlias(service.getBlockTypesWithNotAlias(alias), type))
});

test('check if "prenderCompuConColision" block definition exist and is equal to "PrenderComputadora" block definition', function (assert) {
    let service = this.subject()
    let alias = 'prenderCompuConColision'
    let type = 'PrenderComputadora'
    assert.ok(service.existBlockType(alias))
    assert.ok(service.areAlias(alias, type))
    assert.notOk(service.areAllAlias(service.getBlockTypesWithNotAlias(alias), type))
});


test('check if "PrenderCompuConColision" block definition exist and is equal to "PrenderComputadora" block definition', function (assert) {
    let service = this.subject()
    let alias = 'PrenderCompuConColision'
    let type = 'PrenderComputadora'
    assert.ok(service.existBlockType(alias))
    assert.ok(service.areAlias(alias, type))
    assert.notOk(service.areAllAlias(service.getBlockTypesWithNotAlias(alias), type))
});

test('check if "PrenderCompu" block definition exist and is equal to "PrenderComputadora" block definition', function (assert) {
    let service = this.subject()
    let alias = 'PrenderCompu'
    let type = 'PrenderComputadora'
    assert.ok(service.existBlockType(alias))
    assert.ok(service.areAlias(alias, type))
    assert.notOk(service.areAllAlias(service.getBlockTypesWithNotAlias(alias), type))
});

test('check if "ApagarCompu" block definition exist and is equal to "ApagarComputadora" block definition', function (assert) {
    let service = this.subject()
    let alias = 'ApagarCompu'
    let type = 'ApagarComputadora'
    assert.ok(service.existBlockType(alias))
    assert.ok(service.areAlias(alias, type))
    assert.notOk(service.areAllAlias(service.getBlockTypesWithNotAlias(alias), type))
});

test('check if "SiguienteCompu" block definition exist and is equal to "PasarASiguienteComputadora" block definition', function (assert) {
    let service = this.subject()
    let alias = 'SiguienteCompu'
    let type = 'PasarASiguienteComputadora'
    assert.ok(service.existBlockType(alias))
    assert.ok(service.areAlias(alias, type))
    assert.notOk(service.areAllAlias(service.getBlockTypesWithNotAlias(alias), type))
});

test('check if "Descubralculpable" block definition exist and is equal to "EsCulpable" block definition', function (assert) {
    let service = this.subject()
    let alias = 'Descubralculpable'
    let type = 'EsCulpable'
    assert.ok(service.existBlockType(alias))
    assert.ok(service.areAlias(alias, type))
    assert.notOk(service.areAllAlias(service.getBlockTypesWithNotAlias(alias), type))
});

test('check if "repetir" block definition exist and is equal to "Repetir" block definition', function (assert) {
    let service = this.subject()
    let alias = 'repetir'
    let type = 'Repetir'
    assert.ok(service.existBlockType(alias))
    assert.ok(service.areAlias(alias, type))
    assert.notOk(service.areAllAlias(service.getBlockTypesWithNotAlias(alias), type))
});

test('check if "tocandoBanana" block definition exist and is equal to "TocandoBanana" block definition', function (assert) {
    let service = this.subject()
    let alias = 'tocandoBanana'
    let type = 'TocandoBanana'
    assert.ok(service.existBlockType(alias))
    assert.ok(service.areAlias(alias, type))
    assert.notOk(service.areAllAlias(service.getBlockTypesWithNotAlias(alias), type))
});

test('check if "tocandoManzana" block definition exist and is equal to "TocandoManzana" block definition', function (assert) {
    let service = this.subject()
    let alias = 'tocandoManzana'
    let type = 'TocandoManzana'
    assert.ok(service.existBlockType(alias))
    assert.ok(service.areAlias(alias, type))
    assert.notOk(service.areAllAlias(service.getBlockTypesWithNotAlias(alias), type))
});

test('check if "PrenderFogata" block definition exist and is equal to "PrenderFogata" block definition', function (assert) {
    let service = this.subject()
    let alias = 'PrenderFogata'
    let type = 'PrenderFogata'
    assert.ok(service.existBlockType(alias))
    assert.ok(service.areAlias(alias, type))
    assert.notOk(service.areAllAlias(service.getBlockTypesWithNotAlias(alias), type))
});

test('check if "Dejarregalo" block definition exist and is equal to "DejarRegalo" block definition', function (assert) {
    let service = this.subject()
    let alias = 'Dejarregalo'
    let type = 'DejarRegalo'
    assert.ok(service.existBlockType(alias))
    assert.ok(service.areAlias(alias, type))
    assert.notOk(service.areAllAlias(service.getBlockTypesWithNotAlias(alias), type))
});

test('check if "Contarbanana" block definition exist and is equal to "ContarBanana" block definition', function (assert) {
    let service = this.subject()
    let alias = 'Contarbanana'
    let type = 'ContarBanana'
    assert.ok(service.existBlockType(alias))
    assert.ok(service.areAlias(alias, type))
    assert.notOk(service.areAllAlias(service.getBlockTypesWithNotAlias(alias), type))
});

test('check if "Contarmanzana" block definition exist and is equal to "ContarManzana" block definition', function (assert) {
    let service = this.subject()
    let alias = 'Contarmanzana'
    let type = 'ContarManzana'
    assert.ok(service.existBlockType(alias))
    assert.ok(service.areAlias(alias, type))
    assert.notOk(service.areAllAlias(service.getBlockTypesWithNotAlias(alias), type))
});

test('check if "AvanzarKm" block definition exist and is equal to "Avanzar1km" block definition', function (assert) {
    let service = this.subject()
    let alias = 'AvanzarKm'
    let type = 'Avanzar1km'
    assert.ok(service.existBlockType(alias))
    assert.ok(service.areAlias(alias, type))
    assert.notOk(service.areAllAlias(service.getBlockTypesWithNotAlias(alias), type))
});

test('check if "cambiarColor" block definition exist and is equal to "CambiarColor" block definition', function (assert) {
    let service = this.subject()
    let alias = 'cambiarColor'
    let type = 'CambiarColor'
    assert.ok(service.existBlockType(alias))
    assert.ok(service.areAlias(alias, type))
    assert.notOk(service.areAllAlias(service.getBlockTypesWithNotAlias(alias), type))
});

test('check if "siguienteFoco" block definition exist and is equal to "siguienteFoco" block definition', function (assert) {
    let service = this.subject()
    let alias = 'siguienteFoco'
    let type = 'siguienteFoco'
    assert.ok(service.existBlockType(alias))
    assert.ok(service.areAlias(alias, type))
    assert.notOk(service.areAllAlias(service.getBlockTypesWithNotAlias(alias), type))
});

test('check if "empezarFiesta" block definition exist and is equal to "EmpezarFiesta" block definition', function (assert) {
    let service = this.subject()
    let alias = 'empezarFiesta'
    let type = 'EmpezarFiesta'
    assert.ok(service.existBlockType(alias))
    assert.ok(service.areAlias(alias, type))
    assert.notOk(service.areAllAlias(service.getBlockTypesWithNotAlias(alias), type))
});

test('check if "Volveralbordeizquierdo" block definition exist and is equal to "VolverAlBordeIzquierdo" block definition', function (assert) {
    let service = this.subject()
    let alias = 'Volveralbordeizquierdo'
    let type = 'VolverAlBordeIzquierdo'
    assert.ok(service.existBlockType(alias))
    assert.ok(service.areAlias(alias, type))
    assert.notOk(service.areAllAlias(service.getBlockTypesWithNotAlias(alias), type))
});

test('check if "Primersospechoso" block definition exist and is equal to "IrAlPrimerSospechoso" block definition', function (assert) {
    let service = this.subject()
    let alias = 'Primersospechoso'
    let type = 'IrAlPrimerSospechoso'
    assert.ok(service.existBlockType(alias))
    assert.ok(service.areAlias(alias, type))
    assert.notOk(service.areAllAlias(service.getBlockTypesWithNotAlias(alias), type))
});

test('check if "PrimerSospechoso" block definition exist and is equal to "IrAlPrimerSospechoso" block definition', function (assert) {
    let service = this.subject()
    let alias = 'PrimerSospechoso'
    let type = 'IrAlPrimerSospechoso'
    assert.ok(service.existBlockType(alias))
    assert.ok(service.areAlias(alias, type))
    assert.notOk(service.areAllAlias(service.getBlockTypesWithNotAlias(alias), type))
});

test('check if "Siguientesospechoso" block definition exist and is equal to "IrAlSiguienteSospechoso" block definition', function (assert) {
    let service = this.subject()
    let alias = 'Siguientesospechoso'
    let type = 'IrAlSiguienteSospechoso'
    assert.ok(service.existBlockType(alias))
    assert.ok(service.areAlias(alias, type))
    assert.notOk(service.areAllAlias(service.getBlockTypesWithNotAlias(alias), type))
});

test('check if "SiguienteSospechoso" block definition exist and is equal to "IrAlSiguienteSospechoso" block definition', function (assert) {
    let service = this.subject()
    let alias = 'SiguienteSospechoso'
    let type = 'IrAlSiguienteSospechoso'
    assert.ok(service.existBlockType(alias))
    assert.ok(service.areAlias(alias, type))
    assert.notOk(service.areAllAlias(service.getBlockTypesWithNotAlias(alias), type))
});

test('check if "Sacardisfraz" block definition exist and is equal to "InterrogarSospechoso" block definition', function (assert) {
    let service = this.subject()
    let alias = 'Sacardisfraz'
    let type = 'InterrogarSospechoso'
    assert.ok(service.existBlockType(alias))
    assert.ok(service.areAlias(alias, type))
    assert.notOk(service.areAllAlias(service.getBlockTypesWithNotAlias(alias), type))
});

test('check if "SacarDisfraz" block definition exist and is equal to "InterrogarSospechoso" block definition', function (assert) {
    let service = this.subject()
    let alias = 'SacarDisfraz'
    let type = 'InterrogarSospechoso'
    assert.ok(service.existBlockType(alias))
    assert.ok(service.areAlias(alias, type))
    assert.notOk(service.areAllAlias(service.getBlockTypesWithNotAlias(alias), type))
});

test('check if "Estoyenunaesquina" block definition exist and is equal to "EstoyEnEsquina" block definition', function (assert) {
    let service = this.subject()
    let alias = 'Estoyenunaesquina'
    let type = 'EstoyEnEsquina'
    assert.ok(service.existBlockType(alias))
    assert.ok(service.areAlias(alias, type))
    assert.notOk(service.areAllAlias(service.getBlockTypesWithNotAlias(alias), type))
});

test('check if "tocandoFogata" block definition exist and is equal to "TocandoFogata" block definition', function (assert) {
    let service = this.subject()
    let alias = 'tocandoFogata'
    let type = 'TocandoFogata'
    assert.ok(service.existBlockType(alias))
    assert.ok(service.areAlias(alias, type))
    assert.notOk(service.areAllAlias(service.getBlockTypesWithNotAlias(alias), type))
});

test('check if "tocandoInicio" block definition exist and is equal to "TocandoInicio" block definition', function (assert) {
    let service = this.subject()
    let alias = 'tocandoInicio'
    let type = 'TocandoInicio'
    assert.ok(service.existBlockType(alias))
    assert.ok(service.areAlias(alias, type))
    assert.notOk(service.areAllAlias(service.getBlockTypesWithNotAlias(alias), type))
});

test('check if "tocandoFinal" block definition exist and is equal to "TocandoFinal" block definition', function (assert) {
    let service = this.subject()
    let alias = 'tocandoFinal'
    let type = 'TocandoFinal'
    assert.ok(service.existBlockType(alias))
    assert.ok(service.areAlias(alias, type))
    assert.notOk(service.areAllAlias(service.getBlockTypesWithNotAlias(alias), type))
});

test('check if "tocandoPelota" block definition exist and is equal to "TocandoPelota" block definition', function (assert) {
    let service = this.subject()
    let alias = 'tocandoPelota'
    let type = 'TocandoPelota'
    assert.ok(service.existBlockType(alias))
    assert.ok(service.areAlias(alias, type))
    assert.notOk(service.areAllAlias(service.getBlockTypesWithNotAlias(alias), type))
});

test('check if "tocandoQueso" block definition exist and is equal to "TocandoQueso" block definition', function (assert) {
    let service = this.subject()
    let alias = 'tocandoQueso'
    let type = 'TocandoQueso'
    assert.ok(service.existBlockType(alias))
    assert.ok(service.areAlias(alias, type))
    assert.notOk(service.areAllAlias(service.getBlockTypesWithNotAlias(alias), type))
});

test('check if "tocandoLuz" block definition exist and is equal to "TocandoLuz" block definition', function (assert) {
    let service = this.subject()
    let alias = 'tocandoLuz'
    let type = 'TocandoLuz'
    assert.ok(service.existBlockType(alias))
    assert.ok(service.areAlias(alias, type))
    assert.notOk(service.areAllAlias(service.getBlockTypesWithNotAlias(alias), type))
});

test('check if "Abrirojos" block definition exist and is equal to "AbrirOjos" block definition', function (assert) {
    let service = this.subject()
    let alias = 'Abrirojos'
    let type = 'AbrirOjos'
    assert.ok(service.existBlockType(alias))
    assert.ok(service.areAlias(alias, type))
    assert.notOk(service.areAllAlias(service.getBlockTypesWithNotAlias(alias), type))
});

test('check if "Cerrarojos" block definition exist and is equal to "CerrarOjos" block definition', function (assert) {
    let service = this.subject()
    let alias = 'Cerrarojos'
    let type = 'CerrarOjos'
    assert.ok(service.existBlockType(alias))
    assert.ok(service.areAlias(alias, type))
    assert.notOk(service.areAllAlias(service.getBlockTypesWithNotAlias(alias), type))
});

test('check if "Soar" block definition exist and is equal to "Soniar" block definition', function (assert) {
    let service = this.subject()
    let alias = 'Soar'
    let type = 'Soniar'
    assert.ok(service.existBlockType(alias))
    assert.ok(service.areAlias(alias, type))
    assert.notOk(service.areAllAlias(service.getBlockTypesWithNotAlias(alias), type))
});

test('check if "Agarrarllave" block definition exist and is equal to "AgarrarLlave" block definition', function (assert) {
    let service = this.subject()
    let alias = 'Agarrarllave'
    let type = 'AgarrarLlave'
    assert.ok(service.existBlockType(alias))
    assert.ok(service.areAlias(alias, type))
    assert.notOk(service.areAllAlias(service.getBlockTypesWithNotAlias(alias), type))
});

test('check if "Abrircofre" block definition exist and is equal to "AbrirCofre" block definition', function (assert) {
    let service = this.subject()
    let alias = 'Abrircofre'
    let type = 'AbrirCofre'
    assert.ok(service.existBlockType(alias))
    assert.ok(service.areAlias(alias, type))
    assert.notOk(service.areAllAlias(service.getBlockTypesWithNotAlias(alias), type))
});

test('check if "Darsombrero" block definition exist and is equal to "DarSombrero" block definition', function (assert) {
    let service = this.subject()
    let alias = 'Darsombrero'
    let type = 'DarSombrero'
    assert.ok(service.existBlockType(alias))
    assert.ok(service.areAlias(alias, type))
    assert.notOk(service.areAllAlias(service.getBlockTypesWithNotAlias(alias), type))
});

test('check if "Atacarconespada" block definition exist and is equal to "AtacarConEspada" block definition', function (assert) {
    let service = this.subject()
    let alias = 'Atacarconespada'
    let type = 'AtacarConEspada'
    assert.ok(service.existBlockType(alias))
    assert.ok(service.areAlias(alias, type))
    assert.notOk(service.areAllAlias(service.getBlockTypesWithNotAlias(alias), type))
});

test('check if "Escaparenunicornio" block definition exist and is equal to "EscaparEnUnicornio" block definition', function (assert) {
    let service = this.subject()
    let alias = 'Escaparenunicornio'
    let type = 'EscaparEnUnicornio'
    assert.ok(service.existBlockType(alias))
    assert.ok(service.areAlias(alias, type))
    assert.notOk(service.areAllAlias(service.getBlockTypesWithNotAlias(alias), type))
});

test('check if "estoyInicio" block definition exist and is equal to "EstoySobreElInicio" block definition', function (assert) {
    let service = this.subject()
    let alias = 'estoyInicio'
    let type = 'EstoySobreElInicio'
    assert.ok(service.existBlockType(alias))
    assert.ok(service.areAlias(alias, type))
    assert.notOk(service.areAllAlias(service.getBlockTypesWithNotAlias(alias), type))
});

test('check if "estoyAlInicio" block definition exist and is equal to "EstoySobreElInicio" block definition', function (assert) {
    let service = this.subject()
    let alias = 'estoyAlInicio'
    let type = 'EstoySobreElInicio'
    assert.ok(service.existBlockType(alias))
    assert.ok(service.areAlias(alias, type))
    assert.notOk(service.areAllAlias(service.getBlockTypesWithNotAlias(alias), type))
});

test('check if "estoyFinColumna" block definition exist and is equal to "EstoySobreElFinal" block definition', function (assert) {
    let service = this.subject()
    let alias = 'estoyFinColumna'
    let type = 'EstoySobreElFinal'
    assert.ok(service.existBlockType(alias))
    assert.ok(service.areAlias(alias, type))
    assert.notOk(service.areAllAlias(service.getBlockTypesWithNotAlias(alias), type))
});

test('check if "EstoyAlFin" block definition exist and is equal to "EstoySobreElFinal" block definition', function (assert) {
    let service = this.subject()
    let alias = 'EstoyAlFin'
    let type = 'EstoySobreElFinal'
    assert.ok(service.existBlockType(alias))
    assert.ok(service.areAlias(alias, type))
    assert.notOk(service.areAllAlias(service.getBlockTypesWithNotAlias(alias), type))
});

test('check if "ComerBananaNano" block definition exist and is equal to "ComerBanana" block definition', function (assert) {
    let service = this.subject()
    let alias = 'ComerBananaNano'
    let type = 'ComerBanana'
    assert.ok(service.existBlockType(alias))
    assert.ok(service.areAlias(alias, type))
    assert.notOk(service.areAllAlias(service.getBlockTypesWithNotAlias(alias), type))
});

test('check if "saltar1" block definition exist and is equal to "SaltarHablando" block definition', function (assert) {
    let service = this.subject()
    let alias = 'saltar1'
    let type = 'SaltarHablando'
    assert.ok(service.existBlockType(alias))
    assert.ok(service.areAlias(alias, type))
    assert.notOk(service.areAllAlias(service.getBlockTypesWithNotAlias(alias), type))
});