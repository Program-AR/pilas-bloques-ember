import EmberObject from '@ember/object'
import Service from '@ember/service';
import sinon from 'sinon';
import { allProceduresShould, doesNotUseRecursion, doSomething, isUsed, isUsedFromMain, multiExpect, notTooLong, nameWasChanged, usesConditionalAlternative, usesConditionalRepetition, usesSimpleRepetition } from '../../utils/expectations'
import { entryPointType } from '../../utils/blocks'

export const pilasMock = Service.extend({
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
})

export const interpreteMock = {
    paused_: false,
    run: sinon.stub().returns(false)
};

export const interpreterFactoryMock = Service.extend({
    crearInterprete() { return interpreteMock; }
});

export const challengeExpectationsMock = Service.extend({
    expectations: () => '',
    expectationFor(/* challenge */) { return this.expectations },
    howManyScoreableExpectationsFor(/* challenge */) { return 0 },
    allExpectIdsIn(/* challenge */) { return [] }
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
    hasAutomaticGrading: true,
    ...fields
}).create()

export const actividadMock = createActividadMock()
export const challengeWithExpectationsMock = createActividadMock({ expectations: { conditionalAlternative: true }, grupo: undefined })
export const expectationsConfigMock = {
    decomposition: true,
    simpleRepetition: true
}

export const createComponentMock = (_properties) => ({
    properties: _properties,
    set: function (property, value) {
        this.properties[property] = value;
    },
    get: function (property) {
        return this.properties[property];
    },
})

export const componentMock = createComponentMock({})

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

export const experimentsMock = Service.extend({

    shouldShowExpectsFeedback: false,

    setShouldShowBlocksWarningExpectationFeedback(value) {
        this.shouldShowExpectsFeedback = value
    },

    shouldShowBlocksWarningExpectationFeedback() { return this.shouldShowExpectsFeedback },

    updateSolvedChallenges() { }
})

export const createActivity = (owner, fields) => {
    const group = createGroup(owner)
    return owner.lookup('service:store').createRecord('desafio', { grupo: group, escena: "AlienInicial", bloques: ['controls_if'], ...fields })
}

export const createGroup = (owner, fields) => {
    return owner.lookup('service:store').createRecord('grupo', fields)
}

export const idsToExpectationsMock = (intl) => ({
    decomposition: multiExpect(
        () => notTooLong()(entryPointType),
        allProceduresShould(
            notTooLong(),
            doSomething,
            isUsed,
            isUsedFromMain,
            doesNotUseRecursion,
            nameWasChanged(intl)
        )
    ),

    conditionalAlternative: usesConditionalAlternative,

    conditionalRepetition: usesConditionalRepetition,

    simpleRepetition: usesSimpleRepetition,

})
