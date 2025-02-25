# M^0 Governance dApp

#### Current decentralized deployments:
Fleek (IPFS): [governance-m0.on-fleek.app](https://governance-m0.on-fleek.app/)

<img width="1089" alt="Screenshot 2024-05-14 at 2 04 43 PM" src="https://github.com/MZero-Labs/ttg-frontend/assets/1220854/f63ccd58-99b4-48fd-871f-f6016812f380">


## 1. Contracts

The dApp is based on the TTG contracts in order to run the local testnet. Although it does not keep track of versioning of TTG yet. Meaning, the FE code base has to be updated to latest changes of TTG otherwise it might break.

The repo is hosting the latest abis and bytecodes of ttg at folder `modules/ttg`

### 1.2 Update SDK from TTG smart contracts (only when contracts change) - (optional)

1. then run `yarn wagmi generate`
2. Finally, update the lib/sdk.ts file replace the import `"wagmi/codegen";` to `"@wagmi/core/codegen"`

Depending on contract changes this file must be also updated with correct import dependencies of contracts:
`/wagmi.config.ts`

## 2. Setup

### 2.1 Setup manually

Make sure to install the dependencies:

```bash
yarn install
```

#### 2.1.2 Local development with hardhat

In one terminal:

```bash
yarn hardhat
```

This starts a test blockchain on port 8545.

#### 2.1.3 Env vars

This app uses an environment variables locally (not in docker-compose). For local development: See package.json.

Use in other chains you must create an .env file with this parameters:

```
BUILD_ENV=local(hardhat) | development(sepolia) | staging(sepolia) | production(mainnet)
VITE_APP_IS_AUCTION_ACTIVE=true | false | undefined
VITE_APP_RPC_URL_MAIN=string
VITE_APP_RPC_URL_FALLBACK=string
VITE_APP_WALLET_CONNECT_PROJECT_ID=string
```

For hardhat running there is no need for such file.

At deployment, github actions will inject these variables at build time.

#### 2.1.4 RUN

In another terminal, run:

```bash
yarn dev
```

This starts the development server on `http://localhost:3000`

### 2.2 Running with docker-compose

You need have docker installed, the easiest way is [Docker Desktop](https://www.docker.com/products/docker-desktop/)

#### 2.2.1 For Development

The easiest way to run everything for DEVELOPMENT is with docker-compose.

```bash
ssh-add
docker compose up
```

To force a rebuild, use

```bash
docker compose up --build
```

This will start:

- a test blockchain Hardhat on port 8545
- the Frontend app on port 3000 with live reloading when files change

#### 2.2.2 For Ethereum Mainnet

Just need run this command

```bash
docker compose -f docker-compose.mainnet.yml up
```

#### 2.2.3 For Ethereum Sepolia

Just need run this command

```bash
docker compose -f docker-compose.sepolia.yml up
```

You can access now type `https://localhost:3000` in your browser to access.

### 2.3 Local URL (optional)

```bash
nano /etc/hosts
```

add this line

```bash
127.0.0.1 governance.m0.local
```

or

```bash
sudo bash -c 'echo "127.0.0.1 governance.m0.local" >>  /etc/hosts'
```

Thus, just need to type `governance.m0.local` in your browser to access the governance app.

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

Afterward, in metamask, each time you create a new account, for up to 5 accounts, they will all have ETH, CASH, VOTE, VALUE and can participate in governance. You can switch between accounts and vote on proposals to achieve a threshold.

### Note

Each time hardhat is restarted, metamask will need to be reset

Settings > Advanced > Clear activity

This resets the nonce and state for the wallet

## E2E Test

We use cypress that on every .cy.ts file deploys the TTG contract found on `hardhat/deploy-ttg.ts`

To Run specific test or debug:

In one terminal tab:

```bash
yarn dev
```

In a second terminal tab:

```bash
yarn cy:open
```

To Run all tests:

```bash
yarn test
```

## Production

Build the application for production:

```bash
yarn generate
```

Locally preview production build:

```bash
yarn preview
```

Check out the NUXT [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## GIT tag problem

If you ever encounted a error while pushing about tags error, try this:

```
git tag -d $(git tag -l)
```

```
git fetch
```

try push it again.
