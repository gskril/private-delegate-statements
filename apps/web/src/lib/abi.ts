import { parseAbi } from 'viem'

export const erc20WithVotesAbi = parseAbi([
  'function getVotes(address account) view returns (uint256)',
])

export const delegatePoolsEventsAbi = parseAbi([
  'event PoolCreated(uint256 indexed minVotes, uint256 indexed groupId)',
  'event PoolJoined(uint256 indexed minVotes, address indexed member)',
])
