import Component from '@ember/component';
import ParentMixin from '../mixins/parent-mixin';
import { computed } from '@ember/object'

export default Component.extend(ParentMixin, {

    isValid: computed('isInvalid', function () {
        return !this.isInvalid
    }),

    isInvalid: computed('childComponents.@each.isInvalid', function () {
        return this.childComponents.isAny('isInvalid')
    }),

    submit() {
        this.send('localOnSubmit');
        return false;
    },

    actions: {
        localOnSubmit() {
            if (this.isValid) {
                this.onSubmit()
            }
        }
    }
});

