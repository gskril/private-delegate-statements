import { loadFixture } from '@nomicfoundation/hardhat-toolbox-viem/network-helpers'
import { expect } from 'chai'
import hre from 'hardhat'

const deploy = async () => {
  const contract = await hre.viem.deployContract('DelegatePools', [
    '0x0000000000000000000000000000000000000000', // _token
  ])

  return { contract }
}

describe('Tests', function () {
  it('should return the token address', async function () {
    const { contract } = await loadFixture(deploy)

    const token = await contract.read.token()
    expect(token).to.equal('0x0000000000000000000000000000000000000000')
  })
})
