import { parseAbi } from 'viem'

export const erc20WithVotesAbi = parseAbi([
  'function getVotes(address account) view returns (uint256)',
])

export const delegatePoolsAddress = '0x0000000000572fA1d5fc39988eD0785AF08B0d99'

export const delegatePoolsEventsAbi = parseAbi([
  'event PoolCreated(uint256 indexed minVotes, uint256 groupId)',
  'event PoolJoined(uint256 indexed minVotes, address indexed member, uint256 identityCommitment)',
])

export const delegatePoolsAbi = [
  ...delegatePoolsEventsAbi,
  ...parseAbi([
    'error PoolDoesNotExist(uint256 minVotes)',
    'error AlreadyJoined(address delegate, uint256 minVotes)',
    'error InsufficientVotes(uint256 votes, uint256 minVotes)',
    'function joinPool(uint256 minVotes, uint256 identityCommitment) external',
    'function joinPools(uint256[] minVotes, uint256 identityCommitment) external',
    'function verifyStatement(uint256 minVotes, string statement, bytes proof) external view returns (bool)',
  ]),
] as const
