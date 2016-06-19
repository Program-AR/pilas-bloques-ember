import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
  nombre: attr('string'),
  titulo: attr('string'),
  deshabilitado: attr('boolean'),
  enunciado: attr('string'),
  consignaInicial: attr('string'),
  escena: attr('string'),                 // escena que se tiene que cargar, por ejemplo: 'AlienInicial'
  actividad: attr(),                       // se completa desde el hook del desafío.
  grupo: belongsTo('grupo')
});
