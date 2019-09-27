/*jshint esversion: 6 */
import { JSONAPISerializer } from 'ember-cli-mirage';

export default JSONAPISerializer.extend({
    include: ['libros', 'capitulos', 'grupos', 'desafios'],
});
