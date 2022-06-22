import Service, { inject as service } from '@ember/service'
import ENV from 'pilasbloques/config/environment'
import { inject as service } from '@ember/service'
import seedrandom from 'seedrandom';
import { computed } from '@ember/object'

export default Service.extend({

  group: ENV.experimentGroupType,
  storage: service(),
  pilasBloquesApi: service(),
  storage: service(),
  challengeExpectations: service(),

  possibleGroups: ["treatment", "control", "notAffected"],
  decompositionTreatmentLength: ENV.decompositionTreatmentLength,
  
  solvedChallenges: computed('storage', function () {
    return this.get('storage').getSolvedChallenges()
  }),

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
  },

  updateSolvedChallenges(challenge){
    const _solvedChallenges = this.solvedChallenges 
    if (this.shouldUpdateSolvedChallenges(challenge)){
      _solvedChallenges.push(challenge.id)
      this.storage.saveSolvedChallenges(_solvedChallenges)
    } 
  },

  shouldShowCongratulationsModal(){
    return this.isNotAffected()
  },

  shouldShowBlocksExpectationFeedback(){
    return this.isTreatmentGroup() && !this.feedbackIsDisabled()
  },

  shouldShowScoredExpectations(){
    return !(this.isControlGroup() || this.feedbackIsDisabled())
  },

  feedbackIsDisabled(){
    return this.solvedChallenges.length >= this.decompositionTreatmentLength
  },

  shouldUpdateSolvedChallenges(challenge){
    return !this.solvedChallenges.includes(challenge.id) && this.hasDecompositionExpect(challenge)
  },

  hasDecompositionExpect(challenge){
    return this.challengeExpectations.hasDecomposition(challenge)
  }
});
