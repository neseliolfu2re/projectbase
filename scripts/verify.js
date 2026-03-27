/**
 * Verify FortuneCookie on Basescan (after deploy).
 * Usage (PowerShell): $env:CONTRACT_ADDRESS="0x..."; npx hardhat run scripts/verify.js --network base
 * bash: CONTRACT_ADDRESS=0x... npx hardhat run scripts/verify.js --network base
 *
 * Constructor args must match scripts/deploy.js (priceWei, messageCount).
 */
const hre = require('hardhat')

async function main() {
  const address = process.env.CONTRACT_ADDRESS
  if (!address) {
    console.error('Set CONTRACT_ADDRESS to the deployed contract address.')
    process.exitCode = 1
    return
  }

  const priceWei = 0n
  const messageCount = 10

  await hre.run('verify:verify', {
    address,
    constructorArguments: [priceWei, messageCount],
  })
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
