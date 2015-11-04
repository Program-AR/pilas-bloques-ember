import DS from 'ember-data';

export default DS.Model.extend({
  codigoXML: DS.attr('string'),
  nombreDesafio: DS.attr('string'),
});
