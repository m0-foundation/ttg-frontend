import { JsonRpcProvider } from "@ethersproject/providers";
import { Wallet } from "@ethersproject/wallet";
import { ContractFactory, BigNumber } from "ethers";

import dualGovernor from "../../contracts/out/DualGovernor.sol/DualGovernor.json";
import erc20Mock from "../../contracts/out/ERC20Mock.sol/ERC20Mock.json";
import erc20PricelessAuction from "../../contracts/out/ERC20PricelessAuction.sol/ERC20PricelessAuction.json";
import listFactory from "../../contracts/out/ListFactory.sol/ListFactory.json";
import valueVault from "../../contracts/out/ValueVault.sol/ValueVault.json";
import voteVault from "../../contracts/out/VoteVault.sol/VoteVault.json";
import voteToken from "../../contracts/out/VoteToken.sol/VoteToken.json";
import valueToken from "../../contracts/out/ValueToken.sol/ValueToken.json";

import spog from "../../contracts/out/SPOG.sol/SPOG.json";
import { Network } from "./setup";
import multicall from "./multicall/out/Multicall3.sol/Multicall3.json";

export default async function deploySpog(network: Network) {
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

  const multicallFactory = new ContractFactory(
    multicall.abi,
    multicall.bytecode,
    wallet
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

  const cashContract = await erc20MockFactory.deploy(
    "Wrapped ETH",
    "WETH",
    network.accounts[0].address,
    BigNumber.from(100).mul(BigNumber.from("1000000000000000000"))
  );

  const auctionContract = await erc20PricelessAuctionFactory.deploy();

  const listFactoryContract = await listFactoryFactory.deploy();

  const valueTokenContract = await valueTokenFactory.deploy(
    "SPOG Value",
    "VALUE"
  );

  await valueTokenContract.grantRole(
    "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6",
    network.accounts[0].address
  );

  const voteTokenContract = await voteTokenFactory.deploy(
    "SPOG Vote",
    "VOTE",
    valueTokenContract.address
  );

  await voteTokenContract.grantRole(
    "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6",
    network.accounts[0].address
  );

  for (const account of network.accounts) {
    console.log("Minting tokens for account: ", account.address);
    await cashContract.mint(
      account.address,
      BigNumber.from("1000000000000000000000") // 1000
    );
    await valueTokenContract.mint(
      account.address,
      BigNumber.from("1000000000000000000000") // 1000
    );
    await voteTokenContract.mint(
      account.address,
      BigNumber.from("1000000000000000000000") // 1000
    );
  }

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

  const multicallContract = await multicallFactory.deploy();

  console.log("SPOG address: ", spogContract.address);
  console.log("SPOGVote token address: ", voteTokenContract.address);
  console.log("SPOGValue token address: ", valueTokenContract.address);
  console.log("DualGovernor address: ", governorContract.address);
  console.log("Cash address: ", cashContract.address);
  console.log("Vote holders vault address: ", voteVaultContract.address);
  console.log("Value holders vault address: ", valueVaultContract.address);
  console.log("List factory address: ", listFactoryContract.address);
  console.log("Multicall Contract: ", multicallContract.address);
}
