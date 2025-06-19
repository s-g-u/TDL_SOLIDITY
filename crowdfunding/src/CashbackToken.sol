// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CashbackToken is ERC20, Ownable {
    constructor() ERC20("CashbackToken", "CBK") {}

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
