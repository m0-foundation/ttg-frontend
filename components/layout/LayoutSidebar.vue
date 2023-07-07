<template>
  <nav class="text-white text-xl">
    <ul>
      <li v-for="item in menu" :key="item.label">
        <NuxtLink :to="item.href" active-class="active">
          {{ item.label }}
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
<script setup>
const menu = [
  {
    label: "proposals",
    href: "/proposals",
  },
  {
    label: "lists",
    href: "/lists",
  },
  {
    label: "delegates",
    href: "/delegates",
  },

  {
    label: "governance config",
    href: "/config/governance",
  },

  {
    label: "M0 Protocol config",
    href: "/config/protocol",
  },

  {
    label: "Settings",
    href: "/settings",
  },
];
</script>

<style scoped>
li {
  list-style-type: none;
  @apply text-white text-sm  px-2 py-2 uppercase hover:underline;
}
.active {
  @apply text-primary;
}

.active::before {
  content: "[> ";
}
</style>
