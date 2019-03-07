import Ember from 'ember';
import sinon from 'sinon';

export const pilasMock = {
    on() { },
    liberarRecursos() { },
    reiniciarEscenaCompleta: sinon.stub(),
    estaResueltoElProblema() { return true; }
};

export const interpreteMock = { 
    paused_: false,
    run: sinon.stub().returns(false)
};

export const interpreterFactoryMock = Ember.Service.extend({ 
    crearInterprete(){
        interpreteMock.run.resetHistory();
        return interpreteMock; 
    }
});

export const actividadMock = { 
    get(key) { return this[key]; }, //TODO: Sacar esta definición
    nombre: "Actividad_Mock",
    debeFelicitarse: true 
};
