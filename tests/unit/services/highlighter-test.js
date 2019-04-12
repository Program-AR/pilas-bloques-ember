import { moduleFor, test, only } from 'ember-qunit';


moduleFor('service:highlighter', 'Unit | Service | highlighter', { 
    needs: ['service:blocksGallery', 'service:blockly'],
    setup() {
        var highlighter = this.subject()
        let workspace = new Blockly.Workspace()
        workspace.highlightBlock = function() { } //Mocking (?)
        highlighter.workspace = workspace
        
        this.container.lookup('service:blocksGallery').start()
        highlighter.clear()
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

test('Should not highlight program block', function(assert) {
    var highlighter = this.subject()
    loadProgramAndSendSteps(highlighter, 1, linealProgram)
    assertHighlight(assert, highlighter, [])
});


test('On lineal program should highlight only current block', function(assert) {
    var highlighter = this.subject()
    loadProgramAndSendSteps(highlighter, 3, linealProgram)
    assertHighlight(assert, highlighter, ['MoverACasillaIzquierda'])
});


let repetitionProgram = `
<block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="269" y="15">
    <statement name="program">
    <block type="MoverACasillaArriba">
        <next>
        <block type="repetir">
            <value name="count">
            <block type="math_number">
                <field name="NUM">1</field>
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

test('Should highlight repetition block', function(assert) {
    var highlighter = this.subject()
    loadProgramAndSendSteps(highlighter, 3, repetitionProgram)
    assertHighlight(assert, highlighter, ['repetir'])
});

test('When enter on repetition block should only highlight current block', function(assert) {
    var highlighter = this.subject()
    loadProgramAndSendSteps(highlighter, 5, repetitionProgram)
    assertHighlight(assert, highlighter, ['MoverACasillaDerecha'])
});

test('When go out repetition block should only highlight next block', function(assert) {
    var highlighter = this.subject()
    loadProgramAndSendSteps(highlighter, 6, repetitionProgram)
    assertHighlight(assert, highlighter, ['MoverACasillaAbajo'])
});


function loadProgramAndSendSteps(highlighter, steps, blocksAsText) {
    let dom = Blockly.Xml.textToDom(blocksAsText)
    let mainBlock = Blockly.Xml.domToBlock(dom, highlighter.workspace)

    let ignoredBlockTypes = ["math_number"]

    //Esta ejecución solamente RECORRE los bloques. ¡No tiene en cuenta la lógica!
    function doStep(block) {
        if (steps == 0 || ignoredBlockTypes.includes(block.type)) return
        highlighter.step(block.id)
        steps--
        block.getChildren().forEach(doStep)
    }
    doStep(mainBlock)
}

//TODO: Config assert?
function assertHighlight(assert, highlighter, expectedTypes) {
    assertLength(assert, highlighter.blocks, expectedTypes.length)
    assertTypes(assert, highlighter.blocks, expectedTypes)
}

function assertTypes(assert, blocks, expectedTypes) {
    assert.deepEqual(blocks.map((it) => it.type), expectedTypes)
}

//TODO: Mover a un lugar más general
function assertLength(assert, list, count) {
    assert.deepEqual(list.length, count)
}