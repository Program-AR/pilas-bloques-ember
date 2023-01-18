import Ember from 'ember';
import ENV from 'pilasbloques/config/environment'

const AVATAR_COUNT = 16
const AVATAR_PATH = `${ENV.rootURL}imagenes/avatars/`

export default Ember.Service.extend({

  avatars: Array.from(Array(AVATAR_COUNT).keys()).map((n) => `avatar-${n + 1}.png`),
  
  allAvatars() {
    return this.avatars.map(this.urlFor)
  },

  urlFor(avatar) {
    return AVATAR_PATH + avatar
  },

  randomAvatar() {
    const avatars = this.allAvatars()
    return avatars[Math.floor(Math.random() * avatars.length)]
  }

})