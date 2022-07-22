import Component from '@ember/component';
import { computed } from '@ember/object'
import { inject as service } from '@ember/service'

export default Component.extend({

    expectsScoring: service('expects-scoring'),

    allPassedExpects: computed('expects', function () {
        return this.expectsScoring.allPassedExpects(this.expects, this.challenge)
    }),

    failedExpects: computed('expects', function () {
        return this.expectsScoring.failedExpects(this.expects, this.challenge)
    }),

    expectsResults: computed('expects', function () {
        return this.expectsScoring.expectsResults(this.expects, this.challenge)
    }),

    passedExpectsValue: computed('expects', function () {
        return this.expectsScoring.totalScore(this.expects, this.challenge)
    }),
});
