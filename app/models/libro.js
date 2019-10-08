import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';

export default Model.extend({
  titulo: attr('string'),
  nombre: attr('string'),
  descripcion: attr('string'),
  modoLecturaSimple: attr('boolean'),
  desafiosCortos: attr('boolean'),
  oculto: attr('boolean'),
  capitulos: hasMany('capitulo')
});
