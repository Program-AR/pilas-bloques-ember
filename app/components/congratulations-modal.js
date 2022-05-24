import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  intl: service(),

  description: computed('', function () {
    return `${this.intl.t(`components.finishedExerciseModal.congratulationsModal.description`)}`;
  }),
});
