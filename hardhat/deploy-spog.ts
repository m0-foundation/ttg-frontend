/* eslint-disable camelcase */
import { JsonRpcProvider } from "@ethersproject/providers";
import { mineUpTo } from "@nomicfoundation/hardhat-network-helpers";
import { Wallet } from "@ethersproject/wallet";
import { utils } from "ethers";

import { DualGovernorDeployer__factory } from "../modules/spog/types/ethers/factories/DualGovernorDeployer.sol";
import { DualGovernor__factory } from "../modules/spog/types/ethers/factories/DualGovernor.sol";
import { PowerBootstrapToken__factory } from "../modules/spog/types/ethers/factories/PowerBootstrapToken.sol";
import { PowerTokenDeployer__factory } from "../modules/spog/types/ethers/factories/PowerTokenDeployer.sol";
import { Registrar__factory } from "../modules/spog/types/ethers/factories/Registrar.sol";
import { ZeroToken__factory } from "../modules/spog/types/ethers/factories/ZeroToken.sol";
import { MockERC20Permit__factory } from "../modules/spog/types/ethers/factories/Mocks.sol";

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
  Thus epochs are counted from the block number 17_740_856
  Hardhat network must start with a block number and timestamp relatively recent
  */
  await mineUpTo(17_740_856);

  const provider = new JsonRpcProvider(network.url);
  const wallet = new Wallet(network.accounts[0].privateKey, provider);

  const dualGovernorDeployerFactory = new DualGovernorDeployer__factory(wallet);
  const dualGovernorFactory = new DualGovernor__factory(wallet);
  const powerBootstrapTokenFactory = new PowerBootstrapToken__factory(wallet);
  const powerTokenDeployerFactory = new PowerTokenDeployer__factory(wallet);
  const registrarFactory = new Registrar__factory(wallet);
  const zeroTokenFactory = new ZeroToken__factory(wallet);
  const mockERC20PermitFactory = new MockERC20Permit__factory(wallet);

  const transactionCount = await wallet.getTransactionCount();

  const expectedRegistrarAddress = utils.getContractAddress({
    from: wallet.address,
    nonce: transactionCount + 5,
  });

  const zeroToken = await zeroTokenFactory.deploy(
    expectedRegistrarAddress,
    initialZeroAccounts,
    initialZeroBalances
  );

  const governorDeployer = await dualGovernorDeployerFactory.deploy(
    expectedRegistrarAddress,
    zeroToken.address
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

  const registrar = await registrarFactory.deploy(
    governorDeployer.address,
    powerTokenDeployer.address,
    bootstrapToken.address,
    cashToken.address,
    {
      gasLimit: 20000000,
    }
  );

  const governorAddress = await registrar.governor();
  const powerTokenAddress = await dualGovernorFactory
    .attach(governorAddress)
    .powerToken();

  for (const account of network.accounts) {
    console.log("Minting tokens for account: ", account.address);
    await cashToken.mint(
      account.address,
      1000000000000000000000n // 1000
    );
  }

  console.log("Zero Token Address:", zeroToken.address);
  console.log("Registrar address:", registrar.address);
  console.log("DualGovernor Address:", governorAddress);
  console.log("Power Token Address:", powerTokenAddress);
  console.log("Cash address:", cashToken.address);
}
