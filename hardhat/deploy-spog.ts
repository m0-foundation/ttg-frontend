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

const initialZeroAccounts: string[] = [
  "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
];

const initialZeroBalances: string[] = ["1000000000000", "500000000000"];

const initialPowerAccounts: string[] = [
  "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
];

const initialPowerBalances: string[] = ["1000000000000", "500000000000"];

export default async function deploySpog(network: Network) {
  await mineUpTo(17740856);

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

  console.log("Zero Token Address:", zeroToken.address);
  console.log("Registrar address:", registrar.address);
  console.log("DualGovernor Address:", governorAddress);
  console.log("Power Token Address:", powerTokenAddress);
  console.log("Cash address:", cashToken.address);
}
