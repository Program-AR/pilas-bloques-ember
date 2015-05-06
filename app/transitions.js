export default function(){
  this.transition(
    this.fromRoute('index'),
    this.toRoute('tips'),
    this.use('toLeft'),
    this.reverse('toRight')
  );
}
