VERSION=0.1.9
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
	@echo "    ${G}copiar_blockly_comprimido${N}       Vincula blockly al proyecto."
	@echo "    ${G}copiar_blockly_descomprimido${N}    Vincula blockly al proyecto."
	@echo ""
	@echo "    ${L}Estos suelen ser los comandos iniciales a ejecutar (sync):${N}"
	@echo "${L}"
	@echo "        iniciar → bajar_dependencias → vincular_dependencias → "
	@echo "        actualizar_pilas → actualizar_blockly "
	@echo "        "
	@echo "           (o bien "make full")"
	@echo "${N}"
	@echo ""
	@echo "  ${Y}Para distribuir${N}"
	@echo ""
	@echo "    ${G}version${N}         Genera una nueva versión."
	@echo "    ${G}subir_version${N}   Sube version generada al servidor."
	@echo "    ${G}publicar${N}        Publica el cambio para el paquete deb."
	@echo "    ${G}crear_deb${N}       Genera el paquete deb para huayra."
	@echo ""


iniciar:
	npm install
	./node_modules/bower/bin/bower install

vincular_dependencias:
	rm -f pilasweb blockly
	ln -s ../pilasweb
	ln -s ../blockly

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

publicar:
	dch -i

crear_deb:
	dpkg-buildpackage -us -uc

compilar:
	./node_modules/ember-cli/bin/ember build

compilar_live:
	./node_modules/ember-cli/bin/ember build --watch

version:
	# patch || minor
	@bumpversion patch --current-version ${VERSION} package.json public/package.json Makefile --list
	make build
	@echo "Es recomendable escribir el comando que genera los tags y sube todo a github:"
	@echo ""
	@echo "make ver_sync"

ver_sync: subir_version

full: iniciar bajar_dependencias vincular_dependencias actualizar_pilas actualizar_blockly

subir_version:
	git commit -am 'release ${VERSION}'
	git tag '${VERSION}'
	git push
	git push --all
	git push --tags

.PHONY: dist
