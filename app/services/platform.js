import Service from '@ember/service'

export default Service.extend({
  inElectron() { return /electron/i.test(navigator.userAgent) },
  online() { return !this.inElectron() }
})