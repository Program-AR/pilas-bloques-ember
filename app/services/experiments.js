import Service from '@ember/service';
import ENV from 'pilasbloques/config/environment'

export default Service.extend({

  group: ENV.experimentGroupType,

  isTreatmentGroup() {
    return this.group === ENV.groups.treatment
  },

  isControlGroup() {
    return this.group === ENV.groups.control
  },

  isNotAffected() {
    return !(this.isTreatmentGroup() || this.isControlGroup())
  }
});
