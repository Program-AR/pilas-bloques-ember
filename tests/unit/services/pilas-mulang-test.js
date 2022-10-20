import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit';
import { isUsedId, isUsedFromMainId } from '../../../utils/expectations'
import { combineUsage, combineUsageResults } from '../../../services/pilas-mulang'
import { createComponentMock } from '../../helpers/mocks';
import { setUpTestWorkspace } from '../../helpers/utils';

module('Unit | Service | pilas-mulang', function (hooks) {

    setupTest(hooks)
    setUpTestWorkspace(hooks)

    const isUsedDescription = 'IS USED DESC'
    const isUsedFromMainDescription = 'IS USED FROM MAIN DESC'
    let challengeMock

    hooks.beforeEach(function () {
        this.ctrl = this.owner.factoryFor('component:pilas-blockly').create()
        challengeMock = createComponentMock({
            expectations: {
                decomposition: true
            }
        })
    })

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


    test('A procedure should not be considered to be used if a call exists on the workspace but it is disabled', async function (assert) {
        setInitialWorkspace.call(this)
        const pilasMulang = this.owner.lookup('service:pilasMulang')
        const expectationsResults = await pilasMulang.analyze(Blockly.mainWorkspace, challengeMock)
        const isUsedResult = expectationsResults.find(r => r.id === isUsedId)

        // Description is needed because we need to differentiate if it is is_used or is_used_from_main
        assert.notOk(isUsedResult.result)
        assert.equal(isUsedResult.description.asSuggestion, 'Este procedimiento no está siendo usado desde ninguna parte del programa. Hacé click en la manito y eso crea el nuevo comando que podés usar.')
    })

    test('parseAll should ignore disabled blocks', function (assert) {
        setInitialWorkspace.call(this)
        const pilasMulang = this.owner.lookup('service:pilasMulang')
        const ast = pilasMulang.parseAll(Blockly.mainWorkspace)

        assert.equal(ast.contents.length, 2)
    })

    /**
     * This workspace starts with 3 top blocks. The procedure call is disabled.
     */
    function setInitialWorkspace() {
        const initialWorkspaceXml = "<xml><variables></variables><block type=\"al_empezar_a_ejecutar\" id=\"4pe?Net`YOsGY]Fz/m+9\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"15\" y=\"15\"><statement name=\"program\"><shadow type=\"required_statement\" id=\"EGV2_l|prsv@nr#3dqXr\"></shadow><block type=\"MoverACasillaDerecha\" id=\"6A*Cxg;sh.D!SBpKN=#_\"></block></statement></block><block type=\"procedures_defnoreturn\" id=\"^7i)J4zO`/x{6[$sG;$*\" x=\"-152\" y=\"174\"><field name=\"NAME\">ja</field></block><block type=\"procedures_callnoreturn\" id=\"H}OPLgBNXDc=}}mVny=i\" disabled=\"true\" x=\"51\" y=\"168\"><mutation name=\"ja\"></mutation></block></xml>"        
        this.ctrl.send('setWorkspace', initialWorkspaceXml)
    }
    
    function createResult(id, result, description, declaration = undefined, isRelatedToUsage = true) {
        return { id, result, description, declaration, isRelatedToUsage }
    }
})

