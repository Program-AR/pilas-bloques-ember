import Character from './Character';
import Position from './Position';
import Element from './Element';

export default {

  DubaScene: {
    type: 'duba',
    character: new Character('characters/Duba.png', new Position(1, 1)),
    prizes: [new Element('prize', 'prizes/churrasco.png', [])],
    obstacle: new Element('obstacle', 'obstacles/obstaculo.piedra.png', []),
    blocks: [//TODO los bloques podrían depender de los premios y obstáculos de la escena
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco'
    ],
    background: 'backgrounds/fondo.duba.png'
  },

  LitaScene: {
    type: 'lita',
    character: new Character('characters/Lita.png', new Position(1, 1)),
    prizes: [
      new Element('prize', 'prizes/actor.tomate.png', []),
      new Element('prize', 'prizes/actor.lechuga.png', []),
      new Element('prize', 'prizes/actor.ensaladera.png', [])
    ],
    obstacle: new Element('obstacle', 'obstacles/obstaculo.lita1.png', []),
    blocks: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'AgarrarTomate',
      'AgarrarLechuga',
      'PrepararEnsalada'
    ],
    background: 'backgrounds/fondo.lita.png'
  },

  TitoScene: {
    type: 'tito',
    character: new Character('characters/Tito.png', new Position(1, 1)),
    prizes: [new Element('prize', 'prizes/icono.LamparitaApagada.png', [])],
    obstacle: new Element('obstacle', 'obstacles/obstaculo.piedra.png', []),
    blocks: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'EncenderLuz'
    ],
    background: 'backgrounds/fondo.duba.png' // TODO pendiente
  }

};