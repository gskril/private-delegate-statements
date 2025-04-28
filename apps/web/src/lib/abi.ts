import { parseAbi } from 'viem'

export const erc20WithVotesAbi = parseAbi([
  'function getVotes(address account) view returns (uint256)',
])

export const delegatePoolsAddress = '0x0000000000D4BB6B814f94dE0a9d7b1c14864065'

export const delegatePoolsEventsAbi = parseAbi([
  'event PoolCreated(uint256 indexed minVotes, uint256 indexed groupId)',
  'event PoolJoined(uint256 indexed minVotes, address indexed member)',
])

export const delegatePoolsAbi = [
  ...delegatePoolsEventsAbi,
  ...parseAbi([
    'error PoolDoesNotExist(uint256 minVotes)',
    'error InsufficientVotes(uint256 votes, uint256 minVotes)',
    'function joinPool(uint256 minVotes, uint256 identityCommitment) external',
    'function joinPools(uint256[] calldata minVotes, uint256 identityCommitment) external',
    'function verifyMessage(uint256 groupId, (uint256 merkleTreeDepth, uint256 merkleTreeRoot, uint256 nullifier, uint256 message, uint256 scope, uint256[8] points)) external view returns (bool)',
  ]),
] as const
