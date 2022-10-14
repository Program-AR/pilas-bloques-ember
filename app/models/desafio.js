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
  grupo: belongsTo('grupo'),
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

  indexInGroup: computed('grupo', function () {
    const groupChallenges = this.grupo.get('desafios').toArray()
    return groupChallenges.findIndex(challenge => challenge.id === this.id)
  }),

  nextChallenge: computed('grupo', function () {
    const groupChallenges = this.grupo.get('desafios').toArray()
    return groupChallenges[this.indexInGroup + 1]
  }),

  previousChallenge: computed('grupo', function () {
    const groupChallenges = this.grupo.get('desafios').toArray()
    return groupChallenges[this.indexInGroup - 1]
  }),



});
