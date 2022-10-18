import Component from '@ember/component';
import { computed } from '@ember/object'
import { inject as service } from '@ember/service'

export default Component.extend({

    expectsScoring: service('expects-scoring'),

    allPassedExpects: computed('expects', function () {
        return this.expectsScoring.allPassedExpects(this.expects)
    }),

    failedExpects: computed('expects', function () {
        return this.expectsScoring.failedExpects(this.expects)
    }),

    expectsResults: computed('expects', function () {
        return this.expectsScoring.expectsResults(this.expects)
    }),
});
