import sinon from 'sinon'
import fetchMock from 'fetch-mock'
import { setupTest } from 'ember-qunit'
import { fakeUser, toastMock } from './mocks'
import config from '../../config/environment'
const { baseURL } = config.pbApi

////// SETUP //////

export function setupPBTest(hooks) {
    setupTest(hooks)
    hooks.beforeEach(function () {
        this.owner.register('service:paperToaster', toastMock)
        resetFetch()
        localStorage.clear()
        sinon.resetHistory()
    })    
}

export function setupLoggedUser(hooks) {
    hooks.beforeEach(function () {
        this.owner.lookup('service:storage').saveUser(fakeUser)
    })    
}

export function resetFetch() {
    fetchMock.reset()
    fetchMock.config.overwriteRoutes = true
    mockApi(`login`, fakeUser)
    mockApi(`register`, fakeUser)
    mockApi(`credentials`, fakeUser)
    mockApi(`answers`, fakeUser)
    mockApi(`challenges`, 200)
    mockApi(`solutions`, 200)
    mockApi(`error`, { throws: 'ERROR' })
}

export function mockApi(path, response, options) {
    fetchMock.mock(`begin:${baseURL}/${path}`, response, options)
}


////// BLOCKLY //////

export function createBlock(type) {
    return Blockly.mainWorkspace.newBlock(type)
}

export function findBlockByTypeIn(rootBlock, type) {
    if (!rootBlock) return null
    if (rootBlock.type == type) return rootBlock
    return rootBlock.getChildren().map(b => findBlockByTypeIn(b, type)).find(b => b != null)
}

////// ASSERT //////

export function assertAsync(assert, fn, ms = 0) {
    let done = assert.async(1)
    setTimeout(function () {
        fn(); done()
    }, ms)
}

export function assertProps(assert, obj, props) {
    const expected = Object.assign({}, obj, props)
    assert.propEqual(obj, expected)
}

export function assertDisabled(assert, block) {
    assert.ok(block.disabled)
}

export function assertNotDisabled(assert, block) {
    assert.notOk(block.disabled)
}

export function assertWarning(assert, block, warning) {
    assert.equal(block.warning.getText(), warning)
}

export function assertNotWarning(assert, block) {
    assert.notOk(block.warning)
}

export function assertNotAvailable(assert, block) {
    assertDisabled(assert, block)
    assertWarning(assert, block, "Este bloque no está disponible en esta actividad.")
}

////// FETCH //////

export function fetchCalled(uri) {
    return fetchMock.called(`begin:${uri}`)
}

export function fetchCallBody() {
    const [, { body }] = fetchMock.lastCall()
    return JSON.parse(body)
}

export function fetchCallHeader() {
    const [, { headers }] = fetchMock.lastCall()
    return headers
}