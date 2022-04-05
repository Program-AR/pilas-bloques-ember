import { module, test } from 'qunit'
import { entryPointType } from '../../../utils/blocks'
import { declaresAnyProcedure, doSomething, isUsed, isUsedFromMain, notTooLong, parseExpect, nameWasChanged } from '../../../utils/expectations'
import { procedure, entryPoint, rawSequence, application } from '../../helpers/astFactories'
import { setupPBUnitTest, setUpTestWorkspace } from '../../helpers/utils'

module('Unit | Service | Mulang | Expectations', function (hooks) {
  setupPBUnitTest(hooks)
  setUpTestWorkspace(hooks)

  const declaration = 'PROCEDURE'
  const limit = '3'

  // EDL
  expectationTestOk('declaresAnyProcedure', declaresAnyProcedure(), [
    entryPoint(entryPointType),
    procedure('EMPTY', [])
  ])

  expectationTestFail('declaresAnyProcedure', declaresAnyProcedure(), [
    entryPoint(entryPointType)
  ])


  expectationTestOk('doSomething', doSomething(declaration), [
    procedure(declaration, [],
      application('PRIMITIVE')
    )
  ])

  expectationTestFail('doSomething', doSomething('EMPTY'), [
    procedure('EMPTY', [])
  ])


  expectationTestOk('isUsed', isUsed('EMPTY'), [
    entryPoint(entryPointType,
      application('EMPTY')
    ),
    procedure('EMPTY', [])
  ])

  expectationTestOk('isUsed (from pocedure)', isUsed('EMPTY'), [
    procedure(declaration, [],
      application('EMPTY')
    ),
    procedure('EMPTY', [])
  ])

  expectationTestFail('isUsed', isUsed('EMPTY'), [
    entryPoint(entryPointType),
    procedure('EMPTY', [])
  ])


  expectationTestOk('isUsedFromMain', isUsedFromMain('EMPTY'), [
    entryPoint(entryPointType,
      application('EMPTY')
    ),
    procedure('EMPTY', [])
  ])

  expectationTestFail('isUsedFromMain', isUsedFromMain('EMPTY'), [
    entryPoint(entryPointType),
    procedure('EMPTY', []),
    procedure(declaration, [],
      application('EMPTY')
    )
  ])


  expectationTestOk('notTooLong', notTooLong(limit)(entryPointType), [
    entryPoint(entryPointType,
      application('PRIMITIVE'),
      application('PRIMITIVE'),
    ),
  ])

  expectationTestFail('notTooLong', notTooLong(limit)(entryPointType), [
    entryPoint(entryPointType,
      application('PRIMITIVE'),
      application('PRIMITIVE'),
      application('PRIMITIVE'),
    )
  ])

  const intlMock = { t: (_id) => ({ string: 'Hacer algo' }) }

  expectationTestOk('nameWasChanged', nameWasChanged(intlMock)('procedure_with_changed_name'), [
    entryPoint(entryPointType),
    procedure('procedure_with_changed_name', [])
  ])

  expectationTestFail('nameWasChanged', nameWasChanged(intlMock)('Hacer algo'), [
    entryPoint(entryPointType),
    procedure('Hacer algo', [])
  ])

  expectationTestFail('nameWasChanged', nameWasChanged(intlMock)('Hacer algo2'), [
    entryPoint(entryPointType),
    procedure('Hacer algo', [])
  ])


  function expectationTestOk(expectationName, expectation, astNodes) {
    expectationTest(expectationName, expectation, astNodes, true)
  }

  function expectationTestFail(expectationName, expectation, astNodes) {
    expectationTest(expectationName, expectation, astNodes, false)
  }

  function expectationTest(expectationName, edl, astNodes, shouldPass) {
    test(`Expectation ${expectationName} - ${shouldPass ? 'ok' : 'fail'}`, function (assert) {
      const mulangResult = mulang
        .astCode(rawSequence(astNodes))
        .customExpect(edl)
        .every(([, result]) => result)

      if (shouldPass) {
        assert.ok(mulangResult)
      } else {
        assert.notOk(mulangResult)
      }
    })
  }

  // IDs for internationalize - [key, params]

  expectationKeyTest('declaresAnyProcedure', declaresAnyProcedure(),
    [makeKey('declares_procedure'), { declaration: entryPointType }]
  )

  expectationKeyTest('doSomething', doSomething(declaration),
    [makeKey('do_something'), { declaration }]
  )

  expectationKeyTest('isUsed', isUsed(declaration),
    [makeKey('is_used'), { declaration }]
  )

  expectationKeyTest('isUsedFromMain', isUsedFromMain(declaration),
    [makeKey('is_used_from_main'), { declaration }]
  )

  expectationKeyTest('notTooLong', notTooLong(limit)(declaration),
    [makeKey('too_long'), { declaration, limit }]
  )

  expectationKeyTest('nameWasChanged', nameWasChanged(intlMock)(declaration),
    [makeKey('name_was_changed'), { declaration }]
  )


  function makeKey(expectationName) { return `model.spects.${expectationName}` }

  function expectationKeyTest(expectationName, edl, ...expectedIds) {
    test(`ID for ${expectationName}`, function (assert) {
      const fullId = mulang
        .astCode(rawSequence([]))
        .customExpect(edl)
        .map(([name]) => parseExpect(name))

      assert.deepEqual(fullId, expectedIds)
    })
  }

})