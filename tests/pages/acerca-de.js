import PageObject from 'pilas-engine-bloques/tests/page-object';

let {
  visitable,
  text,
  count
} = PageObject;

export default PageObject.create({
  scope: '.contenido-principal',
  visit: visitable('/acercade'),
  titulo: text("h1"),

  cantidadDeBotones: count('button'),
});
