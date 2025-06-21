import "zx/globals"

const pkg = await fs.readJSON("./package.json")
pkg.enabledApiProposals = pkg._enabledApiProposals
pkg.displayName = "GenAIScript Insiders"
delete pkg._enabledApiProposals
pkg.dependencies["@genaiscript/core"] = pkg.version
pkg.dependencies["@genaiscript/api"] = pkg.version
pkg.dependencies["@genaiscript/runtime"] = pkg.version
await fs.writeJSON("./package.json", pkg, { spaces: 4 })
console.log(`cleaned package.json`)
$`pnpm install`