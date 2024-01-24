import { JsonRpcProvider } from "@ethersproject/providers";
import { Wallet } from "@ethersproject/wallet";
import { ContractFactory, utils } from "ethers";

import StandardGovernorDeployerAbi from "../modules/spog/abi/StandardGovernorDeployer.json";
import EmergencyGovernorDeployerAbi from "../modules/spog/abi/EmergencyGovernorDeployer.json";
import ZeroGovernorAbi from "../modules/spog/abi/ZeroGovernor.json";

import PowerBootstrapTokenAbi from "../modules/spog/abi/PowerBootstrapToken.json";
import PowerTokenDeployerAbi from "../modules/spog/abi/PowerTokenDeployer.json";
import RegistrarAbi from "../modules/spog/abi/Registrar.json";
import ZeroTokenAbi from "../modules/spog/abi/ZeroToken.json";
import ERC20ExtendedHarnessAbi from "../modules/spog/abi/ERC20ExtendedHarness.json";
import DistributionVaultAbi from "../modules/spog/abi/DistributionVault.json";

import { bytecode as StandardGovernorDeployerBytecode } from "../modules/spog/bytecode/StandardGovernorDeployer.json";
import { bytecode as EmergencyGovernorDeployerBytecode } from "../modules/spog/bytecode/EmergencyGovernorDeployer.json";
import { bytecode as ZeroGovernorBytecode } from "../modules/spog/bytecode/ZeroGovernor.json";

import { bytecode as PowerBootstrapTokenBytecode } from "../modules/spog/bytecode/PowerBootstrapToken.json";
import { bytecode as PowerTokenDeployerBytecode } from "../modules/spog/bytecode/PowerTokenDeployer.json";
import { bytecode as RegistrarBytecode } from "../modules/spog/bytecode/Registrar.json";
import { bytecode as ZeroTokenBytecode } from "../modules/spog/bytecode/ZeroToken.json";
import { bytecode as ERC20ExtendedHarnessBytecode } from "../modules/spog/bytecode/ERC20ExtendedHarness.json";
import { bytecode as DistributionVaultBytecode } from "../modules/spog/bytecode/DistributionVault.json";

import multicall3 from "./contracts/Multicall3.json";
import { Network } from "./setup";

