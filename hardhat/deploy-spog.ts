/* eslint-disable camelcase */
import { JsonRpcProvider } from "@ethersproject/providers";
import { mineUpTo } from "@nomicfoundation/hardhat-network-helpers";
import { Wallet } from "@ethersproject/wallet";
import * as ethers from "ethers";

import { DualGovernorDeployer__factory } from "../modules/spog/types/ethers-v6/factories/DualGovernorDeployer.sol";
import { DualGovernor__factory } from "../modules/spog/types/ethers-v6/factories/DualGovernor.sol";
import { PowerBootstrapToken__factory } from "../modules/spog/types/ethers-v6/factories/PowerBootstrapToken.sol";
import { PowerTokenDeployer__factory } from "../modules/spog/types/ethers-v6/factories/PowerTokenDeployer.sol";
import { Registrar__factory } from "../modules/spog/types/ethers-v6/factories/Registrar.sol";
import { ZeroToken__factory } from "../modules/spog/types/ethers-v6/factories/ZeroToken.sol";
import { MockERC20Permit__factory } from "../modules/spog/types/ethers-v6/factories/Mocks.sol";
import multicall3 from "./contracts/Multicall3.json";
import { Network } from "./setup";

export default async function deploySpog(network: Network) {
  const initialZeroAccounts: string[] = [
    network.accounts[0].address,
    network.accounts[1].address,
    network.accounts[2].address,
  ];

  const initialZeroBalances: string[] = ["60000000", "30000000", "10000000"];

  const initialPowerAccounts: string[] = [
    network.accounts[0].address,
    network.accounts[1].address,
    network.accounts[2].address,
  ];

  //  initPowerSupply = 1_000_000_000;

  const initialPowerBalances: string[] = [
    "60", // 60% of supply => 600_000_000 POWER tokens
    "30", // 30% of supply => 300_000_000 POWER tokens
    "10", // 10% of supply => 100_000_000 POWER tokens
  ];

  /*
  hardhat network block number starts at 1, but PureEpochs makes the assumption that its being deployed to the mainnet when Ethereum went POS
  Thus epochs are counted from the block number 15_537_393
  Hardhat network must start with a block number and timestamp relatively recent
  */
  await mineUpTo(15537393 + 108000);

  // const provider = new JsonRpcProvider(network.url);
  // const wallet = new Wallet(network.accounts[0].privateKey, provider);

  const provider = new ethers.JsonRpcProvider(network.url);
  const wallet = new ethers.Wallet(network.accounts[0].privateKey, provider);

  const dualGovernorDeployerFactory = new DualGovernorDeployer__factory(wallet);
  const dualGovernorFactory = new DualGovernor__factory(wallet);
  const powerBootstrapTokenFactory = new PowerBootstrapToken__factory(wallet);
  const powerTokenDeployerFactory = new PowerTokenDeployer__factory(wallet);
  const registrarFactory = new Registrar__factory(wallet);
  const zeroTokenFactory = new ZeroToken__factory(wallet);
  const mockERC20PermitFactory = new MockERC20Permit__factory(wallet);
  const multicallFactory = new ethers.ContractFactory(
    multicall3.abi,
    multicall3.bytecode,
    wallet
  );

  const transactionCount = await provider.getTransactionCount(wallet.address);

  const expectedRegistrarAddress = ethers.getCreateAddress({
    from: wallet.address,
    nonce: transactionCount + 5,
  });

  const zeroToken = await zeroTokenFactory.deploy(
    expectedRegistrarAddress,
    initialZeroAccounts,
    initialZeroBalances
  );

  const zeroTokenAddress = await zeroToken.getAddress();
  const governorDeployer = await dualGovernorDeployerFactory.deploy(
    expectedRegistrarAddress,
    zeroTokenAddress
  );

  // NOTE: For now, cash is sent to the main wallet, instead of some vault or treasury. Will change.
  const powerTokenDeployer = await powerTokenDeployerFactory.deploy(
    expectedRegistrarAddress,
    wallet.address
  );

  const bootstrapToken = await powerBootstrapTokenFactory.deploy(
    initialPowerAccounts,
    initialPowerBalances
  );

  const cashToken = await mockERC20PermitFactory.deploy(
    "CASH",
    "Cash Token",
    18
  );

  const governorDeployerAddress = await governorDeployer.getAddress();
  const powerTokenDeployerAddress = await powerTokenDeployer.getAddress();
  const bootstrapTokenAddress = await bootstrapToken.getAddress();
  const cashTokenAddress = await cashToken.getAddress();

  const registrar = await registrarFactory.deploy(
    governorDeployerAddress,
    powerTokenDeployerAddress,
    bootstrapTokenAddress,
    cashTokenAddress,
    {
      gasLimit: 20000000,
    }
  );

  const registrarAddress = await registrar.getAddress();

  const governorAddress = await registrar.governor();
  const powerTokenAddress = await dualGovernorFactory
    .attach(governorAddress)
    .getFunction("powerToken")();

  const multicall3Contract = await multicallFactory.deploy();
  const multicall3Address = await multicall3Contract.getAddress();

  for (const account of network.accounts) {
    console.log("Minting tokens for account: ", account.address);
    await cashToken.mint(
      account.address,
      1000000000000000000000n // 1000
    );
  }

  console.log("Zero Token Address:", zeroTokenAddress);
  console.log("Registrar address:", registrarAddress);
  console.log("DualGovernor Address:", governorAddress);
  console.log("Power Token Address:", powerTokenAddress);
  console.log("Cash address:", cashTokenAddress);
  console.log("Multicall3 address: ", multicall3Address);
}
