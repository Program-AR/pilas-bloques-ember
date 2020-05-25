import PilasBloquesLevelEncoder from "./PilasBloquesLevelEncoder";

describe("PilasBloquesLevelEncoder", () => {

  const encoder = new PilasBloquesLevelEncoder();

  let grids = () => [];
  const levelToEncode = () => ({
    "scene": {
      "type": "duba",
      "background": "backgrounds/fondo.duba.png"
    },
    "name": "Nivel 1",
    "category": "Enunciado 1",
    "advice": "Consejo 1",
    "expectation": "Consigue todos los premios repartidos por el nivel",
    "columns": 4,
    "rows": 4,
    "initialSolutionXML": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"ApretarBoton\" id=\"Q4JJjh$kRpZ=faU=E{3N\" x=\"356\" y=\"77\"/></xml>",
    "grids": grids(),
  });
  const encodedLevel = (levelToEncode) => encoder.encode(levelToEncode);

  describe("given a level with the simplest grid", () => {

    beforeEach(() => {
      grids = () => [{
        "rows": 1,
        "columns": 1,
        "elements": [
          {
            "type": "character",
            "icon": "characters/Duba.png",
            "positions": [
              {
                "row": 1,
                "column": 1
              }
            ]
          }
        ]
      }];
    });

    test('includes its title', () => {
      expect(encodedLevel(levelToEncode()).titulo).toBe("Nivel 1");
    });

    test('includes its enunciado', () => {
      expect(encodedLevel(levelToEncode()).enunciado).toBe("Enunciado 1");
    });

    test('may include an advice', () => {
      expect(encodedLevel(levelToEncode()).consignaInicial).toBe("Consejo 1");
    });

    test('may include an initial solution', () => {
      const initialSolution = "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"ApretarBoton\" id=\"Q4JJjh$kRpZ=faU=E{3N\" x=\"356\" y=\"77\"/></xml>";
      expect(encodedLevel(levelToEncode()).solucionInicial).toBe(initialSolution);
    });

    test('includes an scene', () => {
      expect(encodedLevel(levelToEncode()).escena).toBe(`new EscenaDuba("[A]")`);
    });

    test(`always includes a flag to congratulate the user`, () => {
      expect(encodedLevel(levelToEncode()).debeFelicitarse).toBeTruthy();
    });

    test('includes the blocks available for the level', () => {
      //TODO
    });

    test('includes the default block layout', () => {
      expect(encodedLevel(levelToEncode()).estiloToolbox).toBe("sinCategorias");
    });
  });

  describe('given a grid with no elements', () => {
    beforeEach(() => {
      grids = () => [{
        "rows": 2,
        "columns": 2,
        "elements": []
      }];
    });

    test(`replaces the empty positions with '-'`, () => {
      expect(encodedLevel(levelToEncode()).escena).toBe(`new EscenaDuba("[-,-],[-,-]")`);
    });
  });

  describe('given a grid with an actor', () => {

    beforeEach(() => {
      grids = () => [{
        "rows": 2,
        "columns": 2,
        "elements": [
          {
            "type": "character",
            "icon": "characters/Duba.png",
            "positions": [
              {
                "row": 1,
                "column": 1
              }
            ]
          }
        ]
      }];
    });

    test(`replaces the actor with 'A'`, () => {
      expect(encodedLevel(levelToEncode()).escena).toBe(`new EscenaDuba("[A,-],[-,-]")`);
    });

  });

  describe('given a grid with obstacles', () => {

    beforeEach(() => {
      grids = () => [{
        "rows": 2,
        "columns": 2,
        "elements": [
          {
            "type": "obstacle",
            "icon": "obstacles/obstaculo.piedra.png",
            "positions": [
              {
                "row": 1,
                "column": 2
              },
              {
                "row": 2,
                "column": 1
              }
            ]
          }
        ]
      }];
    });

    test(`replaces the obstacle with 'O'`, () => {
      expect(encodedLevel(levelToEncode()).escena).toBe(`new EscenaDuba("[-,O],[O,-]")`);
    });

  });

  describe('given a grid with blanks', () => {

    beforeEach(() => {
      grids = () => [{
        "rows": 2,
        "columns": 2,
        "elements": [
          {
            "type": "obstacle",
            "icon": "obstacles/red.cross.png",
            "positions": [
              {
                "row": 1,
                "column": 1
              }
            ]
          }
        ]
      }];
    });

    test(`replaces the blank with '-'`, () => {//TODO chequar con Alf si se puede ocultar celdas en niveles del primer ciclo
      expect(encodedLevel(levelToEncode()).escena).toBe(`new EscenaDuba("[-,-],[-,-]")`);
    });

  });

  describe('given a grid with prizes', () => {

    beforeEach(() => {
      grids = () => [{
        "rows": 2,
        "columns": 2,
        "elements": [
          {
            "type": "prize",
            "icon": "prizes/churrasco.png",
            "positions": [
              {
                "row": 2,
                "column": 1
              }
            ]
          }
        ]
      }];
    });

    test(`replaces the prize with 'P'`, () => {
      expect(encodedLevel(levelToEncode()).escena).toBe(`new EscenaDuba("[-,-],[P,-]")`);
    });

  });

  //TODO otros premios y múltiples grillas

});

const grids = [{
  "rows": 2,
  "columns": 2,
  "elements": [
    {
      "type": "character",
      "icon": "characters/Duba.png",
      "positions": [
        {
          "row": 1,
          "column": 1
        }
      ]
    },
    {
      "type": "prize",
      "icon": "prizes/churrasco.png",
      "positions": [
        {
          "row": 2,
          "column": 1
        }
      ]
    },
    {
      "type": "obstacle",
      "icon": "obstacles/obstaculo.piedra.png",
      "positions": [
        {
          "row": 1,
          "column": 2
        }
      ]
    },
    {
      "type": "obstacle",
      "icon": "obstacles/red.cross.png",
      "positions": [
        {
          "row": 2,
          "column": 2
        }
      ]
    }
  ]
}];