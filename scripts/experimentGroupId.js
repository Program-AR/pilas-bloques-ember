const distPath = process.argv[2] // We expect to be called like "node experimentGroupId.js /foo/bar/dist", so third is distPath.
if(!distPath) throw "You must pass the dist folder path as a parameter to this script"

const indexContents = require("fs").readFileSync(distPath + "/index.html").toString()
const contentTag = indexContents.split(`<meta name="pilasbloques/config/environment" content=`)[1].split(`/>`)[0]

const experimentGroup = JSON.parse(decodeURIComponent(JSON.parse(contentTag))).experimentGroup
console.log(experimentGroup[0])