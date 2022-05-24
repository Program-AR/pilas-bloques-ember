import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { actividadMock } from '../../helpers/mocks'
import { xmlBloqueEmpezarAEjecutar } from 'pilasbloques/models/desafio'
import sinon from 'sinon'
import { setUpTestLocale } from '../../helpers/utils'



module('Unit | Components | challenge-workspace-buttons', function (hooks) {
  setupTest(hooks);
  setUpTestLocale(hooks)

  let ctrl
  let version
  let actividad = actividadMock.nombre
  let solucion = "PHhtbCB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCI+PHZhcmlhYmxlcz48L3ZhcmlhYmxlcz48YmxvY2sgdHlwZT0iYWxfZW1wZXphcl9hX2VqZWN1dGFyIiBpZD0idX4vczBQV1BEWkQ1aFEtLFFnPXQiIGRlbGV0YWJsZT0iZmFsc2UiIG1vdmFibGU9ImZhbHNlIiBlZGl0YWJsZT0iZmFsc2UiIHg9IjIyNyIgeT0iMTUiPjwvYmxvY2s+PC94bWw+"
  let currentWorkspace


  hooks.beforeEach(function () {
    ctrl = this.owner.factoryFor('component:challenge-workspace-buttons').create()
    ctrl.set('actividad', actividadMock)
    ctrl.descargar = sinon.stub()
    currentWorkspace = ""
    ctrl.setWorkspace = function (xml) {
      currentWorkspace = xml
    }
    version = ctrl.version()
    sinon.resetHistory()
  });

  test("Al guardar solución crea el archivo correctamente", function (assert) {
    let contenido = JSON.stringify({
      version,
      actividad,
      solucion: "bnVsbA=="
    })
    let archivo = `${actividad}.spbq`
    let tipo = 'application/octet-stream'

    ctrl.send("guardarSolucion")
    assert.ok(ctrl.descargar.calledWith(contenido, archivo, tipo))
  })

  let solucionCompleta = {
    version,
    actividad,
    solucion
  }

  test("Al borrar una solucion con un workspace inicial se deberia volver al workspace incial", function (assert) {
    const actividadConWorkspaceInicial = this.owner.lookup('service:store').createRecord('desafio', { solucionInicial: solucion })
    ctrl.set('actividad', actividadConWorkspaceInicial)
    currentWorkspace = "algoDistinto"
    ctrl.send('borrarSolucion')
    assert.equal(currentWorkspace, solucion)
  })

  test("Al borrar una solucion sin un workspace inicial se deberia volver al wokspace inicial base", function (assert) {
    const actividadSinWorkspaceInicial = this.owner.lookup('service:store').createRecord('desafio')
    ctrl.set('actividad', actividadSinWorkspaceInicial)
    currentWorkspace = "algoDistinto"
    ctrl.send('borrarSolucion')
    assert.equal(currentWorkspace, xmlBloqueEmpezarAEjecutar)
  })


  goodFileTest("Carga un archivo de solución correctamente", solucionCompleta)


  let solucionCompletaConVersionPosterior = {
    version: 999,
    actividad,
    solucion
  }

  goodFileTest("Carga un archivo de solución aunque tenga una versión posterior", solucionCompletaConVersionPosterior)

  let solucionCompletaConVersionAnterior = {
    version: -1,
    actividad,
    solucion
  }

  failFileTest("Verifica que se está cargando una versión anterior", solucionCompletaConVersionAnterior, function (assert, err) {
    assert.equal(err, "¡Cuidado! El archivo indica que es de una versión anterior. Se cargará de todas formas, pero te sugerimos que resuelvas nuevamente el ejercicio y guardes un nuevo archivo.")
  })

  failFileTest("Aunque no tenga una versión actual se carga al workspace", solucionCompletaConVersionAnterior, function (assert) {
    assert.ok(currentWorkspace)
  })

  let solucionCompletaSinVersion = {
    actividad,
    solucion
  }

  goodFileTest("Carga un archivo de solución aunque no tenga versión", solucionCompletaSinVersion)


  let solucionParaOtraActividad = {
    version,
    actividad: "Otra_Actividad",
    solucion
  }

  failFileTest("Verifica que sea para la actividad que se está cargando", solucionParaOtraActividad, function (assert, err) {
    assert.equal(err, "¡Cuidado! El archivo indica que es para otra actividad (Otra_Actividad). Se cargará de todas formas, pero puede fallar.")
  })

  failFileTest("Aunque no sea una solución para la actividad se carga al workspace", solucionParaOtraActividad, function (assert) {
    assert.ok(currentWorkspace)
  })


  let solucionCompletaConVersionAnteriorParaOtraActividad = {
    version: -1,
    actividad: "Otra_Actividad",
    solucion
  }

  failFileTest("Acumula las validaciones con soluciones", solucionCompletaConVersionAnteriorParaOtraActividad, function (assert, err) {
    assert.equal(err,
      `¡Cuidado! El archivo indica que es para otra actividad (Otra_Actividad). Se cargará de todas formas, pero puede fallar.
¡Cuidado! El archivo indica que es de una versión anterior. Se cargará de todas formas, pero te sugerimos que resuelvas nuevamente el ejercicio y guardes un nuevo archivo.`)
  })

  failFileTest("Aunque no tenga versión actual y sea una solución para la actividad se carga al workspace", solucionCompletaConVersionAnteriorParaOtraActividad, function (assert) {
    assert.ok(currentWorkspace)
  })

  let archivoSinSolucion = {
    version,
    actividad,
  }

  failFileTest("Verifica que tenga una solucion", archivoSinSolucion, function (assert, err) {
    assert.equal(err, "Este archivo no tiene una solución de Pilas Bloques.")
  })

  failFileTest("Verifica que tenga una solucion", archivoSinSolucion, function (assert) {
    assert.notOk(currentWorkspace)
  })


  function goodFileTest(mensaje, contenido) {
    fileTest(mensaje, contenido, (assert) => { assert.ok(currentWorkspace) }, () => { })
  }

  function failFileTest(mensaje, contenido, cb) {
    fileTest(mensaje, contenido, () => { }, cb)
  }

  function fileTest(mensaje, contenido, cbGood, cbFail) {
    test(mensaje, function (assert) {
      let done = assert.async()
      let archivo = new Blob([JSON.stringify(contenido)])

      ctrl
        .leerSolucionWeb(archivo)
        .then(() => {
          cbGood(assert)
          done()
        })
        .catch((err) => {
          cbFail(assert, err)
          done()
        })
    })
  }
});

