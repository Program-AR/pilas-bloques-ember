import Ember from 'ember';

export default Ember.Service.extend({
  USER_KEY: 'PB_USER',
  ANALYTICS_KEY: 'PB_ANALYTICS_SESSION',

  getUser()       { return this._get(this.USER_KEY) },
  saveUser(user)  { this._save(this.USER_KEY, user) },

  getAnalyticsSession()         { return this._get(this.ANALYTICS_KEY)    },
  saveAnalyticsSession(session) { this._save(this.ANALYTICS_KEY, session) },


  _get(key)               { return JSON.parse(localStorage.getItem(key) || null)  },
  _save(key, data = null) { localStorage.setItem(key, JSON.stringify(data))       },
})