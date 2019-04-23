import { moduleFor, test } from 'ember-qunit';

moduleFor('service:blocks-gallery', 'Unit | Service | pilas', {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
    needs: ['service:blocksGallery', 'service:blockly'],
    setup() {
        this.container.lookup('service:blocksGallery').start()
    }
});

test('check if "si" block definition exist and is equal to "Si" block definition', function (assert) {
    assert.ok(Blockly.Blocks['si'] != undefined)
    assert.ok(Blockly.Blocks['si'].init == Blockly.Blocks['Si'].init)
});

test('check if "sino" block definition exist and is equal to "SiNo" block definition', function (assert) {
    assert.ok(Blockly.Blocks['sino'] != undefined)
    assert.ok(Blockly.Blocks['sino'].init == Blockly.Blocks['SiNo'].init)
});

test('check if "Sino" block definition exist and is equal to "SiNo" block definition', function (assert) {
    assert.ok(Blockly.Blocks['Sino'] != undefined)
    assert.ok(Blockly.Blocks['Sino'].init == Blockly.Blocks['SiNo'].init)
});

test('check if "hasta" block definition exist and is equal to "Hasta" block definition', function (assert) {
    assert.ok(Blockly.Blocks['hasta'] != undefined)
    assert.ok(Blockly.Blocks['hasta'].init == Blockly.Blocks['Hasta'].init)
});

test('check if "prenderCompuConColision" block definition exist and is equal to "PrenderComputadora" block definition', function (assert) {
    assert.ok(Blockly.Blocks['PrenderCompuConColision'] != undefined)
    assert.ok(Blockly.Blocks['PrenderCompuConColision'].init == Blockly.Blocks['PrenderComputadora'].init)
});

test('check if "PrenderCompu" block definition exist and is equal to "PrenderComputadora" block definition', function (assert) {
    assert.ok(Blockly.Blocks['PrenderCompu'] != undefined)
    assert.ok(Blockly.Blocks['PrenderCompu'].init == Blockly.Blocks['PrenderComputadora'].init)
});

test('check if "ApagarCompu" block definition exist and is equal to "ApagarComputadora" block definition', function (assert) {
    assert.ok(Blockly.Blocks['ApagarCompu'] != undefined)
    assert.ok(Blockly.Blocks['ApagarCompu'].init == Blockly.Blocks['ApagarComputadora'].init)
});

test('check if "SiguienteCompu" block definition exist and is equal to "PasarASiguienteComputadora" block definition', function (assert) {
    assert.ok(Blockly.Blocks['SiguienteCompu'] != undefined)
    assert.ok(Blockly.Blocks['SiguienteCompu'].init == Blockly.Blocks['PasarASiguienteComputadora'].init)
});

test('check if "Descubralculpable" block definition exist and is equal to "EsCulpable" block definition', function (assert) {
    assert.ok(Blockly.Blocks['Descubralculpable'] != undefined)
    assert.ok(Blockly.Blocks['Descubralculpable'].init == Blockly.Blocks['EsCulpable'].init)
});

test('check if "repetir" block definition exist and is equal to "Repetir" block definition', function (assert) {
    assert.ok(Blockly.Blocks['repetir'] != undefined)
    assert.ok(Blockly.Blocks['repetir'].init == Blockly.Blocks['Repetir'].init)
});

test('check if "tocandoBanana" block definition exist and is equal to "TocandoBanana" block definition', function (assert) {
    assert.ok(Blockly.Blocks['tocandoBanana'] != undefined)
    assert.ok(Blockly.Blocks['tocandoBanana'].init == Blockly.Blocks['TocandoBanana'].init)
});

test('check if "tocandoManzana" block definition exist and is equal to "TocandoManzana" block definition', function (assert) {
    assert.ok(Blockly.Blocks['tocandoManzana'] != undefined)
    assert.ok(Blockly.Blocks['tocandoManzana'].init == Blockly.Blocks['TocandoManzana'].init)
});

