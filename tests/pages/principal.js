import PageObject from 'pilasbloques/tests/page-object';

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

});
