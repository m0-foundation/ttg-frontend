export const useSpog = () => {
  const nuxtApp = useNuxtApp();
  const client = nuxtApp.$spogClient;

  return { client };
};
