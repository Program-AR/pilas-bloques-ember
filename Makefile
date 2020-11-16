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
	@ echo "  ${Y}for packaging :${N}"
	@ echo ""
	@ echo "    ${G}electron_osx_package${N}   			Make a electron osx electron package."
	@ echo "    ${G}electron_linux_x64_deb_package${N}  Make a electron linux x64 deb electron package."
	@ echo "    ${G}electron_linux_x64_zip_package${N}  Make a electron linux x64 zip electron package."
	@ echo "    ${G}electron_linux_ia32_zip_package${N} Make a electron linux x32 zip electron package."
	@ echo "    ${G}electron_win32_package${N}    		Make a electron Win32 electron package."
	@ echo "    ${G}electron_linux_packages${N}			Make all electron linux electron packages."
	@ echo ""
	@ echo "    ${L}NOTE: every version generates a binary automatically in travis.${N}"
	@ echo ""
	@ echo ""



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