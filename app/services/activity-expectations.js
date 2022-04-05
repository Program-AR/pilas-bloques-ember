import Service from '@ember/service'
import { entryPointType } from '../utils/blocks'
import { allProceduresShould, declaresAnyProcedure, doSomething, isUsed, isUsedFromMain, multiExpect, notTooLong, usesIf } from '../utils/expectations'

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
  13: usesIf,

  // La elección del mono
  14: usesIf,

  //Laberinto corto 
  15: usesIf,
  
  //Solo en ciertas ocasiones

  //Desafio 1 
  242: usesIf,

  //Desafio 2 
  243: usesIf,
  
  //Desafio 3 
  244: usesIf
}

export default Service.extend({
  expectationFor(id) {
    return activityExpectations[id] || (() => '')
  }
})
