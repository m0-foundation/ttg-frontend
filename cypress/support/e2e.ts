// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";

import { JsonRpcProvider } from "@ethersproject/providers";
import { Wallet } from "@ethersproject/wallet";
import { Eip1193 } from "../lib/eip1193";

import redeploy from "../lib/redeploy";

before(async () => {
  await redeploy();
});

Cypress.on("window:before:load", (win) => {
  // private key of first hardhat user
  const pk =
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

  const provider = new JsonRpcProvider("http://localhost:8545");
  const signer = new Wallet(pk, provider);
  win.ethereum = new Eip1193(signer);
});

const cypressLogOriginal = Cypress.log;
const cypressLogDomainsHidden = ["http://localhost:8545", "127.0.0.1:8545"];
// @ts-ignore
Cypress.log = function (options: Cypress.LogConfig) {
  const logFetchIs = ["fetch"].includes(options.displayName);
  const logFetchDomainMatch =
    logFetchIs && cypressLogDomainsHidden.find((d) => options.url.includes(d));
  if (logFetchDomainMatch) return;

  return cypressLogOriginal(options);
};
