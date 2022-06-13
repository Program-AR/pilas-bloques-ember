import Service from '@ember/service';
import ENV from 'pilasbloques/config/environment'
import { inject as service } from '@ember/service'
import seedrandom from 'seedrandom';

export default Service.extend({

  group: ENV.experimentGroupType,
  storage: service(),
  possibleGroups: ["treatment", "control", "notAffected"],

  isTreatmentGroup() {
    return this.experimentGroup() === this.possibleGroups[0]
  },

  isControlGroup() {
    return this.experimentGroup() === this.possibleGroups[1]
  },

 isNotAffected() {
    return !(this.isTreatmentGroup() || this.isControlGroup())
  },

  isAutoAssignGroup(){
    return this.group === "autoAssign"
  },

  experimentGroup() {
    return this.isAutoAssignGroup() ? this.getExperimentGroupAssigned() : this.group
  },

  getExperimentGroupAssigned(){
    return this.storage.getExperimentGroup() || /*this.pilasBloquesApi.getExperimentGroupAssigned() || */   this.randomizeAndSaveExperimentGroup()
  },

  randomizeAndSaveExperimentGroup(){
    const randomExperimentGroup = this.getRandomExperimentGroup()
    if(/*esta logueado*/ false){
      //guardar en api
    }

    this.storage.saveExperimentGroup(randomExperimentGroup)

    return randomExperimentGroup
  },

  getRandomExperimentGroup(){
    const ip = this.getUserIp()
    const randomizedIp = seedrandom(ip)
    const experimentGroupNumber = randomizedIp() * (this.possibleGroups.length - 1)

    return this.possibleGroups[Math.floor(experimentGroupNumber)]
  },

  getUserIp(){
    const response = await fetch("https://api64.ipify.org?format=json")
    const jsonIp = await response.json()
    
    return jsonIp.ip
  }
});
