class Element {

  constructor(type, icon, positions) {
    this.type = type;
    this.icon = icon;
    this.positions = positions;
  }

  setInPosition(newPosition) {
    return new Element(this.type, this.icon, this.positions.concat(newPosition));
  }

  removeFromPosition(positionToRemove) {
    const newPositions = this.positions.filter(position => !position.equals(positionToRemove));
    return new Element(this.type, this.icon, newPositions)
  }

  isInPosition(position) {
    return this.positions.some(aPosition => aPosition.equals(position));
  }

}

export default Element;