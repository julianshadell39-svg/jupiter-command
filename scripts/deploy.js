import { network } from "hardhat";

async function main() {
  const connection = await network.create();
  const { ethers } = connection;

  try {
    const [deployer] = await ethers.getSigners();
    console.log(`Deploying Counter with account ${deployer.address}`);

    const counter = await ethers.deployContract("Counter");
    await counter.waitForDeployment();

    console.log(`Counter deployed to ${await counter.getAddress()}`);
    console.log(`Initial counter value: ${await counter.current()}`);
  } finally {
    await connection.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
