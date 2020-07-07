import Component from '@ember/component';
import Ember from 'ember';

export default Component.extend({
    turboMode: false,

    actions: {
        updateTurboMode() {

            if (this.turboMode) {
                this.pilas.deshabilitarModoTurbo();
                this.set("turboMode", false);
            }

            else {
                this.pilas.habilitarModoTurbo();
                this.set("turboMode", true);
            }

            if (!Ember.testing) {
                this.set("needShowTurboModeIndicator", true);
            }

        },
    }
});