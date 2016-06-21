import Ember from 'ember';

export function prism(params) {
  let html = Prism.highlight(params[0], Prism.languages.javascript);
  return Ember.String.htmlSafe(html);
}

export default Ember.Helper.helper(prism);
