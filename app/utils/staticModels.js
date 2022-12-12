import { desafios } from './staticData/desafios' 
import { capitulos } from './staticData/capitulos' 
import { grupos } from './staticData/grupos' 
import { libros } from './staticData/libros' 

export const loadStaticModels = (store) => {
    desafios.forEach(desafio => store.createRecord('desafio', desafio))
    loadModelWithRelation(store, grupos, 'grupo', 'desafio')
    loadModelWithRelation(store, capitulos, 'capitulo', 'grupo')
    loadModelWithRelation(store, libros, 'libro', 'capitulo')
  }

const loadModelWithRelation = (store, staticModel, modelName, relatedModelName) => {
    const relatedModel = (modelItem) => modelItem[`${relatedModelName}Ids`].map(id => store.peekRecord(relatedModelName,id))
    staticModel.forEach(modelItem => store.createRecord(modelName, {...modelItem, [`${relatedModelName}s`]: relatedModel(modelItem)}))
  }