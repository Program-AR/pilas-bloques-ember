import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({

    initialized: false,
    actions: {

        setTab(tabId) {
            Array.from(document.getElementsByClassName("tabcontent"))
                .forEach(e => e.classList.remove("active"))
            document.getElementById(tabId).classList.add("active")
        },

    },

});
