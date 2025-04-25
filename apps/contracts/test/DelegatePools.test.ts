import { loadFixture } from '@nomicfoundation/hardhat-toolbox-viem/network-helpers'
import { expect } from 'chai'
import hre from 'hardhat'

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

  return { semaphore }
}

const deploy = async () => {
  const walletClients = await hre.viem.getWalletClients()
  const { semaphore } = await loadFixture(deploySemaphore)

  const contract = await hre.viem.deployContract('DelegatePools', [
    '0x0000000000000000000000000000000000000000', // _token
    walletClients[0].account.address, // _owner
    semaphore.address,
  ])

  return { contract }
}

describe('Tests', function () {
  it('should be testing against mainnet fork', async function () {
    const client = await hre.viem.getPublicClient()
    const block = await client.getBlock()
    expect(block.number).to.equal(22348000n)
  })

  it('should return the token address', async function () {
    const { contract } = await loadFixture(deploy)

    const token = await contract.read.token()
    expect(token).to.equal('0x0000000000000000000000000000000000000000')
  })

  it('should create a pool', async function () {
    const { contract } = await loadFixture(deploy)

    const pool = await contract.write.createPool(100)
    expect(pool).to.emit(contract, 'PoolCreated')
  })
})
