import { allProceduresShould, declaresAnyProcedure, declaresProcedureId, doesNotUseRecursion, doesNotUseRecursionId, doSomething, doSomethingId, expectationDescription, isUsed, isUsedFromMain, isUsedFromMainId, isUsedId, mainNotTooLong, mainTooLongId, multiExpect, nameWasChanged, nameWasChangedId, notTooLong, tooLongId } from "./expectations"

//TODO: Better name pending

// DECLARATION EVALUATIONS

const notTooLongEvaluation = simpleEvaluation(tooLongId, notTooLong(), true)

const doSomethingEvaluation = simpleEvaluation(doSomethingId, doSomething, true)

const isUsedEvaluation = simpleEvaluation(isUsedId, isUsed, false)

const isUsedFromMainEvaluation = simpleEvaluation(isUsedFromMainId, isUsedFromMain, false)

const doesNotUseRecursionEvaluation = simpleEvaluation(doesNotUseRecursionId, doesNotUseRecursion, false)

const nameWasChangedEvaluation = {
    id: nameWasChangedId,
    isScoreable: true,

    expectation(intl) {
        return nameWasChanged(intl)
    },

    partialFeedbackItems: bindableSimplePartialFeedbackItems
}

// GLOBAL EVALUATIONS
const declaresAnyProcedureEvaluation = simpleEvaluation(declaresProcedureId, declaresAnyProcedure, true)

const mainNotTooLongEvaluation = simpleEvaluation(mainTooLongId, () => mainNotTooLong(), true)

const allProceduresShouldEvaluation = {
    declarationEvaluations: [
        notTooLongEvaluation,
        doSomethingEvaluation,
        isUsedEvaluation,
        isUsedFromMainEvaluation,
        doesNotUseRecursionEvaluation,
        nameWasChangedEvaluation
    ],

    expectation(intl) {
        return allProceduresShould(
            ...this.declarationEvaluations.map(de => de.expectation(intl))
        )
    },

    partialFeedbackItems: bindablePartialFeedbackItems,

    evaluations() {
        return this.declarationEvaluations
    }
}

// MAIN EVALUATIONS

const decompositionEvaluation = {
    globalEvaluations: [declaresAnyProcedureEvaluation, mainNotTooLongEvaluation, allProceduresShouldEvaluation],

    expectation(intl) {
        return multiExpect(
            ...this.globalEvaluations.map(ge => ge.expectation(intl))
        )
    },

    partialFeedbackItems: bindablePartialFeedbackItems,

    evaluations() {
        return this.globalEvaluations
    }
}

function bindablePartialFeedbackItems(intl) {
    return this.evaluations().flatMap(ge => ge.partialFeedbackItems(intl))
}

export const idsToChallengeEvaluation = {
    decomposition: decompositionEvaluation
}

function simpleEvaluation(id, expectation, isScoreable, params = {}) {
    return {
        id,
        isScoreable,
        ...params, //TODO: revisar poque si hacemos esto se mezcla con otros atributos.

        expectation() {
            return expectation
        },

        partialFeedbackItems: bindableSimplePartialFeedbackItems
    }
}

function bindableSimplePartialFeedbackItems(intl) {
    const params = { isScoreable: this.isScoreable } //TODO: integrar params?
    const result = false
    return [{
        id: this.id,
        description: expectationDescription(intl, this.id, result, params),
        result,
        ...params
    }]
}