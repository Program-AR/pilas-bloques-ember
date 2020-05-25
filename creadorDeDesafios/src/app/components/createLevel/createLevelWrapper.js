import React, { Component } from 'react';
import CreateLevel from './createLevel';

export default class CreateLevelWrapper extends Component {

  isValidated() {
    this.props.onUpdateProps({ grids: this.props.level.grids})
  }

  render() {
    return (
      <div className='container'>
        <CreateLevel {...this.props}/>
      </div>
    )
  }
}
