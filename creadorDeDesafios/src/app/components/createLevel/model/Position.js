class Position {

  constructor(row, column) {
    this.row = row;
    this.column = column;
  }

  equals({row, column}) {
    return this.row === row && this.column === column;
  }

}

export default Position;