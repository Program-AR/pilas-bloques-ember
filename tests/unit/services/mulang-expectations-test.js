import { module, test } from 'qunit'
import { entryPointType } from '../../../utils/blocks'
import { declaresAnyProcedure, doSomething, isUsed, isUsedFromMain, notTooLong, parseExpect, doesNotUseRecursion, stringify, expectationId, isCritical, doesNotUseRecursionId, newExpectation, countCallsWithin, nameWasChanged } from '../../../utils/expectations'
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
  
  const intlMock = { t: () => ({ string: 'Hacer algo' }) }

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

  expectationTestOk('countCallsWithin', newExpectation(`${countCallsWithin(declaration)} = 2`, 'counts', { declaration }), [
    procedure(declaration, [],
      application("PROCEDURE2"),
      application(declaration)
    ),
    procedure("PROCEDURE2", [])
  ], 'countCallsWithin includes recursive calls')

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

  const expectationName = 'model.spects.expectation_id'
  const stringifiedExpectationId = 'model.spects.expectation_id|'
  const stringifiedExpectationOneOpt =  'model.spects.expectation_id|declaration=PROCEDURE'
  const stringifiedExpectationMultipleOpt = 'model.spects.expectation_id|declaration=PROCEDURE;b=foo'

  // Utils
  // stringify is not meant to be used this way
  test('stringify with expectation id only', function (assert) {
    assert.equal(stringify('expectation_id', {}), stringifiedExpectationId)
  })

  test('stringify with one option', function (assert) {
    assert.equal(stringify('expectation_id', { declaration }), stringifiedExpectationOneOpt)
  })

  test('stringify with multiple options', function (assert) {
    assert.equal(stringify('expectation_id', { declaration, b: 'foo' }), stringifiedExpectationMultipleOpt)
  })

  // parseExpect is not meant to be used this way
  test('parseExpect with expectation name only', function (assert) {
    assert.propEqual(parseExpect(stringifiedExpectationId), [expectationName, { "": undefined }])
  })

  test('parseExpect with expectation name and one param', function (assert) {
    assert.propEqual(parseExpect(stringifiedExpectationOneOpt), [expectationName, { declaration: declaration }])
  })

  test('parseExpect with expectation name and multiple params', function (assert) {
    assert.propEqual(parseExpect(stringifiedExpectationMultipleOpt), [expectationName, { declaration: declaration, b: 'foo' }])
  })

  test('expectation id from name', function (assert) {
    assert.equal(expectationId(expectationName), 'expectation_id')
  })

  test('expectation id is critical', function (assert) {
    assert.ok(isCritical({ id: doesNotUseRecursionId }))
  })

  test('expectation id is not critical', function (assert) {
    assert.notOk(isCritical({ id: 'is_used' }))
  })

})