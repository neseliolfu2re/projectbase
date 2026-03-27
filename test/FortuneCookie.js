const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('FortuneCookie', () => {
  it('reverts transferOwnership when new owner is current owner', async () => {
    const [owner] = await ethers.getSigners()
    const FortuneCookie = await ethers.getContractFactory('FortuneCookie')
    const c = await FortuneCookie.deploy(0, 10)
    await c.waitForDeployment()
    await expect(c.transferOwnership(owner.address)).to.be.revertedWithCustomError(
      c,
      'OwnershipUnchanged',
    )
  })

  it('cancelPendingOwnership clears pending transfer', async () => {
    const [, other] = await ethers.getSigners()
    const FortuneCookie = await ethers.getContractFactory('FortuneCookie')
    const c = await FortuneCookie.deploy(0, 10)
    await c.waitForDeployment()
    await c.transferOwnership(other.address)
    await c.cancelPendingOwnership()
    expect(await c.pendingOwner()).to.equal(ethers.ZeroAddress)
  })

  it('reverts cancelPendingOwnership when nothing pending', async () => {
    const FortuneCookie = await ethers.getContractFactory('FortuneCookie')
    const c = await FortuneCookie.deploy(0, 10)
    await c.waitForDeployment()
    await expect(c.cancelPendingOwnership()).to.be.revertedWithCustomError(
      c,
      'NoPendingOwnership',
    )
  })
})
