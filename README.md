# Sample Hardhat Project
Install dependencies: 
```shell
npm install --save-dev @nomicfoundation/hardhat-toolbox
npm install @openzeppelin/contracts
```

To run the project in one terminal run

```shell
npx hardhat node
```

And in another terminal:

```shell
npx hardhat run scripts/deploy.js --network localhost
```

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js
```
