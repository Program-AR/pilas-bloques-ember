/*jshint esversion: 6 */
import { JSONAPISerializer } from 'miragejs';

export default JSONAPISerializer.extend({
    include: ['libros', 'capitulos', 'grupos', 'desafios'],
});
