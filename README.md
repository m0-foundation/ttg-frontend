# M^0 Governance dApp

#### Current decentralized deployments:

Fleek (IPFS): [governance-m0.on-fleek.app](https://governance-m0.on-fleek.app/)

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

#### 2.1.2 Start the local blockchain

In one terminal:

```bash
yarn hardhat
```

This starts a test blockchain on port `8545`.

#### 2.1.4 Setup the Frontend app

Set up your environment variables:

```
cp env.example .env
```

And set `BUILD_ENV` to `local`

Run the app:

```bash
yarn dev
```

The app will be available at `http://localhost:3000`

### 2.2 Running with docker-compose

If you prefer using Docker to run the app, you can do it with docker-compose:

```bash
ssh-add
docker compose up
```

To force a rebuild, use

```bash
docker compose up --build
```

This will start:

- a test blockchain Hardhat on port `8545`
- the Frontend app on port `3000` with live reloading when files change

There are other alternate chain configurations for Docker:

- mainnet: `docker compose -f docker-compose.mainnet.yml up`
- sepolia: `docker compose -f docker-compose.sepolia.yml up`

## 3. Testing locally

### 3.1 Populating data

Cypress can be used to quickly setting up your local environment. With Cypress you can automate proposal creation and epoch forwarding to set Transfer or Voting epochs.

Take a look at available tests by running

```sh
yarn cy:open
```

Then, modify the test of your interest on `./cypress` to only run the steps you need.

### 3.2 Pre-funded accounts

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

We use cypress that on every `.cy.ts` file deploys the TTG contract found on `hardhat/deploy-ttg.ts`

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

## 🤝 Contributing

- `main` reflects the production-ready state.
- `develop`, reflects the state with the latest delivered development changes for the next release.

Below you will a guide for the most common scenarios. Please refer to [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/) for a more in-depth explanation.

### Feature branches

We use feature branches to develop new features or fix existing ones.

- Branch off from: `develop`
- Must merge back into: `develop`
- Branch naming convention: `WEB3-1234/scope-of-the-changes-or-ticket-title`. Where WEB3-1234 matches the Jira ticket.
- Open a pull request to incorporate your changes back to `develop`.
- ⚠️ Merge strategy: Squash and merge.

### Release branches

Release branches are used for production deployments.

- Branch off from: `develop`
- Must merge back into: `main` **and** `develop`
- Branch naming convention: `release/x.x.x`. Where `x.x.x` is the release version.
- ⚠️ Merge strategy: Merge commit.

1. Create a new release branch

   ```sh
   git fetch
   git checkout -b release/x.x.x origin/develop
   ```

1. Bump the version in `package.json`, `apps/server/package.json`, and `apps/web/package.json`. The release naming must match the version.

1. Push your changes to GitHub and open a pull request against `main`.

1. Wait for the pull request to get approved. Use a "Merge commit" to merge the pull request.

1. Let the team know about the upcoming deploy.

1. Run the workflow [Build & Upload to PROD Governance](https://github.com/m0-foundation/ttg-frontend/actions/workflows/s3_buckets_deploy_production_governance.yml) targeting the `main` branch.

1. Monitor the action, and let the team know once changes are live.

1. Populate the release to `develop`

   Do it via a pull request (suggested). Example: [#399](https://github.com/m0-foundation/ttg-frontend/pull/399)

   Do it manually:

   ```sh
   git checkout develop
   git pull origin develop

   # merge into develop
   git merge --no-ff release/x.x.x

   git push origin develop
   ```

1. The branch `release/x.x.x` can now be deleted in GitHub.

### Hotfix

Hotfix branch is used to patch or fix something in production.

- Branch off from: `main`
- Must merge back into: `main` **and** `develop`, **and** any outgoing `release/x.x.x` branch.
- Branch naming convention: `hotfix/x.x.x`. Where `x.x.x` is the release version.
- ⚠️ Merge strategy: Merge commit.

Releasing the hotfix branch involves the same steps as a `release/*` branch. Including version bumping. Refer to the section above for detailed steps.

### Additional guidelines

- Git commits: We follow (non-strictly) [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/).
- Pull requests: The title follows conventional commits as well. Description is a must. Please include screenshots or videos for visual changes, testing evidence and any other relevant information for reviewers. Explain why and what changed not how.
- Approvals: Get at least one approval.
