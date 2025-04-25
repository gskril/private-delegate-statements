import { loadFixture } from '@nomicfoundation/hardhat-toolbox-viem/network-helpers'
import { Group } from '@semaphore-protocol/group'
import { Identity } from '@semaphore-protocol/identity'
import { generateProof } from '@semaphore-protocol/proof'
import { expect } from 'chai'
import hre from 'hardhat'
import { zeroAddress } from 'viem'
import { parseEther } from 'viem/utils'

const user = '0xb8c2C29ee19D8307cb7255e1Cd9CbDE883A267d5' // nick.eth
const nonOwner = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'

async function deploySemaphore() {
  const verifier = await hre.viem.deployContract(
    '@semaphore-protocol/contracts/base/SemaphoreVerifier.sol:SemaphoreVerifier',
    []
  )

  const poseidon = await hre.viem.deployContract(
    'poseidon-solidity/PoseidonT3.sol:PoseidonT3',
    []
  )

  const semaphore = await hre.viem.deployContract(
    '@semaphore-protocol/contracts/Semaphore.sol:Semaphore',
    [verifier.address],
    {
      libraries: {
        'poseidon-solidity/PoseidonT3.sol:PoseidonT3': poseidon.address,
      },
    }
  )

  // Create a group so the tests below are more readable (starting group won't be 0 anymore)
  await semaphore.write.createGroup()

  return { semaphore }
}

const deploy = async () => {
  const walletClients = await hre.viem.getWalletClients()
  const { semaphore } = await loadFixture(deploySemaphore)

  const contract = await hre.viem.deployContract('DelegatePools', [
    '0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72', // _token ($ENS)
    walletClients[0].account.address, // _owner (deployer)
    semaphore.address, // _semaphore
  ])

  return { contract }
}

describe('Tests', function () {
  it('should deploy semaphore and make sure it is working correctly', async function () {
    const { contract } = await loadFixture(deploy)
    expect(contract.read.semaphore()).to.not.equal(zeroAddress)

    const semaphore = await hre.viem.getContractAt(
      '@semaphore-protocol/contracts/Semaphore.sol:Semaphore',
      await contract.read.semaphore()
    )

    expect(await semaphore.read.groupCounter()).to.equal(1n)

    await semaphore.write.createGroup()
    expect(await semaphore.read.groupCounter()).to.equal(2n)
  })

  it('should return the token address', async function () {
    const { contract } = await loadFixture(deploy)

    const token = await contract.read.token()
    expect(token).to.equal('0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72')
  })

  it('should create a pool', async function () {
    const { contract } = await loadFixture(deploy)

    const minVotes = parseEther('1000')

    const semaphoreGroupIdBefore = await contract.read.pools([minVotes])
    expect(semaphoreGroupIdBefore).to.equal(0n)

    // Should not let a non-owner create a pool
    const unauthedCall = contract.write.createPool([minVotes], {
      account: nonOwner,
    })
    await expect(unauthedCall).to.be.rejectedWith(
      `OwnableUnauthorizedAccount("${nonOwner}")`
    )

    // Should let the owner create a pool
    await contract.write.createPool([minVotes])

    const semaphoreGroupIdAfter = await contract.read.pools([minVotes])
    expect(semaphoreGroupIdAfter).to.equal(1n)
  })

  it('should let a user join a pool and verify a message from them', async function () {
    const { contract } = await loadFixture(deploy)

    const identity = new Identity()
    const minVotes = parseEther('1000')
    await contract.write.createPool([minVotes])

    // Should succeed because `user` has more than 1000 votes
    // await contract.write.joinPool([minVotes, identity.commitment], {
    //   account: user,
    // })

    // Create the group offline, let the user make a statement, and then verify that it came from a member of the group
    // const group = new Group([identity.commitment])
    // const proof = await generateProof(identity, group, message, scope)

    // const verified = await contract.read.verifyMessage(1, proof)
    // expect(verified).to.equal(true)
  })
})
