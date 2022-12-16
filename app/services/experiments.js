import Service, { inject as service } from '@ember/service'
import ENV from 'pilasbloques/config/environment'
import seedrandom from 'seedrandom';
import { computed } from '@ember/object'

export default Service.extend({

  groupSelectionStrategy: ENV.experimentGroup,
  storage: service(),
  pilasBloquesApi: service(),
  challengeExpectations: service(),

  //This order is important, do NOT change
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

  isAutoAssignStrategy() {
    return this.groupSelectionStrategy === "autoassign"
  },

  /**
   * If the group selection strategy is autoassign, returns a random group based on the user ip. 
   * In the case that the user does not have an internet connection, always returns notAffected group.
   * If the group selection strategy is other than autoassign, then returns the group assigned as strategy.
   */
  experimentGroup() {
    return this.isAutoAssignStrategy() ? (this.getExperimentGroupAssigned() || this.possibleGroups[2]) : this.groupSelectionStrategy
  },

  getExperimentGroupAssigned() {
    return this.pilasBloquesApi.getUser()?.experimentGroup || this.storage.getExperimentGroup() || this.randomizeAndSaveExperimentGroup()
  },

  randomizeAndSaveExperimentGroup() {
    const randomExperimentGroup = this.getRandomExperimentGroup()
    this.storage.saveExperimentGroup(randomExperimentGroup)

    if (randomExperimentGroup && this.pilasBloquesApi.getUser()) {
      this.pilasBloquesApi.saveExperimentGroup(randomExperimentGroup)
    }

    return randomExperimentGroup
  },

  /**
   * Randomizes with the ip as seed because we want every student in a classroom to have the same experiment group
   * @returns an experiment group or null in case the ip has not been set yet
   */
  getRandomExperimentGroup() {
    const ip = this.storage.getUserIp()
    return ip && this.possibleGroups[this.randomIndex(ip)]
  },

  randomIndex(seed) {
    const randomizedSeed = seedrandom(seed)
    const experimentGroupNumber = randomizedSeed() * (this.possibleGroups.length - 1)

    return Math.floor(experimentGroupNumber)
  },

  async saveUserIP() {
    if (!this.storage.getUserIp()) {
      try {
        const jsonIp = await this.pilasBloquesApi.userIp()
        this.storage.saveUserIp(jsonIp.ip)
      } catch (e) {
        console.error(e);
      }
    }
  },

  groupId() {
    return this.groupSelectionStrategy.charAt(0)
  },

  updateSolvedChallenges(challenge) {
    const _solvedChallenges = this.solvedChallenges
    if (this.shouldUpdateSolvedChallenges(challenge)) {
      _solvedChallenges.push(challenge.id)
      this.storage.saveSolvedChallenges(_solvedChallenges)
    }
  },

  shouldShowCongratulationsModal(challenge) {
    return this.challengeExpectations.doesNotHaveExpectations(challenge) || this.isNotAffected()
  },

  shouldShowBlocksWarningExpectationFeedback() {
    return this.isTreatmentGroup() && !this.feedbackIsDisabled()
  },

  shouldShowScoredExpectations() {
    return !(this.isControlGroup() || this.feedbackIsDisabled())
  },

  feedbackIsDisabled() {
    return this.solvedChallenges.length >= this.decompositionTreatmentLength
  },

  shouldUpdateSolvedChallenges(challenge) {
    return !this.solvedChallenges.includes(challenge.id) && this.hasDecompositionExpect(challenge)
  },

  hasDecompositionExpect(challenge) {
    return this.challengeExpectations.hasDecomposition(challenge)
  }
});
