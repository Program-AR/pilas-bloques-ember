VERSION=0.1.6

# Colores
N=[0m
V=[01;32m
A=[01;33m


all:
	@echo ""
	@echo "Comandos disponibles"
	@echo ""
	@echo "  $(A)De uso para desarrollo: $(N)"
	@echo ""
	@echo "    $(V)bajar_dependencias$(N)"
	@echo "    $(V)actualizar$(N)  Actualiza el repositorio, pilas-engine y blockly."
	@echo ""
	@echo "    $(V)server$(N)      Prueba la aplicación en el navegador."
	@echo "    $(V)build$(N)       Genera los archivos compilados."
	@echo "    $(V)watch$(N)       Genera los archivos compilados de forma contínua."
	@echo ""
	@echo "    $(V)test_mac$(N)    Prueba la aplicación sobre OSX"
	@echo "    $(V)test_linux$(N)  Prueba la aplicación sobre GNU/Linux"
	@echo ""
	@echo "  $(A)Solo para publicar: $(N)"
	@echo ""
	@echo "    $(V)version$(N)     Genera la informacion de versión actualizada."
	@echo "    $(V)ver_sync$(N)    Sube la nueva version al servidor."
	@echo "    $(V)binarios$(N)    Genera las versiones compilada para Windows y OSX"
	@echo "    $(V)subir$(N)       Publica en dropbox los binarios generados"
	@echo ""

build:
	ember build

watch:
	ember build --watch

actualizar:
	git pull
	npm install
	bower install
	make actualizar_pilas
	make actualizar_blockly



bajar_dependencias:
	cd ..; git clone https://github.com/hugoruscitti/pilasweb.git
	cd ..; git clone https://github.com/sawady/blockly.git
	cd ..; git clone https://github.com/google/closure-library.git

actualizar_pilas:
	cd pilasweb; git pull; make build; cd ..
	rm -r -f public/libs/data
	cp -r -f pilasweb/public/data public/libs/data
	cp -r -f pilasweb/public/pilasweb.js public/libs/

actualizar_blockly:
	cd blockly; git pull; python build.py; cd ..
	make copiar_blockly_comprimido

copiar_blockly_comprimido:
	# CORE
	cp -f blockly/blockly_compressed.js public/libs/blockly/
	# BLOCKS
	cp -f blockly/blocks_compressed.js public/libs/blockly/
	# JS GENERATOR
	cp -f blockly/javascript_compressed.js public/libs/blockly/
	# MEDIA
	rm -r -f public/libs/blockly/media
	cp -r -f blockly/media public/libs/blockly/
	# LANG
	rm -r -f public/libs/blockly/msg
	cp -r -f blockly/msg  public/libs/blockly/

copiar_blockly_descomprimido:
	# CORE
	cp -f blockly/blockly_uncompressed.js public/libs/blockly/
	rm -r -f public/libs/blockly/core
	cp -r -f blockly/core public/libs/blockly/
	# BLOCKS
	rm -r -f public/libs/blockly/blocks
	cp -r -f blockly/blocks public/libs/blockly/blocks
	# JS GENERATOR
	rm -r -f public/libs/blockly/generators
	mkdir public/libs/blockly/generators
	cp -f blockly/generators/javascript.js public/libs/blockly/generators/
	cp -r -f blockly/generators/javascript public/libs/blockly/generators/
	# MEDIA
	rm -r -f public/libs/blockly/media
	cp -r -f blockly/media public/libs/blockly/
	# LANG
	rm -r -f public/libs/blockly/msg
	cp -r -f blockly/msg  public/libs/blockly/

test_mac: build
	@echo "Cuidado - se está usando la version de nodewebkit del sistema."
	make _a_desarrollo
	open -a /Applications/node-webkit.app --args /Users/hugoruscitti/proyectos/pilas-engine-bloques/dist

version:
	# patch || minor
	@bumpversion patch --current-version ${VERSION} package.json public/package.json  public/package.produccion.json public/package.desarrollo.json extras/instalador.nsi app/templates/application.hbs extras/distwin.py Makefile --list
	@echo "Es recomendable compilar, generar los tags y sube todo a github:"
	@echo ""
	@echo "make build"
	@echo "make ver_sync"

ver_sync:
	git tag '${VERSION}'
	make _changelog
	git commit -am 'release ${VERSION}'
	git push
	git push --all
	git push --tags

server:
	ember server

binarios: build
	make _a_produccion
	@grunt nodewebkit
	# osx
	hdiutil create distribuibles/pilas-engine-bloques/osx32/pilas-engine-bloques_0.1.6.dmg -srcfolder distribuibles/pilas-engine-bloques/osx32/pilas-engine-bloques.app -size 400mb
	rm -r -f distribuibles/0.1.6
	mkdir distribuibles/0.1.6
	cp distribuibles/pilas-engine-bloques/osx32/pilas-engine-bloques_0.1.6.dmg distribuibles/0.1.6
	# windows
	cp extras/instalador.nsi distribuibles/pilas-engine-bloques/win32/
	makensis distribuibles/pilas-engine-bloques/win32/instalador.nsi
	cp distribuibles/pilas-engine-bloques/win32/pilas-engine-bloques_0.1.6.exe distribuibles/0.1.6/
	make _a_desarrollo

subir:
	mv distribuibles/0.1.6 /Users/hugoruscitti/Dropbox/releases/pilas-engine-bloques/

_a_desarrollo:
	@echo "Pasando a desarrollo..."
	cp public/package.desarrollo.json public/package.json
	cp public/package.desarrollo.json dist/package.json

_a_produccion:
	@echo "Pasando a produccion..."
	cp public/package.produccion.json dist/package.json
	cp public/package.produccion.json public/package.json

_changelog:
	gitchangelog > CHANGELOG

.PHONY: dist
