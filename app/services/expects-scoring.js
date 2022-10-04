import Service from '@ember/service'
import { inject as service } from '@ember/service'
import { find, groupBy } from 'ramda'
import { expectationDescription } from '../utils/expectations'

export const solutionWorks = 'solution_works'

export default Service.extend({
    intl: service(),
    challengeExpectations: service(),

    expectsResults(expects, challenge) {
        const analysisResults = this.combineMultipleExpectations(expects)
        return [this.solutionWorksExpectResult()].concat(this.allResultsIncludingUnusedExpects(analysisResults, challenge)).filter(this.isScoreable)
    },

    //We do this instead of just using the analysisResults bacause we need to check if there are unused expectations.
    allResultsIncludingUnusedExpects(analysisResults, challenge) {
        return this.challengeExpectations.allExpectIdsIn(challenge).map(expectationId => this.expectWithId(expectationId, analysisResults))
    },

    //If the expectation is not used, the result should default to true, otherwise the analysisResult should be used.
    expectWithId(expectationId, analysisResults) {
        const possibleResult = analysisResults.find(expectResult => expectResult.id === expectationId)
        return possibleResult || this.unusedExpectationIdToPassingExpectation(expectationId)
    },

    unusedExpectationIdToPassingExpectation(expectationId) {
        return {
            id: expectationId,
            isScoreable: true,
            result: true,
            description: {}
        }
    },

    failedExpects(expects, challenge) {
        return this.expectsResults(expects, challenge).filter(e => !e.result)
    },

    allPassedExpects(expects, challenge) {
        return this.expectsResults(expects, challenge).filter(e => e.result)
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

        return {
            id: solutionWorks,
            description: expectationDescription(this.intl, solutionWorks, true, params),
            result: true,
            ...params
        }
    },

    totalScore(expects, challenge) {
        return 100 * this.allPassedExpects(expects, challenge).length / (this.challengeExpectations.totalScoreOf(challenge) + 1) // Solution works adds one to the final score
    }

})