import { moduleFor, test } from 'ember-qunit'
import { actividadMock } from '../../helpers/mocks'
import sinon from 'sinon'

let ctrl
let actividad = actividadMock.nombre
let solucion = "PHhtbCB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCI+PHZhcmlhYmxlcz48L3ZhcmlhYmxlcz48YmxvY2sgdHlwZT0iYWxfZW1wZXphcl9hX2VqZWN1dGFyIiBpZD0idX4vczBQV1BEWkQ1aFEtLFFnPXQiIGRlbGV0YWJsZT0iZmFsc2UiIG1vdmFibGU9ImZhbHNlIiBlZGl0YWJsZT0iZmFsc2UiIHg9IjIyNyIgeT0iMTUiPjwvYmxvY2s+PC94bWw+"

moduleFor('component:pilas-solution-file', 'Unit | Components | pilas-solution-file', {
  setup() {
    ctrl = this.subject()
    ctrl.set('actividad', actividadMock)
    sinon.resetHistory()
  }
})


let solucionCompleta = {
  version: 1,
  actividad,
  solucion
}

goodFileTest("Carga un archivo de solución correctamente", solucionCompleta)

let solucionCompletaConVersionPosterior = {
  version: 999,
  actividad,
  solucion
}

goodFileTest("Carga un archivo de solución aunque tenga una versión posterior", solucionCompletaConVersionPosterior)

let solucionCompletaSinVersion = {
  actividad,
  solucion
}

goodFileTest("Carga un archivo de solución aunque no tenga versión", solucionCompletaSinVersion)


function goodFileTest(mensaje, contenido) {
  test(mensaje, function(assert) {
    let done = assert.async()
    let archivo = new Blob([JSON.stringify(contenido)])
    
    ctrl
    .leerSolucion(archivo)
    .then(() => {
      assert.ok(ctrl.get("workspace"))
      done()
    })
    .catch(() => done())
  })  
}



let solucionParaOtraActividad = {
  version: 1,
  actividad: "Otra_Actividad",
  solucion
}

test("Verifica que sea para la actividad que se está cargando", function(assert) {
  let done = assert.async()
  let contenido = solucionParaOtraActividad
  let archivo = new Blob([JSON.stringify(contenido)])
  
  ctrl
  .leerSolucion(archivo)
  .then(() => done())
  .catch((err) => {
    assert.equal(err, "Cuidado, el archivo indica que es para otra actividad (Otra_Actividad). Se cargará de todas formas, pero puede fallar.")
    done()
  })
})

test("Aunque no sea una solución para la actividad, debería cargarla al workspace", function(assert) {
  let done = assert.async()
  let contenido = solucionParaOtraActividad
  let archivo = new Blob([JSON.stringify(contenido)])
  
  ctrl
  .leerSolucion(archivo)
  .then(() => done())
  .catch(() => {
    assert.ok(ctrl.get("workspace"))
    done()
  })
})



let archivoSinSolucion = {
  version: 1,
  actividad,
}

test("Verifica que tenga una solucion", function(assert) {
  let done = assert.async()
  let contenido = archivoSinSolucion
  let archivo = new Blob([JSON.stringify(contenido)])
  
  ctrl
  .leerSolucion(archivo)
  .then(() => done())
  .catch((err) => {
    assert.equal(err, "Lo siento, este archivo no tiene una solución de Pilas Bloques.")
    done()
  })
})

test("No carga ninguna solución si el archivo no tiene una", function(assert) {
  let done = assert.async()
  let contenido = archivoSinSolucion
  let archivo = new Blob([JSON.stringify(contenido)])
  
  ctrl
  .leerSolucion(archivo)
  .then(() => done())
  .catch(() => {
    assert.notOk(ctrl.get("workspace"))
    done()
  })
})
