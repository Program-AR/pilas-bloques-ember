import Component from '@ember/component'
import ENV from 'pilasbloques/config/environment'

export default Component.extend({
  classNames: ['challenges-book-container zoom'],
  challengeCreatorURL: ENV.challengeCreatorURL
})
