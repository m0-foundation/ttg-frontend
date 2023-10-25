import { JsonRpcProvider } from "@ethersproject/providers";
import { Wallet } from "@ethersproject/wallet";
import { ContractFactory, utils } from "ethers";

import DualGovernorDeployerAbi from "../modules/spog/abi/DualGovernorDeployer.json";
import DualGovernorAbi from "../modules/spog/abi/DualGovernor.json";
import PowerBootstrapTokenAbi from "../modules/spog/abi/PowerBootstrapToken.json";
import PowerTokenDeployerAbi from "../modules/spog/abi/PowerTokenDeployer.json";
import RegistrarAbi from "../modules/spog/abi/Registrar.json";
import ZeroTokenAbi from "../modules/spog/abi/ZeroToken.json";
import MockERC20PermitAbi from "../modules/spog/abi/MockERC20Permit.json";

import { bytecode as DualGovernorDeployerBytecode } from "../modules/spog/bytecode/DualGovernorDeployer.json";
import { bytecode as DualGovernorBytecode } from "../modules/spog/bytecode/DualGovernor.json";
import { bytecode as PowerBootstrapTokenBytecode } from "../modules/spog/bytecode/PowerBootstrapToken.json";
import { bytecode as PowerTokenDeployerBytecode } from "../modules/spog/bytecode/PowerTokenDeployer.json";
import { bytecode as RegistrarBytecode } from "../modules/spog/bytecode/Registrar.json";
import { bytecode as ZeroTokenBytecode } from "../modules/spog/bytecode/ZeroToken.json";
import { bytecode as MockERC20PermitBytecode } from "../modules/spog/bytecode/MockERC20Permit.json";

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
  console.log({ network });

  const provider = new JsonRpcProvider(network.url);
  const wallet = new Wallet(network.accounts[0].privateKey, provider);

  const mine = (blocks: number) =>
    provider.send("hardhat_mine", ["0x" + blocks.toString(16)]);

  const dualGovernorDeployerFactory = new ContractFactory(
    DualGovernorDeployerAbi,
    DualGovernorDeployerBytecode,
    wallet
  );
  const dualGovernorFactory = new ContractFactory(
    DualGovernorAbi,
    DualGovernorBytecode,
    wallet
  );
  const powerBootstrapTokenFactory = new ContractFactory(
    PowerBootstrapTokenAbi,
    PowerBootstrapTokenBytecode,
    wallet
  );
  const powerTokenDeployerFactory = new ContractFactory(
    PowerTokenDeployerAbi,
    PowerTokenDeployerBytecode,
    wallet
  );

  const registrarFactory = new ContractFactory(
    RegistrarAbi,
    RegistrarBytecode,
    wallet
  );
  const zeroTokenFactory = new ContractFactory(
    ZeroTokenAbi,
    ZeroTokenBytecode,
    wallet
  );
  const mockERC20PermitFactory = new ContractFactory(
    MockERC20PermitAbi,
    MockERC20PermitBytecode,
    wallet
  );

  const multicallFactory = new ContractFactory(
    multicall3.abi,
    multicall3.bytecode,
    wallet
  );

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

  const multicall3Contract = await multicallFactory.deploy();

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
  console.log("Multicall3 address: ", multicall3Contract.address);
}
