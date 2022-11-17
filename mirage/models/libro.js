/*jshint esversion: 6 */

import { Model, hasMany } from 'miragejs';

export default Model.extend({
  capitulos: hasMany('capitulo')
});
