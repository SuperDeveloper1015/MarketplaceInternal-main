// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.3;

import "OpenZeppelin/openzeppelin-contracts@4.1.0/contracts/token/ERC20/IERC20.sol";
import "OpenZeppelin/openzeppelin-contracts@4.1.0/contracts/token/ERC20/utils/SafeERC20.sol";
import "OpenZeppelin/openzeppelin-contracts@4.1.0/contracts/access/Ownable.sol";

contract Deposit is Ownable {
    using SafeERC20 for IERC20;

    IERC20 paymentToken;
    address masterAddress;

    event Deposit(uint256 indexed profileId, uint256 value);

    constructor(IERC20 paymentToken_, address masterAddress_) {
        paymentToken = paymentToken_;
        masterAddress = masterAddress_;
    }

    function changePaymentToken(IERC20 newToken) public onlyOwner {
        paymentToken = newToken;
    }

    function changeMasterAddress(address newAddress) public onlyOwner {
        masterAddress = newAddress;
    }

    function deposit(uint256 profileId, uint256 value) public {
        paymentToken.transferFrom(msg.sender, masterAddress, value);
        emit Deposit(profileId, value);
    }
}
