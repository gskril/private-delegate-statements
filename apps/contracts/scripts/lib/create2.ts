import hre from 'hardhat'
import { Hex, keccak256, parseAbi } from 'viem'

type Create2DeployProps = {
  initCode: Hex
  salt?: Hex
}

// https://github.com/pcaversaccio/create2deployer
const create2Factory = {
  address: '0x13b0D85CcB8bf860b6b79AF3029fCA081AE9beF2',
  abi: parseAbi([
    'event Deployed(address addr)',
    'function deploy(uint256 value, bytes32 salt, bytes memory code) public',
    'function computeAddress(bytes32 salt, bytes32 codeHash) public view returns (address)',
  ]),
} as const

export async function create2Deploy({
  initCode,
  salt = '0x0000000000000000000000000000000000000000000000000000000000000000',
}: Create2DeployProps) {
  const publicClient = await hre.viem.getPublicClient()
  const walletClients = await hre.viem.getWalletClients()
  const walletClient = walletClients[0]

  const expectedAddress = await publicClient.readContract({
    ...create2Factory,
    functionName: 'computeAddress',
    args: [salt, keccak256(initCode)],
  })

  const deployTx = await walletClient.writeContract({
    ...create2Factory,
    functionName: 'deploy',
    args: [0n, salt, initCode],
  })

  await publicClient.waitForTransactionReceipt({ hash: deployTx })

  return { address: expectedAddress }
}
