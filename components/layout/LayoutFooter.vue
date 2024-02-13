<template>
  <footer class="w-full p-6 lg:px-16 font-inter">
    <div class="lg:flex items-center">
      <div class="lg:grow">
        <span class="text-xs text-grey-600"
          >© 2023
          <a href="/" class="hover:underline">MˆZERO Labs_</a>
        </span>
      </div>
      <div class="lg:shrink">
        <ul
          class="flex flex-wrap items-center lg:mt-0 text-xs text-white lg:hidden"
        >
          <li>
            <a href="#" class="mr-4 hover:underline lg:mr-6">Support</a>
          </li>
          <li>
            <a href="#" class="mr-4 hover:underline lg:mr-6">Documentation</a>
          </li>
        </ul>
        <div class="flex justify-between align-center mt-4 lg:mt-0 lg:gap-6">
          <NuxtLink to="/settings" class="footer-link">App settings</NuxtLink>
          <div class="text-grey-600 text-xs hidden lg:block">|</div>
          <a href="#" class="footer-link">Join our community</a>
          <ul class="flex items-center gap-4">
            <li v-for="social in socialLinks" :key="social.name">
              <a :href="social.url" class="">
                <img :src="social.icon" :alt="`${social.name} logo white`" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
const socialLinks = [
  {
    name: "Discord",
    url: "#",
    icon: "/img/socials/discord.svg",
  },
  {
    name: "Twitter",
    url: "https://twitter.com/m0labs",
    icon: "/img/socials/twitter.svg",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/company/m-zero-labs/",
    icon: "/img/socials/linkedin.svg",
  },
];
</script>

<style>
.footer-link {
  @apply text-xs text-grey-600 whitespace-nowrap hover:text-grey-100;
}
</style>
