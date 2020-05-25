import React, { Component } from 'react';
import {Container} from "react-bootstrap";
import "./finalStep.css"

export default class BasicConfiguration extends Component {
  isValidated() {
    this.props.onSave(this.props.level)
  }

  render() {
    return (
      <Container>
        <h1>Confirmación</h1>
        <br/>
        <div style={{"text-align": "center"}}>
        <h4>¿Estás seguro que deseás crear el nivel como lo definiste?</h4>
        <h4>Podés volver a cualquier paso para modificarlo</h4>
        </div>
      </Container>
    )
  }
}
