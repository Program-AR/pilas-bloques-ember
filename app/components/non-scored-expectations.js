import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object'
import { expectationDescription } from '../utils/expectations';
export default Component.extend({

    challengeExpectations: service('challenge-expectations'),
    intl: service(),

    expectations: computed('challenge', function () {
        return this.challengeExpectations.expectationsIdsForControlGroup(this.challenge)
        .map(id => ({
            id,
            description: expectationDescription(this.intl, id, false, { isForControlGroup: true })
        }))
    }),

    solutionWorksDescription: computed('intl', function () {
        return this.intl.t("components.spects.control_group.solution_works").toString()
    })

});
