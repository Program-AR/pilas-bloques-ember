import Service from '@ember/service'
import { isEmpty } from 'ramda'
import { nullEvaluation, idsMapper } from '../utils/challengeEvaluations';
import { inject as service } from '@ember/service';


export default Service.extend({
  intl: service(),
  idsMapper,

  expectationFor(challenge) {
    return this.challengeToEvaluation(challenge).expectation(this.intl)
  },

  challengeToEvaluation(challenge) {
    return this.configToEvaluation(this.allExpectConfigurationsMerged(challenge))
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

  configToEvaluation(expectationsConfig) {
    return isEmpty(expectationsConfig) ? nullEvaluation
      : this.idsMapper.idsToSingleEvaluation(...this.appliableConfigIds(expectationsConfig))
  },

  appliableConfigIds(expectationsConfig) {
    return Object.entries(expectationsConfig)
      .filter(([, shouldBeApplied]) => shouldBeApplied)
      .map(([id,]) => id)
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

  hasDecomposition(challenge) {
    return !!this.allExpectConfigurationsMerged(challenge).decomposition
  },

  partialFeedbackItems(challenge) {
    return this.challengeToEvaluation(challenge).partialFeedbackItems(this.intl)
  }
})
