import { JsonRpcProvider } from "@ethersproject/providers";
import { Wallet } from "@ethersproject/wallet";
import { ContractFactory, utils } from "ethers";

import StandardGovernorDeployerAbi from "../modules/ttg/abi/StandardGovernorDeployer.json";
import EmergencyGovernorDeployerAbi from "../modules/ttg/abi/EmergencyGovernorDeployer.json";
import ZeroGovernorAbi from "../modules/ttg/abi/ZeroGovernor.json";

import PowerBootstrapTokenAbi from "../modules/ttg/abi/PowerBootstrapToken.json";
import PowerTokenDeployerAbi from "../modules/ttg/abi/PowerTokenDeployer.json";
import RegistrarAbi from "../modules/ttg/abi/Registrar.json";
import ZeroTokenAbi from "../modules/ttg/abi/ZeroToken.json";
import ERC20ExtendedHarnessAbi from "../modules/ttg/abi/ERC20ExtendedHarness.json";
import DistributionVaultAbi from "../modules/ttg/abi/DistributionVault.json";

import { bytecode as StandardGovernorDeployerBytecode } from "../modules/ttg/bytecode/StandardGovernorDeployer.json";
import { bytecode as EmergencyGovernorDeployerBytecode } from "../modules/ttg/bytecode/EmergencyGovernorDeployer.json";
import { bytecode as ZeroGovernorBytecode } from "../modules/ttg/bytecode/ZeroGovernor.json";

import { bytecode as PowerBootstrapTokenBytecode } from "../modules/ttg/bytecode/PowerBootstrapToken.json";
import { bytecode as PowerTokenDeployerBytecode } from "../modules/ttg/bytecode/PowerTokenDeployer.json";
import { bytecode as RegistrarBytecode } from "../modules/ttg/bytecode/Registrar.json";
import { bytecode as ZeroTokenBytecode } from "../modules/ttg/bytecode/ZeroToken.json";
import { bytecode as ERC20ExtendedHarnessBytecode } from "../modules/ttg/bytecode/ERC20ExtendedHarness.json";
import { bytecode as DistributionVaultBytecode } from "../modules/ttg/bytecode/DistributionVault.json";

import multicall3 from "./contracts/Multicall3.json";
import { Network } from "./setup";

export default async function deploySpog(network: Network) {
  console.log({ network });

  const STANDARD_PROPOSAL_FEE = BigInt(1e16); // 0.001 WETH

  const EMERGENCY_PROPOSAL_THRESHOLD_RATIO = BigInt(4000); // 40%
  const ZERO_PROPOSAL_THRESHOLD_RATIO = BigInt(4000); // 40%

  const provider = new JsonRpcProvider(network.url);
  const wallet = new Wallet(network.accounts[0].privateKey, provider);

  // to avoid messing up with the nonce from main deployer, use another account to deploy Mtoken
  const wallet2 = new Wallet(network.accounts[3].privateKey, provider);

  const CashTokenFactory = new ContractFactory(
    ERC20ExtendedHarnessAbi,
    ERC20ExtendedHarnessBytecode,
    wallet
  );

  const MTokenFactory = new ContractFactory(
    ERC20ExtendedHarnessAbi,
    ERC20ExtendedHarnessBytecode,
    wallet2
  );
  const cashToken = await CashTokenFactory.deploy("CASH", "Cash Token", 18);
  console.log("Cash Token Address:", cashToken.address);
  
  const MToken = await MTokenFactory.deploy("M", "M Token", 6);
  console.log("MToken:", MToken.address);

  const allowedCashTokens = [cashToken.address, MToken.address];

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
  // const DEPLOYER_NONCE = 1;
  // console.log("Deployer nonce: ", await wallet.getTransactionCount());

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
    // console.log("Deployer nonce: ", await wallet.getTransactionCount());
  const powerTokenDeployer = await powerTokenDeployerFactory.deploy(
    getExpectedAddress(DEPLOYER_NONCE + 4), // ZeroGovernor deployment nonce
    getExpectedAddress(DEPLOYER_NONCE + 6) // DistributionVault deployment nonce
  );
  // console.log("Deployer nonce: ", await wallet.getTransactionCount());
  const standardGovernorDeployer = await standardGovernorDeployerFactory.deploy(
    getExpectedAddress(DEPLOYER_NONCE + 4), // ZeroGovernor deployment nonce
    getExpectedAddress(DEPLOYER_NONCE + 7), // Registrar deployment nonce
    getExpectedAddress(DEPLOYER_NONCE + 6), // DistributionVault deployment nonce
    getExpectedAddress(DEPLOYER_NONCE + 5) // ZeroToken deployment nonce
  );
  // console.log("Deployer nonce: ", await wallet.getTransactionCount());
  const bootstrapToken = await powerBootstrapTokenFactory.deploy(
    initialPowerAccounts,
    initialPowerBalances
  );
  // console.log("Deployer nonce: ", await wallet.getTransactionCount());
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

    await MToken.mint(
      account.address,
      1000_000_000n // 1000 M
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
