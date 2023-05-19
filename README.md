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



install `foundry` https://getfoundry.sh/
then git clone the SPOG project
then run`yarn wagami generate `


# Types of proposals
List of types of proposals that can be made and their method signatures

abi.encodeWithSignature("reset(address)", newVoteGovernor);



// addresses
description = "Add new list";
abi.encodeWithSignature("addNewList(address)", list);

description = "Add address to a list";
abi.encodeWithSignature("append(address,address)", addressToAdd, listToAddAddressTo);

description = "Remove address from a list";
abi.encodeWithSignature("remove(address,address)", addressToRemove, listToRemoveAddressFrom);

// values
description = "Change tax variable in spog";
abi.encodeWithSignature("changeTax(uint256)", outOfBoundsTaxValue);

description = "Change inflator value in spog";
abi.encodeWithSignature("change(bytes32,bytes)", inflator, elevenAsCalldataValue);

description = "Emergency remove of an address from a List";
abi.encodeWithSignature("emergencyRemove(address,address)", addressToRemove, address(list));