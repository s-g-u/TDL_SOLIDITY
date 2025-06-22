// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import { Script } from "forge-std/Script.sol";
import { CrowdFunding } from "../src/CrowdFunding.sol";
import { HelperConfig } from "./HelperConfig.s.sol";
import { NFT } from "../src/NFT.sol";
import { CashbackToken } from "../src/CashbackToken.sol";

contract DeployCrowdFunding is Script {
    function run() external returns (CrowdFunding crowdFunding) {
        // antes del broadcast no estamos enviando transacciones
        HelperConfig helperConfig = new HelperConfig();
        address ethUsdPriceFeed = helperConfig.activeNetworkConfig();

        vm.startBroadcast(); // inicia la transmisión de transacciones
        NFT nft = new NFT(msg.sender);
        CashbackToken cashbackToken = new CashbackToken(msg.sender);
        crowdFunding = new CrowdFunding(ethUsdPriceFeed, address(nft),10, 100 * 10**18, address(cashbackToken));
        
        // Transferir ownership del CashbackToken al contrato CrowdFunding
        // para que pueda mintear tokens como cashback
        cashbackToken.transferOwnership(address(crowdFunding));
        vm.stopBroadcast();
        
        return crowdFunding;
    }

}