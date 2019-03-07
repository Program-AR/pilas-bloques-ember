import Ember from 'ember';

export const pilasMock = {
    on() { },
    liberarRecursos() { },
    reiniciarEscenaCompleta() { },
    estaResueltoElProblema() { return true; }
};

const interpreteMock = { 
    paused_: false,
    run() { return false; }
};
export const interpreterFactoryMock = Ember.Service.extend({ crearInterprete(){ return interpreteMock; }});
export const actividadMock = { 
    get(key) { return this[key] }, //TODO: Sacar esta definición
    nombre: "Actividad_Mock",
    debeFelicitarse: true 
};
