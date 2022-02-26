// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.3;

import "OpenZeppelin/openzeppelin-contracts@4.1.0/contracts/token/ERC721/ERC721.sol";
import "OpenZeppelin/openzeppelin-contracts@4.1.0/contracts/utils/structs/EnumerableSet.sol";
import "OpenZeppelin/openzeppelin-contracts@4.1.0/contracts/access/AccessControl.sol";
import "OpenZeppelin/openzeppelin-contracts@4.1.0/contracts/utils/cryptography/ECDSA.sol";

contract NFT is ERC721, AccessControl {
    using ECDSA for bytes32;
    using EnumerableSet for EnumerableSet.UintSet;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    string public baseUri;
    uint256 public lastTokenId;
    mapping (bytes32 => bool) public mintedArtworks;
    mapping (address => EnumerableSet.UintSet) internal ownedTokens;

    event Mint(address indexed minter, bytes32 indexed artworkUuid, uint256[] tokens);

    constructor(string memory baseUri_) ERC721("Token", "NFT") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
        baseUri = baseUri_;
    }

    function changeBaseUri(string memory newBaseUri) public {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "no permission");
        baseUri = newBaseUri;
    }

    function _baseURI() override internal view returns (string memory) {
        return baseUri;
    }

    function mint(uint256 amount, bytes32 uuid, bytes memory sig) public {
        require(hasRole(MINTER_ROLE, keccak256(abi.encodePacked(_msgSender(), amount, uuid, address(this))).toEthSignedMessageHash().recover(sig)), "invalid signature");
        require(!mintedArtworks[uuid], "already minted");
        uint256 startToken = lastTokenId;
        uint256[] memory mintedTokens = new uint256[](amount);
        for (uint256 i = 0; i < amount; i++) {
            uint256 tokenId = startToken + i + 1;
            _mint(_msgSender(), tokenId);
            mintedTokens[i] = tokenId;
        }
        emit Mint(_msgSender(), uuid, mintedTokens);
        lastTokenId += amount;
    }

    function supportsInterface(bytes4 interfaceId) override(AccessControl, ERC721) public view returns (bool) {
        return ERC721.supportsInterface(interfaceId) || AccessControl.supportsInterface(interfaceId);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) override(ERC721) internal {
        ERC721._beforeTokenTransfer(from, to, tokenId);
        ownedTokens[from].remove(tokenId);
        ownedTokens[to].add(tokenId);
    }

    function ownedTokensByUser(address user) public view returns (bytes32[] memory) {
        return ownedTokens[user]._inner._values;
    }
}
