import { computed } from '@ember/object';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

const xmlBloqueEmpezarAEjecutar =
  `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" x="15" y="15"></block>
  </xml>`

export default Model.extend({
  nombre: attr('string'),
  titulo: attr('string'),
  imagen: attr('string'),
  deshabilitado: attr('boolean'),
  enunciado: attr('string'),
  consignaInicial: attr('string'),
  escena: attr('string'),
  debeFelicitarse: attr(),
  estiloToolbox: attr('string'),
  grupo: belongsTo('grupo'),
  bloques: attr(),
  solucionInicial: attr('string'),
  debugging: attr('boolean'),

  nombreImagen: computed('imagen', 'nombre', function () {
    return `${this.imagen || this.nombre || 'proximamente'}.png`;
  }),

  initialWorkspace: computed("solucionInicial", function () {
    return this.solucionInicial || xmlBloqueEmpezarAEjecutar
  })


});
