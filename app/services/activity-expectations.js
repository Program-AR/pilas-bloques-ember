import Service from '@ember/service'
import { entryPointType } from '../utils/blocks'
import { allProceduresShould, declaresAnyProcedure, doSomething, isUsed, isUsedFromMain, multiExpect, notTooLong, nameWasChanged, usesConditionalAlternative, usesConditionalRepetition } from '../utils/expectations'
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
  ),

  // El mono y las bananas
  13: () => usesConditionalAlternative,

  // La elección del mono
  14: () => usesConditionalAlternative,

  // Laberinto corto 
  15: () => usesConditionalAlternative,

  // Súper Tito 1
  19: () => usesConditionalRepetition,
  
  // Súper Tito 2
  20: () => usesConditionalRepetition,
  
  // Laberinto con queso
  21: () => usesConditionalRepetition,

  //El Detective chaparro
  22: () => usesConditionalRepetition,
  
  //Fútbol para robots
  23: () => usesConditionalRepetition,
  
  //Prendiendo las compus
  24: () => usesConditionalRepetition,
  
  //El mono que sabe contar
  25: () => usesConditionalRepetition,
  
  // Solo en ciertas ocasiones

  // Desafio 1 
  242: () => usesConditionalAlternative,

  // Desafio 2 
  243: () => usesConditionalAlternative,
  
  // Desafio 3 
  244: () => usesConditionalAlternative
}

export default Service.extend({
  intl: service(),

  /*
    Intl is needed for the nameWasChanged expectation, which needs to know the default procedure name. 
    The translation of expectations themselves occur in the analyze method of pilas-mulang.
  */
  expectationFor(id) {
    return activityExpectations[id] ? activityExpectations[id](this.intl) : (() => '')
  }
})
