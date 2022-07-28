import { module, test } from 'qunit'
import { assertAsync, mockApi, setupPBUnitTest } from '../../helpers/utils'
import sinon from 'sinon'

module('Unit | Controller | password-recovery', function (hooks) {
  setupPBUnitTest(hooks)

  hooks.beforeEach(function () {
    this.ctrl = this.owner.lookup('controller:password-recovery')
    this.next = sinon.stub()
  })

  test('If username exists continue next step', function (assert) {
    mockApi(`password-recovery`, { email: 'fake@test.com' })
    this.ctrl.send('checkUsername', this.next)
    awaitAssert(assert, () => {
      assert.ok(this.next.called)
      assert.equal(this.ctrl.credentials.email, 'fake@test.com')
    })
  })

  test('If username not exist, show error', function (assert) {
    mockApi(`password-recovery`, 404)
    this.ctrl.send('checkUsername', this.next)
    awaitAssert(assert, () => {
      assert.notOk(this.next.called)
      assert.notOk(this.ctrl.usernameExists)
    })
  })

  test('After update credentials continue next step', function (assert) {
    mockApi(`credentials`, 200)
    this.ctrl.send('changePassword', this.next)
    awaitAssert(assert, () => assert.ok(this.next.called))
  })

  test('If update credentials fails for bad request, show error', function (assert) {
    mockApi(`credentials`, 400)
    this.ctrl.send('changePassword', this.next)
    awaitAssert(assert, () => {
      assert.notOk(this.next.called)
      assert.ok(this.ctrl.wrongCredentials)
    })
  })

  test('If update credentials fails for unauthorized, show error', function (assert) {
    mockApi(`credentials`, 401)
    this.ctrl.send('changePassword', this.next)
    awaitAssert(assert, () => {
      assert.notOk(this.next.called)
      assert.ok(this.ctrl.isExpiredToken)
    })
  })

  function awaitAssert(assert, fn) {
    /**
     * Se assertea en 500ms para esperar a que termine la Promise de la API.
     * En realidad habría que meter esa resolución dentro del runloop de Ember
     * para usar las herramientas que ofrece, pero no me salió.
     * */
    assertAsync(assert, fn, 500)
  }

})
