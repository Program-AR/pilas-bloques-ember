window.deprecationWorkflow = window.deprecationWorkflow || {};
window.deprecationWorkflow.config = {
  workflow: [
    { handler: "silence", matchMessage: "Using `Ember.HTMLBars.makeBoundHelper` is deprecated. Please refactor to using `Ember.Helper` or `Ember.Helper.helper`." },
    { handler: "silence", matchMessage: "Using Ember.HTMLBars._registerHelper is deprecated. Helpers (even dashless ones) are automatically resolved." },
    { handler: "silence", matchMessage: "Using Ember.Handlebars.makeBoundHelper is deprecated. Please refactor to using `Ember.Helper.helper`." },
    { handler: "silence", matchMessage: "Ember.keys is deprecated in favor of Object.keys" }
  ]
};
