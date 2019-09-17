import { computed } from '@ember/object';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

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
  expectativas: attr(),
	debugging: attr('boolean'), 

  nombreImagen: computed('imagen','nombre', function(){
    return `${this.imagen || this.nombre || 'proximamente'}.png`; 
  })
});
