import Service from '@ember/service';
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

export const interpreterFactoryMock = Service.extend({
    crearInterprete() { return interpreteMock; }
});

export const actividadMock = {
    get(key) { return this[key]; }, //TODO: Sacar esta definición y usar Ember.Component.extend
    id: "000",
    nombre: "Actividad_Mock",
    debeFelicitarse: true,

    grupo: {
        capitulo: {
            libro: {
                modoLecturaSimple: true
            }
        }
    }
};

export const componentMock = {
    properties: {},
    set: function (property, value) {
        componentMock.properties[property] = value;
    },
    get: function (property) {
        return componentMock.properties[property];
    },
}

export const blocklyWorkspaceMock = function () {
    let workspace = new Blockly.WorkspaceSvg({})
    workspace.createDom()
    workspace.cachedParentSvg_ = { getScreenCTM: sinon.stub() }
    Blockly.mainWorkspace = workspace
    workspace.highlightBlock = sinon.stub()
    return workspace
}