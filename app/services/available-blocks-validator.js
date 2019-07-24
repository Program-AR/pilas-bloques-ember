import Ember from 'ember';

/// Este service deshabilita los bloques que no estén disponibles para una actividad
export default Ember.Service.extend({
    
    globalAvailableBlocks: ["al_empezar_a_ejecutar", "numero"],
    procedureBlocks: ["procedures_defnoreturn", "procedures_callnoreturn", "variables_get", "param_get"],

    disableNotAvailableBlocksInWorkspace(activityBlocks) {
        Blockly.getMainWorkspace()
        .getAllBlocks()
        .filter(block => !this._isAvailable(block, activityBlocks))
        .forEach(block => this._disable(block))
    },

    _isAvailable(block, activityBlocks) {
        if (this._match(this.globalAvailableBlocks, block)) return true;
        
        let activityAvailableBlocks = activityBlocks.map(name => name.toLowerCase())
        
        if (this._match(this.procedureBlocks, block))
            return activityAvailableBlocks.includes("procedimiento")

        return this._match(activityAvailableBlocks, block)
    },

    _match(availableBlocks, currentBlock) {
        let aliases = currentBlock.aliases || []
        return  availableBlocks.includes(currentBlock.type.toLowerCase())
        ||      aliases.some(alias => availableBlocks.includes(alias.toLowerCase()))
    },

    _disable(block) {
        block.setDisabled(true)
        block.setWarningText("Este bloque no está disponible en esta actividad.")
    },


})