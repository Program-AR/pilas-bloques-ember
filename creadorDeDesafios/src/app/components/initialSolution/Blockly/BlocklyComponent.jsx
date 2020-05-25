import React from 'react';
import './BlocklyComponent.css';

import Blockly from 'blockly/core';
import locale from 'blockly/msg/en';
import 'blockly/blocks';
import pbBlocks from "../pilas-bloques-blocks";
import toolboxBuilder from "../pbToolboxBuilder";

Blockly.setLocale(locale);

class BlocklyComponent extends React.Component {

    componentDidMount() {
        const {initialXml, children, categoriesPermitted,...rest} = this.props;
        pbBlocks.setIconsPath("node_modules/pilas-bloques-blocks/iconos");
        pbBlocks.make();

        this.primaryWorkspace = Blockly.inject(
            this.blocklyDiv,
            {
                toolbox: toolboxBuilder.toolboxXmlFromBlockTypes(pbBlocks.types(), true,categoriesPermitted),
                ...rest
            },
        );

        if (initialXml) {
            Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(initialXml), this.primaryWorkspace);
        }

        const wrapFunctions = ['getInverseScreenCTM', 'updateInverseScreenCTM', 'isVisible',
            'createDom', 'dispose', 'newBlock', 'resize', 'getCanvas', 'getBubbleCanvas',
            'getParentSvg', 'translate', 'getWidth', 'setVisible', 'render', 'highlightBlock',
            'paste', 'recordDeleteAreas', 'isDeleteArea', 'startDrag', 'moveDrag', 'isDragging',
            'isDraggable', 'getBlocksBoundingBox', 'cleanUp', 'updateToolbox', 'markFocused',
            'zoom', 'zoomCenter', 'zoomToFit', 'scrollCenter', 'centerOnBlock', 'setScale',
            'setResizesEnabled', 'clear', 'registerButtonCallback', 'getButtonCallback',
            'removeButtonCallback', 'registerToolboxCategoryCallback', 'getToolboxCategoryCallback',
            'removeToolboxCategoryCallback', 'getAudioManager'];
        wrapFunctions.forEach((fn) => {
            const workspace = this.primaryWorkspace;
            this[fn] = (...args) => {
                workspace[fn].apply(workspace, args);
            }
        })
    }

    get workspace() {
        return this.primaryWorkspace;
    }

    setXml(xml) {
        Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(xml), this.primaryWorkspace);
    }

    render() {
        const {children} = this.props;
        return <React.Fragment>
            <div ref={e => this.blocklyDiv = e} id="blocklyDiv"/>
            <xml xmlns="https://developers.google.com/blockly/xml" is="blockly" style={{display: 'none'}}>
                {children}
            </xml>
        </React.Fragment>;

    }
}

export default BlocklyComponent;
