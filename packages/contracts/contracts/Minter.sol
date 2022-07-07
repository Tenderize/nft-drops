// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./merkle-proofs/Snapshots.sol";
import "./erc1155/ERC1155Mintable.sol";

contract Minter is Ownable, Snapshots {
    mapping(address => mapping(uint256 => bool)) internal claimed;

    ERC1155Mintable public token;

    event Claimed(uint256 indexed id, address indexed claimer);
    event Created(uint256 id, string uri, bytes32 merkleRoot);

    constructor() {
        token = new ERC1155Mintable();
    }

    function create(
        uint256 _initialSupply,
        string calldata _uri,
        bytes32 _merkleRoot
    ) public onlyOwner {
        uint256 id = token.create(_initialSupply, _uri);
        require(snapshots[id] == 0x0, "snapshot already exists");
        Snapshots.setSnapshot(id, _merkleRoot);
        emit Created(id, _uri, _merkleRoot);
    }

    function claim(uint256 _id, bytes32[] calldata _proof) public {
        _claimFor(_id, _proof, msg.sender, msg.sender);
    }

    function claimFor(
        uint256 _id,
        bytes32[] calldata _proof,
        address _for
    ) public {
        _claimFor(_id, _proof, msg.sender, _for);
    }

    function _claimFor(
        uint256 _id,
        bytes32[] calldata _proof,
        address _caller,
        address _for
    ) internal {
        require(
            Snapshots.verify(
                _id,
                Claim({
                    proof: _proof,
                    leaf: keccak256(abi.encodePacked(_caller))
                })
            ),
            "invalid claim"
        );

        require(!claimed[_caller][_id], "already claimed");
        token.mint(_id, _for, 1);

        emit Claimed(_id, _for);
    }
}
