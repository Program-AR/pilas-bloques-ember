import Component from '@ember/component';
import ChildMixin from '../mixins/child-mixin';
import { computed } from '@ember/object'
import { inject as service } from '@ember/service';

export default Component.extend(ChildMixin, {

    intl: service(),

    isInvalid: computed('hasError', function (){
        return this.hasError
    }),

    nonNullableText: computed('model', function () {
        return this.model || ''
    }),

    /**
     * This is necessary because t helper returns SafeString (an object which contains a property named 'string')
     */
    stringLabel: computed('label', function () {
        return this.label?.toString()
    }),

    /**
     * It is important that input does not start with an error. Otherwise, it will not be shown.
     * This avoids errors if input is null.
     */
    customValidationErrorMessage: computed('customValidations', 'model', function () {
        return this.model && this.customValidations?.find(validation => !validation.validate(this.model))?.message.toString()
    }),

    errorMessage: computed('error', 'customValidationErrorMessage', function () {
        return this.error?.toString() || this.customValidationErrorMessage
    }),

    hasError: computed('errorMessage', function () {
        return !!this.errorMessage
    }),

    actions : {
        onInvalid(e) {
            e.target.setCustomValidity(this.intl.t("templates.pb-input.requiredField"))
        },

        onInput(e) {
            e.target.setCustomValidity('')
        },

        submitClicked() {
            // Polymorphism
        }
    }

});
