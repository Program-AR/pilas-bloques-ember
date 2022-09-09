const shell = require('shelljs')

console.log('Removing mulang require version')
shell.sed('-i', `require\\('../package.json'\\).version`, `''`, './node_modules/mulang/build/mulang.js')