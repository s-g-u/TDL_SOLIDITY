// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT is ERC721URIStorage, Ownable {
    uint256 private s_tokenCounter;

    constructor(address initialOwner) ERC721("CrowdFundingNFT", "CFN") Ownable(initialOwner) {
        s_tokenCounter = 0;
    }

    function mintNFT(address recipient, string memory tokenURI) external onlyOwner returns (uint256) {
        uint256 newItemId = s_tokenCounter;
        _safeMint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);
        s_tokenCounter += 1;
        return newItemId;
    }
}
