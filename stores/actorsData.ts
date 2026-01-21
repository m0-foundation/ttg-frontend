import { defineStore } from 'pinia'

export const useActorsStore = defineStore('actors', () => {
  const minters = [
    {
      title: 'MXON',
      cardDescription:
        'MXON is the first minter on the M0 network and ensures $M is backed by short-term US treasuries stored in best-in-class structures.',
      account: '0x7F7489582b64ABe46c074A45d758d701c2CA5446',
      timestamp: 1715826803,
      website: 'mxon.co',
      isMinter: true,
      image: 'MXON.png',
    },
    {
      title: 'Bridge',
      cardDescription:
        'Bridge, a stablecoin orchestration and issuance platform, is the first U.S.-regulated issuer on the M0 network.',
      account: '0xCD1394d24e1E404F9eB3609F872B0736bEcb9d74',
      timestamp: 1754542800,
      website: 'bridge.xyz',
      isMinter: true,
      image: 'bridge.png',
    },
    {
      title: '1Money',
      cardDescription:
        '1Money is the first vertically integrated, full-stack infrastructure company providing a unified technology layer across the lifecycle of stablecoins and real-world assets (RWAs).',
      account: '0x1D5B695D13F231A605D231631C688Fb33477B249',
      timestamp: 1764190980,
      website: '1moneynetwork.com',
      isMinter: true,
      image: '1money.png',
    },
    {
      title: 'MoonPay',
      cardDescription:
        'MoonPay simplifies access to buy, sell and trade crypto using everyday payment methods like cards, Apple Pay, PayPal and Venmo, while also providing simple tools to send, receive and manage stablecoins.',
      account: '0x5d238f4eaC94dA0A635eE39fA389a4754395D5D9',
      timestamp: 1765946940,
      website: 'moonpay.com/business/issuance',
      isMinter: true,
      image: 'moonpay.png',
    },
  ]

  const validators = [
    {
      title: 'Chronicle',
      cardDescription:
        'Chronicle, the original oracle on Ethereum, is a novel, blockchain-agnostic Oracle solution that has exclusively secured up to $22B in assets for MakerDAO and its ecosystem since 2017.',
      account: '0xEe4d4938296E3BD4cD166b9b35EE1B8FeD2F93C1',
      timestamp: 1719681719,
      website: 'chroniclelabs.org',
      isMinter: false,
      image: 'Chronicle.png',
    },
    {
      title: 'Validator One',
      cardDescription:
        'Validator One is a team of experts with deep experience in IT security, artificial intelligence, and blockchain, committed to developing innovative and user-friendly solutions that enhance digital trust and security.',
      account: '0xEF1D05E206Af8103619DF7Cb576068e11Fd07270',
      timestamp: 1715827799,
      website: 'validator-one.com',
      isMinter: false,
      image: 'ValidatorOne.png',
    },
  ]

  return {
    minters,
    validators,
  }
})
