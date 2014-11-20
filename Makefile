all:
	@echo ""
	@echo "  test_mac        prueba la aplicación sobre macosx"
	@echo ""


test_mac:
	@echo "Cuidado - se está usando la version de nodewebkit del sistema."
	open -a /Applications/node-webkit.app dist
