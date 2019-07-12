import Ember from 'ember';

/// Este service va recibiendo los Ids de los bloques que se ejecutan y SOLAMENTE se encarga del highlighting.
/// Particularmente, tiene la lógica de highligh para los procedimientos.
/// No sabe nada sobre qué hacen o cuándo se ejecutará cada bloque.
export default Ember.Service.extend({
    
    globalAvailableBlocks: ["al_empezar_a_ejecutar", "numero"],
    procedureBlocks: ["procedure", "variable", "param"],

    disableNotAvailableBlocks(blocks, activityBlocks) {
        if (blocks.length == 0) return;

        blocks
        .filter(block => !this._isAvailable(block, activityBlocks))
        .forEach(block => this._disable(block))
    },

    _isAvailable(block, activityBlocks) {
        let blockName = (block.alias || block.type).toLowerCase()

        if (this.globalAvailableBlocks.includes(blockName)) return true;

        let activityAvailableBlocks = activityBlocks.map(name => name.toLowerCase())
        
        if (this.procedureBlocks.some(it => blockName.includes(it)))
            return activityAvailableBlocks.includes("procedimiento")

        return activityAvailableBlocks.includes(blockName)
    },

    _disable(block) {
        block.setDisabled(true)
        block.setWarningText("Este bloque no está disponible en esta actividad.")
    },


})