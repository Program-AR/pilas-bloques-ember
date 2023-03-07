import Component from '@ember/component';

export default Component.extend({
  classNames: ['challenges-book-container zoom'],
  get bookImageUrl(){
    return `imagenes/libros/${this.get("book").imagen}`
  }
});
