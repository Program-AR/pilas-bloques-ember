import DS from 'ember-data';

export default DS.Model.extend({
  nombre: DS.attr('string'),
  codigo: DS.attr('string'),
  imagen: DS.attr('string'),
});
