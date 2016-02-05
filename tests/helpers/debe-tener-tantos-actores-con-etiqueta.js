function contarActoresConEtiqueta(pilas, etiqueta) {
  var escena = pilas.escena_actual();

  function tieneEtiquetaBuscada(actor) {
    return actor.tiene_etiqueta(etiqueta);
  }

  return escena.actores.filter(tieneEtiquetaBuscada).length;
}

export default function debeTenerTantosActoresConEtiqueta(assert, cantidad, etiqueta) {
  var cantidad_de_actores = contarActoresConEtiqueta(window['pilas'], etiqueta);
  assert.equal(cantidad, cantidad_de_actores, `Hay ${cantidad} actores con la etiqueta '${etiqueta}'`);
}
