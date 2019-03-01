import Ember from 'ember';

export const pilasMock = {
    on() { },
    liberarRecursos() { },
    reiniciarEscenaCompleta() { }
};

const interpreteMock = { run() { return false; }};
export const interpreterFactoryMock = Ember.Service.extend({ crearInterprete(){ return interpreteMock; }});

