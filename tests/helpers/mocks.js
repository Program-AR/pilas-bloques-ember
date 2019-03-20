import Ember from 'ember';
import sinon from 'sinon';

export const pilasMock = {
    on() { },
    liberarRecursos() { },
    estaResueltoElProblema() { return true; },
    reiniciarEscenaCompleta: sinon.stub(),
    cambiarAModoDeLecturaSimple: sinon.stub(),
    habilitarModoTurbo: sinon.stub(),
    deshabilitarModoTurbo: sinon.stub(),
};

export const interpreteMock = { 
    paused_: false,
    run: sinon.stub().returns(false)
};

export const interpreterFactoryMock = Ember.Service.extend({ 
    crearInterprete(){ return interpreteMock; }
});

export const actividadMock = { 
    get(key) { return this[key]; }, //TODO: Sacar esta definición
    nombre: "Actividad_Mock",
    debeFelicitarse: true,
    grupo: {
        libro: {
            modoLecturaSimple: true
        }
    }
};
