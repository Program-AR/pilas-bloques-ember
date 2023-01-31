import Component from '@ember/component';
import ChildMixin from '../mixins/child-mixin';
import { computed } from '@ember/object';

export default Component.extend(ChildMixin, {

    triedToSubmit: false,
    avatarWasSelected: false,

    error: computed('triedToSubmit', 'avatarWasSelected', 'errorMessage', function () {
        return this.triedToSubmit && !this.avatarWasSelected && this.errorMessage
    }),

    isInvalid: computed('error', function() {
        return this.error
    }),

    actions: {
        submitClicked(){
            this.set('triedToSubmit', true)
        },

        localOnClick(onClick){
            this.set('triedToSubmit', false)
            this.set('avatarWasSelected', true)
            onClick()
        }
    }

});