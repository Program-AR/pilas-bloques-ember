import { splitBy } from '../../../utils/lists'
import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit';

module('Unit | Functions | lists', function (hooks) {

    setupTest(hooks)

    const numbers = [1, 2, 3, 4]

    const even = (n) => n % 2 == 0

    test('splitBy of an empty list', function (assert) {
        assert.propEqual(splitBy(() => true, []), [[], []])
    })

    test('splitBy none match', function (assert) {
        assert.propEqual(splitBy(n => n > 5, numbers), [[], numbers])
    })

    test('splitBy all match', function (assert) {
        assert.propEqual(splitBy(n => n < 5, numbers), [numbers, []])
    })

    test('splitBy some match', function (assert) {
        assert.propEqual(splitBy(even, numbers), [[2, 4], [1, 3]])
    })
})

