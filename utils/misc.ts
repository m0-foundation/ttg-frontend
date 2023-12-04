export const copyToClipboard = (text: undefined | string | number) => {
  if (!text) return;
  navigator?.clipboard?.writeText(text + "");
};
