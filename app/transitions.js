export default function(){

  /* INDEX */

  this.transition(
    this.fromRoute('index'),
    this.toRoute('desafios'),
    this.use('toLeft'),
    this.reverse('toRight')
  );

  this.transition(
    this.fromRoute('index'),
    this.toRoute('galeria'),
    this.use('toLeft'),
    this.reverse('toRight')
  );

  this.transition(
    this.fromRoute('index'),
    this.toRoute('preferencia'),
    this.use('toLeft'),
    this.reverse('toRight')
  );

  /* DESAFIOS */

  this.transition(
    this.fromRoute('desafios'),
    this.toRoute('galeria'),
    this.use('toLeft'),
    this.reverse('toRight')
  );

  this.transition(
    this.fromRoute('desafios'),
    this.toRoute('preferencia'),
    this.use('toLeft'),
    this.reverse('toRight')
  );

  /* GALERIA */

  this.transition(
    this.fromRoute('galeria'),
    this.toRoute('preferencia'),
    this.use('toLeft'),
    this.reverse('toRight')
  );

}
