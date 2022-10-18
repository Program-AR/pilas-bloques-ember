import Service from '@ember/service'
import { isEmpty, sum } from 'ramda'
import { allProceduresShould, doesNotUseRecursion, doSomething, isUsed, isUsedFromMain, multiExpect, notTooLong, mainNotTooLong, noExpectation, nameWasChanged, doesNotNestControlStructures, doSomethingId, tooLongId, doesNotNestControlStructuresId, nameWasChangedId, mainTooLongId, decompositionExpectsIdsForControlGroup } from '../utils/expectations'
import { inject as service } from '@ember/service';

// Be careful when adding new expects. idsToScore should be potentially updated too.
const idsToExpectations = (intl) => ({
  decomposition: multiExpect(
    () => mainNotTooLong(),
    doesNotNestControlStructures,
    allProceduresShould(
      notTooLong(),
      doSomething,
      isUsed,
      isUsedFromMain,
      doesNotUseRecursion,
      nameWasChanged(intl)
    )
  ),

  // This should be deleted after expectations and configuration redesign.
  decomposition9: multiExpect(
    () => mainNotTooLong(9),
    doesNotNestControlStructures,
    allProceduresShould(
      notTooLong(9),
      doSomething,
      isUsed,
      isUsedFromMain,
      doesNotUseRecursion,
      nameWasChanged(intl)
    )
  ),

  /* TODO: uncommnent after experiment is done. Related to https://github.com/Program-AR/pilas-bloques/issues/1042
  Only decomposition should be active. Don't forget imports

  conditionalAlternative: usesConditionalAlternative,

  conditionalRepetition: usesConditionalRepetition,

  simpleRepetition: usesSimpleRepetition,

  */

})


//Will (not) be obliterated Soon™ (never)
const harcodedAllConfigurationsToExpectIds = {
  decomposition: [doSomethingId, tooLongId, mainTooLongId, nameWasChangedId, doesNotNestControlStructuresId],
  decomposition9: [doSomethingId, tooLongId, mainTooLongId, nameWasChangedId, doesNotNestControlStructuresId],
  //simpleRepetition: [simpleRepetitionId]
}

// TODO: DELETE. I cant even...
const idsToExpectationsIdsForControl = {
  decomposition: decompositionExpectsIdsForControlGroup,
  decomposition9: decompositionExpectsIdsForControlGroup,

  // Other configurations, such as conditionals and repetitions, are not used yet.
}


export default Service.extend({
  intl: service(),

  idsToExpectations,

  expectationFor(challenge) {
    return this.configToExpectation(this.allExpectConfigurationsMerged(challenge))
  },

  allExpectConfigurations(challenge) {
    let models = [challenge]
    const group = challenge.get('grupo')
    // Some activities may not belong to a group, chapter or book
    if (group) {
      const chapter = group.get('capitulo')
      const book = chapter.get('libro')
      // This order is important. Expectations with less priority should be first.
      models = [book, chapter, group].concat(models)
    }

    return models.map(model => model.get('expectations'))
  },

  doesNotHaveExpectations(challenge) {
    return isEmpty(this.allExpectConfigurationsMerged(challenge))
  },

  configToExpectation(expectationsConfig) {
    return isEmpty(expectationsConfig) ? noExpectation
      : multiExpect(
        ...this.appliableConfigs(expectationsConfig)
          .map(([id,]) => this.idToExpectation(id))
      )
  },

  appliableConfigs(expectationsConfig) {
    return Object.entries(expectationsConfig) //Must not be undefined
      .filter(e => this.shouldBeApplied(e))
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
    }, {})
  },

  allExpectConfigurationsMerged(challenge) {
    return this.mergeConfigurations(this.allExpectConfigurations(challenge))
  },
  allExpectIdsIn(challenge) {
    const challengeConfigurations = this.allExpectConfigurationsMerged(challenge)
    const validConfigurationsIds = Object.keys(challengeConfigurations).filter(key => challengeConfigurations[key]) //Should only use configurations set to true.
    return validConfigurationsIds.flatMap(this.expectIdsInConfiguration)
  },

  expectIdsInConfiguration(configId) {
    return harcodedAllConfigurationsToExpectIds[configId] || []
  },

  hasDecomposition(challenge) {
    const allExpectConfigurationsMerged = this.allExpectConfigurationsMerged(challenge)
    return !!(allExpectConfigurationsMerged.decomposition || allExpectConfigurationsMerged.decomposition9)
  },

  howManyScoreableExpectationsFor(challenge) {
    return this.configToTotalScore(this.allExpectConfigurationsMerged(challenge))
  },

  configToTotalScore(expectationsConfig) {
    return isEmpty(expectationsConfig) ? 0
      : sum(
        this.appliableConfigs(expectationsConfig).map(([id,]) => this.configIdToMaxScore(id))
      )
  },

  configIdToMaxScore(id) {
    return harcodedAllConfigurationsToExpectIds[id]?.length || 0
  },

  expectationsIdsForControlGroup(challenge) {
    return Object.entries(this.allExpectConfigurationsMerged(challenge))
      .filter(([, shouldBeApplied]) => shouldBeApplied)
      .flatMap(([id,]) => idsToExpectationsIdsForControl[id] || [])
  }
})