test('check if "PrenderFogata" block definition exist and is equal to "PrenderFogata" block definition', function (assert) {
    assert.ok(Blockly.Blocks['PrenderFogata'] != undefined)
    assert.ok(Blockly.Blocks['PrenderFogata'].init == Blockly.Blocks['PrenderFogata'].init)
});

test('check if "Dejarregalo" block definition exist and is equal to "DejarRegalo" block definition', function (assert) {
    assert.ok(Blockly.Blocks['Dejarregalo'] != undefined)
    assert.ok(Blockly.Blocks['Dejarregalo'].init == Blockly.Blocks['DejarRegalo'].init)
});

test('check if "Contarbanana" block definition exist and is equal to "ContarBanana" block definition', function (assert) {
    assert.ok(Blockly.Blocks['Contarbanana'] != undefined)
    assert.ok(Blockly.Blocks['Contarbanana'].init == Blockly.Blocks['ContarBanana'].init)
});

test('check if "Contarmanzana" block definition exist and is equal to "ContarManzana" block definition', function (assert) {
    assert.ok(Blockly.Blocks['Contarmanzana'] != undefined)
    assert.ok(Blockly.Blocks['Contarmanzana'].init == Blockly.Blocks['ContarManzana'].init)
});

test('check if "AvanzarKm" block definition exist and is equal to "Avanzar1km" block definition', function (assert) {
    assert.ok(Blockly.Blocks['AvanzarKm'] != undefined)
    assert.ok(Blockly.Blocks['AvanzarKm'].init == Blockly.Blocks['Avanzar1km'].init)
});

test('check if "cambiarColor" block definition exist and is equal to "CambiarColor" block definition', function (assert) {
    assert.ok(Blockly.Blocks['cambiarColor'] != undefined)
    assert.ok(Blockly.Blocks['cambiarColor'].init == Blockly.Blocks['CambiarColor'].init)
});

test('check if "siguienteFoco" block definition exist and is equal to "siguienteFoco" block definition', function (assert) {
    assert.ok(Blockly.Blocks['siguienteFoco'] != undefined)
    assert.ok(Blockly.Blocks['siguienteFoco'].init == Blockly.Blocks['siguienteFoco'].init)
});

test('check if "empezarFiesta" block definition exist and is equal to "EmpezarFiesta" block definition', function (assert) {
    assert.ok(Blockly.Blocks['empezarFiesta'] != undefined)
    assert.ok(Blockly.Blocks['empezarFiesta'].init == Blockly.Blocks['EmpezarFiesta'].init)
});

test('check if "Volveralbordeizquierdo" block definition exist and is equal to "VolverAlBordeIzquierdo" block definition', function (assert) {
    assert.ok(Blockly.Blocks['Volveralbordeizquierdo'] != undefined)
    assert.ok(Blockly.Blocks['Volveralbordeizquierdo'].init == Blockly.Blocks['VolverAlBordeIzquierdo'].init)
});

test('check if "Primersospechoso" block definition exist and is equal to "IrAlPrimerSospechoso" block definition', function (assert) {
    assert.ok(Blockly.Blocks['Primersospechoso'] != undefined)
    assert.ok(Blockly.Blocks['Primersospechoso'].init == Blockly.Blocks['IrAlPrimerSospechoso'].init)
});

test('check if "PrimerSospechoso" block definition exist and is equal to "IrAlPrimerSospechoso" block definition', function (assert) {
    assert.ok(Blockly.Blocks['PrimerSospechoso'] != undefined)
    assert.ok(Blockly.Blocks['PrimerSospechoso'].init == Blockly.Blocks['IrAlPrimerSospechoso'].init)
});

test('check if "Siguientesospechoso" block definition exist and is equal to "IrAlSiguienteSospechoso" block definition', function (assert) {
    assert.ok(Blockly.Blocks['Siguientesospechoso'] != undefined)
    assert.ok(Blockly.Blocks['Siguientesospechoso'].init == Blockly.Blocks['IrAlSiguienteSospechoso'].init)
});

