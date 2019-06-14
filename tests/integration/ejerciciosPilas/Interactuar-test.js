import { test } from 'ember-qunit';
import { moduloEjerciciosPilas } from '../../helpers/ejerciciosPilasTest';
import createPilasTest from '../../helpers/createPilasTest';
import sinon from 'sinon';

const nombre = 'Interactuar';

moduloEjerciciosPilas(nombre);

test('Interactuar sanitiza correctamente argumentos correctos', function (assert) {
    return createPilasTest(this, 'EscenaTests', (pilas, resolve, pilasService) => {
        let Interactuar = pilasService.evaluar("Interactuar");
        let argumentos = {
            etiqueta: "etiqueta",
            animacionInteractuadoMientras: "animacionInteractuadoMientras",
            nombreAnimacion: "interactuar"
        };
        let instance = new Interactuar(argumentos);
        instance.sanitizarArgumentos();

        assert.ok(instance);
        resolve();
    });
});

test('no se puede crear una instancia de Interactuar, falta la etiqueta', function (assert) {
    return createPilasTest(this, 'EscenaTests', (pilas, resolve, pilasService) => {
        let ArgumentError = pilasService.evaluar("ArgumentError");
        let Interactuar = pilasService.evaluar("Interactuar");
        let argumentos = {};

        assert.throws(() => {
            new Interactuar(argumentos).sanitizarArgumentos();
        }, new ArgumentError("Debe proveerse una etiqueta para verificar interacción"), 'Expect an error with this message');
        resolve();
    });
});

test('El mensaje interactuar llama al método alInteractuar', function (assert) {
    return createPilasTest(this, 'EscenaTests', (pilas, resolve, pilasService) => {
        let Interactuar = pilasService.evaluar("Interactuar");
        let argumentos = {
            etiqueta: "etiqueta",
            animacionInteractuadoMientras: "animacionInteractuadoMientras",
            nombreAnimacion: "interactuar"
        };
        let instance = new Interactuar(argumentos);
        let spy = sinon.spy(instance, 'alInteractuar')
        instance.interactuar();
        assert.ok(spy.calledOnce);
        spy.restore();
        resolve();
    });
});

test(`animacionInteractuadoMientras funciona correctamente`, function (assert) {
    return createPilasTest(this, 'EscenaTests', (pilas, resolve, pilasService) => {
        let Alien = pilasService.evaluar("AlienAnimado");
        let Interactuar = pilasService.evaluar("Interactuar");
        let argumentos = {
            etiqueta: "AlienAnimado",
            animacionInteractuadoMientras: "hablar",
            nombreAnimacion: "apretar"
        };

        let alienInstance = new Alien(0, 0);
        let spy = sinon.spy(alienInstance, 'cargarAnimacion')
        let interactuarInstance = new Interactuar(argumentos);

        sinon.stub(Interactuar.prototype, 'interactuado').callsFake(() => {
            return alienInstance;
        })

        interactuarInstance.preAnimacion();

        assert.ok(argumentos.animacionInteractuadoMientras === interactuarInstance.interactuado().nombreAnimacionActual());
        assert.ok(spy.calledOnce);
        spy.restore();
        resolve();
    });
});

test(`animacionInteractuadoAlFinal funciona correctamente`, function (assert) {
    return createPilasTest(this, 'EscenaTests', (pilas, resolve, pilasService) => {
        let Alien = pilasService.evaluar("AlienAnimado");
        let Interactuar = pilasService.evaluar("Interactuar");
        let argumentos = {
            etiqueta: "AlienAnimado",
            animacionInteractuadoMientras: "hablar",
            nombreAnimacion: "apretar",
            animacionInteractuadoAlFinal: "parado"
        };

        let alienInstance = new Alien(0, 0);
        let spy = sinon.spy(alienInstance, 'cargarAnimacion')
        let interactuarInstance = new Interactuar(argumentos);

        sinon.stub(Interactuar.prototype, 'interactuado').callsFake(() => {
            return alienInstance;
        })

        interactuarInstance.postAnimacion();

        assert.ok(argumentos.animacionInteractuadoAlFinal === interactuarInstance.interactuado().nombreAnimacionActual());
        assert.ok(spy.calledOnce);
        spy.restore();
        resolve();
    });
});