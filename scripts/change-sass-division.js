const { forEach } = require('ramda')
const shell = require('shelljs')

let foldersToMigrate=["angular-material-styles/src/core","angular-material-styles/src/components"]

foldersToMigrate.forEach( folder => {
   console.log(`Changing deprecated division - ${folder}`)
   shell.exec(`sass-migrator division node_modules/${folder}/**/*.scss node_modules/${folder}/*.scss`)
})


