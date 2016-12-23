#!/usr/bin/python
import os
import console

console.success("Generando lista de imagenes ...")

current_path = os.path.dirname(os.path.realpath(__file__))
image_path = os.path.join(current_path, '..', 'public', 'libs', 'data')
actores_path = os.path.join(current_path, image_path, 'actores')
fondos_path = os.path.join(current_path, image_path, 'fondos')
casillas_path = os.path.join(current_path, image_path, 'casillas')
iconos_path = os.path.join(current_path, image_path, 'iconos')
output_path = os.path.join(current_path, '..', 'app', 'components', 'listaImagenes.js')

# image_names = [x for x in os.listdir(image_path) if x.endswith('.png')]
actores_names = [x for x in os.listdir(actores_path) if x.endswith('.png')]
fondos_names = [x for x in os.listdir(fondos_path) if x.endswith('.png')]
casillas_names = [x for x in os.listdir(casillas_path) if x.endswith('.png')]
iconos_names = [x for x in os.listdir(iconos_path) if x.endswith('.png')]


content = [
	'// Autogenerado por scripts/generarListaImagenes.py',
	'// Todo cambio se sobreescribira.',
	'export default [',
	'',
	'// Actores:',
	'',
]

#for name in sorted(image_names):
#	content.append('    "%s",' %(name))

for name in sorted(actores_names):
	content.append('    "actores/%s",' %(name))

content.append('// Fondos:')

for name in sorted(fondos_names):
	content.append('    "fondos/%s",' %(name))

content.append('// Casillas:')

for name in sorted(casillas_names):
	content.append('    "casillas/%s",' %(name))

content.append('// Iconos:')

for name in sorted(iconos_names):
	content.append('    "iconos/%s",' %(name))


content.append('];');

jsFile = open(output_path, "w+")
jsFile.write('\n'.join(content))
jsFile.close()

#console.success("Se encontraron %d imagenes" %(len(image_names)))
