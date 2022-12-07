import { inject as service } from '@ember/service'
import Route from '@ember/routing/route'
import { loadLazyScript } from '../utils/request'
import { desafios as desafio } from './staticData/desafios' 
import { capitulos as capitulo } from './staticData/capitulos' 
import { grupos as grupo } from './staticData/grupos' 
import { libros as libro } from './staticData/libros' 

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
    const models = { desafio, grupo, capitulo, libro }
    for (const modelName in models ){
      models[modelName].forEach( model => this.store.createRecord(modelName, model) )
    }
  }
})
