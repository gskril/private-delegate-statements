// npx hardhat run scripts/deploy-semaphore.ts --network mainnet
// 3,726,654 gas for Verifier
// 2,129,360 gas for Semaphore
// Total: 5,856,014
// 0.006 ETH to deploy at 1 gwei
import hre from 'hardhat'

async function main() {
  const verifier = await hre.viem.deployContract(
    '@semaphore-protocol/contracts/base/SemaphoreVerifier.sol:SemaphoreVerifier',
    []
  )

  console.log(`Deployed verifier to ${verifier.address}`)

  // Already deployed by someone else on Mainnet and Sepolia
  const poseidon = await hre.viem.getContractAt(
    'poseidon-solidity/PoseidonT3.sol:PoseidonT3',
    '0x1eBB6ec9338Ccb73264153273E682cF76a285912'
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

  console.log(`Deployed Semaphore to ${semaphore.address}`)

  try {
    // Wait 30 seconds for block explorers to index the deployment
    await new Promise((resolve) => setTimeout(resolve, 30_000))

    // Verify the Verifier contract
    await hre.run('verify:verify', {
      address: verifier.address,
      constructorArguments: [],
    })

    // Verify the Semaphore contract
    await hre.run('verify:verify', {
      address: semaphore.address,
      constructorArguments: [verifier.address],
      libraries: {
        'poseidon-solidity/PoseidonT3.sol:PoseidonT3': poseidon.address,
      },
    })
  } catch (error) {
    console.error(error)
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
