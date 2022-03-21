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
  deshabilitado: attr('boolean'),
  escena: attr('string'),
  debeFelicitarse: attr(),
  estiloToolbox: attr('string'),
  grupo: belongsTo('grupo'),
  bloques: attr(),
  solucionInicial: attr('string'),
  debugging: attr('boolean'),

  nombreImagen: computed('imagen', 'nombre', function () {
    return `${this.imagen || this.nombre || 'proximamente'}.png`;
  }),

  initialWorkspace: computed("solucionInicial", function () {
    return this.solucionInicial || xmlBloqueEmpezarAEjecutar
  })


});
