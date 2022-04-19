import Service from '@ember/service'
import { entryPointType } from '../utils/blocks'
import { allProceduresShould, declaresAnyProcedure, doesNotUseRecursion, doSomething, isUsed, isUsedFromMain, multiExpect, notTooLong, noExpectation, nameWasChanged, usesConditionalAlternative, usesConditionalRepetition } from '../utils/expectations'
import { inject as service } from '@ember/service';

const activityExpectations = (intl) => ({
  decomposition: multiExpect(
    declaresAnyProcedure,
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

})

export default Service.extend({
  intl: service(),

  idsToExpectations: activityExpectations,

  expectationFor(activity) {
    return activity.expectations ? this.expectations(activity) : noExpectation
  },

  expectations(activity){
    return multiExpect(
      ...Object.entries(activity.expectations) //Must not be undefined
      .filter(e => this.shouldBeApplied(e))
      .map(([id, _]) => this.idToExpectation(id)) // jshint ignore: line
    )
  },

  shouldBeApplied([id, shouldApply]) {
    return shouldApply && this.idToExpectation(id)
  },

  idToExpectation(id) {
    return this.idsToExpectations(this.intl)[id]
  }
})
