import Component from '@ember/component';
import Ember from 'ember';
import { inject as service } from '@ember/service';

export default Component.extend({
    tagName: 'div',
    classNames: [],
    turboMode: false,
    storage: service(),

    didRender() {
        this.set('turboMode', this.storage.getUseTurboMode());
        if (this.turboMode) {
            this.pilas.habilitarModoTurbo();
        }
    },
    
    actions: {
        updateTurboMode() {
            if (this.turboMode) {
                this.storage.toggleTurboMode();
                this.pilas.deshabilitarModoTurbo();
            }
            else {
                this.storage.toggleTurboMode()
                this.pilas.habilitarModoTurbo();
            }

            if (!Ember.testing) {
                this.set("needShowTurboModeIndicator", true);
            }
        },
    }
});