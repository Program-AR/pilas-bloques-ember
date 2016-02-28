#!/usr/bin/python
import os
import console

console.success("Generando lista imagenes...")

imageNames = filter(lambda name: name.endswith('.png'), os.listdir(os.path.join('..', 'public','libs','data')))

jsContent = '//Autogenerado por scripts/generarListaImagenes.py. Todo cambio se sobreescribira. \n'
jsContent += 'export default ['

for name in imageNames:
	jsContent += '"' + name + '",\n'

jsContent += '];'

jsFile = open(os.path.join('..', 'app', 'components', 'listaImagenes.js' ), "w+")
jsFile.write(jsContent)
jsFile.close()