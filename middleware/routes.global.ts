export default defineNuxtRouteMiddleware((to, from) => {
  if (to.path === "/") {
    return navigateTo("/proposals/active");
  }

  if (to.path === "/lists") {
    return navigateTo("/lists/merchants");
  }

  // if (to.params.id === '1') {
  //   return abortNavigation()
  // }
});
