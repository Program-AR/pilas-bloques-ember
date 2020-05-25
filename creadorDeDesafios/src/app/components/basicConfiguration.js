import _ from "lodash";
import React, { Component } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import "./basicConfiguration.css";

export default class BasicConfiguration extends Component {
  constructor(props) {
    super(props);
    this.isValidated = this.isValidated.bind(this);
  }

  isValidated() {
    const userInput = this._grabUserInput();
    this.props.onUpdateProps(userInput);
    return !_.some([userInput.name, userInput.category], _.isEmpty);
  }

  _grabUserInput() {
    return {
      name: this.refs.name.value,
      category: this.refs.category.value,
      advice: this.refs.advice.value
    };
  }

  render() {
    return (
      <Container>
      <div className="step step3">
        <div className="row">
          <form id="Form" className="form-horizontal">
            <div className="form-group">
              <label className="col-md-12 control-label">
                <h1>Configuración del Nivel - Enunciado</h1>
                Ingresá los datos basicos del nivel
              </label>
            </div>
            {this._showInput("name", { rows: 1 })}
            {this._showInput("category")}
            {this._showInput("advice")}
          </form>
        </div>
      </div>
      </Container>
    )
  }

  _showInput(name, { rows = 3} = {}) {
    const { showableName, value, required } = this._inputProps(name);
    return <div className="form-group col-md-12 content form-block-holder">
              <label className="control-label col-md-4">
              <Row>
                <Col md={6}>{showableName}</Col>
                <Col md={6}>
                  { required && (value.length > 0 || <span className='error'>{"*Obligatorio"}</span>)}
                </Col>
              </Row>
              </label>
              <div className="col-md-8 ">
                  <textarea
                    rows={rows}
                    ref={name}
                    className="form-control"
                    placeholder={showableName}
                    defaultValue={value}
                  />
              </div>
            </div>
  }

  _inputProps(prop) {
    const { name, category, advice } = this.props.level;
    const inputs = {
      name: { showableName: "Título", value: name, required: true },
      category: { showableName: "Enunciado", value: category, required: true },
      advice: { showableName: "Consejo", value: advice },
    }
    return inputs[prop];
  }

}
