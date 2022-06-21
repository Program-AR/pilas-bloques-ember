import Service, { inject as service } from '@ember/service'
import ENV from 'pilasbloques/config/environment'
import { computed } from '@ember/object'

export default Service.extend({

  group: ENV.experimentGroupType,
  decompositionTreatmentLength: ENV.decompositionTreatmentLength,
  storage: service(),
  challengeExpectations: service(),

  solvedChallenges: computed('storage', function () {
    return this.get('storage').getSolvedChallenges()
  }),

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
    return this.solvedChallenges.length > this.decompositionTreatmentLength
  },

  shouldUpdateSolvedChallenges(challenge){
    return !this.solvedChallenges.includes(challenge.id) && this.hasDecompositionExpect(challenge)
  },

  hasDecompositionExpect(challenge){
    return this.challengeExpectations.hasDecomposition(challenge)
  }
});
