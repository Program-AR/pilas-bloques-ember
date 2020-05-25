import React, { useState } from 'react';
import Wizard from '../components/wizard';
import downloadLevel from '../helpers/downloadLevel';
import {Categories} from "../components/initialSolution/pilas-bloques-blocks";

const DEFAULT_LEVEL = {
  name: "",
  category: "",
  advice: "",
  columns: 3,
  rows: 3,
  initialSolutionXML: "",
  categoriesPermitted: Categories.map((category) => category.name),
  scene: {
    type: "duba"
  },
  grids: [],
  expectation: ""
};

const WizardContainer  = () => {
  const [state, setState] = useState({ level: DEFAULT_LEVEL });
  const onUpdateLevel = (updatedLevel) => {
    setState({ level: { ...(state.level), ...updatedLevel } });
  };
  return (<Wizard {...state} onSave={downloadLevel} onUpdateProps={onUpdateLevel}/>);
};

export default WizardContainer;
