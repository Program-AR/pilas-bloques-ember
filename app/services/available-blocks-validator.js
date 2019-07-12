import Ember from 'ember';

/// Este service deshabilita los bloques que no estén disponibles para una actividad
export default Ember.Service.extend({
    
    globalAvailableBlocks: ["al_empezar_a_ejecutar", "numero"],
    procedureBlocks: ["procedure", "variable", "param"],

    disableNotAvailableBlocksInWorkspace(activityBlocks) {
        Blockly.getMainWorkspace()
        .getAllBlocks()
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