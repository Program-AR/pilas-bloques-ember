import {closedRangeFrom1} from "../utils/RangeUtils";
import Position from "../components/createLevel/model/Position";
import Character from "../components/createLevel/model/Character";
import Element from "../components/createLevel/model/Element";
import pbBlocks from "../components/initialSolution/pilas-bloques-blocks";
import 'blockly/blocks';
import toolboxBuilder from "../components/initialSolution/pbToolboxBuilder";

export default class PilasBloquesLevelEncoder {
  encode(levelToEncode) {
    const elementEncodings = [ // order matters!!
      {
        canHandle: element => element.type === 'character',
        char: 'A'
      },
      {
        canHandle: element => element.type === 'prize',
        char: 'P'
      },
      {
        canHandle: element => element.type === 'obstacle' && element.icon.includes('red.cross'),
        char: '-'
      },
      {
        canHandle: element => element.type === 'obstacle',
        char: 'O'
      },
      {
        canHandle: element => true, // default handler
        char: '-'
      }
    ];
    const encodeElement = element => (element && elementEncodings.find(it => it.canHandle(element)).char) || '-';

    const encodeGrid = grid => {
      const __toElement = it => {
        const positions = it.positions.map(({ row, column }) => new Position(row, column));
        return it.type === "character" ? new Character(it.icon, positions[0]) : new Element(it.type, it.icon, positions)
      };
      const gridElements = grid.elements.map(__toElement);

      const encodedRows = closedRangeFrom1(grid.rows).map(rowIndex => {
        const encodedRowElements = closedRangeFrom1(grid.columns).map(columnIndex => {
          const position = new Position(rowIndex, columnIndex);
          const elementToEncode = gridElements.find(element => element.isInPosition(position));
          return encodeElement(elementToEncode);
        }).join();
        return `[${encodedRowElements}]`;
      });

      return encodedRows.join();
    };
    const categories = levelToEncode.categoriesPermitted;
    pbBlocks.make();
    const bloques = toolboxBuilder.bloquesPermitidos(pbBlocks.types(),categories).map(bloque => bloque.bloque);

    //const bloques = levelToEncode.scene.blocks;

    const encodedGrids = `"${encodeGrid(levelToEncode.grids[0])}"`;

    return {
      titulo: levelToEncode.name,
      enunciado: levelToEncode.category,
      consignaInicial: levelToEncode.advice,
      bloques,
      solucionInicial: levelToEncode.initialSolutionXML,
      escena: `new Escena${capitalizeFirstLetter(levelToEncode.scene.type)}(${encodedGrids})`,
      estiloToolbox: 'sinCategorias',
      debeFelicitarse: true
    };
  }
}

const capitalizeFirstLetter = string => string.charAt(0).toUpperCase() + string.slice(1);