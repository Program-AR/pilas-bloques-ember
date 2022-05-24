import Component from '@ember/component'
import { inject as service } from '@ember/service';


export default Component.extend({

  experiments: service(),

  allExpectationsPassed() {
    return this.get('failedExpects').length === 0
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
  },

  expects() {
    return this.get('failedExpects').concat(this.get('passedExpects'))
  }

})