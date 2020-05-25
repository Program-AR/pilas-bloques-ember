import React, { useState } from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import { replace } from '../../utils/CollectionUtils';
import fetchAsset from '../../helpers/fetchAsset';
import Grid from './model/Grid';
import Scene from './model/Scene';
import Eraser from './model/Eraser';
import ElementSelector from './model/ElementSelector';
import Element from './model/Element';
import Character from './model/Character';
import Position from './model/Position';
import GridComponent from "./GridComponent";
import {PrimaryActionButton} from "../common/PrimaryActionButton";

const Container = styled.div`
    width: 100%;
    margin: auto;
    display: flex;
    align-items: flex-start;
`;

const Palette = styled.div`
    position: relative;
    overflow: hidden;
    border: 12px solid #6D5720;
    border-radius: 12px;
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: repeat(${props => props.selectorAmount},1fr);
    place-items: center;
    margin-right: 2vw;
`;

const PaletteElement = styled.span`
    box-shadow: inset 2px 2px 0 rgba(255, 255, 255, 0.05), inset -2px -2px 0 #665235;
    background-image: url(${props => props.icon});
    ${props => props.isSelected ? 'background-color:blanchedalmond' : ''}
    background-size: cover;
    background-repeat: no-repeat;
    overflow: hidden;
    width: 7vw;
    height: 7vw;
`;

const GridsContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const SecondaryActionButton = styled(PrimaryActionButton)`
    color: #007bff;
    background-color: #fff;
    border-color: #fff;
`;

export default props => {
  const { onUpdateProps, level: { scene: { type }, rows, columns, grids: existingGrids } } = props;
  const { DubaScene, LitaScene, TitoScene } = Scene;
  const { character, prizes, obstacle } = _.find([DubaScene, LitaScene, TitoScene], { type });

  const noCell = new Element('obstacle', 'obstacles/red.cross.png', []);
  const gridElements = [character, prizes, obstacle, noCell]
    .flat();
  const palette = gridElements.map(element => new ElementSelector(element))
    .concat(new Eraser());
  const initialGrid = new Grid(rows, columns, gridElements);

  const __toElement = it => {
    const positions = it.positions.map(({ row, column }) => new Position(row, column));
    return it.type === "character" ? new Character(it.icon, positions[0]) : new Element(it.type, it.icon, positions)
  };

  const initialGrids = _.isEmpty(existingGrids) ?
    [initialGrid] :
    existingGrids.map(existingGrid => new Grid(existingGrid.rows, existingGrid.columns, existingGrid.elements.map(__toElement)));

  const [activeElement, setActiveElement] = useState(palette[0]);
  const [grids, setGrids] = useState(initialGrids);

  const saveGridsInLocalAndWizardState = (grids) => {
    setGrids(grids);
    const gridsData = grids.map(grid => ({rows, columns, elements: grid.positionedElements()}));
    onUpdateProps({grids: gridsData});
  };

  const placeElementInGrid = (gridToModify, elementToPlace, position) => {
    const updatedGrid = elementToPlace.clickOn(gridToModify, position);
    const updatedGrids = replace(grids, gridToModify, updatedGrid);
    saveGridsInLocalAndWizardState(updatedGrids);
  };
  const addGrid = () => {
    saveGridsInLocalAndWizardState(grids.concat(initialGrid));
  };
  const removeGrid = gridToRemove => {
    const updatedGrids = grids.filter(grid => grid !== gridToRemove);
    saveGridsInLocalAndWizardState(updatedGrids);
  };

  return (
    <div>
      <div><h1>Distribución de la grilla</h1>
      Elegí cómo estarán dispuestos los elementos en el nivel. Podés agregar varias grillas para introducir aleatoriedad en el nivel.
      <br/>
      <br/>
    </div>
    <Container>
      <Palette selectorAmount={palette.size}>
        {
          palette.map(elementSelector => {
            const elementType = elementSelector.type;
            return <PaletteElement id={`${elementType}Selector`}
                                   icon={fetchAsset(elementSelector.icon)}
                                   isSelected={_.isEqual(elementSelector, activeElement)}
                                   onClick={() => setActiveElement(elementSelector)}/>;
          })
        }
      </Palette>
      <GridsContainer>
        {
          grids.map(grid => (
            <div>
              <GridComponent grid={grid} onCellClicked={(position) => placeElementInGrid(grid, activeElement, position)}/>
              <SecondaryActionButton onClick={() => removeGrid(grid)}>Eliminar grilla</SecondaryActionButton>
            </div>
          ))
        }
      </GridsContainer>
      <PrimaryActionButton onClick={() => addGrid()}>Agregar grilla</PrimaryActionButton>
    </Container>
    </div>
  );
};