import Component from '@ember/component';
import ChildMixin from '../mixins/child-mixin';
import FocusableMixin from '../mixins/focusable-mixin';
import { computed } from '@ember/object'
import { inject as service } from '@ember/service';

export default Component.extend(FocusableMixin, ChildMixin, {

    intl: service(),

    isInvalid: computed('error', function (){
        return this.error
    }),

    /**
     * This is necessary because t helper returns SafeString (an object which contains a property named 'string')
     */
    stringLabel: computed('label', function () {
        return this.label.toString()
    }),

    actions : {
        onInvalid(e) {
            e.target.setCustomValidity(this.intl.t("templates.pb-input.requiredField"))
        },

        onInput(e) {
            e.target.setCustomValidity('')
        }
    }

});