test('check if "SiguienteSospechoso" block definition exist and is equal to "IrAlSiguienteSospechoso" block definition', function (assert) {
    assert.ok(Blockly.Blocks['SiguienteSospechoso'] != undefined)
    assert.ok(Blockly.Blocks['SiguienteSospechoso'].init == Blockly.Blocks['IrAlSiguienteSospechoso'].init)
});

test('check if "Sacardisfraz" block definition exist and is equal to "InterrogarSospechoso" block definition', function (assert) {
    assert.ok(Blockly.Blocks['Sacardisfraz'] != undefined)
    assert.ok(Blockly.Blocks['Sacardisfraz'].init == Blockly.Blocks['InterrogarSospechoso'].init)
});

test('check if "SacarDisfraz" block definition exist and is equal to "InterrogarSospechoso" block definition', function (assert) {
    assert.ok(Blockly.Blocks['SacarDisfraz'] != undefined)
    assert.ok(Blockly.Blocks['SacarDisfraz'].init == Blockly.Blocks['InterrogarSospechoso'].init)
});

test('check if "Estoyenunaesquina" block definition exist and is equal to "EstoyEnEsquina" block definition', function (assert) {
    assert.ok(Blockly.Blocks['Estoyenunaesquina'] != undefined)
    assert.ok(Blockly.Blocks['Estoyenunaesquina'].init == Blockly.Blocks['EstoyEnEsquina'].init)
});

test('check if "tocandoFogata" block definition exist and is equal to "TocandoFogata" block definition', function (assert) {
    assert.ok(Blockly.Blocks['tocandoFogata'] != undefined)
    assert.ok(Blockly.Blocks['tocandoFogata'].init == Blockly.Blocks['TocandoFogata'].init)
});

test('check if "tocandoInicio" block definition exist and is equal to "TocandoInicio" block definition', function (assert) {
    assert.ok(Blockly.Blocks['tocandoInicio'] != undefined)
    assert.ok(Blockly.Blocks['tocandoInicio'].init == Blockly.Blocks['TocandoInicio'].init)
});

test('check if "tocandoFinal" block definition exist and is equal to "TocandoFinal" block definition', function (assert) {
    assert.ok(Blockly.Blocks['tocandoFinal'] != undefined)
    assert.ok(Blockly.Blocks['tocandoFinal'].init == Blockly.Blocks['TocandoFinal'].init)
});

test('check if "tocandoPelota" block definition exist and is equal to "TocandoPelota" block definition', function (assert) {
    assert.ok(Blockly.Blocks['tocandoPelota'] != undefined)
    assert.ok(Blockly.Blocks['tocandoPelota'].init == Blockly.Blocks['TocandoPelota'].init)
});

test('check if "tocandoQueso" block definition exist and is equal to "TocandoQueso" block definition', function (assert) {
    assert.ok(Blockly.Blocks['tocandoQueso'] != undefined)
    assert.ok(Blockly.Blocks['tocandoQueso'].init == Blockly.Blocks['TocandoQueso'].init)
});

test('check if "tocandoLuz" block definition exist and is equal to "TocandoLuz" block definition', function (assert) {
    assert.ok(Blockly.Blocks['tocandoLuz'] != undefined)
    assert.ok(Blockly.Blocks['tocandoLuz'].init == Blockly.Blocks['TocandoLuz'].init)
});

test('check if "Abrirojos" block definition exist and is equal to "AbrirOjos" block definition', function (assert) {
    assert.ok(Blockly.Blocks['Abrirojos'] != undefined)
    assert.ok(Blockly.Blocks['Abrirojos'].init == Blockly.Blocks['AbrirOjos'].init)
});

test('check if "Cerrarojos" block definition exist and is equal to "CerrarOjos" block definition', function (assert) {
    assert.ok(Blockly.Blocks['Cerrarojos'] != undefined)
    assert.ok(Blockly.Blocks['Cerrarojos'].init == Blockly.Blocks['CerrarOjos'].init)
});

