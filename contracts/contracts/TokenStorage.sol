// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.3;

import "OpenZeppelin/openzeppelin-contracts@4.1.0/contracts/token/ERC721/IERC721.sol";
import "OpenZeppelin/openzeppelin-contracts@4.1.0/contracts/token/ERC721/IERC721Receiver.sol";
import "OpenZeppelin/openzeppelin-contracts@4.1.0/contracts/access/AccessControl.sol";
import "OpenZeppelin/openzeppelin-contracts@4.1.0/contracts/utils/cryptography/ECDSA.sol";

contract TokenStorage is IERC721Receiver, AccessControl {
    using ECDSA for bytes32;

    bytes32 public constant SERVER_ROLE = keccak256("SERVER_ROLE");
    mapping (uint256 => bool) public storedTokens;
    IERC721 nft;

    event Stored(address indexed originalOwner, uint256 indexed tokenId);
    event Withdrawn(address indexed toOwner, uint256 indexed tokenId);

    constructor(IERC721 nft_) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(SERVER_ROLE, msg.sender);
        nft = nft_;
    }

    function onERC721Received(address /* operator */, address from, uint256 tokenId, bytes calldata /* data */) override external returns (bytes4) {
        storedTokens[tokenId] = true;
        emit Stored(from, tokenId);
        return this.onERC721Received.selector;
    }

    function withdraw(uint256 tokenId, bytes memory sig) external {
        require(hasRole(SERVER_ROLE, keccak256(abi.encodePacked(_msgSender(), tokenId, address(this))).toEthSignedMessageHash().recover(sig)), "invalid signature");
        require(storedTokens[tokenId], "token is not stored");
        nft.transferFrom(address(this), _msgSender(), tokenId);
        emit Withdrawn(_msgSender(), tokenId);
    }
}