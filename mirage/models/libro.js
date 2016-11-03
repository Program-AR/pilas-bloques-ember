import { Model, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  grupos: hasMany('grupo',  {inverseOf: 'libro'})
});
