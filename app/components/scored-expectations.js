import Component from '@ember/component';
import { computed } from '@ember/object'
import { inject as service } from '@ember/service'

export default Component.extend({

    expectsScoring: service('expects-scoring'),

    allPassedExpects: computed('expects', 'isTheChallengeSolved', function () {
        return this.expectsScoring.allPassedExpects(this.expects, this.get('isTheChallengeSolved'))
    }),

    failedExpects: computed('expects', 'isTheChallengeSolved', function () {
        return this.expectsScoring.failedExpects(this.expects, this.get('isTheChallengeSolved'))
    }),

    expectsResults: computed('expects', 'isTheChallengeSolved', function () {
        return this.expectsScoring.expectsResults(this.expects, this.get('isTheChallengeSolved'))
    }),

    passedExpectsValue: computed('expects', 'isTheChallengeSolved', function () {
        return this.expectsScoring.totalScore(this.expects, this.challenge, this.get('isTheChallengeSolved'))
    }),
});
