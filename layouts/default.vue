<template>
  <div>
    <div class="flex">
      <aside class="w-64 fixed left-0 top-0 h-screen p-10">
        <LayoutSidebar />
      </aside>
      <main class="flex-1 ml-64 mr-10">
        <LayoutHeader />
        <NuxtPage />
      </main>
    </div>

    <LayoutFooter />
  </div>
</template>
