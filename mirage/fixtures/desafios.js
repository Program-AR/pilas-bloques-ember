export default [
  {
    id: 1,
    grupoId: 1,
    nombre: 'AlienTocaBoton',
    titulo: 'El alien toca el botón',
    enunciado: 'Ayudá a nuestro Alien a presionar el botón de su laboratorio. \n'+
               'Pistas: mirá las acciones disponibles. ¡Vas a tener que avanzar varias veces!',
    consignaInicial: 'Los bloques te permiten formar secuencias de acciones para resolver los desafíos que te proponemos en Pilas Bloques.',
    escena: 'AlienInicial',
    actividad: null   /* Se carga desde un hook en la ruta desafío. */
  },
  {
    id: 2,
    grupoId: 1,
    nombre: 'AlimentandoALosPeces',
    titulo: 'Alimentando a los peces',
    enunciado: 'Nuestro buzo debe alimentar con lombrices a los 7 peces que hay en esta escena. Buscá primero a las lombrices y luego pasá por cada pez alimentándolo. Pista: pensá en una estrategia de 3 partes.',
    consignaInicial: '',
    escena: 'AlimentandoALosPeces',
    actividad: null,
  }
];
