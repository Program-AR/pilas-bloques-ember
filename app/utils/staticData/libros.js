/*jshint esversion: 6 */

export const libros = [
  {
    id: 1,
    capituloIds: ['Capítulo 3', 'Capítulo 4', 'Capítulo 5', 'Desafios complementarios'],
    imagen: 'primer-ciclo.png',
    modoLecturaSimple: true // modo de lectura para niños pequeños.
  },
  {
    id: 2,
    capituloIds: ['Autómatas, comandos, procedimientos y repetición', 'Alternativa condicional', 'Repetición condicional', 'Sensores Numéricos'],
    imagen: 'programar.png',
    modoLecturaSimple: false,
    expectations: {
      decomposition: true
    }
  },{
    id: 3,
    capituloIds: ['Parametrización de soluciones'],
    imagen: 'avanzado.png',
    modoLecturaSimple: false,
    expectations: {
      decomposition: true
    }

  }
];
