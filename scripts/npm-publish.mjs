#!/usr/bin/env zx

import "zx/globals"

console.log("Publishing npm packages...")
const otp = await question('Please enter your npm 2FA code: ')
const cwd = process.cwd()
for(const d of ["core", "api", "runtime", "cli"]) {
    console.log(`publishing ${d}`)
    cd(`packages/${d}`)
    await $`npm publish --access public --otp ${otp}`
    cd(cwd)
}
