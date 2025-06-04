// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import { AggregatorV3Interface } from "../lib/chainlink-brownie-contracts/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import { PriceConverter } from "./PriceConverter.sol";

error CrowdFunding__NotOwner();
error CrowdFunding__WithdrawFailed();

contract CrowdFunding {
    using PriceConverter for uint256;

    mapping(address => uint256) public addressToAmountFunded;
    address[] public funders;

    address public immutable i_owner;
    uint256 public constant MINIMUM_USD = 5 * 10 ** 18;
    AggregatorV3Interface private s_priceFeed;

    // Eventos básicos para tracking
    event FundReceived(address indexed funder, uint256 amount);
    event FundsWithdrawn(address indexed owner, uint256 amount);

    constructor(address priceFeed) {
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeed);
    }

    function fund() public payable {
        require(msg.value.getConversionRate(s_priceFeed) >= MINIMUM_USD, "El monto minimo es 5 USD");
        
        // Solo agregar al array si es un nuevo donante (evita duplicados)
        if (addressToAmountFunded[msg.sender] == 0) {
            funders.push(msg.sender);
        }
        
        addressToAmountFunded[msg.sender] += msg.value;
        emit FundReceived(msg.sender, msg.value);
    }

    function getVersion() public view returns (uint256) {
        return s_priceFeed.version();
    }

    modifier onlyOwner() {
        if (msg.sender != i_owner) revert CrowdFunding__NotOwner();
        _; // continua con la ejecución de la función
    }

    function withdraw() public onlyOwner {
        uint256 contractBalance = address(this).balance;
        
        // Limpiar mappings y array
        for (uint256 funderIndex = 0; funderIndex < funders.length; funderIndex++) {
            address funder = funders[funderIndex];
            addressToAmountFunded[funder] = 0;
        }
        funders = new address[](0);

        // Transferir fondos
        (bool callSuccess,) = payable(msg.sender).call{value: contractBalance}("");
        if (!callSuccess) revert CrowdFunding__WithdrawFailed();
        
        emit FundsWithdrawn(msg.sender, contractBalance);
    }

    function getTotalFunded() public view returns (uint256) {
        return address(this).balance;
    }

    function getTotalFundedInUSD() public view returns (uint256) {
        return address(this).balance.getConversionRate(s_priceFeed);
    }

    function getFundersCount() public view returns (uint256) {
        return funders.length;
    }

    fallback() external payable {
        fund();
    }

    receive() external payable {
        fund();
    }
}