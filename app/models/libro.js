import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';
import { computed } from '@ember/object';
import Ember from 'ember';

export default Model.extend({
  intl: Ember.inject.service(),

  titulo: computed('id',function(){
    return this.intl.t(`model.books.${this.id}.title`);
  }),

  nombre: computed('id',function(){
    return this.intl.t(`model.books.${this.id}.name`);
  }),

  descripcion: computed('id',function(){
    return this.intl.t(`model.books.${this.id}.description`);
  }), 

  modoLecturaSimple: attr('boolean'),
  oculto: attr('boolean'),
  capitulos: hasMany('capitulo')
});
