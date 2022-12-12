import { inject as service } from '@ember/service'
import Route from '@ember/routing/route'
import { loadLazyScript } from '../utils/request'
import { desafios } from './staticData/desafios' 
import { capitulos } from './staticData/capitulos' 
import { grupos } from './staticData/grupos' 
import { libros } from './staticData/libros' 

export default Route.extend({
  storage: service(),
  intl: service(),

  beforeModel() {
    const selectedLocale = this.storage.getSelectedLocale()
    this.get('intl').setLocale(selectedLocale || 'es-ar')
    this.loadStaticModels()
  },
  
  afterModel() {
    loadLazyScript('mulang.js')
  },

  loadStaticModels(){
    desafios.forEach(desafio => this.store.createRecord('desafio', desafio))
    loadModelWithRelation(grupos, 'grupo', 'desafio')
    loadModelWithRelation(capitulos, 'capitulo', 'grupo')
    loadModelWithRelation(libros, 'libro', 'capitulo')
  },

  loadModelWithRelation(staticModel, modelName, relatedModelName){
    const relatedModel = (modelItem) => modelItem[`${relatedModelName}Ids`].map(id => this.store.peekRecord(relatedModelName,id))
    staticModel.forEach(modelItem => this.store.createRecord(modelName, {...modelItem, [`${relatedModelName}s`]: relatedModel(modelItem)}))
  }
})
