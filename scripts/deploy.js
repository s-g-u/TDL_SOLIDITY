const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying with account:", deployer.address);
  console.log("Balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  const Token = await ethers.getContractFactory("MyToken");
  const token = await Token.deploy();
  await token.waitForDeployment();
  console.log("Token deployed to:", await token.getAddress());

  const NFT = await ethers.getContractFactory("RewardNFT");
  const nft = await NFT.deploy();
  await nft.waitForDeployment();
  console.log("NFT deployed to:", await nft.getAddress());

  const goal = ethers.parseUnits("1000", 18); 
  const Crowdfund = await ethers.getContractFactory("Crowdfund");
  const crowdfunding = await Crowdfund.deploy(
    await token.getAddress(),
    await nft.getAddress(),
    goal
  );
  await crowdfunding.waitForDeployment();
  console.log("Crowdfunding contract deployed to:", await crowdfunding.getAddress());

  await nft.transferOwnership(await crowdfunding.getAddress());
  console.log("NFT ownership transferred to Crowdfund contract");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
