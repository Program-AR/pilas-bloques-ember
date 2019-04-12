import { moduleFor, test } from 'ember-qunit';


moduleFor('service:highlighter', 'Unit | Service | highlighter', { 
    needs: ['service:blocksGallery', 'service:blockly'],
    setup() {
        this.container.lookup('service:blocksGallery').start()
    }
});

let linealProgram = `
<block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="269" y="15">
    <statement name="program">
    <block type="MoverACasillaDerecha">
        <next>
        <block type="MoverACasillaIzquierda">
            <next>
            <block type="MoverACasillaDerecha"></block>
            </next>
        </block>
        </next>
    </block>
    </statement>
</block>
`

let repetitionProgram = `
<block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="269" y="15">
    <statement name="program">
    <block type="MoverACasillaArriba">
        <next>
        <block type="repetir">
            <value name="count">
            <block type="math_number">
                <field name="NUM">2</field>
            </block>
            </value>
            <statement name="block">
            <block type="MoverACasillaIzquierda">
                <next>
                <block type="MoverACasillaDerecha"></block>
                </next>
            </block>
            </statement>
            <next>
            <block type="MoverACasillaAbajo"></block>
            </next>
        </block>
        </next>
    </block>
    </statement>
</block>
`

test('Should not highlight the program block', function(assert) {
    var highlighter = this.subject()
    loadProgramAndSendSteps(highlighter, 1, linealProgram)
    assert.equal(0, highlighter.blocks.length)
});


test('On lineal program should highlight only the current block', function(assert) {
    var highlighter = this.subject()
    loadProgramAndSendSteps(highlighter, 3, linealProgram)
    assert.equal(1, highlighter.blocks.length)
    assert.deepEqual(['MoverACasillaIzquierda'], highlighter.blocks.map((it) => it.type))
});


function loadProgramAndSendSteps(highlighter, steps, blocksAsText) {
    let workspace = new Blockly.Workspace()
    workspace.highlightBlock = function() { } //Mocking (?)
    
    let dom = Blockly.Xml.textToDom(blocksAsText)
    let mainBlock = Blockly.Xml.domToBlock(dom, workspace)

    highlighter.workspace = workspace

    let currentBlock = mainBlock
    while (steps != 0) {
        highlighter.step(currentBlock.id)
        currentBlock = currentBlock.getNextBlock() || currentBlock.getChildren()[0]
        steps--
    }

}