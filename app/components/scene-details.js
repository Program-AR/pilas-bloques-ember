import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({

    initialized: false,
    exerciseCover: computed('model', function () {
        return this.model.challengeCover || `imagenes/desafios/${this.model.nombreImagen}`
    }),


    didRender() {

        // Show the default tab element.
        if (!this.get('initialized')) {
            this.send("setTab", "statement");
        }

    },

    actions: {

        setTab(tab) {
            var i, tabcontent, tablinks;
            tabcontent = document.getElementsByClassName("tabcontent");

            if (tabcontent.length > 1) {

                this.set('initialized', true);

                for (i = 0; i < tabcontent.length; i++) {
                    tabcontent[i].style.display = "none";
                }

                tablinks = document.getElementsByClassName("tablinks");

                for (i = 0; i < tablinks.length; i++) {
                    tablinks[i].className = tablinks[i].className.replace(" active", "");
                }

                document.getElementById(tab).style.display = "block";
            }
        },

    },

});
