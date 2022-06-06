import Service, { inject as service } from '@ember/service'
import ENV from 'pilasbloques/config/environment'
import { computed } from '@ember/object'

export default Service.extend({

  group: ENV.experimentGroupType,
  subtaskDivisionTreatmentLength: ENV.subtaskDivisionTreatmentLength,
  storage: service(),
  activityExpectations: service(),

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
    if (this.shouldUpdateSolvedChallenges(challenge)) _solvedChallenges.push(challenge.id)
    this.storage.saveSolvedChallenges(_solvedChallenges)
  },

  shouldShowCongratulationsModal(){
    return this.isNotAffected() || this.feedbackIsDisabled()
  },

  shouldShowExpectationFeedback(){
    return !this.feedbackIsDisabled()
  },

  feedbackIsDisabled(){
    return this.solvedChallenges.length > this.subtaskDivisionTreatmentLength
  },

  shouldUpdateSolvedChallenges(challenge){
    return  !this.solvedChallenges.includes(challenge.id) && this.hasSubtaskDivisionExpect(challenge)
  },

  hasSubtaskDivisionExpect(challenge){
    const combinedExpectations = this.activityExpectations.combinedExpectations(challenge)
    const mergedExpectations = this.activityExpectations.mergedExpectations(combinedExpectations)
    return mergedExpectations.decomposition
  }
});
