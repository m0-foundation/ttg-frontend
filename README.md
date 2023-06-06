# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Generate SDK from SPOG smart contracts

1. install `foundry` https://getfoundry.sh/
2. `git clone https://github.com/MZero-Labs/SPOG.git`
3. go to /SPOG directory and type `yarn link`
4. go to /spog-frontend and type `yarn link "@mzero-labs/spog"` 
5. then run `yarn wagmi generate`
6. Finally, update the sdk.js file replace the import `"wagmi/actions";` to `"@wagmi/core"`


## Deploy SPOG to testnet use on the Dapp
1. go to /SPOG and udpate `.env` file with `MNEMONIC=".....insert your mnemonic from your metamask...."`
2. Start the local anvil node ```anvil ```
3. In another terminal, run the deployment script for Anvil ```make deploy-spog-qa-sepolia```
4. from the logs results of deployed contracts you must copy to the `.env` following this order:
```
  deployer: 0x31DCb7AE01fFfD9B6468814bA2A6A0ab9c58d8e5
  deployer: 0x31DCb7AE01fFfD9B6468814bA2A6A0ab9c58d8e5
  SPOG address:  0x48E82c3d2022bc15390f9faC2ebd4770604104b6
  SPOGVote token address:  0xF6b56E5C7fcDaeca68D8FEe374331357a48B2f90
  SPOGValue token address:  0x7b7E36A667F0Dd96B617343a12fB04e52C80BC2D
  DualGovernor address:  0x7C474027d8873a7bc50A791a4A96aD181108B877
  Cash address:  0xc50C3d2d69aC52490882a8A43a05396987369687
  Vote holders vault address:  0x136D0388d9619C3c07bd316033Ce8cf1C631ca7e
  Value holders vault address:  0x05872592c3F8653C1291E46574b99cc7e69939a5
````
### `.env` file example:

```
CONTRACT_DEPLOYED_BLOCK={BLOCK_NUMBER} // block number where the SPOG was deployed   
CONTRACT_ADDRESS_SPOG={SPOG address}
CONTRACT_ADDRESS_SPOG_VOTE={SPOGVote token address}
CONTRACT_ADDRESS_SPOG_VALUE={SPOGValue token address}
CONTRACT_ADDRESS_SPOG_GOVERNOR={DualGovernor address}
CONTRACT_ADDRESS_CASH={Cash address}
CONTRACT_ADDRESS_VAULT_VOTE={Vote holders vault address}
CONTRACT_ADDRESS_VAULT_VALUE={Value holders vault address}
# network deployed
VITE_NETWORK_DEFAULT_RPC=https://rpc.sepolia.org/
NETWORK_RPC_LIST=https://rpc.sepolia.org/,https://rpc2.sepolia.org/,https://rpc.sepolia.online/,https://www.sepoliarpc.space/,https://rpc-sepolia.rockx.com/
NETWORK_CHAIN_ID=11155111
```

5. Finally, just start the app with `yarn dev`