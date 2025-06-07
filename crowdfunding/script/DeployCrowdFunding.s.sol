// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import { Script } from "forge-std/Script.sol";
import { CrowdFunding } from "../src/CrowdFunding.sol";
import { HelperConfig } from "./HelperConfig.s.sol";
import { NFT } from "../src/NFT.sol";

contract DeployCrowdFunding is Script {
    function run() external returns (CrowdFunding crowdFunding) {
        // antes del broadcast no estamos enviando transacciones
        HelperConfig helperConfig = new HelperConfig();
        address ethUsdPriceFeed = helperConfig.activeNetworkConfig();

        NFT nft = new NFT();
        vm.startBroadcast(); // inicia la transmisión de transacciones
        crowdFunding = new CrowdFunding(ethUsdPriceFeed, address(nft),10,100);
        vm.stopBroadcast();
        
        return crowdFunding;
    }

}