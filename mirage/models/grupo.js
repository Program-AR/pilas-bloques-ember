import { Model, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  desafios: hasMany('desafio',  {inverseOf: 'grupo'})
});
