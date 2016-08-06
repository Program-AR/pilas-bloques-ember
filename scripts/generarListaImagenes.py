#!/usr/bin/python
import os
import console

console.success("Generando lista de imagenes ...")

current_path = os.path.dirname(os.path.realpath(__file__))
image_path = os.path.join(current_path, '..', 'public', 'libs', 'data')
output_path = os.path.join(current_path, '..', 'app', 'components', 'listaImagenes.js')

image_names = [x for x in os.listdir(image_path) if x.endswith('.png')]


content = [
	'// Autogenerado por scripts/generarListaImagenes.py',
	'// Todo cambio se sobreescribira.',
	'export default [',
]

for name in sorted(image_names):
	content.append('    "%s",' %(name))


content.append('];');

jsFile = open(output_path, "w+")
jsFile.write('\n'.join(content))
jsFile.close()

console.success("Se encontraron %d imagenes" %(len(image_names)))
