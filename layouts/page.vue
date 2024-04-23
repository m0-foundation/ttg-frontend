<template>
  <div>
    <header>
      <div
        class="w-full flex flex-wrap items-center justify-between mx-auto px-16 py-8"
      >
        <a href="/" class="flex items-center">
          <span
            class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
          >
            M&#94;ZERO <span class="text-sm text-gray-400">Governance</span>
          </span>
        </a>
      </div>
    </header>
    <!-- out content -->
    <div class="mx-auto w-full md:w-3/4 mb-20">
      <NuxtPage />
    </div>
    <LayoutAlerts />
    <LayoutFooter />
  </div>
</template>
