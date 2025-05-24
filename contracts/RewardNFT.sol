// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RewardNFT is ERC721, Ownable {
    uint256 public currentId;

    constructor() ERC721("CrowdReward", "CRWDNFT") Ownable(msg.sender) {}

    function mint(address to) external onlyOwner {
        _safeMint(to, currentId);
        currentId++;
    }
}
