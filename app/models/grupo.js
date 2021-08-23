import Model from 'ember-data/model';
import { hasMany, belongsTo } from 'ember-data/relationships';
import { computed } from '@ember/object';
import Ember from 'ember';

export default Model.extend({
  intl: Ember.inject.service(),

  titulo: computed('id',function(){
    return this.intl.t(`model.groups.${this.id}.title`);
  }),

  desafios: hasMany('desafio'),
  capitulo: belongsTo('capitulo')
});
