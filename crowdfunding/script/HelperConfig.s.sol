// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import { Script } from "forge-std/Script.sol";
import { MockV3Aggregator } from "../lib/chainlink-brownie-contracts/contracts/src/v0.8/tests/MockV3Aggregator.sol";

contract HelperConfig is Script {

    NetWorkConfig public activeNetworkConfig;

    uint8 public constant DECIMALS = 8;
    int256 public constant INITIAL_PRICE = 2000e8; // $2000 USD

    struct NetWorkConfig {
        address priceFeed;
    }

    constructor() {
        if (block.chainid == 11155111) { 
            activeNetworkConfig = getSepoliaEthConfig();
        } else if (block.chainid == 31337) { 
            activeNetworkConfig = getAnvilEthConfig();
        }
    }

    function getSepoliaEthConfig() public pure returns(NetWorkConfig memory) {
        NetWorkConfig memory spoliaConfig = NetWorkConfig({
            priceFeed: 0x694AA1769357215DE4FAC081bf1f309aDC325306
        });
        return spoliaConfig;
    }

    function getAnvilEthConfig() public returns(NetWorkConfig memory) {
        // Si ya tenemos un price feed activo, lo devolvemos (evita el re-deployment)
        if (activeNetworkConfig.priceFeed != address(0)) {
            return activeNetworkConfig;
        }

        // Desplegamos un mock aggregator para Anvil
        vm.startBroadcast();
        MockV3Aggregator mockPriceFeed = new MockV3Aggregator(DECIMALS, INITIAL_PRICE);
        vm.stopBroadcast();

        NetWorkConfig memory anvilConfig = NetWorkConfig({
            priceFeed: address(mockPriceFeed)
        });
        return anvilConfig;
    }

}