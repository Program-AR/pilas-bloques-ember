import Component from '@ember/component';

export default Component.extend({
    actions: {
        menuToggle: function() {
            this.set("menuOpen", !this.get('menuOpen')) 
        },
    }
});
