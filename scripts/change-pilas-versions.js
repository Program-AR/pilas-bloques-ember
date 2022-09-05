const pilasweb = require('pilasweb/package.json');
const pilasBloquesExercises = require('pilas-bloques-exercises/package.json');
const shell = require('shelljs');

function changeVersion(dependency, version){
  console.log(`Changing ${dependency} version in pilas.html`)
  const regex = new RegExp(`${dependency}.js\\?v=[0-9]*.[0-9]*.[0-9]*`)
  const replacement = `${dependency}.js?v=${version}`
  shell.sed('-i', regex, replacement, 'public/pilas.html')
}

changeVersion('pilasweb', pilasweb.version)
changeVersion('pilas-bloques-exercises', pilasBloquesExercises.version)