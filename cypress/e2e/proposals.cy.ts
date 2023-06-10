import spog from "@mzero-labs/spog/out/SPOG.sol/SPOG.json";
import dualGovernor from "@mzero-labs/spog/out/DualGovernor.sol/DualGovernor.json";
import erc20Mock from "@mzero-labs/spog/out/ERC20Mock.sol/ERC20Mock.json";
import erc20PricelessAuction from "@mzero-labs/spog/out/ERC20PricelessAuction.sol/ERC20PricelessAuction.json";
import listFactory from "@mzero-labs/spog/out/ListFactory.sol/ListFactory.json";
import valueVault from "@mzero-labs/spog/out/ValueVault.sol/ValueVault.json";
import voteVault from "@mzero-labs/spog/out/VoteVault.sol/VoteVault.json";
import voteToken from "@mzero-labs/spog/out/VoteToken.sol/VoteToken.json";
import valueToken from "@mzero-labs/spog/out/ValueToken.sol/ValueToken.json";

import { JsonRpcProvider } from "@ethersproject/providers";
import { Wallet } from "@ethersproject/wallet";
import { ContractFactory, BigNumber } from "ethers";

before(() => {
  console.log("before all setup");
  cy.task("hardhat:reset");
  cy.task("hardhat").then(async (network: any) => {
    console.log(network);
    const provider = new JsonRpcProvider(network.url);
    const wallet = new Wallet(network.accounts[0].privateKey, provider);

    const spogFactory = new ContractFactory(spog.abi, spog.bytecode, wallet);
    const dualGovernorFactory = new ContractFactory(
      dualGovernor.abi,
      dualGovernor.bytecode,
      wallet
    );
    const erc20MockFactory = new ContractFactory(
      erc20Mock.abi,
      erc20Mock.bytecode,
      wallet
    );
    const erc20PricelessAuctionFactory = new ContractFactory(
      erc20PricelessAuction.abi,
      erc20PricelessAuction.bytecode,
      wallet
    );
    const listFactoryFactory = new ContractFactory(
      listFactory.abi,
      listFactory.bytecode,
      wallet
    );
    const valueVaultFactory = new ContractFactory(
      valueVault.abi,
      valueVault.bytecode,
      wallet
    );
    const voteVaultFactory = new ContractFactory(
      voteVault.abi,
      voteVault.bytecode,
      wallet
    );
    const voteTokenFactory = new ContractFactory(
      voteToken.abi,
      voteToken.bytecode,
      wallet
    );
    const valueTokenFactory = new ContractFactory(
      valueToken.abi,
      valueToken.bytecode,
      wallet
    );

    const cashContract = await erc20MockFactory.deploy(
      "Wrapped ETH",
      "WETH",
      network.accounts[0].address,
      BigNumber.from(100).mul(BigNumber.from("1000000000000000000"))
    );

    const inflator = BigNumber.from(10);
    const valueFixedInflation = BigNumber.from(1000).mul(
      BigNumber.from("1000000000000000000")
    );

    const time = BigNumber.from(100); // in blocks
    const voteQuorum = BigNumber.from(4); // 4%
    const valueQuorum = BigNumber.from(4); // 4%
    const tax = BigNumber.from(5).mul(BigNumber.from("10000000000000000"));
    const taxLowerBound = BigNumber.from(0);
    const taxUpperBound = BigNumber.from(5).mul(
      BigNumber.from("1000000000000000000")
    );

    const valueTokenContract = await valueTokenFactory.deploy(
      "SPOG Value",
      "VALUE"
    );
    const voteTokenContract = await voteTokenFactory.deploy(
      "SPOG Vote",
      "VOTE",
      valueTokenContract.address
    );
    const auctionContract = await erc20PricelessAuctionFactory.deploy();

    const governorContract = await dualGovernorFactory.deploy(
      "SPOG Governor",
      voteTokenContract.address,
      valueTokenContract.address,
      voteQuorum,
      valueQuorum,
      time
    );
    const voteVaultContract = await voteVaultFactory.deploy(
      governorContract.address,
      auctionContract.address
    );
    const valueVaultContract = await valueVaultFactory.deploy(
      governorContract.address
    );
    const listFactoryContract = await listFactoryFactory.deploy();

    const spogContract = await spogFactory.deploy([
      governorContract.address,
      voteVaultContract.address,
      valueVaultContract.address,
      cashContract.address,
      tax,
      taxLowerBound,
      taxUpperBound,
      inflator,
      valueFixedInflation,
    ]);

    console.log("SPOG address: ", spogContract.address);
    console.log("SPOGVote token address: ", voteTokenContract.address);
    console.log("SPOGValue token address: ", valueTokenContract.address);
    console.log("DualGovernor address: ", governorContract.address);
    console.log("Cash address: ", cashContract.address);
    console.log("Vote holders vault address: ", voteVaultContract.address);
    console.log("Value holders vault address: ", valueVaultContract.address);
    console.log("List factory address: ", listFactoryContract.address);
  });
});

after(() => {
  console.log("after all teardown");
});

describe("template spec", async () => {
  it("passes", () => {
    cy.task("hardhat").then((network) => {
      console.log(network);
      cy.visit("http://localhost:3000/");
    });
  });
});