export default async function deploySpog(network: Network) {
  console.log({ network });

  const STANDARD_PROPOSAL_FEE = BigInt(1e16); // 0.001 WETH

  const EMERGENCY_PROPOSAL_THRESHOLD_RATIO = BigInt(5000); // 50%
  const ZERO_PROPOSAL_THRESHOLD_RATIO = BigInt(5000); // 50%

  const provider = new JsonRpcProvider(network.url);
  const wallet = new Wallet(network.accounts[0].privateKey, provider);

  const mockERC20Factory = new ContractFactory(
    ERC20ExtendedHarnessAbi,
    ERC20ExtendedHarnessBytecode,
    wallet
  );

  const cashToken = await mockERC20Factory.deploy("CASH", "Cash Token", 18);
  // const cashToken2 = await mockERC20Factory.deploy("CASH2", "Cash Token2", 18);
  // console.log("Cash Token2 Address:", cashToken2.address);
  const MToken = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  // TODO check on latest version of TTG if this is not a bug on allowedCashTokens
  const allowedCashTokens = [cashToken.address, MToken];
  // NOTE: Ensure this is the current nonce (transaction count) of the deploying address.
  // const DEPLOYER_NONCE = 0;

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

  const initialZeroAccounts: string[] = [
    network.accounts[0].address,
    network.accounts[1].address,
    network.accounts[2].address,
  ];

  const initialZeroBalances: string[] = ["60000000", "30000000", "10000000"];

  /*
  hardhat network block number starts at 1, but PureEpochs makes the assumption that its being deployed to the mainnet when Ethereum went POS
  Thus epochs are counted from the block number 15_537_393
  Hardhat network must start with a block number and timestamp relatively recent
  */

  const mine = (blocks: number) =>
    provider.send("hardhat_mine", ["0x" + blocks.toString(16)]);

  const emergencyGovernorDeployerFactory = new ContractFactory(
    EmergencyGovernorDeployerAbi,
    EmergencyGovernorDeployerBytecode,
    wallet
  );

  const standardGovernorDeployerFactory = new ContractFactory(
    StandardGovernorDeployerAbi,
    StandardGovernorDeployerBytecode,
    wallet
  );

  const zeroGovernorFactory = new ContractFactory(
    ZeroGovernorAbi,
    ZeroGovernorBytecode,
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

  const DistributionVaultFactory = new ContractFactory(
    DistributionVaultAbi,
    DistributionVaultBytecode,
    wallet
  );

  const multicallFactory = new ContractFactory(
    multicall3.abi,
    multicall3.bytecode,
    wallet
  );

  // Deployment

  const DEPLOYER_NONCE = await wallet.getTransactionCount();

  const getExpectedAddress = (nounce: number) =>
    utils.getContractAddress({
      from: wallet.address,
      nonce: nounce,
    });

  const emergencyGovernorDeployer =
    await emergencyGovernorDeployerFactory.deploy(
      getExpectedAddress(DEPLOYER_NONCE + 4), // ZeroGovernor deployment nonce
      getExpectedAddress(DEPLOYER_NONCE + 7) // Registrar deployment nonce
    );

  const powerTokenDeployer = await powerTokenDeployerFactory.deploy(
    getExpectedAddress(DEPLOYER_NONCE + 4), // ZeroGovernor deployment nonce
    getExpectedAddress(DEPLOYER_NONCE + 6) // DistributionVault deployment nonce
  );

  const standardGovernorDeployer = await standardGovernorDeployerFactory.deploy(
    getExpectedAddress(DEPLOYER_NONCE + 4), // ZeroGovernor deployment nonce
    getExpectedAddress(DEPLOYER_NONCE + 7), // Registrar deployment nonce
    getExpectedAddress(DEPLOYER_NONCE + 6), // DistributionVault deployment nonce
    getExpectedAddress(DEPLOYER_NONCE + 5) // ZeroToken deployment nonce
  );

  const bootstrapToken = await powerBootstrapTokenFactory.deploy(
    initialPowerAccounts,
    initialPowerBalances
  );

  const zeroGovernor = await zeroGovernorFactory.deploy(
    getExpectedAddress(DEPLOYER_NONCE + 5), // ZeroToken deployment nonce
    emergencyGovernorDeployer.address,
    powerTokenDeployer.address,
    standardGovernorDeployer.address,
    bootstrapToken.address,
    STANDARD_PROPOSAL_FEE,
    EMERGENCY_PROPOSAL_THRESHOLD_RATIO,
    ZERO_PROPOSAL_THRESHOLD_RATIO,
    allowedCashTokens
  );

  const zeroToken = await zeroTokenFactory.deploy(
    getExpectedAddress(DEPLOYER_NONCE + 2), // StandardGovernorDeployer deployment nonce
    initialZeroAccounts,
    initialZeroBalances
  );

  // DistributionVault needs zeroToken address.
  const vault = await DistributionVaultFactory.deploy(
    getExpectedAddress(DEPLOYER_NONCE + 5)
  ); // ZeroToken deployment nonce

  const registrar = await registrarFactory.deploy(zeroGovernor.address, {
    gasLimit: 20000000,
  });

  const multicall3Contract = await multicallFactory.deploy();

  for (const account of network.accounts) {
    // console.log("Minting tokens for account: ", account.address);
    await cashToken.mint(
      account.address,
      1000000000000000000000n // 1000
    );
  }

  console.log("Registrar Address:", registrar.address);

  console.log("Power Token Address:", await registrar.powerToken());
  console.log("Zero Token Address:", zeroToken.address);

  console.log("Standard Governor Address:", await registrar.standardGovernor());
  console.log(
    "Emergency Governor Address:",
    await registrar.emergencyGovernor()
  );
  console.log("Zero Governor Address:", zeroGovernor.address);

  console.log("Distribution Vault Address:", vault.address);

  console.log("Cash address:", cashToken.address);
  console.log("Multicall3 address: ", multicall3Contract.address);
}
