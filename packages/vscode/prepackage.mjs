import "zx/globals"

const pkg = await fs.readJSON("./package.json")
pkg.dependencies["@genaiscript/core"] = pkg.version
pkg.dependencies["@genaiscript/api"] = pkg.version
pkg.dependencies["@genaiscript/runtime"] = pkg.version
await fs.writeJSON("./package.json", pkg, { spaces: 4 })
await fs.rm("genaiscript.vsix", { force: true })
await fs.rm("genaiscript.manifest", { force: true })
console.log(`cleaned package.json`)
$`rm -Rf node_modules`
$`npm install`
