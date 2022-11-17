import Route from '@ember/routing/route';

export default Route.extend({
    beforeModel(/* transition */) {
        this.transitionTo('libros');
    }
});
