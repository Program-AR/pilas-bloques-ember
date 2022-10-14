import Service from '@ember/service'
import { inject as service } from '@ember/service'
import { find, groupBy } from 'ramda'
import { expectationDescription, doesNotNestControlStructuresId } from '../utils/expectations'

export const solutionWorks = 'solution_works'

export default Service.extend({
    intl: service(),
    challengeExpectations: service(),
    pilasService: service('pilas'),

    expectsResults(expects) {
        return [this.solutionWorksExpectResult()].concat(this.combineMultipleExpectations(expects)).filter(this.isScoreable)
    },

    failedExpects(expects) {
        return this.expectsResults(expects).filter(e => !e.result)
    },

    allPassedExpects(expects) {
        return this.expectsResults(expects).filter(e => e.result)
    },

    groupById(expects) {
        return Object.values(groupBy(e => e.id)(expects))
    },

    combineMultipleExpectations(expects) {
        return this.groupById(expects).map(this.expectationGroupingResult)
    },

    //The result of a grouping is an expectation that represents that the grouping passed or failed. 
    //A grouping passes when at least an expectation passes, otherwise it fails.
    expectationGroupingResult(expectationGrouping) {
        const expectPasses = (e) => e.result
        const possiblePassingExpect = find(expectPasses)(expectationGrouping)
        const anyExpect = expectationGrouping[0]
        return possiblePassingExpect || anyExpect
    },

    isScoreable(expect) {
        return !!expect.description.asScoring
    },

    solutionWorksExpectResult() {
        const params = { isScoreable: true }
        const result = this.pilasService.estaResueltoElProblema()

        return {
            id: solutionWorks,
            description: expectationDescription(this.intl, solutionWorks, result, params),
            result,
            ...params
        }
    },

    unusedExpects(expects, challenge) {
        const unusedExpectIds = this.challengeExpectations.allExpectIdsIn(challenge).filter(expectId => !this.expectIdIsUsed(expectId, expects))
        return unusedExpectIds.map(id => this.unusedExpectationIdToPassingExpectation(id, expects))
    },

    expectIdIsUsed(expectationId, expects) {
        return this.expectsResults(expects).some(expectResult => expectResult.id === expectationId)
    },

    unusedExpectationIdToPassingExpectation(expectationId) {
        return {
            id: expectationId,
            isScoreable: true,
            result: expectationId === doesNotNestControlStructuresId, // the only one with default true,
            description: {}
        }
    },

    resultsIncludingUnusedExpects(expects, challenge) {
        return this.expectsResults(expects).concat(this.unusedExpects(expects, challenge))
    },

    totalScore(expects, challenge) {
        const resultsIncludingUnused = this.resultsIncludingUnusedExpects(expects, challenge)
        const passingResults = resultsIncludingUnused.filter(e => e.result)
        return 100 * passingResults.length / (this.challengeExpectations.howManyScoreableExpectationsFor(challenge) + 1) // Solution works adds one to the final score
    }

})