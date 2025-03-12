// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default defineNuxtRouteMiddleware((to, from) => {
  const apiStore = useApiClientStore()
  const config = useRuntimeConfig()

  if (to.path !== '/settings' && apiStore.rpc === undefined) {
    return navigateTo('/settings')
  }

  if (to.path === '/actors/protocol') {
    return navigateTo('/actors')
  }

  if (config.public.auctionActive === true) {
    if (to.path === '/') {
      return navigateTo('/auction/')
    }
  } else {
    if (to.path === '/') {
      return navigateTo('/proposals/')
    }
  }
})
