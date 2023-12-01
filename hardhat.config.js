/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",

  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
      hardfork: "shanghai",
      mining: {
        auto: true,
        interval: 15000,
      },
      accounts: {
        mnemonic: "test test test test test test test test test test test junk",
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 5,
        passphrase: "",
      },
    },
  },
};
