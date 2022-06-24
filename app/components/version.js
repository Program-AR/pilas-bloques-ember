import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({

    experiments: service(),

    groupId: computed('experiments', function () {
        return this.experiments.groupId()
    }),
    
});
