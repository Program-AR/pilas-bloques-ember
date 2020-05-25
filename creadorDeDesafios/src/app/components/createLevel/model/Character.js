class Character {

  constructor(icon, position) {
    this.positions = [position];
    this.icon = icon;
    this.type = 'character';
  }

  setInPosition(newPosition) {
    return new Character(this.icon, newPosition);
  }

  removeFromPosition(positionToRemove) {
    return this;
  }

  isInPosition(position) {
    return this.positions.some(aPosition => aPosition.equals(position));
  }

}

export default Character;