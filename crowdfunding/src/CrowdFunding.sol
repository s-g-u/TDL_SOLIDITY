// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import { NFT } from "./NFT.sol";
import { AggregatorV3Interface } from "../lib/chainlink-brownie-contracts/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import { PriceConverter } from "./PriceConverter.sol";
import { CashbackToken } from "./CashbackToken.sol";

error CrowdFunding__NotOwner();
error CrowdFunding__WithdrawFailed();

contract CrowdFunding {
    using PriceConverter for uint256;

    mapping(address => uint256) public addressToAmountFunded;
    address[] public funders;

    NFT private s_nftContract;
    address public immutable i_owner;
    uint256 public constant MINIMUM_USD = 5 * 10 ** 18;
    AggregatorV3Interface private s_priceFeed;
    uint256 public  i_deadline;
    uint256 public immutable i_goalUSD;
    CashbackToken private s_token;
    uint256 public cashbackPercentage = 5;
    // Eventos básicos para tracking
    event FundReceived(address indexed funder, uint256 amount);
    event FundsWithdrawn(address indexed owner, uint256 amount);

    constructor(address priceFeedM, address nftAddress, uint256 durationInMinutes, uint256 goalUSD, address tokenAddress) {
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeedM);
        s_nftContract = NFT(nftAddress);
        i_deadline = block.timestamp + (durationInMinutes * 60);
        i_goalUSD = goalUSD; 
        s_token = CashbackToken(tokenAddress);
    }

    function fund() public payable {
        require(msg.value.getConversionRate(s_priceFeed) >= MINIMUM_USD, "El monto minimo es 5 USD");
        
        // Solo agregar al array si es un nuevo donante (evita duplicados)
        if (addressToAmountFunded[msg.sender] == 0) {
            funders.push(msg.sender);
        }
        
        addressToAmountFunded[msg.sender] += msg.value;
        emit FundReceived(msg.sender, msg.value);

        uint256 cashbackAmount = (msg.value * cashbackPercentage) / 100;
        s_token.mint(msg.sender, cashbackAmount);
    }

    function getVersion() public view returns (uint256) {
        return s_priceFeed.version();
    }

    modifier onlyOwner() {
        if (msg.sender != i_owner) revert CrowdFunding__NotOwner();
        _; // continua con la ejecución de la función
    }

    modifier onlyAfterDeadline() {
        require(block.timestamp > i_deadline, "Funding still ongoing");
        _;
    }

    function withdraw() public onlyOwner onlyAfterDeadline {
        uint256 fundedUSD = getTotalFundedInUSD();

        rewardRandomFunder("ipfs://bafkreibgi7vlha7b54idsxk44p6ncuykyxyqaxqg3qkoeakp5lshbvfmle");
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

    function rewardRandomFunder(string memory tokenURI) public onlyOwner {
        require(getFundersCount()> 0, "No funders to reward");

        uint256 index = uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty))) % getFundersCount();
        address winner = funders[index];

        s_nftContract.mintNFT(winner, tokenURI);
    }

    function refund() public onlyAfterDeadline {
    require(getTotalFundedInUSD() < i_goalUSD, "Objetivo alcanzado, no hay reembolsos");
    uint256 amount = addressToAmountFunded[msg.sender];
    require(amount > 0, "No tenes fondos para reclamar");

    addressToAmountFunded[msg.sender] = 0;
    (bool sent, ) = payable(msg.sender).call{value: amount}("");
    require(sent, "Error en el reembolso");
    }

    function getProgress() public view returns (uint256) {
        uint256 totalFundedUSD = getTotalFundedInUSD();
        if (totalFundedUSD >= i_goalUSD) {
            return 100;
        }
        return (totalFundedUSD * 100) / i_goalUSD;
    }

    function extendDeadline(uint256 additionalMinutes) public onlyOwner {
    i_deadline += additionalMinutes * 1 minutes;
    }


}
