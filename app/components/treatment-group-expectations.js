import Component from '@ember/component';
import { computed } from '@ember/object'
import { inject as service } from '@ember/service'

const solutionWorks = 'solution_works'

export default Component.extend({

    intl: service(),

    allPassedExpects: computed('passedExpects', function () {
        return [this.solutionWorksExpect()].concat(this.passedExpects)
    }),

    expects: computed('allPassedExpects', 'failedExpects', function () {
        return this.allPassedExpects.concat(this.failedExpects)
    }),

    passedExpectsValue: computed('allPassedExpects', 'expects', function () {
        return 100 * this.allPassedExpects.length / this.expects.length
    }),

    solutionWorksExpect() {
        return {
            id: solutionWorks,
            description: this.intl.t(`model.spects.${solutionWorks}`).toString()
        }
    }
});
