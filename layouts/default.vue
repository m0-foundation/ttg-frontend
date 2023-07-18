<template>
  <div>
    <div class="flex">
      <aside class="w-80 fixed left-0 top-0 h-screen p-10">
        <LayoutSidebar />
      </aside>
      <main class="flex-1 ml-80 mr-10 p-8">
        <NuxtPage />
      </main>
    </div>

    <LayoutFooter />
  </div>
</template>
