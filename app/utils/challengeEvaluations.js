import { allProceduresShould, declaresAnyProcedure, declaresProcedureId, doesNotUseRecursion, doesNotUseRecursionId, doSomething, doSomethingId, expectationDescription, isUsed, isUsedFromMain, isUsedFromMainId, isUsedId, mainNotTooLong, mainTooLongId, multiExpect, nameWasChanged, nameWasChangedId, notTooLong, tooLongId, parseExpect, noExpectation } from "./expectations"

const intlMock = {
    t() {
        return {
            string: ''
        }
    }
}

//TODO: Better name pending

// DECLARATION EVALUATIONS

const notTooLongEvaluation = simpleEvaluation(tooLongId, notTooLong())

const doSomethingEvaluation = simpleEvaluation(doSomethingId, doSomething)

const isUsedEvaluation = simpleEvaluation(isUsedId, isUsed)

const isUsedFromMainEvaluation = simpleEvaluation(isUsedFromMainId, isUsedFromMain)

const doesNotUseRecursionEvaluation = simpleEvaluation(doesNotUseRecursionId, doesNotUseRecursion)

const nameWasChangedEvaluation = {
    ...simpleEvaluation(nameWasChangedId, nameWasChanged(intlMock)), //TODO: this is only used to get params and options. Find a better solution.

    expectation(intl) {
        return nameWasChanged(intl)
    },

    partialFeedbackItems: bindableSimplePartialFeedbackItems
}

// GLOBAL EVALUATIONS
const declaresAnyProcedureEvaluation = simpleEvaluation(declaresProcedureId, declaresAnyProcedure)

const mainNotTooLongEvaluation = simpleEvaluation(mainTooLongId, () => mainNotTooLong())

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

const decompositionEvaluation = composeEvaluation(
    declaresAnyProcedureEvaluation,
    mainNotTooLongEvaluation,
    allProceduresShouldEvaluation
)

export const nullEvaluation = {

    expectation() {
        return noExpectation
    },

    partialFeedbackItems() {
        return []
    }
}

function simpleEvaluation(id, expectation) {
    return {
        id,
        ...parseExpect(expectation('mock'))[1],

        expectation() {
            return expectation
        },

        partialFeedbackItems: bindableSimplePartialFeedbackItems
    }
}

function composeEvaluation(...evaluations) {
    return {
        expectation(intl) {
            return multiExpect(
                ...this.evaluations().map(e => e.expectation(intl))
            )
        },

        partialFeedbackItems: bindablePartialFeedbackItems,

        evaluations() {
            return evaluations
        }
    }
}

function bindablePartialFeedbackItems(intl) {
    return this.evaluations().flatMap(e => e.partialFeedbackItems(intl))
}

function bindableSimplePartialFeedbackItems(intl) {
    const params = parseExpect(this.expectation(intl)('mock'))[1] //TODO: think a better solution
    const result = false
    return [{
        id: this.id,
        description: expectationDescription(intl, this.id, result, params),
        result,
        ...params
    }]
}

const idsToChallengeEvaluation = {
    decomposition: decompositionEvaluation,

    /* TODO: uncommnent after experiment is done. Related to https://github.com/Program-AR/pilas-bloques/issues/1042
    Only decomposition should be active. Don't forget imports

    conditionalAlternative: simpleEvaluation(conditionalAlternativeId, usesConditionalAlternative),

    conditionalRepetition: simpleEvaluation(conditionalRepetitionId, usesConditionalRepetition),

    simpleRepetition: simpleEvaluation(simpleRepetitionId, usesSimpleRepetition),

    */
}

function idToChallengeEvaluation(id) {
    return idsToChallengeEvaluation[id] || nullEvaluation
}

function idsToSingleEvaluation(...ids) {
    return composeEvaluation(...ids.map(id => idToChallengeEvaluation(id)))
}

export const idsMapper = {
    idsToSingleEvaluation
}