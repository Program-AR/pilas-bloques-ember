VERSION=$(shell scripts/obtenerVersion.sh)
NOMBRE="pilas-bloques"

N=[0m
G=[01;32m
Y=[01;33m
B=[01;34m
L=[01;30m

npm_config_loglevel="warn"

comandos:
	@echo ""
	@echo "${B}Comandos disponibles para ${G}pilas-bloques${N} - ${Y} versión ${VERSION}${N}"
	@echo ""
	@echo "  ${Y}Para desarrolladores${N}"
	@echo ""
	@echo "    ${G}iniciar${N}         Instala dependencias."
	@echo "    ${G}compilar${N}        Genera los archivos compilados."
	@echo "    ${G}compilar_live${N}   Compila de forma contínua."
	@echo "    ${G}compilar_web${N}    Genera la aplicación para la versión web (desde un iframe)."
	@echo "    ${G}test_travis${N}     Ejecuta las pruebas como esperamos en travis (en paralelo)."
	@echo ""
	@echo ""
	@echo "  ${Y}Para desarrolladores (avanzadas)${N}"
	@echo ""
	@echo "    ${G}bajar_dependencias${N}              Descarga las dependencias como blockly."
	@echo "    ${G}actualizar_blockly${N}              Actualiza blockly."
	@echo "    ${G}compilar_ejercicios_pilas${N}       Compilar los ejercicios de pilas."
	@echo "    ${G}copiar_blockly_comprimido${N}       Vincula blockly al proyecto."
	@echo "    ${G}copiar_blockly_descomprimido${N}    Vincula blockly al proyecto."
	@echo ""
	@echo "    ${L}El comando full es equivalente a realizar estos pasos en orden:${N}"
	@echo "${L}"
	@echo "       → iniciar → bajar_dependencias "
	@echo "       → actualizar_blockly → compilar_ejercicios_pilas"
	@echo "${N}"
	@echo ""
	@echo "  ${Y}Para distribuir${N}"
	@echo ""
	@echo "    ${G}version_patch${N}     Genera una versión (0.0.PATCH)."
	@echo "    ${G}version_minor${N}     Genera una versión (0.MINOR.0)."
	@echo "    ${G}version_major${N}     Genera una versión (MAJOR.0.0)."
	@echo ""
	@echo "    ${L}NOTA: toda versión genera un binario automáticamente en travis, ${N}"
	@echo "    ${L}      y solamente las versiones minor y major serán distribuidas${N}"
	@echo "    ${L}      oficialmente. Las versiones patch son internas o de prueba.${N}"
	@echo ""
	@echo "    ${G}binarios_electron${N}          Genera los binarios de forma local."
	@echo ""
	@echo ""
	@echo ""


iniciar: iniciar_ejercicios
	@echo "${G}instalando dependencias ...${N}"
	@npm install
	@bower install --allow-root

iniciar_ejercicios:
	@echo "${G}instalando dependencias de ejerciciosPilas...${N}"
	cd ejerciciosPilas; npm install


blockly/blocks_compressed.js: bajar_dependencias

bajar_dependencias:
	python scripts/bajar_dependencias.py

compilar_ejercicios_pilas:
	@cd ejerciciosPilas; echo "${G}Compilando ejerciciosPilas${N}"; grunt; cd ..
	cp -r -f ejerciciosPilas/compilados/ejerciciosPilas.js public/libs/

actualizar_blockly: blockly/blocks_compressed.js
	cd blockly; git pull; python build.py; cd ..
	rm -rf vendor/libs/blockly
	mkdir -p vendor/libs/blockly
	make copiar_blockly_comprimido

copiar_blockly_comprimido:
	# CORE
	cp -f blockly/blockly_compressed.js vendor/libs/blockly/
	# BLOCKS
	cp -f blockly/blocks_compressed.js vendor/libs/blockly/
	# JS GENERATOR
	cp -f blockly/javascript_compressed.js vendor/libs/blockly/
	# MEDIA
	rm -r -f public/libs/blockly/media
	cp -r -f blockly/media public/libs/blockly/
	# LANG
	rm -r -f vendor/libs/blockly/msg
	cp -r -f blockly/msg vendor/libs/blockly/

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

dist: compilar

build: compilar

compilar: compilar_ejercicios_pilas
	cd scripts; python generarListaImagenes.py
	./node_modules/ember-cli/bin/ember build

compilar_web:
	./node_modules/ember-cli/bin/ember build --environment=web --output-path dist_web

compilar_live:
	./node_modules/ember-cli/bin/ember build --watch

version_patch:
	ember release

version_minor:
	ember release --minor

version_major:
	ember release --major


limpiar_todo:
	@echo "Limpiando bibliotecas..."
	@echo "(se reinstalarán a continuación)"
	@sleep 1s;
	@echo "Borrando node_modules y bower_components ..."
	@rm -rf node_modules/ bower_components/
	@echo "Borrando blockly y closure-library ..."
	@rm -rf blockly closure-library
	@sleep 1s;

full: limpiar_todo full_travis

full_travis: iniciar bajar_dependencias actualizar_blockly compilar_ejercicios_pilas

binarios_electron: build _preparar_electron _compilar_electron_osx _compilar_electron_win32
	@echo ""
	@echo "${G}Listo, los binarios se generaron en el directorio 'binarios':${N}"
	@echo ""
	@echo "${G}   binarios/pilas-bloques-${VERSION}.dmg${N}"
	@echo "${G}   binarios/pilas-bloques-${VERSION}.exe${N}"
	@echo ""

_preparar_electron:
	@echo "${G}Preparando directorio dist para funcionar con electron...${N}"
	@sed 's/VERSION/${VERSION}/g' extras/package.json > dist/package.json
	@cp extras/electron.js dist

_compilar_electron_osx:
	@echo "${G}Iniciando compilación a electron a OSX...${N}"
	rm -f binarios/pilas-bloques-${VERSION}.dmg
	node_modules/.bin/electron-packager dist "pilasBloques" --app-version=${VERSION} --platform=darwin --arch=all --version=0.37.6 --ignore=node_modules --ignore=bower_components --out=binarios --overwrite --icon=extras/icono.icns
	hdiutil create binarios/pilas-bloques-${VERSION}.dmg -srcfolder ./binarios/pilasBloques-darwin-x64/pilasBloques.app -size 200mb

_compilar_electron_win32:
	@echo "${G}Iniciando compilación a electron a Windows...${N}"
	node_modules/.bin/electron-packager dist "pilasBloques" --app-version=${VERSION} --platform=win32 --arch=ia32 --version=0.37.6 --ignore=node_modules --ignore=bower_components --out=binarios --overwrite --icon=extras/icono.ico
	@echo "${G}Generando instalador para windows...${N}"
	cp extras/instalador.nsi binarios/pilasBloques-win32-ia32/
	cd binarios/pilasBloques-win32-ia32/; makensis instalador.nsi
	@mv binarios/pilasBloques-win32-ia32/pilas-bloques.exe binarios/pilas-bloques-${VERSION}.exe


test_travis:
	time ember exam --split=10 --parallel

.PHONY: dist bajar_dependencias
