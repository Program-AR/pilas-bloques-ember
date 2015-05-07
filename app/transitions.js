export default function(){
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

  this.transition(
    this.fromRoute('galeria'),
    this.toRoute('preferencia'),
    this.use('toLeft'),
    this.reverse('toRight')
  );


  this.transition(
    this.fromRoute('preferencia'),
    this.toRoute('test'),
    this.use('toLeft'),
    this.reverse('toRight')
  );
}
