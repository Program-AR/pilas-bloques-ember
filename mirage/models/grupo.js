/*jshint esversion: 6 */

import { Model, hasMany, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  desafios: hasMany('desafio',  {inverseOf: 'grupo'}),
  libro: belongsTo()
});
