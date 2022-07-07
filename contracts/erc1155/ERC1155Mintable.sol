pragma solidity ^0.8.15;

import "./ERC1155.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

/**
    @dev Mintable form of ERC1155
    Shows how easy it is to mint new items.
*/
contract ERC1155Mintable is ERC1155, Ownable {
    bytes4 private constant INTERFACE_SIGNATURE_URI = 0x0e89341c;

    // id => creators
    mapping(uint256 => address) public creators;

    // id => uri
    mapping(uint256 => string) public uris;

    // A nonce to ensure we have a unique id each time we mint.
    uint256 public nonce;

    modifier creatorOnly(uint256 _id) {
        require(creators[_id] == msg.sender);
        _;
    }

    // Creates a new token type and assings _initialSupply to minter
    function create(uint256 _initialSupply, string calldata _uri)
        external
        onlyOwner
        returns (uint256 _id)
    {
        _id = ++nonce;
        creators[_id] = msg.sender;
        balances[_id][msg.sender] = _initialSupply;
        uris[_id] = _uri;

        // Transfer event with mint semantic
        emit TransferSingle(
            msg.sender,
            address(0x0),
            msg.sender,
            _id,
            _initialSupply
        );

        if (bytes(_uri).length > 0) emit URI(_uri, _id);
    }

    function mint(
        uint256 _id,
        address _to,
        uint256 _quantity
    ) external creatorOnly(_id) {
        balances[_id][_to] += _quantity;
        // Emit the Transfer/Mint event.
        // the 0x0 source address implies a mint
        // It will also provide the circulating supply info.
        emit TransferSingle(msg.sender, address(0x0), _to, _id, _quantity);
    }

    // Batch mint tokens. Assign directly to _to[].
    function mintBatch(
        uint256 _id,
        address[] calldata _to,
        uint256[] calldata _quantities
    ) external creatorOnly(_id) {
        for (uint256 i = 0; i < _to.length; ++i) {
            address to = _to[i];
            uint256 quantity = _quantities[i];

            // Grant the items to the caller
            balances[_id][to] += quantity;

            // Emit the Transfer/Mint event.
            // the 0x0 source address implies a mint
            // It will also provide the circulating supply info.
            emit TransferSingle(msg.sender, address(0x0), to, _id, quantity);
        }
    }

    function setURI(string calldata _uri, uint256 _id)
        external
        creatorOnly(_id)
    {
        uris[_id] = _uri;
        emit URI(_uri, _id);
    }
}
