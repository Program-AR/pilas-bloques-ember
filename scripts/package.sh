#!/bin/bash

#The project name, used by electron-packager in order to create files and folders for the app binaries.
NAME=$(sh scripts/projectName.sh)

DIST_FOLDER_NAME=dist_prod

# The folder with all the publishable webapp
DIST=./$DIST_FOLDER_NAME

# The project version.
VERSION="$(sh scripts/projectVersion.sh)$(node scripts/experimentGroupId.js $DIST)"

# The electron executable path.
ELECTRON=./node_modules/dist/electron

# The electron packager path.
PACKAGER=./node_modules/.bin/electron-packager

# The electron debian packager path.
DEBIAN_PACKAGER=./node_modules/.bin/electron-installer-debian

[[ -d $DIST ]] || { echo "ERROR: The folder $DIST doesn't exist. You have to build Pilas Bloques before packaging." ; exit 1; }

help() {
    echo ""
	echo "Commands available for pilas-bloques - versión $VERSION"
	echo ""
	echo "  for packaging :"
	echo ""
	echo "    -osx              Make a electron osx electron package."
	echo "    -linux_x64_deb    Make a electron linux x64 deb electron package."
	echo "    -linux_x64_zip    Make a electron linux x64 zip electron package."
	echo "    -linux_ia32_zip   Make a electron linux x32 zip electron package."
	echo "    -win32            Make a electron Win32 electron package."
	echo "    -linux            Make all electron linux electron packages."
    echo "    -html             Make a html package"
	echo ""
	echo "  NOTE: every version generates a binary automatically in CI."
	echo ""
	echo ""
}

prebuild() {
    PLATFORM=$1
    ARCH=$2
    
    echo "Generating package for $PLATFORM $ARCH..."
    mkdir -p ./binaries
    cp package.json $DIST/package.json
    cp packaging/electron.js $DIST
}

package() {
    PLATFORM=$1
    ARCH=$2
    ICON_EXTENSION=$3

    $PACKAGER $DIST $NAME --app-version=$VERSION --platform=$PLATFORM --arch=$ARCH --ignore=node_modules --out=binaries --overwrite --icon=packaging/icono.$ICON_EXTENSION
}

package_linux_x64_deb() {
    prebuild "linux" "x64"
    echo "Generating linux x64 package for debian..."
    rm -f "./binaries/$NAME_$VERSION_amd64.deb"
    package "linux" "x64" "icns"
    $DEBIAN_PACKAGER --arch amd64 --config=packaging/linux-package.json
}

package_linux_ia32_zip() {
    prebuild "linux" "ia32"
    echo "Generating linux ia32 zip..."
    rm -f ./binaries/$NAME-$VERSION-ia32.zip
    package "linux" "ia32" "icns"
    cd binaries; zip -r $NAME-$VERSION-linux-ia32.zip $NAME-linux-ia32/; cd ..
}

package_linux_x64_zip() {
    prebuild "linux" "x64"
    echo "Generating linux x64 zip..."
    rm -f ./binaries/$NAME-$VERSION-x64.zip
    package "linux" "x64" "icns"
    cd binaries; zip -r $NAME-$VERSION-linux-x64.zip $NAME-linux-x64/; cd ..
}

package_linux() {
    package_linux_x64_deb
    package_linux_ia32_zip
    package_linux_x64_zip
}

package_osx() {
    prebuild "darwin" "all"
    echo "Generating package for osx..."
    package "darwin" "all" "icns"
    hdiutil create binaries/$NAME-$VERSION.dmg -srcfolder ./binaries/$NAME-darwin-x64/$NAME.app -size 1g
}

package_win32() {
    prebuild "win" "ia32"
    echo "Generating installer for windows package..."
    package "win32" "ia32" "ico"
	cp packaging/instalador.nsi binaries/$NAME-win32-ia32/
	cd binaries/$NAME-win32-ia32/; makensis instalador.nsi; cd ../..
	mv binaries/$NAME-win32-ia32/$NAME.exe binaries/$NAME-$VERSION.exe
}

package_html() {
    echo "Generating package for html..."
    mkdir -p ./binaries
    tar czf ./binaries/$NAME-$VERSION-html.tar.gz $DIST_FOLDER_NAME # ./ should be ommited, otherwise it will be inside tar.gz archive.
}

case "$1" in
    (-help)             help;;
    (-linux_x64_deb)    package_linux_x64_deb;;
    (-linux_ia32_zip)   package_linux_ia32_zip;;
    (-linux_x64_zip)    package_linux_x64_zip;;
    (-linux)            package_linux;;
    (-osx)              package_osx;;
    (-win32)            package_win32;;
    (-html)             package_html;;
    (*)                 echo Try 'package -help' for more information.;;
esac 