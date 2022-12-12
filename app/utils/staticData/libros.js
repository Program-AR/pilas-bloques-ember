/*jshint esversion: 6 */

export const libros = [
  {
    id: 1,
    capituloIds: ['Capítulo 3', 'Capítulo 4', 'Capítulo 5'],
    imagen: 'primer-ciclo.png',
    modoLecturaSimple: true // modo de lectura para niños pequeños.
  },
  {
    id: 2,
    capituloIds: ['Autómatas, comandos, procedimientos y repetición', 'Alternativa condicional', 'Repetición condicional', 'Sensores Numéricos', 'Parametrización de soluciones'],
    imagen: 'programar.png',
    modoLecturaSimple: false,
    expectations: {
      decomposition: true
    }
  },
  {
    id: 100,
    capituloIds: ['Tecnopolis 2021 Ejercicio Modelo', 'Tecnopolis 2021 Con Duba', 'Tecnopolis 2021 Con Lita', 'Tecnopolis 2021 Con Coty', 'Tecnopolis 2021 Con Toto'],
    imagen: 'tecnopolis.png',
    modoLecturaSimple: true
  },
];
