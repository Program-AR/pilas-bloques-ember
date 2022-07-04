import Service from '@ember/service'
import { entryPointType } from '../utils/blocks'
import { isEmpty/*, compose*/ } from 'ramda'
import { allProceduresShould, declaresAnyProcedure, doesNotUseRecursion, doSomething, isUsed, isUsedFromMain, multiExpect, notTooLong, noExpectation, nameWasChanged, usesConditionalAlternative, usesConditionalRepetition, usesSimpleRepetition } from '../utils/expectations'
import { inject as service } from '@ember/service';

const idsToExpectations = (intl) => ({
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
  
  /* TODO: uncommnent after experiment is done. Related to https://github.com/Program-AR/pilas-bloques/issues/1042
  Only decomposition should be active

  conditionalAlternative: usesConditionalAlternative,

  conditionalRepetition: usesConditionalRepetition,

  simpleRepetition: usesSimpleRepetition,

  */

})


export default Service.extend({
  intl: service(),

  idsToExpectations,

  expectationFor(challenge) {
    return this.configToExpectation(this.allExpectConfigurationsMerged(challenge))
  },

  allExpectConfigurations(challenge){
    let models = [challenge]
    const group = challenge.get('grupo')
    // Some activities may not belong to a group, chapter or book
    if(group) {
      const chapter = group.get('capitulo')
      const book = chapter.get('libro')
      // This order is important. Expectations with less priority should be first.
      models = [book, chapter, group].concat(models)
    }

    return models.map(model => model.get('expectations'))
  },

  
  configToExpectation(expectationsConfig){
    return isEmpty(expectationsConfig) ? noExpectation 
    : multiExpect(
        ...Object.entries(expectationsConfig) //Must not be undefined
        .filter(e => this.shouldBeApplied(e))
        .map(([id, ]) => this.idToExpectation(id)) 
      )
    },

    shouldBeApplied([id, shouldApply]) {
      return shouldApply && this.idToExpectation(id)
  },

  idToExpectation(id) {
    return this.idsToExpectations(this.intl)[id]
  },

  /*
  * This overrides the entire value of a key.
  * If some values could be another objects and we would want to
  * merge those too, it should be handled differently.
  */
 mergeConfigurations(expectationsConfigs) {
   return expectationsConfigs.filter(e => e).reduce((baseExpect, expectWithPriority) => {
     return {
       ...baseExpect,
       ...expectWithPriority
      }
    },{})
  },

  allExpectConfigurationsMerged(challenge){
    return this.mergeConfigurations(this.allExpectConfigurations(challenge))
  },

  hasDecomposition(challenge){
    return !!this.allExpectConfigurationsMerged(challenge).decomposition
  }
})
