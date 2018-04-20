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
	@echo "    ${G}compilar${N}        Genera los archivos compilados (para desarrolladores)."
	@echo "    ${G}compilar_live${N}   Compila de forma contínua."
	@echo "    ${G}compilar_prod${N}    Genera la aplicación para deploy (minificada, reducida, etc.)."
	@echo "    ${G}test_travis${N}     Ejecuta las pruebas como esperamos en travis (en paralelo)."
	@echo "    ${G}actualizar_imagenes${N}  Actualiza imagenes como iconos."
	@echo ""
	@echo ""
	@echo "  ${Y}Para desarrolladores (avanzadas)${N}"
	@echo ""
	@echo "    ${G}compilar_ejercicios_pilas${N}       Compilar los ejercicios de pilas."
	@echo ""
	@echo "    ${L}El comando full es equivalente a realizar estos pasos en orden:${N}"
	@echo "${L}"
	@echo "       → iniciar → compilar_ejercicios_pilas"
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
	@node_modules/bower/bin/bower install --allow-root

iniciar_ejercicios:
	@echo "${G}instalando dependencias de ejerciciosPilas...${N}"
	cd ejerciciosPilas; npm install

compilar_ejercicios_pilas:
	@cd ejerciciosPilas; echo "${G}Compilando ejerciciosPilas${N}"; node_modules/grunt-cli/bin/grunt; cd ..
	cp -r -f ejerciciosPilas/compilados/ejerciciosPilas.js public/libs/

pre_ember_build: compilar_ejercicios_pilas
	cd scripts; python generarListaImagenes.py

dist: compilar

build: compilar

serve: pre_ember_build
	./node_modules/ember-cli/bin/ember serve

compilar: pre_ember_build
	./node_modules/ember-cli/bin/ember build

compilar_prod: pre_ember_build
	./node_modules/ember-cli/bin/ember build --environment=production --output-path dist_prod

compilar_live:
	./node_modules/ember-cli/bin/ember build --watch

version_patch:
	./node_modules/ember-cli/bin/ember release

version_minor:
	./node_modules/ember-cli/bin/ember release --minor

version_major:
	./node_modules/ember-cli/bin/ember release --major


limpiar_todo:
	@echo "Limpiando bibliotecas..."
	@echo "(se reinstalarán a continuación)"
	@sleep 1s;
	@echo "Borrando node_modules y bower_components ..."
	@rm -rf node_modules/ bower_components/
	@echo "Borrando node_modules de ejerciciosPilas..."
	@rm -rf ejerciciosPilas/node_modules/
	@sleep 1s;

full: limpiar_todo full_travis

full_travis: iniciar compilar_ejercicios_pilas

binarios_electron: build _preparar_electron _compilar_electron_osx _compilar_electron_win32 _compilar_electron_linux64
	@echo ""
	@echo "${G}Listo, los binarios se generaron en el directorio 'binarios':${N}"
	@echo ""
	@echo "${G}   binarios/pilas-bloques-${VERSION}.dmg${N}"
	@echo "${G}   binarios/pilas-bloques-${VERSION}.exe${N}"
	@echo "${G}   binarios/pilas-bloques-${VERSION}-linux-x64.zip${N}"
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

_compilar_electron_linux64:
	rm -rf binarios/pilasBloques-linux-x64
	rm -f binarios/pilas-bloques-${VERSION}-linux-x64.zip
	node_modules/.bin/electron-packager dist "pilasBloques" --app-version=${VERSION} --platform=linux --arch=x64 --version=0.37.6 --ignore=node_modules --ignore=bower_components --out=binarios --overwrite --icon=extras/icono.icns
	cd binarios; zip -r pilas-bloques-${VERSION}-linux-x64.zip pilasBloques-linux-x64/

actualizar_imagenes:
	cd scripts; python generarListaImagenes.py

test_travis:
	./node_modules/ember-cli/bin/ember test

test:
	./node_modules/ember-cli/bin/ember test --serve

.PHONY: dist
