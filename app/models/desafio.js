import { computed } from '@ember/object';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import Ember from 'ember';

export const xmlBloqueEmpezarAEjecutar =
  `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" x="15" y="15"></block>
  </xml>`

export default Model.extend({
  intl: Ember.inject.service(),

  titulo: computed('id', function () {
    return `${this.intl.t(`model.challenges.${this.id}.title`)}`;
  }),
  enunciado: computed('id', function () {
    return `${this.intl.t(`model.challenges.${this.id}.description`)}`;
  }),
  consignaInicial: computed('id', function () {
    return `${this.intl.t(`model.challenges.${this.id}.clue`)}`;
  }),

  nombre: attr('string'),
  imagen: attr('string'),
  customCover: attr('string'),
  deshabilitado: attr('boolean'),
  escena: attr('string'),
  hasAutomaticGrading: attr('boolean', { defaultValue: true }),
  estiloToolbox: attr('string', { defaultValue: "desplegable" }),
  grupo: belongsTo('grupo', {async: false}), /* {async: false} is needed because the custom challenges should not have a group.
  Without this, this.grupo is an empty ember object, instead of undefined. We want this to be undefined so we dont have to refactor other places
  of the app to consider the case in which the group is an empty ember object instead of undefined.
  */
  bloques: attr(),
  solucionInicial: attr('string'),
  debugging: attr('boolean'),
  expectations: attr(),
  shouldShowMultipleScenarioHelp: attr('boolean', {defaultValue: false}),

  coverSrc: computed('imagen', 'nombre', 'customCover', function () {
    return this.customCover || `imagenes/desafios/${ this.imagen || this.nombre || 'proximamente'}.png`;
  }),

  initialWorkspace: computed("solucionInicial", function () {
    return this.solucionInicial || xmlBloqueEmpezarAEjecutar
  }),

  challengesInTheSameGroup: computed('grupo', function(){
    const groupChallenges = this.grupo?.get('desafios').toArray() //The challenge could be a custom challenge, in which case it doesnt have a group.
    return groupChallenges || [this]
  }),

  indexInGroup: computed('grupo', function () {
    return this.challengesInTheSameGroup.findIndex(challenge => challenge.id === this.id)
  }),

  nextChallenge: computed('grupo', function () {
    return this.challengesInTheSameGroup[this.indexInGroup + 1]
  }),

  previousChallenge: computed('grupo', function () {
    return this.challengesInTheSameGroup[this.indexInGroup - 1]
  }),



});
