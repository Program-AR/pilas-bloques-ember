import CursoAlumnoRoute from './curso-alumno';

export default CursoAlumnoRoute.extend({

  afterModel(model, transition) {
    this._super(model, transition);

    return this.get("cursoAPI").obtener_solucion_xml_desde_hash(model.hash).
      then((solucion_xml) => {

        model.solucion = this.store.createRecord("solucion", {
          codigoXML: solucion_xml
        });

      });
  },
});
