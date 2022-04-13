import Service from '@ember/service'
import { entryPointType } from '../utils/blocks'
import { allProceduresShould, declaresAnyProcedure, doSomething, isUsed, isUsedFromMain, multiExpect, notTooLong, noExpectation } from '../utils/expectations'

const activityExpectations = {
  decomposition: multiExpect(
    declaresAnyProcedure,
    () => notTooLong()(entryPointType),
    allProceduresShould(
      notTooLong(),
      doSomething,
      isUsed,
      isUsedFromMain,
    )
  )
}

export default Service.extend({

  idsToExpectations: activityExpectations,

  expectationFor(activity) {
    return activity.expectations ? this.expectations(activity) : noExpectation
  },

  expectations(activity){
    return multiExpect(
      ...Object.entries(activity.expectations) //Must not be undefined
      .filter(e => this.shouldBeApplied(e))
      .map(([id, _]) => this.idsToExpectations[id])
    )
  },

  shouldBeApplied([id, shouldApply]) {
    return shouldApply && this.idsToExpectations[id]
  },
})
