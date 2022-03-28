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

                tabcontent.forEach(tabItem => {
                    tabItem.style.display = "none";
                })

                tablinks = document.getElementsByClassName("tablinks");

                tablinks.forEach(tabLink => {
                    tabLink.className = tabLink.className.replace(" active", "");
                })

                document.getElementById(tab).style.display = "block";
                document.getElementById(tab).style.width = "100%";
            }
        },

    },

});
