import Ember from 'ember';

export default Ember.Service.extend({
  USER_KEY: 'PB_USER',
  ANALYTICS_KEY: 'PB_ANALYTICS_SESSION',
  TOS_ACCEPTED_KEY: 'PB_TOS_ACCEPTED',

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

  _get(key) { return JSON.parse(localStorage.getItem(key) || null) },
  _save(key, data = null) { localStorage.setItem(key, JSON.stringify(data)) },
})