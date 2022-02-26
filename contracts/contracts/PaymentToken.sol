// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.3;

import "OpenZeppelin/openzeppelin-contracts@4.1.0/contracts/token/ERC20/ERC20.sol";
import "OpenZeppelin/openzeppelin-contracts@4.1.0/contracts/access/Ownable.sol";

contract PaymentToken is ERC20, Ownable {
    constructor() ERC20("Payment Token", "PT") {}

    function mint(address to, uint256 value) public {
        _mint(to, value);
    }
}
