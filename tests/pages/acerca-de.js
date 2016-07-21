import PageObject from 'pilas-engine-bloques/tests/page-object';

let {
  visitable
} = PageObject;

export default PageObject.create({
  visit: visitable('/'),

  visitar() {
    visit('/acercade');
    return this;
  },

  titulo() {
    return $(".contenido-principal h1").text();
  },

  botones() {
    return $(".contenido-principal button");
  }
});
