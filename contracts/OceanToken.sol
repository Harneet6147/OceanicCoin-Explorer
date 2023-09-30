// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract OceanCoin is ERC20 {
    address payable public owner;

    constructor() ERC20("OceanCoin", "ONC") {
        owner = payable(msg.sender);
        _mint(owner, 1000000 * (10 ** decimals()));
    }
}
