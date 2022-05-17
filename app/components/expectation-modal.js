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

  title() {
    return this.experiments.isControlGroup() ? 'control' : (this.allExpectationsPassed() ? 'treatment pasando expectativas' : 'treatment no pasando expectativas')
  },

  expects() {
    return this.get('failedExpects').concat(this.get('passedExpects'))
  }

})