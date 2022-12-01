import sinon from 'sinon'
import Component from '@ember/component'
import { visit } from '@ember/test-helpers'
import { setupRenderingTest, setupTest, setupApplicationTest } from 'ember-qunit'
import setupMirage from "ember-cli-mirage/test-support/setup-mirage"
import { fakeUser, toastMock, routerMock, blocklyWorkspaceMock } from './mocks'
import simulateRouterHooks from './simulate-router.hooks'
import config from '../../config/environment'
import { test } from 'qunit';
const { baseURL } = config.pbApi

////// SETUP //////

export function setupPBUnitTest(hooks) {
    setupTest(hooks)
    setupClear(hooks)
    setupToasterMock(hooks)
    setupRouterMock(hooks)
    setUpTestLocale(hooks)
    setupMirage(hooks)
}

export function setupPBIntegrationTest(hooks) {
    setupRenderingTest(hooks)
    setupClear(hooks)
    setupEmberMocks(hooks)
    setUpTestLocale(hooks)
    setupMirage(hooks)
}

export function setupPBAcceptanceTest(hooks) {
    setupApplicationTest(hooks)
    setupMirage(hooks)
    setupClear(hooks)
    setUpTestLocale(hooks)
    setupSimulateRouter(hooks)
}

export function setupClear(hooks) {
    hooks.beforeEach(function () {
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
        this.owner.register('service:router', routerMock)
    })
}

export function setupSimulateRouter(hooks) {
    hooks.beforeEach(function () {
        simulateRouterHooks(this.owner.lookup('service:store'))
    })
}

function fetchUserIpMock(server, ip) {
    const json = JSON.stringify({ip})
    server.get(`https://api64.ipify.org?format=json`, () => new Response(json) )
}

const api = {
    posts: ['challenges','solutions','register','login','credentials','password-recovery','answers'],
    puts: ['solutions/:id','experiment-group','solutions/:solutionId'],
    gets: ['password-recovery','profile','/users/exists','user-ip','challenges/:challengeId/solution']
}

export function failAllApiFetchs(server) {
    fetchUserIpMock(server, "123.123.123")
    const error = { errors: [ 'ERROR' ]}
    const withBase = (request) => `${baseURL}/${request}`
    api.posts.forEach(apiPost => server.post(withBase(apiPost), error))
    api.puts.forEach(apiPut => server.put(withBase(apiPut), error))
    api.gets.forEach(apiGet => server.get(withBase(apiGet), error))
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

function lastCall() {
    const requests = this.server.pretender.handledRequests
    return requests[requests.length - 1]
}

export function fetchCallBody() {
    const [, { body }] = lastCall()
    return JSON.parse(body)
}

export function fetchCallHeader() {
    const [, { headers }] = lastCall()
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