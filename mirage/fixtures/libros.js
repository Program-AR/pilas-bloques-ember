/*jshint esversion: 6 */

export default [
  {
    id: 1,
    capituloIds: [1],
    // grupoIds: ['manual1cPrimaria3', 'manual1cPrimaria3.1.2', 'manual1cPrimaria3.1.3', 'manual1cPrimaria3.1.4', 'manual1cPrimaria3.2.2', 'manual1cPrimaria3.2.3', 'manual1cPrimaria3.I', 'manual1cPrimaria4', 'manual1cPrimaria4.1.3', 'manual1cPrimaria4.1.4', 'manual1cPrimaria4.2.3', 'manual1cPrimaria4.I', 'manual1cPrimaria5', 'manual1cPrimaria5.1.3', 'manual1cPrimaria5.1.4', 'manual1cPrimaria5.2.1', 'manual1cPrimaria5.I', 'manual1cPrimariaOtros'],
    nombre: 'primer-ciclo',
    titulo: 'Primer Ciclo',
    descripcion: 'Desafíos del manual para docentes "Ciencias de la Computación para el aula, 1° ciclo de primaria"',
    modoLecturaSimple: true, // modo de lectura para niños pequeños.
    desafiosCortos: true // significa que en un grupo/serie de desafíos, se deben hacer uno detrás del otro.
    // sirve particularmente para mostrar el título de la serie en el desafío.
    // ver pilas-editor.hbs
  },
  {
    id: 2,
    // grupoIds: [1, 2, 3, 4, 5],
    capituloIds: [],
    nombre: 'programar',
    titulo: 'Segundo Ciclo',
    descripcion: 'Desafíos del cuaderno para docentes "Actividades para aprender a Program.AR"  Para 2° ciclo de primaria en adelante.',
  },

  // Libro invisible, exclusivo para hacer capturas:
  {
    id: 'capturas1c',
    capituloIds: [],
    // grupoIds: ['manual1cPrimariaCsapturasCap3', 'manual1cPrimariaCapturasCap4', 'manual1cPrimariaCapturasCap5'],
    titulo: 'Primer ciclo para hacer capturas',
    modoLecturaSimple: true,
    desafiosCortos: true,
    oculto: true
  }
];
