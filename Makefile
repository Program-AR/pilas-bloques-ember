VERSION=0.1.11
NOMBRE="pilas-engine-bloques"

N=[0m
G=[01;32m
Y=[01;33m
B=[01;34m
L=[01;30m

comandos:
	@echo ""
	@echo "${B}Comandos disponibles para ${G}pilas-engine-bloques${N}"
	@echo ""
	@echo "  ${Y}Para desarrolladores${N}"
	@echo ""
	@echo "    ${G}iniciar${N}         Instala dependencias."
	@echo "    ${G}compilar${N}        Genera los archivos compilados."
	@echo "    ${G}compilar_live${N}   Compila de forma contínua."
	@echo "    ${G}compilar_web${N}    Genera la aplicación para la versión web (desde un iframe)."
	@echo ""
	@echo "    ${G}ejecutar_linux${N}  Prueba la aplicacion sobre Huayra."
	@echo "    ${G}ejecutar_mac${N}    Prueba la aplicacion sobre OSX."
	@echo ""
	@echo ""
	@echo "  ${Y}Para desarrolladores (avanzadas)${N}"
	@echo ""
	@echo "    ${G}bajar_dependencias${N}              Descarga las dependencias pilas y blockly."
	@echo "    ${G}vincular_dependencias${N}           Vincula las dependencias."
	@echo "    ${G}actualizar_pilas${N}                Vincula pilasweb."
	@echo "    ${G}actualizar_blockly${N}              Actualiza blockly."
	@echo "    ${G}actualizar_ejercicios_pilas${N}     Actualiza los ejercicios de pilas."
	@echo "    ${G}copiar_blockly_comprimido${N}       Vincula blockly al proyecto."
	@echo "    ${G}copiar_blockly_descomprimido${N}    Vincula blockly al proyecto."
	@echo ""
	@echo "    ${L}Estos suelen ser los comandos iniciales a ejecutar (sync):${N}"
	@echo "${L}"
	@echo "        iniciar → bajar_dependencias → vincular_dependencias → "
	@echo "        actualizar_pilas → actualizar_blockly →"
	@echo "        actualizar_ejercicios_pilas"
	@echo "        "
	@echo "           (o bien "make full")"
	@echo "${N}"
	@echo ""
	@echo "  ${Y}Para distribuir${N}"
	@echo ""
	@echo "    ${G}version${N}         Genera una nueva versión."
	@echo "    ${G}subir_version${N}   Sube version generada al servidor."
	@echo ""
	@echo "    ${G}binarios${N}          Genera los binarios."
	@echo "    ${G}upload_to_dropbox${N} Sube los binarios generados a dropbox."
	@echo ""


iniciar:
	npm install
	./node_modules/bower/bin/bower install

vincular_dependencias:
	rm -f pilasweb blockly ejerciciosPilas	
	ln -s ../pilasweb
	ln -s ../blockly
	ln -s ../ejerciciosPilas

bajar_dependencias:
	cd ..; git clone https://github.com/hugoruscitti/pilasweb.git
	cd ..; git clone https://github.com/sawady/blockly.git
	cd ..; git clone https://github.com/google/closure-library.git

actualizar_pilas:
	cd pilasweb; npm install; git pull; make build; cd ..
	rm -r -f public/libs/data
	mkdir -p public/libs/
	cp -r -f pilasweb/public/data public/libs/
	cp -r -f pilasweb/public/pilasweb.js public/libs/

actualizar_ejercicios_pilas:
	cd ejerciciosPilas; git pull; npm install; grunt typescript pilas -f; cd ..
	cp -r -f ejerciciosPilas/compilados/ejerciciosPilas.js public/libs/
	rm -r -f public/libs/data
	cp -r -f ejerciciosPilas/src/data public/libs/data

actualizar_blockly:
	cd blockly; git pull; python build.py; cd ..
	rm -r -f public/libs/blockly
	mkdir -p public/libs/blockly
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

dist: compilar

ejecutar_linux:
	nw dist

ejecutar_mac:
	/Applications/nwjs.app/Contents/MacOS/nwjs dist

test_mac: ejecutar_mac

build: compilar

compilar:
	./node_modules/ember-cli/bin/ember build

compilar_web:
	./node_modules/ember-cli/bin/ember build --environment=web --output-path dist_web

compilar_live:
	./node_modules/ember-cli/bin/ember build --watch

version:
	# patch || minor
	@bumpversion patch --current-version ${VERSION} public/package.json public/package.desarrollo.json public/package.produccion.json Makefile --list
	make build
	@echo "Es recomendable escribir el comando que genera los tags y sube todo a github:"
	@echo ""
	@echo "make subir_version"

ver_sync: subir_version

full: iniciar bajar_dependencias vincular_dependencias actualizar_pilas actualizar_blockly actualizar_ejercicios_pilas

subir_version:
	git commit -am 'release ${VERSION}'
	git tag '${VERSION}'
	git push
	git push --all
	git push --tags

to_production:
	@echo "pasando a modo produccion".
	cp public/package.produccion.json public/package.json

to_develop:
	@echo "pasando a modo develop".
	cp public/package.desarrollo.json public/package.json

_compile_osx:
	make to_production
	mkdir -p webkitbuilds
	rm -r -f tmp
	mkdir -p tmp
	cd tmp
	cp ~/Dropbox/releases/pilas-engine-bloques-template.zip tmp/
	unzip tmp/pilas-engine-bloques-template.zip -d tmp/ > log_descompresion.log
	rm -r -f tmp/__*
	mv tmp/pilas-engine-bloques-template.app tmp/pilas-engine-bloques.app
	rm tmp/pilas-engine-bloques-template.zip
	cp -r dist/* tmp/pilas-engine-bloques.app/Contents/Resources/app.nw/
	hdiutil create tmp/pilas-engine-bloques-${VERSION}.dmg -srcfolder ./tmp/pilas-engine-bloques.app -size 200mb
	mv tmp/pilas-engine-bloques-${VERSION}.dmg webkitbuilds/
	rm -r -f tmp
	make to_develop

_compile_win:
	make to_production
	mkdir -p webkitbuilds
	rm -r -f tmp
	mkdir -p tmp
	cp ~/Dropbox/releases/pilas-engine-bloques-windows-template.zip tmp/
	unzip tmp/pilas-engine-bloques-windows-template.zip -d tmp/ > log_descompresion.log
	rm -r -f tmp/__*
	cp -r -f dist/* tmp/nwjs
	cp extras/instalador.nsi tmp/nwjs
	cd tmp/nwjs; makensis instalador.nsi
	mv tmp/nwjs/pilas-engine-bloques.exe webkitbuilds/pilas-engine-bloques-${VERSION}.exe
	make to_develop

binarios: to_production build _compile_osx _compile_win
	@echo "Mostrando el directorio resultado"
	@open webkitbuilds
	make to_develop

upload_to_dropbox:
	mkdir -p ~/Dropbox/Public/releases/pilas-engine-bloques/${VERSION}/
	mv webkitbuilds/pilas-engine-bloques-${VERSION}.dmg ~/Dropbox/Public/releases/pilas-engine-bloques/${VERSION}/
	mv webkitbuilds/pilas-engine-bloques-${VERSION}.exe ~/Dropbox/Public/releases/pilas-engine-bloques/${VERSION}/

.PHONY: dist
