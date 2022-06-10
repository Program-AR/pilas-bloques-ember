import Component from '@ember/component'
import { inject as service } from '@ember/service';


export default Component.extend({

  experiments: service(),
  expectScoring: service('expects-scoring'),

  allExpectationsPassed() {
    return this.expectScoring.failedExpects(this.expects).length === 0
  },

  isControl() {
    return this.experiments.isControlGroup()
  },

  textTag(textType) {
    const base = "components.finishedExerciseModal.expectationsModal."
    const groupTag = this.isControl() ? 'controlGroup.' : this.treatmentTag()
    return base + groupTag + textType
  },

  treatmentTag() {
    return 'treatmentGroup.' + (this.allExpectationsPassed() ? 'allPassed.' : 'notAllPassed.')
  }

})