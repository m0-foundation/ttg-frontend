export const useTtg = () => {
  const nuxtApp = useNuxtApp();
  const client = nuxtApp.$ttgClient;

  return { client };
};
