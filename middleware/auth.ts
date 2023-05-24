export default defineNuxtRouteMiddleware((to) => {
  const rpc = localStorage.getItem("m0.rpc");
  const isWagmiConnected = localStorage.getItem("wagmi.connected");
  console.log("middleware/auth", { rpc, isWagmiConnected });

  if (!rpc) {
    return navigateTo("/setup/1");
  }

  if (!isWagmiConnected) {
    return navigateTo("/setup/2");
  }
});
