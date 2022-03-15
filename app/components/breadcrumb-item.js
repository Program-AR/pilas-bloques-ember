import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({

    classes: computed('initial', 'selected', function () {
        var _classes = ""

        if (this.initial) {
            _classes += "breadcrumb-initial-item";
        }

        if (this.selected) {
            _classes += "breadcrumb-selected-item";
        }

        return _classes;
    }),

});