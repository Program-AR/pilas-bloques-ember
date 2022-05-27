import Service from '@ember/service'
import { inject as service } from '@ember/service'
import { groupBy } from 'ramda'
import { nonScorableExpectsIds, doSomethingId, tooLongId, nameWasChangedId } from '../utils/expectations'

export const solutionWorks = 'solution_works'

export default Service.extend({
    intl: service(),

    combinedExpectsDescriptionsKeys() {
        const descriptions = {}
        descriptions[doSomethingId] = this.genericId(doSomethingId)
        descriptions[tooLongId] = this.genericId(tooLongId)
        descriptions[nameWasChangedId] = this.genericId(nameWasChangedId)

        return descriptions
    },

    genericId(id) {
        return `model.spects.generics.${id}`
    },

    expectsResults(expects) {
        return [this.solutionWorksExpectResult()].concat(
            this.scorableCombinedExpectations(this.combineMultipleExpectations(expects))
        )
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

    scorableCombinedExpectations(expects) {
        return expects.filter(expect => this.isScorable(expect)).map(expect => this.replaceCombinedExpectDescription(expect))
    },

    combineMultipleExpectations(expects) {
        return this.groupById(expects).map(group => group.reduce((e1, e2) => this.combineExpectPair(e1, e2)))
    },

    combineExpectPair(expect1, expect2) {
        return {
            ...expect1,
            ...expect2,
            result: expect1.result || expect2.result
        }
    },

    isScorable(expect) {
        return !nonScorableExpectsIds.some(id => id === expect.id)
    },

    replaceCombinedExpectDescription(expect) {
        const key = this.combinedExpectsDescriptionsKeys()[expect.id]
        return {
            ...expect,
            description: key ? this.intl.t(key, { result: expect.result }).toString() : expect.description
        }
    },

    solutionWorksExpectResult() {
        return {
            id: solutionWorks,
            description: this.intl.t(`model.spects.${solutionWorks}`).toString(),
            result: true
        }
    }

})