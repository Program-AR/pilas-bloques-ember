import Route from '@ember/routing/route';

export default Route.extend({

  model(params) {

    return this.store.findAll("desafio").then((data) => {
      // TODO: reemplazar la linea anterior (findAll) y la siguiente
      //       por una consulta a ember-data más específica, como la que
      //       realiza findRecord, que solo debería traer un solo registro.
      //
      //       (esto está así ahora porque se debe corregir mirage antes).
      let model = data.findBy('nombre', params.nombreDelDesafio);

      if (!model) {
        throw new Error(`No existe una actividad con el nombre ${params.nombreDelDesafio}`);
      }

      return this.transitionTo("desafio", model);
    });

  }

});
