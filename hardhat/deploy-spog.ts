import { JsonRpcProvider } from "@ethersproject/providers";
import { Wallet } from "@ethersproject/wallet";
import { ContractFactory, BigNumber } from "ethers";

import dualGovernor from "../contracts/out/DualGovernor.sol/DualGovernor.json";
import erc20Mock from "../contracts/out/ERC20Mock.sol/ERC20Mock.json";
import voteAuction from "../contracts/out/VoteAuction.sol/VoteAuction.json";
import spogVault from "../contracts/out/SPOGVault.sol/SPOGVault.json";
import voteToken from "../contracts/out/VOTE.sol/VOTE.json";
import valueToken from "../contracts/out/VALUE.sol/VALUE.json";

import spog from "../contracts/out/SPOG.sol/SPOG.json";
import multicall3 from "./contracts/Multicall3.json";

import { Network } from "./setup";

export default async function deploySpog(network: Network) {
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
  const voteAuctionFactory = new ContractFactory(
    voteAuction.abi,
    voteAuction.bytecode,
    wallet
  );
  const spogVaultFactory = new ContractFactory(
    spogVault.abi,
    spogVault.bytecode,
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
    multicall3.abi,
    multicall3.bytecode,
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

  const auctionContract = await voteAuctionFactory.deploy();

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

  const vaultContract = await spogVaultFactory.deploy(governorContract.address);

  const spogContract = await spogFactory.deploy([
    governorContract.address,
    vaultContract.address,
    cashContract.address,
    tax,
    taxLowerBound,
    taxUpperBound,
    inflator,
    valueFixedInflation,
  ]);

  const multicall3Contract = await multicallFactory.deploy();

  console.log("SPOG address: ", spogContract.address);
  console.log("SPOGVote token address: ", voteTokenContract.address);
  console.log("SPOGValue token address: ", valueTokenContract.address);
  console.log("DualGovernor address: ", governorContract.address);
  console.log("Cash address: ", cashContract.address);
  console.log("Vault address: ", vaultContract.address);
  console.log("Auction address: ", auctionContract.address);
  console.log("Multicall3 address: ", multicall3Contract.address);
}
