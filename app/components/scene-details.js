import Component from '@ember/component';

export default Component.extend({

    initialized: false,

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
                document.getElementById(tab).style.width = "100%";
            }
        },

    },

});
