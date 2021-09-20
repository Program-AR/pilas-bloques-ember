import Service from '@ember/service'
import { allProceduresShould, declaresAnyProcedure, doSomething, isUsed, isUsedFromMain, multiExpect, notTooLong } from '../utils/expectations'

const activityExpectations = {
  // La gran aventura del mar encantado
  11: multiExpect(
    declaresAnyProcedure,
    allProceduresShould(
      notTooLong(),
      doSomething,
      isUsed,
      isUsedFromMain,
    )
  )
}

export default Service.extend({
  expectationFor(id) {
    return activityExpectations[id] || (() => '')
  }
})
