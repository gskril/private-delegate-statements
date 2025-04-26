// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@semaphore-protocol/contracts/base/SemaphoreVerifier.sol";
import "@semaphore-protocol/contracts/Semaphore.sol";

contract DelegatePools is Ownable {
    /*//////////////////////////////////////////////////////////////
                            STATE VARIABLES
    //////////////////////////////////////////////////////////////*/

    /// @notice The governance token of the relevant DAO.
    /// @dev Must implement ERC20Votes.
    ERC20Votes public immutable token;

    /// @notice The Semaphore contract.
    Semaphore public immutable semaphore;

    /// @notice A mapping of the minimum votes required to join a pool to the Semaphore group ID.
    mapping(uint256 minVotes => uint256 groupId) public pools;

    /*//////////////////////////////////////////////////////////////
                                 EVENTS
    //////////////////////////////////////////////////////////////*/

    event PoolCreated(uint256 indexed minVotes, uint256 indexed groupId);
    event PoolJoined(uint256 indexed minVotes, address indexed member);

    /*//////////////////////////////////////////////////////////////
                                 ERRORS
    //////////////////////////////////////////////////////////////*/

    error InvalidAddress();
    error SemaphoreNotInitialized();
    error PoolDoesNotExist(uint256 minVotes);
    error PoolAlreadyExists(uint256 minVotes);
    error InsufficientVotes(uint256 votes, uint256 minVotes);

    /*//////////////////////////////////////////////////////////////
                              CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    constructor(
        address _token,
        address _owner,
        address _semaphore
    ) Ownable(_owner) {
        if (_token == address(0) || _semaphore == address(0)) {
            revert InvalidAddress();
        }

        token = ERC20Votes(_token);
        semaphore = Semaphore(_semaphore);
    }

    /*//////////////////////////////////////////////////////////////
                            PUBLIC FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function joinPool(uint256 minVotes, uint256 identityCommitment) external {
        _joinPool(minVotes, identityCommitment);
    }

    function joinPools(
        uint256[] calldata minVotes,
        uint256 identityCommitment
    ) external {
        for (uint256 i = 0; i < minVotes.length; i++) {
            _joinPool(minVotes[i], identityCommitment);
        }
    }

    function verifyMessage(
        uint256 groupId,
        Semaphore.SemaphoreProof calldata proof
    ) external view returns (bool) {
        return semaphore.verifyProof(groupId, proof);
    }

    function getVotes(address account) external view returns (uint256) {
        return token.getVotes(account);
    }

    /*//////////////////////////////////////////////////////////////
                            ADMIN FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function createPool(uint256 minVotes) external onlyOwner returns (uint256) {
        uint256 groupId = pools[minVotes];

        // Only allow one pool per `minVotes`
        if (groupId != 0) {
            revert PoolAlreadyExists(minVotes);
        }

        // Require that the Semaphore instance has been used at least once to avoid edge cases with a group ID of 0
        if (semaphore.groupCounter() == 0) {
            revert SemaphoreNotInitialized();
        }

        // Create the underlying Semaphore group
        groupId = semaphore.createGroup(address(this));
        pools[minVotes] = groupId;
        emit PoolCreated(minVotes, groupId);

        return groupId;
    }

    /*//////////////////////////////////////////////////////////////
                           INTERNAL FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function _joinPool(uint256 minVotes, uint256 identityCommitment) internal {
        // Check if a Semaphore group exists for the given `minVotes`
        if (pools[minVotes] == 0) {
            revert PoolDoesNotExist(minVotes);
        }

        // Check if the user has enough votes
        if (token.getVotes(msg.sender) < minVotes) {
            revert InsufficientVotes(token.getVotes(msg.sender), minVotes);
        }

        // Add the user to the Semaphore group
        semaphore.addMember(pools[minVotes], identityCommitment);
        emit PoolJoined(minVotes, msg.sender);
    }
}
