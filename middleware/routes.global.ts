// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default defineNuxtRouteMiddleware((to, from) => {
  if (to.path === "/") {
    return navigateTo("/proposals/active");
  }

  if (to.path === "/proposals") {
    return navigateTo("/proposals/active");
  }
});