test('check if "Soar" block definition exist and is equal to "Soniar" block definition', function (assert) {
    assert.ok(Blockly.Blocks['Soar'] != undefined)
    assert.ok(Blockly.Blocks['Soar'].init == Blockly.Blocks['Soniar'].init)
});

test('check if "Agarrarllave" block definition exist and is equal to "AgarrarLlave" block definition', function (assert) {
    assert.ok(Blockly.Blocks['Agarrarllave'] != undefined)
    assert.ok(Blockly.Blocks['Agarrarllave'].init == Blockly.Blocks['AgarrarLlave'].init)
});

test('check if "Abrircofre" block definition exist and is equal to "AbrirCofre" block definition', function (assert) {
    assert.ok(Blockly.Blocks['Abrircofre'] != undefined)
    assert.ok(Blockly.Blocks['Abrircofre'].init == Blockly.Blocks['AbrirCofre'].init)
});

test('check if "Darsombrero" block definition exist and is equal to "DarSombrero" block definition', function (assert) {
    assert.ok(Blockly.Blocks['Darsombrero'] != undefined)
    assert.ok(Blockly.Blocks['Darsombrero'].init == Blockly.Blocks['DarSombrero'].init)
});

test('check if "Atacarconespada" block definition exist and is equal to "AtacarConEspada" block definition', function (assert) {
    assert.ok(Blockly.Blocks['Atacarconespada'] != undefined)
    assert.ok(Blockly.Blocks['Atacarconespada'].init == Blockly.Blocks['AtacarConEspada'].init)
});

test('check if "Escaparenunicornio" block definition exist and is equal to "EscaparEnUnicornio" block definition', function (assert) {
    assert.ok(Blockly.Blocks['Escaparenunicornio'] != undefined)
    assert.ok(Blockly.Blocks['Escaparenunicornio'].init == Blockly.Blocks['EscaparEnUnicornio'].init)
});

test('check if "estoyInicio" block definition exist and is equal to "EstoySobreElInicio" block definition', function (assert) {
    assert.ok(Blockly.Blocks['estoyInicio'] != undefined)
    assert.ok(Blockly.Blocks['estoyInicio'].init == Blockly.Blocks['EstoySobreElInicio'].init)
});

test('check if "estoyAlInicio" block definition exist and is equal to "EstoySobreElInicio" block definition', function (assert) {
    assert.ok(Blockly.Blocks['estoyAlInicio'] != undefined)
    assert.ok(Blockly.Blocks['estoyAlInicio'].init == Blockly.Blocks['EstoySobreElInicio'].init)
});

test('check if "estoyFinColumna" block definition exist and is equal to "EstoySobreElFinal" block definition', function (assert) {
    assert.ok(Blockly.Blocks['estoyFinColumna'] != undefined)
    assert.ok(Blockly.Blocks['estoyFinColumna'].init == Blockly.Blocks['EstoySobreElFinal'].init)
});

test('check if "EstoyAlFin" block definition exist and is equal to "EstoySobreElFinal" block definition', function (assert) {
    assert.ok(Blockly.Blocks['EstoyAlFin'] != undefined)
    assert.ok(Blockly.Blocks['EstoyAlFin'].init == Blockly.Blocks['EstoySobreElFinal'].init)
});

test('check if "ComerBananaNano" block definition exist and is equal to "ComerBanana" block definition', function (assert) {
    assert.ok(Blockly.Blocks['ComerBananaNano'] != undefined)
    assert.ok(Blockly.Blocks['ComerBananaNano'].init == Blockly.Blocks['ComerBanana'].init)
});

test('check if "saltar1" block definition exist and is equal to "SaltarHablando" block definition', function (assert) {
    assert.ok(Blockly.Blocks['saltar1'] != undefined)
    assert.ok(Blockly.Blocks['saltar1'].init == Blockly.Blocks['SaltarHablando'].init)
});