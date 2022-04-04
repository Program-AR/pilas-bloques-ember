import Service from '@ember/service'
import { entryPointType } from '../utils/blocks'
import { allProceduresShould, declaresAnyProcedure, doSomething, isUsed, isUsedFromMain, multiExpect, notTooLong, nameWasChanged } from '../utils/expectations'

const activityExpectations = {
  // La gran aventura del mar encantado
  11: multiExpect(
    declaresAnyProcedure,
    () => notTooLong()(entryPointType),
    allProceduresShould(
      notTooLong(),
      doSomething,
      isUsed,
      isUsedFromMain,
      nameWasChanged
    )
  )
}

export default Service.extend({
  expectationFor(id) {
    return activityExpectations[id] || (() => '')
  }
})
