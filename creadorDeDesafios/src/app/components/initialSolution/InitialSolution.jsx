import React, {Component} from 'react';
import BlocklyComponent from './Blockly';
import { Container } from "react-bootstrap";
import Blockly from 'blockly/core';
import "./initialSolution.css";

export default class InitialSolution extends Component {

    state = {
        mostrarBlockly: true
    };

    render(){
        return this.renderBlockly();
    }

    renderBlockly() {
        let {categoriesPermitted,initialSolutionXML} = this.props.level;
        if(!initialSolutionXML  || initialSolutionXML === "") {
            initialSolutionXML =` <xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false">
    
    </block>
  </xml>`
        }
        if (this.state.mostrarBlockly)
            return <Container>
                <h1>Solución Inicial</h1>
                Elegi los bloques que formaran parte de la solución inicial del ejercicio
                <br />
                <br />
                <div className="blocklyParche">
                    <BlocklyComponent categoriesPermitted={categoriesPermitted} readOnly={false} move={{
                        scrollbars: true,
                        drag: true,
                        wheel: true
                    }} initialXml={initialSolutionXML}>

                    </BlocklyComponent>;
                </div>
            </Container>;
            else
                return <div/>
    }

    isValidated() {
        this.setState({mostrarBlockly: false});
        const blocklyDom = Blockly.Xml.workspaceToDom(Blockly.getMainWorkspace());
        const xml = Blockly.Xml.domToText(blocklyDom);
        this.props.onUpdateProps({initialSolutionXML: xml})
    }

}

