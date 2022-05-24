import Service from '@ember/service'
import { inject as service } from '@ember/service'
import { groupBy } from 'ramda'
import { unwantedExpectsIds, doSomethingId, tooLongId, nameWasChangedId } from '../utils/expectations'

export const solutionWorks = 'solution_works'

export default Service.extend({
    intl: service(),

    genericDescriptionsKeys() {
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
        return [this.solutionWorksExpect()].concat(
            this.relevantGenericExpectations(this.combineMultipleExpectations(expects))
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

    relevantGenericExpectations(expects) {
        return expects.filter(expect => this.isRelevant(expect)).map(expect => this.genericDescriptionFor(expect))
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

    isRelevant(expect) {
        return !unwantedExpectsIds.some(id => id === expect.id)
    },

    genericDescriptionFor(expect) {
        const key = this.genericDescriptionsKeys()[expect.id]
        return {
            ...expect,
            description: key ? this.intl.t(key, { result: expect.result }).toString() : expect.description
        }
    },

    solutionWorksExpect() {
        return {
            id: solutionWorks,
            description: this.intl.t(`model.spects.${solutionWorks}`).toString(),
            result: true
        }
    }

})