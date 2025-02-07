<template>
  <div class="flex justify-center items-center h-[30px]">
    <img
      class="loader"
      src="~/assets/icons/ecosystem/square-black.svg"
      alt="logo"
    />
  </div>
</template>

<style scoped>
.loader {
  animation: moveCube 1s infinite linear;
}

@keyframes moveCube {
  0% {
    transform: translateY(-10px);
  }
  50% {
    transform: translateY(10px);
  }
  100% {
    transform: translateY(-10px);
  }
}
</style>
