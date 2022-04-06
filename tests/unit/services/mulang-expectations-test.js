import { module, test } from 'qunit'
import { entryPointType } from '../../../utils/blocks'
import { declaresAnyProcedure, doSomething, isUsed, isUsedFromMain, notTooLong, parseExpect, doesNotUseRecursion } from '../../../utils/expectations'
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

  expectationTestOk('doSomething', doSomething(declaration), [
    procedure(declaration, [],
      application(declaration)
    )
  ], 'Recursion should count as doing something')

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

  expectationTestFail('notTooLong', notTooLong(limit)(declaration), [
    procedure(declaration, [],
      application(declaration),
      application(declaration),
      application(declaration)
    )
  ], 'Recursive calls should count as being too long ')

  expectationTestOk('doesNotUseRecursion', doesNotUseRecursion(declaration), [
    procedure(declaration, [],
      application("PROCEDURE2")
    ),
    procedure("PROCEDURE2", [])
  ])

  // Direct recursion
  expectationTestFail('doesNotUseRecursion', doesNotUseRecursion(declaration), [
    procedure(declaration, [],
      application(declaration)
    )
  ])

  // Indirect recursion
  expectationTestFail('doesNotUseRecursion', doesNotUseRecursion(declaration), [
    procedure(declaration, [],
      application("PROCEDURE2")
    ),
    procedure("PROCEDURE2", [],
      application(declaration)
    )
  ], 'Indirect recursion should count as recursion')

  expectationTestFail('doesNotUseRecursion', doesNotUseRecursion(declaration), [
    procedure(declaration, [],
      application(declaration),
      application("PROCEDURE2")
    ),
    procedure("PROCEDURE2", [],
      application('PRIMITIVE'))
  ], 'Direct recursion with another procedure call should count as recursion')

  function expectationTestOk(expectationName, expectation, astNodes, testName) {
    expectationTest(expectationName, expectation, astNodes, true, testName)
  }

  function expectationTestFail(expectationName, expectation, astNodes, testName) {
    expectationTest(expectationName, expectation, astNodes, false, testName)
  }

  function expectationTest(expectationName, edl, astNodes, shouldPass, testName = '') {
    test(`Expectation ${expectationName} - ${testName || (shouldPass ? 'ok' : 'fail')}`, function (assert) {
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

  expectationKeyTest('doesNotUseRecursion', doesNotUseRecursion(declaration),
    [makeKey('does_not_use_recursion'), { declaration }]
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