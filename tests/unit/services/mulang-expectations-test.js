import { module, test } from 'qunit'
import { entryPointType } from '../../../utils/blocks'
import { declaresAnyProcedure, doSomething, isUsed, isUsedFromMain, notTooLong, parseExpect, doesNotUseRecursion, stringify } from '../../../utils/expectations'
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
  /*
  // Indirect recursion
  expectationTestFail('doesNotUseRecursion', doesNotUseRecursion(declaration), [
    procedure(declaration, [],
      application("PROCEDURE2")  
    ),
    procedure("PROCEDURE2", [],
      application(declaration)
    )
  ])
  */

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
    assert.propEqual(parseExpect(stringifiedExpectationId), ['model.spects.expectation_id', { "": undefined }])
  })

  test('parseExpect with expectation name and one param', function (assert) {
    assert.propEqual(parseExpect(stringifiedExpectationOneOpt), ['model.spects.expectation_id', { declaration: declaration }])
  })

  test('parseExpect with expectation name and multiple params', function (assert) {
    assert.propEqual(parseExpect(stringifiedExpectationMultipleOpt), ['model.spects.expectation_id', { declaration: declaration, b: 'foo' }])
  })

})