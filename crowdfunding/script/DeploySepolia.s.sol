// script/DeploySepolia.s.sol
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "../src/NFT.sol";
import "../src/CrowdFunding.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract DeploySepolia is Script {
    function run() external {
        // Parámetros:
        address priceFeed = 0x694AA1769357215DE4FAC081bf1f309aDC325306;
        uint256 duration  = 7 days;
        uint256 goal      = 1 ether;

        vm.startBroadcast();

        // 1) Despliegue del NFT
        NFT nft = new NFT();
        address nftAddress = address(nft);
        console.log("NFT deployed at:", nftAddress);

        // 2) Despliegue de CrowdFunding impl + proxy
        CrowdFunding impl = new CrowdFunding();
        bytes memory initData = abi.encodeWithSelector(
            CrowdFunding.initialize.selector,
            priceFeed,
            nftAddress,
            duration,
            goal
        );
        ERC1967Proxy proxy = new ERC1967Proxy(
            address(impl),
            initData
        );
        console.log("CrowdFunding proxy deployed at:", address(proxy));

        vm.stopBroadcast();
    }
}
