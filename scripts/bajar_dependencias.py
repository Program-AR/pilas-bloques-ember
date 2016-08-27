#!/usr/bin/python
import os
import console

console.success("Bajando dependencias ...")

def clonar_repositorio(directorio, url):
    if os.path.exists(os.path.join('..', directorio)):
        console.log("  Evitando clonar %s porque ya existe." %(directorio))
        os.system('cd ..; git pull ')
    else:
        console.success("Clonando %s ..." %(directorio))
        os.system('git clone ' + url + " " + directorio)

clonar_repositorio('blockly', 'https://github.com/Program-AR/blockly.git')
clonar_repositorio('closure-library', 'https://github.com/google/closure-library.git')
