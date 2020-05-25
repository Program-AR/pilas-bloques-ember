export default class ElementSelector {
  constructor(element) {
    this.type = element.type;
    this.icon = element.icon;
  }

  clickOn(grid, position) {
    const elementToPlace = grid.elements.find(elem => elem.type === this.type && elem.icon === this.icon);
    return grid.placeElementIfCellEmpty(elementToPlace, position);
  }
}