/*jshint esversion: 6 */

import { Model, hasMany, belongsTo } from 'miragejs';

export default Model.extend({
  grupos: hasMany('grupo'),
  libro: belongsTo('libro')
});
