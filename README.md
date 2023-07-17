# M^ZERO Governance dApp

This app is based on Nuxt v3, Vue, and Wagmi

## Contracts are git submodules

This will install the SPOG contracts and all of their submodules recursively

```bash
git submodule update --init --recursive
```

## Compile contracts

1. install `foundry` https://getfoundry.sh/
2. `cd contracts/`
3. `forge build`

## Running with docker-compose

The easiest way to run everything for development is with docker-compose. Make sure you have SSH access to the `rpc-proxy` repo as well.

```bash
ssh-add
docker-compose up
```

To force a rebuild, use

```bash
docker-compose up --build
```

This will start:

- a test blockchain on port 8545
- an rpc-proxy on port 3005
- the app on port 3000 with live reloading when files change

## Setup without docker-compose

Make sure to install the dependencies:

### Install Node modules

```bash
yarn install
```

### Local development with hardhat

In one terminal, run `yarn hardhat`. This starts a test blockchain on port 8545.

To test with the [rpc-proxy](https://github.com/MZero-Labs/rpc-proxy) on port 3005, clone it and run it in another terminal. It will connect to hardhat.

To test without the rpc-proxy, verify your .env connects to hardhat port 8545 instead of 3005 for RPC

In another terminal, run `yarn dev`. This starts the development server on `http://localhost:3000`

## Testing with Metamask

You can test everything locally with 5 pre-funded accounts.

In metamask, import a wallet using the seed phrase

```
1. test
2. test
3. test
4. test
5. test
6. test
7. test
8. test
9. test
10. test
11. test
12. junk
```

Afterward, in metamask, each time you create a new account, for up to 5 accounts, they will all have ETH, CASH, VOTE, VALUE and can participate in governance. You can switch between accounts and vote on proposals to achieve a quorum.

### Note

Each time hardhat is restarted, metamask will need to be reset

Settings > Advanced > Clear activity

This resets the nonce and state for the wallet

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

## Update SDK from SPOG smart contracts (only when contracts change)

1. `git submodule update --init --recursive`
2. `cd contracts/`
3. `forge build`
4. `cd ..`
5. then run `yarn wagmi generate`
6. Finally, update the sdk.js file replace the import `"wagmi/actions";` to `"@wagmi/core"`

### `.env` file:

This app uses an .env file to set environment variables locally (not in docker-compose). For local development, copy `.env.development` to `.env`

For production or public testnets, please deploy the contracts using the script provided in the SPOG contracts repo, and create an .env file with appropriate values.
