import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object'
import { doSomethingId, tooLongId, nameWasChangedId, conditionalAlternativeId, conditionalRepetitionId, simpleRepetitionId, declaresProcedureId } from '../utils/expectations'
import { solutionWorks } from '../services/expects-scoring'

export default Component.extend({

    expectsScoring: service('expects-scoring'),
    intl: service(),

    possibleExpectsIds: [doSomethingId, tooLongId, nameWasChangedId, conditionalAlternativeId, conditionalRepetitionId, simpleRepetitionId, declaresProcedureId],

    expectsResults: computed('expects', function () {
        return this.expectsScoring.expectsResults(this.expects)
            .filter(e => e.id !== solutionWorks)
            .map(e => ({...e, description: this.controlDescriptionFor(e)}))
    }),

    controlDescriptionFor(expect) {
        const match = this.possibleExpectsIds.find(id => id === expect.id)
        return match ? this.intl.t(`model.spects.control_group.${match}`) : expect.description
    }
});
