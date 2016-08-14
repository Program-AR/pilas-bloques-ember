export default function() {

  this.get('/desafios');
  this.get('/desafios/:id');

  this.get('/grupos');
  this.get('/grupos/:id');

  // this.urlPrefix = '';    // make this `http://localhost:8080`, for example, if your API is on a different server
  // this.namespace = '';    // make this `api`, for example, if your API is namespaced
  this.timing = 500;      // delay for each request, automatically set to 0 during testing


  this.passthrough('http://104.131.245.133:9914/**');
  this.passthrough('http://api.pilasbloques.program.ar/**');

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
