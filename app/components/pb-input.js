import Component from '@ember/component';
import ChildMixin from '../mixins/child-mixin';
import { computed } from '@ember/object'

export default Component.extend(ChildMixin, {

    isInvalid: computed('error', function (){
        return this.error
    }),

    /**
     * This is necessary because t helper returns SafeString (an object which contains a property named 'string')
     */
    stringLabel: computed('label', function () {
        return this.label.toString()
    }),

});
