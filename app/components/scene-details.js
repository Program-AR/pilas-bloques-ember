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

                tabcontent.forEach(tabItem => {
                    tabItem.style.display = "none";
                })

                tablinks = document.getElementsByClassName("tablinks");

                tablinks.forEach(tabLink => {
                    tabLink.className = tabLink.className.replace(" active", "");
                })

                document.getElementById(tab).style.display = "block";
            }
        },

    },

});
