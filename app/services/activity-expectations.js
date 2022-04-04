import Service from '@ember/service'
import { entryPointType } from '../utils/blocks'
import { allProceduresShould, declaresAnyProcedure, doSomething, isUsed, isUsedFromMain, multiExpect, notTooLong, nameWasChanged } from '../utils/expectations'
import { inject as service } from '@ember/service';

const activityExpectations = {
  // La gran aventura del mar encantado
  11: (intl) => multiExpect(
    declaresAnyProcedure,
    () => notTooLong()(entryPointType),
    allProceduresShould(
      notTooLong(),
      doSomething,
      isUsed,
      isUsedFromMain,
      nameWasChanged(intl)
    )
  )
}

export default Service.extend({
  intl: service(),

  expectationFor(id) {
    return activityExpectations[id](this.intl) || (() => '')
  }
})
