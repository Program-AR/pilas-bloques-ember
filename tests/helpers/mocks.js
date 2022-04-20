import EmberObject from '@ember/object'
import Service from '@ember/service';
import sinon from 'sinon';

export const pilasMock = {
    on() { },
    liberarRecursos() { },
    estaResueltoElProblema() { return true; },
    loadPilas() { return Promise.resolve(this) },
    modoTurboEstaActivado() { return true; },
    setChallenge: sinon.stub(),
    restartScene: sinon.stub(),
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

export const activityExpectationsMock = Service.extend({
    expectations: () => '',
    expectationFor(/* activity */) { return this.expectations }
});

export const createActividadMock = (fields) => EmberObject.extend({
    id: "000",
    nombre: "Actividad_Mock",
    bloques: ['controls_if'],
    escena: `new DibujandoLibremente()`,
    grupo: {
        capitulo: {
            libro: {
                modoLecturaSimple: true
            }
        }
    },
    ...fields
}).create()

export const actividadMock = createActividadMock()

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

export const toastMock = Service.extend({
    show: sinon.stub()
})

export const routerMock = Service.extend({
    transitionTo: sinon.stub()
})

export const fakeUser = { username: "TEST", token: "TOKEN", answeredQuestionIds: [] }

// jshint unused: false
export const simpleReadMock = Service.extend({
    shouldShow: true,

    // param is necessary because simpleRead service expects an argument
    shouldShowSimpleRead(_) {
        return this.shouldShow
    }
})

export const createActivity = (owner, fields) => {
    const group = createGroup(owner)
    return owner.lookup('service:store').createRecord('desafio', { grupo: group, escena: "AlienInicial", bloques: ['controls_if'], ...fields })
}

export const createGroup = (owner, fields) => {
    return owner.lookup('service:store').createRecord('grupo', fields)
}
