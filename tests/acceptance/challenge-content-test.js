import { module, test } from 'qunit'
import { awaitChallengeLoading, setupPBAcceptanceTest, safeVisit } from "../helpers/utils"

module('Acceptance | challenge content internationalization test', function (hooks) {
  setupPBAcceptanceTest(hooks)

  test(`Markdown text gets formatted`, async function (assert) {
    await safeVisit(`/desafio/1`)
    await awaitChallengeLoading()
    const italicText = $("em").text().trim()
    assert.equal(italicText, 'primitivas')
  })

  /*
   * Validates after all promises finish.
   * Checks title, description and clue of the challenge are translated.
   */

  function testCanVisit(challengeId, expectedTitle, expectedescription, expectedClue) {
    test(`Challenge ${challengeId} is internationalized`, async function (assert) {
      await safeVisit(`/desafio/${challengeId}`)
      await awaitChallengeLoading()

      const challengeTitle = $(".challenge-title").text().trim()
      assert.equal(challengeTitle, expectedTitle)
      assert.dom("[data-test-challenge-description]").matchesText(expectedescription)
      assert.dom("[data-test-challenge-clue]").matchesText(expectedClue)
    })
  }

  // Second book challenge:
  testCanVisit(1,
    'El alien toca el botón',
    'Ayudá a nuestro Alien a presionar el botón de su laboratorio. Pistas: mirá las primitivas disponibles. ¡Vas a tener que avanzar varias veces! 😉',
    'Los bloques te permiten formar secuencias de acciones para resolver los desafíos que te proponemos en Pilas Bloques.')

  // Conditional Alternative:
  // Because markdown is being used, the clue of this challenge uses the caracter '…', which is different from '...' (three dot characters).
  testCanVisit(13,
    'El mono y las bananas',
    '¿Podés hacer que el mono avance al casillero de enfrente? Si hay una banana debe comérsela. Si no, es feliz con sólo llegar. Ejecutá el programa varias veces para asegurarte que siempre funciona. Pista: mirá la categoría \"Sensores\" y la categoría \"Alternativas\".',
    'El bloque \"Si… Entonces\" ejecuta una secuencia de instrucciones solamente cuando la condición es verdadera. Esto se llama \"alternativa condicional\".')

  // Challenge with no clues:
  testCanVisit(15,
    'Laberinto corto',
    'Guiá al ratón para llegar a la meta. Para lograrlo, debe avanzar una casilla en la dirección que indica la flecha. Pista: mirá en la categoría \"Sensores\" qué preguntas podés hacer.',
    '')

  // First book challenge:
  testCanVisit(230,
    'Desafío 1',
    '¿Puede la puma llegar al churrasco usando solo una vez el bloque mover?',
    'Podés usar el nuevo bloque "Repetir"')

})
