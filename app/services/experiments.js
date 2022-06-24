import Service, { inject as service } from '@ember/service'
import ENV from 'pilasbloques/config/environment'
import seedrandom from 'seedrandom';
import { computed } from '@ember/object'

export default Service.extend({

  group: ENV.experimentGroupType,
  storage: service(),
  pilasBloquesApi: service(),
  challengeExpectations: service(),

  possibleGroups: ["treatment", "control", "notAffected"],
  decompositionTreatmentLength: ENV.decompositionTreatmentLength,
  
  solvedChallenges: computed('storage', function () {
    return this.get('storage').getSolvedChallenges()
  }),

  async isTreatmentGroup() {
    return await this.experimentGroup() === this.possibleGroups[0]
  },

  async isControlGroup() {
    return await this.experimentGroup() === this.possibleGroups[1]
  },

  async isNotAffected() {
    return !(await this.isTreatmentGroup() || await this.isControlGroup())
  },

  isAutoAssignGroup(){
    return this.group === "autoassign"
  },

  async experimentGroup() {
    return this.isAutoAssignGroup() ? await this.getExperimentGroupAssigned() : this.group
  },

  async getExperimentGroupAssigned(){
    return this.storage.getExperimentGroup() || this.pilasBloquesApi.getUser()?.experimentGroup || await this.randomizeAndSaveExperimentGroup() // jshint ignore:line
  },

  async randomizeAndSaveExperimentGroup(){
    const randomExperimentGroup = await this.getRandomExperimentGroup()
    if(this.pilasBloquesApi.getUser()){
      this.pilasBloquesApi.saveExperimentGroup(randomExperimentGroup)
    }
    
    this.storage.saveExperimentGroup(randomExperimentGroup)

    return randomExperimentGroup
  },

  async getRandomExperimentGroup(){
    const ip = await this.getUserIp()
    return this.possibleGroups[this.randomIndex(ip)]
  },

  randomIndex(seed){
    const randomizedSeed = seedrandom(seed)
    const experimentGroupNumber = randomizedSeed() * (this.possibleGroups.length - 1)

    return Math.floor(experimentGroupNumber)
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

  async shouldShowCongratulationsModal(){
    return await this.isNotAffected()
  },

  async shouldShowBlocksExpectationFeedback(){
    return await this.isTreatmentGroup() && !this.feedbackIsDisabled()
  },

  async shouldShowScoredExpectations(){
    return !(await this.isControlGroup() || this.feedbackIsDisabled())
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
