import React, { Component } from 'react';
import StepZilla from 'react-stepzilla';
import BasicConfiguration from './basicConfiguration';
import CreateLevel from './createLevel/createLevelWrapper';
import FinishCreation from './finishCreation';
import FinalStep from './finalStep';
import { Container, Col, Row } from "react-bootstrap";
import SelectLevelType from './selectLevelTypeWrapper';

import './wizard.css';
import BlockSelector from './blockSelector';
import InitialSolution from "./initialSolution/InitialSolution";

export default class Wizard extends Component {

  render() {
    const steps =
    [
      {name: 'Tipo de nivel', component: <SelectLevelType {...this.props} />},
      {name: 'Creador de nivel', component: <CreateLevel {...this.props} />},
      {name: 'Selector de bloques', component: <BlockSelector {...this.props} />},
      {name: 'Solucion Inicial', component: <InitialSolution {...this.props} />},
      {name: 'Configuración del nivel', component: <BasicConfiguration {...this.props} />},
      {name: 'Confirmacion', component: <FinalStep {...this.props} />},
      {name: 'Terminado', component: <FinishCreation {...this.props}/>},
    ];

    return (
      <Container fluid>
        <Row>
          <Col md={12}>
            <div className='wz'>
              <div className='step-progress'>
                <StepZilla
                  steps={steps}
                  nextButtonText= "Siguiente"
                  backButtonText= "Atrás"
                  prevBtnOnLastStep={false}
                  preventEnterSubmission={true}
                  nextTextOnFinalActionStep={"Guardar"}
                 />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    )
  }
}
