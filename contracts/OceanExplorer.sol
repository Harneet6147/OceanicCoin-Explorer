// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract OceanExplorer {
    address payable owner;
    IERC20 public token;

    constructor(address tokenAddress) {
        token = IERC20(tokenAddress);
        owner = payable(msg.sender);
    }

    function claimReward(address _player, uint256 _coins) public {
        require(getBalance() >= _coins, "Contract out of Oceanic Coins!!");
        token.transfer(_player, _coins * (10 ** 18));
    }

    function getBalance() public view returns (uint256) {
        return token.balanceOf(address(this));
    }
}
