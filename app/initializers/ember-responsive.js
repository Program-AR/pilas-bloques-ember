export default {
    name: 'responsive',
    initialize(application) {
        application.inject('controller', 'media', 'service:media');
        application.inject('component', 'media', 'service:media');
    }
};
