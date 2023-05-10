<template>
  <form>
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

      <textarea name="description" />
    </div>

    <div class="mb-6">
      <label for="vote-tyep">IPFS</label>
      <input type="url" name="ipfs" />
    </div>

    <div class="mb-6">
      <label for="Discussion"> Discussion </label>

      <input type="url" name="discussion" />
    </div>

    <div class="flex justify-end mt-12">
      <MButton type="submit">Preview and Create</MButton>
    </div>

    <hr class="my-12" />

    <div id="info-text" class="mb-6">
      <h2 class="text-white">
        What is the standard for Governor proposal descriptions?
      </h2>
      <div class="text-sm text-grey-primary">
        <p>
          Ever since Governor proposals have had an on-chain, human-readable
          description field. Governor front ends like Tally, Compound and others
          follow this de-facto standard:
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
</template>

<script setup></script>

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
