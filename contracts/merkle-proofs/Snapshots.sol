// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Merkle proof
struct Claim {
    bytes32[] proof;
    bytes32 leaf;
}

contract Snapshots is Ownable {
    mapping(uint256 => bytes32) public snapshots;

    constructor() {}

    function setSnapshot(uint256 _id, bytes32 _root) public onlyOwner {
        snapshots[_id] = _root;
    }

    function verify(uint256 _id, Claim memory _claim)
        public
        view
        returns (bool)
    {
        return MerkleProof.verify(_claim.proof, snapshots[_id], _claim.leaf);
    }
}
