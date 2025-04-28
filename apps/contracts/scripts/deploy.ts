// npx hardhat run scripts/deploy.ts --network mainnet
import hre from 'hardhat'
import { encodeAbiParameters } from 'viem/utils'

import { create2Deploy } from './lib/create2'
import { getInitCode } from './lib/initcode'

async function main() {
  const contractName = 'DelegatePools'

  const constructorArguments = [
    '0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72', // _token ($ENS)
    '0x8764f2939aE6ed4EcB5baD2cdB7e2B81aA153bd1', // _owner (ens.gregskril.eth)
    '0x4ca12bd748f8567c92ed65ea46b8913d038f99f2', // _semaphore
  ] as const

  const encodedArgs = encodeAbiParameters(
    [{ type: 'address' }, { type: 'address' }, { type: 'address' }],
    constructorArguments
  )

  const { initCode, initCodeHash } = await getInitCode(
    contractName,
    encodedArgs
  )
  console.log({ initCodeHash })

  const { address } = await create2Deploy({
    initCode,
    salt: '0xa54b46d68a4806c6511a77371b363097e1515fb18cc4dbc238abf3c20a99a2d8',
  })

  console.log(`Deployed ${contractName} to ${address}`)

  try {
    // Wait 30 seconds for block explorers to index the deployment
    await new Promise((resolve) => setTimeout(resolve, 30_000))
    await hre.run('verify:verify', { address, constructorArguments })
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
