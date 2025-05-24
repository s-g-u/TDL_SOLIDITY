// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./MyToken.sol";
import "./RewardNFT.sol";

contract Crowdfund {
    address public owner;
    MyToken public token;
    RewardNFT public nft;
    uint256 public goal;
    uint256 public totalContributed;
    bool public goalReached;
    address[] public contributors;

    mapping(address => uint256) public contributions;

    constructor(address _token, address _nft, uint256 _goal) {
        owner = msg.sender;
        token = MyToken(_token);
        nft = RewardNFT(_nft);
        goal = _goal;
    }

    function contribute(uint256 amount) public {
        require(!goalReached, "Goal already reached");

        token.transferFrom(msg.sender, address(this), amount);
        if (contributions[msg.sender] == 0) {
            contributors.push(msg.sender);
        }
        contributions[msg.sender] += amount;
        totalContributed += amount;

        if (totalContributed >= goal) {
            goalReached = true;
        }
    }

    function rewardRandomContributor() public {
        require(goalReached, "Goal not yet reached");
        require(msg.sender == owner, "Only owner can reward");

        uint256 randomIndex = uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty))) % contributors.length;
        address winner = contributors[randomIndex];
        nft.mint(winner);
    }
}
