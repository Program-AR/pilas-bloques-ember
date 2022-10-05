import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object'
export default Component.extend({

    expectsScoring: service('expects-scoring'),
    intl: service(),

    expectsResults: computed('expects', function () {
        return this.expectsScoring.expectsResults(this.expects).filter(expect => expect.description.forControlGroup)
    }),

});
