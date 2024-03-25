// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default defineNuxtRouteMiddleware((to, from) => {
  const apiStore = useApiClientStore();

  if (to.path !== "/settings" && apiStore.rpc === undefined) {
    return navigateTo("/settings");
  }

  if (to.path === "/") {
    return navigateTo("/proposals/");
  }

  if (to.path === "/config") {
    return navigateTo("/config/governance");
  }
});
