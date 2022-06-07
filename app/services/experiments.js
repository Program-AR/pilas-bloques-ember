import Service from '@ember/service';
import ENV from 'pilasbloques/config/environment'

export default Service.extend({

  group: ENV.experimentGroupType || 'notAffected',

  isTreatmentGroup() {
    return this.group === "treatment"
  },

  isControlGroup() {
    return this.group === "control"
  },

  isNotAffected() {
    return !(this.isTreatmentGroup() || this.isControlGroup())
  },

  experimentGroup() {
    return this.group
  },

  groupId() {
    return this.group.charAt(0)
  }
});
