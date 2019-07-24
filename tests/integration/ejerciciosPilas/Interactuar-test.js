import { test } from 'qunit';
import {
    moduloEjerciciosPilas,
    hacerLuegoConCallback
} from '../../helpers/ejerciciosPilasTest';
import createPilasTest from '../../helpers/createPilasTest';
import sinon from 'sinon';

const nombre = 'Interactuar';

let argumentosParaApretar = {
    etiqueta: "BotonAnimado",
    nombreAnimacion: "apretar",
    animacionInteractuadoAlFinal: "prendida"
}

function setup(pilasService) {
    let Interactuar = pilasService.evaluar("Interactuar");
    let alien = new (pilasService.evaluar("AlienAnimado"))(0, 0);
    pilasService.evaluar("pilas").escena_actual().automata = alien;
    let boton = new (pilasService.evaluar("BotonAnimado"))(0, 0);
    let cuadricula = new (pilasService.evaluar("Cuadricula"))(0, 0, 1, 2, {}, { grilla: 'invisible.png' });
    return { Interactuar, alien, boton, cuadricula };
}

function interactuarAlienThrows(argumentos, mensajeError, pilasService, assert, alien) {
    // Idealmente estas 3 líneas deberían ser un hacerLuegoConCallback, pero
    // no hay hooks para esperar un error, así que por eso se usa el iniciar y configuracionInicial
    let elInteractuar = new (pilasService.evaluar("Interactuar"))(argumentos);
    elInteractuar.iniciar(alien);
    assert.throws(
        () => elInteractuar.configuracionInicial(),
        new (pilasService.evaluar("ActividadError"))(mensajeError)
    );
}

moduloEjerciciosPilas(nombre, () => {

    test('Sanitización: Interactuar sanitiza correctamente argumentos correctos', function (assert) {
        return createPilasTest(this, 'EscenaTests', (pilas, resolve, pilasService) => {
            let Interactuar = pilasService.evaluar("Interactuar");
            let instance = new Interactuar(argumentosParaApretar);

            instance.sanitizarArgumentos();
            assert.ok(true); // la linea anterior no debe estallar.
            resolve();
        });
    });

    test('Sanitización: No se puede crear una instancia de Interactuar, falta la etiqueta', function (assert) {
        return createPilasTest(this, 'EscenaTests', (pilas, resolve, pilasService) => {
            let ArgumentError = pilasService.evaluar("ArgumentError");
            let Interactuar = pilasService.evaluar("Interactuar");

            assert.throws(
                () => new Interactuar({}).sanitizarArgumentos(),
                new ArgumentError("Debe proveerse una etiqueta para verificar interacción")
            );
            resolve();
        });
    });

    test('Sin cuadrícula: No se puede interactuar con un objeto si estoy lejos', function (assert) {
        return createPilasTest(this, 'EscenaTests', (pilas, resolve, pilasService) => {
            let { alien, boton } = setup(pilasService);
            boton.x += 300;

            interactuarAlienThrows(argumentosParaApretar, "¡Acá no hay boton!", pilasService, assert, alien);
            resolve();
        });
    });

    test('Con cuadrícula: No se puede interactuar con un objeto si estoy en otra casilla', function (assert) {
        return createPilasTest(this, 'EscenaTests', (pilas, resolve, pilasService) => {
            let { alien, boton, cuadricula } = setup(pilasService);
            cuadricula.agregarActor(alien, 0, 0);
            cuadricula.agregarActor(boton, 0, 1);

            interactuarAlienThrows(argumentosParaApretar, "¡Acá no hay boton!", pilasService, assert, alien);
            resolve();
        });
    });

    test('Sin cuadrícula: Interactúa cuando está el objeto. AnimacionInteractuadoFinal funciona correctamente', function (assert) {
        return createPilasTest(this, 'EscenaTests', (pilas, resolve, pilasService) => {
            let { Interactuar, alien, boton } = setup(pilasService);

            hacerLuegoConCallback(alien, Interactuar, argumentosParaApretar, () => {
                assert.equal(argumentosParaApretar.animacionInteractuadoAlFinal, boton.nombreAnimacionActual());
                resolve();
            });
        });
    });

    test('Con cuadrícula: Interactúa cuando está el objeto', function (assert) {
        return createPilasTest(this, 'EscenaTests', (pilas, resolve, pilasService) => {
            let { Interactuar, alien, boton, cuadricula } = setup(pilasService);
            cuadricula.agregarActor(alien, 0, 0);
            cuadricula.agregarActor(boton, 0, 0);
            boton.x += 300; // para asegurar que no está chequeando por proximidad sino por casilla

            hacerLuegoConCallback(alien, Interactuar, argumentosParaApretar, () => {
                assert.equal(argumentosParaApretar.animacionInteractuadoAlFinal, boton.nombreAnimacionActual());
                resolve();
            });
        });
    });

    test('mensajeError funciona correctamente', function (assert) {
        return createPilasTest(this, 'EscenaTests', (pilas, resolve, pilasService) => {
            let { alien } = setup(pilasService);
            let argumentosMensajeError = { etiqueta: 'AbortoLegal', mensajeError: 'Para no morir' };

            interactuarAlienThrows(argumentosMensajeError, "Para no morir", pilasService, assert, alien);
            resolve();
        });
    });

    test(`animacionInteractuadoMientras funciona correctamente`, function (assert) {
        return createPilasTest(this, 'EscenaTests', (pilas, resolve, pilasService) => {
            let { Interactuar, alien } = setup(pilasService);
            let argumentos = {
                etiqueta: "AlienAnimado",
                animacionInteractuadoMientras: "hablar",
                nombreAnimacion: "apretar"
            };
            let elInteractuar = new Interactuar(argumentos);

            let spy = sinon.spy(alien, 'cargarAnimacion')
            sinon.stub(Interactuar.prototype, 'interactuado').callsFake(() => {
                return alien;
            })

            elInteractuar.preAnimacion();
            assert.equal(argumentos.animacionInteractuadoMientras, elInteractuar.interactuado().nombreAnimacionActual());
            assert.ok(spy.calledOnce);

            spy.restore();
            resolve();
        });
    });

    test('comportamientoAdicional funciona correctamente', function (assert) {
        return createPilasTest(this, 'EscenaTests', (pilas, resolve, pilasService) => {
            let { Interactuar, alien, boton } = setup(pilasService);
            let argumentos = {
                etiqueta: 'BotonAnimado',
                comportamientoAdicional: 'ComportamientoAnimado',
                argumentosComportamiento: { nombreAnimacion: 'apagada' }
            };
            let spy = sinon.spy(boton, 'hacer_luego')

            hacerLuegoConCallback(alien, Interactuar, argumentos, () => {
                assert.ok(spy.calledOnce);

                spy.restore();
                resolve();
            });
        });
    });

});