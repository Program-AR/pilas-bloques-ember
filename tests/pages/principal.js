import PageObject from 'pilas-engine-bloques/tests/page-object';

let {
  visitable,
  count,
  text
} = PageObject;

export default PageObject.create({
  scope: '.contenido-principal',
  visit: visitable('/'),
  tituloModal: text('h4', {scope: '.ember-modal-dialog', resetScope: true}),

  cantidadDeImagenes: count('img'),
  cantidadDeLinks: count('a'),

  abrirAyuda() {
    click("button#abrir-ayuda");
    return this;
  },

  cerrarDialogo() {
    click("button#cerrar-modal");
    return this;
  },

  abrirOpciones() {
    click("button#abrir-opciones");
    return this;
  }

});
