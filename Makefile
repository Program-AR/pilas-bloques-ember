# El version y nombre son los que figuran en el package.json.
VERSION=$(shell node -p "require('./package.json').version")
# El NOMBRE lo usa el empaquetador para crear archivos y carpetas y para darle nombre a los binarios
NAME=$(shell node -p "require('./package.json').name")

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
	@echo "    ${G}compilar${N}        Genera los archivos compilados."
	@echo "    ${G}compilar_live${N}   Compila de forma contínua."
	@echo "    ${G}compilar_web${N}    Genera la aplicación para la versión web (desde un iframe)."
	@echo "    ${G}test_travis${N}     Ejecuta las pruebas como esperamos en travis (en paralelo)."
	@echo ""
	@echo "    ${L}El comando full es equivalente a realizar estos pasos en orden:${N}"
	@echo "${L}"
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
	@echo "    ${G}empaquetar${N}        Genera los binarios de forma local."
	@echo ""
	@echo ""
	@echo ""


compilar_ejercicios_pilas: # Para cuando se quiere probar los cambios a ejercicios_pilas SIN releasearlo
	echo "${G}Compilando ejercicios para Pilas Bloques${N}"
	@cd ../pilas-bloques-exercises; node_modules/grunt-cli/bin/grunt
	@cp -rf ../pilas-bloques-exercises/dist node_modules/pilas-bloques-exercises/

watch_ejercicios: 
	echo "${G}Compilando ejercicios para Pilas Bloques${N}"
	@cd ../pilas-bloques-exercises; node_modules/grunt-cli/bin/grunt watch

build: 
	@ if [ -d "./dist" ]; then rm -r ./dist; fi
	@ npm run build

compilar_web: ./node_modules/ember-cli/bin/ember build --environment=web --output-path dist_web

compilar_live:
	./node_modules/ember-cli/bin/ember build --watch

compilar_pilasweb: # Para cuando se quiere probar los cambios a pilasweb SIN releasearlo
	cd ../pilasweb; make build
	cp -rf ../pilasweb/dist node_modules/pilasweb/

version_patch:
	./node_modules/ember-cli/bin/ember release

version_minor:
	./node_modules/ember-cli/bin/ember release --minor

version_major:
	./node_modules/ember-cli/bin/ember release --major

electron_pre_build: 
	@ if [ -d "./packages" ]; then rm -r ./packages; fi
	@ if ! ([ -d "./binaries" ]); then mkdir ./binaries; fi
	@ cp package.json dist/package.json
	@ cp packaging/electron.js dist

electron_build_win:
	@ make electron_pre_build
	@ if [ -f "./binaries/${NAME}-${VERSION}.exe" ]; then rm "./binaries/${NAME}-${VERSION}.exe"; fi
	@ node_modules/.bin/electron-builder -w
	@ mv ./packages/Pilas\ Bloques\ Setup\ ${VERSION}.exe binaries/${NAME}-${VERSION}.exe
	@ rm -r ./packages

electron_build_linux:
	@ make electron_pre_build
	@ if [ -f "./binaries/${NAME}-${VERSION}.AppImage" ]; then rm "./binaries/${NAME}-${VERSION}.AppImage"; fi
	@ if [ -f "./binaries/${NAME}_${VERSION}_amd64.deb" ]; then rm "./binaries/${NAME}_${VERSION}_amd64.deb"; fi
	@ if [ -f "./binaries/${NAME}-${VERSION}-ia32.zip" ]; then rm "./binaries/${NAME}-${VERSION}-ia32.zip"; fi
	@ if [ -f "./binaries/${NAME}-${VERSION}-x64.zip" ]; then rm "./binaries/${NAME}-${VERSION}-x64.zip"; fi
	@ node_modules/.bin/electron-builder -l
	@ mv ./packages/${NAME}-${VERSION}-ia32.zip binaries
	@ mv ./packages/${NAME}_${VERSION}_amd64.deb binaries
	@ mv ./packages/Pilas\ Bloques-${VERSION}.AppImage binaries/${NAME}-${VERSION}.AppImage
	@ mv ./packages/${NAME}-${VERSION}.zip binaries/${NAME}-${VERSION}-x64.zip
	@ rm -r ./packages

electron_build_mac:
	@ make electron_pre_build
	@ if [ -f "./binaries/Pilas\ Bloques-${VERSION}.dmg" ]; then rm "./binaries/Pilas\ Bloques-${VERSION}.dmg"; fi
	@ node_modules/.bin/electron-builder -m
	@ mv ./packages/Pilas\ Bloques\ Setup\ ${VERSION}.dmg binaries/${NAME}-${VERSION}.dmg
	@ rm -r ./packages

electron_build:
	@ make electron_build_win
	@ make electron_build_linux
	# @ make electron_build_mac