export default function(){

  /* INDEX */

  this.transition(
    this.fromRoute('index'),
    this.toRoute('desafios'),
    this.use('fade'),
    this.reverse('fade')
  );

  this.transition(
    this.fromRoute('index'),
    this.toRoute('galeria'),
    this.use('fade'),
    this.reverse('fade')
  );

  this.transition(
    this.fromRoute('index'),
    this.toRoute('preferencia'),
    this.use('fade'),
    this.reverse('fade')
  );

  /* DESAFIOS */

  this.transition(
    this.fromRoute('desafios'),
    this.toRoute('galeria'),
    this.use('fade'),
    this.reverse('fade')
  );

  this.transition(
    this.fromRoute('desafios'),
    this.toRoute('preferencia'),
    this.use('fade'),
    this.reverse('fade')
  );

  /* GALERIA */

  this.transition(
    this.fromRoute('galeria'),
    this.toRoute('preferencia'),
    this.use('fade'),
    this.reverse('fade')
  );


  /* ACERCA DE ... */

  this.transition(
    this.fromRoute('acercade'),
    this.toRoute('desafios'),
    this.use('fade'),
    this.reverse('fade')
  );

  this.transition(
    this.fromRoute('acercade'),
    this.toRoute('galeria'),
    this.use('fade'),
    this.reverse('fade')
  );

  this.transition(
    this.fromRoute('acercade'),
    this.toRoute('preferencia'),
    this.use('fade'),
    this.reverse('fade')
  );

  this.transition(
    this.fromRoute('acercade'),
    this.toRoute('index'),
    this.use('fade'),
    this.reverse('fade')
  );

}
