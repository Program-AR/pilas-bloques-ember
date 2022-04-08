import Service from '@ember/service'
import { entryPointType } from '../utils/blocks'
import { allProceduresShould, declaresAnyProcedure, doSomething, isUsed, isUsedFromMain, multiExpect, notTooLong, noExpectation } from '../utils/expectations'

const expectationsIds = {
  subtaskDivision: multiExpect(
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
  expectationFor(activity) {
    return activity.expectations ? this.expectations(activity) : noExpectation
  },

  expectations(activity){
    return multiExpect(
      ...Object.entries(activity.expectations) //Must not be undefined
      .map(e => this.applicableExpectation(e))
    )
  },

  applicableExpectation([id, shouldApply]) {
    return shouldApply && expectationsIds[id] ? expectationsIds[id] : noExpectation
  }
})
