import Ember from 'ember';

export default Ember.Controller.extend({
  actividades: Ember.inject.service(),

  actions: {
    crearSolucionAlienTocaBoton() {

      var solucion = this.store.createRecord('solucion', {
        codigoXML: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="MoverACasillaDerecha" id="4"><next><block type="MoverACasillaDerecha" id="7"><next><block type="MoverACasillaDerecha" id="10"><next><block type="ApretarBoton" id="13"></block></next></block></next></block></next></block></statement></block></xml>',
        nombreDesafio: 'AlienTocaBoton'
      });

      var actividad = this.get('actividades').obtenerPorNombre(solucion.get('nombreDesafio'));
      this.transitionToRoute('solucion.ver', {id:solucion.id, solucion, actividad});
    },

    crearSolucionAlien() {
      var solucion = this.store.createRecord('solucion', {
        codigoXML: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="7" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="repetir" id="16" inline="true"><value name="count"><block type="math_number" id="17"><field name="NUM">4</field></block></value><statement name="block"><block type="MoverACasillaArriba" id="23"></block></statement><next><block type="repetir" id="45" inline="true"><value name="count"><block type="math_number" id="46"><field name="NUM">4</field></block></value><statement name="block"><block type="LevantaTuerca" id="29"><next><block type="MoverACasillaAbajo" id="35"><next><block type="MoverACasillaDerecha" id="41"></block></next></block></next></block></statement><next><block type="LevantaTuerca" id="53"></block></next></block></next></block></statement></block></xml>',
        nombreDesafio: 'alien'
      });

      var actividad = this.get('actividades').obtenerPorNombre(solucion.get('nombreDesafio'));
      this.transitionToRoute('solucion.ver', {id:solucion.id, solucion, actividad});
    },

  }
});
