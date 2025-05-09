// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@semaphore-protocol/contracts/base/SemaphoreVerifier.sol";
import "@semaphore-protocol/contracts/Semaphore.sol";

contract DelegatePools is Ownable {
    /*//////////////////////////////////////////////////////////////
                                STRUCTS
    //////////////////////////////////////////////////////////////*/

    struct Member {
        uint256 minVotes;
        address delegate;
        uint256 identityCommitment;
    }

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

    /// @notice A mapping to keep track of which delegates have joined which pools.
    /// @dev The key is `keccak256(abi.encode(address, minVotes))` for efficient storage.
    mapping(bytes32 => bool) internal _delegatePools;

    /*//////////////////////////////////////////////////////////////
                                 EVENTS
    //////////////////////////////////////////////////////////////*/

    event PoolCreated(uint256 indexed minVotes, uint256 groupId);

    event PoolJoined(
        uint256 indexed minVotes,
        address indexed member,
        uint256 identityCommitment
    );

    /*//////////////////////////////////////////////////////////////
                                 ERRORS
    //////////////////////////////////////////////////////////////*/

    error InvalidAddress();
    error SemaphoreNotInitialized();
    error PoolDoesNotExist(uint256 minVotes);
    error PoolAlreadyExists(uint256 minVotes);
    error AlreadyJoined(address delegate, uint256 minVotes);
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
        _joinPool(minVotes, msg.sender, identityCommitment);
    }

    function joinPools(
        uint256[] calldata minVotes,
        uint256 identityCommitment
    ) external {
        for (uint256 i = 0; i < minVotes.length; i++) {
            _joinPool(minVotes[i], msg.sender, identityCommitment);
        }
    }

    /// @notice Verify a statement from an anonymous member of a pool.
    function verifyStatement(
        uint256 minVotes,
        string calldata statement,
        bytes calldata proof
    ) external view returns (bool) {
        (
            uint256 merkleTreeDepth,
            uint256 merkleTreeRoot,
            uint256 nullifier,
            uint256 scope,
            uint256[8] memory points
        ) = abi.decode(proof, (uint256, uint256, uint256, uint256, uint256[8]));

        uint256 semaphoreGroupId = pools[minVotes];

        ISemaphore.SemaphoreProof memory reconstructedProof = ISemaphore
            .SemaphoreProof({
                merkleTreeDepth: merkleTreeDepth,
                merkleTreeRoot: merkleTreeRoot,
                nullifier: nullifier,
                message: uint256(keccak256(bytes(statement))),
                scope: scope,
                points: points
            });

        return semaphore.verifyProof(semaphoreGroupId, reconstructedProof);
    }

    /// @notice Votes for an account at the previous block.
    /// @dev We use the previous block to prevent usage with flash loans.
    function getVotes(address account) public view returns (uint256) {
        return token.getPastVotes(account, block.number - 1);
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

    /// @notice Add a delegate to a pool without their signature. Useful for migrating to a new contract deployment.
    /// @dev Only callable by the owner. Still checks that the delegate has enough votes.
    function migrate(Member[] calldata members) external onlyOwner {
        for (uint256 i = 0; i < members.length; i++) {
            _joinPool(
                members[i].minVotes,
                members[i].delegate,
                members[i].identityCommitment
            );
        }
    }

    /*//////////////////////////////////////////////////////////////
                           INTERNAL FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function _joinPool(
        uint256 minVotes,
        address delegate,
        uint256 identityCommitment
    ) internal {
        // Check if a Semaphore group exists for the given `minVotes`
        if (pools[minVotes] == 0) {
            revert PoolDoesNotExist(minVotes);
        }

        // Check if the user has enough votes
        if (getVotes(delegate) < minVotes) {
            revert InsufficientVotes(getVotes(delegate), minVotes);
        }

        bytes32 delegatePoolKey = keccak256(abi.encode(delegate, minVotes));

        // Check if the user has already joined this pool
        if (_delegatePools[delegatePoolKey]) {
            revert AlreadyJoined(delegate, minVotes);
        }

        // Add the user to the Semaphore group
        semaphore.addMember(pools[minVotes], identityCommitment);
        _delegatePools[delegatePoolKey] = true;
        emit PoolJoined(minVotes, delegate, identityCommitment);
    }
}
