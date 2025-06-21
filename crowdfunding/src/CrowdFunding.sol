// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import { NFT } from "./NFT.sol";
import { AggregatorV3Interface } from "../lib/chainlink-brownie-contracts/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import { PriceConverter } from "./PriceConverter.sol";

import "../lib/openzeppelin-contracts-upgradeable/contracts/proxy/utils/Initializable.sol";
import "../lib/openzeppelin-contracts-upgradeable/contracts/access/OwnableUpgradeable.sol";
import "../lib/openzeppelin-contracts-upgradeable/contracts/proxy/utils/UUPSUpgradeable.sol";

//error CrowdFunding__NotOwner();
error CrowdFunding__WithdrawFailed();

contract CrowdFunding is Initializable, OwnableUpgradeable, UUPSUpgradeable {
    using PriceConverter for uint256;

    //Mapeo de aportes y lista de funders
    mapping(address => uint256) public addressToAmountFunded;
    address[] public funders;

    //Contratos auxiliares
    NFT private s_nftContract;
    AggregatorV3Interface private s_priceFeed;

    //Parametros de campaña
    uint256 public i_deadline;
    uint256 public i_goalUSD;
    uint256 public constant MINIMUM_USD = 5 * 10 ** 18;

    //Eventos
    event FundReceived(address indexed funder, uint256 amount);
    event FundsWithdrawn(address indexed owner, uint256 amount);
    event RefundIssued(address indexed funder, uint256 amount);

    //Inicializador del contrato
    function initialize(
        address priceFeedM,
        address nftAddress,
        uint256 durationInMinutes,
        uint256 goalUSD
    ) public initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();

        require(goalUSD > 0, "Meta tiene que ser > 0");

        s_priceFeed = AggregatorV3Interface(priceFeedM);
        s_nftContract = NFT(nftAddress);
        i_deadline = block.timestamp + (durationInMinutes * 1 minutes);
        i_goalUSD = goalUSD;
    }

    //se permiten aportes siempre que no haya pasado el deadline
    function fund() public payable {
        require(block.timestamp <= i_deadline, "El periodo para hacer aportes esta finalizado");
        require(msg.value.getConversionRate(s_priceFeed) >= MINIMUM_USD, "Minimo 5 USD");
        //Si es un nuevo aporetante se agrega al array
        if (addressToAmountFunded[msg.sender] == 0) {
            funders.push(msg.sender);
        }

        addressToAmountFunded[msg.sender] += msg.value;
        emit FundReceived(msg.sender, msg.value);
    }

    // Version del price feed
    function getVersion() public view returns (uint256) {
        return s_priceFeed.version();
    }

    // control para  ejecutar funciones despues de que haya pasado el plazo de aportes
    modifier onlyAfterDeadline() {
        require(block.timestamp > i_deadline, "El periodo de aportes continua vigente");
        _;
    }

    // Retira fondos al owner solo si se alcanzó la meta
    function withdraw() public onlyOwner onlyAfterDeadline {
        require(getTotalFundedInUSD() >= i_goalUSD, "no se alcanzo el objetivo no se pueden retirar fondos");

        //Recompensa aleatoria antes de resetear estado
        rewardRandomFunder("ipfs://bafkreifmcavpce5i23st64h2u2336hioktks2rhmnczb7f6gftidpzj5ni");

        //Limpiar mapping de aportes
        for (uint256 i = 0; i < funders.length; i++) {
            address funder = funders[i];
            addressToAmountFunded[funder] = 0;
        }
        //Vaciar lista de funders
        delete funders;

        //Transferir fondos
        uint256 contractBalance = address(this).balance;
        (bool sent, ) = payable(owner()).call{value: contractBalance}("");
        if (!sent) revert CrowdFunding__WithdrawFailed();

        emit FundsWithdrawn(owner(), contractBalance);
    }

    //Balance interno en ETH
    function getTotalFunded() public view returns (uint256) {
        return address(this).balance;
    }

    // Balance convertido a USD
    function getTotalFundedInUSD() public view returns (uint256) {
        return address(this).balance.getConversionRate(s_priceFeed);
    }

    //Cantidad de funders
    function getFundersCount() public view returns (uint256) {
        return funders.length;
    }

    //Fallbacks que redirigen a fund
    fallback() external payable {
        fund();
    }
    receive() external payable {
        fund();
    }

    //Emite un NFT a un funder aleatorio
    function rewardRandomFunder(string memory tokenURI) public onlyOwner {
        uint256 count = getFundersCount();
        require(count > 0, "No funders to reward");

        uint256 index = uint256(
            keccak256(abi.encodePacked(block.timestamp, block.prevrandao))
        ) % count;
        address winner = funders[index];

        s_nftContract.mintNFT(winner, tokenURI);
    }

    //Reembolso a aportantes si no se alcanzo la meta
    function refund() public onlyAfterDeadline {
        require(getTotalFundedInUSD() < i_goalUSD, "Objetivo alcanzado");
        uint256 amount = addressToAmountFunded[msg.sender];
        require(amount > 0, "Sin fondos para reclamar");

        addressToAmountFunded[msg.sender] = 0;
        (bool sent, ) = payable(msg.sender).call{value: amount}("");
        require(sent, "Error en el reembolso");

        emit RefundIssued(msg.sender, amount);
    }

    //Porcentaje de progreso
    function getProgress() public view returns (uint256) {
        uint256 totalUSD = getTotalFundedInUSD();
        if (totalUSD >= i_goalUSD) {
            return 100;
        }
        return (totalUSD * 100) / i_goalUSD;
    }

    //Extiende el deadline si el owner lo desea
    function extendDeadline(uint256 additionalMinutes) public onlyOwner {
        i_deadline += additionalMinutes * 1 minutes;
    }

    //Autoriza upgrades solo al owner
    function _authorizeUpgrade(address) internal override onlyOwner {}
}
