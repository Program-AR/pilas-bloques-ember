import Ember from 'ember'
import { inject as service } from '@ember/service'

export default Ember.Service.extend({
  router: service(),
  USER_KEY: 'PB_USER',
  ANALYTICS_KEY: 'PB_ANALYTICS_SESSION',
  TOS_ACCEPTED_KEY: 'PB_TOS_ACCEPTED',
  USE_NIGHT_THEME_KEY: 'PB_USE_NIGHT_THEME',
  USE_SIMPLE_READ_KEY: 'PB_USE_SIMPLE_READ',
  USE_TURBO_MODE_KEY: 'PB_USE_TURBO_MODE',
  SELECTED_LOCALE_KEY: 'PB_SELECTED_LOCALE',
  SOLVED_CHALLENGES: 'PB_SOLVED_CHALLENGES',
  FINGERPRINT: 'PB_FINGERPRINT',

  getUserId() {
    const user = this.getUser()
    return user && user.id
  },

  getUser() { return this._get(this.USER_KEY) },
  saveUser(user) { this._save(this.USER_KEY, user) },

  getAnalyticsSession() {
    const session = this._get(this.ANALYTICS_KEY)
    return session && { ...session, lastInteraction: new Date(session.lastInteraction) }
  },

  saveAnalyticsSession(session) { this._save(this.ANALYTICS_KEY, session) },

  saveTermsAcceptance() { this._save(this.TOS_ACCEPTED_KEY, true) },

  termsAreAccepted() { return this._get(this.TOS_ACCEPTED_KEY) },

  getUseNightTheme() { return this._get(this.USE_NIGHT_THEME_KEY) },

  toggleNightTheme() { this._save(this.USE_NIGHT_THEME_KEY, !this.getUseNightTheme()) },

  getUseSimpleRead() { return this._get(this.USE_SIMPLE_READ_KEY) },

  toggleSimpleRead() { this._save(this.USE_SIMPLE_READ_KEY, !this.getUseSimpleRead()) },
  
  getUseTurboMode() { return this._get(this.USE_TURBO_MODE_KEY) },

  toggleTurboMode() { this._save(this.USE_TURBO_MODE_KEY, !this.getUseTurboMode()) },

  saveSelectedLocale(selectedLocale) { this._save(this.SELECTED_LOCALE_KEY, selectedLocale) },

  getSelectedLocale() { return this._get(this.SELECTED_LOCALE_KEY) },

  saveSolvedChallenges(solvedChallenges) { this._save(this.SOLVED_CHALLENGES,solvedChallenges) },

  getSolvedChallenges () { 
    return this._get(this.SOLVED_CHALLENGES) || []
  },

  getFingerprint() {
    if(!this._get(this.FINGERPRINT)) this._save(this.FINGERPRINT, this.newFingerprint()) 
    return this._get(this.FINGERPRINT)    
  },

  newFingerprint(){ return new ClientJS().getFingerprint() },

  clear() { localStorage.clear() },

  _get(key) {
    return this._doSafe((storage) => JSON.parse(storage.getItem(key) || null))
  },
  _save(key, data = null) {
    this._doSafe((storage) => storage.setItem(key, JSON.stringify(data)))
  },

  _doSafe(fn) {
    try {
      return fn(localStorage)
    } catch (e) {
      console.error("ERROR", e)
      this.router.transitionTo('clear')
    }
  },
})
