export default defineNuxtRouteMiddleware((to) => {
  const rpc = localStorage.getItem("m0.rpc");
  console.log("middleware/auth", { rpc });

  if (!rpc) {
    return navigateTo("/setup/1");
  }
});
