class Eraser {

  constructor() {
    this.type = 'eraser';
    this.icon = 'eraser.png';
  }

  clickOn(grid, position) {
    return grid.clearCell(position);
  }

}

export default Eraser;