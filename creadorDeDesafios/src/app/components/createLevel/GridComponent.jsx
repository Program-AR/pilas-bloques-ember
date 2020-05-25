import React from 'react';
import fetchAsset from "../../helpers/fetchAsset";
import styled from "styled-components";

export default ({ grid, onCellClicked = () => {} }) => <GridContainer>
  <GridCellOverlay numberOfColumns={grid.numberOfColumns} numberOfRows={grid.numberOfRows}>
    {grid.cells
      .map(position => {
        return <GridCell onClick={() => onCellClicked(position)}/>;
      })
    }
  </GridCellOverlay>
  <GridElementOverlay numberOfColumns={grid.numberOfColumns} numberOfRows={grid.numberOfRows}>
    {
      grid.positionedElements().flatMap(element => {
        return element.positions.map(position => {
          return <GridElement style={{
            gridRow: position.row, gridColumn: position.column,
            backgroundImage: `url(${fetchAsset(element.icon)})`
          }}/>;
        });
      })
    }
  </GridElementOverlay>
</GridContainer>;

const GridContainer = styled.div`
    position: relative;
    max-width: 40vw;
    max-height: 40vw;
    overflow: hidden;
    border: 12px solid #6D5720;
    border-radius: 12px;
    margin-bottom: 2%;
`;

const GridCellOverlay = styled.div`
    display: grid;
    grid-template-columns: repeat(${props => props.numberOfColumns},1fr);
    grid-template-rows: repeat(${props => props.numberOfRows},1fr);
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    place-items: center;
`;

const GridCell = styled.span`
    background: none;
    box-shadow: inset 2px 2px 0 rgba(255, 255, 255, 0.05), inset -2px -2px 0 #665235;
    width: 7vw;
    height: 7vw;
`;

const GridElementOverlay = styled(GridCellOverlay)`
    pointer-events: none;
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-size: cover;
    background-repeat: no-repeat;
`;

const GridElement = styled.div`
    position: relative;
    width: 7vw;
    height: 7vw;
    overflow: hidden;
    background-size: cover;
    background-repeat: no-repeat;
`;