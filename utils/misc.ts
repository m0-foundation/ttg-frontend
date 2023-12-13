export const copyToClipboard = (text: undefined | string) => {
  if (!text) return;
  if (navigator?.clipboard) {
    return navigator.clipboard.writeText(text);
  } else {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    return Promise.resolve();
  }
};
