const hre = require("hardhat");

async function main() {
    const OceanExplorer = await hre.ethers.getContractFactory("OceanExplorer");
    const oceanExplorer = await OceanExplorer.deploy("0x4EB920caa009C7F17e870807e037682fFeD0558F")
    await oceanExplorer.waitForDeployment();
    console.log("Contract deployed for Game:", oceanExplorer.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
