echo 'Changing deprecated division on font-awesome'

cd node_modules/font-awesome/scss
sass-migrator --verbose division **/* *.scss

cd ../..

echo 'Changing deprecated division on angular-material-styles'

cd angular-material-styles/src/core
sass-migrator --verbose division **/* *.scss

cd ../components
sass-migrator --verbose division **/* *.scss

