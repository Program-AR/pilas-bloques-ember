import React, { Component } from 'react';
import SelectLevelType from './selectLevelType';
import { isEmpty, get } from 'lodash';

export default class SelectLevelTypeWrapper extends Component {

  isValidated() {
    this.props.onUpdateProps(this.props.level);
    return !isEmpty(get(this.props,"level.scene"));
  }

  render() {
    return (
      <div className='container'>
        <SelectLevelType {...this.props}/>
      </div>
    )
  }
}
