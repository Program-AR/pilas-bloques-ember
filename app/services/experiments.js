import Service from '@ember/service';
import ENV from 'pilasbloques/config/environment'
import { inject as service } from '@ember/service'
import seedrandom from 'seedrandom';

export default Service.extend({

  group: ENV.experimentGroupType,
  storage: service(),
  pilasBloquesApi: service(),
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
    return this.group === "autoassign"
  },

  experimentGroup() {
    return this.isAutoAssignGroup() ? this.getExperimentGroupAssigned() : this.group
  },

  async getExperimentGroupAssigned(){
    return this.storage.getExperimentGroup() || /*this.pilasBloquesApi.getExperimentGroup() ||*/ await this.randomizeAndSaveExperimentGroup()
  },

  async randomizeAndSaveExperimentGroup(){
    const randomExperimentGroup = await this.getRandomExperimentGroup()
    if(this.pilasBloquesApi.getUser()){
     // this.pilasBloquesApi.saveExperimentGroup(randomExperimentGroup)
    }

    this.storage.saveExperimentGroup(randomExperimentGroup)

    return randomExperimentGroup
  },

  async getRandomExperimentGroup(){
    const ip = await this.getUserIp()
    const randomizedIp = seedrandom(ip)
    const experimentGroupNumber = randomizedIp() * (this.possibleGroups.length - 1)

    return this.possibleGroups[Math.floor(experimentGroupNumber)]
  },

  async getUserIp(){
    const response = await fetch("https://api64.ipify.org?format=json")
    const jsonIp = await response.json()
    
    return jsonIp.ip
  }
});
