import Ember from 'ember';
import NombreRoute from './nombre';


/* Esta ruta es una especialización de la ruta Nombre,
 * ya que hace algo muy similar, pero esconde elementos
 * de la interfaz y permite guardar la solución en un
 * backend de datos.
 */
export default NombreRoute.extend({
  cursoAPI: Ember.inject.service(),

  model(params) {
    params.nombre = this.decodificarHash(params.hash).actividad;
    return this._super(params);
  },

  /* Agrega los parámetros decodificados del hash al modelo. */
  afterModel(model, transition) {
    let hash = this.obtener_hash_desde_transition(transition);
    let valores = this.decodificarHash(hash);

    model.idAlumno = valores.idAlumno;
    model.hash = valores.hashCompleto;
  },

  obtener_hash_desde_transition(transition) {
    return transition.params[this.routeName].hash;
  },

  decodificarHash(hash) {
    let hashString = atob(hash);
    let valores = hashString.split("-");

    if (valores.length !== 3) {
      throw Error(`Hash con formato de piezas incorrecto: ${hashString}`);
    }

    return {
      actividad: valores[0],
      idAlumno: valores[1],
      hashMoodle: valores[2],
      hashCompleto: hash
    };
  },

  activate() {
    this.ocultarLayout();
  },

  ocultarLayout() {
    this.controllerFor('application').set('layout', false);
  },

  actions: {
    guardar_solucion_en_el_backend(parametros) {

      this.get("cursoAPI").guardar(parametros).
        then(() => {
          this.transitionTo("desafios.mensajeGuardado");
        }).
        catch(() => {
          alert("Se a producido un error al guardar, por favor volvé a intentar.");
        });

    },
  }
});
