import Component from '@ember/component';

export default Component.extend({
    menuOpen: false,
    
    actions: {
        menuToggle: function() {
            this.set("menuOpen", !this.get('menuOpen')) 
        },
    }
});
