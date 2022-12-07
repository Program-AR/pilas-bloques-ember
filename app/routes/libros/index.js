import Route from '@ember/routing/route';

export default Route.extend({
    async model() {
        const books = this.store.peekAll('libro')
        const orderedBooks = books.toArray().sort((book1, book2) => parseInt(book1.get('id')) > parseInt(book2.get('id')))
        return orderedBooks;
    }
});
