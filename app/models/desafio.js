import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import Ember from 'ember';

export default Model.extend({
  nombre: attr('string'),
  titulo: attr('string'),
  imagen: attr('string'),  
  deshabilitado: attr('boolean'),
  enunciado: attr('string'),
  consignaInicial: attr('string'),
  escena: attr('string'),
  debeFelicitarse: attr(),
  estiloToolbox: attr('string'),
  grupo: belongsTo('grupo'),
  bloques: attr(),
	solucionInicial: attr('string'),
	debugging: attr('boolean'), 

  nombreImagen: Ember.computed('imagen','nombre', function(){
    return `${this.get('imagen') || this.get('nombre') || 'proximamente'}.png` 
  })
});
