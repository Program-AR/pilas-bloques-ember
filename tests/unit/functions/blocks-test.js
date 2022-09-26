import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit';
import { setUpTestWorkspace } from '../../helpers/utils';
import { usesControlStructure, nestsControlStructures } from '../../../utils/blocks';

module('Unit | Functions | blocks', function (hooks) {


    setupTest(hooks)
    setUpTestWorkspace(hooks)

    function xmlToBlock(xml) {
        const dom = Blockly.Xml.textToDom(xml)
        return Blockly.Xml.domToBlock(dom, Blockly.mainWorkspace)
    }

    test('usesControlStructure is false when control structures are not being used', function (assert) {

        const xml = `<block type=\"procedures_defnoreturn\" x=\"-5\" y=\"128\">
        <field name=\"NAME\">Hacer algo</field>
        <statement name=\"STACK\">
          <block type=\"MoverACasillaDerecha\">
            <next>
              <block type=\"ComerNaranja\"></block>
            </next>
          </block>
        </statement>
      </block>`

        assert.notOk(usesControlStructure(xmlToBlock(xml)))
    })

    test('usesControlStructure is false when procedure call definition does not exist', function (assert) {

        const xml = `<block type=\"procedures_callnoreturn\">
            <mutation name=\"comer naranja\"></mutation>
        </block>`

        assert.notOk(usesControlStructure(xmlToBlock(xml)))
    })

    test('Block uses control structure - alternative block', function (assert) {
        const xml = `<block type=\"procedures_defnoreturn\" x=\"6\" y=\"110\">
        <field name=\"NAME\">Hacer algo</field>
        <statement name=\"STACK\">
          <block type=\"Si\">
            <value name=\"condition\">
              <shadow type=\"required_value\"></shadow>
              <block type=\"TocandoNaranja\"></block>
            </value>
            <statement name=\"block\">
              <shadow type=\"required_statement\"></shadow>
              <block type=\"ComerNaranja\"></block>
            </statement>
          </block>
        </statement>
      </block>`

        assert.ok(usesControlStructure(xmlToBlock(xml)))
    })

    test('Block uses control structure - repetition block', function (assert) {
        const xml = `<block type=\"procedures_defnoreturn\" x=\"-32\" y=\"135\">
        <field name=\"NAME\">Hacer algo</field>
        <statement name=\"STACK\">
          <block type=\"repetir\">
            <value name=\"count\">
              <shadow type=\"required_value\"></shadow>
              <block type=\"math_number\">
                <field name=\"NUM\">1</field>
              </block>
            </value>
            <statement name=\"block\">
              <shadow type=\"required_statement\"></shadow>
              <block type=\"MoverACasillaDerecha\"></block>
            </statement>
          </block>
        </statement>
      </block>`

        assert.ok(usesControlStructure(xmlToBlock(xml)))
    })

    test('Direct nesting of control structures', function (assert) {
        const xml = `<block type=\"procedures_defnoreturn\" x=\"17\" y=\"92\">
        <field name=\"NAME\">Hacer algo</field>
        <statement name=\"STACK\">
          <block type=\"MoverACasillaDerecha\">
            <next>
              <block type=\"repetir\">
                <value name=\"count\">
                  <shadow type=\"required_value\"></shadow>
                  <block type=\"math_number\">
                    <field name=\"NUM\">1</field>
                  </block>
                </value>
                <statement name=\"block\">
                  <shadow type=\"required_statement\"></shadow>
                  <block type=\"Si\">
                    <value name=\"condition\">
                      <shadow type=\"required_value\"></shadow>
                      <block type=\"TocandoNaranja\"></block>
                    </value>
                    <statement name=\"block\">
                      <shadow type=\"required_statement\"></shadow>
                      <block type=\"ComerNaranja\"></block>
                    </statement>
                  </block>
                </statement>
              </block>
            </next>
          </block>
        </statement>
      </block>`

        assert.ok(nestsControlStructures(xmlToBlock(xml)))

    })

    test('Indirect nesting of control structures', function (assert) {
        const nestingProcedure = `<block type=\"procedures_defnoreturn\" x=\"241\" y=\"109\">
        <field name=\"NAME\">Hacer algo2</field>
        <statement name=\"STACK\">
          <block type=\"MoverACasillaDerecha\">
            <next>
              <block type=\"repetir\">
                <value name=\"count\">
                  <shadow type=\"required_value\"></shadow>
                  <block type=\"math_number\">
                    <field name=\"NUM\">1</field>
                  </block>
                </value>
                <statement name=\"block\">
                  <shadow type=\"required_statement\"></shadow>
                  <block type=\"procedures_callnoreturn\">
                    <mutation name=\"Hacer algo\"></mutation>
                  </block>
                </statement>
              </block>
            </next>
          </block>
        </statement>
      </block>`

        const nestedProcedure = `<block type=\"procedures_defnoreturn\" x=\"-7\" y=\"117\">
        <field name=\"NAME\">Hacer algo</field>
        <statement name=\"STACK\">
          <block type=\"repetir\">
            <value name=\"count\">
              <shadow type=\"required_value\"></shadow>
              <block type=\"math_number\">
                <field name=\"NUM\">1</field>
              </block>
            </value>
            <statement name=\"block\">
              <shadow type=\"required_statement\"></shadow>
              <block type=\"MoverACasillaDerecha\"></block>
            </statement>
          </block>
        </statement>
      </block>`

        xmlToBlock(nestedProcedure)

        assert.ok(nestsControlStructures(xmlToBlock(nestingProcedure)))
    })

    test('Procedure does not nest control structures when is not nesting directly or indirectly', function (assert) {
        const nestedProcedure = `<block type=\"procedures_defnoreturn\" x=\"310\" y=\"97\">
        <field name=\"NAME\">Hacer algo2</field>
        <statement name=\"STACK\">
          <block type=\"MoverACasillaDerecha\"></block>
        </statement>
      </block>`

        const mainProcedure = `<block type=\"procedures_defnoreturn\" x=\"4\" y=\"96\">
        <field name=\"NAME\">Hacer algo</field>
        <statement name=\"STACK\">
            <block type=\"Si\">
            <value name=\"condition\">
                <shadow type=\"required_value\"></shadow>
                <block type=\"TocandoNaranja\"></block>
            </value>
            <statement name=\"block\">
                <shadow type=\"required_statement\"></shadow>
                <block type=\"MoverACasillaDerecha\">
                <next>
                    <block type=\"procedures_callnoreturn\">
                    <mutation name=\"Hacer algo2\"></mutation>
                    </block>
                </next>
                </block>
            </statement>
            </block>
        </statement>
        </block>`

        xmlToBlock(nestedProcedure)

        assert.notOk(nestsControlStructures(xmlToBlock(mainProcedure)))
    })




})
