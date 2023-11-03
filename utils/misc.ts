export const copyToClipboard = (text: undefined | string) => {
  if (!text) return;
  navigator?.clipboard?.writeText(text);
};
