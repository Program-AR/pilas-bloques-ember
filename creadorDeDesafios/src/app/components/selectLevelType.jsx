import _ from 'lodash';
import React from 'react';
import Scene from './createLevel/model/Scene';
import { Col, Row } from "react-bootstrap";
import fetchAsset from '../helpers/fetchAsset';
import './selectLevelType.css';
import ReactTooltip from 'react-tooltip';

export default ({ level: { scene, rows, columns }, onUpdateProps }) => {
  const pickAllPrizesType = {
    scene: Scene.DubaScene,
    image: 'characters/Duba.png',
    description: 'Consigue todos los premios repartidos por el nivel',
    helper: '¡Ayuda a Duba a comer todos los churrascos!'
  };
  const pickPrizesInOrderType = {
    scene: Scene.LitaScene,
    image: 'characters/Lita.png',
    description: 'Recoge los premios en un orden determinado',
    helper: 'Para armar la ensalada, primero recogé los ingredientes, y después ponelos en la ensaladera'
  };
  const leavePrizesInStateType = {
    scene: Scene.TitoScene,
    image: 'characters/Tito.png',
    description: 'Deja todos los premios en un estado determinado',
    helper: '¡Tito tiene que encender todas las lamparitas!'
  };

  const levelTypes = [pickAllPrizesType, pickPrizesInOrderType, leavePrizesInStateType];

  const levelType = _(levelTypes).find({ scene: { type: scene.type } });

  const updateProp = value => {
    const state = { scene: levelType.scene, expectation: levelType.description, rows, columns, grids: [] };
    onUpdateProps(_.defaults(value, state))
  };

  return (
      <Row>
        <Col md={12}>
        <div>
          <h1>Tipo de nivel</h1>
          Elegí qué tipo de nivel querés crear y la configuración básica de la grilla
        </div>
        <br />
        <div class="form-group row">
            <label class="col-sm-1 col-form-label">Columnas: </label>
            <input className="form-control numberInput" type="number" min="1" max="5" value={columns} onChange={({target:{value}}) => updateProp({ columns: parseInt(value) })}/>
        </div>
        <div class="form-group row">
            <label class="col-sm-1 col-form-label" >Filas: </label>
            <input className="form-control numberInput" type="number" min="1" max="5" value={rows} onChange={({target:{value}}) => updateProp({ rows: parseInt(value) }) }/>
        </div>
            <div className="figContainer" style={{display: "flex"}}>
              {
                levelTypes.map(aLevelType => {
                    return (<figure className={levelType.image === aLevelType.image ? "imageClicked" : "image"} onClick={() => updateProp({ scene: aLevelType.scene })}>
                            <img src={fetchAsset(aLevelType.image)} alt=""/>
                            <div >
                                <figcaption>{aLevelType.description}</figcaption>
                                <div style={{'display':'flex','justify-content':'flex-end'}}>
                                <a data-tip data-for={aLevelType.helper}>
                                    <h6 style={{'text-decoration': 'underline','font-weight': 'bolder','width':'10%'}}>?</h6>
                                </a>
                                </div>
                            </div>
                            <ReactTooltip id={aLevelType.helper} type='info'>
                                <span>{aLevelType.helper}</span>
                            </ReactTooltip>

                        </figure>)

                    }
                )
              }
          </div>
        </Col>
      </Row>
  );
}