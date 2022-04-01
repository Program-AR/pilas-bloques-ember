import Controller from '@ember/controller'
import ENV from 'pilasbloques/config/environment'
import { inject as service } from '@ember/service';

export default Controller.extend({
    simpleRead: service(),

    enableChallengeCreator: ENV.enableChallengeCreator,

    shouldShowSimpleRead() {
        return this.simpleRead.shouldShowSimpleRead(false)
    },
});