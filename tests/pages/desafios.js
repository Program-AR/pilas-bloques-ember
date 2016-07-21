import PageObject from 'pilas-engine-bloques/tests/page-object';

let {
  visitable,
  count
} = PageObject;

export default PageObject.create({
  visit: visitable('/desafios'),
  cantidadDeDesafiosDisponibles: count('.desafio a'),
});
