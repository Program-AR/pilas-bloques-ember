import Service, { inject as service } from '@ember/service'
import ENV from 'pilasbloques/config/environment'
import seedrandom from 'seedrandom';
import { computed } from '@ember/object'

export default Service.extend({

  group: ENV.experimentGroup,
  decompositionTreatmentLength: ENV.decompositionTreatmentLength,
  storage: service(),
  pilasBloquesApi: service(),
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

  getExperimentGroupAssigned(){
    return this.storage.getExperimentGroup() || this.pilasBloquesApi.getUser()?.experimentGroup || this.randomizeAndSaveExperimentGroup() // jshint ignore:line
  },

  randomizeAndSaveExperimentGroup(){
    const randomExperimentGroup = this.getRandomExperimentGroup()
    this.storage.saveExperimentGroup(randomExperimentGroup)

    if(this.pilasBloquesApi.getUser()){
      this.pilasBloquesApi.saveExperimentGroup(randomExperimentGroup)
    }
    
    return randomExperimentGroup
  },

  getRandomExperimentGroup(){
    const ip = this.storage.getUserIp()
    return this.possibleGroups[this.randomIndex(ip)]
  },

  randomIndex(seed){
    const randomizedSeed = seedrandom(seed)
    const experimentGroupNumber = randomizedSeed() * (this.possibleGroups.length - 1)

    return Math.floor(experimentGroupNumber)
  },

  async saveUserIP(){
    if(!this.storage.getUserIp()){
      const response = await fetch("https://api64.ipify.org?format=json")
      const jsonIp = await response.json()
      this.storage.saveUserIp(jsonIp.ip)
    }
  },

  groupId() {
    return this.group.charAt(0)
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
