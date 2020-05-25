import {closedRangeFrom1} from "../../../utils/RangeUtils";
import {replace} from '../../../utils/CollectionUtils';
import Position from './Position';

class Grid {
  constructor(numberOfRows, numberOfColumns, elements) {
    this.numberOfRows = numberOfRows;
    this.numberOfColumns = numberOfColumns;
    this.cells = closedRangeFrom1(this.numberOfRows).flatMap(row => {
      return closedRangeFrom1(this.numberOfColumns).map(column => new Position(row, column));
    });
    this.elements = elements;
  }

  positionedElements() {
    return this.elements;
  }

  placeElementIfCellEmpty(element, position) {
    const cellIsEmpty = !this.positionedElements().some(element => element.isInPosition(position));

    const placeElement = (element, position) => {
      let elementWithNewPosition = element.setInPosition(position);
      let updatedElements = replace(this.positionedElements(), element, elementWithNewPosition);
      return this.copyWithElements(updatedElements);
    };

    return cellIsEmpty ?
      placeElement(element, position) :
      this;
  };

  clearCell(position) {
    const elementsOutOfPosition = this.positionedElements().map(element => element.removeFromPosition(position));
    return this.copyWithElements(elementsOutOfPosition);
  }

  copyWithElements(newElements) {
    return new Grid(this.numberOfRows, this.numberOfColumns, newElements);
  }
}

export default Grid;