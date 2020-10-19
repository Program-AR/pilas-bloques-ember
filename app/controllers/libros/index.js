import Controller from '@ember/controller'
import ENV from 'pilasbloques/config/environment'

export default Controller.extend({
    enableChallengeCreator: ENV.enableChallengeCreator
});