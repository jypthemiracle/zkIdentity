//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./Semaphore/IVerifier.sol";
import "./Semaphore/SemaphoreCore.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/// @title Greeters contract.
/// @dev The following code is just a example to show how Semaphore con be used.
contract Greeters is ERC721, SemaphoreCore, Ownable {
    // A new greeting is published every time a user's proof is validated.
    event NewGreeting(bytes32 greeting);

    // Greeters are identified by a Merkle root.
    // The offchain Merkle tree contains the greeters' identity commitments.
    uint256 public greeters;

    // The external verifier used to verify Semaphore proofs.
    IVerifier public verifier;

    constructor(uint256 _greeters, address _verifier) ERC721("Dark Forest Proof", "PROOF") {
        greeters = _greeters;
        verifier = IVerifier(_verifier);
    }

    // Only users who create valid proofs can greet.
    // The contract owner must only send the transaction and they will not know anything
    // about the identity of the greeters.
    // The external nullifier is in this example the root of the Merkle tree.
    function greet(
        bytes32 _greeting,
        uint256 _nullifierHash,
        uint256[8] calldata _proof
    ) external onlyOwner _onlyOneNullifierHash(_nullifierHash) {
        _verifyProof(_greeting, greeters, _nullifierHash, greeters, _proof, verifier);

        // Prevent double-greeting (nullifierHash = hash(root + identityNullifier)).
        // Every user can greet once.
        _saveNullifierHash(_nullifierHash);

        emit NewGreeting(_greeting);
    }
}
