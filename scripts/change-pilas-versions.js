const pilasweb = require('pilasweb/package.json');
const pilasBloquesExercises = require('pilas-bloques-exercises/package.json');
const shell = require('shelljs');

function changeVersion(dependency, version){
  const regex = new RegExp(`${dependency}.js\\?v=[0-9]*.[0-9]*.[0-9]*`)
  const replacement = `${dependency}.js?v=${version}`
  shell.sed('-i', regex, replacement, 'public/pilas.html')
}

console.log('Changing pilasweb in pilas.html')
changeVersion('pilasweb', pilasweb.version)
console.log('Changing pilas-bloques-exercises in pilas.html')
changeVersion('pilas-bloques-exercises', pilasBloquesExercises.version)