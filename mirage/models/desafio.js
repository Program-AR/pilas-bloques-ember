/*jshint esversion: 6 */

import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  grupo: belongsTo('grupo')
});
