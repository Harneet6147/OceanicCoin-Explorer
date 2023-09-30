const hre = require("hardhat");

async function main() {
  const OceanToken = await hre.ethers.deployContract("OceanCoin");
  await OceanToken.waitForDeployment();

  console.log(`Contract Address for token: ${OceanToken.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
