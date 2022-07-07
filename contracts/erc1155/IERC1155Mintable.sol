// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "./IERC1155.sol";

interface IERC1155Mintable is IERC1155 {
    function create(uint256 _initialSupply, string calldata _uri)
        external
        returns (uint256 _id);

    function mint(
        uint256 _id,
        address _to,
        uint256 _quantity
    ) external;

    function mintBatch(
        uint256 _id,
        address[] calldata _to,
        uint256[] calldata _quantities
    ) external;
}
