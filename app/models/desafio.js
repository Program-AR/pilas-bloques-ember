import { computed } from '@ember/object';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
  intl: Ember.inject.service(),

  titulo: computed('id',function(){
    return this.intl.t(`challenges.${this.id}.title`); 
  }),
  enunciado: computed('id',function(){
    return this.intl.t(`challenges.${this.id}.description`); 
  }),
  consignaInicial: computed('id',function(){
    return this.intl.t(`challenges.${this.id}.clue`); 
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

  nombreImagen: computed('imagen','nombre', function(){
    return `${this.imagen || this.nombre || 'proximamente'}.png`; 
  })
});
