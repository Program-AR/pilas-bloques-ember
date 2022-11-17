/*jshint esversion: 6 */

import { Model, hasMany, belongsTo } from 'miragejs';

export default Model.extend({
  desafios: hasMany('desafio'),
  capitulo: belongsTo('capitulo')
});