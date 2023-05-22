export default defineNuxtRouteMiddleware((to, from) => {
  console.log("routes.global");

  if (to.path === "/") {
    return navigateTo("/proposals/active");
  }
  if (to.path === "/lists") {
    return navigateTo("/lists/merchants");
  }

  if (to.path === "/setup") {
    return navigateTo("/setup/1");
  }
});
