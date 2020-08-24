# The ember executable path.
EMBER=./node_modules/.bin/ember

#The project name, used by electron-packager in order to create files and folders for the app binaries.
NAME=$(shell scripts/projectName.sh)

# The project version.
VERSION=$(shell scripts/projectVersion.sh)

N=[0m
G=[01;32m
Y=[01;33m
B=[01;34m
L=[01;30m

npm_config_loglevel="warn"

commands:
	@ echo ""
	@ echo "${B}Commands available for ${G}pilas-bloques${N} - ${Y} versión ${VERSION}${N}"
	@ echo ""
	@ echo "  ${Y}for development:${N}"
	@ echo ""
	@ echo "    ${G}build${N}								Build the project."
	@ echo "    ${G}build_live${N}   						Build the project continuously."
	@ echo "    ${G}build_pilasweb${N}    					Build Pilas Web dependency."
	@ echo "    ${G}build_pilas_bloques_exercises${N}		Build Pilas Bloques exercises."
	@ echo ""
	@ echo "  ${Y}for distribution:${N}"
	@ echo ""
	@ echo "    ${G}release_patch${N}     Generate a version (x.x.PATCH)."
	@ echo "    ${G}release_minor${N}     Generate a version (x.MINOR.x)."
	@ echo "    ${G}release_major${N}     Generate a version (MAJOR.x.x)."
	@ echo ""
	@ echo "    ${L}NOTE: every version generates a binary automatically in travis.${N}"
	@ echo ""
	@ echo ""


build_pilasweb: # For develop with Pilas Web WITHOUT releasing it.
	cd ../pilasweb; make build
	cp -rf ../pilasweb/dist node_modules/pilasweb/

build_pilas_bloques_exercises: #For develop with Pilas Bloques Exercises WITHOUT releasing it.
	@ echo "${G}Building Pilas Bloques Exercises${N}"
	cd ../pilas-bloques-exercises; node_modules/grunt-cli/bin/grunt
	cp -rf ../pilas-bloques-exercises/dist node_modules/pilas-bloques-exercises/

watch_pilas_bloques_exercises: 
	@ echo "${G}Building Pilas Bloques Exercises${N}"
	cd ../pilas-bloques-exercises; node_modules/grunt-cli/bin/grunt watch

build: 
	npm run build

build_live:
	$(EMBER) build --watch

release_patch:
	$(EMBER) release

release_minor:
	$(EMBER) release --minor

release_major:
	$(EMBER) release --major

package = @echo "${G}Generating package for $(1) $(2)...${N}"; node_modules/.bin/electron-packager dist ${NAME} --app-version=${VERSION} --platform=$(1) --arch=$(2) --ignore=node_modules --out=binaries --overwrite --icon=packaging/icono.$(3)

electron_pre_build:
	@ echo "${G}Making dist directory work with electron...${N}"
	mkdir -p ./binaries
	cp package.json dist/package.json
	cp packaging/electron.js dist

electron_osx_package: electron_pre_build
	@ echo "${G}Generating package for osx...${N}"
	rm -f binaries/${NAME}-${VERSION}.dmg
	$(call package,darwin,all,icns)
	hdiutil create binaries/${NAME}-${VERSION}.dmg -srcfolder ./binaries/${NAME}-darwin-x64/${NAME}.app -size 1g

electron_win32_package:
	make electron_pre_build;
	@ echo "${G}Generating installer for windows package...${N}"
	$(call package,win32,ia32,ico)
	cp packaging/instalador.nsi binaries/${NAME}-win32-ia32/
	cd binaries/${NAME}-win32-ia32/; makensis instalador.nsi
	mv binaries/${NAME}-win32-ia32/${NAME}.exe binaries/${NAME}-${VERSION}.exe

electron_linux_packages: electron_linux_x64_zip_package electron_linux_ia32_zip_package electron_linux_x64_deb_package

# This packaging has the problem that it does NOT replace the old Huayra Pilas Bloques app.
# Also, the debian generator package has a different name than the old one
electron_linux_x64_deb_package:
	make electron_pre_build;
	@ echo "${G}Generating linux x64 package for debian...${N}"
	rm -f "./binaries/${NAME}_${VERSION}_amd64.deb"
	$(call package,linux,x64,icns)
	node_modules/.bin/electron-installer-debian --arch amd64 --config=packaging/linux-package.json

electron_linux_x64_zip_package:
	make electron_pre_build;
	@ echo "${G}Generating linux x64 zip...${N}"
	rm -f ./binaries/${NAME}-${VERSION}-x64.zip
	$(call package,linux,x64,icns)
	cd binaries; zip -r ${NAME}-${VERSION}-linux-x64.zip ${NAME}-linux-x64/

electron_linux_ia32_zip_package:
	make electron_pre_build;
	@ echo "${G}Generating linux ia32 zip...${N}"
	rm -f ./binaries/${NAME}-${VERSION}-ia32.zip
	$(call package,linux,ia32,icns)
	cd binaries; zip -r ${NAME}-${VERSION}-linux-ia32.zip ${NAME}-linux-ia32/