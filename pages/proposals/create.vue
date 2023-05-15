<template>
  <div>
    <form @submit.prevent="onSubmit">
      <div v-if="!isPreview">
        <h1>Create a proposal</h1>

        <div class="mb-6">
          <label for="vote-tyep">Vote type</label>
          <select>
            <option>Change parameters</option>
            <option>Append</option>
            <option>Change tax</option>
            <option>Remove</option>
            <option>Remove list</option>
            <option>Add list</option>
            <option>Emergency remove</option>
            <option>Add Yield Box</option>
          </select>
        </div>

        <div class="mb-6">
          <label for="vote-tyep">Value</label>
          <input type="text" name="value" />
        </div>

        <div class="mb-6">
          <div class="flex justify-between mb-2">
            <label for="Description"> Description </label>
            <div class="text-sm text-gray-400 flex">
              <img src="/img/icon-markdown.svg" class="h-6 mx-2" />
              Markdown supported
            </div>
          </div>

          <textarea v-model="description" name="description" />
        </div>

        <div class="mb-6">
          <label for="vote-tyep">IPFS</label>
          <input type="url" name="ipfs" />
        </div>

        <div class="mb-6">
          <label for="Discussion"> Discussion </label>

          <input type="url" name="discussion" />
        </div>
      </div>

      <div v-else>
        <ProposalPreview :description="description" @on-back="onBack" />
      </div>

      <div v-if="isPreview" class="flex justify-end mt-12">
        <button class="text-primary-dark uppercase mx-4" @click="onBack">
          &#60; back
        </button>
        <MButton v-if="isPreview" type="submit">Submit proposal</MButton>
      </div>

      <div v-else class="flex justify-end mt-12">
        <MButton type="button" @click="onPreview">Preview proposal</MButton>
      </div>

      <hr class="my-12" />

      <div id="info-text" class="mb-6">
        <h2 class="text-white">
          What is the standard for Governor proposal descriptions?
        </h2>
        <div class="text-sm text-grey-primary">
          <p>
            Ever since Governor proposals have had an on-chain, human-readable
            description field. Governor front ends like Tally, Compound and
            others follow this de-facto standard:
          </p>
          <ul>
            <li>• Proposal descriptions should be markdown text</li>
            <li>
              • The first line of the description, regardless of format, is the
              title
            </li>
            <li>
              • Everything after the first newline is the body of the proposal.
              Frontends should renderer it as markdown
            </li>
          </ul>
          <p>
            If a proposal description does not follow this standard, Tally's
            frontend will make a best-effort to render it, but it might look
            weird.
          </p>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { encodeFunctionData } from "viem";
import { useAccount } from "use-wagmi";
import { spogABI, writeSpog, writeErc20 } from "@/lib/generated";

const isPreview = ref(false);

const { address } = useAccount();

const config = useRuntimeConfig();

function onPreview() {
  isPreview.value = true;
}

async function onSubmit() {
  console.log("submit");

  // const allowance = await writeErc20({
  //   address: config.cash,
  //   functionName: "approve",
  //   args: [config.spog, 100],
  //   account: address.value,
  // });
  // console.log({ allowance });

  const newAddress = "0xB609BD6dA626F6bb2096DFdd99E0DA060f76C40D";
  const targets = [config.contracts.spog];
  const values = [0];
  const calldatas = [
    encodeFunctionData({
      abi: spogABI,
      functionName: "changeTax",
      args: [0],
    }),
  ];
  const description = "Change tax variable in spog";

  const { hash } = await writeSpog({
    address: config.contracts.spog,
    functionName: "propose",
    args: [targets, values, calldatas, description],
    account: address.value,
    chainId: 11155111,
    overrides: {
      gasLimit: 2100000n,
    },
  });
  console.log({ hash });
}

function onBack() {
  isPreview.value = false;
}
</script>

<style scoped>
h1 {
  @apply text-3xl font-light mb-12;
}

label {
  @apply text-grey-primary block mb-2 text-sm font-medium;
}

input,
select,
textarea {
  @apply bg-secondary-dark border border-grey-secondary text-gray-100 text-sm focus:ring-green-500 focus:border-green-100 block w-full p-2.5;
}

textarea {
  @apply h-80;
}

hr {
  border-top: 1px dashed #979797;
}

#info-text * {
  @apply my-4;
}
</style>
