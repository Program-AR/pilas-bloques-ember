import Service from '@ember/service'

export default Service.extend({
  online() { return typeof process === "undefined" }
})