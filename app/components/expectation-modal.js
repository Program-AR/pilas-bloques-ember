import Component from '@ember/component'
import { inject as service } from '@ember/service';


export default Component.extend({

  experiments: service(),
  expectScoring: service('expects-scoring'),

  allExpectationsPassed() {
    return this.expectScoring.failedExpects(this.expects).length === 0
  },

  async shouldShowScoredExpectations() {
    return await this.experiments.shouldShowScoredExpectations()
  },

  async textTag(textType) {
    const base = "components.finishedExerciseModal.expectationsModal."
    const groupTag = await this.shouldShowScoredExpectations() ? this.scoredExpectationsTag() : 'nonScoredExpectations.'
    return base + groupTag + textType
  },

  scoredExpectationsTag() {
    return 'scoredExpectations.' + (this.allExpectationsPassed() ? 'allPassed.' : 'notAllPassed.')
  }

})