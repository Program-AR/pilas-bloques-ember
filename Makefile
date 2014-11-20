all:
	@echo ""
	@echo "  test_mac        prueba la aplicación sobre macosx"
	@echo ""


build:
	ember build

test_mac: build
	@echo "Cuidado - se está usando la version de nodewebkit del sistema."
	open -a /Applications/node-webkit.app dist
