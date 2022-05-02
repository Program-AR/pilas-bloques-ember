import Model from 'ember-data/model';
import { hasMany, belongsTo } from 'ember-data/relationships';
import { computed } from '@ember/object';
import Ember from 'ember';
import attr from 'ember-data/attr';

export default Model.extend({
  intl: Ember.inject.service(),

  titulo: computed('id', function () {
    return this.intl.t(`model.chapters.${this.id}.title`).toString();
  }),

  grupos: hasMany('grupo'),
  libro: belongsTo('libro'),
  expectations: attr(),
});
