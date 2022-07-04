import Service from '@ember/service'
import { inject as service } from '@ember/service'
import { find, groupBy } from 'ramda'
import { expectationDescription } from '../utils/expectations'

export const solutionWorks = 'solution_works'

export default Service.extend({
    intl: service(),

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

        return {
            id: solutionWorks,
            description: expectationDescription(this.intl, solutionWorks, true, params),
            result: true,
            ...params
        }
    },

    totalScore(expects) {
        return 100 * this.allPassedExpects(expects).length / this.expectsResults(expects).length
    }

})