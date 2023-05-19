export default defineNuxtRouteMiddleware((to, from) => {
  const hasRpc = localStorage.getItem("m0:rpc");
  console.log({ to, from });

  if (to.path === "/lists") {
    return navigateTo("/lists/merchants");
  }

  if (to.path === "/setup") {
    if (hasRpc) {
      return navigateTo("/setup/2");
    } else {
      return navigateTo("/setup/1");
    }
  }
});
