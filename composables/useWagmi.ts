export const useWagmi = () => {
  const nuxtApp = useNuxtApp();
  const client = nuxtApp.$wagmiClient;

  return { client };
};
