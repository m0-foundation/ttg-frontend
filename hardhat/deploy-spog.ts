import { JsonRpcProvider } from "@ethersproject/providers";
import { Wallet } from "@ethersproject/wallet";
import { ContractFactory, BigNumber } from "ethers";

import IERC20 from "../contracts/out/ERC20Mock.sol/ERC20Mock.json";
import IAuction from "../contracts/out/Auction.sol/Auction.json";
import IVault from "../contracts/out/Vault.sol/Vault.json";
// import Vote from "../contracts/out/VOTE.sol/VOTE.json";
import IValue from "../contracts/out/VALUE.sol/VALUE.json";
import IRegistrar from "../contracts/out/Registrar.sol/Registrar.json";
import DualGovernor from "../contracts/out/DualGovernor.sol/DualGovernor.json";
import IGovernanceDeployer from "../contracts/out/GovernanceDeployer.sol/GovernanceDeployer.json";
import IGovernorDeployer from "../contracts/out/GovernorDeployer.sol/GovernorDeployer.json";
import IVoteDeployer from "../contracts/out/VoteDeployer.sol/VoteDeployer.json";

// import spog from "../contracts/out/SPOG.sol/SPOG.json";
import multicall3 from "./contracts/Multicall3.json";

import { Network } from "./setup";

export default async function deploySpog(network: Network) {
  const provider = new JsonRpcProvider(network.url);
  const wallet = new Wallet(network.accounts[0].privateKey, provider);
  const owner = network.accounts[0].address;
  const expectedRegistrar = network.accounts[0].address; // ??
  // const expectedGovernanceDeployer = network.accounts[0].address; ??

  /* FACTORIES */
  console.log("FACTORIES");
  const ERC20 = new ContractFactory(IERC20.abi, IERC20.bytecode, wallet);
  const Value = new ContractFactory(IValue.abi, IValue.bytecode, wallet);
  const Vault = new ContractFactory(IVault.abi, IVault.bytecode, wallet);
  const Auction = new ContractFactory(IAuction.abi, IAuction.bytecode, wallet);
  const GovernorDeployer = new ContractFactory(
    IGovernorDeployer.abi,
    IGovernorDeployer.bytecode,
    wallet
  );
  const VoteDeployer = new ContractFactory(
    IVoteDeployer.abi,
    IVoteDeployer.bytecode,
    wallet
  );

  const GovernanceDeployer = new ContractFactory(
    IGovernanceDeployer.abi,
    IGovernanceDeployer.bytecode,
    wallet
  );

  const Registrar = new ContractFactory(
    IRegistrar.abi,
    IRegistrar.bytecode,
    wallet
  );

  const Multicall = new ContractFactory(
    multicall3.abi,
    multicall3.bytecode,
    wallet
  );

  /* DEPLOY */
  console.log("DEPLOY");
  const valueContract = await Value.deploy(
    "Registrar Value",
    "VALUE",
    expectedRegistrar
  );
  console.log({ valueContract: valueContract.address });

  const vaultContract = await Vault.deploy(valueContract.address);
  console.log({ vaultContract: vaultContract.address });

  const cashContract = await ERC20.deploy(
    "Wrapped ETH",
    "WETH",
    network.accounts[0].address,
    BigNumber.from(100).mul(BigNumber.from("1000000000000000000"))
  );
  console.log({ cashContract: cashContract.address });

  const auctionContract = await Auction.deploy();
  console.log({ auctionContract: auctionContract.address });

  const governorDeployerContract = await GovernorDeployer.deploy(owner);
  console.log({ governorDeployerContract: governorDeployerContract.address });

  const voteDeployerContract = await VoteDeployer.deploy(owner);
  console.log({ voteDeployerContract: voteDeployerContract.address });

  const governanceDeployerContract = await GovernanceDeployer.deploy(
    expectedRegistrar,
    governorDeployerContract.address,
    voteDeployerContract.address
  );
  console.log({
    governanceDeployerContract: governanceDeployerContract.address,
  });

  const multicall3Contract = await Multicall.deploy();
  console.log({
    multicall3Contract: multicall3Contract.address,
  });
  /* COFNIG */
  console.log("CONFIG");
  const inflator = BigNumber.from(20);
  const fixedReward = BigNumber.from(1000).mul(
    BigNumber.from("1000000000000000000")
  );
  const time = BigNumber.from(100); // in blocks
  const voteQuorum = BigNumber.from(65); // 4%
  const valueQuorum = BigNumber.from(65); // 4%
  const tax = BigNumber.from(5).mul(BigNumber.from("10000000000000000"));
  const taxLowerBound = BigNumber.from(0);
  const taxUpperBound = BigNumber.from(6).mul(
    BigNumber.from("1000000000000000000")
  );

  const registrarContract = await Registrar.deploy(
    [
      governanceDeployerContract.address,
      valueContract.address,
      vaultContract.address,
      cashContract.address,
      tax,
      taxLowerBound,
      taxUpperBound,
      inflator,
      fixedReward,
      voteQuorum,
      valueQuorum,
    ],
    {
      gasLimit: 10000000,
    }
  );

  console.log({
    registrarContract: registrarContract.address,
  });

  const dualGovernorAddress = await registrarContract.governor();
  console.log({
    dualGovernorAddress,
  });

  // get vote state value from contract dualGovernorAddress using ethers.js
  const dualGovernorContract = new ContractFactory(
    DualGovernor.abi,
    DualGovernor.bytecode,
    wallet
  ).attach(dualGovernorAddress);

  const voteAddress = await dualGovernorContract.vote();

  // const voteAddress = await registrarContract.vote();

  // await valueTokenContract.grantRole(
  //   "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6",
  //   network.accounts[0].address
  // );

  // const voteTokenContract = await voteTokenFactory.deploy(
  //   "SPOG Vote",
  //   "VOTE",
  //   valueTokenContract.address
  // );

  // await voteTokenContract.grantRole(
  //   "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6",
  //   network.accounts[0].address
  // );

  /* MINT */
  console.log("MINT");

  for (const account of network.accounts) {
    console.log("Minting tokens for account: ", account.address);
    await cashContract.mint(
      account.address,
      BigNumber.from("1000000000000000000000") // 1000
    );
    await valueContract.mint(
      account.address,
      BigNumber.from("1000000000000000000000") // 1000
    );
    // await voteContract.mint(
    //   account.address,
    //   BigNumber.from("1000000000000000000000") // 1000
    // );
  }

  // const governorContract = await dualGovernorFactory.deploy(
  //   "SPOG Governor",
  //   voteTokenContract.address,
  //   valueTokenContract.address,
  //   voteQuorum,
  //   valueQuorum,
  //   time
  // );

  console.log("Registrar address: ", registrarContract.address);
  console.log("DualGovernor address: ", dualGovernorAddress);
  console.log("VOTE token address: ", voteAddress);
  console.log("VALUE token address: ", valueContract.address);

  console.log("Vault address: ", vaultContract.address);
  console.log("Cash address: ", cashContract.address);
  console.log("Auction address: ", auctionContract.address);
  console.log("Deployer address: ", governanceDeployerContract.address);
  console.log("Multicall3 address: ", multicall3Contract.address);
}
