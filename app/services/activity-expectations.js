import Service from '@ember/service'
import { entryPointType } from '../utils/blocks'
import { allProceduresShould, declaresAnyProcedure, doSomething, isUsed, isUsedFromMain, multiExpect, notTooLong, usesConditionalAlternative } from '../utils/expectations'

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
    )
  ),

  // El mono y las bananas
  13: usesConditionalAlternative,

  // La elección del mono
  14: usesConditionalAlternative,

  //Laberinto corto 
  15: usesConditionalAlternative,
  
  //Solo en ciertas ocasiones

  //Desafio 1 
  242: usesConditionalAlternative,

  //Desafio 2 
  243: usesConditionalAlternative,
  
  //Desafio 3 
  244: usesConditionalAlternative
}

export default Service.extend({
  expectationFor(id) {
    return activityExpectations[id] || (() => '')
  }
})
