import Service from '@ember/service'
import { inject as service } from '@ember/service'
import { find, groupBy } from 'ramda'
import { expectationDescription } from '../utils/expectations'

export const solutionWorks = 'solution_works'

export default Service.extend({
    intl: service(),
    challengeExpectations: service(),

    expectsResults(expects, challenge) {
        //return [this.solutionWorksExpectResult()].concat(this.combineMultipleExpectations(expects)).filter(this.isScoreable)
        return [this.solutionWorksExpectResult()].concat(this.scoreItems(expects, challenge))
    },

    failedExpects(expects, challenge) {
        return this.expectsResults(expects, challenge).filter(e => !e.result)
    },

    allPassedExpects(expects, challenge) {
        return this.expectsResults(expects, challenge).filter(e => e.result)
    },

    scoreItems(expects, challenge) {
        const combinedExpectations = this.combineMultipleExpectations(expects)
        return this.challengeExpectations.partialFeedbackItems(challenge)
            .filter(this.isScoreable)
            .map(item => this.fillScoreItem(item, combinedExpectations))
    },

    fillScoreItem(item, combinedExpectations) {
        const matchingExpectation = combinedExpectations.find(e => e.id === item.id) || {}
        return {
            ...item,
            ...matchingExpectation
        }
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
        return 100 * this.allPassedExpects(expects, challenge).length / this.expectsResults(expects, challenge).length
    }

})