import DS from 'ember-data';

var Preferencias = DS.Model.extend({
  nombre: "",
});

Preferencias.FIXTURES = [
    {id: 1, nombre: "Hugo"}
];

export default Preferencias;
