import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({

    needShowStepByStepButtons: computed('needShowStepByStepButtons', function () {
        return this.get('showStepByStepButtons');
    }),

    isRunning: computed('isRunning', function () {
        return this.get('running');
    }),

    isPausedOnBreackpoint: computed('isPausedOnBreackpoint', function () {
        return this.get('pausedOnBreackpoint');
    }),

});
