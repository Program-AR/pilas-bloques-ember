import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit';
import { isUsedId, isUsedFromMainId } from '../../../utils/expectations'
import { combineUsage, combineUsageResults } from '../../../services/pilas-mulang'

module('Unit | Service | pilas-mulang', function (hooks) {

    setupTest(hooks)

    const isUsedDescription = 'IS USED DESC'
    const isUsedFromMainDescription = 'IS USED FROM MAIN DESC'

    test('Combine two usage results of a procedure that is not used from anywhere', function (assert) {
        const isUsedResult = createResult(isUsedId, false, isUsedDescription)
        const isUsedFromMainResult = createResult(isUsedFromMainId, false, isUsedFromMainDescription)

        assert.propEqual(combineUsage([isUsedResult, isUsedFromMainResult]), createResult(isUsedId, false, isUsedDescription))
    })

    test('Combine two usage results of a procedure that is used from another procedure but not from main', function (assert) {
        const isUsedResult = createResult(isUsedId, true, isUsedDescription)
        const isUsedFromMainResult = createResult(isUsedFromMainId, false, isUsedFromMainDescription)

        assert.propEqual(combineUsage([isUsedResult, isUsedFromMainResult]), createResult(isUsedId, false, isUsedFromMainDescription))
    })

    test('Combine two usage results of a procedure that is used', function (assert) {
        const isUsedResult = createResult(isUsedId, true, isUsedDescription)
        const isUsedFromMainResult = createResult(isUsedFromMainId, true, isUsedFromMainDescription)

        assert.propEqual(combineUsage([isUsedResult, isUsedFromMainResult]), createResult(isUsedId, true, isUsedFromMainDescription))
    })

    test('Combine usage results', function (assert) {
        const flyProcedure = 'fly'
        const jumpProcedure = 'jump'
        const ifResult = createResult('if', false, '', 'conditional', false)
        const whileResult = createResult('while', true, '', 'loop', false)
        const flyIsUsed = createResult(isUsedId, true, isUsedDescription, flyProcedure)
        const flyIsUsedFromMain = createResult(isUsedFromMainId, false, isUsedFromMainDescription, flyProcedure)
        const jumpIsUsed = createResult(isUsedId, true, isUsedDescription, jumpProcedure)
        const jumpIsUsedFromMain = createResult(isUsedFromMainId, true, isUsedFromMainDescription, jumpProcedure)
        const flyIsUsedCombined = createResult(isUsedId, false, isUsedFromMainDescription, flyProcedure)
        const jumpIsUsedCombined = createResult(isUsedId, true, isUsedFromMainDescription, jumpProcedure)

        assert.propEqual(
            combineUsageResults([ifResult, flyIsUsed, flyIsUsedFromMain, whileResult, jumpIsUsed, jumpIsUsedFromMain]),
            [ifResult, whileResult, flyIsUsedCombined, jumpIsUsedCombined]
        )

    })

    function createResult(id, result, description, declaration = undefined, isRelatedToUsage = true) {
        return { id, result, description, declaration, isRelatedToUsage }
    }
})

