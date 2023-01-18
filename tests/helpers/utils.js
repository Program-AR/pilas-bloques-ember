import sinon from 'sinon'
import fetchMock from 'fetch-mock'
import Component from '@ember/component'
import { visit } from '@ember/test-helpers'
import { setupRenderingTest, setupTest, setupApplicationTest } from 'ember-qunit'
import { fakeUser, toastMock, routerMock, blocklyWorkspaceMock } from './mocks'
import config from '../../config/environment'
import { test } from 'qunit';
import { loadStaticModels } from 'pilasbloques/utils/staticModels'

const { baseURL } = config.pbApi

////// SETUP //////

export function setupPBUnitTest(hooks) {
    setupTest(hooks)
    setupClear(hooks)
    setupToasterMock(hooks)
    setupRouterMock(hooks)
    setUpTestLocale(hooks)
    setupModels(hooks)
}

export function setupPBIntegrationTest(hooks) {
    setupRenderingTest(hooks)
    setupClear(hooks)
    setupEmberMocks(hooks)
    setUpTestLocale(hooks)
    setupModels(hooks)
}

export function setupPBAcceptanceTest(hooks) {
    setupApplicationTest(hooks)
    setupClear(hooks)
    setUpTestLocale(hooks)
}

export function setupClear(hooks) {
    hooks.beforeEach(function () {
        resetFetch()
        localStorage.clear()
        sinon.resetHistory()
    })
}

export function setupLoggedUser(hooks) {
    hooks.beforeEach(function () {
        this.owner.lookup('service:storage').saveUser(fakeUser)
    })
    hooks.afterEach(function () {
        localStorage.clear()
    })
}

export function setupEmberMocks(hooks) {
    setupToasterMock(hooks)
    hooks.beforeEach(function () {
        this.owner.register('component:personal-survey', Component.extend({}))
    })
}

export function setupToasterMock(hooks) {
    hooks.beforeEach(function () {
        this.owner.register('service:paperToaster', toastMock)
    })
}

export function setupRouterMock(hooks) {
    hooks.beforeEach(function () {
        this.owner.unregister('service:router')
        this.owner.register('service:router', routerMock)
    })
}

export function setupModels(hooks) {
    hooks.beforeEach(function () {
        loadStaticModels(this.owner.lookup('service:store'))
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
    mockApi(`ping`, 200)
    mockApi(`error`, { throws: 'ERROR' })
    mockApi('user-ip', { ip: "123.123.123" })
}

export function mockApi(path, response, options) {
    fetchMock.mock(`begin:${baseURL}/${path}`, response, options)
}

export function failAllApiFetchs() {
    fetchMock.reset()
    mockApi("", { throws: 'ERROR' })
}

export function setUpTestLocale(hooks) {
    hooks.beforeEach(function () {
        this.owner.lookup('service:intl').setLocale(['es-ar'])
    })
}

export function setUpTestWorkspace(hooks) {
    hooks.beforeEach(function () {
        blocklyWorkspaceMock()
        this.owner.lookup('service:blocksGallery').start()    
    })
}

export function acceptTerms(hooks) {
    hooks.beforeEach(function () {
        this.owner.lookup('service:storage').saveTermsAcceptance()
    })
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

export function assertAsync(assert, fn, ms = 0) { //TODO: Curry
    let done = assert.async(1)
    setTimeout(function () {
        fn()
        done()
    }, ms)
}

export function assertProps(assert, obj, props) {
    const expected = Object.assign({}, obj, props)
    assert.propEqual(obj, expected)
}

export function assertHasProps(assert, obj, ...props) {
    props.forEach((prop) => assert.ok(obj[prop]))
}

export function assertDisabled(assert, block) {
    assert.ok(block.disabled)
}

export function assertNotDisabled(assert, block) {
    assert.notOk(block.disabled)
}

export function assertWarning(assert, block, warning) {
    assert.ok(block.warning.getText().includes(warning), `El warning "${block.warning.getText()}" debería contener lo esperado: "${warning}"`)
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

////// DOM ELEMENTS /////

/**
 * Needed for acceptance tests where there is a visit() to a challenge page.
 */
export async function awaitChallengeLoading() {
    var timeoutInMs = 5000
    var startTimeInMs = Date.now()
    while (($("[data-test-challenge-description]").length == 0) && (startTimeInMs + timeoutInMs > Date.now())) {
        await new Promise(r => setTimeout(r, 20))
    }
}


export async function safeVisit(url) {
    // The visit helper has a known bug, so we need this try/catch
    // https://github.com/emberjs/ember-test-helpers/issues/332 (still open)
    try {
        await visit(url)
    }
    catch (e) {
        if (e.message !== 'TransitionAborted') {
            throw e
        }
    }
}

////// TESTS //////

export function testSimpleReadModeEnabled(callback) {
    test('when simple read mode is enabled, simple read mode css class should be applied', async function (assert) {
        await callback()
        assert.dom('div.simple-read-mode').exists()
    })
}

export function testSimpleReadModeDisabled(callback) {
    test('when simple read mode is disabled, simple read mode css class should not be applied', async function (assert) {
        this.simpleReadMock = this.owner.lookup('service:simpleRead');
        this.simpleReadMock.shouldShow = false
        await callback()
        assert.dom('div.simple-read-mode').doesNotExist()
    })
}