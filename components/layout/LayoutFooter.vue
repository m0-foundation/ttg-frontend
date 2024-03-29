<template>
  <footer class="w-full p-6 lg:px-16 font-inter">
    <div class="lg:flex items-center">
      <div class="lg:grow">
        <span class="text-xs text-grey-500">
          © 2024
          <a href="/" class="hover:underline"
            >M^0 FOUNDATION. All rights reserved.</a
          >
        </span>
      </div>
      <div class="lg:shrink">
        <ul
          class="flex gap-3 flex-wrap items-center lg:mt-0 text-xs text-white lg:hidden"
        >
          <li>
            <NuxtLink href="https://docs.m0.org/" target="_blank"
              >Documentation</NuxtLink
            >
          </li>
        </ul>
        <div class="flex justify-between align-center mt-4 lg:mt-0 lg:gap-6">
          <NuxtLink to="/settings" class="footer-link">App settings</NuxtLink>
          <div class="text-grey-700 text-xs hidden lg:block">|</div>
          <span class="text-grey-500 text-xs">Join our community</span>
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
    name: "X",
    url: "https://twitter.com/m0labs",
    icon: "/img/socials/x.svg",
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
  @apply text-xs underline text-grey-500 whitespace-nowrap hover:text-grey-100;
}
</style>
