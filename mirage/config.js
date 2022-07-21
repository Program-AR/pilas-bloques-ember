/*jshint esversion: 6 */
import config from "../config/environment";

export default function() {

  this.get('/desafios');
  this.get('/desafios/:id');

  this.get('/grupos');
  this.get('/grupos/:id');

  this.get('/capitulos');
  this.get('/capitulos/:id');

  this.get('/libros');
  this.get('/libros/:id');

	// Deshabilita los console log que emite mirage.
	this.logging = false;

  // this.urlPrefix = '';    // make this `http://localhost:8080`, for example, if your API is on a different server
  // this.namespace = '';    // make this `api`, for example, if your API is namespaced
  this.timing = 50;      // delay for each request, automatically set to 0 during testing

  this.passthrough('http://www.google-analytics.com/**');
  this.passthrough('https://api.github.com/**');
  this.passthrough(`${config.pbApi.baseURL}/**`);
  this.passthrough('https://api64.ipify.org');

  /*
    Shorthand cheatsheet:

    this.get('/posts');
    this.post('/posts');
    this.get('/posts/:id');
    this.put('/posts/:id'); // or this.patch
    this.del('/posts/:id');

    http://www.ember-cli-mirage.com/docs/v0.2.0-beta.7/shorthands/
  */
}
