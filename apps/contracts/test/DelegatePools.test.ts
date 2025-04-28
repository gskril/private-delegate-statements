import { loadFixture } from '@nomicfoundation/hardhat-toolbox-viem/network-helpers'
import { Group } from '@semaphore-protocol/group'
import { Identity } from '@semaphore-protocol/identity'
import { generateProof, verifyProof } from '@semaphore-protocol/proof'
import { expect } from 'chai'
import hre from 'hardhat'
import {
  encodeAbiParameters,
  formatEther,
  keccak256,
  toHex,
  zeroAddress,
} from 'viem'
import { parseEther } from 'viem/utils'

const account0 = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' // deployer, owner, 0 votes
const account1 = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8' // user with 0 votes
const account2 = '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC' // user with 65k votes

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
  const { semaphore } = await loadFixture(deploySemaphore)

  const mockToken = await hre.viem.deployContract(
    'src/mocks/MockERC20.sol:MockERC20'
  )

  await mockToken.write.mint([account0, parseEther('65000')])
  await mockToken.write.delegate([account2])

  const contract = await hre.viem.deployContract('DelegatePools', [
    mockToken.address, // _token
    account0, // _owner
    semaphore.address, // _semaphore
  ])

  return { contract, semaphore }
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

  it('should return a token address', async function () {
    const { contract } = await loadFixture(deploy)

    const token = await contract.read.token()
    expect(token).to.not.equal(zeroAddress)
  })

  it('should create a pool', async function () {
    const { contract } = await loadFixture(deploy)

    const minVotes = parseEther('1000')

    const semaphoreGroupIdBefore = await contract.read.pools([minVotes])
    expect(semaphoreGroupIdBefore).to.equal(0n)

    // Should not let a non-owner create a pool
    const unauthedCall = contract.write.createPool([minVotes], {
      account: account1,
    })
    await expect(unauthedCall).to.be.rejectedWith(
      `OwnableUnauthorizedAccount("${account1}")`
    )

    // Should let the owner create a pool
    await contract.write.createPool([minVotes])

    const semaphoreGroupIdAfter = await contract.read.pools([minVotes])
    expect(semaphoreGroupIdAfter).to.equal(1n)
  })

  it('should let a user join a pool and verify a message from them', async function () {
    const { contract, semaphore } = await loadFixture(deploy)

    const identity = new Identity()
    const minVotes = parseEther('1000')
    await contract.write.createPool([minVotes])
    const groupId = await contract.read.pools([minVotes])

    const votes = await contract.read.getVotes([account2])
    expect(Number(formatEther(votes))).to.be.greaterThan(
      Number(formatEther(minVotes))
    )

    // Should fail because `account2` has less than 1000 votes
    const unauthedCall = contract.write.joinPool([
      minVotes,
      identity.commitment,
    ])
    await expect(unauthedCall).to.be.rejectedWith(
      `InsufficientVotes(0, ${minVotes})`
    )

    // Should succeed because `account2` has more than 1000 votes
    await contract.write.joinPool([minVotes, identity.commitment], {
      account: account2,
    })

    // Create the group offline, generate a proof with a statement
    const group = new Group([identity.commitment])
    const scope = await semaphore.read.getMerkleTreeRoot([groupId])
    const statement =
      'This is a hot take about the DAO from a large delegate, without revealing which delegate'
    const proof = await generateProof(
      identity,
      group,
      keccak256(toHex(statement)),
      scope
    )

    const offchainVerified = await verifyProof(proof)
    expect(offchainVerified).to.equal(true)

    const encodedProof = encodeAbiParameters(
      [
        { name: 'merkleTreeDepth', type: 'uint256' },
        { name: 'merkleTreeRoot', type: 'uint256' },
        { name: 'nullifier', type: 'uint256' },
        { name: 'scope', type: 'uint256' },
        { name: 'points', type: 'uint256[8]' },
      ],
      [
        BigInt(proof.merkleTreeDepth),
        BigInt(proof.merkleTreeRoot),
        BigInt(proof.nullifier),
        scope,
        proof.points,
      ]
    )

    // Verify that the statement came from a member of the group
    const verified = await contract.read.verifyStatement([
      minVotes,
      statement,
      encodedProof,
    ])
    expect(verified).to.equal(true)

    // Verify that the proof is for a specific statement
    const notVerified = await contract.read.verifyStatement([
      minVotes,
      'proof is for a different statement',
      encodedProof,
    ])
    expect(notVerified).to.equal(false)

    // Try to generate a proof for a statement from a non-member, which should fail
    try {
      await generateProof(
        new Identity(),
        group,
        keccak256(toHex('Some statement from a non-member')),
        scope
      )
    } catch (error) {
      expect(error).to.be.instanceOf(Error)
      expect((error as Error).message).to.include('does not exist in this tree')
    }
  })

  it('should let a user join multiple pools', async function () {
    const { contract } = await loadFixture(deploy)

    const identity = new Identity()
    const minVotes = [parseEther('1000'), parseEther('2000')]

    for (const minVote of minVotes) {
      await contract.write.createPool([minVote])
    }

    await contract.write.joinPools([minVotes, identity.commitment], {
      account: account2,
    })
  })

  it('should not allow the same delegate to join pool multiple times', async function () {
    const { contract } = await loadFixture(deploy)

    const identity = new Identity()
    const minVotes = parseEther('1000')

    await contract.write.createPool([minVotes])
    await contract.write.joinPool([minVotes, identity.commitment], {
      account: account2,
    })

    const identity2 = new Identity()
    const join2 = contract.write.joinPool([minVotes, identity2.commitment], {
      account: account2,
    })

    await expect(join2).to.be.rejectedWith(
      `AlreadyJoined("${account2}", ${minVotes})`
    )
  })
})
