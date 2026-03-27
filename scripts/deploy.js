const { ethers } = require('hardhat')

async function main() {
  const priceWei = 0n
  const messageCount = 10

  const FortuneCookie = await ethers.getContractFactory('FortuneCookie')
  const fortune = await FortuneCookie.deploy(priceWei, messageCount)
  await fortune.waitForDeployment()

  const address = await fortune.getAddress()
  console.log('FortuneCookie deployed to:', address)
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})

